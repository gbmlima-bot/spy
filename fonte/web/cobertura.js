// Rooftop geometry source, extracted intact from mira.html. Created only when map 0 is selected.
window.MIRA_ROOFTOP_BUILD = function ({scene, T, add, canvasTex, col, mulberry32, fill, mat, H, box, DH, LVY, colR, pick, cyl, glassClear, TABLES, OCCLUDERS, LINKS, linkPos, canvas, DECK_TABLES, LV_N, LEVELS, G, addSlot}) {
const MAP0_FROM = scene.children.length; // everything added to the scene from here to the sniper's nest is the rooftop map
const PL = [];
function plight(x, y, z, c, i, d) { const p = new T.PointLight(c, i, d, 2); p.position.set(x, y, z); scene.add(p); PL.push(p); return p; }
plight(-7.5, 2.3, -6.6, 0xffad5c, 2.4, 8); plight(-10, 1.6, 5, 0xffb870, 1.6, 7); plight(9.6, 1.8, -6.2, 0xffcf96, 1.7, 7);
plight(4.5, 2.8, 4, 0xffb48a, 2.0, 9); plight(11.3, 1.9, 5.6, 0xffc27a, 1.0, 5); plight(1.4, 2.2, -2.5, 0xffc07a, 1.0, 6);
plight(6.5, 1.4, 8.0, 0xff7aa8, 0.9, 5);

// ---------------------------------------------------------------- texture helpers
function grain(g, w, h, amt) { const id = g.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0); }
const radialTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.5)'); gr.addColorStop(0.7, 'rgba(255,255,255,.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
const blobTex = canvasTex(128, 128, (g) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.75)'); gr.addColorStop(0.45, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); });
radialTex.encoding = T.LinearEncoding; blobTex.encoding = T.LinearEncoding;
const blobMat = new T.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.55, toneMapped: false });
const UNIT = new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
function pool(x, z, r, color, k, y = 0.022) {
  const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: radialTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
  m.scale.set(r * 2, 1, r * 2); m.position.set(x, y, z); m.renderOrder = 2; scene.add(m); return m;
}
function blob(x, z, sx, sz, op = 0.5, parent = scene) {
  const m = new T.Mesh(UNIT, op === 0.55 ? blobMat : new T.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: op, toneMapped: false }));
  m.scale.set(sx, 1, sz); m.position.set(x, 0.014, z); m.renderOrder = 1; parent.add(m); return m;
}
function glow(color, k) { return new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), toneMapped: false }); }
// merge non-indexed geometries with per-piece vertex colours
// tufo de folhas: esfera deformada com normais lisas (sem cara de poliedro); sy achata
function folhaGeo(r, ph, sy = 0.75, amp = 0.14) {
  const s = new T.IcosahedronGeometry(r, 1), q = s.attributes.position, v = new T.Vector3(), nn = new Float32Array(q.count * 3);
  for (let j = 0; j < q.count; j++) { v.fromBufferAttribute(q, j).divideScalar(r); const d = 1 + amp * Math.sin(v.x * 7 + ph) * Math.cos(v.z * 6 - ph) + amp * 0.5 * Math.sin(v.y * 11 + ph * 2); q.setXYZ(j, v.x * r * d, v.y * r * d * sy, v.z * r * d); v.y /= sy; v.normalize(); nn.set([v.x, v.y, v.z], j * 3); }
  s.setAttribute('normal', new T.BufferAttribute(nn, 3)); return s;
}
function mergeGeos(list) {
  let n = 0; const parts = list.map(([g, c]) => { const gg = g.index ? g.toNonIndexed() : g; n += gg.attributes.position.count; return [gg, c]; });
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3); let o = 0;
  for (const [g, c] of parts) {
    const cc = new T.Color(c); pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
    for (let i = 0; i < g.attributes.position.count; i++) { col[(o + i) * 3] = cc.r; col[(o + i) * 3 + 1] = cc.g; col[(o + i) * 3 + 2] = cc.b; }
    o += g.attributes.position.count;
  }
  const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); out.setAttribute('color', new T.BufferAttribute(col, 3));
  return out;
}
const vcol = (o = {}) => new T.MeshStandardMaterial(Object.assign({ vertexColors: true, roughness: 0.7, envMapIntensity: 0.4 }, o));

