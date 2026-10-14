// Fim de rodada que vira história: mapa visto de cima com o trajeto do agente (laser nele, missões, tiro) e, a cada 5
// rodadas com amigos, o pódio da noite com títulos. node fonte/testes/t22.js <url> [mapa]
const L = require('./lib');
const [U, MAP = '0'] = process.argv.slice(2);
const t0 = Date.now(), ok = (c, m) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + m + ' (' + ((Date.now() - t0) / 1000 | 0) + ' s)'); if (!c) process.exitCode = 1; };
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await L.page(ctx, U);
  await p.evaluate(m => { try { localStorage.setItem('mira-intro-s', '1'); } catch (e) { } document.querySelector('#mapSel').value = m; document.querySelector('#btnSoloS').click(); }, MAP);
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 180000, polling: 500 });
  // 100 s de rodada em passos de 0,1 s, sem desenhar
  const n = await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; S.tick(0.02); for (let i = 0; i < 1000 && S.ph === 'play'; i++) S.tick(0.1); return { tr: (S.tr || []).length / 3, lp: (S.lp || []).length, ph: S.ph }; });
  ok(n.tr >= 6, `trajeto gravado: ${n.tr} pontos, laser no agente ${n.lp} vezes`);
  await p.evaluate(() => { const S = window.__mira.G.sim; if (S.ph === 'play') { S.shoot(S.agentId); } });
  await p.waitForFunction(() => !document.querySelector('#reveal').hidden, null, { timeout: 60000, polling: 500 }).catch(() => { });
  ok(await p.$eval('#replay', e => !e.hidden), 'revelação mostra o trajeto: ' + await p.$eval('#replay .note', e => e.textContent));
  const px = await p.$eval('#replay canvas', c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 3; i < d.length; i += 4) if (d[i]) k++; return k / (d.length / 4); });
  ok(px > 0.1, `mapa desenhado (${(px * 100).toFixed(0)}% do quadro)`);
  await p.screenshot({ path: __dirname + `/out/t22-replay-${MAP}.png` });
  ok(await p.$eval('#podium', e => e.hidden), 'treino solo: sem pódio');
  // pódio: a 5ª rodada de uma sala de 4
  const pod = await p.evaluate(() => {
    const M = window.__mira, st = Object.assign({}, M.st);
    const nm = { a: 'Ana', b: 'Beto', c: 'Caio', d: 'Duda' }, ids = Object.fromEntries(Object.keys(nm).map((k, i) => [k, st.ents[i + 3].id]));
    M.G.multi = true;
    for (let rd = 1; rd <= 5; rd++) {
      const sn = Object.keys(nm)[(rd - 1) % 4], ag = Object.keys(nm).filter(k => k !== sn)[rd % 3];
      const rl = {}; for (const k in nm) rl[k] = k === sn ? 's' : k === ag ? 'a' : 'c';
      const pm = {}; for (const k in nm) if (k !== sn) pm[k] = ids[k];
      const lu = {}; for (const k in nm) if (rl[k] === 'c') lu[ids[k]] = [k === 'c' ? 40 : 5, k === 'c' ? 20 : 0];
      const w = rd % 2 ? 's' : 'g';
      Object.assign(st, { rd, sd: 77, nm, rl, pm, lu, ag: ids[ag], w, why: w === 's' ? 'agent' : 'time', sh: null, dn: [0, 1, 2], sc: { a: rd, b: rd + 1, c: 2 * rd, d: 1 } });
      M.renderReveal(st);
    }
    M.G.multi = false;
    return { hidden: document.querySelector('#podium').hidden, rows: [...document.querySelectorAll('#podium li')].map(l => l.textContent), eyebrow: document.querySelector('#revealEyebrow').textContent };
  });
  ok(!pod.hidden && pod.rows.length === 3 && /Caio/.test(pod.rows[0]), 'pódio na 5ª rodada: ' + pod.rows.join(' | '));
  ok(pod.rows.join(' ').includes('Melhor isca') || /isca/i.test(pod.rows.join(' ')), 'título de isca vem dos pontos de isca');
  ok(/fim da noite/.test(pod.eyebrow), 'cabeçalho: ' + pod.eyebrow);
  await p.screenshot({ path: __dirname + '/out/t22-podio.png' });
  await b.close();
})();
