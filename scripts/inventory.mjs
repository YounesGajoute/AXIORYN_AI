import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cleanText = buffer => buffer.toString('utf8').replace(/^\uFEFF/, '');
const hash = buffer => createHash('sha256').update(buffer).digest('hex');

function markdownSemantics(text) {
  const headings = [];
  const stateRevisions = [];
  const declaredStatus = [];
  let fence = null;
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const marker = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (fence === marker[1][0]) fence = null;
      continue;
    }
    if (!fence) {
      const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
      if (heading) headings.push({ line: index + 1, level: heading[1].length, title: heading[2] });
      if (/\b(?:status|disposition|phase|execution mode|authorization|implementation authorization)\b\s*[*:|]/i.test(line) && declaredStatus.length < 24) {
        declaredStatus.push({ line: index + 1, text: line.trim() });
      }
    }
    const revisions = [...line.matchAll(/\b(?:state[_\s-]*)?revision\s*[:=]?\s*(\d+)\b/gi)];
    for (const match of revisions) stateRevisions.push({ line: index + 1, revision: Number(match[1]), context: line.trim() });
  }
  return {
    headings,
    state_revision_references: stateRevisions,
    declared_status_references: declaredStatus,
    requirement_ids: [...new Set(text.match(/\b(?:R-\d{3}|SM-REQ-\d{3})\b/g) || [])].sort(),
    backlog_ids: [...new Set(text.match(/\bB-\d{3}\b/g) || [])].sort()
  };
}

function jsonSemantics(value) {
  if (Array.isArray(value)) return { root_type: 'array', root_keys: [], record_count: value.length };
  if (!value || typeof value !== 'object') return { root_type: value === null ? 'null' : typeof value, root_keys: [] };
  const summary = {};
  for (const key of ['state_revision', 'master_state_revision_seen', 'baseline_id', 'baseline_status', 'implementation_status', 'report_schema', 'task_id', 'report_id', 'branch', 'execution_scope', 'requested_status', 'governance_disposition', 'as_of_date']) {
    if (Object.hasOwn(value, key)) summary[key] = value[key];
  }
  const collectionCounts = {};
  for (const [key, entry] of Object.entries(value)) if (Array.isArray(entry)) collectionCounts[key] = entry.length;
  const decisions = {};
  for (const key of ['confirmed_decisions', 'proposed_decisions', 'review_decisions']) {
    if (!Array.isArray(value[key])) continue;
    decisions[key] = value[key].map(item => Object.fromEntries(
      ['id', 'decision_id', 'review_id', 'status', 'implementation_authorization', 'approval_date'].filter(field => Object.hasOwn(item, field)).map(field => [field, item[field]])
    ));
  }
  return { root_type: 'object', root_keys: Object.keys(value), summary, collection_counts: collectionCounts, decisions };
}

