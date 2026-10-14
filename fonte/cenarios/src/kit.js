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
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = Math.max(4, T.Texture.DEFAULT_ANISOTROPY);
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
  K.juntar = (parts) => {
    let n = 0; const ps = parts.map(([g, c]) => { const gg = g.index ? g.toNonIndexed() : g; n += gg.attributes.position.count; return [gg, c]; });
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3); let k = 0;
    for (const [g, c] of ps) { const cc = new T.Color(c); pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); for (let i = 0; i < g.attributes.position.count; i++) { col[(k + i) * 3] = cc.r; col[(k + i) * 3 + 1] = cc.g; col[(k + i) * 3 + 2] = cc.b; } k += g.attributes.position.count; }
    const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); out.setAttribute('color', new T.BufferAttribute(col, 3));
    return out;
  };
  K.merge = (parts, m, o = {}) => K.add(K.juntar(parts), m || K.vcol(), 0, 0, 0, o);
  K.at = (geo, x, y, z, ry = 0, rx = 0, rz = 0) => { geo.rotateX(rx); geo.rotateZ(rz); geo.rotateY(ry); geo.translate(x, y, z); return geo; };

  // ---------------------------------------------------------------- luz e brilho
  K.plight = (x, y, z, c, i, d, o = {}) => { const p = new T.PointLight(c, i, d, 2); p.position.set(x, y, z); (o.parent || root).add(p); K.lights.push(p); return p; };
  K.spot = (x, y, z, tx, ty, tz, c, i, d, ang = 0.5, o = {}) => { const s = new T.SpotLight(c, i, d, ang, 0.5, 2); s.position.set(x, y, z); s.target.position.set(tx, ty, tz); (o.parent || root).add(s); (o.parent || root).add(s.target); K.lights.push(s); return s; };
  const UNIT = new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  // mancha de luz aditiva no chão (barata, sem custo de luz real)
  K.pool = (x, z, r, color, k, y = 0.022, parent = root) => { const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: radialTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); m.scale.set(r * 2, 1, r * 2); m.position.set(x, y, z); m.renderOrder = 2; parent.add(m); return m; };
  // brilho do ambiente (reflexo da sala neutra) em todo o cenário: abaixo de 1 a sombra pega a cor do céu e do chão (hemi)
  // em vez de um cinza claro por igual. Chamar no fim do build, depois de criados os materiais.
  K.reflexo = (k) => { const vistos = new Set(); root.traverse(o => (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m && m.envMapIntensity !== undefined && !vistos.has(m)) { vistos.add(m); m.envMapIntensity *= k; } })); };
  // luzes quentes vivas: vela, lampião e fogueira oscilam um pouco, cada uma no seu ritmo. Multiplica a intensidade que estiver
  // valendo, então quem acende ou apaga uma luz por conta própria (missões, ciclos) continua mandando nela. Chamar no fim do build.
  K.tremular = (o = {}) => {
    const amp = o.amp ?? 0.1, ls = K.lights.filter(l => l.isPointLight && l.color.r > l.color.b * 1.4 && (!o.filtro || o.filtro(l))).map(l => ({ l, f: 1, ph: R() * 50, sp: 0.8 + R() * 0.6 }));
    K.tick((dt, t) => { for (const q of ls) { const f = 1 + amp * (Math.sin(t * 7.3 * q.sp + q.ph) * 0.5 + Math.sin(t * 13.1 * q.sp + q.ph * 1.7) * 0.3 + Math.sin(t * 2.1 + q.ph) * 0.2); q.l.intensity *= f / q.f; q.f = f; } });
  };
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
  // só as luzes de uma textura pintada (janelas acesas, lampiões: pixels claros e quentes), o resto preto. Serve de emissiveMap:
  // a parede passa a pegar a luz da cena e só a janela brilha (com a textura inteira como emissiveMap a fachada brilhava por igual)
  K.luzesDe = (tex) => {
    const src = tex.image, c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const g = c.getContext('2d');
    const d = src.getContext('2d').getImageData(0, 0, c.width, c.height), a = d.data;
    for (let i = 0; i < a.length; i += 4) { const r = a[i], gg = a[i + 1], b = a[i + 2]; if (!(r > 200 && gg > 120 && r - b > 50)) { a[i] = a[i + 1] = a[i + 2] = 0; } }
    g.putImageData(d, 0, 0); const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.wrapS = tex.wrapS; t.wrapT = tex.wrapT; t.repeat.copy(tex.repeat); t.offset.copy(tex.offset); return t;
  };
  K.facade = (w, h, d, x, z, o = {}) => {
    const tex = K.canvasTex(256, 512, (g, W, H) => {
      g.fillStyle = o.wall || '#2a2f3a'; g.fillRect(0, 0, W, H); const bx = o.bays || 6, fl = o.floors || 14;
      for (let i = 0; i < bx; i++) for (let j = 0; j < fl; j++) { const lit = R() < (o.lit ?? 0.45); g.fillStyle = lit ? (R() < 0.3 ? '#ffd9a0' : '#ffc070') : (o.dark || '#141821'); g.fillRect(i * W / bx + 5, j * H / fl + 6, W / bx - 10, H / fl - 12); }
    });
    const m = new T.MeshStandardMaterial({ map: tex, emissiveMap: K.luzesDe(tex), emissive: 0xffffff, emissiveIntensity: (o.glow ?? 0.55) * 1.6, roughness: 0.8 });
    return K.add(new T.BoxGeometry(w, h, d), m, x, (o.y || 0) + h / 2, z, { cast: false, parent: o.parent });
  };
  // ---------------------------------------------------------------- ambiente vivo (partículas, fogos, pássaros, brilhos na água)
  // Tudo aqui é Points ou InstancedMesh: uma chamada de desenho por sistema, fora da junção estática, da navegação e da colisão.
  // Fica longe do caminho do tiro (céu, água, alto) ou é fino demais para esconder alguém.
  const dotTex = K.canvasTex(32, 32, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const pointsMat = (size, o = {}) => new T.PointsMaterial({ size, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true, opacity: o.opacity ?? 1, blending: o.add ? T.AdditiveBlending : T.NormalBlending, toneMapped: !o.add, fog: o.fog ?? true });
  // o tamanho do ponto do three.js não acompanha a câmera ortográfica (vista de cima, em pixels) nem o zoom da luneta (ignora o fov):
  // converte metros para o tamanho certo a cada quadro
  const sizeInMeters = (pts, size) => { pts.onBeforeRender = (r, s, cam) => { pts.material.size = cam.isOrthographicCamera ? size * r.domElement.height / ((cam.top - cam.bottom) / cam.zoom) : size / Math.tan(cam.fov * Math.PI / 360); }; };
  // partículas numa caixa: 'cai' (neve, pétalas, confete), 'sobe' (faíscas, bolhas, vapor), 'paira' (vagalumes, poeira na luz)
  K.particles = (o) => {
    const n = o.n || 120, r = K.rng((seed | 0) + n * 7 + K.ticks.length * 131), cols = [].concat(o.cor || 0xffffff).map(c => new T.Color(c));
    const x0 = o.x0, x1 = o.x1, z0 = o.z0, z1 = o.z1, y0 = o.y0 ?? 0, y1 = o.y1 ?? 6, H = y1 - y0, v = o.vel ?? 0.4, sway = o.balanco ?? 0.3, modo = o.modo || 'cai';
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), base = [];
    for (let i = 0; i < n; i++) { const c = cols[i % cols.length]; col.set([c.r, c.g, c.b], i * 3); base.push({ x: x0 + r() * (x1 - x0), z: z0 + r() * (z1 - z0), y: r() * H, ph: r() * 6.28, sp: 0.6 + r() * 0.8, c }); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
    const pts = new T.Points(geo, pointsMat(o.tam || 0.08, o)); pts.frustumCulled = false; pts.userData.noCol = true; sizeInMeters(pts, o.tam || 0.08); (o.parent || root).add(pts);
    K.tick((dt, t) => {
      for (let i = 0; i < n; i++) {
        const b = base[i]; let y;
        if (modo === 'cai') y = y0 + (((b.y - t * v * b.sp) % H) + H) % H;
        else if (modo === 'sobe') y = y0 + ((b.y + t * v * b.sp) % H);
        else y = y0 + b.y + Math.sin(t * v * b.sp + b.ph) * 0.4;
        pos[i * 3] = b.x + Math.sin(t * 0.9 * b.sp + b.ph) * sway; pos[i * 3 + 1] = y; pos[i * 3 + 2] = b.z + Math.cos(t * 0.7 * b.sp + b.ph) * sway;
        if (o.pisca) { const k = 0.35 + 0.65 * Math.max(0, Math.sin(t * o.pisca * b.sp + b.ph)); col[i * 3] = b.c.r * k; col[i * 3 + 1] = b.c.g * k; col[i * 3 + 2] = b.c.b * k; }
        else if (modo === 'sobe') { const k = 1 - (y - y0) / H; col[i * 3] = b.c.r * k; col[i * 3 + 1] = b.c.g * k; col[i * 3 + 2] = b.c.b * k; }
      }
      geo.attributes.position.needsUpdate = true; if (o.pisca || modo === 'sobe') geo.attributes.color.needsUpdate = true;
    });
    return pts;
  };
  // brilhos que piscam numa superfície (reflexo de lanternas na água, lantejoulas, gelo)
  K.glints = (o) => K.particles(Object.assign({ modo: 'paira', vel: 0.15, balanco: 0.25, pisca: 2.2, add: true, y1: (o.y0 ?? 0) + 0.02 }, o));
  // fogos de artifício no céu: estouros em sequência, cada um um Points que abre, cai e apaga
  K.fireworks = (o) => {
    const r = K.rng((seed | 0) + 977), N = 70, cols = [].concat(o.cores || [0xffc860, 0xff5a7a, 0x7ad8ff, 0xb48cff]).map(c => new T.Color(c)), shells = [];
    for (let s = 0; s < (o.n || 3); s++) {
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), dir = [];
      for (let i = 0; i < N; i++) { const a = r() * 6.28, e = Math.acos(2 * r() - 1); dir.push([Math.sin(e) * Math.cos(a), Math.cos(e), Math.sin(e) * Math.sin(a)]); }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
      const pts = new T.Points(geo, pointsMat(o.tam || 0.3, { add: true, fog: false })); pts.frustumCulled = false; sizeInMeters(pts, o.tam || 0.3); pts.userData.noCol = true; pts.visible = false; root.add(pts);
      shells.push({ pts, geo, pos, col, dir, t0: -1 - s * (o.cada || 2.6) / (o.n || 3), cx: 0, cy: 0, cz: 0, c: cols[0], c2: cols[1] });
    }
    const per = o.cada || 2.6, life = 2.2;
    K.tick((dt, t) => {
      for (const sh of shells) {
        // primeira vez, ou o relógio voltou (a montagem do jogo simula tempo adiantado): reagenda em sequência
        if (sh.t0 < 0 || sh.t0 - t > per * shells.length + 1) sh.t0 = t + shells.indexOf(sh) * per + r() * 0.5;
        let u = t - sh.t0;
        if (u < 0) { sh.pts.visible = false; continue; }
        if (u > per * shells.length || !sh.R) { sh.t0 = t + (sh.R ? r() * 0.6 : 0); u = 0; sh.cx = o.x0 + r() * (o.x1 - o.x0); sh.cy = o.y + r() * (o.dy || 8); sh.cz = o.z + (r() - 0.5) * (o.dz || 10); sh.c = cols[Math.floor(r() * cols.length)]; sh.c2 = cols[Math.floor(r() * cols.length)]; sh.R = (o.raio || 7) * (0.7 + r() * 0.6); }
        sh.pts.visible = u < life; if (!sh.pts.visible) continue;
        const e = 1 - Math.pow(1 - Math.min(1, u / 0.9), 3), fade = Math.max(0, 1 - u / life), g = u * u * 0.9;
        for (let i = 0; i < N; i++) { const d = sh.dir[i], c = i % 3 ? sh.c : sh.c2, tw = 0.6 + 0.4 * Math.sin(u * 30 + i); sh.pos[i * 3] = sh.cx + d[0] * sh.R * e; sh.pos[i * 3 + 1] = sh.cy + d[1] * sh.R * e - g; sh.pos[i * 3 + 2] = sh.cz + d[2] * sh.R * e; sh.col[i * 3] = c.r * fade * tw * 2; sh.col[i * 3 + 1] = c.g * fade * tw * 2; sh.col[i * 3 + 2] = c.b * fade * tw * 2; }
        sh.geo.attributes.position.needsUpdate = true; sh.geo.attributes.color.needsUpdate = true;
      }
    });
    return shells;
  };
  // bando de pássaros (gaivotas, pombos, andorinhas) dando voltas bem acima da cena; asas batendo
  K.birds = (o) => {
    const n = o.n || 7, r = K.rng((seed | 0) + 4441), s = o.tam || 0.35;
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute([0, 0, 0.25 * s, -s, 0.12 * s, -0.1 * s, 0, 0, -0.2 * s, 0, 0, 0.25 * s, 0, 0, -0.2 * s, s, 0.12 * s, -0.1 * s], 3)); g.computeVertexNormals();
    const m = new T.InstancedMesh(g, new T.MeshBasicMaterial({ color: o.cor ?? 0x2a2a30, side: T.DoubleSide, fog: true }), n); m.frustumCulled = false; m.userData.noCol = true; m.raycast = () => { }; root.add(m);
    const b = []; for (let i = 0; i < n; i++) b.push({ ph: r() * 6.28, rr: (o.r || 18) * (0.8 + r() * 0.4), dy: (r() - 0.5) * 2.5, w: (o.vel || 0.18) * (0.85 + r() * 0.3), f: 7 + r() * 4 });
    const q = new T.Object3D();
    K.tick((dt, t) => {
      b.forEach((p, i) => { const a = p.ph + t * p.w; q.position.set(o.x + Math.cos(a) * p.rr, o.y + p.dy + Math.sin(t * 0.5 + p.ph) * 0.8, o.z + Math.sin(a) * p.rr * 0.6); q.rotation.set(0, -a, Math.sin(t * 0.7 + p.ph) * 0.2); const fl = Math.sin(t * p.f + p.ph); q.scale.set(1, 0.2 + fl * 1.6, 1); q.updateMatrix(); m.setMatrixAt(i, q.matrix); });
      m.instanceMatrix.needsUpdate = true;
    });
    return m;
  };
  // quem está na cena (o motor troca por uma função que devolve os personagens); K.perto conta gente a menos de r de (x, z) na altura y
  K.gente = () => []; K.bandos = [];
  K.perto = (x, z, r, y = 0) => { let n = 0; for (const c of K.gente()) { const p = c.position; if (Math.abs(p.y - y) < 1.2 && (p.x - x) ** 2 + (p.z - z) ** 2 < r * r) n++; } return n; };
  // bando de pombos no chão em volta de (x, y, z): ciscam e andam um pouco; quando alguém chega a menos de o.alerta, ou de vez em
  // quando sozinhos, levantam voo, dão voltas no alto e pousam de novo no mesmo lugar. Duas chamadas de desenho por bando.
  // Devolve { assustar() } para o cenário espantar o bando por outro motivo (um flash, um tiro de rolha).
  K.pombos = (o) => {
    const n = o.n || 9, r = K.rng((seed | 0) + 5003 + K.ticks.length * 17), y0 = o.y || 0, raio = o.r || 1.2, alerta = o.alerta || 1.6;
    const body = K.juntar([
      [new T.SphereGeometry(0.075, 8, 6).scale(1, 0.85, 1.7).translate(0, 0.1, 0), o.cor || 0x8a8e98],
      [new T.SphereGeometry(0.05, 8, 6).scale(1, 1.1, 1).translate(0, 0.17, 0.1), 0x4e7a6e],
      [new T.SphereGeometry(0.042, 8, 6).translate(0, 0.21, 0.13), 0x5a6270],
      [new T.ConeGeometry(0.012, 0.04, 5).rotateX(Math.PI / 2).translate(0, 0.205, 0.18), 0x2a2224],
      [new T.BoxGeometry(0.08, 0.012, 0.1).translate(0, 0.1, -0.16), 0x4a4e58],
      [new T.CylinderGeometry(0.006, 0.006, 0.05, 4).translate(0.025, 0.025, 0), 0xc86a6a], [new T.CylinderGeometry(0.006, 0.006, 0.05, 4).translate(-0.025, 0.025, 0), 0xc86a6a]]);
    // asas: um V com as duas faces (triângulos repetidos ao contrário). Corpo e asas usam um material de cor única, sem cor por
    // vértice: instanciado com cor por vértice seria um shader novo, e compilar shader é o que mais pesa na carga
    const ws = 0.2, wv = [0, 0, 0.07, -ws, 0.06, -0.04, 0, 0, -0.1, 0, 0, 0.07, 0, 0, -0.1, ws, 0.06, -0.04], wf = []; for (let k = 0; k < wv.length; k += 9) wf.push(...wv.slice(k, k + 3), ...wv.slice(k + 6, k + 9), ...wv.slice(k + 3, k + 6));
    const wg = new T.BufferGeometry(); wg.setAttribute('position', new T.Float32BufferAttribute(wv.concat(wf), 3)); wg.translate(0, 0.13, 0); wg.computeVertexNormals(); body.deleteAttribute('color');
    const mat = new T.MeshStandardMaterial({ color: o.cor || 0x7a7e88, roughness: 0.85 }), mb = new T.InstancedMesh(body, mat, n), mw = new T.InstancedMesh(wg, mat, n);
    for (const m of [mb, mw]) { m.frustumCulled = false; m.userData.noCol = true; m.raycast = () => { }; m.castShadow = false; root.add(m); }
    // o.eixo ('x' ou 'z'): em vez de um disco, ficam numa faixa estreita (o.larg) ao longo do eixo, como em cima de uma mureta
    const lugar = () => { if (o.eixo) { const u = (r() * 2 - 1) * raio, v = (r() * 2 - 1) * (o.larg || 0.04); return o.eixo === 'x' ? [o.x + u, o.z + v] : [o.x + v, o.z + u]; }
      const a = r() * 6.28, d = Math.sqrt(r()) * raio; return [o.x + Math.cos(a) * d, o.z + Math.sin(a) * d]; };
    const P = []; for (let i = 0; i < n; i++) { const [x, z] = lugar();
      P.push({ hx: x, hz: z, x, y: y0, z, tx: x, tz: z, rot: r() * 6.28, idle: r() * 3, pk: r() * 6.28, dl: r() * 0.5, a0: r() * 6.28, rr: (o.voo || 5) * (0.75 + r() * 0.5), h: 4 + r() * 3.5, w: (0.55 + r() * 0.3) * (r() < 0.5 ? 1 : -1), f: 13 + r() * 5 }); }
    const q = new T.Object3D(), C = new T.Vector3(), L = new T.Vector3(), ease = (u) => u * u * (3 - 2 * u);
    let tv = -1, dur = 0, calma = 4, chk = 0, sozinho = 40 + r() * 50;
    const voar = () => { if (tv >= 0 || calma > 0) return; tv = 0; dur = 9 + r() * 6; };
    K.tick((dt, t) => {
      dt = Math.min(dt, 0.1); calma -= dt; chk -= dt; sozinho -= dt;
      if (chk <= 0) { chk = 0.25; if (tv < 0 && K.perto(o.x, o.z, raio + alerta, y0)) voar(); }
      if (sozinho <= 0) { sozinho = 50 + r() * 60; voar(); }
      if (tv >= 0) { tv += dt; if (tv > dur + 4) { tv = -1; calma = 6; } }
      P.forEach((p, i) => {
        const v = tv - p.dl; let fl = 0, voando = false;
        if (tv >= 0 && v > 0) {
          voando = true; const a = p.a0 + p.w * v; C.set(o.x + Math.cos(a) * p.rr, y0 + p.h + Math.sin(v * 1.3 + p.a0) * 0.4, o.z + Math.sin(a) * p.rr);
          L.set(p.x, p.y, p.z);
          if (v < 1.6) { const u = ease(v / 1.6); C.set(p.hx + (C.x - p.hx) * u, y0 + (C.y - y0) * Math.sqrt(v / 1.6), p.hz + (C.z - p.hz) * u); }
          else if (v > dur - 0.5) { const u = Math.min(1, (v - dur + 0.5) / 3.5), e = ease(u); C.set(C.x + (p.hx - C.x) * e, C.y + (y0 - C.y) * e + Math.sin(u * Math.PI) * 0.6, C.z + (p.hz - C.z) * e); if (u >= 1) { voando = false; C.set(p.hx, y0, p.hz); } }
          p.x = C.x; p.y = C.y; p.z = C.z; const dx = p.x - L.x, dz = p.z - L.z; if (dx * dx + dz * dz > 1e-6) p.rot = Math.atan2(dx, dz);
          fl = voando ? Math.sin(t * p.f + p.pk) : 0; if (!voando) { p.tx = p.x; p.tz = p.z; }
        } else {
          p.y = y0; const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz);
          if (d > 0.02) { const s = Math.min(d, dt * 0.35); p.x += dx / d * s; p.z += dz / d * s; p.rot = Math.atan2(dx, dz); }
          else if ((p.idle -= dt) <= 0) { p.idle = 1 + r() * 4; [p.tx, p.tz] = lugar(); }
        }
        const anda = !voando && Math.hypot(p.tx - p.x, p.tz - p.z) > 0.02, bica = !voando && !anda ? Math.max(0, Math.sin(t * 3.1 + p.pk)) ** 6 * 0.7 : 0;
        q.position.set(p.x, p.y + (anda ? Math.abs(Math.sin(t * 14 + p.pk)) * 0.01 : 0), p.z); q.rotation.set(voando ? -0.15 : bica, p.rot, 0); q.scale.setScalar(o.tam || 1); q.updateMatrix(); mb.setMatrixAt(i, q.matrix);
        if (voando) q.scale.set(o.tam || 1, (o.tam || 1) * (0.3 + fl * 1.5), o.tam || 1); else q.scale.set((o.tam || 1) * 0.3, (o.tam || 1) * 0.25, o.tam || 1);
        q.updateMatrix(); mw.setMatrixAt(i, q.matrix);
      });
      mb.instanceMatrix.needsUpdate = true; mw.instanceMatrix.needsUpdate = true;
    });
    const api = { assustar: () => { calma = 0; voar(); }, voando: () => tv >= 0 }; K.bandos.push(api); return api;
  };
  // borboletas pairando sobre flores em pontos [[x, z], ...] (o.y = altura das flores): quando alguém passa a menos de o.alerta de
  // uma flor, as dela sobem em zigue-zague e voltam depois. Duas cores, uma chamada de desenho cada, mesmo truque de faces das asas.
  K.borboletas = (o) => {
    const r = K.rng((seed | 0) + 7177 + K.ticks.length * 17), por = o.n || 3, y0 = o.y || 0.7, alerta = o.alerta || 1.3, tam = o.tam || 1;
    const wv = [0, 0, 0.03, -0.07, 0.01, 0.05, 0, 0, -0.03, -0.07, 0.01, 0.05, -0.055, 0.01, -0.06, 0, 0, -0.03, 0, 0, 0.03, 0, 0, -0.03, 0.07, 0.01, 0.05, 0, 0, -0.03, 0.055, 0.01, -0.06, 0.07, 0.01, 0.05], wf = [];
    for (let k = 0; k < wv.length; k += 9) wf.push(...wv.slice(k, k + 3), ...wv.slice(k + 6, k + 9), ...wv.slice(k + 3, k + 6));
    const wg = new T.BufferGeometry(); wg.setAttribute('position', new T.Float32BufferAttribute(wv.concat(wf), 3)); wg.computeVertexNormals();
    const cores = [].concat(o.cores || [0xf6f2e6, 0xf2b630]), B = [], ms = [];
    o.pontos.forEach(([x, z], pi) => { for (let k = 0; k < por; k++) B.push({ x, z, pi, c: (pi + k) % cores.length, ph: r() * 6.28, f: 9 + r() * 5, p: new T.Vector3(x, y0, z), fug: -1, a: r() * 6.28 }); });
    const cnt = cores.map((_, c) => B.filter(b => b.c === c).length);
    cores.forEach((c, i) => { const mm = new T.InstancedMesh(wg, new T.MeshStandardMaterial({ color: c, roughness: 0.8 }), cnt[i]); mm.frustumCulled = false; mm.userData.noCol = true; mm.raycast = () => { }; root.add(mm); ms.push(mm); });
    const q = new T.Object3D(), alvo = new T.Vector3(), susto = o.pontos.map(() => 0); let chk = 0;
    K.tick((dt, t) => {
      dt = Math.min(dt, 0.1); chk -= dt;
      if (chk <= 0) { chk = 0.3; o.pontos.forEach(([x, z], i) => { if (susto[i] <= 0 && K.perto(x, z, alerta, o.chao || 0)) susto[i] = 6 + r() * 3; }); }
      for (let i = 0; i < susto.length; i++) susto[i] -= dt;
      const ix = cores.map(() => 0);
      B.forEach((b) => {
        const fugindo = susto[b.pi] > 0, u = t * 0.9 + b.ph;
        if (fugindo) { b.a += (Math.sin(t * 2.3 + b.ph) * 2.5) * dt; alvo.set(b.x + Math.cos(b.a) * 1.6, y0 + 1.6 + Math.sin(t * 1.7 + b.ph) * 0.5, b.z + Math.sin(b.a) * 1.6); }
        else alvo.set(b.x + Math.sin(u) * 0.22, y0 + 0.12 + Math.abs(Math.sin(u * 1.7)) * 0.12, b.z + Math.cos(u * 1.3) * 0.22);
        const dx = alvo.x - b.p.x, dz = alvo.z - b.p.z; b.p.lerp(alvo, Math.min(1, dt * (fugindo ? 2.2 : 1.4)));
        const pousa = !fugindo && Math.sin(u * 0.37) > 0.6, th = pousa ? 1.2 + Math.sin(t * 2 + b.ph) * 0.15 : 0.35 + Math.sin(t * b.f + b.ph) * 0.75; // ângulo das asas
        q.position.copy(b.p); if (pousa) q.position.y = y0 + 0.02; q.rotation.set(0, Math.atan2(dx, dz), 0); q.scale.set(tam * Math.max(0.12, Math.cos(th)), tam * Math.sin(th) * 7, tam); q.updateMatrix();
        ms[b.c].setMatrixAt(ix[b.c]++, q.matrix);
      });
      ms.forEach(m => m.instanceMatrix.needsUpdate = true);
    });
  };
  // varanda/janela de onde o sniper atira (uma moldura simples no ponto dado)
  K.sniperNest = (x, y, z, o = {}) => {
    const g = K.group(x, y, z, o.ry || Math.PI, o.parent), wm = o.mat || K.mat(0x3a3530, { roughness: 0.8 });
    K.box(2.4, 0.15, 1.4, wm, 0, -0.9, 0, { parent: g }); K.box(2.4, 1.0, 0.12, wm, 0, -0.4, 0.66, { parent: g });
    K.box(0.12, 2.6, 0.12, wm, -1.15, 0.4, 0.66, { parent: g }); K.box(0.12, 2.6, 0.12, wm, 1.15, 0.4, 0.66, { parent: g });
    return g;
  };

  // ---------------------------------------------------------------- ninho temático do sniper (sc.ninho(K, g))
  // peças fixas do ninho juntadas num só draw call (cor por vértice): N.box/cyl/geo(..., cor) e N.fim(); o resto (texturas,
  // coisas que mexem) vai direto com { parent: g }. Referência: olho na origem, -z para a festa, superfície em y = -0,79.
  // manchas para texturas pintadas: n elipses de cores sorteadas em cols ('r,g,b'), raio entre r0 e r1, alfa até al
  K.manchas = (c, w, h, R, n, cols, r0 = 3, r1 = 24, al = 0.15) => { for (let k = 0; k < n; k++) { c.fillStyle = `rgba(${cols[(R() * cols.length) | 0]},${al * (0.3 + R() * 0.7)})`; c.beginPath(); c.ellipse(R() * w, R() * h, r0 + R() * (r1 - r0), (r0 + R() * (r1 - r0)) * 0.4, R() * 3, 0, 7); c.fill(); } };
  K.ninhoPecas = (g, mo = {}) => {
    const parts = [], N = {
      geo: (geo, c, x, y, z, ry = 0, rx = 0, rz = 0) => { parts.push([K.at(geo, x, y, z, ry, rx, rz), c]); return N; },
      box: (w, h, d, c, x, y, z, ry, rx, rz) => N.geo(new T.BoxGeometry(w, h, d), c, x, y, z, ry, rx, rz),
      cyl: (rt, rb, h, c, x, y, z, seg = 10, ry, rx, rz) => N.geo(new T.CylinderGeometry(rt, rb, h, seg), c, x, y, z, ry, rx, rz),
      // tampo do ninho: topo exato em -0,79, com uma borda à frente que desce
      // o tampo é o que mais aparece do ninho (uma faixa no rodapé da tela): draw(ctx, w, h) pinta o topo, 1 px ≈ 5 mm
      tampo: (c, o = {}) => { const x0 = o.x0 || -2.4, x1 = o.x1 || 2.4, z0 = o.z0 || -1.3, z1 = o.z1 || -0.45, h = o.h || 0.22, top = o.draw ? -0.7915 : -0.79;
        N.box(x1 - x0, h, z1 - z0, c, (x0 + x1) / 2, top - h / 2, (z0 + z1) / 2);
        if (o.draw) { const w = Math.round((x1 - x0) * 200), d = Math.round((z1 - z0) * 200), tex = K.canvasTex(w, d, (ctx) => o.draw(ctx, w, d, K.rng(o.seed || 7)));
          K.add(new T.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2), K.texMat(tex, Object.assign({ roughness: 0.8 }, o.mat)), (x0 + x1) / 2, -0.79, (z0 + z1) / 2, { parent: g, cast: false }); }
        return N; },
      fim: () => parts.length ? K.merge(parts, K.vcol(mo), { parent: g, cast: false }) : null,
    };
    return N;
  };
  return K;
}
window.MIRA_KIT = MIRA_KIT;