// ---------------------------------------------------------------- textures
const floorTex = canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry32(7);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const v = 226 + Math.floor(r() * 12) - 6; g.fillStyle = `rgb(${v},${v - 12},${v - 32})`; g.fillRect(i * 256, j * 256, 256, 256);
    for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(${150 + r() * 60},${130 + r() * 50},${100 + r() * 40},${0.04 + r() * 0.05})`; g.beginPath(); g.ellipse(i * 256 + r() * 256, j * 256 + r() * 256, 4 + r() * 30, 2 + r() * 10, r() * 3, 0, 7); g.fill(); }
  }
  grain(g, w, h, 10);
  g.fillStyle = '#b8a688'; for (let k = 0; k <= 1024; k += 256) { g.fillRect(k - 2, 0, 4, h); g.fillRect(0, k - 2, w, 4); }
}, [6, 4]);
const oakTex = canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry32(11);
  for (let i = 0; i < 16; i++) for (let s = 0; s < 3; s++) {
    const x0 = s * 400 - (i % 3) * 140, len = 400; const b = 160 + r() * 30;
    g.fillStyle = `rgb(${b + 20},${b - 18},${b - 70})`; g.fillRect(x0, i * 64, len, 64);
    for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(90,55,25,${0.08 + r() * 0.1})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const yy = i * 64 + r() * 64; g.moveTo(x0, yy); g.bezierCurveTo(x0 + 120, yy + r() * 8 - 4, x0 + 260, yy + r() * 8 - 4, x0 + len, yy); g.stroke(); }
    g.fillStyle = 'rgba(40,24,10,.35)'; g.fillRect(x0, i * 64 + 62, len, 2); g.fillRect(x0 + len - 2, i * 64, 2, 64);
  }
  grain(g, w, h, 12);
}, [3, 2.5]);
const herringTex = canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry32(5); g.fillStyle = '#7a4b2a'; g.fillRect(0, 0, w, h);
  const L = 128, W = 32;
  for (let row = -2; row < 20; row++) for (let col = -2; col < 20; col++) {
    for (const flip of [0, 1]) {
      g.save(); g.translate(col * L * 0.707 * 2 + (flip ? L * 0.707 : 0), row * W * 1.414 * 2 + (flip ? 0 : 0)); g.rotate(flip ? -Math.PI / 4 : Math.PI / 4);
      const b = 110 + r() * 40; g.fillStyle = `rgb(${b + 40},${b},${b - 45})`; g.fillRect(0, 0, L, W);
      g.strokeStyle = 'rgba(30,15,5,.45)'; g.lineWidth = 2; g.strokeRect(0, 0, L, W);
      g.strokeStyle = 'rgba(60,30,10,.15)'; g.lineWidth = 1; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, 6 + k * 9 + r() * 4); g.lineTo(L, 6 + k * 9 + r() * 4); g.stroke(); }
      g.restore();
    }
  }
  grain(g, w, h, 10);
}, [2, 2]);
const marbleTex = canvasTex(512, 256, (g, w, h) => {
  g.fillStyle = '#f3efe8'; g.fillRect(0, 0, w, h); const r = mulberry32(3);
  for (let k = 0; k < 18; k++) { g.strokeStyle = `rgba(150,140,130,${0.15 + r() * 0.25})`; g.lineWidth = 0.6 + r() * 1.6; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let s = 0; s < 8; s++) { x += r() * 80 - 20; y += r() * 40 - 20; g.lineTo(x, y); } g.stroke(); }
  grain(g, w, h, 6);
});
const flutedTex = canvasTex(512, 128, (g, w, h) => {
  for (let i = 0; i < 32; i++) { const gr = g.createLinearGradient(i * 16, 0, i * 16 + 16, 0); gr.addColorStop(0, '#5a3a22'); gr.addColorStop(0.5, '#93633c'); gr.addColorStop(1, '#4a2e1a'); g.fillStyle = gr; g.fillRect(i * 16, 0, 16, h); }
  grain(g, w, h, 10);
});
const slatTex = canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#9a6a40' : '#3a2516'; g.fillRect(i * 16, 0, i % 2 ? 12 : 4, h); } grain(g, w, h, 14); });
const rugTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#2f6b4f'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#d9c38a'; g.lineWidth = 6; for (const r of [240, 200]) { g.beginPath(); g.arc(256, 256, r, 0, 7); g.stroke(); }
  g.strokeStyle = 'rgba(217,195,138,.5)'; g.lineWidth = 3; for (let a = 0; a < 24; a++) { const t = a / 24 * Math.PI * 2; g.beginPath(); g.arc(256 + Math.cos(t) * 140, 256 + Math.sin(t) * 140, 22, 0, 7); g.stroke(); }
  g.fillStyle = 'rgba(217,195,138,.6)'; g.beginPath(); g.arc(256, 256, 60, 0, 7); g.fill();
  grain(g, w, h, 18);
});
function facadeTex(bays, floors, seed, light) {
  const bw = 64, fh = 80;
  const make = (emis) => canvasTex(bays * bw, floors * fh, (g, w, h) => {
    const r = mulberry32(seed);
    g.fillStyle = emis ? '#000' : light ? '#e2d6bf' : '#2a3042'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < bays; i++) for (let j = 0; j < floors; j++) {
      const x = i * bw, y = j * fh, v = r();
      const lit = v < (light ? 0.5 : 0.38), warm = r() < 0.75;
      if (!emis) { g.fillStyle = light ? '#d2c4a8' : '#232838'; g.fillRect(x, y + fh - 14, bw, 14); }
      const wc = lit ? (warm ? `rgb(${235 + r() * 20},${170 + r() * 50},${90 + r() * 40})` : `rgb(${170 + r() * 30},${200 + r() * 30},${235})`) : (emis ? '#000' : (light ? '#2b3550' : '#161b29'));
      g.fillStyle = wc; g.fillRect(x + 12, y + 14, bw - 24, fh - 36);
      if (lit && !emis) { g.fillStyle = 'rgba(80,40,20,.35)'; g.fillRect(x + 12 + r() * 22, y + 14, 8 + r() * 6, fh - 36); }
      if (!emis) { g.fillStyle = light ? '#efe6d4' : '#3a4156'; g.fillRect(x + 12, y + 14 + (fh - 36) / 2, bw - 24, 2); g.fillRect(x + bw / 2 - 1, y + 14, 2, fh - 36); }
    }
    if (!emis) grain(g, w, h, 8);
  });
  return [make(false), make(true)];
}

// ---------------------------------------------------------------- materials
const cream = mat(0xece3d2, { roughness: 0.85 }), creamDark = mat(0xd9cdb6, { roughness: 0.9 });
const metal = mat(0x23252a, { metalness: 0.7, roughness: 0.35 }), brass = mat(0xc99a45, { metalness: 0.9, roughness: 0.28 });
const chrome = mat(0xd8dde4, { metalness: 1, roughness: 0.12 });
const walnut = mat(0x5e3b22, { roughness: 0.55 }), oak = mat(0xa8784a, { roughness: 0.6 });
const marble = new T.MeshStandardMaterial({ map: marbleTex, color: 0xe2dccf, roughness: 0.3, envMapIntensity: 0.3 });
const glassMat = new T.MeshStandardMaterial({ color: 0xcfe2ee, transparent: true, opacity: 0.14, roughness: 0.03, metalness: 0.2, depthWrite: false, envMapIntensity: 1.4 });

// ---------------------------------------------------------------- sky, sea, hills, city
scene.background = canvasTex(8, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#0b1230'); gr.addColorStop(0.35, '#1d2a55'); gr.addColorStop(0.62, '#4a4f7e'); gr.addColorStop(0.8, '#a06a74'); gr.addColorStop(0.92, '#e09a6a'); gr.addColorStop(1, '#f4c27e');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
scene.fog = new T.Fog(0x11112b, 110, 330);
const SKY0 = scene.background;
{
  const sea = new T.Mesh(new T.PlaneGeometry(1400, 1400), new T.MeshStandardMaterial({ color: 0x1a2648, roughness: 0.15, metalness: 0.4, envMapIntensity: 0.6 }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -62; scene.add(sea);
  const hr = mulberry32(99), hills = [];
  for (let i = 0; i < 26; i++) { const a = -Math.PI * 0.95 + i / 25 * Math.PI * 0.9 - Math.PI * 0.05, d = 300 + hr() * 60, hgt = 30 + hr() * 50; const g = new T.ConeGeometry(50 + hr() * 50, hgt, 5); g.translate(Math.cos(a) * d, -62 + hgt / 2, Math.sin(a) * d); hills.push([g, new T.Color(0x2c2c52).lerp(new T.Color(0x4a3e66), hr()).getHex()]); }
  const hm = new T.Mesh(mergeGeos(hills), new T.MeshBasicMaterial({ vertexColors: true, fog: true })); scene.add(hm);
  // stars
  const sp = []; const sr = mulberry32(5); for (let i = 0; i < 300; i++) { const a = sr() * Math.PI * 2, e = 0.25 + sr() * 1.1; sp.push(Math.cos(a) * Math.cos(e) * 600, Math.sin(e) * 600, Math.sin(a) * Math.cos(e) * 600); }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
  scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.7, fog: false })));
}
const CITY_TEX = [facadeTex(8, 16, 1, false), facadeTex(8, 16, 2, false), facadeTex(8, 16, 3, true)];
const cr = mulberry32(42);
for (let i = 0; i < 80; i++) {
  const a = cr() * Math.PI * 2, d = 52 + cr() * 110, x = Math.cos(a) * d, z = Math.sin(a) * d;
  if (Math.abs(x) < 14 && z > 26 && z < 70) continue;
  if (Math.abs(x) < 30 && z < -14 && z > -100) continue;
  const h = (d < 120 ? 22 + cr() * 38 : 40 + cr() * 70), w = 9 + cr() * 13, dd = w * (0.7 + cr() * 0.6);
  const [mt, et] = CITY_TEX[Math.floor(cr() * 3)];
  const t1 = mt.clone(), t2 = et.clone(); [t1, t2].forEach(t => { t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(w / 20, h / 48); t.offset.set(cr(), cr()); });
  const m = new T.MeshStandardMaterial({ map: t1, emissive: 0xffffff, emissiveMap: t2, emissiveIntensity: 1.1, roughness: 0.85, envMapIntensity: 0.2 });
  const b = new T.Mesh(new T.BoxGeometry(w, h, dd), m); const top = -64 + h + cr() * 4;
  b.position.set(x, top - h / 2, z); b.rotation.y = cr() * 0.4; scene.add(b);
  if (cr() < 0.4) { const ant = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 6, 4), metal); ant.position.set(x, top + 3, z); scene.add(ant); const rl = new T.Mesh(new T.SphereGeometry(0.4, 6, 4), glow(0xff3322, 3)); rl.position.set(x, top + 6, z); scene.add(rl); }
  if (cr() < 0.5) { const bx = new T.Mesh(new T.BoxGeometry(w * 0.4, 2.5, dd * 0.35), mat(0x2a2e3a)); bx.position.set(x, top + 1.25, z); scene.add(bx); }
}
{ // the sniper's building
  const [mt, et] = facadeTex(8, 16, 9, false); [mt, et].forEach(t => { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(1, 1.6); });
  const sb = new T.Mesh(new T.BoxGeometry(18, 80, 14), new T.MeshStandardMaterial({ map: mt, emissive: 0xffffff, emissiveMap: et, emissiveIntensity: 1.0, roughness: 0.85 }));
  sb.position.set(0, 17 - 40, 41); scene.add(sb);
  const par = new T.Mesh(new T.BoxGeometry(18.4, 0.8, 14.4), mat(0x2a2e3a)); par.position.set(0, 17.2, 41); scene.add(par);
}

// ---------------------------------------------------------------- the tower under the party
{
  const [mt, et] = facadeTex(12, 14, 21, true);
  const facadeM = (rx) => { const a = mt.clone(), b = et.clone(); [a, b].forEach(t => { t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, 1); }); return new T.MeshStandardMaterial({ map: a, emissive: 0xffffff, emissiveMap: b, emissiveIntensity: 0.55, roughness: 0.85, envMapIntensity: 0.3 }); };
  const H = 56;
  const front = new T.Mesh(new T.PlaneGeometry(29.6, H), facadeM(1)); front.position.set(0, -0.5 - H / 2, 9.8); scene.add(front);
  const back = front.clone(); back.rotation.y = Math.PI; back.position.z = -22.0; scene.add(back);
  const sideM = facadeM(31.8 / 29.6);
  const left = new T.Mesh(new T.PlaneGeometry(31.8, H), sideM); left.rotation.y = -Math.PI / 2; left.position.set(-14.8, -0.5 - H / 2, -6.1); scene.add(left);
  const right = left.clone(); right.rotation.y = Math.PI / 2; right.position.x = 14.8; scene.add(right);
  // floor slabs + vertical light strips like the reference
  for (let k = 1; k < 14; k++) { const y = -0.5 - k * 4; box(29.9, 0.22, 32.1, creamDark, 0, y, -6.1, { cast: false }); }
  const strip = glow(0xffc27a, 2.2);
  for (const x of [-14.6, -9.7, -4.9, 4.9, 9.7, 14.6]) for (let k = 0; k < 4; k++) { const s = new T.Mesh(new T.BoxGeometry(0.12, 1.2, 0.08), strip); s.position.set(x, -2.2 - k * 4, 9.88); scene.add(s); }
  for (const z of [-4.9, 0, 4.9]) for (let k = 0; k < 4; k++) { const s = new T.Mesh(new T.BoxGeometry(0.08, 1.2, 0.12), strip); s.position.set(-14.88, -2.2 - k * 4, z); scene.add(s); }
}

// ---------------------------------------------------------------- rooftop floor + slab
const floor = new T.Mesh(new T.PlaneGeometry(30, 20), new T.MeshStandardMaterial({ map: floorTex, roughness: 0.42, envMapIntensity: 0.3 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
box(30.6, 0.5, 32.8, cream, 0, -0.26, -6.1, { cast: false });
box(30.8, 0.08, 33.0, creamDark, 0, -0.52, -6.1, { cast: false });

// ---------------------------------------------------------------- penthouse block at the back (the upper deck sits on its roof)
box(30.6, 4.3, 0.5, cream, 0, 2.15, -10.25, { occ: true });
box(30.6, 4.3, 11.5, cream, 0, 2.15, -16.25, { occ: true, cast: false });
// deck slab with a front overhang that shades the back of the party
const deckSlab = box(31.2, 0.5, 13.4, mat(0xf2ebde), 0, DH - 0.25, -15.3, { occ: true });
box(31.2, 0.08, 0.06, glow(0xffd29a, 1.6), 0, DH - 0.5, -8.72, { cast: false });
col(-15.5, -11, 15.5, -9.95);
for (const x of [-13.5, -12, 0, 1.5, 3, 4.2, -4.6]) { const d = new T.Mesh(new T.CircleGeometry(0.11, 12), glow(0xfff0c8, 3)); d.rotation.x = Math.PI / 2; d.position.set(x, DH - 0.51, -9.3); scene.add(d); pool(x, -9.2, 1.0, 0xffc98a, 0.45); }
// dark windows on the penthouse side walls
for (const sx of [-1, 1]) for (const z of [-13, -15.5, -18, -20.5]) { box(0.06, 1.6, 1.3, mat(0x1b2238, { roughness: 0.2, metalness: 0.3 }), sx * 15.31, 2.3, z, { cast: false }); box(0.1, 0.1, 1.5, creamDark, sx * 15.32, 3.2, z, { cast: false }); }
// big lit window between the slats and the office
{
  const winGlow = new T.Mesh(new T.PlaneGeometry(5.4, 3.0), new T.MeshBasicMaterial({ map: canvasTex(256, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf8f'); gr.addColorStop(1, '#b8743a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(60,30,15,.55)'; g.fillRect(30, 70, 70, 58); g.fillRect(150, 40, 18, 88); g.fillStyle = 'rgba(255,240,210,.9)'; g.beginPath(); g.arc(128, 18, 10, 0, 7); g.fill(); }), toneMapped: true, color: new T.Color(1.6, 1.4, 1.2) }));
  winGlow.position.set(1.5, 1.7, -9.98); scene.add(winGlow);
  for (let i = 0; i <= 4; i++) box(0.06, 3.0, 0.06, metal, -1.2 + i * 1.35, 1.7, -9.96, { cast: false });
  box(5.5, 0.06, 0.06, metal, 1.5, 3.2, -9.96, { cast: false }); box(5.5, 0.06, 0.06, metal, 1.5, 0.2, -9.96, { cast: false });
  pool(1.5, -8.6, 2.6, 0xffb36a, 0.35);
}
// framed art + sconces on the left wall section
{
  const art = canvasTex(128, 160, (g, w, h) => { g.fillStyle = '#efe7d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8322f'; g.beginPath(); g.arc(64, 70, 34, 0, 7); g.fill(); g.fillStyle = '#1f2a44'; g.fillRect(20, 110, 88, 14); });
  const fr = box(1.0, 1.25, 0.05, mat(0x1b1b1f), -13.2, 1.9, -9.98, { cast: false });
  const pic = new T.Mesh(new T.PlaneGeometry(0.86, 1.1), new T.MeshStandardMaterial({ map: art, roughness: 0.8 })); pic.position.set(-13.2, 1.9, -9.95); scene.add(pic);
  for (const x of [-14.3, -12.1]) { box(0.14, 0.3, 0.1, brass, x, 2.3, -9.95, { cast: false }); box(0.1, 0.18, 0.06, glow(0xffd8a0, 2.5), x, 2.3, -9.9, { cast: false }); pool(x, -9.6, 0.8, 0xffb36a, 0.4); }
}

// ---------------------------------------------------------------- glass runs (office walls, railings)
function glassRun(x0, z0, x1, z1, h, rail, y0 = 0) {
  const len = Math.hypot(x1 - x0, z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, ry = Math.atan2(z1 - z0, x1 - x0);
  const g = new T.Mesh(new T.BoxGeometry(len, h, 0.03), glassMat); g.position.set(cx, y0 + h / 2, cz); g.rotation.y = -ry; g.renderOrder = 3; scene.add(g);
  const n = Math.max(1, Math.round(len / 1.6));
  for (let i = 0; i <= n; i++) { const t = i / n; box(0.05, h, 0.05, metal, x0 + (x1 - x0) * t, y0 + h / 2, z0 + (z1 - z0) * t, { cast: false }); }
  if (rail) { const top = box(len + 0.08, 0.06, 0.11, oak, cx, y0 + h + 0.03, cz); top.rotation.y = -ry; const led = box(len, 0.015, 0.02, glow(0xffc27a, 1.4), cx, y0 + h - 0.01, cz, { cast: false }); led.rotation.y = -ry; }
  else { const top = box(len, 0.05, 0.06, metal, cx, y0 + h, cz, { cast: false }); top.rotation.y = -ry; const bot = box(len, 0.06, 0.07, metal, cx, y0 + 0.03, cz, { cast: false }); bot.rotation.y = -ry; }
}
glassRun(5, -9.95, 5, -3, 2.8); col(4.92, -9.95, 5.08, -3);
glassRun(5, -3, 6.2, -3, 2.8); glassRun(7.8, -3, 14.6, -3, 2.8);
box(1.6, 0.08, 0.08, metal, 7, 2.8, -3, { cast: false });
col(5, -3.08, 6.2, -2.92); col(7.8, -3.08, 14.6, -2.92);
box(0.3, 2.8, 7.0, cream, 14.85, 1.4, -6.45, { occ: true });
box(9.6, 0.02, 6.9, new T.MeshStandardMaterial({ map: oakTex, roughness: 0.45, envMapIntensity: 0.5 }), 9.8, 0.011, -6.45, { cast: false });
glassRun(-15, 9.85, 15, 9.85, 1.05, true); glassRun(-14.85, -9.95, -14.85, 9.85, 1.05, true); glassRun(14.85, -3, 14.85, 9.85, 1.05, true);
// floor lanterns along the rail
function lantern(x, z, s = 1, lv = 0) {
  const g = new T.Group(); g.position.set(x, LVY(lv), z); g.scale.setScalar(s); scene.add(g);
  box(0.34, 0.04, 0.34, metal, 0, 0.02, 0, { parent: g }); box(0.34, 0.04, 0.34, metal, 0, 0.58, 0, { parent: g });
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(0.03, 0.56, 0.03, metal, a * 0.155, 0.3, b * 0.155, { parent: g, cast: false });
  const gl = new T.Mesh(new T.BoxGeometry(0.3, 0.52, 0.3), new T.MeshStandardMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.25, roughness: 0.1 })); gl.position.y = 0.3; g.add(gl);
  const c = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.14, 8), glow(0xffe0a8, 1.2)); c.position.y = 0.11; g.add(c);
  const fl = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), glow(0xffb040, 6)); fl.position.y = 0.21; g.add(fl); FLAMES.push(fl);
  const p = pool(x, z, 1.1 * s, 0xffa850, 0.4, LVY(lv) + 0.022); POOLS.push(p);
  colR(x, z, 0.2 * s, lv); return g;
}
const FLAMES = [], POOLS = [];
for (const x of [-11.2, -6.4, 2.7, 9.3, 12.3]) lantern(x, 9.45);
for (const z of [-4.3, -0.5, 1.2]) lantern(-14.45, z);
lantern(-12.7, 8.95, 1.3); lantern(14.4, 3.5); lantern(14.4, -1.2);

// ---------------------------------------------------------------- bar
{
  const fl = new T.MeshStandardMaterial({ map: flutedTex, roughness: 0.55, envMapIntensity: 0.4 }); flutedTex.wrapS = T.RepeatWrapping; flutedTex.repeat.set(4, 1);
  box(7, 1.05, 0.78, fl, -7.5, 0.525, -6.8, { occ: true });
  const top = box(7.3, 0.07, 0.98, marble, -7.5, 1.09, -6.8); top.castShadow = true;
  H.barStrip = box(7, 0.03, 0.03, glow(0xffb45a, 2.6), -7.5, 1.03, -6.4, { cast: false });
  const rail = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 7, 8), brass); rail.rotation.z = Math.PI / 2; rail.position.set(-7.5, 0.18, -6.32); scene.add(rail);
  pool(-7.5, -6.0, 3.2, 0xff9a40, 0.34);
  col(-11.1, -9.95, -3.9, -6.3);
  // back bar: backlit amber panel with shelves of bottles
  box(7.2, 2.6, 0.3, walnut, -7.5, 1.6, -9.85);
  const back = new T.Mesh(new T.PlaneGeometry(6.8, 2.1), new T.MeshBasicMaterial({ map: canvasTex(64, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf8a'); gr.addColorStop(1, '#a05a20'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), color: new T.Color(1.5, 1.3, 1.1), toneMapped: true }));
  back.position.set(-7.5, 1.75, -9.69); scene.add(back);
  const bottles = [], br = mulberry32(17);
  for (let s = 0; s < 3; s++) {
    box(6.9, 0.035, 0.32, mat(0xe8dfcf, { roughness: 0.2, transparent: true, opacity: 0.9 }), -7.5, 0.95 + s * 0.6, -9.6, { cast: false });
    for (let i = 0; i < 22; i++) {
      const x = -10.75 + i * 0.31 + br() * 0.05, kind = br(), c = pick([0x3e6b3a, 0x8a3a20, 0xd9a441, 0x2a4f70, 0xe8e2d0, 0x6b1f2a, 0xf0d070], br);
      if (kind < 0.5) { const g1 = new T.CylinderGeometry(0.045, 0.05, 0.26, 8); g1.translate(x, 1.1 + s * 0.6, -9.58); const g2 = new T.CylinderGeometry(0.016, 0.03, 0.12, 6); g2.translate(x, 1.29 + s * 0.6, -9.58); bottles.push([g1, c], [g2, c]); }
      else if (kind < 0.8) { const g1 = new T.SphereGeometry(0.07, 8, 6); g1.scale(1, 1.2, 1); g1.translate(x, 1.06 + s * 0.6, -9.58); const g2 = new T.CylinderGeometry(0.014, 0.014, 0.1, 6); g2.translate(x, 1.2 + s * 0.6, -9.58); bottles.push([g1, c], [g2, c]); }
      else { const g1 = new T.BoxGeometry(0.09, 0.2, 0.06); g1.translate(x, 1.07 + s * 0.6, -9.58); bottles.push([g1, c]); }
    }
  }
  scene.add(new T.Mesh(mergeGeos(bottles), vcol({ roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.92, envMapIntensity: 1.2, emissive: 0x3a2008, emissiveIntensity: 0.4 })));
  // glasses on the counter
  for (const [x, c] of [[-10.2, 0xd94040], [-8.9, 0xf2c14e], [-6.1, 0x9be0c0], [-4.6, 0xffd9a0]]) { cyl(0.004, 0.004, 0.07, glassClear, x, 1.16, -6.62, { cast: false }, 4); H.barGlass.push(cyl(0.035, 0.018, 0.06, mat(c, { emissive: c, emissiveIntensity: 0.25, roughness: 0.2 }), x, 1.22, -6.62, { cast: false })); }
  // pergola beams with pendant globes
  for (const x of [-11, -4]) box(0.12, 0.16, 3.6, metal, x, 3.3, -8.2);
  box(7.2, 0.12, 0.12, metal, -7.5, 3.3, -6.6);
  for (const x of [-9.8, -7.5, -5.2]) {
    const cord = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, 0.85, 4), metal); cord.position.set(x, 2.84, -6.6); scene.add(cord);
    const gl = new T.Mesh(new T.SphereGeometry(0.17, 16, 12), glow(0xffd29a, 2.6)); gl.position.set(x, 2.3, -6.6); scene.add(gl);
    box(0.14, 0.05, 0.14, brass, x, 2.45, -6.6, { cast: false });
  }
  // stools
  for (const x of [-9.85, -8.8, -6.05, -5.1]) { cyl(0.2, 0.2, 0.07, mat(0x3a2418, { roughness: 0.45 }), x, 0.78, -6.05); cyl(0.025, 0.025, 0.75, chrome, x, 0.38, -6.05, { cast: false }, 6); cyl(0.17, 0.17, 0.02, chrome, x, 0.01, -6.05, { cast: false }); const ring = new T.Mesh(new T.TorusGeometry(0.13, 0.012, 4, 16), chrome); ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.3, -6.05); scene.add(ring); blob(x, -6.05, 0.6, 0.6, 0.35); }
}
// green cocktail (tell for the barman)
const tellDrink = cyl(0.06, 0.04, 0.16, glow(0x55ff8a, 2.2), -7.5, 1.2, -6.55, { cast: false }, 8);
// wooden slat tower
{ const sm = new T.MeshStandardMaterial({ map: slatTex, roughness: 0.6 }); slatTex.wrapS = T.RepeatWrapping; slatTex.repeat.set(3, 1); const s = box(1.1, 3.6, 2.5, sm, -2.7, 1.8, -8.7, { occ: true }); box(1.2, 0.1, 2.6, walnut, -2.7, 3.65, -8.7); col(-3.25, -9.95, -2.15, -7.45); }

// ---------------------------------------------------------------- lounge
const rug = new T.Mesh(new T.CircleGeometry(3, 48), new T.MeshStandardMaterial({ map: rugTex, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(-10, 0.012, 5); rug.receiveShadow = true; scene.add(rug);
const sofaM = mat(0xeee6d6, { roughness: 0.9 }), cushM = mat(0xe3b13a, { roughness: 0.8 }), cushM2 = mat(0xd96a3b, { roughness: 0.8 }), cushM3 = mat(0x2f6b4f, { roughness: 0.8 });
function rbox(w, h, d, r) { const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); const g = new T.ExtrudeGeometry(s, { depth: d - r * 2, bevelEnabled: true, bevelSize: r * 0.8, bevelThickness: r, bevelSegments: 2, curveSegments: 4 }); g.translate(0, 0, -(d - r * 2) / 2); return g; }
function sofa(x, z, len, ry) {
  const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
  add(rbox(len, 0.38, 0.92, 0.06), sofaM, 0, 0.27, 0, { parent: g }); add(rbox(len, 0.5, 0.24, 0.06), sofaM, 0, 0.62, 0.36, { parent: g });
  add(rbox(0.2, 0.55, 0.92, 0.05), sofaM, -len / 2, 0.36, 0, { parent: g }); add(rbox(0.2, 0.55, 0.92, 0.05), sofaM, len / 2, 0.36, 0, { parent: g });
  for (let i = 0; i < Math.round(len / 1.0); i++) { const c = add(rbox(0.46, 0.4, 0.14, 0.05), [cushM, cushM2, cushM3][i % 3], -len / 2 + 0.55 + i * 0.98, 0.66, 0.19, { parent: g }); H.cush.push(c); c.rotation.x = -0.18; c.rotation.z = (i % 2 ? 1 : -1) * 0.06; }
  for (const s of [-1, 1]) cyl(0.03, 0.02, 0.08, brass, s * (len / 2 - 0.1), 0.04, 0.35, { parent: g, cast: false }, 6);
  blob(0, 0, len + 0.6, 1.4, 0.45, g);
}
sofa(-10, 8.1, 4, Math.PI); col(-12.1, 7.6, -7.9, 8.6);
sofa(-13.9, 4.6, 3.2, -Math.PI / 2); col(-14.4, 3.0, -13.4, 6.2);
function armchair(x, z, ry) { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); add(rbox(0.85, 0.36, 0.8, 0.06), cushM, 0, 0.26, 0, { parent: g }); add(rbox(0.85, 0.5, 0.18, 0.06), cushM, 0, 0.58, 0.32, { parent: g }); for (const s of [-1, 1]) add(rbox(0.14, 0.45, 0.8, 0.05), cushM, s * 0.44, 0.38, 0, { parent: g }); blob(0, 0, 1.3, 1.2, 0.45, g); }
armchair(-7.2, 6.6, Math.PI / 2 + 0.5); colR(-7.2, 6.6, 0.45);
// coffee table with tray, candles, ice bucket
cyl(0.72, 0.72, 0.06, marble, -10, 0.42, 5, {}, 32); cyl(0.12, 0.24, 0.4, brass, -10, 0.2, 5, {}, 12); col(-10.7, 4.3, -9.3, 5.7);
H.iceBucket = cyl(0.11, 0.09, 0.2, chrome, -9.75, 0.55, 4.85); H.ctBottle = cyl(0.035, 0.035, 0.32, mat(0x1f3b26, { roughness: 0.2 }), -9.75, 0.62, 4.85, { cast: false }, 8);
H.ctBook1 = box(0.3, 0.05, 0.22, mat(0x7a2e1e), -10.25, 0.47, 5.15); H.ctBook2 = box(0.28, 0.04, 0.2, mat(0x1f2a44), -10.24, 0.515, 5.14);
for (const [dx, dz] of [[0.1, 0.25], [-0.25, -0.15]]) { cyl(0.04, 0.04, 0.09, mat(0xfff1d8), -10 + dx, 0.5, 5 + dz, { cast: false }, 8); const f = add(new T.SphereGeometry(0.018, 6, 4), glow(0xffb040, 6), -10 + dx, 0.57, 5 + dz, { cast: false }); FLAMES.push(f); H.ctFlames.push(f); }
pool(-10, 5, 1.6, 0xffa850, 0.35);
// floor lamp (mission)
const lampShade = new T.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffc070, emissiveIntensity: 1.8, roughness: 0.8, side: T.DoubleSide });
cyl(0.022, 0.022, 1.55, brass, -13.9, 0.8, 2.1); cyl(0.2, 0.22, 0.04, metal, -13.9, 0.02, 2.1);
const lampMesh = cyl(0.2, 0.3, 0.36, lampShade, -13.9, 1.65, 2.1, { cast: false }, 20);
const lampLight = new T.PointLight(0xffc070, 1.4, 5, 2); lampLight.position.set(-13.9, 1.5, 2.1); scene.add(lampLight);
const lampPool = pool(-13.9, 2.1, 1.6, 0xffb060, 0.5);
col(-14.15, 1.85, -13.65, 2.35); blob(-13.9, 2.1, 0.6, 0.6, 0.4);

// ---------------------------------------------------------------- dance floor + string lights + DJ
const dance = new T.Mesh(new T.PlaneGeometry(7, 6), new T.MeshStandardMaterial({ map: herringTex, roughness: 0.32, envMapIntensity: 0.6 }));
dance.rotation.x = -Math.PI / 2; dance.position.set(4.5, 0.013, 4); dance.receiveShadow = true; scene.add(dance);
box(7.1, 0.025, 0.05, brass, 4.5, 0.012, 1.0, { cast: false }); box(7.1, 0.025, 0.05, brass, 4.5, 0.012, 7.0, { cast: false }); box(0.05, 0.025, 6.0, brass, 1.0, 0.012, 4, { cast: false }); box(0.05, 0.025, 6.0, brass, 8.0, 0.012, 4, { cast: false });
pool(4.5, 4, 4.2, 0xffa070, 0.3);
{
  const bulbs = [], wires = [];
  [[1, 1], [8, 1], [8, 7], [1, 7]].forEach(([x, z]) => { cyl(0.04, 0.05, 3.1, metal, x, 1.55, z, {}, 8); cyl(0.14, 0.16, 0.05, metal, x, 0.025, z, { cast: false }); colR(x, z, 0.08); });
  [[[1, 1], [8, 7]], [[8, 1], [1, 7]], [[1, 1], [8, 1]], [[1, 7], [8, 7]], [[1, 1], [1, 7]], [[8, 1], [8, 7]]].forEach(([a, b]) => {
    const pts = [];
    for (let i = 0; i <= 14; i++) { const t = i / 14, sag = Math.sin(t * Math.PI) * 0.5; const p = [a[0] + (b[0] - a[0]) * t, 3.05 - sag, a[1] + (b[1] - a[1]) * t]; pts.push(new T.Vector3(...p)); if (i > 0 && i < 14) { const g = new T.SphereGeometry(0.055, 8, 6); g.translate(p[0], p[1] - 0.07, p[2]); bulbs.push([g, 0xffffff]); } }
    wires.push(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x111111 })));
  });
  wires.forEach(w => scene.add(w));
  scene.add(new T.Mesh(mergeGeos(bulbs), new T.MeshBasicMaterial({ vertexColors: true, color: new T.Color(2.6, 2.0, 1.2), toneMapped: false })));
  // DJ booth
  const g = new T.Group(); g.position.set(6.5, 0, 8.3); scene.add(g);
  add(rbox(1.6, 1.0, 0.7, 0.04), mat(0x15161a, { roughness: 0.4 }), 0, 0.5, 0, { parent: g });
  H.djLed1 = box(1.5, 0.05, 0.03, glow(0xff5aa0, 2.4), 0, 0.75, -0.36, { parent: g, cast: false }); H.djLed2 = box(1.5, 0.05, 0.03, glow(0x5ab0ff, 2.4), 0, 0.55, -0.36, { parent: g, cast: false });
  for (const s of [-1, 1]) { H.djDisk.push(cyl(0.16, 0.16, 0.03, mat(0x222222, { roughness: 0.3 }), s * 0.42, 1.02, 0.05, { parent: g, cast: false }, 18)); H.djSpeaker.push(box(0.42, 1.25, 0.42, mat(0x111114), s * 1.05, 0.62, 0, { parent: g })); cyl(0.12, 0.12, 0.02, metal, s * 1.05, 0.85, -0.22, { parent: g, cast: false }).rotation.x = Math.PI / 2; }
  box(0.4, 0.02, 0.28, mat(0x2a2a30), 0, 1.01, 0.05, { parent: g, cast: false });
  col(5.6, 7.95, 7.4, 8.65); blob(6.5, 8.3, 3.0, 1.2, 0.5);
}

// ---------------------------------------------------------------- cocktail tables with candles
TABLES.forEach(([x, z], i) => {
  if (i === 9) return;
  cyl(0.4, 0.4, 0.04, marble, x, 1.06, z, {}, 24); cyl(0.035, 0.035, 1.04, brass, x, 0.53, z, { cast: false }, 8); cyl(0.24, 0.26, 0.03, brass, x, 0.015, z, { cast: false }, 18);
  cyl(0.045, 0.045, 0.08, new T.MeshStandardMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.45, roughness: 0.1 }), x, 1.12, z, { cast: false }, 10);
  const f = add(new T.SphereGeometry(0.016, 6, 4), glow(0xffb040, 3.5), x, 1.13, z, { cast: false }); FLAMES.push(f); H.tFlame[i] = f;
  if (i % 2) { cyl(0.004, 0.004, 0.07, glassClear, x + 0.18, 1.12, z - 0.1, { cast: false }, 4); H.tGlass[i] = cyl(0.035, 0.018, 0.06, mat(0xd94040, { roughness: 0.2 }), x + 0.18, 1.18, z - 0.1, { cast: false }); }
  pool(x, z, 1.3, 0xffa850, 0.2); blob(x, z, 0.9, 0.9, 0.35);
  colR(x, z, 0.35);
});

// ---------------------------------------------------------------- plants
const PLANTS = [];
const leafShape = (() => { const s = new T.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.09, 0.3, 0, 0.62); s.quadraticCurveTo(-0.09, 0.3, 0, 0); return s; })();
const monsteraShape = (() => { const s = new T.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.26, 0.05, 0.3, 0.38, 0, 0.5); s.bezierCurveTo(-0.3, 0.38, -0.26, 0.05, 0, 0); return s; })();
function frondGeo(len, width, lift, pr) {
  // a feather-shaped frond with serrated leaflets, drooping from the crown
  const s = new T.Shape(), N = 14; s.moveTo(0, 0);
  const L = [], R = [];
  for (let k = 1; k <= N; k++) { const t = k / N, w = width * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 0.8) * (k % 2 ? 1 : 0.45); L.push([-w, t * len + (k % 2 ? -0.04 : 0)]); R.push([w, t * len + (k % 2 ? -0.04 : 0)]); }
  R.forEach(([x, y]) => s.lineTo(x, y)); s.lineTo(0, len * 1.02); L.reverse().forEach(([x, y]) => s.lineTo(x, y)); s.lineTo(0, 0);
  const g = new T.ShapeGeometry(s); const p = g.attributes.position;
  for (let k = 0; k < p.count; k++) {
    const across = p.getX(k), along = p.getY(k), t = along / len;
    const h = Math.sin(lift) * along - t * t * len * 0.75 - Math.abs(across) * 0.45;
    p.setXYZ(k, across, h, Math.cos(lift) * along * 0.95 + 0.05);
  }
  g.computeVertexNormals(); return g;
}
function plant(x, z, kind, opts = {}) {
  const pr = mulberry32(Math.floor((x + 50) * 100 + (z + 50) * 7));
  const big = kind !== 'small';
  const g = new T.Group(); g.position.set(x, LVY(opts.lv || 0), z); scene.add(g);
  const potR = big ? 0.48 : 0.34, potH = big ? 0.8 : 0.55;
  const potM = mat(pick([0xf1ece2, 0xe9e1d2, 0x3a3a3e, 0xc98e6a], pr), { roughness: 0.6 });
  add(new T.CylinderGeometry(potR, potR * 0.78, potH, 20), potM, 0, potH / 2, 0, { parent: g });
  add(new T.TorusGeometry(potR * 0.98, 0.03, 6, 20), potM, 0, potH, 0, { parent: g, cast: false }).rotation.x = Math.PI / 2;
  add(new T.CircleGeometry(potR * 0.95, 20), mat(0x2b1d14, { roughness: 1 }), 0, potH - 0.02, 0, { parent: g, cast: false }).rotation.x = -Math.PI / 2;
  const crown = new T.Group(); crown.position.y = potH; g.add(crown);
  const pieces = [];
  const greens = [0x3f7a3a, 0x2f6a33, 0x4f8a42, 0x2a5c2e, 0x5a9448];
  if (kind === 'palm' || kind === 'small') {
    const trunkH = kind === 'palm' ? 1.25 : 0.12;
    for (let k = 0; k < (kind === 'palm' ? 6 : 1); k++) { const tg = new T.CylinderGeometry(0.055 - k * 0.003, 0.075 - k * 0.003, trunkH / 6 + 0.03, 7); tg.translate(Math.sin(k) * 0.01, k * trunkH / 6 + trunkH / 12, 0); pieces.push([tg, k % 2 ? 0x6b4a2b : 0x7d5a38]); }
    const nF = kind === 'palm' ? 12 : 10;
    for (let i = 0; i < nF; i++) {
      const a = i / nF * Math.PI * 2 + pr() * 0.4, len = kind === 'palm' ? 1.0 + pr() * 0.35 : 0.5 + pr() * 0.25;
      const lift = kind === 'palm' ? 0.35 + pr() * 0.6 : 0.6 + pr() * 0.6;
      pieces.push([frondGeo(len, len * 0.32, lift, pr).rotateY(a).translate(0, trunkH, 0), pick(greens, pr)]);
    }
  } else if (kind === 'monstera') {
    for (let i = 0; i < 14; i++) { const a = pr() * Math.PI * 2, h = 0.3 + pr() * 0.6, lg = new T.ShapeGeometry(monsteraShape); lg.scale(1.4, 1.4, 1); lg.rotateX(-1.0 - pr() * 0.4); lg.translate(0, h, 0.18 + pr() * 0.2); lg.rotateY(a); pieces.push([lg, pick(greens, pr)]); const st = new T.CylinderGeometry(0.01, 0.012, h, 4); st.translate(0, h / 2, 0.1); st.rotateY(a); pieces.push([st, 0x3a6a2a]); }
  } else if (kind === 'olive') {
    const tg = new T.CylinderGeometry(0.05, 0.08, 1.3, 7); tg.translate(0, 0.65, 0); pieces.push([tg, 0x5a4632]);
    for (let i = 0; i < 26; i++) { const sg = folhaGeo(0.2 + pr() * 0.16, i * 1.3 + 6, 0.85); const a = pr() * Math.PI * 2, r = pr() * 0.45; sg.translate(Math.cos(a) * r, 1.3 + pr() * 0.75, Math.sin(a) * r); pieces.push([sg, pick([0x6f8c5a, 0x5d7c4c, 0x82a06a, 0x4e6c40], pr)]); }
  }
  const leafMesh = new T.Mesh(mergeGeos(pieces), vcol({ side: T.DoubleSide, roughness: 0.6 }));
  leafMesh.castShadow = true; crown.add(leafMesh);
  if (opts.occ !== false) OCCLUDERS.push(leafMesh);
  blob(0, 0, potR * 3.2, potR * 3.2, 0.45, g);
  colR(x, z, potR + 0.02, opts.lv || 0);
  PLANTS.push(crown); H.plants[x + ',' + z] = crown; return crown;
}
[[-14, -9.2, 'palm'], [-1.6, -9.3, 'olive'], [4.4, -9.3, 'small'], [-14.0, 9.1, 'palm'], [14.0, 9.1, 'olive'], [8.6, 9.1, 'monstera'], [14.1, -2.2, 'small'], [-0.5, 4.2, 'monstera'], [5.7, -9.3, 'monstera'], [-4.6, -9.3, 'small']].forEach(([x, z, k]) => plant(x, z, k));
const vaseCrown = plant(-3.5, 9.0, 'palm', { occ: false });
col(-4.1, 8.45, -2.9, 9.6);

// ---------------------------------------------------------------- office
const officeRug = new T.Mesh(new T.PlaneGeometry(4.2, 2.8), mat(0x8a3a2a, { roughness: 1 })); officeRug.rotation.x = -Math.PI / 2; officeRug.position.set(9.4, 0.025, -6.4); scene.add(officeRug);
box(2.5, 0.07, 0.95, walnut, 9.2, 0.76, -6.75); for (const sx of [8.05, 10.35]) box(0.07, 0.74, 0.9, brass, sx, 0.37, -6.75);
col(8.0, -7.2, 10.4, -6.3); blob(9.2, -6.75, 3.0, 1.5, 0.45);
{ const ch = H.officeChair = new T.Group(); ch.position.set(9.2, 0, -7.75); scene.add(ch); add(rbox(0.6, 0.12, 0.58, 0.04), mat(0x2a1a12, { roughness: 0.4 }), 0, 0.48, 0, { parent: ch }); add(rbox(0.6, 0.72, 0.1, 0.04), mat(0x2a1a12, { roughness: 0.4 }), 0, 0.92, -0.26, { parent: ch }); cyl(0.03, 0.03, 0.42, chrome, 0, 0.21, 0, { parent: ch, cast: false }); cyl(0.28, 0.28, 0.03, chrome, 0, 0.02, 0, { parent: ch, cast: false }); }
box(0.42, 0.02, 0.3, mat(0x9aa0a8, { metalness: 0.7, roughness: 0.3 }), 8.6, 0.81, -6.85);
{ const scr = box(0.42, 0.28, 0.015, mat(0x9aa0a8, { metalness: 0.7, roughness: 0.3 }), 8.6, 0.95, -7.0, { cast: false }); scr.rotation.x = -0.25; const sc = H.laptopScreen = new T.Mesh(new T.PlaneGeometry(0.38, 0.24), glow(0x8fc4ff, 1.4)); sc.position.set(8.6, 0.95, -6.99); sc.rotation.x = -0.25; scene.add(sc); }
const briefcase = box(0.5, 0.32, 0.13, mat(0x7a4a24, { roughness: 0.5 }), 9.7, 0.96, -6.75);
box(0.2, 0.04, 0.03, brass, 9.7, 1.13, -6.75, { cast: false });
cyl(0.015, 0.015, 0.4, brass, 10.15, 1.0, -7.0, { cast: false }, 6);
const desklamp = H.desklamp = cyl(0.1, 0.16, 0.14, mat(0x1f3b26, { roughness: 0.4 }), 10.15, 1.22, -7.0, { cast: false }, 14);
H.deskPool = pool(10.1, -6.8, 1.4, 0xffc070, 0.45);
// guest chairs
for (const dx of [-0.7, 0.7]) { const ch = new T.Group(); ch.position.set(9.2 + dx, 0, -5.55 + 0.0); ch.rotation.y = Math.PI; } // (kept clear for the mission spot)
// painting
const paintTex = canvasTex(512, 360, (g, w, h) => {
  g.fillStyle = '#ece4d2'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#2f6b4f'; g.beginPath(); g.ellipse(160, 180, 140, 120, 0.3, 0, 7); g.fill();
  g.fillStyle = '#d9a441'; g.beginPath(); g.ellipse(340, 140, 110, 80, -0.4, 0, 7); g.fill();
  g.fillStyle = '#c8322f'; g.fillRect(300, 220, 140, 80);
  g.fillStyle = '#1b1b22'; g.fillRect(80, 280, 240, 20); grain(g, w, h, 10);
});
const painting = new T.Group(); painting.position.set(11.8, 1.8, -9.95); scene.add(painting);
box(1.56, 1.16, 0.06, mat(0xc99a45, { metalness: 0.8, roughness: 0.3 }), 0, 0, 0.02, { parent: painting, cast: false });
const pic = H.pic = new T.Mesh(new T.PlaneGeometry(1.4, 1.0), new T.MeshStandardMaterial({ map: paintTex, roughness: 0.85 })); pic.position.z = 0.06; painting.add(pic);
box(0.5, 0.04, 0.08, brass, 11.8, 2.5, -9.9, { cast: false }); H.paintPool = pool(11.8, -9.5, 1.2, 0xffd29a, 0.35);
// bookshelf + safe
box(0.5, 2.4, 3.5, walnut, 14.35, 1.2, -6.75, { occ: true }); col(14.0, -8.5, 14.6, -5.0);
{
  const books = [], bkr = mulberry32(23);
  for (let s = 0; s < 4; s++) { const sg = new T.BoxGeometry(0.42, 0.03, 3.4); sg.translate(14.3, 0.08 + s * 0.58, -6.75); books.push([sg, 0x3a2516]); for (let i = 0; i < 26; i++) { if (s === 0 && i > 7 && i < 15) continue; if (bkr() < 0.12) continue; const hgt = 0.26 + bkr() * 0.16, bg = new T.BoxGeometry(0.28, hgt, 0.08 + bkr() * 0.05); if (bkr() < 0.15) bg.rotateX(0.25); bg.translate(14.14, 0.1 + s * 0.58 + hgt / 2, -8.35 + i * 0.125); books.push([bg, pick([0x7a2e1e, 0x2a4f70, 0xd9a441, 0x2f4a3a, 0xe8e2d0, 0x1b1b1f, 0x8a6a4a], bkr)]); } }
  scene.add(new T.Mesh(mergeGeos(books), vcol({ roughness: 0.75 })));
}
box(0.32, 0.5, 0.75, mat(0x2b2d31, { metalness: 0.6, roughness: 0.35 }), 14.15, 0.3, -6.3);
const safeDoor = new T.Group(); safeDoor.position.set(13.98, 0.3, -6.66); scene.add(safeDoor);
box(0.04, 0.44, 0.7, mat(0x4a4d55, { metalness: 0.75, roughness: 0.3 }), 0, 0, 0.35, { parent: safeDoor, cast: false });
cyl(0.06, 0.06, 0.04, brass, -0.03, 0, 0.35, { parent: safeDoor, cast: false }).rotation.z = Math.PI / 2;
// statue
add(rbox(0.75, 1.0, 0.75, 0.03), marble, 11.5, 0.5, 5); col(11.1, 4.6, 11.9, 5.4);
const statue = new T.Group(); statue.position.set(11.5, 1.0, 5); scene.add(statue);
const goldM = mat(0xd9a441, { metalness: 0.95, roughness: 0.22, envMapIntensity: 1.3 }), silverM = mat(0xc9ced6, { metalness: 0.95, roughness: 0.2, envMapIntensity: 1.3 });
const st1 = add(new T.IcosahedronGeometry(0.22, 1), goldM, 0, 0.6, 0, { parent: statue });
const st2 = add(new T.CylinderGeometry(0.07, 0.15, 0.45, 8), goldM, 0, 0.24, 0, { parent: statue });
const st3 = add(new T.TorusGeometry(0.18, 0.03, 8, 24), goldM, 0, 0.62, 0, { parent: statue });
H.statuePool = pool(11.5, 5, 1.2, 0xffc27a, 0.35); blob(11.5, 5, 1.4, 1.4, 0.45);
for (const [x, z] of [[11.1, 4.6], [11.9, 4.6]]) { const sp = add(new T.CylinderGeometry(0.04, 0.06, 0.08, 8), brass, x, 0.04, z, { cast: false }); }

// ---------------------------------------------------------------- spiral stairs between the levels
function spiralStair(li) {
  const L = LINKS[li], N = 22, cx = L.cx, cz = L.cz, r = L.r, y0 = LVY(L.lo);
  cyl(0.09, 0.09, DH + 1.1, metal, cx, y0 + (DH + 1.1) / 2, cz, { cast: false }, 12);
  const treads = [];
  for (let i = 0; i < N; i++) {
    const g = new T.CylinderGeometry(r + 0.05, r + 0.05, 0.05, 6, 1, false, -Math.PI * 2 * L.turns * (i + 1) / N, Math.PI * 2 * L.turns / N);
    g.translate(cx, y0 + DH * (i + 0.5) / N - 0.02, cz); treads.push([g, i % 2 ? 0x4a2e1a : 0x553620]);
  }
  const tm = new T.Mesh(mergeGeos(treads), vcol({ roughness: 0.55 })); tm.castShadow = true; scene.add(tm); OCCLUDERS.push(tm);
  // handrail following the helix
  const pts = []; for (let i = 0; i <= 60; i++) { const p = linkPos(0.06 + 0.88 * i / 60, li); pts.push(new T.Vector3(cx + (p.x - cx) * 1.1, p.y + 0.95, cz + (p.z - cz) * 1.1)); }
  scene.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 90, 0.025, 6, false), brass));
  for (let i = 0; i <= 60; i += 4) { const p = pts[i]; cyl(0.012, 0.012, 0.95, metal, p.x, p.y - 0.47, p.z, { cast: false }, 5); }
  // landing that bridges onto the upper level's edge
  const lz = (L.cz - L.r + L.top[1]) / 2;
  box(1.6, 0.12, Math.abs(L.top[1] - (L.cz - L.r)) + 0.4, walnut, cx, y0 + DH - 0.06, lz); box(1.6, 0.03, 0.08, brass, cx, y0 + DH + 0.01, L.cz - L.r, { cast: false });
  colR(cx, cz, 1.18, L.lo); pool(cx, cz + 1.5, 1.4, 0xffc27a, 0.3, y0 + 0.022); blob(cx, cz, 2.8, 2.8, 0.4).position.y = y0 + 0.014;
  plight(cx, y0 + 1.2, cz + 1.4, 0xffc27a, 0.8, 5);
}
spiralStair(0);

// ---------------------------------------------------------------- upper deck: pool, fire pit, piano, garden, neon sign
const DK = new T.Group(); DK.position.y = DH; scene.add(DK);
const dk = { parent: DK };
const deckTex = canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry32(31); g.fillStyle = '#8a7a66'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 20; i++) { const b = 128 + r() * 26; for (let s = 0; s < 4; s++) { const x0 = s * 360 - (i % 4) * 90; g.fillStyle = `rgb(${b + 10},${b - 6},${b - 26})`; g.fillRect(x0, i * 51.2, 356, 49); for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(70,50,35,${0.1 + r() * 0.12})`; g.lineWidth = 1 + r(); g.beginPath(); const yy = i * 51.2 + r() * 49; g.moveTo(x0, yy); g.lineTo(x0 + 356, yy + r() * 4 - 2); g.stroke(); } } }
  g.fillStyle = 'rgba(30,22,16,.55)'; for (let i = 0; i <= 20; i++) g.fillRect(0, i * 51.2 - 1.5, w, 3);
  grain(g, w, h, 12);
}, [2.4, 1.0]);
const deckFloor = new T.Mesh(new T.PlaneGeometry(30, 13.0), new T.MeshStandardMaterial({ map: deckTex, roughness: 0.62, envMapIntensity: 0.3 }));
deckFloor.rotation.x = -Math.PI / 2; deckFloor.position.set(0, 0.012, -15.2); deckFloor.receiveShadow = true; deckFloor.userData.lv = 1; DK.add(deckFloor);
// railings: glass at the front (gap for the stair landing), solid parapet at the back
glassRun(-15, -8.95, -13.9, -8.95, 1.05, true, DH); glassRun(-12.1, -8.95, 15, -8.95, 1.05, true, DH);
glassRun(-14.85, -21.6, -14.85, -8.95, 1.05, true, DH); glassRun(14.85, -8.95, 14.85, -21.6, 1.05, true, DH);
box(7.9, 1.0, 0.4, cream, -11.65, 0.5, -21.8, dk); box(8.1, 0.08, 0.5, creamDark, -11.65, 1.02, -21.8, { parent: DK, cast: false });
box(20.9, 1.0, 0.4, cream, 5.15, 0.5, -21.8, dk); box(21.1, 0.08, 0.5, creamDark, 5.15, 1.02, -21.8, { parent: DK, cast: false });
col(-15.6, -22.2, -7.7, -21.55, 1); col(-5.3, -22.2, 15.6, -21.55, 1);
// planters with hedges along the back wall
{
  const bush = [], br = mulberry32(61);
  for (const [x, len] of [[-11.5, 4.0], [-2.5, 4.5], [12.0, 4.0]]) {
    box(len, 0.5, 0.6, mat(0x3a3a3e, { roughness: 0.7 }), x, 0.25, -21.2, dk);
    for (let i = 0; i < len * 3; i++) { const s = folhaGeo(0.2 + br() * 0.14, i * 1.3 + x, 0.85); s.translate(x - len / 2 + 0.3 + i * (len - 0.6) / (len * 3 - 1), 0.55 + br() * 0.2, -21.2 + (br() - 0.5) * 0.3); bush.push([s, pick([0x3f7a3a, 0x2f6a33, 0x4f8a42, 0x5a9448], br)]); }
    col(x - len / 2, -21.6, x + len / 2, -20.85, 1);
  }
  const bm = new T.Mesh(mergeGeos(bush), vcol({ roughness: 0.7 })); bm.castShadow = true; DK.add(bm);
}

