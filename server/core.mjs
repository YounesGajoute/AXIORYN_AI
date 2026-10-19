/** Core owns module eligibility and policy; it has no knowledge of a sales domain. */
export const CORE_SCHEMA_VERSION = 1;
export const CORE_POLICY = Object.freeze({
  tools: Object.freeze(['local-read','template-output']),
  permissions: Object.freeze(['tenant:read','local-output:write']),
  maxAttempts: 3,
  maxTimeoutMs: 5000,
});

export class CorePolicyError extends Error {
  constructor(code,message) { super(message); this.name='CorePolicyError'; this.code=code; }
}
function reject(code,message) { throw new CorePolicyError(code,message); }
function freezeDeep(value) { if(value&&typeof value==='object') { Object.values(value).forEach(freezeDeep);Object.freeze(value); } return value; }
function text(value) { return typeof value==='string'&&value.trim().length>0; }
function distinctStrings(value) { return Array.isArray(value)&&value.every(text)&&new Set(value).size===value.length; }

export function validateManifest(manifest) {
  if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))reject('INVALID_MANIFEST','A module manifest object is required.');
  if(!/^[a-z][a-z0-9-]{1,63}$/.test(manifest.id??'')||!/^\d+\.\d+(?:\.\d+)?$/.test(manifest.version??''))reject('INVALID_MANIFEST','A valid module ID and version are required.');
  if(manifest.schemaVersion!==CORE_SCHEMA_VERSION)reject('SCHEMA_MISMATCH','The module manifest schema is incompatible with Core.');
  if(!distinctStrings(manifest.tools)||manifest.tools.length===0||manifest.tools.some(tool=>!CORE_POLICY.tools.includes(tool)))reject('CAPABILITY_DENIED','The module requests an unavailable tool or live capability.');
  if(!Array.isArray(manifest.agents)||manifest.agents.length===0)reject('INVALID_MANIFEST','A module must declare at least one bounded agent.');
  const codes=new Set();
  for(const agent of manifest.agents) {
    if(!agent||typeof agent!=='object'||!/^\d{2}$/.test(agent.code??'')||codes.has(agent.code)||!text(agent.name)||!text(agent.description)||!text(agent.promptVersion))reject('INVALID_AGENT','Agent identities, descriptions and prompt versions must be unique and valid.');
    codes.add(agent.code);
    if(agent.inputSchemaVersion!==CORE_SCHEMA_VERSION||agent.outputSchemaVersion!==CORE_SCHEMA_VERSION)reject('SCHEMA_MISMATCH','The agent input/output schema is incompatible with Core.');
    if(!distinctStrings(agent.tools)||agent.tools.length===0||agent.tools.some(tool=>!manifest.tools.includes(tool)))reject('CAPABILITY_DENIED','An agent cannot grant itself module tools or live capabilities.');
    if(!distinctStrings(agent.permissions)||agent.permissions.some(permission=>!CORE_POLICY.permissions.includes(permission)))reject('PERMISSION_DENIED','Agent permissions must remain tenant-scoped and locally bounded.');
    if(!Number.isInteger(agent.maxAttempts)||agent.maxAttempts<1||agent.maxAttempts>CORE_POLICY.maxAttempts||!Number.isInteger(agent.timeoutMs)||agent.timeoutMs<1||agent.timeoutMs>CORE_POLICY.maxTimeoutMs)reject('INVALID_LIMIT','Agent retry and timeout limits exceed Core policy.');
  }
  return freezeDeep(structuredClone(manifest));
}

export class ModuleRegistry {
  #modules=new Map();
  register(manifest) {
    const validated=validateManifest(manifest);
    if(this.#modules.has(validated.id))reject('DUPLICATE_MODULE','A module with this identity is already registered.');
    this.#modules.set(validated.id,validated);
    return validated;
  }
  get(moduleId) { const module=this.#modules.get(moduleId);if(!module)reject('MODULE_NOT_FOUND','The requested module is not registered.');return module; }
  list() { return [...this.#modules.values()]; }
  assertModelService({moduleId,agentCode,actorOrgId,targetOrgId,actorRole,ownerConfirmed,providerEnabled}) {
    if(actorRole!=='owner'||ownerConfirmed!==true||providerEnabled!==true)reject('MODEL_SERVICE_DENIED','Model analysis requires an enabled Core service and explicit owner confirmation for this request.');
    this.assertAllowed({moduleId,agentCode,tool:'local-read',actorOrgId,targetOrgId});
    return this.assertAllowed({moduleId,agentCode,tool:'template-output',actorOrgId,targetOrgId});
  }
  assertAllowed({moduleId,agentCode,tool,actorOrgId,targetOrgId}) {
    if(!text(actorOrgId)||!text(targetOrgId)||actorOrgId!==targetOrgId)reject('TENANT_DENIED','Core denies access outside the authenticated organization.');
    const module=this.get(moduleId);
    const agent=module.agents.find(item=>item.code===agentCode);
    if(!agent)reject('AGENT_NOT_REGISTERED','This agent is not registered with Core.');
    if(!CORE_POLICY.tools.includes(tool)||!module.tools.includes(tool)||!agent.tools.includes(tool))reject('CAPABILITY_DENIED','This capability is not enabled by Core. All live capabilities are disabled.');
    if(tool==='local-read'&&!agent.permissions.includes('tenant:read')||tool==='template-output'&&!agent.permissions.includes('local-output:write'))reject('PERMISSION_DENIED','This agent lacks the required tenant-scoped permission.');
    return agent;
  }
}
