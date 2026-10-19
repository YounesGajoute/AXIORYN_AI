/** Sales domain: versioned local templates and explicitly fictional starter records. */
const RAW_AGENT_DEFINITIONS = [
  ['01', 'CAI Sales Manager', 'Coordinate the sales strategy, bounded assignments, validation and reporting.'],
  ['02', 'Brand Identity & LinkedIn Agent', 'Prepare brand positioning and LinkedIn content proposals.'],
  ['03', 'Global Competitor Intelligence Agent', 'Compare supplied competitor evidence and identify research gaps.'],
  ['04', 'Industrial Company Discovery Agent', 'Assess supplied industrial company records and discovery criteria.'],
  ['05', 'Contact Intelligence & Buying Committee Agent', 'Map supplied contacts and buying committee coverage.'],
  ['06', 'Lead Qualification Agent', 'Score recorded evidence and explain qualification gaps.'],
  ['07', 'Marketing Content Intelligence Agent', 'Prepare source-linked marketing content templates.'],
  ['08', 'Personalized Outreach Agent', 'Prepare grounded outreach templates for human review.'],
  ['09', 'Follow-up & Account Strategy Agent', 'Suggest account next steps and follow-up timing.'],
  ['10', 'CRM & Opportunity Management Agent', 'Review CRM completeness and opportunity records.'],
  ['11', 'Sales Analytics & Optimization Agent', 'Summarize measured local pipeline and workflow metrics.'],
];


export const AGENT_DEFINITIONS = Object.freeze(RAW_AGENT_DEFINITIONS.map(([code,name,description])=>Object.freeze({code,name,description,tools:Object.freeze(['local-read','template-output']),permissions:Object.freeze(['tenant:read','local-output:write']),maxAttempts:3,timeoutMs:5000,promptVersion:'sales-template-v1.0',inputSchemaVersion:1,outputSchemaVersion:1})));
export const SALES_MANIFEST = Object.freeze({id:'sales',version:'1.0',schemaVersion:1,tools:Object.freeze(['local-read','template-output']),agents:AGENT_DEFINITIONS});