// pool: flush with the deck, lit from below, with a caustic shimmer
const causticTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const r = mulberry32(13);
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 2;
  for (let k = 0; k < 70; k++) { g.beginPath(); const x = r() * w, y = r() * h; g.ellipse(x, y, 14 + r() * 22, 8 + r() * 14, r() * 3, 0, 7); g.stroke(); }
  g.filter = 'blur(2px)'; g.drawImage(g.canvas, 0, 0); g.filter = 'none';
}, [3, 2]);
causticTex.encoding = T.LinearEncoding;
const waterMat = new T.MeshStandardMaterial({ color: 0x2aa6c0, transparent: true, opacity: 0.92, roughness: 0.06, metalness: 0.1, envMapIntensity: 1.2, emissive: 0x0f7a90, emissiveIntensity: 0.5, emissiveMap: causticTex });
const water = new T.Mesh(new T.PlaneGeometry(9.0, 5.0), waterMat); water.rotation.x = -Math.PI / 2; water.position.set(0, 0.03, -17.9); water.renderOrder = 2; DK.add(water);
box(10.0, 0.14, 0.5, marble, 0, 0.07, -15.15, dk); box(10.0, 0.14, 0.5, marble, 0, 0.07, -20.65, dk);
box(0.5, 0.14, 6.0, marble, -4.75, 0.07, -17.9, dk); box(0.5, 0.14, 6.0, marble, 4.75, 0.07, -17.9, dk);
col(-5.0, -20.9, 5.0, -14.9, 1);
const poolLight = new T.PointLight(0x5fe0ff, 1.3, 9, 2); poolLight.position.set(0, 0.6, -17.9); DK.add(poolLight);
const poolPool = pool(0, -17.9, 5.6, 0x40d0e0, 0.3, DH + 0.05);
for (const x of [-3, 0, 3]) { const d = new T.Mesh(new T.CircleGeometry(0.14, 12), glow(0xbfefff, 2.5)); d.rotation.x = -Math.PI / 2; d.position.set(x, 0.035, -17.9); DK.add(d); }
// ladder
for (const dx of [-0.2, 0.2]) { cyl(0.025, 0.025, 1.1, chrome, 4.1 + dx, 0.45, -16.2, { parent: DK, cast: false }, 8); } box(0.44, 0.03, 0.03, chrome, 4.1, 1.0, -16.2, { parent: DK, cast: false }); box(0.44, 0.03, 0.03, chrome, 4.1, 0.0, -16.6, { parent: DK, cast: false });
// floaters: a flamingo and a striped ring
const FLOATS = [];
{
  const f = new T.Group(); f.position.set(1.6, 0.05, -18.8); DK.add(f); FLOATS.push(f);
  const pink = mat(0xff7fae, { roughness: 0.4 });
  add(new T.TorusGeometry(0.5, 0.17, 10, 20), pink, 0, 0, 0, { parent: f, cast: false }).rotation.x = Math.PI / 2;
  const neck = add(new T.CylinderGeometry(0.07, 0.09, 0.7, 8), pink, 0.0, 0.33, -0.45, { parent: f, cast: false }); neck.rotation.x = 0.35;
  add(new T.SphereGeometry(0.12, 10, 8), pink, 0, 0.72, -0.62, { parent: f, cast: false });
  add(new T.ConeGeometry(0.05, 0.2, 6), mat(0x1b1b1f), 0, 0.68, -0.78, { parent: f, cast: false }).rotation.x = -Math.PI / 2 - 0.3;
  for (const s of [-1, 1]) add(new T.SphereGeometry(0.018, 5, 4), mat(0x1b1b1f), s * 0.07, 0.76, -0.68, { parent: f, cast: false });
  const stripe = canvasTex(256, 16, (g, w) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#e23c4a'; g.fillRect(i * 32, 0, 32, 16); } });
  const ring = new T.Mesh(new T.TorusGeometry(0.42, 0.15, 10, 24), new T.MeshStandardMaterial({ map: stripe, roughness: 0.45 })); ring.rotation.x = Math.PI / 2; ring.position.set(-2.4, 0.05, -17.0); DK.add(ring); FLOATS.push(ring);
}
// string lights on posts over the pool
{
  const bulbs = [];
  [[-5.3, -14.6], [5.3, -14.6], [-5.3, -21.0], [5.3, -21.0]].forEach(([x, z]) => { cyl(0.04, 0.05, 2.9, metal, x, 1.45, z, { parent: DK }, 8); cyl(0.14, 0.16, 0.05, metal, x, 0.025, z, { parent: DK, cast: false }); colR(x, z, 0.08, 1); });
  [[[-5.3, -14.6], [5.3, -21.0]], [[5.3, -14.6], [-5.3, -21.0]], [[-5.3, -14.6], [5.3, -14.6]], [[-14.5, -21.3], [14.5, -21.3]]].forEach(([a, b]) => {
    const pts = []; const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.8);
    for (let i = 0; i <= n; i++) { const t = i / n, sag = Math.sin(t * Math.PI) * 0.45; const p = [a[0] + (b[0] - a[0]) * t, 2.85 - sag, a[1] + (b[1] - a[1]) * t]; pts.push(new T.Vector3(...p)); if (i > 0 && i < n) { const g = new T.SphereGeometry(0.055, 8, 6); g.translate(p[0], p[1] - 0.07, p[2]); bulbs.push([g, 0xffffff]); } }
    DK.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x111111 })));
  });
  DK.add(new T.Mesh(mergeGeos(bulbs), new T.MeshBasicMaterial({ vertexColors: true, color: new T.Color(2.6, 2.0, 1.2), toneMapped: false })));
}
// loungers facing the pool, side tables, towels, parasols
function lounger(x, z, towel) {
  const g = new T.Group(); g.position.set(x, 0, z); DK.add(g); H.loungers.push(g);
  const fr = mat(0xe9e1d2, { roughness: 0.8 }), wood = mat(0xb08a5a, { roughness: 0.6 });
  for (const [a, b] of [[-0.3, -0.95], [0.3, -0.95], [-0.3, 0.55], [0.3, 0.55]]) cyl(0.025, 0.025, 0.36, wood, a, 0.18, b, { parent: g, cast: false }, 6);
  add(rbox(0.72, 0.08, 1.55, 0.03), fr, 0, 0.4, -0.25, { parent: g });
  const back = add(rbox(0.72, 0.08, 0.8, 0.03), fr, 0, 0.62, 0.85, { parent: g }); back.rotation.x = -0.75;
  for (let i = 0; i < 6; i++) box(0.02, 0.1, 0.02, wood, -0.34 + i * 0.136, 0.47, -0.9, { parent: g, cast: false });
  if (towel) { const tw = add(rbox(0.5, 0.07, 0.34, 0.03), mat(towel, { roughness: 1 }), 0, 0.48, -0.35, { parent: g, cast: false }); H.towels.push(tw); tw.rotation.y = 0.15; }
  blob(0, 0, 1.3, 2.2, 0.4, g); col(x - 0.4, z - 1.05, x + 0.4, z + 1.2, 1);
}
[-3.6, -1.2, 1.2, 3.6].forEach((x, i) => lounger(x, -12.5, i % 2 ? 0x2a6fb8 : (i === 0 ? 0xe9c33b : 0)));
for (const x of [-2.4, 2.4]) { cyl(0.26, 0.26, 0.04, mat(0xf1ece2), x, 0.46, -12.3, { parent: DK }, 16); cyl(0.03, 0.03, 0.44, chrome, x, 0.22, -12.3, { parent: DK, cast: false }, 6); H.sideDrink.push(cyl(0.035, 0.018, 0.07, mat(0xff8a4a, { emissive: 0xff8a4a, emissiveIntensity: 0.3, roughness: 0.2 }), x + 0.08, 0.52, -12.3, { parent: DK, cast: false })); colR(x, -12.3, 0.2, 1); }
for (const x of [-5.6, 5.6]) { cyl(0.03, 0.035, 2.4, brass, x, 1.2, -12.4, { parent: DK, cast: false }, 8); const c = add(new T.ConeGeometry(1.35, 0.5, 10, 1, true), mat(0xf3ede0, { roughness: 0.9, side: T.DoubleSide }), x, 2.3, -12.4, { parent: DK, occ: true }); add(new T.SphereGeometry(0.05, 6, 4), brass, x, 2.58, -12.4, { parent: DK, cast: false }); colR(x, -12.4, 0.12, 1); blob(x, -12.4, 2.4, 2.4, 0.3, DK); }

