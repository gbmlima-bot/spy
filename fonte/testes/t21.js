// The sniper's second bullet ('duas' rule): the first miss shows its verdict in the scope and frees the trigger, a shot at
// the body already on the floor is refused without spending the bullet, and the second shot still ends the round.
// node t21.js <url>
const L = require('./lib');
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 900, height: 560 } });
  const p = await L.page(ctx, process.argv[2]);
  const r = await p.evaluate(async () => {
    const M = window.__mira, G = M.G, frame = () => new Promise(r => requestAnimationFrame(() => r())), wait = ms => new Promise(r => setTimeout(r, ms));
    const seen = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => seen.push(n.textContent)))).observe(document.querySelector('#toasts'), { childList: true });
    Object.assign(G, { multi: false, solo: 'regras', isHost: true, screen: 'game', seed: null }); document.querySelector('#menu').hidden = true; M.loadMap(0);
    G.sim = new M.Sim({ seed: 31337, round: 1, guests: [{ bot: true, role: 'a' }, { bot: true, role: 'c' }], sniper: { peer: 'local', name: 'Eu' }, map: 0, rule: 'duas' });
    const S = G.sim; for (let i = 0; i < 6; i++) await frame(); S.t = 0.01; for (let i = 0; i < 8; i++) await frame();
    M.setScope(true); const vlog = []; const t0 = performance.now(); const VV = document.querySelector('#scopeVerdict'); new MutationObserver(() => vlog.push([Math.round(performance.now() - t0), VV.hidden ? 'h' : VV.textContent])).observe(VV, { attributes: true, childList: true });
    const aim = (id, y, dx = 0, dz = 0) => { const c = M.CHARS()[S.ents.findIndex(e => e.id === id)]; const v = c.position.clone(); v.y += y; v.x += dx; v.z += dz; M.scopeCam.position.copy(M.SNIPER_POS); M.scopeCam.lookAt(v); M.scopeCam.updateMatrixWorld(); return M.crosshairHit(); };
    // first shot: an npc the crosshair really sees
    let tgt = null; for (const e of S.ents) if (e.kind === 'npc' && !e.dead) { const h = aim(e.id, 1.2); if (h && h.eid === e.id) { tgt = e.id; break; } }
    if (tgt === null) return { err: 'no visible npc' };
    aim(tgt, 1.2); M.shoot(); const out = { ph1: S.ph, sh1: !!S.sh1 };
    await wait(900); for (let i = 0; i < 3; i++) await frame(); const v = document.querySelector('#scopeVerdict'); out.v1 = { hidden: v.hidden, txt: v.textContent, cls: v.className }; out.shotSent1 = M.snip.shotSent;
    await wait(1800); for (let i = 0; i < 3; i++) await frame(); out.v1later = v.hidden;
    // the corpse: try a few heights until the crosshair hits it
    let hc = null; out.corpseRays = {}; for (const y of [1.2, 0.9, 0.5, 0.3, 0.15, 0.05]) for (const dx of [-0.6, -0.3, 0, 0.3, 0.6]) for (const dz of [-0.6, -0.3, 0, 0.3, 0.6]) { const h = aim(tgt, y, dx, dz); const k = h ? h.eid : 'none'; out.corpseRays[k] = (out.corpseRays[k] || 0) + 1; if (!hc && h && h.eid === tgt) hc = [y, dx, dz]; }
    out.corpseHit = hc; if (hc) { aim(tgt, ...hc); M.shoot(); out.afterCorpse = { shotSent: M.snip.shotSent, bl: S.bl, ph: S.ph }; }
    // second, real shot at the agent
    const ha = aim(S.agentId, 1.2); out.agentVisible = ha && ha.eid === S.agentId;
    if (out.agentVisible) { M.shoot(); for (let i = 0; i < 3; i++) await frame(); await wait(900); for (let i = 0; i < 3; i++) await frame(); out.final = { ph: S.ph, why: S.why, killcam: M.snip.killcam, v: v.hidden ? '' : v.textContent }; }
    out.toasts = seen.join(' | '); out.vlog = vlog; return out;
  });
  console.log(JSON.stringify(r));
  const bad = [];
  if (r.err) bad.push(r.err);
  else {
    if (r.ph1 !== 'play' || !r.sh1 || r.shotSent1) bad.push('primeiro erro não liberou a segunda bala');
    if (!r.vlog.some(([, t]) => /resta 1 bala/.test(t)) || !r.v1later) bad.push('veredito do primeiro erro na luneta');
    if (!r.corpseHit || r.afterCorpse.shotSent || r.afterCorpse.bl !== 1 || !/já caiu/.test(r.toasts)) bad.push('tiro no corpo caído');
    if (!r.agentVisible || r.final.ph !== 'reveal' || r.final.why !== 'agent' || !r.vlog.some(([, t]) => t === 'Alvo abatido')) bad.push('segundo tiro');
  }
  console.log(bad.length ? 'FALHOU: ' + bad.join('; ') : 'OK');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