export function seedSalesRecords({put,orgId,now}) {
    const accounts = [
      { name: 'Atlas Precision Works', industry: 'Industrial manufacturing', country: 'Morocco', website: 'https://atlas-precision.example', status: 'qualified', score: 88, source: 'Synthetic demonstration dataset', notes: 'Fictional mid-market manufacturer evaluating production efficiency.' },
      { name: 'Nordwerk Automation', industry: 'Industrial automation', country: 'Germany', website: 'https://nordwerk.example', status: 'contacted', score: 81, source: 'Synthetic demonstration dataset', notes: 'Fictional automation integrator with an equipment modernization initiative.' },
      { name: 'Iberia Process Systems', industry: 'Process engineering', country: 'Spain', website: 'https://iberia-process.example', status: 'new', score: 64, source: 'Synthetic demonstration dataset', notes: 'Fictional process engineering company. Validate needs before qualification.' },
      { name: 'Maghreb Packaging Labs', industry: 'Packaging', country: 'Morocco', website: 'https://maghreb-packaging.example', status: 'qualified', score: 76, source: 'Synthetic demonstration dataset', notes: 'Fictional packaging business exploring quality monitoring.' },
    ].map(data => put('accounts', orgId, { ...data, synthetic: true }));
    const contactDefs = [ ['Samira Benali','Operations Director','samira@atlas-precision.example','decision_maker'], ['Lukas Weber','Engineering Lead','lukas@nordwerk.example','technical_buyer'], ['Elena Martín','Procurement Manager','elena@iberia-process.example','economic_buyer'], ['Amine Idrissi','Plant Manager','amine@maghreb-packaging.example','champion'] ];
    const contacts = contactDefs.map(([name,title,mail,role], index) => put('contacts', orgId, { accountId: accounts[index].id, name, title, email: mail, role, confidence: 80 + index, suppressed: false, source:'Synthetic demonstration dataset', synthetic: true }));
    [['Efficiency discovery',0,'qualified',42000],['Modernization pilot',1,'proposal',78000],['Quality monitoring review',3,'discovery',28000]].forEach(([name,index,stage,value]) => put('opportunities', orgId, { name, accountId: accounts[index].id, stage, value, notes:'Fictional demonstration opportunity.', synthetic: true }));
    SALES_MANIFEST.agents.forEach(agent => put('agents',orgId,{...agent,number:Number(agent.code),status:'ready',mode:'deterministic-local',capabilities:['Read tenant records','Prepare reviewable recommendations'],externalToolsEnabled:false,synthetic:false},`agent-${agent.code}-${orgId.slice(0,8)}`));
    put('campaigns', orgId, { name: 'Industrial efficiency discovery', objective: 'Review needs with a small, qualified buying committee.', audience: 'Industrial operations leaders', channel: 'email', budget: 3500, status: 'draft', draftId: '', notes:'Fictional plan. No external execution is scheduled.', synthetic: true });
    put('intelligence', orgId, { title: 'Modernization discovery hypothesis', kind: 'market', summary: 'Synthetic scenario: manufacturers may evaluate modernization when downtime and quality concerns arise. This is a hypothesis for discovery, not verified market research.', sourceUrl: '', confidence: 35, observedAt: now(), synthetic: true });
    put('followups', orgId, { contactId: contacts[0].id, draftId: '', dueAt: new Date(new Date(now()).getTime() + 2 * 86400000).toISOString(), status: 'planned', notes: 'Prepare a discovery agenda after validating the fictional account.', synthetic: true });
    put('knowledge',orgId,{title:'Industrial discovery conversation guide',kind:'guideline',summary:'Fictional starter guidance: ask about operational priorities, confirm evidence, and avoid unsupported product performance claims. Replace with approved brand and product material.',sourceUrl:'',verified:false,synthetic:true});
    put('content',orgId,{title:'Industrial efficiency discovery brief',audience:'Industrial operations leaders',productFamily:'Example industrial solutions',body:'Template: describe a verified operational problem, present a supported capability, and invite a discovery conversation.',evidence:'Fictional example. No product claims have been verified.',visualBrief:'Concept only: a clean industrial operations illustration.',callToAction:'Would a short discovery conversation be useful?',language:'English',status:'draft',scheduledAt:'',synthetic:true});
    put('meetings',orgId,{accountId:accounts[0].id,contactId:contacts[0].id,title:'Example discovery review',scheduledAt:new Date(new Date(now()).getTime()-86400000).toISOString(),status:'completed',notes:'Fictional completed meeting example. No real meeting occurred.',synthetic:true});
    put('proposals',orgId,{accountId:accounts[0].id,opportunityId:'',title:'Example efficiency assessment',scope:'Illustrative proposal scope. Validate needs, deliverables, commercial terms and product claims before review.',value:42000,status:'draft',notes:'Fictional planning record. No proposal has been sent or accepted externally.',synthetic:true});
}

