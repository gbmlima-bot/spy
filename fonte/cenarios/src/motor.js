// Mira na Cobertura: motor da prévia dos cenários extras.
// Carrega um cenário de MIRA_CENARIOS, espalha convidados IA, coloca o elenco único nos postos e deixa você
// andar como agente (WASD, E para missões e assentos) ou olhar pela luneta do sniper (Q, roda = zoom, clique = identificar).
const T = THREE;
const $ = s => document.querySelector(s);
const RAD = 0.28, ACT_T = 4, NPC_N = 26;

// ---------------------------------------------------------------- renderer + cena
const canvas = $('#c');
const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: /shot/.test(location.search) });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
const scene = new T.Scene();
scene.fog = new T.Fog(0x1a2238, 70, 190);
const MATS = new Map();
function mat(color, o = {}) { const key = color + JSON.stringify(o); if (!MATS.has(key)) MATS.set(key, new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.75, metalness: 0.05, envMapIntensity: 0.3 }, o))); return MATS.get(key); }
function glow(color, k) { return new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), toneMapped: false }); }
function rbox(w, h, d, r) { const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); const g = new T.ExtrudeGeometry(s, { depth: d - 2 * Math.min(r, d / 3), bevelEnabled: true, bevelThickness: Math.min(r, d / 3), bevelSize: Math.min(r, d / 3) * 0.9, bevelSegments: 2, curveSegments: 4 }); g.center(); return g; }
const glassClear = new T.MeshStandardMaterial({ color: 0xe8f2ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.45, envMapIntensity: 1.2 });
const walnut = mat(0x5e3b22, { roughness: 0.55 });
const blobMat = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(0.45, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false, opacity: 0.55, toneMapped: false }); })();
let envTex = null;
try { if (T.RoomEnvironment) { const pm = new T.PMREMGenerator(renderer); envTex = pm.fromScene(new T.RoomEnvironment(), 0.04).texture; scene.environment = envTex; } } catch (e) { envTex = null; }
const hemi = new T.HemisphereLight(0x8ea4d6, 0x5a4434, 0.2); scene.add(hemi);
const sun = new T.DirectionalLight(0xffb878, 0.95); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, near: 1, far: 160 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025; scene.add(sun); scene.add(sun.target);
const fill = new T.DirectionalLight(0x7f94d0, 0.35); fill.position.set(18, 14, -10); scene.add(fill);
//@@CHARS@@

