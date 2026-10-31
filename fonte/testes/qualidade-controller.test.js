const { test } = require('node:test'), assert = require('node:assert/strict');
const { Quality, profiles } = require('../web/qualidade');
const storage = value => ({ value, getItem() { return this.value; }, setItem(k,v) { this.value=v; } });
function advance(q, from, seconds, fps, valid=true) { for(let t=from;t<from+seconds*1000;t+=1000/fps)q.sample(t,valid); }
test('starts balanced and honors valid saved manual choices',()=>{assert.equal(new Quality(storage()).tier,'balanced');assert.equal(new Quality(storage('low')).tier,'low');assert.equal(new Quality(storage('bogus')).mode,'auto');});
test('manual mode never adapts and persists',()=>{const s=storage(),q=new Quality(s);q.set('high',0);advance(q,0,60,10);assert.equal(q.tier,'high');assert.equal(s.value,'high');assert.throws(()=>q.set('missing'));});
test('two slow windows lower quality; cooldown prevents oscillation',()=>{const q=new Quality(storage());advance(q,1,10,30);assert.equal(q.tier,'low');const changed=q.lastChange;advance(q,10001,5,60);assert.equal(q.tier,'low');assert.equal(q.lastChange,changed);});
test('sustained headroom restores quality, not just degradation',()=>{const q=new Quality(storage());advance(q,1,10,30);advance(q,10001,30,60);assert.notEqual(q.tier,'low');});
test('hidden/loading samples and reset exclude idle time',()=>{const q=new Quality(storage());advance(q,1,20,10,false);assert.equal(q.tier,'balanced');q.reset(50000);advance(q,50001,2,10);assert.equal(q.tier,'balanced');});
test('slow wall time is measured even below the simulation dt clamp',()=>{const q=new Quality(storage());advance(q,1,14,2);assert.equal(q.tier,'low');});
test('low profile scales within bounds and manual selection resets it',()=>{const q=new Quality(storage());advance(q,1,80,20);assert.equal(q.scale,.75);q.set('low',90000);assert.equal(q.scale,1);assert.equal(profiles.low.samples,0);});
test('storage denied is harmless',()=>{const q=new Quality({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});q.set('balanced',0);assert.equal(q.tier,'balanced');});

test('profile snapshots are reused until settings change',()=>{const q=new Quality(storage());const a=q.snapshot();assert.equal(q.snapshot(),a);q.set('low',0);assert.notEqual(q.snapshot(),a);assert.equal(q.snapshot().tier,'low');assert.ok(Object.isFrozen(q.snapshot()));});