// fire pit lounge
const fireRug = new T.Mesh(new T.CircleGeometry(3.3, 48), new T.MeshStandardMaterial({ map: rugTex, color: 0xc27a52, roughness: 1 })); fireRug.rotation.x = -Math.PI / 2; fireRug.position.set(-10.2, 0.011, -16.6); fireRug.receiveShadow = true; DK.add(fireRug);
cyl(0.78, 0.86, 0.38, mat(0x6a6660, { roughness: 0.9 }), -10.2, 0.19, -16.6, dk, 24); cyl(0.6, 0.6, 0.08, mat(0x1b1b1f, { roughness: 0.9 }), -10.2, 0.4, -16.6, { parent: DK, cast: false }, 20);
{
  const rocks = [], rr = mulberry32(71);
  for (let i = 0; i < 26; i++) { const g = new T.DodecahedronGeometry(0.05 + rr() * 0.05, 0); const a = rr() * Math.PI * 2, d = rr() * 0.5; g.translate(-10.2 + Math.cos(a) * d, 0.44, -16.6 + Math.sin(a) * d); rocks.push([g, rr() < 0.4 ? 0x3a3a3e : 0x6a2a1a]); }
  DK.add(new T.Mesh(mergeGeos(rocks), vcol({ roughness: 0.9, emissive: 0xff4a10, emissiveIntensity: 0.35 })));
}
const FIRE = [];
for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, d = i ? 0.22 : 0; const f = add(new T.ConeGeometry(0.11, 0.45, 7), glow(i % 2 ? 0xffb030 : 0xff6a20, 5), -10.2 + Math.cos(a) * d, 0.62, -16.6 + Math.sin(a) * d, { parent: DK, cast: false }); f.userData.ph = i * 1.3; FIRE.push(f); }
const fireLight = new T.PointLight(0xff9040, 1.8, 8, 2); fireLight.position.set(-10.2, 1.2, -16.6); DK.add(fireLight);
H.firePool = pool(-10.2, -16.6, 3.0, 0xff8a30, 0.4, DH + 0.022);
colR(-10.2, -16.6, 0.95, 1);
for (let i = 0; i < 3; i++) {
  const a = i * Math.PI * 2 / 3 + Math.PI / 6;
  const b = new T.Mesh(new T.TorusGeometry(1.95, 0.24, 6, 14, 1.25), mat(0xeee6d6, { roughness: 0.9 })); b.rotation.order = 'YXZ'; b.rotation.x = Math.PI / 2; b.rotation.y = -(a - 0.625); b.scale.y = 1; b.position.set(-10.2, 0.4, -16.6); b.castShadow = true; DK.add(b);
  const base = new T.Mesh(new T.TorusGeometry(1.95, 0.18, 4, 14, 1.25), mat(0x5a4632, { roughness: 0.8 })); base.rotation.order = 'YXZ'; base.rotation.x = Math.PI / 2; base.rotation.y = -(a - 0.625); base.position.set(-10.2, 0.18, -16.6); DK.add(base);
  for (const d of [-0.42, 0.42]) { const t = a + d; const c = add(rbox(0.4, 0.12, 0.34, 0.04), [cushM, cushM2, cushM3][i], -10.2 + Math.cos(t) * 1.95, 0.56, -16.6 + Math.sin(t) * 1.95, { parent: DK, cast: false }); c.rotation.y = -t; }
  colR(-10.2 + Math.cos(a) * 1.95, -16.6 + Math.sin(a) * 1.95, 0.55, 1);
}
// cooler (mission): the lid swings open as the tell
const coolerLid = new T.Group(); coolerLid.position.set(-7.9, 0.46, -14.3); DK.add(coolerLid);
H.coolerBody = box(0.62, 0.44, 0.42, mat(0x2aa7c9, { roughness: 0.4 }), -7.9, 0.22, -14.1, dk);
box(0.66, 0.07, 0.46, mat(0xf4f1ea, { roughness: 0.4 }), 0, 0.035, 0.2, { parent: coolerLid });
box(0.1, 0.02, 0.06, mat(0x1b1b1f), 0, 0.075, 0.38, { parent: coolerLid, cast: false });
{ const ice = []; const ir = mulberry32(5); for (let i = 0; i < 18; i++) { const g = new T.DodecahedronGeometry(0.035 + ir() * 0.02, 0); g.translate(-7.9 + (ir() - 0.5) * 0.5, 0.42 + ir() * 0.05, -14.1 + (ir() - 0.5) * 0.3); ice.push([g, 0xe8f6ff]); } for (const dx of [-0.18, 0.02, 0.2]) { const g = new T.CylinderGeometry(0.03, 0.035, 0.26, 8); g.translate(-7.9 + dx, 0.5, -14.1); ice.push([g, pick([0x3e6b3a, 0x8a3a20, 0xd9a441], ir)]); } DK.add(new T.Mesh(mergeGeos(ice), vcol({ roughness: 0.2, metalness: 0.05, envMapIntensity: 1 }))); }
colR(-7.9, -14.1, 0.45, 1); blob(-7.9, -14.1, 1.0, 0.8, 0.4, DK);

// white baby grand piano with a candelabra
const piano = new T.Group(); piano.position.set(-9.5, 0, -11.9); DK.add(piano);
{
  const white = mat(0xf6f2ea, { roughness: 0.25, metalness: 0.05, envMapIntensity: 0.8 }), blk = mat(0x15151a, { roughness: 0.3 });
  add(rbox(1.5, 0.3, 1.0, 0.04), white, 0, 0.85, 0.3, { parent: piano });
  cyl(0.75, 0.75, 0.3, white, 0, 0.85, -0.2, { parent: piano }, 28);
  box(1.45, 0.05, 0.3, mat(0xf9f7f2), 0, 1.02, 0.78, { parent: piano, cast: false });
  box(1.3, 0.04, 0.22, mat(0xfafafa, { roughness: 0.3 }), 0, 1.04, 0.86, { parent: piano, cast: false });
  for (let i = 0; i < 18; i++) { if (i % 7 === 2 || i % 7 === 6) continue; box(0.035, 0.03, 0.12, blk, -0.6 + i * 0.07, 1.07, 0.8, { parent: piano, cast: false }); }
  const lid = H.pianoLid = add(rbox(1.42, 0.03, 1.5, 0.03), white, -0.02, 1.02, -0.1, { parent: piano }); lid.rotation.z = 0.55; lid.position.x = -0.45; lid.position.y = 1.35;
  cyl(0.015, 0.015, 0.7, blk, 0.35, 1.25, -0.3, { parent: piano, cast: false }, 5).rotation.z = -0.4;
  for (const [x, z] of [[-0.65, 0.65], [0.65, 0.65], [0, -0.75]]) cyl(0.05, 0.04, 0.72, white, x, 0.36, z, { parent: piano, cast: false }, 8);
  // candelabra
  H.pianoCandle = cyl(0.06, 0.08, 0.05, brass, 0.55, 1.02, 0.1, { parent: piano, cast: false }, 8); cyl(0.012, 0.012, 0.22, brass, 0.55, 1.14, 0.1, { parent: piano, cast: false }, 5);
  for (const dx of [-0.12, 0, 0.12]) { cyl(0.018, 0.018, 0.14, mat(0xfff1d8), 0.55 + dx, 1.3, 0.1, { parent: piano, cast: false }, 6); const f = add(new T.SphereGeometry(0.016, 6, 4), glow(0xffb040, 4), 0.55 + dx, 1.39, 0.1, { parent: piano, cast: false }); FLAMES.push(f); H.pianoFlames.push(f); }
  // bench
  box(0.9, 0.07, 0.38, white, 0, 0.47, 1.4, { parent: piano }); for (const [x, z] of [[-0.38, 1.25], [0.38, 1.25], [-0.38, 1.55], [0.38, 1.55]]) cyl(0.025, 0.02, 0.45, white, x, 0.22, z, { parent: piano, cast: false }, 6);
  pool(-9.5, -11.6, 2.2, 0xffd29a, 0.3, DH + 0.022); blob(0, 0.0, 2.6, 2.6, 0.4, piano);
  col(-10.4, -12.9, -8.6, -11.0, 1);
}

// bar cart on the right
{
  const g = new T.Group(); g.position.set(9.0, 0, -13.3); DK.add(g);
  for (const y of [0.35, 0.85]) box(1.5, 0.04, 0.7, mat(0xe8dfcf, { roughness: 0.2, transparent: true, opacity: 0.9 }), 0, y, 0, { parent: g, cast: false });
  for (const [x, z] of [[-0.72, -0.32], [0.72, -0.32], [-0.72, 0.32], [0.72, 0.32]]) cyl(0.015, 0.015, 0.88, brass, x, 0.44, z, { parent: g, cast: false }, 5);
  for (const x of [-0.6, 0.6]) { const w = add(new T.TorusGeometry(0.1, 0.02, 6, 16), brass, x, 0.1, 0.38, { parent: g, cast: false }); }
  const bt = [], br = mulberry32(27); for (let i = 0; i < 7; i++) { const x = -0.6 + i * 0.2, g1 = new T.CylinderGeometry(0.045, 0.05, 0.28, 8); g1.translate(x, 1.01, -0.18); const g2 = new T.CylinderGeometry(0.016, 0.03, 0.12, 6); g2.translate(x, 1.2, -0.18); bt.push([g1, pick([0x3e6b3a, 0x8a3a20, 0xd9a441, 0x2a4f70, 0xe8e2d0], br)], [g2, 0x2a2a2a]); }
  for (let i = 0; i < 5; i++) { const gl = new T.CylinderGeometry(0.035, 0.028, 0.09, 8); gl.translate(0.2 + (i % 3) * 0.14, 0.92 + Math.floor(i / 3) * 0.09, 0.2); bt.push([gl, 0xdfeeff]); }
  const bm = new T.Mesh(mergeGeos(bt), vcol({ roughness: 0.15, transparent: true, opacity: 0.92, envMapIntensity: 1.2 })); g.add(bm);
  H.cartBucket = cyl(0.13, 0.11, 0.22, chrome, -0.45, 0.98, 0.2, { parent: g }); H.cartChamp = cyl(0.035, 0.035, 0.3, mat(0x1f3b26, { roughness: 0.2 }), -0.45, 1.1, 0.2, { parent: g, cast: false }, 8);
  plight(9.0, DH + 1.6, -13.3, 0xffc27a, 0.9, 5);
  col(8.2, -13.7, 9.8, -12.9, 1); blob(0, 0, 2.2, 1.4, 0.4, g);
}
// high tables on the deck
DECK_TABLES.forEach(([x, z], i) => {
  cyl(0.4, 0.4, 0.04, marble, x, 1.06, z, dk, 24); cyl(0.035, 0.035, 1.04, brass, x, 0.53, z, { parent: DK, cast: false }, 8); cyl(0.24, 0.26, 0.03, brass, x, 0.015, z, { parent: DK, cast: false }, 18);
  cyl(0.045, 0.045, 0.08, new T.MeshStandardMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.45, roughness: 0.1 }), x, 1.12, z, { parent: DK, cast: false }, 10);
  const f = add(new T.SphereGeometry(0.016, 6, 4), glow(0xffb040, 3.5), x, 1.13, z, { parent: DK, cast: false }); FLAMES.push(f); H.dFlame[i] = f;
  pool(x, z, 1.3, 0xffa850, 0.2, DH + 0.022); blob(x, z, 0.9, 0.9, 0.35, DK); colR(x, z, 0.35, 1);
});

// telescope at the front edge (mission): swings toward the sniper's building as the tell
const telescope = new T.Group(); telescope.position.set(12.2, 1.25, -9.7); DK.add(telescope);
for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3; const l = cyl(0.02, 0.025, 1.3, walnut, Math.cos(a) * 0.3, -0.62, Math.sin(a) * 0.3, { parent: telescope, cast: false }, 6); l.rotation.z = Math.cos(a) * 0.24; l.rotation.x = -Math.sin(a) * 0.24; }
const teleHead = new T.Group(); telescope.add(teleHead);
cyl(0.075, 0.095, 0.95, brass, 0, 0, 0.1, { parent: teleHead }, 12).rotation.x = Math.PI / 2;
cyl(0.05, 0.05, 0.14, metal, 0, 0, -0.45, { parent: teleHead, cast: false }, 10).rotation.x = Math.PI / 2;
(H.teleLens = cyl(0.1, 0.1, 0.03, chrome, 0, 0, 0.6, { parent: teleHead, cast: false }, 12)).rotation.x = Math.PI / 2;
cyl(0.05, 0.05, 0.1, brass, 0, -0.1, 0, { parent: teleHead, cast: false }, 8);
const TELE_REST = [-0.9, 2.6], TELE_AIM = [-0.26, 0.0];
teleHead.rotation.order = 'YXZ'; teleHead.rotation.x = TELE_REST[0]; teleHead.rotation.y = TELE_REST[1];
colR(12.2, -9.7, 0.32, 1); blob(12.2, -9.7, 1.0, 1.0, 0.35, DK);

