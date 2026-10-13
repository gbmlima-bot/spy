// Mira na Cobertura: kit de construção dos cenários extras.
// Cada cenário (src/NN-*.js) chama MIRA_CENARIOS.push({...}) e monta a cena dentro de build(K).
// O kit não conhece o jogo: o motor (prévia ou mira.html) cria K com MIRA_KIT(THREE, root) e lê o que o cenário registrou
// (colisões, vagas, luzes, animações, efeitos de missão). Unidades em metros, y para cima, o sniper fica do lado +z.
window.MIRA_CENARIOS = window.MIRA_CENARIOS || [];

function MIRA_KIT(T, root, seed) {
  const K = { T, root, cols: [], slots: [], lights: [], ticks: [], fx: [], tells: {}, occ: [] };

  // ---------------------------------------------------------------- aleatório determinístico
  K.rng = (a) => function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const R = K.r = K.rng(seed || 1234);
  K.pick = (a, r = R) => a[Math.floor(r() * a.length)];
  K.range = (a, b, r = R) => a + (b - a) * r();

  // ---------------------------------------------------------------- materiais
  const MATS = new Map();
  K.mat = (color, o = {}) => {
    const key = color + JSON.stringify(o);
    if (!MATS.has(key)) MATS.set(key, new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.75, metalness: 0.05, envMapIntensity: 0.3 }, o)));
    return MATS.get(key);
  };
  K.glow = (color, k = 1) => new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), toneMapped: false });
  K.metal = (color, rough = 0.3) => K.mat(color, { metalness: 0.85, roughness: rough });
  K.gold = K.metal(0xd9a441, 0.28); K.silver = K.metal(0xc9ced6, 0.25); K.brass = K.metal(0xb8893a, 0.35); K.iron = K.metal(0x2a2a2e, 0.55);
  K.glass = new T.MeshStandardMaterial({ color: 0xe8f2ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.4, envMapIntensity: 1.2 });
  K.vcol = (o = {}) => new T.MeshStandardMaterial(Object.assign({ vertexColors: true, roughness: 0.7, envMapIntensity: 0.4 }, o));

  // ---------------------------------------------------------------- texturas em canvas
  K.canvasTex = (w, h, draw, rep) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d', { willReadFrequently: true }), w, h);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    return t;
  };
  K.grain = (g, w, h, amt) => { const id = g.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (R() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0); };
  K.texMat = (tex, o = {}) => new T.MeshStandardMaterial(Object.assign({ map: tex, roughness: 0.75, metalness: 0.02, envMapIntensity: 0.3 }, o));
  const radialTex = K.canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.5)'); gr.addColorStop(0.7, 'rgba(255,255,255,.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  const blobTex = K.canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(0.45, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
  radialTex.encoding = T.LinearEncoding; blobTex.encoding = T.LinearEncoding;
  K.radialTex = radialTex;
  // letreiro / placa: texto desenhado num canvas; neon=true brilha (bloom)
  K.signTex = (text, o = {}) => K.canvasTex(o.w || 512, o.h || 128, (g, w, h) => {
    g.fillStyle = o.bg || 'rgba(0,0,0,0)'; g.fillRect(0, 0, w, h);
    g.font = `${o.weight || 700} ${o.size || 80}px ${o.font || 'Georgia, serif'}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (o.neon) { g.shadowColor = o.color || '#fff'; g.shadowBlur = 18; }
    g.fillStyle = o.color || '#f3ecdc'; g.fillText(text, w / 2, h / 2 + (o.dy || 0));
  });
  K.sign = (text, w, h, x, y, z, o = {}) => {
    const tex = K.signTex(text, o); const m = o.neon ? new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, color: new T.Color(0xffffff).multiplyScalar(o.k || 2.2), depthWrite: false })
      : new T.MeshStandardMaterial({ map: tex, transparent: !o.bg, roughness: 0.6 });
    const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.position.set(x, y, z); if (o.ry) me.rotation.y = o.ry; (o.parent || root).add(me); return me;
  };

  // ---------------------------------------------------------------- geometria
  K.add = (geo, m, x = 0, y = 0, z = 0, o = {}) => {
    const mesh = new T.Mesh(geo, m); mesh.position.set(x, y, z);
    mesh.castShadow = o.cast !== false; mesh.receiveShadow = o.recv !== false;
    if (o.ry) mesh.rotation.y = o.ry; if (o.rx) mesh.rotation.x = o.rx; if (o.rz) mesh.rotation.z = o.rz;
    if (o.s) { if (Array.isArray(o.s)) mesh.scale.set(o.s[0], o.s[1], o.s[2]); else mesh.scale.setScalar(o.s); }
    (o.parent || root).add(mesh);
    if (o.occ) K.occ.push(mesh);
    return mesh;
  };
  K.box = (w, h, d, m, x, y, z, o) => K.add(new T.BoxGeometry(w, h, d), m, x, y, z, o);
  K.cyl = (rt, rb, h, m, x, y, z, o, seg = 12) => K.add(new T.CylinderGeometry(rt, rb, h, seg), m, x, y, z, o);
  K.sphere = (r, m, x, y, z, o, ws = 12, hs = 8) => K.add(new T.SphereGeometry(r, ws, hs), m, x, y, z, o);
  K.cone = (r, h, m, x, y, z, o, seg = 12) => K.add(new T.ConeGeometry(r, h, seg), m, x, y, z, o);
  K.torus = (r, t, m, x, y, z, o, rs = 8, ts = 24) => K.add(new T.TorusGeometry(r, t, rs, ts), m, x, y, z, o);
  K.group = (x = 0, y = 0, z = 0, ry = 0, parent = root) => { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g); return g; };
  // caixa com cantos arredondados (estofados, tampos)
  K.rbox = (w, h, d, r) => { const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); const g = new T.ExtrudeGeometry(s, { depth: d - 2 * Math.min(r, d / 3), bevelEnabled: true, bevelThickness: Math.min(r, d / 3), bevelSize: Math.min(r, d / 3) * 0.9, bevelSegments: 2, curveSegments: 4 }); g.center(); return g; };
  // perfil girado (vasos, balaústres, garrafas, colunas): pts = [[raio, y], ...]
  K.lathe = (pts, m, x, y, z, o, seg = 16) => K.add(new T.LatheGeometry(pts.map(p => new T.Vector2(p[0], p[1])), seg), m, x, y, z, o);
  // muitas cópias da mesma peça num só draw call: list = [[x,y,z,ry,s], ...]
  K.inst = (geo, m, list, o = {}) => {
    const im = new T.InstancedMesh(geo, m, list.length); const d = new T.Object3D();
    list.forEach((p, i) => { d.position.set(p[0], p[1], p[2]); d.rotation.set(p[5] || 0, p[3] || 0, p[6] || 0); const s = p[4] == null ? 1 : p[4]; if (Array.isArray(s)) d.scale.set(s[0], s[1], s[2]); else d.scale.setScalar(s); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    im.castShadow = o.cast !== false; im.receiveShadow = true; (o.parent || root).add(im); return im;
  };
  // une geometrias com cor por vértice num mesh só: parts = [[geo, cor], ...] (geo já posicionada)
  K.merge = (parts, m, o = {}) => {
    let n = 0; const ps = parts.map(([g, c]) => { const gg = g.index ? g.toNonIndexed() : g; n += gg.attributes.position.count; return [gg, c]; });
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3); let k = 0;
    for (const [g, c] of ps) { const cc = new T.Color(c); pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); for (let i = 0; i < g.attributes.position.count; i++) { col[(k + i) * 3] = cc.r; col[(k + i) * 3 + 1] = cc.g; col[(k + i) * 3 + 2] = cc.b; } k += g.attributes.position.count; }
    const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); out.setAttribute('color', new T.BufferAttribute(col, 3));
    return K.add(out, m || K.vcol(), 0, 0, 0, o);
  };
  K.at = (geo, x, y, z, ry = 0, rx = 0, rz = 0) => { geo.rotateX(rx); geo.rotateZ(rz); geo.rotateY(ry); geo.translate(x, y, z); return geo; };

  // ---------------------------------------------------------------- luz e brilho
  K.plight = (x, y, z, c, i, d, o = {}) => { const p = new T.PointLight(c, i, d, 2); p.position.set(x, y, z); (o.parent || root).add(p); K.lights.push(p); return p; };
  K.spot = (x, y, z, tx, ty, tz, c, i, d, ang = 0.5, o = {}) => { const s = new T.SpotLight(c, i, d, ang, 0.5, 2); s.position.set(x, y, z); s.target.position.set(tx, ty, tz); (o.parent || root).add(s); (o.parent || root).add(s.target); K.lights.push(s); return s; };
  const UNIT = new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  // mancha de luz aditiva no chão (barata, sem custo de luz real)
  K.pool = (x, z, r, color, k, y = 0.022, parent = root) => { const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: radialTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); m.scale.set(r * 2, 1, r * 2); m.position.set(x, y, z); m.renderOrder = 2; parent.add(m); return m; };
  K.halo = (x, y, z, r, color, k, parent = root) => { const s = new T.Sprite(new T.SpriteMaterial({ map: radialTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); s.position.set(x, y, z); s.scale.set(r * 2, r * 2, 1); parent.add(s); return s; };
  K.blob = (x, z, sx, sz, op = 0.5, parent = root) => { const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: op, toneMapped: false })); m.scale.set(sx, 1, sz); m.position.set(x, 0.014, z); m.renderOrder = 1; parent.add(m); return m; };
  // chama de vela/tocha que tremula sozinha
  const flameGeo = new T.SphereGeometry(1, 8, 6).scale(0.5, 1.4, 0.5).translate(0, 1, 0);
  K.flames = [];
  K.flame = (x, y, z, s = 0.03, color = 0xffb040, parent = root) => { const f = new T.Mesh(flameGeo, K.glow(color, 3)); f.position.set(x, y, z); f.scale.setScalar(s); f.userData.s = s; parent.add(f); K.flames.push(f); return f; };
  // cordão de lâmpadas em catenária entre dois pontos
  K.bulbs = (a, b, n, sag, color = 0xffd08a, k = 3.2, parent = root) => {
    const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24; pts.push(new T.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u)); }
    const wire = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x1a1a1a })); parent.add(wire);
    const list = []; for (let i = 1; i < n; i++) { const u = i / n; list.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag - 0.05, a[2] + (b[2] - a[2]) * u]); }
    K.inst(new T.SphereGeometry(0.05, 8, 6), K.glow(color, k), list, { cast: false, parent }); return list;
  };

  // ---------------------------------------------------------------- jogo: colisão, vagas, missões
  // caixa bloqueada no nível lv (x0 < x1, z0 < z1)
  K.col = (x0, z0, x1, z1, lv = 0) => K.cols.push({ x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1), lv });
  K.colR = (x, z, r, lv = 0) => K.col(x - r, z - r, x + r, z + r, lv);
  // vaga onde convidados ficam: tipos do jogo = talk, dance, bar, view, sit, lie, piano, yoga, cards, tub, bean, chess, selfie, slot
  K.slot = (x, z, fx, fz, type = 'talk', lv = 0) => K.slots.push({ x, z, rot: Math.atan2(fx - x, fz - z), type, lv });
  K.ringSlots = (cx, cz, n, r, type = 'talk', lv = 0, a0 = 0.4) => { for (let i = 0; i < n; i++) { const a = a0 + i * Math.PI * 2 / n; K.slot(cx + Math.cos(a) * r, cz + Math.sin(a) * r, cx, cz, type, lv); } };
  // efeito visível ("tell") de uma missão: tell(live) aplica a mudança (live=true anima), reset() desfaz
  K.tell = (k, tell, reset) => { K.tells[k] = { tell, reset }; };
  // anima algo por d segundos: fn(ease, u, t)
  K.anim = (d, fn) => K.fx.push({ d, t: 0, fn });
  K.tick = (fn) => K.ticks.push(fn);
  K.update = (dt, t) => {
    for (let i = K.fx.length - 1; i >= 0; i--) { const f = K.fx[i]; f.t += dt; const u = Math.min(1, f.t / f.d); f.fn(u * u * (3 - 2 * u), u, f.t); if (u >= 1) K.fx.splice(i, 1); }
    K.flames.forEach((f, i) => { const k = f.userData.s * (0.85 + Math.sin(t * 11 + i * 1.7) * 0.08 + Math.sin(t * 23 + i) * 0.06); f.scale.set(k, k * 1.2, k); });
    for (const fn of K.ticks) fn(dt, t);
  };

  // ---------------------------------------------------------------- mobília pronta (para dar densidade rápido)
  const M = K.M = {
    linen: K.mat(0xf3eee2, { roughness: 0.9 }), walnut: K.mat(0x5a3a22, { roughness: 0.55 }), oak: K.mat(0x9a7448, { roughness: 0.6 }),
    black: K.mat(0x16161a, { roughness: 0.4 }), white: K.mat(0xf2efe8, { roughness: 0.5 }), stone: K.mat(0xd8d0c0, { roughness: 0.85 }),
    leaf: K.mat(0x3f6b34, { roughness: 0.8 }), leaf2: K.mat(0x5b8a3c, { roughness: 0.8 }), soil: K.mat(0x3a2a1c, { roughness: 1 }),
    terracotta: K.mat(0xb5603a, { roughness: 0.85 }), candle: K.mat(0xf6efe0, { roughness: 0.6 }),
  };
  // mesa redonda com toalha, centro (vela/flor) e taças
  K.table = (x, z, o = {}) => {
    const r = o.r || 0.55, h = o.h || 0.76, g = K.group(x, o.y || 0, z, 0, o.parent);
    K.cyl(r, r, 0.04, o.top || M.linen, 0, h, 0, { parent: g }, 24);
    if (o.cloth !== false) K.add(new T.CylinderGeometry(r + 0.02, r + 0.14, h - 0.05, 24, 1, true), o.cloth || M.linen, 0, (h - 0.05) / 2, 0, { parent: g });
    else K.cyl(0.05, 0.05, h, o.leg || M.walnut, 0, h / 2, 0, { parent: g });
    if (o.candle !== false) { K.cyl(0.025, 0.025, 0.14, M.candle, 0.1, h + 0.09, 0, { parent: g, cast: false }); K.flame(x + 0.1, h + 0.165 + (o.y || 0), z, 0.016, 0xffb040, root); }
    if (o.flower) { K.cyl(0.05, 0.035, 0.12, K.glass, -0.08, h + 0.08, 0.05, { parent: g }); for (let i = 0; i < 5; i++) K.sphere(0.035, K.mat(o.flower), -0.08 + Math.cos(i * 1.3) * 0.04, h + 0.17 + (i % 2) * 0.03, 0.05 + Math.sin(i * 1.3) * 0.04, { parent: g, cast: false }, 6, 4); }
    const n = o.glasses ?? 3; for (let i = 0; i < n; i++) { const a = i * 2.1 + 0.6; K.cyl(0.03, 0.02, 0.06, K.glass, Math.cos(a) * r * 0.65, h + 0.11, Math.sin(a) * r * 0.65, { parent: g, cast: false }, 8); K.cyl(0.004, 0.004, 0.07, K.glass, Math.cos(a) * r * 0.65, h + 0.055, Math.sin(a) * r * 0.65, { parent: g, cast: false }, 4); }
    if (o.col !== false) K.colR(x, z, r * 0.8, o.lv || 0);
    if (o.slots) K.ringSlots(x, z, o.slots, r + 0.3, 'talk', o.lv || 0);
    return g;
  };
  K.chair = (x, z, ry, o = {}) => {
    const g = K.group(x, o.y || 0, z, ry, o.parent), wm = o.frame || M.walnut, cm = o.seat || K.mat(0x8a1f2a, { roughness: 0.8 });
    K.box(0.42, 0.06, 0.42, cm, 0, 0.46, 0, { parent: g });
    for (const [a, b] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) K.cyl(0.018, 0.015, 0.45, wm, a, 0.22, b, { parent: g }, 6);
    K.box(0.42, 0.5, 0.05, o.back || wm, 0, 0.74, -0.19, { parent: g });
    return g;
  };
  K.sofa = (x, z, len, ry, o = {}) => {
    const g = K.group(x, o.y || 0, z, ry, o.parent), cm = o.cloth || K.mat(0x2f4a3a, { roughness: 0.85 });
    K.add(K.rbox(len, 0.22, 0.8, 0.06), cm, 0, 0.3, 0, { parent: g }); K.add(K.rbox(len, 0.5, 0.2, 0.07), cm, 0, 0.55, -0.32, { parent: g });
    for (const s of [-1, 1]) K.add(K.rbox(0.18, 0.36, 0.8, 0.06), cm, s * (len / 2 - 0.06), 0.42, 0, { parent: g });
    for (let i = 0; i < Math.round(len / 0.7); i++) K.add(K.rbox(0.36, 0.3, 0.1, 0.05), K.mat(o.pillow || 0xd9a441, { roughness: 0.9 }), -len / 2 + 0.45 + i * 0.7, 0.58, -0.18, { parent: g, rx: -0.2 });
    return g;
  };
  // planta em vaso: kind = 'palm' | 'bush' | 'topiary' | 'cypress' | 'fern'
  K.plant = (x, z, kind = 'bush', o = {}) => {
    const g = K.group(x, o.y || 0, z, R() * 6, o.parent), s = o.s || 1, pot = o.pot || M.terracotta;
    if (o.pot !== false) { K.lathe([[0, 0], [0.2 * s, 0], [0.26 * s, 0.42 * s], [0.28 * s, 0.45 * s], [0, 0.45 * s]], pot, 0, 0, 0, { parent: g }); K.cyl(0.25 * s, 0.25 * s, 0.02, M.soil, 0, 0.43 * s, 0, { parent: g, cast: false }); }
    const y0 = o.pot === false ? 0 : 0.44 * s;
    if (kind === 'palm') { K.cyl(0.03 * s, 0.05 * s, 1.3 * s, M.walnut, 0, y0 + 0.65 * s, 0, { parent: g }, 6); for (let i = 0; i < 8; i++) { const f = K.add(new T.PlaneGeometry(0.22 * s, 0.9 * s, 1, 3).translate(0, 0.45 * s, 0), K.mat(0x3f7a3a, { side: T.DoubleSide, roughness: 0.8 }), 0, y0 + 1.25 * s, 0, { parent: g }); f.rotation.set(-1.0 - (i % 2) * 0.3, i * 0.8, 0, 'YXZ'); } }
    else if (kind === 'topiary') { K.cyl(0.025 * s, 0.025 * s, 0.7 * s, M.walnut, 0, y0 + 0.35 * s, 0, { parent: g }, 6); K.sphere(0.3 * s, M.leaf, 0, y0 + 0.85 * s, 0, { parent: g }, 12, 10); }
    else if (kind === 'cypress') { K.add(new T.SphereGeometry(0.28 * s, 10, 10).scale(1, 3.4, 1), K.mat(0x2c4a2a, { roughness: 0.9 }), 0, y0 + 0.95 * s, 0, { parent: g }); }
    else if (kind === 'fern') { for (let i = 0; i < 9; i++) { const f = K.add(new T.PlaneGeometry(0.16 * s, 0.6 * s).translate(0, 0.3 * s, 0), K.mat(0x4f8a3a, { side: T.DoubleSide }), 0, y0, 0, { parent: g }); f.rotation.set(-0.7, i * 0.7, 0, 'YXZ'); } }
    else { for (let i = 0; i < 5; i++) K.sphere((0.2 + R() * 0.08) * s, i % 2 ? M.leaf : M.leaf2, (R() - 0.5) * 0.25 * s, y0 + (0.18 + R() * 0.2) * s, (R() - 0.5) * 0.25 * s, { parent: g }, 10, 8); }
    if (o.col !== false) K.colR(x, z, 0.3 * s, o.lv || 0);
    return g;
  };
  // garrafas variadas numa prateleira
  K.bottles = (x0, y, z, n, dx = 0.11, o = {}) => {
    const cols = o.colors || [0x2c6e49, 0x6b3a1a, 0xe8e0c8, 0x7a1f2a, 0x1e3a8b, 0xc9a227, 0x3a3a3a];
    for (let i = 0; i < n; i++) { const h = 0.22 + R() * 0.12, c = cols[i % cols.length]; K.lathe([[0, 0], [0.035, 0], [0.04, 0.02], [0.04, h * 0.62], [0.015, h * 0.8], [0.012, h], [0, h]], K.mat(c, { roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.85, emissive: c, emissiveIntensity: 0.15 }), x0 + i * dx, y, z, { parent: o.parent, cast: false }, 8); }
  };
  // tapete com estampa
  K.rug = (x, z, w, d, draw, o = {}) => { const t = K.canvasTex(512, Math.round(512 * d / w), draw); return K.add(new T.PlaneGeometry(w, d).rotateX(-Math.PI / 2), K.texMat(t, { roughness: 0.95 }), x, (o.y || 0) + 0.012, z, { parent: o.parent, cast: false, ry: o.ry }); };
  // poste/luminária de rua com lanterna acesa
  K.lamppost = (x, z, o = {}) => {
    const g = K.group(x, o.y || 0, z, 0, o.parent), h = o.h || 3.2, m = o.mat || K.iron;
    K.cyl(0.08, 0.12, 0.3, m, 0, 0.15, 0, { parent: g }); K.cyl(0.04, 0.055, h, m, 0, h / 2, 0, { parent: g }, 8);
    K.box(0.26, 0.34, 0.26, K.glow(o.color || 0xffc070, 1.6), 0, h + 0.12, 0, { parent: g, cast: false }); K.cone(0.24, 0.16, m, 0, h + 0.36, 0, { parent: g }, 4);
    if (o.light !== false) K.plight(x, (o.y || 0) + h, z, o.color || 0xffc070, o.i || 1.2, o.d || 7);
    K.pool(x, z, 1.8, o.color || 0xffb060, 0.35, (o.y || 0) + 0.022);
    if (o.col !== false) K.colR(x, z, 0.15, o.lv || 0);
    return g;
  };
  // piso com textura em canvas (xadrez, tábuas, pedras etc.)
  K.floor = (x0, z0, x1, z1, tex, o = {}) => K.add(new T.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2), tex.isTexture ? K.texMat(tex, o.m || {}) : tex, (x0 + x1) / 2, o.y || 0, (z0 + z1) / 2, { parent: o.parent, cast: false });
  // prédio de fundo com janelas acesas (para cidade/horizonte)
  K.facade = (w, h, d, x, z, o = {}) => {
    const tex = K.canvasTex(256, 512, (g, W, H) => {
      g.fillStyle = o.wall || '#2a2f3a'; g.fillRect(0, 0, W, H); const bx = o.bays || 6, fl = o.floors || 14;
      for (let i = 0; i < bx; i++) for (let j = 0; j < fl; j++) { const lit = R() < (o.lit ?? 0.45); g.fillStyle = lit ? (R() < 0.3 ? '#ffd9a0' : '#ffc070') : (o.dark || '#141821'); g.fillRect(i * W / bx + 5, j * H / fl + 6, W / bx - 10, H / fl - 12); }
    });
    const m = new T.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: o.glow ?? 0.55, roughness: 0.8 });
    return K.add(new T.BoxGeometry(w, h, d), m, x, (o.y || 0) + h / 2, z, { cast: false, parent: o.parent });
  };
  // varanda/janela de onde o sniper atira (uma moldura simples no ponto dado)
  K.sniperNest = (x, y, z, o = {}) => {
    const g = K.group(x, y, z, o.ry || Math.PI, o.parent), wm = o.mat || K.mat(0x3a3530, { roughness: 0.8 });
    K.box(2.4, 0.15, 1.4, wm, 0, -0.9, 0, { parent: g }); K.box(2.4, 1.0, 0.12, wm, 0, -0.4, 0.66, { parent: g });
    K.box(0.12, 2.6, 0.12, wm, -1.15, 0.4, 0.66, { parent: g }); K.box(0.12, 2.6, 0.12, wm, 1.15, 0.4, 0.66, { parent: g });
    return g;
  };
  return K;
}
window.MIRA_KIT = MIRA_KIT;
