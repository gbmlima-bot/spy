// Mission spots the sniper can actually use: for every object's standing point, in every map, is there a clear line from
// the sniper's eye to the head (1.6 m) or the chest (1.2 m) of someone standing there? A height counts only if nothing
// blocks the shot (what the host's shot check tests) AND nothing opaque hides it from view; a spot where the agent shows
// but can't be hit, or can be hit but doesn't show, is invalid.
// node t12.js <url> [maps, e.g. 0,5,10]   (exits with code 1 if any spot is invalid)
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const MAPS = (process.argv[3] || '0,1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  let bad = 0;
  for (const id of MAPS) {
    const r = await p.evaluate(async id => {
      const M = window.__mira, T = THREE; M.loadMap(id); await new Promise(r => setTimeout(r, 200));
      const E = M.SNIPER_POS, chars = new Set(); M.CHARS().forEach(c => c.traverse(o => chars.add(o)));
      const shown = o => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
      const opaque = m => (Array.isArray(m) ? m : [m]).some(x => x && !(x.transparent && x.opacity < 0.6) && x.visible !== false);
      // what blocks the shot: the same list the host's shot check uses
      const shotSet = M.SCEN.id ? (M.SCEN.occ || []) : M.OCCLUDERS;
      // what hides the view: every opaque mesh drawn (characters and the sniper's own nest aside)
      const viewSet = []; M.scene.traverse(o => { if (o.isMesh && !o.isSkinnedMesh && !chars.has(o) && shown(o) && opaque(o.material) && !M.NEST.getObjectById(o.id) && !(o.userData && o.userData.noCol && o.parent && o.parent.userData && o.parent.userData.noCol)) viewSet.push(o); });
      const rc = new T.Raycaster(), tg = new T.Vector3(), dir = new T.Vector3();
      const clear = (set, h) => { const d = tg.distanceTo(E); dir.copy(tg).sub(E).normalize(); rc.set(E, dir); rc.far = d - 0.3; return !rc.intersectObjects(set, true).length; };
      const out = [];
      M.PROPS.forEach(P => {
        const y = M.LVY(P.lv || 0); let ok = false; const why = [];
        for (const h of [1.6, 1.2]) {
          tg.set(P.s[0], y + h, P.s[1]); const sh = clear(shotSet), vw = clear(viewSet);
          if (sh && vw) { ok = true; break; }
          why.push(h + ' m: ' + (!vw && !sh ? 'tapado e bloqueado' : !vw ? 'tapado (aparece não)' : 'bloqueado (tiro não passa)'));
        }
        if (!ok) out.push(P.where + ' — ' + why.join('; '));
      });
      return { id, nome: M.SCEN.id ? M.SCEN.sc.nome : 'Cobertura', pontos: M.PROPS.length, invalidos: out };
    }, id);
    bad += r.invalidos.length;
    console.log(`${r.id} ${r.nome}: ${r.pontos - r.invalidos.length}/${r.pontos} pontos válidos`); r.invalidos.forEach(x => console.log('   ✗ ' + x));
  }
  console.log(bad ? `${bad} ponto(s) inválido(s)` : 'todos os pontos válidos');
  await b.close(); process.exitCode = bad ? 1 : 0;
})();
