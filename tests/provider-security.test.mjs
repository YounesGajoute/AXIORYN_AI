import test from 'node:test';
import assert from 'node:assert/strict';
import { createAIProvider, OPENAI_RESPONSES_URL } from '../server/providers.mjs';

const env = { AXIORYN_AI_ENABLED: 'true', OPENAI_API_KEY: 'fixture-provider-key-only', OPENAI_MODEL: 'fixture-model' };
const output = { summary: 'Unverified fixture analysis.', recommendations: ['Review the supplied evidence.'], sourceRecordIds: [], warnings: [] };
const payload = () => ({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(output) }] }], usage: { input_tokens: 10, output_tokens: 20, total_tokens: 30 } });
const prepare = provider => provider.prepare({ agentRole: 'Sales analyst', taskTitle: 'Review fixtures', brief: 'Use only supplied records.', account: null, knowledge: [] });

test('model transport rejects redirects and offers no storage or tool authority', async () => {
  let captured;
  const provider = createAIProvider({ env, fetchImpl: async (url, options) => {
    captured = { url, options, body: JSON.parse(options.body) };
    return new Response(JSON.stringify(payload()), { status: 200 });
  } });
  const result = await provider.analyze(prepare(provider));
  assert.equal(captured.url, OPENAI_RESPONSES_URL);
  assert.equal(captured.options.redirect, 'error', 'A redirect must not forward disclosed records to another destination.');
  assert.equal(captured.body.store, false);
  assert.deepEqual(captured.body.tools, []);
  assert.equal(captured.body.text.format.strict, true);
  assert.equal(result.externalActions, 0);
  assert.equal(result.cost, null);
  assert.ok(!JSON.stringify(provider.describe()).includes(env.OPENAI_API_KEY));
  assert.ok(!JSON.stringify(captured.body).includes(env.OPENAI_API_KEY));
});

test('an oversized streaming provider response is cancelled before it is fully buffered', async () => {
  let pulls = 0;
  let cancelled = false;
  const totalChunks = 40;
  const stream = new ReadableStream({
    pull(controller) {
      if (pulls === totalChunks) { controller.close(); return; }
      pulls++;
      controller.enqueue(new Uint8Array(64 * 1024).fill(32));
    },
    cancel() { cancelled = true; }
  });
  const provider = createAIProvider({ env, fetchImpl: async () => new Response(stream, { status: 200 }) });
  await assert.rejects(provider.analyze(prepare(provider)), error => error.code === 'AI_INVALID_OUTPUT');
  assert.equal(cancelled, true, 'The transport must stop consuming an oversized response.');
  assert.ok(pulls < totalChunks, 'The response limit must apply during reading rather than after buffering.');
});

test('the provider response cap measures UTF-8 bytes rather than JavaScript characters', async () => {
  const response = JSON.stringify({ ...payload(), ignoredPadding: '界'.repeat(400_000) });
  assert.ok(response.length < 1_048_576);
  assert.ok(Buffer.byteLength(response, 'utf8') > 1_048_576);
  const provider = createAIProvider({ env, fetchImpl: async () => new Response(response, { status: 200 }) });
  await assert.rejects(provider.analyze(prepare(provider)), error => error.code === 'AI_INVALID_OUTPUT');
});
