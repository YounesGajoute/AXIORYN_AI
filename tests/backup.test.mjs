import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

test('SQLite backup includes open WAL data and refuses destructive destinations', () => {
  const tempRoot = realpathSync(tmpdir());
  const folder = mkdtempSync(path.join(tempRoot, 'axioryn-backup-test-'));
  const verifiedFolder = realpathSync(folder);
  const relative = path.relative(tempRoot, verifiedFolder);
  assert.ok(relative && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
  assert.ok(path.basename(verifiedFolder).startsWith('axioryn-backup-test-'));

  const source = path.join(verifiedFolder, 'source.db');
  const destination = path.join(verifiedFolder, 'snapshot.db');
  const script = fileURLToPath(new URL('../scripts/backup.mjs', import.meta.url));
  let writer;
  try {
    writer = new DatabaseSync(source);
    writer.exec('PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; CREATE TABLE sample (id INTEGER PRIMARY KEY, value TEXT); BEGIN;');
    const insert = writer.prepare('INSERT INTO sample(value) VALUES (?)');
    for (let index = 0; index < 500; index++) insert.run(`row-${index}`);
    writer.exec('COMMIT');
    assert.ok(existsSync(`${source}-wal`), 'The fixture must retain an open, uncheckpointed WAL.');
    assert.equal(writer.prepare('SELECT count(*) AS count FROM sample').get().count, 500);

    const run = (input, output) => {
      const child = spawnSync(process.execPath, [script, output], {
        env: { ...process.env, AXIORYN_DB: input },
        encoding: 'utf8',
        shell: false,
        windowsHide: true,
        timeout: 15_000
      });
      assert.ifError(child.error);
      return child;
    };
    const valid = run(source, destination);
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /Backup verified:/);
    const snapshot = new DatabaseSync(destination, { readOnly: true });
    try {
      assert.equal(snapshot.prepare('SELECT count(*) AS count FROM sample').get().count, 500);
      assert.equal(snapshot.prepare('SELECT value FROM sample WHERE id = 500').get().value, 'row-499');
      assert.equal(Object.values(snapshot.prepare('PRAGMA quick_check').get())[0], 'ok');
    } finally { snapshot.close(); }

    insert.run('after-backup');
    const snapshotBytes = readFileSync(destination);
    const overwrite = run(source, destination);
    assert.equal(overwrite.status, 1);
    assert.match(overwrite.stderr, /Refusing to overwrite/);
    assert.deepEqual(readFileSync(destination), snapshotBytes, 'A refused overwrite must preserve the backup bytes.');

    const sourceBytes = readFileSync(source);
    const sourceWalBytes = readFileSync(`${source}-wal`);
    const samePath = run(source, source);
    assert.equal(samePath.status, 1);
    assert.match(samePath.stderr, /must differ|resolves to the source/);
    assert.deepEqual(readFileSync(source), sourceBytes, 'A same-path request must preserve the source database.');
    assert.deepEqual(readFileSync(`${source}-wal`), sourceWalBytes, 'A same-path request must preserve its WAL.');
    assert.equal(writer.prepare('SELECT count(*) AS count FROM sample').get().count, 501);

    const missing = path.join(verifiedFolder, 'missing.db');
    const missingOutput = path.join(verifiedFolder, 'missing-output.db');
    const absent = run(missing, missingOutput);
    assert.equal(absent.status, 1);
    assert.match(absent.stderr, /Source database does not exist/);
    assert.equal(existsSync(missing), false, 'The backup command must not create a missing source.');
    assert.equal(existsSync(missingOutput), false, 'A missing source must not create a backup destination.');
  } finally {
    writer?.close();
    // Only unlink files directly inside this verified, uniquely generated directory.
    assert.equal(realpathSync(verifiedFolder), verifiedFolder);
    for (const name of readdirSync(verifiedFolder)) {
      const target = path.join(verifiedFolder, name);
      assert.equal(path.dirname(target), verifiedFolder);
      assert.ok(lstatSync(target).isFile(), 'Cleanup refuses directories and symbolic links.');
      unlinkSync(target);
    }
    rmdirSync(verifiedFolder);
  }
});
