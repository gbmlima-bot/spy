
(() => {
'use strict';
const T = THREE;
const $ = s => document.querySelector(s);
const PERF = { enabled: new URLSearchParams(location.search).has('perf'), last: {}, measure(name, fn) {
  if (!this.enabled) return fn(); const t = performance.now(); try { return fn(); } finally { this.last[name] = performance.now() - t; }
} };
let qualityStorage = null; try { qualityStorage = window.localStorage; } catch (_) {}
const quality = new MIRA_QUALITY.Quality(qualityStorage, () => applyQuality());
const yieldUI = () => new Promise(resolve => setTimeout(resolve, 0));
const ensureMapAssets = id => window.MIRA_ASSETS ? window.MIRA_ASSETS.ensureMapAssets(id) : Promise.resolve();
let preparing = false, prepareToken = 0, worldToken = 0, readyMapId = -1, lastMapFailure = null;
async function prepareMap(id) {
  if (preparing) return false;
  preparing = true; const token = ++prepareToken;
  quality.reset(performance.now());
  const loading = $('#loading'); if (loading) { loading.hidden = false; loading.textContent = L10N('Preparando cenário…'); }
  try { await ensureMapAssets(id); await yieldUI(); if (token !== prepareToken) return false;
    if (!environmentPrepared) { if (loading) loading.textContent = L10N('Preparando iluminação…'); await yieldUI(); PERF.measure('environment', ensureEnvironment); await yieldUI(); if (token !== prepareToken) return false; }
    let mapMs = 0; worldToken = token; const stages = mapStages(id);
    while (true) { const t = performance.now(), step = stages.next(); mapMs += performance.now() - t; if (step.done) break; if (token !== prepareToken) { stages.return(); if (worldToken === token) readyMapId = -1; return false; } if (loading) loading.textContent = L10N(step.value); await yieldUI(); }
    if (PERF.enabled) PERF.last.map = mapMs;
    await yieldUI(); return token === prepareToken;
  } catch (e) { if (token !== prepareToken) return false; readyMapId = -1; SCEN.id = -1; lastMapFailure = { id, at: performance.now() }; console.error('map load', e); toast('Não foi possível carregar o cenário. Tente de novo.', 'bad'); return false; }
  finally { if (token === prepareToken) { preparing = false; if (loading) loading.hidden = true; quality.reset(performance.now()); } }
}


// ---------------------------------------------------------------- constants
// round rules the host can draw in multiplayer: 'apagao' the lights fail once for BLACKOUT_T s, 'duas' two bullets and a
// 3-minute round, 'dupla' the agent must also stand beside an accomplice for PAIR_T s (counts as one of the 4 missions)
const RULES = {
  apagao: { nome: 'Apagão', txt: 'Uma vez na rodada as luzes caem por 10 s. O sniper fica quase cego; quem está na festa ainda enxerga perto.' },
  duas: { nome: 'Duas balas e 3 minutos', txt: 'O sniper tem duas balas, mas a rodada dura só 3 minutos. Errar o primeiro tiro derruba alguém e o jogo segue.' },
  dupla: { nome: 'Missão em dupla', txt: 'Uma das 4 missões do agente é encostar num cúmplice por 3 s, lado a lado. Só o agente vê quem são os cúmplices.' },
};
const BLACKOUT_T = 10, PAIR_T = 3, PAIR_D = 1.1;
const OT_T = 30; // overtime: when the clock runs out with the agent one mission short, 30 more seconds for both sides
const NPC_N = 30, ROUND_T = 300, BRIEF_T = 15, NEED = 4, MS_N = 6, IR = 1.4, P_SPEED = 1.5, RAD = 0.28;
const SNIPER_POS = new T.Vector3(0, 27, 46);
// the wide (unscoped) view is fitted so the whole stepped tower is on screen: all six levels, bottom party to the top deck
// envelope of the stepped tower: each level's front edge at floor height and its back edge with the tallest props on it
const SCENE_BOX = { x0: -15.6, x1: 15.6, h: 7, top: 9.5 };
function scenePts() {
  const P = []; const B = SCENE_BOX;
  LEVELS.forEach((L, i) => { const x0 = L.x0 === undefined ? B.x0 : L.x0, x1 = L.x1 === undefined ? B.x1 : L.x1; const zf = Math.max(L.z0, L.z1), zb = Math.min(L.z0, L.z1);
    for (const x of [x0, x1]) { P.push([x, L.y, zf + 1]); P.push([x, L.y + (i === LEVELS.length - 1 ? B.top : B.h), zb - 1.5]); } });
  return P;
}
const WIDE_AIM = new T.Vector3(0, 10, -30); let WIDE_ELEV = -0.3;
function fitWide(a) {
  const P = SNIPER_POS; let eMin = 9, eMax = -9, hMax = 0;
  for (const [x, y, z] of scenePts()) {
    const dz = P.z - z, e = Math.atan2(y - P.y, dz), h = Math.atan2(Math.abs(x - P.x), dz);
    eMin = Math.min(eMin, e); eMax = Math.max(eMax, e); hMax = Math.max(hMax, h);
  }
  const vNeed = (eMax - eMin) * 1.06, hNeed = 2 * Math.atan(Math.tan(hMax * 1.06) / a);
  const fov = Math.max(vNeed, hNeed) * 180 / Math.PI;
  wide.fov = Math.min(100, Math.max(30, fov));
  // centre the tower; on tall (portrait) screens, where the view is much taller than the tower, keep it in the upper part above the HUD
  const f = T.MathUtils.degToRad(wide.fov); WIDE_ELEV = a < 1 ? Math.min((eMin + eMax) / 2, eMax + f * 0.22 - f / 2) : (eMin + eMax) / 2;
  const d = 60; WIDE_AIM.set(P.x, P.y + Math.sin(WIDE_ELEV) * d, P.z - Math.cos(WIDE_ELEV) * d);
}
const DOOR_OUT = [7, -2.2], DOOR_IN = [7, -3.9];
const inOffice = (x, z) => x > 5 && z < -3;
// six levels, each DH higher than the one below, stepping back from the sniper: the party roof (0), the upper deck on the
// penthouse (1), then the zen garden (2), the casino (3), the helipad and gallery (4) and the hot tub + open-air cinema (5).
// Neighbouring levels are joined by a spiral stair ("link"), alternating sides so the climb zigzags.
const DH = 4.6;
const SCENARIOS = window.MIRA_CENARIOS || [];
let LEVELS = [
  { name: 'festa', y: 0, z0: -9.65, z1: 9.5 },
  { name: 'terraço', y: DH, z0: -21.3, z1: -9.25 },
  { name: 'jardim zen', y: DH * 2, z0: -35.0, z1: -22.6 },
  { name: 'cassino', y: DH * 3, z0: -48.5, z1: -36.1 },
  { name: 'heliponto', y: DH * 4, z0: -62.0, z1: -49.6 },
  { name: 'topo', y: DH * 5, z0: -75.5, z1: -63.1 },
];
LEVELS.forEach(L => { L.x0 = -14.5; L.x1 = 14.5; });
let LV_N = LEVELS.length;
const mkLink = (lo, cx, cz) => ({ lo, cx, cz, r: 1.05, turns: 1.5, base: [cx, cz + 2.55], top: [cx, cz - 4.1] });
let LINKS = [
  { lo: 0, cx: -13.0, cz: -7.2, r: 1.05, turns: 1.5, base: [-13.0, -5.55], top: [-13.0, -10.2] },
  mkLink(1, -6.6, -19.1), mkLink(2, 12.0, -32.6), mkLink(3, -12.0, -46.1), mkLink(4, 12.0, -59.6),
];
// waypoints to pass on the way to a stair's base (and, reversed, when leaving it), where furniture is in the way
LINKS[1].via = [[-6.0, -10.5]]; LINKS[4].via = [[12.0, -52.5]];
const STAIR = LINKS[0];
const LINK_LEN = 13.2;
const LVY = lv => (LEVELS[lv || 0] || LEVELS[0]).y;
const lvOfY = y => { let b = 0, bd = 1e9; for (let i = 0; i < LEVELS.length; i++) { const d = Math.abs(LEVELS[i].y - y); if (d < bd) { bd = d; b = i; } } return b; };
// position along a stair link, s = 0 at the base (lower level) and 1 at the top (upper level)
function linkPos(s, li = 0) {
  const L = LINKS[li] || LINKS[0], y0 = LVY(L.lo), a = 0.06, b = 0.94;
  // the extra scenarios use straight ramps and stairways: a line from the lower end to the upper one
  if (L.kind === 'ramp') { const y1 = LVY(L.lo + 1); return { x: L.base[0] + (L.top[0] - L.base[0]) * s, y: y0 + (y1 - y0) * s, z: L.base[1] + (L.top[1] - L.base[1]) * s }; }
  if (s <= a) { const u = s / a; return { x: L.cx, y: y0, z: L.base[1] + (L.cz + L.r - L.base[1]) * u }; }
  if (s >= b) { const u = (s - b) / (1 - b); return { x: L.cx, y: y0 + DH, z: L.cz - L.r + (L.top[1] - (L.cz - L.r)) * u }; }
  const u = (s - a) / (b - a), th = Math.PI / 2 + Math.PI * 2 * L.turns * u;
  return { x: L.cx + Math.cos(th) * L.r, y: y0 + DH * u, z: L.cz + Math.sin(th) * L.r };
}
function regionOf(x, z, lv) { return lv >= 1 || SCEN.id ? 'L' + lv : inOffice(x, z) ? 'office' : 'main'; }
// the stair to take from level lv going up (dir 1) or down (dir -1): the one whose end is closest
function linkFor(lv, dir, x, z) { let best = -1, bd = 1e9; LINKS.forEach((L, i) => { if (dir > 0 ? L.lo !== lv : L.lo + 1 !== lv) return; const e = dir > 0 ? L.base : L.top; const d = Math.hypot(e[0] - x, e[1] - z); if (d < bd) { bd = d; best = i; } }); return best; }
// the stair end the mover is standing at: { li, dir } or null
function nearStair(x, z, lv) {
  for (let li = 0; li < LINKS.length; li++) {
    const L = LINKS[li];
    if (L.lo === lv && Math.hypot(x - L.base[0], z - L.base[1]) < 1.1) return { li, dir: 1 };
    if (L.lo + 1 === lv && Math.hypot(x - L.top[0], z - L.top[1]) < 1.1) return { li, dir: -1 };
  }
  return null;
}

// ---------------------------------------------------------------- missions
// A mission is one of several things the agent can do to a real object (a "prop") in the scene. Every prop has a stand
// point `s`, a look point `l`, a level and a list of acts; each act is a label plus the micro interaction (`fx`) the sniper
// can spot afterwards: something appears, moves, tips over, changes colour, goes dark... Hundreds of missions come out of
// a few dozen props, and every round draws a handful of them on three neighbouring levels.
let PROPS = [], MISSIONS = [];
const SP = (item, at, o = {}) => Object.assign({ k: 'spawn', item, at }, o);
const TI = (h, c, e) => ({ k: 'tint', h, c, e });
const RO = (h, ax, a) => ({ k: 'rot', h, ax, a });
const MV = (h, d3) => ({ k: 'move', h, d3 });
const HI = h => ({ k: 'hide', h });
const OFF = h => ({ k: 'off', h });
const GL = (h, c, i = 3) => ({ k: 'glow', h, c, i });
const LI = (h, i, c) => ({ k: 'light', h, i, c });
const SC = (h, s) => ({ k: 'scale', h, s });
const LEG = n => ({ k: 'legacy', n });
// the 21 original missions keep their bespoke tells (see legacyTell)
const LEGACY = [
  { k: 'maleta', label: 'Trocar a maleta', where: 'escritório de vidro', s: [9.2, -5.6], l: [9.2, -6.75] },
  { k: 'quadro', label: 'Fotografar o quadro', where: 'escritório de vidro', s: [11.8, -8.9], l: [11.8, -9.9] },
  { k: 'cofre', label: 'Abrir o cofre da estante', where: 'escritório de vidro', s: [13.3, -6.3], l: [14.2, -6.3] },
  { k: 'luminaria', label: 'Plantar escuta na luminária', where: 'lounge', s: [-13.0, 2.5], l: [-13.9, 2.1] },
  { k: 'barman', label: 'Passar a senha ao barman', where: 'bar', s: [-7.5, -5.8], l: [-7.5, -8.3] },
  { k: 'estatueta', label: 'Trocar a estatueta', where: 'perto da pista', s: [11.5, 4.1], l: [11.5, 5] },
  { k: 'vaso', label: 'Pegar o microfilme no vaso', where: 'perto do parapeito', s: [-1.9, 8.9], l: [-3.5, 9] },
  { k: 'brinde', label: 'Brindar com o anfitrião', where: 'centro da festa', s: [1.5, -3.0], l: [1.5, -4.0] },
  { k: 'telescopio', label: 'Fotografar pelo telescópio', where: 'terraço, na beirada', s: [12.2, -10.7], l: [12.2, -9.7], lv: 1 },
  { k: 'cooler', label: 'Esconder o chip no cooler', where: 'terraço, fogueira', s: [-7.0, -14.1], l: [-7.9, -14.1], lv: 1 },
  { k: 'piscina', label: 'Jogar o reagente na piscina', where: 'terraço, piscina', s: [0, -14.5], l: [0, -15.6], lv: 1 },
  { k: 'letreiro', label: 'Religar o letreiro', where: 'terraço, no fundo', s: [6.5, -20.3], l: [6.5, -21.3], lv: 1 },
  { k: 'muda', label: 'Trocar a muda no jardim', where: 'terraço, jardim', s: [11.2, -17.6], l: [12.2, -17.6], lv: 1 },
  { k: 'bonsai', label: 'Esconder o microfilme no bonsai', where: 'jardim zen (2º), pedestal', s: [-1.0, -25.0], l: [-1.0, -26.1], lv: 2 },
  { k: 'koi', label: 'Soltar a cápsula no lago das carpas', where: 'jardim zen (2º), lago', s: [5.2, -27.9], l: [5.2, -29.5], lv: 2 },
  { k: 'fichas', label: 'Trocar as fichas no caixa', where: 'cassino (3º), caixa', s: [11.8, -40.5], l: [13.3, -40.5], lv: 3 },
  { k: 'roleta', label: 'Viciar a roleta', where: 'cassino (3º), roleta', s: [-2.6, -41.6], l: [-1.0, -41.6], lv: 3 },
  { k: 'helicoptero', label: 'Pôr o rastreador no helicóptero', where: 'heliponto (4º)', s: [8.0, -53.2], l: [8.0, -54.5], lv: 4 },
  { k: 'escultura', label: 'Trocar a escultura da galeria', where: 'galeria (4º), à esquerda', s: [-9.6, -52.6], l: [-9.6, -53.8], lv: 4 },
  { k: 'projetor', label: 'Trocar o rolo do projetor', where: 'topo (5º), cinema', s: [6.0, -67.8], l: [5.0, -67.8], lv: 5 },
  { k: 'antena', label: 'Sabotar a antena', where: 'topo (5º), mastro', s: [-12.0, -72.9], l: [-12.0, -74.3], lv: 5 },
];
// register a prop: acts = [[label, fx], ...]
function defProp(list, key, where, lv, s, l, acts) { list.push({ key, where, lv, s, l, acts }); }
// the small things anyone can leave on a surface, given the surface height and a spot on it
function leaveActs(y, x, z, what = 'na mesa', o = {}) {
  const r = o.r || 0.12, ry = o.ry || 0.4;
  return [
    ['Deixar um bilhete ' + what, SP('note', [x + r, y, z + r * 0.6], { ry })],
    ['Deixar uma moeda marcada ' + what, SP('coin', [x - r, y, z - r * 0.5])],
  ];
}
function tableActs(x, z, y, flameH, glassH, name) {
  const acts = [
    ['Apagar a vela da ' + name, OFF(flameH)],
    ['Trocar a vela da ' + name + ' por uma azul', GL(flameH, 0x60a0ff, 3.5)],
    ...leaveActs(y, x, z, 'na ' + name),
  ];
  if (glassH) acts.push(['Derrubar a taça da ' + name, [RO(glassH, 'x', 1.5), MV(glassH, [0, -0.03, 0.06])]]);
  else acts.push(['Derramar um drinque na ' + name, SP('puddle', [x - 0.1, y + 0.002, z + 0.1], { c: 0xd94040, s: 0.9 })]);
  return acts;
}
function plantActs(key, x, z, potH, what) {
  return [
    ['Esconder a chave no vaso ' + what, SP('key', [x + 0.12, potH, z + 0.1], { ry: 0.7 })],
    ['Enterrar o chip no vaso ' + what, SP('chip', [x - 0.14, potH, z - 0.06])],
    ['Prender um bilhete no vaso ' + what, SP('note', [x, potH, z + 0.14], { ry: 0.2 })],
    ['Regar o vaso ' + what + ' com o reagente', TI('plants|' + key + '|children|0', 0x9a86ff)],
  ];
}
function buildMap0Missions() {
  const P = []; const F = k => LEVELS[k].z1 + 0.6;
  const D = (key, where, lv, s, l, acts) => defProp(P, key, where, lv, s, l, acts);
  const LG = k => LEGACY[k];
  const legacy = (n, extra) => { const m = LEGACY[n]; D(m.k, m.where, m.lv || 0, m.s, m.l, [[m.label, m.k === 'brinde' ? { k: 'host' } : LEG(n)], ...extra]); };
  // ---- level 0: the party
  legacy(0, [
    ['Deixar um envelope na mesa do escritório', SP('envelope', [9.0, 0.8, -6.5], { ry: 0.3 })],
    ['Copiar os arquivos do laptop', [GL('laptopScreen', 0x40ff80, 1.6), SP('usb', [8.85, 0.8, -6.75])]],
    ['Apagar a luminária da mesa', [TI('desklamp', 0x15161a, 0x000000), HI('deskPool')]],
    ['Virar a cadeira do escritório', RO('officeChair', 'y', 1.1)],
    ['Deixar um charuto no escritório', SP('cigar', [9.5, 0.8, -6.4])],
  ]);
  legacy(1, [
    ['Trocar o quadro por uma cópia', TI('pic', 0x8fb0ff)],
    ['Esconder um microfilme atrás do quadro', [RO('painting', 'z', -0.1), SP('sticker', [11.3, 1.3, -9.9], { c: 0xffffff, face: 'z' })]],
    ['Marcar o quadro com giz', SP('mark', [11.8, 1.8, -9.88], { face: 'z', s: 0.35 })],
    ['Apagar a luz do quadro', HI('paintPool')],
  ]);
  legacy(2, [
    ['Trocar o livro vermelho da estante', SP('book', [14.1, 1.33, -5.6], { c: 0xc8322f })],
    ['Deixar um bilhete entre os livros', SP('note', [14.05, 1.9, -6.6], { face: 'x', s: 0.9 })],
    ['Pôr uma câmera na estante', SP('chip', [14.05, 2.44, -6.75], { ry: Math.PI / 2 })],
    ['Colar a combinação sob a prateleira', SP('sticker', [14.08, 0.78, -6.75], { c: 0xffd27a, face: 'x' })],
  ]);
  legacy(3, [
    ['Apagar a luminária do lounge', [TI('lampShade', 0x3a3a3e, 0x000000), LI('lampLight', 0), HI('lampPool')]],
    ['Trocar a lâmpada por uma vermelha', [TI('lampShade', 0xffc0c0, 0xff3030), LI('lampLight', 1.4, 0xff4040), TI('lampPoolM', 0xff5050)]],
    ['Deixar uma rosa na luminária', SP('rose', [-13.7, 0.04, 2.35], { ry: 0.6 })],
    ['Inclinar a luminária', RO('lampMesh', 'z', 0.35)],
  ]);
  legacy(4, [
    ['Trocar a garrafa do balcão', SP('bottle', [-8.3, 1.125, -6.72], { c: 0x55ff8a })],
    ['Deixar uma gorjeta marcada no balcão', SP('coin', [-6.95, 1.13, -6.62])],
    ['Derrubar a taça vermelha do balcão', [RO('barGlass|0', 'x', 1.5), MV('barGlass|0', [0, -0.03, 0.07])]],
    ['Pôr algo no drinque amarelo', TI('barGlass|1', 0x55ff8a, 0x20c050)],
    ['Apagar a luz do balcão', HI('barStrip')],
    ['Deixar um bilhete no balcão', SP('note', [-5.4, 1.13, -6.7], { ry: 0.5 })],
  ]);
  legacy(5, [
    ['Girar a estatueta', RO('statue', 'y', 0.9)],
    ['Colar um microponto na base da estatueta', SP('sticker', [11.5, 0.7, 4.62], { c: 0xffffff, face: 'z' })],
    ['Deixar uma moeda na base da estatueta', SP('coin', [11.72, 1.0, 4.78])],
    ['Apagar o spot da estatueta', HI('statuePool')],
    ['Cobrir a estatueta com um guardanapo', SP('cloth', [11.5, 1.6, 5.0], { c: 0xf6f1e8, s: 0.9 })],
  ]);
  legacy(6, [
    ['Enterrar um chip no vaso da palmeira', SP('chip', [-3.35, 0.8, 9.1])],
    ['Regar a palmeira com o reagente', TI('plants|-3.5,9|children|0', 0x9a86ff)],
    ['Deixar uma flor no vaso da palmeira', SP('rose', [-3.6, 0.8, 8.85], { ry: 1.2 })],
    ['Derramar água junto à palmeira', SP('puddle', [-3.5, 0.014, 8.0], { c: 0x5a8ad8, s: 1.3 })],
  ]);
  legacy(7, [
    ['Entregar o cartão ao anfitrião', { k: 'host' }],
    ['Pedir uma foto com o anfitrião', { k: 'host' }],
    ['Sussurrar a senha ao anfitrião', { k: 'host' }],
  ]);
  D('sofa', 'lounge, sofá', 0, [-10, 7.1], [-10, 8.1], [
    ['Esconder um envelope no sofá', SP('envelope', [-9.4, 0.47, 8.0], { ry: 0.2 })],
    ['Trocar a almofada amarela do sofá', TI('cush|0', 0xc8322f)],
    ['Deixar o celular no sofá', SP('phone', [-10.6, 0.47, 7.95], { ry: -0.3 })],
    ['Derrubar uma almofada do sofá', [RO('cush|1', 'x', 1.4), MV('cush|1', [0, -0.5, -0.75])]],
    ['Colar um grampo no braço do sofá', SP('sticker', [-7.9, 0.64, 8.1], { c: 0x15161a, face: 'up', s: 0.8 })],
  ]);
  D('mesaCentro', 'lounge, mesa de centro', 0, [-9.0, 4.0], [-10, 5], [
    ['Apagar as velas da mesa de centro', OFF('ctFlames')],
    ['Trocar o balde de gelo', TI('iceBucket', 0xd9a441)],
    ['Deixar um charuto na bandeja', SP('cigar', [-10.2, 0.47, 4.75])],
    ['Levar o livro da mesa de centro', HI(['ctBook1', 'ctBook2'])],
    ['Pôr algo na champanhe da mesa de centro', TI('ctBottle', 0x55ff8a, 0x20c050)],
    ['Deixar o anel na mesa de centro', SP('ring', [-9.6, 0.46, 5.3])],
  ]);
  D('dj', 'cabine do DJ', 0, [6.5, 7.2], [6.5, 8.3], [
    ['Trocar o pendrive do DJ', [SP('usb', [6.5, 1.03, 8.05]), GL('djLed1', 0x40ff80, 2.4)]],
    ['Apagar as luzes da cabine do DJ', HI(['djLed1', 'djLed2'])],
    ['Deixar um bilhete no toca-discos', SP('note', [6.2, 1.04, 8.1], { ry: 0.3, s: 0.8 })],
    ['Arranhar o disco do DJ', [GL('djDisk|0', 0xc8322f, 1.4), RO('djDisk|0', 'y', 1.0)]],
    ['Virar a caixa de som do DJ', RO('djSpeaker|0', 'y', 0.6)],
  ]);
  const TN = ['mesa alta perto do bar', 'mesa alta do centro', 'mesa alta perto do escritório', 'mesa alta perto do lounge', 'mesa alta perto da estatueta', 'mesa alta no canto da pista', 'mesa alta ao lado do tapete', 'mesa alta atrás da pista', 'mesa alta na beirada esquerda'];
  TABLES.forEach(([x, z], i) => { if (i === 9) return; D('mesa' + i, TN[i], 0, [x, z + 0.82], [x, z], tableActs(x, z, 1.085, 'tFlame|' + i, i % 2 ? 'tGlass|' + i : null, 'mesa alta')); });
  D('oliveira', 'oliveira perto do bar', 0, [-1.6, -8.1], [-1.6, -9.3], plantActs('-1.6,-9.3', -1.6, -9.3, 0.8, 'da oliveira'));
  D('monstera1', 'planta no meio da festa', 0, [-0.5, 5.3], [-0.5, 4.2], plantActs('-0.5,4.2', -0.5, 4.2, 0.8, 'da planta'));
  D('monstera2', 'planta ao lado do DJ', 0, [8.6, 8.0], [8.6, 9.1], plantActs('8.6,9.1', 8.6, 9.1, 0.8, 'da planta'));
  D('ripas', 'torre de ripas ao lado do bar', 0, [-2.7, -6.9], [-2.7, -8.7], [
    ['Esconder o pacote atrás das ripas', SP('envelope', [-2.0, 0.02, -7.5], { ry: 0.9, s: 1.2 })],
    ['Marcar a torre de ripas com giz', SP('mark', [-2.7, 1.3, -7.42], { face: 'z', s: 0.3 })],
    ['Prender o transmissor nas ripas', SP('chip', [-2.5, 1.0, -7.44], { ry: Math.PI / 2 })],
  ]);
  // ---- level 1: the terrace
  legacy(8, [
    ['Trocar a lente do telescópio', GL('teleLens', 0xff4040, 1.2)],
    ['Deixar um bilhete no tripé do telescópio', SP('note', [12.5, 0.02, -9.5], { ry: 0.4 })],
    ['Tampar o telescópio com um pano', SP('cloth', [12.2, 0.0, -10.2], { c: 0x1b1b1f, s: 0.7 })],
    ['Girar o telescópio para o mastro', RO('teleHead', 'y', 1.3)],
  ]);
  legacy(9, [
    ['Trocar as garrafas do cooler', SP('bottle', [-7.9, 0.5, -14.0], { c: 0x55ff8a })],
    ['Deixar um bilhete no cooler', SP('note', [-7.75, 0.5, -14.15], { ry: 0.3 })],
    ['Pintar o cooler de vermelho', TI('coolerBody', 0xc8322f)],
    ['Esconder a chave sob o cooler', SP('key', [-7.45, 0.02, -14.0], { ry: 0.5 })],
  ]);
  legacy(10, [
    ['Soltar o flamingo da piscina', MV('FLOATS|0', [-2.4, 0, 1.6])],
    ['Apagar as luzes da piscina', [LI('poolLight', 0), HI('poolPool'), TI('waterMat', 0x163a48, 0x061a20)]],
    ['Deixar uma taça na borda da piscina', SP('glass', [0.6, 0.14, -15.1], { c: 0xf2c14e })],
    ['Jogar uma moeda na piscina', SP('coin', [0.3, 0.035, -16.3])],
  ]);
  legacy(11, [
    ['Apagar o letreiro inteiro', [HI('neon'), LI('neonLight', 0)]],
    ['Trocar o fusível do letreiro por um falso', GL('breakerLamp', 0x60a0ff, 3)],
    ['Pichar o parapeito sob o letreiro', SP('mark', [7.3, 0.7, -21.58], { face: 'z', s: 0.4 })],
    ['Deixar um bilhete no quadro de força', SP('note', [6.5, 0.46, -21.5], { face: 'z', s: 0.8 })],
  ]);
  legacy(12, [
    ['Esconder a cápsula no vaso de barro', SP('chip', [12.95, 1.0, -17.75])],
    ['Levar o regador da bancada', HI(['canBody', 'canSpout'])],
    ['Trocar a terra dos vasos da bancada', TI('potSoil', 0x4040a0)],
    ['Deixar as luvas na bancada', SP('glove', [12.3, 0.84, -17.4], { ry: 0.5 })],
  ]);
  D('limoeiro', 'terraço, limoeiro', 1, [12.6, -19.7], [13.4, -19.0], [
    ['Derrubar limões do limoeiro', SP('lemons', [13.0, 0.02, -19.6])],
    ['Pendurar o transmissor no limoeiro', SP('chip', [13.1, 1.3, -18.6], { ry: Math.PI / 2 })],
    ['Esconder a carta no vaso do limoeiro', SP('envelope', [13.2, 0.6, -18.7], { ry: 0.3 })],
    ['Amarrar uma fita no limoeiro', SP('ribbon', [13.55, 1.4, -18.75])],
  ]);
  D('fogueira', 'terraço, fogueira', 1, [-10.2, -14.9], [-10.2, -16.6], [
    ['Jogar o pó na fogueira', GL('FIRE', 0x40ff80, 5)],
    ['Apagar a fogueira', [HI('FIRE'), LI('fireLight', 0), HI('firePool')]],
    ['Esconder a chave sob a almofada da fogueira', SP('key', [-8.65, 0.63, -15.75], { ry: 0.4 })],
    ['Deixar um bilhete no banco da fogueira', SP('note', [-11.85, 0.63, -15.55], { ry: -0.5 })],
    ['Deixar a garrafa junto à fogueira', SP('bottle', [-9.2, 0.02, -15.4], { c: 0x3e6b3a })],
  ]);
  D('piano', 'terraço, piano', 1, [-8.0, -11.5], [-9.5, -11.9], [
    ['Esconder a partitura no piano', SP('note', [-9.2, 1.045, -11.8], { ry: 0.3, s: 1.3 })],
    ['Apagar as velas do candelabro', OFF('pianoFlames')],
    ['Deixar um charuto no piano', SP('cigar', [-9.9, 1.045, -11.6], { ry: 0.5 })],
    ['Fechar a tampa do piano', [RO('pianoLid', 'z', -0.55), MV('pianoLid', [0.43, -0.33, 0])]],
    ['Trocar o castiçal do piano', TI('pianoCandle', 0xc9ced6)],
  ]);
  D('carrinho', 'terraço, carrinho de bar', 1, [9.0, -14.4], [9.0, -13.3], [
    ['Trocar a garrafa do carrinho de bar', SP('bottle', [8.9, 0.87, -13.0], { c: 0x55ff8a })],
    ['Deixar uma moeda no carrinho de bar', SP('coin', [9.3, 0.87, -13.5])],
    ['Derrubar o balde de gelo do carrinho', [RO('cartBucket', 'x', 1.4), MV('cartBucket', [0, -0.08, 0.12])]],
    ['Levar o champanhe do carrinho', HI('cartChamp')],
    ['Deixar um bilhete no carrinho de bar', SP('note', [9.5, 0.87, -13.05], { ry: 0.4 })],
  ]);
  D('espreguicadeiras', 'terraço, espreguiçadeiras', 1, [0.0, -10.6], [0.0, -12.5], [
    ['Trocar a toalha amarela da espreguiçadeira', TI('towels|0', 0xc8322f)],
    ['Deixar um bilhete na espreguiçadeira', SP('note', [1.2, 0.45, -13.0], { ry: 0.2 })],
    ['Esconder a chave sob a toalha azul', SP('key', [-1.0, 0.45, -12.6], { ry: 0.3 })],
    ['Virar uma espreguiçadeira', RO('loungers|2', 'y', 0.55)],
    ['Deixar os óculos escuros na espreguiçadeira', SP('glasses', [3.6, 0.45, -12.9], { ry: 0.4 })],
    ['Derramar o protetor solar no deck', SP('puddle', [2.4, 0.014, -11.5], { c: 0xfff4e0, s: 0.8 })],
  ]);
  D('mesaLateral', 'terraço, mesa lateral da piscina', 1, [2.4, -11.4], [2.4, -12.3], [
    ['Trocar o drinque da mesa lateral', TI('sideDrink|1', 0x55ff8a, 0x20c050)],
    ['Deixar um bilhete na mesa lateral', SP('note', [2.3, 0.485, -12.4], { ry: 0.6, s: 0.8 })],
    ['Deixar uma moeda na mesa lateral', SP('coin', [2.55, 0.485, -12.2])],
  ]);
  D('caixaDagua', 'terraço, caixa d\'água', 1, [-11.5, -19.3], [-13.0, -19.9], [
    ['Esconder o pacote atrás da caixa d\'água', SP('envelope', [-12.0, 0.02, -19.1], { ry: 0.8, s: 1.2 })],
    ['Trocar a luz da caixa d\'água', GL('wtLight', 0x40ff80, 4)],
    ['Pichar a caixa d\'água', SP('mark', [-12.2, 1.2, -19.1], { face: 'z', s: 0.35 })],
    ['Prender a antena na caixa d\'água', SP('chip', [-12.3, 1.5, -19.2], { ry: Math.PI / 2 })],
  ]);
  D('oliveiraDeck', 'terraço, oliveira junto ao parapeito', 1, [-8.1, -20.5], [-6.4, -21.0], plantActs('-6.4,-21', -6.4, -21.0, 0.8, 'da oliveira'));
  D('monsteraDeck', 'terraço, planta ao lado do carrinho', 1, [13.6, -13.7], [13.6, -12.6], plantActs('13.6,-12.6', 13.6, -12.6, 0.8, 'da planta'));
  const DN = ['mesa alta perto da piscina', 'mesa alta no canto do terraço', 'mesa alta entre o piano e a piscina'];
  // a primeira mesa tem um guarda-sol entre ela e o sniper: ali se fica de lado
  DECK_TABLES.forEach(([x, z], i) => D('deckMesa' + i, 'terraço, ' + DN[i], 1, i === 0 ? [x + 0.82, z] : [x, z + 0.82], [x, z], [...tableActs(x, z, 1.085, 'dFlame|' + i, null, 'mesa alta'), ['Deixar uma taça na mesa alta', SP('glass', [x + 0.17, 1.085, z - 0.1], { c: 0x9be0c0 })]]));
  // ---- level 2: the zen garden
  legacy(13, [
    ['Deixar um bilhete no pedestal do bonsai', SP('note', [-0.65, 0.7, -25.75], { ry: 0.4 })],
    ['Podar o bonsai', RO('bonsaiTrunk', 'z', 0.4)],
    ['Trocar a pedra do pedestal por uma dourada', TI('bonsaiPot', 0xd9a441)],
    ['Esconder a cápsula entre as raízes do bonsai', SP('chip', [-0.8, 0.96, -26.3])],
  ]);
  legacy(14, [
    ['Alimentar as carpas com o pó', TI('KOI|0|children|0', 0x15151a)],
    ['Jogar uma moeda no lago das carpas', SP('coin', [5.6, 0.06, -29.9])],
    ['Trocar a luz da lanterna de pedra', GL('stoneLamp|0', 0x40ff80, 1.6)],
    ['Deixar um bilhete na pedra do lago', SP('note', [4.0, 0.2, -28.5], { ry: 0.5 })],
  ]);
  D('estufa', 'jardim zen (2º), estufa', 2, [-9.0, -29.1], [-10.4, -30.2], [
    ['Trocar a muda da estufa', SP('rose', [-9.4, 0.75, -30.2], { ry: 0.3 })],
    ['Regar a estufa com o reagente', TI('ghBush', 0x9a86ff)],
    ['Esconder a cápsula no canteiro da estufa', SP('chip', [-8.6, 0.52, -30.2])],
    ['Levar o regador da estufa', HI('ghCan')],
    ['Apagar as lâmpadas da estufa', [HI('ghLamps'), LI('ghLights', 0)]],
    ['Deixar um bilhete no canteiro da estufa', SP('note', [-9.8, 0.52, -28.0], { ry: 0.2 })],
  ]);
  D('areia', 'jardim zen (2º), jardim de areia', 2, [0.5, -30.9], [0.5, -33.2], [
    ['Riscar um símbolo na areia', SP('mark', [-0.3, 0.035, -32.2], { face: 'up', s: 0.6 })],
    ['Mover a pedra do jardim de areia', MV('zenRocks|0', [0.8, 0, 0.4])],
    ['Enterrar a cápsula na areia', SP('chip', [1.0, 0.03, -32.0])],
    ['Deixar uma pedra nova na areia', SP('stone', [2.6, 0.03, -32.6])],
    ['Esconder a carta sob a pedra da areia', SP('envelope', [-1.3, 0.035, -33.2], { ry: 0.4 })],
  ]);
  D('cha', 'jardim zen (2º), balcão de chá', 2, [-10.4, -24.7], [-10.4, -23.5], [
    ['Trocar o chá da chaleira', TI('kettle', 0x2f8a4a, 0x104020)],
    ['Deixar um bilhete sob a xícara', SP('note', [-9.6, 1.062, -23.75], { ry: 0.3, s: 0.8 })],
    ['Pôr algo na xícara de chá', TI('teaCups|0', 0x9a4fd8, 0x5a2aa0)],
    ['Apagar a luz do balcão de chá', HI('teaStrip')],
    ['Deixar uma moeda no balcão de chá', SP('coin', [-11.6, 1.062, -23.4])],
    ['Derrubar uma xícara do balcão', [RO('teaCups|4', 'x', 1.5), MV('teaCups|4', [0, -0.03, 0.07])]],
  ]);
  D('yoga', 'jardim zen (2º), deck de yoga', 2, [8.0, -25.7], [10.0, -25.7], [
    ['Trocar o tapete azul de yoga', TI('yogaMats|0', 0xc8322f)],
    ['Deixar um bilhete no tapete de yoga', SP('note', [9.0, 0.045, -25.2], { ry: -0.4 })],
    ['Esconder a chave sob o tapete de yoga', SP('key', [11.0, 0.045, -24.9], { ry: 0.3 })],
    ['Deixar a garrafa d\'água no deck de yoga', SP('bottle', [9.2, 0.03, -23.6], { c: 0x6ac8c8 })],
    ['Enrolar um tapete de yoga', SC('yogaMats|2', [1, 3, 0.15])],
  ]);
  D('vasoFundo2', 'jardim zen (2º), vaso do fundo', 2, [7.6, -32.5], [7.6, -34.5], plantActs('7.6,-34.5', 7.6, -34.5, 0.8, 'do fundo do jardim'));
  for (const [x, z, nm] of [[-3.6, -28.6, 'mesa alta à esquerda'], [1.6, -28.4, 'mesa alta perto do lago']]) D('ht2_' + x, 'jardim zen (2º), ' + nm, 2, [x, z + 0.82], [x, z], [
    ['Apagar a vela da ' + nm, OFF('ht|' + x + ',' + z + '|f')], ['Trocar a vela da ' + nm + ' por uma azul', GL('ht|' + x + ',' + z + '|f', 0x60a0ff, 3.5)],
    ['Derrubar a vela da ' + nm, [RO('ht|' + x + ',' + z + '|c', 'x', 1.5), OFF('ht|' + x + ',' + z + '|f')]], ...leaveActs(1.105, x, z, 'na ' + nm)]);
  // ---- level 3: the casino
  legacy(15, [
    ['Deixar um bilhete no caixa', SP('note', [13.2, 1.115, -41.3], { ry: 0.3 })],
    ['Levar uma pilha de fichas do caixa', HI(['cashChips|0', 'cashChips|1'])],
    ['Trocar a placa do caixa', GL('cashSign', 0xff4040, 1.2)],
    ['Deixar uma moeda falsa no caixa', SP('coin', [13.2, 1.115, -39.8])],
    ['Esconder a cápsula sob o balcão do caixa', SP('chip', [12.85, 0.02, -40.2], { ry: 0.3 })],
  ]);
  legacy(16, [
    ['Trocar a bola da roleta', TI('rBall', 0xff3030, 0x800000)],
    ['Apostar as fichas marcadas', SP('chips', [0.9, 0.96, -41.2])],
    ['Deixar um bilhete sob o feltro da roleta', SP('note', [-0.2, 0.96, -41.0], { ry: 0.6, s: 0.8 })],
    ['Apagar o lustre da roleta', OFF('chand')],
    ['Derrubar as fichas da roleta', [RO('rChips|0', 'x', 1.5), MV('rChips|0', [0.1, 0, 0.1]), MV('rChips|1', [0.15, 0, -0.05])]],
  ]);
  for (const [x, z, t, nm] of [[-8.4, -40.4, 0, 'mesa de pôquer da esquerda'], [8.4, -40.8, 1, 'mesa de pôquer da direita']]) D('poker' + t, 'cassino (3º), ' + nm, 3, [x + 0.6, z + 1.5], [x, z], [
    ['Marcar as cartas da ' + nm, TI('pokerCards|' + (t * 4), 0xffe08a)],
    ['Trocar o baralho da ' + nm, SP('card', [x - 0.35, 0.885, z + 0.3], { ry: 0.3 })],
    ['Esconder a cápsula sob a ' + nm, SP('chip', [x + 0.5, 0.02, z + 0.9])],
    ['Deixar fichas marcadas na ' + nm, SP('chips', [x + 0.25, 0.885, z - 0.45])],
    ['Deixar um bilhete na ' + nm, SP('note', [x - 0.1, 0.885, z + 0.6], { ry: -0.4 })],
    ['Virar uma cadeira da ' + nm, RO('pokerChairs|' + (t * 4 + 1), 'y', 0.8)],
  ]);
  const SN = ['vermelho', 'azul', 'dourado', 'verde', 'roxo'];
  for (let i = 0; i < 5; i++) { const x = -7.2 + i * 1.3, z = F(3) - 12.9, nm = 'caça-níquel ' + SN[i]; D('slot' + i, 'cassino (3º), ' + nm, 3, [x, z + 1.1], [x, z], [
    ['Travar a alavanca do ' + nm, RO('slotLever|' + i, 'z', -1.2)],
    ['Trocar o painel do ' + nm, GL('slotWin|' + i, 0xff4040, 2.2)],
    ['Deixar uma moeda na bandeja do ' + nm, SP('coin', [x, 0.95, z + 0.34])],
    ['Colar um bilhete no ' + nm, SP('note', [x - 0.25, 1.7, z + 0.31], { face: 'z', s: 0.8 })],
    ['Desligar o ' + nm, [HI('slotWin|' + i), TI(['slotReel|' + (i * 3), 'slotReel|' + (i * 3 + 1), 'slotReel|' + (i * 3 + 2)], 0x202024, 0x000000)]],
  ]); }
  D('uisque', 'cassino (3º), bar de uísque', 3, [-12.0, -40.8], [-13.4, -40.8], [
    ['Trocar a garrafa de uísque', SP('bottle', [-13.4, 1.11, -41.6], { c: 0x55ff8a })],
    ['Deixar uma moeda no bar de uísque', SP('coin', [-13.3, 1.11, -40.0])],
    ['Apagar a luz das prateleiras de uísque', HI(['wStrip1', 'wStrip2'])],
    ['Esconder o bilhete sob o copo de uísque', SP('note', [-13.5, 1.11, -39.3], { ry: 0.4, s: 0.8 })],
    ['Pôr algo no copo de uísque', SP('glass', [-13.3, 1.11, -40.7], { c: 0x55ff8a })],
    ['Quebrar uma garrafa no bar de uísque', SP('puddle', [-12.6, 0.014, -41.0], { c: 0xd98a3a, s: 1.1 })],
  ]);
  D('palco', 'cassino (3º), palco do saxofonista', 3, [10.4, -45.4], [12.2, -46.6], [
    ['Apagar o holofote do palco', [HI('spotGlow'), LI('stageLight', 0)]],
    ['Deixar um bilhete no pedestal do microfone', SP('note', [12.9, 0.02, -46.0], { ry: 0.3 })],
    ['Trocar a cor do holofote do palco', [GL('spotGlow', 0xff4040, 5), LI('stageLight', 1.6, 0xff5050)]],
    ['Esconder a cápsula no tapete do palco', SP('chip', [11.4, 0.02, -47.4])],
    ['Deixar uma rosa no palco', SP('rose', [11.6, 0.02, -45.8], { ry: 0.8 })],
  ]);
  D('vasoSlots', 'cassino (3º), vaso ao lado dos caça-níqueis', 3, [3.5, F(3) - 11.7], [3.5, F(3) - 12.9], plantActs('3.5,' + (F(3) - 12.9), 3.5, F(3) - 12.9, 0.8, 'ao lado dos caça-níqueis'));
  for (const [x, z, nm] of [[-3.6, -37.9, 'mesa alta perto do bar de uísque'], [4.4, -37.6, 'mesa alta perto do caixa']]) D('ht3_' + x, 'cassino (3º), ' + nm, 3, [x, z + 0.82], [x, z], [
    ['Apagar a vela da ' + nm, OFF('ht|' + x + ',' + z + '|f')], ['Trocar a vela da ' + nm + ' por uma azul', GL('ht|' + x + ',' + z + '|f', 0x60a0ff, 3.5)],
    ['Derrubar a vela da ' + nm, [RO('ht|' + x + ',' + z + '|c', 'x', 1.5), OFF('ht|' + x + ',' + z + '|f')]], ...leaveActs(1.105, x, z, 'na ' + nm)]);
  // ---- level 4: the helipad
  legacy(17, [
    ['Abrir a porta do helicóptero', RO('heliDoor', 'y', 1.2)],
    ['Trocar a luz de cauda do helicóptero', GL('heliLight', 0x40ff80, 4)],
    ['Deixar um bilhete na cabine do helicóptero', SP('note', [8.65, 0.98, -54.9], { face: 'x', s: 0.8 })],
    ['Pôr o pacote no esqui do helicóptero', SP('envelope', [8.55, 0.11, -55.5], { ry: 0.1 })],
    ['Marcar o esqui do helicóptero', SP('mark', [8.6, 0.3, -55.9], { face: 'x', s: 0.25 })],
  ]);
  legacy(18, [
    ['Trocar a escultura vermelha por prata', TI('sc0', 0xc9ced6)],
    ['Virar a escultura azul', RO('sc2', 'x', 1.2)],
    ['Deixar um bilhete no pedestal da escultura', SP('note', [-9.25, 1.1, -53.5], { ry: 0.4 })],
    ['Apagar o spot da galeria', HI('plinthLights|1')],
    ['Colar um microponto no pedestal da escultura', SP('sticker', [-9.6, 0.6, -53.39], { c: 0xffffff, face: 'z' })],
  ]);
  D('cavalete', 'galeria (4º), cavalete da pintora', 4, [-10.3, -55.5], [-11.45, -56.5], [
    ['Trocar a tela do cavalete', TI('canvas', 0xff6060)],
    ['Deixar um bilhete no cavalete', SP('note', [-10.9, 0.92, -56.2], { ry: 2.5, s: 0.8 })],
    ['Deixar a paleta no chão junto ao cavalete', SP('palette', [-10.6, 0.02, -55.9])],
    ['Assinar a tela do cavalete', SP('mark', [-11.651, 1.102, -56.419], { face: 'z', ry: -0.6, rx: -0.1, s: 0.12, c: 0xc8322f })],
    ['Esconder a cápsula atrás do cavalete', SP('chip', [-11.8, 0.02, -56.9])],
  ]);
  D('xadrez', 'heliponto (4º), xadrez gigante', 4, [0.4, -54.9], [0.4, -57.0], [
    ['Mover o rei branco', MV('chess|1', [0.4, 0, 0.4])],
    ['Derrubar a rainha preta', [RO('chess|9', 'x', 1.5), MV('chess|9', [0, 0.1, 0.25])]],
    ['Trocar um peão por um dourado', TI('chess|3|children', 0xd9a441)],
    ['Esconder a cápsula sob o tabuleiro', SP('chip', [-1.3, 0.03, -55.3])],
    ['Deixar um bilhete no banquinho do xadrez', SP('note', [2.9, 0.495, -57.0], { ry: 0.4, s: 0.8 })],
    ['Deixar uma peça nova no tabuleiro', SP('stone', [1.6, 0.035, -56.6], { c: 0xd9a441 })],
  ]);
  D('galoes', 'heliponto (4º), galões de combustível', 4, [-7.4, -60.3], [-7.4, -61.5], [
    ['Trocar o galão de combustível', TI('jerry|0', 0x2e5fa8)],
    ['Levar a caixa de ferramentas', HI('toolChest')],
    ['Esconder o pacote atrás dos galões', SP('envelope', [-6.3, 0.02, -61.3], { ry: 0.6 })],
    ['Pôr um bilhete na caixa de ferramentas', SP('note', [-8.1, 0.505, -61.5], { ry: 0.3 })],
    ['Marcar o galão de combustível', SP('mark', [-6.45, 0.3, -61.39], { face: 'z', s: 0.15 })],
  ]);
  D('biruta', 'heliponto (4º), biruta', 4, [12.8, F(4) - 11.8], [13.9, F(4) - 12.9], [
    ['Trocar a biruta', TI('windsock', 0x40c060)],
    ['Amarrar uma fita no mastro da biruta', SP('ribbon', [13.9, 1.5, F(4) - 12.75])],
    ['Deixar um bilhete no mastro da biruta', SP('note', [13.6, 0.02, F(4) - 12.4], { ry: 0.5 })],
  ]);
  D('bancoMirante', 'heliponto (4º), banco do mirante', 4, [-2.0, F(4) - 2.0], [-2.0, F(4) - 0.9], [
    ['Esconder o envelope sob o banco do mirante', SP('envelope', [-2.0, 0.02, F(4) - 0.9], { ry: 0.2 })],
    ['Deixar um bilhete no banco do mirante', SP('note', [-1.2, 0.495, F(4) - 0.85], { ry: 0.3 })],
    ['Deixar os óculos escuros no banco do mirante', SP('glasses', [-2.8, 0.495, F(4) - 0.9], { ry: 0.4 })],
    ['Marcar o banco do mirante', SP('mark', [-2.0, 0.495, F(4) - 0.95], { face: 'up', s: 0.25 })],
  ]);
  D('vasoXadrez', 'heliponto (4º), vaso ao lado do tabuleiro', 4, [-4.4, F(4) - 11.6], [-4.4, F(4) - 12.8], plantActs('-4.4,' + (F(4) - 12.8), -4.4, F(4) - 12.8, 0.8, 'ao lado do tabuleiro'));
  for (const [x, z, nm] of [[-2.6, -52.0, 'mesa alta perto da galeria'], [3.4, -61.2, 'mesa alta no fundo do heliponto']]) D('ht4_' + x, 'heliponto (4º), ' + nm, 4, [x, z + 0.82], [x, z], [
    ['Apagar a vela da ' + nm, OFF('ht|' + x + ',' + z + '|f')], ['Trocar a vela da ' + nm + ' por uma azul', GL('ht|' + x + ',' + z + '|f', 0x60a0ff, 3.5)],
    ['Derrubar a vela da ' + nm, [RO('ht|' + x + ',' + z + '|c', 'x', 1.5), OFF('ht|' + x + ',' + z + '|f')]], ...leaveActs(1.105, x, z, 'na ' + nm)]);
  // ---- level 5: the top
  legacy(19, [
    ['Apagar o projetor', [HI('projGlow'), { k: 'screen', c: 0.15 }]],
    ['Trocar a lente do projetor', TI('projLens', 0xff3030, 0x800000)],
    ['Deixar um bilhete no projetor', SP('note', [5.2, 1.525, -67.6], { ry: 0.3, s: 0.8 })],
    ['Virar o projetor para o lado', RO('projBody', 'y', 0.6)],
    ['Esconder a cápsula no pedestal do projetor', SP('chip', [5.25, 0.04, -67.6])],
  ]);
  legacy(20, [
    ['Trocar o farol do mastro por azul', { k: 'beacon', c: 0x4060ff }],
    ['Pôr um bilhete na caixa de força do mastro', SP('note', [-10.5, 0.505, -74.1], { ry: 0.4 })],
    ['Prender o transmissor no mastro', SP('chip', [-11.7, 1.2, -74.0], { ry: Math.PI / 2 })],
    ['Apagar as luzes do painel do mastro', HI('mastPanel')],
    ['Marcar o mastro', SP('mark', [-12.3, 1.0, -73.95], { face: 'z', s: 0.2 })],
  ]);
  D('jacuzzi', 'topo (5º), jacuzzi', 5, [-8.2, -64.5], [-8.2, -66.8], [
    ['Jogar o corante na jacuzzi', [TI('tubMat', 0x9a4fd8, 0x5a2aa0), LI('tubLight', 0.5, 0xb070ff), TI('tubPoolM', 0xa060ff)]],
    ['Apagar a luz da jacuzzi', [LI('tubLight', 0), HI('tubPool'), TI('tubMat', 0x1a4050, 0x061a20)]],
    ['Deixar uma taça na borda da jacuzzi', SP('glass', [-6.9, 0.96, -67.6], { c: 0xf2c14e })],
    ['Trocar as toalhas da jacuzzi', TI(['tubTowel1', 'tubTowel2'], 0xc8322f)],
    ['Esconder a chave sob as toalhas da jacuzzi', SP('key', [-5.7, 0.62, -66.25], { ry: 0.4 })],
    ['Pôr algo nos drinques da bandeja', TI('tubGlass', 0x55ff8a, 0x20c050)],
  ]);
  D('pipoca', 'topo (5º), carrinho de pipoca', 5, [-13.0, -65.9], [-13.0, -64.6], [
    ['Trocar a pipoca por caramelada', TI('popcorn', 0xff8a4a)],
    ['Deixar uma moeda no carrinho de pipoca', SP('coin', [-12.4, 1.055, -65.05])],
    ['Apagar a luz do carrinho de pipoca', HI('popLamp')],
    ['Deixar um bilhete no carrinho de pipoca', SP('note', [-13.5, 1.055, -65.05], { ry: 0.3, s: 0.8 })],
    ['Levar um saco de pipoca', SP('bag', [-12.3, 0.02, -65.5], { c: 0xc8322f })],
  ]);
  D('pufes', 'topo (5º), pufes do cinema', 5, [2.7, -69.1], [2.7, -70.4], [
    ['Trocar o pufe vermelho por um preto', TI('beans|0', 0x15151a)],
    ['Esconder o envelope no pufe', SP('envelope', [3.8, 0.6, -70.2], { ry: 0.3 })],
    ['Deixar um bilhete no pufe', SP('note', [1.6, 0.6, -70.1], { ry: -0.3 })],
    ['Furar um pufe', SC('beans|1', [1.1, 0.22, 1.25])],
    ['Deixar os óculos escuros no pufe', SP('glasses', [6.0, 0.6, -70.2], { ry: 0.5 })],
  ]);
  D('sofaTopo', 'topo (5º), sofá do mirante', 5, [-4.6, -63.6], [-4.6, -64.9], [
    ['Esconder o envelope no sofá do mirante', SP('envelope', [-4.0, 0.42, -64.8], { ry: 0.2 })],
    ['Trocar o assento do sofá do mirante', TI('sofa5|0', 0x8a1f2a)],
    ['Deixar o celular no sofá do mirante', SP('phone', [-5.3, 0.42, -64.85], { ry: 0.4 })],
    ['Deixar um bilhete no sofá do mirante', SP('note', [-4.6, 0.42, -64.7], { ry: 0.3 })],
  ]);
  D('tela', 'topo (5º), tela do cinema', 5, [5.0, F(5) - 11.3], [5.0, F(5) - 12.9], [
    ['Pichar a tela do cinema', SP('mark', [3.0, 1.6, F(5) - 12.87], { face: 'z', s: 1.0 })],
    ['Esconder o pacote atrás da tela', SP('envelope', [0.6, 0.02, F(5) - 12.6], { ry: 0.3, s: 1.2 })],
    ['Apagar a luz da tela', [LI('screenLight', 0), { k: 'screen', c: 0.15 }]],
  ]);
  D('vasoTela', 'topo (5º), vaso perto da tela', 5, [-0.6, F(5) - 11.1], [-0.6, F(5) - 12.3], plantActs('-0.6,' + (F(5) - 13.5 + 1.2), -0.6, F(5) - 12.3, 0.8, 'perto da tela'));
  for (const [x, z, nm] of [[1.0, -65.6, 'mesa alta perto da jacuzzi'], [-2.2, -70.6, 'mesa alta perto do cinema']]) D('ht5_' + x, 'topo (5º), ' + nm, 5, [x, z + 0.82], [x, z], [
    ['Apagar a vela da ' + nm, OFF('ht|' + x + ',' + z + '|f')], ['Trocar a vela da ' + nm + ' por uma azul', GL('ht|' + x + ',' + z + '|f', 0x60a0ff, 3.5)],
    ['Derrubar a vela da ' + nm, [RO('ht|' + x + ',' + z + '|c', 'x', 1.5), OFF('ht|' + x + ',' + z + '|f')]], ...leaveActs(1.105, x, z, 'na ' + nm)]);
  return P;
}
// How a mission is done: a gesture (the animation everyone sees) and how long it takes. Read from the verb of the label,
// so photographing pulls out the phone, a toast raises the glass and passing a word is a chat. Guests of the computer who
// stop at an object use the same gesture and the same span, so the gesture alone never gives the agent away.
const GESTURES = {
  mexer: { anim: 2, d: [3.2, 6.0] }, // swap, hide, switch off, tip over... (long enough to cover the challenges)
  largar: { anim: 2, d: [2.0, 3.0] }, // leave or drop something small on a surface at hand height
  agachar: { anim: 21, d: [2.2, 3.2] }, // kneel to leave something on the floor (or tip over something down there)
  marcar: { anim: 14, d: [2.6, 5.0] }, // chalk, stick, write
  foto: { anim: 18, d: [2.4, 4.5] }, // phone out: photograph, copy
  brinde: { anim: 6, d: [3.0, 4.4] }, // glass up: toast, spill, spike a drink
  conversa: { anim: 4, d: [4.0, 5.6] }, // a word with someone
  regar: { anim: 19, d: [3.0, 4.2] }, // water or feed
};
const GESTURE_RX = [
  ['foto', /^(fotografar|copiar|filmar|escanear|gravar|clonar)\b/],
  ['brinde', /^(brindar|batizar|derramar|envenenar)\b|^(trocar|derrubar|pôr algo|levar)\b.*\b(taças?|copos?|canecas?|garrafas?|drinques?|caipirinhas?|champanhe|xícaras?|chá|bule|chaleira)(?=\s|$)/],
  ['conversa', /^(passar|sussurrar|entregar|cochichar|pedir|subornar|sinalizar)\b/],
  ['regar', /^(regar|alimentar)\b/],
  ['marcar', /^(marcar|colar|pichar|riscar|pintar|assinar|arranhar|prender|escrever)\b/],
  ['largar', /^(deixar|largar|esquecer|soltar|jogar|enterrar)\b/],
];
// does the act leave something on the floor? (an item spawned at most 25 cm above the level, or "no chão" in the label)
const onFloor = (label, fx) => /no chão/.test(String(label).toLowerCase()) || [].concat(fx || []).some(f => f && f.k === 'spawn' && f.at && f.at[1] < 0.25);
function gestureOf(label, fx) {
  if (fx && fx.k === 'host') return 'brinde';
  const l = String(label).toLowerCase();
  let g = 'mexer';
  for (const [k, rx] of GESTURE_RX) if (rx.test(l)) { g = k; break; }
  // leaving something on the floor (or anything the label places "no chão") is done kneeling
  return (g === 'largar' && onFloor(label, fx)) || (g === 'mexer' && /no chão/.test(l)) ? 'agachar' : g;
}
// how long mission o takes for whoever does it: a draw inside its gesture's span (u in [0, 1))
const actDur = (o, u) => { const d = GESTURES[MISSIONS[o].g].d; return d[0] + (d[1] - d[0]) * u; };
// the local player's span is fixed per round and mission, so it is never the same few seconds every time
const playerActDur = (o, rd) => actDur(o, mulberry32(((rd || 1) * 7919 + o * 104729) >>> 0)());
// The small challenge a player faces while doing an act (only they see it; guests of the computer just take the time):
//   seq    press the arrows shown, in order; a wrong one undoes a step (combinations, swaps, wiring)
//   ponto  press E when the needle crosses the band, twice; a miss costs a hit (locks, reels, a steady mark)
//   calma  hold still: the bar only fills while the sniper's laser is away from you (a photo, a phone)
//   segurar  just wait (quick drops, a toast, a word with someone)
// The challenge is drawn per round and mission, so the same mission plays differently from one round to the next.
// each gesture has more than one challenge, so the same act does not always ask for the same thing from one round to the next:
// seq = arrows in order, ponto = needle in the band, calma = steady hand (only with the laser away), girar = turn by
// alternating left and right, pulso = press on the beat a few times in a row, segurar = just hold on
const CHALLENGES = { mexer: ['seq', 'ponto', 'girar'], foto: ['calma', 'ponto'], marcar: ['ponto', 'seq', 'pulso'], largar: ['segurar', 'calma'], agachar: ['segurar', 'calma'], brinde: ['segurar', 'pulso'], conversa: ['segurar', 'pulso'], regar: ['segurar', 'girar'] };
const ARROWS = ['←', '↑', '→', '↓'], ARROW_KEYS = { arrowleft: 0, a: 0, arrowup: 1, w: 1, arrowright: 2, d: 2, arrowdown: 3, s: 3 };
const LASER_NEAR = 3; // metres: the laser this close to you makes your hands shake
// accomplices score on their own for drawing the sniper: a point per `laser` seconds with the laser on them (within `near`
// metres, at body height) and per `mark` seconds in the sniper's notebook, up to `max` a round; and once a round they can
// turn a fake mission into a distraction the sniper's radio hears like a real one. Robot accomplices use theirs on a fake
// fake mission after `botAfter` seconds of play (with chance `botP` at each, 1 = the first one)
const LURE = { near: 1.2, laser: 10, mark: 20, max: 2, botAfter: 25, botP: 1 };
const lurePts = u => u ? Math.min(LURE.max, Math.floor(u[0] / LURE.laser) + Math.floor(u[1] / LURE.mark)) : 0;
// the challenges with the face of each place: in the extra scenarios, an act whose label matches asks (most rounds)
// for that place's version of one of the five kinds, with its own title and pace; the other rounds keep the gesture's
// usual challenge, so the same act still varies. p: len = arrows in a sequence, n = turns, need/per = beats and their
// period, need/sp/w = needle hits, speed and band width
const THEMES = {
  veneza: [
    [/gôndola|píer/i, 'pulso', 'Reme no ritmo da gôndola', { per: 1.1, need: 4 }],
    [/relógio/i, 'girar', 'Gire os ponteiros', { n: 10 }],
    [/quarteto|partitura/i, 'pulso', 'Vire a página no compasso', { per: 0.85 }],
    [/lustre|murano/i, 'calma', 'Vidro de Murano: mão firme'],
    [/máscara/i, 'seq', 'Combine as máscaras', { len: 4 }],
    [/champanhe|drinque|aperol/i, 'calma', 'Sem derrubar a torre de taças'],
    [/leão/i, 'ponto', 'Enquadre o leão alado', { w: 0.17 }]],
  iate: [
    [/amarra|cunho|bandeira|mastro/i, 'girar', 'Enrole o cabo', { n: 10 }],
    [/radar|timão|comando/i, 'seq', 'Sequência do painel', { len: 5 }],
    [/holofote/i, 'ponto', 'Mire o facho', { w: 0.16 }],
    [/dj|disco/i, 'pulso', 'Na batida da DJ', { per: 0.7, need: 4 }],
    [/guarda-sol/i, 'girar', 'Gire a manivela do guarda-sol'],
    [/balde|garrafa|taça/i, 'calma', 'Sem balançar com o mar'],
    [/sushi|hashi/i, 'ponto', 'Pegue com o hashi', { sp: 3.2 }]],
  toscana: [
    [/taça|garrafa|safra|adega/i, 'calma', 'Sirva sem derramar'],
    [/torneira|tonel/i, 'girar', 'Abra a torneira devagar', { n: 10 }],
    [/cata-vento/i, 'girar', 'Gire o cata-vento'],
    [/bolo/i, 'calma', 'Mão firme no bolo'],
    [/fita|alianças/i, 'ponto', 'Corte na marca', { w: 0.16 }],
    [/pomba|gaiola/i, 'calma', 'Sem assustar a pomba'],
    [/freio|carroça/i, 'girar', 'Solte a manivela do freio'],
    [/mapa de mesas|cavalete/i, 'seq', 'Ache o lugar no mapa de mesas', { len: 4 }]],
  museu: [
    [/vitrine|gemas|estrela/i, 'seq', 'Código da vitrine', { len: 5 }],
    [/rastreador|crânio/i, 'ponto', 'Encaixe o rastreador', { w: 0.16 }],
    [/telão|lance|projeção/i, 'seq', 'Lance no teclado', { len: 4 }],
    [/cabo|guincho|baleia/i, 'girar', 'Gire o guincho', { n: 10 }],
    [/meteorito|luz/i, 'ponto', 'Corte a luz no instante certo'],
    [/magnum|champanhe/i, 'calma', 'Garrafa de 1907: mão firme'],
    [/púlpito|catálogo/i, 'pulso', 'No ritmo do martelo do leiloeiro', { per: 0.9 }]],
  kyoto: [
    [/sino/i, 'pulso', 'Toque o sino no tempo', { per: 1.25 }],
    [/omikuji|amarrar|árvore/i, 'girar', 'Dê o nó'],
    [/tiro ao alvo|shateki/i, 'ponto', 'Mire a rolha', { w: 0.15, sp: 3.0 }],
    [/peixe|pescaria/i, 'ponto', 'Pegue o peixe com o puçá', { sp: 3.2 }],
    [/lanterna|riacho/i, 'calma', 'Sem apagar a chama'],
    [/polvo|takoyaki/i, 'girar', 'Vire as bolinhas de takoyaki', { n: 8 }],
    [/omamori|amuletos|máscara/i, 'seq', 'Na ordem dos amuletos', { len: 4 }]],
  carnaval: [
    [/surdo|bateria/i, 'pulso', 'No ritmo do surdo', { per: 0.75, need: 4 }],
    [/estandarte|fitas/i, 'girar', 'Enrole as fitas'],
    [/bonde/i, 'girar', 'Solte o freio do bonde', { n: 10 }],
    [/pipa/i, 'ponto', 'Solte na rajada de vento'],
    [/grafite|muro/i, 'seq', 'Desenhe a assinatura', { len: 5 }],
    [/caipirinha/i, 'pulso', 'Macere no ritmo', { per: 0.8 }],
    [/churrasquinho|brasa|copo/i, 'calma', 'Sem se queimar'],
    [/carro de som|fio/i, 'ponto', 'Corte o fio certo', { w: 0.16 }]],
  alpes: [
    [/esqui/i, 'seq', 'Combinação do cadeado do rack', { len: 4 }],
    [/trenó|lanterna/i, 'calma', 'Mãos geladas: firmes'],
    [/rádio/i, 'ponto', 'Sintonize a frequência', { w: 0.15 }],
    [/lareira|fogueira/i, 'pulso', 'Atice o fogo no ritmo', { per: 0.9 }],
    [/holofote|gôndola/i, 'seq', 'Pisque o sinal em código', { len: 5 }],
    [/glühwein|caldeirão|caneca/i, 'girar', 'Mexa o caldeirão', { n: 10 }],
    [/jacuzzi|aquecedor/i, 'girar', 'Gire o registro'],
    [/boneco de neve/i, 'calma', 'Sem desmontar o boneco']],
  paris: [
    [/câmera|filme|fotógrafo|pódio/i, 'ponto', 'Foque a lente', { w: 0.16 }],
    [/spot|torre de luz/i, 'ponto', 'Aponte o spot'],
    [/macaron/i, 'calma', 'Sem derrubar a torre de macarons'],
    [/claraboia/i, 'girar', 'Gire a manivela da claraboia', { n: 10 }],
    [/letreiro|força/i, 'seq', 'Disjuntores na ordem', { len: 5 }],
    [/lenço|echarpe|vestido|arara|manequim/i, 'girar', 'Dê o laço'],
    [/primeira fila|cadeira/i, 'pulso', 'Entre os flashes', { per: 0.95 }]],
  marrakech: [
    [/chá|bule/i, 'calma', 'Sirva o chá do alto sem derramar'],
    [/tapete/i, 'seq', 'Ache o padrão do tapete', { len: 4 }],
    [/porta|portão|destrancar/i, 'seq', 'Gire a fechadura na ordem', { len: 5 }],
    [/incensário/i, 'calma', 'Sem espalhar a brasa'],
    [/páprica|especiarias/i, 'ponto', 'Empurre no ponto certo'],
    [/fonte/i, 'girar', 'Gire a torneira da fonte'],
    [/tajine|jantar/i, 'calma', 'Tampa quente: devagar'],
    [/lanterna|arco/i, 'pulso', 'Entre as sombras da lanterna', { per: 1.0 }]],
  expresso: [
    [/relógio/i, 'girar', 'Dê corda no relógio', { n: 12 }],
    [/sinal/i, 'ponto', 'Puxe a alavanca no ponto'],
    [/válvula|vapor|locomotiva/i, 'girar', 'Feche a válvula', { n: 10 }],
    [/palhetas|painel/i, 'seq', 'Letras do destino', { len: 5 }],
    [/mala|baú|etiqueta|bagagem/i, 'seq', 'Segredo do cadeado', { len: 4 }],
    [/jornal|banca/i, 'calma', 'Disfarce atrás do jornal'],
    [/abajur|mesa 3/i, 'calma', 'Sem balançar com o vagão'],
    [/istambul|placa/i, 'pulso', 'No balanço dos trilhos', { per: 1.0 }]]
};
const themeOf = o => { const sc = SCEN.sc && THEMES[SCEN.sc.id]; return sc && MISSIONS[o] ? sc.find(t => t[0].test(MISSIONS[o].label)) : null; };
function makeChallenge(o, rd) {
  const seed = ((rd || 1) * 31337 + o * 7907) >>> 0, r = mulberry32(seed), opts = CHALLENGES[MISSIONS[o].g] || ['segurar'];
  let k = opts[Math.floor(r() * opts.length)];
  // the place's version, three rounds in four (its own draw, so the usual challenge of other acts is unchanged)
  const th = themeOf(o), useTh = th && mulberry32(seed ^ 0x5bd1e995)() < 0.75, p = useTh ? th[3] || {} : {};
  if (useTh) k = th[1];
  const ch = k === 'seq' ? { k, keys: Array.from({ length: p.len || 3 + (r() < 0.5 ? 1 : 0) }, () => Math.floor(r() * 4)), i: 0, err: 0 }
    : k === 'ponto' ? { k, need: p.need || 2, hits: 0, ph: r() * 6.28, sp: p.sp || 2.2 + r() * 1.4, c: 0.3 + r() * 0.4, w: p.w || 0.2, miss: 0 }
    : k === 'calma' ? { k, p: 0, near: false }
    : k === 'girar' ? { k, n: p.n || 6 + (r() < 0.5 ? 2 : 0), i: 0, last: -1, err: 0 }
    : k === 'pulso' ? { k, need: p.need || 3, hits: 0, per: p.per || 0.75 + r() * 0.35, ph: r(), w: 0.26, miss: 0, lb: -1 }
    : { k };
  if (useTh) ch.tt = th[2];
  return ch;
}
// where the needle of a `ponto` challenge is (0..1) after t seconds
const needleAt = (ch, t) => 0.5 + 0.5 * Math.sin(ch.ph + t * ch.sp);
// where a `pulso` challenge is in its beat (0 just after a beat, 1 on the next one)
const beatAt = (ch, t) => (t / ch.per + ch.ph) % 1;
// how long a robot player takes on an act: the same challenge a person gets, solved at a person's pace and with a
// person's slips (a wrong arrow, a missed needle, a shaky hand), and never quicker than the gesture's span
function botActTime(o, rd, rng) {
  const ch = makeChallenge(o, rd), d = actDur(o, rng()); let t = d;
  if (ch.k === 'seq') { t = 0.6; for (let i = 0; i < ch.keys.length; i++) t += 0.45 + rng() * 0.4 + (rng() < 0.15 ? 1.0 : 0); }
  else if (ch.k === 'ponto') { const per = Math.PI * 2 / ch.sp; t = 0.5; for (let h = 0; h < ch.need; h++) { t += per * (0.3 + rng() * 0.7); while (rng() < 0.25) t += per * 0.6; } }
  else if (ch.k === 'calma') t = d * (1 + rng() * 0.8);
  else if (ch.k === 'girar') { t = 0.5; for (let i = 0; i < ch.n; i++) t += 0.22 + rng() * 0.15 + (rng() < 0.08 ? 0.6 : 0); }
  else if (ch.k === 'pulso') { t = 0.5 + ch.per; for (let h = 0; h < ch.need; h++) { t += ch.per; if (rng() < 0.2) { h = -1; t += ch.per; } if (t > 30) break; } }
  return Math.max(t, GESTURES[MISSIONS[o].g].d[0]) + 0.2;
}
// how far the challenge is (0..1); the act ends when it is complete and a minimum time has passed
function challengeProgress(a) {
  const ch = a.ch;
  if (ch.k === 'seq') return ch.i / ch.keys.length;
  if (ch.k === 'ponto') return ch.hits / ch.need;
  if (ch.k === 'calma') return ch.p;
  if (ch.k === 'girar') return ch.i / ch.n;
  if (ch.k === 'pulso') return ch.hits / ch.need;
  return Math.min(1, a.t / a.d);
}
// flatten props into the mission list (each act is a mission; `p` points back at its prop)
// the pose anyone takes for act o (its gesture's animation; 21 = kneeling to leave something on the floor)
const actAnimFor = o => MISSIONS[o] ? MISSIONS[o].ga : 2;
// the "working at an object" poses (fiddling and kneeling), held in place instead of walking
const ACT_ANIM = new Set([2, 21]);
function setMissions(props) {
  PROPS = props; MISSIONS = [];
  PROPS.forEach((P, pi) => { P.ms = []; for (const [label, fx] of P.acts) { const g = gestureOf(label, fx); P.ms.push(MISSIONS.length); MISSIONS.push({ k: P.key, label, where: P.where, s: P.s, l: P.l, lv: P.lv, p: pi, fx, host: fx && fx.k === 'host', g, ga: GESTURES[g].anim }); } });
}
const WHY = {
  agent: 'O sniper acertou o agente infiltrado.',
  acc: 'O sniper gastou o tiro num cúmplice.',
  npc: 'O sniper acertou um convidado inocente. Bônus de humilhação: cada convidado ganha 2 pontos.',
  missions: 'O agente cumpriu 4 missões sem ser pego.',
  'time-marked': 'O tempo acabou, mas o sniper tinha marcado o agente como suspeito principal.',
  time: 'O tempo acabou antes de o agente cumprir as 4 missões.',
  overtime: 'A prorrogação acabou antes da última missão do agente.',
  left: 'O sniper saiu da sala.',
};

// people with a job on the upper levels: they stand where they are and hold a pose (and a prop)
let STATICS = [
  { x: -10.8, z: -27.6, lv: 2, rot: 2.2, anim: 19, outfit: { dress: false, main: 0x5a6e3a, pants: 0x4a4a40, shirt: 0xf0ead8, tie: 0x5a6e3a, skin: 2, hair: 0x6b4a2b, hairStyle: 'short', prop: 'can', name: 'jardineiro de avental verde' } },
  { x: 0.0, z: -43.2, lv: 3, rot: 0, anim: 4, outfit: { dress: false, main: 0x7a1f2a, pants: 0x141418, shirt: 0xf6f3ec, tie: 0x111111, bow: true, skin: 1, hair: 0x1a1411, hairStyle: 'quiff', name: 'crupiê de colete vinho' } },
  { x: 12.2, z: -46.6, lv: 3, rot: -0.8, anim: 13, outfit: { dress: false, main: 0x1b1b22, pants: 0x1b1b22, shirt: 0x2a2a30, tie: 0x2a2a30, skin: 4, hair: 0x1a1411, hairStyle: 'short', beard: true, prop: 'sax', name: 'saxofonista de preto' } },
  { x: -11.0, z: -57.2, lv: 4, rot: -0.6, anim: 14, outfit: { dress: true, main: 0x2e5fa8, shirt: 0xf6f3ec, tie: 0x111111, skin: 0, hair: 0x8a3a22, hairStyle: 'bun', shoe: 0x1b1b1f, accent: 0xd9a441, prop: 'brush', name: 'pintora de avental azul' } },
  { x: 5.0, z: -57.9, lv: 4, rot: 0.9, anim: 18, outfit: { dress: false, main: 0x2a3140, pants: 0x2a3140, shirt: 0xffffff, tie: 0x111111, skin: 3, hair: 0x3b2a1e, hairStyle: 'short', glass: false, name: 'piloto de uniforme' } },
];

// ---------------------------------------------------------------- rng
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, rng) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
const rnd = mulberry32((Date.now() ^ (Math.random() * 1e9)) >>> 0);
const pick = (a, r = rnd) => a[Math.floor(r() * a.length)];

// ---------------------------------------------------------------- collision world
const COLS = [];
const col = (x0, z0, x1, z1, lv = 0) => COLS.push({ x0, z0, x1, z1, lv });
const colR = (x, z, r, lv = 0) => col(x - r, z - r, x + r, z + r, lv);
function blocked(x, z, r = RAD, lv = 0) {
  const L = LEVELS[lv] || LEVELS[0];
  if (x < L.x0 || x > L.x1 || z < L.z0 || z > L.z1) return true;
  if (!NAV.ready) navBuild();
  const N = NAV.lv[lv]; if (!N) return false;
  const i = Math.round((x - N.x0) / NAV.cell), j = Math.round((z - N.z0) / NAV.cell);
  return i < 0 || j < 0 || i >= N.nx || j >= N.nz || !!N.g[j * N.nx + i];
}
// a mover already inside furniture (sitting on a sofa, say) may always step out of it: its path leads straight to the nearest free cell
function moveC(e, vx, vz, dt) {
  const lv = e.lv || 0, L = LEVELS[lv] || LEVELS[0], inside = blocked(e.x, e.z, RAD, lv);
  const ok = (x, z) => !(x < L.x0 || x > L.x1 || z < L.z0 || z > L.z1) && (inside || !blocked(x, z, RAD, lv));
  const nx = e.x + vx * dt; if (ok(nx, e.z)) e.x = nx;
  const nz = e.z + vz * dt; if (ok(e.x, nz)) e.z = nz;
}
// waypoints are [x, z]; { link: +1, li } climbs stair li, { link: -1, li } comes down it
function routeMacro(fx, fz, flv, tx, tz, tlv) {
  const a = regionOf(fx, fz, flv), b = regionOf(tx, tz, tlv);
  if (a === b) return [[tx, tz]];
  const p = []; let cx = fx, cz = fz;
  if (a === 'office') { p.push(DOOR_IN, DOOR_OUT); cx = DOOR_OUT[0]; cz = DOOR_OUT[1]; }
  for (let lv = flv; lv < tlv; lv++) { const li = linkFor(lv, 1, cx, cz); if (li < 0) break; const L = LINKS[li]; if (lv > flv || !nearStair(fx, fz, flv)) p.push(...(L.via || [])); p.push(L.base, { link: 1, li }); cx = L.top[0]; cz = L.top[1]; }
  for (let lv = flv; lv > tlv; lv--) { const li = linkFor(lv, -1, cx, cz); if (li < 0) break; const L = LINKS[li]; p.push(L.top, { link: -1, li }, ...(L.via || []).slice().reverse()); cx = L.base[0]; cz = L.base[1]; }
  if (b === 'office') p.push(DOOR_OUT, DOOR_IN);
  p.push([tx, tz]); return p;
}
function route(fx, fz, flv, tx, tz, tlv) {
  if (!NAV.ready) navBuild();
  const out = []; let cx = fx, cz = fz, lv = flv;
  for (const w of routeMacro(fx, fz, flv, tx, tz, tlv)) {
    if (w.link) { const L = LINKS[w.li], end = w.link > 0 ? L.top : L.base; out.push(w); cx = end[0]; cz = end[1]; lv = L.lo + (w.link > 0 ? 1 : 0); continue; }
    out.push(...navPath(cx, cz, w[0], w[1], lv)); cx = w[0]; cz = w[1];
  }
  return out;
}

// ---------------------------------------------------------------- navigation grid
// Built once from the scenery itself: every solid mesh between ankle and chest height becomes a collision box, the boxes are
// rasterised (grown by the body radius) into a grid per level, and walkers plan A* paths on it that are then pulled straight.
const NAV = { cell: 0.2, lv: [], ready: false, auto: 0, tris: 0 };
function navBuild() {
  NAV.ready = true;
  const c = NAV.cell, R = RAD + 0.02;
  for (let lv = 0; lv < LV_N; lv++) {
    const L = LEVELS[lv], x0 = L.x0, z0 = L.z0, nx = Math.ceil((L.x1 - L.x0) / c) + 1, nz = Math.ceil((L.z1 - L.z0) / c) + 1;
    NAV.lv[lv] = { x0, z0, nx, nz, g: new Uint8Array(nx * nz), raw: new Uint8Array(nx * nz) };
  }
  const bb = new T.Box3(), v = [new T.Vector3(), new T.Vector3(), new T.Vector3()];
  const mark = (N, x, z) => { const i = Math.round((x - N.x0) / c), j = Math.round((z - N.z0) / c); if (i >= 0 && j >= 0 && i < N.nx && j < N.nz) N.raw[j * N.nx + i] = 1; };
  // fill the cells a world-space triangle covers (cell centres inside it, or within half a cell of an edge)
  const tri = (N, a, b, d) => {
    const minx = Math.min(a.x, b.x, d.x), maxx = Math.max(a.x, b.x, d.x), minz = Math.min(a.z, b.z, d.z), maxz = Math.max(a.z, b.z, d.z);
    const i0 = Math.max(0, Math.floor((minx - N.x0) / c)), i1 = Math.min(N.nx - 1, Math.ceil((maxx - N.x0) / c)), j0 = Math.max(0, Math.floor((minz - N.z0) / c)), j1 = Math.min(N.nz - 1, Math.ceil((maxz - N.z0) / c));
    const hc = c * 0.5;
    const segD = (px, pz, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, l2 = dx * dx + dz * dz; let t = l2 > 0 ? ((px - ax) * dx + (pz - az) * dz) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (ax + dx * t), pz - (az + dz * t)); };
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      if (N.raw[j * N.nx + i]) continue;
      const px = N.x0 + i * c, pz = N.z0 + j * c;
      const s1 = (b.x - a.x) * (pz - a.z) - (b.z - a.z) * (px - a.x), s2 = (d.x - b.x) * (pz - b.z) - (d.z - b.z) * (px - b.x), s3 = (a.x - d.x) * (pz - d.z) - (a.z - d.z) * (px - d.x);
      const inside = (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0);
      if (inside || segD(px, pz, a.x, a.z, b.x, b.z) < hc || segD(px, pz, b.x, b.z, d.x, d.z) < hc || segD(px, pz, d.x, d.z, a.x, a.z) < hc) N.raw[j * N.nx + i] = 1;
    }
  };
  scene.updateMatrixWorld(true);
  scene.traverseVisible(o => {
    if (!o.isMesh || o.isInstancedMesh || o.userData.eid !== undefined || o.userData.noCol) return;
    for (let p = o.parent; p; p = p.parent) if (p.userData.noCol) return;
    const gt = o.geometry.type; if (gt === 'PlaneGeometry' || gt === 'RingGeometry' || gt === 'CircleGeometry') return;
    bb.setFromObject(o); if (!isFinite(bb.min.x) || !isFinite(bb.max.x)) return;
    const sx = bb.max.x - bb.min.x, sz = bb.max.z - bb.min.z, sy = bb.max.y - bb.min.y;
    if ((sx > 16 && sz > 5) || sy < 0.1) return;
    const lv = lvOfY(bb.min.y); if (lv < 0 || lv >= LV_N) return;
    // only things standing on the floor count; in the extra scenarios (levels close together, big statues) hanging parts are left out
    const fy = LVY(lv); if (bb.min.y - fy > (SCEN.id ? 0.6 : 1.25) || bb.max.y - fy < 0.22 || bb.min.y - fy < -0.3) return;
    const L = LEVELS[lv]; if (bb.max.x < L.x0 + 0.1 || bb.min.x > L.x1 - 0.1) return;
    if (bb.max.z < L.z0 - 0.3 || bb.min.z > L.z1 + 0.3) return;
    const N = NAV.lv[lv], pos = o.geometry.attributes.position, idx = o.geometry.index, n = idx ? idx.count : pos.count;
    if (!pos) return;
    NAV.auto++;
    const yLo = fy + 0.22, yHi = fy + 1.25;
    for (let k = 0; k + 2 < n; k += 3) {
      for (let m = 0; m < 3; m++) { const vi = idx ? idx.getX(k + m) : k + m; v[m].fromBufferAttribute(pos, vi).applyMatrix4(o.matrixWorld); }
      const ymin = Math.min(v[0].y, v[1].y, v[2].y), ymax = Math.max(v[0].y, v[1].y, v[2].y);
      if (ymax < yLo || ymin > yHi) continue;
      NAV.tris++; tri(N, v[0], v[1], v[2]);
    }
  });
  // hand-placed boxes, then grow everything by the body radius; the outer edge is a wall too
  for (let lv = 0; lv < LV_N; lv++) {
    const N = NAV.lv[lv], L = LEVELS[lv], nx = N.nx, nz = N.nz;
    for (const b of COLS) {
      if (b.lv !== lv) continue;
      const i0 = Math.max(0, Math.ceil((b.x0 - N.x0) / c)), i1 = Math.min(nx - 1, Math.floor((b.x1 - N.x0) / c)), j0 = Math.max(0, Math.ceil((b.z0 - N.z0) / c)), j1 = Math.min(nz - 1, Math.floor((b.z1 - N.z0) / c));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) N.raw[j * nx + i] = 1;
    }
    const kr = Math.ceil(R / c), K = []; for (let dj = -kr; dj <= kr; dj++) for (let di = -kr; di <= kr; di++) if (Math.hypot(di * c, dj * c) <= R) K.push([di, dj]);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      if (!N.raw[j * nx + i]) continue;
      for (const [di, dj] of K) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < nx && jj < nz) N.g[jj * nx + ii] = 1; }
    }
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = N.x0 + i * c, z = N.z0 + j * c; if (x < L.x0 + R || x > L.x1 - R || z < L.z0 + R || z > L.z1 - R) N.g[j * nx + i] = 1; }
  }
  pullStands();
}
// a stand point that ended up inside furniture moves to the nearest walkable spot; the object slot and the ring follow
function pullStands() {
  PROPS.forEach((p, i) => {
    if (!blocked(p.s[0], p.s[1], RAD, p.lv)) return;
    const nf = navFree(p.s[0], p.s[1], p.lv); if (Math.hypot(nf[0] - p.s[0], nf[1] - p.s[1]) > 1.2) return;
    p.s = nf; for (const o of p.ms) MISSIONS[o].s = nf;
    for (const sl of SLOTS) if (sl.type === 'obj' && sl.obj === i) { sl.x = nf[0]; sl.z = nf[1]; sl.rot = Math.atan2(p.l[0] - nf[0], p.l[1] - nf[1]); }
    if (RINGS[i]) RINGS[i].position.set(nf[0], LVY(p.lv) + 0.03, nf[1]);
  });
}
const navCell = (N, x, z) => [Math.max(0, Math.min(N.nx - 1, Math.round((x - N.x0) / NAV.cell))), Math.max(0, Math.min(N.nz - 1, Math.round((z - N.z0) / NAV.cell)))];
const navFreeCell = (N, i, j) => i >= 0 && j >= 0 && i < N.nx && j < N.nz && !N.g[j * N.nx + i];
function navNearest(N, i, j, maxR = 16) {
  if (navFreeCell(N, i, j)) return [i, j];
  for (let r = 1; r <= maxR; r++) {
    let best = null, bd = 1e9;
    for (let dj = -r; dj <= r; dj++) for (let di = -r; di <= r; di++) { if (Math.max(Math.abs(di), Math.abs(dj)) !== r || !navFreeCell(N, i + di, j + dj)) continue; const d = di * di + dj * dj; if (d < bd) { bd = d; best = [i + di, j + dj]; } }
    if (best) return best;
  }
  return null;
}
// nearest walkable point to (x, z) on a level, for clicks that land on furniture
function navFree(x, z, lv) {
  if (!NAV.ready) navBuild();
  const N = NAV.lv[lv]; if (!N) return [x, z];
  const [i, j] = navCell(N, x, z); const n = navNearest(N, i, j); if (!n) return [x, z];
  return (n[0] === i && n[1] === j) ? [x, z] : [N.x0 + n[0] * NAV.cell, N.z0 + n[1] * NAV.cell];
}
function navSight(N, a, b) {
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / 0.1));
  for (let k = 0; k <= n; k++) { const x = a[0] + (b[0] - a[0]) * k / n, z = a[1] + (b[1] - a[1]) * k / n; const i = Math.round((x - N.x0) / NAV.cell), j = Math.round((z - N.z0) / NAV.cell); if (!navFreeCell(N, i, j)) return false; }
  return true;
}
// A* on the level grid from (x0, z0) to (x1, z1); returns waypoints [x, z] ending at the exact target
function navPath(x0, z0, x1, z1, lv) {
  const N = NAV.lv[lv]; if (!N) return [[x1, z1]];
  const c = NAV.cell, sC = navNearest(N, ...navCell(N, x0, z0)), tC = navNearest(N, ...navCell(N, x1, z1));
  if (!sC || !tC) return [[x1, z1]];
  if (navSight(N, [x0, z0], [x1, z1])) return [[x1, z1]];
  const nx = N.nx, n = nx * N.nz, s = sC[1] * nx + sC[0], t = tC[1] * nx + tC[0];
  const gS = new Float32Array(n).fill(1e9), fS = new Float32Array(n), par = new Int32Array(n).fill(-1), closed = new Uint8Array(n);
  const heap = []; const push = (k) => { heap.push(k); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (fS[heap[p]] <= fS[heap[i]]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = i * 2 + 1, r = l + 1; let m = i; if (l < heap.length && fS[heap[l]] < fS[heap[m]]) m = l; if (r < heap.length && fS[heap[r]] < fS[heap[m]]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  const h = (k) => { const dx = Math.abs((k % nx) - tC[0]), dz = Math.abs(Math.floor(k / nx) - tC[1]); return Math.max(dx, dz) + 0.4142 * Math.min(dx, dz); };
  gS[s] = 0; fS[s] = h(s); push(s);
  let found = false, it = 0;
  while (heap.length && it++ < 400000) {
    const k = pop(); if (k === t) { found = true; break; } if (closed[k]) continue; closed[k] = 1;
    const i = k % nx, j = (k - i) / nx;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      if (!di && !dj) continue; const ni = i + di, nj = j + dj; if (!navFreeCell(N, ni, nj)) continue;
      if (di && dj && (!navFreeCell(N, i + di, j) || !navFreeCell(N, i, j + dj))) continue; // no corner cutting
      const nk = nj * nx + ni; if (closed[nk]) continue;
      const ng = gS[k] + (di && dj ? 1.4142 : 1);
      if (ng < gS[nk]) { gS[nk] = ng; fS[nk] = ng + h(nk); par[nk] = k; push(nk); }
    }
  }
  if (!found) return [[x1, z1]];
  const cells = []; for (let k = t; k >= 0; k = par[k]) cells.push(k); cells.reverse();
  const W = k => [N.x0 + (k % nx) * c, N.z0 + Math.floor(k / nx) * c];
  // pull the string: keep the farthest cell visible from the last kept point
  const out = []; let a = [x0, z0], i = 0;
  while (i < cells.length) { let j = cells.length - 1; while (j > i && !navSight(N, a, W(cells[j]))) j--; a = W(cells[j]); out.push(a); i = j + 1; }
  const last = out[out.length - 1];
  if (Math.hypot(last[0] - x1, last[1] - z1) > 0.05) { if (out.length > 1 && navSight(N, out[out.length - 2], [x1, z1])) out.pop(); out.push([x1, z1]); }
  return out;
}

// ---------------------------------------------------------------- slots where guests hang out
const TABLES = [[-6, -3.2], [-1.2, -0.8], [3.2, -7], [-8.5, 1.0], [10.5, 0.8], [12.3, 7.5], [-5.5, 4.6], [1.0, 8.2], [-12.0, -2.4], [11.6, -4.6]];
const DECK_TABLES = [[6.3, -14.6], [-12.6, -12.4], [-6.8, -11.2]];
// what a slot type makes you do: anim id, how long guests stay, how often a guest picks it on a level that offers it
const SEAT_ANIM = { sit: 7, lie: 8, piano: 9, yoga: 11, cards: 12, tub: 15, bean: 16, chess: 17, selfie: 18, slot: 20, dance: 3 };
const SEAT_LABEL = { sit: 'Sentar', lie: 'Deitar na espreguiçadeira', piano: 'Tocar piano', yoga: 'Fazer yoga', cards: 'Jogar cartas', tub: 'Entrar na jacuzzi', bean: 'Deitar no pufe', chess: 'Jogar xadrez', selfie: 'Tirar uma selfie', slot: 'Jogar no caça-níqueis' };
const SLOT_STAY = { dance: 8, sit: 14, lie: 14, piano: 16, yoga: 18, cards: 22, tub: 22, bean: 20, chess: 24, selfie: 5, slot: 10 };
const SLOT_W = { talk: 5, dance: 3, bar: 2.5, view: 2, sit: 1.5, lie: 1, piano: 0.3, yoga: 2, cards: 2.5, tub: 2, bean: 2, chess: 1.2, selfie: 1, slot: 2 };
const SLOTS = [];
// what guests do standing at a spot, by kind of spot: each scenario's rotinas (anims 22-25 and the usual ones); the rooftop's here
const ROTINAS0 = { view: [22, 23, 0, 0] };
const rotinasFor = type => ((SCEN.id ? SCEN.sc && SCEN.sc.rotinas : ROTINAS0) || {})[type];
// a player left standing does what a guest at the nearest spot would (chat, or the scenario's routine at a view)
function idleAnimAt(x, z, lv) {
  let best = null, bd = 1.3; for (const s of SLOTS) { if (s.lv !== lv || (s.type !== 'view' && s.type !== 'talk')) continue; const d = Math.hypot(s.x - x, s.z - z); if (d < bd) { bd = d; best = s; } }
  const ro = best && best.type === 'view' ? rotinasFor('view') || [0] : rotinasFor('talk') || [4];
  return ro[Math.floor(Math.random() * ro.length)];
}
let RINGS = []; // mission rings on the floor (built once the scene exists, see buildRings)
function addSlot(x, z, fx, fz, type, obj = -1, lv = 0) { SLOTS.push({ x, z, rot: Math.atan2(fx - x, fz - z), type, obj, lv }); }
TABLES.forEach(([cx, cz], ti) => {
  const n = ti === 9 ? 3 : 4;
  for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + 0.4; addSlot(cx + Math.cos(a) * 0.85, cz + Math.sin(a) * 0.85, cx, cz, 'talk'); }
});
[-10.4, -9.3, -8.3, -6.6, -5.6, -4.6].forEach(x => addSlot(x, -5.8, x, -7, 'bar'));
for (const x of [1.9, 3.2, 4.5, 5.8, 7.1]) for (const z of [1.9, 3.2, 4.5, 5.8]) addSlot(x, z, 4.5, 4, 'dance');
[[-11.2, 6.9], [-9, 6.9], [-12.6, 4.0], [-12.6, 5.6], [-8.5, 4.2], [-10, 3.4]].forEach(([x, z]) => addSlot(x, z, -10, 5, 'talk'));
addSlot(0.5, -3.4, 1.5, -4, 'talk'); addSlot(2.5, -3.4, 1.5, -4, 'talk');
addSlot(-7.5, 9.0, -7.5, 12, 'view'); addSlot(5, 9.0, 5, 12, 'view'); addSlot(14.0, 1.5, 17, 1.5, 'view'); addSlot(-14.0, -1.0, -17, -1, 'view');
// seats on the lounge sofas (facing the way the sofa faces)
[-11.3, -10.3, -9.3, -8.3].forEach(x => addSlot(x, 8.0, x, 12, 'sit'));
[3.7, 4.7, 5.7].forEach(z => addSlot(-13.85, z, -10, z, 'sit'));
addSlot(-7.2, 6.6, -9.0, 7.6, 'sit');
// upper deck
DECK_TABLES.forEach(([cx, cz], ti) => { const n = ti === 2 ? 3 : 4; for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n + 0.9; addSlot(cx + Math.cos(a) * 0.85, cz + Math.sin(a) * 0.85, cx, cz, 'talk', -1, 1); } });
[-3.6, -1.2, 1.2, 3.6].forEach(x => addSlot(x, -12.5, x, -16, 'lie', -1, 1));
for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3 + Math.PI / 6; for (const d of [-0.5, 0.5]) { const t = a + d * 0.3; addSlot(-10.2 + Math.cos(t) * 1.95, -16.6 + Math.sin(t) * 1.95, -10.2, -16.6, 'sit', -1, 1); } }
[-11.2, -4.5, 4.5, 9.5].forEach(x => addSlot(x, -9.75, x, -6, 'view', -1, 1));
addSlot(-6.4, -15.6, 0, -17.9, 'view', -1, 1); addSlot(5.6, -16.4, 0, -16.4, 'view', -1, 1);
[8.0, 9.0, 10.0].forEach(x => addSlot(x, -12.0, x, -13.5, 'bar', -1, 1));
addSlot(-9.5, -10.55, -9.5, -12, 'piano', -1, 1);
setMissions(buildMap0Missions());
PROPS.forEach((p, i) => addSlot(p.s[0], p.s[1], p.l[0], p.l[1], 'obj', i, p.lv));
// seat heights matched to the furniture (hips above the floor) and seat spots pulled to the front edge of deep benches
for (const s of SLOTS) {
  if (s.type === 'sit' && s.lv === 0) s.hy = 0.52;
  if (s.type === 'sit' && s.lv === 1 && Math.hypot(s.x + 10.2, s.z + 16.6) < 2.3) { const a = Math.atan2(s.z + 16.6, s.x + 10.2); s.x = -10.2 + Math.cos(a) * 1.76; s.z = -16.6 + Math.sin(a) * 1.76; s.hy = 0.67; }
  if (s.type === 'cards' || s.type === 'chess' || s.type === 'piano') s.hy = 0.56;
}

// ---------------------------------------------------------------- outfits
const SUITS = [[0x1f2a44, 'terno azul-marinho'], [0x7f848c, 'terno cinza'], [0x1b1b1f, 'terno preto'], [0xece6da, 'smoking branco'], [0x5a4330, 'terno marrom'], [0x2f4a3a, 'terno verde-escuro'], [0x3b4f7a, 'terno azul'], [0xa89f8c, 'terno bege'], [0x5b2232, 'paletó bordô']];
const DRESSES = [[0xc8322f, 'vestido vermelho'], [0xe9c33b, 'vestido amarelo'], [0x1f8a78, 'vestido verde-água'], [0x2c7a4b, 'vestido verde'], [0x1b1b22, 'vestido preto'], [0xd9b77a, 'vestido dourado'], [0x6b3f8c, 'vestido roxo'], [0x2e5fa8, 'vestido azul'], [0xe7a3a9, 'vestido rosa'], [0xf1ece2, 'vestido branco']];
const SKIN = [0xf3d0b0, 0xe6b48f, 0xcf946c, 0xa36d4b, 0x7a4e33, 0x5a3725];
const HAIR = [[0x1a1411, ''], [0x3b2a1e, ''], [0x6b4a2b, ''], [0xd9b46a, ', cabelo loiro'], [0xa9a9a9, ', cabelo grisalho'], [0x8a3a22, ', cabelo ruivo']];
const TIES = [0x8b1e2d, 0x1e3a8b, 0x111111, 0xc9a227, 0x2c6e49, 0x6b3f8c];
// height and build vary by guest (from their own little random stream, so the rest of the outfit is unchanged);
// the fixed cast keeps h = 1, bw = 1 since their poses are placed by hand
function outfitFor(seed, id, st) {
  const o = outfitFor0(seed, id, st);
  const free = o.h === undefined;
  if (free) { const r = mulberry32((seed * 3571 + id * 2659 + 17) >>> 0); o.h = o.dress ? 0.94 + r() * 0.07 : 0.97 + r() * 0.08; o.bw = 0.94 + r() * 0.12; }
  // the face, from a seed of its own so outfits stay as they were: brows, nose, lipstick and blush, beard style,
  // and for the random guests (not the scripted ones) a few more hairstyles
  if (o.browW === undefined) {
    const r = mulberry32((seed * 7919 + id * 4241 + 29) >>> 0);
    o.browW = 0.7 + r() * 0.7; o.browT = -0.16 + r() * 0.3; o.nose = 0.85 + r() * 0.35;
    if (o.dress) { o.lipC = pick([0x9b3a3a, 0xb0203a, 0x7a2a48, 0xb8706a, 0xc85a78], r); o.blush = r() < 0.45; }
    else { const k = r(); o.beardStyle = o.beard ? (k < 0.5 ? 'full' : k < 0.75 ? 'goatee' : 'mustache') : k < 0.1 ? 'mustache' : ''; }
    const h = r();
    if (free && !o.hat) {
      if (!o.dress && o.hairStyle === 'short') { if (h < 0.15) o.hairStyle = 'bald'; else if (h < 0.27) o.hairStyle = 'curly'; }
      else if (o.dress && (o.hairStyle === 'long' || o.hairStyle === 'wavy') && h < 0.25) { o.hairStyle = 'curly'; o.bangs = false; }
    }
    o.eyeC = pick([0x4a2c18, 0x3a2412, 0x6b4a22, 0x2f5a7a, 0x4a6a3a, 0x5a5040], r);
  }
  return o;
}
function outfitFor0(seed, id, st) {
  const base = { satin: false, accent: 0xd9a441, shoe: 0x1b1b1f, necklace: false, earring: false, clutch: false, beard: false, bow: false, pocket: 0, glass: false, drink: 0xf2c14e, gown: false };
  if (st && id === st.bm) return Object.assign(base, { dress: false, main: 0x141418, pants: 0x141418, shirt: 0xf4f1ea, tie: 0x111111, bow: true, skin: SKIN[3], hair: 0x1a1411, hairStyle: 'short', name: 'barman' });
  if (st && id === st.ho) return Object.assign(base, { dress: false, main: 0xf3ede0, pants: 0x1b1b1f, shirt: 0xffffff, tie: 0x111111, bow: true, skin: SKIN[1], hair: 0xa9a9a9, hairStyle: 'quiff', glass: 'coupe', drink: 0xffe2a0, pocket: 0xc8322f, name: 'anfitrião de smoking branco' });
  if (st && st.sx) { const k = st.sx.indexOf(id); if (k >= 0 && STATICS[k]) { const o = Object.assign({ shirt: 0xf6f3ec, tie: 0x111111, hairStyle: 'short', hair: 0x1a1411, h: 1, bw: 1 }, base, STATICS[k].outfit); o.skin = typeof o.skin === 'number' && o.skin < 10 ? SKIN[o.skin] : (o.skin ?? SKIN[1]); return o; } }
  const r = mulberry32((seed * 7919 + id * 104729) >>> 0); r(); r();
  if (SCEN.id) {
    // the scenario's wardrobe (see guardaRoupa in each scenario): its suits, dresses, glasses and extras such as masks and hats
    const gr = (SCEN.sc && SCEN.sc.guardaRoupa) || {};
    const dress = r() < (gr.vestidoChance ?? 0.5);
    const [main, nm] = pick(dress ? (gr.vestidos || DRESSES) : (gr.ternos || SUITS), r);
    const [hair, hn] = pick(HAIR, r);
    const o = Object.assign(base, { dress, main, skin: pick(SKIN, r), hair, shirt: 0xf6f3ec, tie: pick(TIES, r) });
    if (dress) { o.gown = r() < (gr.longo ?? 0.55); o.satin = r() < 0.5; o.hairStyle = pick(['long', 'long', 'bun', 'bob', 'bun'], r); o.accent = pick([0xd9a441, 0xc9ced6, 0x1b1b1f], r); o.shoe = pick([0x1b1b1f, 0xd9a441, main], r); o.necklace = r() < 0.45; o.earring = r() < 0.7; o.clutch = r() < 0.4; }
    else { o.pants = r() < 0.75 ? main : 0x1b1b1f; o.hairStyle = pick(['short', 'quiff'], r); o.beard = r() < 0.25; o.bow = r() < 0.35; o.pocket = r() < 0.4 ? pick([0xf6f3ec, 0xc8322f, 0xd9a441], r) : 0; }
    o.glass = r() < (gr.taca ?? 0.6) ? pick(gr.tacas || ['wine', 'coupe', 'tumbler'], r) : false;
    o.drink = pick(gr.drinks || DRINKS, r);
    o.name = nm + hn;
    if (gr.extra) { try { gr.extra(o, r); } catch (e) { } }
    return o;
  }
  const dress = r() < 0.5;
  const [main, nm] = pick(dress ? DRESSES : SUITS, r);
  const [hair, hn] = pick(HAIR, r);
  const o = Object.assign(base, { dress, main, skin: pick(SKIN, r), hair, shirt: 0xf6f3ec, tie: pick(TIES, r) });
  if (dress) {
    o.gown = r() < 0.55; o.satin = r() < 0.5; o.sequin = r() < 0.3; if (o.sequin) o.satin = false;
    o.hairStyle = pick(['long', 'wavy', 'bun', 'bob', 'ponytail', 'long', 'bun', 'wavy'], r); o.bangs = o.hairStyle !== 'bun' && r() < 0.45;
    o.accent = pick([0xd9a441, 0xc9ced6, 0x1b1b1f], r); o.shoe = pick([0x1b1b1f, 0xd9a441, main], r);
    o.necklace = r() < 0.45; o.earring = r() < 0.7; o.clutch = r() < 0.4; o.bracelet = r() < 0.5 ? (r() < 0.5 ? 'L' : 'R') : false; o.sunglasses = r() < 0.15;
  } else {
    o.pants = r() < 0.75 ? main : 0x1b1b1f; o.hairStyle = pick(['short', 'quiff', 'side', 'short', 'quiff', 'side'], r);
    o.beard = r() < 0.25; o.bow = main === 0xece6da || (main === 0x1b1b1f && r() < 0.5);
    if (main === 0x1b1b1f && r() < 0.3) o.shirt = 0x2a2a30;
    o.pocket = r() < 0.4 ? pick([0xf6f3ec, 0xc8322f, 0xd9a441], r) : 0;
    o.vest = r() < 0.3 ? pick([0x2a2a30, 0x5b2232, 0x8a8f99, new T.Color(main).multiplyScalar(0.6).getHex()], r) : 0;
    o.watch = r() < 0.55 ? (r() < 0.5 ? 'gold' : 'steel') : false; o.sunglasses = r() < 0.3;
  }
  o.glass = r() < 0.6 ? pick(['wine', 'coupe', 'tumbler'], r) : false;
  o.drink = pick(DRINKS, r);
  o.name = nm + hn;
  return o;
}

// ---------------------------------------------------------------- simulation (runs on the host / solo)
class Sim {
  constructor(o) {
    this.seed = o.seed >>> 0; this.round = o.round || 1;
    this.ru = RULES[o.rule] ? o.rule : null; this.rt = this.ru === 'duas' ? 180 : ROUND_T; this.bl = this.ru === 'duas' ? 2 : 1; this.sh1 = null; this.pd = 0; this.pt = 0;
    this.ap = this.ru === 'apagao' ? Math.round(60 + mulberry32(this.seed ^ 0x2545f491)() * (this.rt - 120)) : -1; // the second of play the lights fail
    this.demo = !!o.demo; this.map = o.map ?? SCEN.id; this.night = !!o.night; this.lg = [];
    const rng = this.rng = mulberry32(this.seed);
    this.ph = this.demo ? 'demo' : 'brief'; this.t = this.demo ? 0 : BRIEF_T; this.time = 0;
    this.slots = SLOTS.map(s => ({ ...s, busy: -1 }));
    const guests = o.guests || [];
    // as many guests as the map asks for, as long as there are spots for everybody to stand
    const freeN = SLOTS.filter(s => s.type !== 'obj').length;
    const nN = Math.max(4, Math.min(SCEN.id ? (SCEN.sc.convidados || 28) : NPC_N, freeN - guests.length - 4));
    const total = nN + 2 + STATICS.length + guests.length;
    const ids = shuffle([...Array(total).keys()], rng);
    this.ents = new Array(total);
    let k = 0;
    const mk = (id, extra) => (this.ents[id] = Object.assign({ id, x: 0, z: 0, y: 0, lv: 0, lk: null, rot: 0, anim: 0, dead: false, kind: 'npc', role: 'npc', peer: null, speed: 1.25 + rng() * 0.3, st: 'idle', timer: rng() * 4, path: [], slot: -1, obj: -1, ov: 0, prog: 0, stuck: 0, lastD: 1e9, todo: [], waitFor: -1 }, extra));
    this.bm = ids[k++]; this.ho = ids[k++];
    if (SCEN.id) {
      // in the extra scenarios the barman and the host stand at two talk spots of the ground level
      const picks = []; this.slots.forEach((s, i) => { if (s.type === 'talk' && s.lv === 0 && picks.length < 2) picks.push(i); });
      [this.bm, this.ho].forEach((id, n) => { const si = picks[n]; if (si === undefined) { mk(id, { x: 0, z: 0, rot: 0, kind: 'static', anim: 4 }); return; } const s = this.slots[si]; s.busy = id; mk(id, { x: s.x, z: s.z, lv: s.lv, y: LVY(s.lv), rot: s.rot, kind: 'static', anim: 4, slot: si }); });
    } else {
      mk(this.bm, { x: -7.5, z: -8.4, rot: 0, kind: 'static', anim: 4 });
      mk(this.ho, { x: 1.5, z: -4.0, rot: 0, kind: 'static', anim: 4 });
    }
    this.sx = STATICS.map(d => { const id = ids[k++]; mk(id, { x: d.x, z: d.z, lv: d.lv, y: LVY(d.lv) + (d.y || 0), rot: d.rot, kind: 'static', anim: d.anim }); return id; });
    this.pm = {}; this.rl = {}; this.nm = {};
    // the agent's missions sit on three neighbouring levels, so the round is about moving between floors, not crossing all six
    const b0 = Math.floor(rng() * Math.max(1, LV_N - 2));
    // one act per prop, so the six missions of a round are spread over different objects
    this.ms = []; { const used = new Set(); let order = shuffle(MISSIONS.map((_, i) => i).filter(i => MISSIONS[i].lv >= b0 && MISSIONS[i].lv <= b0 + 2), rng);
      if (SCEN.id) { const nat = order.filter(i => MISSIONS[i].fx && MISSIONS[i].fx.k === 'scen'), gen = order.filter(i => !(MISSIONS[i].fx && MISSIONS[i].fx.k === 'scen')); order = nat.slice(0, 4).concat(gen, nat.slice(4)); }
      for (const i of order) { const p = MISSIONS[i].p; if (used.has(p)) continue; used.add(p); this.ms.push(i); if (this.ms.length >= MS_N) break; } }
    // one mission of the round needs a parcel fetched first from another object (fetching it leaves no trace)
    this.ts = null; this.got = false;
    if (this.ms.length) {
      const o = this.ms[Math.floor(rng() * this.ms.length)], m = MISSIONS[o], used = new Set(this.ms.map(i => MISSIONS[i].p));
      const far = PROPS.map((_, i) => i).filter(i => !used.has(i) && Math.abs(PROPS[i].lv - m.lv) <= 1 && Math.hypot(PROPS[i].s[0] - m.s[0], PROPS[i].s[1] - m.s[1]) > 5);
      const cands = far.length ? far : PROPS.map((_, i) => i).filter(i => !used.has(i) && Math.abs(PROPS[i].lv - m.lv) <= 1);
      if (cands.length) this.ts = [o, pick(cands, rng)];
    }
    this.agentId = -1;
    for (const g of guests) {
      const id = ids[k++];
      mk(id, { kind: g.bot ? 'bot' : 'player', role: g.role === 'a' ? 'agent' : 'acc', peer: g.peer || null, speed: g.bot ? 1.3 + rng() * 0.25 : P_SPEED });
      if (g.role === 'a') this.agentId = id;
      if (g.peer) { this.pm[g.peer] = id; this.rl[g.peer] = g.role; this.nm[g.peer] = g.name || 'Jogador'; }
      if (g.bot) this.ents[id].todo = g.role === 'a' ? shuffle(this.ms.slice(), rng) : [];
    }
    while (k < total) mk(ids[k++]);
    this.sniper = o.sniper || null;
    if (this.sniper && this.sniper.peer) { this.rl[this.sniper.peer] = 's'; this.nm[this.sniper.peer] = this.sniper.name || 'Sniper'; }
    // spawn on free non-object slots
    const free = shuffle(this.slots.map((s, i) => i).filter(i => this.slots[i].type !== 'obj'), rng);
    for (const e of this.ents) {
      if (e.kind === 'static') continue;
      // players start on the two lower levels, where the stair up is easy to find
      let si = -1;
      if (e.kind === 'player') { const j = free.findIndex(i => this.slots[i].lv <= 1 && this.slots[i].type === 'talk'); si = j >= 0 ? free.splice(j, 1)[0] : free.pop(); }
      else si = free.pop();
      const s = this.slots[si];
      e.x = s.x; e.z = s.z; e.lv = s.lv; e.y = LVY(s.lv); e.rot = s.rot; e.slot = si; s.busy = e.id; this.arrive(e, true);
      if (e.kind === 'player') { s.busy = -1; e.slot = -1; e.anim = 0; }
    }
    this.dn = []; this.tells = []; this.tq = []; this.sh = null; this.w = null; this.why = null; this.mk = []; this.ot = 0;
    this.lu = {}; this.dz = []; this.laser = null; // accomplices: seconds under the laser and in the notebook, who used the distraction
    this.sc = o.sc || {};
    this.near = PROPS.map(() => new Map());
    // the object spot of each prop, so a guest standing there can make way for a player who comes close
    this.propSlot = PROPS.map((_, i) => this.slots.findIndex(s => s.type === 'obj' && s.obj === i)); this.yieldT = 0;
    this.ai = this.sniper && this.sniper.ai ? new AISniper(this) : null;
    this._st = null;
  }
  arrive(e, initial) {
    const s = this.slots[e.slot];
    e.trot = s.type === 'dance' ? this.rng() * Math.PI * 2 : s.rot;
    if (initial) e.rot = e.trot;
    if (s.type === 'obj' && !initial) {
      e.st = 'act'; e.obj = e.wantM >= 0 && MISSIONS[e.wantM].p === s.obj ? e.wantM : PROPS[s.obj].ms[Math.floor(this.rng() * PROPS[s.obj].ms.length)]; e.anim = MISSIONS[e.obj].ga;
      // everyone (bots, guests, the players) takes a span drawn from the gesture of the act
      e.timer = e.kind === 'bot' ? botActTime(e.obj, this.round, this.rng) : actDur(e.obj, this.rng());
      return;
    }
    e.st = 'idle'; e.obj = -1;
    e.timer = (SLOT_STAY[s.type] || 6) + this.rng() * 14 + (initial ? this.rng() * 6 : 0);
    // a robot agent mingles a little between missions, like a person would, but not for half a minute
    if (e.kind === 'bot' && e.role === 'agent' && !initial) e.timer = Math.min(e.timer, e.waitFor >= 0 ? 3 + this.rng() * 4 : 4 + this.rng() * 8);
    e.anim = s.type === 'talk' ? 4 : s.type === 'bar' ? (this.rng() < 0.5 ? 6 : 4) : (SEAT_ANIM[s.type] ?? 0);
    const ro = s.type !== 'bar' && rotinasFor(s.type); if (ro && (e.anim === 0 || e.anim === 4)) e.anim = ro[Math.floor(this.rng() * ro.length)];
  }
  pickNext(e) {
    const rng = this.rng;
    let want = -1;
    if (e.kind === 'bot' && this.ph === 'play') {
      if (e.role === 'agent') {
        // the delivery of the two-step mission waits for the parcel: aim for the parcel first
        const fetchFirst = o => this.ts && !this.got && o === this.ts[0] ? PROPS[this.ts[1]].ms[0] : o;
        // like a person with the list in hand: mostly the closest pending mission (a floor away counts as a long walk),
        // now and then another one, so a human sniper in training cannot read the route
        const nearest = os => os.reduce((b, o) => { const m = MISSIONS[o], c = Math.hypot(m.s[0] - e.x, m.s[1] - e.z) + 8 * Math.abs(m.lv - e.lv); return c < b[1] ? [o, c] : b; }, [os[0], 1e9])[0];
        if (e.waitFor >= 0 && (e.todo.includes(e.waitFor) || (this.ts && !this.got && MISSIONS[e.waitFor].p === this.ts[1]))) want = fetchFirst(e.waitFor); else if (e.todo.length && rng() < 0.8) want = fetchFirst(rng() < 0.75 ? nearest(e.todo.map(fetchFirst)) : e.todo[Math.floor(rng() * e.todo.length)]); e.waitFor = -1;
      }
      else if (rng() < 0.4) want = Math.floor(rng() * MISSIONS.length);
    } else if (rng() < 0.15) want = Math.floor(rng() * MISSIONS.length); // guests stop at objects often enough to hide the agent
    let si = -1;
    e.wantM = -1;
    if (want >= 0) {
      const i = this.slots.findIndex(s => s.type === 'obj' && s.obj === MISSIONS[want].p);
      if (i >= 0 && this.slots[i].busy < 0) { si = i; e.wantM = want; }
      // someone is at the object: a robot agent does something else for a moment and comes back to it, instead of giving up
      // (hanging around the object would give it away)
      else if (i >= 0 && e.kind === 'bot' && e.role === 'agent') e.waitFor = want;
    }
    if (si < 0) {
      // mostly stay on the current level (and do whatever this level offers) so the stairs do not jam
      const sameLv = rng() < 0.82;
      let cands = [];
      if (sameLv) {
        const here = this.slots.filter(s => s.lv === e.lv && s.busy < 0 && s.type !== 'obj');
        const types = [...new Set(here.map(s => s.type))]; const w = types.map(t => SLOT_W[t] || 1); const tot = w.reduce((a, b) => a + b, 0);
        let r = rng() * tot, type = types[0]; for (let i = 0; i < types.length; i++) { r -= w[i]; if (r <= 0) { type = types[i]; break; } }
        this.slots.forEach((s, i) => { if (s.type === type && s.busy < 0 && s.lv === e.lv) cands.push(i); });
      } else {
        const r = rng(); const type = r < 0.3 ? 'talk' : r < 0.42 ? 'dance' : r < 0.52 ? 'bar' : r < 0.6 ? 'view' : r < 0.66 ? 'sit' : r < 0.7 ? 'lie' : r < 0.74 ? 'yoga' : r < 0.8 ? 'cards' : r < 0.85 ? 'tub' : r < 0.9 ? 'bean' : r < 0.94 ? 'chess' : r < 0.98 ? 'slot' : 'selfie';
        this.slots.forEach((s, i) => { if (s.type === type && s.busy < 0 && Math.abs(s.lv - e.lv) <= 2) cands.push(i); });
      }
      if (!cands.length) this.slots.forEach((s, i) => { if (s.type === 'talk' && s.busy < 0 && s.lv === e.lv) cands.push(i); });
      if (!cands.length) { e.timer = 2; return; }
      let best = -1, bd = 1e9;
      for (let n = 0; n < 3; n++) { const i = pick(cands, rng); const s = this.slots[i]; const d = Math.hypot(s.x - e.x, s.z - e.z) + (s.lv !== e.lv ? 12 : 0) + rng() * 6; if (d < bd) { bd = d; best = i; } }
      si = best;
    }
    if (e.slot >= 0 && this.slots[e.slot].busy === e.id) this.slots[e.slot].busy = -1;
    e.slot = si; this.slots[si].busy = e.id;
    const s = this.slots[si];
    e.path = route(e.x, e.z, e.lv, s.x, s.z, s.lv); e.st = 'walk'; e.anim = 1; e.stuck = 0; e.lastD = 1e9; e.rerouted = false;
  }
  // A guest of the computer at an object finishes the gesture and leaves within a few seconds when any player (or robot
  // player) comes close, so the object is free again; every player gets this, not just the agent, so it gives nothing away.
  makeWay() {
    for (const p of this.ents) {
      if (p.dead || (p.kind !== 'player' && p.kind !== 'bot') || p.lk) continue;
      PROPS.forEach((m, pi) => {
        const si = this.propSlot[pi]; if (si < 0) return;
        const sl = this.slots[si]; if (sl.busy < 0 || sl.busy === p.id || Math.abs(p.y - LVY(m.lv)) > 0.5 || Math.hypot(p.x - sl.x, p.z - sl.z) > 2.2) return;
        const g = this.ents[sl.busy]; if (!g || g.kind !== 'npc') return;
        if (g.st === 'act') g.timer = Math.min(g.timer, 0.8 + this.rng() * 1.7);
        else if (g.st === 'idle' && g.slot === si) g.timer = Math.min(g.timer, 0.4);
      });
    }
  }
  // is the entrance of stair li free for someone starting in direction dir?
  stairFree(li, dir, me) {
    for (const o of this.ents) if (o !== me && o.lk && o.lk.li === li && ((dir > 0 && o.lk.s < 0.1) || (dir < 0 && o.lk.s > 0.9))) return false;
    return true;
  }
  // advance an entity along its stair; returns true while still on it
  stepLink(e, speed, dt) {
    const l = e.lk; l.s += l.dir * speed * dt / ((LINKS[l.li] && LINKS[l.li].len) || LINK_LEN);
    const done = l.dir > 0 ? l.s >= 1 : l.s <= 0;
    const s = Math.max(0, Math.min(1, l.s)), p = linkPos(s, l.li), q = linkPos(Math.max(0, Math.min(1, s + l.dir * 0.01)), l.li);
    e.x = p.x; e.y = p.y; e.z = p.z; e.rot = lerpAngle(e.rot, Math.atan2(q.x - p.x, q.z - p.z), 1 - Math.exp(-dt * 12)); e.anim = 1;
    if (done) { e.lv = LINKS[l.li].lo + (l.dir > 0 ? 1 : 0); e.y = LVY(e.lv); e.lk = null; }
    return !done;
  }
  stepAI(e, dt) {
    if (e.dead) return;
    if (e.ov > 0) { e.ov -= dt; if (e.ov <= 0) e.anim = e.ovA !== undefined ? e.ovA : e.kind === 'static' ? 4 : e.anim === 6 ? 4 : e.anim; e.ovA = e.ov > 0 ? e.ovA : undefined; }
    if (e.kind === 'static') return;
    if (e.st === 'climb') {
      if (!this.stepLink(e, e.speed * 1.15, dt)) { e.st = 'walk'; e.stuck = 0; e.lastD = 1e9; const g = this.slots[e.slot]; if (!e.path.length) this.pickNext(e); else if (g && !e.path.some(w => w.link)) e.path = route(e.x, e.z, e.lv, g.x, g.z, g.lv); }
      return;
    }
    if (e.st === 'walk') {
      const wp = e.path[0];
      if (!wp) { this.pickNext(e); return; }
      if (wp.link) {
        if (!this.stairFree(wp.li, wp.link, e)) { e.anim = 0; e.stuck += dt; if (e.stuck > 8) { e.path.shift(); e.stuck = 0; } return; }
        e.path.shift(); e.st = 'climb'; e.lk = { dir: wp.link, s: wp.link > 0 ? 0 : 1, li: wp.li }; e.anim = 1; return;
      }
      const dx = wp[0] - e.x, dz = wp[1] - e.z, d = Math.hypot(dx, dz), last = e.path.length === 1 || !!(e.path[1] && e.path[1].link);
      if (d < 0.12) { e.path.shift(); if (!e.path.length) { e.x = wp[0]; e.z = wp[1]; this.arrive(e); } return; }
      const sp = e.speed * (last && d < 0.7 ? Math.max(0.5, d / 0.7) : 1);
      const vx = dx / d * sp, vz = dz / d * sp;
      // the last metre into a seat or up to a table is walked straight in (the spot itself may sit inside furniture)
      const goalS = this.slots[e.slot], dl = goalS && goalS.type === 'tub' ? 2.0 : 0.9;
      if (last && d < dl) { e.x += vx * dt; e.z += vz * dt; } else moveC(e, vx, vz, dt);
      e.rot = lerpAngle(e.rot, Math.atan2(vx, vz), 1 - Math.exp(-dt * 10));
      e.stuck += dt;
      if (e.stuck > 1.5) {
        if (d > e.lastD - 0.15) {
          const goal = this.slots[e.slot];
          if (goal && !e.rerouted) { e.rerouted = true; e.path = route(e.x, e.z, e.lv, goal.x, goal.z, goal.lv); }
          else if (e.path.length > 1 && !e.path[1].link) e.path.shift(); else this.pickNext(e);
        }
        e.lastD = d; e.stuck = 0;
      }
    } else if (e.st === 'act') {
      if (e.trot !== undefined) e.rot = lerpAngle(e.rot, e.trot, 1 - Math.exp(-dt * 7));
      e.timer -= dt;
      if (e.timer <= 0) {
        if (e.kind === 'bot') {
          if (e.role === 'agent') { this.completeAct(e.id, e.obj); e.todo = e.todo.filter(o => o !== e.obj); }
          else if (e.obj >= 0) this.completeAct(e.id, e.obj);
        }
        e.st = 'idle'; e.anim = 0; e.timer = 1.5 + this.rng() * 3;
      }
    } else {
      if (e.trot !== undefined) e.rot = lerpAngle(e.rot, e.trot, 1 - Math.exp(-dt * 7));
      // now and then a guest standing about kneels for a moment (a dropped napkin, a shoelace): the same pose as leaving
      // something on the floor for a mission, so kneeling alone does not give the agent away
      if (e.ov <= 0 && (e.anim === 0 || e.anim === 4) && this.ph !== 'reveal' && this.rng() < dt * 0.02) { e.ovA = e.anim; e.anim = 21; e.ov = 2.2 + this.rng() * 1.5; }
      e.timer -= dt;
      if (e.timer <= 0 && e.ov <= 0) this.pickNext(e);
    }
  }
  setPlayer(id, x, z, rot, anim, y = 0) {
    const e = this.ents[id]; if (!e || e.dead || e.kind !== 'player') return;
    e.x = x; e.z = z; e.y = y; e.lv = lvOfY(y); e.rot = rot; e.anim = anim;
  }
  logAct(e, obj, real, fetch, fake) {
    if (this.lg.length < 40 && (e.kind === 'player' || e.kind === 'bot') && MISSIONS[obj]) this.lg.push([Math.round(this.rt - this.t), e.id, obj, real ? 1 : fetch ? 2 : fake ? 3 : 0]);
  }
  // an accomplice's distraction: the radio hears another change at the same object, a moment later, like a real mission
  // (a change no mission of the agent's makes, and not one already heard). Once a round per accomplice
  distract(e, obj) {
    if (this.dz.includes(e.id)) return -1;
    const heard = o => this.ms.includes(o) || this.tells.includes(o) || this.tq.some(q => q.obj === o);
    const pool = PROPS[MISSIONS[obj].p].ms.filter(o => !heard(o)); if (!pool.length) return -1;
    const o = pool.includes(obj) ? obj : pool[Math.floor(this.rng() * pool.length)];
    this.dz.push(e.id); this.tq.push({ obj: o, at: this.time + 0.8 + this.rng() * 4.5 }); this._st = null;
    return o;
  }
  completeAct(id, obj, d) {
    const e = this.ents[id];
    if (e && !e.dead && this.ph === 'play' && e.role === 'acc' && MISSIONS[obj]) {
      const m = MISSIONS[obj];
      if (Math.hypot(e.x - m.s[0], e.z - m.s[1]) <= IR + 0.8 && Math.abs(e.y - LVY(m.lv)) <= 0.5) {
        const want = d || (e.kind === 'bot' && this.rt - this.t > LURE.botAfter && !this.dz.includes(id) && this.rng() < LURE.botP);
        const o = want ? this.distract(e, obj) : -1;
        this.logAct(e, o >= 0 ? o : obj, false, false, o >= 0);
      }
    }
    if (!e || e.dead || this.ph !== 'play' || e.role !== 'agent') return;
    const m = MISSIONS[obj]; if (!m || Math.hypot(e.x - m.s[0], e.z - m.s[1]) > IR + 0.8 || Math.abs(e.y - LVY(m.lv)) > 0.5) return;
    if (this.ts && !this.got && m.p === this.ts[1]) { this.got = true; this.logAct(e, obj, false, true); return; }
    if (this.ts && obj === this.ts[0] && !this.got) { this.logAct(e, obj, false); return; }
    if (!this.ms.includes(obj) || this.dn.includes(obj)) { this.logAct(e, obj, false); return; }
    this.logAct(e, obj, true);
    this.dn.push(obj);
    this.tq.push({ obj, at: this.time + 0.8 + this.rng() * 4.5 });
    if (this.prog() >= NEED) this.end('g', 'missions');
  }
  // missions that count: with the pair rule, 3 at objects plus the contact with an accomplice
  prog() { return this.ru === 'dupla' ? Math.min(this.dn.length, NEED - 1) + this.pd : this.dn.length; }
  shoot(id) {
    if (this.ph !== 'play' || this.sh) return;
    const e = this.ents[id]; if (!e || e.dead) return;
    const t = Math.round(this.rt - this.t); e.dead = true; e.anim = 5; e.st = 'dead';
    // the room reacts to the shot: those standing close duck for a moment, everyone near turns to look
    for (const o of this.ents) {
      if (o.dead || o.kind === 'player' || Math.abs((o.y || 0) - (e.y || 0)) > 0.5 || ![0, 1, 3, 4, 6, 22, 23, 24, 25].includes(o.anim)) continue;
      const d = Math.hypot(o.x - e.x, o.z - e.z); if (d > 9) continue;
      if (o.kind !== 'static') { if (o.st === 'walk') { o.st = 'idle'; o.path = []; } o.timer = Math.max(o.timer || 0, 5 + this.rng() * 3); o.trot = Math.atan2(e.x - o.x, e.z - o.z); }
      if (d < 4.5) { o.ovA = o.anim === 1 ? 0 : o.anim; o.anim = 21; o.ov = 1.6 + this.rng() * 1.6; } else if (o.anim === 1 || o.anim === 3) o.anim = 0;
    }
    const why = e.role === 'agent' ? 'agent' : e.role === 'acc' ? 'acc' : 'npc';
    // a miss with a bullet left: that person drops and the round goes on
    if (why !== 'agent' && this.bl > 1) { this.bl--; this.sh1 = { e: id, t, why }; this._st = null; return; }
    this.sh = { e: id, t }; this.bl = 0;
    this.end(why === 'agent' ? 's' : 'g', why);
  }
  end(w, why) {
    if (this.ph === 'reveal') return;
    this.ph = 'reveal'; this.w = w; this.why = why; this.t = 0;
    for (const [peer, r] of Object.entries(this.rl)) {
      if ((w === 's' && r === 's') || (w === 'g' && r !== 's')) this.sc[peer] = (this.sc[peer] || 0) + (why === 'npc' ? 2 : 1);
      if (r === 'c') { const n = lurePts(this.lu[this.pm[peer]]); if (n) this.sc[peer] = (this.sc[peer] || 0) + n; }
    }
  }
  tick(dt) {
    if (this.map !== SCEN.id) return; // the scene is still being swapped
    this.time += dt; this._st = null;
    if (this.ph === 'brief') { this.t -= dt; if (this.t <= 0) { this.ph = 'play'; this.t = this.rt; } }
    else if (this.ph === 'play') {
      this.t -= dt;
      // out of time the sniper wins (doing nothing never wins the agent the round); an agent one mission short gets one overtime
      if (this.t <= 0) { if (!this.ot && this.prog() >= NEED - 1) { this.ot = 1; this.t = OT_T; } else { this.t = 0; this.end('s', this.ot ? 'overtime' : 'time'); } }
    }
    for (const e of this.ents) if (e.kind !== 'player') this.stepAI(e, dt);
    if (this.ph === 'play' && (this.yieldT -= dt) <= 0) { this.yieldT = 0.5; this.makeWay(); }
    // keep people from overlapping
    const E = this.ents;
    for (let i = 0; i < E.length; i++) for (let j = i + 1; j < E.length; j++) {
      const a = E[i], b = E[j]; if (a.dead || b.dead || a.lk || b.lk || Math.abs(a.y - b.y) > 0.5) continue;
      const dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz;
      if (d2 < 0.42 && d2 > 1e-6) {
        const d = Math.sqrt(d2), push = (0.65 - d) * 0.5 * Math.min(1, dt * 8), nx = dx / d * push, nz = dz / d * push;
        if ((a.kind === 'npc' || a.kind === 'bot') && a.st !== 'idle') { if (!blocked(a.x - nx, a.z - nz, RAD, a.lv)) { a.x -= nx; a.z -= nz; } }
        if ((b.kind === 'npc' || b.kind === 'bot') && b.st !== 'idle') { if (!blocked(b.x + nx, b.z + nz, RAD, b.lv)) { b.x += nx; b.z += nz; } }
      }
    }
    if (this.ph === 'play') {
      PROPS.forEach((m, i) => { for (const e of E) if (!e.dead && Math.abs(e.y - LVY(m.lv)) < 0.5 && Math.hypot(e.x - m.s[0], e.z - m.s[1]) < 2.2) this.near[i].set(e.id, this.time); });
      for (let i = this.tq.length - 1; i >= 0; i--) {
        const q = this.tq[i];
        if (q.at <= this.time) {
          this.tq.splice(i, 1); this.tells.push(q.obj);
          if (MISSIONS[q.obj].host) { const h = E[this.ho]; h.anim = 6; h.ov = 2.6; }
          if (this.ai) this.ai.onTell(q.obj);
        }
      }
      if (this.ai) this.ai.update(dt);
      // the pair rule: the agent stands beside a living accomplice for PAIR_T s in a row
      if (this.ru === 'dupla' && !this.pd) {
        const a = E[this.agentId], near = a && !a.dead && E.some(e => e.role === 'acc' && !e.dead && Math.abs(e.y - a.y) < 0.5 && Math.hypot(e.x - a.x, e.z - a.z) < PAIR_D);
        this.pt = near ? this.pt + dt : 0;
        if (this.pt >= PAIR_T) { this.pd = 1; if (this.prog() >= NEED) this.end('g', 'missions'); }
      }
      // accomplices drawing the sniper: time with the laser on them and time in the notebook
      const L = this.ai ? this.ai.aim : this.laser;
      for (const e of E) {
        if (e.role !== 'acc' || e.dead) continue;
        const u = this.lu[e.id] || (this.lu[e.id] = [0, 0]);
        if (L && Math.abs(L.y - (e.y + 1.1)) < 1.4 && Math.hypot(L.x - e.x, L.z - e.z) < LURE.near) u[0] += dt;
        if (this.mk.includes(e.id)) u[1] += dt;
      }
      this.track(dt);
    }
  }
  // for the reveal's replay: the agent's path (a point every 2 s) and each time the laser landed on the agent.
  // Only the host's sim tracks; the reveal broadcast carries it.
  track(dt) {
    if (this.demo) return;
    this.tr = this.tr || []; this.lp = this.lp || []; this.trT = (this.trT || 0) - dt;
    const ag = this.ents[this.agentId];
    if (ag && this.trT <= 0 && this.tr.length < 480) { this.trT = 2; this.tr.push(Math.round(ag.x * 10), Math.round(ag.z * 10), ag.lv | 0); }
    const aim = this.ai ? this.ai.aim : this.laser; if (!aim) { this.onAg = false; return; }
    const on = e => e && !e.dead && Math.hypot(aim.x - e.x, aim.z - e.z) < 0.8 && aim.y > e.y + 0.3 && aim.y < e.y + 2.1;
    const now = on(ag), el = ROUND_T - this.t;
    if (now && !this.onAg && this.lp.length < 30 && el - (this.lpT ?? -9) > 2.5) { this.lpT = el; this.lp.push([Math.round(el), Math.round(ag.x * 10), Math.round(ag.z * 10), ag.lv | 0]); }
    this.onAg = now;
  }
  state() {
    if (this._st) return this._st;
    return (this._st = {
      ph: this.ph, rd: this.round, sd: this.seed, tl: this.t,
      ents: this.ents.map(e => ({ id: e.id, x: e.x, y: e.y, z: e.z, rot: e.rot, anim: e.dead ? 5 : e.anim })),
      pm: this.pm, rl: this.rl, nm: this.nm, ms: this.ms, dn: this.dn, tells: this.tells,
      sh: this.sh, w: this.w, why: this.why, sc: this.sc, mk: this.mk, bm: this.bm, ho: this.ho, ot: this.ot,
      ag: this.agentId, aim: this.ai ? this.ai.aim : null, sx: this.sx, mp: this.map, nt: this.night ? 1 : 0, lg: this.lg, ts: this.ts, tg: this.got ? 1 : 0,
      ru: this.ru, rt: this.rt, bl: this.bl, ap: this.ap, pd: this.pd, sh1: this.sh1,
      lu: Object.fromEntries(Object.entries(this.lu).map(([k, u]) => [k, [Math.floor(u[0]), Math.floor(u[1])]])), dz: this.dz,
      tr: this.tr || [], lp: this.lp || [],
    });
  }
}

// knobs of the computer sniper (solo training): suspicion from an area on the radio, from making out the exact object,
// and per second of a mission gesture; how far back it remembers who was at an object; when it makes the object out
// th scales how sure it must be before shooting; `map` adjusts th or gest per map (0 = rooftop, 1..10 = the extra
// scenarios) so the robot agent wins 40-55% everywhere in t10.js (crowded maps make gestures noisier, sparse ones easier)
const AI_SNIPER = { area: 0.8, exact: 0.8, gest: 0.02, win: 9, idWin: 20, idT: [5, 12], th: 1,
  map: { 0: { th: 1.85 }, 1: { th: 1.23 }, 2: { th: 1.39 }, 3: { th: 1.35 }, 4: { th: 1.36 }, 5: { th: 1.09 }, 6: { th: 1.28 },
    7: { th: 1.48 }, 8: { th: 1 }, 9: { th: 1.38 }, 10: { th: 1.18 } } };
const aiMap = () => AI_SNIPER.map[SCEN.id] || {};
const GESTURE_ANIMS = new Set(Object.values(GESTURES).map(g => g.anim));
class AISniper {
  constructor(sim) { this.s = sim; this.sus = new Float32Array(sim.ents.length); this.tgt = -1; this.aim = new T.Vector3(0, 1.4, 0); this.lock = 0; this.scan = 0; this.shot = false; }
  // like the player, the computer hears only the area on the radio: everyone seen at any object of that area lately is a
  // suspect; a few seconds later it makes out the exact object (as the player does by zooming in) and narrows it down
  onTell(obj) {
    const s = this.s, now = s.time, key = areaKey(obj), list = new Set();
    PROPS.forEach((P, pi) => { if (areaKey(P.ms[0]) !== key) return; for (const [id, t] of s.near[pi]) if (now - t < AI_SNIPER.win) list.add(id); });
    this.addSus(list, AI_SNIPER.area);
    (this.later = this.later || []).push({ at: now + AI_SNIPER.idT[0] + s.rng() * (AI_SNIPER.idT[1] - AI_SNIPER.idT[0]), p: MISSIONS[obj].p });
  }
  addSus(ids, k) {
    const E = this.s.ents, live = [...ids].filter(id => !E[id].dead && E[id].kind !== 'static'), inc = k / Math.sqrt(Math.max(1, live.length));
    for (const id of live) this.sus[id] += inc;
  }
  update(dt) {
    const s = this.s, E = s.ents;
    if (this.later) for (let i = this.later.length - 1; i >= 0; i--) { const q = this.later[i]; if (s.time < q.at) continue; this.later.splice(i, 1);
      const ids = []; for (const [id, t] of s.near[q.p]) if (s.time - t < AI_SNIPER.idWin) ids.push(id); this.addSus(ids, AI_SNIPER.exact); }
    let best = -1, bv = 0, second = 0;
    for (const e of E) {
      if (e.dead || e.kind === 'static') continue;
      this.sus[e.id] *= Math.exp(-dt / 120);
      // a gesture is a tell only when it is done at an object (as a mission is): dancing or waving on a crowded floor is not
      if (e.st === 'act' && GESTURE_ANIMS.has(e.anim)) this.sus[e.id] += dt * (aiMap().gest ?? AI_SNIPER.gest);
      const v = this.sus[e.id];
      if (v > bv) { second = bv; bv = v; best = e.id; } else if (v > second) second = v;
    }
    if (bv > 0.35) { if (this.tgt !== best) { this.tgt = best; this.lock = 0; } }
    else { this.scan -= dt; if (this.scan <= 0 || this.tgt < 0) { this.scan = 2.5 + s.rng() * 2.5; this.tgt = pick(E.filter(e => !e.dead && e.kind !== 'static'), s.rng).id; this.lock = 0; } }
    this.lock += dt;
    const e = E[this.tgt];
    if (e) this.aim.lerp((this.aimVector || (this.aimVector = new T.Vector3())).set(e.x, e.y + 1.45, e.z), 1 - Math.exp(-dt * 2.5));
    s.mk = bv > 0.35 ? [best] : [];
    const u = (s.dn.length >= 3 ? 0.65 : 1) * AI_SNIPER.th * (aiMap().th || 1);
    if (!this.shot && bv > 0.35 && this.tgt === best && this.lock > 2.5 && bv > 2.6 * u && bv - second > 1.0 * u) { this.shot = true; s.shoot(best); } // no last-second guess: time running out is the sniper's win
  }
}
function lerpAngle(a, b, t) { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; }

// ---------------------------------------------------------------- renderer + scene
const canvas = $('#c'); canvas.style.opacity = '0';
const renderer = new T.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.debug.checkShaderErrors = /dbg/.test(location.search); // the per-program error check stalls the GPU on every new shader
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.snapshot().dpr));
renderer.outputEncoding = T.sRGBEncoding;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
// textures seen at a slant (floors, decks, roofs from the sniper's nest) stay sharp instead of shimmering
T.Texture.DEFAULT_ANISOTROPY = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const scene = new T.Scene();
scene.fog = new T.Fog(0x1a2238, 70, 190);

function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d', { willReadFrequently: true }), w, h);
  const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = T.Texture.DEFAULT_ANISOTROPY;
  if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
}
scene.background = canvasTex(4, 256, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#0e1630'); gr.addColorStop(0.55, '#2a3558'); gr.addColorStop(0.8, '#7a5a6a'); gr.addColorStop(1, '#c98a5a');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});

const MATS = new Map();
// handles to the bits of scenery that missions change (filled while the scene is built; see fxApply)
const H = { barGlass: [], cush: [], ctFlames: [], djDisk: [], djSpeaker: [], tFlame: [], tGlass: [], dFlame: [], plants: {}, towels: [], loungers: [], sideDrink: [], potSoil: [], pianoFlames: [], stoneLamp: [], zenRocks: [], teaCups: [], yogaMats: [], ht: {}, ghLamps: [], ghLights: [], cashChips: [], rChips: [], chand: [], pokerCards: [], pokerChairs: [], slotLever: [], slotWin: [], slotReel: [], plinthLights: [], chess: [], jerry: [], beans: [], sofa5: [], mastPanel: [], tubGlass: [] };
const ROOT_BASE = { levels: LEVELS, links: LINKS, statics: STATICS, cols: COLS.slice(), slots: SLOTS.slice(), props: PROPS, pos: SNIPER_POS.clone() };
const SCEN = { id: -1, K: null, root: null };
function mat(color, o = {}) {
  const key = color + JSON.stringify(o);
  if (!MATS.has(key)) MATS.set(key, new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.75, metalness: 0.05, envMapIntensity: 0.3 }, o)));
  return MATS.get(key);
}
function add(geo, m, x, y, z, o = {}) {
  const mesh = new T.Mesh(geo, m); mesh.position.set(x, y, z);
  mesh.castShadow = o.cast !== false; mesh.receiveShadow = true;
  if (o.ry) mesh.rotation.y = o.ry;
  (o.parent || scene).add(mesh);
  if (o.occ) OCCLUDERS.push(mesh);
  return mesh;
}
const OCCLUDERS = [];
const box = (w, h, d, m, x, y, z, o) => add(new T.BoxGeometry(w, h, d), m, x, y, z, o);
const cyl = (rt, rb, h, m, x, y, z, o, seg = 10) => add(new T.CylinderGeometry(rt, rb, h, seg), m, x, y, z, o);

// ---------------------------------------------------------------- environment + lights
const glassClear = new T.MeshStandardMaterial({ color: 0xe8f2ff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.45, envMapIntensity: 1.2 });
let envTex = null, envTarget = null, environmentPrepared = false;
function ensureEnvironment() {
  if (environmentPrepared) return; environmentPrepared = true;
  let pm = null, room = null;
  try {
    if (T.RoomEnvironment) { pm = new T.PMREMGenerator(renderer); room = new T.RoomEnvironment(); envTarget = pm.fromScene(room, 0.04); scene.environment = envTex = envTarget.texture; }
  } catch (e) { envTex = null; console.warn('Environment reflections unavailable', e); }
  finally {
    if (pm) { try { pm.dispose(); } catch (_) {} }
    if (room) { const geometries = new Set(), materials = new Set(); room.traverse(o => { if (o.geometry) geometries.add(o.geometry); if (o.material) materials.add(o.material); }); for (const g of geometries) g.dispose(); for (const m of materials) m.dispose(); }
  }
}
// the rooftop's light (linear colours; applyAmbient(null) sets the same when coming back from a scenario)
const hemi = new T.HemisphereLight(0x455fab, 0x1a0f09, envTex ? 0.3 : 0.6); scene.add(hemi);
const sun = new T.DirectionalLight(0xff7a30, 2.0);
sun.position.set(-30, 14, 6); sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 95, bottom: -40, near: 1, far: 200 });
const LOWEND = matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 700;
sun.shadow.mapSize.setScalar(quality.snapshot().shadow);
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.025;
scene.add(sun);
const fill = new T.DirectionalLight(0x364ca1, 0.45); fill.position.set(18, 14, -10); scene.add(fill);
// Rooftop GPU resources are created only when map 0 is selected.
let MAP0_FROM, PL, radialTex, blobTex, blobMat, UNIT, vcol, floorTex, oakTex, herringTex, marbleTex, flutedTex, slatTex, rugTex, cream, creamDark, metal, brass, chrome, walnut, oak, marble, glassMat, SKY0, CITY_TEX, cr, floor, deckSlab, FLAMES, POOLS, tellDrink, rug, sofaM, cushM, cushM2, cushM3, lampShade, lampMesh, lampLight, lampPool, dance, PLANTS, leafShape, monsteraShape, vaseCrown, officeRug, briefcase, desklamp, paintTex, painting, pic, safeDoor, statue, goldM, silverM, st1, st2, st3, DK, dk, deckTex, deckFloor, causticTex, waterMat, water, poolLight, poolPool, FLOATS, fireRug, FIRE, fireLight, coolerLid, piano, telescope, teleHead, TELE_REST, TELE_AIM, NEON_TEXT, NEON_DEAD, neonMat, neonDeadMat, neon, neonDead, neonLight, breakerLamp, FLOORS, BAR_ZONES, LG, KOI, STEAM, MAST_LIGHTS, wheelSpin, rotorSpin, filmFrame, MAP0K, MAP0_OBJS, seedMesh, bloomMesh, bonsaiGreen, bonsaiRed, pondMat, pondLight, pondPool, wheel, cashLamp, heli, tailRotor, rotor, heliLight, goldSc, blackSc, sculpture, tubMat, filmTex, screenMat, screenLight, beaconMat, beacon;
function plight(x, y, z, c, i, d) { const p = new T.PointLight(c, i, d, 2); p.position.set(x, y, z); scene.add(p); PL.push(p); return p; }
function grain(g, w, h, amt) { const id = g.getImageData(0, 0, w, h), d = id.data; for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; } g.putImageData(id, 0, 0); }
function pool(x, z, r, color, k, y = 0.022) {
  const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: radialTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
  m.scale.set(r * 2, 1, r * 2); m.position.set(x, y, z); m.renderOrder = 2; scene.add(m); return m;
}
function blob(x, z, sx, sz, op = 0.5, parent = scene) {
  const m = new T.Mesh(UNIT, op === 0.55 ? blobMat : new T.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: op, toneMapped: false }));
  m.scale.set(sx, 1, sz); m.position.set(x, 0.014, z); m.renderOrder = 1; parent.add(m); return m;
}
function glow(color, k) { return new T.MeshBasicMaterial({ color: new T.Color(color).multiplyScalar(k), toneMapped: false }); }
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
function glassRun(x0, z0, x1, z1, h, rail, y0 = 0) {
  const len = Math.hypot(x1 - x0, z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, ry = Math.atan2(z1 - z0, x1 - x0);
  const g = new T.Mesh(new T.BoxGeometry(len, h, 0.03), glassMat); g.position.set(cx, y0 + h / 2, cz); g.rotation.y = -ry; g.renderOrder = 3; scene.add(g);
  const n = Math.max(1, Math.round(len / 1.6));
  for (let i = 0; i <= n; i++) { const t = i / n; box(0.05, h, 0.05, metal, x0 + (x1 - x0) * t, y0 + h / 2, z0 + (z1 - z0) * t, { cast: false }); }
  if (rail) { const top = box(len + 0.08, 0.06, 0.11, oak, cx, y0 + h + 0.03, cz); top.rotation.y = -ry; const led = box(len, 0.015, 0.02, glow(0xffc27a, 1.4), cx, y0 + h - 0.01, cz, { cast: false }); led.rotation.y = -ry; }
  else { const top = box(len, 0.05, 0.06, metal, cx, y0 + h, cz, { cast: false }); top.rotation.y = -ry; const bot = box(len, 0.06, 0.07, metal, cx, y0 + 0.03, cz, { cast: false }); bot.rotation.y = -ry; }
}
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
function rbox(w, h, d, r) { const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); const g = new T.ExtrudeGeometry(s, { depth: d - r * 2, bevelEnabled: true, bevelSize: r * 0.8, bevelThickness: r, bevelSegments: 2, curveSegments: 4 }); g.translate(0, 0, -(d - r * 2) / 2); return g; }
function sofa(x, z, len, ry) {
  const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
  add(rbox(len, 0.38, 0.92, 0.06), sofaM, 0, 0.27, 0, { parent: g }); add(rbox(len, 0.5, 0.24, 0.06), sofaM, 0, 0.62, 0.36, { parent: g });
  add(rbox(0.2, 0.55, 0.92, 0.05), sofaM, -len / 2, 0.36, 0, { parent: g }); add(rbox(0.2, 0.55, 0.92, 0.05), sofaM, len / 2, 0.36, 0, { parent: g });
  for (let i = 0; i < Math.round(len / 1.0); i++) { const c = add(rbox(0.46, 0.4, 0.14, 0.05), [cushM, cushM2, cushM3][i % 3], -len / 2 + 0.55 + i * 0.98, 0.66, 0.19, { parent: g }); H.cush.push(c); c.rotation.x = -0.18; c.rotation.z = (i % 2 ? 1 : -1) * 0.06; }
  for (const s of [-1, 1]) cyl(0.03, 0.02, 0.08, brass, s * (len / 2 - 0.1), 0.04, 0.35, { parent: g, cast: false }, 6);
  blob(0, 0, len + 0.6, 1.4, 0.45, g);
}
function armchair(x, z, ry) { const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); add(rbox(0.85, 0.36, 0.8, 0.06), cushM, 0, 0.26, 0, { parent: g }); add(rbox(0.85, 0.5, 0.18, 0.06), cushM, 0, 0.58, 0.32, { parent: g }); for (const s of [-1, 1]) add(rbox(0.14, 0.45, 0.8, 0.05), cushM, s * 0.44, 0.38, 0, { parent: g }); blob(0, 0, 1.3, 1.2, 0.45, g); }
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
FLOORS = []; BAR_ZONES = []; FLAMES = []; PL = [];
let rooftopReady = false;
function buildRooftop() {
 if (rooftopReady) return;
 ({ MAP0_FROM, PL, radialTex, blobTex, blobMat, UNIT, vcol, floorTex, oakTex, herringTex, marbleTex, flutedTex, slatTex, rugTex, cream, creamDark, metal, brass, chrome, walnut, oak, marble, glassMat, SKY0, CITY_TEX, cr, floor, deckSlab, FLAMES, POOLS, tellDrink, rug, sofaM, cushM, cushM2, cushM3, lampShade, lampMesh, lampLight, lampPool, dance, PLANTS, leafShape, monsteraShape, vaseCrown, officeRug, briefcase, desklamp, paintTex, painting, pic, safeDoor, statue, goldM, silverM, st1, st2, st3, DK, dk, deckTex, deckFloor, causticTex, waterMat, water, poolLight, poolPool, FLOATS, fireRug, FIRE, fireLight, coolerLid, piano, telescope, teleHead, TELE_REST, TELE_AIM, NEON_TEXT, NEON_DEAD, neonMat, neonDeadMat, neon, neonDead, neonLight, breakerLamp, FLOORS, BAR_ZONES, LG, KOI, STEAM, MAST_LIGHTS, wheelSpin, rotorSpin, filmFrame, MAP0K, MAP0_OBJS, seedMesh, bloomMesh, bonsaiGreen, bonsaiRed, pondMat, pondLight, pondPool, wheel, cashLamp, heli, tailRotor, rotor, heliLight, goldSc, blackSc, sculpture, tubMat, filmTex, screenMat, screenLight, beaconMat, beacon } = window.MIRA_ROOFTOP_BUILD({ scene, T, add, canvasTex, col, mulberry32, fill, mat, H, box, DH, LVY, colR, pick, cyl, glassClear, TABLES, OCCLUDERS, LINKS, linkPos, canvas, DECK_TABLES, LV_N, LEVELS, G, addSlot }));
 rooftopReady = true;
}

const NEST = new T.Group(); NEST.position.copy(SNIPER_POS); NEST.userData.noCol = true; scene.add(NEST);
const NEST_FX = { pigeons: [], flash: null, flashT: 0, scare: 0 };
// The clear concrete ledge; a scenario with its own nest (sc.ninho) hides it and builds its own surface.
const NEST_BASE = new T.Group(); NEST.add(NEST_BASE);
{
  const concrete = mat(0x8b8780, { roughness: 0.95 });
  const n = (geo, m, x, y, z, o = {}) => { const me = new T.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = false; me.receiveShadow = false; NEST.add(me); if (o.rx) me.rotation.x = o.rx; if (o.ry) me.rotation.y = o.ry; if (o.rz) me.rotation.z = o.rz; return me; };
  // parapet lip the rifle rests on (just below the eye line)
  NEST_BASE.add(n(new T.BoxGeometry(3.6, 0.5, 0.5), concrete, 0, -1.08, -1.0), n(new T.BoxGeometry(3.6, 0.04, 0.54), mat(0x6f6b64, { roughness: 1 }), 0, -0.81, -1.0));
  // pigeons on the lip that scatter at the shot
  const feather = mat(0x7a7f8a, { roughness: 0.9 }), featherD = mat(0x3f4450, { roughness: 0.9 });
  for (const [px, pz, ry] of [[1.35, -0.97, 0.6], [-1.55, -1.02, -0.4]]) {
    const pg = new T.Group(); pg.position.set(px, -0.79, pz); pg.rotation.y = ry; NEST.add(pg);
    const bd = new T.Mesh(new T.SphereGeometry(0.05, 8, 6), feather); bd.scale.set(1, 0.8, 1.5); bd.position.y = 0.05; pg.add(bd);
    const hd = new T.Mesh(new T.SphereGeometry(0.028, 8, 6), featherD); hd.position.set(0, 0.1, 0.06); pg.add(hd);
    const bk = new T.Mesh(new T.ConeGeometry(0.008, 0.025, 5), mat(0xd9a441)); bk.rotation.x = Math.PI / 2; bk.position.set(0, 0.095, 0.095); pg.add(bk);
    const wings = []; for (const sx of [-1, 1]) { const w = new T.Mesh(new T.BoxGeometry(0.07, 0.006, 0.08), featherD); w.position.set(sx * 0.045, 0.07, 0); pg.add(w); wings.push(w); }
    NEST_FX.pigeons.push({ g: pg, wings, vx: (Math.random() - 0.5) * 2, t: 0, home: pg.position.clone(), ph: Math.random() * 6 });
  }
}
// A scenario can theme the sniper's nest with sc.ninho(K, g): it builds into g, a group at the sniper's eye
// (origin = eye, -z toward the party, +x to the right, +y up, metres, no rotation). The ledge and pigeons stay in world
// space; the supported rifle/hands are a separate camera-local foreground. Surface top: y = -0.79 over x -1.8..1.8,
// z -1.25..-0.75. To keep the view clear: nothing above y = -0.79 between x -1.8 and 1.8, nothing in front of
// z = -1.3 above y = -0.85; side pieces beyond |x| 1.8 may rise to y = 1.5 at z >= -1.3. The nest is not a scope
// target, does not collide and is disposed when the map changes.
let NINHO = null;
function buildNinho(sc, K) {
  if (NINHO) { scene.remove(NINHO); disposeTree(NINHO); NINHO = null; }
  NEST_BASE.visible = true;
  if (!sc || typeof sc.ninho !== 'function' || !K) return;
  const g = new T.Group(); g.position.copy(SNIPER_POS); g.userData.noCol = true;
  try { sc.ninho(K, g); } catch (e) { console.error('ninho', sc.id, e); disposeTree(g); return; }
  g.traverse(o => { o.userData.noCol = true; if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  scene.add(g); NINHO = g; NEST_BASE.visible = false;
}
// the rooftop's own nest (fonte/cenarios/src/00-cobertura.js, K.ninho), built at start and whenever the rooftop opens again
function buildNinho0() { buildNinho(MAP0K && MAP0K.ninho ? { id: 0, ninho: MAP0K.ninho } : null, MAP0K); }
function stepNest(dt, t) {
  if (NEST_FX.flashT > 0) { NEST_FX.flashT -= dt; NEST_FX.flash.visible = NEST_FX.flashT > 0; NEST_FX.flash.scale.setScalar(0.6 + Math.random() * 0.8); }
  for (const p of NEST_FX.pigeons) {
    if (NEST_FX.scare > 0) { p.t += dt; p.g.position.y += dt * 1.6; p.g.position.z -= dt * 1.2; p.g.position.x += p.vx * dt; p.wings.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * Math.sin(t * 40) * 0.9); if (p.t > 6) p.g.visible = false; }
    else { p.g.position.copy(p.home); p.g.rotation.y += Math.sin(t * 0.7 + p.ph) * 0.004; p.g.position.y = p.home.y + (Math.sin(t * 3 + p.ph) > 0.97 ? 0.01 : 0); p.g.visible = true; p.t = 0; }
  }
  if (NEST_FX.scare > 0) NEST_FX.scare -= dt;
  const c = NEST_FX.case, b = NEST_FX.brass;
  if (c) {
    c.vy -= 9.8 * dt; c.p.addScaledVector(c.v.set(c.vx, c.vy, c.vz), dt); c.rx += c.spin * dt;
    if (c.p.y < -.43 && c.vy < 0) { // lands on the lip: bounce a couple of times, then roll and lie still
      c.p.y = -.43; if (c.hits < 3 && c.vy < -0.4) { sndTink(c.hits++); c.vy *= -0.35; c.vx *= 0.6; c.vz *= 0.6; c.spin *= 0.5; } else { c.vy = 0; c.vx *= Math.exp(-dt * 4); c.vz *= Math.exp(-dt * 4); c.spin = c.vx * 25; }
    }
    b.position.copy(c.p); b.rotation.set(Math.PI / 2, 0, c.rx); b.visible = true;
  } else b.visible = false;
}
// Camera-local foreground: a complete supported rifle and two hands. It never joins collision/shot targets.
// Framing is expressed in vertical half-screen units, independent of each map's observation FOV.
function makeSniperView(stage) {
  const view = new T.Group(); view.name = 'sniper-observation'; view.userData.noCol = true; view.visible = false; stage.add(view);
  const rifle = new T.Group(); rifle.name = 'supported-rifle'; view.add(rifle); NEST_FX.rifle = rifle;
  const steel = [], fabric = [], glass = [], rig = [];
  const c = { body: 0x26353e, edge: 0x485c65, black: 0x0c1318, bronze: 0x786344, glove: 0x171d20, panel: 0x20292d, sleeve: 0x29353f, seam: 0x414a4e };
  const put = (list, geo, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
    geo.applyMatrix4(new T.Matrix4().compose(new T.Vector3(x, y, z), new T.Quaternion().setFromEuler(new T.Euler(rx, ry, rz)), new T.Vector3(1, 1, 1))); list.push([geo, color]);
  };
  const oval = (list, color, radii, p, rotation = [0, 0, 0], resolution = 20) => put(list, new T.SphereGeometry(1, resolution, Math.max(8, resolution / 2)).scale(...radii), color, ...p, ...rotation);
  const box = (list, color, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const r = Math.min(w, h, d) * .18, shape = new T.Shape();
    shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2); shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r); shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2); shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r); shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const geo = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSegments: 2, bevelSize: r * .25, bevelThickness: r * .25, curveSegments: 3, steps: 1 }); geo.translate(0, 0, -d / 2);
    put(list, geo, color, x, y, z, rx, ry, rz);
  };
  const profile = (list, color, points, width, bevel = .008) => {
    const shape = new T.Shape(); points.forEach(([z, y], i) => i ? shape.lineTo(-z, y) : shape.moveTo(-z, y)); shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, { depth: width, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, steps: 1 });
    geo.translate(0, 0, -width / 2); geo.rotateY(Math.PI / 2); put(list, geo, color);
  };
  const tube = (list, color, radius, length, x, y, z, segments = 20) => put(list, new T.CylinderGeometry(radius, radius, length, segments), color, x, y, z, Math.PI / 2);
  // Tapered curved surfaces give fingers, wrists and sleeves their own silhouette instead of stretching cylinders.
  const loft = (list, color, points, radii, lengthSegments = 14, radialSegments = 10, folds = 0, roundTip = false) => {
    const curve = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p)), false, 'centripetal');
    const frames = curve.computeFrenetFrames(lengthSegments, false), positions = [], indices = [];
    const v = new T.Vector3();
    for (let i = 0; i <= lengthSegments; i++) {
      const t = i / lengthSegments, center = curve.getPointAt(t), at = t * (radii.length - 1), k = Math.min(radii.length - 2, Math.floor(at)), f = at - k;
      const a = T.MathUtils.lerp(radii[k][0], radii[k + 1][0], f), b = T.MathUtils.lerp(radii[k][1], radii[k + 1][1], f);
      for (let j = 0; j <= radialSegments; j++) {
        const angle = j / radialSegments * Math.PI * 2;
        const end = roundTip ? Math.sqrt(Math.max(.002, 1 - T.MathUtils.smoothstep(t, .82, 1) ** 2)) : 1;
        const ripple = end * (1 + folds * Math.sin(t * 37 + Math.sin(angle * 2) * 1.8) * Math.sin(Math.PI * t) ** 2);
        v.copy(center).addScaledVector(frames.normals[i], Math.cos(angle) * a * ripple).addScaledVector(frames.binormals[i], Math.sin(angle) * b * ripple); positions.push(v.x, v.y, v.z);
        if (i < lengthSegments && j < radialSegments) { const p = i * (radialSegments + 1) + j, q = p + radialSegments + 1; indices.push(p, p + 1, q, q, p + 1, q + 1); }
      }
    }
    for (const end of [0, lengthSegments]) { const center = curve.getPointAt(end ? 1 : 0), index = positions.length / 3; positions.push(center.x, center.y, center.z); for (let j = 0; j < radialSegments; j++) { const a = end * (radialSegments + 1) + j; if (end) indices.push(index, a, a + 1); else indices.push(index, a + 1, a); } }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); geo.setIndex(indices); geo.computeVertexNormals();
    // Average the duplicated seam normals, keeping the fabric highlights continuous around the arm.
    const normal = geo.attributes.normal, n = new T.Vector3();
    for (let i = 0; i <= lengthSegments; i++) { const a = i * (radialSegments + 1), b = a + radialSegments; n.fromBufferAttribute(normal, a).add(v.fromBufferAttribute(normal, b)).normalize(); normal.setXYZ(a, n.x, n.y, n.z); normal.setXYZ(b, n.x, n.y, n.z); }
    put(list, geo, color);
  };
  const batch = (parts, material, parent, name) => {
    const colors = material.isMeshStandardMaterial ? parts.map(([g, color]) => [g, new T.Color(color).convertSRGBToLinear()]) : parts;
    const mesh = new T.Mesh(mergeGeos(colors), material); mesh.name = name; mesh.userData.noCol = true; mesh.renderOrder = 800; mesh.frustumCulled = false; parent.add(mesh);
    for (const [geo] of parts) geo.dispose(); return mesh;
  };
  const metalMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: .43, metalness: .35, envMapIntensity: .65, emissive: 0x05080b, emissiveIntensity: .08 });
  const clothMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: .88, metalness: 0, envMapIntensity: .2 });
  // Sculpted chassis and cheek stock; the side profiles replace the previous rectangular slabs.
  profile(steel, c.body, [[.29,.065],[-.18,.065],[-.28,.005],[-.78,.005],[-.84,-.035],[-.80,-.075],[-.26,-.075],[-.13,-.14],[.015,-.14],[.075,-.075],[.29,-.07]], .14);
  tube(steel, c.edge, .057, .44, 0, .065, .035);
  profile(steel, c.black, [[.24,.025],[.40,.02],[.50,-.035],[.77,-.035],[.83,-.09],[.82,-.22],[.72,-.24],[.64,-.14],[.35,-.11],[.23,-.07]], .12);
  box(steel, c.body, .145,.075,.23, 0,.015,.62, -.05);
  box(steel, c.black, .15,.21,.042, 0,-.12,.835, -.10);
  profile(steel, c.black, [[.11,-.07],[.19,-.075],[.24,-.23],[.20,-.29],[.14,-.275],[.10,-.14]], .075, .012);
  box(steel, c.body, .085,.11,.14, 0,-.135,-.09, -.09);
  box(steel, c.black, .13,.017,.50, 0,.137,-.025);
  for (let i = 0; i < 11; i++) box(steel, c.edge, .15,.014,.016, 0,.15,-.29+i*.047);
  for (let i = 0; i < 5; i++) box(steel, c.black, .006,.024,.047, .077,-.022,-.32-i*.085);
  tube(steel, c.edge, .022,.49, 0,.019,-1.01);
  tube(steel, c.black, .037,.15, 0,.019,-1.32);
  tube(steel, c.edge, .038,.012, 0,.019,-1.392);
  const collar = (color, r, length, z) => put(steel, new T.LatheGeometry([[r-.008,-length/2],[r,-length/2],[r,length/2],[r-.008,length/2],[r-.008,-length/2]].map(p=>new T.Vector2(...p)),28),color,0,.30,z,Math.PI/2);
  // Open, smoothly tapered optic body with narrow metal trim and a recessed lens, not solid cylinder end caps.
  const optic = [[.107,-.50],[.107,-.46],[.064,-.34],[.061,-.27],[.061,.13],[.075,.20],[.083,.25],[.083,.37],[.088,.385],[.088,.406]];
  put(steel, new T.LatheGeometry(optic.map(([r,z])=>new T.Vector2(r,z)), 28), c.body, 0,.30,0,Math.PI/2);
  for (const z of [-.23,.12]) {
    box(steel, c.black, .082,.09,.054, 0,.192,z);
    collar(c.black,.071,.052,z);
    for (const sx of [-1,1]) oval(steel,c.edge,[.008,.008,.008],[sx*.073,.30,z],[],10);
  }
  collar(c.black,.086,.018,.367);
  collar(c.bronze,.088,.006,.392);
  collar(c.edge,.108,.008,-.499);
  for (let i=0;i<20;i++) { const a=i*Math.PI/10; put(steel,new T.CylinderGeometry(.0017,.0017,.025,5),c.edge,Math.cos(a)*.087,.30+Math.sin(a)*.087,.365,Math.PI/2); }
  put(steel,new T.CylinderGeometry(.033,.033,.043,20),c.black,0,.376,-.04);
  put(steel,new T.CylinderGeometry(.026,.026,.048,20),c.black,.078,.30,-.04,0,0,Math.PI/2);
  put(steel,new T.CylinderGeometry(.024,.024,.003,16),c.edge,.103,.30,-.04,0,0,Math.PI/2);
  put(glass,new T.CircleGeometry(.081,28),0x02060b,0,.30,.407);
  put(glass,new T.CircleGeometry(.101,28),0x02060b,0,.30,-.504,0,Math.PI);
  put(glass,new T.CircleGeometry(.040,24).scale(1,.35,1),0x081623,-.024,.329,.408,0,0,-.3);
  put(glass,new T.RingGeometry(.070,.072,28,1,.35,1.5),0x1c3345,0,.30,.409);
  // Bolt handle, trigger guard and fasteners stay readable as small curved details.
  loft(steel,c.edge,[[.055,.075,.07],[.10,.05,.075],[.14,.01,.10]],[[.008,.008],[.009,.009],[.01,.01]],6,8);
  oval(steel,c.black,[.022,.022,.026],[.15,.006,.103],[],16);
  loft(steel,c.body,[[0,-.095,.06],[0,-.16,.05],[0,-.175,.14],[0,-.13,.19]],[[.009,.009],[.009,.009],[.009,.009],[.009,.009]],10,8);
  for (const z of [-.17,.20]) put(steel,new T.CylinderGeometry(.009,.009,.005,12),c.edge,.082,-.018,z,0,0,Math.PI/2);
  // Articulated bipod with rubber soles. The oversized bag is gone; only the two feet touch the ledge.
  tube(rig,c.black,.035,.075,0,-.09,-.70,16);
  for (const sx of [-1,1]) {
    loft(rig,c.edge,[[sx*.06,-.075,-.72],[sx*.13,-.24,-.75],[sx*.22,-.422,-.78]],[[.014,.014],[.012,.012],[.010,.010]],6,10);
    tube(rig,c.black,.019,.047,sx*.13,-.24,-.75,12);
    oval(rig,c.black,[.050,.014,.045],[sx*.22,-.438,-.78],[],16);
  }
  // Left glove: shaped palm, four individually curled fingers, a separate thumb and low seams.
  const left=[], leftFrame=new T.Matrix4().compose(new T.Vector3(-.73,-.19,.23),new T.Quaternion().setFromEuler(new T.Euler(.22,-.18,-.07)),new T.Vector3(1,1,1));
  oval(left,c.glove,[.086,.043,.112],[0,.006,-.12]);
  for (let i=0;i<4;i++) {
    const x=[-.061,-.020,.022,.060][i], length=[.125,.16,.15,.11][i], start=-.192+(i===3?.012:0), radius=i===3?.016:.019;
    loft(left,c.glove,[[x,.012,start],[x,.022,start-length*.43],[x,-.015,start-length*.85],[x,-.055,start-length]],[[radius,radius*.9],[radius,radius*.9],[radius*.85,radius*.78],[radius*.63,radius*.65]],12,10,0,true);
    oval(left,c.panel,[radius*1.05,.006,.023],[x,.037,start+.006],[],12);
    loft(left,c.black,[[x-.011,.026,start-.026],[x,.030,start-.03],[x+.011,.026,start-.026]],[[.0018,.0018],[.0018,.0018],[.0018,.0018]],4,5);
  }
  oval(left,c.glove,[.048,.035,.064],[.068,-.006,-.067],[0,-.35,.1],18);
  loft(left,c.glove,[[.073,.004,-.047],[.116,.008,-.089],[.113,-.006,-.145],[.091,-.018,-.177]],[[.026,.024],[.025,.023],[.022,.021],[.016,.017]],14,10,0,true);
  loft(left,c.glove,[[0,0,-.025],[0,0,.018],[0,-.004,.06]],[[.068,.040],[.066,.041],[.070,.044]],8,12);
  for (const sx of [-1,1]) loft(left,c.seam,[[sx*.045,.032,-.03],[sx*.060,.039,-.10],[sx*.045,.029,-.175]],[[.0015,.0015],[.0015,.0015],[.0015,.0015]],10,5);
  for (const [geo,color] of left) { geo.applyMatrix4(leftFrame); fabric.push([geo,color]); }
  // Jacket sleeves widen through a bent forearm, with soft folds instead of a straight six-sided pole.
  const wrist=new T.Vector3(0,-.004,.075).applyMatrix4(leftFrame).toArray();
  loft(fabric,c.sleeve,[wrist,[-.80,-.25,.43],[-1.04,-.43,.62],[-1.50,-.82,.82],[-2.15,-1.65,.95]],[[.080,.055],[.090,.063],[.115,.078],[.145,.10],[.195,.13]],28,16,.045);
  loft(fabric,c.black,[wrist,[-.785,-.235,.40]],[[.083,.057],[.085,.060]],5,16,.015);
  // Right hand wraps around the grip, with the index resting along the guard and three curved fingers below it.
  oval(fabric,c.glove,[.041,.10,.078],[.119,-.169,.245],[.08,0,.08]);
  for(let i=0;i<3;i++) {
    const y=-.145-i*.041;
    loft(fabric,c.glove,[[.126,y,.212],[.145,y,.15],[.089,y-.005,.110],[.025,y-.012,.128]],[[.019,.018],[.019,.018],[.017,.016],[.014,.014]],14,10,0,true);
    oval(fabric,c.panel,[.014,.019,.022],[.153,y,.185],[],12);
  }
  loft(fabric,c.glove,[[.123,-.096,.219],[.126,-.096,.136],[.094,-.115,.079],[.052,-.121,.065]],[[.020,.018],[.019,.017],[.017,.015],[.014,.014]],14,10,0,true);
  loft(fabric,c.glove,[[.088,-.091,.275],[.037,-.063,.236],[.011,-.065,.183],[.033,-.080,.152]],[[.025,.022],[.024,.022],[.021,.020],[.016,.016]],14,10,0,true);
  loft(fabric,c.glove,[[.133,-.23,.277],[.150,-.273,.309],[.169,-.311,.352]],[[.058,.040],[.061,.042],[.064,.045]],9,12);
  loft(fabric,c.sleeve,[[.169,-.31,.35],[.202,-.38,.43],[.296,-.56,.63],[.50,-.91,.86],[.80,-1.65,1.08]],[[.075,.053],[.087,.063],[.110,.075],[.146,.105],[.19,.135]],28,16,.045);
  loft(fabric,c.black,[[.169,-.31,.35],[.190,-.354,.397]],[[.078,.055],[.081,.058]],5,16,.012);
  batch(steel,metalMat,rifle,'rifle-body-and-optic');
  batch(glass,new T.MeshBasicMaterial({vertexColors:true}),rifle,'optic-glass');
  batch(rig,metalMat,view,'bipod');
  batch(fabric,clothMat,view,'hands-and-sleeves');
  const flash=new T.Mesh(new T.IcosahedronGeometry(.09,0),glow(0xffd080,4)); flash.position.set(0,.019,-1.43); flash.visible=false; flash.renderOrder=810; rifle.add(flash); NEST_FX.flash=flash;
  const brass=new T.Mesh(new T.CylinderGeometry(.009,.009,.055,8),mat(0xc9a03a,{metalness:.7,roughness:.4})); brass.visible=false; brass.renderOrder=810; view.add(brass); NEST_FX.brass=brass;
  view.traverse(o=>{o.userData.noCol=true;if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}}); return view;
}
function poseSniperView(dt, now) {
  const aspect = wide.aspect, half = Math.tan(T.MathUtils.degToRad(wide.fov / 2)) * 2.4;
  // Portrait gets a smaller foreground and a little more horizontal room for the hotel.
  const size = aspect < 1 ? .55 : 1, reduced = RM.matches, r = NEST_FX.rifle;
  SNIPER_VIEW.position.set(half * aspect * (aspect < 1 ? .50 : .69), -half * (aspect < 1 ? .46 : .63), -2.4);
  SNIPER_VIEW.scale.setScalar(half * size);
  const breath = reduced ? 0 : Math.sin(now * .0015) * .004;
  SNIPER_VIEW.rotation.set(.04 + breath, .42, -.025);
  const follow = reduced ? 1 : 1 - Math.exp(-dt * 7);
  const yaw = -T.MathUtils.clamp(snip.yaw, -.8, .8) * .055, pitch = T.MathUtils.clamp(snip.pitch - WIDE_ELEV, -.5, .5) * .045;
  r.rotation.y += (yaw - r.rotation.y) * follow; r.rotation.x += (pitch - r.rotation.x) * follow;
  r.position.z = snip.kick * .08;
  SNIPER_VIEW.position.y += reduced ? 0 : breath * half;
}

// mission rings (only shown to guests)
function buildRings() {
  for (const r of RINGS) { scene.remove(r); r.geometry.dispose(); r.material.dispose(); }
  RINGS = PROPS.map(m => {
    const r = new T.Mesh(new T.RingGeometry(0.38, 0.48, 32), new T.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.0, depthWrite: false }));
    r.rotation.x = -Math.PI / 2; r.position.set(m.s[0], LVY(m.lv) + 0.03, m.s[1]); r.userData.noCol = true; scene.add(r); return r;
  });
}
const meRing = new T.Mesh(new T.RingGeometry(0.34, 0.42, 32), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false }));
meRing.rotation.x = -Math.PI / 2; meRing.visible = false; scene.add(meRing);
// "VOCÊ ▾" over the player's own head for the first seconds of each round (and while the guest tutorial runs); only this screen draws it
const meTag = new T.Sprite(new T.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
meTag.scale.set(2.0, 1.0, 1); meTag.renderOrder = 999; meTag.visible = false; meTag.userData.noCol = true; scene.add(meTag);
function drawMeTag(text) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128; const g = c.getContext('2d');
  g.font = '800 62px "Saira Condensed","Arial Narrow",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  // a dark outline under the gold so it reads over any floor (Veneza's pink checks, Carnaval's confetti, snow)
  g.lineJoin = 'round'; g.strokeStyle = 'rgba(14,12,8,.92)'; g.lineWidth = 12;
  g.beginPath(); g.moveTo(110, 88); g.lineTo(146, 88); g.lineTo(128, 116); g.closePath();
  g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 10; g.strokeText(text, 128, 50); g.stroke(); g.shadowBlur = 0;
  g.fillStyle = '#ffd36b'; g.fillText(text, 128, 50); g.fill();
  const tx = new T.CanvasTexture(c); tx.encoding = T.sRGBEncoding;
  if (meTag.material.map) meTag.material.map.dispose(); meTag.material.map = tx; meTag.material.needsUpdate = true;
}
const L10N = s => window.MIRA_IDIOMA ? window.MIRA_IDIOMA.t(s) : s; // text that is not on the page (canvas, share sheet) goes through the translation by hand
drawMeTag(L10N('VOCÊ')); if (document.fonts) document.fonts.ready.then(() => drawMeTag(L10N('VOCÊ')));
const agentRing = new T.Mesh(new T.RingGeometry(0.4, 0.62, 32), new T.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.95, depthWrite: false }));
agentRing.rotation.x = -Math.PI / 2; agentRing.visible = false; scene.add(agentRing);
const shotRing = new T.Mesh(new T.RingGeometry(0.4, 0.62, 32), new T.MeshBasicMaterial({ color: 0xff4134, transparent: true, opacity: 0.9, depthWrite: false }));
shotRing.rotation.x = -Math.PI / 2; shotRing.visible = false; scene.add(shotRing);

// laser
const laserGeo = new T.BufferGeometry().setFromPoints([SNIPER_POS.clone(), new T.Vector3()]);
const laser = new T.Line(laserGeo, new T.LineBasicMaterial({ color: 0xff4134, transparent: true, opacity: 0.75 }));
laser.frustumCulled = false; laser.visible = false; scene.add(laser);
const laserDot = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), new T.MeshBasicMaterial({ color: 0xff4134 }));
laserDot.visible = false; scene.add(laserDot);

// world props reset / tells
function resetProps() {
  if (SCEN.id || !rooftopReady) { if (SCEN.K) for (const t of Object.values(SCEN.K.tells)) t.reset?.(); FX.length = 0; undoFx(); for (const k in SPAWNED) SPAWNED[k].visible = false; return; }
  if (SCEN.K) for (const k in SCEN.K.tells) { try { SCEN.K.tells[k].reset && SCEN.K.tells[k].reset(); } catch (e) { } }
  briefcase.material = mat(0x7a4a24); painting.rotation.z = 0; safeDoor.rotation.y = 0;
  lampShade.color.set(0xfff0d0); lampShade.emissive.set(0xffc070); lampLight.color.set(0xffc070); lampLight.intensity = 1.4; lampPool.material.color.set(0xffb060).multiplyScalar(0.5);
  tellDrink.visible = false; statue.rotation.y = 0; [st1, st2, st3].forEach(m => m.material = goldM);
  teleHead.rotation.x = TELE_REST[0]; teleHead.rotation.y = TELE_REST[1]; coolerLid.rotation.x = 0;
  waterMat.color.set(0x2aa6c0); waterMat.emissive.set(0x0f7a90); poolLight.color.set(0x5fe0ff); poolPool.material.color.set(0x40d0e0).multiplyScalar(0.3);
  neonDead.visible = false; breakerLamp.material = glow(0xff3030, 3); seedMesh.visible = true; bloomMesh.visible = false;
  bonsaiGreen.visible = true; bonsaiRed.visible = false; pondSet(0); cashLamp.material = glow(0x40ff80, 3); wheelSpin = 0; rotorSpin = 0;
  sculpture.material = goldSc; sculpture.rotation.y = 0; sculpture.scale.set(1, 1, 1); filmBroken = false; antennaCut = false;
  beaconMat.color.set(0xff3030).multiplyScalar(5); MAST_LIGHTS.forEach(m => m.visible = true);
  FX.length = 0; undoFx(); for (const k in SPAWNED) SPAWNED[k].visible = false;
}
let filmBroken = false, antennaCut = false;
const pondA = [new T.Color(0x1f6f6a), new T.Color(0x0b3a38), new T.Color(0x5fe0d0), new T.Color(0x40d0c0)], pondB = [new T.Color(0xd88a2a), new T.Color(0x6a3a08), new T.Color(0xffa040), new T.Color(0xffa040)];
function pondSet(k) { pondMat.color.copy(pondA[0]).lerp(pondB[0], k); pondMat.emissive.copy(pondA[1]).lerp(pondB[1], k); pondLight.color.copy(pondA[2]).lerp(pondB[2], k); pondPool.material.color.copy(pondA[3]).lerp(pondB[3], k).multiplyScalar(0.25); }
const FX = [];
// ---------------------------------------------------------------- mission effects
// Small items the agent can leave behind. Built on first use, cached per mission, hidden again at the next round.
const SPAWNED = {};
const ITEM_M = {};
const im = (c, o) => { const k = c + JSON.stringify(o || {}); if (!ITEM_M[k]) ITEM_M[k] = mat(c, o); return ITEM_M[k]; };
function makeItem(kind, c) {
  const g = new T.Group(); const a = (geo, m, x = 0, y = 0, z = 0) => { const me = new T.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = true; me.receiveShadow = true; g.add(me); return me; };
  const paper = im(0xf6f1e8, { roughness: 0.9 }), dark = im(0x15161a, { roughness: 0.4 }), gold = im(0xd9a441, { metalness: 0.85, roughness: 0.3 });
  if (kind === 'note') { a(new T.BoxGeometry(0.12, 0.004, 0.09), paper, 0, 0.002, 0); a(new T.BoxGeometry(0.07, 0.001, 0.004), dark, -0.01, 0.005, -0.015); a(new T.BoxGeometry(0.08, 0.001, 0.004), dark, 0, 0.005, 0.01); }
  else if (kind === 'envelope') { a(new T.BoxGeometry(0.16, 0.008, 0.11), im(0xe9dcc0, { roughness: 0.9 }), 0, 0.004, 0); a(new T.SphereGeometry(0.012, 8, 6), im(0xc8322f, { roughness: 0.5 }), 0, 0.01, 0); }
  else if (kind === 'chip') { a(new T.BoxGeometry(0.05, 0.016, 0.035), dark, 0, 0.008, 0); const l = a(new T.SphereGeometry(0.006, 6, 4), glow(0x40ff80, 4), 0.016, 0.018, 0); FLAMES.push(l); }
  else if (kind === 'coin') { a(new T.CylinderGeometry(0.03, 0.03, 0.004, 14), gold, 0, 0.002, 0); }
  else if (kind === 'chips') { [[0, 0, 0xd9a441], [0.06, 0.02, 0xb8252a], [-0.05, 0.04, 0x2e5fa8]].forEach(([x, z, c2], i) => a(new T.CylinderGeometry(0.055, 0.055, 0.03 + i * 0.015, 14), im(c2, { roughness: 0.4 }), x, 0.015 + i * 0.008, z)); }
  else if (kind === 'rose') { const st = a(new T.CylinderGeometry(0.004, 0.004, 0.2, 5), im(0x2f6a33), 0, 0.006, 0); st.rotation.z = Math.PI / 2; a(new T.SphereGeometry(0.03, 8, 6), im(0xc8322f, { roughness: 0.6 }), 0.11, 0.025, 0); a(new T.BoxGeometry(0.05, 0.002, 0.02), im(0x3f8a3a), -0.03, 0.01, 0.02); }
  else if (kind === 'key') { a(new T.BoxGeometry(0.05, 0.004, 0.012), gold, 0.02, 0.002, 0); const r = a(new T.TorusGeometry(0.012, 0.004, 6, 12), gold, -0.015, 0.002, 0); r.rotation.x = Math.PI / 2; a(new T.BoxGeometry(0.01, 0.004, 0.008), gold, 0.035, 0.002, -0.008); }
  else if (kind === 'cigar') { const cg = a(new T.CylinderGeometry(0.007, 0.007, 0.11, 8), im(0x5a3a22, { roughness: 0.8 }), 0, 0.007, 0); cg.rotation.z = Math.PI / 2; a(new T.CylinderGeometry(0.0075, 0.0075, 0.012, 8), gold, 0.03, 0.007, 0).rotation.z = Math.PI / 2; }
  else if (kind === 'card') { for (let i = 0; i < 3; i++) { const cd = a(new T.BoxGeometry(0.085, 0.003, 0.055), paper, i * 0.012, 0.0015 + i * 0.003, i * 0.004); cd.rotation.y = i * 0.25; } a(new T.BoxGeometry(0.06, 0.001, 0.03), im(0xc8322f), 0.024, 0.011, 0.008).rotation.y = 0.5; }
  else if (kind === 'glass') { a(new T.CylinderGeometry(0.004, 0.004, 0.07, 4), glassClear, 0, 0.035, 0); a(new T.CylinderGeometry(0.035, 0.018, 0.06, 10), im(c || 0xd94040, { emissive: c || 0xd94040, emissiveIntensity: 0.25, roughness: 0.2 }), 0, 0.1, 0); }
  else if (kind === 'bottle') { const bm = im(c || 0x3e6b3a, { roughness: 0.15, metalness: 0.1, emissive: c || 0x3e6b3a, emissiveIntensity: 0.35, transparent: true, opacity: 0.92 }); a(new T.CylinderGeometry(0.045, 0.05, 0.26, 10), bm, 0, 0.13, 0); a(new T.CylinderGeometry(0.016, 0.03, 0.12, 8), bm, 0, 0.32, 0); a(new T.CylinderGeometry(0.018, 0.018, 0.02, 8), gold, 0, 0.39, 0); }
  else if (kind === 'sticker') { const s = a(new T.CircleGeometry(0.03, 12), new T.MeshBasicMaterial({ color: new T.Color(c || 0xffffff).multiplyScalar(1.6), toneMapped: false, side: T.DoubleSide }), 0, 0, 0); s.castShadow = false; }
  else if (kind === 'mark') { const tex = canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = c ? '#' + new T.Color(c).getHexString() : '#f6f1e8'; g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); g.moveTo(24, 24); g.lineTo(104, 104); g.moveTo(104, 24); g.lineTo(24, 104); g.stroke(); g.beginPath(); g.arc(64, 64, 52, 0, 7); g.stroke(); }); const s = a(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: T.DoubleSide, depthWrite: false }), 0, 0, 0); s.castShadow = false; }
  else if (kind === 'glove') { a(new T.BoxGeometry(0.09, 0.02, 0.12), im(0x2a2a30, { roughness: 0.8 }), 0, 0.01, 0); for (let i = 0; i < 4; i++) a(new T.BoxGeometry(0.018, 0.018, 0.05), im(0x2a2a30, { roughness: 0.8 }), -0.03 + i * 0.02, 0.01, 0.08); }
  else if (kind === 'glasses') { a(new T.BoxGeometry(0.13, 0.008, 0.01), dark, 0, 0.012, -0.02); for (const s of [-1, 1]) a(new T.BoxGeometry(0.05, 0.03, 0.006), im(0x1b2238, { roughness: 0.1, metalness: 0.4 }), s * 0.034, 0.015, -0.012); }
  else if (kind === 'phone') { a(new T.BoxGeometry(0.07, 0.008, 0.14), dark, 0, 0.004, 0); const s = a(new T.PlaneGeometry(0.062, 0.125), glow(0xbfe8ff, 1.3), 0, 0.0085, 0); s.rotation.x = -Math.PI / 2; s.castShadow = false; }
  else if (kind === 'ring') { const r = a(new T.TorusGeometry(0.014, 0.004, 8, 16), gold, 0, 0.014, 0); a(new T.SphereGeometry(0.005, 8, 6), im(0xdfeeff, { roughness: 0.05 }), 0, 0.031, 0); }
  else if (kind === 'puddle') { const p = a(new T.CircleGeometry(0.22, 18), new T.MeshStandardMaterial({ color: c || 0xd94040, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.2, depthWrite: false }), 0, 0, 0); p.rotation.x = -Math.PI / 2; p.castShadow = false; p.renderOrder = 2; }
  else if (kind === 'lemons') { [[0, 0], [0.11, 0.05], [0.04, -0.1]].forEach(([x, z]) => a(new T.SphereGeometry(0.055, 9, 7), im(0xf2d040, { roughness: 0.6 }), x, 0.05, z)); }
  else if (kind === 'ribbon') { a(new T.BoxGeometry(0.025, 0.3, 0.008), im(0xc8322f, { roughness: 0.7 }), 0, -0.15, 0); a(new T.BoxGeometry(0.08, 0.03, 0.02), im(0xc8322f, { roughness: 0.7 }), 0, 0, 0); }
  else if (kind === 'stone') { const s = a(new T.DodecahedronGeometry(0.11, 0), im(c || 0x3a3a3e, { roughness: 0.9 }), 0, 0.075, 0); s.scale.y = 0.7; }
  else if (kind === 'cloth') { a(new T.BoxGeometry(0.42, 0.03, 0.32), im(c || 0xf6f1e8, { roughness: 1 }), 0, 0.015, 0); a(new T.BoxGeometry(0.2, 0.025, 0.3), im(c || 0xf6f1e8, { roughness: 1 }), 0.1, 0.04, 0.02); }
  else if (kind === 'book') { a(new T.BoxGeometry(0.03, 0.26, 0.17), im(c || 0xc8322f, { roughness: 0.7 }), 0, 0.13, 0); a(new T.BoxGeometry(0.004, 0.08, 0.1), gold, 0.016, 0.16, 0); }
  else if (kind === 'usb') { a(new T.BoxGeometry(0.014, 0.006, 0.04), im(0xc9ced6, { metalness: 0.8, roughness: 0.3 }), 0, 0.003, 0); a(new T.BoxGeometry(0.012, 0.005, 0.014), im(0xc8322f), 0, 0.003, 0.022); }
  else if (kind === 'palette') { const p = a(new T.CylinderGeometry(0.1, 0.1, 0.008, 14), im(0xd8c8a0, { roughness: 0.9 }), 0, 0.004, 0); [0xc8322f, 0xe9c33b, 0x2e5fa8, 0x3f8a3a].forEach((cc, i) => a(new T.SphereGeometry(0.014, 8, 6), im(cc, { roughness: 0.3 }), Math.cos(i * 1.5) * 0.055, 0.012, Math.sin(i * 1.5) * 0.055)); }
  else if (kind === 'bag') { a(new T.BoxGeometry(0.1, 0.15, 0.06), im(c || 0xc8322f, { roughness: 0.8 }), 0, 0.075, 0); for (let i = 0; i < 3; i++) a(new T.BoxGeometry(0.014, 0.15, 0.062), paper, -0.03 + i * 0.03, 0.075, 0); for (let i = 0; i < 6; i++) a(new T.IcosahedronGeometry(0.018, 0), im(i % 3 ? 0xfff4d0 : 0xf2c14e, { roughness: 0.9 }), -0.03 + (i % 3) * 0.03, 0.16 + (i > 2 ? 0.02 : 0), (i % 2) * 0.02 - 0.01); }
  else { a(new T.BoxGeometry(0.08, 0.08, 0.08), dark, 0, 0.04, 0); }
  g.userData.noCol = true;
  return g;
}
// handles into the scene: 'name', 'name|index', 'name|key|children|0'... or an array of those; globals are resolved from H
function resolveH(h) {
  if (!h) return [];
  if (Array.isArray(h)) return h.flatMap(resolveH);
  if (typeof h !== 'string') return [h];
  const parts = h.split('|'); let o = H[parts[0]];
  for (let i = 1; i < parts.length && o !== undefined; i++) o = o[parts[i]];
  if (o === undefined || o === null) return [];
  return Array.isArray(o) ? o.filter(Boolean) : (o.isObject3D || o.isMaterial || o.isLight) ? [o] : Object.values(o).filter(x => x && (x.isObject3D || x.isMaterial));
}
const UNDO = [];
function matOf(o) { if (o.isMaterial) return o; if (!o.userData.ownMat) { o.material = o.material.clone(); o.userData.ownMat = true; } return o.material; }
function fxTween(live, d, fn) { if (live) FX.push({ k: 'g', t: 0, d, fn }); else fn(1); }
function fxApply(fx, m, live) {
  if (!fx) return;
  if (Array.isArray(fx)) { fx.forEach(f => fxApply(f, m, live)); return; }
  const y0 = LVY(m.lv), hs = resolveH(fx.h);
  switch (fx.k) {
    case 'legacy': legacyTell(fx.n, live); break;
    case 'host': break; // the host raises his glass (handled by the simulation)
    case 'spawn': {
      const key = m.k + '#' + MISSIONS.indexOf(m); let o = SPAWNED[key];
      if (!o) {
        o = makeItem(fx.item, fx.c); o.position.set(fx.at[0], y0 + fx.at[1], fx.at[2]);
        // flat things lie on a surface unless told to face a wall (z / x); vertical things (marks, stickers) face +z unless told to lie flat
        const vert = fx.item === 'mark' || fx.item === 'sticker', face = fx.face || (vert ? 'z' : 'up');
        if (fx.ry) o.rotateY(fx.ry); if (fx.rx) o.rotateX(fx.rx); if (face === 'x') o.rotateY(Math.PI / 2);
        if (vert) { if (face === 'up') o.rotateX(-Math.PI / 2); } else if (face !== 'up') o.rotateX(-Math.PI / 2);
        scene.add(o); SPAWNED[key] = o;
      }
      o.visible = true; const s = fx.s || 1;
      fxTween(live, 0.5, u => o.scale.setScalar(s * (0.02 + 0.98 * u)));
      UNDO.push(() => { o.visible = false; });
    } break;
    case 'hide': for (const o of hs) { const v = o.visible, s0 = o.scale.clone(); UNDO.push(() => { o.visible = v; o.scale.copy(s0); }); fxTween(live, 0.45, u => { o.scale.copy(s0).multiplyScalar(Math.max(0.001, 1 - u)); if (u >= 1) o.visible = false; }); } break;
    case 'off': for (const o of hs) { const v = o.visible; UNDO.push(() => { o.visible = v; }); fxTween(live, 0.9, u => { o.visible = u >= 1 ? false : (Math.sin(u * 42) > -0.2 && u < 0.8); }); } break;
    case 'vis': for (const o of hs) { const v = o.visible; UNDO.push(() => { o.visible = v; }); o.visible = true; } break;
    case 'tint': for (const o of hs) { const mt = matOf(o); if (!mt.color) continue; const c0 = mt.color.clone(), c1 = new T.Color(fx.c); const e0 = mt.emissive ? mt.emissive.clone() : null, e1 = mt.emissive && fx.e !== undefined ? new T.Color(fx.e) : null; UNDO.push(() => { mt.color.copy(c0); if (e0) mt.emissive.copy(e0); }); fxTween(live, 0.9, u => { mt.color.copy(c0).lerp(c1, u); if (e1) mt.emissive.copy(e0).lerp(e1, u); }); } break;
    case 'glow': for (const o of hs) { const mt = o.isMaterial ? o : o.material; const c0 = mt.color.clone(), c1 = new T.Color(fx.c).multiplyScalar(fx.i == null ? 3 : fx.i); UNDO.push(() => { mt.color.copy(c0); }); fxTween(live, 0.7, u => mt.color.copy(c0).lerp(c1, u)); } break;
    case 'rot': for (const o of hs) { const a0 = o.rotation[fx.ax], a1 = a0 + fx.a; UNDO.push(() => { o.rotation[fx.ax] = a0; }); fxTween(live, 0.8, u => { o.rotation[fx.ax] = a0 + (a1 - a0) * u; }); } break;
    case 'move': for (const o of hs) { const p0 = o.position.clone(); UNDO.push(() => { o.position.copy(p0); }); fxTween(live, 0.8, u => o.position.set(p0.x + fx.d3[0] * u, p0.y + fx.d3[1] * u, p0.z + fx.d3[2] * u)); } break;
    case 'scale': for (const o of hs) { const s0 = o.scale.clone(); UNDO.push(() => { o.scale.copy(s0); }); fxTween(live, 0.8, u => o.scale.set(s0.x + (fx.s[0] - s0.x) * u, s0.y + (fx.s[1] - s0.y) * u, s0.z + (fx.s[2] - s0.z) * u)); } break;
    case 'light': for (const L of hs) { const i0 = L.intensity, i1 = fx.i == null ? i0 : fx.i, c0 = L.color.clone(), c1 = fx.c !== undefined ? new T.Color(fx.c) : c0; UNDO.push(() => { L.intensity = i0; L.color.copy(c0); }); fxTween(live, 0.8, u => { L.intensity = i0 + (i1 - i0) * u; L.color.copy(c0).lerp(c1, u); }); } break;
    case 'screen': { const c0 = screenMat.color.clone(); UNDO.push(() => screenMat.color.copy(c0)); fxTween(live, 0.6, u => screenMat.color.copy(c0).multiplyScalar(1 - (1 - fx.c) * u)); } break;
    case 'beacon': { const c0 = beaconMat.color.clone(); UNDO.push(() => beaconMat.color.copy(c0)); beaconMat.color.set(fx.c).multiplyScalar(5); } break;
    case 'scen': { const t = SCEN.K && SCEN.K.tells[fx.key]; if (t) { t.tell(live); UNDO.push(() => { try { t.reset && t.reset(); } catch (e) { } }); } } break;
  }
}
function undoFx() { while (UNDO.length) { try { UNDO.pop()(); } catch (e) { } } }
function applyTell(obj, live) { const m = MISSIONS[obj]; if (m) fxApply(m.fx, m, live); }
function legacyTell(obj, live) {
  if (obj === 0) briefcase.material = mat(0x1b1b1f);
  if (obj === 1) painting.rotation.z = 0.12;
  if (obj === 2) safeDoor.rotation.y = 1.1;
  if (obj === 3) { if (live) FX.push({ k: 'flicker', t: 0, d: 1.6 }); lampShade.color.set(0xd8ecff); lampShade.emissive.set(0x9ec8ff); lampLight.color.set(0x9ec8ff); lampPool.material.color.set(0x9ec8ff).multiplyScalar(0.5); }
  if (obj === 4) tellDrink.visible = true;
  if (obj === 5) { statue.rotation.y = Math.PI / 2; [st1, st2, st3].forEach(m => m.material = silverM); }
  if (obj === 6 && live) FX.push({ k: 'shake', t: 0, d: 2.2 });
  if (obj === 8) { if (live) FX.push({ k: 'tele', t: 0, d: 1.8 }); else { teleHead.rotation.x = TELE_AIM[0]; teleHead.rotation.y = TELE_AIM[1]; } }
  if (obj === 9) { if (live) FX.push({ k: 'lid', t: 0, d: 0.7 }); else coolerLid.rotation.x = -1.5; }
  if (obj === 10) { if (live) FX.push({ k: 'water', t: 0, d: 2.5 }); else { waterMat.color.set(0x9a4fd8); waterMat.emissive.set(0x5a2aa0); poolLight.color.set(0xb070ff); poolPool.material.color.set(0xa060ff).multiplyScalar(0.3); } }
  if (obj === 11) { neonDead.visible = true; breakerLamp.material = glow(0x40ff80, 3); if (live) FX.push({ k: 'neon', t: 0, d: 1.4 }); }
  if (obj === 12) { seedMesh.visible = false; bloomMesh.visible = true; if (live) { bloomMesh.scale.setScalar(0.01); FX.push({ k: 'bloom', t: 0, d: 1.2 }); } else bloomMesh.scale.setScalar(1); }
  if (obj === 13) { bonsaiGreen.visible = false; bonsaiRed.visible = true; if (live) { bonsaiRed.scale.setScalar(0.3); FX.push({ k: 'bonsai', t: 0, d: 1.4 }); } else bonsaiRed.scale.setScalar(1); }
  if (obj === 14) { if (live) FX.push({ k: 'pond', t: 0, d: 2.5 }); else pondSet(1); }
  if (obj === 15) { cashLamp.material = glow(0xff3030, 3); if (live) FX.push({ k: 'cash', t: 0, d: 1.6 }); }
  if (obj === 16) wheelSpin = 1;
  if (obj === 17) rotorSpin = 1;
  if (obj === 18) { sculpture.material = blackSc; if (live) FX.push({ k: 'sculpt', t: 0, d: 1.6 }); else { sculpture.rotation.y = 0.8; sculpture.scale.set(1, 1.4, 1); } }
  if (obj === 19) filmBroken = true;
  if (obj === 20) { antennaCut = true; beaconMat.color.set(0x40ff80).multiplyScalar(5); MAST_LIGHTS.forEach(m => m.visible = false); if (live) FX.push({ k: 'mast', t: 0, d: 1.2 }); }
}
const violet = new T.Color(0x9a4fd8), violetE = new T.Color(0x5a2aa0), teal = new T.Color(0x2aa6c0), tealE = new T.Color(0x0f7a90);
function stepFX(dt) {
  for (let i = FX.length - 1; i >= 0; i--) {
    const f = FX[i]; f.t += dt; const u = Math.min(1, f.t / f.d), ease = u * u * (3 - 2 * u);
    if (f.k === 'g') f.fn(ease, u);
    if (f.k === 'flicker') lampLight.intensity = Math.sin(f.t * 40) > 0.2 ? 1.4 : 0.05;
    if (f.k === 'shake') vaseCrown.rotation.z = Math.sin(f.t * 30) * 0.12 * (1 - f.t / f.d);
    if (f.k === 'tele') { teleHead.rotation.x = TELE_REST[0] + (TELE_AIM[0] - TELE_REST[0]) * ease; teleHead.rotation.y = TELE_REST[1] + (TELE_AIM[1] - TELE_REST[1]) * ease; }
    if (f.k === 'lid') coolerLid.rotation.x = -1.5 * ease;
    if (f.k === 'water') { waterMat.color.copy(teal).lerp(violet, ease); waterMat.emissive.copy(tealE).lerp(violetE, ease); poolLight.color.copy(new T.Color(0x5fe0ff)).lerp(new T.Color(0xb070ff), ease); poolPool.material.color.copy(new T.Color(0x40d0e0)).lerp(new T.Color(0xa060ff), ease).multiplyScalar(0.3); }
    if (f.k === 'neon') neonDead.visible = Math.sin(f.t * 35) > -0.3 || u > 0.8;
    if (f.k === 'bloom') bloomMesh.scale.setScalar(0.01 + 0.99 * ease);
    if (f.k === 'bonsai') bonsaiRed.scale.setScalar(0.3 + 0.7 * ease);
    if (f.k === 'pond') pondSet(ease);
    if (f.k === 'cash') cashLamp.visible = Math.sin(f.t * 30) > 0 || u > 0.9;
    if (f.k === 'sculpt') { sculpture.rotation.y = 0.8 * ease; sculpture.scale.set(1, 1 + 0.4 * ease, 1); }
    if (f.k === 'mast') MAST_LIGHTS.forEach((m, i) => m.visible = u < (i + 1) / MAST_LIGHTS.length ? true : false);
    if (f.t >= f.d) { if (f.k === 'flicker') lampLight.intensity = 1.4; if (f.k === 'shake') vaseCrown.rotation.z = 0; if (f.k === 'neon') neonDead.visible = true; if (f.k === 'cash') cashLamp.visible = true; if (f.k === 'mast') MAST_LIGHTS.forEach(m => m.visible = false); FX.splice(i, 1); }
  }
  if (SCEN.id || !rooftopReady) return;
  const tt = performance.now() / 1000;
  FLAMES.forEach((f, i) => { const k = 0.85 + Math.sin(tt * 11 + i * 1.7) * 0.08 + Math.sin(tt * 23 + i) * 0.06; f.scale.set(k, k * 1.25, k); });
  FIRE.forEach((f, i) => { const p = f.userData.ph; const k = 0.7 + Math.sin(tt * 9 + p) * 0.2 + Math.sin(tt * 17 + p * 2) * 0.12; f.scale.set(k, k * (1.1 + Math.sin(tt * 13 + p) * 0.35), k); f.rotation.z = Math.sin(tt * 7 + p) * 0.12; f.position.y = 0.62 + Math.sin(tt * 11 + p) * 0.04; });
  if (MAP0K && !SCEN.id) MAP0K.update(dt, tt);
  fireLight.intensity = 1.6 + Math.sin(tt * 12.3) * 0.25 + Math.sin(tt * 31) * 0.15;
  causticTex.offset.set(Math.sin(tt * 0.11) * 0.08, tt * 0.012); waterMat.emissiveIntensity = 0.45 + Math.sin(tt * 1.7) * 0.1;
  FLOATS.forEach((f, i) => { if (!f.userData.bx) { f.userData.bx = f.position.x; f.userData.bz = f.position.z; f.userData.by = f.position.y; } f.position.x = f.userData.bx + Math.sin(tt * 0.23 + i * 2) * 0.35; f.position.z = f.userData.bz + Math.cos(tt * 0.17 + i) * 0.25; f.position.y = f.userData.by + Math.sin(tt * 1.3 + i) * 0.02; f.rotation.y = tt * 0.06 + i; if (i === 2) { f.position.set(f.userData.bx, f.userData.by, f.userData.bz); f.rotation.y = 0; f.visible = Math.sin(tt * 2.2) > -0.2; } });
  neonMat.opacity = Math.random() < 0.03 ? 0.6 : 1;
  // upper levels: koi circling, steam over the hot tub, the roulette wheel, the helicopter rotor, the beacon and the film
  KOI.forEach(f => { const d = f.userData, a = tt * d.sp + d.ph; f.position.x = d.cx + Math.cos(a) * d.r; f.position.z = d.cz + Math.sin(a) * d.r; f.rotation.y = -a; f.position.y = 0.03 + Math.sin(tt * 2 + d.ph) * 0.01; });
  STEAM.forEach(s => { const d = s.userData, u = ((tt * 0.25 + d.ph) % 1); s.position.y = 0.85 + u * 1.4; s.position.x = d.bx + Math.sin(tt * 0.7 + d.ph) * 0.15; s.material.opacity = 0.2 * (1 - u); s.scale.setScalar(0.6 + u * 1.2); });
  wheel.rotation.y += dt * (wheelSpin ? 9 : 0.25);
  rotor.rotation.y += dt * (rotorSpin ? 26 : 0.5); tailRotor.rotation.x += dt * (rotorSpin ? 40 : 1.2); heliLight.visible = rotorSpin ? Math.sin(tt * 14) > 0 : Math.sin(tt * 1.5) > -0.6;
  beacon.visible = antennaCut ? true : Math.sin(tt * 2.5) > -0.2;
  { const fr = Math.floor(tt * 8); if (fr !== filmFrame) { filmFrame = fr; drawFilm(tt, filmBroken); } }
  screenLight.color.set(filmBroken ? 0xff5040 : 0x9fb8ff);
  PLANTS.forEach((p, i) => { if (p !== vaseCrown || !FX.some(f => f.k === 'shake')) p.rotation.x = Math.sin(tt * 0.8 + i) * 0.02; });
}

// ---------------------------------------------------------------- characters
// A real Mixamo skeleton (rest pose + motion-capture clips taken from the three.js example rigs Xbot and
// "Samba Dancing") drives low-poly rigid pieces hung on each bone, so elbows, knees and spines bend naturally.
// RIG is injected below as JSON: bones in cm (T-pose, identity rotations) and clips resampled at 12 fps.
const RIG = {"bones":[{"n":"Hips","p":null,"pos":[0,103.991,2.076],"q":[0,0,0,1],"wp":[0,1.0399,0.0208]},{"n":"Spine","p":"Hips","pos":[0,10.182,0.132],"q":[0,0,0,1],"wp":[0,1.1417,0.0221]},{"n":"Spine1","p":"Spine","pos":[0,10.083,-1.001],"q":[0,0,0,1],"wp":[0,1.2426,0.0121]},{"n":"Spine2","p":"Spine1","pos":[0,9.1,-1.373],"q":[0,0,0,1],"wp":[0,1.3336,-0.0017]},{"n":"Neck","p":"Spine2","pos":[0,16.672,-2.516],"q":[0,0,0,1],"wp":[0,1.5003,-0.0268]},{"n":"Head","p":"Neck","pos":[0,9.618,1.685],"q":[0,0,0,1],"wp":[0,1.5965,-0.01]},{"n":"LeftShoulder","p":"Spine2","pos":[4.57,10.946,-2.628],"q":[0,0,0,1],"wp":[0.0457,1.443,-0.0279]},{"n":"LeftArm","p":"LeftShoulder","pos":[10.592,-0.525,-2.232],"q":[0,0,0,1],"wp":[0.1516,1.4378,-0.0503]},{"n":"LeftForeArm","p":"LeftArm","pos":[27.842,0,0],"q":[0,0,0,1],"wp":[0.43,1.4378,-0.0503]},{"n":"LeftHand","p":"LeftForeArm","pos":[28.329,0,0],"q":[0,0,0,1],"wp":[0.7133,1.4378,-0.0503]},{"n":"RightShoulder","p":"Spine2","pos":[-4.57,10.946,-2.628],"q":[0,0,0,1],"wp":[-0.0457,1.443,-0.0279]},{"n":"RightArm","p":"RightShoulder","pos":[-10.593,-0.525,-2.232],"q":[0,0,0,1],"wp":[-0.1516,1.4378,-0.0503]},{"n":"RightForeArm","p":"RightArm","pos":[-27.842,0,0],"q":[0,0,0,1],"wp":[-0.43,1.4378,-0.0503]},{"n":"RightHand","p":"RightForeArm","pos":[-28.329,0,0],"q":[0,0,0,1],"wp":[-0.7133,1.4378,-0.0503]},{"n":"LeftUpLeg","p":"Hips","pos":[8.208,-6.752,-1.6],"q":[0,0,0,1],"wp":[0.0821,0.9724,0.0048]},{"n":"LeftLeg","p":"LeftUpLeg","pos":[0,-44.37,0.285],"q":[0,0,0,1],"wp":[0.0821,0.5287,0.0076]},{"n":"LeftFoot","p":"LeftLeg","pos":[0,-44.428,-2.982],"q":[0,0,0,1],"wp":[0.0821,0.0844,-0.0222]},{"n":"LeftToeBase","p":"LeftFoot","pos":[0,-8.729,10.711],"q":[0,0,0,1],"wp":[0.0821,-0.0029,0.0849]},{"n":"RightUpLeg","p":"Hips","pos":[-8.208,-6.752,-1.6],"q":[0,0,0,1],"wp":[-0.0821,0.9724,0.0048]},{"n":"RightLeg","p":"RightUpLeg","pos":[0,-44.371,0.286],"q":[0,0,0,1],"wp":[-0.0821,0.5287,0.0076]},{"n":"RightFoot","p":"RightLeg","pos":[0,-44.428,-2.984],"q":[0,0,0,1],"wp":[-0.0821,0.0844,-0.0222]},{"n":"RightToeBase","p":"RightFoot","pos":[0,-8.729,10.711],"q":[0,0,0,1],"wp":[-0.0821,-0.0029,0.0849]}]}; RIG.clips = window.MIRA_RIG_CLIPS = {};
const RS = 0.0105; // cm -> m; guests end up about 1.75 m tall
const DRINKS = [0xd94040, 0xf2c14e, 0xffd9a0, 0x9be0c0, 0xb3122e];
const BONES = RIG.bones.map(b => b.n);
const QT = new T.Quaternion(), QT2 = new T.Quaternion();
// sample a clip's local rotation for one bone at time t (seconds) into q
function sampleQ(clip, bone, t, q, pingpong) {
  const a = clip.q[bone]; if (!a) return false;
  const n = clip.n, d = clip.dur;
  let f;
  if (n <= 2 || d <= 0) f = 0;
  else if (pingpong) { let tt = t % (2 * d); if (tt < 0) tt += 2 * d; if (tt > d) tt = 2 * d - tt; f = tt / d * (n - 1); }
  else { let tt = t % d; if (tt < 0) tt += d; f = tt / d * (n - 1); }
  const i0 = Math.min(n - 1, Math.floor(f)), i1 = Math.min(n - 1, i0 + 1), k = f - i0;
  q.set(a[i0 * 4], a[i0 * 4 + 1], a[i0 * 4 + 2], a[i0 * 4 + 3]);
  if (k > 0 && i1 !== i0) { QT2.set(a[i1 * 4], a[i1 * 4 + 1], a[i1 * 4 + 2], a[i1 * 4 + 3]); q.slerp(QT2, k); }
  return true;
}
function sampleHipsY(clip, t, pingpong) {
  const a = clip.hips; if (!a || !a.length) return 103;
  const n = clip.n, d = clip.dur; let f;
  if (n <= 2 || d <= 0) f = 0; else if (pingpong) { let tt = t % (2 * d); if (tt > d) tt = 2 * d - tt; f = tt / d * (n - 1); } else { let tt = t % d; f = tt / d * (n - 1); }
  const i0 = Math.min(n - 1, Math.floor(f)), i1 = Math.min(n - 1, i0 + 1), k = f - i0;
  return a[i0 * 3 + 1] * (1 - k) + a[i1 * 3 + 1] * k;
}
const EU = new T.Euler();
const E = (x, y, z) => new T.Quaternion().setFromEuler(EU.set(x, y, z, 'XYZ'));
// segment geometry from a bone origin along an axis; r0 at the joint, r1 at the far end
function segGeo(len, r0, r1, axis, seg = 14) {
  const g = new T.CylinderGeometry(r1, r0, len, seg, 1); g.translate(0, len / 2, 0);
  if (axis === 'x') g.rotateZ(-Math.PI / 2); else if (axis === '-x') g.rotateZ(Math.PI / 2); else if (axis === '-y') g.rotateX(Math.PI); else if (axis === 'z') g.rotateX(Math.PI / 2);
  return g;
}
// a limb: a smooth tube from the joint along an axis, with rounded ends that tuck into the next piece, several rings so it
// bends with the joint blending in batchChar, and a muscle bulge (biceps, forearm, thigh, calf) peaking at 'at' of its length
function limbGeo(len, r0, r1, axis, bulge = 0, at = 0.35, seg = 10, n = 4) {
  const pts = [], cap = Math.min(r0, r1) * 0.9;
  for (let i = 0; i <= 2; i++) { const a = (i / 2) * Math.PI / 2; pts.push(new T.Vector2(Math.max(0.01, r0 * Math.sin(a)), -cap * Math.cos(a))); }
  for (let i = 1; i < n; i++) { const t = i / n, b = t < at ? Math.sin(Math.PI / 2 * t / at) : Math.cos(Math.PI / 2 * (t - at) / (1 - at)); pts.push(new T.Vector2(r0 + (r1 - r0) * t + bulge * b, len * t)); }
  for (let i = 0; i <= 2; i++) { const a = (i / 2) * Math.PI / 2; pts.push(new T.Vector2(Math.max(0.01, r1 * Math.cos(a)), len + cap * Math.sin(a))); }
  const g = new T.LatheGeometry(pts, seg);
  if (axis === 'x') g.rotateZ(-Math.PI / 2); else if (axis === '-x') g.rotateZ(Math.PI / 2); else if (axis === '-y') g.rotateX(Math.PI); else if (axis === 'z') g.rotateX(Math.PI / 2);
  return g;
}
// a hand along its bone's x: a rounded palm, four slightly curled fingers and the thumb, as one piece
function handGeo(sx) {
  const parts = [], palm = new T.SphereGeometry(1, 8, 5); palm.scale(4.6, 1.6, 3.7); palm.translate(4.3, 0, 0); parts.push(palm);
  [[-2.55, 5.2, 0.78], [-0.86, 6.1, 0.84], [0.86, 5.8, 0.82], [2.5, 4.7, 0.72]].forEach(([z, l, r]) => {
    const f = limbGeo(l, r, r * 0.85, 'x', 0, 0.5, 5, 1); f.rotateZ(-0.45); f.translate(8.2, -0.1, z); parts.push(f);
  });
  const th = limbGeo(5.2, 1.15, 0.95, 'x', 0, 0.5, 5, 1); th.rotateY(-0.9); th.rotateZ(-0.15); th.translate(2.4, -0.4, 3.4); parts.push(th);
  const g = joinGeos(parts); if (sx < 0) { g.scale(-1, 1, 1); flipWinding(g); } return g;
}
function joinGeos(list) {
  const gs = list.map(g => g.index ? g.toNonIndexed() : g); let n = 0; for (const g of gs) n += g.attributes.position.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  for (const g of gs) { if (!g.attributes.normal) g.computeVertexNormals(); pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; }
  const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); out.setAttribute('uv', new T.BufferAttribute(new Float32Array(n * 2), 2)); return out;
}
function flipWinding(g) { const p = g.attributes.position.array, q = g.attributes.normal.array; for (let i = 0; i < p.length; i += 9) for (const a of [p, q]) for (let c = 0; c < 3; c++) { const t = a[i + 3 + c]; a[i + 3 + c] = a[i + 6 + c]; a[i + 6 + c] = t; } }
const CG = {
  upperArm: { L: limbGeo(27.8, 5.8, 4.8, 'x', 0.5), R: limbGeo(27.8, 5.8, 4.8, '-x', 0.5) }, bareUpper: { L: limbGeo(27.8, 4.4, 3.4, 'x', 0.6), R: limbGeo(27.8, 4.4, 3.4, '-x', 0.6) },
  foreArm: { L: limbGeo(28.3, 4.8, 3.6, 'x', 0.4, 0.25), R: limbGeo(28.3, 4.8, 3.6, '-x', 0.4, 0.25) }, bareFore: { L: limbGeo(28.3, 3.5, 2.6, 'x', 0.6, 0.25), R: limbGeo(28.3, 3.5, 2.6, '-x', 0.6, 0.25) },
  cuff: { L: new T.CylinderGeometry(4.6, 4.6, 3, 8).rotateZ(-Math.PI / 2).translate(26, 0, 0), R: new T.CylinderGeometry(4.6, 4.6, 3, 8).rotateZ(Math.PI / 2).translate(-26, 0, 0) },
  hand: null, // built below with handGeo
  elbow: new T.SphereGeometry(4.8, 8, 6), bareElbow: new T.SphereGeometry(3.4, 8, 6),
  shoulder: (() => { const g = new T.SphereGeometry(7.6, 12, 9); g.scale(1, 0.75, 0.9); return g; })(), bareShoulder: new T.SphereGeometry(5.6, 12, 9),
  thigh: limbGeo(44.4, 8.2, 6.4, '-y', 0.6, 0.3), shin: limbGeo(44.4, 6.4, 4.8, '-y', 0.5, 0.3), bareThigh: limbGeo(44.4, 6.8, 4.6, '-y', 0.7, 0.3), bareShin: limbGeo(44.4, 4.6, 2.9, '-y', 1.1, 0.28),
  knee: new T.SphereGeometry(6.2, 8, 6), bareKnee: new T.SphereGeometry(4.5, 8, 6),
  shoe: new T.BoxGeometry(10, 7, 25).translate(0, -4.3, 4.5), heel: new T.BoxGeometry(7.5, 5, 20).translate(0, -5, 4), heelBlock: new T.BoxGeometry(4, 6, 4).translate(0, -5.5, -4.5),
  pelvis: new T.CylinderGeometry(13.6, 13.4, 16, 14).scale(1, 1, 0.62).translate(0, -5, 0), // oval like the hem round it, so no corner pokes through
  hem: null, jacket: null, bodice: null, // built below with rbox
  neck: segGeo(9.6, 4.8, 5.2, 'y', 8),
  // the head: an egg narrowing to the jaw, cheekbones, a little chin and a flatter back
  head: (() => { const g = new T.SphereGeometry(11.3, 18, 13); g.scale(0.93, 1.12, 1.0); const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const lo = Math.max(0, -y / 12.6), fr = Math.max(0, z / 11.3);
      x *= 1 - 0.2 * lo * lo; z *= 1 - 0.12 * lo * lo * (1 - fr); if (z < 0) z *= 0.94;
      z += 1.2 * Math.exp(-((y + 10.5) ** 2) / 6) * fr * Math.exp(-(x * x) / 18); x *= 1 + 0.04 * Math.exp(-((y + 1.5) ** 2) / 10) * fr; p.setXYZ(i, x, y, z); }
    g.computeVertexNormals(); return g; })(),
  ear: (() => { const g = new T.SphereGeometry(2.4, 6, 5); g.scale(0.5, 1, 0.8); return g; })(),
  eye: new T.SphereGeometry(1.25, 6, 5), brow: new T.BoxGeometry(3.6, 0.7, 0.8),
  nose: (() => { const g = new T.ConeGeometry(1.7, 3.4, 5); g.rotateX(Math.PI / 2); return g; })(), lip: new T.BoxGeometry(3.6, 0.9, 0.8),
  cap: (() => { const g = new T.SphereGeometry(12.2, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56); g.scale(0.95, 1.12, 1.03); return g; })(),
  quiff: (() => { const g = new T.SphereGeometry(7.5, 10, 6); g.scale(1.3, 0.55, 1.1); return g; })(), bun: new T.SphereGeometry(6.2, 10, 8),
  longBack: (() => { const g = new T.CylinderGeometry(11.8, 13.5, 36, 14, 1, true, Math.PI * 0.5, Math.PI); g.scale(1, 1, 0.92); return g; })(),
  bob: new T.CylinderGeometry(12.5, 14, 16, 16, 1, true, Math.PI * 0.32, Math.PI * 1.36),
  beard: (() => { const g = new T.SphereGeometry(11.2, 12, 6, Math.PI * 0.62, Math.PI * 0.76, Math.PI * 0.5, Math.PI * 0.3); g.scale(0.94, 1.12, 1.02); return g; })(),
  earring: new T.SphereGeometry(1.1, 6, 4), necklace: new T.TorusGeometry(6, 0.6, 4, 16),
  vee: (() => { const s = new T.Shape(); s.moveTo(-7.5, 0); s.lineTo(7.5, 0); s.lineTo(0, -27); s.lineTo(-7.5, 0); return new T.ShapeGeometry(s); })(),
  lapel: (() => { const s = new T.Shape(); s.moveTo(0, 0); s.lineTo(5, 0); s.lineTo(0, -28); s.lineTo(-1.2, -5); s.lineTo(0, 0); return new T.ShapeGeometry(s); })(),
  tie: new T.BoxGeometry(4, 23, 1.2).translate(0, -11.5, 0), bow: new T.BoxGeometry(11, 4, 2), button: new T.SphereGeometry(1.2, 6, 4),
  belt: new T.CylinderGeometry(14, 14, 3.5, 16).scale(1, 1, 0.68), // as deep as the bodice at the waist
  strap: new T.TorusGeometry(5, 0.8, 4, 10, Math.PI).rotateY(Math.PI / 2).scale(1, 0.42, 1), // over the shoulder, front to back
  gown: new T.CylinderGeometry(13.5, 36, 100, 14, 1, true).translate(0, -50, 0), cocktail: new T.CylinderGeometry(13.5, 29, 50, 14, 1, true).translate(0, -25, 0),
  clutch: new T.BoxGeometry(3.5, 9, 16),
  wineBowl: new T.CylinderGeometry(3.5, 1.8, 6, 10), wineStem: new T.CylinderGeometry(0.4, 0.4, 7, 4), coupe: new T.CylinderGeometry(4.5, 1.2, 3, 10), tumbler: new T.CylinderGeometry(3.2, 3.0, 7.5, 10),
  shadow: new T.PlaneGeometry(0.9, 0.9).rotateX(-Math.PI / 2),
};
// tailored shapes: lathe profiles ([radius, y] in cm) squashed front-to-back, so jackets taper to the waist and gowns flare
const lathe = (pts, sz = 0.62, seg = 16) => { if (pts[0][1] > pts[pts.length - 1][1]) pts = pts.slice().reverse(); const g = new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg); g.scale(1, 1, sz); return g; };
CG.jacket = lathe([[5, -2.5], [15.2, -2], [15.6, 2], [14.4, 10], [15.3, 20], [17.0, 30], [17.6, 36], [13.5, 39.5], [5, 40.5]]);
CG.hem = lathe([[5, -9.5], [15.4, -9], [15.8, -3], [15.3, 3], [14.9, 8], [5, 8.5]]);
CG.bodice = lathe([[4, -1.5], [13.3, -1], [13.7, 3], [11.7, 12], [13.9, 22], [14.7, 29], [14.1, 34], [9.5, 37], [4, 37.5]], 0.66);
// soft folds falling from the hips: the radius ripples round the skirt, more towards the hem
const folds = (g, k, amp, y0, y1) => { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), f = Math.min(1, Math.max(0, (y0 - y) / (y0 - y1))); if (!f) continue; const w = 1 + amp * f * Math.sin(k * Math.atan2(z, x)); p.setX(i, x * w); p.setZ(i, z * w); } g.computeVertexNormals(); return g; };
CG.gown = folds(lathe([[13.4, 10], [14.6, 4], [17.2, -10], [19.4, -30], [20.2, -48], [21.5, -66], [26, -84], [35, -100]], 0.82, 32), 8, 0.07, 0, -100);
CG.cocktail = folds(lathe([[13.4, 10], [14.6, 4], [16.2, -10], [19, -25], [25, -40], [30, -50]], 0.8, 32), 8, 0.07, -5, -50);
CG.shoe = (() => { const g = new T.SphereGeometry(1, 10, 7); g.scale(5, 3.6, 12.5); g.translate(0, -4.3, 4.5); return g; })();
CG.sole = new T.BoxGeometry(9.6, 1.2, 24).translate(0, -7.4, 4.5);
// eyes: an almond white, a coloured iris and a small pupil; lips: a thin upper lip over a fuller lower one; a nose with
// a bridge, a round tip and the wings of the nostrils
CG.sclera = (() => { const g = new T.SphereGeometry(1.5, 8, 6); g.scale(1.32, 0.95, 0.5); return g; })();
CG.iris = (() => { const g = new T.SphereGeometry(0.82, 8, 4); g.scale(1, 1, 0.35); return g; })();
CG.pupil = (() => { const g = new T.SphereGeometry(0.4, 6, 3); g.scale(1, 1, 0.4); return g; })();
CG.lipUp = (() => { const g = new T.SphereGeometry(1, 8, 4); g.scale(1.65, 0.36, 0.5); return g; })();
CG.lipLo = (() => { const g = new T.SphereGeometry(1, 8, 4); g.scale(1.4, 0.5, 0.55); return g; })();
CG.nose = (() => { const s = (r, sx, sy, sz, x, y, z) => { const g = new T.SphereGeometry(r, 7, 5); g.scale(sx, sy, sz); g.translate(x, y, z); return g; };
  return joinGeos([s(1, 0.7, 1.4, 0.6, 0, 0.3, -1.2), s(1.0, 1.2, 0.9, 0.85, 0, -1.0, -0.55), s(0.65, 1, 0.8, 0.9, -0.95, -1.35, -0.9), s(0.65, 1, 0.8, 0.9, 0.95, -1.35, -0.9)]); })();
// an eyelid: a skin-coloured cap hanging from its top edge, so scaling it in y opens and closes the eye
CG.lid = (() => { const g = new T.SphereGeometry(1.7, 8, 4); g.scale(1.3, 1, 0.75); g.translate(0, -2.0, 0); return g; })();
CG.collar = new T.BoxGeometry(5, 3.2, 1); CG.neckband = new T.TorusGeometry(5.2, 1.0, 5, 14);
CG.lens = new T.BoxGeometry(4.4, 2.7, 1.0); CG.bridge = new T.BoxGeometry(1.6, 0.6, 0.6); CG.temple = new T.BoxGeometry(0.5, 0.6, 11);
CG.watchBand = new T.TorusGeometry(4.9, 0.7, 5, 14); CG.watchFace = new T.CylinderGeometry(2.3, 2.3, 1.1, 10); CG.bracelet = new T.TorusGeometry(4.3, 0.6, 5, 14);
// robes (yukata, kimono, kaftan, djellaba): a bell sleeve over the forearm and a long straight robe skirt
CG.bellSleeve = { L: segGeo(24, 5.0, 8.6, 'x'), R: segGeo(24, 5.0, 8.6, '-x') };
// a long gown seated: the waist and hips, the lap over the thighs and the skirt falling from the knees to the floor,
// shaped for the seated pose (SIT_LEGS) so the knees do not poke through the standing gown
CG.gownSit = {
  hips: lathe([[13.4, 10], [14.6, 4], [17.2, -10], [19, -20], [17, -24]], 0.82),
  lap: (() => { const g = rbox(33, 12, 50, 3); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) * (1 - Math.max(0, p.getZ(i)) / 70)); g.computeVertexNormals(); return g.translate(0, -9.5, 22); })(),
  drape: (() => { const g = new T.CylinderGeometry(15, 21, 46, 12); g.scale(1, 1, 0.42); g.translate(0, -32, 41); return g; })(),
};
// a long gown kneeling: cloth over each thigh and a skirt flaring from each knee, on the leg bones, so the knee up front
// and the shin on the floor behind stay covered
CG.gownKnee = { thigh: new T.CylinderGeometry(9.6, 8.8, 54, 10).translate(0, -25, 0), shin: (() => { const g = new T.CylinderGeometry(9, 11.5, 44, 10); g.scale(1, 1, 0.85); return g.translate(0, -22, 0); })() };
CG.robeSkirt = folds(lathe([[13.4, 10], [15.6, 0], [16.4, -20], [17.4, -50], [19, -80], [20.5, -96]], 0.82, 24), 6, 0.04, 0, -96);
CG.hand = { L: handGeo(1), R: handGeo(-1) };
CG.thumb = new T.SphereGeometry(1.5, 6, 5); CG.pendant = new T.SphereGeometry(1.1, 6, 5);
CG.strand = new T.CylinderGeometry(3.0, 2.4, 26, 8); CG.tail = new T.CylinderGeometry(3.4, 2.0, 30, 8);
CG.fringe = (() => { const g = new T.CylinderGeometry(11.9, 11.7, 7.5, 14, 1, true, -0.8, 1.6); g.scale(0.96, 1, 1.03); return g; })();
// faces: moustache, goatee, blush, a fringe of hair round the back for the balding, a mass of curls
CG.mustache = (() => { const g = new T.SphereGeometry(3.2, 8, 4); g.scale(1.45, 0.36, 0.6); return g; })();
CG.goatee = (() => { const g = new T.SphereGeometry(2.6, 8, 5); g.scale(1, 1.35, 0.7); return g; })();
CG.blush = (() => { const g = new T.SphereGeometry(1.7, 8, 5); g.scale(1.3, 0.85, 0.3); return g; })();
CG.baldRing = (() => { const g = new T.CylinderGeometry(11.5, 11.1, 5, 14, 1, true, Math.PI * 0.58, Math.PI * 0.84); g.scale(0.93, 1, 1.02); return g; })();
CG.curly = (() => { const g = new T.SphereGeometry(13.6, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.62); g.scale(1.06, 1, 1); return g; })();
CG.sideQuiff = (() => { const g = new T.SphereGeometry(7.5, 10, 6); g.scale(1.25, 0.5, 1.15); return g; })();
// how a character walks, fixed per character (the same for players and guests): 0 arms swinging, 1 hands in the pockets
// (trousers only), 2 hands behind the back; a free hand is needed, so a prop or clutch keeps the arms swinging
function walkStyle(o, id) {
  if (o.prop || o.propL || o.clutch) return 0;
  const k = ((id + 1) * 2654435761 >>> 0) % 20;
  return !o.dress && !o.robeLong && k < 5 ? 1 : k >= 17 ? 2 : 0;
}
const noPick = () => { };
function makeChar(o, id) {
  const root = new T.Group(); const rig = new T.Group(); const hs = o.h || 1, bw = o.bw || 1; rig.scale.setScalar(RS * hs); root.add(rig);
  const B = {}; for (const b of RIG.bones) { const ob = new T.Object3D(); ob.name = b.n; ob.position.fromArray(b.pos); B[b.n] = ob; (b.p ? B[b.p] : rig).add(ob); }
  const m = (geo, mm, x, y, z, parent, cast = false) => { const me = new T.Mesh(geo, mm); me.position.set(x, y, z); me.castShadow = cast; me.userData.eid = id; parent.add(me); return me; };
  let gownStand = null, gownSit = null, gownKnee = null;
  const skin = mat(o.skin, { roughness: 0.6 }), hair = mat(o.hair, { roughness: 0.55 });
  const cloth = o.sequin ? mat(o.main, { roughness: 0.26, metalness: 0.7, emissive: o.main, emissiveIntensity: 0.12 }) : mat(o.main, { roughness: o.satin ? 0.35 : 0.72, metalness: o.satin ? 0.15 : 0.02 });
  const gold = mat(0xe2c26a, { metalness: 0.9, roughness: 0.25 });
  const dark = mat(0x16161a, { roughness: 0.3, metalness: 0.2 }), pants = mat(o.pants || o.main, { roughness: 0.75 }), shirt = mat(o.shirt, { roughness: 0.6 });
  const sh = new T.Mesh(CG.shadow, blobMat); sh.position.y = 0.012; sh.renderOrder = 1; root.add(sh);
  // legs
  // under a long gown the legs are slimmer and drawn in a little, so they stay inside the skirt
  for (const s of ['Left', 'Right']) {
    if (o.dress) { const lg = [m(CG.bareThigh, skin, 0, 0, 0, B[s + 'UpLeg']), m(CG.bareKnee, skin, 0, 0, 0, B[s + 'Leg']), m(CG.bareShin, skin, 0, 0, 0, B[s + 'Leg'])]; if (o.gown) for (const g of lg) { g.scale.set(0.72, 1, 0.72); g.position.x = s === 'Left' ? -2.2 : 2.2; } const hm = mat(o.shoe, { roughness: 0.3, metalness: 0.2 }); m(CG.heel, hm, 0, 0, 0, B[s + 'Foot']); m(CG.heelBlock, hm, 0, 0, 0, B[s + 'Foot']); }
    else if (o.shorts) { // shorts and sneakers: cloth to just above the knee, then bare leg
      m(CG.thigh, pants, 0, 0, 0, B[s + 'UpLeg'], true); m(CG.bareKnee, skin, 0, 0, 0, B[s + 'Leg']); m(CG.bareShin, skin, 0, 0, 0, B[s + 'Leg']);
      m(CG.shoe, mat(o.shoe === undefined || o.shoe === 0x1b1b1f ? 0xf2f2ee : o.shoe, { roughness: 0.6 }), 0, 0, 0, B[s + 'Foot']); m(CG.sole, mat(0xf6f3ec, { roughness: 0.8 }), 0, 0, 0, B[s + 'Foot']);
    } else { m(CG.thigh, pants, 0, 0, 0, B[s + 'UpLeg'], true); m(CG.knee, pants, 0, 0, 0, B[s + 'Leg']); m(CG.shin, pants, 0, 0, 0, B[s + 'Leg']); m(CG.shoe, dark, 0, 0, 0, B[s + 'Foot']); m(CG.sole, mat(0x0d0d10, { roughness: 0.6 }), 0, 0, 0, B[s + 'Foot']); }
  }
  // torso
  if (o.dress) {
    m(CG.bodice, cloth, 0, -3, 0, B.Spine, true).scale.x = bw;
    if (o.gown) {
      // two gowns, standing and seated, kept out of the batch so animChar can swap them (see gownSit)
      gownStand = m(CG.gown, cloth, 0, -2, 0, B.Hips, true); gownStand.userData.skirt = true;
      gownSit = new T.Group(); gownSit.position.y = -2; gownSit.visible = false; B.Hips.add(gownSit);
      for (const k of ['hips', 'lap', 'drape']) m(CG.gownSit[k], cloth, 0, 0, 0, gownSit, true).raycast = noPick;
      gownKnee = ['Left', 'Right'].flatMap(s => [m(CG.gownKnee.thigh, cloth, 0, 0, 0, B[s + 'UpLeg']), m(CG.gownKnee.shin, cloth, 0, 0, 0, B[s + 'Leg'])]);
      for (const g of gownKnee) { g.visible = false; g.raycast = noPick; }
    } else m(CG.cocktail, cloth, 0, -2, 0, B.Hips, true).userData.skirt = true;
    if (!o.robe) {
      m(CG.belt, mat(o.accent, { metalness: 0.6, roughness: 0.3 }), 0, -3, 0, B.Spine);
      for (const s of ['Left', 'Right']) { m(CG.bareShoulder, skin, 0, 0, 0, B[s + 'Arm']); m(CG.strap, cloth, s === 'Left' ? 8.6 : -8.6, 13.4, 2.6, B.Spine2); }
    } else for (const s of ['Left', 'Right']) m(CG.shoulder, cloth, 0, 0, 0, B[s + 'Arm']);
    if (o.necklace) { const n = m(CG.necklace, gold, 0, 14, 4, B.Spine2); n.rotation.x = Math.PI / 2 + 0.35; m(CG.pendant, mat(o.accent === 0xc9ced6 ? 0xd8e4f0 : 0xe2c26a, { metalness: 0.9, roughness: 0.2 }), 0, 11, 8.5, B.Spine2); }
  } else {
    { const pv = m(CG.pelvis, pants, 0, 0, 0, B.Hips); pv.scale.x = bw; pv.userData.wy = ['Spine', -6, 6]; }
    if (!o.tee && !o.knit && !o.camisa) { const hm = m(o.robe && o.robeLong ? CG.robeSkirt : CG.hem, cloth, 0, 0, 0, B.Hips, !!o.robeLong); hm.scale.x = bw; if (!o.robeLong) hm.userData.wy = ['Spine', -6, 6]; else hm.userData.skirt = true; } // a T-shirt, sweater or tucked-in shirt ends at the waist
    // build: the torso is a little wider or narrower (width only, so everything on the chest stays put)
    m(CG.jacket, cloth, 0, -4, 0, B.Spine, true).scale.x = bw;
    for (const s of ['Left', 'Right']) m(CG.shoulder, cloth, 0, 0, 0, B[s + 'Arm']);
  }
  if (o.robe) {
    // a robe closes at the neck: crossed collar (left over right) or a plain round neck
    const cm = mat(o.collar ?? new T.Color(o.main).multiplyScalar(0.55).getHex(), { roughness: 0.6 });
    if (o.robe === 'cross') { const v = m(CG.vee, cm, 0, 16, o.dress ? 10.4 : 12.0, B.Spine2); v.rotation.x = o.dress ? -0.2 : -0.12; v.scale.set(0.8, 0.85, 1); }
    m(CG.neckband, cm, 0, 1.2, 0.3, B.Neck).rotation.x = Math.PI / 2;
  } else if (o.tee || o.knit) {
    // a T-shirt or a sweater: round neck in its own colour (a sweater's rolled higher), nothing on the chest
    const nb = m(CG.neckband, cloth, 0, o.knit ? 2.2 : 1.2, 0.3, B.Neck); nb.rotation.x = Math.PI / 2; if (o.knit) nb.scale.set(1.12, 1.12, 2.4);
  } else if (o.camisa) {
    // shirt sleeves, no jacket: collar points, the neck open, two buttons
    const v = m(CG.vee, skin, 0, 16, 11.3, B.Spine2); v.rotation.x = -0.05; v.scale.set(0.6, 0.55, 1); v.position.y = 18;
    for (const sg of [-1, 1]) { const c = m(CG.collar, cloth, sg * 3.6, 17.7, 4.8, B.Spine2); c.rotation.set(-1.05, sg * 0.6, sg * -0.45); }
    m(CG.neckband, cloth, 0, 1.2, 0.3, B.Neck).rotation.x = Math.PI / 2;
    m(CG.button, shirt, 0, 4, 11.6, B.Spine2); m(CG.button, shirt, 0, -6, 11.6, B.Spine2);
  } else if (!o.dress) {
    const v = m(CG.vee, o.vest ? mat(o.vest, { roughness: 0.5 }) : shirt, 0, 16, 11.3, B.Spine2); v.rotation.x = -0.05;
    // shirt collar points and the band round the neck
    for (const sg of [-1, 1]) { const c = m(CG.collar, shirt, sg * 3.4, 17.7, 4.8, B.Spine2); c.rotation.set(-1.05, sg * 0.6, sg * -0.35); } // lying on the shoulders, round the neckband
    m(CG.neckband, shirt, 0, 1.2, 0.3, B.Neck).rotation.x = Math.PI / 2;
    const lapM = mat(new T.Color(o.main).multiplyScalar(o.main > 0xd00000 ? 0.86 : 0.62).getHex(), { roughness: 0.5 });
    const l1 = m(CG.lapel, lapM, 7.5, 16, 11.6, B.Spine2); l1.rotation.x = -0.05;
    const l2 = m(CG.lapel, lapM, -7.5, 16, 11.6, B.Spine2); l2.rotation.set(-0.05, 0, 0); l2.scale.x = -1;
    if (o.bow) m(CG.bow, mat(o.tie), 0, 13, 12, B.Spine2); else m(CG.tie, mat(o.tie, { roughness: 0.45 }), 0, 14, 11.9, B.Spine2);
    m(CG.button, dark, 0, -10, 11.5, B.Spine2); m(CG.button, dark, 0, -17, 11.8, B.Spine2);
    if (o.pocket) m(new T.BoxGeometry(6, 2.2, 1), mat(o.pocket), 11.6, 2, 9.4, B.Spine2).rotation.y = 0.55; // flat on the chest, which curves away here
  }
  m(CG.neck, skin, 0, 0, 0, B.Neck);
  // head: the Head bone sits at the base of the skull
  const headG = new T.Group(); headG.position.set(0, 9.5, 1.5); B.Head.add(headG);
  // the brows hang from a little bone of their own (like the eyelids) so animChar can raise them when startled or talking
  const brows = new T.Object3D(); brows.name = 'Brows'; brows.position.set(0, 9.5, 1.5); B.Head.add(brows); B.Brows = brows;
  m(CG.head, skin, 0, 0, 0, headG, true);
  for (const s of [-1, 1]) {
    m(CG.ear, skin, s * 10.4, -0.5, -0.5, headG);
    m(CG.sclera, mat(0xf4f1ea, { roughness: 0.35 }), s * 3.8, 1.2, 10.35, headG);
    m(CG.iris, mat(o.eyeC || 0x3a2a1a, { roughness: 0.35 }), s * 3.75, 1.15, 10.95, headG);
    m(CG.pupil, mat(0x1a1410, { roughness: 0.2 }), s * 3.75, 1.15, 11.22, headG);
    const b = m(CG.brow, hair, s * 4, 4.2, 10.9, brows); b.rotation.z = s * (-0.12 + (o.browT || 0)); b.scale.y = o.browW || 1;
    if (o.blush) m(CG.blush, mat(new T.Color(o.skin).lerp(new T.Color(0xd9566a), 0.35).getHex(), { roughness: 0.7 }), s * 5.7, -1.8, 9.2, headG);
    if (o.earring) m(CG.earring, mat(0xe2c26a, { metalness: 0.9, roughness: 0.2 }), s * 10.6, -4, 0, headG);
  }
  // eyelids hang from a little bone of their own, so they still blink once the character's meshes are batched
  // (built closed, which is the bind pose; animChar opens them)
  const lids = new T.Object3D(); lids.name = 'Lids'; lids.position.set(0, 9.5 + 3.2, 1.5); B.Head.add(lids); B.Lids = lids;
  for (const s of [-1, 1]) m(CG.lid, skin, s * 3.8, 0, 10.6, lids);
  m(CG.nose, skin, 0, -1.2, 11.9, headG).scale.setScalar(o.nose || 1);
  { const lc = mat(o.lipC || (o.dress ? 0x9b3a3a : new T.Color(o.skin).lerp(new T.Color(0x8a4a40), 0.45).getHex()));
    m(CG.lipUp, lc, 0, -5.3, 10.2, headG); m(CG.lipLo, lc, 0, -6.1, 10.05, headG); }
  if (o.sunglasses) {
    const lm = mat(0x0f0f14, { roughness: 0.15, metalness: 0.6 });
    for (const s of [-1, 1]) { m(CG.lens, lm, s * 3.9, 1.3, 11.6, headG); m(CG.temple, lm, s * 6.6, 1.5, 5.8, headG); }
    m(CG.bridge, lm, 0, 1.5, 11.5, headG);
  }
  if (o.bangs) m(CG.fringe, hair, 0, 6.2, 0.2, headG);
  if (o.hairStyle === 'bald') m(CG.baldRing, hair, 0, 0.2, -0.6, headG);
  else { const capM = m(CG.cap, hair, 0, 1.2, -1.2, headG); capM.rotation.x = -0.32; }
  if (o.hairStyle === 'curly') { const c = m(CG.curly, hair, 0, 1.5, -3.6, headG); c.rotation.x = -0.25; }
  if (o.hairStyle === 'quiff') m(CG.quiff, hair, 0, 10, 3.5, headG);
  if (o.hairStyle === 'bun') m(CG.bun, hair, 0, 8, -10.5, headG);
  if (o.hairStyle === 'long') m(CG.longBack, hair, 0, -13, -1.2, headG);
  if (o.hairStyle === 'bob') m(CG.bob, hair, 0, -4, -0.4, headG);
  if (o.hairStyle === 'side') { const q = m(CG.sideQuiff, hair, 2.8, 9.6, 3.2, headG); q.rotation.z = -0.25; }
  if (o.hairStyle === 'wavy') { m(CG.longBack, hair, 0, -13, -1.2, headG); for (const s of [-1, 1]) { const st = m(CG.strand, hair, s * 9.6, -9, 5.2, headG); st.rotation.z = s * 0.1; st.rotation.x = -0.12; } }
  if (o.hairStyle === 'ponytail') { m(CG.bun, hair, 0, 6, -10.5, headG); const tl = m(CG.tail, hair, 0, -7, -14, headG); tl.rotation.x = 0.28; }
  const bs = o.beardStyle ?? (o.beard ? 'full' : '');
  if (bs === 'full') m(CG.beard, hair, 0, -0.8, 0.4, headG);
  if (bs === 'goatee') m(CG.goatee, hair, 0, -9.2, 9.2, headG);
  if (bs) m(CG.mustache, hair, 0, -3.5, 11.1, headG);
  // arms
  let glass = null, clutch = null;
  for (const s of ['Left', 'Right']) {
    const k = s[0];
    if (o.robe) { m(CG.upperArm[k], cloth, 0, 0, 0, B[s + 'Arm']); m(CG.elbow, cloth, 0, 0, 0, B[s + 'ForeArm']); m(CG.bellSleeve[k], cloth, 0, 0, 0, B[s + 'ForeArm']); }
    else if (o.dress) { m(CG.bareUpper[k], skin, 0, 0, 0, B[s + 'Arm']); m(CG.bareElbow, skin, 0, 0, 0, B[s + 'ForeArm']); m(CG.bareFore[k], skin, 0, 0, 0, B[s + 'ForeArm']); }
    else if (o.camisa) { m(CG.upperArm[k], cloth, 0, 0, 0, B[s + 'Arm']); m(CG.elbow, cloth, 0, 0, 0, B[s + 'ForeArm']); const rl = m(CG.cuff[k], cloth, 0, 0, 0, B[s + 'ForeArm']); rl.scale.set(0.5, 1.25, 1.25); rl.position.x = s === 'Left' ? -7 : 7; m(CG.bareFore[k], skin, 0, 0, 0, B[s + 'ForeArm']); } // sleeves rolled to the elbow
    else if (o.tee) { const sl = m(CG.upperArm[k], cloth, 0, 0, 0, B[s + 'Arm']); sl.scale.set(0.5, 1.12, 1.12); m(CG.bareUpper[k], skin, 0, 0, 0, B[s + 'Arm']); m(CG.bareElbow, skin, 0, 0, 0, B[s + 'ForeArm']); m(CG.bareFore[k], skin, 0, 0, 0, B[s + 'ForeArm']); }
    else { m(CG.upperArm[k], cloth, 0, 0, 0, B[s + 'Arm']); m(CG.elbow, cloth, 0, 0, 0, B[s + 'ForeArm']); m(CG.foreArm[k], cloth, 0, 0, 0, B[s + 'ForeArm']); m(CG.cuff[k], o.knit ? cloth : shirt, 0, 0, 0, B[s + 'ForeArm']); }
    m(CG.hand[k], skin, 0, 0, 0, B[s + 'Hand']);
    if (s === 'Left' && o.watch) { m(CG.watchBand, mat(o.watch === 'gold' ? 0x3a2a1a : 0x15151a, { roughness: 0.5 }), 25.2, 0, 0, B.LeftForeArm).rotation.y = Math.PI / 2; m(CG.watchFace, o.watch === 'gold' ? gold : mat(0xd0d4da, { metalness: 0.9, roughness: 0.2 }), 25.2, 4.6, 0, B.LeftForeArm); }
    if (o.bracelet && ((o.bracelet === 'L') === (s === 'Left'))) { m(CG.bracelet, gold, s === 'Left' ? 24.5 : -24.5, 0, 0, B[s + 'ForeArm']).rotation.y = Math.PI / 2; }
    if (s === 'Right' && o.glass) {
      glass = new T.Group(); glass.position.set(-7, -2, 3); B.RightHand.add(glass);
      const drink = mat(o.drink, { emissive: o.drink, emissiveIntensity: 0.25, roughness: 0.2 });
      if (o.glass === 'wine') { m(CG.wineStem, glassClear, 0, 0, 0, glass); m(CG.wineBowl, drink, 0, 6, 0, glass); }
      else if (o.glass === 'coupe') { m(CG.wineStem, glassClear, 0, 0, 0, glass); m(CG.coupe, drink, 0, 5, 0, glass); }
      else m(CG.tumbler, drink, 0, 3, 0, glass);
    }
    if (s === 'Left' && o.clutch) { clutch = m(CG.clutch, mat(o.accent, { metalness: 0.5, roughness: 0.3 }), 8, -3, 3, B.LeftHand); }
  }
  const phone = m(new T.BoxGeometry(2.6, 5.0, 0.5), mat(0x15151a, { roughness: 0.3, metalness: 0.4 }), -5, -1, 4.5, B.RightHand); phone.visible = false;
  m(new T.PlaneGeometry(2.2, 4.4), glow(0xbfe8ff, 1.3), 0, 0, 0.3, phone).visible = true;
  if (o.prop === 'can') { const cm = mat(0x8fa36a, { metalness: 0.5, roughness: 0.4 }); const can = m(new T.CylinderGeometry(5, 5.5, 9, 10), cm, -7, -9, 2, B.RightHand); const sp = m(new T.CylinderGeometry(0.8, 1.2, 13, 6), cm, 7, 3, 0, can); sp.rotation.z = -1.0; m(new T.TorusGeometry(3, 0.6, 5, 10), cm, 0, 5, 0, can).rotation.x = Math.PI / 2; }
  if (o.prop === 'sax') { const bm = mat(0xd9a441, { metalness: 0.9, roughness: 0.25 }); const sax = new T.Group(); sax.position.set(6, -10, 16); sax.rotation.z = -0.25; B.Spine2.add(sax); m(new T.CylinderGeometry(1.6, 2.2, 32, 8), bm, 0, 0, 0, sax); const bell = m(new T.CylinderGeometry(6, 2.2, 10, 10), bm, 0, -20, 3, sax); bell.rotation.x = -0.8; m(new T.CylinderGeometry(1.0, 1.0, 10, 6), mat(0x15151a), -1, 19, -4, sax).rotation.x = 0.7; for (let i = 0; i < 6; i++) m(new T.SphereGeometry(0.9, 6, 4), mat(0xf6f1e8), 1.8, 10 - i * 3.5, 1.2, sax); }
  if (o.prop === 'brush') { const br = m(new T.CylinderGeometry(0.4, 0.5, 14, 5), walnut, -7, -1, 4, B.RightHand); br.rotation.x = Math.PI / 2; m(new T.ConeGeometry(0.9, 2.5, 6), mat(0xc8322f), 0, 8, 0, br); const pal = m(new T.CylinderGeometry(9, 9, 0.6, 12), mat(0xd8c8a0, { roughness: 0.9 }), 9, -2, 2, B.LeftHand); pal.scale.z = 0.75; [0xc8322f, 0x2e5fa8, 0xe9c33b, 0x3f8a3a, 0xf6f1e8].forEach((c, i) => m(new T.CylinderGeometry(1.4, 1.4, 0.6, 8), mat(c), -4 + i * 2.2, 0.5, (i % 2 ? -3 : 3), pal)); }
  if (window.MIRA_VESTIR) { try { MIRA_VESTIR(T, o, B, m, mat, glow, headG); } catch (e) { console.warn('vestir', e); } }
  batchChar(root, B, [glass, clutch, phone, sh, gownStand, gownSit, ...gownKnee || []]);
  root.userData = { parts: B, rig, bones: B, id, ph: Math.random() * 10, glass, clutch, phone, gownStand, gownSit, gownKnee, tray: o.prop === 'tray', hs, walk: walkStyle(o, id), x: 0, z: 0, rot: 0, init: false, shadow: sh, clip: 'idle', ct: Math.random() * 3, prev: null, pt: 0, blend: 1, ovr: {}, ry: 0, rx: 0, hipsY: 103 };
  return root;
}
const CLIP_PP = { samba: true };
const Q_IDENT = new T.Quaternion();
// desired overrides per anim: bone -> local rotation (rest frames are the world axes: arms along ±x, legs -y, face +z)
const SIT_LEGS = () => [['LeftUpLeg', E(-1.5, 0, 0.08)], ['RightUpLeg', E(-1.5, 0, -0.08)], ['LeftLeg', E(1.5, 0, 0)], ['RightLeg', E(1.5, 0, 0)], ['LeftFoot', E(0.05, 0, 0)], ['RightFoot', E(0.05, 0, 0)]];
// like ARM, with the upper arm twisted (positive turns the bend in towards the body)
const ARM2 = (s, swing, out, bend, tw) => { const L = s === 'Left' ? 1 : -1; return [[s + 'Arm', E(-swing, L * tw, -L * (Math.PI / 2 - out))], [s + 'ForeArm', E(0, -L * bend, 0)]]; };
const ARM = (s, swing, out, bend) => { const L = s === 'Left' ? 1 : -1; return [[s + 'Arm', E(-swing, 0, -L * (Math.PI / 2 - out))], [s + 'ForeArm', E(0, -L * bend, 0)]]; };
// a waiter carries the tray up at chest height, palm under it, whenever the right hand is free
const TRAY_HOLD = new Set([0, 1, 4, 6, 22, 23, 24, 25]);
function overridesFor(anim, u, t) {
  const o = overridesFor0(anim, u, t);
  return u.tray && TRAY_HOLD.has(anim) ? o.filter(([b]) => b !== 'RightArm' && b !== 'RightForeArm').concat(ARM('Right', 0.3, 0.32, 1.55)) : o;
}
function overridesFor0(anim, u, t) {
  const o = [];
  const sip = Math.max(0, Math.sin((t + u.ph) * 0.35) - 0.94) * 16;
  if (anim === 5) return o;
  if (anim === 1) {
    // each character has their own way of walking: free arms, hands in the pockets, or hands behind the back
    if (u.walk === 1) { o.push(...ARM('Left', -0.12, 0.2, 0.55)); if (!u.glass) o.push(...ARM('Right', -0.12, 0.2, 0.55)); }
    else if (u.walk === 2) { o.push(...ARM2('Left', -0.35, 0.12, 1.5, -2.2)); if (!u.glass) o.push(...ARM2('Right', -0.35, 0.12, 1.5, -2.2)); o.push(['Head', E(0.05, Math.sin((t + u.ph) * 0.6) * 0.2, 0)]); }
    if (u.glass) o.push(...ARM('Right', 0.25, 0.08, 1.55));
    return o;
  }
  if (anim === 2) { o.push(['Spine1', E(0.3, 0, 0)], ['Head', E(0.35, 0, 0)], ...ARM('Right', 0.9 + Math.sin(t * 7) * 0.08, 0.12, 0.9), ...ARM('Left', 0.55, 0.15, 1.1)); return o; }
  if (anim === 3) return o;
  if (anim === 6) { o.push(...ARM('Right', 2.1 + Math.sin(t * 2) * 0.05, 0.25, 1.4), ['Head', E(-0.2, 0, 0)]); return o; }
  if (anim === 7 || anim === 9) {
    o.push(['LeftUpLeg', E(-1.5, 0, 0.08)], ['RightUpLeg', E(-1.5, 0, -0.08)], ['LeftLeg', E(1.5, 0, 0)], ['RightLeg', E(1.5, 0, 0)], ['LeftFoot', E(0.05, 0, 0)], ['RightFoot', E(0.05, 0, 0)]);
    if (anim === 9) { o.push(...ARM('Left', 1.05 + Math.sin(t * 9) * 0.06, 0.2, 1.25 + Math.cos(t * 7.3) * 0.08), ...ARM('Right', 1.05 + Math.cos(t * 8) * 0.06, 0.2, 1.25 + Math.sin(t * 6.1) * 0.08), ['Head', E(0.25, Math.sin(t * 1.1) * 0.1, 0)], ['Spine1', E(0.12, 0, 0)]); }
    else { o.push(...ARM('Left', 0.55, 0.12, 1.1), ...(u.glass ? ARM('Right', 0.5 + sip * 0.9, 0.1, 1.6 + sip * 0.5) : ARM('Right', 0.55, 0.12, 1.1)), ['Head', E(sip * -0.12, Math.sin(t * 0.5 + u.ph) * 0.35, 0)]); }
    return o;
  }
  if (anim === 8) { o.push(...ARM('Left', 0.1, 0.25, 0.4), ...ARM('Right', 0.1, 0.25, 0.4), ['Head', E(-0.3, 0, 0)], ['LeftUpLeg', E(-0.15, 0, 0.05)], ['RightUpLeg', E(-0.15, 0, -0.05)], ['LeftLeg', E(0.15, 0, 0)], ['RightLeg', E(0.15, 0, 0)]); return o; }
  if (anim === 11) { // yoga: tree pose, warrior arms, then hands together, each held a few seconds
    const ph = Math.floor((t + u.ph) / 7) % 3;
    if (ph === 0) o.push(...ARM('Left', 0.1, 2.85, 0.2), ...ARM('Right', 0.1, 2.85, 0.2), ['RightUpLeg', E(-0.5, 0, -1.1)], ['RightLeg', E(2.0, 0, 0)], ['Head', E(-0.15, 0, 0)]);
    else if (ph === 1) o.push(...ARM('Left', 0.0, Math.PI / 2, 0.05), ...ARM('Right', 0.0, Math.PI / 2, 0.05), ['LeftUpLeg', E(-0.7, 0, 0.15)], ['LeftLeg', E(0.9, 0, 0)], ['RightUpLeg', E(0.45, 0, -0.1)], ['Head', E(0, -0.5, 0)]);
    else o.push(...ARM('Left', 0.75, 0.05, 2.3), ...ARM('Right', 0.75, 0.05, 2.3), ['Head', E(0.25, 0, 0)]);
    return o;
  }
  if (anim === 12) { const c = Math.max(0, Math.sin((t + u.ph) * 1.5)); o.push(...SIT_LEGS(), ...ARM('Left', 0.95, 0.15, 1.3), ...ARM('Right', 0.95 + c * 0.45, 0.15, 1.25 - c * 0.3), ['Head', E(0.3, Math.sin(t * 0.7 + u.ph) * 0.2, 0)], ['Spine1', E(0.12, 0, 0)]); return o; }
  if (anim === 13) { o.push(['Spine1', E(0.15, 0, Math.sin(t * 2.1) * 0.1)], ['Head', E(0.25, 0, Math.sin(t * 2.1) * 0.06)], ...ARM('Right', 0.85, 0.2, 1.7), ...ARM('Left', 0.7, 0.15, 2.0)); return o; }
  if (anim === 14) { o.push(...ARM('Right', 1.35 + Math.sin(t * 2.2) * 0.12, 0.25, 0.45 + Math.sin(t * 3.1) * 0.18), ...ARM('Left', 0.6, 0.5, 1.6), ['Head', E(0.05, 0.25 + Math.sin(t * 0.6) * 0.1, 0)]); return o; }
  if (anim === 15) { o.push(...SIT_LEGS(), ...ARM('Left', -0.4, 1.0, 0.5), ...ARM('Right', -0.4, 1.0, 0.5), ['Head', E(-0.25, Math.sin(t * 0.4 + u.ph) * 0.3, 0)]); return o; }
  if (anim === 16) { o.push(...ARM('Left', 0.6, 0.1, 2.1), ...ARM('Right', 0.6, 0.1, 2.1), ['Head', E(-0.2, 0, 0)], ['LeftUpLeg', E(-0.85, 0, 0.12)], ['RightUpLeg', E(-0.85, 0, -0.12)], ['LeftLeg', E(1.15, 0, 0)], ['RightLeg', E(1.15, 0, 0)]); return o; }
  if (anim === 17) { o.push(...SIT_LEGS(), ...ARM('Right', 1.15, 0.15, 2.4), ...ARM('Left', 0.6, 0.12, 1.2), ['Head', E(0.3, Math.sin(t * 0.5 + u.ph) * 0.15, 0.12)], ['Spine1', E(0.2, 0, 0)]); return o; }
  if (anim === 18) { o.push(...ARM('Right', 2.2, 0.6, 0.9), ['Head', E(-0.1, 0.3, 0.2)]); if (u.glass) o.push(...ARM('Left', 0.45, 0.12, 1.6)); return o; }
  if (anim === 19) { const w = 0.5 + Math.sin(t * 0.8) * 0.25; o.push(...ARM('Right', 0.7, 0.35, 0.9 + w * 0.3), ...ARM('Left', 0.3, 0.2, 0.6), ['Spine1', E(0.25, 0, 0)], ['Head', E(0.3, 0, 0)]); return o; }
  if (anim === 20) { const pl = Math.max(0, Math.sin((t + u.ph) * 2)); o.push(...ARM('Right', 1.15 + pl * 0.5, 0.15, 1.0), ...ARM('Left', 0.9, 0.1, 1.1), ['Head', E(0.1, 0, 0)]); return o; }
  if (anim === 21) { // kneel on one knee and set something down on the floor in front, then look about
    const r = Math.sin((t + u.ph) * 1.6) * 0.12;
    o.push(['Spine', E(0.3, 0, 0)], ['Spine1', E(0.22, 0, 0)], ['Head', E(0.25, Math.sin((t + u.ph) * 0.9) * 0.35, 0)],
      ['LeftUpLeg', E(-1.6, 0, 0.12)], ['LeftLeg', E(1.65, 0, 0)], ['LeftFoot', E(-0.1, 0, 0)],
      ['RightUpLeg', E(-0.15, 0, -0.1)], ['RightLeg', E(1.75, 0, 0)], ['RightFoot', E(0.9, 0, 0)],
      ...ARM('Right', 0.75 + r, 0.12, 0.35 + r), ...ARM('Left', 0.95, 0.25, 1.35));
    return o;
  }
  if (anim === 22) { // hands clasped behind the back, looking at the view or a painting
    o.push(...ARM2('Left', -0.35, 0.12, 1.5, -2.2), ...(u.glass ? ARM('Right', 0.45 + sip * 0.95, 0.12, 1.6 + sip * 0.45) : ARM2('Right', -0.35, 0.12, 1.5, -2.2)), ['Head', E(-0.08 + sip * -0.12, Math.sin((t + u.ph) * 0.3) * 0.3, 0)]); return o;
  }
  if (anim === 23) { // arms folded across the chest, weight on one leg
    o.push(...ARM2('Left', 0.55, 0.2, 2.1, -0.9), ...ARM2('Right', 0.45, 0.2, 2.1, -0.9), ['Head', E(0.05, Math.sin((t + u.ph) * 0.4) * 0.25, 0)]); return o;
  }
  if (anim === 24) { // rubbing the hands together against the cold
    const w = Math.sin((t + u.ph) * 7) * 0.08;
    o.push(...ARM2('Left', 0.7 + w, 0.1, 1.4, -0.22), ...ARM2('Right', 0.7 - w, 0.1, 1.4, -0.22), ['Head', E(0.18, 0, 0)], ['Spine1', E(0.08, 0, 0)]); return o;
  }
  if (anim === 25) { // a small bow now and then while talking
    const bw = Math.max(0, Math.sin((t + u.ph) * 0.7) - 0.55) * 1.4;
    o.push(['Spine', E(bw * 0.45, 0, 0)], ['Spine1', E(bw * 0.25, 0, 0)], ['Head', E(bw * 0.2, 0, 0)], ...ARM('Left', 0.1, 0.06, 0.15), ...(u.glass ? ARM('Right', 0.45, 0.12, 1.6) : ARM('Right', 0.1, 0.06, 0.15))); return o;
  }
  if (anim === 10) { o.push(...ARM('Left', 1.2, 0.35, 1.35), ...ARM('Right', 1.2, 0.35, 1.35), ['Head', E(0.2, 0, 0)], ['Spine1', E(0.1, 0, 0)]); return o; }
  // idle / talk / bar: hold the glass and sip now and then
  if (u.glass) o.push(...ARM('Right', 0.45 + sip * 0.95, 0.12, 1.6 + sip * 0.45), ['Head', E(sip * -0.12, 0, 0)]);
  if (anim === 4) { const g = Math.max(0, Math.sin((t + u.ph) * 1.25)); o.push(...ARM('Left', 0.35 + g * 0.5, 0.25 + g * 0.2, 1.0 + g * 0.3)); }
  return o;
}
function animChar(c, anim, t, moving, dt = 0.016, speed = 1.2) {
  const u = c.userData, B = u.bones, rig = u.rig;
  u.shadow.visible = anim !== 5;
  // base clip
  let clip = 'idle', rate = 1;
  if (anim === 1 || (moving && anim !== 5)) { clip = 'walk'; rate = Math.max(0.7, Math.min(1.6, speed / 1.25)); }
  else if (anim === 3) { clip = 'samba'; rate = 1; }
  else if (anim === 2) clip = 'sneak_pose';
  else if (anim === 4 || anim === 25) { clip = (u.ph % 3) < 1 ? 'headShake' : 'agree'; rate = 0.75; }
  if (clip !== u.clip) { u.prev = u.clip; u.pt = u.ct; u.clip = clip; u.ct = (clip === 'walk' || clip === 'samba') ? u.ct : Math.random() * 2; u.blend = 0; }
  u.ct += dt * rate; u.pt += dt; u.blend = Math.min(1, u.blend + dt / 0.3);
  const cl = CLIPS[u.clip], pc = u.prev ? CLIPS[u.prev] : null;
  for (const bn of BONES) {
    const b = B[bn];
    if (!sampleQ(cl, bn, u.ct, b.quaternion, CLIP_PP[u.clip])) b.quaternion.identity();
    if (u.blend < 1 && pc && sampleQ(pc, bn, u.pt, QT, CLIP_PP[u.prev])) b.quaternion.slerp(QT, 1 - u.blend);
  }
  let hy = sampleHipsY(cl, u.ct, CLIP_PP[u.clip]);
  if (u.blend < 1 && pc) hy = hy * u.blend + sampleHipsY(pc, u.pt, CLIP_PP[u.prev]) * (1 - u.blend);
  B.Hips.position.y = hy;
  // blinking: every few seconds the lids close for a moment; closed when lying dead
  if (B.Brows) { // brows: up when crouching (startled by a shot or putting something down), lively while talking
    let up = 0; if (anim === 21) up = 1.4; else if (anim === 4) { const w = Math.sin(t * 2.3 + u.ph * 3); up = w > 0.55 ? (w - 0.55) * 3 : w < -0.8 ? -0.5 : 0; }
    u.bu = (u.bu || 0) + (up - (u.bu || 0)) * Math.min(1, dt * 10); B.Brows.position.y = 9.5 + u.bu;
  }
  if (B.Lids) { u.blink = (u.blink ?? 1 + Math.random() * 4) - dt; if (u.blink < -0.13) u.blink = 2 + Math.random() * 4.5; B.Lids.scale.y = anim === 5 || u.blink < 0 ? 1 : 0.08; }
  // procedural overrides eased in and out
  const want = overridesFor(anim, u, t), seen = {};
  const k = 1 - Math.exp(-dt * 9);
  for (const [bn, q] of want) { let ov = u.ovr[bn]; if (!ov) ov = u.ovr[bn] = { q: q.clone(), w: 0 }; else ov.q.slerp(q, 0.5); ov.w += (1 - ov.w) * k; seen[bn] = true; }
  for (const bn in u.ovr) { const ov = u.ovr[bn]; if (!seen[bn]) { ov.w += (0 - ov.w) * k; if (ov.w < 0.01) { delete u.ovr[bn]; continue; } } B[bn].quaternion.slerp(ov.q, ov.w); }
  if (u.look && u.look.w > 0.002) { QT.setFromEuler(EU.set(0, u.look.yaw, 0, 'XYZ')); QT2.copy(B.Head.quaternion).multiply(QT); B.Head.quaternion.slerp(QT2, u.look.w * 0.75); QT2.copy(B.Neck.quaternion).multiply(QT); B.Neck.quaternion.slerp(QT2, u.look.w * 0.3); }
  // whole-body placement: sitting drops the hips, lying tilts the rig, dead lies flat
  let ry = 0, rx = 0, rz = 0;
  // (hips sit on the seat whatever the guest's height; the other drops scale with it)
  const hs = u.hs;
  if (anim === 7 || anim === 9 || anim === 12 || anim === 17) ry = (u.seatHy !== undefined ? u.seatHy : 0.56) - 1.08 * hs;
  else if (anim === 15) ry = -0.72 * hs;
  else if (anim === 21) ry = -0.46 * hs;
  else if (anim === 16) { rx = -1.0; ry = 0.22 * hs; rz = -0.05; }
  else if (anim === 8) { rx = -1.2; ry = 0.46 * hs; rz = -0.05; }
  else if (anim === 5) { rx = -Math.PI / 2; ry = 0.12 * hs; }
  u.ry += (ry - u.ry) * k; u.rx += (rx - u.rx) * k;
  rig.position.set(0, u.ry, anim === 8 || anim === 16 ? rz : 0); rig.rotation.x = u.rx;
  if (u.gownSit) { // seated in a long gown: swap to the seated gown (and make only the shown one hit by the scope)
    const sit = anim === 7 || anim === 9 || anim === 12 || anim === 17;
    if (u.gownSit.visible !== sit) { u.gownSit.visible = sit; (u.gownStand.userData.skin || u.gownStand).visible = !sit; u.gownStand.raycast = sit ? noPick : T.Mesh.prototype.raycast; u.gownSit.traverse(n => { if (n.isMesh) n.raycast = sit ? T.Mesh.prototype.raycast : noPick; }); }
    const kneel = anim === 21;
    if (u.gownKnee[0].visible !== kneel) for (const g of u.gownKnee) { g.visible = kneel; g.raycast = kneel ? T.Mesh.prototype.raycast : noPick; }
  }
  if (u.phone) u.phone.visible = anim === 18;
  if (u.glass) u.glass.visible = anim !== 18 && anim !== 15 && anim !== 21;
  // keep the drink upright whatever the hand does
  if (u.glass) { B.RightHand.updateWorldMatrix(true, false); c.getWorldQuaternion(QT); B.RightHand.getWorldQuaternion(QT2); u.glass.quaternion.copy(QT2.invert().multiply(QT)); }
}
const CLIPS = RIG.clips;
const charGroup = new T.Group(); scene.add(charGroup);
let CHARS = [], CHAR_SEED = null;
const CHAR_BY_ID = new Map();
let entityArray = null, entityIndex = new Map();
function entitiesById(st) { if (entityArray !== st.ents) { entityArray = st.ents; entityIndex.clear(); for (const e of st.ents) entityIndex.set(e.id, e); } return entityIndex; }
function buildChars(st) {
  for (const c of CHARS) { charGroup.remove(c); disposeBatched(c); }
  CHARS = st.ents.map(e => { const c = makeChar(outfitFor(st.sd, e.id, st), e.id); charGroup.add(c); return c; });
  CHAR_BY_ID.clear(); st.ents.forEach((e, i) => CHAR_BY_ID.set(e.id, CHARS[i]));
  CHAR_SEED = st.sd;
}

// ---------------------------------------------------------------- maps: the rooftop (0) or one of the extra scenarios (1..n)
// The rooftop is built once and hidden while a scenario is up; a scenario is built from its script into SCEN.root and swaps
// the level list, stairs, obstacles, spots, cast, missions and ambient light. The host picks the map; the id travels in the
// round state (mp) so every player builds the same scene.
let MAP0 = null;
function finishRooftop() {

{ const holder = new T.Group(); holder.name = 'map0-batched'; scene.add(holder); SCEN.batch0 = batchStatic(MAP0.objs.slice(), holder, new Set(OCCLUDERS.concat(MAP0.floors))); MAP0.objs.push(holder);
  // what hides someone from the sniper also stops the shot (as in the scenarios, where every mesh is an occluder): every opaque
  // piece of the rooftop, merged or not, joins OCCLUDERS. Glass, see-through bits and what starts hidden stay out (fonte/cenarios/ferramentas/oclusores.js)
  const inOcc = new Set(OCCLUDERS), floors = new Set(MAP0.floors), seeThrough = m => (Array.isArray(m) ? m : [m]).every(x => !x || (x.transparent && x.opacity < 0.6) || x.visible === false || x.blending !== T.NormalBlending);
  const shownNow = o => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
  // less of the neutral room's reflection on the rooftop: the shade takes the sky's blue instead of a flat light grey
  { const seen = new Set(); for (const r of MAP0.objs) r.traverse(o => { if (o.isMesh && !o.isSkinnedMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m && m.envMapIntensity !== undefined && !seen.has(m)) { seen.add(m); m.envMapIntensity *= 0.35; } }); }); }
  for (const r of MAP0.objs) r.traverse(o => { if (o.isMesh && !o.isSkinnedMesh && shownNow(o) && !inOcc.has(o) && !floors.has(o) && o.userData.eid === undefined && !(o.userData.noCol && o.parent && o.parent.userData.noCol) && !seeThrough(o.material)) OCCLUDERS.push(o); }); }

}
function ensureRooftop() {
  if (rooftopReady) return;
  LEVELS = ROOT_BASE.levels; LV_N = LEVELS.length; LINKS = ROOT_BASE.links; STATICS = ROOT_BASE.statics;
  COLS.length = 0; COLS.push(...ROOT_BASE.cols); SLOTS.length = 0; SLOTS.push(...ROOT_BASE.slots);
  setMissions(ROOT_BASE.props); SNIPER_POS.copy(ROOT_BASE.pos);
  PERF.measure('rooftopBuild', buildRooftop);
  MAP0 = { ...ROOT_BASE, cols: COLS.slice(), slots: SLOTS.slice(), floors: FLOORS.slice(), bars: BAR_ZONES.slice(), objs: MAP0_OBJS };
}

function disposeTree(o) {
  const liveGeometries = new Set(), liveMaterials = new Set(MATS.values()), liveTextures = new Set();
  const remember = n => { if (n.geometry) liveGeometries.add(n.geometry); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => liveMaterials.add(m)); };
  const visit = n => { if (n === o) return; remember(n); for (const c of n.children) visit(c); }; visit(scene);
  for (const m of liveMaterials) for (const v of Object.values(m)) if (v?.isTexture) liveTextures.add(v);
  const geometries = new Set(), materials = new Set(), textures = new Set();
  o.traverse(n => { if (n.geometry) geometries.add(n.geometry); if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => materials.add(m)); });
  for (const m of materials) if (!liveMaterials.has(m)) { for (const v of Object.values(m)) if (v?.isTexture && !liveTextures.has(v)) textures.add(v); m.dispose(); }
  for (const g of geometries) if (!liveGeometries.has(g)) g.dispose();
  for (const t of textures) t.dispose();
}

function skyTex(c) { return canvasTex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); c.forEach((st, i) => gr.addColorStop(i / (c.length - 1), st)); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); }
function applyAmbient(A) {
  if (!A) {
    if (SCEN.sky) { SCEN.sky.dispose(); SCEN.sky = null; }
    // light and fog colours are linear values (0x4a4a72 used to be read as linear and came out a pale lavender): a low warm
    // sun from the left with long shadows, the shade in the blue of the sky, the far hills as dark silhouettes on the dusk
    scene.background = SKY0 || scene.background; scene.fog.color.set(0x11112b); scene.fog.near = 110; scene.fog.far = 330;
    hemi.color.set(0x455fab); hemi.groundColor.set(0x1a0f09); hemi.intensity = envTex ? 0.3 : 0.6;
    sun.color.set(0xff7a30); sun.intensity = 2.0; sun.position.set(-30, 14, 6); fill.color.set(0x364ca1); fill.intensity = 0.45;
    scene.environment = envTex; if (bloomPass) bloomPass.strength = 0.55; SCEN.exposure = 1;
    Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 95, bottom: -40 });
  } else {
    if (SCEN.sky && SCEN.sky !== NIGHT.sky) SCEN.sky.dispose();
    scene.background = SCEN.sky = skyTex(A.ceu || ['#0e1630', '#2a3558', '#c98a5a']);
    const nb = A.neblina || [0x1a2238, 70, 190]; scene.fog.color.set(nb[0]); scene.fog.near = nb[1]; scene.fog.far = nb[2];
    const hm = A.hemi || [0x8ea4d6, 0x5a4434, 0.2]; hemi.color.set(hm[0]); hemi.groundColor.set(hm[1]); hemi.intensity = hm[2] * (envTex ? 1 : 2);
    const so = A.sol || [0xffb878, 0.95, -22, 19, 14]; sun.color.set(so[0]); sun.intensity = so[1]; sun.position.set(so[2], so[3], so[4]);
    const fl = A.preenche || [0x7f94d0, 0.35]; fill.color.set(fl[0]); fill.intensity = fl[1];
    scene.environment = A.semReflexo ? null : envTex; if (bloomPass) bloomPass.strength = A.bloom ?? 0.55; SCEN.exposure = A.exposicao ?? 1;
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 30, bottom: -30 });
  }
  fitShadowBounds();
}
function fitShadowBounds() {
  // Cropping at 4096² regressed night-map frame time in the pilot. Preserve the original high-profile view.
  if (quality.snapshot().tier === 'high') {
    Object.assign(sun.shadow.camera, SCEN.id === 0 ? { left: -60, right: 60, top: 95, bottom: -40 } : { left: -26, right: 26, top: 30, bottom: -30 });
    sun.shadow.camera.updateProjectionMatrix(); renderer.shadowMap.needsUpdate = true; return;
  }
  sun.updateMatrixWorld(true); sun.target.updateMatrixWorld(true); sun.shadow.updateMatrices(sun);
  const camera = sun.shadow.camera, v = new T.Vector3(); let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of scenePts()) { v.fromArray(p).applyMatrix4(camera.matrixWorldInverse); x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
  if (Number.isFinite(x0)) Object.assign(camera, { left: x0 - 4, right: x1 + 4, top: y1 + 4, bottom: y0 - 4 });
  camera.updateProjectionMatrix(); renderer.shadowMap.needsUpdate = true;
}
const NIGHT = { on: false, sky: null, lights: [] };
function setNight(on) {
  on = !!on && !SCEN.id;
  if (on === NIGHT.on && !(on && !NIGHT.lights.length)) return;
  NIGHT.on = on; if (MAP0K) MAP0K.noite = on;
  if (!NIGHT.sky) NIGHT.sky = skyTex(['#02030a', '#060a1c', '#0d1430', '#1f2348', '#3a2c4e']);
  if (!NIGHT.lights.length) {
    // neon washes over each level (cheap point lights, off by day): magenta, cyan and amber
    const cols = [0xff3fa4, 0x35d8ff, 0xffa24a];
    LEVELS.forEach((L, k) => { for (let i = 0; i < 2; i++) { const pl = new T.PointLight(cols[(k + i) % 3], 0, 14, 2); pl.position.set(i ? L.x1 - 3 : L.x0 + 3, L.y + 2.6, (L.z0 + L.z1) / 2 + (i ? 2 : -2)); pl.visible = false; scene.add(pl); NIGHT.lights.push(pl); } });
  }
  applyAmbient(null);
  if (on) {
    // linear values too: moonlight from behind the tower's right, the neon washes do the rest
    scene.background = NIGHT.sky; scene.fog.color.set(0x010206); scene.fog.near = 60; scene.fog.far = 240;
    scene.environment = null; hemi.color.set(0x1a2370); hemi.groundColor.set(0x030203); hemi.intensity = 0.55;
    sun.color.set(0x586fff); sun.intensity = 0.45; sun.position.set(18, 26, -10); fill.color.set(0x0d1b8a); fill.intensity = 0.2;
    if (bloomPass) bloomPass.strength = 1.0; SCEN.exposure = 0.85;
  }
  for (const pl of NIGHT.lights) { pl.visible = on; pl.intensity = on ? 2.4 : 0; }
  fitShadowBounds();
}
// a scenario's missions become props: its own visible change, two small things left on the object (SCEN_ACTS below) and
// one left on the floor by it
const SCEN_GEN = [['Deixar um bilhete no chão', 'note'], ['Deixar uma moeda marcada no chão', 'coin'], ['Largar um envelope no chão', 'envelope'], ['Deixar uma rosa no chão', 'rose'], ['Esquecer uma luva no chão', 'glove'], ['Marcar o chão com giz', 'mark'], ['Deixar uma chave no chão', 'key'], ['Largar um charuto no chão', 'cigar'], ['Derrubar uma taça no chão', 'glass'], ['Deixar uma ficha de pôquer no chão', 'chip'], ['Largar uma carta de baralho no chão', 'card'], ['Colar um adesivo no chão', 'sticker']];
// Acts of the extra scenarios that belong to the object itself (instead of "leave something on the floor"):
// two per mission, [label, item]. The item lands on the object's own surface (found when the map loads).
const SCEN_ACTS = {
  veneza: {
    poco: [['Esconder uma chave na borda do poço', 'key'], ['Colar um adesivo no poço', 'sticker']],
    torre: [['Pôr algo numa taça da torre de champanhe', 'glass'], ['Deixar um bilhete no bufê', 'note']],
    mascara: [['Esconder um anel entre as máscaras', 'ring'], ['Deixar um cartão na banca de máscaras', 'card']],
    gondola: [['Esquecer uma luva no píer da gôndola', 'glove'], ['Deixar uma rosa no píer das gôndolas', 'rose']],
    leao: [['Deixar uma moeda marcada aos pés do leão', 'coin'], ['Marcar a coluna do leão com giz', 'mark']],
    lustre: [['Esconder um chip ao pé do pilar do arco', 'chip'], ['Deixar um envelope junto ao pilar', 'envelope']],
    partitura: [['Prender um bilhete na estante do quarteto', 'note'], ['Esconder um pendrive no palco', 'usb']],
    aperol: [['Pôr algo num drinque do bacaro', 'glass'], ['Deixar um charuto no balcão do bacaro', 'cigar']],
    relogio: [['Esconder a chave no chão da loggia', 'key'], ['Colar um adesivo no piso da loggia', 'sticker']],
  },
  iate: {
    balde: [['Pôr algo na taça da mesa de centro', 'glass'], ['Esquecer os óculos na mesa de centro', 'glasses']],
    sushi: [['Esconder um chip na mesa de sushi', 'chip'], ['Deixar um bilhete sob o hashi', 'note']],
    jetski: [['Esconder a chave do jet-ski no convés', 'key'], ['Esquecer uma luva junto ao cunho', 'glove']],
    bandeira: [['Deixar um bilhete ao pé do mastro da popa', 'note'], ['Marcar o convés junto ao mastro com giz', 'mark']],
    piscina: [['Esconder um pendrive no painel da piscina', 'usb'], ['Deixar o celular no painel da piscina', 'phone']],
    guardasol: [['Pôr algo no drinque sob o guarda-sol', 'glass'], ['Deixar uma moeda marcada na mesa do guarda-sol', 'coin']],
    radar: [['Colar um adesivo no painel do timão', 'sticker'], ['Esconder um chip no posto de comando', 'chip']],
    vinil: [['Deixar um envelope na cabine da DJ', 'envelope'], ['Esconder um pendrive entre os discos', 'usb']],
    holofote: [['Deixar uma rosa no guarda-corpo', 'rose'], ['Colar um adesivo no holofote', 'sticker']],
  },
  toscana: {
    alianca: [['Deixar um envelope no altar', 'envelope'], ['Esconder um anel entre as flores do altar', 'ring']],
    fita: [['Prender um bilhete na coluna do arco', 'note'], ['Deixar uma rosa na coluna do arco', 'rose']],
    pomba: [['Esconder uma chave na gaiola', 'key'], ['Prender um cartão na gaiola', 'card']],
    safra: [['Pôr algo na taça da adega', 'glass'], ['Colar um adesivo na vitrine da safra', 'sticker']],
    tonel: [['Esconder um chip no tonel', 'chip'], ['Marcar o tonel com giz', 'mark']],
    cartao: [['Prender um bilhete no cavalete', 'note'], ['Deixar uma moeda marcada no cavalete', 'coin']],
    bolo: [['Deixar uma rosa na mesa do bolo', 'rose'], ['Pôr algo na taça da mesa do bolo', 'glass']],
    catavento: [['Esconder a chave na borda do poço', 'key'], ['Deixar uma moeda marcada no poço', 'coin']],
    carroca: [['Esquecer uma luva na carroça', 'glove'], ['Esconder um envelope no feno', 'envelope']],
  },
  museu: {
    gema: [['Colar um adesivo na vitrine das gemas', 'sticker'], ['Esconder um anel ao pé da vitrine', 'ring']],
    rastreador: [['Deixar um cartão no pedestal do T-rex', 'card'], ['Marcar o pedestal com giz', 'mark']],
    telao: [['Esconder um pendrive na mesa de projeção', 'usb'], ['Deixar o celular na mesa de projeção', 'phone']],
    baleia: [['Esconder um chip no guincho', 'chip'], ['Esquecer uma luva na balaustrada', 'glove']],
    meteorito: [['Deixar um bilhete na vitrine do meteorito', 'note'], ['Colar um adesivo na vitrine do meteorito', 'sticker']],
    catalogo: [['Prender um bilhete no púlpito', 'note'], ['Deixar um envelope entre os catálogos', 'envelope']],
    elefante: [['Esconder uma chave no pedestal do elefante', 'key'], ['Deixar uma moeda marcada no pedestal', 'coin']],
    magnum: [['Pôr algo na taça do bar de champanhe', 'glass'], ['Deixar um charuto no bar de champanhe', 'cigar']],
    casaco: [['Esconder a ficha do guarda-volumes', 'card'], ['Esquecer os óculos no guarda-volumes', 'glasses']],
  },
  kyoto: {
    omamori: [['Esconder uma moeda no balcão de amuletos', 'coin'], ['Prender um bilhete no balcão de amuletos', 'note']],
    lanterna: [['Deixar uma rosa na margem do riacho', 'rose'], ['Esconder uma chave na margem', 'key']],
    alvo: [['Esconder um chip na barraca de shateki', 'chip'], ['Colar um adesivo no balcão do shateki', 'sticker']],
    peixe: [['Deixar uma moeda marcada na pescaria', 'coin'], ['Esquecer o celular na pescaria', 'phone']],
    gongo: [['Prender um bilhete no campanário', 'note'], ['Marcar o pilar do sino com giz', 'mark']],
    omikuji: [['Amarrar um cartão na árvore dos papéis', 'card'], ['Esconder um anel ao pé da árvore', 'ring']],
    toro: [['Deixar um envelope na lanterna de pedra', 'envelope'], ['Esconder a chave na lanterna de pedra', 'key']],
    mascara: [['Esconder um chip entre as máscaras', 'chip'], ['Deixar um bilhete na barraca de máscaras', 'note']],
    takoyaki: [['Deixar uma moeda marcada no balcão do takoyaki', 'coin'], ['Esquecer uma luva na barraca de takoyaki', 'glove']],
  },
  carnaval: {
    estandarte: [['Deixar um bilhete ao pé do estandarte', 'note'], ['Colar um adesivo na base do mastro', 'sticker']],
    freio: [['Esconder uma chave na cabine do bonde', 'key'], ['Deixar um envelope no bonde', 'envelope']],
    som: [['Esconder um chip junto ao poste', 'chip'], ['Marcar o chão junto ao poste com giz', 'mark']],
    surdo: [['Deixar uma moeda marcada no surdo', 'coin'], ['Esquecer uma luva na bateria', 'glove']],
    fita: [['Deixar uma rosa no mirante', 'rose'], ['Prender um cartão no azulejo', 'card']],
    brasa: [['Deixar um charuto no carrinho de churrasquinho', 'cigar'], ['Pôr algo no copo do churrasqueiro', 'glass']],
    placa: [['Esquecer um copo de caipirinha junto à barraca', 'glass'], ['Deixar um bilhete ao pé da barraca de caipirinha', 'note']],
    pipa: [['Esconder uma chave no guarda-corpo do mirante', 'key'], ['Esquecer os óculos no mirante', 'glasses']],
    grafite: [['Marcar o chão junto ao muro com giz', 'mark'], ['Colar um adesivo na calçada do muro grafitado', 'sticker']],
  },
  alpes: {
    esqui: [['Esconder um chip no rack de esquis', 'chip'], ['Esquecer uma luva no rack de esquis', 'glove']],
    treno: [['Deixar um envelope no trenó', 'envelope'], ['Esconder a chave no trenó', 'key']],
    boneco: [['Deixar uma rosa no boneco de neve', 'rose'], ['Deixar uma moeda marcada no boneco de neve', 'coin']],
    jacuzzi: [['Pôr algo na taça da jacuzzi', 'glass'], ['Esquecer os óculos na borda da jacuzzi', 'glasses']],
    radio: [['Colar um adesivo no rádio da patrulha', 'sticker'], ['Deixar um bilhete no posto da patrulha', 'note']],
    lareira: [['Esconder uma chave junto à porta do chalé', 'key'], ['Prender um cartão na porta do chalé', 'card']],
    gondola: [['Esconder um chip no holofote', 'chip'], ['Marcar o holofote com giz', 'mark']],
    gluhwein: [['Pôr algo na caneca de glühwein', 'glass'], ['Deixar um charuto ao lado do caldeirão', 'cigar']],
    fogueira: [['Esquecer uma luva perto da fogueira', 'glove'], ['Deixar um envelope perto da fogueira', 'envelope']],
  },
  paris: {
    vestido: [['Esconder um anel na arara de roupas', 'ring'], ['Prender um bilhete na arara', 'note']],
    spot: [['Colar um adesivo na torre de luz', 'sticker'], ['Esconder um chip na torre de luz', 'chip']],
    cartao: [['Deixar um envelope na cadeira da primeira fila', 'envelope'], ['Esquecer os óculos na primeira fila', 'glasses']],
    macaron: [['Pôr algo na taça perto dos macarons', 'glass'], ['Deixar uma rosa ao lado da torre de macarons', 'rose']],
    claraboia: [['Esconder uma chave junto à claraboia', 'key'], ['Marcar o vidro da claraboia com giz', 'mark']],
    filme: [['Esconder um pendrive no pódio dos fotógrafos', 'usb'], ['Esquecer o celular no pódio', 'phone']],
    letreiro: [['Colar um adesivo no chão do quadro de força', 'sticker'], ['Deixar um bilhete ao pé do quadro de força', 'note']],
    manequim: [['Deixar uma luva no manequim', 'glove'], ['Esconder um cartão nos manequins', 'card']],
    lenco: [['Deixar uma rosa na grade da frente', 'rose'], ['Deixar uma moeda marcada na grade', 'coin']],
  },
  marrakech: {
    chave: [['Deixar uma moeda marcada na fonte', 'coin'], ['Deixar uma rosa na borda da fonte', 'rose']],
    tapete: [['Deixar um bilhete sob o varal de tapetes', 'note'], ['Esconder um anel sob os tapetes', 'ring']],
    lanterna: [['Esconder uma chave no arco da galeria', 'key'], ['Marcar o arco com giz', 'mark']],
    bule: [['Pôr algo no copo de chá', 'glass'], ['Deixar um envelope no balcão do chá', 'envelope']],
    mapa: [['Esconder um chip na mesa de jantar', 'chip'], ['Deixar um cartão na mesa de jantar', 'card']],
    porta: [['Colar um adesivo na soleira do portão', 'sticker'], ['Deixar um bilhete na soleira do portão', 'note']],
    petalas: [['Esquecer os óculos no parapeito', 'glasses'], ['Deixar uma moeda marcada no parapeito', 'coin']],
    incenso: [['Deixar um charuto junto ao incensário', 'cigar'], ['Esconder a chave junto ao incensário', 'key']],
    paprica: [['Esconder um chip na banca de especiarias', 'chip'], ['Esquecer uma luva na banca de especiarias', 'glove']],
  },
  expresso: {
    mala: [['Prender um cartão na mala', 'card'], ['Esconder um envelope no carrinho de bagagem', 'envelope']],
    relogio: [['Colar um adesivo na coluna do relógio', 'sticker'], ['Esconder uma chave na coluna', 'key']],
    sinal: [['Marcar o sinal com giz', 'mark'], ['Deixar uma moeda marcada junto ao sinal', 'coin']],
    bau: [['Esconder um chip no carrinho de baús', 'chip'], ['Deixar um bilhete sobre o baú', 'note']],
    jornal: [['Deixar uma moeda marcada na banca de jornais', 'coin'], ['Esquecer os óculos na banca', 'glasses']],
    vapor: [['Esconder uma chave na lateral da locomotiva', 'key'], ['Marcar a locomotiva com giz', 'mark']],
    painel: [['Colar um adesivo no chão do painel de partidas', 'sticker'], ['Esconder um pendrive junto ao painel', 'usb']],
    abajur: [['Pôr algo na taça da mesa 3', 'glass'], ['Deixar um charuto na mesa 3', 'cigar']],
    placa: [['Deixar uma rosa na passarela', 'rose'], ['Esquecer uma luva na passarela', 'glove']],
  },
};
// where a small item left "on" an object of a scenario lands: the first surface between knee and chest height under the
// object's look point (or a little toward the stand point), else the floor beside it. y is relative to the level.
const surfRay = new T.Raycaster(), surfDown = new T.Vector3(0, -1, 0);
function surfaceSpot(meshes, l, sp, lv) {
  const y0 = LVY(lv), dx = sp[0] - l[0], dz = sp[1] - l[1], d = Math.hypot(dx, dz) || 1;
  const nx = -dz / d, nz = dx / d; // sideways
  for (const [f, w] of [[0, 0], [0.15, 0], [-0.15, 0], [0.3, 0], [0, 0.25], [0, -0.25], [-0.3, 0], [0.5, 0], [0.3, 0.3], [0.3, -0.3]]) {
    const x = l[0] + dx / d * f + nx * w, z = l[1] + dz / d * f + nz * w;
    surfRay.set(new T.Vector3(x, y0 + 1.5, z), surfDown); surfRay.far = 1.5;
    const hit = surfRay.intersectObjects(meshes, false).find(h => h.object.visible && !h.object.userData.noCol);
    if (hit && hit.point.y - y0 > 0.25) return [x, hit.point.y - y0 + 0.004, z];
  }
  return null;
}
function scenarioProps(sc) {
  const list = [], own = SCEN_ACTS[sc.id] || {}, meshes = [];
  // each mesh's bounding sphere in world space, once, so every object only tests what is around it
  if (SCEN.root) { SCEN.root.updateMatrixWorld(true); SCEN.root.traverse(o => { if (!o.isMesh || o.isInstancedMesh || o.userData.noCol || !o.geometry) return; if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); const bs = o.geometry.boundingSphere, c = bs.center.clone().applyMatrix4(o.matrixWorld); meshes.push({ o, c, r: bs.radius * o.matrixWorld.getMaxScaleOnAxis() }); }); }
  (sc.missoes || []).forEach((m, i) => {
    const sp = m.s, l = m.l, lv = m.lv || 0, dx = l[0] - sp[0], dz = l[1] - sp[1], d = Math.hypot(dx, dz) || 1;
    const px = sp[0] + dx / d * 0.45, pz = sp[1] + dz / d * 0.45;
    const acts = [[m.label, { k: 'scen', key: m.k }]];
    // the object's own acts first: the item goes on the object (or at its foot when it has no surface in reach)
    const near = meshes.filter(q => Math.hypot(q.c.x - l[0], q.c.z - l[1]) < q.r + 1.2).map(q => q.o);
    const surf = near.length ? surfaceSpot(near, l, sp, lv) : null;
    (own[m.k] || []).slice(0, 2).forEach(([label, item], j) => {
      const a = (i * 3 + j) * 2.1, r = surf ? 0.07 : 0.16, at = surf ? [surf[0] + Math.cos(a) * r, surf[1], surf[2] + Math.sin(a) * r] : [px + Math.cos(a) * r, 0.01, pz + Math.sin(a) * r];
      acts.push([label, SP(item, at, { ry: a, face: item === 'mark' || item === 'sticker' ? 'up' : undefined })]);
    });
    for (let j = 0; acts.length < 4; j++) { const g = SCEN_GEN[(i * 3 + j) % SCEN_GEN.length], a = (i * 3 + j) * 2.1; acts.push([g[0], SP(g[1], [px + Math.cos(a) * 0.16, 0.01, pz + Math.sin(a) * 0.16], { ry: a })]); }
    defProp(list, m.k, m.where, lv, sp, l, acts);
    list[list.length - 1].hitRadius = m.hitRadius || 1;
  });
  return list;
}
function* mapStages(id) {
  if (!environmentPrepared) ensureEnvironment();
  id = Math.max(0, Math.min(SCENARIOS.length, id | 0));
  if (id === readyMapId) return;
  if (id && !SCENARIOS[id - 1]?.build) throw Error('Call ensureMapAssets before loadMap');
  readyMapId = -1;
  undoFx(); FX.length = 0; for (const k in SPAWNED) SPAWNED[k].visible = false;
  if (SCEN.root) { scene.remove(SCEN.root); disposeTree(SCEN.root); SCEN.root = null; SCEN.K = null; SCEN.sc = null; SCEN.occ = null; }
  SCEN.id = id;
  // Dynamic detection must run in rooftop mode, after the old scenario has been removed.
  if (!id) ensureRooftop();
  yield 'Preparando cenário…';
  for (const o of (MAP0?.objs || [])) o.visible = id === 0;
  COLS.length = 0; SLOTS.length = 0; FLOORS.length = 0; BAR_ZONES.length = 0;
  if (!id) {
    LEVELS = MAP0.levels; LV_N = LEVELS.length; LINKS = MAP0.links; STATICS = MAP0.statics;
    COLS.push(...MAP0.cols); SLOTS.push(...MAP0.slots); FLOORS.push(...MAP0.floors); BAR_ZONES.push(...MAP0.bars);
    setMissions(MAP0.props); SNIPER_POS.copy(MAP0.pos); SCENE_BOX.top = 9.5;
    applyAmbient(null);
  } else {
    const tb = performance.now(); const sc = SCEN.sc = SCENARIOS[id - 1];
    const root = SCEN.root = new T.Group(); scene.add(root);
    const K = SCEN.K = MIRA_KIT(T, root, 7 + id * 131);
    K.sniperNest = () => null; // the game has its own nest
    K.gente = () => CHARS; // ambient life that reacts to people (pigeons taking off, etc.)
    LEVELS = sc.niveis.map(L => ({ name: L.nome, y: L.y || 0, x0: L.x0 ?? -14.5, x1: L.x1 ?? 14.5, z0: Math.min(L.z0, L.z1), z1: Math.max(L.z0, L.z1) }));
    LV_N = LEVELS.length;
    K.lvGroup = LEVELS.map((L, k) => { if (!k) return root; const g = new T.Group(); g.position.y = L.y; root.add(g); return g; });
    sc.build(K);
    LINKS = (sc.escadas || []).map(e => { const y0 = LVY(e.de), y1 = LVY(e.para); return { lo: Math.min(e.de, e.para), kind: 'ramp', base: e.de < e.para ? e.a : e.b, top: e.de < e.para ? e.b : e.a, len: Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1], y1 - y0) * 1.15 }; });
    STATICS = (sc.elenco || []).map(c => ({ x: c.x, z: c.z, lv: c.lv || 0, y: c.y || 0, rot: c.rot || 0, anim: c.anim ?? 0, outfit: c.outfit, fala: c.fala }));
    for (const c of K.cols) COLS.push({ x0: c.x0, z0: c.z0, x1: c.x1, z1: c.z1, lv: c.lv || 0 });
    for (const sl of K.slots) { SLOTS.push({ x: sl.x, z: sl.z, rot: sl.rot, type: sl.type, obj: -1, lv: sl.lv || 0 }); if (sl.type === 'bar') BAR_ZONES.push({ x: sl.x, z: sl.z, r: 0.9, lv: sl.lv || 0, rot: sl.rot }); }
    for (const sl of SLOTS) if (sl.type === 'cards' || sl.type === 'chess' || sl.type === 'piano') sl.hy = 0.56;
    setMissions(scenarioProps(sc));
    PROPS.forEach((p, i) => addSlot(p.s[0], p.s[1], p.l[0], p.l[1], 'obj', i, p.lv));
    // an invisible floor per level so clicks and the laser land on the ground
    LEVELS.forEach((L, lv) => { const f = new T.Mesh(new T.PlaneGeometry(L.x1 - L.x0, L.z1 - L.z0), new T.MeshBasicMaterial({ color: 0x000000 })); f.rotation.x = -Math.PI / 2; f.position.set((L.x0 + L.x1) / 2, L.y + 0.005, (L.z0 + L.z1) / 2); f.visible = false; f.userData.lv = lv; f.userData.noCol = true; root.add(f); FLOORS.push(f); });
    // what the scope and the laser can hit: the scenery's meshes (sprites and lines are skipped)
    SNIPER_POS.fromArray(sc.sniper.pos); SCENE_BOX.top = 6.5;
    for (const k in K.tells) { try { K.tells[k].reset && K.tells[k].reset(); } catch (e) { } }
    applyAmbient(sc.ambiente || {}); SCEN.tBuild = Math.round(performance.now() - tb);
  }
  yield 'Preparando navegação…';
  NEST.position.copy(SNIPER_POS);
  if (id) buildNinho(SCEN.sc, SCEN.K); else buildNinho0();
  { const p = laserGeo.attributes.position; p.setXYZ(0, SNIPER_POS.x, SNIPER_POS.y, SNIPER_POS.z); p.needsUpdate = true; }
  NAV.auto = 0; NAV.tris = 0;
  const navKey = id + ':' + (window.MIRA_MANIFEST?.version || 'source');
  const cachedNav = NAV_CACHE.get(navKey);
  buildRings();
  if (cachedNav) { NAV.lv = cachedNav; NAV.ready = true; SCEN.tNav = 0; }
  else { const tn = performance.now(); NAV.ready = false; NAV.lv = []; navBuild(); NAV_CACHE.set(navKey, NAV.lv); SCEN.tNav = Math.round(performance.now() - tn); }
  yield 'Preparando detalhes…';
  if (!id && !SCEN.batch0) finishRooftop();
  if (id) {
    SCEN.batch = batchStatic([SCEN.root], SCEN.root, new Set(FLOORS));
    // what the scope and the laser can hit: the scenery's meshes (sprites and lines are skipped)
    // every mesh stops the shot except floors and what the eye sees through (glass, light shafts, additive glows): what
    // doesn't hide someone doesn't shield them either (fonte/cenarios/ferramentas/oclusores.js checks both ways)
    const seeThrough = m => (Array.isArray(m) ? m : [m]).every(x => !x || (x.transparent && x.opacity < 0.6) || x.blending !== T.NormalBlending);
    SCEN.occ = []; SCEN.root.traverse(o => { if (o.isMesh && !FLOORS.includes(o) && !seeThrough(o.material)) SCEN.occ.push(o); });
  }
  resize(); readyMapId = id;
}

// ---------------------------------------------------------------- static batching
// Each map is built from thousands of small meshes, which is pleasant to author but costs one draw call each. Once a map is
// up (and its navigation grid has been rasterised from the individual pieces), we find what never moves by exercising it:
// every mission effect, every scenery animation and a stretch of simulated time. Whatever kept its transform, visibility,
// material and geometry is merged into one mesh per material look (colour goes into vertex colours) and per 4 m cell
// (small cells keep frustum culling and the scope's raycasts cheap). What moves keeps its own mesh, and everything static
// stops recomputing its matrix each frame. Characters get the same treatment: their rigid pieces become a handful of
// skinned meshes on the rig, while the original pieces stay as invisible stand-ins for the scope's raycasts.
const BATCH_CELL = 7;
function loadMap(id) { for (const stage of mapStages(id)) { /* synchronous API for callers with loaded assets */ } }
const NAV_CACHE = new Map();
function exerciseMap(check) {
  const realNow = performance.now.bind(performance); let fake = realNow();
  performance.now = () => fake;
  try {
    for (let k = 0; k < 60; k++) { fake += 370; stepFX(0.05); if (SCEN.K) SCEN.K.update(0.05, fake / 1000); if (k % 6 === 5) check(); }
    for (let i = 0; i < MISSIONS.length; i++) { try { applyTell(i, false); } catch (e) { } }
    check();
    resetProps(); check();
    for (let i = 0; i < MISSIONS.length; i++) { try { applyTell(i, true); } catch (e) { } }
    for (let k = 0; k < 50; k++) { fake += 120; stepFX(0.06); if (SCEN.K) SCEN.K.update(0.06, fake / 1000); if (k % 5 === 4) check(); }
    resetProps(); check();
    for (let k = 0; k < 10; k++) { fake += 400; stepFX(0.05); if (SCEN.K) SCEN.K.update(0.05, fake / 1000); }
    check();
  } finally { performance.now = realNow; }
  FX.length = 0; for (const k in SPAWNED) SPAWNED[k].visible = false;
}
const matSnap = m => m ? [m.color ? m.color.r + ',' + m.color.g + ',' + m.color.b : '', m.emissive ? m.emissive.getHex() : '', m.emissiveIntensity, m.opacity, m.visible, m.map, m.emissiveMap, m.transparent].join('|') : '';
function findDynamic(roots) {
  const objs = []; for (const r of roots) r.traverse(o => objs.push(o));
  const snap = o => [o.position.x, o.position.y, o.position.z, o.quaternion.x, o.quaternion.y, o.quaternion.z, o.quaternion.w, o.scale.x, o.scale.y, o.scale.z, o.visible, o.material || null, o.geometry || null, o.geometry && o.geometry.attributes && o.geometry.attributes.position ? o.geometry.attributes.position.version : 0, o.parent, o.isInstancedMesh ? o.instanceMatrix.version : 0];
  const s0 = objs.map(snap), dyn = new Set();
  const mats = new Set(); for (const o of objs) if (o.material && !Array.isArray(o.material)) mats.add(o.material);
  const m0 = new Map(); for (const m of mats) m0.set(m, matSnap(m));
  const mutated = new Set();
  exerciseMap(() => {
    for (let i = 0; i < objs.length; i++) { if (dyn.has(objs[i])) continue; const a = s0[i], b = snap(objs[i]); for (let k = 0; k < a.length; k++) if (a[k] !== b[k] && !(typeof a[k] === 'number' && Math.abs(a[k] - b[k]) < 1e-6)) { dyn.add(objs[i]); break; } }
    for (const m of mats) if (!mutated.has(m) && matSnap(m) !== m0.get(m)) mutated.add(m);
  });
  // restore anything the exercise left out of place (a reset that does not put a transform back exactly)
  objs.forEach((o, i) => { if (!dyn.has(o)) return; const a = s0[i]; if (a[14] !== o.parent) return; o.position.set(a[0], a[1], a[2]); o.quaternion.set(a[3], a[4], a[5], a[6]); o.scale.set(a[7], a[8], a[9]); o.visible = a[10]; });
  return { dyn, mutated };
}
// materials that differ only by colour share one vertex-coloured material
const MAPS = ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'envMap', 'bumpMap', 'aoMap', 'lightMap'];
const MPROPS = ['type', 'roughness', 'metalness', 'emissiveIntensity', 'opacity', 'transparent', 'side', 'flatShading', 'envMapIntensity', 'toneMapped', 'depthWrite', 'depthTest', 'fog', 'wireframe', 'alphaTest', 'blending', 'polygonOffset', 'polygonOffsetFactor', 'polygonOffsetUnits', 'shadowSide', 'dithering', 'premultipliedAlpha'];
const colorable = m => (m.type === 'MeshStandardMaterial' || m.type === 'MeshBasicMaterial') && !m.vertexColors && !m.skinning && !m.morphTargets && !m.onBeforeCompile.toString().includes('shader') && m.color;
const lookKey = m => MPROPS.map(k => m[k]).join(',') + '|' + (m.emissive ? m.emissive.getHex() : '') + '|' + MAPS.map(k => m[k] ? m[k].uuid : '').join(',');
const usedAttrs = m => { const a = ['position', 'normal']; if (MAPS.some(k => m[k] && k !== 'envMap')) a.push('uv'); if (m.aoMap || m.lightMap) a.push('uv2'); return a; };
function canonMat(cache, m, skin) {
  const key = lookKey(m) + (skin ? '|skin' : '');
  let c = cache.get(key); if (c) return c;
  c = m.clone(); c.color.setRGB(1, 1, 1); c.vertexColors = true; if (skin) c.skinning = true; c.userData = { canon: true };
  cache.set(key, c); return c;
}
const CHAR_MATS = new Map();
// merge meshes into one geometry, positions in the space of `space` (an Object3D) or world; recolor = bake material colours
function mergeMeshes(list, space, names, recolor, skin) {
  const inv = new T.Matrix4(); if (space) inv.copy(space.matrixWorld).invert();
  let nv = 0, ni = 0; for (const it of list) { const g = it.o.geometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
  const out = new T.BufferGeometry(), arrs = {}, sizes = {};
  for (const n of names) { sizes[n] = list[0].o.geometry.attributes[n].itemSize; arrs[n] = new Float32Array(nv * sizes[n]); }
  const col = recolor ? new Float32Array(nv * 3) : null, si = skin ? new Uint16Array(nv * 4) : null, sw = skin ? new Float32Array(nv * 4) : null;
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  const M = new T.Matrix4(), N = new T.Matrix3(), v = new T.Vector3(); let vo = 0, io = 0;
  for (const it of list) {
    const o = it.o, g = o.geometry, cnt = g.attributes.position.count;
    M.multiplyMatrices(it.space ? new T.Matrix4().copy(it.space.matrixWorld).invert() : inv, o.matrixWorld); N.getNormalMatrix(M); const flip = M.determinant() < 0;
    for (const n of names) {
      const a = g.attributes[n], d = arrs[n], s = sizes[n];
      if (n === 'position') for (let i = 0; i < cnt; i++) { v.fromBufferAttribute(a, i).applyMatrix4(M); d[(vo + i) * 3] = v.x; d[(vo + i) * 3 + 1] = v.y; d[(vo + i) * 3 + 2] = v.z; }
      else if (n === 'normal') for (let i = 0; i < cnt; i++) { v.fromBufferAttribute(a, i).applyMatrix3(N).normalize(); d[(vo + i) * 3] = v.x; d[(vo + i) * 3 + 1] = v.y; d[(vo + i) * 3 + 2] = v.z; }
      else for (let i = 0; i < cnt; i++) for (let c = 0; c < s; c++) d[(vo + i) * s + c] = a.array[i * s + c];
    }
    if (col) { const c = o.material.color; for (let i = 0; i < cnt; i++) { col[(vo + i) * 3] = c.r; col[(vo + i) * 3 + 1] = c.g; col[(vo + i) * 3 + 2] = c.b; } }
    if (si) for (let i = 0; i < cnt; i++) { si[(vo + i) * 4] = it.bone; sw[(vo + i) * 4] = 1; if (it.blend) it.blend(g.attributes.position, i, si, sw, (vo + i) * 4); }
    const n3 = g.index ? g.index.count : cnt;
    for (let t = 0; t < n3; t += 3) for (let c = 0; c < 3; c++) { const k = flip ? (c === 0 ? 0 : 3 - c) : c; idx[io + t + c] = vo + (g.index ? g.index.array[t + k] : t + k); }
    vo += cnt; io += n3;
  }
  for (const n of names) out.setAttribute(n, new T.BufferAttribute(arrs[n], sizes[n]));
  if (col) out.setAttribute('color', new T.BufferAttribute(col, 3));
  if (si) { out.setAttribute('skinIndex', new T.BufferAttribute(si, 4)); out.setAttribute('skinWeight', new T.BufferAttribute(sw, 4)); }
  out.setIndex(new T.BufferAttribute(idx, 1)); out.computeBoundingSphere(); out.computeBoundingBox(); out.userData.batch = true;
  return out;
}
const mergeable = (o, skip, glass) => o.isMesh && !o.isInstancedMesh && !o.isSkinnedMesh && !Array.isArray(o.material) && o.material && (glass || !o.material.transparent) && o.material.visible !== false && !o.renderOrder && !o.morphTargetInfluences && o.geometry && o.geometry.attributes.position && o.geometry.attributes.normal && !o.geometry.attributes.position.isInterleavedBufferAttribute && o.onBeforeRender === T.Object3D.prototype.onBeforeRender && !(skip && skip.has(o));
const hasAttrs = (g, names) => names.every(n => g.attributes[n] && !g.attributes[n].isInterleavedBufferAttribute);
// how a mesh will be grouped: its look (colour-free when it can be recoloured) and the attributes the merged geometry keeps
function groupSpec(o, mutated) {
  const m = o.material;
  if (colorable(m) && !m.transparent && !(mutated && mutated.has(m))) { const names = usedAttrs(m); if (hasAttrs(o.geometry, names)) return { key: 'L' + lookKey(m) + '|' + names.join(','), names, recolor: true }; }
  const names = Object.keys(o.geometry.attributes).sort();
  return { key: 'U' + m.uuid + '|' + names.map(n => n + o.geometry.attributes[n].itemSize).join(','), names, recolor: false };
}
// batch the static scenery under roots; merged meshes go into `holder` (an identity-transform group in world space)
// coplanar faces of different looks that overlap flicker (z-fighting): the smaller of the two pieces is lifted 1 cm off
// the shared plane along its face normal. Only axis-aligned faces are checked; moving pieces are never touched.
const ZF_STEP = 0.01;
function deZfight(roots, isDyn, shown) {
  const A = new T.Vector3(), B = new T.Vector3(), C = new T.Vector3(), N = new T.Vector3(), e1 = new T.Vector3(), e2 = new T.Vector3();
  const buckets = new Map(), metas = [], sz = new T.Vector3(), bb = new T.Box3();
  for (const r of roots) r.traverse(o => {
    if (!o.isMesh || o.isSkinnedMesh || o.isInstancedMesh || o.userData.eid !== undefined || !shown(o)) return;
    const mt = Array.isArray(o.material) ? o.material[0] : o.material, g = o.geometry, P = g && g.attributes.position;
    if (!mt || !P || mt.transparent || mt.depthWrite === false || mt.colorWrite === false || mt.side === T.BackSide || P.count > 6000) return;
    const I = g.index, col = g.attributes.color, n = I ? I.count : P.count;
    bb.setFromObject(o).getSize(sz);
    const mi = metas.length; metas.push({ o, dyn: isDyn(o), size: sz.x * sz.y * sz.z + 1e-3 * (sz.x * sz.y + sz.y * sz.z + sz.x * sz.z), nudge: new T.Vector3() });
    const look = (mt.color ? mt.color.getHex() : 0) + ':' + (mt.map ? mt.map.id : '') + ':' + (mt.emissive ? mt.emissive.getHex() : '');
    for (let t = 0; t < n; t += 3) {
      const ia = I ? I.getX(t) : t, ib = I ? I.getX(t + 1) : t + 1, ic = I ? I.getX(t + 2) : t + 2;
      A.fromBufferAttribute(P, ia).applyMatrix4(o.matrixWorld); B.fromBufferAttribute(P, ib).applyMatrix4(o.matrixWorld); C.fromBufferAttribute(P, ic).applyMatrix4(o.matrixWorld);
      e1.subVectors(B, A); e2.subVectors(C, A); N.crossVectors(e1, e2); if (N.length() < 0.008) continue; N.normalize();
      let ax = -1; for (let k = 0; k < 3; k++) if (Math.abs(N.getComponent(k)) > 0.999) ax = k;
      if (ax < 0) continue; const sg = N.getComponent(ax) > 0 ? 1 : -1; if (ax === 1 && sg < 0) continue; // undersides are never seen
      const u = (ax + 1) % 3, v = (ax + 2) % 3, off = A.getComponent(ax);
      const tri = [A.getComponent(u), A.getComponent(v), B.getComponent(u), B.getComponent(v), C.getComponent(u), C.getComponent(v)];
      const cc = col ? look + ':' + Math.round(col.getX(ia) * 255) + ',' + Math.round(col.getY(ia) * 255) + ',' + Math.round(col.getZ(ia) * 255) : look;
      const key = ax + ':' + sg + ':' + Math.round(off / 0.004);
      let b = buckets.get(key); if (!b) buckets.set(key, b = []);
      b.push({ mi, tri, off, cc, box: [Math.min(tri[0], tri[2], tri[4]), Math.min(tri[1], tri[3], tri[5]), Math.max(tri[0], tri[2], tri[4]), Math.max(tri[1], tri[3], tri[5])], ax, sg });
    }
  });
  const side = (x1, y1, x2, y2, x3, y3) => (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
  const inTri = (px, py, t) => { const d1 = side(px, py, t[0], t[1], t[2], t[3]), d2 = side(px, py, t[2], t[3], t[4], t[5]), d3 = side(px, py, t[4], t[5], t[0], t[1]); return !((d1 < -1e-9 || d2 < -1e-9 || d3 < -1e-9) && (d1 > 1e-9 || d2 > 1e-9 || d3 > 1e-9)); };
  const done = new Set(); let pairs = 0;
  for (const [key, arr] of buckets) {
    const [ax, sg, k] = key.split(':'); const nb = buckets.get(ax + ':' + sg + ':' + (+k + 1)); const all = nb ? arr.concat(nb) : arr;
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j]; if (a.mi === b.mi || a.cc === b.cc || Math.abs(a.off - b.off) > 0.004) continue;
      const pk = Math.min(a.mi, b.mi) + '-' + Math.max(a.mi, b.mi) + ':' + a.ax + a.sg; if (done.has(pk)) continue;
      const p = a.box, q = b.box, x0 = Math.max(p[0], q[0]), y0 = Math.max(p[1], q[1]), x1 = Math.min(p[2], q[2]), y1 = Math.min(p[3], q[3]);
      if (x1 - x0 < 0.02 || y1 - y0 < 0.02) continue;
      let hit = false; for (let s = 0; s < 9 && !hit; s++) { const px = x0 + (x1 - x0) * ((s % 3) + 0.5) / 3, py = y0 + (y1 - y0) * (((s / 3) | 0) + 0.5) / 3; hit = inTri(px, py, a.tri) && inTri(px, py, b.tri); }
      if (!hit) continue;
      done.add(pk);
      const ma = metas[a.mi], mb = metas[b.mi]; if (ma.dyn && mb.dyn) continue;
      const lift = ma.dyn ? mb : mb.dyn ? ma : ma.size <= mb.size ? ma : mb, lo = lift === ma ? a : b;
      const want = ZF_STEP * lo.sg - (lo.off - (lo === a ? b : a).off); // clear the other face by a full step
      if (Math.abs(want) > Math.abs(lift.nudge.getComponent(lo.ax))) lift.nudge.setComponent(lo.ax, want);
      pairs++;
    }
  }
  let moved = 0; const w = new T.Vector3();
  for (const m of metas) if (m.nudge.lengthSq() > 0) {
    const o = m.o; o.getWorldPosition(w).add(m.nudge); o.parent.worldToLocal(w); o.position.copy(w); o.updateMatrixWorld(true); moved++;
  }
  return { pairs, moved };
}
function batchStatic(roots, holder, skip) {
  const t0 = performance.now(); scene.updateMatrixWorld(true);
  const { dyn, mutated } = findDynamic(roots); scene.updateMatrixWorld(true); const t1 = performance.now();
  const isDyn = o => { for (let p = o; p && p !== scene; p = p.parent) if (dyn.has(p)) return true; return false; };
  const shown = o => { for (let p = o; p && p !== scene; p = p.parent) if (!p.visible) return false; return true; };
  const zf = { pairs: 0, moved: 0, passes: 0 }; // lifting one piece can land it on a third, so repeat until clean
  for (let k = 0; k < (window.__noZf ? 0 : 4); k++) { const r = deZfight(roots, isDyn, shown); zf.passes++; zf.pairs += r.pairs; zf.moved += r.moved; if (!r.pairs) break; }
  if (window.__noBatch) return { zf, ms: [0, 0] }; // test hook: keep the original pieces
  const groups = new Map(), users = new Map(), bs = new T.Sphere(), cache = new Map();
  let n0 = 0, small = 0;
  for (const r of roots) r.traverse(o => {
    if (!o.isMesh) return; n0++;
    if (o.geometry) users.set(o.geometry, (users.get(o.geometry) || 0) + 1);
    if (o.castShadow && o.userData.eid === undefined) { if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); bs.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld); if (bs.radius < 0.18) { o.castShadow = false; small++; } }
    if (!mergeable(o, skip, true) || dyn.has(o) || !shown(o) || o.userData.eid !== undefined) return;
    // the nearest moving ancestor (if any): pieces riding on it are merged in its space and added to it
    let host = null; for (let p = o.parent; p && p !== scene; p = p.parent) if (dyn.has(p)) { host = p; break; }
    if (host) for (let p = o.parent; p !== host; p = p.parent) if (dyn.has(p)) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); bs.copy(o.geometry.boundingSphere).applyMatrix4(o.matrixWorld);
    const cell = host ? host.uuid : bs.radius > BATCH_CELL ? 'big' : Math.floor(bs.center.x / BATCH_CELL) + ',' + Math.floor(bs.center.y / 3) + ',' + Math.floor(bs.center.z / BATCH_CELL);
    const sp = groupSpec(o, mutated);
    const key = sp.key + '|' + (o.castShadow ? 1 : 0) + (o.receiveShadow ? 1 : 0) + (o.frustumCulled ? 1 : 0) + '|' + cell;
    if (!groups.has(key)) groups.set(key, { sp, host, list: [] }); groups.get(key).list.push({ o });
  });
  let made = 0, removed = 0;
  for (const { sp, host, list } of groups.values()) {
    if (list.length < 2) continue;
    const o0 = list[0].o, g = mergeMeshes(list, host, sp.names, sp.recolor, false);
    const me = new T.Mesh(g, sp.recolor ? canonMat(cache, o0.material, false) : o0.material); me.castShadow = o0.castShadow; me.receiveShadow = o0.receiveShadow; me.frustumCulled = o0.frustumCulled; me.matrixAutoUpdate = false; me.userData.batch = true; me.userData.noCol = true;
    (host || holder).add(me); made++;
    for (const { o } of list) { o.parent.remove(o); users.set(o.geometry, users.get(o.geometry) - 1); removed++; }
  }
  for (const [g, n] of users) if (n <= 0) g.dispose();
  // static objects stop recomputing their matrices every frame
  let frozen = 0;
  for (const r of roots) r.traverse(o => { if (isDyn(o) || o === holder) return; o.updateMatrix(); o.matrixAutoUpdate = false; frozen++; });
  holder.updateMatrixWorld(true);
  return { zf, meshes: n0, merged: removed, made, dynamic: dyn.size, mutatedMats: mutated.size, frozen, smallCasters: small, ms: [Math.round(t1 - t0), Math.round(performance.now() - t1)] };
}
// a character's rigid pieces become a few skinned meshes (one per look) bound to its rig, one bone per vertex; the pieces
// themselves stay, hidden, for raycasts (props that are shown, hidden or turned stay as they are)
function batchChar(root, B, keep) {
  if (window.__noBatch) return;
  root.updateMatrixWorld(true);
  const boneList = RIG.bones.map(b => B[b.n]).concat(B.Lids ? [B.Lids] : [], B.Brows ? [B.Brows] : []).filter(Boolean), boneIx = new Map(boneList.map((b, i) => [b, i])), skip = new Set();
  for (const k of keep) if (k) k.traverse(o => skip.add(o));
  const groups = new Map();
  root.traverse(o => {
    if (!o.isMesh || skip.has(o) || !mergeable(o) || !o.visible) return;
    let b = o.parent; while (b && !boneIx.has(b)) b = b.parent; if (!b) return;
    for (let p = o; p && p !== b; p = p.parent) if (!p.visible) return;
    const sp = groupSpec(o, null), key = sp.key + '|' + (o.castShadow ? 1 : 0);
    if (!groups.has(key)) groups.set(key, { sp, list: [] }); groups.get(key).list.push({ o, space: b, bone: boneIx.get(b) });
  });
  if (!groups.size) return;
  // smooth joints: vertices near a joint along a limb or the spine are shared between the two bones that meet there, so
  // elbows, knees, shoulders and the waist bend as one surface instead of rigid pieces meeting at a crease. That needs the
  // vertices in the character's own space (not each bone's) and real bind inverses.
  const skel = new T.Skeleton(boneList), rootInv = new T.Matrix4().copy(root.matrixWorld).invert();
  for (const { list } of groups.values()) for (const it of list) { it.space = null; it.blend = jointBlend(it.o, boneList[it.bone], boneIx); }
  const noRay = () => { };
  // a skirt kept out of the batch (the long gown swaps with the seated one): drawn by a skinned copy of its own, while the
  // hidden original still answers the scope's ray; animChar shows and hides the copy through userData.skin
  for (const k of keep) if (k && k.isMesh && k.userData.skirt && boneIx.has(k.parent)) {
    const g = mergeMeshes([{ o: k, space: null, bone: boneIx.get(k.parent), blend: jointBlend(k, k.parent, boneIx) }], root, ['position', 'normal'], false, true);
    g.boundingSphere = new T.Sphere(new T.Vector3(0, 0.6, 0), 1.2);
    const mk = k.material.uuid + '|skin'; let mm = CHAR_MATS.get(mk); if (!mm) { mm = k.material.clone(); mm.skinning = true; CHAR_MATS.set(mk, mm); }
    const sk = new T.SkinnedMesh(g, mm); sk.castShadow = k.castShadow; sk.userData.eid = k.userData.eid; sk.userData.batch = true; sk.raycast = noRay; sk.visible = k.visible;
    root.add(sk); sk.updateMatrixWorld(true); sk.bind(skel, sk.matrixWorld); k.visible = false; k.userData.skin = sk;
  }
  for (const { sp, list } of groups.values()) {
    const o0 = list[0].o, g = mergeMeshes(list, root, sp.names, sp.recolor, true);
    g.boundingSphere = new T.Sphere(new T.Vector3(0, 0.95, 0), 1.45);
    const m = sp.recolor ? canonMat(CHAR_MATS, o0.material, true) : (() => { const k = o0.material.uuid + '|skin'; let c = CHAR_MATS.get(k); if (!c) { c = o0.material.clone(); c.skinning = true; CHAR_MATS.set(k, c); } return c; })();
    const me = new T.SkinnedMesh(g, m); me.castShadow = o0.castShadow; me.receiveShadow = o0.receiveShadow; me.userData.eid = o0.userData.eid; me.userData.batch = true; me.raycast = noRay;
    root.add(me); me.updateMatrixWorld(true); me.bind(skel, me.matrixWorld);
    for (const { o } of list) o.visible = false;
  }
}
// which bones share a joint: a bone blends with its parent at its start and with its one child at its end
const JOINT_UP = { Spine1: 1, Spine2: 1, Neck: 1, LeftArm: 1, RightArm: 1, LeftForeArm: 1, RightForeArm: 1, LeftHand: 1, RightHand: 1, LeftUpLeg: 0.6, RightUpLeg: 0.6, LeftLeg: 1, RightLeg: 1, LeftFoot: 1, RightFoot: 1 };
const JOINT_DOWN = { Hips: 0, Spine: 'Spine1', Spine1: 'Spine2', Neck: 'Head', LeftShoulder: 'LeftArm', RightShoulder: 'RightArm', LeftArm: 'LeftForeArm', RightArm: 'RightForeArm', LeftForeArm: 'LeftHand', RightForeArm: 'RightHand', LeftUpLeg: 'LeftLeg', RightUpLeg: 'RightLeg', LeftLeg: 'LeftFoot', RightLeg: 'RightFoot' };
const JOINT_R = 6; // cm on each side of a joint
// a skirt on the hips: its lower part on each side shares weight with that side's thigh, so it swings with the legs
// (more towards the hem, up to 0.7) instead of the legs coming out through it
function skirtBlend(o, B, boneIx) {
  const toHips = new T.Matrix4().copy(B.Hips.matrixWorld).invert().multiply(o.matrixWorld), v = new T.Vector3(), il = boneIx.get(B.LeftUpLeg), ir = boneIx.get(B.RightUpLeg);
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  return (pos, i, si, sw, k) => {
    v.fromBufferAttribute(pos, i).applyMatrix4(toHips); const f = 0.7 * ss(-4, -55, v.y), l = f * ss(-9, 9, v.x), r = f - l;
    si[k + 1] = il; sw[k + 1] = l; si[k + 2] = ir; sw[k + 2] = r; sw[k] = 1 - f;
  };
}
function jointBlend(o, bone, boneIx) {
  if (o.userData.skirt && bone.name === 'Hips') return skirtBlend(o, { Hips: bone, LeftUpLeg: bone.children.find(c => c.name === 'LeftUpLeg'), RightUpLeg: bone.children.find(c => c.name === 'RightUpLeg') }, boneIx);
  // a piece can ask to fade from its bone to another along its own height (o.userData.wy = [bone name, y0, y1]): the
  // jacket's hem, on the hips at its lower edge and on the spine at the top, so it turns with the jacket when dancing
  const wy = o.userData.wy, to = wy && bone.parent && [bone, ...bone.children].find(c => c.name === wy[0]);
  if (to && boneIx.has(to)) { const it = boneIx.get(to); return (pos, i, si, sw, k) => { const w = Math.min(1, Math.max(0, (pos.getY(i) - wy[1]) / (wy[2] - wy[1]))); si[k + 1] = it; sw[k + 1] = w; sw[k] = 1 - w; }; }
  const up = JOINT_UP[bone.name] && bone.parent && boneIx.has(bone.parent) ? bone.parent : null;
  const dn = JOINT_DOWN[bone.name] ? bone.children.find(c => c.name === JOINT_DOWN[bone.name]) : null;
  if (!up && !dn) return null;
  const toBone = new T.Matrix4().copy(bone.matrixWorld).invert().multiply(o.matrixWorld), v = new T.Vector3();
  const dir = (dn || bone.children.find(c => boneIx.has(c)) || { position: new T.Vector3(0, 1, 0) }).position.clone(), L = dir.length(); dir.normalize();
  const ku = (JOINT_UP[bone.name] || 0) * 0.5, iu = up && boneIx.get(up), id = dn && boneIx.get(dn);
  return (pos, i, si, sw, k) => {
    const d = v.fromBufferAttribute(pos, i).applyMatrix4(toBone).dot(dir);
    let wu = up ? Math.min(1, Math.max(0, 0.5 - 0.5 * d / JOINT_R)) * ku * 2 : 0, wd = dn ? Math.min(1, Math.max(0, 0.5 + 0.5 * (d - L) / JOINT_R)) : 0;
    wu = Math.min(wu, 0.5); wd = Math.min(wd, 0.5);
    if (wu > 0) { si[k + 1] = iu; sw[k + 1] = wu; } if (wd > 0) { si[k + 2] = id; sw[k + 2] = wd; }
    sw[k] = 1 - wu - wd;
  };
}
function disposeBatched(o) { const skeletons = new Set(); o.traverse(n => { if (n.isMesh && n.geometry && n.geometry.userData.batch) n.geometry.dispose(); if (n.skeleton) skeletons.add(n.skeleton); }); for (const skeleton of skeletons) skeleton.dispose(); }

// ---------------------------------------------------------------- cameras
const iso = new T.OrthographicCamera(-10, 10, 10, -10, 0.1, 400);
const isoState = { tx: 0, tz: 0, ty: 0, zoom: 9.5, az: -0.55 };
const wide = new T.PerspectiveCamera(46, 1, 0.5, 500);
const scopeCam = new T.PerspectiveCamera(6, 1, 0.5, 500);
wide.position.copy(SNIPER_POS); scopeCam.position.copy(SNIPER_POS);
// A small foreground scene shares the composer's color/depth buffer: four draws, no extra render target.
const SNIPER_SCENE = new T.Scene(), SNIPER_STAGE = new T.Group(); SNIPER_SCENE.add(SNIPER_STAGE);
const SNIPER_VIEW = makeSniperView(SNIPER_STAGE);
SNIPER_STAGE.add(new T.AmbientLight(0xb8c8e0, .5));
for (const [color, intensity, position] of [[0xffe5ca, 1.7, [-2, 3, 2]], [0x8ab5ff, .8, [3, 1, -2]]]) {
  const light = new T.DirectionalLight(color, intensity); light.position.fromArray(position); light.target = SNIPER_STAGE; SNIPER_STAGE.add(light);
}
let activeCam = iso;
function resize() {
  const w = innerWidth, h = innerHeight, q = quality.snapshot();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, q.dpr) * q.scale; if (renderer.getPixelRatio() !== pixelRatio) renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  const a = w / h;
  { const sh = iso.userData.sh || 0; iso.left = -isoState.zoom * a; iso.right = isoState.zoom * a; iso.top = isoState.zoom * (1 - sh); iso.bottom = -isoState.zoom * (1 + sh); iso.updateProjectionMatrix(); }
  wide.aspect = a; fitWide(a); wide.updateProjectionMatrix();
  scopeCam.aspect = a; scopeCam.updateProjectionMatrix();
  resizePost();
}
addEventListener('resize', resize);
function placeIso(dt, instant) {
  const k = instant ? 1 : 1 - Math.exp(-dt * 4);
  iso.userData.tx = (iso.userData.tx ?? isoState.tx) + (isoState.tx - (iso.userData.tx ?? isoState.tx)) * k;
  iso.userData.tz = (iso.userData.tz ?? isoState.tz) + (isoState.tz - (iso.userData.tz ?? isoState.tz)) * k;
  iso.userData.ty = (iso.userData.ty ?? isoState.ty) + (isoState.ty - (iso.userData.ty ?? isoState.ty)) * k;
  const tx = iso.userData.tx, tz = iso.userData.tz, ty = iso.userData.ty;
  iso.position.set(tx + Math.sin(isoState.az) * 30, ty + 30 * (isoState.elev || 1), tz + Math.cos(isoState.az) * 30);
  iso.lookAt(tx, ty, tz);
  // isoState.sh lifts the subject off the middle of the screen (0 = centred, 0.5 = halfway to the top): the end-of-round card
  // covers the lower half, so the agent is framed in the free space above it
  const sh0 = iso.userData.sh || 0, sh = Math.abs((isoState.sh || 0) - sh0) < 0.002 ? (isoState.sh || 0) : sh0 + ((isoState.sh || 0) - sh0) * k; iso.userData.sh = sh;
  const a = innerWidth / innerHeight;
  if (iso.top !== isoState.zoom * (1 - sh) || iso.right !== isoState.zoom * a) { iso.left = -isoState.zoom * a; iso.right = isoState.zoom * a; iso.top = isoState.zoom * (1 - sh); iso.bottom = -isoState.zoom * (1 + sh); iso.updateProjectionMatrix(); }
}

// ---------------------------------------------------------------- post-processing: bloom, diorama focus, grade
const FinalShader = {
  uniforms: { tDiffuse: { value: null }, res: { value: new T.Vector2(1, 1) }, focus: { value: 0.5 }, tilt: { value: 1 }, blurAll: { value: 0 }, exposure: { value: 1.0 }, vig: { value: 0.32 }, time: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform vec2 res; uniform float focus, tilt, blurAll, exposure, vig, time; varying vec2 vUv;
    vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4))-0.055, step(0.0031308, c)); }
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){
      float d = abs(vUv.y - focus);
      float r = max(smoothstep(0.14, 0.6, d) * tilt, blurAll) * 6.0;
      vec3 col = texture2D(tDiffuse, vUv).rgb;
      if (r > 0.25) {
        vec3 acc = col; float w = 1.0;
        for (int i = 0; i < 16; i++) { float fi = float(i); float a = fi * 2.39996; float rr = sqrt((fi + 0.5) / 16.0) * r; acc += texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * rr / res).rgb; w += 1.0; }
        col = acc / w;
      }
      col = aces(col * exposure);
      col = toSRGB(col);
      float l = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, col * vec3(1.05, 1.0, 0.92), smoothstep(0.35, 1.0, l) * 0.55);
      col += vec3(0.0, 0.006, 0.022) * (1.0 - l);
      col = mix(vec3(l), col, 1.06);
      vec2 q = vUv - 0.5; q.x *= res.x / res.y;
      col *= 1.0 - vig * smoothstep(0.35, 1.05, length(q));
      col += (hash(vUv * res + time) - 0.5) / 255.0;
      gl_FragColor = vec4(col, 1.0);
    }`,
};
let composer = null, renderPass = null, bloomPass = null, finalPass = null, fxaaPass = null, blurPass = null, postMS = 0;
// Blur is sampled before grading. Its target can shrink independently of the scene/HUD.
function makeBlurPass() {
  const uniforms = T.UniformsUtils.clone(FinalShader.uniforms);
  const fragmentShader = FinalShader.fragmentShader.replace('col = aces(col * exposure);', 'gl_FragColor = vec4(col, 1.0); return; col = aces(col * exposure);');
  const material = new T.ShaderMaterial({ uniforms, vertexShader: FinalShader.vertexShader, fragmentShader });
  const target = new T.WebGLRenderTarget(1, 1, { type: composer.renderTarget1.texture.type, depthBuffer: false });
  const quad = new T.FullScreenQuad(material);
  return { enabled: true, needsSwap: false, target, material, uniforms,
    setSize(w, h) { const q = quality.snapshot(); target.setSize(Math.max(1, Math.round(w * q.blur)), Math.max(1, Math.round(h * q.blur))); },
    render(r, write, read) { uniforms.tDiffuse.value = read.texture; r.setRenderTarget(target); quad.render(r); },
    dispose() { target.dispose(); material.dispose(); }
  };
}
function setupPost(samples = quality.snapshot().samples) {
  try {
    if (!T.EffectComposer || !T.RenderPass || !T.UnrealBloomPass || !T.ShaderPass) return;
    const q = quality.snapshot(), pr = renderer.getPixelRatio();
    const hdr = renderer.capabilities.isWebGL2 ? renderer.extensions.has('EXT_color_buffer_float') : renderer.extensions.has('EXT_color_buffer_half_float');
    const ro = { type: hdr ? T.HalfFloatType : T.UnsignedByteType, format: T.RGBAFormat, minFilter: T.LinearFilter, magFilter: T.LinearFilter, stencilBuffer: true };
    postMS = renderer.capabilities.isWebGL2 && T.WebGLMultisampleRenderTarget ? Math.min(samples, renderer.capabilities.maxSamples || 0) : 0;
    const rt = postMS ? Object.assign(new T.WebGLMultisampleRenderTarget(innerWidth * pr, innerHeight * pr, ro), { samples: postMS }) : new T.WebGLRenderTarget(innerWidth * pr, innerHeight * pr, ro);
    composer = new T.EffectComposer(renderer, rt);
    renderPass = new T.RenderPass(scene, activeCam);
    bloomPass = new T.UnrealBloomPass(new T.Vector2(1, 1), SCEN.id === 0 && NIGHT.on ? 1 : (SCEN.sc?.ambiente?.bloom ?? .55), .5, 1.5);
    // UnrealBloomPass internally halves its input dimensions. Keep its actual first mip at q.bloom.
    const bloomSize = bloomPass.setSize.bind(bloomPass);
    bloomPass.setSize = (w, h) => bloomSize(Math.max(2, Math.round(w * q.bloom * 2)), Math.max(2, Math.round(h * q.bloom * 2)));
    bloomPass.enabled = q.bloom > 0;
    blurPass = makeBlurPass(); blurPass.enabled = q.blur > 0;
    finalPass = new T.ShaderPass(FinalShader);
    finalPass.material.fragmentShader = q.blur === 1 ? FinalShader.fragmentShader : FinalShader.fragmentShader.replace('uniform sampler2D tDiffuse;', 'uniform sampler2D tDiffuse; uniform sampler2D tBlur; uniform float useBlur;').replace(/if \(r > 0.25\) \{[\s\S]*?col = acc \/ w;\n      \}/, 'if (r > 0.25 && useBlur > 0.5) col = texture2D(tBlur, vUv).rgb;');
    finalPass.uniforms.tBlur = { value: blurPass.target.texture }; finalPass.uniforms.useBlur = { value: q.blur > 0 ? 1 : 0 };
    composer.addPass(renderPass);
    composer.addPass({ enabled: true, needsSwap: false, setSize() {}, render(r, write, read) { if (SNIPER_VIEW.visible) renderSniperForeground(r, read); } });
    composer.addPass(bloomPass); composer.addPass(blurPass); composer.addPass(finalPass);
    fxaaPass = null;
    if (!postMS && T.FXAAShader) { fxaaPass = new T.ShaderPass(T.FXAAShader); composer.addPass(fxaaPass); }
    renderer.toneMapping = T.NoToneMapping; renderer.outputEncoding = T.LinearEncoding;
    resizePost();
  } catch (e) { console.warn('post off', e); disposePost(); renderer.toneMapping = T.ACESFilmicToneMapping; renderer.outputEncoding = T.sRGBEncoding; }
}
function disposePost() {
  if (!composer) return;
  composer.renderTarget1.dispose(); composer.renderTarget2.dispose();
  if (composer.copyPass?.material) composer.copyPass.material.dispose();
  if (bloomPass) {
    bloomPass.dispose();
    [bloomPass.materialHighPassFilter, bloomPass.compositeMaterial, bloomPass.materialCopy, bloomPass.basic, ...(bloomPass.separableBlurMaterials || [])].forEach(m => m?.dispose());
  }
  blurPass?.dispose(); finalPass?.material.dispose(); fxaaPass?.material.dispose(); composer = null;
}
function rebuildPost(samples) { disposePost(); setupPost(samples); }
function resizePost() {
  if (!composer) return;
  const pr = renderer.getPixelRatio();
  composer.setPixelRatio(pr); composer.setSize(innerWidth, innerHeight);
  finalPass.uniforms.res.value.set(innerWidth * pr, innerHeight * pr);
  blurPass.uniforms.res.value.copy(finalPass.uniforms.res.value);
  if (fxaaPass) fxaaPass.uniforms.resolution.value.set(1 / (innerWidth * pr), 1 / (innerHeight * pr));
}
function applyQuality() {
  if ($('#qualitySel')) $('#qualitySel').value = quality.mode;
  const q = quality.snapshot();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.dpr) * q.scale);
  if (sun.shadow.mapSize.x !== q.shadow) { sun.shadow.mapSize.setScalar(q.shadow); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
  renderer.shadowMap.autoUpdate = true; renderer.shadowMap.needsUpdate = true;
  fitShadowBounds();
  rebuildPost(q.samples); resize();
}
// Kept for test compatibility. Adaptive decisions use raw RAF timestamps in Quality instead.
const FPS = { t: 0, n: 0, low: 0, lv: 0, f: 0 };
function renderSniperForeground(r, target) {
  SNIPER_STAGE.position.copy(wide.position); SNIPER_STAGE.quaternion.copy(wide.quaternion);
  SNIPER_SCENE.environment = scene.environment;
  const auto = r.autoClear; r.autoClear = false;
  try { r.setRenderTarget(target); r.clearDepth(); r.render(SNIPER_SCENE, wide); }
  finally { r.autoClear = auto; }
}
function renderFrame(dt, opts) {
  SNIPER_VIEW.visible = activeCam === wide && G.screen === 'game' && G.role === 's' && !snip.scoped;
  if (!composer) { renderer.render(scene, activeCam); if (SNIPER_VIEW.visible) renderSniperForeground(renderer, null); return; }
  renderPass.camera = activeCam;
  const q = quality.snapshot(), u = finalPass.uniforms;
  u.time.value = (u.time.value + 1) % 1000;
  u.tilt.value = q.blur ? opts.tilt : 0; u.blurAll.value = q.blur ? opts.blurAll : 0;
  u.focus.value = opts.focus; u.vig.value = opts.vig; u.exposure.value = opts.exposure;
  for (const name of ['tilt', 'blurAll', 'focus']) blurPass.uniforms[name].value = u[name].value;
  // No blur pass is needed in a scope: both radii are zero.
  blurPass.enabled = q.blur > 0 && q.blur < 1 && (opts.tilt > 0 || opts.blurAll > 0);
  u.useBlur.value = blurPass.enabled ? 1 : 0;
  composer.render(dt);
}

// A conservative LOD: only explicitly non-collidable particle systems. Mesh silhouettes and hit geometry never change.
const DECOR_LOD = []; let decorRoot = null;
function updateDecorativeDetail(dt) {
  const root = SCEN.id === 0 ? MAP0?.objs : SCEN.root ? [SCEN.root] : [];
  if (decorRoot !== (SCEN.root || MAP0)) {
    DECOR_LOD.length = 0; decorRoot = SCEN.root || MAP0;
    for (const r of root || []) r.traverse(o => { if (o.isPoints && o.userData.noCol && o.geometry?.attributes.position) DECOR_LOD.push({ mesh: o, count: o.geometry.attributes.position.count, current: 1 }); });
  }
  const q = quality.snapshot(), zoomed = activeCam === scopeCam;
  const center = tmpV;
  for (const entry of DECOR_LOD) {
    const o = entry.mesh, count = entry.count;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    const sphere = o.geometry.boundingSphere; center.copy(sphere.center).applyMatrix4(o.matrixWorld).applyMatrix4(activeCam.matrixWorldInverse);
    const radius = sphere.radius * o.matrixWorld.getMaxScaleOnAxis();
    const pixels = activeCam.isPerspectiveCamera ? radius * innerHeight / Math.max(.01, -center.z * Math.tan(T.MathUtils.degToRad(activeCam.fov / 2))) : radius * innerHeight / Math.max(.01, activeCam.top - activeCam.bottom);
    const target = zoomed ? 1 : q.detail + (1 - q.detail) * T.MathUtils.clamp((pixels - 80) / 240, 0, 1);
    o.userData.decorInterval = zoomed || target > .95 ? 0 : target > .6 ? 1 / 30 : 1 / 20;
    if (zoomed) entry.current = 1;
    entry.current += (target - entry.current) * (1 - Math.exp(-dt * 3));
    o.geometry.setDrawRange(0, Math.max(1, Math.round(count * entry.current)));
  }
}

// ---------------------------------------------------------------- audio
let AC = null;
function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function noise(dur, freq, gain) {
  const ac = audio(); if (!ac) return;
  const len = ac.sampleRate * dur, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = ac.createBufferSource(); src.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = freq;
  const g = ac.createGain(); g.gain.value = gain; src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
}
function tone(freq, dur, gain = 0.05, type = 'sine') {
  const ac = audio(); if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
}
const sndShot = () => { noise(0.9, 1800, 0.9); noise(0.25, 6000, 0.4); };
const sndScope = () => tone(1400, 0.06, 0.03, 'square');
// the shot rolling back off the buildings (the spent case rings on its own, see stepNest)
const sndEcho = () => { setTimeout(() => noise(0.8, 700, 0.25), 320); setTimeout(() => noise(1.1, 420, 0.12), 760); };
// the verdict behind the scope: a dull settle when the agent drops, a sour falling sting when the shot was wasted
const sndOvertime = () => { tone(523, 0.18, 0.05, 'square'); setTimeout(() => tone(523, 0.18, 0.05, 'square'), 260); setTimeout(() => tone(784, 0.5, 0.05, 'square'), 520); };
const sndHit = () => { tone(110, 0.5, 0.07); setTimeout(() => tone(82, 0.7, 0.06), 180); };
const sndMiss = () => { tone(392, 0.22, 0.05, 'sawtooth'); setTimeout(() => tone(330, 0.24, 0.05, 'sawtooth'), 200); setTimeout(() => tone(233, 0.6, 0.06, 'sawtooth'), 420); };
// air through the nose: a band of noise with its own swell (in rises, out falls, a gasp is two quick rasps)
function breath(dur, freq, gain, shape) {
  const ac = audio(); if (!ac) return;
  const len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * shape(i / len);
  const src = ac.createBufferSource(); src.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
  const g = ac.createGain(); g.gain.value = gain; src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
}
const sndInhale = () => breath(0.55, 1100, 0.18, x => Math.sin(Math.PI * Math.min(1, x * 1.3)) * (0.4 + x));
const sndExhale = () => breath(0.8, 700, 0.16, x => Math.pow(1 - x, 1.6) * Math.min(1, x * 8));
const sndGasp = () => { breath(0.3, 1300, 0.22, x => Math.sin(Math.PI * x)); setTimeout(() => breath(0.35, 1000, 0.2, x => Math.sin(Math.PI * x)), 380); };
const sndTink = (k) => { tone(2600 - k * 500, 0.05, 0.03 / (k + 1), 'triangle'); tone(3900 - k * 700, 0.03, 0.015 / (k + 1), 'triangle'); };
const sndBeat = () => { tone(58, 0.12, 0.09); setTimeout(() => tone(52, 0.1, 0.06), 150); };
// the scope going up to the eye: a soft slide and the click of the eyecup; zoom ring detents
const sndScopeIn = () => { noise(0.12, 900, 0.12); setTimeout(() => tone(2400, 0.025, 0.02, 'square'), 90); };
const sndScopeOut = () => noise(0.1, 700, 0.09);
const sndZoom = () => tone(2600, 0.018, 0.012, 'square');
const sndGood = () => { tone(660, 0.15, 0.05); setTimeout(() => tone(990, 0.2, 0.05), 110); };
const AMB = { g: null, f: null };
function ambBuild(ac) {
  const sr = ac.sampleRate, out = ac.createBiquadFilter(); out.type = 'lowpass'; out.frequency.value = 9000; out.Q.value = 0.5;
  const g = ac.createGain(); g.gain.value = 0; out.connect(g); g.connect(ac.destination);
  // crowd murmur: 6 s of brown-ish noise with a slow chatter envelope, through a voice band
  { const len = sr * 6, buf = ac.createBuffer(1, len, sr), d = buf.getChannelData(0); let b = 0;
    for (let i = 0; i < len; i++) { b = b * 0.985 + (Math.random() * 2 - 1) * 0.015; const t = i / sr; d[i] = b * 9 * (0.65 + 0.2 * Math.sin(t * 5.1 + Math.sin(t * 0.9) * 3) + 0.15 * Math.sin(t * 2.3 * Math.PI / 3)); }
    const fadeN = sr * 0.25; for (let i = 0; i < fadeN; i++) { const k = i / fadeN; d[i] *= k; d[len - 1 - i] *= k; }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 650; bp.Q.value = 0.7;
    const mg = ac.createGain(); mg.gain.value = 0.9; src.connect(bp); bp.connect(mg); mg.connect(out); src.start(); }
  // a soft lounge loop: 4 bars at 112 bpm, kick on the beat, bass and a warm chord pad
  { const bpm = 112, beat = 60 / bpm, len = Math.round(sr * beat * 16), buf = ac.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const prog = [[45, 57, 60, 64], [41, 53, 57, 60], [43, 55, 59, 62], [40, 52, 55, 59]], hz = n => 440 * Math.pow(2, (n - 69) / 12);
    for (let i = 0; i < len; i++) { const t = i / sr, bi = Math.floor(t / beat), tb = t - bi * beat, bar = Math.floor(bi / 4) % 4, ch = prog[bar];
      const kick = Math.sin(2 * Math.PI * (50 * tb + 60 * (1 - Math.exp(-tb * 30)) / 30)) * Math.exp(-tb * 9) * 0.55;
      const bass = Math.sin(2 * Math.PI * hz(ch[0] - 12) * t) * Math.exp(-tb * 2.2) * 0.35;
      let pad = 0; for (let k = 1; k < 4; k++) pad += Math.sin(2 * Math.PI * hz(ch[k]) * t + k) * 0.07; pad *= 0.6 + 0.4 * Math.sin(Math.PI * ((t / (beat * 4)) % 1));
      d[i] = kick + bass + pad; }
    const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; const mg = ac.createGain(); mg.gain.value = 0.32; src.connect(mg); mg.connect(out); src.start(); }
  AMB.g = g; AMB.f = out;
}
// called every frame: louder in the party, distant from the sniper's roof, muffled behind the scope, quiet in the menu
function ambUpdate() {
  if (!AC || AC.state !== 'running') return;
  if (!AMB.g) { try { ambBuild(AC); } catch (e) { AMB.g = { gain: { setTargetAtTime() { } } }; AMB.f = { frequency: { setTargetAtTime() { } } }; return; } }
  const game = G.screen === 'game', sn = G.role === 's';
  const vol = !game ? 0.035 : sn ? (snip.scoped ? 0.05 : 0.07) : 0.11, cut = game && sn ? (snip.scoped ? 420 : 2200) : 9000;
  AMB.g.gain.setTargetAtTime(vol, AC.currentTime, 0.25); AMB.f.frequency.setTargetAtTime(cut, AC.currentTime, 0.12);
}

// ---------------------------------------------------------------- UI helpers
function toast(text, kind = '') {
  const d = document.createElement('div'); d.className = 'card toast ' + kind; d.textContent = text; $('#toasts').appendChild(d);
  setTimeout(() => d.remove(), 4200);
}
const show = (id, v) => { $(id).hidden = !v; };
const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
let storedName = ''; try { storedName = localStorage.getItem('mira-nome') || ''; } catch (e) { }
$('#nome').value = storedName;
function myName() { const n = $('#nome').value.trim().slice(0, 16) || 'Convidado'; try { localStorage.setItem('mira-nome', n); } catch (e) { } return n; }

// ---------------------------------------------------------------- game context
const G = {
  screen: 'menu', solo: null, multi: false, isHost: false, sim: null, backdrop: null,
  role: null, myEid: -1, seed: null, rd: 0, lastPh: null, scores: {}, roundNo: 0,
  tellsApplied: 0, dnSeen: 0, hostState: null, hostRaw: null, hostPeer: null, hostGoneAt: 0,
};
const ctrl = { x: 0, z: 0, y: 0, lv: 0, lk: null, rot: 0, anim: 0, path: [], act: null, actSeq: 0, actDone: null, pose: null, keys: new Set(), vx: 0, vz: 0, goal: null, settle: null, stepT: 0 };
const snip = { yaw: 0, pitch: -0.42, scoped: false, zoom: 6, marks: [], shotSent: false, aim: new T.Vector3(), lastPX: null, lastPY: null, breath: 0, hold: false, air: 1, gasp: 0, kick: 0, wind: 0, nbKey: '', radioSeen: 0 };
const ANIM_LABEL = { 0: 'parado', 1: 'andando', 2: 'mexendo em algo', 21: 'agachado', 3: 'dançando', 4: 'conversando', 5: 'caído', 6: 'pedindo um drinque', 7: 'sentado', 8: 'deitado', 9: 'ao piano', 10: 'perto da fogueira', 11: 'fazendo yoga', 12: 'jogando cartas', 13: 'tocando sax', 14: 'pintando', 15: 'na jacuzzi', 16: 'no pufe', 17: 'jogando xadrez', 18: 'tirando selfie', 19: 'regando', 20: 'no caça-níqueis', 22: 'de mãos para trás', 23: 'de braços cruzados', 24: 'esfregando as mãos', 25: 'fazendo reverência' };
function windFor(st) { return st ? (((st.sd % 1000) * 7 + st.rd * 13) % 7) - 3 : 0; }

function newBackdrop() { G.backdrop = new Sim({ seed: (rnd() * 1e9) >>> 0, demo: true }); }

function currentState() {
  if (G.screen === 'game') {
    if (G.sim) return G.sim.state();
    return G.hostState;
  }
  return G.backdrop ? G.backdrop.state() : null;
}

// ---------------------------------------------------------------- network (room capability)
const Net = {
  lobby: null, room: null, code: '', filtered: false, off: null, lastPub: 0,
  async init() { try { if (window.claude && window.claude.use) this.lobby = await window.claude.use('room'); } catch (e) { this.lobby = null; } return !!this.lobby; },
  async enter(code, host) {
    this.code = code;
    try { this.room = await this.lobby.join('mira-' + code.toLowerCase()); this.filtered = false; }
    catch (e) { this.room = this.lobby; this.filtered = true; }
    await this.room.presence({ nm: myName(), host: host ? 1 : 0, j: Date.now(), code: this.filtered ? code : null, g: null, p: null, act: null, aim: null, mk: null, shot: null }).catch(() => { });
    this.off = this.room.onPeers(() => onPeers());
  },
  peers() { if (!this.room) return []; const ps = this.room.peers(); return this.filtered ? ps.filter(p => p.presence && p.presence.code === this.code) : ps.filter(p => p.presence && p.presence.nm); },
  me() { return this.peers().find(p => p.sameTab); },
  set(patch) { if (this.room) this.room.presence(patch).catch(() => { }); },
  async leave() {
    try { if (this.off) this.off(); } catch (e) { }
    try { if (this.room && !this.filtered) await this.room.leave(); else if (this.room) await this.room.presence({ code: null, nm: null, g: null, host: null }); } catch (e) { }
    this.room = null; this.off = null;
  },
};
function hostOf(peers) {
  const hs = peers.filter(p => p.presence.host === 1).sort((a, b) => (a.presence.j || 0) - (b.presence.j || 0));
  return hs[0] || null;
}
function myPeerId() { const m = Net.me(); return m ? m.peer : null; }

function encodeState(st) {
  const e = [];
  for (const x of st.ents) e.push(x.id, Math.round(x.x * 50), Math.round(x.z * 50), Math.round(x.rot * 100), x.anim, Math.round((x.y || 0) * 50));
  const g = { ph: st.ph, rd: st.rd, sd: st.sd, mp: st.mp || 0, nt: st.nt ? 1 : 0, tl: Math.round(st.tl * 10) / 10, e, pm: st.pm, rl: st.rl, nm: st.nm, ms: st.ms, dn: st.dn, te: st.tells, sh: st.sh, w: st.w, why: st.why, sc: st.sc, mk: st.mk, bm: st.bm, ho: st.ho, ot: st.ot ? 1 : 0 };
  if (st.ph === 'reveal') { g.ag = st.ag; g.lg = st.lg; g.tr = st.tr; g.lp = st.lp; }
  g.sx = st.sx; g.ts = st.ts; g.tg = st.tg; g.lu = st.lu; g.dz = st.dz;
  if (st.ru) { g.ru = st.ru; g.rt = st.rt; g.bl = st.bl; g.ap = st.ap; g.pd = st.pd; g.sh1 = st.sh1; }
  return g;
}
function decodeState(g) {
  if (!g || g.ph === 'lobby') return g ? { ph: 'lobby', sc: g.sc || {} } : null;
  const ents = [];
  for (let i = 0; i + 5 < g.e.length; i += 6) ents.push({ id: g.e[i], x: g.e[i + 1] / 50, z: g.e[i + 2] / 50, rot: g.e[i + 3] / 100, anim: g.e[i + 4], y: g.e[i + 5] / 50 });
  ents.sort((a, b) => a.id - b.id);
  return { ph: g.ph, rd: g.rd, sd: g.sd, mp: g.mp || 0, nt: g.nt ? 1 : 0, lg: g.lg || [], tl: g.tl, ents, pm: g.pm || {}, rl: g.rl || {}, nm: g.nm || {}, ms: g.ms || [], dn: g.dn || [], tells: g.te || [], sh: g.sh, w: g.w, why: g.why, sc: g.sc || {}, mk: g.mk || [], bm: g.bm, ho: g.ho, ot: g.ot ? 1 : 0, ag: g.ag ?? -1, aim: null, sx: g.sx || [], ts: g.ts || null, tg: g.tg ? 1 : 0, lu: g.lu || {}, dz: g.dz || [], ru: g.ru || null, rt: g.rt || ROUND_T, bl: g.bl ?? 1, ap: g.ap ?? -1, pd: g.pd || 0, sh1: g.sh1 || null , tr: g.tr || [], lp: g.lp || [] };
}

const hostSeen = { seq: {}, shot: false, at: {}, raw: {} };
// a guest may only move as fast as a person walks (with room for network bursts); anything faster is pulled back
function hostLimitMove(sim, peer, e, x, z, y) {
  const now = performance.now() / 1000, last = hostSeen.at[peer], dt = last ? Math.min(2, Math.max(0.05, now - last)) : 0.5;
  hostSeen.at[peer] = now;
  const dx = x - e.x, dz = z - e.z, d = Math.hypot(dx, dz), mx = P_SPEED * 1.5 * dt + 0.8;
  if (d > mx) { x = e.x + dx / d * mx; z = e.z + dz / d * mx; }
  const dy = y - (e.y || 0), my = 5 * dt + 0.5; if (Math.abs(dy) > my) y = (e.y || 0) + Math.sign(dy) * my;
  return [x, z, y];
}
// the sniper's shot must land near where their scope pointed, on someone the scope can actually see
function hostShotOk(pr, eid) {
  const e = G.sim.ents[eid]; if (!e) return false;
  if (Array.isArray(pr.aim) && pr.aim.length === 3) { const a = new T.Vector3(pr.aim[0] / 20, pr.aim[1] / 20, pr.aim[2] / 20); if (a.distanceTo(new T.Vector3(e.x, (e.y || 0) + 1.1, e.z)) > 4) return false; }
  const occ = SCEN.id ? (SCEN.occ || []) : OCCLUDERS, rc = new T.Raycaster();
  for (const [ox, oy] of [[0, 1.2], [0, 1.6], [0.25, 1.2], [-0.25, 1.2], [0, 0.6]]) {
    const tg = new T.Vector3(e.x + ox, (e.y || 0) + oy, e.z), dir = tg.clone().sub(SNIPER_POS), dist = dir.length(); dir.normalize(); rc.set(SNIPER_POS, dir); rc.far = dist;
    const h = rc.intersectObjects(occ, true)[0]; if (!h || h.distance > dist - 0.4) return true;
  }
  return false;
}
function hostReadPeers() {
  const sim = G.sim; if (!sim) return;
  const ps = Net.peers(); const present = new Set(ps.map(p => p.peer));
  for (const p of ps) {
    if (p.sameTab) continue;
    const pr = p.presence, r = sim.rl[p.peer];
    if (!r) continue;
    if (r === 's') {
      if (Array.isArray(pr.mk)) sim.mk = pr.mk.slice(0, 3).filter(n => Number.isInteger(n));
      if (Array.isArray(pr.aim) && pr.aim.length === 3) sim.laser = { x: pr.aim[0] / 20, y: pr.aim[1] / 20, z: pr.aim[2] / 20 };
      if (pr.shot && pr.shot.rd === sim.round && Number.isInteger(pr.shot.e) && sim.ph === 'play' && hostSeen.shot !== sim.round + ':' + pr.shot.e) { hostSeen.shot = sim.round + ':' + pr.shot.e; if (hostShotOk(pr, pr.shot.e)) sim.shoot(pr.shot.e); else console.warn('shot rejected', pr.shot.e); }
    } else {
      const id = sim.pm[p.peer];
      if (Array.isArray(pr.p) && pr.p.length >= 4) {
        const [x, z, r2, a, yy] = pr.p;
        const XB = LEVELS.reduce((a, L) => [Math.min(a[0], L.x0), Math.max(a[1], L.x1)], [0, 0]), ZB = LEVELS.reduce((a, L) => [Math.min(a[0], L.z0), Math.max(a[1], L.z1)], [0, 0]);
        const y = Math.max(0, Math.min(Math.max(...LEVELS.map(L => L.y)), (yy || 0) / 50));
        const lv = lvOfY(y), onFloor = Math.abs(y - LVY(lv)) < 0.3;
        const zmin = onFloor ? LEVELS[lv].z0 : ZB[0], zmax = onFloor ? LEVELS[lv].z1 : ZB[1];
        const raw = pr.p.join(','), ent = sim.ents[id];
        if (Number.isFinite(x) && Number.isFinite(z) && ent && raw !== hostSeen.raw[p.peer]) {
          hostSeen.raw[p.peer] = raw;
          const [lx, lz, ly] = hostLimitMove(sim, p.peer, ent, Math.max(XB[0], Math.min(XB[1], x / 50)), Math.max(zmin, Math.min(zmax, z / 50)), y);
          sim.setPlayer(id, lx, lz, r2 / 100, [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25].includes(a) ? a : 0, ly);
        }
      }
      if (pr.act && pr.act.rd === sim.round && Number.isInteger(pr.act.s) && pr.act.s > (hostSeen.seq[p.peer] || 0)) {
        hostSeen.seq[p.peer] = pr.act.s; sim.completeAct(id, pr.act.o | 0, pr.act.d === 1);
      }
    }
  }
  // people who left mid-round
  for (const [peer, r] of Object.entries(sim.rl)) {
    if (present.has(peer) || peer === myPeerId()) continue;
    if (r === 's') { if (sim.ph === 'play' || sim.ph === 'brief') { sim.ph = 'play'; sim.end('g', 'left'); } }
    else { const e = sim.ents[sim.pm[peer]]; if (e && e.kind === 'player') { e.kind = 'bot'; e.todo = r === 'a' ? sim.ms.filter(o => !sim.dn.includes(o)) : []; sim.pickNext(e); } }
  }
}

function onPeers() {
  const ps = Net.peers();
  const h = hostOf(ps); const me = Net.me();
  G.hostPeer = h ? h.peer : null;
  G.isHost = !!(h && me && h.peer === me.peer);
  renderLobby();
}

function renderLobby() {
  if (G.screen !== 'lobby' && !(G.screen === 'game' && G.multi)) return;
  const ps = Net.peers().slice().sort((a, b) => (a.presence.j || 0) - (b.presence.j || 0));
  const ul = $('#players'); ul.innerHTML = '';
  for (const p of ps) {
    const li = document.createElement('li');
    const n = document.createElement('span'); n.textContent = String(p.presence.nm || 'Convidado').slice(0, 16) + (p.sameTab ? ' (você)' : '');
    const t = document.createElement('span'); t.className = 'tag'; t.textContent = p.peer === G.hostPeer ? 'anfitrião da sala' : (G.scores[p.peer] ? G.scores[p.peer] + ' pts' : '');
    li.append(n, t); ul.appendChild(li);
  }
  const n = ps.length;
  $('#btnStart').hidden = !G.isHost; $('#mapRow').hidden = !G.isHost; $('#ruleRow').hidden = !G.isHost;
  $('#btnStart').disabled = n < 2;
  $('#btnShare').classList.toggle('primary', n < 2 || !G.isHost);
  $('#lobbyMsg').textContent = G.isHost
    ? (n < 2 ? 'Esperando pelo menos mais 1 pessoa. O ideal são 5.' : `${n} na sala. ${n < 5 ? 'Dá para começar; com 5 fica melhor.' : 'Tudo pronto.'}`)
    : (G.hostPeer ? 'Esperando o anfitrião da sala começar.' : 'Procurando a sala…');
}

// ---------------------------------------------------------------- invite link: ?sala=ABCD opens the game straight into that room
// (only on the published site, MIRA_WEB, set by fonte/web/montar.js; inside claude.ai a link cannot carry the room)
const inviteCode = (() => { try { const c = (new URLSearchParams(location.search).get('sala') || '').toUpperCase().replace(/[^A-Z]/g, ''); return c.length === 4 ? c : ''; } catch (e) { return ''; } })();
function inviteUrl(code) { const u = new URL(location.href); u.search = '?sala=' + code; u.hash = ''; return u.toString(); }
function setRoomInUrl(code) { if (!window.MIRA_WEB) return; try { history.replaceState(null, '', code ? '?sala=' + code : location.pathname); } catch (e) { } }
async function shareInvite() {
  const url = inviteUrl(Net.code), text = L10N(`Bora jogar Mira na Cobertura? Entra na minha sala (${Net.code}):`);
  if (navigator.share) { try { await navigator.share({ title: L10N('Mira na Cobertura'), text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank', 'noopener');
}
async function copyInvite() {
  const url = inviteUrl(Net.code);
  try { await navigator.clipboard.writeText(url); toast('Link copiado. Quem abrir entra direto na sala.'); }
  catch (e) { window.prompt(L10N('Copie o link da sala:'), url); }
}
function showInvite() {
  if (!inviteCode) return;
  $('#invite').hidden = false; $('#inviteCode').textContent = inviteCode; $('#codeIn').value = inviteCode;
  $('#btnInvite').hidden = false; $('#btnInvite').textContent = 'Entrar na sala ' + inviteCode; $('#btnCreate').classList.remove('primary');
}

// ---------------------------------------------------------------- flows
async function createRoom() {
  if (!Net.lobby) return;
  const code = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(rnd() * 24)]).join('');
  await enterRoom(code, true);
}
async function joinRoom() {
  const code = $('#codeIn').value.trim().toUpperCase().replace(/[^A-Z]/g, '');
  if (code.length !== 4) { toast('O código tem 4 letras.', 'bad'); return; }
  await enterRoom(code, false);
}
async function enterRoom(code, host) {
  audio();
  G.multi = true; G.solo = null; G.screen = 'lobby'; G.sim = null; G.scores = {}; G.roundNo = 0; G.hostState = null; G.hostRaw = null;
  $('#lobbyCode').textContent = code; setRoomInUrl(code);
  $('#shareRow').hidden = !window.MIRA_WEB;
  $('#lobbyHint').textContent = window.MIRA_WEB ? 'Mande o link para a turma: quem abrir entra direto nesta sala.' : 'Passe esse código para seus amigos. Eles precisam ter acesso a esta página.';
  show('#menu', false); show('#lobby', true);
  try { await Net.enter(code, host); }
  catch (e) { toast('Não foi possível entrar na sala. Tente de novo.', 'bad'); backToMenu(); return; }
  if (host) Net.set({ g: { ph: 'lobby', sc: {} } });
  setTimeout(() => { if (G.multi && G.screen === 'lobby' && !G.hostPeer) $('#lobbyMsg').textContent = 'Nenhuma sala com esse código. Confira o código ou crie uma sala.'; }, 5000);
  renderLobby();
}
// host migration: the next host rebuilds the round from the last broadcast state (same seed, so nobody's scene resets)
function adoptSim(st) {
  if (!st || !st.ents || (st.mp || 0) !== readyMapId) return null;
  const peers = Object.keys(st.pm || {}), sn = Object.keys(st.rl || {}).find(p => st.rl[p] === 's');
  const guests = peers.map(p => ({ peer: p, name: st.nm[p], role: st.rl[p] === 'a' ? 'a' : 'c' }));
  const sim = new Sim({ seed: st.sd, round: st.rd, guests, sniper: sn ? { peer: sn, name: st.nm[sn] } : null, sc: Object.assign({}, st.sc), map: st.mp || 0, night: !!st.nt, rule: st.ru });
  if (sim.ents.length !== st.ents.length) return null;
  const rng = sim.rng, statics = new Set([st.bm, st.ho, ...(st.sx || [])]);
  sim.slots.forEach(s => { s.busy = -1; });
  for (const x of st.ents) {
    const e = sim.ents[x.id]; if (!e) return null;
    Object.assign(e, { x: x.x, z: x.z, y: x.y || 0, lv: lvOfY(x.y || 0), lk: null, rot: x.rot, trot: x.rot, anim: x.anim, dead: x.anim === 5, kind: statics.has(x.id) ? 'static' : 'npc', role: 'npc', peer: null, path: [], slot: -1, obj: -1, wantM: -1, st: x.anim === 5 ? 'dead' : 'idle', timer: 0.3 + rng() * 3 });
    if (e.kind === 'static') continue;
    // someone standing on a free spot keeps it (and keeps doing what they were doing for a while)
    let best = -1, bd = 0.35; sim.slots.forEach((s, i) => { if (s.busy < 0 && s.lv === e.lv) { const d = Math.hypot(s.x - e.x, s.z - e.z); if (d < bd) { bd = d; best = i; } } });
    if (best >= 0 && e.anim !== 1 && !e.dead) { e.slot = best; sim.slots[best].busy = e.id; e.timer = 2 + rng() * 8; }
  }
  sim.pm = Object.assign({}, st.pm); sim.rl = Object.assign({}, st.rl); sim.nm = Object.assign({}, st.nm); sim.agentId = -1;
  for (const p of peers) { const e = sim.ents[st.pm[p]]; if (!e) return null; Object.assign(e, { kind: 'player', role: st.rl[p] === 'a' ? 'agent' : 'acc', peer: p, speed: P_SPEED, todo: [] }); if (st.rl[p] === 'a') sim.agentId = e.id; }
  Object.assign(sim, { bm: st.bm, ho: st.ho, sx: (st.sx || []).slice(), ms: st.ms.slice(), dn: st.dn.slice(), tells: st.tells.slice(), mk: (st.mk || []).slice(), sh: st.sh || null, w: st.w || null, why: st.why || null, ot: st.ot ? 1 : 0, ph: st.ph, t: st.tl, _st: null });
  // missions done whose tell had not shown yet still show, a moment later
  sim.tq = sim.dn.filter(o => !sim.tells.includes(o)).map(o => ({ obj: o, at: 1 + rng() * 3 }));
  sim.ts = st.ts || null; sim.got = !!st.tg;
  sim.lu = Object.fromEntries(Object.entries(st.lu || {}).map(([k, u]) => [k, u.slice()])); sim.dz = (st.dz || []).slice();
  Object.assign(sim, { bl: st.bl ?? sim.bl, pd: st.pd || 0, sh1: st.sh1 || null });
  return sim;
}
function becomeHost() {
  Net.set({ host: 1 }); G.claimed = true;
  const st = decodeState(G.hostRaw);
  G.isHost = true; hostSeen.seq = {}; hostSeen.raw = {}; hostSeen.at = {};
  for (const p of Net.peers()) if (p.presence && p.presence.act && Number.isInteger(p.presence.act.s)) hostSeen.seq[p.peer] = p.presence.act.s;
  if (!st || st.ph === 'lobby' || G.screen !== 'game') { if (G.screen === 'game') hostToLobby(); else renderLobby(); return; }
  G.scores = Object.assign({}, st.sc); G.roundNo = Math.max(G.roundNo || 0, st.rd || 0);
  let sim = null; try { sim = adoptSim(st); } catch (e) { console.error('adoptSim', e); }
  if (sim) { G.sim = sim; G.hostState = null; toast('O anfitrião saiu. Você assumiu a sala e a rodada continua.'); }
  else { toast('O anfitrião saiu. Você assumiu a sala.'); hostToLobby(); }
}
async function hostStart() {
  if (preparing) return;
  const mc = mapPick(); if (!await prepareMap(mc.id) || !G.multi || !G.isHost) return;
  const ps = Net.peers().slice().sort((a, b) => (a.presence.j || 0) - (b.presence.j || 0));
  if (ps.length < 2) return;
  G.roundNo++;
  const si = (G.roundNo - 1) % ps.length;
  const sn = ps[si], others = ps.filter((_, i) => i !== si);
  const ai = Math.floor(rnd() * others.length);
  const guests = others.map((p, i) => ({ peer: p.peer, name: String(p.presence.nm || 'Convidado').slice(0, 16), role: i === ai ? 'a' : 'c' }));
  hostSeen.seq = {}; hostSeen.raw = {}; hostSeen.at = {};
  setNight(mc.night);
  G.sim = new Sim({ seed: (rnd() * 1e9) >>> 0, round: G.roundNo, guests, sniper: { peer: sn.peer, name: String(sn.presence.nm || 'Sniper').slice(0, 16) }, sc: G.scores, map: SCEN.id, night: mc.night, rule: rulePick() });
  G.screen = 'game'; show('#lobby', false);
}
async function startSolo(kind) {
  audio(); if (preparing) return;
  const mc = mapPick(); if (!await prepareMap(mc.id)) return;
  G.multi = false; G.solo = kind; G.isHost = true; G.screen = 'game'; G.roundNo = (G.roundNo || 0) + 1;
  const name = myName();
  let guests, sniper;
  if (kind === 'sniper') { guests = [{ bot: true, role: 'a' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }]; sniper = { peer: 'local', name }; }
  else { guests = [{ peer: 'local', name, role: 'a' }, { bot: true, role: 'c' }, { bot: true, role: 'c' }]; sniper = { ai: true, name: 'Sniper' }; }
  setNight(mc.night);
  G.sim = new Sim({ seed: (window.__benchmarkSeed ?? ((rnd() * 1e9) >>> 0)), round: G.roundNo, guests, sniper, sc: G.scores, map: SCEN.id, night: mc.night });
  show('#menu', false);
}
function backToMenu() {
  prepareToken++; preparing = false; $('#loading').hidden = true;
  if (G.multi) { Net.leave(); setRoomInUrl(''); }
  Object.assign(G, { screen: 'menu', solo: null, multi: false, isHost: false, sim: null, role: null, myEid: -1, seed: null, lastPh: null, hostState: null, hostRaw: null, roundNo: 0, scores: {}, lastHost: null, claimed: false });
  setScope(false); resetProps(); setNight(false); G.backdrop = null;
  ['#hud', '#brief', '#reveal', '#lobby'].forEach(id => show(id, false)); show('#menu', true);
  $('#labels').innerHTML = '';
}
function hostToLobby() {
  prepareToken++; preparing = false; $('#loading').hidden = true;
  G.sim = null; G.screen = 'lobby'; Net.set({ g: { ph: 'lobby', sc: G.scores } }); resetProps(); setNight(false); G.backdrop = null;
  ['#hud', '#brief', '#reveal'].forEach(id => show(id, false)); show('#lobby', true); setScope(false); renderLobby();
}

// ---------------------------------------------------------------- per-round sync
function syncRound(st) {
  if (readyMapId !== (st.mp || 0) || (window.MIRA_ASSETS && !window.MIRA_ASSETS.ready(st.mp || 0))) { const id = st.mp || 0; if (!preparing && (!lastMapFailure || lastMapFailure.id !== id || performance.now() - lastMapFailure.at > 3000)) prepareMap(id); return false; }
  if (st.sd !== G.seed) {
    G.seed = st.sd; loadMap(st.mp || 0); setNight(!!st.nt && !(st.mp || 0)); PERF.measure('charactersBuild', () => buildChars(st)); resetProps(); G.tellsApplied = 0; G.dnSeen = 0; G.lastPh = null;
    G.role = undefined; G.myEid = -2;
    snip.marks = []; snip.shotSent = false; snip.yaw = 0; snip.pitch = WIDE_ELEV; setScope(false); snip.air = 1; snip.gasp = 0; snip.hold = false; snip.nbKey = ''; snip.radioSeen = 0; snip.tellAt = {}; snip.idd = {}; snip.idT = {}; snip.killcam = false; snip.firedAt = 0; NEST_FX.scare = 0; NEST_FX.case = null;
    ctrl.path = []; ctrl.act = null; ctrl.actDone = null; ctrl.pose = null; ctrl.lk = null; ctrl.dzArm = false;
    isoState.tx = 0; isoState.tz = 0; isoState.ty = 0; isoState.az = -0.55; isoState.zoom = G.screen === 'game' ? 8.5 : 11; placeIso(0, true); resize();
  }
  {
    const me = G.solo ? 'local' : myPeerId();
    const role = (me && st.rl && st.rl[me]) || null, eid = me && st.pm && st.pm[me] !== undefined ? st.pm[me] : -1;
    if (role !== G.role || eid !== G.myEid) {
      G.role = role; G.myEid = eid; G.lastPh = null;
      if (eid >= 0) { const e = st.ents.find(x => x.id === eid); if (e) { ctrl.x = e.x; ctrl.z = e.z; ctrl.y = e.y || 0; ctrl.lv = lvOfY(ctrl.y); ctrl.rot = e.rot; isoState.tx = e.x; isoState.tz = e.z; isoState.ty = ctrl.y; placeIso(0, true); } }
    }
  }
  while (G.tellsApplied < st.tells.length) applyTell(st.tells[G.tellsApplied++], G.screen === 'game');
  if (G.screen !== 'game') return;
  if (st.ph !== G.lastPh) { onPhase(st); G.lastPh = st.ph; }
  if (G.role === 's' && st.ph === 'play') {
    snip.tellAt = snip.tellAt || {};
    while (snip.radioSeen < st.tells.length) { const o = st.tells[snip.radioSeen++]; snip.tellAt[o] = st.tl; toast('📻 Rádio: algo mudou ' + areaOf(o) + '. Enquadre com a luneta para ver o quê.'); }
  } else snip.radioSeen = st.tells.length;
  if (st.ph === 'play' && st.ot && G.otSeen !== st.rd) {
    G.otSeen = st.rd; sndOvertime();
    toast(G.role === 's' ? `⏱ Prorrogação: o agente está a uma missão. Mais ${OT_T} s para achá-lo.` : G.role === 'a' ? `⏱ Prorrogação: ${OT_T} s para a última missão.` : `⏱ Prorrogação: o agente está a uma missão. Mais ${OT_T} s.`, 'bad');
  }
  stepRuleEvents(st);
  if (G.role === 'a' && st.dn.length > G.dnSeen) {
    for (let i = G.dnSeen; i < st.dn.length; i++) toast(`Missão cumprida: ${MISSIONS[st.dn[i]].label} (${st.ru === 'dupla' ? Math.min(i + 1, NEED - 1) + st.pd : i + 1}/${NEED})`, 'good');
    G.dnSeen = st.dn.length; sndGood();
  }
}
function onPhase(st) {
  show('#brief', false); show('#reveal', false); show('#lobby', false);
  if (st.ph === 'brief') { renderBrief(st); show('#brief', true); show('#hud', false); }
  if (st.ph === 'play') { show('#hud', true); renderRoleCard(st); setupControls(); G.tagT = 9; }
  if (st.ph === 'reveal') {
    const fired = snip.firedAt && performance.now() - snip.firedAt < 4000;
    if (st.sh && !fired) { sndShot(); const f = $('#flash'); f.style.opacity = '0.35'; setTimeout(() => f.style.opacity = '0', 90); }
    // the shooter stays behind the scope for a moment to see the shot land before the reveal
    if (st.sh && G.role === 's' && snip.scoped) {
      const sd = st.sd; snip.killcam = true; show('#hud', false);
      // the verdict lands in the scope a beat after the shot, before the reveal says the rest
      const hit = st.why === 'agent', v = $('#scopeVerdict');
      setTimeout(() => { if (G.seed !== sd || !snip.killcam) return; v.className = hit ? 'hit' : 'miss'; v.textContent = hit ? 'Alvo abatido' : st.why === 'acc' ? 'Errou · era cúmplice' : 'Errou · era um convidado'; v.hidden = false; (hit ? sndHit : sndMiss)(); }, 650);
      setTimeout(() => { snip.killcam = false; if (G.seed !== sd || G.screen !== 'game') return; const s2 = currentState(); setScope(false); if (s2 && s2.ph === 'reveal') { renderReveal(s2); show('#reveal', true); } }, 1800);
      return;
    }
    setScope(false); show('#hud', false); renderReveal(st); show('#reveal', true);
  }
}

// ---------------------------------------------------------------- drawn round rules (see RULES)
function progOf(st) { return st.ru === 'dupla' ? Math.min(st.dn.length, NEED - 1) + (st.pd || 0) : st.dn.length; }
// how dark the lights-out is now, 0..1 (a flicker going down and coming back)
function blackoutAt(st) {
  if (!st || st.ru !== 'apagao' || st.ap < 0 || st.ph !== 'play' || st.ot) return 0;
  const e = (st.rt || ROUND_T) - st.tl - st.ap; if (e < 0 || e > BLACKOUT_T + 1) return 0;
  if (e < 0.6) return [0, 1, 0.2, 1][Math.floor(e / 0.15)] ?? 1; // the lights stutter before they go
  return e < BLACKOUT_T ? 1 : 1 - (e - BLACKOUT_T);
}
// what each side hears when a rule does something: the lights fail, a first shot misses, the agent makes contact
function stepRuleEvents(st) {
  if (G.screen !== 'game' || st.ph !== 'play' || !st.ru) return;
  const k = G.seed + ':' + st.rd;
  if (blackoutAt(st) > 0.5 && G.ruleSeen !== k + 'ap') { G.ruleSeen = k + 'ap'; tone(70, 0.4, 0.06, 'square'); toast(G.role === 's' ? 'Apagão! Você não enxerga quase nada por 10 s.' : 'Apagão! As luzes caíram por 10 s. Aproveite.', 'bad'); }
  if (st.sh1 && G.sh1Seen !== k) {
    G.sh1Seen = k; const o = outfitFor(st.sd, st.sh1.e, st);
    if (G.role === 's') {
      snip.shotSent = false; toast(`Errou: era ${st.sh1.why === 'acc' ? 'um cúmplice' : 'um convidado'}. Resta 1 bala.`, 'bad');
      // the same in-scope verdict as a last shot, a beat after the trigger, then it clears so the second bullet has a clean view
      const v = $('#scopeVerdict'), wait = Math.max(0, 650 - (performance.now() - (snip.firedAt || 0)));
      setTimeout(() => { if (G.sh1Seen !== k || snip.shotSent) return; v.className = 'miss'; v.textContent = st.sh1.why === 'acc' ? 'Errou · era cúmplice · resta 1 bala' : 'Errou · era um convidado · resta 1 bala'; v.hidden = !snip.scoped; sndMiss(); setTimeout(() => { if (v.classList.contains('miss') && !snip.shotSent) v.hidden = true; }, 1500); }, wait);
      const b = $('#bulletsN'); if (b) b.parentElement.innerHTML = `${esc(RULES[st.ru].nome)} · <b id="bulletsN">1</b> bala`; }
    else { if (!(snip.firedAt && performance.now() - snip.firedAt < 4000)) sndShot(); toast(`Um tiro! Caiu quem estava de ${o.name}. O sniper ainda tem 1 bala.`, 'bad'); }
  }
  if (st.pd && G.pdSeen !== k) {
    G.pdSeen = k;
    if (G.role === 's') toast('📻 Rádio: o agente fez contato com alguém.', 'bad');
    else if (G.role === 'a') { toast(`Contato feito (${progOf(st)}/${NEED})`, 'good'); sndGood(); const n = $('#pairNote'); if (n) { n.textContent = '✓ contato feito'; n.className = 'muted'; } const c = $('#dnCount'); if (c) c.textContent = progOf(st); }
  }
}
function roleTitle(r) { return r === 's' ? 'Você é o sniper' : r === 'a' ? 'Você é o agente infiltrado' : r === 'c' ? 'Você é cúmplice' : 'Você está assistindo'; }
function renderBrief(st) {
  const r = G.role; let body = '';
  const nGuests = st.ents.length - 2 - (st.sx || []).length - Object.keys(st.pm || {}).length, lvTxt = LV_N === 1 ? 'num único terraço' : `por ${LV_N} andares`;
  const whereTxt = SCEN.id ? `<p class="muted"><b>${esc(SCEN.sc.nome)}</b> · ${esc(SCEN.sc.lugar)}. Você está ${esc(SCEN.sc.sniper.desc || 'no prédio em frente')}.</p>` : '';
  if (r === 's') body = `${whereTxt}<p>De onde está, observe a festa. Os jogadores estão misturados a ${nGuests} convidados comuns espalhados ${lvTxt} e ninguém tem nome sobre a cabeça.</p><p class="muted">O agente precisa cumprir 4 missões. Procure gestos estranhos e objetos que mudam de lugar. O rádio avisa onde algo mudou; enquadre o lugar com zoom para descobrir o quê. Você tem um único tiro. Se o tempo acabar, você vence; com o agente a uma missão, há ${OT_T} s de prorrogação.</p>`;
  else if (r === 'a') body = `${whereTxt}<p>Cumpra 4 destas missões antes que o sniper descubra você:</p><ol>${st.ms.map(o => `<li>${esc(MISSIONS[o].label)} <span class="fl">${esc(floorTag(MISSIONS[o].lv))}</span>${st.ts && st.ts[0] === o ? `<br><small class="muted">↳ antes, pegue a encomenda: ${esc(PROPS[st.ts[1]].where)}</small>` : ''}</li>`).join('')}</ol><p class="muted">Ande como os outros convidados. O laser vermelho mostra para onde o sniper está olhando.</p>`;
  else if (r === 'c') body = `<p>Você não sabe quem é o agente. Seu trabalho é parecer suspeito na hora certa: faça missões falsas nos mesmos objetos para atrair a mira.</p><p class="muted">Você ganha pontos de isca com o laser em você e quando entra no caderno do sniper. Uma vez por rodada, arme o despiste: sua próxima missão falsa faz o rádio do sniper ouvir algo mudar. ${st.ru === 'duas' ? 'Se o sniper gastar o último tiro em você, os convidados vencem. Errar o primeiro tiro derruba alguém e o jogo segue.' : 'Se o sniper atirar em você, os convidados vencem.'} Se o tempo acabar antes das 4 missões, o sniper vence.</p>`;
  else body = `<p>A rodada já começou. Você entra na próxima.</p>`;
  if (st.ru === 'duas') body = body.replace('Você tem um único tiro.', 'Você tem duas balas.');
  const ru = RULES[st.ru], rule = ru ? `<p class="ruleTag"><b>Regra da rodada: ${esc(ru.nome)}.</b> ${esc(ru.txt)}</p>` : '';
  $('#brief').innerHTML = `<div class="eyebrow">Rodada ${st.rd} · começa em instantes</div><h2>${roleTitle(r)}</h2>${rule}${body}`;
}
function missionsByLevel() {
  return `<p class="muted">${MISSIONS.length} missões possíveis em ${PROPS.length} objetos. Cada rodada sorteia ${MS_N}.</p><ul>` + LEVELS.map((L, lv) => { const ps = PROPS.filter(p => p.lv === lv); const n = ps.reduce((a, p) => a + p.ms.length, 0); return ps.length ? `<li><b>${SCEN.id ? L.name[0].toUpperCase() + L.name.slice(1) : lv === 0 ? 'Festa' : lv === 1 ? 'Terraço' : L.name[0].toUpperCase() + L.name.slice(1) + ' (' + lv + 'º)'}</b> <small>· ${n} missões em ${ps.length} objetos: ${ps.slice(0, 7).map(p => esc(p.where.replace(/^[^,]*\(\dº\),\s*/, '').replace(/^terraço,\s*/, ''))).join(' · ')}${ps.length > 7 ? ' …' : ''}</small></li>` : ''; }).join('') + '</ul>';
}
// the floor of a mission, short, as a tag next to it ("Festa", "Cassino 4º", "Convés")
function floorTag(lv) { const L = LEVELS[lv]; if (!L || LV_N === 1) return ''; /* one floor only: the same tag on every line is noise */ if (SCEN.id) return L.name[0].toUpperCase() + L.name.slice(1); return lv === 0 ? 'Festa' : lv === 1 ? 'Terraço' : L.name[0].toUpperCase() + L.name.slice(1) + ' ' + lv + 'º'; }
function missionLi(o, st) { const M = MISSIONS[o]; return `<li data-o="${o}" title="${esc(M.where)}">${esc(M.label)} <span class="fl">${esc(floorTag(M.lv))}</span>${st.ts && st.ts[0] === o ? `<br><small id="tsNote">${fetchNote(st)}</small>` : ''}</li>`; }
function fetchNote(st) { return st.tg ? '✓ encomenda na mão' : '↳ antes, pegue a encomenda: ' + esc(PROPS[st.ts[1]].where); }
function renderRoleCard(st) {
  hudMissionKey = ''; hudProgressKey = '';
  // The sniper's compact phone notebook must not carry over to the agent's mission list on a role change.
  if (G.role !== 's' && $('#roleCard').classList.contains('sniper')) $('#roleCard').classList.remove('min');
  const r = G.role; let h = `<div class="eyebrow">${r === 's' ? 'Sniper' : r === 'a' ? 'Agente infiltrado' : r === 'c' ? 'Cúmplice' : 'Espectador'}</div>`;
  if (r === 'a') h += `<h2><span id="dnCount">${progOf(st)}</span>/${NEED} missões</h2>${st.ru === 'dupla' ? `<p id="pairNote" class="${st.pd ? 'muted' : ''}">${st.pd ? '✓ contato feito' : `Encoste num cúmplice (anel dourado) por ${PAIR_T} s; vale uma missão`}</p>` : ''}<ol id="msList">${st.ms.map(o => missionLi(o, st)).join('')}</ol>`;
  else if (r === 'c') h += `<h2>Atraia a mira</h2><p class="muted">Faça missões falsas em qualquer objeto marcado no chão, em qualquer andar. ${matchMedia('(pointer:coarse)').matches ? '' : '<kbd>G</kbd> arma o despiste.'}</p><div id="lure"></div><details><summary class="muted">Missões possíveis, por andar</summary>${missionsByLevel()}</details>`;
  else if (r === 's') h += `<h2>Encontre o agente</h2>${st.ru ? `<p class="muted" id="ruleNote">${esc(RULES[st.ru].nome)}${st.ru === 'duas' ? ` · <b id="bulletsN">${st.bl}</b> ${st.bl === 1 ? 'bala' : 'balas'}` : ''}</p>` : ''}<div id="notebook"><div class="eyebrow">Caderno de suspeitos</div><ul id="suspectList"></ul><div class="eyebrow">Rádio · o que mudou na festa</div><ul id="radioLog"></ul></div><details><summary class="muted">Missões possíveis, por andar</summary>${missionsByLevel()}</details>`;
  else h += `<p class="muted">Você entra na próxima rodada.</p>`;
  $('#roleCard').innerHTML = h; $('#roleCard').classList.toggle('play', r === 'a' || r === 'c');
  $('#roleCard').classList.toggle('sniper', r === 's');
  if (r === 's' && PHONE_UP.matches) $('#roleCard').classList.add('min');
  G.lureKey = ''; $('#lureBtn').hidden = true;
}
function setupControls() {
  const touch = matchMedia('(pointer:coarse)').matches;
  const s = G.role === 's';
  $('#hints').innerHTML = s
    ? '<kbd>Botão direito</kbd> ou <kbd>Espaço</kbd> luneta · <kbd>Roda</kbd> zoom · <kbd>Shift</kbd> prender a respiração · <kbd>F</kbd> anotar suspeito · <kbd>Clique</kbd> atirar'
    : G.role ? (touch ? 'Toque no chão para andar · toque num objeto, assento ou escada para usar · dois dedos para zoom' : `<kbd>WASD</kbd> ou clique para andar · <kbd>E</kbd> ${LV_N === 1 ? 'interagir, sentar, dançar, conversar' : SCEN.id ? 'interagir, sentar, dançar, subir escadas' : 'interagir, sentar, dançar, subir pelas escadas em caracol'} · <kbd>Roda</kbd> zoom`) : 'Assistindo a rodada';
  $('#scopeBtn').hidden = !(s && touch); $('#zoomBtn').hidden = !(s && touch); $('#markBtn').hidden = !(s && touch); $('#shootBtn').hidden = !(s && touch); $('#breathBtn').hidden = !(s && touch);
  $('#actBtn').hidden = true;
}
function renderReveal(st) {
  const sniperWon = st.w === 's';
  const mine = G.role ? ((G.role === 's') === sniperWon) : null;
  $('#revealEyebrow').textContent = mine === null ? 'Fim da rodada' : mine ? 'Vitória' : 'Derrota';
  $('#revealTitle').textContent = sniperWon ? 'O sniper venceu' : 'Os convidados venceram';
  $('#revealTitle').className = mine ? 'win' : '';
  $('#revealWhy').textContent = WHY[st.why] || '';
  const ag = st.ag;
  let agentName = '';
  for (const [peer, id] of Object.entries(st.pm || {})) if (id === ag) agentName = st.nm[peer];
  const desc = ag >= 0 ? outfitFor(st.sd, ag, st).name : '';
  const shotTxt = st.sh && st.why !== 'agent' && st.ents.find(e => e.id === st.sh.e) ? ` O tiro acertou ${st.why === 'acc' ? 'um cúmplice' : 'um convidado'} de ${outfitFor(st.sd, st.sh.e, st).name}, marcado com o anel vermelho.` : '';
  $('#revealAgent').textContent = ag >= 0 ? `O agente ${agentName ? 'era ' + agentName + ' e ' : ''}estava de ${desc}. Cumpriu ${progOf(st)} de ${NEED} missões.${shotTxt}` : '';
  const sc = $('#scores'); sc.innerHTML = '';
  if (G.multi) for (const [peer, n] of Object.entries(st.nm || {})) { const li = document.createElement('li'); const a = document.createElement('span'); a.textContent = n + (st.rl[peer] === 's' ? ' · sniper' : st.pm[peer] === ag ? ' · agente' : ' · cúmplice'); const b = document.createElement('span'); const lp = st.rl[peer] === 'c' ? lurePts((st.lu || {})[st.pm[peer]]) : 0; b.textContent = (st.sc[peer] || 0) + ' pts' + (lp ? ` (+${lp} de isca)` : ''); li.append(a, b); sc.appendChild(li); }
  $('#btnNext').hidden = G.multi && !G.isHost;
  $('#btnNext').textContent = G.multi ? 'Próxima rodada' : 'Jogar de novo';
  $('#btnMenu').textContent = G.multi && G.isHost ? 'Voltar à sala' : 'Voltar ao menu';
  if (G.multi && !G.isHost) $('#btnMenu').textContent = 'Sair da sala';
  G.scores = Object.assign(G.scores, st.sc || {});
  renderMoments(st);
  renderReplay(st);
  renderPodium(st);
}
// ---------------------------------------------------------------- replay: the agent's path seen from above
// floors as plates (each floor its own shade), the path coloured by floor, a red dot where the laser landed on the agent,
// gold where a real mission was done, the shot as an X.
function renderReplay(st) {
  let box = $('#replay'); if (!box) { box = document.createElement('div'); box.id = 'replay'; box.innerHTML = '<div class="eyebrow">O trajeto do agente</div><canvas width="824" height="340"></canvas><p class="note"></p>'; $('#revealAgent').after(box); }
  const tr = st.tr || []; box.hidden = st.ag < 0 || tr.length < 6;
  if (box.hidden) return;
  const cv = box.querySelector('canvas'), g = cv.getContext('2d'), W = cv.width, H = cv.height;
  // frame what the agent went through (path, missions, the shot) with some room around, not the whole map; a tall frame turns sideways
  const pts = []; for (let i = 0; i < tr.length; i += 3) pts.push([tr[i] / 10, tr[i + 1] / 10]);
  for (const r of (st.lg || []).filter(r => r[1] === st.ag && r[3] === 1)) { const m = MISSIONS[r[2]]; if (m) pts.push(PROPS[m.p].s); }
  const se = st.sh ? st.ents.find(e => e.id === st.sh.e) : null; if (se) pts.push([se.x, se.z]);
  let x0 = Math.min(...pts.map(q => q[0])) - 3, x1 = Math.max(...pts.map(q => q[0])) + 3, z0 = Math.min(...pts.map(q => q[1])) - 3, z1 = Math.max(...pts.map(q => q[1])) + 3;
  const side = z1 - z0 > (x1 - x0) * 1.2, U = side ? [z0, z1, x0, x1] : [x0, x1, z0, z1];
  if (U[1] - U[0] < 14) { const c = (U[0] + U[1]) / 2; U[0] = c - 7; U[1] = c + 7; }
  if (U[3] - U[2] < 8) { const c = (U[2] + U[3]) / 2; U[2] = c - 4; U[3] = c + 4; }
  const k = Math.min((W - 24) / (U[1] - U[0]), (H - 24) / (U[3] - U[2])), ou = (W - (U[1] - U[0]) * k) / 2, ov = (H - (U[3] - U[2]) * k) / 2;
  const P = (x, z) => side ? [ou + (z - U[0]) * k, ov + (U[3] - x) * k] : [ou + (x - U[0]) * k, ov + (z - U[2]) * k];
  const LVC = ['#6f7a8c', '#8a7a5c', '#5c7f8a', '#7c6a8a', '#6a8a6c', '#8a6a6a', '#8a8a5c'];
  const lvCol = lv => LVC[lv % LVC.length];
  g.clearRect(0, 0, W, H);
  LEVELS.forEach((L, i) => { const [a, b] = P(L.x0, L.z0), [c, d] = P(L.x1, L.z1), l = Math.min(a, c), t = Math.min(b, d); g.fillStyle = lvCol(i) + '33'; g.strokeStyle = lvCol(i) + '99'; g.lineWidth = 2; g.fillRect(l, t, Math.abs(c - a), Math.abs(d - b)); g.strokeRect(l, t, Math.abs(c - a), Math.abs(d - b)); });
  // the path, a segment at a time, in the colour of its floor
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (let i = 3; i < tr.length; i += 3) {
    const [a, b] = P(tr[i - 3] / 10, tr[i - 2] / 10), [c, d] = P(tr[i] / 10, tr[i + 1] / 10);
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 9; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke();
    g.strokeStyle = tr[i + 2] === tr[i - 1] ? '#f3ecdc' : '#d9a441'; g.lineWidth = 5; g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke();
  }
  const dot = (x, z, r, fill, line) => { const [a, b] = P(x, z); g.beginPath(); g.arc(a, b, r, 0, Math.PI * 2); g.fillStyle = fill; g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = 3; g.stroke(); } };
  dot(tr[0] / 10, tr[1] / 10, 8, '#f3ecdc', '#0c0f14');
  for (const [, , o, real] of (st.lg || []).filter(r => r[1] === st.ag && r[3] === 1)) { const m = MISSIONS[o]; if (m) { const pp = PROPS[m.p]; dot(pp.s[0], pp.s[1], 11, '#d9a441', '#0c0f14'); } }
  for (const [, x, z] of st.lp || []) dot(x / 10, z / 10, 7, '#ff4134');
  const last = tr.length - 3, [ex, ez] = P(tr[last] / 10, tr[last + 1] / 10);
  const ae = st.ents.find(e => e.id === st.ag), [fx, fz] = ae ? P(ae.x, ae.z) : [ex, ez];
  g.strokeStyle = '#d9a441'; g.lineWidth = 4; g.beginPath(); g.arc(fx, fz, 13, 0, Math.PI * 2); g.stroke();
  if (se) { { const [a, b] = P(se.x, se.z); g.strokeStyle = '#ff4134'; g.lineWidth = 5; g.beginPath(); g.moveTo(a - 10, b - 10); g.lineTo(a + 10, b + 10); g.moveTo(a + 10, b - 10); g.lineTo(a - 10, b + 10); g.stroke(); } }
  let dist = 0; for (let i = 3; i < tr.length; i += 3) dist += Math.hypot(tr[i] - tr[i - 3], tr[i + 1] - tr[i - 2]) / 10;
  const n = (st.lp || []).length, floors = new Set(); for (let i = 2; i < tr.length; i += 3) floors.add(tr[i]);
  box.querySelector('.note').innerHTML = `<b>${n === 0 ? 'O laser nunca pousou nele.' : n === 1 ? 'O laser passou por ele 1 vez.' : `O laser passou por ele ${n} vezes.`}</b> Andou ${Math.round(dist)} m${floors.size > 1 ? ` por ${floors.size} andares` : ''}. <span class="lg"><i class="d s"></i>começo <i class="d g"></i>missão <i class="d r"></i>laser nele${st.sh ? ' <i class="x">✕</i>tiro' : ''}</span>`;
}
// ---------------------------------------------------------------- podium: every 5 rounds with friends, the night so far
const SESSION_N = 5;
const SESS = { seen: new Set(), p: {} };
function sessAdd(st) {
  const key = st.sd + ':' + st.rd; if (SESS.seen.has(key)) return; SESS.seen.add(key);
  for (const [peer, name] of Object.entries(st.nm || {})) {
    const q = SESS.p[peer] = SESS.p[peer] || { name, eye: 0, ghost: 0, ms: 0, bait: 0, rounds: 0 };
    q.name = name; q.rounds++;
    const r = st.rl[peer], ag = st.pm[peer] === st.ag;
    if (r === 's' && st.why === 'agent') q.eye++;
    if (ag) { q.ms += progOf(st); if (st.w === 'g') q.ghost++; }
    if (r !== 's' && !ag) { q.bait += lurePts((st.lu || {})[st.pm[peer]]) + (st.sh && st.pm[peer] === st.sh.e ? 3 : 0); }
  }
}
function renderPodium(st) {
  let box = $('#podium'); if (!box) { box = document.createElement('div'); box.id = 'podium'; $('#scores').after(box); }
  if (!G.multi) { box.hidden = true; return; }
  sessAdd(st);
  const due = st.rd % SESSION_N === 0;
  $('#revealEyebrow').textContent += (st.ru && RULES[st.ru] ? ' · ' + RULES[st.ru].nome : '') + (due ? ' · fim da noite' : ` · rodada ${((st.rd - 1) % SESSION_N) + 1} de ${SESSION_N}`);
  box.hidden = !due; if (!due) return;
  const ps = Object.entries(SESS.p).map(([peer, q]) => Object.assign({ peer, pts: (st.sc || {})[peer] || 0 }, q)).sort((a, b) => b.pts - a.pts);
  const best = (f, min) => { let w = null; for (const q of ps) if (f(q) >= min && (!w || f(q) > f(w))) w = q; return w; };
  const titles = new Map(), give = (q, t) => { if (q && !titles.has(q.peer)) titles.set(q.peer, t); };
  give(best(q => q.eye, 1), 'Olho de águia'); give(best(q => q.ghost * 10 + q.ms, 1), 'Fantasma'); give(best(q => q.bait, 1), 'Melhor isca');
  const medal = ['🥇', '🥈', '🥉'];
  box.innerHTML = `<div class="eyebrow">Pódio da noite</div><ol>${ps.slice(0, 3).map((q, i) => `<li><span class="m">${medal[i]}</span><b>${esc(q.name)}</b> <span class="pts">${q.pts} pts</span>${titles.has(q.peer) ? `<small>${titles.get(q.peer)}</small>` : ''}</li>`).join('')}</ol>` +
    (ps.length > 3 ? `<p class="note">${ps.slice(3).filter(q => titles.has(q.peer)).map(q => `${esc(q.name)}: ${titles.get(q.peer)}`).join(' · ')}</p>` : '');
}
// "repeat the moments each human acted": a timeline of the round, every mission real or fake, then the shot
function renderMoments(st) {
  let box = $('#moments'); if (!box) { box = document.createElement('div'); box.id = 'moments'; $('#scores').before(box); }
  const who = id => { for (const [peer, eid] of Object.entries(st.pm || {})) if (eid === id) return (st.nm || {})[peer] || 'Jogador'; return id === st.ag ? 'Robô agente' : 'Robô cúmplice'; };
  const rows = (st.lg || []).map(([t, id, o, real]) => { const m = MISSIONS[o]; if (!m) return ''; return `<li><b>${fmt(t)}</b> ${esc(who(id))} · ${real === 2 ? 'pegou a encomenda' : real === 3 ? 'despiste' : real ? 'missão real' : 'missão falsa'}${real === 2 ? '' : ': ' + esc(m.label.toLowerCase())} <small>${esc(m.where)}</small></li>`; });
  if (st.sh1) { const o = outfitFor(st.sd, st.sh1.e, st); rows.push(`<li class="shot"><b>${fmt(st.sh1.t)}</b> Primeiro tiro, errado, em quem estava de ${esc(o.name)}</li>`); }
  if (st.sh && st.sh.t !== undefined) { const o = outfitFor(st.sd, st.sh.e, st); rows.push(`<li class="shot"><b>${fmt(st.sh.t)}</b> Tiro em quem estava de ${esc(o.name)}</li>`); }
  box.innerHTML = rows.length ? `<div class="eyebrow">Momentos da rodada</div><ol>${rows.join('')}</ol>` : '';
  box.hidden = !rows.length;
}

// ---------------------------------------------------------------- input
const keyDown = new Set();
addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') { if (e.key === 'Enter' && e.target.id === 'codeIn') joinRoom(); else if (e.key === 'Enter' && e.target.id === 'nome' && inviteCode && !$('#btnInvite').hidden) enterRoom(inviteCode, false); return; }
  const k = e.key.toLowerCase(); keyDown.add(k);
  if (G.screen !== 'game') return;
  if (G.role === 's') {
    if (k === ' ') { e.preventDefault(); setScope(!snip.scoped); }
    if (k === 'f') markUnderCrosshair();
    if (k === 'shift' && !e.repeat && snip.gasp <= 0 && snip.air > 0.15) snip.hold = true;
    if (k === 'escape') setScope(false);
  } else if (ctrl.act && challengeKey(k)) e.preventDefault();
  else if (k === 'e') tryAct();
  else if (k === 'g') toggleLure();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
});
addEventListener('keyup', e => { keyDown.delete(e.key.toLowerCase()); if (e.key === 'Shift') snip.hold = false; });
addEventListener('blur', () => keyDown.clear());
canvas.addEventListener('contextmenu', e => e.preventDefault());
const ray = new T.Raycaster(); const ndc = new T.Vector2();
// fingers on the canvas (sniper, touch): one drags the scope, two pinch the zoom, a short tap on the open view aims there
const TOUCHES = new Map(); let pinch = null, tapAt = null;
const pinchDist = () => { const [a, b] = [...TOUCHES.values()]; return Math.hypot(a.x - b.x, a.y - b.y) || 1; };
canvas.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse') { TOUCHES.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (TOUCHES.size === 2) pinch = { d: pinchDist(), z: snip.zoom, iz: isoState.zoom }; tapAt = TOUCHES.size === 1 ? { x: e.clientX, y: e.clientY, t: performance.now() } : null; }
  canvas.focus(); audio();
  const st = currentState(); if (G.screen !== 'game' || !st) return;
  snip.lastPX = e.clientX; snip.lastPY = e.clientY;
  if (G.role === 's' && st.ph === 'play') {
    if (e.button === 2) { setScope(!snip.scoped); return; }
    if (e.pointerType !== 'mouse') return;
    if (!snip.scoped) { aimFromPointer(e.clientX, e.clientY); setScope(true); } else shoot();
    return;
  }
  if (G.role && G.role !== 's' && st.ph === 'play' && e.button === 0) {
    // a second finger is a pinch, not a second walk: drop the walk the first finger just asked for
    if (e.pointerType !== 'mouse' && TOUCHES.size > 1) { ctrl.path = []; ctrl.goal = null; return; }
    const target = pickGuestTarget(e.clientX, e.clientY, st);
    if (target && !ctrl.lk) {
      let tx = target.x, tz = target.z; const tlv = target.lv;
      if (ctrl.act) cancelAct(); ctrl.pose = null; ctrl.settle = null; ctrl.detours = 0; ctrl.stuck = 0; ctrl.lastD = 1e9; ctrl.tlv = tlv;
      // clicking on a seat, the bar, a stair or a mission object walks there and uses it on arrival
      const it = target.it;
      if (it) { tx = it.x; tz = it.z; ctrl.goal = it; } else { ctrl.goal = null; [tx, tz] = navFree(tx, tz, tlv); }
      ctrl.path = route(ctrl.x, ctrl.z, ctrl.lv, tx, tz, tlv);
      clickRipple(tx, tz, LVY(tlv), !!it);
    }
  }
});
const touchUp = e => {
  if (e.pointerType === 'mouse' || !TOUCHES.delete(e.pointerId)) return;
  if (TOUCHES.size < 2) pinch = null;
  if (TOUCHES.size === 1) { const p = [...TOUCHES.values()][0]; snip.lastPX = p.x; snip.lastPY = p.y; } // the finger left behind keeps dragging from where it is
  const st = currentState();
  if (e.type === 'pointerup' && tapAt && G.screen === 'game' && G.role === 's' && st && st.ph === 'play' && !snip.scoped && Math.hypot(e.clientX - tapAt.x, e.clientY - tapAt.y) < 12 && performance.now() - tapAt.t < 700) { aimFromPointer(e.clientX, e.clientY); setScope(true); }
  tapAt = null;
};
canvas.addEventListener('pointerup', touchUp); canvas.addEventListener('pointercancel', touchUp);
canvas.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' && TOUCHES.has(e.pointerId)) {
    TOUCHES.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch) { // two fingers: zoom with the spread, no aiming
      if (G.role === 's' && snip.scoped) { const z = Math.max(3, Math.min(10, Math.round(pinch.z * pinchDist() / pinch.d))); if (z !== snip.zoom) { snip.zoom = z; $('#zoomTag').textContent = z + '×'; sndZoom(); } }
      else if (G.role !== 's') isoState.zoom = Math.max(5, Math.min(16, pinch.iz * pinch.d / pinchDist())); // the party view: spread to come closer
      return;
    }
    if (!e.isPrimary && TOUCHES.size > 1) return;
  }
  if (G.screen !== 'game' || G.role !== 's') return;
  if (!snip.scoped) { if (e.pointerType === 'mouse') aimFromPointer(e.clientX, e.clientY); }
  else {
    const dx = (snip.lastPX == null ? 0 : e.clientX - snip.lastPX), dy = (snip.lastPY == null ? 0 : e.clientY - snip.lastPY);
    const mx = document.pointerLockElement ? e.movementX : dx, my = document.pointerLockElement ? e.movementY : dy;
    const k = T.MathUtils.degToRad(scopeCam.fov) / innerHeight * (e.pointerType === 'mouse' ? 1 : -1);
    snip.yaw += mx * k; snip.pitch -= my * k; clampAim();
  }
  snip.lastPX = e.clientX; snip.lastPY = e.clientY;
});
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  if (G.role === 's' && snip.scoped) { snip.zoom = Math.max(3, Math.min(10, snip.zoom + (e.deltaY < 0 ? 1 : -1))); $('#zoomTag').textContent = snip.zoom + '×'; sndZoom(); }
  else { isoState.zoom = Math.max(5, Math.min(16, isoState.zoom * (e.deltaY > 0 ? 1.1 : 0.9))); }
}, { passive: false });
$('#scopeBtn').onclick = () => setScope(!snip.scoped);
$('#zoomBtn').onclick = () => { snip.zoom = snip.zoom >= 10 ? 4 : snip.zoom + 2; $('#zoomTag').textContent = snip.zoom + '×'; sndZoom(); };
$('#markBtn').onclick = () => markUnderCrosshair();
{ const bb = $('#breathBtn'); const on = () => { if (snip.gasp <= 0 && snip.air > 0.15) snip.hold = true; }; const off = () => { snip.hold = false; }; bb.addEventListener('pointerdown', on); bb.addEventListener('pointerup', off); bb.addEventListener('pointercancel', off); bb.addEventListener('pointerleave', off); }
$('#shootBtn').onclick = () => { if (!snip.scoped) setScope(true); else shoot(); };
// the mission card folds down to its title with a tap (on a phone it would otherwise cover part of the party)
$('#roleCard').addEventListener('click', e => { if (e.target.closest('details,summary,a,button')) return; $('#roleCard').classList.toggle('min'); });
$('#actBtn').onclick = () => { if (!(ctrl.act && challengeKey('e'))) tryAct(); };
$('#lureBtn').onclick = () => toggleLure();

function clampAim() { snip.yaw = Math.max(-0.75, Math.min(0.75, snip.yaw)); snip.pitch = Math.max(-1.0, Math.min(0.25, snip.pitch)); }
function aimFromPointer(px, py) {
  ndc.set(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, wide);
  const d = ray.ray.direction; snip.yaw = Math.atan2(d.x, -d.z); snip.pitch = Math.asin(d.y); clampAim();
}
function setScope(on) {
  if (on && (G.role !== 's' || G.screen !== 'game')) on = false;
  if (snip.scoped === on) return;
  snip.scoped = on; show('#scope', on); if (!on) $('#scopeVerdict').hidden = true; $('#zoomTag').textContent = snip.zoom + '×'; document.body.classList.toggle('scoped', on);
  // coming up to the eye: the ring closes in and the image settles from half the zoom (see updateSniper)
  if (on) { const sc = $('#scope'); sc.classList.remove('opening'); void sc.offsetWidth; sc.classList.add('opening'); snip.zoomCur = Math.max(1.5, snip.zoom * 0.45); }
  if (G.screen === 'game') (on ? sndScopeIn : sndScopeOut)();
  if (on) { try { const r = canvas.requestPointerLock && matchMedia('(pointer:fine)').matches ? canvas.requestPointerLock() : null; if (r && r.catch) r.catch(() => { }); } catch (e) { } }
  else if (document.pointerLockElement) try { document.exitPointerLock(); } catch (e) { }
}
const occTargets = () => SCEN.id ? CHARS.concat(SCEN.occ || []) : CHARS.concat(OCCLUDERS);
function crosshairHit() {
  ndc.set(0, 0); ray.setFromCamera(ndc, scopeCam);
  const h = ray.intersectObjects(occTargets(), true)[0];
  if (!h) return null;
  if (h.object.userData.eid !== undefined) return { eid: h.object.userData.eid, point: h.point };
  return { eid: -1, point: h.point, blocked: true };
}
function markUnderCrosshair() {
  const st = currentState(); if (!snip.scoped || !st || st.ph !== 'play') return;
  const h = crosshairHit();
  if (!h || h.eid < 0) { toast(h && h.blocked ? 'Algo está na frente.' : 'Ninguém na mira.'); return; }
  const i = snip.marks.indexOf(h.eid);
  if (i >= 0) snip.marks.splice(i, 1); else { snip.marks.push(h.eid); if (snip.marks.length > 3) snip.marks.shift(); }
  sndScope();
  { const o = outfitFor(st.sd, h.eid, st); toast(i >= 0 ? 'Anotação apagada: ' + o.name : 'Anotado no caderno: ' + o.name); }
  if (G.sim) G.sim.mk = snip.marks.slice(); else Net.set({ mk: snip.marks.slice() });
}
function shoot() {
  const st = currentState(); if (!st || st.ph !== 'play' || snip.shotSent) return;
  const h = crosshairHit();
  if (!h || h.eid < 0) { toast(h && h.blocked ? 'Tiro bloqueado: tem algo na frente.' : 'Ninguém na mira. O tiro não foi disparado.', 'bad'); return; }
  // with a second bullet the first one's body is still in the scene: a shot at it would be swallowed and lock the trigger
  if (st.ents.find(e => e.id === h.eid)?.anim === 5) { toast('Essa pessoa já caiu. A bala não foi gasta.', 'bad'); return; }
  $('#scopeVerdict').hidden = true;
  snip.shotSent = true; snip.kick = 1; NEST_FX.flashT = 0.09; NEST_FX.scare = 8; snip.firedAt = performance.now();
  { const r = NEST_FX.rifle; NEST_FX.case = { p: new T.Vector3(r.position.x + .13, r.position.y + .05, r.position.z + .04), v: new T.Vector3(), vx: 1.1 + Math.random() * 0.4, vy: 1.4, vz: 0.3 - Math.random() * 0.3, spin: 30, rx: 0, hits: 0 }; }
  sndShot(); sndEcho(); { const f = $('#flash'); f.style.opacity = '0.5'; setTimeout(() => f.style.opacity = '0', 70); }
  if (G.sim) G.sim.shoot(h.eid); else Net.set({ shot: { rd: st.rd, e: h.eid } });
}

// guest actions: missions, the stair, and the small things anyone can do (sit, lie down, play, dance, warm up, chat)
function nearestProp(x, z, lv) {
  let best = -1, bd = IR;
  PROPS.forEach((m, i) => { if (m.lv !== lv) return; const d = Math.hypot(x - m.s[0], z - m.s[1]); if (d < bd) { bd = d; best = i; } });
  return best;
}
// which act the local guest does at a prop: the agent's pending mission there, otherwise a decoy chosen per round
function missionAtProp(p, st) {
  // the delivery waits for the parcel: until then its object only offers a decoy
  if (G.role === 'a') { const o = st.ms.find(o => MISSIONS[o].p === p && !st.dn.includes(o) && !(st.ts && o === st.ts[0] && !st.tg)); if (o !== undefined) return o; }
  const ms = PROPS[p].ms, i = ((st.rd || 1) * 7 + p * 3) % ms.length;
  // the decoy must not be the delivery itself (it would look like the real one and then not count)
  return G.role === 'a' && st.ts && !st.tg && ms[i] === st.ts[0] && ms.length > 1 ? ms[(i + 1) % ms.length] : ms[i];
}
const FIRE_AT = [-10.2, -16.6];
// the agent fetching the parcel of the two-step mission
const isFetch = (p, st) => G.role === 'a' && !!st.ts && !st.tg && p === st.ts[1];
const FETCH_LABEL = 'Pegar a encomenda';
function nearInteraction(st) {
  const x = ctrl.x, z = ctrl.z, lv = ctrl.lv;
  const p = nearestProp(x, z, lv); if (p >= 0) { const o = missionAtProp(p, st); return { k: 'mission', o, label: isFetch(p, st) ? FETCH_LABEL : MISSIONS[o].label }; }
  const ns = nearStair(x, z, lv);
  if (ns) { const to = lv + ns.dir; return { k: 'stair', dir: ns.dir, li: ns.li, label: (ns.dir > 0 ? 'Subir para ' : 'Descer para ') + (SCEN.id ? LEVELS[to].name : to === 0 ? 'a festa' : to === 1 ? 'o terraço' : 'o ' + LEVELS[to].name + ' (' + to + 'º)') }; }
  let seat = null, sd = 1.3;
  for (const s of SLOTS) {
    if (s.lv !== lv || !SEAT_LABEL[s.type]) continue;
    const d = Math.hypot(x - s.x, z - s.z); if (d >= sd) continue;
    if (st.ents.some(e => e.id !== G.myEid && e.anim !== 5 && Math.abs((e.y || 0) - LVY(lv)) < 0.5 && Math.hypot(e.x - s.x, e.z - s.z) < 0.45)) continue;
    sd = d; seat = s;
  }
  if (seat) return { k: 'seat', slot: seat, anim: SEAT_ANIM[seat.type], label: SEAT_LABEL[seat.type] };
  if (!SCEN.id && lv === 1 && Math.hypot(x - FIRE_AT[0], z - FIRE_AT[1]) < 2.6) return { k: 'pose', anim: 10, rot: Math.atan2(FIRE_AT[0] - x, FIRE_AT[1] - z), label: 'Esquentar as mãos' };
  if ((!SCEN.id && lv === 0 && x > 1 && x < 8 && z > 1 && z < 7) || (SCEN.id && SLOTS.some(s => s.lv === lv && s.type === 'dance' && Math.hypot(s.x - x, s.z - z) < 1.3))) return { k: 'pose', anim: 3, label: 'Dançar' };
  if (!SCEN.id && ((lv === 0 && x > -11.2 && x < -3.9 && z > -6.5 && z < -4.6) || (lv === 1 && x > 7.4 && x < 10.6 && z > -12.7 && z < -11.0))) return { k: 'pose', anim: 6, dur: 3.2, rot: Math.PI, label: 'Pedir um drinque' };
  for (const b of BAR_ZONES) if (b.lv === lv && Math.hypot(x - b.x, z - b.z) < b.r) return { k: 'pose', anim: 6, dur: 3.2, rot: b.rot, label: b.label || 'Pedir um drinque' };
  let other = null, od = 1.5;
  for (const e of st.ents) { if (e.id === G.myEid || e.anim === 5 || Math.abs((e.y || 0) - LVY(lv)) > 0.5) continue; const d = Math.hypot(e.x - x, e.z - z); if (d < od) { od = d; other = e; } }
  if (other) return { k: 'pose', anim: 4, rot: Math.atan2(other.x - x, other.z - z), label: 'Conversar' };
  return null;
}
function startClimb(dir, li = 0, keepGoal = false) { ctrl.lk = { dir, s: dir > 0 ? 0 : 1, li }; ctrl.pose = null; ctrl.settle = null; if (!keepGoal) ctrl.goal = null; ctrl.stuck = 0; ctrl.lastD = 1e9; }
// what a click at (x, z) on level lv is aiming at: a free seat, a mission object, a stair end or the bar; null for plain floor
function interactAt(x, z, lv, st) {
  let best = null, bd = 1.0;
  for (const s of SLOTS) {
    if (s.lv !== lv || !SEAT_LABEL[s.type]) continue;
    const d = Math.hypot(x - s.x, z - s.z); if (d >= bd) continue;
    if (st.ents.some(e => e.id !== G.myEid && e.anim !== 5 && Math.abs((e.y || 0) - LVY(lv)) < 0.5 && Math.hypot(e.x - s.x, e.z - s.z) < 0.45)) continue;
    bd = d; best = { k: 'seat', x: s.x, z: s.z, label: SEAT_LABEL[s.type], dl: s.type === 'tub' ? 2.0 : 0.9 };
  }
  PROPS.forEach((m, i) => { if (m.lv !== lv) return; const d = Math.min(Math.hypot(x - m.l[0], z - m.l[1]), Math.hypot(x - m.s[0], z - m.s[1])); if (d < bd) { bd = d; best = { k: 'mission', x: m.s[0], z: m.s[1], label: isFetch(i, st) ? FETCH_LABEL : MISSIONS[missionAtProp(i, st)].label }; } });
  LINKS.forEach(L => {
    // A nearby stair must not steal a click aimed directly at a mission object or seat.
    if (L.lo === lv) { const d = Math.hypot(x - L.base[0], z - L.base[1]); if (d < (best ? bd : 1.6)) { bd = d; best = { k: 'stair', x: L.base[0], z: L.base[1], label: 'Subir' }; } }
    if (L.lo + 1 === lv) { const d = Math.hypot(x - L.top[0], z - L.top[1]); if (d < (best ? bd : 1.6)) { bd = d; best = { k: 'stair', x: L.top[0], z: L.top[1], label: 'Descer' }; } }
  });
  if (!best) {
    if (!SCEN.id && ((lv === 0 && x > -11.2 && x < -3.9 && z > -6.5 && z < -4.6) || (lv === 1 && x > 7.4 && x < 10.6 && z > -12.7 && z < -11.0))) best = { k: 'bar', x, z, label: 'Pedir um drinque' };
    for (const b of BAR_ZONES) if (b.lv === lv && Math.hypot(x - b.x, z - b.z) < b.r) best = { k: 'bar', x, z, label: b.label || 'Pedir um drinque' };
  }
  return best;
}
// A lamp, sign or painting is above the floor: projecting its pixel onto a floor plane moves the target behind it,
// sometimes even outside the map. Pick the visible solid surface first when it belongs to a mission object.
let propTargetCache = null;
function propTargets() {
  if (propTargetCache && propTargetCache.props === PROPS) return propTargetCache;
  const objects = new Map(), materials = new Map(), anchors = PROPS.map(() => []);
  const own = (map, key, pi) => { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(pi); };
  const visit = (fx, pi) => {
    if (Array.isArray(fx)) { fx.forEach(f => visit(f, pi)); return; } if (!fx) return;
    if (fx.h) for (const q of resolveH(fx.h)) {
      if (q.isMaterial) own(materials, q, pi);
      else if (q.isObject3D) q.traverse(o => { if (o.isMesh) own(objects, o, pi); });
    }
    if (fx.k === 'screen') own(materials, screenMat, pi);
    if (fx.k === 'spawn' && fx.at[1] > .15) anchors[pi].push([fx.at[0], LVY(PROPS[pi].lv) + fx.at[1], fx.at[2]]);
  };
  PROPS.forEach((P, pi) => P.acts.forEach(a => visit(a[1], pi)));
  return (propTargetCache = { props: PROPS, objects, materials, anchors });
}
function pickGuestTarget(px, py, st) {
  ndc.set(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1); ray.setFromCamera(ndc, iso);
  const shown = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const solid = (SCEN.id ? SCEN.occ || [] : OCCLUDERS).filter(o => shown(o) && !FLOORS.includes(o));
  const surface = ray.intersectObjects(solid, false)[0];
  if (surface) {
    // Assign a surface to the floor beneath it. A terrace floor must not select an object on the floor below.
    let lv = -1, y = -Infinity;
    LEVELS.forEach((L, i) => { const p = surface.point; if (L.y > y && L.y <= p.y + 0.08 && p.x >= L.x0 - 0.1 && p.x <= L.x1 + 0.1 && p.z >= L.z0 - 0.1 && p.z <= L.z1 + 0.1) { lv = i; y = L.y; } });
    const targets = propTargets(), owners = new Set(targets.objects.get(surface.object) || []);
    for (const mat of Array.isArray(surface.object.material) ? surface.object.material : [surface.object.material]) for (const i of targets.materials.get(mat) || []) owners.add(i);
    let pi = -1, best = Infinity;
    // Effects already name the actual mesh/material. Use that ownership for large objects and flat targets such as
    // the cinema screen, the red beanbag or a yoga mat, whose edges can be far from the object's look point.
    for (const i of owners) {
      const P = PROPS[i], d = Math.hypot(surface.point.x - P.l[0], surface.point.z - P.l[1]);
      if ((lv < 0 || P.lv === lv) && d < best) { best = d; pi = i; }
    }
    if (pi >= 0) best = -1;
    PROPS.forEach((P, i) => {
      const dy = surface.point.y - LVY(P.lv), radius = P.hitRadius || 1;
      let d = Math.hypot(surface.point.x - P.l[0], surface.point.z - P.l[1]) / radius;
      for (const a of targets.anchors[i]) if (Math.abs(a[1] - surface.point.y) < 1) d = Math.min(d, Math.hypot(surface.point.x - a[0], surface.point.z - a[2]));
      // Objects beyond a deck (the yacht's jet-ski, for example) can sit below its walking floor.
      if ((lv < 0 || P.lv === lv) && dy > (lv < 0 ? -3 : 0.15) && dy < SCENE_BOX.top && d < 1 && d < best) { best = d; pi = i; }
    });
    if (pi >= 0) {
      const P = PROPS[pi], o = missionAtProp(pi, st);
      return { x: P.s[0], z: P.s[1], lv: P.lv, it: { k: 'mission', x: P.s[0], z: P.s[1], label: isFetch(pi, st) ? FETCH_LABEL : MISSIONS[o].label } };
    }
  }
  const hit = ray.intersectObjects(FLOORS)[0]; if (!hit) return null;
  const x = hit.point.x, z = hit.point.z, lv = hit.object.userData.lv || 0;
  return { x, z, lv, it: interactAt(x, z, lv, st) };
}
function tryAct() {
  const st = currentState(); if (!st || st.ph !== 'play' || !G.role || G.role === 's' || ctrl.act || ctrl.lk) return;
  if (ctrl.pose) { ctrl.pose = null; ctrl.settle = null; return; }
  const it = nearInteraction(st); if (!it) return;
  ctrl.path = []; ctrl.goal = null;
  if (it.k === 'mission') { ctrl.act = { o: it.o, t: 0, d: playerActDur(it.o, st.rd), ch: makeChallenge(it.o, st.rd), label: it.label, fetch: it.label === FETCH_LABEL }; const m = MISSIONS[it.o]; ctrl.settle = { rot: Math.atan2(m.l[0] - ctrl.x, m.l[1] - ctrl.z) }; return; }
  if (it.k === 'stair') { startClimb(it.dir, it.li); return; }
  // seats and poses are eased into over a few frames instead of snapping
  if (it.k === 'seat') { ctrl.settle = { x: it.slot.x, z: it.slot.z, rot: it.slot.rot }; ctrl.pose = { anim: it.anim, nt: 0 }; return; }
  ctrl.pose = { anim: it.anim, until: it.dur ? performance.now() / 1000 + it.dur : 0 }; if (it.rot !== undefined) ctrl.settle = { rot: it.rot };
}
// a ripple on the floor where the player clicked (gold when it is something to use)
const rippleMesh = new T.Mesh(new T.RingGeometry(0.22, 0.3, 32), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide }));
rippleMesh.rotation.x = -Math.PI / 2; rippleMesh.visible = false; rippleMesh.userData.noCol = true; scene.add(rippleMesh);
let rippleT = 9;
function clickRipple(x, z, y, gold) { rippleMesh.position.set(x, y + 0.03, z); rippleMesh.material.color.set(gold ? 0xffd27a : 0xdfe8ff); rippleT = 0; }
function stepRipple(dt) {
  rippleT += dt; const k = rippleT / 0.55;
  rippleMesh.visible = k < 1;
  if (k < 1) { const sc = 0.5 + k * 1.6; rippleMesh.scale.set(sc, sc, 1); rippleMesh.material.opacity = 0.9 * (1 - k) * (1 - k); }
}
const sndStep = () => tone(150 + Math.random() * 30, 0.035, 0.012, 'triangle');
// a key pressed while doing an act: true when the challenge used it
function challengeKey(k) {
  const a = ctrl.act, ch = a && a.ch; if (!ch) return false;
  if (k === 'escape') { cancelAct(); return true; }
  if (ch.k === 'seq' && k in ARROW_KEYS) {
    if (ch.i >= ch.keys.length) return true;
    if (ARROW_KEYS[k] === ch.keys[ch.i]) { ch.i++; ch.err = 0; tone(520 + ch.i * 90, 0.06, 0.03, 'triangle'); }
    else { ch.i = Math.max(0, ch.i - 1); ch.err = 0.35; tone(140, 0.12, 0.04, 'square'); }
    return true;
  }
  if (ch.k === 'ponto' && (k === 'e' || k === ' ' || k === 'enter')) {
    if (ch.hits >= ch.need || ch.miss > 0) return true;
    if (Math.abs(needleAt(ch, a.t) - ch.c) <= ch.w / 2) { ch.hits++; tone(660 + ch.hits * 120, 0.07, 0.03, 'triangle'); }
    else { ch.hits = Math.max(0, ch.hits - 1); ch.miss = 0.45; tone(140, 0.12, 0.04, 'square'); }
    return true;
  }
  if (ch.k === 'girar' && k in ARROW_KEYS) {
    const d = ARROW_KEYS[k]; if (ch.i >= ch.n || (d !== 0 && d !== 2)) return true;
    if (d !== ch.last) { ch.i++; ch.last = d; ch.err = 0; tone(300 + ch.i * 40, 0.05, 0.025, 'triangle'); }
    else { ch.err = 0.3; tone(140, 0.1, 0.03, 'square'); }
    return true;
  }
  if (ch.k === 'pulso' && (k === 'e' || k === ' ' || k === 'enter')) {
    if (ch.hits >= ch.need || ch.miss > 0) return true;
    const f = beatAt(ch, a.t), beat = Math.round(a.t / ch.per + ch.ph);
    if (Math.min(f, 1 - f) <= ch.w / 2 && beat !== ch.lb) { ch.hits++; ch.lb = beat; tone(520 + ch.hits * 130, 0.07, 0.03, 'triangle'); }
    else { ch.hits = 0; ch.miss = 0.45; tone(140, 0.12, 0.04, 'square'); }
    return true;
  }
  return k === 'e'; // E again does not restart the act
}
// the accomplice's distraction is armed first and goes off with the next fake mission they finish
function toggleLure() {
  const st = currentState(); if (G.role !== 'c' || !st || st.ph !== 'play' || (st.dz || []).includes(G.myEid)) return;
  ctrl.dzArm = !ctrl.dzArm; G.lureKey = '';
  toast(ctrl.dzArm ? 'Despiste armado: a próxima missão falsa faz o rádio do sniper ouvir algo mudar.' : 'Despiste guardado para depois.');
}
// the accomplice's own tally, kept up to date on the role card and the touch button
function updateLure(st) {
  if (G.role !== 'c' || st.ph !== 'play') return;
  const u = (st.lu || {})[G.myEid] || [0, 0], used = (st.dz || []).includes(G.myEid), n = lurePts(u);
  const key = u.join(',') + used + !!ctrl.dzArm; if (key === G.lureKey) return; G.lureKey = key;
  const box = $('#lure'); if (box) box.innerHTML = `<div class="eyebrow">Seus pontos de isca · ${n}/${LURE.max}</div><p class="muted">${u[0]} s com o laser em você · ${u[1]} s no caderno do sniper<br><small>1 ponto a cada ${LURE.laser} s na mira ou ${LURE.mark} s no caderno</small></p>`
    + `<button id="lureCardBtn"${used ? ' disabled' : ''}>${used ? 'Despiste usado' : ctrl.dzArm ? 'Despiste armado · desarmar' : 'Armar despiste (1 por rodada)'}</button>`;
  const b = $('#lureCardBtn'); if (b) b.onclick = e => { e.stopPropagation(); toggleLure(); };
  const tb = $('#lureBtn'); tb.hidden = used || !matchMedia('(pointer:coarse)').matches; tb.textContent = ctrl.dzArm ? 'Desarmar' : 'Despiste'; tb.classList.toggle('on', !!ctrl.dzArm);
}
function cancelAct() { if (ctrl.act) { ctrl.act = null; toast('Ação interrompida.'); } }
function stepAct(dt, st) {
  const a = ctrl.act, ch = a.ch; a.t += dt;
  if (ch.err > 0) ch.err -= dt;
  if (ch.miss > 0) ch.miss -= dt;
  if (ch.k === 'calma') {
    const L = laserFor(st); ch.near = !!L && Math.abs(L.y - ctrl.y) < 3 && Math.hypot(L.x - ctrl.x, L.z - ctrl.z) < LASER_NEAR;
    ch.p = Math.max(0, Math.min(1, ch.p + (ch.near ? -0.3 : 1) * dt / a.d));
  }
  // never quicker than the short end of the gesture's span, so no one finishes in a blink
  if (challengeProgress(a) >= 1 && a.t >= GESTURES[MISSIONS[a.o].g].d[0]) finishAct(st);
}
// the challenge drawn in the prompt (rebuilt only when what it shows changes)
let miniKey = '';
function drawMini() {
  const box = $('#mini'), a = ctrl.act, ch = a && a.ch;
  if (!ch || ch.k === 'segurar') { if (!box.hidden) { box.hidden = true; box.innerHTML = ''; miniKey = ''; } return; }
  box.hidden = false;
  const tt = ch.tt ? `<div class="tt">${esc(ch.tt)}</div>` : ''; // the place's version of the challenge names itself
  const touch = matchMedia('(pointer:coarse)').matches;
  if (ch.k === 'seq') {
    const key = 'seq' + a.o + ':' + ch.i + ':' + (ch.err > 0);
    if (key === miniKey) return; miniKey = key;
    box.innerHTML = tt + `<div class="seq${ch.err > 0 ? ' err' : ''}">${ch.keys.map((d, i) => `<b class="${i < ch.i ? 'ok' : i === ch.i ? 'cur' : ''}">${ARROWS[d]}</b>`).join('')}</div>`
      + (touch ? `<div class="pads">${ARROWS.map((s, d) => `<button data-d="${d}">${s}</button>`).join('')}</div><small>Toque nas setas na ordem · tocar no chão desiste</small>` : '<small>setas ou WASD · Esc sai</small>');
    box.querySelectorAll('button[data-d]').forEach(b => b.onclick = () => challengeKey(Object.keys(ARROW_KEYS)[[0, 2, 4, 6][+b.dataset.d]]));
  } else if (ch.k === 'ponto') {
    const key = 'ponto' + a.o;
    if (key !== miniKey) { miniKey = key; box.innerHTML = tt + `<div class="dial"><s style="left:${(ch.c - ch.w / 2) * 100}%;width:${ch.w * 100}%"></s><u></u></div><small></small>`; }
    box.querySelector('u').style.left = (needleAt(ch, a.t) * 100).toFixed(1) + '%';
    box.querySelector('.dial').classList.toggle('miss', ch.miss > 0);
    const tx = `${touch ? 'Toque em Agora' : 'Aperte E'} com o ponteiro na faixa · ${ch.hits}/${ch.need}`; const sm = box.querySelector('small'); if (sm.textContent !== tx) sm.textContent = tx;
  } else if (ch.k === 'calma') {
    const key = 'calma' + a.o + ch.near;
    if (key === miniKey) return; miniKey = key;
    box.innerHTML = tt + (ch.near ? '<small class="warn">A mira está perto: sua mão treme</small>' : '<small>Mão firme: só avança com a mira longe</small>');
  } else if (ch.k === 'girar') {
    const key = 'girar' + a.o + ':' + ch.i + ':' + ch.last + ':' + (ch.err > 0);
    if (key === miniKey) return; miniKey = key;
    const nx = ch.last === 0 ? 2 : ch.last === 2 ? 0 : -1;
    box.innerHTML = tt + `<div class="seq${ch.err > 0 ? ' err' : ''}">${[0, 2].map(d => `<b class="${nx < 0 || nx === d ? 'cur' : ''}">${ARROWS[d]}</b>`).join('')}</div>`
      + (touch ? `<div class="pads">${[0, 2].map(d => `<button data-d="${d}">${ARROWS[d]}</button>`).join('')}</div>` : '') + `<small>Gire: ${ARROWS[0]} e ${ARROWS[2]} alternando · ${ch.i}/${ch.n}</small>`;
    box.querySelectorAll('button[data-d]').forEach(b => b.onclick = () => challengeKey(+b.dataset.d === 0 ? 'arrowleft' : 'arrowright'));
  } else if (ch.k === 'pulso') {
    const key = 'pulso' + a.o;
    if (key !== miniKey) { miniKey = key; box.innerHTML = tt + '<div class="beat"><i></i></div><small></small>'; }
    box.querySelector('i').style.transform = `scale(${(0.15 + 0.85 * beatAt(ch, a.t)).toFixed(3)})`;
    box.querySelector('.beat').classList.toggle('miss', ch.miss > 0);
    const tx = `${touch ? 'Toque em Agora' : 'Aperte E'} quando o círculo encher · ${ch.hits}/${ch.need} seguidas`; const sm = box.querySelector('small'); if (sm.textContent !== tx) sm.textContent = tx;
  }
}
function finishAct(st) {
  const o = ctrl.act.o, fetch = ctrl.act.fetch; ctrl.act = null; ctrl.actSeq++;
  const early = !!st.ts && !st.tg && o === st.ts[0], pending = !early && st.ms.includes(o) && !st.dn.includes(o);
  const d = G.role === 'c' && ctrl.dzArm && !(st.dz || []).includes(G.myEid); ctrl.dzArm = false;
  if (G.sim) G.sim.completeAct(G.myEid, o, d);
  else ctrl.actDone = d ? { o, s: ctrl.actSeq, rd: st.rd, d: 1 } : { o, s: ctrl.actSeq, rd: st.rd };
  if (d) toast('Despiste feito: daqui a pouco o rádio do sniper ouve algo mudar aqui.', 'good');
  else if (G.role === 'c') toast('Missão falsa feita. Se o sniper estiver olhando, ótimo.');
  else if (fetch) toast('Encomenda na mão. Agora entregue: ' + MISSIONS[st.ts[0]].label.toLowerCase() + '.');
  else if (G.role === 'a' && !pending) toast(early || (st.ts && !st.tg && MISSIONS[st.ts[0]].p === MISSIONS[o].p) ? 'Pegue a encomenda antes: ' + PROPS[st.ts[1]].where + '.' : 'Essa não é uma das suas missões pendentes.');
}
const PIANO_NOTES = [392, 440, 494, 587, 659, 784, 659, 587, 494, 440, 523, 587, 659, 523, 440, 392];

// ---------------------------------------------------------------- per-frame local logic
function updateLocal(dt, st) {
  meRing.visible = false; meTag.visible = false;
  if (G.screen !== 'game' || !st || st.ph === 'lobby') return;
  if (G.role && G.role !== 's' && G.myEid >= 0) {
    const dead = st.ents.find(e => e.id === G.myEid)?.anim === 5;
    let vx = 0, vz = 0, moving = false;
    const now = performance.now() / 1000;
    if (st.ph === 'play' && !dead) {
      if (ctrl.lk) {
        // riding the spiral stair: input is ignored until the top or bottom
        if (!Sim.prototype.stepLink(ctrl, P_SPEED * 1.35, dt) && ctrl.path.length && !ctrl.path.some(w => w.link)) { const end = ctrl.path[ctrl.path.length - 1]; ctrl.path = route(ctrl.x, ctrl.z, ctrl.lv, end[0], end[1], ctrl.lv); } moving = true;
      } else {
        const fwd = new T.Vector3(); iso.getWorldDirection(fwd); fwd.y = 0; fwd.normalize();
        const right = new T.Vector3(-fwd.z, 0, fwd.x);
        let ix = 0, iz = 0;
        // while typing a sequence or turning, the arrows (and WASD) belong to the challenge; Esc or a click elsewhere walks away
        const typing = ctrl.act && ctrl.act.ch && (ctrl.act.ch.k === 'seq' || ctrl.act.ch.k === 'girar');
        if (!typing) {
          if (keyDown.has('w') || keyDown.has('arrowup')) { ix += fwd.x; iz += fwd.z; }
          if (keyDown.has('s') || keyDown.has('arrowdown')) { ix -= fwd.x; iz -= fwd.z; }
          if (keyDown.has('d') || keyDown.has('arrowright')) { ix += right.x; iz += right.z; }
          if (keyDown.has('a') || keyDown.has('arrowleft')) { ix -= right.x; iz -= right.z; }
        }
        if (ix || iz) { ctrl.path = []; ctrl.goal = null; const l = Math.hypot(ix, iz); vx = ix / l * P_SPEED; vz = iz / l * P_SPEED; }
        else if (ctrl.path.length) {
          const wp = ctrl.path[0];
          if (wp.link) {
            // only step onto the stair from its end; otherwise re-route there first
            const ns = nearStair(ctrl.x, ctrl.z, ctrl.lv);
            if (ns && ns.li === wp.li && ns.dir === wp.link) { ctrl.path.shift(); startClimb(wp.link, wp.li, true); }
            else { const end = ctrl.path[ctrl.path.length - 1]; ctrl.path = route(ctrl.x, ctrl.z, ctrl.lv, end[0], end[1], ctrl.tlv ?? ctrl.lv); }
          }
          else {
            const dx = wp[0] - ctrl.x, dz = wp[1] - ctrl.z, d = Math.hypot(dx, dz), last = ctrl.path.length === 1;
            if (d < 0.12) { ctrl.path.shift(); ctrl.stuck = 0; ctrl.lastD = 1e9; if (!ctrl.path.length && ctrl.goal) { ctrl.goal = null; ctrl.vx = ctrl.vz = 0; tryAct(); } }
            else {
              const sp = P_SPEED * (last && d < 0.7 ? Math.max(0.45, d / 0.7) : 1);
              vx = dx / d * sp; vz = dz / d * sp;
              // not getting closer (a lounger in the way, say): sidestep around it a few times, then give up
              ctrl.stuck = (ctrl.stuck || 0) + dt;
              if (ctrl.stuck > 0.9) {
                if (d > (ctrl.lastD ?? 1e9) - 0.12) {
                  const px = -dz / d, pz = dx / d; let ins = null;
                  for (const k of [1.4, -1.4, 2.4, -2.4]) { const sx = ctrl.x + px * k, sz = ctrl.z + pz * k; if (!blocked(sx, sz, RAD, ctrl.lv)) { ins = [sx, sz]; break; } }
                  if (ins && (ctrl.detours || 0) < 5) { ctrl.path.unshift(ins); ctrl.detours = (ctrl.detours || 0) + 1; }
                  else if (ctrl.path.length > 1 && !ctrl.path[1].link) ctrl.path.shift(); else ctrl.path = [];
                }
                ctrl.lastD = d; ctrl.stuck = 0;
              }
            }
          }
        }
        // ease the velocity so starts and stops read as weight, not teleports
        const ka = 1 - Math.exp(-dt * (vx || vz ? 11 : 16));
        ctrl.vx += (vx - ctrl.vx) * ka; ctrl.vz += (vz - ctrl.vz) * ka;
        const spd = Math.hypot(ctrl.vx, ctrl.vz);
        if (vx || vz) { if (ctrl.act) cancelAct(); ctrl.pose = null; ctrl.settle = null; }
        if (spd > 0.06) {
          // give other guests a little room
          let ax = 0, az = 0;
          for (const e of st.ents) { if (e.id === G.myEid || e.anim === 5 || Math.abs((e.y || 0) - ctrl.y) > 0.5) continue; const ex = ctrl.x - e.x, ez = ctrl.z - e.z, d = Math.hypot(ex, ez); if (d < 0.7 && d > 1e-3) { const w = (0.7 - d) / 0.7; ax += ex / d * w; az += ez / d * w; } }
          const mvx = ctrl.vx + ax * 0.6, mvz = ctrl.vz + az * 0.6;
          const bx = ctrl.x, bz = ctrl.z;
          const direct = (ctrl.goal && ctrl.path.length === 1 && Math.hypot(ctrl.path[0][0] - ctrl.x, ctrl.path[0][1] - ctrl.z) < (ctrl.goal.dl || 0.9)) || (ctrl.path.length > 1 && ctrl.path[1].link && Math.hypot(ctrl.path[0][0] - ctrl.x, ctrl.path[0][1] - ctrl.z) < 0.9);
          if (direct) { ctrl.x += mvx * dt; ctrl.z += mvz * dt; } else moveC(ctrl, mvx, mvz, dt);
          if (Math.hypot(ctrl.x - bx, ctrl.z - bz) < 1e-4 && ctrl.path.length && !(vx || vz)) ctrl.path.shift();
          if (vx || vz) ctrl.rot = lerpAngle(ctrl.rot, Math.atan2(vx, vz), 1 - Math.exp(-dt * 12));
          moving = spd > 0.25;
          ctrl.stepT += dt * spd; if (ctrl.stepT > 0.62) { ctrl.stepT = 0; sndStep(); }
        } else { ctrl.vx = ctrl.vz = 0; }
        if (ctrl.settle && !moving) {
          const s = ctrl.settle, ks = 1 - Math.exp(-dt * 9);
          if (s.x !== undefined) { ctrl.x += (s.x - ctrl.x) * ks; ctrl.z += (s.z - ctrl.z) * ks; }
          ctrl.rot = lerpAngle(ctrl.rot, s.rot, ks);
          if ((s.x === undefined || Math.hypot(s.x - ctrl.x, s.z - ctrl.z) < 0.01) && Math.abs(lerpAngle(ctrl.rot, s.rot, 1) - ctrl.rot) < 0.01) { if (s.x !== undefined) { ctrl.x = s.x; ctrl.z = s.z; } ctrl.rot = s.rot; ctrl.settle = null; }
        }
        if (ctrl.act) stepAct(dt, st);
        if (ctrl.pose) {
          if (ctrl.pose.until && now > ctrl.pose.until) ctrl.pose = null;
          else if (ctrl.pose.anim === 9) { ctrl.pose.nt -= dt; if (ctrl.pose.nt <= 0) { ctrl.pose.nt = 0.26 + Math.random() * 0.1; ctrl.pose.ni = ((ctrl.pose.ni || 0) + 1) % PIANO_NOTES.length; tone(PIANO_NOTES[ctrl.pose.ni], 0.35, 0.035, 'triangle'); } }
        }
      }
      ctrl.y = ctrl.lk ? ctrl.y : LVY(ctrl.lv);
    }
    // a player left standing slips into the same chatting stance the guests keep, so standing stock-still is not a tell
    const st0 = ctrl.stillT || 0; ctrl.stillT = dead || moving || ctrl.act || ctrl.pose ? 0 : st0 + dt;
    if (st0 <= 3.5 && ctrl.stillT > 3.5) ctrl.idleA = idleAnimAt(ctrl.x, ctrl.z, ctrl.lv);
    ctrl.anim = dead ? 5 : moving ? 1 : ctrl.act ? MISSIONS[ctrl.act.o].ga : ctrl.pose ? ctrl.pose.anim : ctrl.stillT > 3.5 ? ctrl.idleA ?? 4 : 0;
    if (G.sim && !dead) G.sim.setPlayer(G.myEid, ctrl.x, ctrl.z, ctrl.rot, ctrl.anim, ctrl.y);
    isoState.tx = ctrl.x; isoState.tz = ctrl.z; isoState.ty = ctrl.y;
    stepRipple(dt);
    meRing.visible = !dead; meRing.position.set(ctrl.x, ctrl.y + 0.035, ctrl.z);
    G.tagT = Math.max(0, (G.tagT || 0) - dt);
    const tagA = dead || st.ph !== 'play' ? 0 : GINTRO.on ? 1 : Math.min(1, G.tagT);
    meTag.visible = tagA > 0; meTag.material.opacity = tagA; meTag.position.set(ctrl.x, ctrl.y + 2.75 + Math.sin(performance.now() / 260) * 0.07, ctrl.z);
    // prompt
    const it = st.ph === 'play' && !dead && !ctrl.lk && !ctrl.act ? (ctrl.pose ? { k: 'up', label: ctrl.pose.anim === 3 ? 'Parar de dançar' : [7, 8, 9, 12, 15, 16, 17].includes(ctrl.pose.anim) ? 'Levantar' : 'Parar' } : nearInteraction(st)) : null;
    if (ctrl.act) { show('#prompt', true); $('#promptText').textContent = (ctrl.act.label || MISSIONS[ctrl.act.o].label) + '…'; $('#promptBar').style.width = (challengeProgress(ctrl.act) * 100) + '%'; }
    else if (it) { show('#prompt', true); $('#promptText').innerHTML = matchMedia('(pointer:coarse)').matches ? esc(it.label) : `<kbd>E</kbd> ${esc(it.label)}`; $('#promptBar').style.width = '0%'; }
    else show('#prompt', false);
    drawMini();
    // on touch screens the act button doubles as the "now" of a needle challenge
    const pt = ctrl.act && ctrl.act.ch && (ctrl.act.ch.k === 'ponto' || ctrl.act.ch.k === 'pulso'), bl = pt ? 'Agora' : it && it.label;
    const ab = $('#actBtn'); ab.hidden = !(bl && matchMedia('(pointer:coarse)').matches); if (bl && ab.textContent !== bl) ab.textContent = bl;
    updateLure(st);
  } else { show('#prompt', false); if (ctrl.act) ctrl.act = null; drawMini(); }
}

// the radio only says roughly where something changed (level, side, front or back from the sniper's point of view);
// what changed is identified when the sniper frames that spot in the scope, zoomed in, for a moment
function lvLabel(lv) { const L = LEVELS[lv] || LEVELS[0]; return SCEN.id ? L.name : lv === 0 ? 'festa' : lv === 1 ? 'terraço' : L.name + ' (' + lv + 'º)'; }
function areaBins(o) {
  const m = MISSIONS[o], L = LEVELS[m.lv || 0] || LEVELS[0], q = m.l || m.s;
  const fx = (q[0] - L.x0) / ((L.x1 - L.x0) || 1), fz = (q[1] - L.z0) / ((L.z1 - L.z0) || 1);
  return [m.lv || 0, fx < 0.36 ? 0 : fx > 0.64 ? 2 : 1, fz > 0.5 ? 1 : 0];
}
const areaKey = o => areaBins(o).join(':');
function areaOf(o) {
  const m = MISSIONS[o], b = areaBins(o);
  const side = ['à esquerda', 'no centro', 'à direita'][b[1]], depth = b[2] ? 'perto da frente' : 'mais ao fundo';
  return (LV_N > 1 ? 'em ' + lvLabel(m.lv || 0) + ', ' : '') + side + ', ' + depth;
}
const idV = new T.Vector3();
// can the sniper see any part of the spot (a few points around it, from the floor up)?
function spotVisible(x, y, z) {
  const occ = SCEN.id ? (SCEN.occ || []) : OCCLUDERS, tg = new T.Vector3(), dir = new T.Vector3();
  for (const [ox, oy] of [[0, 0.9], [0, 0.4], [0.45, 0.7], [-0.45, 0.7], [0, 1.4]]) {
    tg.set(x + ox, y + oy, z); const dist = tg.distanceTo(SNIPER_POS); dir.copy(tg).sub(SNIPER_POS).normalize();
    ray.set(SNIPER_POS, dir); ray.far = dist; const h = ray.intersectObjects(occ, true)[0]; ray.far = Infinity;
    if (!h || h.distance > dist - 0.8) return true;
  }
  return false;
}
function scopeIdentify(dt, st) {
  if (!snip.scoped || snip.zoom < 5 || !st.tells.length) return;
  snip.idd = snip.idd || {}; snip.idT = snip.idT || {};
  const R = Math.min(innerWidth * 0.44, innerHeight * 0.44, innerHeight * 0.46) * 0.6;
  for (const o of new Set(st.tells)) {
    if (snip.idd[o]) continue;
    const m = MISSIONS[o], q = m.l || m.s;
    idV.set(q[0], LVY(m.lv || 0) + 0.9, q[1]);
    idV.project(scopeCam);
    const px = idV.x * innerWidth / 2, py = idV.y * innerHeight / 2;
    const seen = idV.z < 1 && Math.hypot(px, py) < R;
    // a spot behind something solid takes longer to make out (a few spots can't be seen from the sniper's roof at all)
    const need = seen && !spotVisible(q[0], LVY(m.lv || 0), q[1]) ? 1600 : 600;
    const now = performance.now(); snip.idT[o] = seen ? (snip.idT[o] || now) : 0;
    if (snip.idT[o] && now - snip.idT[o] > need) { snip.idd[o] = true; snip.nbKey = ''; toast('🔎 Identificado: ' + m.label.toLowerCase() + ' — ' + m.where, 'good'); tone(880, 0.12, 0.03); }
  }
}
// Each nest has its own small life on the lens and in the ear: things that belong to where the sniper is hiding
// (snow on the glass in the Alps, the bell shaking the tower in Venice, steam and the rails trembling at the
// station...). All faint, mostly at the edge of the glass and short, so the guests stay readable; a "shake" is a
// brief, small wobble of the sight, never enough to throw a steady aim. Reduced motion keeps sounds, drops shakes.
const LENS = { cv: null, g: null, size: 0, parts: [], fx: [], shake: 0, shakeF: 9, next: 0, map: -1, drawn: false };
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const lensRnd = (a, b) => a + Math.random() * (b - a);
// a particle spawned at the rim (or anywhere, for things that land on the glass)
function lensPart(kind, o = {}) {
  const a = Math.random() * Math.PI * 2, rim = o.rim ?? 0.8;
  LENS.parts.push(Object.assign({ kind, x: Math.cos(a) * rim * Math.random(), y: Math.sin(a) * rim * Math.random(), vx: 0, vy: 0, t: 0, life: 3, r: 0.01, rot: Math.random() * 6, vr: 0 }, o));
}
const lensFlash = (col, life, x, y, r) => LENS.fx.push({ k: 'flash', col, life, t: 0, x, y, r });
const lensSweep = (col, life, ang = lensRnd(-0.5, 0.5), w = 0.35) => LENS.fx.push({ k: 'sweep', col, life, t: 0, ang, w });
const lensHaze = (col, life) => LENS.fx.push({ k: 'haze', col, life, t: 0 });
const lensShake = (a, f = 9) => { if (!RM.matches) { LENS.shake = Math.max(LENS.shake, a); LENS.shakeF = f; } };
const sndBell = () => { for (const [f, g] of [[196, 0.07], [392, 0.04], [523, 0.025], [784, 0.012]]) tone(f, 3.2, g); };
const sndRotor = () => { for (let i = 0; i < 12; i++) setTimeout(() => tone(46, 0.09, 0.05 * (1 - Math.abs(i - 6) / 7)), i * 115); };
const sndHorn = (f = 98, d = 1.6) => { tone(f, d, 0.035, 'sawtooth'); tone(f * 1.5, d, 0.015, 'sawtooth'); };
const sndChime = () => { tone(2093, 1.4, 0.025, 'triangle'); setTimeout(() => tone(3136, 1.1, 0.014, 'triangle'), 90); };
const sndPop = () => { noise(0.05, 4000, 0.18); setTimeout(() => noise(0.7, 900, 0.06), 70); };
const sndBuzz = () => { tone(180, 0.9, 0.012, 'sawtooth'); setTimeout(() => tone(176, 0.7, 0.01, 'sawtooth'), 400); };
const sndCreak = () => { tone(72, 1.0, 0.03, 'sawtooth'); setTimeout(() => tone(64, 0.8, 0.025, 'sawtooth'), 600); };
const sndWhistle = () => { tone(880, 1.3, 0.025); tone(1108, 1.3, 0.02); };
// per scenario: every = seconds between events, rate = ambient particles per second, ev = the event
const NEST_MOODS = {
  // a helicopter passing: its shadow over the lens by day; at night the scene already sweeps searchlights, so only the rotor
  0: { every: [30, 50], ev() { if (!NIGHT.on) lensSweep('rgba(0,0,0,.14)', 1.4, lensRnd(-0.3, 0.3), 0.3); sndRotor(); } },
  1: { every: [35, 55], ev() { sndBell(); lensShake(0.0011, 11); } }, // San Vidal's bell overhead
  2: { every: [30, 50], ev() { sndHorn(); setTimeout(() => lensSweep('rgba(0,0,0,.16)', 0.6, lensRnd(-1, 1), 0.18), 1500); } }, // a ship's horn; a gull's shadow
  3: { every: [20, 35], ev() { lensPart('bug', { x: -1.1, y: lensRnd(-0.6, 0.6), vx: 0.7, vy: 0, life: 3.2, r: 0.008 }); sndBuzz(); } }, // a fly across the glass
  4: { every: [25, 40], ev() { lensSweep('rgba(255,230,180,.12)', 1.6, lensRnd(1.2, 1.9), 0.4); tone(330, 0.5, 0.012, 'square'); } }, // headlights from the avenue
  5: { every: [30, 50], rate: 0.22, amb: () => lensPart('petal', { x: lensRnd(-1, 0.4), y: -1.05, vx: lensRnd(0.04, 0.14), vy: lensRnd(0.12, 0.2), life: 9, r: 0.012, vr: lensRnd(-2, 2) }), ev: sndChime }, // petals; a fūrin
  6: { every: [8, 18], ev() { const c = ['255,90,90', '255,210,90', '120,200,255', '200,120,255', '120,255,160'][Math.random() * 5 | 0], a = Math.random() * 6; lensFlash(`rgba(${c},.28)`, 1.1, Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0.7); setTimeout(sndPop, 350); } }, // fireworks
  7: { every: [40, 60], rate: 0.55, amb: () => lensPart('snow', { rim: 0.98, life: lensRnd(4, 7), r: lensRnd(0.006, 0.013) }), ev: sndCreak }, // snow on the glass; the cable
  8: { every: [40, 70], rate: 0.1, amb: () => lensPart('smoke', { x: lensRnd(-1, -0.5), y: lensRnd(0.4, 1), vx: lensRnd(0.04, 0.08), vy: -0.05, life: 8, r: 0.18 }), ev() { tone(392, 0.3, 0.01, 'triangle'); setTimeout(() => tone(349, 0.4, 0.01, 'triangle'), 300); } }, // chimney smoke
  9: { every: [25, 40], ev() { lensHaze('rgba(205,160,100,.10)', 2.5); noise(2.2, 500, 0.05); for (let i = 0; i < 22; i++) lensPart('dust', { x: lensRnd(-1.2, -0.8), y: lensRnd(-0.9, 0.9), vx: lensRnd(0.6, 1), vy: lensRnd(-0.05, 0.05), life: 3, r: 0.004 }); } }, // a gust of sand
  10: { every: [35, 55], ev() { sndWhistle(); setTimeout(() => { lensShake(0.0007, 15); noise(3, 260, 0.06); for (let i = 0; i < 5; i++) setTimeout(() => lensPart('smoke', { x: lensRnd(-0.9, 0.9), y: 1.05, vx: lensRnd(-0.05, 0.05), vy: -0.16, life: 5, r: 0.22 }), i * 500); }, 1200); } }, // a train passing under the clock
};
function stepLens(dt, st) {
  if (!LENS.cv) { LENS.cv = $('#lensFx'); LENS.g = LENS.cv.getContext('2d'); }
  const m = NEST_MOODS[SCEN.id] || {};
  if (LENS.map !== SCEN.id) { LENS.map = SCEN.id; LENS.parts = []; LENS.fx = []; LENS.shake = 0; LENS.next = lensRnd(6, 14); }
  const live = st && st.ph === 'play';
  if (live && m.ev) { LENS.next -= dt; if (LENS.next <= 0) { LENS.next = lensRnd(m.every[0], m.every[1]); m.ev(); } }
  if (live && m.amb && Math.random() < m.rate * dt && LENS.parts.length < 24) m.amb();
  LENS.shake *= Math.exp(-dt * 1.8); if (LENS.shake < 1e-5) LENS.shake = 0;
  for (const p of LENS.parts) {
    p.t += dt;
    if (p.kind === 'snow') { p.vx = 0; p.vy = 0; } // lands and melts where it touched
    else if (p.kind === 'bug') { p.vy = Math.sin(p.t * 9) * 0.3; }
    else if (p.kind === 'smoke') p.r += dt * 0.05;
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
  }
  LENS.parts = LENS.parts.filter(p => p.t < p.life); LENS.fx = LENS.fx.filter(f => (f.t += dt) < f.life);
  // draw only while looking through the glass
  const cv = LENS.cv, g = LENS.g;
  if (!snip.scoped || (!LENS.parts.length && !LENS.fx.length)) { if (LENS.drawn) { g.clearRect(0, 0, cv.width, cv.height); LENS.drawn = false; } return; }
  const px = Math.min(720, Math.round(cv.clientWidth)); if (px && cv.width !== px) { cv.width = cv.height = px; }
  const S = cv.width / 2; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cv.width, cv.height); g.setTransform(S, 0, 0, S, S, S); LENS.drawn = true;
  for (const f of LENS.fx) {
    const k = f.t / f.life, a = Math.sin(Math.PI * k);
    g.globalAlpha = a;
    if (f.k === 'flash') { const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r); gr.addColorStop(0, f.col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(-1, -1, 2, 2); }
    else if (f.k === 'haze') { g.fillStyle = f.col; g.fillRect(-1, -1, 2, 2); }
    else { const c = Math.cos(f.ang), sn = Math.sin(f.ang), d = -1.4 + 2.8 * k, gr = g.createLinearGradient(c * (d - f.w), sn * (d - f.w), c * (d + f.w), sn * (d + f.w)); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, f.col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(-1, -1, 2, 2); }
  }
  for (const p of LENS.parts) {
    const k = p.t / p.life; g.globalAlpha = Math.min(1, p.t * 3) * (1 - k * k);
    if (p.kind === 'snow') { g.fillStyle = 'rgba(245,250,255,.85)'; g.beginPath(); g.arc(p.x, p.y, p.r * (1 - 0.5 * k), 0, 7); g.fill(); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 0.003; for (let i = 0; i < 3; i++) { const a = p.rot + i * 1.047; g.beginPath(); g.moveTo(p.x - Math.cos(a) * p.r * 1.8, p.y - Math.sin(a) * p.r * 1.8); g.lineTo(p.x + Math.cos(a) * p.r * 1.8, p.y + Math.sin(a) * p.r * 1.8); g.stroke(); } }
    else if (p.kind === 'petal') { g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = 'rgba(255,190,205,.8)'; g.beginPath(); g.ellipse(0, 0, p.r * 1.6, p.r * 0.8, 0, 0, 7); g.fill(); g.restore(); }
    else if (p.kind === 'bug') { g.fillStyle = 'rgba(20,20,20,.75)'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }
    else if (p.kind === 'dust') { g.fillStyle = 'rgba(210,170,110,.7)'; g.fillRect(p.x, p.y, p.r * 2, p.r); }
    else if (p.kind === 'smoke') { const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); gr.addColorStop(0, 'rgba(225,225,230,.16)'); gr.addColorStop(1, 'rgba(225,225,230,0)'); g.fillStyle = gr; g.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); }
  }
  g.globalAlpha = 1;
}
// The first solo round as sniper opens with a short walk through the four tools, one at a time, each learned by
// doing it (no reading): look through the scope, change the zoom, hold the breath, note a suspect; then one line on
// the radio. It moves on as soon as the player does the thing (or after a while), and "Pular" ends it.
const INTRO = { on: false, i: 0, t: 0, held: 0, z0: 0, m0: 0, doneT: 0, last: 0 };
let introSeen = false; try { introSeen = localStorage.getItem('mira-intro-s') === '1'; } catch (e) { }
const INTRO_STEPS = [
  { btn: 'scopeBtn', txt: (tc) => `Olhe pela luneta: <b>${tc ? 'toque em Luneta' : 'botão direito ou Espaço'}</b>`, ok: () => snip.scoped },
  { btn: 'zoomBtn', txt: (tc) => `Aproxime: <b>${tc ? 'toque em Zoom' : 'gire a roda do mouse'}</b>`, start: () => { INTRO.z0 = snip.zoom; }, ok: () => snip.zoom !== INTRO.z0 },
  { btn: 'breathBtn', txt: (tc) => `Firme a mira: <b>${tc ? 'segure Prender ar' : 'segure Shift'}</b>`, ok: () => INTRO.held > 0.6 },
  { btn: 'markBtn', txt: (tc) => `Anote um suspeito: <b>${tc ? 'mira em alguém e Marcar' : 'mira em alguém e F'}</b>`, start: () => { INTRO.m0 = snip.marks.length; }, ok: () => snip.marks.length !== INTRO.m0 },
  { txt: () => `O <b>rádio</b> diz a área onde algo mudou. Enquadre com zoom para ver o quê. <b>Um tiro só.</b>`, ok: () => INTRO.t > 7 },
];
function introEnd() {
  INTRO.on = false; show('#coach', false); document.querySelectorAll('#touch button.coach').forEach(b => b.classList.remove('coach'));
  introSeen = true; try { localStorage.setItem('mira-intro-s', '1'); } catch (e) { }
}
function introShow() {
  const s = INTRO_STEPS[INTRO.i], tc = matchMedia('(pointer:coarse)').matches;
  INTRO.t = 0; INTRO.held = 0; INTRO.doneT = 0; if (s.start) s.start();
  $('#coach').classList.remove('done'); $('#coachN').textContent = INTRO.i < 4 ? `${INTRO.i + 1}/4` : 'Pronto'; $('#coachText').innerHTML = s.txt(tc);
  document.querySelectorAll('#touch button.coach').forEach(b => b.classList.remove('coach')); if (s.btn) $('#' + s.btn).classList.add('coach');
}
function stepIntro(_, st) {
  // wall-clock time: the steps are about the player's hands, not the (capped) game step
  const now = performance.now(), dt = Math.min(0.5, (now - (INTRO.last || now)) / 1000); INTRO.last = now;
  if (!INTRO.on) {
    if (introSeen || G.solo !== 'sniper' || !st || st.ph !== 'play') return;
    INTRO.on = true; INTRO.i = 0; show('#coach', true); introShow(); return;
  }
  if (!st || st.ph !== 'play' || G.screen !== 'game') { introEnd(); return; }
  const s = INTRO_STEPS[INTRO.i]; INTRO.t += dt; if (snip.hold) INTRO.held += dt;
  if (INTRO.doneT > 0) { INTRO.doneT -= dt; if (INTRO.doneT <= 0) { INTRO.i++; if (INTRO.i >= INTRO_STEPS.length) introEnd(); else introShow(); } return; }
  // done: a short check mark before the next step; a step nobody manages moves on by itself after 25 s
  if (s.ok() || INTRO.t > 25) { if (INTRO.i < 4) { $('#coach').classList.add('done'); $('#coachN').textContent = '✓'; sndScope(); INTRO.doneT = 0.7; } else INTRO.doneT = 0.01; }
}
$('#coachSkip').onclick = () => (GINTRO.on ? gintroEnd() : introEnd());
// on a phone held upright the coach sits under the timer and the mission card moves down below it (--coachH)
if (window.ResizeObserver) new ResizeObserver(() => { const c = $('#coach'), h = c.hidden ? 0 : c.offsetHeight; document.documentElement.style.setProperty('--coachH', h ? h + 6 + 'px' : '0px'); }).observe($('#coach'));
// The first round as agent (and the first as accomplice) opens the same way, learned by doing: walk, find a mission
// object (golden ring), use it, then one line on the laser and on blending in. Solo or with friends, once per role.
const GINTRO = { on: false, role: null, i: 0, t: 0, x0: 0, z0: 0, dn0: 0, doneT: 0, last: 0 };
const gintroSeen = {}; try { gintroSeen.a = localStorage.getItem('mira-intro-a') === '1'; gintroSeen.c = localStorage.getItem('mira-intro-c') === '1'; } catch (e) { }
const GINTRO_STEPS = {
  a: [
    { txt: tc => `Este é <b>você</b>. Ande: <b>${tc ? 'toque no chão' : 'WASD ou clique no chão'}</b>`, start: () => { GINTRO.x0 = ctrl.x; GINTRO.z0 = ctrl.z; }, ok: () => Math.hypot(ctrl.x - GINTRO.x0, ctrl.z - GINTRO.z0) > 2 },
    { txt: () => `Suas missões estão nos objetos com <b>anel dourado</b> no chão. Vá até um deles`, max: 60, ok: st => { const it = nearInteraction(st); return !!(it && it.k === 'mission' && st.ms.includes(it.o)) || !!ctrl.act; } },
    { txt: tc => `Faça a missão: <b>${tc ? 'toque no botão' : 'aperte E'}</b> e complete o desafio`, start: st => { GINTRO.dn0 = st.dn.length; }, max: 45, ok: st => !!ctrl.act || st.dn.length > GINTRO.dn0 },
    { txt: () => `O <b>laser vermelho</b> é o sniper procurando. Entre uma missão e outra, aja como convidado: sente, dance, converse.`, max: 9, ok: () => false },
  ],
  c: [
    { txt: tc => `Este é <b>você</b>. Ande: <b>${tc ? 'toque no chão' : 'WASD ou clique no chão'}</b>`, start: () => { GINTRO.x0 = ctrl.x; GINTRO.z0 = ctrl.z; }, ok: () => Math.hypot(ctrl.x - GINTRO.x0, ctrl.z - GINTRO.z0) > 2 },
    { txt: () => `Você é <b>isca</b>: faça missões falsas nos objetos com anel dourado para atrair a mira do sniper.`, max: 9, ok: () => false },
  ],
};
function gintroEnd() {
  if (GINTRO.on && GINTRO.role) { gintroSeen[GINTRO.role] = true; try { localStorage.setItem('mira-intro-' + GINTRO.role, '1'); } catch (e) { } }
  GINTRO.on = false; show('#coach', false);
}
function gintroShow(st) {
  const steps = GINTRO_STEPS[GINTRO.role], s = steps[GINTRO.i], tc = matchMedia('(pointer:coarse)').matches, n = steps.length - 1;
  GINTRO.t = 0; GINTRO.doneT = 0; if (s.start) s.start(st);
  $('#coach').classList.remove('done'); $('#coachN').textContent = GINTRO.i < n ? `${GINTRO.i + 1}/${n}` : 'Pronto'; $('#coachText').innerHTML = s.txt(tc);
}
function stepGIntro(st) {
  const now = performance.now(), dt = Math.min(0.5, (now - (GINTRO.last || now)) / 1000); GINTRO.last = now;
  const playing = st && st.ph === 'play' && G.screen === 'game' && (G.role === 'a' || G.role === 'c');
  if (!GINTRO.on) {
    if (!playing || gintroSeen[G.role] || window.__noIntro) return;
    GINTRO.on = true; GINTRO.role = G.role; GINTRO.i = 0; show('#coach', true); gintroShow(st); return;
  }
  if (!playing || G.role !== GINTRO.role) { GINTRO.on = false; show('#coach', false); return; } // the round ended: it comes back next time
  const steps = GINTRO_STEPS[GINTRO.role], s = steps[GINTRO.i], n = steps.length - 1; GINTRO.t += dt;
  if (GINTRO.doneT > 0) { GINTRO.doneT -= dt; if (GINTRO.doneT <= 0) { GINTRO.i++; if (GINTRO.i >= steps.length) gintroEnd(); else gintroShow(st); } return; }
  if (s.ok(st) || GINTRO.t > (s.max || 25)) { if (GINTRO.i < n) { $('#coach').classList.add('done'); $('#coachN').textContent = '✓'; sndScope(); GINTRO.doneT = 0.7; } else GINTRO.doneT = 0.01; }
}
function updateSniper(dt, st) {
  if (G.role !== 's' || G.screen !== 'game') { canvas.classList.remove('blur'); return; }
  snip.breath += dt;
  // holding your breath (Shift) steadies the scope for a few seconds; run out and the sight heaves until you recover
  // the decision closing in: the last 30 s, or the radio already counting NEED-1 changes (what the sniper knows too)
  const tens = st && st.ph === 'play' ? Math.max(st.tl < 30 ? 1 - st.tl / 30 : 0, st.tells.length >= NEED - 1 ? 0.45 : 0) : 0;
  snip.tens = tens;
  if (snip.hold && snip.gasp <= 0 && snip.air > 0) { snip.air = Math.max(0, snip.air - dt / (5 - 1.6 * tens)); if (snip.air <= 0) { snip.gasp = 2.6; snip.hold = false; } }
  else { snip.air = Math.min(1, snip.air + dt / (snip.gasp > 0 ? 2.6 : 4)); }
  if (snip.gasp > 0) snip.gasp -= dt;
  if (snip.scoped) {
    if (snip.hold && !snip.wasHold) sndInhale();
    else if (!snip.hold && snip.wasHold) (snip.gasp > 0 ? sndGasp : sndExhale)();
    // the heart is heard while holding the breath, and on its own once the decision closes in, faster as it does
    if (snip.hold || tens > 0.15) { snip.beat = (snip.beat || 0) - dt; if (snip.beat <= 0) { sndBeat(); const sc = $('#scope'); sc.classList.add('beat'); setTimeout(() => sc.classList.remove('beat'), 110); snip.beat = (snip.hold ? 0.62 + snip.air * 0.35 : 1.15) * (1 - 0.4 * tens); } } else snip.beat = 0;
  }
  snip.wasHold = snip.hold;
  if (!snip.hold && snip.air <= 0.001) snip.air = 0.001;
  snip.wind = windFor(st);
  const steady = snip.hold && snip.gasp <= 0 ? 0.12 : snip.gasp > 0 ? 2.4 : 1;
  const sway = snip.scoped ? 0.0016 * steady * (0.55 + snip.zoom / 9) * (1 + 0.35 * tens) : 0;
  snip.kick *= Math.exp(-dt * 6);
  // the sight drifts like a body does: a slow breath with uneven ripples on top (frequencies that never line up)
  const wob = (f, ph) => Math.sin(snip.breath * f + ph) + 0.45 * Math.sin(snip.breath * f * 2.31 + ph * 1.7) + 0.2 * Math.sin(snip.breath * f * 4.73 + ph * 2.9);
  const shk = LENS.shake && snip.scoped ? LENS.shake * Math.sin(snip.breath * LENS.shakeF * 6.28) * (0.55 + snip.zoom / 9) : 0;
  const yaw = snip.yaw + shk + wob(0.9, 0) * sway * 0.62 + Math.sin(snip.breath * 0.45 + 1) * sway * 0.5 * snip.wind, pitch = snip.pitch + shk * 0.6 + wob(1.3, 2) * sway * 0.5 + snip.kick * 0.035 + (tens > 0 && snip.scoped ? Math.sin(snip.breath * 23) * Math.sin(snip.breath * 3.1) * 0.00018 * tens * (0.55 + snip.zoom / 9) : 0);
  const dir = new T.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
  snip.zoomCur = (snip.zoomCur || snip.zoom) + (snip.zoom - (snip.zoomCur || snip.zoom)) * (1 - Math.exp(-dt * 9));
  scopeCam.fov = Math.max(2.5, wide.fov / snip.zoomCur); scopeCam.aspect = innerWidth / innerHeight; scopeCam.updateProjectionMatrix();
  scopeCam.position.copy(SNIPER_POS); scopeCam.lookAt(SNIPER_POS.clone().add(dir));
  wide.position.copy(SNIPER_POS); wide.lookAt(WIDE_AIM);
  activeCam = snip.scoped ? scopeCam : wide;
  // aim point for the laser others see
  ray.set(SNIPER_POS, dir);
  const hit = ray.intersectObjects(occTargets().concat(FLOORS), true)[0];
  snip.aim.copy(hit ? hit.point : SNIPER_POS.clone().addScaledVector(dir, 45));
  stepNest(dt, snip.breath); stepLens(dt, st); stepIntro(dt, st);
  poseSniperView(dt, performance.now());
  if (NEST_FX.flashT > 0) NEST_FX.flash.visible = snip.scoped ? false : NEST_FX.flash.visible;
  // scope readouts: range, who is under the crosshair and what they are doing, wind, breath
  if (snip.scoped) {
    const d = hit ? hit.point.distanceTo(SNIPER_POS) : 0;
    const rt = d ? Math.round(d) + ' m' : '— m'; if ($('#siRange').textContent !== rt) $('#siRange').textContent = rt;
    let tt = '', sus = false;
    if (hit && hit.object.userData.eid !== undefined) { const e = st.ents.find(x => x.id === hit.object.userData.eid); if (e) { const o = outfitFor(st.sd, e.id, st); sus = GESTURE_ANIMS.has(e.anim); tt = o.name + ' · ' + (ANIM_LABEL[e.anim] || ''); if (snip.marks.includes(e.id)) tt = (snip.marks[0] === e.id ? '★ ' : '☆ ') + tt; } }
    else if (hit && hit.blocked !== undefined) tt = '';
    if (blackoutAt(st) > 0.5) { tt = ''; sus = false; } // in the dark the scope makes out no one
    const si = $('#siTarget'); if (si.textContent !== tt) si.textContent = tt; si.classList.toggle('sus', sus);
    const w = snip.wind, wt = w === 0 ? 'ar parado' : (Math.abs(w) === 1 ? 'brisa ' : 'ar agitado ') + (w < 0 ? '◀' : '▶'); if ($('#siWind').textContent !== wt) $('#siWind').textContent = wt;
    const br = $('#breath'); br.firstElementChild.style.height = (snip.air * 100).toFixed(0) + '%'; br.classList.toggle('gasp', snip.gasp > 0);
  }
  if (st.ph === 'play') scopeIdentify(dt, st);
  updateNotebook(st);
}
// the sniper's notebook: who is marked and what they are doing, plus the radio log of things that changed in the party
function updateNotebook(st) {
  if (G.role !== 's' || st.ph !== 'play') return;
  const sl = $('#suspectList'), rl = $('#radioLog'); if (!sl || !rl) return;
  const key = snip.marks.join(',') + '|' + snip.marks.map(id => { const e = st.ents.find(x => x.id === id); return e ? e.anim + ':' + lvOfY(e.y || 0) : ''; }).join(',') + '|' + st.tells.length + '|' + Object.keys(snip.idd || {}).length;
  if (key === snip.nbKey) return; snip.nbKey = key;
  sl.innerHTML = snip.marks.length ? snip.marks.map((id, i) => { const e = st.ents.find(x => x.id === id); const o = outfitFor(st.sd, id, st); const lv = e ? lvOfY(e.y || 0) : 0; return `<li class="${i === 0 ? 'first' : ''}"><b>${i === 0 ? 'Principal' : 'Suspeito ' + (i + 1)}</b> · ${esc(o.name)}<small>${e ? esc(ANIM_LABEL[e.anim] || '') : ''} · ${esc(lvLabel(lv))}</small></li>`; }).join('') : '<li class="muted">Mire num convidado e ' + (matchMedia('(pointer:coarse)').matches ? 'toque em <b>Marcar</b>' : 'aperte <kbd>F</kbd>') + ' para anotar.</li>';
  const tm = (o) => { const i = st.tells.indexOf(o); return i >= 0 ? '' : ''; };
  rl.innerHTML = st.tells.length ? st.tells.slice().reverse().map(o => `<li><b>${fmt(Math.max(0, (st.rt || ROUND_T) - (snip.tellAt && snip.tellAt[o] !== undefined ? snip.tellAt[o] : st.tl)))}</b>${snip.idd && snip.idd[o] ? `${esc(MISSIONS[o].label)} <span class="muted">· ${esc(MISSIONS[o].where)}</span>` : `Algo mudou <span class="muted">· ${esc(areaOf(o))} · enquadre com zoom</span>`}</li>`).join('') : '<li class="muted">Silêncio no rádio por enquanto.</li>';
}

function laserFor(st) {
  if (!st || G.screen !== 'game' || st.ph !== 'play' || G.role === 's') return null;
  if (st.aim) return st.aim;
  if (G.multi) {
    const sp = Object.keys(st.rl || {}).find(p => st.rl[p] === 's');
    const p = Net.peers().find(x => x.peer === sp);
    const a = p && p.presence.aim;
    if (Array.isArray(a) && a.length === 3) return new T.Vector3(a[0] / 20, a[1] / 20, a[2] / 20);
  }
  return null;
}

// ---------------------------------------------------------------- render
const tmpV = new T.Vector3();
function renderEnts(dt, st) {
  if (!st || !st.ents) return;
  if (st.sd !== CHAR_SEED || CHARS.length !== st.ents.length) buildChars(st);
  const t = performance.now() / 1000, k = 1 - Math.exp(-dt * (G.sim ? 30 : 10));
  for (const e of st.ents) {
    const c = CHAR_BY_ID.get(e.id); if (!c) continue;
    let x = e.x, z = e.z, y = e.y || 0, rot = e.rot, anim = e.anim;
    if (e.id === G.myEid && G.screen === 'game' && G.role && G.role !== 's') { x = ctrl.x; z = ctrl.z; y = ctrl.y; rot = ctrl.rot; anim = anim === 5 ? 5 : ctrl.anim; }
    const u = c.userData;
    if (!u.init) { u.x = x; u.z = z; u.y = y; u.rot = rot; u.init = true; }
    const own = e.id === G.myEid;
    const kk = own ? 1 : k;
    const ox = u.x, oz = u.z;
    u.x += (x - u.x) * kk; u.z += (z - u.z) * kk; u.y = (u.y ?? y) + (y - (u.y ?? y)) * kk; u.rot = lerpAngle(u.rot, rot, own ? 1 : Math.min(k, 1 - Math.exp(-dt * 9)));
    c.position.set(u.x, u.y, u.z); c.rotation.y = u.rot;
    // a guest standing or sitting nearby turns their head to follow the player walking past
    if (!own && G.role && G.role !== 's' && G.screen === 'game' && [0, 4, 6, 7, 12, 15, 17, 20].includes(anim) && Math.abs(ctrl.y - u.y) < 0.5) {
      const dx = ctrl.x - u.x, dz = ctrl.z - u.z, d = Math.hypot(dx, dz);
      let yaw = Math.atan2(dx, dz) - u.rot; yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
      const want = d < 3.4 && d > 0.3 && Math.abs(yaw) < 1.35 ? Math.max(-1.0, Math.min(1.0, yaw)) : null;
      u.look = u.look || { yaw: 0, w: 0 };
      const kl = 1 - Math.exp(-dt * 4);
      if (want !== null) { u.look.yaw += (want - u.look.yaw) * kl; u.look.w += (1 - u.look.w) * kl; } else u.look.w += (0 - u.look.w) * kl;
    } else if (u.look) u.look.w += (0 - u.look.w) * (1 - Math.exp(-dt * 4));
    const sp = Math.hypot(u.x - ox, u.z - oz) / Math.max(dt, 1e-3);
    if (anim === 7 || anim === 9 || anim === 12 || anim === 17) {
      if (u.seatAnim !== anim || Math.hypot(u.x - u.seatX, u.z - u.seatZ) > 0.15) { u.seatAnim = anim; u.seatX = u.x; u.seatZ = u.z; u.seatHy = undefined; let bd = 0.6; for (const sl of SLOTS) { if (sl.lv !== lvOfY(u.y) || SEAT_ANIM[sl.type] !== anim) continue; const d = Math.hypot(sl.x - u.x, sl.z - u.z); if (d < bd) { bd = d; u.seatHy = sl.hy; } } }
    } else u.seatAnim = -1;
    animChar(c, anim, t, anim !== 5 && !ACT_ANIM.has(anim) && sp > 0.4, dt, sp);
  }
  // rings
  const guest = G.screen === 'game' && G.role && G.role !== 's' && st.ph === 'play';
  RINGS.forEach((r, i) => {
    let op = 0;
    if (guest) op = G.role === 'a' ? (st.ms.some(o => MISSIONS[o].p === i && !st.dn.includes(o)) ? 0.75 : 0.0) : 0.4;
    r.material.opacity = op * (0.75 + Math.sin(t * 3 + i) * 0.25); r.visible = op > 0;
  });
  agentRing.visible = false; shotRing.visible = false;
  if (st.ph === 'reveal' && st.sh && st.why !== 'agent') { const c = CHARS[st.ents.findIndex(e => e.id === st.sh.e)]; if (c) { shotRing.visible = true; shotRing.position.set(c.position.x, c.position.y + 0.035, c.position.z); } }
  if (st.ph === 'reveal' && st.ag >= 0) { const c = CHARS[st.ents.findIndex(e => e.id === st.ag)]; if (c) { agentRing.visible = true; agentRing.position.set(c.position.x, c.position.y + 0.04, c.position.z); } }
  // laser
  const aim = laserFor(st);
  laser.visible = laserDot.visible = !!aim;
  if (aim) { const p = laserGeo.attributes.position; p.setXYZ(1, aim.x, aim.y, aim.z); p.needsUpdate = true; laserDot.position.copy(aim); }
}
function renderLabels(st) {
  const box = $('#labels'); const want = [];
  if (G.screen === 'game' && st && st.ents) {
    if (G.role === 's' && st.ph === 'play') snip.marks.forEach((id, i) => want.push({ id, text: i === 0 ? 'Suspeito principal' : 'Suspeito ' + (i + 1), cls: i === 0 ? 'mark first' : 'mark' }));
    if (st.ph === 'reveal') {
      for (const [peer, id] of Object.entries(st.pm || {})) want.push({ id, text: st.nm[peer] + (id === st.ag ? ' · agente' : ''), cls: id === st.ag ? 'mark agent' : 'mark name' });
      if (G.solo && st.ag >= 0 && !Object.values(st.pm).includes(st.ag)) want.push({ id: st.ag, text: 'Agente', cls: 'mark agent' });
    }
  }
  while (box.children.length < want.length) box.appendChild(document.createElement('div'));
  while (box.children.length > want.length) box.lastChild.remove();
  want.forEach((w, i) => {
    const el = box.children[i]; const entity = entitiesById(st).get(w.id); const c = CHAR_BY_ID.get(w.id);
    if (!c) { el.hidden = true; return; }
    tmpV.set(c.position.x, c.position.y + (c.userData.parts && entity.anim === 5 ? 0.6 : 2.0), c.position.z).project(activeCam);
    const vis = tmpV.z < 1 && Math.abs(tmpV.x) < 1.1 && Math.abs(tmpV.y) < 1.1;
    el.hidden = !vis; el.className = w.cls; if (el.textContent !== w.text) el.textContent = w.text;
    el.style.left = ((tmpV.x + 1) / 2 * innerWidth) + 'px'; el.style.top = ((1 - tmpV.y) / 2 * innerHeight) + 'px';
  });
}
let lastTimerText = '', hudMissionKey = '', hudProgressKey = '';
const HUD_NODES = {};
function hudNode(id) { return HUD_NODES[id] || (HUD_NODES[id] = document.getElementById(id)); }
// The closing of a round, heard by everyone in the game: a low drone that swells over the last 60 s (and from the
// moment the radio has counted NEED-1 changes), with a clock pulse that quickens; the overtime runs it at full. It cuts to
// silence the instant the round ends, so the shot or the last mission lands on a quiet beat.
const CRESC = { nodes: null, k: 0, pulse: 0 };
function crescNodes(ac) {
  const out = ac.createGain(); out.gain.value = 0; out.connect(ac.destination);
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.connect(out);
  const a = ac.createOscillator(), b = ac.createOscillator(); a.type = 'sawtooth'; b.type = 'sine'; a.frequency.value = 55; b.frequency.value = 110.6;
  const gb = ac.createGain(); gb.gain.value = 0.5; a.connect(lp); b.connect(gb); gb.connect(lp); a.start(); b.start();
  return { out, lp, a, b };
}
function stepCrescendo(dt, st) {
  const live = G.screen === 'game' && st && st.ph === 'play';
  const k = live ? (st.ot ? 1 : Math.max(st.tl < 60 ? 1 - st.tl / 60 : 0, st.tells.length >= NEED - 1 ? 0.4 : 0)) : 0;
  if (!CRESC.nodes && k <= 0) return;
  const ac = audio(); if (!ac) return;
  if (!CRESC.nodes) CRESC.nodes = crescNodes(ac);
  const n = CRESC.nodes, now = ac.currentTime;
  // ends cut fast (silence before the verdict); swells come in slowly
  n.out.gain.setTargetAtTime(0.045 * k * k, now, k < CRESC.k ? 0.05 : 0.8);
  n.lp.frequency.setTargetAtTime(180 + 900 * k, now, 0.8); n.a.frequency.setTargetAtTime(55 * (1 + 0.06 * k), now, 1.5);
  CRESC.k = k;
  if (k > 0.05) { CRESC.pulse -= dt; if (CRESC.pulse <= 0) { tone(st.ot ? 1320 : 990, 0.04, 0.012 + 0.02 * k, 'square'); CRESC.pulse = (st.ot ? 0.45 : 1.1) - 0.5 * k * (st.ot ? 0.3 : 1); } } else CRESC.pulse = 0;
}
// the rules on screen: the dark of the lights-out (nearly black for the sniper, dim at the party) and, for the agent under
// the pair rule, a gold ring under each accomplice
const contactRings = [];
function stepRuleView(st) {
  const live = G.screen === 'game' && st && st.ph === 'play', b = live ? blackoutAt(st) : 0, op = (b * (G.role === 's' ? 0.95 : 0.6)).toFixed(3);
  const bo = $('#blackout'); if (bo.style.opacity !== op) bo.style.opacity = op;
  const ids = live && G.role === 'a' && st.ru === 'dupla' && !st.pd ? Object.entries(st.pm || {}).filter(([p]) => st.rl[p] === 'c').map(([, id]) => id) : [];
  while (contactRings.length < ids.length) { const r = new T.Mesh(new T.RingGeometry(0.36, 0.46, 32), new T.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0.8, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.userData.noCol = true; scene.add(r); contactRings.push(r); }
  contactRings.forEach((r, i) => {
    const e = i < ids.length && st.ents.find(x => x.id === ids[i]), c = e && CHARS[st.ents.indexOf(e)];
    r.visible = !!(c && e.anim !== 5); if (r.visible) r.position.set(c.position.x, c.position.y + 0.034, c.position.z);
  });
}
function updateHUD(st) {
  if (G.screen !== 'game' || !st || st.ph !== 'play') return;
  const tt = fmt(st.tl); if (tt !== lastTimerText) { $('#timer').textContent = tt; lastTimerText = tt; $('#timer').classList.toggle('low', st.tl < 30); }
  { const tag = st.ot ? 'Prorrogação' : 'Rodada ' + st.rd + (st.ru ? ' · ' + RULES[st.ru].nome : ''); if ($('#roundTag').textContent !== tag) $('#roundTag').textContent = tag; }
  if (G.role === 'a') {
    const missionKey = st.sd + ':' + st.ms.join(',');
    if (missionKey !== hudMissionKey) { const list = $('#msList'); if (list) { list.innerHTML = st.ms.map(o => missionLi(o, st)).join(''); hudMissionKey = missionKey; hudProgressKey = ''; } }
    const dc = $('#dnCount'), pg = String(progOf(st)); if (dc && dc.textContent !== pg) dc.textContent = pg;
    const progressKey = st.dn.join(','); if (progressKey !== hudProgressKey) { document.querySelectorAll('#msList li').forEach(li => li.classList.toggle('done', st.dn.includes(+li.dataset.o))); hudProgressKey = progressKey; }
    const tn = $('#tsNote'); if (tn && st.ts) { const t = fetchNote(st); if (tn.innerHTML !== t) tn.innerHTML = t; }
  }
}

// publish to the room
function publish(now, st) {
  if (!G.multi || !Net.room || now - Net.lastPub < 85) return;
  Net.lastPub = now;
  const patch = {};
  if (G.isHost && G.sim) patch.g = encodeState(G.sim.state());
  if (G.screen === 'game' && st && st.ph === 'play') {
    if (G.role && G.role !== 's' && G.myEid >= 0 && !G.isHost) { patch.p = [Math.round(ctrl.x * 50), Math.round(ctrl.z * 50), Math.round(ctrl.rot * 100), ctrl.anim, Math.round(ctrl.y * 50)]; if (ctrl.actDone) patch.act = ctrl.actDone; }
    if (G.role === 's') { patch.aim = [Math.round(snip.aim.x * 20), Math.round(snip.aim.y * 20), Math.round(snip.aim.z * 20)]; }
  }
  if (Object.keys(patch).length) Net.set(patch);
}
function readHost() {
  if (!G.multi || !Net.room) return;
  const ps = Net.peers(); const h = hostOf(ps);
  G.hostPeer = h ? h.peer : null;
  const me = Net.me(); G.isHost = !!(h && me && h.peer === me.peer);
  if (h) G.claimed = false;
  if (G.isHost) return;
  if (!h) {
    if (G.claimed) { G.isHost = true; return; } // our host flag is still on its way to the others
    if (!G.hostGoneAt) G.hostGoneAt = performance.now(); const gone = (performance.now() - G.hostGoneAt) / 1000;
    // the longest-standing player left takes over the room
    const rest = ps.slice().sort((a, b) => (a.presence.j || 0) - (b.presence.j || 0));
    if (gone > 1.5 && G.lastHost && me && rest[0] && rest[0].peer === me.peer) { G.hostGoneAt = 0; becomeHost(); return; }
    if (gone > 12 && G.hostRaw) { toast('O anfitrião da sala saiu.', 'bad'); backToMenu(); }
    return;
  }
  if (G.hostGoneAt && G.hostPeer !== G.lastHost && G.lastHost) toast((h.presence.nm || 'Outro jogador') + ' assumiu a sala.');
  G.hostGoneAt = 0; G.lastHost = h.peer;
  if (G.sim && !G.solo) G.sim = null; // someone else holds the room (two claimed it at once): theirs wins
  const g = h.presence.g;
  if (g !== G.hostRaw) {
    G.hostRaw = g; const st = decodeState(g);
    if (st && st.ph === 'lobby') {
      Object.assign(G.scores, st.sc);
      if (G.screen === 'game') { G.screen = 'lobby'; G.hostState = null; G.seed = null; ['#hud', '#brief', '#reveal'].forEach(id => show(id, false)); show('#lobby', true); setScope(false); renderLobby(); }
    } else if (st) { G.hostState = st; if (G.screen === 'lobby') { G.screen = 'game'; show('#lobby', false); } }
  }
}

// ---------------------------------------------------------------- main loop
// where the subject sits on screen (isoState.sh, the tilt-shift focus follows): at the end of a round the agent is framed in
// the middle of the free space above the card; on a phone held upright the mission card and the timer take the top of the
// screen, so your own character is framed a little lower
const PHONE_UP = matchMedia('(orientation:portrait) and (max-width:700px)');
function isoLift(st) {
  if (G.screen !== 'game') return 0;
  if (st.ph === 'reveal') {
    const r = $('#reveal'); if (!(st.ag >= 0) || r.hidden) return 0;
    const top = r.getBoundingClientRect().top, H = innerHeight, f = Math.max(0.2, top / 2 / H); // where the agent should sit, from the top
    return Math.max(0, Math.min(0.6, 1 - 2 * f));
  }
  return PHONE_UP.matches && (G.role === 'a' || G.role === 'c') ? -0.3 : 0;
}
const renderOptions = {};
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  try {
    if (G.multi) { readHost(); if (!preparing && G.isHost && G.sim) hostReadPeers(); }
    const canvasOpacity = G.screen === 'game' ? '1' : '0'; if (canvas.style.opacity !== canvasOpacity) canvas.style.opacity = canvasOpacity;
    if (preparing || G.screen !== 'game') { quality.reset(now); requestAnimationFrame(frame); return; }
    if (G.sim && G.role === 's' && !G.sim.ai) G.sim.laser = snip.aim; // the host is the sniper
    if (!preparing && G.sim) { if (PERF.enabled) PERF.measure('simulation', () => G.sim.tick(dt)); else G.sim.tick(dt); }
    if (G.backdrop && G.screen !== 'game') G.backdrop.tick(dt);
    const st = currentState();
    if (INTRO.on && !(st && st.ph === 'play' && G.screen === 'game' && G.role === 's')) introEnd(); // the round ended or the player left
    stepCrescendo(dt, st);
    stepGIntro(st);
    if (st && st.ents) {
      if (syncRound(st) === false) { requestAnimationFrame(frame); return; }
      if (PERF.enabled) PERF.measure('controller', () => updateLocal(dt, st)); else updateLocal(dt, st);
      if (G.screen === 'game' && G.role === 's' && st.ph === 'reveal' && !snip.killcam && NEST_FX.case) stepNest(dt, snip.breath += dt); // the case still bounces (and tinks) behind the reveal
      if (G.screen === 'game' && G.role === 's' && (st.ph !== 'reveal' || snip.killcam)) updateSniper(dt, st);
      else {
        canvas.classList.remove('blur'); activeCam = iso;
        if (G.screen !== 'game' && !window.__noOrbit) { isoState.az += dt * 0.04; isoState.tx = Math.sin(now / 9000) * 3; isoState.tz = 0; }
        if (G.screen === 'game' && st.ph === 'reveal' && st.ag >= 0) { const e = st.ents.find(x => x.id === st.ag); if (e) { isoState.tx = e.x; isoState.tz = e.z; isoState.ty = e.y || 0; } }
        isoState.sh = isoLift(st);
        if (G.screen !== 'game') isoState.ty = 0;
        placeIso(dt);
      }
      if (PERF.enabled) PERF.measure('characters', () => renderEnts(dt, st)); else renderEnts(dt, st);
      if (PERF.enabled) PERF.measure('interface', () => { updateHUD(st); stepRuleView(st); renderLabels(st); });
      else { updateHUD(st); stepRuleView(st); renderLabels(st); }
    }
    stepFX(dt); if (SCEN.K) { try { SCEN.K.update(dt, now / 1000); } catch (e) { } }
    if (PERF.enabled) PERF.measure('effects', () => updateDecorativeDetail(dt)); else updateDecorativeDetail(dt);
    publish(now, st); ambUpdate();
    if (document.hidden) { quality.reset(now); requestAnimationFrame(frame); return; }
    renderOptions.tilt = activeCam === iso ? (G.screen === 'game' ? 1 : 1.15) : 0;
    renderOptions.blurAll = activeCam === wide && G.screen === 'game' && st && st.ph === 'play' ? 0.22 : 0;
    renderOptions.focus = activeCam === iso ? 0.5 + (iso.userData.sh || 0) / 2 : 0.5;
    renderOptions.vig = activeCam === scopeCam ? 0.12 : 0.32;
    renderOptions.exposure = 0.86 * (SCEN.exposure || 1);
    if (PERF.enabled) PERF.measure('render', () => renderFrame(dt, renderOptions)); else renderFrame(dt, renderOptions);
    quality.sample(now, !preparing && !document.hidden && G.screen === 'game');
  } catch (err) { console.error(err); }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- buttons + boot
$('#qualitySel').value = quality.mode; $('#qualitySel').onchange = e => { quality.set(e.target.value); $('#qualityControl').open = false; };
addEventListener('visibilitychange', () => { quality.reset(performance.now()); last = performance.now(); });
$('#btnCreate').onclick = () => createRoom();
$('#btnJoin').onclick = () => joinRoom();
$('#btnInvite').onclick = () => enterRoom(inviteCode, false);
document.querySelectorAll('#langs button').forEach(b => { const I = window.MIRA_IDIOMA; b.classList.toggle('on', (I ? I.lang : 'pt') === b.dataset.lang); b.onclick = () => { if (I && I.lang !== b.dataset.lang) I.set(b.dataset.lang); }; });
$('#btnShare').onclick = () => shareInvite();
$('#btnCopy').onclick = () => copyInvite();
$('#btnSoloS').onclick = () => startSolo('sniper');
$('#btnSoloA').onclick = () => startSolo('agent');
$('#btnStart').onclick = () => { if (G.isHost) hostStart(); };
$('#btnLeave').onclick = () => backToMenu();
$('#btnNext').onclick = () => {
  if (G.multi) { if (G.isHost) { show('#reveal', false); hostStart(); } }
  else { show('#reveal', false); startSolo(G.solo); }
};
$('#btnMenu').onclick = () => { if (G.multi && G.isHost) hostToLobby(); else backToMenu(); };
const mapSels = [$('#mapSel'), $('#mapSelLobby')];
for (const sel of mapSels) {
  const addOpt = (v, t) => { const o = document.createElement('option'); o.value = v; o.textContent = t; sel.appendChild(o); };
  addOpt('0', 'Cobertura · seis andares'); addOpt('n', 'Cobertura à noite · seis andares, luz de neon'); SCENARIOS.forEach((sc, i) => addOpt(String(i + 1), sc.nome + ' · ' + sc.lugar)); addOpt('r', 'Sortear um cenário a cada rodada');
  sel.onchange = () => { for (const s2 of mapSels) s2.value = sel.value; try { localStorage.setItem('mira-mapa', sel.value); } catch (e) { } };
}
try { const v = localStorage.getItem('mira-mapa'); if (v !== null && [...$('#mapSel').options].some(o => o.value === v)) mapSels.forEach(s2 => s2.value = v); } catch (e) { }
function mapChoice() { return mapPick().id; }
// the map for the next round: a scenario id, plus the night flag for the rooftop ('n'); 'r' draws among all of them
// the rule of the next multiplayer round: the one the host chose, or on "surprise" one of them in half the rounds
function rulePick() { const v = $('#ruleSel').value, ks = Object.keys(RULES); if (v === 's') return rnd() < 0.5 ? ks[Math.floor(rnd() * ks.length)] : null; return RULES[v] ? v : null; }
function mapPick() { const v = $('#mapSel').value; if (v === 'n') return { id: 0, night: true }; if (v === 'r') { const k = Math.floor(rnd() * (SCENARIOS.length + 2)); return k > SCENARIOS.length ? { id: 0, night: true } : { id: k, night: false }; } return { id: Math.max(0, Math.min(SCENARIOS.length, +v || 0)), night: false }; }

setupPost();
G.backdrop = null; resize();
$('#loading').hidden = true; show('#menu', true);
requestAnimationFrame(frame);
$('#multiBox').hidden = true; $('#multiOff').hidden = false; $('#multiOff').textContent = 'Conectando ao modo multijogador…';
Net.init().then(ok => {
  $('#multiBox').hidden = !ok; $('#multiOff').hidden = ok;
  // invited by link: whoever already has a name goes straight in; a first-timer types a name and taps the one button
  if (ok && inviteCode && G.screen === 'menu') { showInvite(); if (storedName) setTimeout(() => { if (G.screen === 'menu') enterRoom(inviteCode, false); }, 400); else $('#nome').focus(); }
  if (!ok) $('#multiOff').textContent = 'O modo multijogador não está disponível nesta visualização. Os treinos abaixo funcionam normalmente.';
});
window.__mira = { get readyMapId() { return readyMapId; }, renderOnce: () => renderFrame(0, renderOptions), quality, perf: PERF, ensureMapAssets, prepareMap, SNIPER_VIEW, NEST, NEST_FX, spotVisible, areaOf, makeChar, outfitFor, animChar, get PROPS() { return PROPS; }, get MISSIONS() { return MISSIONS; }, Sim, ROUND_T, GESTURES, renderer, charGroup, mergeable, SNIPER_POS, LVY, loadMap, SCEN, SCENARIOS, get LEVELS() { return LEVELS; }, get LINKS() { return LINKS; }, get STATICS() { return STATICS; }, get FLOORS() { return FLOORS; }, get BAR_ZONES() { return BAR_ZONES; }, mapChoice, wide, fitWide, SCENE_BOX, WIDE_AIM, get RINGS() { return RINGS; }, resolveH, applyTell, resetProps, stepFX, FX, SPAWNED, UNDO, H, OCCLUDERS, updateSniper, scopeCam, crosshairHit, NAV, navPath, navFree, navBuild, navSight, navNearest, navCell, COLS, interactAt, encodeState, iso, isoState, placeIso, updateLocal, CHARS: () => CHARS, G, Net, ctrl, snip, SLOTS, get MISSIONS() { return MISSIONS; }, blocked, DH, linkPos, route, nearInteraction, tryAct, startClimb, applyTell, get bloom() { return bloomPass; }, get fin() { return finalPass; }, get composer() { return composer; }, rebuildPost, get postMS() { return postMS; }, scene, sun, get st() { return currentState(); }, FPS };
// missions: what the tests of the mission area read (kept on its own line so areas do not collide on the line above)
Object.assign(window.__mira, { makeChallenge, missionAtProp, SCEN_ACTS, fxApply, nearInteraction, pickGuestTarget, LINK_LEN, botActTime, challengeProgress, THEMES });
Object.assign(window.__mira, { LURE, lurePts, decodeState, adoptSim, toggleLure });
Object.assign(window.__mira, { RULES, blackoutAt, progOf, rulePick });
// sniper: what the sniper's tests and the balance tuning read
Object.assign(window.__mira, { AI_SNIPER, LENS, NEST_MOODS, INTRO, CRESC, shoot, setScope });
// characters: what the tests of the character area read
Object.assign(window.__mira, { actAnimFor });
// menu, invite, guest tutorial, reveal: what their tests read
Object.assign(window.__mira, { GINTRO, meTag, floorTag, renderReveal, SESS });
})();
