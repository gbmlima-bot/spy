// Confere os ninhos temáticos (sc.ninho; na Cobertura, K.ninho de 00-cobertura.js) de cada mapa contra a interface do Sniper:
//  - superfície: topo em y = -0,79 cobrindo x -1,8..1,8 e z -1,25..-0,75 (raios de cima para baixo)
//  - visão livre: nada acima de -0,79 entre x ±1,8; nada à frente de z = -1,3 acima de -0,85; laterais até y = 1,5 com z ≥ -1,3
//  - nada do ninho entre o olho do sniper e a cabeça (1,6 m) de quem anda em qualquer célula livre da grade de navegação
// node ninhos.js <url> [mapas, ex. 1,5,10]   (sai com código 1 se algo falhar)
const L = require('../../testes/lib');
const U = process.argv[2] || 'http://localhost:8765/mira.html';
const MAPS = (process.argv[3] || '1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  const p = await L.page(ctx, U);
  let bad = 0;
  for (const id of MAPS) {
    const r = await p.evaluate(async id => {
      const M = window.__mira, T = THREE; M.loadMap(id); await new Promise(r => setTimeout(r, 200));
      const E = M.SNIPER_POS, g = M.scene.children.find(o => o !== M.NEST && o.userData.noCol && o.position.equals(E));
      if (!g) return { id, sem: true };
      g.updateMatrixWorld(true);
      const meshes = []; g.traverse(o => { if (o.isMesh || o.isInstancedMesh) meshes.push(o); });
      const err = [], v = new T.Vector3(), inv = new T.Matrix4().copy(g.matrixWorld).invert(), mw = new T.Matrix4();
      const bump = (k, msg) => { if (!err.includes(k + msg)) err.push(k + msg); };
      for (const o of meshes) {
        const pos = o.geometry.attributes.position, n = o.isInstancedMesh ? o.count : 1, nm = o.name || o.geometry.type;
        for (let q = 0; q < n; q++) {
          mw.copy(o.matrixWorld); if (o.isInstancedMesh) { const im = new T.Matrix4(); o.getMatrixAt(q, im); mw.multiply(im); }
          for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i).applyMatrix4(mw).applyMatrix4(inv); const { x, y, z } = v, e = 0.005;
            if (z > 0.3) continue; // atrás do olho
            if (Math.abs(x) < 1.8 - e && y > -0.79 + e) bump(nm, ' sobe acima da superfície no meio');
            if (z < -1.3 - e && y > -0.85 + e) bump(nm, ' está à frente de z -1,3 acima de -0,85');
            if (Math.abs(x) >= 1.8 - e && (y > 1.5 + e || (y > -0.79 + e && z < -1.3 - e))) bump(nm, ' lateral fora do volume');
          }
        }
      }
      const rc = new T.Raycaster(), dn = new T.Vector3(0, -1, 0); let miss = 0;
      for (let x = -1.75; x <= 1.75; x += 0.25) for (let z = -1.22; z <= -0.78; z += 0.11) {
        rc.set(new T.Vector3(x, 0.5, z).applyMatrix4(g.matrixWorld), dn); rc.far = 3;
        const h = rc.intersectObjects(meshes, true)[0]; if (!h || Math.abs(h.point.y - E.y + 0.79) > 0.02) miss++;
      }
      if (miss) err.push('superfície ausente ou fora de -0,79 em ' + miss + ' amostras');
      // cabeça de quem anda em qualquer célula livre
      // na Cobertura a mureta antiga (o grupo escondido do NEST) já tapava a frente do térreo: o ninho não pode tapar mais que ela
      const base = M.SCEN.sc ? null : M.NEST.children.find(c => c.isGroup && !c.visible), baseM = []; if (base) base.traverse(o => { if (o.isMesh) baseM.push(o); });
      let cells = 0, hid = 0, hidBase = 0; const tg = new T.Vector3(), dir = new T.Vector3();
      M.NAV.lv.forEach((N, lv) => { const y = M.LVY(lv); for (let j = 0; j < N.nz; j++) for (let i = 0; i < N.nx; i++) {
        if (N.g[j * N.nx + i]) continue; cells++;
        tg.set(N.x0 + i * M.NAV.cell, y + 1.6, N.z0 + j * M.NAV.cell); dir.copy(tg).sub(E); const d = dir.length(); rc.set(E, dir.normalize()); rc.far = d;
        if (rc.intersectObjects(meshes, true).length) hid++;
        if (baseM.length && rc.intersectObjects(baseM, false).length) hidBase++;
      } });
      if (hid > hidBase) err.push('ninho tapa a cabeça em ' + hid + ' de ' + cells + ' células livres' + (base ? ` (a mureta antiga tapava ${hidBase})` : ''));
      let calls = 0; g.traverse(o => { if (o.isMesh || o.isInstancedMesh || o.isPoints || o.isSprite) calls++; });
      return { id, nome: M.SCEN.sc ? M.SCEN.sc.nome : 'Cobertura', calls, err };
    }, id);
    if (r.sem) { console.log(`${id}: sem ninho temático`); continue; }
    bad += r.err.length;
    console.log(`${r.id} ${r.nome}: ${r.err.length ? 'FALHA' : 'ok'} (${r.calls} objetos desenhados)`); r.err.forEach(x => console.log('   ✗ ' + x));
  }
  console.log(bad ? `${bad} problema(s)` : 'ninhos ok');
  await b.close(); process.exit(bad ? 1 : 0);
})();
