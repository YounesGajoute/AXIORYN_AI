import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../server/app.mjs';

async function workspace(t) {
  const app = createApp({ dbPath: ':memory:', clock: () => new Date('2026-10-19T12:00:00.000Z') });
  await new Promise(resolve => app.server.listen(0, '127.0.0.1', resolve));
  t.after(() => app.close());
  const base = `http://127.0.0.1:${app.server.address().port}`;
  const owner = {};
  async function request(target, { method = 'GET', body, client = owner, headers = {} } = {}) {
    const response = await fetch(base + target, {
      method,
      headers: { ...(client.cookie ? { Cookie: client.cookie } : {}), ...(method !== 'GET' ? { 'Content-Type': 'application/json', 'X-CSRF-Token': client.csrf || '' } : {}), ...headers },
      ...(method !== 'GET' ? { body: JSON.stringify(body ?? {}) } : {})
    });
    const data = await response.json();
    if (response.headers.get('set-cookie')) client.cookie = response.headers.get('set-cookie').split(';')[0];
    if (data.csrfToken) client.csrf = data.csrfToken;
    return { status: response.status, data };
  }
  async function heldRequest(target, body = {}, client = owner) {
    const text = JSON.stringify(body);
    const observed = new Promise(resolve => app.server.once('request', resolve));
    let pending;
    const result = new Promise((resolve, reject) => {
      pending = http.request(base + target, {
        method: 'POST',
        headers: { Cookie: client.cookie, 'X-CSRF-Token': client.csrf, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text) }
      }, response => {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          try { resolve({ status: response.statusCode, data: JSON.parse(Buffer.concat(chunks).toString('utf8')) }); } catch (error) { reject(error); }
        });
      });
      pending.on('error', reject);
      pending.write(text.slice(0, -1));
    });
    await observed;
    return { finish: () => { pending.end(text.slice(-1)); return result; } };
  }
  assert.equal((await request('/api/setup', { method: 'POST', body: { name: 'Security Owner', email: 'security-owner@example.test', password: 'security-owner-password', organization: 'Security workspace' } })).status, 201);
  async function operator() {
    const created = await request('/api/users', { method: 'POST', body: { name: 'Security Operator', email: 'security-operator@example.test', password: 'security-operator-password', role: 'operator' } });
    assert.equal(created.status, 201);
    const client = {};
    assert.equal((await request('/api/login', { method: 'POST', body: { email: created.data.email, password: 'security-operator-password' }, client })).status, 200);
    return { user: created.data, client };
  }
  const boot = (await request('/api/bootstrap')).data;
  const contact = boot.contacts[0];
  async function draft() {
    const created = await request('/api/drafts', { method: 'POST', body: { accountId: contact.accountId, contactId: contact.id, body: 'Original reviewed body.', channel: 'email' } });
    assert.equal(created.status, 201);
    return created.data;
  }
  async function task(title) {
    const created = await request('/api/tasks', { method: 'POST', body: { agentId: boot.agents[0].id, title } });
    assert.equal(created.status, 201);
    return created.data;
  }
  return { app, base, request, heldRequest, operator, draft, task, boot };
}

test('a review request waiting for its body cannot restore an older draft revision', async t => {
  const fixture = await workspace(t);
  const draft = await fixture.draft();
  const pending = await fixture.heldRequest(`/api/drafts/${draft.id}/request-approval`);
  const edited = await fixture.request(`/api/drafts/${draft.id}`, { method: 'PATCH', body: { body: 'Newer content that must survive.' } });
  assert.equal(edited.status, 200);
  const result = await pending.finish();
  assert.ok([201, 409].includes(result.status), JSON.stringify(result.data));
  const current = (await fixture.request(`/api/drafts/${draft.id}`)).data;
  assert.equal(current.body, 'Newer content that must survive.');
  assert.equal(current.revision, edited.data.revision);
  if (result.status === 201) {
    assert.equal(result.data.body, current.body);
    assert.equal(result.data.revision, current.revision);
  }
});

test('a held run cannot execute a task that another request has already completed', async t => {
  const fixture = await workspace(t);
  const task = await fixture.task('Execute exactly once');
  const pending = await fixture.heldRequest(`/api/tasks/${task.id}/run`);
  assert.equal((await fixture.request(`/api/tasks/${task.id}/run`, { method: 'POST' })).status, 200);
  const stale = await pending.finish();
  assert.equal(stale.status, 409);
  const events = (await fixture.request('/api/audit')).data.filter(event => event.action === 'task.succeeded' && event.target === task.id);
  assert.equal(events.length, 1);
});

