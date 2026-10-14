// Drawn round rules (multiplayer): 'duas' (two bullets, 3 minutes: a first miss drops someone and the round goes on),
// 'dupla' (the agent must stand beside an accomplice for PAIR_T s, worth one of the 4 missions), 'apagao' (the lights fail
// once for 10 s). Checks the rules on the simulation, the network state and a change of host, and what each side sees.
// node t20.js <url>
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const bad = [];
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 900, height: 560 } });
  const p = await L.page(ctx, U);
  const r1 = await p.evaluate(() => {
    const M = window.__mira; M.loadMap(0);
    const guests = [{ peer: 'pa', role: 'a' }, { peer: 'pc', role: 'c' }, { peer: 'pd', role: 'c' }];
    const mk = rule => { const S = new M.Sim({ seed: 515, guests, sniper: { peer: 'ps' }, map: 0, rule }); S.t = 0.01; S.tick(0.02); return S; };
    const npcOf = S => S.ents.find(e => e.kind === 'npc').id;
    const out = {};
    // two bullets
    let S = mk('duas'); out.rt = S.t; S.shoot(npcOf(S)); out.afterMiss = { ph: S.ph, bl: S.bl, sh1: !!S.sh1 };
    S.shoot(S.pm.pc); out.secondMiss = { ph: S.ph, w: S.w, why: S.why };
    S = mk('duas'); S.shoot(npcOf(S)); S.shoot(S.agentId); out.secondHit = { w: S.w, why: S.why };
    S = mk(null); S.shoot(npcOf(S)); out.classic = { ph: S.ph, w: S.w };
    // the pair
    S = mk('dupla'); const a = S.ents[S.agentId], c = S.ents[S.pm.pc];
    S.dn = S.ms.slice(0, 4); out.fourNoPair = { prog: S.prog(), ph: S.ph };
    c.x = a.x + 0.6; c.z = a.z; c.y = a.y; c.lv = a.lv; for (let i = 0; i < 20; i++) { S.tick(0.1); c.x = a.x + 0.6; c.z = a.z; c.y = a.y; } out.pd2s = S.pd;
    for (let i = 0; i < 15; i++) { S.tick(0.1); c.x = a.x + 0.6; c.z = a.z; c.y = a.y; } out.pair = { pd: S.pd, ph: S.ph, why: S.why };
    // the lights
    S = mk('apagao'); out.ap = S.ap;
    const st = S.state(); out.dark = [M.blackoutAt(Object.assign({}, st, { tl: st.rt - st.ap - 5 })), M.blackoutAt(Object.assign({}, st, { tl: st.rt - st.ap + 3 })), M.blackoutAt(Object.assign({}, st, { tl: st.rt - st.ap - 12 }))];
    // network and a new host
    S = mk('duas'); S.shoot(npcOf(S));
    const d = M.decodeState(JSON.parse(JSON.stringify(M.encodeState(S.state())))), A = M.adoptSim(d);
    out.net = { ru: d.ru, rt: d.rt, bl: d.bl, sh1: !!d.sh1 }; out.adopted = A && { ru: A.ru, rt: A.rt, bl: A.bl, sh1: !!A.sh1, ap: A.ap };
    S = mk('apagao'); const d2 = M.decodeState(JSON.parse(JSON.stringify(M.encodeState(S.state())))); out.apNet = [S.ap, d2.ap, M.adoptSim(d2).ap];
    const dc = M.decodeState(JSON.parse(JSON.stringify(M.encodeState(mk(null).state())))); out.classicNet = { ru: dc.ru, rt: dc.rt, bl: dc.bl };
    // the host's pick
    const sel = document.querySelector('#ruleSel'), picks = {}; sel.value = 's'; for (let i = 0; i < 400; i++) { const r = M.rulePick() || 'none'; picks[r] = (picks[r] || 0) + 1; }
    sel.value = 'dupla'; out.fixed = M.rulePick(); sel.value = '0'; out.none = M.rulePick(); sel.value = 's'; out.picks = picks;
    return out;
  });
  console.log('regras', JSON.stringify(r1));
  if (r1.rt !== 180) bad.push('duas: rodada de 3 min');
  if (r1.afterMiss.ph !== 'play' || r1.afterMiss.bl !== 1 || !r1.afterMiss.sh1) bad.push('duas: primeiro erro não seguiu');
  if (r1.secondMiss.ph !== 'reveal' || r1.secondMiss.w !== 'g') bad.push('duas: segundo erro');
  if (r1.secondHit.w !== 's') bad.push('duas: segundo tiro certo');
  if (r1.classic.ph !== 'reveal' || r1.classic.w !== 'g') bad.push('clássica mudou');
  if (r1.fourNoPair.prog !== 3 || r1.fourNoPair.ph !== 'play') bad.push('dupla: 4 missões sem contato');
  if (r1.pd2s || !r1.pair.pd || r1.pair.ph !== 'reveal' || r1.pair.why !== 'missions') bad.push('dupla: contato');
  if (!(r1.ap >= 60 && r1.ap <= 120 + 60)) bad.push('apagão fora da janela');
  if (r1.dark[0] !== 1 || r1.dark[1] !== 0 || r1.dark[2] !== 0) bad.push('apagão: escuro na hora errada');
  if (r1.net.ru !== 'duas' || r1.net.bl !== 1 || !r1.net.sh1 || !r1.adopted || r1.adopted.bl !== 1 || r1.adopted.rt !== 180 || !r1.adopted.sh1) bad.push('rede/troca de anfitrião');
  if (r1.apNet[0] !== r1.apNet[1] || r1.apNet[1] !== r1.apNet[2]) bad.push('apagão na rede');
  if (r1.classicNet.ru !== null || r1.classicNet.rt !== 300 || r1.classicNet.bl !== 1) bad.push('clássica na rede');
  if (!(r1.picks.none > 140 && r1.picks.none < 260) || !r1.picks.apagao || !r1.picks.duas || !r1.picks.dupla || r1.fixed !== 'dupla' || r1.none !== null) bad.push('sorteio do anfitrião');
  // each side on screen
  const play = (role, rule) => p.evaluate(async ({ role, rule }) => {
    const M = window.__mira, G = M.G, frame = () => new Promise(r => requestAnimationFrame(() => r()));
    const seen = []; const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => seen.push(n.textContent)))); mo.observe(document.querySelector('#toasts'), { childList: true });
    Object.assign(G, { multi: false, solo: 'regras', isHost: true, screen: 'game', seed: null }); document.querySelector('#menu').hidden = true; M.loadMap(0);
    const guests = role === 's' ? [{ bot: true, role: 'a' }, { bot: true, role: 'c' }] : [{ peer: 'local', name: 'Eu', role: 'a' }, { peer: 'x1', name: 'Ana', role: 'c' }, { peer: 'x2', name: 'Bia', role: 'c' }];
    G.sim = new M.Sim({ seed: 31337, round: 1, guests, sniper: role === 's' ? { peer: 'local', name: 'Eu' } : { peer: 'ps', name: 'Sniper' }, map: 0, rule });
    const S = G.sim; for (let i = 0; i < 6; i++) await frame();
    const brief = document.querySelector('#brief').innerText;
    S.t = 0.01; for (let i = 0; i < 8; i++) await frame();
    const out = { brief: /Regra da rodada/.test(brief), card: document.querySelector('#roleCard').innerText, tag: document.querySelector('#roundTag').textContent };
    if (rule === 'duas') { M.snip.shotSent = true; S.shoot(S.ents.find(e => e.kind === 'npc').id); for (let i = 0; i < 6; i++) await frame(); out.shotSent = M.snip.shotSent; out.bullets = (document.querySelector('#bulletsN') || {}).textContent; }
    if (rule === 'dupla') { await frame(); out.rings = M.CHARS && document.querySelector('#pairNote') ? window.__mira.scene.children.filter(o => o.geometry && o.geometry.type === 'RingGeometry' && o.visible && o.material.color.getHex() === 0xd9a441 && o.geometry.parameters.innerRadius === 0.36).length : -1;
      S.pd = 1; S._st = null; for (let i = 0; i < 4; i++) await frame(); out.dn = document.querySelector('#dnCount').textContent; out.note = document.querySelector('#pairNote').textContent; }
    if (rule === 'apagao') { S.t = S.rt - S.ap - 3; for (let i = 0; i < 4; i++) await frame(); out.dark = +document.querySelector('#blackout').style.opacity; S.t = S.rt - S.ap - 15; for (let i = 0; i < 4; i++) await frame(); out.after = +document.querySelector('#blackout').style.opacity; }
    mo.disconnect(); out.toasts = seen.join(' | '); G.sim = null; G.screen = 'menu'; for (let i = 0; i < 3; i++) await frame();
    return out;
  }, { role, rule });
  const s1 = await play('s', 'duas'); console.log('sniper duas', JSON.stringify(s1));
  if (!s1.brief || !/duas balas/i.test(s1.card) || s1.shotSent || s1.bullets !== '1' || !/Resta 1 bala/.test(s1.toasts)) bad.push('tela do sniper com duas balas');
  const a1 = await play('a', 'dupla'); console.log('agente dupla', JSON.stringify(a1));
  if (!/Encoste num cúmplice/.test(a1.card) || a1.rings !== 2 || a1.dn !== '1' || !/contato feito/.test(a1.note) || !/Contato feito/.test(a1.toasts)) bad.push('tela do agente em dupla');
  const a2 = await play('a', 'apagao'); console.log('agente apagão', JSON.stringify(a2));
  if (!/Apagão/.test(a2.tag) || !(a2.dark > 0.5) || a2.after !== 0 || !/Apagão!/.test(a2.toasts)) bad.push('tela do apagão');
  console.log(bad.length ? 'FALHOU: ' + bad.join('; ') : 'OK');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