// ---------------------------------------------------------------- cenário atual
const W = { i: -1, sc: null, K: null, root: null, ents: [], chars: [], grids: [], rings: [], done: {}, t: 0 };
const LV = lv => (W.sc.niveis[lv] || W.sc.niveis[0]);
const LVY = lv => LV(lv || 0).y || 0;
function blocked(x, z, r = RAD, lv = 0) {
  const L = LV(lv);
  if (x < L.x0 + r * 0.5 || x > L.x1 - r * 0.5 || z < L.z0 + r * 0.5 || z > L.z1 - r * 0.5) return true;
  for (const b of W.K.cols) if ((b.lv || 0) === lv && x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r) return true;
  return false;
}
function moveC(e, vx, vz, dt) {
  const lv = e.lv || 0, inside = blocked(e.x, e.z, RAD, lv);
  const nx = e.x + vx * dt; if (inside || !blocked(nx, e.z, RAD, lv)) e.x = nx;
  const nz = e.z + vz * dt; if (inside || !blocked(e.x, nz, RAD, lv)) e.z = nz;
}
// grade de navegação por nível (células de 0.2 m) + A*
const CELL = 0.2;
function buildGrid(lv) {
  const L = LV(lv), nx = Math.ceil((L.x1 - L.x0) / CELL), nz = Math.ceil((L.z1 - L.z0) / CELL), b = new Uint8Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) b[j * nx + i] = blocked(L.x0 + (i + 0.5) * CELL, L.z0 + (j + 0.5) * CELL, RAD, lv) ? 1 : 0;
  return { L, nx, nz, b, lv };
}
function cellOf(g, x, z) { return [Math.max(0, Math.min(g.nx - 1, Math.floor((x - g.L.x0) / CELL))), Math.max(0, Math.min(g.nz - 1, Math.floor((z - g.L.z0) / CELL)))]; }
function nearestFree(g, i, j) { if (!g.b[j * g.nx + i]) return [i, j]; for (let r = 1; r < 12; r++) for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) { const a = i + di, c = j + dj; if (a >= 0 && c >= 0 && a < g.nx && c < g.nz && !g.b[c * g.nx + a]) return [a, c]; } return null; }
function los(g, x0, z0, x1, z1) { const d = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(d / (CELL * 0.5)); for (let k = 1; k < n; k++) { const u = k / n; const [i, j] = cellOf(g, x0 + (x1 - x0) * u, z0 + (z1 - z0) * u); if (g.b[j * g.nx + i]) return false; } return true; }
function astar(lv, fx, fz, tx, tz) {
  const g = W.grids[lv]; if (!g) return null;
  const s = nearestFree(g, ...cellOf(g, fx, fz)), t = nearestFree(g, ...cellOf(g, tx, tz)); if (!s || !t) return null;
  const N = g.nx * g.nz, S = s[1] * g.nx + s[0], E = t[1] * g.nx + t[0];
  const gs = new Float32Array(N).fill(1e9), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N); gs[S] = 0;
  const open = [[0, S]]; const h = k => Math.hypot(k % g.nx - t[0], Math.floor(k / g.nx) - t[1]);
  let it = 0;
  while (open.length && it++ < 40000) {
    let bi = 0; for (let q = 1; q < open.length; q++) if (open[q][0] < open[bi][0]) bi = q;
    const [, cur] = open[bi]; open[bi] = open[open.length - 1]; open.pop();
    if (closed[cur]) continue; closed[cur] = 1; if (cur === E) break;
    const ci = cur % g.nx, cj = Math.floor(cur / g.nx);
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue; const a = ci + di, c = cj + dj; if (a < 0 || c < 0 || a >= g.nx || c >= g.nz) continue;
      const k = c * g.nx + a; if (g.b[k] || closed[k]) continue; if (di && dj && (g.b[cj * g.nx + a] || g.b[c * g.nx + ci])) continue;
      const ng = gs[cur] + (di && dj ? 1.414 : 1); if (ng < gs[k]) { gs[k] = ng; came[k] = cur; open.push([ng + h(k), k]); }
    }
  }
  if (came[E] < 0 && S !== E) return null;
  const pts = []; for (let k = E; k !== -1 && k !== S; k = came[k]) pts.push([g.L.x0 + (k % g.nx + 0.5) * CELL, g.L.z0 + (Math.floor(k / g.nx) + 0.5) * CELL]);
  pts.reverse(); pts.push([tx, tz]);
  // suaviza: pula pontos com linha de visada livre
  const out = []; let px = fx, pz = fz, i = 0;
  while (i < pts.length) { let j = pts.length - 1; while (j > i && !los(g, px, pz, pts[j][0], pts[j][1])) j--; out.push(pts[j]); px = pts[j][0]; pz = pts[j][1]; i = j + 1; }
  return out;
}
// rota entre níveis: anda até a ponta da escada, sobe/desce em linha reta, segue no outro nível
function route(e, tx, tz, tlv) {
  const steps = []; let x = e.x, z = e.z, lv = e.lv || 0;
  let guard = 0;
  while (lv !== tlv && guard++ < 6) {
    const up = tlv > lv, es = (W.sc.escadas || []).find(s => up ? s.de === lv && s.para === lv + 1 : s.para === lv && s.de === lv - 1);
    if (!es) return null;
    const a = up ? es.a : es.b, b = up ? es.b : es.a, nl = up ? lv + 1 : lv - 1;
    const p = astar(lv, x, z, a[0], a[1]); if (!p) return null;
    p.forEach(q => steps.push({ x: q[0], z: q[1], lv }));
    steps.push({ x: b[0], z: b[1], lv: nl, climb: true, from: lv }); x = b[0]; z = b[1]; lv = nl;
  }
  const p = astar(lv, x, z, tx, tz); if (!p) return null;
  p.forEach(q => steps.push({ x: q[0], z: q[1], lv }));
  return steps;
}

// ---------------------------------------------------------------- roupas
const SKIN = [0xf3d0b0, 0xe6b48f, 0xcf946c, 0xa36d4b, 0x7a4e33, 0x5a3725];
const HAIR = [[0x1a1411, ''], [0x3b2a1e, ''], [0x6b4a2b, ''], [0xd9b46a, ', cabelo loiro'], [0xa9a9a9, ', cabelo grisalho'], [0x8a3a22, ', cabelo ruivo']];
const TIES = [0x8b1e2d, 0x1e3a8b, 0x111111, 0xc9a227, 0x2c6e49, 0x6b3f8c];
const DRINK = [0xd94040, 0xf2c14e, 0xffd9a0, 0x9be0c0, 0xb3122e];
const pickR = (a, r) => a[Math.floor(r() * a.length)];
function crowdOutfit(sc, id) {
  const r = W.K.rng(9001 + id * 7919); r(); r();
  const gr = sc.guardaRoupa || {};
  const base = { satin: false, accent: 0xd9a441, shoe: 0x1b1b1f, necklace: false, earring: false, clutch: false, beard: false, bow: false, pocket: 0, glass: false, drink: 0xf2c14e, gown: false };
  const dress = r() < (gr.vestidoChance ?? 0.5);
  const [main, nm] = pickR(dress ? gr.vestidos : gr.ternos, r);
  const [hair, hn] = pickR(HAIR, r);
  const o = Object.assign(base, { dress, main, skin: pickR(SKIN, r), hair, shirt: 0xf6f3ec, tie: pickR(TIES, r) });
  if (dress) { o.gown = r() < (gr.longo ?? 0.55); o.satin = r() < 0.5; o.hairStyle = pickR(['long', 'long', 'bun', 'bob', 'bun'], r); o.accent = pickR([0xd9a441, 0xc9ced6, 0x1b1b1f], r); o.shoe = pickR([0x1b1b1f, 0xd9a441, main], r); o.necklace = r() < 0.45; o.earring = r() < 0.7; o.clutch = r() < 0.4; }
  else { o.pants = r() < 0.75 ? main : 0x1b1b1f; o.hairStyle = pickR(['short', 'quiff'], r); o.beard = r() < 0.25; o.bow = r() < 0.35; o.pocket = r() < 0.4 ? pickR([0xf6f3ec, 0xc8322f, 0xd9a441], r) : 0; }
  o.glass = r() < (gr.taca ?? 0.6) ? pickR(gr.tacas || ['wine', 'coupe', 'tumbler'], r) : false;
  o.drink = pickR(gr.drinks || DRINK, r);
  o.name = nm + hn;
  if (gr.extra) gr.extra(o, r);
  return o;
}
function castOutfit(c) {
  const base = { satin: false, accent: 0xd9a441, shoe: 0x1b1b1f, necklace: false, earring: false, clutch: false, beard: false, bow: false, pocket: 0, glass: false, drink: 0xf2c14e, gown: false, shirt: 0xf6f3ec, tie: 0x111111, hairStyle: 'short', hair: 0x1a1411 };
  const o = Object.assign(base, c.outfit); o.skin = typeof o.skin === 'number' && o.skin < 10 ? SKIN[o.skin] : (o.skin ?? SKIN[1]); return o;
}

