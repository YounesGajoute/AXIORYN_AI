import test from 'node:test';
import assert from 'node:assert/strict';
import {ModuleRegistry,validateManifest} from '../server/core.mjs';
import {SALES_MANIFEST,executeSalesAgent} from '../server/sales.mjs';

const copy=()=>structuredClone(SALES_MANIFEST);
const denied=(fn,code)=>assert.throws(fn,error=>error.code===code);
test('Core registers a versioned bounded Sales module without a domain dependency',()=>{
  const registry=new ModuleRegistry();
  const registered=registry.register(SALES_MANIFEST);
  assert.equal(registered.version,'1.0');
  assert.equal(registered.agents.length,11);
  assert.ok(Object.isFrozen(registered.agents[0]));
  assert.equal(registry.assertAllowed({moduleId:'sales',agentCode:'01',tool:'local-read',actorOrgId:'one',targetOrgId:'one'}).name,'CAI Sales Manager');
  assert.equal(registry.assertAllowed({moduleId:'sales',agentCode:'08',tool:'template-output',actorOrgId:'one',targetOrgId:'one'}).code,'08');
  denied(()=>registry.register(SALES_MANIFEST),'DUPLICATE_MODULE');
});
test('Core rejects invalid manifests, duplicate agents and incompatible schemas',()=>{
  denied(()=>validateManifest(null),'INVALID_MANIFEST');
  const schema=copy();schema.schemaVersion=2;denied(()=>validateManifest(schema),'SCHEMA_MISMATCH');
  const duplicate=copy();duplicate.agents.push(duplicate.agents[0]);denied(()=>validateManifest(duplicate),'INVALID_AGENT');
  const agentSchema=copy();agentSchema.agents[0].outputSchemaVersion=2;denied(()=>validateManifest(agentSchema),'SCHEMA_MISMATCH');
  const retries=copy();retries.agents[0].maxAttempts=4;denied(()=>validateManifest(retries),'INVALID_LIMIT');
  const timeout=copy();timeout.agents[0].timeoutMs=6000;denied(()=>validateManifest(timeout),'INVALID_LIMIT');
});
test('Core denies foreign permissions, tenants and all undeclared or live capabilities',()=>{
  const permissions=copy();permissions.agents[0].permissions.push('tenant:all');denied(()=>validateManifest(permissions),'PERMISSION_DENIED');
  const live=copy();live.tools.push('email-send');denied(()=>validateManifest(live),'CAPABILITY_DENIED');
  const selfGrant=copy();selfGrant.agents[0].tools.push('publish');denied(()=>validateManifest(selfGrant),'CAPABILITY_DENIED');
  const registry=new ModuleRegistry();registry.register(SALES_MANIFEST);
  const context={moduleId:'sales',agentCode:'01',tool:'local-read',actorOrgId:'one',targetOrgId:'one'};
  denied(()=>registry.assertAllowed({...context,targetOrgId:'two'}),'TENANT_DENIED');
  denied(()=>registry.assertAllowed({...context,actorOrgId:''}),'TENANT_DENIED');
  denied(()=>registry.assertAllowed({...context,agentCode:'99'}),'AGENT_NOT_REGISTERED');
  denied(()=>registry.assertAllowed({...context,tool:'email-send'}),'CAPABILITY_DENIED');
  denied(()=>registry.assertAllowed({...context,tool:'network'}),'CAPABILITY_DENIED');
  denied(()=>registry.assertAllowed({...context,moduleId:'unknown'}),'MODULE_NOT_FOUND');
});
test('Sales template output records its schema and prompt version and leaves unknowns explicit',()=>{
  const output=executeSalesAgent({agent:SALES_MANIFEST.agents.find(agent=>agent.code==='05'),account:null,task:{title:'Map the buying committee'},accounts:[],contacts:[],opportunities:[],intelligence:[],strategy:{objective:'Test'},stats:{},generatedAt:'2026-10-19T12:00:00.000Z'});
  assert.equal(output.schemaVersion,1);
  assert.equal(output.promptVersion,'sales-template-v1.0');
  assert.equal(output.moduleVersion,'1.0');
  assert.ok(output.summary.includes('unknown'));
  assert.equal(output.externalActions,0);
  assert.equal(output.cost,0);
});
