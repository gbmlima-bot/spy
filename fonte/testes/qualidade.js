// Qualidade de imagem: captura de cada mapa na vista larga do sniper, na luneta mirando um convidado e de perto (vista do
// agente, câmera isométrica com zoom), em tela de 1280×720 com densidade 1 (o pior caso para serrilhado).
// node qualidade.js <url> <pasta> [mapas] [rotulo]   →  <pasta>/<rotulo>-<mapa>-{largo,luneta,perto}.png
//  DPR=2 simula tela de alta densidade; o jogo usa o que o navegador informa.
//  AB=1: em vez da tela, grava o mesmo quadro duas vezes, com FXAA e MSAA 4× no pós-processamento (…-fxaa.png, …-msaa.png).
const L = require('./lib'), fs = require('fs');
const [U, OUT = 'fonte/testes/out/qualidade', MAPS_ = '0,1,2,3,4,5,6,7,8,9,10', TAG = 'q'] = process.argv.slice(2);
const MAPS = MAPS_.split(',');
const PROFILE = process.env.QUALITY || 'high';
if (!['high', 'balanced', 'low'].includes(PROFILE)) throw Error('Use a fixed QUALITY profile');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: +(process.env.DPR || 1) });
  await ctx.addInitScript(profile => { localStorage.setItem('mira-quality', profile); window.__benchmarkSeed = 714025; window.__noIntro = true; }, PROFILE);
  const p = await L.page(ctx, U);
  const shot = async name => {
    if (!process.env.AB) return p.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
    const r = await p.evaluate(() => {
      const M = window.__mira, out = [];
      for (const n of [0, 4]) { M.rebuildPost(n); if (M.renderOnce) M.renderOnce(); else M.composer.render(0); out.push(M.renderer.domElement.toDataURL('image/png')); }
      return out;
    });
    fs.writeFileSync(`${OUT}/${TAG}-${name}-fxaa.png`, Buffer.from(r[0].split(',')[1], 'base64'));
    fs.writeFileSync(`${OUT}/${TAG}-${name}-msaa.png`, Buffer.from(r[1].split(',')[1], 'base64'));
  };
  const still = () => p.evaluate(profile => { const M = window.__mira; if (M.quality) { if (M.quality.mode !== profile) M.quality.set(profile); } else { M.FPS.t = -1e9; if (!M.postMS) M.rebuildPost(4); } }, PROFILE); // the adaptive quality would drop the pixel ratio and the antialias in swiftshader
  for (const id of MAPS) {
    await p.evaluate(id => { document.querySelector('#mapSel').value = String(id); document.querySelector('#btnSoloS').click(); }, id);
    await p.waitForFunction(() => { const M = window.__mira; return M.G.sim && M.G.screen === 'game' && M.G.seed === M.G.sim.seed && M.CHARS().length > 10; }, null, { timeout: 180000, polling: 100 });
    await still(); await L.sleep(3500);
    await p.evaluate(() => document.querySelectorAll('.brief,#brief,.card').forEach(e => e.style.visibility = 'hidden'));
    await shot(id + '-largo');
    // scope on the guest nearest the middle of the scene
    await p.evaluate(() => {
      const M = window.__mira, S = M.G.sim, T = THREE, E = M.SNIPER_POS;
      const es = S.ents.filter(e => !e.dead); const c = es.reduce((a, e) => a.add(new T.Vector3(e.x, 0, e.z)), new T.Vector3()).divideScalar(es.length);
      const e = es.sort((a, b) => Math.hypot(a.x - c.x, a.z - c.z) - Math.hypot(b.x - c.x, b.z - c.z))[0];
      const d = new T.Vector3(e.x, (e.y || 0) + 1.3, e.z).sub(E).normalize();
      M.setScope?.(true); M.snip.scoped = true; M.snip.zoom = 5; M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; M.snip.kick = 0;
      window.__qlock = setInterval(() => { M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; }, 16);
    });
    await still(); await L.sleep(1500);
    await p.waitForFunction(() => { const M = window.__mira; return M.composer.passes[0].camera === M.scopeCam; }, null, { timeout: 180000, polling: 100 });
    await shot(id + '-luneta');
    await p.evaluate(() => { clearInterval(window.__qlock); const M = window.__mira; M.G.sim.ph = 'reveal'; document.querySelector('#btnMenu').click(); });
    await L.sleep(1500);
    // close up from the agent's side
    await p.evaluate(id => { document.querySelector('#mapSel').value = String(id); document.querySelector('#btnSoloA').click(); }, id);
    await p.waitForFunction(() => { const M = window.__mira; return M.G.sim && M.G.screen === 'game' && M.G.seed === M.G.sim.seed && M.CHARS().length > 10; }, null, { timeout: 180000, polling: 100 });
    await p.evaluate(() => { window.__mira.isoState.zoom = 3.2; });
    await still(); await L.sleep(3500);
    await shot(id + '-perto');
    const info = await p.evaluate(() => { const M = window.__mira, r = M.renderer; return { pr: r.getPixelRatio(), gl2: r.capabilities.isWebGL2, samples: r.capabilities.maxSamples }; });
    console.log(`${TAG} mapa ${id}`, JSON.stringify(info));
    await p.evaluate(() => { const M = window.__mira; M.G.sim.ph = 'reveal'; document.querySelector('#btnMenu').click(); });
    await L.sleep(1500);
  }
  await b.close();
})();
