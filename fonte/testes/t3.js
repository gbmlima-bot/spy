const L = require('./lib'); const OUT = __dirname + '/out/';
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const TAG = process.argv[3] || 'a';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const p = await L.page(ctx, U);
  const start = async () => { await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 90000 });
    await p.evaluate(() => { window.__mira.G.sim.t = 0.01; }); await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { timeout: 60000 }); await L.sleep(3000); };
  await p.evaluate(() => document.querySelector('#btnSoloS').click()); await start();
  // freeze the agent bot so the aim stays on it
  const aimAt = async (pick) => p.evaluate((pick) => { const M = window.__mira, S = M.G.sim; const e = pick === 'agent' ? S.ents[S.agentId] : S.ents.find(x => x.kind === 'npc' && !x.dead && x.lv === 0 && x.anim !== 1);
    e.st = 'idle'; e.timer = 999; e.path = [];
    const tgt = new THREE.Vector3(e.x, (e.y || 0) + 1.25, e.z), d = tgt.clone().sub(M.SNIPER_POS).normalize();
    M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.zoom = 8; M.snip.hold = true; return e.id; }, pick);
  const id = await aimAt('agent');
  await p.keyboard.press('Space'); await L.sleep(6000);
  await p.evaluate(() => { const M = window.__mira; M.snip.hold = true; });
  console.log('scoped', await p.evaluate(() => ({ sc: window.__mira.snip.scoped, hit: window.__mira.crosshairHit(), scopeShown: !document.querySelector('#scope').hidden, info: document.querySelector('#scopeInfo').innerText, blur: document.querySelector('#c').className })), 'target', id);
  await p.keyboard.press('f'); await L.sleep(3000);
  await p.screenshot({ path: OUT + TAG + '-scope.png', timeout: 180000 });
  console.log('marks', await p.evaluate(() => ({ m: window.__mira.snip.marks, mk: window.__mira.G.sim.mk, nb: document.querySelector('#suspectList')?.innerText })));
  await p.evaluate(() => { const c = document.querySelector('#c'); c.dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerType: 'mouse', clientX: 640, clientY: 380, bubbles: true })); });
  await L.sleep(5000);
  console.log('after shot', await p.evaluate(() => { const S = window.__mira.G.sim; return { ph: S.ph, w: S.w, why: S.why, sc: S.sc, reveal: document.querySelector('#reveal').innerText.slice(0, 500) }; }));
  await p.screenshot({ path: OUT + TAG + '-reveal.png', timeout: 180000 });
  // round 2: hit a guest of the computer
  await p.evaluate(() => document.querySelector('#btnNext').click()); await start();
  const nid = await p.evaluate(() => { const S = window.__mira.G.sim; const e = S.ents.find(x => x.kind === 'npc'); S.shoot(e.id); return e.id; });
  await L.sleep(3000);
  console.log('npc shot', await p.evaluate(() => { const S = window.__mira.G.sim; return { w: S.w, why: S.why, sc: S.sc, reveal: document.querySelector('#reveal').innerText.slice(0, 600) }; }));
  await p.screenshot({ path: OUT + TAG + '-reveal2.png', timeout: 180000 });
  await b.close();
})();