test('role downgrade and session revocation also block an already-started mutation', async t => {
  const fixture = await workspace(t);
  const operator = await fixture.operator();
  const pending = await fixture.heldRequest('/api/accounts', { name: 'Must not exist after revocation' }, operator.client);
  const changed = await fixture.request(`/api/users/${operator.user.id}`, { method: 'PATCH', body: { role: 'reviewer' } });
  assert.equal(changed.status, 200);
  const result = await pending.finish();
  assert.ok([401, 403].includes(result.status), JSON.stringify(result.data));
  assert.ok(!(await fixture.request('/api/accounts')).data.some(account => account.name === 'Must not exist after revocation'));
});

test('an operator cannot retain owner approval while changing an approved campaign budget', async t => {
  const fixture = await workspace(t);
  const operator = await fixture.operator();
  const draft = await fixture.draft();
  const review = await fixture.request(`/api/drafts/${draft.id}/request-approval`, { method: 'POST' });
  assert.equal(review.status, 201);
  assert.equal((await fixture.request(`/api/approvals/${review.data.id}/decision`, { method: 'POST', body: { decision: 'approved' } })).status, 200);
  const campaign = await fixture.request('/api/campaigns', { method: 'POST', body: { name: 'Reviewed plan', objective: 'Approved objective', budget: 100, channel: 'email', status: 'approved', draftId: draft.id } });
  assert.equal(campaign.status, 201);
  const changed = await fixture.request(`/api/campaigns/${campaign.data.id}`, { method: 'PATCH', client: operator.client, body: { budget: 500 } });
  assert.ok([200, 403].includes(changed.status), JSON.stringify(changed.data));
  const current = (await fixture.request(`/api/campaigns/${campaign.data.id}`)).data;
  if (changed.status === 200) assert.equal(current.status, 'draft', 'Changing an approved plan requires a new approval.');
  else assert.equal(current.budget, 100);
});

test('audit persistence failures roll back settings, strategy, users and task transitions', async t => {
  const fixture = await workspace(t);
  const operator = await fixture.operator();
  const queued = await fixture.task('Do not cancel without an audit');
  const retry = await fixture.task('Do not retry without an audit');
  const storedRetry = JSON.parse(fixture.app.db.prepare("SELECT data FROM records WHERE collection='tasks' AND id=?").get(retry.id).data);
  fixture.app.db.prepare("UPDATE records SET data=? WHERE collection='tasks' AND id=?").run(JSON.stringify({ ...storedRetry, status: 'failed', attempts: 1 }), retry.id);
  const before = (await fixture.request('/api/bootstrap')).data;
  fixture.app.db.exec("CREATE TRIGGER fail_audit BEFORE INSERT ON records WHEN NEW.collection='audit' BEGIN SELECT RAISE(FAIL, 'Injected audit persistence failure'); END;");
  const actions = [
    ['/api/settings', 'PATCH', { killSwitch: !before.settings.killSwitch }],
    ['/api/strategy', 'PATCH', { notes: 'Must roll back' }],
    ['/api/users', 'POST', { name: 'Unlogged user', email: 'unlogged@example.test', password: 'unlogged-user-password', role: 'reviewer' }],
    [`/api/users/${operator.user.id}`, 'PATCH', { disabled: true }],
    [`/api/tasks/${queued.id}/cancel`, 'POST', {}],
    [`/api/tasks/${retry.id}/retry`, 'POST', {}]
  ];
  for (const [target, method, body] of actions) assert.equal((await fixture.request(target, { method, body })).status, 500, target);
  const after = (await fixture.request('/api/bootstrap')).data;
  const users = (await fixture.request('/api/users')).data;
  assert.equal(after.settings.killSwitch, before.settings.killSwitch);
  assert.deepEqual(after.strategy, before.strategy);
  assert.ok(!users.some(user => user.email === 'unlogged@example.test'));
  assert.equal(users.find(user => user.id === operator.user.id).disabled, false);
  assert.equal(after.tasks.find(task => task.id === queued.id).status, 'queued');
  assert.equal(after.tasks.find(task => task.id === retry.id).status, 'failed');
  assert.equal(after.audit.length, before.audit.length);
});

test('host, origin and encoded public paths reject access outside the local workspace', async t => {
  const fixture = await workspace(t);
  const rejectedHost = await new Promise((resolve, reject) => {
    const pending = http.get(fixture.base + '/api/health', { headers: { Host: 'untrusted.example' } }, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    pending.on('error', reject);
  });
  assert.equal(rejectedHost, 403);
  assert.equal((await fixture.request('/api/bootstrap', { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  assert.equal((await fixture.request('/api/bootstrap', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
  assert.equal((await fixture.request('/..%2Fserver%2Fapp.mjs')).status, 403);
  assert.equal((await fixture.request('/..%5Cserver%5Capp.mjs')).status, 400);
});
