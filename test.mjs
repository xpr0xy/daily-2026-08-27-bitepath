import assert from 'node:assert/strict';import {DEFAULT,PRESETS,render,wavBytes,normalized} from './synth.js';
const hash=a=>{let h=2166136261;for(const v of a){const n=Math.round((v+1)*30000);h=Math.imul(h^(n&255),16777619);h=Math.imul(h^(n>>8),16777619)}return h>>>0};
const base=render(DEFAULT), h=hash(base.left);assert.equal(hash(render(DEFAULT).left),h,'same state must match');
for(const key of ['root','duration','spread','sub','bite','drive','tail']){const s=normalized(DEFAULT);s[key]=key==='duration'?1.9:s[key]+(key==='root'?5:17);assert.notEqual(hash(render(s).left),h,`${key} must change audio`)}
for(let i=0;i<8;i++){const s=normalized(DEFAULT);s.path[i][1]=s.path[i][1]>.5?.07:.93;assert.notEqual(hash(render(s).left),h,`path ${i} must change audio`)}
for(const [name,p] of Object.entries(PRESETS))assert.notEqual(hash(render(p).left),h,`${name} job must differ`);
const a=wavBytes(DEFAULT),b=wavBytes(DEFAULT);assert.deepEqual(a,b);assert.equal(new TextDecoder().decode(a.slice(0,4)),'RIFF');assert.ok(a.length>100000);console.log(`PASS deterministic=${h} wav=${a.length} bytes jobs=${Object.keys(PRESETS).length}`);
