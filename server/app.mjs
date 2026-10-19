import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ModuleRegistry } from './core.mjs';
import { SALES_MANIFEST, seedSalesRecords, executeSalesAgent } from './sales.mjs';
import { createAIProvider, ProviderError } from './providers.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COLLECTIONS = ['accounts', 'contacts', 'opportunities', 'campaigns', 'intelligence', 'followups', 'knowledge', 'content', 'meetings', 'proposals'];
const MUTATORS = ['owner', 'operator'];
const CHANNELS = ['email', 'linkedin'];
const STAGES = ['discovery', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const hash = value => createHash('sha256').update(value).digest('hex');
const id = () => randomUUID();
const AUTH_CONTEXT = Symbol('authenticated-request-context');

class ApiError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}
function fail(status, code, message) { throw new ApiError(status, code, message); }
function object(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'INVALID_BODY', 'A JSON object is required.');
  return value;
}
function fields(value, allowed) {
  object(value);
  const unknown = Object.keys(value).filter(key => !allowed.includes(key));
  if (unknown.length) fail(400, 'UNKNOWN_FIELD', `Unsupported field: ${unknown[0]}.`);
}
function str(value, name, { required = false, max = 5000 } = {}) {
  if (value == null && !required) return '';
  if (typeof value !== 'string') fail(400, 'INVALID_FIELD', `${name} must be text.`);
  const result = value.trim();
  if ((required && !result) || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) fail(400, 'INVALID_FIELD', `${name} is required and must be at most ${max} characters.`);
  return result;
}
function email(value, required = true) {
  const result = str(value, 'Email', { required, max: 254 }).toLowerCase();
  if (result && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) fail(400, 'INVALID_EMAIL', 'Enter a valid email address.');
  return result;
}
function enumeration(value, options, name, fallback) {
  const result = value ?? fallback;
  if (!options.includes(result)) fail(400, 'INVALID_FIELD', `${name} must be one of: ${options.join(', ')}.`);
  return result;
}
function number(value, name, min = 0, max = 1e12, fallback = 0) {
  const result = value ?? fallback;
  if (typeof result !== 'number' || !Number.isFinite(result) || result < min || result > max) fail(400, 'INVALID_FIELD', `${name} must be between ${min} and ${max}.`);
  return result;
}
function bool(value, name, fallback = false) {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') fail(400, 'INVALID_FIELD', `${name} must be true or false.`);
  return value;
}
function webUrl(value, name) {
  const result = str(value, name, { max: 2048 });
  if (result) {
    let parsed;
    try { parsed = new URL(result); } catch { fail(400, 'INVALID_URL', `${name} must be an http or https URL.`); }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) fail(400, 'INVALID_URL', `${name} must be an http or https URL without credentials.`);
  }
  return result;
}
function date(value, name, fallback = '') {
  const result = value == null ? fallback : str(value, name, { max: 64 });
  if (result && !Number.isFinite(Date.parse(result))) fail(400, 'INVALID_DATE', `${name} must be a valid date.`);
  return result ? new Date(result).toISOString() : '';
}
function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) fail(400, 'WEAK_PASSWORD', 'Use a password with 12 to 256 characters.');
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
function verifyPassword(password, encoded) {
  if (typeof password !== 'string' || password.length > 256) return false;
  const [salt, digest] = encoded.split(':');
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
function publicUser(row) { return { id: row.id, name: row.name, email: row.email, role: row.role, orgId: row.org_id, disabled: Boolean(row.disabled) }; }

/** A dependency-free local app. All provider integrations deliberately remain disconnected. */
export function createApp(options = {}) {
  const registry = new ModuleRegistry();
  registry.register(SALES_MANIFEST);
  const aiProvider = createAIProvider({env:options.aiEnv??process.env,fetchImpl:options.aiFetch??globalThis.fetch,timeoutMs:options.aiTimeoutMs??30000});
  const activeAIRequests = new Map();
  const dbPath = options.dbPath ?? process.env.AXIORYN_DB ?? resolve(ROOT, 'data', 'axioryn.db');
  if (dbPath !== ':memory:') mkdirSync(dirname(resolve(dbPath)), { recursive: true });
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
  const schemaVersion = db.prepare('PRAGMA user_version').get().user_version;
  if (schemaVersion > 1) { db.close(); throw new Error('Database schema is newer than this app supports.'); }
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, org_id TEXT NOT NULL REFERENCES organizations(id), name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, role TEXT NOT NULL CHECK(role IN ('owner','operator','reviewer')), password_hash TEXT NOT NULL, disabled INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, csrf TEXT NOT NULL, expires_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS records (collection TEXT NOT NULL, id TEXT NOT NULL, org_id TEXT NOT NULL REFERENCES organizations(id), data TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(collection,id));
    CREATE INDEX IF NOT EXISTS records_tenant_collection ON records(org_id,collection);
    CREATE TABLE IF NOT EXISTS configs (org_id TEXT NOT NULL REFERENCES organizations(id), kind TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(org_id,kind));
    PRAGMA user_version = 1;
  `);
  const clock = options.clock ?? (() => new Date());
  const now = () => new Date(clock()).toISOString();
  const publicDir = resolve(options.publicDir ?? resolve(ROOT, 'public'));
  const loginAttempts = new Map();
  const sessionMs = 12 * 60 * 60 * 1000;
  function transaction(fn) {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  function list(collection, orgId) { return db.prepare('SELECT data FROM records WHERE collection = ? AND org_id = ? ORDER BY created_at DESC, id').all(collection, orgId).map(row => JSON.parse(row.data)); }
  function get(collection, recordId, orgId, required = true) {
    const row = db.prepare('SELECT data FROM records WHERE collection = ? AND id = ? AND org_id = ?').get(collection, recordId, orgId);
    if (!row && required) fail(404, 'NOT_FOUND', 'Record not found in your organization.');
    return row ? JSON.parse(row.data) : null;
  }
  function put(collection, orgId, data, recordId = data.id ?? id()) {
    const old = get(collection, recordId, orgId, false);
    const result = { ...data, id: recordId, createdAt: old?.createdAt ?? now(), updatedAt: now() };
    db.prepare('INSERT INTO records(collection,id,org_id,data,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(collection,id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at WHERE records.org_id = excluded.org_id').run(collection, recordId, orgId, JSON.stringify(result), result.createdAt, result.updatedAt);
    return result;
  }
  function config(orgId, kind) { const row = db.prepare('SELECT data FROM configs WHERE org_id = ? AND kind = ?').get(orgId, kind); return row ? JSON.parse(row.data) : {}; }
  function putConfig(orgId, kind, data) { db.prepare('INSERT INTO configs(org_id,kind,data) VALUES (?,?,?) ON CONFLICT(org_id,kind) DO UPDATE SET data=excluded.data').run(orgId, kind, JSON.stringify(data)); return data; }
  function audit(ctx, action, target, metadata = {}) {
    return put('audit', ctx.user.orgId, { action, target: String(target), actor: ctx.user.name, actorId: ctx.user.id, traceId: ctx.traceId, metadata });
  }
  function requireRole(ctx, roles = MUTATORS) { if (!roles.includes(ctx.user.role)) fail(403, 'FORBIDDEN', 'Your role does not permit this action.'); }
  function reference(collection, value, orgId, { optional = false } = {}) {
    const result = str(value, `${collection} reference`, { required: !optional, max: 100 });
    if (result) get(collection, result, orgId);
    return result;
  }
  function validateRecord(collection, input, orgId, old = null) {
    const allowed = {
      accounts: ['name','industry','country','website','status','score','source','notes'],
      contacts: ['accountId','name','title','email','role','confidence','suppressed','source'],
      opportunities: ['accountId','name','stage','value','notes'],
      campaigns: ['name','objective','audience','channel','budget','status','draftId','notes'],
      intelligence: ['title','kind','summary','sourceUrl','confidence','observedAt'],
      followups: ['contactId','draftId','dueAt','status','notes'],
      knowledge: ['title','kind','summary','sourceUrl','verified'],
      content: ['title','audience','productFamily','body','evidence','visualBrief','callToAction','language','status','scheduledAt'],
      meetings: ['accountId','contactId','title','scheduledAt','status','notes'],
      proposals: ['accountId','opportunityId','title','scope','value','status','notes'],
    }[collection];
    fields(input, allowed);
    const merged = { ...(old ?? {}), ...input };
    let result;
    if (collection === 'accounts') result = {
      name: str(merged.name, 'Company name', { required: true, max: 200 }), industry: str(merged.industry, 'Industry', { max: 200 }), country: str(merged.country, 'Country', { max: 100 }),
      website: webUrl(merged.website, 'Website'), status: enumeration(merged.status, ['new','research','qualified','contacted','active','proposal','negotiation','won','lost','customer','archived'], 'Account status', 'research'),
      score: number(merged.score, 'Score', 0, 100), source: str(merged.source, 'Source', { max: 1000 }) || 'manual', notes: str(merged.notes, 'Notes'),
    };
    if (collection === 'contacts') result = {
      accountId: reference('accounts', merged.accountId, orgId), name: str(merged.name, 'Contact name', { required: true, max: 200 }), title: str(merged.title, 'Title', { max: 200 }),
      email: email(merged.email), role: str(merged.role, 'Buying role', { max: 200 }), confidence: number(merged.confidence, 'Confidence', 0, 100), suppressed: bool(merged.suppressed, 'Suppressed'), source: str(merged.source,'Source',{max:1000})||'manual',
    };
    if (collection === 'opportunities') result = {
      accountId: reference('accounts', merged.accountId, orgId), name: str(merged.name, 'Opportunity name', { required: true, max: 200 }), stage: enumeration(merged.stage, STAGES, 'Stage', 'discovery'), value: number(merged.value, 'Value'), notes: str(merged.notes,'Notes'),
    };
    if (collection === 'campaigns') result = {
      name: str(merged.name, 'Campaign name', { required: true, max: 200 }), objective: str(merged.objective, 'Objective'), audience: str(merged.audience, 'Audience'), channel: enumeration(merged.channel, CHANNELS, 'Channel', 'email'),
      budget: number(merged.budget, 'Budget'), status: enumeration(merged.status, ['draft','approved','paused'], 'Campaign status', 'draft'), draftId: reference('drafts', merged.draftId, orgId, { optional: true }), notes: str(merged.notes,'Notes'),
    };
    if (collection === 'intelligence') result = {
      title: str(merged.title, 'Title', { required: true, max: 200 }), kind: enumeration(merged.kind, ['market','competitor','company','signal','research'], 'Intelligence kind', 'research'), summary: str(merged.summary, 'Summary'),
      sourceUrl: webUrl(merged.sourceUrl, 'Source URL'), confidence: number(merged.confidence, 'Confidence', 0, 100), observedAt: date(merged.observedAt, 'Observed at', now()),
    };
    if (collection === 'followups') {
      result = { contactId: reference('contacts', merged.contactId, orgId), draftId: reference('drafts', merged.draftId, orgId, { optional: true }), dueAt: date(merged.dueAt, 'Due date', now()), status: enumeration(merged.status, ['planned','completed','cancelled'], 'Follow-up status', 'planned'), notes: str(merged.notes, 'Notes') };
      if (result.draftId && get('drafts', result.draftId, orgId).contactId !== result.contactId) fail(400, 'REFERENCE_MISMATCH', 'The draft and follow-up must have the same contact.');
    }
    if (collection === 'knowledge') result = { title:str(merged.title,'Title',{required:true,max:200}),kind:enumeration(merged.kind,['product','brand','guideline'],'Knowledge kind','product'),summary:str(merged.summary,'Summary'),sourceUrl:webUrl(merged.sourceUrl,'Source URL'),verified:bool(merged.verified,'Verified') };
    if (collection === 'content') result = { title:str(merged.title,'Title',{required:true,max:200}),audience:str(merged.audience,'Audience'),productFamily:str(merged.productFamily,'Product family',{max:200}),body:str(merged.body,'Content body',{max:20000}),evidence:str(merged.evidence,'Evidence'),visualBrief:str(merged.visualBrief,'Visual brief'),callToAction:str(merged.callToAction,'Call to action',{max:1000}),language:str(merged.language,'Language',{max:100})||'English',status:enumeration(merged.status,['draft','reviewed'],'Content status','draft'),scheduledAt:date(merged.scheduledAt,'Planned date') };
    if (collection === 'meetings') {
      result = {accountId:reference('accounts',merged.accountId,orgId),contactId:reference('contacts',merged.contactId,orgId,{optional:true}),title:str(merged.title,'Meeting title',{required:true,max:200}),scheduledAt:date(merged.scheduledAt,'Meeting date'),status:enumeration(merged.status,['planned','completed','cancelled'],'Meeting status','planned'),notes:str(merged.notes,'Notes')};
      if (!result.scheduledAt) fail(400,'INVALID_DATE','A meeting date is required.');
      if (result.contactId&&get('contacts',result.contactId,orgId).accountId!==result.accountId) fail(400,'REFERENCE_MISMATCH','The meeting contact must belong to its account.');
    }
    if (collection === 'proposals') {
      result = {accountId:reference('accounts',merged.accountId,orgId),opportunityId:reference('opportunities',merged.opportunityId,orgId,{optional:true}),title:str(merged.title,'Proposal title',{required:true,max:200}),scope:str(merged.scope,'Scope'),value:number(merged.value,'Value'),status:enumeration(merged.status,['draft','reviewed','accepted','declined'],'Proposal status','draft'),notes:str(merged.notes,'Notes')};
      if (result.opportunityId&&get('opportunities',result.opportunityId,orgId).accountId!==result.accountId) fail(400,'REFERENCE_MISMATCH','The proposal opportunity must belong to its account.');
    }
    if (old&&collection==='campaigns'&&old.status==='approved'&&input.status!=='approved'&&Object.keys(input).some(key=>key!=='status')) result.status='draft';
    if (old&&collection==='knowledge'&&old.verified&&input.verified!==true&&Object.keys(input).some(key=>key!=='verified')) result.verified=false;
    if (old&&['content','proposals'].includes(collection)&&['reviewed','accepted'].includes(old.status)&&!['reviewed','accepted'].includes(input.status)&&Object.keys(input).some(key=>key!=='status')) result.status='draft';
    if (collection === 'contacts' && list('contacts', orgId).some(record => record.id !== old?.id && record.email === result.email)) fail(409, 'DUPLICATE', 'A contact with this email already exists.');
    if (collection === 'accounts' && list('accounts', orgId).some(record => record.id !== old?.id && record.name.toLowerCase() === result.name.toLowerCase())) fail(409, 'DUPLICATE', 'An account with this name already exists.');
    if (collection === 'campaigns') {
      const total = list('campaigns', orgId).filter(record => record.id !== old?.id && record.status !== 'paused').reduce((sum, record) => sum + record.budget, 0) + (result.status !== 'paused' ? result.budget : 0);
      if (total > config(orgId, 'settings').budgetLimit) fail(409, 'BUDGET_EXCEEDED', 'This campaign exceeds your total planning budget limit.');
      if (result.status === 'approved') {
        if (!result.draftId) fail(409, 'APPROVAL_REQUIRED', 'An approved campaign needs a linked draft with valid approval.');
        validApproval(get('drafts', result.draftId, orgId), orgId);
      }
    }
    const inheritedSynthetic = result.accountId ? Boolean(get('accounts',result.accountId,orgId).synthetic) : result.contactId ? Boolean(get('contacts',result.contactId,orgId).synthetic) : result.draftId ? Boolean(get('drafts',result.draftId,orgId).synthetic) : false;
    return { ...result, synthetic: Boolean(old?.synthetic || inheritedSynthetic) };
  }
  function createSession(user, res) {
    const token = randomBytes(32).toString('base64url');
    const csrfToken = randomBytes(32).toString('base64url');
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
    db.prepare('INSERT INTO sessions VALUES (?,?,?,?)').run(hash(token), user.id, csrfToken, new Date(new Date(now()).getTime() + sessionMs).toISOString());
    res.setHeader('Set-Cookie', `axioryn_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionMs / 1000}`);
    return { user, csrfToken };
  }
  function auth(req) {
    const token = req.headers.cookie?.split(';').map(item => item.trim()).find(item => item.startsWith('axioryn_session='))?.slice('axioryn_session='.length);
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const session = db.prepare('SELECT sessions.*, users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ? AND disabled = 0').get(hash(token), now());
    return session ? { user: publicUser(session), csrfToken: session.csrf, tokenHash: hash(token) } : null;
  }
  function draftDigest(draft, contact) {
    return hash(JSON.stringify({ accountId: draft.accountId, contactId: draft.contactId, recipient: contact.email, channel: draft.channel, subject: draft.subject, body: draft.body, revision: draft.revision }));
  }
  function deliveryDigest(draft, contact) {
    return hash(JSON.stringify({ recipient: contact.email, channel: draft.channel, subject: draft.subject, body: draft.body }));
  }
  function invalidateApprovals(orgId, draftId, reason = 'Draft content or recipient changed.') {
    for (const approval of list('approvals', orgId).filter(item => item.draftId === draftId && ['pending','approved'].includes(item.status))) put('approvals', orgId, { ...approval, status: 'invalidated', invalidatedReason: reason, invalidatedAt: now() });
    for (const campaign of list('campaigns', orgId).filter(item => item.draftId === draftId && item.status === 'approved')) put('campaigns', orgId, { ...campaign, status: 'draft' });
  }
  function validApproval(draft, orgId) {
    const contact = get('contacts', draft.contactId, orgId);
    const digest = draftDigest(draft, contact);
    const approval = list('approvals', orgId).find(item => item.draftId === draft.id && item.status === 'approved' && item.digest === digest && item.recipient === contact.email && item.channel === draft.channel && item.expiresAt > now());
    if (!approval) fail(409, 'APPROVAL_REQUIRED', 'A current human approval for this exact content, recipient and channel is required.');
    return approval;
  }
  function authorizedAgent(orgId,agentId,tool) {
    const stored = get('agents',agentId,orgId);
    try { const definition = registry.assertAllowed({moduleId:'sales',agentCode:stored.code,tool,actorOrgId:orgId,targetOrgId:orgId});return {...stored,...definition,id:stored.id}; } catch(error) { fail(403,error.code??'CAPABILITY_DENIED',error.message); }
  }
  function stats(orgId) {
    const accounts = list('accounts', orgId), contacts = list('contacts', orgId), opportunities = list('opportunities', orgId), tasks = list('tasks', orgId), approvals = list('approvals', orgId), campaigns = list('campaigns', orgId), aiRequests=list('aiRequests',orgId);
    const inputUsage=aiRequests.map(request=>request.usage?.inputTokens).filter(value=>Number.isFinite(value)),outputUsage=aiRequests.map(request=>request.usage?.outputTokens).filter(value=>Number.isFinite(value));
    return { accounts: accounts.length, contacts: contacts.length, qualifiedLeads: accounts.filter(item => item.score >= 70 && item.status !== 'archived').length, pipelineValue: opportunities.filter(item => !['won','lost'].includes(item.stage)).reduce((sum, item) => sum + item.value, 0), wonValue: opportunities.filter(item => item.stage === 'won').reduce((sum, item) => sum + item.value, 0), opportunities: opportunities.length, pendingApprovals: approvals.filter(item => item.status === 'pending' && item.expiresAt > now()).length, activeTasks: tasks.filter(item => ['queued','running'].includes(item.status)).length, completedTasks: tasks.filter(item => item.status === 'succeeded').length, totalTasks: tasks.length, simulations: list('simulations', orgId).length, campaignBudget: campaigns.filter(item => item.status !== 'paused').reduce((sum, item) => sum + item.budget, 0), actualSpend: aiProvider.describe().enabled||aiRequests.length?null:0, aiRequests:aiRequests.length,aiInputTokens:inputUsage.length?inputUsage.reduce((sum,value)=>sum+value,0):null,aiOutputTokens:outputUsage.length?outputUsage.reduce((sum,value)=>sum+value,0):null,aiUsageIncomplete:aiRequests.some(request=>!request.usage||request.usage.inputTokens===null||request.usage.outputTokens===null),liveSends: 0, suppressedContacts: contacts.filter(item => item.suppressed).length, source: 'local database', measuredAt: now() };
  }
  function aiProviderInfo(orgId) {
    const today=now().slice(0,10);
    return {...aiProvider.describe(),usageToday:list('aiRequests',orgId).filter(request=>request.day===today).length};
  }
  function prepareAIRequest(task,orgId) {
    const agent=authorizedAgent(orgId,task.agentId,'local-read');
    const account=task.accountId?get('accounts',task.accountId,orgId):null;
    return aiProvider.prepare({agentRole:agent.name,taskTitle:task.title,brief:task.input,account,knowledge:list('knowledge',orgId)});
  }
  function seed(orgId) {
    putConfig(orgId, 'settings', { killSwitch: false, budgetLimit: 25000, quietHoursStart: '21:00', quietHoursEnd: '08:00', timezone: 'Africa/Casablanca', dailyContactLimit: 1, dailyAccountLimit:1, approvalExpiryHours: 24, mode: 'local-simulation', externalExecutionEnabled: false });
    putConfig(orgId, 'strategy', { objective: 'Build a qualified industrial sales pipeline from evidence-backed accounts.', industry: 'Industrial automation', geography: 'Morocco and Europe', budget: 25000, notes: 'Starter strategy. Review and tailor to your business.', version: 1, updatedAt: now() });
    seedSalesRecords({put,orgId,now});
  }
  function connectors() { const model=aiProvider.describe();return [ { id: 'email', name: 'Email delivery', status: 'disconnected', enabled: false }, { id: 'linkedin', name: 'LinkedIn', status: 'disconnected', enabled: false }, { id: 'crm', name: 'External CRM sync', status: 'disconnected', enabled: false }, { id: 'llm', name: 'AI model provider', status:model.enabled?'configured':'disconnected', enabled:model.enabled,reason:model.reason }, { id: 'research', name: 'Web research', status: 'disconnected', enabled: false } ]; }
  async function readBody(req) {
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) fail(415, 'CONTENT_TYPE', 'Use application/json.');
    let size = 0;
    const parts = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 1_048_576) fail(413, 'BODY_TOO_LARGE', 'Request body exceeds 1 MB.');
      parts.push(chunk);
    }
    const initial = req[AUTH_CONTEXT];
    if (initial) {
      const current = auth(req);
      if (!current || current.tokenHash !== initial.tokenHash || current.user.id !== initial.user.id || current.user.orgId !== initial.user.orgId) fail(401,'SESSION_REVOKED','Your session expired or was revoked. Sign in again.');
      if (current.user.role !== initial.user.role || current.csrfToken !== initial.csrfToken) fail(403,'SESSION_CHANGED','Your permissions changed while this request was being received. Refresh and try again.');
    }
    try { return object(JSON.parse(Buffer.concat(parts).toString('utf8') || '{}')); } catch (error) { if (error instanceof ApiError) throw error; fail(400, 'INVALID_JSON', 'Request body is not valid JSON.'); }
  }
  function respond(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
  async function route(req, res, ctx, path) {
    const method = req.method;
    if (path === '/api/health' && method === 'GET') return respond(res, 200, { status: 'ok', mode: 'local-simulation' });
    if (path === '/api/session' && method === 'GET') return respond(res, 200, ctx.user ? { user: ctx.user, csrfToken: ctx.csrfToken } : { user: null, setupRequired: db.prepare('SELECT count(*) AS n FROM users').get().n === 0 });
    if (path === '/api/setup' && method === 'POST') {
      const body = await readBody(req);
      fields(body, ['name','email','password','organization']);
      const name = str(body.name, 'Name', { required: true, max: 200 }), mail = email(body.email), organization = str(body.organization, 'Organization', { required: true, max: 200 });
      if (db.prepare('SELECT count(*) AS n FROM users').get().n) fail(409, 'SETUP_COMPLETE', 'Setup is already complete. Sign in with an existing account.');
      const encoded = passwordHash(body.password);
      const user = transaction(() => {
        if (db.prepare('SELECT count(*) AS n FROM users').get().n) fail(409, 'SETUP_COMPLETE', 'Setup is already complete.');
        const orgId = id(), userId = id();
        db.prepare('INSERT INTO organizations VALUES (?,?,?)').run(orgId, organization, now());
        db.prepare('INSERT INTO users(id,org_id,name,email,role,password_hash,created_at) VALUES (?,?,?,?,?,?,?)').run(userId, orgId, name, mail, 'owner', encoded, now());
        seed(orgId);
        const user = publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(userId));
        audit({ ...ctx, user }, 'workspace.setup', orgId);
        return user;
      });
      return respond(res, 201, createSession(user, res));
    }
    if (path === '/api/login' && method === 'POST') {
      const body = await readBody(req);
      fields(body, ['email','password']);
      const mail = email(body.email);
      const key = `${req.socket.remoteAddress}:${mail}`;
      const attempts = loginAttempts.get(key) ?? { count: 0, since: Date.now() };
      if (Date.now() - attempts.since > 15 * 60 * 1000) { attempts.count = 0; attempts.since = Date.now(); }
      if (attempts.count >= 10) fail(429, 'LOGIN_RATE_LIMIT', 'Too many attempts. Try again in 15 minutes.');
      const row = db.prepare('SELECT * FROM users WHERE email = ?').get(mail);
      const ok = verifyPassword(body.password, row?.password_hash ?? '00000000000000000000000000000000:' + '00'.repeat(64));
      if (!row || row.disabled || !ok) { attempts.count++; loginAttempts.set(key, attempts); fail(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.'); }
      loginAttempts.delete(key);
      const user = publicUser(row);
      audit({ ...ctx, user }, 'session.login', user.id);
      return respond(res, 200, createSession(user, res));
    }
    if (!ctx.user) fail(401, 'AUTH_REQUIRED', 'Sign in to continue.');
    req[AUTH_CONTEXT] = ctx;
    const orgId = ctx.user.orgId;
    if (method !== 'GET' && method !== 'HEAD') {
      const supplied = req.headers['x-csrf-token'];
      if (typeof supplied !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(supplied) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(ctx.csrfToken))) fail(403, 'CSRF_INVALID', 'The session verification token is missing or invalid. Refresh and try again.');
    }
    if (path === '/api/logout' && method === 'POST') {
      await readBody(req);
      transaction(()=>{audit(ctx,'session.logout',ctx.user.id);db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(ctx.tokenHash);});
      for(const request of activeAIRequests.values())if(request.tokenHash===ctx.tokenHash)request.controller.abort();
      res.setHeader('Set-Cookie', 'axioryn_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
      return respond(res, 200, { ok: true });
    }
    if (path === '/api/bootstrap' && method === 'GET') {
      const output = { user: ctx.user, csrfToken: ctx.csrfToken, settings: config(orgId, 'settings'), strategy: config(orgId, 'strategy'), stats: stats(orgId), connectors: connectors(), aiProvider:aiProviderInfo(orgId), organization: db.prepare('SELECT id,name FROM organizations WHERE id = ?').get(orgId) };
      for (const collection of [...COLLECTIONS,'drafts','approvals','tasks','agents','audit','simulations']) output[collection] = list(collection, orgId);
      output.agents.sort((a,b)=>a.code.localeCompare(b.code));
      output.modules = registry.list().map(({id,version,schemaVersion,tools})=>({id,version,schemaVersion,tools}));
      output.aiUsage=list('aiRequests',orgId);
      return respond(res, 200, output);
    }
    if (path === '/api/export' && method === 'GET') {
      requireRole(ctx, ['owner']);
      audit(ctx, 'data.export', orgId);
      const data = { format: 'axioryn-local-export', schemaVersion: 1, exportedAt: now(), organization: db.prepare('SELECT id,name FROM organizations WHERE id = ?').get(orgId), settings: config(orgId,'settings'), strategy: config(orgId,'strategy') };
      for (const collection of [...COLLECTIONS,'drafts','approvals','tasks','agents','audit','simulations','aiRequests']) data[collection] = list(collection,orgId);
      res.setHeader('Content-Disposition', 'attachment; filename="axioryn-export.json"');
      return respond(res,200,data);
    }
    if (path === '/api/import' && method === 'POST') {
      requireRole(ctx);
      const body = await readBody(req);
      fields(body,['accounts','contacts']);
      if (!Array.isArray(body.accounts) || !Array.isArray(body.contacts) || body.accounts.length + body.contacts.length > 2000) fail(400,'INVALID_IMPORT','Provide accounts and contacts arrays with at most 2000 total records.');
      const imported = transaction(() => {
        const importedAccounts = [], importedContacts = [];
        const mapping = new Map();
        for (const account of body.accounts) {
          const { id: sourceId, createdAt, updatedAt, synthetic, ...input } = object(account);
          const created = put('accounts',orgId,{...validateRecord('accounts',input,orgId),synthetic:bool(synthetic,'Synthetic provenance')});
          if (sourceId) { if (mapping.has(sourceId)) fail(409,'DUPLICATE','Duplicate source account ID in import.'); mapping.set(sourceId,created.id); }
          importedAccounts.push(created);
        }
        for (const contact of body.contacts) {
          const { id: sourceId, createdAt, updatedAt, synthetic, ...input } = object(contact);
          input.accountId = mapping.get(input.accountId) ?? input.accountId;
          importedContacts.push(put('contacts',orgId,{...validateRecord('contacts',input,orgId),synthetic:bool(synthetic,'Synthetic provenance')||Boolean(get('accounts',input.accountId,orgId).synthetic)}));
        }
        audit(ctx,'data.import',orgId,{accounts:importedAccounts.length,contacts:importedContacts.length});
        return { accounts: importedAccounts, contacts: importedContacts };
      });
      return respond(res,201,imported);
    }
    if (path === '/api/settings' && method === 'PATCH') {
      requireRole(ctx,['owner']);
      const body = await readBody(req);
      fields(body,['killSwitch','budgetLimit','quietHoursStart','quietHoursEnd','timezone','dailyContactLimit','dailyAccountLimit']);
      const merged = { ...config(orgId,'settings'), ...body };
      for (const key of ['quietHoursStart','quietHoursEnd']) if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(merged[key])) fail(400,'INVALID_TIME','Quiet hours must use 24-hour HH:MM format.');
      const timezone = str(merged.timezone,'Timezone',{required:true,max:100});
      try { new Intl.DateTimeFormat('en',{timeZone:timezone}).format(new Date()); } catch { fail(400,'INVALID_TIMEZONE','Enter a valid IANA timezone.'); }
      const validated = {...merged,killSwitch:bool(merged.killSwitch,'Kill switch'),budgetLimit:number(merged.budgetLimit,'Budget limit'),timezone,dailyContactLimit:number(merged.dailyContactLimit,'Daily contact limit',1,100),dailyAccountLimit:number(merged.dailyAccountLimit,'Daily account limit',1,100,1)};
      if(!Number.isInteger(validated.dailyContactLimit)||!Number.isInteger(validated.dailyAccountLimit))fail(400,'INVALID_FIELD','Daily communication limits must be whole numbers.');
      const result = transaction(() => { const result = putConfig(orgId,'settings',validated); audit(ctx,'settings.updated',orgId,{killSwitch:result.killSwitch}); return result; });
      if(result.killSwitch)for(const request of activeAIRequests.values())if(request.orgId===orgId)request.controller.abort();
      return respond(res,200,result);
    }
    if (path === '/api/strategy' && method === 'PATCH') {
      requireRole(ctx,['owner']);
      const body = await readBody(req);
      fields(body,['objective','industry','geography','budget','notes']);
      const old = config(orgId,'strategy'), merged = {...old,...body};
      const result = {objective:str(merged.objective,'Objective',{required:true}),industry:str(merged.industry,'Industry',{max:200}),geography:str(merged.geography,'Geography',{max:500}),budget:number(merged.budget,'Budget'),notes:str(merged.notes,'Notes'),version:old.version+1,updatedAt:now()};
      if (result.budget > config(orgId,'settings').budgetLimit) fail(409,'BUDGET_EXCEEDED','Strategy budget exceeds the planning limit.');
      transaction(() => { putConfig(orgId,'strategy',result); audit(ctx,'strategy.updated',orgId,{version:result.version}); });
      return respond(res,200,result);
    }
    if (path === '/api/users' && ['GET','POST'].includes(method)) {
      requireRole(ctx,['owner']);
      if (method === 'GET') return respond(res,200,db.prepare('SELECT * FROM users WHERE org_id = ? ORDER BY created_at').all(orgId).map(publicUser));
      const body = await readBody(req);
      fields(body,['name','email','password','role']);
      const name = str(body.name,'Name',{required:true,max:200}), mail = email(body.email), role = enumeration(body.role,['operator','reviewer'],'Role');
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(mail)) fail(409,'DUPLICATE','This email is already registered.');
      const userId = id();
      const encoded = passwordHash(body.password);
      transaction(() => { db.prepare('INSERT INTO users(id,org_id,name,email,role,password_hash,created_at) VALUES (?,?,?,?,?,?,?)').run(userId,orgId,name,mail,role,encoded,now()); audit(ctx,'user.created',userId,{role}); });
      return respond(res,201,publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(userId)));
    }
    const parts = path.split('/').filter(Boolean);
    const collection = parts[1], recordId = parts[2], action = parts[3];
    if (collection === 'users' && recordId && parts.length === 3 && method === 'PATCH') {
      requireRole(ctx,['owner']);
      const body = await readBody(req);
      fields(body,['role','disabled']);
      const row = db.prepare('SELECT * FROM users WHERE id = ? AND org_id = ?').get(recordId,orgId);
      if (!row) fail(404,'NOT_FOUND','User not found.');
      if (row.role === 'owner') fail(409,'OWNER_PROTECTED','The workspace owner cannot be disabled or reassigned here.');
      const role = enumeration(body.role,['operator','reviewer'],'Role',row.role), disabled = bool(body.disabled,'Disabled',Boolean(row.disabled));
      transaction(() => {
        db.prepare('UPDATE users SET role = ?, disabled = ? WHERE id = ? AND org_id = ?').run(role,disabled?1:0,recordId,orgId);
        db.prepare('DELETE FROM sessions WHERE user_id = ?').run(recordId);
        audit(ctx,'user.updated',recordId,{role,disabled});
      });
      return respond(res,200,publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(recordId)));
    }
    if (COLLECTIONS.includes(collection) && !action && parts.length <= 3) {
      if (method === 'GET') return respond(res,200,recordId ? get(collection,recordId,orgId) : list(collection,orgId));
      requireRole(ctx);
      if (method === 'POST' && !recordId) {
        const input = await readBody(req);
        if (collection === 'campaigns' && input.status === 'approved') requireRole(ctx,['owner']);
        if (collection === 'knowledge' && input.verified === true || ['content','proposals'].includes(collection) && ['reviewed','accepted'].includes(input.status)) requireRole(ctx,['owner']);
        const result = transaction(() => { const result = put(collection,orgId,validateRecord(collection,input,orgId)); audit(ctx,`${collection}.created`,result.id); return result; });
        return respond(res,201,result);
      }
      if (method === 'PATCH' && recordId) {
        const input = await readBody(req), old = get(collection,recordId,orgId);
        if (collection === 'campaigns' && (input.status === 'approved' || old.status === 'approved')) requireRole(ctx,['owner']);
        if (collection === 'knowledge' && input.verified === true || ['content','proposals'].includes(collection) && ['reviewed','accepted'].includes(input.status)) requireRole(ctx,['owner']);
        const result = transaction(() => {
          const result = put(collection,orgId,validateRecord(collection,input,orgId,old),recordId);
          if (collection === 'contacts' && (result.email !== old.email || result.accountId !== old.accountId)) {
            for (const draft of list('drafts',orgId).filter(item => item.contactId === recordId)) { invalidateApprovals(orgId,draft.id,'Contact recipient or account changed.'); put('drafts',orgId,{...draft,status:'draft',revision:draft.revision+1}); }
          }
          audit(ctx,`${collection}.updated`,recordId); return result;
        });
        return respond(res,200,result);
      }
      if (method === 'DELETE' && recordId) {
        const record = get(collection,recordId,orgId);
        if (collection === 'campaigns' && record.status === 'approved') requireRole(ctx,['owner']);
        const refs = collection === 'accounts' ? [['contacts','accountId'],['opportunities','accountId'],['drafts','accountId'],['tasks','accountId'],['meetings','accountId'],['proposals','accountId']] : collection === 'contacts' ? [['drafts','contactId'],['followups','contactId'],['meetings','contactId']] : collection === 'opportunities' ? [['proposals','opportunityId']] : [];
        if (refs.some(([other,key]) => list(other,orgId).some(item => item[key] === recordId))) fail(409,'RECORD_IN_USE','Remove linked records before deleting this record.');
        transaction(() => { db.prepare('DELETE FROM records WHERE collection = ? AND id = ? AND org_id = ?').run(collection,recordId,orgId); audit(ctx,`${collection}.deleted`,recordId); });
        return respond(res,200,{ok:true});
      }
    }
    if (collection === 'drafts') {
      if (method === 'GET' && !action) return respond(res,200,recordId ? get('drafts',recordId,orgId) : list('drafts',orgId));
      requireRole(ctx);
      if (method === 'POST' && !recordId) {
        const body = await readBody(req);
        fields(body,['accountId','contactId','channel','subject','body']);
        const accountId = reference('accounts',body.accountId,orgId), contactId = reference('contacts',body.contactId,orgId);
        const account = get('accounts',accountId,orgId), contact = get('contacts',contactId,orgId);
        if (contact.accountId !== accountId) fail(400,'REFERENCE_MISMATCH','Contact must belong to the selected account.');
        const channel = enumeration(body.channel,CHANNELS,'Channel','email');
        const suppliedBody = str(body.body,'Body',{max:20000});
        const result = transaction(() => {
          const draft = put('drafts',orgId,{accountId,contactId,channel,recipient:contact.email,subject:str(body.subject,'Subject',{max:500})||`A discovery conversation with ${account.name}`,body:suppliedBody||`Hello ${contact.name.split(' ')[0]},\n\nYour recorded role is ${contact.title || 'a member of the buying committee'} at ${account.name}${account.industry ? ` in ${account.industry}` : ''}. We would welcome a brief discovery conversation about your current priorities and whether our offering could help.\n\nWould a short introductory conversation be useful?\n\nBest regards,\n${ctx.user.name}`,status:'draft',revision:1,contentType:suppliedBody?'human-authored':'deterministic-template',sourceRecordIds:[accountId,contactId],sourceSummary:account.source||'Manually entered CRM records',warnings:[...(suppliedBody?[]:['Template generated from recorded CRM fields. No external research or AI provider was used.']),...(account.synthetic||contact.synthetic?['Contains fictional demonstration data.']:[]),'Verify factual claims, recipient eligibility and applicable communication requirements before using externally.'],synthetic:Boolean(account.synthetic||contact.synthetic)});
          audit(ctx,'draft.created',draft.id,{contentType:draft.contentType}); return draft;
        });
        return respond(res,201,result);
      }
      const body = method !== 'GET' ? await readBody(req) : null;
      const draft = get('drafts',recordId,orgId);
      if (method === 'PATCH' && !action) {
        fields(body,['subject','body','channel','contactId','accountId']);
        const merged = {...draft,...body};
        const accountId = reference('accounts',merged.accountId,orgId), contactId = reference('contacts',merged.contactId,orgId), contact = get('contacts',contactId,orgId);
        if (contact.accountId !== accountId) fail(400,'REFERENCE_MISMATCH','Contact must belong to the selected account.');
        const subject = str(merged.subject,'Subject',{max:500}), content = str(merged.body,'Body',{required:true,max:20000}), channel = enumeration(merged.channel,CHANNELS,'Channel');
        const result = transaction(() => { invalidateApprovals(orgId,draft.id); const result = put('drafts',orgId,{...draft,accountId,contactId,recipient:contact.email,subject,body:content,channel,revision:draft.revision+1,status:'draft',contentType:'human-edited',sourceRecordIds:[accountId,contactId]}); audit(ctx,'draft.updated',draft.id,{revision:result.revision}); return result; });
        return respond(res,200,result);
      }
      if (method === 'POST' && action === 'request-approval') {
        fields(body,[]);
        if (draft.status === 'simulated') fail(409,'ALREADY_SIMULATED','This draft has already been simulated. Edit it before requesting another review.');
        const contact = get('contacts',draft.contactId,orgId);
        if (contact.accountId !== draft.accountId) fail(409,'REFERENCE_MISMATCH','The draft must be updated for the current contact account.');
        if (contact.suppressed) fail(409,'CONTACT_SUPPRESSED','This contact is suppressed.');
        const digest = draftDigest(draft,contact);
        if (list('approvals',orgId).some(item => item.draftId === draft.id && item.digest === digest && ['pending','approved'].includes(item.status) && item.expiresAt > now())) fail(409,'DUPLICATE_APPROVAL','A pending or valid approval already exists for this revision.');
        const result = transaction(() => {
          for (const expired of list('approvals',orgId).filter(item=>item.draftId===draft.id&&item.status==='pending'&&item.expiresAt<=now())) put('approvals',orgId,{...expired,status:'expired'});
          const approval = put('approvals',orgId,{draftId:draft.id,digest,revision:draft.revision,recipient:contact.email,channel:draft.channel,subject:draft.subject,body:draft.body,status:'pending',requestedBy:ctx.user.id,requestedByName:ctx.user.name,requestedAt:now(),expiresAt:new Date(new Date(now()).getTime()+24*60*60*1000).toISOString(),synthetic:draft.synthetic});
          put('drafts',orgId,{...draft,status:'pending'}); audit(ctx,'approval.requested',approval.id,{draftId:draft.id,revision:draft.revision}); return approval;
        });
        return respond(res,201,result);
      }
      if (method === 'POST' && action === 'simulate') {
        fields(body,[]);
        const settings = config(orgId,'settings');
        if (settings.killSwitch) fail(409,'KILL_SWITCH_ACTIVE','The kill switch blocks all execution, including local simulations.');
        if (draft.status === 'simulated') fail(409,'DUPLICATE_DELIVERY','This exact draft has already been simulated.');
        const contact = get('contacts',draft.contactId,orgId);
        if (contact.suppressed) fail(409,'CONTACT_SUPPRESSED','This contact is suppressed.');
        if (contact.accountId !== draft.accountId) fail(409,'REFERENCE_MISMATCH','The contact account changed. Update the draft.');
        if (list('meetings',orgId).some(meeting=>meeting.accountId===draft.accountId&&meeting.status==='planned')) fail(409,'MEETING_PLANNED','A meeting is already planned for this account. Pause outreach until its status is reviewed.');
        const approval = validApproval(draft,orgId);
        const time = new Intl.DateTimeFormat('en-GB',{timeZone:settings.timezone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(now()));
        const start = settings.quietHoursStart, end = settings.quietHoursEnd;
        const quiet = start !== end && (start < end ? time >= start && time < end : time >= start || time < end);
        if (quiet) fail(409,'QUIET_HOURS','Execution is blocked during the configured quiet hours. Equal start/end disables this window.');
        const contentDigest = deliveryDigest(draft,contact);
        const history = list('simulations',orgId).filter(item => item.recipient === contact.email || item.contactId === contact.id);
        if (history.some(item => item.contentDigest === contentDigest || item.digest === approval.digest)) fail(409,'DUPLICATE_DELIVERY','This exact content has already been simulated for the recipient.');
        if (history.filter(item => new Date(item.createdAt).getTime() > new Date(now()).getTime()-86400000).length >= settings.dailyContactLimit) fail(409,'FREQUENCY_LIMIT','The recipient has reached the rolling 24-hour contact limit.');
        const accountHistory=list('simulations',orgId).filter(item=>(item.accountId===draft.accountId||(!item.accountId&&get('drafts',item.draftId,orgId,false)?.accountId===draft.accountId))&&new Date(item.createdAt).getTime()>new Date(now()).getTime()-86400000);
        if(accountHistory.length>=(settings.dailyAccountLimit??1))fail(409,'ACCOUNT_FREQUENCY_LIMIT','This account has reached its rolling 24-hour communication limit. Coordinate outreach before approaching another buying committee member.');
        const result = transaction(() => {
          const simulation = put('simulations',orgId,{draftId:draft.id,accountId:draft.accountId,contactId:contact.id,approvalId:approval.id,digest:approval.digest,contentDigest,recipient:contact.email,channel:draft.channel,status:'simulated',externalDelivery:false,cost:0,message:'Local simulation only. Nothing was sent.',synthetic:draft.synthetic});
          const updated = put('drafts',orgId,{...draft,status:'simulated',simulatedAt:now()});
          audit(ctx,'delivery.simulated',simulation.id,{draftId:draft.id,approvalId:approval.id,externalDelivery:false}); return {draft:updated,simulation};
        });
        return respond(res,200,result);
      }
    }
    if (collection === 'approvals') {
      if (method === 'GET' && !action) return respond(res,200,recordId?get('approvals',recordId,orgId):list('approvals',orgId));
      if (method === 'POST' && action === 'decision') {
        requireRole(ctx,['owner','reviewer']);
        const body = await readBody(req);
        fields(body,['decision','reason']);
        const decision = enumeration(body.decision,['approved','rejected'],'Decision'), reason = str(body.reason,'Reason',{max:2000});
        const approval = get('approvals',recordId,orgId), draft = get('drafts',approval.draftId,orgId), contact = get('contacts',draft.contactId,orgId);
        if (approval.status !== 'pending') fail(409,'APPROVAL_FINAL','This approval is no longer pending.');
        if (approval.expiresAt <= now()) fail(409,'APPROVAL_EXPIRED','This review request has expired. Request approval again.');
        if (approval.digest !== draftDigest(draft,contact)) fail(409,'APPROVAL_STALE','The exact draft content or recipient has changed.');
        const result = transaction(() => {
          const result = put('approvals',orgId,{...approval,status:decision,reason,decidedBy:ctx.user.id,decidedByName:ctx.user.name,decidedAt:now()});
          put('drafts',orgId,{...draft,status:decision}); audit(ctx,`approval.${decision}`,approval.id,{draftId:draft.id}); return result;
        });
        return respond(res,200,result);
      }
    }
    if (collection === 'tasks') {
      if (method === 'GET' && !action) return respond(res,200,recordId?get('tasks',recordId,orgId):list('tasks',orgId));
      requireRole(ctx);
      if (method === 'POST' && !recordId) {
        const body = await readBody(req);
        fields(body,['agentId','title','accountId','input']);
        const agentId = reference('agents',body.agentId,orgId), accountId = reference('accounts',body.accountId,orgId,{optional:true});
        authorizedAgent(orgId,agentId,'local-read');
        authorizedAgent(orgId,agentId,'template-output');
        const result = transaction(() => { const task = put('tasks',orgId,{agentId,accountId,title:str(body.title,'Task title',{required:true,max:300}),input:str(body.input,'Task input',{max:10000}),status:'queued',attempts:0,maxAttempts:3,output:null,error:null,traceId:ctx.traceId,synthetic:accountId?Boolean(get('accounts',accountId,orgId).synthetic):false}); audit(ctx,'task.created',task.id,{agentId}); return task; });
        return respond(res,201,result);
      }
      if (method === 'POST' && action === 'ai-run') {
        requireRole(ctx,['owner']);
        const body=await readBody(req);
        fields(body,['confirmProviderUse']);
        if(body.confirmProviderUse!==true)fail(400,'AI_CONFIRMATION_REQUIRED','Confirm this specific provider request and its selected source disclosure.');
        const provider=aiProvider.describe();
        if(!provider.enabled)fail(503,'AI_DISABLED','The AI provider is disabled. Configure the server before requesting analysis.');
        if(config(orgId,'settings').killSwitch)fail(409,'KILL_SWITCH_ACTIVE','The kill switch blocks model requests.');
        const task=get('tasks',recordId,orgId);
        if(task.status!=='queued'||task.attempts>=task.maxAttempts)fail(409,'INVALID_TRANSITION','Only queued tasks below the three-attempt limit can use the model service.');
        const agent=authorizedAgent(orgId,task.agentId,'local-read');
        try{registry.assertModelService({moduleId:'sales',agentCode:agent.code,actorOrgId:orgId,targetOrgId:orgId,actorRole:ctx.user.role,ownerConfirmed:true,providerEnabled:provider.enabled});}catch(error){fail(403,error.code,error.message);}
        let prepared;
        try{prepared=prepareAIRequest(task,orgId);}catch(error){if(error instanceof ProviderError)fail(400,error.code,error.message);throw error;}
        const sourceDigest=hash(JSON.stringify(prepared.input));
        const executionId=id(),controller=new AbortController();
        const running=transaction(()=>{
          const current=get('tasks',recordId,orgId);
          if(current.status!=='queued'||current.attempts>=current.maxAttempts)fail(409,'INVALID_TRANSITION','This task is no longer eligible for model execution.');
          const day=now().slice(0,10);
          if(list('aiRequests',orgId).filter(request=>request.day===day).length>=provider.dailyRequestLimit)fail(429,'AI_DAILY_LIMIT','The organization has reached its model-request limit for this UTC day. Failed attempts count toward the limit.');
          put('aiRequests',orgId,{taskId:task.id,day,status:'running',provider:provider.provider,model:provider.model,usage:null,cost:null,sourceRecordIds:prepared.sourceIds,synthetic:prepared.synthetic},executionId);
          const running=put('tasks',orgId,{...current,status:'running',executionMode:'ai-assisted',executionId,aiRequestId:executionId,provider:provider.provider,model:provider.model,attempts:current.attempts+1,output:null,error:null,errorCode:null,synthetic:prepared.synthetic,startedAt:now()});
          audit(ctx,'ai.request.reserved',executionId,{taskId:task.id,provider:provider.provider,model:provider.model,sourceCount:prepared.sourceIds.length,inputBytes:Buffer.byteLength(JSON.stringify(prepared.input),'utf8')});
          return running;
        });
        activeAIRequests.set(executionId,{controller,orgId,taskId:task.id,tokenHash:ctx.tokenHash});
        let output=null,providerError=null;
        try{output=await aiProvider.analyze(prepared,{signal:controller.signal});}catch(error){providerError=error instanceof ProviderError?error:new ProviderError('AI_PROVIDER_ERROR','The model analysis failed. No output was accepted.');}finally{activeAIRequests.delete(executionId);}
        const current=get('tasks',task.id,orgId),session=auth(req);
        let blocked=providerError;
        if(!session||session.tokenHash!==ctx.tokenHash||session.user.role!=='owner'||session.user.orgId!==orgId)blocked=new ProviderError('AI_SESSION_REVOKED','The owner session expired or was revoked during analysis. The output was discarded.');
        else if(config(orgId,'settings').killSwitch)blocked=new ProviderError('AI_KILL_SWITCH','The kill switch was activated during analysis. The output was discarded.');
        else if(current.status==='running'&&current.executionId===running.executionId) {
          try{if(hash(JSON.stringify(prepareAIRequest(current,orgId).input))!==sourceDigest)blocked=new ProviderError('AI_SOURCE_CHANGED','Source records changed during analysis. The output was discarded; review and retry explicitly.');}catch{blocked=new ProviderError('AI_SOURCE_CHANGED','Source records are no longer eligible. The model output was discarded.');}
        }
        const result=transaction(()=>{
          const latest=get('tasks',task.id,orgId),reservation=get('aiRequests',executionId,orgId);
          if(latest.status!=='running'||latest.executionId!==executionId) {
            put('aiRequests',orgId,{...reservation,status:latest.status==='cancelled'?'cancelled':'discarded',usage:output?.usage??null,errorCode:'AI_STALE_STATE',completedAt:now()});
            audit(ctx,'ai.request.discarded',executionId,{taskId:task.id,reason:'task-state-changed'});
            return latest;
          }
          const succeeded=Boolean(output&&!blocked);
          const completed=put('tasks',orgId,{...latest,status:succeeded?'succeeded':'failed',output:succeeded?{...output,generatedAt:now()}:null,error:succeeded?null:blocked?.message??'No valid model output was accepted.',errorCode:succeeded?null:blocked?.code??'AI_INVALID_OUTPUT',completedAt:now()});
          put('aiRequests',orgId,{...reservation,status:succeeded?'succeeded':'failed',usage:output?.usage??null,errorCode:completed.errorCode,completedAt:now()});
          audit(ctx,succeeded?'ai.request.succeeded':'ai.request.failed',executionId,{taskId:task.id,errorCode:completed.errorCode,provider:provider.provider,model:provider.model});
          return completed;
        });
        return respond(res,200,result);
      }
      if (method === 'POST' && ['run','retry','cancel'].includes(action)) {
        fields(await readBody(req),[]);
        const task = get('tasks',recordId,orgId);
        if (action === 'cancel') {
          if (!['queued','failed'].includes(task.status)&&!(task.status==='running'&&task.executionMode==='ai-assisted')) fail(409,'INVALID_TRANSITION','Only queued, failed or running model tasks can be cancelled.');
          const result = transaction(() => { const result = put('tasks',orgId,{...task,status:'cancelled',completedAt:now()}); if(task.executionMode==='ai-assisted'&&task.executionId){const reservation=get('aiRequests',task.executionId,orgId,false);if(reservation)put('aiRequests',orgId,{...reservation,status:'cancelled',completedAt:now()});} audit(ctx,'task.cancelled',task.id); return result; });
          activeAIRequests.get(task.executionId)?.controller.abort();
          return respond(res,200,result);
        }
        if (action === 'retry') {
          if (task.status !== 'failed' || task.attempts >= task.maxAttempts) fail(409,'RETRY_DENIED','Only failed tasks below the three-attempt limit can be retried.');
          const result = transaction(() => { const result = put('tasks',orgId,{...task,status:'queued',error:null}); audit(ctx,'task.retried',task.id); return result; }); return respond(res,200,result);
        }
        if (task.status !== 'queued' || task.attempts >= task.maxAttempts) fail(409,'INVALID_TRANSITION','Only queued tasks below the three-attempt limit can run.');
        if (config(orgId,'settings').killSwitch) fail(409,'KILL_SWITCH_ACTIVE','The kill switch blocks agent execution.');
        const result = transaction(() => {
          const running = put('tasks',orgId,{...task,status:'running',executionMode:'deterministic-local',executionId:null,aiRequestId:null,provider:null,model:null,attempts:task.attempts+1,startedAt:now()});
          const agent = authorizedAgent(orgId,task.agentId,'local-read'), account = task.accountId?get('accounts',task.accountId,orgId,false):null;
          if (task.accountId && !account) {
            const result = put('tasks',orgId,{...running,status:'failed',error:'The referenced source account is no longer available.',completedAt:now()}); audit(ctx,'task.failed',task.id,{attempt:result.attempts}); return result;
          }
          authorizedAgent(orgId,task.agentId,'template-output');
          const output = executeSalesAgent({agent,account,task,accounts:list('accounts',orgId),contacts:list('contacts',orgId),opportunities:list('opportunities',orgId),intelligence:list('intelligence',orgId),knowledge:list('knowledge',orgId),strategy:config(orgId,'strategy'),stats:stats(orgId),generatedAt:now()});
          const result = put('tasks',orgId,{...running,status:'succeeded',output,error:null,completedAt:now()}); audit(ctx,'task.succeeded',task.id,{agentId:agent.id,attempt:result.attempts}); return result;
        });
        return respond(res,200,result);
      }
    }
    if (['agents','audit','simulations'].includes(collection) && method === 'GET' && !action && parts.length <= 3) return respond(res,200,recordId?get(collection,recordId,orgId):list(collection,orgId));
    fail(404,'NOT_FOUND','API route not found.');
  }

  transaction(()=>{
    for(const row of db.prepare("SELECT id,org_id,data FROM records WHERE collection='tasks'").all()) {
      const task=JSON.parse(row.data);
      if(task.status!=='running'||task.executionMode!=='ai-assisted')continue;
      put('tasks',row.org_id,{...task,status:'failed',output:null,error:'The server stopped during model analysis. No automatic resend was attempted.',errorCode:'AI_INTERRUPTED',completedAt:now()});
      if(task.executionId){const reservation=get('aiRequests',task.executionId,row.org_id,false);if(reservation)put('aiRequests',row.org_id,{...reservation,status:'interrupted',errorCode:'AI_INTERRUPTED',completedAt:now()});}
      audit({user:{id:'system',name:'System recovery',orgId:row.org_id},traceId:id()},'ai.request.interrupted',task.executionId??task.id,{taskId:task.id});
    }
  });

  async function handler(req,res) {
    const traceId = id();
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    res.setHeader('X-Trace-Id',traceId);
    try {
      if (!/^(localhost|127\.0\.0\.1|\[::1\])(?::\d{1,5})?$/i.test(req.headers.host??'')) fail(403,'HOST_REJECTED','Access this app through localhost or 127.0.0.1.');
      if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) fail(403,'ORIGIN_REJECTED','Cross-origin requests are not permitted.');
      if (req.headers['sec-fetch-site'] === 'cross-site') fail(403,'ORIGIN_REJECTED','Cross-site requests are not permitted.');
      const url = new URL(req.url,'http://localhost');
      if (url.pathname.startsWith('/api/')) return await route(req,res,{...auth(req),traceId},url.pathname.replace(/\/$/,''));
      if (!['GET','HEAD'].includes(req.method)) fail(405,'METHOD_NOT_ALLOWED','Method not allowed.');
      let pathname;
      try { pathname = decodeURIComponent(url.pathname); } catch { fail(400,'INVALID_PATH','Invalid URL path.'); }
      if (pathname.includes('\0') || pathname.includes('\\')) fail(400,'INVALID_PATH','Invalid URL path.');
      const file = resolve(publicDir,`.${pathname === '/' ? '/index.html' : pathname}`);
      if (file !== publicDir && !file.startsWith(publicDir+sep)) fail(403,'INVALID_PATH','Path is outside the public directory.');
      let bytes;
      try { if (!statSync(file).isFile()) fail(404,'NOT_FOUND','Page not found.'); bytes = readFileSync(file); } catch(error) { if(error instanceof ApiError)throw error; fail(404,'NOT_FOUND','Page not found.'); }
      res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':extname(file)==='.html'?'no-store':'no-cache'});
      res.end(req.method==='HEAD'?undefined:bytes);
    } catch(error) {
      if (res.headersSent) { res.end(); return; }
      if (!(error instanceof ApiError)) options.onError?.(error);
      respond(res,error.status??500,{error:{code:error.code&&error instanceof ApiError?error.code:'INTERNAL_ERROR',message:error instanceof ApiError?error.message:'The request could not be completed.'}});
    }
  }
  const server = http.createServer(handler);
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  let closed = false;
  const close = () => new Promise((resolveClose,reject) => {
    if (closed) return resolveClose();
    closed = true;
    for(const request of activeAIRequests.values())request.controller.abort();
    const finish = error => { try { db.close(); } catch {} error?reject(error):resolveClose(); };
    if (server.listening) { server.close(finish); server.closeIdleConnections(); } else finish();
  });
  return { server,db,close,handler,registry };
}