// garden on the right: planters, a lemon tree, the potting bench (mission)
{
  const bush = [], br = mulberry32(83);
  for (const z of [-14.0, -16.2]) { box(0.6, 0.55, 1.8, mat(0x3a3a3e, { roughness: 0.7 }), 14.2, 0.27, z, dk); for (let i = 0; i < 7; i++) { const s = folhaGeo(0.16 + br() * 0.1, i * 1.3 + 6, 0.85); s.translate(14.2 + (br() - 0.5) * 0.3, 0.62 + br() * 0.15, z - 0.75 + i * 0.25); bush.push([s, pick([0x3f7a3a, 0x5a9448, 0xc8322f, 0xe9c33b, 0xe7a3a9], br)]); } col(13.85, z - 0.95, 14.55, z + 0.95, 1); }
  const bm = new T.Mesh(mergeGeos(bush), vcol({ roughness: 0.75 })); bm.castShadow = true; DK.add(bm);
  // lemon tree
  const lt = new T.Group(); lt.position.set(13.4, 0, -19.0); DK.add(lt);
  add(new T.CylinderGeometry(0.5, 0.42, 0.6, 16), mat(0xc98e6a, { roughness: 0.7 }), 0, 0.3, 0, { parent: lt });
  const tree = [], tr = mulberry32(91); const tg = new T.CylinderGeometry(0.05, 0.08, 1.2, 7); tg.translate(0, 1.1, 0); tree.push([tg, 0x5a4632]);
  for (let i = 0; i < 24; i++) { const s = folhaGeo(0.2 + tr() * 0.15, i * 1.3 + 5, 0.85); const a = tr() * Math.PI * 2, d = tr() * 0.5; s.translate(Math.cos(a) * d, 1.7 + tr() * 0.7, Math.sin(a) * d); tree.push([s, pick([0x3f7a3a, 0x2f6a33, 0x4f8a42], tr)]); }
  for (let i = 0; i < 9; i++) { const s = new T.SphereGeometry(0.06, 7, 5); const a = tr() * Math.PI * 2, d = 0.3 + tr() * 0.35; s.translate(Math.cos(a) * d, 1.6 + tr() * 0.8, Math.sin(a) * d); tree.push([s, 0xf2d040]); }
  const tm = new T.Mesh(mergeGeos(tree), vcol({ roughness: 0.65 })); tm.castShadow = true; lt.add(tm); OCCLUDERS.push(tm);
  blob(0, 0, 1.6, 1.6, 0.45, lt); colR(13.4, -19.0, 0.55, 1);
  // potting bench
  box(1.2, 0.06, 0.8, walnut, 12.6, 0.8, -17.6, dk); for (const [x, z] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) box(0.06, 0.78, 0.06, walnut, 12.6 + x, 0.39, -17.6 + z, { parent: DK, cast: false });
  box(1.1, 0.04, 0.7, walnut, 12.6, 0.3, -17.6, { parent: DK, cast: false });
  for (const [x, z, c] of [[12.25, -17.8, 0xc98e6a], [12.5, -17.4, 0xe9e1d2], [12.95, -17.75, 0xc98e6a]]) { cyl(0.1, 0.08, 0.16, mat(c, { roughness: 0.7 }), x, 0.91, z, { parent: DK, cast: false }, 10); H.potSoil.push(cyl(0.09, 0.09, 0.02, mat(0x2b1d14), x, 0.99, z, { parent: DK, cast: false }, 10)); }
  // watering can
  H.canBody = cyl(0.1, 0.09, 0.2, mat(0x4a7a4a, { metalness: 0.4, roughness: 0.4 }), 13.0, 0.93, -17.35, { parent: DK, cast: false }, 10); (H.canSpout = cyl(0.015, 0.025, 0.26, mat(0x4a7a4a, { metalness: 0.4, roughness: 0.4 }), 13.12, 0.98, -17.35, { parent: DK, cast: false }, 6)).rotation.z = -0.9;
  // the seedling: swapped for a red bloom as the tell
  const seedling = []; for (let i = 0; i < 5; i++) { const lg = new T.ShapeGeometry(leafShape); lg.scale(0.35, 0.35, 1); lg.rotateX(-1.1); lg.rotateY(i * 1.26); lg.translate(12.5, 1.0, -17.4); seedling.push([lg, 0x4f8a42]); }
  var seedMesh = new T.Mesh(mergeGeos(seedling), vcol({ side: T.DoubleSide, roughness: 0.6 })); DK.add(seedMesh);
  const bloom = []; for (let i = 0; i < 7; i++) { const s = new T.SphereGeometry(0.04, 7, 5); const a = i * 0.9; s.translate(12.5 + Math.cos(a) * 0.06 * (i ? 1 : 0), 1.12 + (i ? 0 : 0.04), -17.4 + Math.sin(a) * 0.06 * (i ? 1 : 0)); bloom.push([s, i ? 0xc8322f : 0xe9c33b]); } const st2 = new T.CylinderGeometry(0.008, 0.01, 0.14, 5); st2.translate(12.5, 1.04, -17.4); bloom.push([st2, 0x3a6a2a]);
  var bloomMesh = new T.Mesh(mergeGeos(bloom), vcol({ roughness: 0.5 })); bloomMesh.visible = false; DK.add(bloomMesh);
  col(12.0, -18.0, 13.2, -17.2, 1); blob(12.6, -17.6, 1.6, 1.2, 0.4, DK);
  plight(12.6, DH + 1.6, -17.6, 0xffd29a, 0.7, 5); pool(12.6, -17.6, 1.4, 0xffd29a, 0.3, DH + 0.022);
}

// neon sign on the back parapet with one dead letter (the mission lights it up)
function neonTex(text, deadIdx, onlyDead) {
  return canvasTex(1024, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.font = '900 170px "Saira Condensed", Impact, "Arial Narrow", sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left';
    let x = 40; const widths = [...text].map(ch => g.measureText(ch).width + 18);
    const total = widths.reduce((a, b) => a + b, 0); x = (w - total) / 2;
    [...text].forEach((ch, i) => {
      const dead = i === deadIdx;
      if (onlyDead ? dead : !dead) {
        g.shadowColor = '#ff4fa3'; g.shadowBlur = 28; g.lineWidth = 10; g.strokeStyle = '#ff7fc0'; g.strokeText(ch, x, h / 2);
        g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#fff6fb'; g.strokeText(ch, x, h / 2);
      } else if (!onlyDead) { g.shadowBlur = 0; g.lineWidth = 9; g.strokeStyle = '#4a2a3a'; g.strokeText(ch, x, h / 2); }
      x += widths[i];
    });
  });
}
const NEON_TEXT = 'MIRANTE', NEON_DEAD = 4;
const neonMat = new T.MeshBasicMaterial({ map: neonTex(NEON_TEXT, NEON_DEAD, false), transparent: true, color: new T.Color(2.4, 2.4, 2.4), toneMapped: false, depthWrite: false, side: T.DoubleSide });
const neonDeadMat = new T.MeshBasicMaterial({ map: neonTex(NEON_TEXT, NEON_DEAD, true), transparent: true, color: new T.Color(2.4, 2.4, 2.4), toneMapped: false, depthWrite: false, side: T.DoubleSide });
const neon = new T.Mesh(new T.PlaneGeometry(7.2, 1.8), neonMat); neon.position.set(6.5, 2.5, -21.52); neon.renderOrder = 4; DK.add(neon);
const neonDead = new T.Mesh(new T.PlaneGeometry(7.2, 1.8), neonDeadMat); neonDead.position.set(6.5, 2.5, -21.51); neonDead.renderOrder = 4; neonDead.visible = false; DK.add(neonDead);
for (const x of [3.3, 9.7]) box(0.08, 2.5, 0.08, metal, x, 2.25, -21.7, { parent: DK, cast: false });
box(6.6, 0.06, 0.06, metal, 6.5, 3.4, -21.7, { parent: DK, cast: false }); box(6.6, 0.06, 0.06, metal, 6.5, 1.6, -21.7, { parent: DK, cast: false });
const neonLight = new T.PointLight(0xff5fae, 1.1, 9, 2); neonLight.position.set(6.5, 2.4, -20.6); DK.add(neonLight);
pool(6.5, -20.4, 3.4, 0xff5fae, 0.3, DH + 0.022);
// breaker box under the sign (the mission spot)
box(0.4, 0.5, 0.12, mat(0x8a8f99, { metalness: 0.5, roughness: 0.4 }), 6.5, 0.7, -21.54, { parent: DK, cast: false });
const breakerLamp = add(new T.SphereGeometry(0.035, 8, 6), glow(0xff3030, 3), 6.5, 0.88, -21.47, { parent: DK, cast: false });

// water tower in the back corner
{
  const g = new T.Group(); g.position.set(-13.0, 0, -19.9); DK.add(g);
  for (const [x, z] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) { const l = cyl(0.05, 0.06, 2.4, metal, x, 1.2, z, { parent: g }, 6); l.rotation.z = -x * 0.12; l.rotation.x = z * 0.12; }
  for (const y of [0.9, 1.9]) { box(1.5, 0.05, 0.05, metal, 0, y, -0.6, { parent: g, cast: false }); box(1.5, 0.05, 0.05, metal, 0, y, 0.6, { parent: g, cast: false }); box(0.05, 0.05, 1.5, metal, -0.6, y, 0, { parent: g, cast: false }); box(0.05, 0.05, 1.5, metal, 0.6, y, 0, { parent: g, cast: false }); }
  const tank = add(new T.CylinderGeometry(0.95, 1.0, 1.8, 18), new T.MeshStandardMaterial({ map: slatTex, roughness: 0.7 }), 0, 3.3, 0, { parent: g });
  for (const y of [2.6, 3.3, 4.0]) add(new T.TorusGeometry(0.99, 0.025, 5, 24), metal, 0, y, 0, { parent: g, cast: false }).rotation.x = Math.PI / 2;
  add(new T.ConeGeometry(1.08, 0.7, 18), mat(0x4a4e58, { roughness: 0.6 }), 0, 4.55, 0, { parent: g });
  cyl(0.02, 0.02, 1.6, metal, 1.02, 3.6, 0.3, { parent: g, cast: false }, 4); cyl(0.02, 0.02, 1.6, metal, 1.02, 3.6, 0.55, { parent: g, cast: false }, 4);
  const rl = H.wtLight = add(new T.SphereGeometry(0.08, 8, 6), glow(0xff3322, 4), 0, 5.0, 0, { parent: g, cast: false }); FLOATS.push(rl);
  colR(-13.0, -19.9, 1.0, 1); blob(0, 0, 2.6, 2.6, 0.45, g);
}

// deck plants, lanterns and a light or two
[[-14.0, -14.6, 'palm'], [-6.4, -21.0, 'olive'], [1.6, -21.0, 'small'], [13.6, -12.6, 'monstera'], [-14.1, -11.2, 'small'], [7.6, -19.2, 'small']].forEach(([x, z, k]) => plant(x, z, k, { lv: 1 }));
lantern(-14.4, -17.6, 1, 1); lantern(14.4, -10.6, 1, 1); lantern(-1.0, -9.55, 1, 1); lantern(1.0, -9.55, 1, 1); lantern(9.6, -20.9, 1, 1);
plight(0, DH + 2.4, -12.4, 0xffb48a, 1.2, 8); plight(-10.2, DH + 2.2, -12.0, 0xffc27a, 0.8, 6);

