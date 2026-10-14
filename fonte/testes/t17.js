// The agent on a phone held upright (390×780, touch): no keyboard words on screen, the mission card clear of the prompt
// and of the middle of the screen, every mini-challenge playable with fingers (buttons at least 44 px, a tap on a pad
// counts), the card folds with a tap. Screenshots in out/cel/. The page needs the viewport meta tag the published
// index.html carries: serve a copy with both meta tags (charset and viewport).
// node t17.js <url>
const L = require('./lib'), fs = require('fs');
const U = process.argv[2] || 'http://localhost:8765/mira-cel.html', DIR = __dirname + '/out/cel/', OUT = DIR + 'agente';
fs.mkdirSync(DIR, { recursive: true }); const bad = [];
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const p = await L.page(ctx, U);
  await p.evaluate(() => document.querySelector('#btnSoloA').click());
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 60000 });
  await p.screenshot({ path: OUT + '-0brief.png', timeout: 180000 });
  await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; if (S.ai) S.ai.update = () => {}; });
  await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { timeout: 60000 });
  await L.sleep(1500); await p.screenshot({ path: OUT + '-1play.png', timeout: 180000 });
  const info = await p.evaluate(() => ({ hints: document.querySelector('#hints').innerText, coarse: matchMedia('(pointer:coarse)').matches }));
  console.log(JSON.stringify(info)); if (!info.coarse || /WASD|Roda|<kbd>|\bE\b/.test(info.hints)) bad.push('dicas com tecla');
  const kinds = await p.evaluate(() => { const M = window.__mira, S = M.G.sim, rd = S.round, out = {};
    M.PROPS.forEach((P, pi) => { if (P.ms.some(o => S.ms.includes(o)) || (S.ts && pi === S.ts[1])) return; const o = M.missionAtProp(pi, { ms: S.ms, dn: S.dn, rd }); const k = M.makeChallenge(o, rd).k; if (!(k in out)) out[k] = pi; }); return out; });
  for (const [k, pi] of Object.entries(kinds)) {
    await p.evaluate(async pi => { const M = window.__mira, S = M.G.sim, c = M.ctrl, pr = M.PROPS[pi], e = S.ents[M.G.myEid];
      c.act = null; c.path = []; c.goal = null; c.pose = null; c.x = e.x = pr.s[0]; c.z = e.z = pr.s[1]; c.y = e.y = M.LVY(pr.lv); c.lv = e.lv = pr.lv; }, pi);
    await L.sleep(1200);
    if (k === 'seq') { await p.screenshot({ path: OUT + '-2prompt.png', timeout: 180000 }); if (await p.evaluate(() => /<kbd>/.test(document.querySelector('#promptText').innerHTML))) bad.push('prompt com tecla'); }
    await p.evaluate(() => document.querySelector('#actBtn').click());
    await L.sleep(1500);
    const r = await p.evaluate(() => { const q = s => document.querySelector(s), rect = s => { const x = q(s); if (!x || x.hidden) return null; const b = x.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
      return { act: !!window.__mira.ctrl.act, mini: q('#mini').innerText.replace(/\n/g, ' / '), prompt: rect('#prompt'), role: rect('#roleCard'), btn: rect('#actBtn'), btnText: q('#actBtn').textContent, pads: [...document.querySelectorAll('#mini button')].map(b => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }) }; });
    console.log(k, JSON.stringify(r));
    if (!r.act) bad.push(k + ': o botão não começou o ato');
    if (r.prompt && r.role && r.role[3] > r.prompt[1]) bad.push(k + ': cartão sobre o painel');
    if (r.role && r.role[3] > 780 * 0.45) bad.push(k + ': cartão no meio da tela');
    if (r.pads.some(([w, h]) => w < 44 || h < 44)) bad.push(k + ': botões pequenos');
    if (/Aperte|WASD|Esc/.test(r.mini)) bad.push(k + ': texto de tecla');
    if ((k === 'ponto' || k === 'pulso') && r.btnText !== 'Agora') bad.push(k + ': sem botão Agora');
    await p.screenshot({ path: OUT + '-3' + k + '.png', timeout: 180000 });
    if (k === 'girar' || k === 'seq') { const n = await p.evaluate(() => document.querySelectorAll('#mini button').length); if (n) { await p.tap('#mini button >> nth=0'); await L.sleep(300); const i = await p.evaluate(() => { const ch = window.__mira.ctrl.act && window.__mira.ctrl.act.ch; return ch ? ch.i + (ch.err > 0 ? 'e' : '') : 'no act'; }); console.log(k, 'toque no botão ->', i); if (i === 'no act' || (k === 'girar' && String(i) !== '1')) bad.push(k + ': toque no botão não contou'); } }
    await p.evaluate(() => { window.__mira.ctrl.act = null; });
  }
  await p.evaluate(() => { window.__mira.ctrl.act = null; }); await p.tap('#roleCard'); await L.sleep(500);
  console.log('cartão dobrado', await p.evaluate(() => { const r = document.querySelector('#roleCard').getBoundingClientRect(); return [document.querySelector('#roleCard').className, Math.round(r.top), Math.round(r.bottom)]; }));
  await p.screenshot({ path: OUT + '-4dobrado.png', timeout: 180000 });
  const fold = await p.evaluate(() => document.querySelector('#roleCard').classList.contains('min')); if (!fold) bad.push('cartão não dobra');
  console.log(bad.length ? 'FALHOU ' + bad.join('; ') : 'OK');
  await b.close();
})();
