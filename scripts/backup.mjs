import { mkdir, open, realpath, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync, backup } from 'node:sqlite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: npm run backup -- [destination.db]\n\nCreates a consistent SQLite online backup without stopping the app.\nSource: AXIORYN_DB or data/axioryn.db. Destination defaults to backups/axioryn-TIMESTAMP.db.\nRelative paths are resolved from the project directory. Existing destinations are never overwritten.\nBackups contain workspace data and credentials: protect them as carefully as the source database.');
} else {
  let database;
  let reserved;
  let destination;
  let completed = false;
  try {
    if (args.length > 1 || args.some(arg => arg.startsWith('-'))) throw new Error('Use one optional destination path, or --help.');
    if (typeof backup !== 'function') throw new Error('The SQLite online backup API is unavailable. Use Node.js 24.3.0 or newer.');
    const source = path.resolve(root, process.env.AXIORYN_DB || path.join('data', 'axioryn.db'));
    let sourceInfo;
    try { sourceInfo = await stat(source); } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`Source database does not exist: ${source}`);
      throw error;
    }
    if (!sourceInfo.isFile()) throw new Error('Source database must be a regular file.');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    destination = path.resolve(root, args[0] || path.join('backups', `axioryn-${stamp}.db`));
    if (destination === source) throw new Error('Backup destination must differ from the source database.');
    try {
      const existing = await stat(destination);
      if ((existing.dev === sourceInfo.dev && existing.ino === sourceInfo.ino) || await realpath(destination) === await realpath(source)) {
        throw new Error('Backup destination resolves to the source database.');
      }
      throw new Error(`Refusing to overwrite an existing destination: ${destination}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await mkdir(path.dirname(destination), { recursive: true });
    const handle = await open(destination, 'wx', 0o600);
    try { reserved = await handle.stat(); } finally { await handle.close(); }

    database = new DatabaseSync(source, { readOnly: true });
    await backup(database, destination);
    database.close();
    database = undefined;
    const verification = new DatabaseSync(destination, { readOnly: true });
    try {
      const rows = verification.prepare('PRAGMA quick_check').all();
      if (rows.length !== 1 || Object.values(rows[0])[0] !== 'ok') throw new Error('Backup integrity verification failed.');
    } finally { verification.close(); }
    completed = true;
    console.log(`Backup verified: ${destination} (${(await stat(destination)).size} bytes).`);
  } catch (error) {
    console.error(`Backup failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (database) database.close();
    if (!completed && reserved && destination) {
      try {
        const current = await stat(destination);
        if (current.dev === reserved.dev && current.ino === reserved.ino) await unlink(destination);
      } catch { /* Keep the original failure; never remove a file that was not reserved by this run. */ }
    }
  }
}
