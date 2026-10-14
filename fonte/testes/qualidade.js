// Qualidade de imagem: captura de cada mapa na vista larga do sniper, na luneta mirando um convidado e de perto (vista do
// agente, câmera isométrica com zoom), em tela de 1280×720 com densidade 1 (o pior caso para serrilhado).
// node qualidade.js <url> <pasta> [mapas] [rotulo]   →  <pasta>/<rotulo>-<mapa>-{largo,luneta,perto}.png
//  DPR=2 simula tela de alta densidade; o jogo usa o que o navegador informa.
//  AB=1: em vez da tela, grava o mesmo quadro duas vezes, sem e com o antialias do pós-processamento (…-sem.png, …-com.png).
const L = require('./lib'), fs = require('fs');
const [U, OUT = 'fonte/testes/out/qualidade', MAPS_ = '0,1,2,3,4,5,6,7,8,9,10', TAG = 'q'] = process.argv.slice(2);
const MAPS = MAPS_.split(',').map(Number);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: +(process.env.DPR || 1) });
  const p = await L.page(ctx, U);
  const shot = async name => {
    if (!process.env.AB) return p.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
    const r = await p.evaluate(() => {
      const M = window.__mira, out = [];
      for (const n of [0, 4]) { const c = M.composer; c.renderTarget1.dispose(); c.renderTarget2.dispose(); M.setupPost(n); M.composer.render(0); out.push(M.renderer.domElement.toDataURL('image/png')); }
      return out;
    });
    fs.writeFileSync(`${OUT}/${TAG}-${name}-sem.png`, Buffer.from(r[0].split(',')[1], 'base64'));
    fs.writeFileSync(`${OUT}/${TAG}-${name}-com.png`, Buffer.from(r[1].split(',')[1], 'base64'));
  };
  const still = () => p.evaluate(() => { const M = window.__mira; M.FPS.t = -1e9; }); // the adaptive quality would drop the pixel ratio in swiftshader
  for (const id of MAPS) {
    await p.evaluate(id => { document.querySelector('#mapSel').value = String(id); document.querySelector('#btnSoloS').click(); }, id);
    await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.screen === 'game' && window.__mira.CHARS().length > 10, null, { timeout: 180000, polling: 100 });
    await still(); await L.sleep(3500);
    await p.evaluate(() => document.querySelectorAll('.brief,#brief,.card').forEach(e => e.style.visibility = 'hidden'));
    await shot(id + '-largo');
    // scope on the guest nearest the middle of the scene
    await p.evaluate(() => {
      const M = window.__mira, S = M.G.sim, T = THREE, E = M.SNIPER_POS;
      const es = S.ents.filter(e => !e.dead); const c = es.reduce((a, e) => a.add(new T.Vector3(e.x, 0, e.z)), new T.Vector3()).divideScalar(es.length);
      const e = es.sort((a, b) => Math.hypot(a.x - c.x, a.z - c.z) - Math.hypot(b.x - c.x, b.z - c.z))[0];
      const d = new T.Vector3(e.x, (e.y || 0) + 1.3, e.z).sub(E).normalize();
      M.snip.scoped = true; M.snip.zoom = 5; M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; M.snip.kick = 0;
      window.__qlock = setInterval(() => { M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; }, 16);
    });
    await still(); await L.sleep(1500);
    await shot(id + '-luneta');
    await p.evaluate(() => { clearInterval(window.__qlock); const M = window.__mira; M.G.sim.ph = 'reveal'; document.querySelector('#btnMenu').click(); });
    await L.sleep(1500);
    // close up from the agent's side
    await p.evaluate(id => { document.querySelector('#mapSel').value = String(id); document.querySelector('#btnSoloA').click(); }, id);
    await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.screen === 'game' && window.__mira.CHARS().length > 10, null, { timeout: 180000, polling: 100 });
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
