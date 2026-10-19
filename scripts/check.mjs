import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const ignored = new Set(['node_modules', '.git', 'data', 'backups']);
const inspectedFiles = new Map();

async function requireFile(relative) {
  const normalized = path.normalize(relative);
  if (inspectedFiles.has(normalized)) return inspectedFiles.get(normalized);
  try {
    if (!(await stat(path.join(root, normalized))).isFile()) throw new Error('not a file');
    inspectedFiles.set(normalized, true);
    return true;
  } catch {
    failures.push(`Required file is missing: ${normalized}`);
    inspectedFiles.set(normalized, false);
    return false;
  }
}

async function collect(relative) {
  let entries;
  try {
    entries = await readdir(path.join(root, relative), { withFileTypes: true });
  } catch (error) {
    failures.push(`Cannot inspect ${relative}: ${error.code || error.message}`);
    return [];
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (ignored.has(entry.name) || entry.isSymbolicLink()) continue;
    const target = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await collect(target));
    else if (entry.isFile() && /\.(?:mjs|js)$/i.test(entry.name)) files.push(target);
  }
  return files;
}

try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 24 || (major === 24 && minor < 3)) failures.push('Node.js 24.3.0 or newer is required.');

  let metadata;
  try {
    metadata = JSON.parse((await readFile(path.join(root, 'package.json'), 'utf8')).replace(/^\uFEFF/, ''));
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) throw new Error('expected an object');
  } catch (error) {
    failures.push(`Cannot read package.json: ${error.message}`);
  }
  if (metadata) {
    for (const key of ['name', 'version', 'description']) {
      if (typeof metadata[key] !== 'string' || !metadata[key].trim()) failures.push(`package.json needs ${key}.`);
    }
    if (!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(metadata.version || '')) failures.push('package.json version must be a semantic version.');
    if (metadata.private !== true) failures.push('package.json must declare private: true.');
    if (metadata.type !== 'module') failures.push('package.json must declare type: module.');
    const declaredEngine = /^>=(\d+)\.(\d+)\.(\d+)$/.exec(metadata.engines?.node || '');
    if (!declaredEngine || Number(declaredEngine[1]) < 24 || (Number(declaredEngine[1]) === 24 && Number(declaredEngine[2]) < 3)) {
      failures.push('package.json must declare a Node.js minimum of at least 24.3.0.');
    }
    for (const script of ['start', 'dev', 'check', 'test', 'backup', 'inventory']) {
      if (typeof metadata.scripts?.[script] !== 'string' || !metadata.scripts[script].trim()) failures.push(`package.json needs the ${script} script.`);
    }
  }

  for (const file of ['public/index.html', 'public/styles.css', 'public/app.js', 'public/favicon.svg', 'server/start.mjs', 'scripts/check.mjs', 'scripts/backup.mjs', 'scripts/inventory.mjs']) {
    await requireFile(file);
  }

  if (await requireFile('public/index.html')) {
    const html = await readFile(path.join(root, 'public/index.html'), 'utf8');
    if (!/<html\b[^>]*\blang\s*=/i.test(html)) failures.push('public/index.html needs a document language.');
    if (!/<meta\b[^>]*\bname\s*=\s*["']viewport["']/i.test(html)) failures.push('public/index.html needs a viewport declaration.');
    if (!/<title>[^<]+<\/title>/i.test(html)) failures.push('public/index.html needs a title.');
    for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["']([^"']+)["']/gi)) {
      const reference = match[1].split(/[?#]/, 1)[0];
      if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
      let decoded;
      try { decoded = decodeURIComponent(reference); } catch { failures.push(`Invalid asset URL: ${reference}`); continue; }
      const resolved = path.resolve(root, 'public', decoded.replace(/^\/+/, ''));
      const publicRoot = path.join(root, 'public');
      const relative = path.relative(publicRoot, resolved);
      if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) failures.push(`Asset escapes public/: ${reference}`);
      else await requireFile(path.relative(root, resolved));
    }
  }

  const files = [];
  for (const folder of ['server', 'public', 'scripts', 'tests']) files.push(...await collect(folder));
  let checked = 0;
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { cwd: root, encoding: 'utf8', shell: false, timeout: 30_000, windowsHide: true });
    if (result.error || result.status !== 0) {
      failures.push(`Syntax failed: ${file}\n${(result.stderr || result.error?.message || `Exit ${result.status}`).trim()}`);
    } else checked++;
  }
  if (failures.length) {
    console.error(`Check failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n${failures.map(item => `- ${item}`).join('\n')}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: package metadata, required public assets and syntax of ${checked} JavaScript files. Application tests are run separately with npm test.`);
  }
} catch (error) {
  console.error(`Check failed: ${error.message}`);
  process.exitCode = 1;
}
