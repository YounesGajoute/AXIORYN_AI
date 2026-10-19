export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  building:'<path d="M4 21V5l8-3 8 3v16M2 21h20M9 21v-5h6v5M8 7h1m6 0h1M8 11h1m6 0h1"/>',
  chart:'<path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  megaphone:'<path d="m3 9 14-5v16L3 15V9Zm14 0h3v6h-3M5 16l2 5h3l-2-4"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  bot:'<rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8M1 11v5m22-5v5"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  settings:'<path d="m10 3-.5 3-2.5 1-2.5-1-2 3L5 11v2l-2.5 2 2 3L7 17l2.5 1L10 21h4l.5-3 2.5-1 2.5 1 2-3-2.5-2v-2l2.5-2-2-3L17 7l-2.5-1L14 3h-4Z"/><circle cx="12" cy="12" r="3"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-16a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-3-5"/>',
  play:'<path d="m8 4 13 8L8 20V4Z"/>',
  pause:'<path d="M8 4v16M16 4v16"/>',
  logout:'<path d="M9 3H4v18h5m5-14 5 5-5 5M8 12h13"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  file:'<path d="M5 3h9l5 5v13H5V3Zm9 0v6h5M8 13h8m-8 4h6"/>',
  edit:'<path d="m15 4 5 5M4 20l4-1L21 6l-5-5L3 14l-1 8 8-2"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
  link:'<path d="m10 13 4-4m-6 8-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 0 1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5M5 8a8 8 0 0 1 13-3l2 2M4 17l2 2a8 8 0 0 0 13-3"/>',
  alert:'<path d="m12 3 10 18H2L12 3ZM12 9v5m0 3h.01"/>',
};
export const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.file}</svg>`;
export const initials = name => String(name || 'A').split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase();
export const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
export const compact = n => new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(Number(n)||0);
export function date(value, options = {}) {
  if (!value || Number.isNaN(new Date(value).getTime())) return 'Not set';
  return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'Africa/Casablanca',...options}).format(new Date(value));
}
export function ago(value) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed)) return '';
  if (elapsed < 60000) return 'Just now';
  if (elapsed < 3600000) return `${Math.floor(elapsed/60000)}m ago`;
  if (elapsed < 86400000) return `${Math.floor(elapsed/3600000)}h ago`;
  return date(value,{year:undefined});
}
export const label = value => String(value || 'unknown').replace(/[_.-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bAi\b/g,'AI').replace(/\bCrm\b/g,'CRM').replace(/\bLinkedin\b/g,'LinkedIn');
export function badge(value) {
  const v = String(value || 'draft').toLowerCase();
  let color='';
  if (/approved|qualified|won|succeed|complete|ready|active/.test(v)) color='green';
  if (/pending|review|queued|proposal|negotiat|planned/.test(v)) color='amber';
  if (/rejected|failed|lost|suppress|cancel|dead|paused|invalid|expired/.test(v)) color='red';
  if (/discovery|new|draft|research/.test(v)) color='blue';
  return `<span class="badge ${color}">${esc(label(v))}</span>`;
}
export const button = (text,action,kind='',ico='',extra='') => `<button type="button" class="btn ${kind}" data-action="${esc(action)}" ${extra}>${ico?icon(ico):''}${esc(text)}</button>`;
export const empty = (title,description,action='') => `<div class="empty">${icon('layers')}<h3>${esc(title)}</h3><p>${esc(description)}</p>${action}</div>`;
export const panel = (title,content,aside='',description='') => `<section class="panel"><div class="panel-head"><div><h2>${esc(title)}</h2>${description?`<p>${esc(description)}</p>`:''}</div>${aside}</div>${content}</section>`;
export const heading = (eyebrow,title,description,actions='',level=1) => `<div class="page-heading"><div><div class="eyebrow">${esc(eyebrow)}</div><h${level===2?2:1}>${esc(title)}</h${level===2?2:1}><p>${esc(description)}</p></div><div class="heading-actions">${actions}</div></div>`;
export const table = (headers,rows,cls='') => `<div class="table-wrap"><table class="table ${cls}"><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
export const metric = (title,value,foot,ico='chart',extra='') => `<div class="metric"><div class="label">${esc(title)}${icon(ico)}</div><div class="value">${esc(value)}</div><div class="foot">${extra?`<span class="trend">${esc(extra)}</span>`:''}${esc(foot)}</div></div>`;
export function sourceLink(url,text='View source') {
  try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol)||u.username||u.password) return '<span class="tiny muted">Source not linked</span>';return `<a class="source-link" href="${esc(u.href)}" target="_blank" rel="noreferrer noopener">${esc(text)} ↗</a>`;}catch{return '<span class="tiny muted">Owner-provided / unverified</span>';}
}
export function field(name,title,value='',type='text',options={}) {
  const attrs=`name="${esc(name)}" id="field-${esc(name)}" ${options.required?'required':''} ${options.min!==undefined?`min="${esc(options.min)}"`:''} ${options.max!==undefined?`max="${esc(options.max)}"`:''} ${options.minlength?`minlength="${esc(options.minlength)}"`:''} ${options.maxlength?`maxlength="${esc(options.maxlength)}"`:''} ${options.placeholder?`placeholder="${esc(options.placeholder)}"`:''}`;
  let input;
  if(type==='textarea') input=`<textarea ${attrs}>${esc(value)}</textarea>`;
  else if(type==='select') {
    const choices=[...(options.choices||[])];
    if(value&&!choices.some(v=>String(Array.isArray(v)?v[0]:v)===String(value)))choices.unshift([value,label(value)]);
    input=`<select ${attrs}>${choices.map(v=>{const [val,text]=Array.isArray(v)?v:[v,label(v)];return `<option value="${esc(val)}" ${String(value)===String(val)?'selected':''}>${esc(text)}</option>`;}).join('')}</select>`;
  }
  else input=`<input type="${esc(type)}" ${attrs} value="${esc(value)}" ${type==='number'?'step="any"':''}>`;
  return `<label class="field ${options.full?'full':''}" for="field-${esc(name)}">${esc(title)}${input}${options.hint?`<small>${esc(options.hint)}</small>`:''}</label>`;
}
