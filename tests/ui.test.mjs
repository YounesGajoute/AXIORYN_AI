import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {esc,field,sourceLink,badge,button,date} from '../public/ui.js';

test('untrusted CRM and research values remain inert in rendered UI',()=>{
  const attack='<img src=x onerror="fetch(\'/api/export\')"> & \'test\'';
  assert.ok(!esc(attack).includes('<img'));
  assert.ok(!field('name','Company',attack).includes('<img'));
  assert.ok(!button(attack,'noop').includes('<img'));
  assert.ok(!badge(attack).includes('<img'));
  assert.ok(!sourceLink('javascript:alert(1)').includes('href'));
  assert.ok(!sourceLink('data:text/html,test').includes('href'));
  assert.ok(!sourceLink('https://user:secret@example.com/').includes('href'));
  assert.ok(sourceLink('https://example.com/?x="y"').includes('rel="noreferrer noopener"'));
});

test('editing a record preserves an existing custom status or role',()=>{
  const output=field('role','Role','Commercial buyer','select',{choices:['decision_maker','influencer']});
  assert.ok(output.includes('value="Commercial buyer" selected'));
  assert.ok(output.includes('value="decision_maker"'));
});

test('date formatting tolerates missing or invalid imported data',()=>{
  assert.equal(date('not-a-date'),'Not set');
  assert.equal(date(null),'Not set');
  assert.ok(date('2026-10-19T12:00:00Z').includes('19 Oct 2026'));
});

test('strict stylesheet policy is compatible with all dynamic UI charts',()=>{
  const source=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  const html=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
  const css=readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
  assert.ok(!/style\s*=/i.test(source+html),'No blocked inline style attributes');
  for(const n of [0,1,50,98,100]){
    assert.ok(css.includes(`.pct-${n}{width:${n}%}`));
    assert.ok(css.includes(`.height-${n}{height:${n}px}`));
  }
  assert.ok(!/onclick\s*=|onerror\s*=/i.test(html+source));
});
