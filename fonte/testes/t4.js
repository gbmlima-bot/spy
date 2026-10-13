// does what the sniper SEES match what the shot/mark hits? aim at each person's chest; compare first visible mesh vs crosshairHit
const L = require('./lib');
const U = process.argv[2] || 'http://localhost:8765/mira-pub.html';
const MAPS = (process.argv[3] || '0').split(',').map(Number);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const p = await L.page(ctx, U);
  for (const mp of MAPS) {
    await p.evaluate((mp) => { document.querySelector('#mapSel').value = String(mp); document.querySelector('#btnSoloS').click(); }, mp);
    await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief' && window.__mira.CHARS().length > 10, null, { timeout: 120000 });
    await L.sleep(2500);
    const r = await p.evaluate(() => {
      const M = window.__mira, S = M.G.sim, T = THREE; M.snip.scoped = true; M.snip.zoom = 8;
      const vis = []; M.renderer && 0; const scene = M.charGroup.parent;
      scene.traverse(o => { if (o.isMesh && o.visible && !o.material.transparent) { let v = true, q = o; while (q) { if (!q.visible) { v = false; break; } q = q.parent; } if (v) vis.push(o); } });
      const nest = []; scene.traverse(o => { if (o.position && o.position.equals && o.position.equals(M.SNIPER_POS) && o.isGroup) o.traverse(n => nest.push(n)); });
      const nestSet = new Set(nest);
      const visN = vis.filter(o => !nestSet.has(o));
      const ray = new T.Raycaster(); let tot = 0, through = [], blockedButSeen = 0;
      for (const e of S.ents) { if (e.dead) continue;
        const tgt = new T.Vector3(e.x, (e.y || 0) + 1.2, e.z), d = tgt.clone().sub(M.SNIPER_POS).normalize();
        M.snip.yaw = Math.atan2(d.x, -d.z); M.snip.pitch = Math.asin(d.y); M.snip.breath = 0; M.snip.kick = 0;
        M.scopeCam.position.copy(M.SNIPER_POS); M.scopeCam.lookAt(tgt); M.scopeCam.updateMatrixWorld();
        const h = M.crosshairHit(); ray.set(M.SNIPER_POS, d); ray.near = 0.05;
        const vh = ray.intersectObjects(visN, false)[0];
        if (!h || h.eid < 0) continue; tot++;
        const vDist = vh ? vh.distance : 1e9, hDist = h.point.distanceTo(M.SNIPER_POS);
        if (vDist < hDist - 0.4) { let n = vh.object, nm = ''; while (n && !nm) { nm = n.name; n = n.parent; } through.push({ id: e.id, lv: e.lv, gap: +(hDist - vDist).toFixed(1), obj: (vh.object.name || nm || vh.object.geometry.type), mat: '#' + (vh.object.material.color ? vh.object.material.color.getHexString() : '') }); }
      }
      return { tot, through: through.length, sample: through.slice(0, 12) };
    });
    console.log('map', mp, JSON.stringify(r));
    await p.evaluate(() => { const M = window.__mira; M.G.sim.ph = 'reveal'; document.querySelector('#btnMenu').click(); });
    await L.sleep(1500);
  }
  await b.close();
})();
