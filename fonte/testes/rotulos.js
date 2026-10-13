// lista os rótulos das missões de todos os mapas (para conferir os gestos)
const L = require('./lib'); const fs = require('fs');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 800, height: 500 } });
  const p = await L.page(ctx, U);
  const out = [];
  for (let id = 0; id <= 10; id++) {
    const r = await p.evaluate(id => { const M = window.__mira; M.loadMap(id); return M.PROPS.flatMap(P => P.acts.map(a => a[0])); }, id);
    out.push(...r.map(l => id + '\t' + l));
  }
  fs.writeFileSync(process.argv[3] || 'out/rotulos.txt', out.join('\n'));
  await b.close();
})();