// ---------------------------------------------------------------- carregar cenário
const SLOT_STAY = { dance: 8, sit: 14, lie: 14, piano: 16, yoga: 18, cards: 22, tub: 22, bean: 20, chess: 24, selfie: 5, slot: 10 };
const SLOT_W = { talk: 5, dance: 3, bar: 2.5, view: 2, sit: 1.5, lie: 1, piano: 0.3, yoga: 2, cards: 2.5, tub: 2, bean: 2, chess: 1.2, selfie: 1, slot: 2 };
const SEAT_ANIM = { sit: 7, lie: 8, piano: 9, yoga: 11, cards: 12, tub: 15, bean: 16, chess: 17, selfie: 18, slot: 20, dance: 3, view: 0 };
const SEAT_LABEL = { sit: 'Sentar', lie: 'Deitar', piano: 'Tocar', yoga: 'Fazer yoga', cards: 'Jogar cartas', tub: 'Entrar na água', bean: 'Deitar no pufe', chess: 'Jogar xadrez', selfie: 'Tirar uma selfie', slot: 'Jogar', dance: 'Dançar', view: 'Apreciar a vista', bar: 'Pedir um drinque', talk: 'Conversar' };
function disposeTree(o) { o.traverse(n => { if (n.geometry) n.geometry.dispose(); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); }); }
function skyTex(c) { const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256; const g = cv.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 256); c.forEach((s, i) => gr.addColorStop(i / (c.length - 1), s)); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; return t; }
function load(i) {
  i = (i + MIRA_CENARIOS.length) % MIRA_CENARIOS.length;
  if (W.root) { scene.remove(W.root); disposeTree(W.root); }
  if (W.charRoot) { scene.remove(W.charRoot); }
  const sc = W.sc = MIRA_CENARIOS[i]; W.i = i; W.done = {}; W.t = 0;
  W.root = new T.Group(); scene.add(W.root);
  const K = W.K = MIRA_KIT(T, W.root, 7 + i * 131);
  K.gente = () => W.chars;
  sc.niveis = sc.niveis || [{ nome: 'chão', y: 0, x0: -14.5, x1: 14.5, z0: -10, z1: 10 }];
  // os níveis acima do 0 ficam num grupo erguido
  K.lvGroup = sc.niveis.map((L, k) => { if (!k) return W.root; const g = new T.Group(); g.position.y = L.y; W.root.add(g); return g; });
  sc.build(K);
  // ambiente
  const A = sc.ambiente || {};
  scene.background = skyTex(A.ceu || ['#0e1630', '#2a3558', '#c98a5a']);
  const nb = A.neblina || [0x1a2238, 70, 190]; scene.fog.color.set(nb[0]); scene.fog.near = nb[1]; scene.fog.far = nb[2];
  const hm = A.hemi || [0x8ea4d6, 0x5a4434, 0.2]; hemi.color.set(hm[0]); hemi.groundColor.set(hm[1]); hemi.intensity = hm[2];
  const so = A.sol || [0xffb878, 0.95, -22, 19, 14]; sun.color.set(so[0]); sun.intensity = so[1]; sun.position.set(so[2], so[3], so[4]);
  const fl = A.preenche || [0x7f94d0, 0.35]; fill.color.set(fl[0]); fill.intensity = fl[1];
  scene.environment = A.semReflexo ? null : envTex;
  if (bloomPass) bloomPass.strength = A.bloom ?? 0.55;
  W.exposure = A.exposicao ?? 1.0;
  // navegação
  W.grids = sc.niveis.map((_, lv) => buildGrid(lv));
  // anéis das missões
  W.rings = (sc.missoes || []).map(m => { const r = new T.Mesh(new T.RingGeometry(0.38, 0.48, 32), new T.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.85, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.position.set(m.s[0], LVY(m.lv) + 0.03, m.s[1]); W.root.add(r); return r; });
  for (const k in K.tells) K.tells[k].reset && K.tells[k].reset();
  // pessoas
  W.charRoot = new T.Group(); scene.add(W.charRoot);
  W.slots = K.slots.map(s => ({ ...s, busy: -1 }));
  (sc.missoes || []).forEach((m, mi) => W.slots.push({ x: m.s[0], z: m.s[1], rot: Math.atan2(m.l[0] - m.s[0], m.l[1] - m.s[1]), type: 'obj', obj: mi, lv: m.lv || 0, busy: -1 }));
  W.ents = []; W.chars = [];
  const rng = K.rng(99 + i);
  const mk = (o, e) => { const id = W.ents.length; const c = makeChar(o, id); W.charRoot.add(c); W.chars.push(c); e.id = id; e.o = o; e.y = LVY(e.lv || 0); e.path = []; e.timer = rng() * 6; e.speed = 1.1 + rng() * 0.4; W.ents.push(e); return e; };
  (sc.elenco || []).forEach(c => { const e = mk(castOutfit(c), { x: c.x, z: c.z, lv: c.lv || 0, rot: c.rot || 0, anim: c.anim ?? 0, kind: 'static', cast: c }); e.y += c.y || 0; });
  const free = W.slots.map((s, k) => k).filter(k => W.slots[k].type !== 'obj');
  for (let k = free.length - 1; k > 0; k--) { const j = Math.floor(rng() * (k + 1)); [free[k], free[j]] = [free[j], free[k]]; }
  const nN = Math.min(sc.convidados || NPC_N, free.length - 2);
  for (let n = 0; n < nN; n++) { const si = free.pop(), s = W.slots[si]; const e = mk(crowdOutfit(sc, n), { x: s.x, z: s.z, lv: s.lv, rot: s.rot, kind: 'npc', slot: si }); s.busy = e.id; arrive(e, true); }
  // jogador (o agente)
  const sp = sc.inicio || (() => { const s = W.slots[free.pop()]; return [s.x, s.z, s.lv]; })();
  W.me = mk(Object.assign(crowdOutfit(sc, 77), { name: 'você (agente)' }), { x: sp[0], z: sp[1], lv: sp[2] || 0, rot: Math.PI, anim: 0, kind: 'player' });
  meRing.visible = true;
  isoState.tx = W.me.x; isoState.tz = W.me.z; isoState.ty = W.me.y; placeIso(0, true);
  scopeState.yaw = 0; scopeState.pitch = 0; aimScopeAt(0, 0, 0);
  renderPanels();
  try { localStorage.setItem('mira-cenario', String(i)); } catch (e) { }
  const st = W.K.cols.length; window.__stats = { meshes: countMeshes(W.root), cols: st, slots: W.slots.length, ents: W.ents.length };
}
function countMeshes(o) { let n = 0; o.traverse(x => { if (x.isMesh) n++; }); return n; }
function arrive(e, initial) {
  const s = W.slots[e.slot];
  e.rot = s.type === 'dance' ? Math.random() * Math.PI * 2 : s.rot; e.path = [];
  if (s.type === 'obj') { e.st = 'act'; e.anim = 2; e.timer = 2.2 + Math.random() * 2; return; }
  e.st = 'idle'; e.timer = (SLOT_STAY[s.type] || 6) + Math.random() * 14 + (initial ? Math.random() * 6 : 0);
  e.anim = s.type === 'talk' ? 4 : s.type === 'bar' ? (Math.random() < 0.5 ? 6 : 4) : (SEAT_ANIM[s.type] ?? 0);
}
function pickNext(e) {
  let si = -1;
  if (Math.random() < 0.06 && W.sc.missoes && W.sc.missoes.length) { const mi = Math.floor(Math.random() * W.sc.missoes.length); si = W.slots.findIndex(s => s.type === 'obj' && s.obj === mi && s.busy < 0); }
  if (si < 0) {
    const c = []; let tot = 0; W.slots.forEach((s, k) => { if (s.busy < 0 && s.type !== 'obj') { const w = (SLOT_W[s.type] || 1) * (s.lv === e.lv ? 1 : 0.35); c.push([k, w]); tot += w; } });
    let r = Math.random() * tot; for (const [k, w] of c) { r -= w; if (r <= 0) { si = k; break; } }
  }
  if (si < 0) { e.timer = 3; return; }
  const s = W.slots[si], p = route(e, s.x, s.z, s.lv);
  if (!p) { e.timer = 2; return; }
  if (e.slot >= 0) W.slots[e.slot].busy = -1;
  e.slot = si; s.busy = e.id; e.path = p; e.st = 'walk'; e.anim = 1;
}
function stepNPC(e, dt) {
  if (e.kind === 'static') return;
  if (e.st === 'walk') {
    const p = e.path[0]; if (!p) { arrive(e); return; }
    if (p.climb) { // escada: interpola até a outra ponta mudando a altura
      if (!e.cl) e.cl = { x0: e.x, z0: e.z, y0: e.y, u: 0, d: Math.max(1, Math.hypot(p.x - e.x, p.z - e.z) + Math.abs(LVY(p.lv) - e.y)) };
      e.cl.u = Math.min(1, e.cl.u + dt * e.speed * 0.8 / e.cl.d);
      e.x = e.cl.x0 + (p.x - e.cl.x0) * e.cl.u; e.z = e.cl.z0 + (p.z - e.cl.z0) * e.cl.u; e.y = e.cl.y0 + (LVY(p.lv) - e.cl.y0) * e.cl.u; e.rot = Math.atan2(p.x - e.cl.x0, p.z - e.cl.z0);
      if (e.cl.u >= 1) { e.lv = p.lv; e.y = LVY(p.lv); e.cl = null; e.path.shift(); }
      return;
    }
    const dx = p.x - e.x, dz = p.z - e.z, d = Math.hypot(dx, dz);
    if (d < 0.08) { e.path.shift(); if (!e.path.length) { e.x = p.x; e.z = p.z; arrive(e); } return; }
    const v = Math.min(e.speed, d / dt);
    e.x += dx / d * v * dt; e.z += dz / d * v * dt; e.rot = lerpAngle(e.rot, Math.atan2(dx, dz), 1 - Math.exp(-dt * 10));
    return;
  }
  e.timer -= dt; if (e.timer <= 0) pickNext(e);
}
function lerpAngle(a, b, t) { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; }

// ---------------------------------------------------------------- jogador
const keys = {};
const ctrl = { act: null, seat: -1, climb: null };
addEventListener('keydown', ev => {
  if (ev.target.tagName === 'INPUT') return;
  keys[ev.code] = true;
  if (ev.code === 'KeyE') interact();
  if (ev.code === 'KeyQ') setScope(!scopeState.on);
  if (ev.code === 'BracketRight' || ev.code === 'PageDown') load(W.i + 1);
  if (ev.code === 'BracketLeft' || ev.code === 'PageUp') load(W.i - 1);
  if (ev.code === 'Escape') { if (scopeState.on) setScope(false); else toggleMenu(); }
});
addEventListener('keyup', ev => { keys[ev.code] = false; });
function nearInteraction() {
  const e = W.me, ms = W.sc.missoes || [];
  for (let k = 0; k < ms.length; k++) { const m = ms[k]; if ((m.lv || 0) === e.lv && !W.done[m.k] && Math.hypot(m.s[0] - e.x, m.s[1] - e.z) < 0.9) return { kind: 'm', k, label: m.label }; }
  for (const es of W.sc.escadas || []) {
    if (es.de === e.lv && Math.hypot(es.a[0] - e.x, es.a[1] - e.z) < 0.9) return { kind: 'up', es, label: es.rotulo ? 'Subir: ' + es.rotulo : 'Subir' };
    if (es.para === e.lv && Math.hypot(es.b[0] - e.x, es.b[1] - e.z) < 0.9) return { kind: 'down', es, label: 'Descer' };
  }
  let best = -1, bd = 0.75;
  W.slots.forEach((s, k) => { if (s.type === 'obj' || s.type === 'talk' || s.lv !== e.lv || (s.busy >= 0 && s.busy !== e.id)) return; const d = Math.hypot(s.x - e.x, s.z - e.z); if (d < bd) { bd = d; best = k; } });
  if (best >= 0) return { kind: 's', k: best, label: SEAT_LABEL[W.slots[best].type] || 'Usar' };
  return null;
}
function interact() {
  if (scopeState.on || menuOpen) return;
  const e = W.me;
  if (ctrl.seat >= 0) { W.slots[ctrl.seat].busy = -1; ctrl.seat = -1; e.anim = 0; return; }
  const n = nearInteraction(); if (!n) return;
  if (n.kind === 'm') { ctrl.act = { k: n.k, t: 0 }; e.anim = 2; const m = W.sc.missoes[n.k]; e.rot = Math.atan2(m.l[0] - e.x, m.l[1] - e.z); }
  else if (n.kind === 'up' || n.kind === 'down') { const up = n.kind === 'up', es = n.es; ctrl.climb = { x0: e.x, z0: e.z, y0: e.y, x1: up ? es.b[0] : es.a[0], z1: up ? es.b[1] : es.a[1], lv: up ? es.para : es.de, u: 0 }; }
  else { const s = W.slots[n.k]; ctrl.seat = n.k; s.busy = e.id; e.x = s.x; e.z = s.z; e.rot = s.rot; e.anim = s.type === 'bar' ? 6 : SEAT_ANIM[s.type] ?? 0; }
}
function updatePlayer(dt) {
  const e = W.me;
  if (ctrl.climb) { const c = ctrl.climb, d = Math.max(1, Math.hypot(c.x1 - c.x0, c.z1 - c.z0) + Math.abs(LVY(c.lv) - c.y0)); c.u = Math.min(1, c.u + dt * 1.3 / d); e.x = c.x0 + (c.x1 - c.x0) * c.u; e.z = c.z0 + (c.z1 - c.z0) * c.u; e.y = c.y0 + (LVY(c.lv) - c.y0) * c.u; e.rot = Math.atan2(c.x1 - c.x0, c.z1 - c.z0); e.anim = 1; if (c.u >= 1) { e.lv = c.lv; e.y = LVY(c.lv); ctrl.climb = null; e.anim = 0; } return; }
  let ix = 0, iz = 0;
  if (keys.KeyW || keys.ArrowUp) iz -= 1; if (keys.KeyS || keys.ArrowDown) iz += 1; if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1;
  ix += joy.x; iz += joy.y;
  const mag = Math.hypot(ix, iz);
  if (mag > 0.15 && !scopeState.on && !menuOpen) {
    if (ctrl.act) { ctrl.act = null; toast('Ação interrompida.'); }
    if (ctrl.seat >= 0) { W.slots[ctrl.seat].busy = -1; ctrl.seat = -1; }
    const a = isoState.az, nx = ix / Math.max(1, mag), nz = iz / Math.max(1, mag);
    const vx = (nx * Math.cos(a) + nz * Math.sin(a)) * 1.6, vz = (-nx * Math.sin(a) + nz * Math.cos(a)) * 1.6;
    moveC(e, vx, vz, dt); e.rot = lerpAngle(e.rot, Math.atan2(vx, vz), 1 - Math.exp(-dt * 12)); e.anim = 1;
  } else if (e.anim === 1) e.anim = 0;
  if (ctrl.act) {
    ctrl.act.t += dt; const m = W.sc.missoes[ctrl.act.k];
    if (ctrl.act.t >= ACT_T) { W.done[m.k] = true; ctrl.act = null; e.anim = 0; const tl = W.K.tells[m.k]; if (tl) tl.tell(true); toast('Missão cumprida: ' + m.label, 'ok'); renderPanels(); }
  }
}

// ---------------------------------------------------------------- câmeras
const iso = new T.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
const isoState = { tx: 0, tz: 0, ty: 0, zoom: 9.5, az: -0.55 };
const scopeCam = new T.PerspectiveCamera(8, 1, 0.5, 600);
const scopeState = { on: false, yaw: 0, pitch: 0, fov: 8 };
let activeCam = iso;
function placeIso(dt, instant) {
  const k = instant ? 1 : 1 - Math.exp(-dt * 4), u = iso.userData;
  for (const a of ['tx', 'tz', 'ty']) u[a] = (u[a] ?? isoState[a]) + (isoState[a] - (u[a] ?? isoState[a])) * k;
  iso.position.set(u.tx + Math.sin(isoState.az) * 30, u.ty + 30, u.tz + Math.cos(isoState.az) * 30); iso.lookAt(u.tx, u.ty, u.tz);
  const a = innerWidth / innerHeight; iso.left = -isoState.zoom * a; iso.right = isoState.zoom * a; iso.top = isoState.zoom; iso.bottom = -isoState.zoom; iso.updateProjectionMatrix();
  sun.target.position.set(u.tx, 0, u.tz); sun.position.set(u.tx + (W.sc?.ambiente?.sol?.[2] ?? -22), (W.sc?.ambiente?.sol?.[3] ?? 19), u.tz + (W.sc?.ambiente?.sol?.[4] ?? 14));
}
function aimScopeAt(x, y, z) { const p = W.sc.sniper.pos; scopeState.yaw = Math.atan2(x - p[0], -(z - p[2])); scopeState.pitch = Math.atan2(y - p[1], Math.hypot(x - p[0], z - p[2])); }
function placeScope() {
  const p = W.sc.sniper.pos; scopeCam.position.set(p[0], p[1], p[2]);
  const d = new T.Vector3(Math.sin(scopeState.yaw) * Math.cos(scopeState.pitch), Math.sin(scopeState.pitch), -Math.cos(scopeState.yaw) * Math.cos(scopeState.pitch));
  scopeCam.lookAt(scopeCam.position.clone().add(d)); scopeCam.fov = scopeState.fov; scopeCam.aspect = innerWidth / innerHeight; scopeCam.updateProjectionMatrix();
}
function setScope(on) {
  scopeState.on = on; $('#scope').hidden = !on; activeCam = on ? scopeCam : iso; $('#hud').classList.toggle('dim', on);
  if (on) { scopeState.fov = 8; const e = W.me; aimScopeAt(e.x, e.y + 1.2, e.z); }
}
// arrastar = girar a câmera / mirar; roda = zoom
let drag = null;
canvas.addEventListener('pointerdown', ev => { drag = { x: ev.clientX, y: ev.clientY, moved: 0 }; canvas.setPointerCapture(ev.pointerId); });
canvas.addEventListener('pointermove', ev => {
  if (!drag) return; const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y; drag.x = ev.clientX; drag.y = ev.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
  if (scopeState.on) { const k = scopeState.fov / 900; scopeState.yaw += dx * k; scopeState.pitch = Math.max(-1.2, Math.min(0.4, scopeState.pitch - dy * k)); }
  else isoState.az -= dx * 0.006;
});
canvas.addEventListener('pointerup', ev => { if (drag && drag.moved < 6 && scopeState.on) identify(); drag = null; });
canvas.addEventListener('wheel', ev => { ev.preventDefault(); if (scopeState.on) scopeState.fov = Math.max(2.5, Math.min(30, scopeState.fov * (ev.deltaY > 0 ? 1.15 : 0.87))); else isoState.zoom = Math.max(3.5, Math.min(22, isoState.zoom * (ev.deltaY > 0 ? 1.1 : 0.9))); }, { passive: false });
const ray = new T.Raycaster(), ndc = new T.Vector2();
function identify() {
  ndc.set(0, 0); ray.setFromCamera(ndc, scopeCam);
  const h = ray.intersectObjects(W.chars, true)[0];
  if (!h) { toast('Ninguém na mira.'); return; }
  let o = h.object; while (o && o.userData.eid === undefined) o = o.parent; const e = W.ents[o ? o.userData.eid : -1];
  if (e) toast('Na mira: ' + e.o.name + (e.cast && e.cast.fala ? ' · “' + e.cast.fala + '”' : ''));
}

// ---------------------------------------------------------------- pós-processamento (mesmo visual do jogo)
const FinalShader = {
  uniforms: { tDiffuse: { value: null }, res: { value: new T.Vector2(1, 1) }, focus: { value: 0.5 }, tilt: { value: 1 }, exposure: { value: 1.0 }, vig: { value: 0.32 }, time: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform float focus, tilt, exposure, vig, time; varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(0.0031308, c)); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){ float d = abs(vUv.y - focus); float r = smoothstep(0.14, 0.6, d) * tilt * 6.0; vec3 col = texture2D(tDiffuse, vUv).rgb;
      if (r > 0.25) { vec3 acc = col; float w = 1.0; for (int i = 0; i < 16; i++) { float fi = float(i); float a = fi * 2.39996; float rr = sqrt((fi + 0.5) / 16.0) * r; acc += texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * rr / res).rgb; w += 1.0; } col = acc / w; }
      col = aces(col * exposure); col = toSRGB(col); float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, col * vec3(1.05, 1.0, 0.92), smoothstep(0.35, 1.0, l) * 0.55); col += vec3(0.0, 0.006, 0.022) * (1.0 - l); col = mix(vec3(l), col, 1.06);
      vec2 q = vUv - 0.5; q.x *= res.x / res.y; col *= 1.0 - vig * smoothstep(0.35, 1.05, length(q)); col += (hash(vUv * res + time) - 0.5) / 255.0; gl_FragColor = vec4(col, 1.0); }`,
};
let composer = null, renderPass = null, bloomPass = null, finalPass = null;
try {
  if (T.EffectComposer && T.UnrealBloomPass) {
    const pr = renderer.getPixelRatio();
    composer = new T.EffectComposer(renderer, new T.WebGLRenderTarget(innerWidth * pr, innerHeight * pr, { type: T.HalfFloatType, format: T.RGBAFormat, minFilter: T.LinearFilter, magFilter: T.LinearFilter }));
    renderPass = new T.RenderPass(scene, iso); bloomPass = new T.UnrealBloomPass(new T.Vector2(innerWidth / 2, innerHeight / 2), 0.55, 0.5, 1.5); finalPass = new T.ShaderPass(FinalShader);
    composer.addPass(renderPass); composer.addPass(bloomPass); composer.addPass(finalPass);
    renderer.toneMapping = T.NoToneMapping; renderer.outputEncoding = T.LinearEncoding;
  }
} catch (e) { composer = null; }
if (!composer) { renderer.toneMapping = T.ACESFilmicToneMapping; renderer.outputEncoding = T.sRGBEncoding; }
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  if (composer) { composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(innerWidth, innerHeight); finalPass.uniforms.res.value.set(innerWidth * renderer.getPixelRatio(), innerHeight * renderer.getPixelRatio()); }
}
addEventListener('resize', resize);
function render(dt) {
  if (!composer) { renderer.toneMappingExposure = W.exposure || 1; renderer.render(scene, activeCam); return; }
  renderPass.camera = activeCam; const u = finalPass.uniforms; u.time.value = (u.time.value + 1) % 1000;
  u.tilt.value = scopeState.on ? 0 : (isoState.zoom < 14 ? 1 : 0.4); u.exposure.value = W.exposure || 1; u.vig.value = scopeState.on ? 0.1 : 0.32;
  composer.render(dt);
}

// ---------------------------------------------------------------- HUD
const meRing = new T.Mesh(new T.RingGeometry(0.34, 0.42, 32), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false }));
meRing.rotation.x = -Math.PI / 2; scene.add(meRing);
const focusRing = new T.Mesh(new T.RingGeometry(0.42, 0.56, 32), new T.MeshBasicMaterial({ color: 0x74d39a, transparent: true, opacity: 0.9, depthWrite: false }));
focusRing.rotation.x = -Math.PI / 2; focusRing.visible = false; scene.add(focusRing);
let focusEnt = -1;
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function toast(text, kind = '') { const t = $('#toast'); t.textContent = text; t.className = 'card ' + kind; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 3200); }
function renderPanels() {
  const sc = W.sc;
  $('#scNum').textContent = String(W.i + 1).padStart(2, '0') + ' / ' + MIRA_CENARIOS.length;
  $('#scName').textContent = sc.nome; $('#scWhere').textContent = sc.lugar + ' · ' + (sc.hora || '');
  $('#scDesc').textContent = sc.resumo || '';
  $('#sniperDesc').textContent = 'Sniper: ' + (sc.sniper.desc || '');
  $('#missions').innerHTML = (sc.missoes || []).map(m => `<li class="${W.done[m.k] ? 'done' : ''}">${esc(m.label)} <small>${esc(m.where)}</small></li>`).join('');
  $('#cast').innerHTML = W.ents.filter(e => e.kind === 'static').map(e => `<li><button data-e="${e.id}"><b>${esc(e.o.name)}</b>${e.cast.fala ? `<small>“${esc(e.cast.fala)}”</small>` : ''}</button></li>`).join('');
  $('#cast').querySelectorAll('button').forEach(b => b.onclick = () => { const e = W.ents[+b.dataset.e]; focusEnt = e.id; isoState.tx = e.x; isoState.tz = e.z; isoState.ty = e.y; isoState.zoom = 4.5; follow = false; });
  $('#grid').innerHTML = MIRA_CENARIOS.map((c, k) => `<button data-i="${k}" class="${k === W.i ? 'on' : ''}"><span>${String(k + 1).padStart(2, '0')}</span><b>${esc(c.nome)}</b><small>${esc(c.lugar)}</small></button>`).join('');
  $('#grid').querySelectorAll('button').forEach(b => b.onclick = () => { load(+b.dataset.i); toggleMenu(false); });
}
let menuOpen = false, follow = true;
function toggleMenu(v) { menuOpen = v ?? !menuOpen; $('#menu').hidden = !menuOpen; }
$('#prev').onclick = () => load(W.i - 1); $('#next').onclick = () => load(W.i + 1); $('#all').onclick = () => toggleMenu();
$('#scopeBtn').onclick = () => setScope(!scopeState.on); $('#actBtn').onclick = () => interact();
$('#closeMenu').onclick = () => toggleMenu(false);
$('#foldCast').onclick = () => $('#castCard').classList.toggle('fold');
// joystick de toque
const joy = { x: 0, y: 0, id: null };
{ const pad = $('#joy'), knob = $('#joy i');
  pad.addEventListener('pointerdown', ev => { joy.id = ev.pointerId; pad.setPointerCapture(ev.pointerId); mv(ev); });
  const mv = ev => { if (joy.id !== ev.pointerId) return; const r = pad.getBoundingClientRect(); let x = (ev.clientX - r.left - r.width / 2) / (r.width / 2), y = (ev.clientY - r.top - r.height / 2) / (r.height / 2); const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; } joy.x = x; joy.y = y; knob.style.transform = `translate(${x * 28}px,${y * 28}px)`; };
  pad.addEventListener('pointermove', mv); const up = () => { joy.id = null; joy.x = joy.y = 0; knob.style.transform = ''; }; pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up); }

// ---------------------------------------------------------------- laço
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; W.t += dt;
  if (W.sc) {
    updatePlayer(dt);
    for (const e of W.ents) if (e.kind === 'npc') stepNPC(e, dt);
    W.K.update(dt, W.t);
    for (let k = 0; k < W.ents.length; k++) {
      const e = W.ents[k], c = W.chars[k], u = c.userData;
      const moving = e.anim === 1;
      c.position.set(e.x, e.y, e.z); c.rotation.y = e.rot;
      animChar(c, e.anim, W.t, moving, dt, e.speed || 1.2);
    }
    const me = W.me; meRing.position.set(me.x, me.y + 0.03, me.z);
    if (focusEnt >= 0) { const e = W.ents[focusEnt]; focusRing.visible = true; focusRing.position.set(e.x, e.y + 0.035, e.z); } else focusRing.visible = false;
    if (follow || Math.hypot(keys.KeyW | 0, keys.KeyS | 0, keys.KeyA | 0, keys.KeyD | 0) > 0 || Math.hypot(joy.x, joy.y) > 0.15) { follow = true; focusEnt = -1; isoState.tx = me.x; isoState.tz = me.z; isoState.ty = me.y; if (isoState.zoom < 5) isoState.zoom = 9.5; }
    W.rings.forEach((r, k) => { const m = W.sc.missoes[k]; r.visible = !W.done[m.k] && !scopeState.on; r.material.opacity = 0.55 + Math.sin(W.t * 3 + k) * 0.3; });
    placeIso(dt); if (scopeState.on) placeScope();
    const n = scopeState.on || menuOpen ? null : (ctrl.act ? { label: W.sc.missoes[ctrl.act.k].label } : ctrl.seat >= 0 ? { label: 'Levantar' } : nearInteraction());
    const pr = $('#prompt'); pr.hidden = !n;
    if (n) { pr.querySelector('span').innerHTML = ctrl.act ? esc(n.label) + '…' : '<kbd>E</kbd> ' + esc(n.label); pr.querySelector('.bar i').style.width = ctrl.act ? (ctrl.act.t / ACT_T * 100) + '%' : '0%'; pr.querySelector('.bar').hidden = !ctrl.act; }
    $('#zoomTag').textContent = (40 / scopeState.fov).toFixed(1) + '×';
    render(dt);
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- início
resize();
const qs = new URLSearchParams(location.search);
let start = 0; try { start = +(localStorage.getItem('mira-cenario') || 0); } catch (e) { }
if (qs.has('c')) { const c = qs.get('c'); const k = MIRA_CENARIOS.findIndex(s => s.id === c); start = k >= 0 ? k : +c || 0; }
load(start);
requestAnimationFrame(frame);
// gancho para testes automáticos (capturas)
window.__previa = { W, load, free: () => { follow = false; }, iso, isoState, scopeState, setScope, aimScopeAt, astar, route, blocked, render: () => { placeIso(0, true); if (scopeState.on) placeScope(); render(0.016); }, step: (n = 30) => { for (let k = 0; k < n; k++) { const dt = 1 / 30; W.t += dt; updatePlayer(dt); for (const e of W.ents) if (e.kind === 'npc') stepNPC(e, dt); W.K.update(dt, W.t); W.ents.forEach((e, i) => { const c = W.chars[i]; c.position.set(e.x, e.y, e.z); c.rotation.y = e.rot; animChar(c, e.anim, W.t, e.anim === 1, dt, e.speed || 1.2); }); } }, toggleMenu };