try {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Usage: npm run inventory\n\nReads original root Markdown/JSON documents listed in the historical MANIFEST.json, plus the manifest itself.\nWrites docs/source-inventory.json and docs/governance-analysis.md. Original files are never changed.');
  } else {
    if (process.argv.length > 2) throw new Error('This command takes no arguments. Use --help for usage.');
    const manifestBuffer = await readFile(path.join(root, 'MANIFEST.json'));
    const legacyManifest = JSON.parse(cleanText(manifestBuffer));
    if (!Array.isArray(legacyManifest)) throw new Error('Historical MANIFEST.json must contain an array.');

    const originalFiles = new Map();
    for (const entry of legacyManifest) {
      if (typeof entry?.file !== 'string') throw new Error('Historical manifest has an invalid file entry.');
      const filename = path.win32.basename(entry.file);
      if (!/\.(?:md|json)$/i.test(filename) || filename === 'package.json') continue;
      if (originalFiles.has(filename)) throw new Error(`Historical manifest lists a duplicate root file: ${filename}`);
      originalFiles.set(filename, entry);
    }
    originalFiles.set('MANIFEST.json', null);
    const records = [];
    const errors = [];
    for (const [filename, expected] of [...originalFiles].sort(([a], [b]) => a.localeCompare(b))) {
      try {
        const target = path.join(root, filename);
        const info = await lstat(target);
        if (!info.isFile() || info.isSymbolicLink()) throw new Error('Expected a regular original root file, not a symbolic link.');
        const buffer = filename === 'MANIFEST.json' ? manifestBuffer : await readFile(target);
        const text = cleanText(buffer);
        const record = { path: filename, size_bytes: buffer.length, sha256: hash(buffer), kind: /\.json$/i.test(filename) ? 'json' : 'markdown' };
        if (expected) {
          record.historical_manifest = {
            size_bytes: expected.size_bytes,
            sha256: String(expected.sha256 || '').toLowerCase(),
            matches_size: expected.size_bytes === buffer.length,
            matches_sha256: String(expected.sha256 || '').toLowerCase() === record.sha256
          };
        }
        if (record.kind === 'json') {
          try { record.semantics = jsonSemantics(JSON.parse(text)); } catch (error) {
            record.parse_error = error.message;
            errors.push(`${filename}: invalid JSON (${error.message})`);
          }
        } else record.semantics = markdownSemantics(text);
        records.push(record);
      } catch (error) { errors.push(`${filename}: ${error.message}`); }
    }

    const mismatches = records.filter(record => record.historical_manifest && (!record.historical_manifest.matches_sha256 || !record.historical_manifest.matches_size)).map(record => record.path);
    const inventory = {
      schema_version: '1.0',
      generated_at_utc: new Date().toISOString(),
      source_scope: 'Original root Markdown/JSON documents from historical MANIFEST.json, plus MANIFEST.json itself; generated application files and docs/ are excluded.',
      historical_manifest_self_exclusion: 'The original manifest excludes its own hash. This inventory hashes it because this report is written separately under docs/.',
      file_count: records.length,
      total_size_bytes: records.reduce((sum, record) => sum + record.size_bytes, 0),
      historical_manifest_mismatches: mismatches,
      errors,
      files: records
    };
    const stateRecord = records.find(record => record.path === 'AXIORYN_AI_MASTER_STATE_v1.0.json');
    const state = stateRecord?.semantics?.summary || {};
    const counts = stateRecord?.semantics?.collection_counts || {};
    const report = [
      '# Governance source analysis',
      '',
      `Generated from ${records.length} original root documents. The source inventory records exact byte sizes, SHA-256 hashes, Markdown headings, JSON root keys, state revisions and status references. Original documents were read without modification.`,
      '',
      '## Current authorization and historical records',
      '',
      'The owner now asks for deep analysis of every file and implementation of the full application. This authorizes local application development and verification. It supersedes initialization-era instructions to stop before coding for the current work. It does not retrospectively approve GOV-1.0, proposed requirements, numerical NFRs, historical agent reports or production releases.',
      '',
      'The request does not provide live model or CRM credentials, LinkedIn permissions, an outreach recipient list, hosting configuration or a production deployment instruction. Build a working local workspace with clear demonstration data, bounded workflows and disabled external effects until those capabilities are separately configured and authorized.',
      '',
      '## Evidence and status reconciliation',
      '',
      '| Source | Observed meaning | Application treatment |',
      '|---|---|---|',
      `| Master-state JSON | Revision ${state.state_revision ?? 'unknown'}; baseline ${state.baseline_status ?? 'unknown'}; implementation ${state.implementation_status ?? 'unknown'}; ${counts.requirements ?? 'unknown'} original requirements and ${counts.backlog ?? 'unknown'} backlog records. | Preserve as a historical governance snapshot. Do not use its stale implementation flag as current runtime state. |`,
      '| Original agent report | B-001 requested READY_FOR_REVIEW, describes six governance files at its reported commit, and calls Sales Manager proposed. | Historical findings remain attributable to their reported commit; they do not describe newly created application files. |',
      '| B-001 correction | Captures local/published Revision 2/3 differences and CHANGES_REQUIRED while recording accepted ADR-SM-001. | Do not claim this correction itself accepts B-001 or establishes current Git refs. |',
      '| Decision log and current master state | Record accepted ADR-SM-001 and B-001/B-002 documentation-only acceptance. | Preserve the accepted role boundary without treating documentation acceptance as implementation or release acceptance. |',
      '| Project status | Top section records B-001 acceptance; later section says B-001 not accepted and refers to Revision 2. | Explicit internal inconsistency. Keep the source intact and identify the dated/scope-specific evidence. |',
      '| Master-state proposed_decisions | Still lists ADR-SM-001 as proposed, while confirmed_decisions and review_decisions accept it. | Prefer the explicit owner decision for this role boundary; report stale duplicate proposal status. |',
      '| Architecture governance report | Documents a completed governance pass, no code, and pending implementation authorization. | Completion applies to that historical documentation task. It does not prove application implementation or production readiness. |',
      '| Coding prompt 001 and implementation prompt 002 | A read-only audit prompt and an unexecuted future skeleton-only prompt. | Reference their useful evidence/security requirements; current owner request sets the wider local app scope. |',
      '| Release checklist | Production release NOT READY; unsigned gates and unverified operational requirements. | Local app verification does not silently satisfy production sign-off, load, privacy, recovery or incident-response gates. |',
      '',
      '## Product and architecture implications',
      '',
      '- The charter confirms reusable AXIORYN AI Core and industrial B2B Sales Team as the first domain. Build account/contact lifecycle, lead intelligence, buying committees, competitors, outreach drafting, review, follow-up, campaigns and operational visibility.',
      '- Core owns one technical control plane: identity, roles, tenant scope, task lifecycle, tools, policy, approvals, quotas and audit. Sales Manager owns bounded commercial intent. Agent 01 is its leadership role; Agent 09 is a specialist. Neither owns a second runtime or direct connector bypass.',
      '- Distinguish operator-entered facts, evidence-backed facts, model inference and demonstration output. Empty or missing evidence must stay visibly unverified.',
      '- Approvals refer to exact content, recipients, channel, policy and expiry. Re-check authorization and suppression before any execution. Approval does not turn an unconfigured connector into a successful send.',
      '- Preserve original requirement and backlog identifiers in analysis and implementation evidence. New local code is not proof of owner acceptance of every historical proposal.',
      '',
      '## Cross-document contract conflicts',
      '',
      'The architecture traceability table drifts from the canonical R-001–R-026 descriptions in MASTER_REQUIREMENTS.md and master-state JSON, especially later identifiers. Resolve the mapping against the actual requirement text: R-021 covers replaceable model adapters/versioned prompts; R-022 measurable NFR guardrails; R-023 distinction between human decisions, model outputs and evidence; R-024 validated authorized import/export; R-025 retention and residency; R-026 versioned API/database migration and recovery. Do not cite approval tests alone as proof of R-021 or commercial strategy alone as proof of R-023/R-024.',
      '',
      'ADR-001–ADR-007 topics also vary between older documents and the later architecture proposal package. Identify each by its source and title rather than assuming a reused number means the same decision. ADR-SM-001 remains the consistently explicit accepted Sales Manager boundary.',
      '',
      'The decision-readiness registry has cycles D-001 ↔ D-002, D-004 ↔ D-006 and D-005 ↔ D-009. Treat each related policy group together. These proposal dependencies do not prevent reversible local development with documented defaults.',
      '',
      '## Manifest and provenance',
      '',
      `The historical MANIFEST.json lists ${legacyManifest.length} entries and excludes itself to avoid recursive hashing. It stores absolute Windows paths from its original environment. This inventory resolves each listed basename inside the current project root and does not follow stored absolute paths or symbolic links. It excludes newly created application files, package metadata, README files and generated docs.`,
      '',
      mismatches.length ? `Historical hash/size differences were detected in: ${mismatches.join(', ')}. These differences are reported without rewriting the historical manifest.` : 'All inventoried entries match the historical manifest sizes and hashes. The manifest itself is hashed only in this separate report.',
      '',
      'A matching hash proves byte identity with that manifest entry, not author approval, runtime correctness or production readiness. Historical Git references in documents are source claims; this inventory does not refresh remote refs, commit, switch branches, push or perform external actions.',
      '',
      '## Evidence needed for delivery',
      '',
      'Record changed files, reproducible local checks, actual test outcomes, application walkthrough results, backup/restore evidence and limitations. Keep failed or not-run checks visible. Protect backup files as sensitive workspace data. Do not mark historical requirements ACCEPTED, claim enterprise isolation, or claim deployment without corresponding evidence and owner decision.',
      '',
      'Related analysis: [architecture contracts](architecture-analysis.md), [requirements and feature scope](requirements-analysis.md), [exact source inventory](source-inventory.json).',
      '',
      errors.length ? `Inventory errors: ${errors.join('; ')}` : 'Inventory parsing completed without errors.',
      ''
    ].join('\n');
    await mkdir(path.join(root, 'docs'), { recursive: true });
    await writeFile(path.join(root, 'docs', 'source-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
    await writeFile(path.join(root, 'docs', 'governance-analysis.md'), report, 'utf8');
    console.log(`Inventoried ${records.length} original documents. Wrote docs/source-inventory.json and docs/governance-analysis.md. Historical mismatches: ${mismatches.length}; errors: ${errors.length}.`);
    if (errors.length) process.exitCode = 1;
  }
} catch (error) {
  console.error(`Inventory failed: ${error.message}`);
  process.exitCode = 1;
}
