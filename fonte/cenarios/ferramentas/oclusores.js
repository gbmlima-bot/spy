// Oclusores: em todo lugar onde alguém pode ficar (células livres da grade de navegação, a cada 0,6 m, cabeça e peito),
// o que está entre o olho do sniper e a pessoa tem de esconder E bloquear o tiro, ou nem uma coisa nem outra.
//  "tapa e não bloqueia": malha opaca na frente que o tiro atravessa (falta na lista de oclusores do mapa)
//  "bloqueia e não tapa": malha transparente ou invisível que segura o tiro (vidro, facho de luz, vapor)
// O que for de propósito entra em oclusores-intencionais.json: { mapa, caixa: [x0, y0, z0, x1, y1, z1], tipo, motivo }.
// node oclusores.js <url> [mapas, ex. 0,5,10]   (sai com 1 se achar algo fora da lista)
const L = require('../../testes/lib');
const fs = require('fs'), path = require('path');
const U = process.argv[2] || 'http://localhost:8765/mira.html';
const MAPS = (process.argv[3] || '0,1,2,3,4,5,6,7,8,9,10').split(',').map(Number);
const OK = JSON.parse(fs.readFileSync(path.join(__dirname, 'oclusores-intencionais.json'), 'utf8'));
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
  // SEMJUNTAR=1: o mapa 0 não junta as peças estáticas, e cada achado diz a peça original (forma, medidas, posição)
  if (process.env.SEMJUNTAR) await ctx.addInitScript(() => { window.__noBatch = true; });
  const p = await L.page(ctx, U);
  let ruins = 0;
  for (const id of MAPS) {
    const r = await p.evaluate(async ([id, ok]) => {
      const M = window.__mira, T = THREE; M.loadMap(id); await new Promise(r => setTimeout(r, 200));
      const E = M.SNIPER_POS, chars = new Set(); M.CHARS().forEach(c => c.traverse(o => chars.add(o)));
      const shown = o => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
      const opaque = m => (Array.isArray(m) ? m : [m]).some(x => x && !(x.transparent && x.opacity < 0.6) && x.visible !== false && x.blending === T.NormalBlending);
      // os mesmos dois conjuntos do t12: o que segura o tiro (lista do host) e o que esconde (toda malha opaca desenhada)
      const shotSet = M.SCEN.id ? (M.SCEN.occ || []) : M.OCCLUDERS;
      const nest = o => !!M.NEST.getObjectById(o.id), noCol = o => o.userData && o.userData.noCol && o.parent && o.parent.userData && o.parent.userData.noCol;
      const viewSet = []; M.scene.traverse(o => { if (o.isMesh && !o.isSkinnedMesh && !chars.has(o) && shown(o) && opaque(o.material) && !nest(o) && !noCol(o)) viewSet.push(o); });
      const rc = new T.Raycaster(), tg = new T.Vector3(), dir = new T.Vector3();
      const first = (set, d) => { rc.set(E, dir); rc.far = d - 0.4; return rc.intersectObjects(set, true)[0] || null; };
      const dentro = (pt, tipo) => ok.some(a => a.mapa === id && a.tipo === tipo && pt.x >= a.caixa[0] && pt.y >= a.caixa[1] && pt.z >= a.caixa[2] && pt.x <= a.caixa[3] && pt.y <= a.caixa[4] && pt.z <= a.caixa[5]);
      const desc = (o) => { const m = Array.isArray(o.material) ? o.material[0] : o.material; let n = o; while (n && !n.name) n = n.parent; return (n ? n.name : '?') + ' ' + m.type.replace('Material', '') + (m.color ? ' #' + m.color.getHexString() : '') + (m.transparent ? ' transp' : '') + (m.blending !== T.NormalBlending ? ' aditivo' : '') + (o.userData.batch ? '' : ' ' + o.geometry.type.replace('Geometry', '') + (o.geometry.parameters ? ' ' + Object.values(o.geometry.parameters).filter(v => typeof v === 'number').slice(0, 3).map(v => +v.toFixed(2)).join('x') : '') + ' @' + o.getWorldPosition(new T.Vector3()).toArray().map(v => +v.toFixed(1)).join(',')); };
      // agrupa os achados por malha e por região de 1 m (malhas juntadas perdem o nome; a região diz onde procurar)
      const achados = new Map(); let pontos = 0;
      const nota = (tipo, h, alvo) => { if (dentro(h.point, tipo)) return; const k = tipo + '|' + h.object.uuid + '|' + [h.point.x, h.point.y, h.point.z].map(v => Math.round(v)).join(',');
        const a = achados.get(k) || { tipo, malha: desc(h.object), em: [h.point.x, h.point.y, h.point.z].map(v => +v.toFixed(1)), alvos: 0, ex: alvo }; a.alvos++; achados.set(k, a); };
      if (!M.NAV.ready) M.navFree(0, 0, 0);
      M.NAV.lv.forEach((N, lv) => { if (!N) return; const y = M.LVY(lv);
        for (let j = 0; j < N.nz; j += 3) for (let i = 0; i < N.nx; i += 3) { if (N.g[j * N.nx + i]) continue; const x = N.x0 + i * M.NAV.cell, z = N.z0 + j * M.NAV.cell; pontos++;
          for (const hh of [1.6, 1.2]) { tg.set(x, y + hh, z); const d = tg.distanceTo(E); dir.copy(tg).sub(E).normalize();
            const s = first(shotSet, d), v = first(viewSet, d), alvo = [+x.toFixed(1), lv, +z.toFixed(1), hh];
            if (v && !s) nota('tapa', v, alvo); else if (s && !v) nota('bloqueia', s, alvo); } } });
      const lista = [...achados.values()].filter(a => a.alvos >= 2).sort((a, b) => b.alvos - a.alvos);
      return { id, nome: M.SCEN.id ? M.SCEN.sc.nome : 'Cobertura', pontos, lista };
    }, [id, OK]);
    ruins += r.lista.length;
    console.log(`${r.id} ${r.nome}: ${r.pontos} lugares, ${r.lista.length ? r.lista.length + ' problema(s)' : 'ok'}`);
    r.lista.slice(0, 30).forEach(a => console.log(`   ✗ ${a.tipo === 'tapa' ? 'tapa e não bloqueia' : 'bloqueia e não tapa'}: ${a.malha} em ${a.em.join(', ')} (${a.alvos} alvos, ex. x ${a.ex[0]} nível ${a.ex[1]} z ${a.ex[2]} a ${a.ex[3]} m)`));
  }
  console.log(ruins ? `${ruins} problema(s)` : 'nenhum problema');
  await b.close(); process.exitCode = ruins ? 1 : 0;
})();
