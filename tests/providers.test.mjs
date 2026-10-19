import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createAIProvider,readAIConfiguration,OPENAI_RESPONSES_URL} from '../server/providers.mjs';
import {createApp} from '../server/app.mjs';
import {ModuleRegistry} from '../server/core.mjs';
import {SALES_MANIFEST} from '../server/sales.mjs';

const env={AXIORYN_AI_ENABLED:'true',OPENAI_API_KEY:'fixture-key-never-real',OPENAI_MODEL:'fixture-model'};
const context={agentRole:'Qualification specialist',taskTitle:'Review evidence',brief:'Use supplied records.',account:{id:'account-one',name:'Example Works',industry:'Manufacturing',country:'Morocco',source:'Owner record',notes:'Needs confirmation.',synthetic:true},knowledge:[{id:'knowledge-one',title:'Specification',summary:'Owner verified capability.',verified:true}]};
const output={summary:'Recorded needs require verification.',recommendations:['Ask a discovery question.'],sourceRecordIds:['account-one'],warnings:['Fixture, not a live AI response.']};
const response=(data=output)=>new Response(JSON.stringify({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify(data)}]}],usage:{input_tokens:40,output_tokens:30,total_tokens:70}}),{status:200});
function successFetch(_url,options){const input=JSON.parse(JSON.parse(options.body).input.find(item=>item.role==='user').content);return Promise.resolve(response({...output,sourceRecordIds:input.account?[input.account.id]:[]}));}
function heldFetch(){let release,startedResolve;const started=new Promise(resolve=>{startedResolve=resolve;});return {started,fetch:async(_url,options)=>{startedResolve();return await new Promise(resolve=>{release=()=>resolve(successFetch(_url,options));});},release:()=>release()};}