// ---------------------------------------------------------------- levels 2-5: the stepped tower behind the deck
// Each level sits on a block one storey higher and 13.5 m further back, so from the sniper's building the party reads as
// a staircase of terraces. Props that missions change are kept in named variables for the tells.
const FLOORS = [floor, deckFloor];
const BAR_ZONES = [];
const LG = {}; // level groups, lifted to LVY(k)
const KOI = [], STEAM = [], MAST_LIGHTS = [];
let wheelSpin = 0, rotorSpin = 0;
{
  const BACK = -76.5;
  // lower body of the deeper tower (facade planes) and the stepped cream blocks that carry each level
  const [mt, et] = facadeTex(14, 15, 22, true);
  const faceM = (rx, ry) => { const a = mt.clone(), b = et.clone(); [a, b].forEach(t => { t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); }); return new T.MeshStandardMaterial({ map: a, emissive: 0xffffff, emissiveMap: b, emissiveIntensity: 0.55, roughness: 0.85, envMapIntensity: 0.2 }); };
  const TH = 61, zc = (BACK - 22) / 2, dep = 22 + Math.abs(BACK);
  for (const sx of [-1, 1]) { const p = new T.Mesh(new T.PlaneGeometry(dep, TH), faceM(dep / 29.6, TH / 56)); p.rotation.y = sx < 0 ? -Math.PI / 2 : Math.PI / 2; p.position.set(sx * 14.8, DH - TH / 2, zc); scene.add(p); }
  { const p = new T.Mesh(new T.PlaneGeometry(29.6, TH), faceM(1, TH / 56)); p.rotation.y = Math.PI; p.position.set(0, DH - TH / 2, BACK); scene.add(p); }
  const winFrameM = mat(0x3a3430, { roughness: 0.5, metalness: 0.3 });
  const salaTex = (v) => canvasTex(128, 96, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, v ? '#f0c890' : '#e8b880'); gr.addColorStop(1, v ? '#a8683a' : '#8a5a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = v ? '#6a3a2a' : '#3a4a6a'; g.fillRect(14, 22, 30, 22); g.fillStyle = '#f6e6c8'; g.fillRect(17, 25, 24, 16);
    g.fillStyle = 'rgba(40,24,16,.55)'; g.fillRect(0, 70, w, 26); g.fillStyle = v ? '#5a2a2a' : '#2a3a4a'; g.fillRect(52, 58, 52, 20); g.fillRect(52, 50, 8, 28); g.fillRect(96, 50, 8, 28);
    g.fillStyle = '#2a1a10'; g.fillRect(v ? 100 : 22, 40, 3, 32); g.fillStyle = '#fff2c8'; g.beginPath(); g.moveTo(v ? 94 : 16, 44); g.lineTo(v ? 109 : 31, 44); g.lineTo(v ? 105 : 27, 34); g.lineTo(v ? 98 : 20, 34); g.fill();
    for (const [x0, x1] of [[0, 16], [w - 16, w]]) { g.fillStyle = v ? '#c8a070' : '#d8c0a0'; g.fillRect(x0, 0, x1 - x0, h); g.fillStyle = 'rgba(0,0,0,.15)'; for (let x = x0 + 3; x < x1; x += 5) g.fillRect(x, 0, 2, h); } });
  const winLitM = [0, 1].map(v => { const t = salaTex(v); return new T.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.6, roughness: 0.3 }); });
  const winDarkM = new T.MeshStandardMaterial({ map: canvasTex(64, 48, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1b2238'); gr.addColorStop(0.45, '#2a3458'); gr.addColorStop(0.5, '#3a4670'); gr.addColorStop(0.56, '#1b2238'); gr.addColorStop(1, '#141a2c'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }), roughness: 0.15, metalness: 0.3 });
  for (let k = 2; k < LV_N; k++) {
    const F = LEVELS[k].z1 + 0.6, d = F - BACK;
    const b = box(30.6, DH, d, cream, 0, LVY(k - 1) + DH / 2, F - d / 2, { occ: true, cast: false });
    box(31.0, 0.1, d + 0.2, creamDark, 0, LVY(k) - 0.06, F - d / 2, { cast: false });
    // a lit band of windows on the block's front wall, plus two wall lamps
    // janelas de verdade: moldura, caixilho em cruz, peitoril; a acesa mostra a sala (cortinas, abajur, quadro), a apagada reflete o céu
    for (let i = 0; i < 6; i++) { const x = -12 + i * 4.8, y = LVY(k - 1) + 2.4, dark = i % 3 === 1;
      box(2.36, 1.66, 0.04, creamDark, x, y, F + 0.02, { cast: false }); add(new T.PlaneGeometry(2.2, 1.5), dark ? winDarkM : winLitM[(i + k) % 2], x, y, F + 0.045, { cast: false }).receiveShadow = false;
      box(0.06, 1.5, 0.05, winFrameM, x, y, F + 0.06, { cast: false }); box(2.2, 0.05, 0.05, winFrameM, x, y + 0.25, F + 0.06, { cast: false });
      box(2.4, 0.08, 0.1, creamDark, x, LVY(k - 1) + 3.2, F + 0.03, { cast: false }); box(2.5, 0.06, 0.16, creamDark, x, y - 0.78, F + 0.06, { cast: false }); }
    for (const x of [-14.0, 14.0]) { box(0.14, 0.3, 0.1, brass, x, LVY(k - 1) + 3.1, F + 0.05, { cast: false }); box(0.1, 0.18, 0.06, glow(0xffd8a0, 2.5), x, LVY(k - 1) + 3.1, F + 0.1, { cast: false }); pool(x, F + 0.6, 1.2, 0xffb36a, 0.35, LVY(k - 1) + 0.022); }
    const G = new T.Group(); G.position.y = LVY(k); scene.add(G); LG[k] = G;
  }
  const front = k => LEVELS[k].z1 + 0.6;
  const railFront = (k, gapX) => { const F = front(k) - 0.2, y = LVY(k); glassRun(-15, F, gapX - 1.1, F, 1.05, true, y); glassRun(gapX + 1.1, F, 15, F, 1.05, true, y); };
  const railSides = (k) => { const F = front(k), y = LVY(k), B = front(k) - 13.5; glassRun(-14.85, B, -14.85, F, 1.05, true, y); glassRun(14.85, F, 14.85, B, 1.05, true, y); };
  const highTable = (x, z, k, n = 4) => { const G = LG[k]; cyl(0.42, 0.42, 0.04, marble, x, 1.08, z, { parent: G }, 16); cyl(0.03, 0.03, 1.06, brass, x, 0.53, z, { parent: G, cast: false }, 8); cyl(0.2, 0.22, 0.03, brass, x, 0.015, z, { parent: G, cast: false }, 12); const c = add(new T.CylinderGeometry(0.03, 0.03, 0.1, 6), mat(0xfff1d8), x, 1.15, z, { parent: G, cast: false }); const f = add(new T.SphereGeometry(0.02, 6, 4), glow(0xffb040, 5), x, 1.22, z, { parent: G, cast: false }); FLAMES.push(f); H.ht[x + ',' + z] = { c, f }; pool(x, z, 1.3, 0xffa850, 0.2, LVY(k) + 0.022); blob(x, z, 0.9, 0.9, 0.35, G); colR(x, z, 0.35, k); for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + 0.7; addSlot(x + Math.cos(a) * 0.85, z + Math.sin(a) * 0.85, x, z, 'talk', -1, k); } };
  const lvFloor = (k, tex, rough = 0.6) => { const f = new T.Mesh(new T.PlaneGeometry(29.6, 13.5), new T.MeshStandardMaterial({ map: tex, roughness: rough, envMapIntensity: 0.3 })); f.rotation.x = -Math.PI / 2; f.position.set(0, 0.012, front(k) - 6.75); f.receiveShadow = true; f.userData.lv = k; LG[k].add(f); FLOORS.push(f); return f; };
  const bulbs = (G, a, b, y = 2.85) => { const pts = [], bb = []; const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.8); for (let i = 0; i <= n; i++) { const t = i / n, sag = Math.sin(t * Math.PI) * 0.45; const p = [a[0] + (b[0] - a[0]) * t, y - sag, a[1] + (b[1] - a[1]) * t]; pts.push(new T.Vector3(...p)); if (i > 0 && i < n) { const g = new T.SphereGeometry(0.055, 8, 6); g.translate(p[0], p[1] - 0.08, p[2]); bb.push([g, 0xffe6b0]); } } G.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x111111 }))); G.add(new T.Mesh(mergeGeos(bb), new T.MeshBasicMaterial({ vertexColors: true, color: new T.Color(2.6, 2.0, 1.2), toneMapped: false }))); };
  const post = (G, x, z, k, h = 2.9) => { cyl(0.04, 0.05, h, metal, x, h / 2, z, { parent: G }, 8); cyl(0.14, 0.16, 0.05, metal, x, 0.025, z, { parent: G, cast: false }); colR(x, z, 0.08, k); };

  // ============================================================ level 2: zen garden, greenhouse, koi pond, yoga
  {
    const k = 2, G = LG[k], F = front(k), g = { parent: G };
    const zenTex = canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#d9d2c2'; g.fillRect(0, 0, w, h); const r = mulberry32(44); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${90 + r() * 60},${85 + r() * 50},${70 + r() * 40},${0.25 + r() * 0.4})`; g.beginPath(); g.ellipse(r() * w, r() * h, 1.5 + r() * 3, 1 + r() * 2, r() * 3, 0, 7); g.fill(); } g.strokeStyle = 'rgba(80,70,60,.35)'; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, h); g.stroke(); } for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(0, i * 128); g.lineTo(w, i * 128); g.stroke(); } grain(g, w, h, 10); }, [2, 1]);
    lvFloor(k, zenTex, 0.8);
    railFront(k, LINKS[1].cx); railSides(k);
    // greenhouse on the left: glass walls on three sides, open toward the garden, rows of planters inside
    {
      const x0 = -14.2, x1 = -6.6, z0 = -33.6, z1 = -25.4, h = 2.9, y = LVY(k);
      glassRun(x0, z1, x1, z1, h, false, y); glassRun(x0, z0, x1, z0, h, false, y); glassRun(x0, z0, x0, z1, h, false, y);
      col(x0 - 0.05, z1 - 0.05, x1, z1 + 0.05, k); col(x0 - 0.05, z0 - 0.05, x1, z0 + 0.05, k); col(x0 - 0.05, z0, x0 + 0.05, z1, k);
      for (const sx of [0, 1]) { const roof = new T.Mesh(new T.BoxGeometry((x1 - x0) / 2 + 0.3, 0.03, z1 - z0 + 0.4), glassMat); roof.position.set(x0 + (x1 - x0) * (sx ? 0.75 : 0.25), h + 0.45, (z0 + z1) / 2); roof.rotation.z = sx ? 0.26 : -0.26; roof.renderOrder = 3; G.add(roof); }
      box(x1 - x0 + 0.4, 0.06, 0.06, metal, (x0 + x1) / 2, h + 0.95, (z0 + z1) / 2, { parent: G, cast: false });
      const bush = [], br = mulberry32(67);
      for (const zz of [-32.4, -30.2, -28.0]) {
        box(6.4, 0.5, 0.8, mat(0x4a4a44, { roughness: 0.8 }), -10.4, 0.25, zz, g); col(-13.6, zz - 0.4, -7.2, zz + 0.4, k);
        box(6.2, 0.02, 0.66, mat(0x3a2a1e, { roughness: 1 }), -10.4, 0.505, zz, { parent: G, cast: false });
        // cada muda: tufo de folhas (sem facetas) e, nas floridas, um punhado de flores por cima; mesmo sorteio de antes
        for (let i = 0; i < 20; i++) { const r = 0.14 + br() * 0.14, px = -13.3 + i * 0.3 + (br() - 0.5) * 0.2, py = 0.6 + br() * 0.22, pz = zz + (br() - 0.5) * 0.4, c = pick([0x3f8a3a, 0x58a04a, 0x7fb04a, 0xcc5a6a, 0xe6b84a], br), flor = c === 0xcc5a6a || c === 0xe6b84a, ph = i * 1.7 + zz;
          const s = folhaGeo(r, ph); s.translate(px, Math.min(py, 0.5 + r * 0.75), pz); bush.push([s, flor ? 0x3f7a34 : c]);
          if (flor) for (let j = 0; j < 6; j++) { const a = j * 1.05 + ph, rr = r * (j ? 0.55 : 0); const fg = new T.SphereGeometry(0.045, 6, 4); fg.translate(px + Math.cos(a) * rr, Math.min(py, 0.5 + r * 0.75) + r * 0.62 - rr * 0.35, pz + Math.sin(a) * rr); bush.push([fg, c]); } }
      }
      G.add(H.ghBush = new T.Mesh(mergeGeos(bush), vcol({ roughness: 0.75 })));
      for (const x of [-12.5, -8.5]) { cyl(0.012, 0.012, 0.9, metal, x, h + 0.0, -29.5, { parent: G, cast: false }, 4); const sh = add(new T.ConeGeometry(0.28, 0.2, 10, 1, true), mat(0x23252a, { side: T.DoubleSide }), x, h - 0.45, -29.5, { parent: G, cast: false }); H.ghLamps.push(add(new T.SphereGeometry(0.06, 8, 6), glow(0xfff0c0, 3), x, h - 0.5, -29.5, { parent: G, cast: false })); H.ghLights.push(plight(x, LVY(k) + h - 0.6, -29.5, 0xffe8b0, 1.0, 6)); }
      // watering can on the gardener's bench and a hose reel by the door
      box(0.9, 0.9, 0.5, walnut, -7.0, 0.45, -33.0, g); H.ghCan = cyl(0.16, 0.16, 0.22, mat(0x8fa36a, { metalness: 0.5, roughness: 0.4 }), -7.0, 1.0, -33.0, { parent: G, cast: false }, 10);
      pool(-10.4, -29.5, 4.5, 0xcfe8a0, 0.22, LVY(k) + 0.022);
    }
    // bonsai on a stone pedestal (mission): its leaves turn red when the microfilm is hidden
    {
      const x = -1.0, z = -26.1;
      box(0.9, 0.7, 0.9, mat(0x6a6660, { roughness: 0.9 }), x, 0.35, z, g); H.bonsaiPot = cyl(0.42, 0.34, 0.26, mat(0x3a3a3e, { roughness: 0.6 }), x, 0.83, z, g, 12);
      const tr = H.bonsaiTrunk = cyl(0.06, 0.1, 0.7, mat(0x4a3220, { roughness: 0.9 }), x, 1.3, z, { parent: G, cast: false }, 7); tr.rotation.z = 0.35;
      const mk = (c) => { const leaves = [], lr = mulberry32(91); for (let i = 0; i < 14; i++) { const s = folhaGeo(0.11 + lr() * 0.1, i * 1.3 + 2, 0.85); s.translate(x - 0.15 + (lr() - 0.5) * 0.9, 1.55 + (lr() - 0.4) * 0.35, z + (lr() - 0.5) * 0.7); leaves.push([s, pick(c, lr)]); } const m = new T.Mesh(mergeGeos(leaves), vcol({ roughness: 0.7 })); m.castShadow = true; G.add(m); return m; };
      var bonsaiGreen = mk([0x3f8a3a, 0x2f6a33, 0x58a04a]), bonsaiRed = mk([0xc8322f, 0xe06a3a, 0xa8241f]); bonsaiRed.visible = false;
      colR(x, z, 0.5, k); blob(x, z, 1.4, 1.4, 0.4, G);
      for (const dx of [-0.42, 0.42]) { cyl(0.025, 0.025, 1.4, metal, x + dx, 0.7, z + 0.55, { parent: G, cast: false }, 5); add(new T.SphereGeometry(0.06, 8, 6), glow(0xfff0c0, 2.5), x + dx, 1.42, z + 0.55, { parent: G, cast: false }); }
    }
    // koi pond with stone rim, lily pads and four koi that slowly circle (mission: the capsule turns the water amber)
    {
      const x = 5.2, z = -31.0, r = 2.4;
      var pondMat = new T.MeshStandardMaterial({ color: 0x1f6f6a, transparent: true, opacity: 0.95, roughness: 0.08, metalness: 0.1, envMapIntensity: 1.1, emissive: 0x0b3a38, emissiveIntensity: 0.6, emissiveMap: causticTex });
      const w = new T.Mesh(new T.CircleGeometry(r, 36), pondMat); w.rotation.x = -Math.PI / 2; w.position.set(x, 0.05, z); w.renderOrder = 2; G.add(w);
      const rim = new T.Mesh(new T.TorusGeometry(r + 0.18, 0.2, 8, 36), mat(0x7a756c, { roughness: 0.95 })); rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.1, z); rim.castShadow = true; G.add(rim);
      const stones = [], sr = mulberry32(23); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; const s = new T.DodecahedronGeometry(0.12 + sr() * 0.1, 0); s.translate(x + Math.cos(a) * (r + 0.2), 0.22, z + Math.sin(a) * (r + 0.2)); stones.push([s, sr() < 0.5 ? 0x8a857a : 0x6a655c]); } G.add(new T.Mesh(mergeGeos(stones), vcol({ roughness: 0.95 })));
      for (let i = 0; i < 7; i++) { const a = i * 1.1 + 0.3, d = 0.6 + (i % 3) * 0.55; const p = add(new T.CircleGeometry(0.22 + (i % 2) * 0.08, 12, 0.3, Math.PI * 1.85), mat(0x3f8a3a, { roughness: 0.7, side: T.DoubleSide }), x + Math.cos(a) * d, 0.07, z + Math.sin(a) * d, { parent: G, cast: false }); p.rotation.x = -Math.PI / 2; p.renderOrder = 3; }
      for (let i = 0; i < 4; i++) { const f = new T.Group(); const bodyM = mat(i % 2 ? 0xff8a3a : 0xf6f1e8, { roughness: 0.5 }); const b = add(new T.SphereGeometry(0.11, 10, 8), bodyM, 0, 0, 0, { parent: f, cast: false }); b.scale.set(1, 0.6, 2.2); if (i % 2 === 0) add(new T.SphereGeometry(0.07, 8, 6), mat(0xff6a2a), 0, 0.04, 0.05, { parent: f, cast: false }).scale.set(1, 0.6, 1.3); const t = add(new T.ConeGeometry(0.08, 0.16, 6), bodyM, 0, 0, -0.3, { parent: f, cast: false }); t.rotation.x = -Math.PI / 2; f.position.set(x, 0.03, z); f.userData = { cx: x, cz: z, r: 0.5 + i * 0.4, ph: i * 1.6, sp: 0.35 + i * 0.07 }; G.add(f); KOI.push(f); }
      var pondLight = new T.PointLight(0x5fe0d0, 1.0, 7, 2); pondLight.position.set(x, 0.5, z); G.add(pondLight);
      var pondPool = pool(x, z, 3.2, 0x40d0c0, 0.25, LVY(k) + 0.05);
      colR(x, z, 2.7, k);
      // stone lanterns on either side of the pond
      for (const [lx, lz] of [[x - 3.3, z - 1.2], [x + 3.3, z + 0.6]]) { box(0.5, 0.12, 0.5, mat(0x7a756c, { roughness: 0.95 }), lx, 0.06, lz, g); cyl(0.12, 0.14, 0.8, mat(0x8a857a, { roughness: 0.95 }), lx, 0.52, lz, g, 8); box(0.44, 0.34, 0.44, mat(0x8a857a, { roughness: 0.95 }), lx, 1.08, lz, g); H.stoneLamp.push(box(0.3, 0.26, 0.3, glow(0xffd8a0, 1.6), lx, 1.08, lz, { parent: G, cast: false })); const cap = add(new T.ConeGeometry(0.42, 0.28, 4), mat(0x6a655c, { roughness: 0.95 }), lx, 1.4, lz, g); cap.rotation.y = Math.PI / 4; pool(lx, lz, 1.4, 0xffb36a, 0.35, LVY(k) + 0.022); colR(lx, lz, 0.3, k); }
    }
    // raked sand garden with three rocks (looks only)
    {
      const x = 0.5, z = -33.2;
      const sand = canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#e6dcc4'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(120,105,80,.45)'; g.lineWidth = 2; for (let i = 0; i < 24; i++) { g.beginPath(); g.moveTo(0, i * 11); g.lineTo(w, i * 11); g.stroke(); } for (const [cx, cy] of [[150, 120], [360, 90], [400, 190]]) for (let rr = 18; rr < 90; rr += 12) { g.beginPath(); g.arc(cx, cy, rr, 0, 7); g.stroke(); } grain(g, w, h, 8); });
      const s = new T.Mesh(new T.PlaneGeometry(7.5, 3.6), new T.MeshStandardMaterial({ map: sand, roughness: 1 })); s.rotation.x = -Math.PI / 2; s.position.set(x, 0.03, z); s.receiveShadow = true; G.add(s);
      box(7.7, 0.1, 0.1, walnut, x, 0.05, z - 1.85, g); box(7.7, 0.1, 0.1, walnut, x, 0.05, z + 1.85, g); box(0.1, 0.1, 3.8, walnut, x - 3.85, 0.05, z, g); box(0.1, 0.1, 3.8, walnut, x + 3.85, 0.05, z, g);
      for (const [rx, rz, rs] of [[x - 1.8, z - 0.3, 0.45], [x + 1.3, z + 0.5, 0.35], [x + 1.9, z - 0.9, 0.28]]) { const rk = add(new T.DodecahedronGeometry(rs, 1), mat(0x6a6660, { roughness: 0.95 }), rx, rs * 0.6, rz, g); rk.scale.y = 0.65; H.zenRocks.push(rk); }
      col(x - 3.9, z - 1.9, x + 3.9, z + 1.9, k);
    }
    // yoga deck on the right: six mats in two rows facing the pond
    {
      const mats = [0x5a8ad8, 0xd86a8a, 0x7fb06a, 0xe6b84a, 0x9a6ad8, 0x6ac8c8];
      for (let i = 0; i < 6; i++) { const x = 9.2 + (i % 3) * 1.8, z = -24.6 - Math.floor(i / 3) * 2.2; const m = add(rbox(0.7, 0.04, 1.9, 0.02), mat(mats[i], { roughness: 0.9 }), x, 0.02, z, { parent: G, cast: false }); m.rotation.y = -0.4; H.yogaMats.push(m); addSlot(x, z, x - 3, z - 4, 'yoga', -1, k); }
      box(6.6, 0.06, 5.2, mat(0xb08a5a, { roughness: 0.7 }), 11.0, 0.0, -25.7, { parent: G, cast: false });
      pool(11.0, -25.7, 3.5, 0xffd0a0, 0.18, LVY(k) + 0.022);
    }
    // tea counter at the front left, looking over the city, with a kettle and cups
    {
      const x = -10.4, z = -23.5;
      box(4.2, 1.0, 0.8, walnut, x, 0.5, z, g); box(4.4, 0.06, 0.9, marble, x, 1.03, z, g); col(x - 2.2, z - 0.5, x + 2.2, z + 0.5, k);
      H.kettle = cyl(0.16, 0.14, 0.26, mat(0x3a3a3e, { metalness: 0.6, roughness: 0.3 }), x - 1.2, 1.2, z, { parent: G, cast: false }, 10);
      for (let i = 0; i < 6; i++) H.teaCups.push(cyl(0.06, 0.05, 0.08, mat(i % 2 ? 0xf6f1e8 : 0x9ec8c0), x - 0.3 + (i % 3) * 0.3, 1.1, z + (i < 3 ? -0.2 : 0.2), { parent: G, cast: false }, 8));
      H.teaStrip = box(4.2, 0.05, 0.05, glow(0xffd29a, 1.6), x, 0.97, z - 0.44, { parent: G, cast: false }); pool(x, z - 1, 2.2, 0xffc27a, 0.3, LVY(k) + 0.022);
      for (const sx of [-1.4, -0.4, 0.6, 1.6]) addSlot(x + sx, z - 1.15, x + sx, z, 'bar', -1, k);
      BAR_ZONES.push({ lv: k, x, z: z - 1.3, r: 2.2, rot: 0, label: 'Pedir um chá' });
      // paper lanterns strung across the back of the garden
      post(G, 14.2, -34.6, k); post(G, -5.8, -34.6, k);
      const lan = []; for (let i = 1; i < 10; i++) { const t = i / 10, s = new T.SphereGeometry(0.17, 10, 8); s.scale(1, 1.25, 1); s.translate(14.2 + (-5.8 - 14.2) * t, 2.55 - Math.sin(t * Math.PI) * 0.35, -34.6); lan.push([s, i % 2 ? 0xffb060 : 0xff6a6a]); }
      G.add(new T.Mesh(mergeGeos(lan), new T.MeshBasicMaterial({ vertexColors: true, color: new T.Color(1.8, 1.8, 1.8), toneMapped: false })));
      G.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(14.2, 2.85, -34.6), new T.Vector3(4.2, 2.5, -34.6), new T.Vector3(-5.8, 2.85, -34.6)]), new T.LineBasicMaterial({ color: 0x111111 })));
    }
    highTable(-3.6, -28.6, k); highTable(1.6, -28.4, k, 3);
    for (const x of [-6.6, -3.0, 4.0, 13.4]) addSlot(x, F - 0.75, x, F + 3, 'view', -1, k);
    plant(-5.0, -24.6, 'big', { lv: k }); plant(6.0, -23.4, 'big', { lv: k }); plant(-14.0, -25.0, 'small', { lv: k }); plant(7.6, -34.5, 'big', { lv: k });
    lantern(-4.0, F - 0.5, 1, k); lantern(8.0, F - 0.5, 1, k); lantern(14.3, -30.0, 1, k);
    plight(0, LVY(k) + 2.2, -30, 0xffd0a0, 1.2, 10);
  }

  // ============================================================ level 3: open-air casino
  {
    const k = 3, G = LG[k], F = front(k), g = { parent: G };
    const carpet = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#5a1c28'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(217,164,65,.55)'; g.lineWidth = 3; for (let i = -8; i < 16; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64 + 512, 512); g.stroke(); g.beginPath(); g.moveTo(i * 64, 512); g.lineTo(i * 64 + 512, 0); g.stroke(); } g.fillStyle = 'rgba(217,164,65,.5)'; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.beginPath(); g.arc(x * 64 + 32, y * 64 + 32, 5, 0, 7); g.fill(); } grain(g, w, h, 12); }, [5, 2.3]);
    lvFloor(k, carpet, 0.95);
    railFront(k, LINKS[2].cx); railSides(k);
    const felt = mat(0x1f6a3a, { roughness: 0.95 }), mahog = mat(0x4a2318, { roughness: 0.5 }), gold = mat(0xd9a441, { metalness: 0.8, roughness: 0.3 });
    // roulette table in the middle (mission: rigging it makes the wheel spin on its own)
    {
      const x = 0, z = -41.6;
      box(3.4, 0.12, 1.7, mahog, x, 0.86, z, g); box(3.0, 0.03, 1.3, felt, x, 0.93, z, { parent: G, cast: false });
      for (const [a, b] of [[-1.5, -0.7], [1.5, -0.7], [-1.5, 0.7], [1.5, 0.7]]) box(0.12, 0.8, 0.12, mahog, x + a, 0.4, z + b, { parent: G, cast: false });
      const grid = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#1f6a3a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) { g.fillStyle = (i + j) % 2 ? '#b8252a' : '#15151a'; g.fillRect(40 + i * 17, 20 + j * 28, 15, 26); } g.strokeStyle = '#f0e0a0'; g.lineWidth = 2; g.strokeRect(38, 18, 206, 86); });
      const lay = new T.Mesh(new T.PlaneGeometry(1.7, 0.9), new T.MeshStandardMaterial({ map: grid, roughness: 0.9 })); lay.rotation.x = -Math.PI / 2; lay.position.set(x + 0.55, 0.955, z); G.add(lay);
      var wheel = new T.Group(); wheel.position.set(x - 1.0, 0.95, z); G.add(wheel);
      cyl(0.62, 0.66, 0.12, mahog, 0, 0, 0, { parent: wheel }, 28);
      const segs = []; for (let i = 0; i < 18; i++) { const sg = new T.CylinderGeometry(0.5, 0.5, 0.05, 1, 1, false, i * Math.PI * 2 / 18, Math.PI * 2 / 18); sg.translate(0, 0.07, 0); segs.push([sg, i % 2 ? 0xb8252a : 0x15151a]); } wheel.add(new T.Mesh(mergeGeos(segs), vcol({ roughness: 0.4 })));
      cyl(0.12, 0.14, 0.14, gold, 0, 0.12, 0, { parent: wheel, cast: false }, 10); for (let i = 0; i < 4; i++) { const h = box(0.3, 0.025, 0.025, gold, 0, 0.18, 0, { parent: wheel, cast: false }); h.rotation.y = i * Math.PI / 4; }
      H.rBall = add(new T.SphereGeometry(0.03, 8, 6), mat(0xf6f1e8), 0.42, 0.1, 0, { parent: wheel, cast: false });
      col(x - 1.8, z - 0.95, x + 1.8, z + 0.95, k); blob(x, z, 4.0, 2.4, 0.4, G);
      for (let i = 0; i < 9; i++) H.rChips.push(cyl(0.055, 0.055, 0.03 * (1 + i % 3), mat([0xd9a441, 0xb8252a, 0x2e5fa8][i % 3], { roughness: 0.4 }), x + 0.2 + (i % 4) * 0.3, 0.96, z - 0.45 + Math.floor(i / 4) * 0.3, { parent: G, cast: false }, 12));
      for (const [sx, sz] of [[-1.3, 1.5], [0, 1.5], [1.3, 1.5], [2.5, 0.4], [2.5, -0.6]]) addSlot(x + sx, z + sz, x, z, 'talk', -1, k);
      plight(x, LVY(k) + 2.6, z, 0xffd090, 1.6, 8); pool(x, z, 3.0, 0xffc27a, 0.25, LVY(k) + 0.022);
      // low chandelier over the table
      cyl(0.015, 0.015, 1.4, metal, x, 2.9, z, { parent: G, cast: false }, 4); const ch = add(new T.TorusGeometry(0.55, 0.03, 6, 20), gold, x, 2.2, z, { parent: G, cast: false }); ch.rotation.x = Math.PI / 2; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const f = add(new T.SphereGeometry(0.035, 6, 4), glow(0xffd8a0, 4), x + Math.cos(a) * 0.55, 2.3, z + Math.sin(a) * 0.55, { parent: G, cast: false }); FLAMES.push(f); H.chand.push(f); }
    }
    // two poker tables with four chairs each
    for (const [x, z] of [[-8.4, -40.4], [8.4, -40.8]]) {
      cyl(1.0, 1.0, 0.1, mahog, x, 0.8, z, g, 24); cyl(0.9, 0.9, 0.03, felt, x, 0.865, z, { parent: G, cast: false }, 24); cyl(0.12, 0.2, 0.75, mahog, x, 0.38, z, { parent: G, cast: false }, 8); cyl(0.5, 0.55, 0.05, mahog, x, 0.025, z, { parent: G, cast: false }, 12);
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; const cx = x + Math.cos(a) * 1.45, cz = z + Math.sin(a) * 1.45; const ch = new T.Group(); ch.position.set(cx, 0, cz); ch.rotation.y = Math.atan2(x - cx, z - cz); G.add(ch); H.pokerChairs.push(ch); add(rbox(0.5, 0.08, 0.5, 0.03), mat(0x8a1f2a, { roughness: 0.7 }), 0, 0.46, 0, { parent: ch }); add(rbox(0.5, 0.55, 0.08, 0.03), mat(0x8a1f2a, { roughness: 0.7 }), 0, 0.75, -0.22, { parent: ch }); for (const [a2, b2] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) cyl(0.02, 0.02, 0.44, gold, a2, 0.22, b2, { parent: ch, cast: false }, 6); addSlot(cx + Math.sin(ch.rotation.y) * 0.12, cz + Math.cos(ch.rotation.y) * 0.12, x, z, 'cards', -1, k); }
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; const c = add(new T.BoxGeometry(0.18, 0.005, 0.26), mat(0xf6f1e8), x + Math.cos(a) * 0.55, 0.885, z + Math.sin(a) * 0.55, { parent: G, cast: false }); c.rotation.y = -a; H.pokerCards.push(c); for (let j = 0; j < 3; j++) cyl(0.05, 0.05, 0.04, mat([0xd9a441, 0xb8252a, 0x15151a][j], { roughness: 0.4 }), x + Math.cos(a) * 0.3 + j * 0.11 - 0.1, 0.9, z + Math.sin(a) * 0.3, { parent: G, cast: false }, 10); }
      colR(x, z, 1.05, k); blob(x, z, 3.4, 3.4, 0.35, G); pool(x, z, 2.4, 0xffc27a, 0.22, LVY(k) + 0.022);
    }
    // slot machines along the back wall, each with a glowing reel window and a lever
    for (let i = 0; i < 5; i++) {
      const x = -7.2 + i * 1.3, z = F - 12.9;
      box(0.8, 1.9, 0.6, mat([0xb8252a, 0x2e5fa8, 0xd9a441, 0x1f6a3a, 0x6b3f8c][i], { roughness: 0.3, metalness: 0.3 }), x, 0.95, z, g);
      H.slotWin.push(box(0.6, 0.4, 0.04, glow(i % 2 ? 0xffe08a : 0xa0f0ff, 2.2), x, 1.35, z + 0.31, { parent: G, cast: false })); box(0.6, 0.25, 0.04, mat(0x15151a), x, 0.85, z + 0.31, { parent: G, cast: false });
      for (let j = 0; j < 3; j++) H.slotReel.push(box(0.14, 0.3, 0.02, mat([0xffffff, 0xff6a6a, 0x6adaff][(i + j) % 3], { emissive: 0x333333 }), x - 0.19 + j * 0.19, 1.35, z + 0.33, { parent: G, cast: false }));
      const lv = cyl(0.02, 0.02, 0.5, chrome, x + 0.48, 1.35, z, { parent: G, cast: false }, 6); H.slotLever.push(lv); add(new T.SphereGeometry(0.06, 8, 6), mat(0xb8252a, { roughness: 0.3 }), x + 0.48, 1.62, z, { parent: G, cast: false });
      box(0.9, 0.08, 0.7, mat(0x15151a), x, 0.04, z, { parent: G, cast: false });
      addSlot(x, z + 0.95, x, z, 'slot', -1, k);
    }
    col(-7.7, F - 13.3, -1.5, F - 12.5, k);
    // cashier booth against the right wall (mission: the swapped chips turn its lamp red)
    {
      const x = 13.3, z = -40.5; const cg = new T.Group(); cg.position.set(x, 0, z); cg.rotation.y = -Math.PI / 2; G.add(cg); const cgo = { parent: cg };
      box(2.6, 1.05, 0.7, mahog, 0, 0.52, 0, cgo); box(2.8, 0.06, 0.8, marble, 0, 1.08, 0, cgo);
      for (let i = 0; i < 9; i++) cyl(0.015, 0.015, 1.2, gold, -1.2 + i * 0.3, 1.7, 0, { parent: cg, cast: false }, 5); box(2.7, 0.06, 0.06, gold, 0, 2.3, 0, { parent: cg, cast: false });
      const sign = canvasTex(256, 64, (g) => { g.fillStyle = '#15151a'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#ffd98a'; g.font = 'bold 34px Georgia'; g.textAlign = 'center'; g.fillText('CAIXA', 128, 45); });
      const sm = H.cashSign = new T.Mesh(new T.PlaneGeometry(1.6, 0.4), new T.MeshBasicMaterial({ map: sign, toneMapped: false })); sm.position.set(0, 2.6, 0.05); cg.add(sm);
      var cashLamp = add(new T.SphereGeometry(0.09, 10, 8), glow(0x40ff80, 3), 1.0, 2.6, 0.1, { parent: cg, cast: false });
      for (let i = 0; i < 6; i++) H.cashChips.push(cyl(0.06, 0.06, 0.02 + (i % 3) * 0.03, mat([0xd9a441, 0xb8252a, 0x2e5fa8][i % 3], { roughness: 0.4 }), -0.8 + i * 0.3, 1.12, -0.1, { parent: cg, cast: false }, 12));
      col(x - 0.4, z - 1.4, x + 0.6, z + 1.4, k); pool(x - 1, z, 2.0, 0xffc27a, 0.3, LVY(k) + 0.022);
    }
    // whisky bar along the left side
    {
      const x = -13.4, z0 = -43.2, z1 = -38.4, zc = (z0 + z1) / 2;
      box(0.8, 1.05, z1 - z0, walnut, x, 0.52, zc, g); box(0.9, 0.06, z1 - z0 + 0.2, marble, x, 1.08, zc, g); col(x - 0.5, z0, x + 0.5, z1, k);
      box(0.3, 2.2, z1 - z0, walnut, -14.6, 1.1, zc, g); for (let i = 0; i < 12; i++) cyl(0.04, 0.045, 0.3 + (i % 3) * 0.06, mat([0xd98a3a, 0x7a2a1a, 0xf2c14e][i % 3], { emissive: 0x332000, roughness: 0.2 }), -14.4, 1.4 + Math.floor(i / 6) * 0.5, z0 + 0.4 + (i % 6) * 0.75, { parent: G, cast: false }, 8);
      H.wStrip1 = box(0.02, 0.04, z1 - z0, glow(0xffc27a, 2.0), -14.42, 1.25, zc, { parent: G, cast: false }); H.wStrip2 = box(0.02, 0.04, z1 - z0, glow(0xffc27a, 2.0), -14.42, 1.75, zc, { parent: G, cast: false });
      for (const z of [-42.4, -41.4, -40.4, -39.4]) addSlot(x + 1.1, z, x, z, 'bar', -1, k);
      BAR_ZONES.push({ lv: k, x: x + 1.2, z: zc, r: 2.6, rot: -Math.PI / 2, label: 'Pedir um uísque' });
      plight(x + 0.5, LVY(k) + 1.8, zc, 0xffad5c, 1.6, 7);
    }
    // stage for the saxophonist: a round rug and a spotlight
    {
      const x = 12.2, z = -46.6;
      const rug = new T.Mesh(new T.CircleGeometry(1.5, 32), new T.MeshStandardMaterial({ map: rugTex, color: 0xb8252a, roughness: 1 })); rug.rotation.x = -Math.PI / 2; rug.position.set(x, 0.011, z); G.add(rug);
      cyl(0.03, 0.03, 1.5, metal, x + 0.5, 0.75, z + 0.4, { parent: G, cast: false }, 6); add(new T.SphereGeometry(0.06, 8, 6), mat(0x15151a), x + 0.5, 1.5, z + 0.4, { parent: G, cast: false });
      cyl(0.04, 0.05, 3.2, metal, x + 1.9, 1.6, z - 0.9, { parent: G }, 8); const sp = add(new T.ConeGeometry(0.16, 0.3, 10), metal, x + 1.5, 3.1, z - 0.6, { parent: G, cast: false }); sp.rotation.z = 0.9; sp.rotation.x = 0.4; (H.spotGlow = add(new T.CircleGeometry(0.1, 10), glow(0xfff0c0, 5), x + 1.42, 3.0, z - 0.52, { parent: G, cast: false })).lookAt(new T.Vector3(x, 0, z));
      H.stageLight = plight(x, LVY(k) + 2.4, z, 0xffe0b0, 1.6, 6); pool(x, z, 2.2, 0xffd0a0, 0.35, LVY(k) + 0.022);
      colR(x + 1.9, z - 0.9, 0.1, k);
      for (const [sx, sz] of [[-2.2, 1.2], [-1.0, 2.4], [-2.6, -0.4]]) addSlot(x + sx, z + sz, x, z, 'view', -1, k);
    }
    highTable(-3.6, -37.9, k, 3); highTable(4.4, -37.6, k);
    for (const x of [-9.0, 1.0, 9.2]) addSlot(x, F - 0.75, x, F + 3, 'view', -1, k);
    plant(-14.0, F - 0.9, 'big', { lv: k }); plant(14.0, F - 0.9, 'big', { lv: k }); plant(3.5, F - 12.9, 'big', { lv: k });
    lantern(-6.5, F - 0.5, 1, k); lantern(6.5, F - 0.5, 1, k); lantern(14.3, -44.8, 1, k);
    for (const [a, b] of [[[-14.5, F - 0.3], [14.5, F - 0.3]], [[-14.5, F - 7], [14.5, F - 7]]]) bulbs(G, a, b, 3.1);
    plight(0, LVY(k) + 2.5, -46, 0xff6a6a, 1.0, 9);
  }

  // ============================================================ level 4: helipad, sculpture gallery, giant chess
  {
    const k = 4, G = LG[k], F = front(k), g = { parent: G };
    const concrete = canvasTex(1024, 467, (g, w, h) => { g.fillStyle = '#5e6066'; g.fillRect(0, 0, w, h); const r = mulberry32(55); for (let i = 0; i < 4000; i++) { const v = 40 + r() * 60; g.fillStyle = `rgba(${v},${v},${v + 4},${0.2 + r() * 0.3})`; g.fillRect(r() * w, r() * h, 2 + r() * 4, 2 + r() * 4); } g.strokeStyle = 'rgba(30,30,34,.5)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(i * 170, 0); g.lineTo(i * 170, h); g.stroke(); } const cx = (8 + 14.8) / 29.6 * w, cy = (6.75 - 0.4) / 13.5 * h, R = 4.6 / 29.6 * w; g.strokeStyle = '#f3e49a'; g.lineWidth = 10; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, R * 0.72, 0, 7); g.stroke(); g.fillStyle = '#f3e49a'; g.font = `bold ${Math.round(R * 1.1)}px Arial`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', cx, cy + 4); grain(g, w, h, 10); });
    lvFloor(k, concrete, 0.9);
    railFront(k, LINKS[3].cx); railSides(k);
    // helicopter parked on the pad, nose toward the city (mission: the tracker makes the rotor spin up and the tail light blink)
    {
      const x = 8.0, z = -56.3; var heli = new T.Group(); heli.position.set(x, 0, z); G.add(heli);
      const body = mat(0x1e2b5a, { roughness: 0.25, metalness: 0.35, envMapIntensity: 0.9 }), dark = mat(0x15151a, { roughness: 0.4 });
      const fus = add(rbox(1.2, 1.15, 3.2, 0.3), body, 0, 1.0, 0.3, { parent: heli });
      const cab = add(new T.SphereGeometry(0.62, 14, 10), new T.MeshStandardMaterial({ color: 0x9ad0ff, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0.2, envMapIntensity: 1.2 }), 0, 1.05, 1.75, { parent: heli, cast: false }); cab.scale.set(0.95, 0.85, 1.1);
      const boom = cyl(0.12, 0.26, 2.6, body, 0, 1.15, -2.6, { parent: heli }, 10); boom.rotation.x = Math.PI / 2;
      const fin = box(0.08, 0.9, 0.5, body, 0, 1.75, -3.8, { parent: heli }); fin.rotation.x = 0.3;
      box(0.06, 0.1, 0.1, dark, 0.14, 1.9, -3.9, { parent: heli, cast: false });
      var tailRotor = new T.Group(); tailRotor.position.set(0.2, 1.9, -3.9); heli.add(tailRotor); for (let i = 0; i < 2; i++) { const b = box(0.02, 0.9, 0.08, dark, 0, 0, 0, { parent: tailRotor, cast: false }); b.rotation.x = i * Math.PI / 2; }
      for (const sx of [-0.55, 0.55]) { const sk = cyl(0.035, 0.035, 2.8, metal, sx, 0.08, 0.3, { parent: heli, cast: false }, 6); sk.rotation.x = Math.PI / 2; for (const dz of [-0.8, 0.9]) { const st = cyl(0.03, 0.03, 0.45, metal, sx, 0.33, dz, { parent: heli, cast: false }, 6); st.rotation.z = sx * 0.5; } }
      cyl(0.14, 0.18, 0.3, dark, 0, 1.7, 0.2, { parent: heli, cast: false }, 8);
      var rotor = new T.Group(); rotor.position.set(0, 1.9, 0.2); heli.add(rotor); cyl(0.08, 0.08, 0.12, metal, 0, 0, 0, { parent: rotor, cast: false }, 8);
      for (let i = 0; i < 4; i++) { const b = box(0.14, 0.03, 3.6, dark, 0, 0, 0, { parent: rotor }); b.rotation.y = i * Math.PI / 4; b.position.set(0, 0, 0); b.geometry.translate(0, 0, 1.8); }
      var heliLight = add(new T.SphereGeometry(0.06, 8, 6), glow(0xff3030, 4), 0, 2.25, -3.8, { parent: heli, cast: false });
      add(new T.SphereGeometry(0.05, 8, 6), glow(0x40ff80, 3), 0.6, 0.95, 1.4, { parent: heli, cast: false }); add(new T.SphereGeometry(0.05, 8, 6), glow(0xff3030, 3), -0.6, 0.95, 1.4, { parent: heli, cast: false });
      const door = H.heliDoor = box(0.02, 0.7, 0.9, mat(0x9ad0ff, { transparent: true, opacity: 0.5, roughness: 0.05 }), 0.61, 1.1, 0.5, { parent: heli, cast: false });
      col(x - 0.9, z - 4.2, x + 0.9, z + 2.4, k); blob(0, 0, 3.0, 7.0, 0.45, heli).position.y = 0.014;
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const l = add(new T.SphereGeometry(0.06, 8, 6), glow(i % 2 ? 0x40ff80 : 0xffffff, 3), x + Math.cos(a) * 4.6, 0.08, z + 0.4 + Math.sin(a) * 4.6, { parent: G, cast: false }); FLAMES.push(l); }
      // windsock at the corner
      cyl(0.03, 0.04, 2.6, metal, 13.9, 1.3, F - 12.9, { parent: G, cast: false }, 6); const ws = H.windsock = add(new T.ConeGeometry(0.22, 1.1, 8, 1, true), mat(0xff7a2a, { side: T.DoubleSide, roughness: 0.9 }), 13.4, 2.55, F - 12.9, { parent: G, cast: false }); ws.rotation.z = Math.PI / 2 + 0.3;
      // jerry cans and a tool chest by the pad
      const galaoG = mergeGeos([[new T.BoxGeometry(0.35, 0.5, 0.2), 0], [new T.BoxGeometry(0.24, 0.05, 0.05).translate(-0.02, 0.3, 0), 0], [new T.BoxGeometry(0.03, 0.07, 0.05).translate(-0.1, 0.27, 0), 0], [new T.BoxGeometry(0.03, 0.07, 0.05).translate(0.06, 0.27, 0), 0], [new T.CylinderGeometry(0.03, 0.035, 0.08, 8).translate(0.13, 0.28, 0), 0], [new T.BoxGeometry(0.26, 0.36, 0.01).translate(0, -0.03, 0.1), 0]]);
      for (const dx of [0, 0.45]) H.jerry.push(add(galaoG, mat(0xb8252a, { roughness: 0.6 }), -6.9 + dx, 0.25, -61.5, g)); // caixa de ferramentas numa peça só (gavetas, puxadores e alça somem junto quando ela é levada)
      { const cx = [[new T.BoxGeometry(1.0, 0.5, 0.5), 0x2e5fa8], [new T.BoxGeometry(0.5, 0.03, 0.03).translate(0, 0.33, 0), 0xc8ccd2]]; for (const sx of [-1, 1]) cx.push([new T.BoxGeometry(0.03, 0.08, 0.03).translate(sx * 0.24, 0.29, 0), 0xc8ccd2]);
        for (let r = 0; r < 3; r++) cx.push([new T.BoxGeometry(0.94, 0.012, 0.01).translate(0, -0.13 + r * 0.13, 0.255), 0x1b1b1f], [new T.BoxGeometry(0.18, 0.025, 0.03).translate(0, -0.08 + r * 0.13, 0.265), 0xc8ccd2]);
        H.toolChest = add(mergeGeos(cx), mat(0xffffff, { vertexColors: true, roughness: 0.5, metalness: 0.3 }), -8.1, 0.25, -61.5, g); } col(-8.7, -61.9, -6.2, -61.1, k);
    }
    // sculpture gallery on the left: four plinths, the second one is the mission (it turns black and twists)
    {
      const plinth = (x, z, geo, m, h = 1.1, s = 0.5) => { box(0.8, h, 0.8, mat(0xf1ece2, { roughness: 0.5 }), x, h / 2, z, g); const o = add(geo, m, x, h + s, z, { parent: G }); colR(x, z, 0.5, k); const d = add(new T.CircleGeometry(0.12, 10), glow(0xfff0c0, 3), x, 3.2, z + 0.3, { parent: G, cast: false }); d.rotation.x = Math.PI / 2; H.plinthLights.push(d); pool(x, z, 1.6, 0xfff0c0, 0.3, LVY(k) + 0.022); return o; };
      var goldSc = mat(0xd9a441, { metalness: 0.9, roughness: 0.25, envMapIntensity: 1 }), blackSc = mat(0x15151a, { metalness: 0.6, roughness: 0.3 });
      H.sc0 = plinth(-13.2, -52.6, new T.TorusKnotGeometry(0.32, 0.1, 64, 8), mat(0xc8322f, { roughness: 0.3, metalness: 0.2 }));
      var sculpture = plinth(-9.6, -53.8, new T.IcosahedronGeometry(0.48, 0), goldSc, 1.1, 0.5);
      (H.sc2 = plinth(-6.0, -52.6, new T.TorusGeometry(0.36, 0.12, 10, 24), mat(0x2e5fa8, { roughness: 0.3, metalness: 0.3 }))).rotation.x = 0.6;
      const tw = plinth(-13.2, -59.4, new T.BoxGeometry(0.5, 1.1, 0.5), mat(0xf6f1e8, { roughness: 0.35 }), 0.8, 0.55); tw.rotation.y = 0.6;
      // the painter's easel and a half-finished canvas of the skyline
      const ex = -11.45, ez = -56.5; const easel = new T.Group(); easel.position.set(ex, 0, ez); easel.rotation.y = -0.6; G.add(easel);
      for (const [a, b, t] of [[-0.3, 0.1, 0.15], [0.3, 0.1, -0.15], [0, -0.35, 0]]) { const l = cyl(0.02, 0.025, 1.9, walnut, a, 0.95, b, { parent: easel, cast: false }, 5); l.rotation.z = t; l.rotation.x = b < 0 ? -0.35 : 0.1; }
      box(0.7, 0.04, 0.08, walnut, 0, 0.9, 0.12, { parent: easel, cast: false });
      const art = canvasTex(128, 96, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b2250'); gr.addColorStop(1, '#d98a5a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#0e1225'; for (let i = 0; i < 9; i++) g.fillRect(i * 14, 40 + (i * 37) % 30, 12, 60); g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(96, 22, 9, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(80, 60, 48, 36); });
      const cv = H.canvas = new T.Mesh(new T.PlaneGeometry(0.66, 0.5), new T.MeshStandardMaterial({ map: art, roughness: 0.9 })); cv.position.set(0, 1.2, 0.16); cv.rotation.x = -0.1; easel.add(cv);
      colR(ex, ez, 0.35, k);
      for (const [sx, sz] of [[-11.4, -51.2], [-7.6, -51.4], [-5.0, -54.4], [-11.5, -61.2]]) addSlot(sx, sz, sx < -10 ? -13.2 : -6.0, sz < -58 ? -59.4 : -52.6, 'view', -1, k);
    }
    // giant chess on the floor with two stools
    {
      const x = 0.4, z = -57.0, bt = canvasTex(256, 256, (g) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#2a2a30' : '#e9e1d2'; g.fillRect(i * 32, j * 32, 32, 32); } });
      const bd = new T.Mesh(new T.PlaneGeometry(3.2, 3.2), new T.MeshStandardMaterial({ map: bt, roughness: 0.6 })); bd.rotation.x = -Math.PI / 2; bd.position.set(x, 0.03, z); bd.receiveShadow = true; G.add(bd);
      const wM = mat(0xf6f1e8, { roughness: 0.4 }), bM = mat(0x15151a, { roughness: 0.4 });
      const piece = (cx, cz, kind, m) => { const pg = new T.Group(); pg.position.set(cx, 0, cz); G.add(pg); H.chess.push(pg); const o = { parent: pg }; cyl(0.14, 0.17, 0.1, m, 0, 0.05, 0, o, 12); if (kind === 'pawn') { cyl(0.07, 0.11, 0.3, m, 0, 0.25, 0, o, 10); add(new T.SphereGeometry(0.1, 10, 8), m, 0, 0.48, 0, o); } else if (kind === 'rook') { cyl(0.1, 0.13, 0.5, m, 0, 0.35, 0, o, 10); cyl(0.14, 0.12, 0.14, m, 0, 0.66, 0, o, 8); } else if (kind === 'king') { cyl(0.08, 0.14, 0.7, m, 0, 0.45, 0, o, 10); box(0.06, 0.22, 0.06, m, 0, 0.92, 0, o); box(0.16, 0.05, 0.06, m, 0, 0.95, 0, o); } else { cyl(0.08, 0.14, 0.55, m, 0, 0.38, 0, o, 10); add(new T.ConeGeometry(0.12, 0.3, 10), m, 0, 0.8, 0, o); } return pg; };
      const sq = (i, j) => [x - 1.4 + i * 0.4, z - 1.4 + j * 0.4];
      [[0, 0, 'rook'], [3, 0, 'king'], [4, 1, 'queen'], [1, 1, 'pawn'], [2, 2, 'pawn'], [6, 1, 'pawn'], [5, 3, 'pawn']].forEach(([i, j, kd]) => piece(...sq(i, j), kd, wM));
      [[7, 7, 'rook'], [3, 7, 'king'], [2, 5, 'queen'], [1, 6, 'pawn'], [5, 6, 'pawn'], [6, 5, 'pawn'], [4, 4, 'pawn']].forEach(([i, j, kd]) => piece(...sq(i, j), kd, bM));
      col(x - 1.6, z - 1.6, x + 1.6, z + 1.6, k);
      for (const sx of [-2.5, 2.5]) { cyl(0.26, 0.24, 0.08, walnut, x + sx, 0.45, z, g, 14); cyl(0.04, 0.05, 0.42, metal, x + sx, 0.21, z, { parent: G, cast: false }, 8); addSlot(x + sx, z, x, z, 'chess', -1, k); }
      pool(x, z, 2.6, 0xfff0c0, 0.2, LVY(k) + 0.022);
    }
    // selfie spots at the front corners (the best view of the city) and a lounge bench
    addSlot(13.3, F - 1.0, 13.3, F + 5, 'selfie', -1, k); addSlot(-13.4, F - 1.0, -13.4, F + 5, 'selfie', -1, k); addSlot(2.6, F - 0.9, 2.6, F + 5, 'selfie', -1, k);
    { const bx = -2.0, bz = F - 0.9; box(2.4, 0.08, 0.5, walnut, bx, 0.45, bz, g); for (const dx of [-1.0, 1.0]) box(0.08, 0.42, 0.45, metal, bx + dx, 0.22, bz, { parent: G, cast: false }); col(bx - 1.2, bz - 0.3, bx + 1.2, bz + 0.3, k); for (const dx of [-0.8, 0, 0.8]) addSlot(bx + dx, bz + 0.05, bx + dx, bz + 5, 'sit', -1, k); }
    highTable(-2.6, -52.0, k, 3); highTable(3.4, -61.2, k);
    for (const x of [-8.5, 7.5]) addSlot(x, F - 0.75, x, F + 3, 'view', -1, k);
    plant(-14.0, F - 12.9, 'big', { lv: k }); plant(-4.4, F - 12.8, 'big', { lv: k }); plant(3.8, F - 0.9, 'small', { lv: k });
    lantern(-6.0, F - 0.5, 1, k); lantern(10.8, F - 0.5, 1, k); lantern(-14.3, -56.0, 1, k);
    plight(-9.6, LVY(k) + 2.6, -55, 0xfff0c0, 1.3, 9); plight(8, LVY(k) + 2.5, -56, 0xa0d0ff, 0.8, 9);
  }

  // ============================================================ level 5: hot tub, open-air cinema, antenna mast
  {
    const k = 5, G = LG[k], F = front(k), g = { parent: G }, B = F - 13.5;
    lvFloor(k, deckTex, 0.62);
    railFront(k, LINKS[4].cx); railSides(k);
    box(31.2, 1.0, 0.4, cream, 0, 0.5, B + 0.3, g); box(31.4, 0.08, 0.5, creamDark, 0, 1.02, B + 0.3, { parent: G, cast: false }); col(-15.6, B - 0.2, 15.6, B + 0.55, k);
    // hot tub with a wooden skirt, lit water, steam and a bench inside
    {
      const x = -8.2, z = -66.8, r = 1.7;
      const skirt = new T.Mesh(new T.CylinderGeometry(r + 0.25, r + 0.25, 0.8, 28, 1, true), mat(0x7a5232, { roughness: 0.7, side: T.DoubleSide })); skirt.position.set(x, 0.4, z); skirt.castShadow = true; G.add(skirt);
      const rim = new T.Mesh(new T.TorusGeometry(r + 0.1, 0.16, 8, 32), mat(0xb08a5a, { roughness: 0.6 })); rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.8, z); rim.castShadow = true; G.add(rim);
      var tubMat = new T.MeshStandardMaterial({ color: 0x2a9ab8, transparent: true, opacity: 0.9, roughness: 0.08, metalness: 0.1, envMapIntensity: 0.6, emissive: 0x0f6a80, emissiveIntensity: 0.25, emissiveMap: causticTex });
      const w = new T.Mesh(new T.CircleGeometry(r, 32), tubMat); w.rotation.x = -Math.PI / 2; w.position.set(x, 0.66, z); w.renderOrder = 2; G.add(w);
      const tl = H.tubLight = new T.PointLight(0x5fe0ff, 0.5, 6, 2); tl.position.set(x, 1.0, z); G.add(tl); H.tubPool = pool(x, z, 2.2, 0x40d0e0, 0.08, LVY(k) + 0.9);
      for (let i = 0; i < 7; i++) { const s = new T.Mesh(new T.SphereGeometry(0.2 + (i % 3) * 0.08, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, depthWrite: false })); s.position.set(x + Math.cos(i * 1.3) * 0.8, 0.9, z + Math.sin(i * 1.3) * 0.8); s.userData = { bx: s.position.x, bz: s.position.z, ph: i * 0.9 }; G.add(s); STEAM.push(s); }
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + 0.3; addSlot(x + Math.cos(a) * 1.05, z + Math.sin(a) * 1.05, x, z, 'tub', -1, k); }
      colR(x, z, 0.55, k); blob(x, z, 4.4, 4.4, 0.4, G);
      // towels, a tray with glasses and a small step
      box(0.8, 0.3, 0.5, mat(0xb08a5a, { roughness: 0.7 }), x + 2.3, 0.15, z + 0.4, g); H.tubTowel1 = box(0.5, 0.2, 0.34, mat(0xe9c33b, { roughness: 1 }), x + 2.3, 0.4, z + 0.4, { parent: G, cast: false }); H.tubTowel2 = box(0.5, 0.12, 0.34, mat(0x2a6fb8, { roughness: 1 }), x + 2.3, 0.56, z + 0.4, { parent: G, cast: false });
      cyl(0.3, 0.3, 0.03, chrome, x - 2.3, 0.86, z - 0.6, { parent: G, cast: false }, 14); cyl(0.03, 0.03, 0.85, chrome, x - 2.3, 0.43, z - 0.6, { parent: G, cast: false }, 6); for (let i = 0; i < 3; i++) H.tubGlass.push(cyl(0.035, 0.03, 0.12, mat(0xff8a4a, { emissive: 0xff8a4a, emissiveIntensity: 0.3, roughness: 0.2 }), x - 2.4 + i * 0.12, 0.94, z - 0.65 + (i % 2) * 0.1, { parent: G, cast: false }, 8));
      colR(x + 2.3, z + 0.4, 0.45, k); colR(x - 2.3, z - 0.6, 0.3, k);
    }
    // open-air cinema: screen on the back wall, projector on a stand, beanbags in two rows
    {
      var filmTex = canvasTex(512, 288, (g) => { g.fillStyle = '#101428'; g.fillRect(0, 0, 512, 288); }); filmTex.encoding = T.sRGBEncoding;
      var screenMat = new T.MeshBasicMaterial({ map: filmTex, toneMapped: false, color: new T.Color(1.6, 1.6, 1.6) });
      box(9.6, 5.4, 0.12, mat(0x15151a), 5.0, 3.4, B + 0.55, g);
      const sc = new T.Mesh(new T.PlaneGeometry(9.0, 5.06), screenMat); sc.position.set(5.0, 3.4, B + 0.62); G.add(sc);
      for (const sx of [0.4, 9.6]) cyl(0.06, 0.07, 6.2, metal, sx, 3.1, B + 0.6, { parent: G, cast: false }, 8);
      pool(5.0, B + 2.5, 6.0, 0x9fb8ff, 0.2, LVY(k) + 0.022);
      var screenLight = new T.PointLight(0x9fb8ff, 1.2, 12, 2); screenLight.position.set(5.0, LVY(k) + 2.5, B + 3); scene.add(screenLight);
      // projector (mission): swapping the reel fills the screen with red static
      const px = 5.0, pz = -67.8;
      cyl(0.04, 0.06, 1.2, metal, px, 0.6, pz, { parent: G, cast: false }, 6); cyl(0.3, 0.3, 0.04, metal, px, 0.02, pz, { parent: G, cast: false }, 12);
      H.projBody = box(0.5, 0.32, 0.7, mat(0x3a3a3e, { roughness: 0.4, metalness: 0.3 }), px, 1.36, pz, g); for (const dz of [-0.18, 0.18]) { const reel = cyl(0.22, 0.22, 0.05, mat(0x8a8a90, { metalness: 0.7, roughness: 0.3 }), px, 1.72, pz + dz, { parent: G, cast: false }, 16); reel.rotation.z = Math.PI / 2; }
      const lens = H.projLens = cyl(0.07, 0.09, 0.18, mat(0x15151a), px, 1.36, pz - 0.42, { parent: G, cast: false }, 10); lens.rotation.x = Math.PI / 2; (H.projGlow = add(new T.CircleGeometry(0.06, 10), glow(0xcfe0ff, 4), px, 1.36, pz - 0.52, { parent: G, cast: false })).rotation.y = Math.PI;
      colR(px, pz, 0.35, k); blob(px, pz, 1.0, 1.0, 0.35, G);
      const cols = [0xc8322f, 0xe9c33b, 0x2e5fa8, 0x1f8a78, 0x6b3f8c, 0xff7fae, 0xd9a441, 0x5a8ad8];
      for (let i = 0; i < 8; i++) { const x = 1.6 + (i % 4) * 2.2, z = -70.4 - Math.floor(i / 4) * 2.3; const b = add(new T.SphereGeometry(0.62, 14, 10), mat(cols[i], { roughness: 0.95 }), x, 0.32, z, { parent: G }); b.scale.set(1, 0.5, 1.15); H.beans.push(b); blob(x, z, 1.5, 1.6, 0.35, G); addSlot(x, z + 0.38, x, z - 6, 'bean', -1, k); }
      box(3.2, 0.06, 0.05, glow(0xffd29a, 1.2), 5.0, 0.03, -69.3, { parent: G, cast: false });
    }
    // popcorn cart with a striped awning at the front right
    {
      const x = -13.0, z = -64.6;
      box(1.4, 0.9, 0.8, mat(0xb8252a, { roughness: 0.5 }), x, 0.6, z, g); for (const sx of [-0.5, 0.5]) { const wh = cyl(0.22, 0.22, 0.06, mat(0x15151a), x + sx, 0.22, z + 0.45, { parent: G, cast: false }, 14); wh.rotation.x = Math.PI / 2; }
      const gl = add(new T.BoxGeometry(1.3, 0.7, 0.7), new T.MeshStandardMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.3, roughness: 0.05 }), x, 1.4, z, { parent: G, cast: false });
      const pops = [], pr = mulberry32(17); for (let i = 0; i < 60; i++) { const s = new T.IcosahedronGeometry(0.04 + pr() * 0.03, 0); s.translate(x - 0.5 + pr() * 1.0, 1.1 + pr() * 0.3, z - 0.25 + pr() * 0.5); pops.push([s, pr() < 0.7 ? 0xfff4d0 : 0xf2c14e]); } G.add(H.popcorn = new T.Mesh(mergeGeos(pops), vcol({ roughness: 0.9 })));
      H.popLamp = add(new T.SphereGeometry(0.06, 8, 6), glow(0xffd8a0, 4), x, 1.65, z, { parent: G, cast: false });
      const awn = canvasTex(256, 32, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#c8322f'; g.fillRect(i * 32, 0, 32, 32); } });
      for (const sx of [-0.6, 0.6]) cyl(0.02, 0.02, 1.1, chrome, x + sx, 1.3, z - 0.36, { parent: G, cast: false }, 6);
      const a = new T.Mesh(new T.BoxGeometry(1.6, 0.04, 1.1), new T.MeshStandardMaterial({ map: awn, roughness: 0.8 })); a.position.set(x, 1.95, z); a.rotation.x = 0.12; G.add(a);
      col(x - 0.8, z - 0.5, x + 0.8, z + 0.5, k); pool(x, z - 1, 2.0, 0xffc27a, 0.35, LVY(k) + 0.022);
      for (const dx of [-0.5, 0.5]) addSlot(x + dx, z - 1.1, x + dx, z, 'bar', -1, k);
      BAR_ZONES.push({ lv: k, x, z: z - 1.3, r: 1.6, rot: 0, label: 'Pegar pipoca' });
    }
    // lounge sofas facing the city, and the antenna mast with its beacon (mission: sabotage turns the beacon green and kills the mast lights)
    {
      for (const [sx, sz, ry] of [[-4.6, -64.9, 0], [-12.8, -70.6, Math.PI / 2]]) { const so = new T.Group(); so.position.set(sx, 0, sz); so.rotation.y = ry; G.add(so); H.sofa5.push(add(rbox(2.2, 0.4, 0.9, 0.08), mat(0x3b4f7a, { roughness: 0.9 }), 0, 0.3, 0, { parent: so })); add(rbox(2.2, 0.5, 0.25, 0.08), mat(0x3b4f7a, { roughness: 0.9 }), 0, 0.7, -0.38, { parent: so }); for (const dx of [-1.0, 1.0]) add(rbox(0.25, 0.3, 0.9, 0.06), mat(0x3b4f7a, { roughness: 0.9 }), dx, 0.62, 0, { parent: so }); blob(0, 0, 2.6, 1.6, 0.4, so); for (const dx of [-0.6, 0.6]) addSlot(sx + Math.cos(ry) * dx, sz - Math.sin(ry) * dx, sx + Math.sin(ry) * 5, sz + Math.cos(ry) * 5, 'sit', -1, k); }
      col(-5.7, -65.5, -3.5, -64.3, k); col(-13.2, -71.7, -12.4, -69.5, k);
      const mx = -12.0, mz = -74.3;
      for (const [a, b] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) { const l = cyl(0.03, 0.05, 7.0, metal, mx + a * 0.6, 3.5, mz + b * 0.6, { parent: G, cast: false }, 6); l.rotation.z = -a * 0.1; l.rotation.x = b * 0.1; }
      for (let i = 1; i < 7; i++) { const r = add(new T.TorusGeometry(0.4 - i * 0.045, 0.02, 5, 10), metal, mx, i * 1.1, mz, { parent: G, cast: false }); r.rotation.x = Math.PI / 2; if (i % 2) { const ml = add(new T.SphereGeometry(0.05, 6, 4), glow(0xffffff, 3), mx + 0.4 - i * 0.045, i * 1.1, mz, { parent: G, cast: false }); MAST_LIGHTS.push(ml); } }
      cyl(0.03, 0.03, 1.6, metal, mx, 7.7, mz, { parent: G, cast: false }, 5);
      var beaconMat = glow(0xff3030, 5); var beacon = add(new T.SphereGeometry(0.12, 10, 8), beaconMat, mx, 8.55, mz, { parent: G, cast: false }); FLOATS.push(beacon);
      box(1.2, 0.5, 0.8, mat(0x6a6660, { roughness: 0.9 }), mx + 1.3, 0.25, mz + 0.2, g); for (let i = 0; i < 3; i++) H.mastPanel.push(box(0.3, 0.06, 0.04, glow(i === 1 ? 0x40ff80 : 0xffd080, 2), mx + 1.0 + i * 0.3, 0.52, mz + 0.5, { parent: G, cast: false }));
      col(mx - 0.7, mz - 0.7, mx + 1.95, mz + 0.7, k); pool(mx, mz, 2.0, 0xff8080, 0.25, LVY(k) + 0.022);
    }
    highTable(1.0, -65.6, k, 3); highTable(-2.2, -70.6, k);
    for (const x of [-11.6, -1.8, 9.0]) addSlot(x, F - 0.75, x, F + 3, 'view', -1, k);
    plant(14.0, F - 12.9, 'big', { lv: k }); plant(-14.0, F - 0.9, 'big', { lv: k }); plant(14.0, F - 0.9, 'small', { lv: k }); plant(-0.6, B + 1.2, 'big', { lv: k });
    lantern(-10.0, F - 0.5, 1, k); lantern(7.0, F - 0.5, 1, k); lantern(14.3, -70.5, 1, k);
    for (const [a, b] of [[[-14.5, F - 0.3], [14.5, F - 0.3]], [[-14.5, -72.0], [-0.5, -72.0]]]) bulbs(G, a, b, 3.1);
    plight(-8.2, LVY(k) + 2.4, -66.8, 0x7fd8ff, 1.0, 8); plight(-4, LVY(k) + 2.4, -70, 0xffc27a, 1.0, 9);
  }
  for (let li = 1; li < LINKS.length; li++) spiralStair(li);
}
// a 20-frame "film" for the cinema screen: a slow pan over a night skyline with a moon, redrawn every few frames
let filmFrame = -1;
function drawFilm(t, broken) {
  const c = filmTex.image, g = c.getContext('2d'), w = c.width, h = c.height;
  if (broken) { g.fillStyle = '#3a0a0a'; g.fillRect(0, 0, w, h); const r = mulberry32(Math.floor(t * 20)); for (let i = 0; i < 1500; i++) { g.fillStyle = r() < 0.5 ? '#ff4a3a' : '#120000'; g.fillRect(r() * w, r() * h, 3, 3); } g.fillStyle = '#ffd0d0'; g.font = 'bold 40px Georgia'; g.textAlign = 'center'; g.fillText('SEM SINAL', w / 2, h / 2 + 14); }
  else {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0e1630'); gr.addColorStop(0.7, '#3a3a6a'); gr.addColorStop(1, '#c98a5a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(w * 0.72, h * 0.25, 22, 0, 7); g.fill();
    const off = (t * 18) % 60; g.fillStyle = '#0a0c1a'; for (let i = -1; i < 10; i++) { const x = i * 60 - off, bh = 70 + ((i * 53) % 90); g.fillRect(x, h - bh, 44, bh); g.fillStyle = '#ffd98a'; for (let j = 0; j < 5; j++) if ((i * 7 + j) % 3) g.fillRect(x + 8 + (j % 2) * 18, h - bh + 10 + Math.floor(j / 2) * 18, 8, 10); g.fillStyle = '#0a0c1a'; }
    g.fillStyle = '#15151a'; g.fillRect(0, h - 10, w, 10);
  }
  filmTex.needsUpdate = true;
}

