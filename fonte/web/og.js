// Gera og.jpg (1200×630), a imagem da prévia do link no WhatsApp e nas redes: a festa vista pela luneta do sniper,
// com o título por cima. Uso (da raiz, com um servidor local servindo uma cópia de fonte/mira.html, ver CONTRIBUTING.md):
//   node fonte/web/og.js http://localhost:8765/mira-pub.html [saida.jpg] [mapa]
// O WhatsApp só mostra a imagem se ela tiver menos de ~300 KB; o script avisa se passar.
const L = require('../testes/lib'), fs = require('fs'), path = require('path');
const [U, OUT = path.join(__dirname, '..', '..', 'og.jpg'), MAP = '0'] = process.argv.slice(2);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const p = await L.page(ctx, U);
  // as fontes do jogo (Google Fonts) vêm pelo curl, que passa pelo proxy do contêiner, e entram como data: URL; sem elas o título sai em Arial
  const curl = u => require('child_process').execFileSync('curl', ['-sSfL', '-A', 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120', u], { maxBuffer: 1 << 24 });
  const css = curl('https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@800&family=Figtree:wght@500&display=block').toString()
    .replace(/url\((https:[^)]+)\)/g, (_, u) => 'url(data:font/woff2;base64,' + curl(u).toString('base64') + ')');
  await p.addStyleTag({ content: css });
  await p.evaluate(id => { document.querySelector('#mapSel').value = String(id); document.querySelector('#btnSoloS').click(); }, MAP);
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.CHARS().length > 10, null, { timeout: 180000, polling: 100 });
  await L.sleep(3000);
  // luneta num convidado perto do meio da festa
  await p.evaluate(() => {
    const M = window.__mira, S = M.G.sim, T = THREE, E = M.SNIPER_POS;
    M.FPS.t = -1e9; if (!M.postMS) M.rebuildPost(4);
    const es = S.ents.filter(e => !e.dead); const c = es.reduce((a, e) => a.add(new T.Vector3(e.x, 0, e.z)), new T.Vector3()).divideScalar(es.length);
    const e = es.sort((a, b) => Math.hypot(a.x - c.x, a.z - c.z) - Math.hypot(b.x - c.x, b.z - c.z))[1];
    const d = new T.Vector3(e.x, (e.y || 0) + 1.2, e.z).sub(E).normalize();
    M.snip.scoped = true; M.snip.zoom = 3.2;
    window.__qlock = setInterval(() => { M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; M.snip.kick = 0; }, 16);
    document.querySelectorAll('.card,#toasts,#coach,#scopeInfo,#zoomTag,#breath,#breathTag,#touch').forEach(x => x.style.visibility = 'hidden');
    const o = document.createElement('div');
    o.innerHTML = '<div class="eyebrow" style="font-size:22px">Jogo de festa · 1 sniper contra a multidão</div>' +
      '<h1 style="font-size:104px;color:var(--paper);margin-top:10px">Mira na <span style="color:var(--brass)">Cobertura</span></h1>' +
      '<p style="font-size:30px;margin-top:16px;max-width:760px;line-height:1.25">Quem é o agente infiltrado? Você tem um tiro.</p>';
    Object.assign(o.style, { position: 'fixed', left: '56px', bottom: '48px', zIndex: 99, textShadow: '0 3px 18px rgba(0,0,0,.85)' });
    const g = document.createElement('div');
    Object.assign(g.style, { position: 'fixed', inset: 0, zIndex: 98, background: 'linear-gradient(90deg,rgba(8,10,14,.82) 0%,rgba(8,10,14,.45) 48%,rgba(8,10,14,0) 75%)' });
    document.body.append(g, o);
  });
  await p.evaluate(() => Promise.all([document.fonts.load('800 104px "Saira Condensed"'), document.fonts.load('500 30px Figtree')]));
  await L.sleep(2500);
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 80 });
  const kb = fs.statSync(OUT).size / 1024;
  console.log(path.relative(process.cwd(), OUT), kb.toFixed(0), 'KB', kb > 300 ? '(acima de 300 KB: o WhatsApp pode não mostrar)' : '');
  await b.close();
})();