export function executeSalesAgent({agent,account,task,accounts,contacts,opportunities,intelligence,knowledge=[],strategy,stats,generatedAt}) {
    const relevant = account?contacts.filter(item=>item.accountId===account.id):contacts;
    const sourceRecordIds = account?[account.id,...relevant.map(item=>item.id)]:accounts.map(item=>item.id);
    const target = account?.name??'the current workspace';
    const code = agent.code;
    const usesKnowledge = ['02','07','08'].includes(code);
    const verifiedKnowledge = knowledge.filter(item=>item.verified);
    if (usesKnowledge) sourceRecordIds.push(...knowledge.map(item=>item.id));
    const knowledgeNote = `${verifiedKnowledge.length} owner-verified knowledge records and ${knowledge.length-verifiedKnowledge.length} unverified records available. ${verifiedKnowledge.length?`Approved reference titles: ${verifiedKnowledge.map(item=>item.title).join('; ')}.`:'Product and brand claims remain unknown until approved evidence is recorded.'}`;
    const messages = {
      '01': [`Review the objective: ${strategy.objective}`,`Prioritize ${account?account.name:`${accounts.length} recorded accounts`} by evidence completeness.`, 'Assign discovery, qualification and draft work to specialist agents; require human review before local delivery simulation.'],
      '02': [`Positioning template for ${target}: describe your verified offering and ask about a concrete operational priority.`,knowledgeNote, 'Prepare a LinkedIn content brief using approved brand claims. No account is connected and no publication is scheduled.'],
      '03': [`${intelligence.filter(item=>item.kind==='competitor').length} competitor intelligence records available.`, 'Record competitor sources, observed dates and uncertainty before comparing claims. No external research was performed.'],
      '04': account?[`${account.name}: ${account.industry||'industry unknown'}, ${account.country||'country unknown'}.`,`Source: ${account.source}.`,`Validate the website and current business needs before qualification.`]:[`${accounts.length} companies recorded.`, 'Add companies from permitted, verified sources and retain provenance. No companies were discovered externally.'],
      '05': [`${relevant.length} recorded contacts for ${target}.`,...relevant.map(contact=>`${contact.name}: ${contact.title||'title unknown'}; buying role ${contact.role||'unknown'}; confidence ${contact.confidence}/100.`),'Treat missing buying committee roles as unknown. Never infer personal contact details.'],
      '06': account?[`Recorded qualification score: ${account.score}/100. Status: ${account.status}.`,`Evidence: ${account.source}.`,`Coverage: ${relevant.length} contacts. Verify need, authority, budget and timing before moving stage.`]:[`${accounts.filter(item=>item.score>=70).length} accounts have recorded scores of at least 70.`, 'Scores are entered CRM values; they are not verified predictive probabilities.'],
      '07': [`Content template: explain a verified ${account?.industry||'industrial'} challenge, describe an approved capability, and close with a discovery question.`,knowledgeNote, 'Validate every factual claim and review brand tone before approving content.'],
      '08': [`Prepare an outreach template for ${target} from recorded company and contact fields.`,knowledgeNote, 'Use the Drafts workspace to generate a source-linked template, edit it and request exact-content approval.'],
      '09': [`Plan a discovery follow-up for ${target}.`,`${relevant.filter(item=>item.suppressed).length} recorded contacts are suppressed.`, 'Confirm the next step with the buyer; respect quiet hours, contact limits and suppression. Create a planned follow-up without sending anything.'],
      '10': [`${opportunities.filter(item=>!account||item.accountId===account.id).length} matching opportunities.`,`${relevant.filter(item=>!item.title||!item.role).length} matching contact records lack title or buying role.`, 'Review duplicates, evidence and stage exit criteria before updating CRM records.'],
      '11': [`Open pipeline value: ${stats.pipelineValue}. Won value: ${stats.wonValue}.`,`${stats.completedTasks} completed local tasks; ${stats.simulations} local delivery simulations; 0 external sends.`, 'These metrics are measured from the local database. They do not measure revenue attribution or external campaign performance.'],
    };
    return { schemaVersion:1,promptVersion:agent.promptVersion,moduleVersion:SALES_MANIFEST.version,mode:'deterministic-local', title:`${agent.name}: ${task.title}`, summary:messages[code].join('\n'), recommendations:messages[code], sourceRecordIds, evidence:account?[{id:account.id,kind:'account',source:account.source,synthetic:account.synthetic}]:[{kind:'local-database',recordCount:accounts.length}], warnings:['No AI model, web research or external delivery provider is connected.','Task input and source text are retained as data and never executed as instructions.',...(account?.synthetic?['This output uses fictional demonstration data.']:[])], confidence:account?Math.min(account.score,65):40, generatedAt:generatedAt, externalActions:0, cost:0 };
  }