Object.assign(H, { lampShade, lampLight, lampPool, lampPoolM: lampPool.material, lampMesh, painting, statue, vaseCrown, FLOATS, poolLight, poolPool, waterMat, neon, neonLight, breakerLamp, FIRE, fireLight, teleHead, KOI, screenLight, tubMat, tubPoolM: H.tubPool.material, heliLight });
// ---------------------------------------------------------------- the sniper's nest (foreground of the sniper's view)
// ---------------------------------------------------------------- rooftop details (fonte/cenarios/src/00-cobertura.js, built with the scenarios' kit)
const MAP0K = (() => {
  if (!window.MIRA_COBERTURA) return null;
  const g = new T.Group(); g.name = 'map0-detalhes'; scene.add(g);
  const K = MIRA_KIT(T, g, 11);
  K.lvGroup = LEVELS.map(L => { const lg = new T.Group(); lg.position.y = L.y; g.add(lg); return lg; });
  try { MIRA_COBERTURA(K, LEVELS); } catch (e) { console.error('cobertura', e); }
  for (const c of K.cols) col(c.x0, c.z0, c.x1, c.z1, c.lv || 0);
  for (const sl of K.slots) addSlot(sl.x, sl.z, sl.x + Math.sin(sl.rot), sl.z + Math.cos(sl.rot), sl.type, -1, sl.lv || 0);
  OCCLUDERS.push(...K.occ);
  return K;
})();
const MAP0_OBJS = scene.children.slice(MAP0_FROM);