test('AI configuration stays disabled without all explicit server settings and clamps bounds',()=>{
  assert.equal(readAIConfiguration({}).enabled,false);
  assert.equal(readAIConfiguration({OPENAI_API_KEY:'fixture',OPENAI_MODEL:'fixture-model'}).enabled,false);
  assert.equal(readAIConfiguration({AXIORYN_AI_ENABLED:'true',OPENAI_API_KEY:'fixture'}).enabled,false);
  const provider=createAIProvider({env:{...env,AXIORYN_AI_MAX_OUTPUT_TOKENS:'999999',AXIORYN_AI_DAILY_REQUEST_LIMIT:'999999'}});
  assert.equal(provider.describe().maxOutputTokens,4096);
  assert.equal(provider.describe().dailyRequestLimit,100);
  assert.equal(provider.describe().apiKey,undefined);
  assert.ok(!JSON.stringify(provider.describe()).includes(env.OPENAI_API_KEY));
});
test('model service authority belongs to Core and requires per-call owner confirmation',()=>{
  const registry=new ModuleRegistry();registry.register(SALES_MANIFEST);
  const gate={moduleId:'sales',agentCode:'06',actorOrgId:'one',targetOrgId:'one',actorRole:'owner',ownerConfirmed:true,providerEnabled:true};
  assert.equal(registry.assertModelService(gate).code,'06');
  for(const override of [{actorRole:'operator'},{ownerConfirmed:false},{providerEnabled:false}])assert.throws(()=>registry.assertModelService({...gate,...override}),error=>error.code==='MODEL_SERVICE_DENIED');
  assert.throws(()=>registry.assertModelService({...gate,targetOrgId:'two'}),error=>error.code==='TENANT_DENIED');
});
test('provider sends bounded selected data with fixed endpoint, no tools/store and strict structured output',async()=>{
  let sent;
  const provider=createAIProvider({env,fetchImpl:async(url,options)=>{sent={url,options};return response();}});
  const prepared=provider.prepare({...context,contacts:[{name:'Personal Name',email:'private@example.test'}],sessions:['secret'],knowledge:[...context.knowledge,{id:'unverified',title:'Unverified',summary:'Do not include',verified:false}]});
  const result=await provider.analyze(prepared);
  assert.equal(sent.url,OPENAI_RESPONSES_URL);assert.equal(sent.options.redirect,'error');
  const body=JSON.parse(sent.options.body),user=JSON.parse(body.input[1].content);
  assert.equal(body.model,'fixture-model');assert.equal(body.store,false);assert.deepEqual(body.tools,[]);
  assert.equal(body.max_output_tokens,1500);assert.equal(body.text.format.strict,true);assert.equal(body.text.format.type,'json_schema');
  assert.equal(body.input[0].role,'system');assert.equal(body.input[1].role,'user');
  assert.ok(body.input[0].content.includes('untrusted'));
  assert.deepEqual(Object.keys(user),['agentRole','taskTitle','brief','account','knowledge']);
  assert.equal(user.knowledge.length,1);
  for(const secret of ['Personal Name','private@example.test','secret','Do not include'])assert.ok(!JSON.stringify(user).includes(secret));
  assert.equal(result.mode,'ai-assisted');assert.equal(result.cost,null);assert.equal(result.externalActions,0);
  assert.deepEqual(result.usage,{inputTokens:40,outputTokens:30,totalTokens:70});
  assert.equal(result.synthetic,true);assert.ok(result.warnings.some(warning=>warning.includes('fictional')));
  assert.throws(()=>provider.prepare({...context,brief:'x'.repeat(10000),knowledge:Array.from({length:10},(_,i)=>({id:`k${i}`,title:'Spec',summary:'x'.repeat(5000),verified:true}))}),error=>error.code==='AI_INPUT_TOO_LARGE');
});
test('provider fails closed on refused, incomplete, malformed, unknown-source and oversized responses',async t=>{
  const cases=[
    ['unknown source',()=>response({...output,sourceRecordIds:['foreign-record']}),'AI_UNKNOWN_SOURCE'],
    ['unexpected property',()=>response({...output,sendNow:true}),'AI_INVALID_OUTPUT'],
    ['malformed JSON',()=>new Response('not JSON'),'AI_INVALID_OUTPUT'],
    ['incomplete',()=>new Response(JSON.stringify({status:'incomplete',output:[]})),'AI_INCOMPLETE'],
    ['refusal',()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',role:'assistant',content:[{type:'refusal',refusal:'No'}]}]})),'AI_REFUSED'],
    ['tool call',()=>new Response(JSON.stringify({status:'completed',output:[{type:'function_call',name:'send_email'}]})),'AI_INVALID_OUTPUT'],
    ['provider HTTP error',()=>new Response(env.OPENAI_API_KEY,{status:429}),'AI_PROVIDER_ERROR'],
    ['oversized body',()=>new Response('x'.repeat(1_048_577)),'AI_INVALID_OUTPUT'],
  ];
  for(const [name,fixture,code] of cases)await t.test(name,async()=>{const provider=createAIProvider({env,fetchImpl:async()=>fixture()});await assert.rejects(provider.analyze(provider.prepare(context)),error=>error.code===code&&!error.message.includes(env.OPENAI_API_KEY));});
});
test('provider enforces timeout and explicit cancellation without automatic retries',async()=>{
  let calls=0;
  const provider=createAIProvider({env,timeoutMs:10,fetchImpl:async(_url,{signal})=>{calls++;await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,1000);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new Error('fixture-aborted'));},{once:true});});}});
  await assert.rejects(provider.analyze(provider.prepare(context)),error=>error.code==='AI_TIMEOUT');
  assert.equal(calls,1);
  const controller=new AbortController();controller.abort();
  await assert.rejects(provider.analyze(provider.prepare(context),{signal:controller.signal}),error=>error.code==='AI_CANCELLED');
});