return { MAP0_FROM, PL, radialTex, blobTex, blobMat, UNIT, vcol, floorTex, oakTex, herringTex, marbleTex, flutedTex, slatTex, rugTex, cream, creamDark, metal, brass, chrome, walnut, oak, marble, glassMat, SKY0, CITY_TEX, cr, floor, deckSlab, FLAMES, POOLS, tellDrink, rug, sofaM, cushM, cushM2, cushM3, lampShade, lampMesh, lampLight, lampPool, dance, PLANTS, leafShape, monsteraShape, vaseCrown, officeRug, briefcase, desklamp, paintTex, painting, pic, safeDoor, statue, goldM, silverM, st1, st2, st3, DK, dk, deckTex, deckFloor, causticTex, waterMat, water, poolLight, poolPool, FLOATS, fireRug, FIRE, fireLight, coolerLid, piano, telescope, teleHead, TELE_REST, TELE_AIM, NEON_TEXT, NEON_DEAD, neonMat, neonDeadMat, neon, neonDead, neonLight, breakerLamp, FLOORS, BAR_ZONES, LG, KOI, STEAM, MAST_LIGHTS, wheelSpin, rotorSpin, filmFrame, MAP0K, MAP0_OBJS, seedMesh, bloomMesh, bonsaiGreen, bonsaiRed, pondMat, pondLight, pondPool, wheel, cashLamp, heli, tailRotor, rotor, heliLight, goldSc, blackSc, sculpture, tubMat, filmTex, screenMat, screenLight, beaconMat, beacon };
};