async function harness(t,{aiFetch=successFetch,aiEnv=env,dbPath=':memory:',aiTimeoutMs=30000,setup=true}={}) {
  const app=createApp({dbPath,aiEnv,aiFetch,aiTimeoutMs});
  await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${app.server.address().port}`,client={};
  async function request(path,{method='GET',body,as=client}={}){
    const result=await fetch(base+'/api'+path,{method,headers:{...(as.cookie?{Cookie:as.cookie}:{}),...(method!=='GET'?{'Content-Type':'application/json','X-CSRF-Token':as.csrf??''}:{})},...(method!=='GET'?{body:JSON.stringify(body??{})}:{})});
    const data=await result.json();if(result.headers.get('set-cookie'))as.cookie=result.headers.get('set-cookie').split(';')[0];if(data.csrfToken)as.csrf=data.csrfToken;return {status:result.status,data};
  }
  const post=(path,body,options={})=>request(path,{method:'POST',body,...options});
  if(setup)assert.equal((await post('/setup',{name:'Fixture Owner',email:'owner@example.test',password:'fixture-password-123',organization:'Fixture workspace'})).status,201);
  const boot=setup?(await request('/bootstrap')).data:null;
  async function task(input={}) {return (await post('/tasks',{agentId:boot.agents.find(agent=>agent.code==='06').id,accountId:boot.accounts[0].id,title:'Review supplied evidence',input:'No external sales actions.',...input})).data;}
  t.after(()=>app.close());
  return {app,request,post,client,task,boot};
}
test('API AI run is disabled by default, owner-only and requires explicit per-call confirmation',async t=>{
  const disabled=await harness(t,{aiEnv:{},aiFetch:async()=>{throw new Error('must never be called');}});
  const queued=await disabled.task();
  assert.equal((await disabled.post(`/tasks/${queued.id}/ai-run`,{confirmProviderUse:true})).data.error.code,'AI_DISABLED');
  assert.equal((await disabled.request('/bootstrap')).data.aiProvider.enabled,false);
  const h=await harness(t),task=await h.task();
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{})).data.error.code,'AI_CONFIRMATION_REQUIRED');
  await h.post('/users',{name:'Operator',email:'operator@example.test',password:'fixture-operator-123',role:'operator'});
  const operator={};await h.post('/login',{email:'operator@example.test',password:'fixture-operator-123'},{as:operator});
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true},{as:operator})).status,403);
  const result=await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true});
  assert.equal(result.data.status,'succeeded');assert.equal(result.data.output.mode,'ai-assisted');
  assert.equal(result.data.output.cost,null);assert.equal(result.data.output.synthetic,true);
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true})).status,409);
  const boot=(await h.request('/bootstrap')).data;
  assert.equal(boot.aiProvider.usageToday,1);assert.equal(boot.stats.aiInputTokens,40);assert.equal(boot.stats.actualSpend,null);
  assert.equal(boot.aiUsage[0].status,'succeeded');
  assert.ok(!JSON.stringify(boot).includes(env.OPENAI_API_KEY));
});
test('AI reservation blocks duplicate execution and cancellation discards pending output',async t=>{
  const held=heldFetch(),h=await harness(t,{aiFetch:held.fetch}),task=await h.task();
  const running=h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true});
  await held.started;
  assert.equal((await h.request('/bootstrap')).data.aiProvider.usageToday,1);
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true})).status,409);
  assert.equal((await h.post(`/tasks/${task.id}/cancel`,{})).data.status,'cancelled');
  assert.equal((await running).data.status,'cancelled');
  assert.equal((await h.request(`/tasks/${task.id}`)).data.output,null);
  held.release();
});
test('pending AI output is discarded after kill switch, source changes or owner logout',async t=>{
  for(const change of ['kill','source','logout'])await t.test(change,async t=>{
    const held=heldFetch(),h=await harness(t,{aiFetch:held.fetch}),task=await h.task();
    const running=h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true});await held.started;
    if(change==='kill')await h.request('/settings',{method:'PATCH',body:{killSwitch:true}});
    if(change==='source')await h.request(`/accounts/${task.accountId}`,{method:'PATCH',body:{notes:'Changed while the model was running.'}});
    if(change==='logout')await h.post('/logout',{});
    held.release();const result=await running;
    assert.equal(result.data.status,'failed');assert.equal(result.data.output,null);
    assert.equal(result.data.errorCode,{kill:'AI_KILL_SWITCH',source:'AI_SOURCE_CHANGED',logout:'AI_SESSION_REVOKED'}[change]);
  });
});
test('failed attempts consume durable quota, bounded retries and no automatic resend',async t=>{
  const temp=mkdtempSync(join(tmpdir(),'axioryn-ai-')),dbPath=join(temp,'test.db');
  const opened=[];t.after(async()=>{for(const app of opened)await app.close();rmSync(temp,{recursive:true,force:true});});
  let calls=0;
  const options={dbPath,aiEnv:{...env,AXIORYN_AI_DAILY_REQUEST_LIMIT:'2'},aiFetch:async()=>{calls++;return new Response('malformed');}};
  const h=await harness(t,options),task=await h.task();
  opened.push(h.app);
  for(let i=1;i<=2;i++){const result=await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true});assert.equal(result.data.status,'failed');assert.equal(result.data.attempts,i);assert.equal(result.data.errorCode,'AI_INVALID_OUTPUT');await h.post(`/tasks/${task.id}/retry`,{});}
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true})).data.error.code,'AI_DAILY_LIMIT');assert.equal(calls,2);
  await h.app.close();
  const restarted=await harness(t,{...options,setup:false});opened.push(restarted.app);await restarted.post('/login',{email:'owner@example.test',password:'fixture-password-123'});
  assert.equal((await restarted.request('/bootstrap')).data.aiProvider.usageToday,2);
  assert.equal((await restarted.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true})).data.error.code,'AI_DAILY_LIMIT');assert.equal(calls,2);
});
test('AI reservation and audit are atomic and interrupted running jobs recover without resending',async t=>{
  let calls=0;const h=await harness(t,{aiFetch:async(...args)=>{calls++;return successFetch(...args);}}),task=await h.task();
  h.app.db.exec("CREATE TRIGGER fail_ai_audit BEFORE INSERT ON records WHEN NEW.collection='audit' AND json_extract(NEW.data,'$.action')='ai.request.reserved' BEGIN SELECT RAISE(ABORT,'fixture secret'); END;");
  assert.equal((await h.post(`/tasks/${task.id}/ai-run`,{confirmProviderUse:true})).status,500);assert.equal(calls,0);
  assert.equal((await h.request(`/tasks/${task.id}`)).data.status,'queued');assert.equal((await h.request('/bootstrap')).data.aiProvider.usageToday,0);
  h.app.db.exec('DROP TRIGGER fail_ai_audit');
  const temp=mkdtempSync(join(tmpdir(),'axioryn-ai-recovery-')),dbPath=join(temp,'test.db'),opened=[];t.after(async()=>{for(const app of opened)await app.close();rmSync(temp,{recursive:true,force:true});});
  const first=await harness(t,{dbPath,aiFetch:async()=>{throw new Error('no resend');}}),interrupted=await first.task();
  opened.push(first.app);
  const row=first.app.db.prepare("SELECT org_id,data FROM records WHERE collection='tasks' AND id=?").get(interrupted.id),timestamp=new Date().toISOString();
  first.app.db.prepare("UPDATE records SET data=? WHERE collection='tasks' AND id=?").run(JSON.stringify({...JSON.parse(row.data),status:'running',executionMode:'ai-assisted',executionId:'interrupted-request',attempts:1}),interrupted.id);
  first.app.db.prepare('INSERT INTO records VALUES (?,?,?,?,?,?)').run('aiRequests','interrupted-request',row.org_id,JSON.stringify({id:'interrupted-request',taskId:interrupted.id,day:timestamp.slice(0,10),status:'running',createdAt:timestamp,updatedAt:timestamp}),timestamp,timestamp);
  await first.app.close();const restarted=await harness(t,{dbPath,setup:false,aiFetch:async()=>{throw new Error('no resend');}});opened.push(restarted.app);await restarted.post('/login',{email:'owner@example.test',password:'fixture-password-123'});
  const recovered=(await restarted.request(`/tasks/${interrupted.id}`)).data;assert.equal(recovered.status,'failed');assert.equal(recovered.errorCode,'AI_INTERRUPTED');
  assert.equal((await restarted.request('/bootstrap')).data.aiUsage[0].status,'interrupted');
});
