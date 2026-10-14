// 04 · Gala no Museu: jantar de gala e leilão beneficente no Salão dos Gigantes de um museu de história natural, à noite.
// O sniper está no telhado do Edifício Aurora, do outro lado da avenida, mirando pelo janelão aberto da fachada.
// T-rex no centro, baleia azul suspensa por cabos, vitrines de gemas e do meteorito, elefante empalhado,
// escadaria dupla até o mezanino com a galeria de fósseis e a tribuna do leiloeiro diante do telão.
MIRA_CENARIOS.push({
  id: 'museu',
  nome: 'Gala no Museu',
  lugar: 'Salão dos Gigantes, Museu de História Natural',
  hora: 'noite de gala beneficente',
  resumo: 'Jantar black-tie aos pés de um T-rex, baleia azul pendurada sobre as mesas, gemas e um meteorito sob vitrines, e um leilão de fósseis comandado do mezanino diante do telão.',
  sniper: { pos: [2, 18.2, 45.2], desc: 'telhado do Edifício Aurora, do outro lado da avenida, pelo janelão aberto da fachada' },
  niveis: [
    { nome: 'Salão dos Gigantes', y: 0, x0: -14.5, x1: 14.5, z0: -8.0, z1: 10.0 },
    { nome: 'mezanino da galeria de fósseis', y: 3.6, x0: -13, x1: 13, z0: -11.4, z1: -6.6 },
  ],
  escadas: [
    { de: 0, para: 1, a: [-9.15, -7.3], b: [-2.6, -7.5], rotulo: 'escadaria oeste ao mezanino' },
    { de: 0, para: 1, a: [9.15, -7.3], b: [2.6, -7.5], rotulo: 'escadaria leste ao mezanino' },
  ],
  convidados: 28,
  inicio: [9.0, 9.4, 0],
  ambiente: {
    ceu: ['#04060d', '#0a1126', '#18224a', '#3a3358'], neblina: [0x0f1428, 60, 180], hemi: [0x8ea4d6, 0x3a2c22, 0.2],
    sol: [0xa8b8ff, 0.5, -14, 26, 18], preenche: [0xffb070, 0.26], exposicao: 0.86, bloom: 0.7,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [22, 22, 23, 0], talk: [4, 4, 4, 22] },
  guardaRoupa: {
    ternos: [[0x15151a, 'smoking preto'], [0x1a2238, 'smoking azul-meia-noite'], [0xece6da, 'dinner jacket marfim'], [0x2a1f2e, 'smoking ameixa'], [0x101014, 'fraque preto'], [0x3a1e24, 'smoking de veludo bordô']],
    vestidos: [[0x0f0f14, 'longo preto'], [0xb8a27a, 'vestido champanhe'], [0x7a1022, 'vestido rubi'], [0x1d2f6b, 'vestido safira'], [0xcfc8d8, 'vestido prata'], [0x5a2a6a, 'vestido ametista'], [0xe8dcc8, 'vestido marfim']],
    vestidoChance: 0.5, longo: 0.92, tacas: ['coupe', 'coupe', 'wine', 'tumbler'], drinks: [0xf2d27a, 0xf6e7b0, 0x8a1020, 0xd98a2a],
    extra(o, r) {
      if (!o.dress) {
        o.bow = r() < 0.8; o.tie = r() < 0.85 ? 0x101014 : 0x8a1020; o.shirt = 0xf6f3ec; if (r() < 0.5) o.pocket = 0xf6f3ec;
        if (r() < 0.12) { o.prop = 'cane'; o.name += ', bengala'; }
        else if (r() < 0.12) { o.scarf = 0xf6f3ec; o.name += ', cachecol de seda branco'; }
        if (r() < 0.07) { o.glasses = 'monocle'; o.name += ', monóculo'; }
      } else {
        if (r() < 0.35) { o.gloves = r() < 0.6 ? 0xf6f3ec : 0x101014; o.name += o.gloves === 0xf6f3ec ? ', luvas de ópera brancas' : ', luvas de ópera pretas'; }
        if (r() < 0.16) { o.cape = 0xf0ece4; o.name += ', estola de pele'; }
        if (r() < 0.18) { o.propL = 'fan'; o.propColor = [0x101014, 0xd9a441, 0xf6f3ec][Math.floor(r() * 3)]; o.clutch = false; o.name += ', leque'; }
        if (r() < 0.4) { o.necklace = true; o.name += ', colar de pérolas'; }
      }
      if (!o.propL && r() < 0.14) { o.propL = 'book'; o.propColor = 0x1a2238; o.name += ', catálogo do leilão'; }
    },
  },
  elenco: [
    { x: -10.3, z: -5.0, rot: -2.46, anim: 4, fala: 'A Estrela de Bengala tem 563 quilates. Não encoste no vidro.', outfit: { dress: true, gown: false, main: 0x1d3a5a, skin: 1, hair: 0x9a9a9a, hairStyle: 'bob', glasses: 'round', prop: 'tablet', earring: true, accent: 0xd9a441, shoe: 0x101014, name: 'curadora Dra. Helena Vasconcelos, de óculos redondos e tablet' } },
    { x: 0, z: -7.55, lv: 1, rot: 0, anim: 14, fala: 'Dou-lhe uma, dou-lhe duas…', outfit: { dress: false, main: 0x101014, pants: 0x55555e, shirt: 0xf6f3ec, tie: 0xb8b8c0, skin: 0, hair: 0xd8d8d8, hairStyle: 'quiff', pocket: 0xf6f3ec, coat: 0x101014, gloves: 0xf6f3ec, prop: 'gavel', name: 'leiloeiro Augusto Bellini, de fraque e martelo' } },
    { x: -9.9, z: 1.6, rot: 1.2, anim: 0, fala: 'Central, aqui é o Marcão. Meteorito sem novidade.', outfit: { dress: false, main: 0x0c0c0e, pants: 0x0c0c0e, shirt: 0xf6f3ec, tie: 0x0c0c0e, skin: 4, hair: 0x1a1411, hairStyle: 'short', glasses: 'sun', prop: 'radio', name: 'segurança Marcão, de terno preto, óculos escuros e rádio' } },
    { x: -6.1, z: 1.4, rot: 1.57, anim: 2, fala: 'Repare na vértebra caudal 31: ainda tem marca de dente.', outfit: { dress: false, main: 0xa8915a, pants: 0x5a4a32, shirt: 0xe8e0cc, tie: 0x6b3a1a, bow: true, skin: 2, hair: 0x9a9a9a, hairStyle: 'short', beard: true, hat: 'fedora', hatColor: 0x8a7a5a, hatBand: 0x3a2a1a, prop: 'magnifier', name: 'paleontólogo Prof. Tavares, de colete cáqui, chapéu e lupa' } },
    { x: 7.6, z: -3.0, rot: -1.9, anim: 6, fala: 'Dois milhões. E nem pisquem.', outfit: { dress: true, gown: true, satin: true, main: 0x0f7a52, skin: 0, hair: 0x3b2a1e, hairStyle: 'bun', necklace: true, earring: true, accent: 0xe8e8f0, hat: 'tiara', gloves: 0xf6f3ec, shoe: 0xd9a441, name: 'mecenas Dona Beatriz Ferraz, de vestido esmeralda e tiara' } },
    { x: -4.4, z: 3.9, rot: 1.2, anim: 10, fala: 'Champanhe, senhor? É safra do ano do meteorito.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x101014, shirt: 0xf6f3ec, tie: 0x101014, bow: true, skin: 3, hair: 0x1a1411, hairStyle: 'short', gloves: 0xf6f3ec, prop: 'tray', name: 'garçom Severino, de jaqueta branca e bandeja' } },
    { x: -5.9, z: -10.0, lv: 1, rot: Math.PI, anim: 14, fala: 'Cento e cinquenta milhões de anos e ainda pega poeira.', outfit: { dress: false, main: 0x4a4a46, pants: 0x3a3a36, shirt: 0xd8d0c0, tie: 0x6a3a22, skin: 1, hair: 0x6b4a2b, hairStyle: 'short', beard: true, apron: 0x7a6a50, glasses: 'goggles', maskColor: 0x9fc0d0, hat: 'beret', hatColor: 0x2a2a30, prop: 'brush', name: 'restaurador Ícaro, de avental e pincel' } },
    { x: -8.9, z: 7.0, rot: -2.05, anim: 4, fala: 'Tenho dois desses em casa. Empalhados por mim.', outfit: { dress: false, main: 0x3a1e4a, pants: 0x1a1a1e, shirt: 0xf6f3ec, tie: 0xd9a441, bow: true, skin: 0, hair: 0xa9a9a9, hairStyle: 'quiff', beard: true, glasses: 'monocle', hat: 'top', hatColor: 0x16161a, hatBand: 0x6b3f8c, gloves: 0xf6f3ec, prop: 'cane', name: 'colecionador Barão von Hoff, de monóculo, cartola e bengala' } },
  ],
  missoes: [
    { k: 'gema', label: 'Trocar a Estrela de Bengala por uma réplica', where: 'vitrine das gemas, fundo à esquerda', s: [-11.6, -5.5], l: [-11.6, -6.6] },
    { k: 'rastreador', label: 'Colar o rastreador no crânio do T-rex', where: 'pedestal do T-rex, lado da cabeça', s: [4.0, 3.75], l: [3.8, 1.4] },
    { k: 'telao', label: 'Mexer no lance do telão', where: 'mesa de projeção, mezanino', s: [5.4, -9.9], l: [5.4, -10.9], lv: 1 },
    { k: 'baleia', label: 'Soltar um cabo da baleia', where: 'guincho na balaustrada do mezanino', s: [-7.4, -8.6], l: [-7.4, -8.05], lv: 1 },
    { k: 'meteorito', label: 'Apagar a luz da vitrine do meteorito', where: 'vitrine do meteorito, à esquerda', s: [-10.1, -0.8], l: [-11.8, -0.8] },
    { k: 'catalogo', label: 'Trocar o catálogo do leilão', where: 'púlpito dos catálogos, na entrada', s: [1.0, 8.55], l: [1.0, 9.35] },
    { k: 'elefante', label: 'Esconder o microfilme na tromba do elefante', where: 'elefante empalhado, frente à esquerda', s: [-9.1, 5.6], l: [-10.4, 5.6] },
    { k: 'magnum', label: 'Trocar a magnum de 1907 do bar', where: 'bar de champanhe, à direita', s: [11.5, -1.0], l: [12.6, -1.0] },
    { k: 'casaco', label: 'Trocar o casaco de vison no guarda-volumes', where: 'guarda-volumes, fundo à direita', s: [11.0, -5.1], l: [11.0, -6.9] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r;
    // ------------------------------------------------------------ materiais e texturas
    const marble = K.mat(0xeee8dc, { roughness: 0.32, metalness: 0.02 }), marbleV = K.mat(0xd9d0c0, { roughness: 0.4 }), granite = K.mat(0x1c1e22, { roughness: 0.3, metalness: 0.15 });
    const gilt = K.metal(0xd4a34a, 0.25), velvet = K.mat(0x3c0610, { roughness: 0.95, envMapIntensity: 0.1 }), oakDark = K.mat(0x3a2414, { roughness: 0.55 }), lacquer = K.mat(0x121216, { roughness: 0.2, metalness: 0.2 });
    const ivory = K.mat(0xefe6cc, { roughness: 0.5 }), brassD = K.metal(0x9a7a3a, 0.4);
    const floorTex = K.canvasTex(1024, 1024, (g, w, h) => {
      const n = 8, s = w / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const dk = (i + j) % 2, v = R() * 10 - 5;
        g.fillStyle = dk ? `rgb(${30 + v},${44 + v},${40 + v})` : `rgb(${206 + v},${194 + v},${172 + v})`; g.fillRect(i * s, j * s, s, s);
        for (let k = 0; k < 14; k++) { g.strokeStyle = dk ? 'rgba(160,190,170,.14)' : 'rgba(120,110,100,.14)'; g.lineWidth = 0.8 + R() * 1.6; g.beginPath(); const x = i * s + R() * s, y = j * s + R() * s; g.moveTo(x, y); g.bezierCurveTo(x + R() * 50 - 25, y + R() * 50 - 25, x + R() * 70 - 35, y + R() * 70 - 35, x + R() * 110 - 55, y + R() * 110 - 55); g.stroke(); }
      }
      g.strokeStyle = 'rgba(190,150,70,.55)'; g.lineWidth = 3; for (let k = 0; k <= n; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke(); }
      K.grain(g, w, h, 8);
    }, [3, 1.85]);
    floorTex.rotation = Math.PI / 4; floorTex.center.set(0.5, 0.5);
    K.floor(-14.8, -8.1, 14.8, 10.0, floorTex, { m: { roughness: 0.22, metalness: 0.06, envMapIntensity: 0.7 } });
    const stoneTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#cdbd9e'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(${170 + R() * 50},${160 + R() * 40},${130 + R() * 40},${R() * 0.09})`; g.fillRect(R() * w, R() * h, 2 + R() * 7, 2 + R() * 7); }
      g.strokeStyle = 'rgba(120,100,80,.35)'; g.lineWidth = 2;
      for (let r = 0; r < 8; r++) { g.beginPath(); g.moveTo(0, r * 64); g.lineTo(w, r * 64); g.stroke(); for (let c = 0; c < 4; c++) { const x = c * 128 + (r % 2) * 64; g.beginPath(); g.moveTo(x, r * 64); g.lineTo(x, r * 64 + 64); g.stroke(); } }
      K.grain(g, w, h, 6);
    }, [0.25, 0.25]);
    const stoneM = K.texMat(stoneTex, { roughness: 0.8 });
    const stoneBox = (w, h, d, x, y, z) => { const t = stoneTex.clone(); t.needsUpdate = true; t.repeat.set(w / 4, h / 4); return K.box(w, h, d, K.texMat(t, { roughness: 0.8 }), x, y, z); };

    // ------------------------------------------------------------ helpers de ossos (geometria fundida com cor por vértice)
    const UP = new T.Vector3(0, 1, 0), v3 = (a) => new T.Vector3(a[0], a[1], a[2]);
    const boneG = (a, b, r, r2) => { const A = v3(a), B = v3(b), d = B.clone().sub(A), L = Math.max(0.001, d.length()); const g = new T.CylinderGeometry(r2 ?? r * 0.8, r, L, 6); g.translate(0, L / 2, 0); g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion().setFromUnitVectors(UP, d.normalize()))); g.translate(A.x, A.y, A.z); return g; };
    const ballG = (p, r) => new T.SphereGeometry(r, 7, 5).translate(p[0], p[1], p[2]);
    const boxG = (w, h, d, p, rz = 0, ry = 0) => { const g = new T.BoxGeometry(w, h, d); g.rotateZ(rz); g.rotateY(ry); return g.translate(p[0], p[1], p[2]); };
    const B1 = 0xb89868, B2 = 0x9e7e52, B3 = 0x7a5e3a, DK = 0x2a2016;
    const boneMat = K.vcol({ roughness: 0.82 }), rodMat = K.vcol({ roughness: 0.35, metalness: 0.8 });

    // terópode (T-rex e, em escala, o velociraptor da galeria): coordenadas locais, pés em y=0, olhando para +x
    const theropod = (ox, oy, oz, s, rods) => {
      const parts = [], skull = [], rp = [];
      const P = (x, y, z = 0) => [ox + x * s, oy + y * s, oz + z * s];
      const bn = (a, b, r, r2, c = B1, tg = parts) => tg.push([boneG(P(...a), P(...b), r * s, (r2 ?? r * 0.8) * s), c]);
      const ball = (a, r, c = B2, tg = parts) => tg.push([ballG(P(...a), r * s), c]);
      const sp = [[-5.0, 0.7], [-4.0, 1.35], [-2.8, 2.05], [-1.5, 2.5], [-0.5, 2.65], [0.6, 2.5], [1.5, 2.3], [2.1, 2.45], [2.5, 2.8], [2.85, 3.05]];
      const curve = new T.CatmullRomCurve3(sp.map(p => new T.Vector3(p[0], p[1], 0)));
      const N = 46;
      for (let i = 0; i < N; i++) {
        const u = i / (N - 1) * 0.97, p = curve.getPointAt(u), t = curve.getTangentAt(u), n = new T.Vector3(-t.y, t.x, 0);
        const sz = p.x < -0.5 ? 0.3 + 0.7 * (p.x + 5) / 4.5 : 1 - 0.25 * (p.x + 0.5) / 3.35;
        bn(p.clone().addScaledVector(t, -0.05 * sz).toArray(), p.clone().addScaledVector(t, 0.05 * sz).toArray(), 0.075 * sz, 0.075 * sz, i % 2 ? B1 : B2);
        bn(p.toArray(), p.clone().addScaledVector(n, (p.x < -0.5 ? 0.22 : 0.34) * sz).toArray(), 0.03 * sz, 0.016 * sz, B1);
        if (p.x < -0.9) bn(p.toArray(), p.clone().addScaledVector(n, -0.24 * sz).addScaledVector(t, -0.06).toArray(), 0.022 * sz, 0.01 * sz, B2);
        if (p.x > -0.5 && p.x < 1.7) for (const sd of [-1, 1]) bn(p.toArray(), [p.x, p.y + 0.02, sd * 0.17 * sz], 0.024 * sz, 0.016 * sz, B2);
      }
      const sy = (x) => { const k = [[-0.5, 2.65], [0.6, 2.5], [1.5, 2.3], [2.1, 2.45]]; for (let i = 0; i < 3; i++) if (x <= k[i + 1][0]) { const u = (x - k[i][0]) / (k[i + 1][0] - k[i][0]); return k[i][1] + (k[i + 1][1] - k[i][1]) * u; } return 2.45; };
      for (let i = 0; i < 9; i++) {
        const x = -0.15 + i * 0.2, y = sy(x), L = 0.6 + 0.4 * Math.sin((i + 0.5) / 9 * Math.PI);
        for (const sd of [-1, 1]) { const pts = [[x, y - 0.04, sd * 0.12], [x + 0.04, y - 0.3 * L, sd * 0.45 * L], [x + 0.12, y - 0.9 * L, sd * 0.58 * L], [x + 0.22, y - 1.4 * L, sd * 0.36 * L], [x + 0.26, y - 1.62 * L, sd * 0.08]]; for (let k = 0; k < 4; k++) bn(pts[k], pts[k + 1], 0.034, 0.03, k % 2 ? B1 : B2); }
      }
      for (let i = 0; i < 7; i++) { const x = -0.2 + i * 0.25, y = 1.05 - Math.sin(i / 6 * Math.PI) * 0.1; bn([x, y, -0.3], [x + 0.12, y - 0.05, 0], 0.02, 0.015, B3); bn([x + 0.12, y - 0.05, 0], [x, y, 0.3], 0.015, 0.02, B3); }
      for (const sd of [-1, 1]) {
        parts.push([boxG(1.1 * s, 0.42 * s, 0.06 * s, P(-0.6, 2.42, sd * 0.2), 0.05), B2]);
        bn([-0.45, 2.3, sd * 0.15], [0.1, 1.35, sd * 0.07], 0.07, 0.055, B2); bn([-0.85, 2.25, sd * 0.15], [-1.35, 1.7, sd * 0.06], 0.06, 0.03, B2);
        // braços minúsculos
        bn([1.15, 2.25, sd * 0.28], [1.55, 1.85, sd * 0.36], 0.07, 0.04, B2); bn([1.55, 1.85, sd * 0.36], [1.82, 1.5, sd * 0.4], 0.04, 0.035); bn([1.82, 1.5, sd * 0.4], [2.05, 1.6, sd * 0.38], 0.03, 0.025);
        bn([2.05, 1.6, sd * 0.38], [2.18, 1.5, sd * 0.36], 0.015, 0.006, B3); bn([2.05, 1.6, sd * 0.38], [2.2, 1.58, sd * 0.42], 0.015, 0.006, B3);
      }
      ball([0.12, 1.32, 0], 0.13, B2);
      const legs = [[[-0.55, 2.3, 0.38], [0.25, 1.3, 0.4], [-0.05, 0.3, 0.36], [0.35, 0.06, 0.36]], [[-0.55, 2.3, -0.38], [0.0, 1.25, -0.4], [-0.7, 0.4, -0.36], [-0.4, 0.06, -0.36]]];
      for (const [hip, knee, ank, foot] of legs) {
        ball(hip, 0.15); bn(hip, knee, 0.13, 0.1, B1); ball(knee, 0.12); bn(knee, ank, 0.1, 0.07, B1); bn([knee[0] - 0.08, knee[1], knee[2]], [ank[0] + 0.04, ank[1] + 0.05, ank[2]], 0.035, 0.03, B2);
        ball(ank, 0.09); bn(ank, foot, 0.07, 0.05, B2);
        for (const dz of [-0.12, 0, 0.12]) { const tip = [foot[0] + 0.42 - Math.abs(dz) * 0.5, 0.03, foot[2] + dz]; bn(foot, tip, 0.045, 0.03, B2); bn(tip, [tip[0] + 0.1, 0.0, tip[2]], 0.03, 0.004, DK); }
      }
      // crânio
      skull.push([boxG(0.95 * s, 0.55 * s, 0.45 * s, P(3.35, 3.15, 0), -0.06), B1], [boxG(0.72 * s, 0.38 * s, 0.32 * s, P(4.02, 3.03, 0), -0.1), B1], [boxG(0.35 * s, 0.22 * s, 0.5 * s, P(3.05, 3.2, 0)), B2]);
      for (const sd of [-1, 1]) { skull.push([ballG(P(3.18, 3.24, sd * 0.2), 0.1 * s), DK], [ballG(P(3.62, 3.08, sd * 0.15), 0.11 * s), DK], [ballG(P(4.28, 3.06, sd * 0.13), 0.05 * s), DK], [ballG(P(3.2, 3.42, sd * 0.15), 0.07 * s), B2]); }
      skull.push([boxG(1.15 * s, 0.2 * s, 0.4 * s, P(3.6, 2.62, 0), -0.22), B2]);
      for (let x = 3.25; x <= 4.3; x += 0.085) for (const sd of [-1, 1]) { skull.push([new T.ConeGeometry(0.022 * s, 0.12 * s, 5).rotateX(Math.PI).translate(...P(x, 2.8, sd * 0.135)), 0xf3ead2]); if (x > 3.2 && x < 4.12) skull.push([new T.ConeGeometry(0.02 * s, 0.1 * s, 5).translate(...P(x, 2.74 - (x - 3.6) * 0.223 + 0.04, sd * 0.13)), 0xf3ead2]); }
      if (rods) for (const [x, y] of [[-0.5, 2.6], [1.0, 2.4], [-2.8, 1.95], [2.45, 2.7]]) rp.push([boneG(P(x, 0, 0), P(x, y - 0.05, 0), 0.025, 0.025), 0x2a2a2e]);
      const body = K.merge(parts, boneMat), sk = K.merge(skull, boneMat);
      if (rp.length) K.merge(rp, rodMat);
      return { body, sk, P };
    };

    // ------------------------------------------------------------ pódio do museu, laterais baixas, escadaria da entrada
    K.box(29.8, 0.9, 22.4, K.mat(0x8a8274, { roughness: 0.9 }), 0, -0.47, -1.1, { cast: false });
    for (let k = 0; k < 3; k++) K.box(29.8 + k * 0.6, 0.3, 0.5, marbleV, 0, -0.15 - k * 0.3, 10.25 + k * 0.5, { cast: false });
    for (const sx of [-1, 1]) {
      stoneBox(0.5, 1.1, 18.2, sx * 15.05, 0.55, 0.95); K.box(0.7, 0.12, 18.4, marble, sx * 15.05, 1.16, 0.95);
      for (let z = -6.5; z <= 9.5; z += 4) { K.box(0.8, 1.9, 0.8, marble, sx * 15.05, 0.95, z); K.box(0.95, 0.14, 0.95, gilt, sx * 15.05, 1.95, z); K.lathe([[0, 0], [0.18, 0], [0.26, 0.22], [0.2, 0.34], [0.24, 0.42], [0, 0.42]], marbleV, sx * 15.05, 2.02, z, {}, 12); }
    }

    // ------------------------------------------------------------ parede do fundo: arcos, janelões, frontão, cúpula de vidro
    { const sh = new T.Shape(); sh.moveTo(-15.2, 0); sh.lineTo(15.2, 0); sh.lineTo(15.2, 12.2); sh.lineTo(-15.2, 12.2); sh.lineTo(-15.2, 0);
      for (const cx of [-9.4, 9.4]) { const hw = 1.7, hp = new T.Path(); hp.moveTo(cx - hw, 5.0); hp.lineTo(cx + hw, 5.0); hp.lineTo(cx + hw, 9.6); hp.absarc(cx, 9.6, hw, 0, Math.PI, false); hp.lineTo(cx - hw, 5.0); sh.holes.push(hp); }
      const wall = new T.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false }); wall.translate(0, 0, -12.2);
      K.add(wall, stoneM, 0, 0, 0, { cast: false });
      const winTex = K.canvasTex(256, 512, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0c1636'); gr.addColorStop(0.7, '#1e2c5c'); gr.addColorStop(1, '#3a3a66'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(255,255,240,${0.3 + R() * 0.6})`; g.fillRect(R() * w, R() * h * 0.6, 1.5, 1.5); }
        for (let k = 0; k < 9; k++) { const bh = 30 + R() * 90; g.fillStyle = '#0a0c18'; g.fillRect(k * 30, h - bh, 26, bh); g.fillStyle = '#ffc070'; for (let q = 0; q < 6; q++) if (R() < 0.5) g.fillRect(k * 30 + 4 + (q % 3) * 7, h - bh + 8 + Math.floor(q / 3) * 14, 4, 6); }
        g.strokeStyle = '#1a1612'; g.lineWidth = 7; for (let x = 0; x <= w; x += w / 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y <= h; y += h / 7) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      });
      for (const cx of [-9.4, 9.4]) {
        K.add(new T.PlaneGeometry(3.6, 6.4), new T.MeshStandardMaterial({ map: winTex, emissiveMap: winTex, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.2 }), cx, 8.1, -12.25, { cast: false });
        K.add(new T.TorusGeometry(1.75, 0.1, 6, 20, Math.PI), gilt, cx, 9.6, -11.55, { cast: false }); for (const s of [-1, 1]) K.box(0.18, 4.7, 0.16, marble, cx + s * 1.78, 7.3, -11.52, { cast: false });
        K.box(3.9, 0.2, 0.3, marble, cx, 4.95, -11.5, { cast: false });
      }
      for (const x of [-12.9, -6.0, 6.0, 12.9]) { K.box(0.9, 7.6, 0.25, marbleV, x, 8.0, -11.48, { cast: false }); K.box(1.1, 0.4, 0.4, gilt, x, 11.6, -11.45, { cast: false }); }
      K.box(30.4, 0.2, 0.35, marble, 0, 4.5, -11.45, { cast: false }); K.box(30.4, 0.35, 0.5, marble, 0, 12.25, -11.5, { cast: false }); K.box(30.4, 0.12, 0.4, gilt, 0, 11.95, -11.42, { cast: false });
      K.sign('MVSEVM · HISTORIAE · NATVRALIS', 13, 0.7, 0, 11.4, -11.38, { color: '#e2bd62', size: 58, w: 1024, h: 64, font: 'Georgia, serif' });
      // cúpula de vidro (só no fundo): abóbada de ferro e vidro sobre o mezanino
      const vault = new T.CylinderGeometry(15, 15, 4.4, 40, 1, true, -Math.PI / 2, Math.PI); vault.rotateX(-Math.PI / 2); vault.scale(1, 0.3, 1);
      K.add(vault, new T.MeshStandardMaterial({ color: 0x9fbfdf, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.4, side: T.DoubleSide, depthWrite: false, emissive: 0x203050, emissiveIntensity: 0.4 }), 0, 12.4, -9.8, { cast: false });
      for (const z of [-11.8, -10.6, -9.0, -7.6]) K.add(new T.TorusGeometry(15, 0.09, 5, 40, Math.PI), K.iron, 0, 12.4, z, { cast: false, s: [1, 0.3, 1] });
      for (let k = 1; k < 12; k++) { const a = k / 12 * Math.PI; K.box(0.08, 0.08, 4.4, K.iron, Math.cos(a) * 15, 12.4 + Math.sin(a) * 4.5, -9.8, { cast: false }); }
    }

    // ------------------------------------------------------------ colunas de mármore e entablamento
    for (const x of [-14.3, -10.4, 10.4, 14.3]) {
      K.box(1.1, 0.5, 1.1, marbleV, x, 0.25, -7.6); K.lathe([[0, 0], [0.48, 0], [0.48, 0.12], [0.4, 0.22], [0, 0.22]], marble, x, 0.5, -7.6, {}, 20);
      K.add(new T.CylinderGeometry(0.34, 0.38, 10.6, 20), marble, x, 5.9, -7.6); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; K.box(0.04, 10.4, 0.04, marbleV, x + Math.cos(a) * 0.37, 5.9, -7.6 + Math.sin(a) * 0.37, { cast: false }); }
      K.lathe([[0, 0], [0.36, 0], [0.5, 0.3], [0.6, 0.45], [0, 0.45]], gilt, x, 11.2, -7.6, {}, 16); K.box(1.25, 0.2, 1.25, marble, x, 11.75, -7.6);
      K.colR(x, -7.6, 0.45);
    }
    K.box(29.8, 0.8, 0.9, marble, 0, 12.25, -7.6); K.box(29.8, 0.12, 0.95, gilt, 0, 11.88, -7.6, { cast: false });
    // estandartes entre as colunas
    const banTex = K.canvasTex(128, 512, (g, w, h) => { g.fillStyle = '#7a1020'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 40); g.fillStyle = '#d9a441'; g.beginPath(); g.moveTo(0, h - 30); g.lineTo(w / 2, h); g.lineTo(w, h - 30); g.fill(); g.font = '700 26px Georgia'; g.textAlign = 'center'; ['G', 'A', 'L', 'A'].forEach((c, i) => g.fillText(c, w / 2, 210 + i * 36)); g.lineWidth = 4; g.beginPath(); for (let a = 0; a < 18; a += 0.2) { const r = 3 + a * 2.3; g.lineTo(w / 2 + Math.cos(a) * r, 110 + Math.sin(a) * r); } g.stroke(); });
    for (const x of [-12.35, 12.35]) K.add(new T.PlaneGeometry(1.4, 5.0), K.texMat(banTex, { side: T.DoubleSide, roughness: 0.9 }), x, 9.4, -7.25, { cast: false });

    // ------------------------------------------------------------ mezanino: laje, balaustrada, escadaria dupla, tribuna
    const MY = 3.6;
    K.box(29.6, 0.3, 3.8, marbleV, 0, MY - 0.15, -9.9); K.box(6.4, 0.3, 1.5, marbleV, 0, MY - 0.15, -7.3);
    const parq = K.canvasTex(512, 512, (g, w, h) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { const v = 90 + R() * 30; g.fillStyle = `rgb(${v + 40},${v},${v - 40})`; g.save(); g.translate(i * 32, j * 128); if ((i + j) % 2) { g.fillRect(0, 0, 32, 128); } else { g.fillRect(0, 0, 32, 128); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, 32, 128); } g.restore(); g.strokeStyle = 'rgba(40,20,10,.5)'; g.strokeRect(i * 32, j * 128, 32, 128); } K.grain(g, w, h, 8); }, [7, 1]);
    K.floor(-14.8, -11.6, 14.8, -8.0, parq, { y: MY + 0.005, m: { roughness: 0.45 } });
    K.add(new T.PlaneGeometry(6.4, 1.4).rotateX(-Math.PI / 2), K.texMat(K.canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#7a1020'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12); }), { roughness: 0.95 }), 0, MY + 0.008, -7.3, { cast: false });
    K.box(29.6, 0.16, 0.12, gilt, 0, MY - 0.24, -8.0, { cast: false });
    // parede sob o mezanino
    stoneBox(29.6, MY - 0.3, 0.2, 0, (MY - 0.3) / 2, -8.18);
    // balaústres
    const balG = new T.LatheGeometry([[0, 0], [0.05, 0], [0.05, 0.05], [0.03, 0.12], [0.065, 0.42], [0.03, 0.66], [0.05, 0.72], [0, 0.72]].map(p => new T.Vector2(p[0], p[1])), 8);
    const bal = [];
    for (let x = -14.6; x <= 14.6; x += 0.3) if (Math.abs(x) > 3.25) bal.push([x, MY, -8.0]);
    for (let x = -3.1; x <= 3.1; x += 0.3) if (Math.abs(x) > 0.65) bal.push([x, MY, -6.62]);
    for (const sx of [-1, 1]) { for (let z = -11.4; z <= -8.1; z += 0.3) bal.push([sx * 14.7, MY, z]); }
    // escadas: degraus maciços de mármore com passadeira vermelha
    const stepM = [], runM = [];
    for (const sx of [-1, 1]) for (let k = 0; k < 18; k++) {
      const x = sx * (8.6 - k * 0.3 - 0.15), top = (k + 1) * 0.2;
      stepM.push([x, top / 2, -7.3, 0, [0.3, top, 1.4]]); runM.push([x, top + 0.006, -7.3, 0, [0.3, 0.012, 0.9]]);
      bal.push([x, top, -6.68]);
    }
    K.inst(new T.BoxGeometry(1, 1, 1), marble, stepM); K.inst(new T.BoxGeometry(1, 1, 1), velvet, runM, { cast: false });
    K.inst(new T.CylinderGeometry(0.012, 0.012, 0.92, 5).rotateX(Math.PI / 2), gilt, stepM.map(s => [s[0] - Math.sign(s[0]) * 0.14, s[4][1] + 0.02, -7.3, 0, 1]), { cast: false });
    K.inst(balG, marble, bal);
    K.box(22.2, 0.1, 0.22, marble, -8.85, MY + 0.77, -8.0); K.box(22.2, 0.1, 0.22, marble, 8.85, MY + 0.77, -8.0);
    K.box(1.0, 0.1, 0.22, marble, -2.2, MY + 0.77, -6.62); K.box(1.0, 0.1, 0.22, marble, 2.2, MY + 0.77, -6.62);
    for (const sx of [-1, 1]) {
      K.box(0.1, 0.1, 3.4, marble, sx * 14.7, MY + 0.77, -9.75);
      const rail = K.box(6.49, 0.1, 0.2, marble, sx * 5.9, 0.77 + 1.8, -6.68); rail.rotation.z = -sx * 0.588;
      const str = K.box(6.49, 0.35, 0.12, gilt, sx * 5.9, 1.62, -6.58, { cast: false }); str.rotation.z = -sx * 0.588;
      K.box(0.45, 1.2, 0.45, marble, sx * 8.8, 0.6, -6.68); K.sphere(0.2, gilt, sx * 8.8, 1.35, -6.68);
      K.box(0.4, 1.0, 0.4, marble, sx * 3.25, MY + 0.5, -6.62); K.sphere(0.16, gilt, sx * 3.25, MY + 1.12, -6.62);
    }
    K.col(-8.7, -8.1, -3.2, -6.5); K.col(3.2, -8.1, 8.7, -6.5); K.col(-3.2, -8.1, 3.2, -6.5);
    K.col(-13, -8.0, -3.2, -6.6, 1); K.col(3.2, -8.0, 13, -6.6, 1);
    // tribuna do leiloeiro na frente do patamar
    { const g = K.group(0, MY, -6.9);
      K.add(K.rbox(1.2, 1.15, 0.55, 0.06), oakDark, 0, 0.575, 0, { parent: g }); K.box(1.35, 0.08, 0.7, gilt, 0, 1.18, -0.02, { parent: g });
      const top = K.box(1.2, 0.04, 0.45, oakDark, 0, 1.25, -0.08, { parent: g }); top.rotation.x = 0.25;
      K.add(new T.CircleGeometry(0.28, 20), gilt, 0, 0.62, 0.285, { parent: g, cast: false });
      K.sign('LEILÃO', 0.9, 0.22, 0, 0.62, 0.3, { parent: g, color: '#3a2414', size: 70, font: 'Georgia, serif' });
      K.cyl(0.008, 0.008, 0.35, K.iron, 0.3, 1.38, -0.1, { parent: g, rx: -0.5 }, 4); K.sphere(0.03, M.black, 0.3, 1.55, 0.0, { parent: g });
      K.cyl(0.08, 0.08, 0.04, oakDark, -0.3, 1.29, -0.08, { parent: g }, 12);
      K.col(-0.65, -7.2, 0.65, -6.6, 1);
    }
    // cortina do palco (sob o patamar)
    { const cur = K.canvasTex(512, 256, (g, w, h) => { for (let x = 0; x < w; x++) { const v = 0.55 + 0.45 * Math.sin(x / 9); g.fillStyle = `rgb(${Math.round(120 * v + 20)},${Math.round(14 * v)},${Math.round(24 * v)})`; g.fillRect(x, 0, 1, h); } g.fillStyle = '#d9a441'; g.fillRect(0, h - 10, w, 10); g.fillRect(0, 0, w, 14); });
      K.add(new T.PlaneGeometry(6.4, MY - 0.3), K.texMat(cur, { roughness: 0.95 }), 0, (MY - 0.3) / 2, -6.52, { cast: false }); }

    // ------------------------------------------------------------ telão do leilão
    const telTex = K.canvasTex(1024, 512, () => { });
    let bid = 1250000, hacked = false, telFlash = 0;
    const drawTel = () => {
      const g = telTex.image.getContext('2d'), w = 1024, h = 512;
      const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, hacked ? '#4a0008' : '#0a1430'); gr.addColorStop(1, hacked ? '#1a0004' : '#121e44'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.strokeStyle = hacked ? '#ff3040' : '#d9a441'; g.lineWidth = 8; g.strokeRect(14, 14, w - 28, h - 28);
      g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(40, 60, 380, 380);
      // desenho do crânio de smilodon
      g.strokeStyle = '#efe6cc'; g.lineWidth = 6; g.beginPath(); g.ellipse(230, 210, 120, 80, -0.1, Math.PI * 0.95, Math.PI * 2.1); g.stroke();
      g.beginPath(); g.moveTo(115, 230); g.lineTo(340, 250); g.stroke(); g.fillStyle = '#efe6cc'; g.beginPath(); g.moveTo(300, 248); g.lineTo(318, 380); g.lineTo(330, 250); g.fill(); g.beginPath(); g.moveTo(150, 236); g.lineTo(165, 300); g.lineTo(178, 238); g.fill();
      g.beginPath(); g.arc(290, 195, 22, 0, 7); g.lineWidth = 5; g.stroke();
      g.textAlign = 'left'; g.fillStyle = hacked ? '#ffb0b8' : '#d9a441'; g.font = '700 46px Georgia'; g.fillText('LOTE 27', 470, 100);
      g.fillStyle = '#f3ecdc'; g.font = 'italic 34px Georgia'; g.fillText('Crânio de Smilodon fatalis', 470, 150); g.font = '24px Georgia'; g.fillText('Pleistoceno · Lagoa Santa, MG', 470, 188);
      g.fillStyle = hacked ? '#ff6070' : '#9fc0ff'; g.font = '700 28px Arial'; g.fillText(hacked ? 'LANCE CONFIRMADO' : 'LANCE ATUAL', 470, 262);
      g.fillStyle = hacked ? '#ff2a3a' : '#ffffff'; g.font = '700 84px Arial'; g.fillText('R$ ' + (hacked ? 9900000 : bid).toLocaleString('pt-BR'), 460, 350);
      g.fillStyle = '#c8c0b0'; g.font = '26px Arial'; g.fillText(hacked ? 'PALETA 007 · ARREMATADO' : 'paleta 1' + (bid / 50000 % 40 + 10), 470, 400);
      g.fillStyle = hacked ? '#ff3040' : '#d9a441'; g.fillRect(14, h - 62, w - 28, 48); g.fillStyle = '#101014'; g.font = '700 24px Arial'; g.fillText('GALA BENEFICENTE · MUSEU DE HISTÓRIA NATURAL · RENDA REVERTIDA À PESQUISA', 40, h - 30);
      telTex.needsUpdate = true;
    };
    drawTel();
    const telMat = new T.MeshBasicMaterial({ map: telTex, toneMapped: false, color: new T.Color(1.15, 1.15, 1.15) });
    K.add(new T.PlaneGeometry(7.4, 3.7), telMat, 0, 7.0, -11.5, { cast: false });
    K.box(7.8, 0.18, 0.2, gilt, 0, 8.95, -11.48, { cast: false }); K.box(7.8, 0.18, 0.2, gilt, 0, 5.05, -11.48, { cast: false });
    for (const s of [-1, 1]) K.box(0.18, 4.05, 0.2, gilt, s * 3.8, 7.0, -11.48, { cast: false });
    K.add(new T.TorusGeometry(3.95, 0.14, 6, 28, Math.PI), gilt, 0, 9.0, -11.5, { cast: false, s: [1, 0.5, 1] });
    K.halo(0, 7.0, -11.2, 4.6, 0x6f8fff, 0.22);
    const telLight = K.plight(0, 6.0, -9.3, 0x9fb8ff, 1.2, 9);
    let bidT = 0;
    K.tick((dt, t) => { if (hacked) { telFlash += dt; telMat.color.setScalar(Math.sin(telFlash * 6) > 0 ? 1.35 : 0.8); return; } bidT += dt; if (bidT > 3.5) { bidT = 0; bid = bid >= 2000000 ? 1250000 : bid + 50000; drawTel(); } });
    K.tell('telao', (live) => { hacked = true; telFlash = 0; drawTel(); telLight.color.set(0xff3040); if (live) K.anim(1.2, (e, u) => telMat.color.setScalar(u >= 1 ? 1.15 : (R() < 0.5 ? 0.2 : 1.5))); }, () => { hacked = false; drawTel(); telMat.color.setScalar(1.15); telLight.color.set(0x9fb8ff); });

    // ------------------------------------------------------------ galeria de fósseis (mezanino)
    // laje do ictiossauro e amonite gigante na parede
    { const ich = K.canvasTex(512, 224, (g, w, h) => {
        g.fillStyle = '#b8a888'; g.fillRect(0, 0, w, h); for (let k = 0; k < 1500; k++) { g.fillStyle = `rgba(${120 + R() * 60},${100 + R() * 50},${70 + R() * 40},${R() * 0.25})`; g.fillRect(R() * w, R() * h, 3, 3); }
        g.strokeStyle = '#4a3a2a'; g.lineWidth = 5; g.beginPath(); for (let x = 60; x < 470; x += 2) { const y = 118 + Math.sin(x / 60) * 14; g.lineTo(x, y); } g.stroke();
        g.lineWidth = 3; for (let x = 90; x < 440; x += 13) { const y = 118 + Math.sin(x / 60) * 14; g.beginPath(); g.moveTo(x, y - 18); g.lineTo(x, y + 18); g.stroke(); }
        g.fillStyle = '#4a3a2a'; g.beginPath(); g.moveTo(470, 110); g.lineTo(505, 100); g.lineTo(505, 124); g.fill(); g.beginPath(); g.arc(455, 112, 14, 0, 7); g.lineWidth = 4; g.stroke();
        g.beginPath(); g.ellipse(160, 150, 30, 14, 0.6, 0, 7); g.stroke(); g.beginPath(); g.ellipse(330, 150, 26, 12, 0.5, 0, 7); g.stroke(); g.beginPath(); g.moveTo(60, 118); g.lineTo(20, 80); g.moveTo(60, 118); g.lineTo(20, 160); g.stroke();
      });
      K.box(3.5, 1.6, 0.12, oakDark, -5.75, 6.3, -11.5, { cast: false }); K.add(new T.PlaneGeometry(3.3, 1.42), K.texMat(ich, { roughness: 0.95 }), -5.75, 6.3, -11.43, { cast: false });
      K.sign('Ichthyosaurus · Jurássico', 1.8, 0.2, -5.75, 5.3, -11.44, { color: '#e9dcb8', size: 46, w: 512, h: 64 });
      const am = K.group(5.75, 6.4, -11.4); K.cyl(0.85, 0.85, 0.16, K.mat(0xa89070, { roughness: 0.8 }), 0, 0, 0, { parent: am, rx: Math.PI / 2 }, 28);
      for (let k = 0; k < 4; k++) K.add(new T.TorusGeometry(0.2 + k * 0.17, 0.07 - k * 0.008, 6, 22), K.mat(0x8a6e4e, { roughness: 0.7 }), 0, 0, 0.1, { parent: am, cast: false });
      for (let k = 0; k < 22; k++) { const a = k / 22 * Math.PI * 2; K.box(0.03, 0.16, 0.04, K.mat(0x6a5236), Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.1, { parent: am, rz: a, cast: false }); }
      K.sign('Amonite · Cretáceo', 1.6, 0.2, 5.75, 5.3, -11.44, { color: '#e9dcb8', size: 46, w: 512, h: 64 });
    }
    // vitrines baixas: amonites e trilobitas
    const lowCase = (x, kind) => {
      K.box(1.8, 0.85, 0.7, lacquer, x, MY + 0.425, -11.0); K.box(1.84, 0.04, 0.74, gilt, x, MY + 0.86, -11.0, { cast: false });
      K.box(1.7, 0.35, 0.6, K.glass, x, MY + 1.05, -11.0, { cast: false }); K.box(1.6, 0.02, 0.5, K.mat(0x1a2a3a, { roughness: 0.9 }), x, MY + 0.88, -11.0, { cast: false });
      const l = []; for (let k = 0; k < 6; k++) l.push([x - 0.65 + k * 0.26, MY + 0.92, -11.0 + (k % 2 ? 0.1 : -0.1), R() * 6, 0.8 + R() * 0.5]);
      if (kind === 'am') { K.inst(new T.TorusGeometry(0.07, 0.035, 6, 14).rotateX(Math.PI / 2), K.mat(0xc49a5a, { roughness: 0.5, metalness: 0.2 }), l, { cast: false }); K.inst(new T.TorusGeometry(0.03, 0.018, 5, 10).rotateX(Math.PI / 2), K.mat(0xa87a3a), l.map(p => [p[0], p[1] + 0.02, p[2], 0, p[4]]), { cast: false }); }
      else { K.inst(new T.SphereGeometry(0.08, 8, 5).scale(0.7, 0.3, 1), K.mat(0x4a3e30, { roughness: 0.6 }), l, { cast: false }); K.inst(new T.BoxGeometry(0.02, 0.03, 0.16), K.mat(0x6a5a44), l, { cast: false }); }
      K.box(1.7, 0.03, 0.03, K.glow(0xfff0d0, 2), x, MY + 1.21, -10.72, { cast: false }); K.pool(x, -10.6, 0.9, 0xffe0b0, 0.25, MY + 0.02);
      K.col(x - 0.95, -11.4, x + 0.95, -10.6, 1);
    };
    lowCase(-8.8, 'am'); lowCase(8.8, 'tri');
    // velociraptor em pose de ataque e crânio de tricerátops
    K.box(1.9, 0.3, 0.9, granite, -11.6, MY + 0.15, -10.3); theropod(-11.9, MY + 0.3, -10.3, 0.3, false); K.sign('Velociraptor', 1.0, 0.16, -11.6, MY + 0.15, -9.84, { color: '#d9a441', size: 50, w: 512, h: 80, bg: '#121216' });
    K.col(-12.6, -10.8, -10.6, -9.8, 1);
    { const g = K.group(11.6, MY, -10.0, -0.5); K.box(1.4, 0.8, 1.2, granite, 0, 0.4, 0, { parent: g });
      const bm = K.mat(0x9a8462, { roughness: 0.8 }); K.add(new T.CircleGeometry(0.9, 18, 0, Math.PI), bm, -0.05, 1.05, -0.2, { parent: g, rx: -0.3, cast: false }).material.side = T.DoubleSide;
      for (let k = 0; k < 9; k++) { const a = k / 8 * Math.PI; K.cone(0.06, 0.18, bm, Math.cos(a) * 0.9, 1.05 + Math.sin(a) * 0.86, -0.45 + Math.sin(a) * 0.05, { parent: g, rz: a - Math.PI / 2 }, 6); }
      K.add(new T.SphereGeometry(0.32, 10, 8).scale(1.1, 0.8, 1.6), bm, 0, 1.0, 0.25, { parent: g }); K.cone(0.13, 0.3, bm, 0, 0.95, 0.75, { parent: g, rx: Math.PI / 2 + 0.3 }, 8);
      for (const s of [-1, 1]) K.cone(0.07, 0.75, ivory, s * 0.22, 1.35, 0.35, { parent: g, rx: 0.9 }, 8); K.cone(0.05, 0.2, ivory, 0, 1.05, 0.62, { parent: g, rx: 0.5 }, 6);
      K.col(10.6, -10.8, 12.6, -9.2, 1); }
    // pterossauro pendurado
    { const parts = [], o = [9.6, 8.6, -9.6]; const P = (x, y, z) => [o[0] + x, o[1] + y, o[2] + z];
      const bn = (a, b, r, r2, c = B1) => parts.push([boneG(P(...a), P(...b), r, r2 ?? r * 0.8), c]);
      bn([0, 0, -0.5], [0, 0.05, 0.3], 0.07, 0.06); bn([0, 0.05, 0.3], [0, 0.35, 0.9], 0.04, 0.035); parts.push([new T.ConeGeometry(0.09, 1.1, 6).rotateX(Math.PI / 2).translate(...P(0, 0.38, 1.55)), B1], [new T.ConeGeometry(0.06, 0.6, 5).rotateX(-Math.PI * 0.65).translate(...P(0, 0.55, 0.75)), B2]);
      for (const s of [-1, 1]) { bn([0, 0.05, 0.1], [s * 0.6, 0.1, 0.0], 0.04); bn([s * 0.6, 0.1, 0.0], [s * 1.3, 0.15, 0.2], 0.035); bn([s * 1.3, 0.15, 0.2], [s * 3.0, -0.05, -0.2], 0.03, 0.01); bn([0, -0.05, -0.4], [s * 0.3, -0.5, -0.6], 0.025); }
      K.merge(parts, boneMat);
      for (const x of [-1.5, 1.5]) K.add(boneG(P(x, 0.1, 0), [o[0] + x * 1.4, 13.6, -10.6], 0.008, 0.008), K.iron, 0, 0, 0, { cast: false });
    }
    // restaurador: cavalete com o arqueoptérix e carrinho de ferramentas
    { const g = K.group(-6.0, MY, -10.75); for (const s of [-1, 1]) K.box(0.05, 1.6, 0.05, oakDark, s * 0.4, 0.8, 0, { parent: g, rz: s * 0.08 });
      K.box(0.9, 0.05, 0.15, oakDark, 0, 0.75, 0.05, { parent: g });
      const ar = K.canvasTex(256, 192, (gg, w, h) => { gg.fillStyle = '#c9b48a'; gg.fillRect(0, 0, w, h); gg.strokeStyle = '#5a4630'; gg.lineWidth = 3; gg.beginPath(); gg.arc(130, 90, 30, 0, 5); gg.stroke(); for (let k = 0; k < 9; k++) { gg.beginPath(); gg.moveTo(110, 95); gg.lineTo(30 + k * 8, 30 + k * 4); gg.stroke(); gg.beginPath(); gg.moveTo(150, 95); gg.lineTo(226 - k * 8, 30 + k * 4); gg.stroke(); } gg.beginPath(); gg.moveTo(130, 120); gg.lineTo(130, 180); gg.stroke(); K.grain(gg, w, h, 20); });
      K.add(new T.PlaneGeometry(0.8, 0.6), K.texMat(ar), 0, 1.12, 0.09, { parent: g, rx: -0.12, cast: false });
      K.box(0.6, 0.7, 0.4, K.mat(0x8a2a22, { roughness: 0.5, metalness: 0.3 }), 0.75, 0.35, -0.2, { parent: g }); for (let k = 0; k < 5; k++) K.cyl(0.01, 0.01, 0.18, K.mat([0xd9a441, 0x3a3a3a, 0x8a6a4a][k % 3]), 0.6 + k * 0.07, 0.78, -0.2, { parent: g, cast: false }, 5);
      K.cyl(0.12, 0.1, 0.25, K.mat(0x3a5a7a, { roughness: 0.3 }), 0.95, 0.83, -0.1, { parent: g }, 10);
      K.spot(-6.0, MY + 2.6, -9.6, -6.0, MY + 1.0, -10.75, 0xfff2dc, 1.2, 6, 0.45);
      K.col(-6.6, -11.4, -5.2, -10.5, 1); }
    // mesas de lances por telefone e de registro, atrás da tribuna
    for (const sx of [-1, 1]) {
      const x = sx * 2.0; K.box(1.6, 0.06, 0.6, oakDark, x, MY + 0.75, -10.3); for (const dx of [-0.7, 0.7]) K.box(0.06, 0.75, 0.55, oakDark, x + dx, MY + 0.375, -10.3);
      K.box(1.62, 0.5, 0.04, velvet, x, MY + 0.48, -10.0, { cast: false });
      for (const dx of [-0.4, 0.4]) { K.box(0.18, 0.06, 0.12, sx < 0 ? M.black : K.mat(0xd8d0c0), x + dx, MY + 0.81, -10.35, { cast: false }); K.box(0.2, 0.04, 0.06, M.black, x + dx, MY + 0.86, -10.38, { cast: false }); K.chair(x + dx, -10.95, 0, { y: MY, seat: velvet, frame: gilt }); K.slot(x + dx, -10.92, x + dx, -9, 'sit', 1); }
      K.sign(sx < 0 ? 'LANCES POR TELEFONE' : 'REGISTRO DE LANCES', 1.4, 0.18, x, MY + 0.48, -9.97, { color: '#d9a441', size: 42, w: 512, h: 64 });
      K.col(x - 0.85, -10.6, x + 0.85, -10.0, 1);
    }
    // mesa de projeção do telão (missão)
    const avLeds = [];
    { const g = K.group(5.4, MY, -10.9); K.box(1.6, 0.06, 0.7, M.black, 0, 0.78, 0, { parent: g }); for (const s of [-1, 1]) K.box(0.06, 0.78, 0.65, M.black, s * 0.75, 0.39, 0, { parent: g });
      K.box(0.5, 0.03, 0.35, K.mat(0x2a2a30, { metalness: 0.5 }), -0.35, 0.82, 0.05, { parent: g }); const scr = K.box(0.5, 0.32, 0.02, K.glow(0x6f9fff, 1.4), -0.35, 1.0, -0.12, { parent: g, cast: false, rx: -0.2 });
      K.box(0.7, 0.05, 0.4, K.mat(0x1a1a1e, { roughness: 0.4 }), 0.35, 0.83, 0.05, { parent: g });
      for (let k = 0; k < 8; k++) { avLeds.push(K.box(0.04, 0.012, 0.04, K.glow([0x40ff80, 0xffb040, 0x40c0ff][k % 3], 2), 0.1 + k * 0.07, 0.865, 0.0, { parent: g, cast: false })); K.box(0.02, 0.05, 0.02, M.white, 0.1 + k * 0.07, 0.88, 0.12, { parent: g, cast: false }); }
      K.box(0.45, 0.3, 0.3, K.mat(0x2a2a30), 0.5, 1.0, -0.2, { parent: g }); K.cyl(0.07, 0.07, 0.04, K.glow(0xffffff, 1.6), 0.5, 1.0, -0.04, { parent: g, rx: Math.PI / 2, cast: false });
      K.col(4.5, -11.4, 6.3, -10.5, 1); avLeds.scr = scr; }
    K.tick((dt, t) => { avLeds.forEach((l, i) => { l.visible = Math.sin(t * (3 + i) + i) > -0.3; }); });
    // bancos da galeria
    for (const x of [-8.8, 8.8]) { K.add(K.rbox(1.6, 0.22, 0.5, 0.06), K.mat(0x2a3a2e, { roughness: 0.9 }), x, MY + 0.42, -9.2); for (const dx of [-0.65, 0.65]) K.box(0.08, 0.32, 0.4, gilt, x + dx, MY + 0.16, -9.2); K.col(x - 0.8, -9.45, x + 0.8, -8.95, 1); [-0.4, 0.4].forEach(dx => K.slot(x + dx, -9.2, x + dx, -6, 'sit', 1)); }
    K.plight(-8.0, MY + 2.6, -9.4, 0xffd8a0, 1.3, 9); K.plight(8.0, MY + 2.6, -9.4, 0xffd8a0, 1.3, 9);
    // vagas do mezanino: gente debruçada na balaustrada e conversando
    [-12.2, -10.7, -5.0, -4.0, 4.0, 5.2, 6.6, 10.9, 12.3].forEach(x => K.slot(x, -8.45, x, -4, 'view', 1));
    [[-3.6, -9.4, -2.6, -9.6], [-2.6, -9.6, -3.6, -9.4], [3.0, -9.3, 4.0, -9.5], [4.0, -9.5, 3.0, -9.3], [-12.0, -11.0, -11.4, -11.0], [11.0, -11.0, 12.0, -11.0]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'talk', 1));

    // ------------------------------------------------------------ baleia azul suspensa
    const whale = K.group(0.5, 8.8, -2.0);
    { const parts = [];
      const WB1 = 0xe2d2ae, WB2 = 0xcbb68c, bn = (a, b, r, r2, c = WB1) => parts.push([boneG(a, b, r, r2 ?? r * 0.8), c === B1 ? WB1 : c === B2 ? WB2 : c]);
      const curve = new T.CatmullRomCurve3([[-8, 0.35], [-6, 0.1], [-4, -0.05], [-1.5, -0.1], [1, 0], [3.5, 0.1], [4.8, 0.15]].map(p => new T.Vector3(p[0], p[1], 0)));
      for (let i = 0; i < 54; i++) {
        const u = i / 53, p = curve.getPointAt(u), t = curve.getTangentAt(u), sz = p.x < 1 ? 0.35 + 0.65 * (p.x + 8) / 9 : 0.95;
        bn(p.clone().addScaledVector(t, -0.09 * sz).toArray(), p.clone().addScaledVector(t, 0.09 * sz).toArray(), 0.14 * sz, 0.14 * sz, i % 2 ? B1 : B2);
        bn(p.toArray(), [p.x - 0.05, p.y + 0.38 * sz, 0], 0.035 * sz, 0.02 * sz, B1);
        if (p.x > -6) for (const sd of [-1, 1]) bn(p.toArray(), [p.x, p.y + 0.02, sd * 0.36 * sz], 0.03 * sz, 0.02 * sz, B2);
        if (p.x < -1.5) bn(p.toArray(), [p.x - 0.06, p.y - 0.28 * sz, 0], 0.03 * sz, 0.015 * sz, B2);
      }
      for (let i = 0; i < 13; i++) { const x = 0.6 + i * 0.3, L = 0.65 + 0.35 * Math.sin((i + 0.5) / 13 * Math.PI);
        for (const sd of [-1, 1]) { const pts = [[x, 0, sd * 0.25], [x + 0.08, -0.35 * L, sd * 0.85 * L], [x + 0.18, -1.0 * L, sd * 1.0 * L], [x + 0.28, -1.45 * L, sd * 0.6 * L]]; for (let k = 0; k < 3; k++) bn(pts[k], pts[k + 1], 0.045, 0.04, k % 2 ? B1 : B2); } }
      parts.push([new T.ConeGeometry(0.75, 3.2, 10).rotateZ(-Math.PI / 2).scale(1, 0.35, 1).translate(6.6, 0.22, 0), B1], [new T.SphereGeometry(0.8, 10, 8).scale(0.75, 0.55, 1.15).translate(5.1, 0.2, 0), B2]);
      for (const sd of [-1, 1]) {
        const j = [[5.0, -0.25, sd * 0.72], [6.2, -0.42, sd * 0.68], [7.4, -0.36, sd * 0.45], [8.2, -0.2, sd * 0.14]]; for (let k = 0; k < 3; k++) bn(j[k], j[k + 1], 0.08, 0.07, B2);
        bn([3.9, -0.3, sd * 0.6], [4.1, -0.9, sd * 0.95], 0.1, 0.06, B2); bn([4.1, -0.9, sd * 0.95], [4.5, -1.3, sd * 1.35], 0.07, 0.06); bn([4.5, -1.3, sd * 1.35], [5.0, -1.6, sd * 1.7], 0.05, 0.045);
        for (let f = 0; f < 4; f++) bn([5.0, -1.6, sd * 1.7], [5.5 + f * 0.08, -1.75 - f * 0.04, sd * (1.85 + f * 0.1)], 0.025, 0.012, B2);
        bn([-1.0, -0.6, sd * 0.2], [-0.4, -0.75, sd * 0.3], 0.03, 0.02, B3);
      }
      K.merge(parts, boneMat, { parent: whale });
      for (const x of [-5, -1, 2.5, 5.5]) { const top = [0.5 + x * 1.15 - 0.5, 13.6 - 8.8, -10.6 + 2.0]; whale.add(new T.Mesh(boneG([x, 0.3, 0], top, 0.012, 0.012), K.iron)); }
    }
    // o cabo que vai até o guincho do mezanino (missão)
    const wCable = K.add(boneG([-7.3, 9.05, -2.0], [-7.4, MY + 1.0, -8.05], 0.016, 0.016), K.iron, 0, 0, 0, { cast: false });
    { const g = K.group(-7.4, MY, -8.05); K.box(0.4, 0.5, 0.3, K.mat(0x6a1a1a, { metalness: 0.5, roughness: 0.4 }), 0, 0.98, 0, { parent: g }); K.cyl(0.1, 0.1, 0.42, K.iron, 0, 1.0, 0.18, { parent: g, rz: Math.PI / 2 }, 12); K.torus(0.1, 0.03, gilt, 0.24, 1.0, 0.18, { parent: g, ry: Math.PI / 2 }); }
    let wSwing = 0, wTilt = 0;
    K.tick((dt, t) => { whale.rotation.y = Math.sin(t * 0.25) * 0.015 * (1 + wSwing * 3); whale.rotation.x = Math.sin(t * 0.6) * 0.01 * (1 + wSwing * 5); whale.rotation.z = wTilt + Math.sin(t * 0.9) * 0.012 * wSwing; });
    K.tell('baleia', (live) => { wCable.visible = false; wSwing = 1; if (live) K.anim(2.0, e => { wTilt = 0.12 * e + Math.sin(e * 14) * 0.03 * (1 - e); }); else wTilt = 0.12; }, () => { wCable.visible = true; wSwing = 0; wTilt = 0; });

    // ------------------------------------------------------------ T-rex no pedestal
    { K.box(10.4, 0.55, 2.8, granite, 0, 0.275, 1.4); K.box(10.5, 0.06, 2.9, gilt, 0, 0.56, 1.4, { cast: false }); K.box(10.6, 0.08, 3.0, gilt, 0, 0.04, 1.4, { cast: false });
      const rock = K.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#4a4034'; g.fillRect(0, 0, w, h); for (let k = 0; k < 500; k++) { const v = 50 + R() * 60; g.fillStyle = `rgb(${v + 20},${v + 8},${v - 10})`; g.beginPath(); g.ellipse(R() * w, R() * h, 2 + R() * 9, 2 + R() * 6, R() * 3, 0, 7); g.fill(); } });
      K.add(new T.PlaneGeometry(10.2, 2.6).rotateX(-Math.PI / 2), K.texMat(rock, { roughness: 1 }), 0, 0.592, 1.4, { cast: false });
      K.sign('TYRANNOSAURUS REX · 66 MILHÕES DE ANOS', 4.6, 0.32, 0, 0.3, 2.815, { color: '#e2bd62', size: 44, w: 1024, h: 72, font: 'Georgia, serif' });
      theropod(0, 0.59, 1.4, 1, true);
      K.col(-5.7, -0.5, 5.7, 3.3);
    }
    // rastreador no crânio (missão): LED vermelho piscando
    const trk = K.box(0.1, 0.05, 0.08, M.black, 3.55, 3.97, 1.62, { cast: false }); const trkLed = K.halo(3.55, 4.03, 1.62, 0.32, 0xff2020, 2.2); trk.visible = trkLed.visible = false;
    let trkOn = false;
    K.tick((dt, t) => { if (trkOn) trkLed.visible = Math.sin(t * 9) > 0; });
    K.tell('rastreador', (live) => { trkOn = true; trk.visible = trkLed.visible = true; if (live) K.anim(0.8, e => trkLed.scale.setScalar(0.64 * (1 + (1 - e) * 2))); else trkLed.scale.setScalar(0.64); }, () => { trkOn = false; trk.visible = trkLed.visible = false; });
    K.spot(0, 10, 7.5, 0, 2.2, 1.4, 0xfff0d8, 2.2, 26, 0.42);
    K.pool(0, 1.4, 4.2, 0xffe0b0, 0.12);
    // pegadas de dinossauro no chão, do pedestal para a entrada
    { const fp = K.canvasTex(128, 128, (g) => { g.fillStyle = 'rgba(30,20,10,.55)'; g.beginPath(); g.ellipse(64, 84, 22, 26, 0, 0, 7); g.fill(); for (const a of [-0.45, 0, 0.45]) { g.save(); g.translate(64, 70); g.rotate(a); g.beginPath(); g.ellipse(0, -36, 9, 30, 0, 0, 7); g.fill(); g.restore(); } });
      fp.encoding = T.LinearEncoding; const l = []; for (let k = 0; k < 7; k++) l.push([4.8 + k * 0.85 + (k % 2) * 0.1, 0.017, 3.9 + k * 0.6 + (k % 2 ? 0.3 : -0.3), -2.2, 0.7]);
      K.inst(new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ map: fp, transparent: true, depthWrite: false }), l, { cast: false }); }

    // ------------------------------------------------------------ cordões de veludo
    const ropeParts = [], posts = [];
    const ropeLine = (pts, closed) => { const n = pts.length; for (let i = 0; i < n; i++) { posts.push([pts[i][0], 0, pts[i][1]]); if (!closed && i === n - 1) break; const a = pts[i], b = pts[(i + 1) % n]; const c = new T.QuadraticBezierCurve3(new T.Vector3(a[0], 0.88, a[1]), new T.Vector3((a[0] + b[0]) / 2, 0.5, (a[1] + b[1]) / 2), new T.Vector3(b[0], 0.88, b[1])); ropeParts.push([new T.TubeGeometry(c, 10, 0.024, 5), 0x8a1020]); } };
    const rectPts = (x0, z0, x1, z1, step) => { const p = []; const nx = Math.max(1, Math.round((x1 - x0) / step)), nz = Math.max(1, Math.round((z1 - z0) / step)); for (let i = 0; i < nx; i++) p.push([x0 + (x1 - x0) * i / nx, z0]); for (let i = 0; i < nz; i++) p.push([x1, z0 + (z1 - z0) * i / nz]); for (let i = 0; i < nx; i++) p.push([x1 - (x1 - x0) * i / nx, z1]); for (let i = 0; i < nz; i++) p.push([x0, z1 - (z1 - z0) * i / nz]); return p; };
    ropeLine(rectPts(-5.55, -0.4, 5.55, 3.2, 2.2), true);

    // ------------------------------------------------------------ palco do leilão (lote em exposição) e plateia de lances
    { K.box(6.2, 0.35, 1.8, oakDark, 0, 0.175, -5.6); K.box(6.3, 0.04, 1.9, velvet, 0, 0.37, -5.6, { cast: false }); K.box(6.3, 0.06, 0.06, gilt, 0, 0.33, -4.68, { cast: false });
      for (let k = 0; k < 2; k++) K.box(2.2, 0.17, 0.35, oakDark, 0, 0.085 + k * 0, -4.55, { cast: false });
      const turn = K.group(0, 0.37, -5.6); K.cyl(0.7, 0.75, 0.12, gilt, 0, 0.06, 0, { parent: turn }, 28); K.cyl(0.35, 0.4, 0.9, lacquer, 0, 0.57, 0, { parent: turn }, 16); K.cyl(0.38, 0.38, 0.04, velvet, 0, 1.03, 0, { parent: turn }, 16);
      const sm = K.mat(0xd8c8a0, { roughness: 0.6 }); K.add(new T.SphereGeometry(0.18, 10, 8).scale(1.3, 0.8, 0.9), sm, 0, 1.18, 0, { parent: turn }); K.add(new T.BoxGeometry(0.22, 0.08, 0.18), sm, 0.2, 1.11, 0, { parent: turn });
      for (const s of [-1, 1]) { K.cone(0.025, 0.24, ivory, 0.22, 1.0, s * 0.06, { parent: turn, rx: Math.PI }, 6); K.sphere(0.04, M.black, 0.08, 1.22, s * 0.09, { parent: turn }, 6, 4); }
      K.add(new T.SphereGeometry(0.36, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), K.glass, 0, 1.05, 0, { parent: turn, cast: false });
      K.tick((dt) => { turn.rotation.y += dt * 0.4; });
      // cavalete com o número do lote
      const ea = K.group(-2.1, 0.37, -5.5, 0.3); for (const s of [-1, 1]) K.box(0.04, 1.6, 0.04, gilt, s * 0.32, 0.8, 0, { parent: ea, rz: s * 0.1 }); K.box(0.04, 1.6, 0.04, gilt, 0, 0.75, -0.3, { parent: ea, rx: -0.35 });
      K.add(new T.PlaneGeometry(0.75, 0.95), K.texMat(K.canvasTex(192, 256, (g, w, h) => { g.fillStyle = '#121a36'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(8, 8, w - 16, h - 16); g.fillStyle = '#d9a441'; g.textAlign = 'center'; g.font = '700 30px Georgia'; g.fillText('LOTE', w / 2, 90); g.font = '700 86px Georgia'; g.fillText('27', w / 2, 180); })), 0, 1.15, 0.03, { parent: ea, cast: false });
      // refletores de pé
      for (const s of [-1, 1]) { const g = K.group(s * 2.8, 0.37, -6.2, -s * 0.5); K.cyl(0.015, 0.02, 1.8, K.iron, 0, 0.9, 0, { parent: g }, 6); const h = K.cyl(0.13, 0.1, 0.3, M.black, 0, 1.85, 0.05, { parent: g, rx: 1.1 }, 12); K.cyl(0.1, 0.1, 0.01, K.glow(0xfff0d0, 2.5), 0, 1.92, 0.18, { parent: g, rx: 1.1, cast: false }, 12); }
      K.spot(0, 7.5, -2.5, 0, 0.9, -5.6, 0xfff0d8, 2.6, 14, 0.38); K.pool(0, -5.6, 1.6, 0xffe8c0, 0.45, 0.39);
      K.col(-3.1, -6.5, 3.1, -4.7);
      ropeLine([[-3.4, -4.4], [-1.2, -4.4]], false); ropeLine([[1.2, -4.4], [3.4, -4.4]], false);
      [[-4.0, -4.6], [4.0, -4.6], [-1.0, -3.9], [1.0, -3.9]].forEach(([x, z]) => K.slot(x, z, 0, -5.6, 'view'));
    }
    // tapete das cadeiras de lance com medalhão de amonite
    K.rug(0, -2.95, 15.0, 2.9, (g, w, h) => { g.fillStyle = '#5a0e1a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#d9a441'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); g.lineWidth = 2; g.strokeRect(20, 20, w - 40, h - 40); g.beginPath(); for (let a = 0; a < 20; a += 0.15) { const r = 2 + a * 2.0; g.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r * 0.9); } g.stroke(); for (let k = 0; k < 24; k++) { g.fillStyle = 'rgba(217,164,65,.35)'; g.fillRect(30 + k * 19, h - 34, 8, 8); g.fillRect(30 + k * 19, 26, 8, 8); } });
    for (const sx of [-1, 1]) for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) {
      const x = sx * (2.6 + k * 1.0), z = -3.5 + r * 1.0;
      K.chair(x, z, Math.PI, { seat: velvet, frame: gilt, back: gilt }); if ((k + r) % 2 === 0) K.slot(x, z, x, z - 1, 'sit');
    }
    // flashes de fotógrafos perto do palco
    const flashes = [[-4.6, 1.7, -3.9], [4.8, 1.7, -2.0], [-6.8, 1.6, -1.0], [6.6, 1.6, -4.4]].map(p => { const h = K.halo(p[0], p[1], p[2], 0.5, 0xffffff, 2.4); h.visible = false; return h; });
    let flashT = 0;
    K.tick((dt) => { flashT -= dt; flashes.forEach(f => f.visible = false); if (flashT < 0.08 && flashT > 0) flashes[Math.floor(R() * flashes.length)].visible = true; if (flashT < 0) flashT = 1.2 + R() * 2.6; });

    // ------------------------------------------------------------ vitrines de gemas (fundo à esquerda)
    const gemCase = (x, z, color, big) => {
      const s = big ? 1.3 : 1, g = K.group(x, 0, z);
      K.box(0.62 * s, 1.0, 0.62 * s, lacquer, 0, 0.5, 0, { parent: g }); K.box(0.68 * s, 0.05, 0.68 * s, gilt, 0, 1.02, 0, { parent: g }); K.box(0.68 * s, 0.05, 0.68 * s, gilt, 0, 0.03, 0, { parent: g });
      K.box(0.56 * s, 0.56 * s, 0.56 * s, K.glass, 0, 1.05 + 0.28 * s, 0, { parent: g, cast: false });
      for (const q of [-1, 1]) { K.box(0.58 * s, 0.03, 0.03, gilt, 0, 1.06 + 0.56 * s, q * 0.28 * s, { parent: g, cast: false }); K.box(0.03, 0.03, 0.58 * s, gilt, q * 0.28 * s, 1.06 + 0.56 * s, 0, { parent: g, cast: false }); }
      K.add(K.rbox(0.22 * s, 0.06, 0.22 * s, 0.03), velvet, 0, 1.1, 0, { parent: g });
      const gm = K.mat(color, { emissive: color, emissiveIntensity: 1.3, roughness: 0.05, metalness: 0.3 });
      const gem = K.add(new T.OctahedronGeometry(0.11 * s * (big ? 1.3 : 1)).scale(1, 1.3, 1), gm, 0, 1.3, 0, { parent: g, cast: false });
      const halo = K.halo(x, 1.3, z, (big ? 0.6 : 0.32) * s, color, 0.9);
      K.pool(x, z, 0.7 * s, color, 0.35);
      K.colR(x, z, 0.38 * s);
      return { gem, halo, gm };
    };
    const star = gemCase(-11.6, -6.6, 0x2a5cff, true);
    const gemsSmall = [gemCase(-13.8, -7.0, 0x20d070), gemCase(-13.8, -4.6, 0xa040ff), gemCase(-12.0, -3.6, 0xf0f4ff)];
    K.sign('ESTRELA DE BENGALA · 563 QUILATES', 1.3, 0.12, -11.6, 0.6, -6.08, { color: '#e2bd62', size: 30, w: 512, h: 48, bg: '#121216' });
    const gemLight = K.plight(-12.2, 2.2, -5.6, 0x7fa0ff, 1.4, 7);
    let gemSpin = 0.6;
    K.tick((dt) => { star.gem.rotation.y += dt * gemSpin; gemsSmall.forEach((s, i) => s.gem.rotation.y += dt * (0.4 + i * 0.15)); });
    K.tell('gema', (live) => { star.gem.material = K.mat(0xff1830, { emissive: 0xff1020, emissiveIntensity: 1.6, roughness: 0.05 }); star.halo.material.color.set(0xff2030).multiplyScalar(1.4); gemLight.color.set(0xff3040); if (live) { gemSpin = 8; K.anim(1.6, e => { gemSpin = 8 - 7 * e; }); } else gemSpin = 1; }, () => { star.gem.material = star.gm; star.halo.material.color.set(0x2a5cff).multiplyScalar(0.9); gemLight.color.set(0x7fa0ff); gemSpin = 0.6; });
    // vitrine de parede com minerais, na parede sob o mezanino
    { const mt = K.canvasTex(512, 224, (g, w, h) => { g.fillStyle = '#10141c'; g.fillRect(0, 0, w, h); for (let k = 0; k < 14; k++) { const x = 30 + k * 34, y = 120 + (k % 3) * 22, c = ['#5ad0ff', '#c070ff', '#ffd040', '#60ff9a', '#ff6a8a', '#f0f0ff'][k % 6]; g.fillStyle = c; g.beginPath(); g.moveTo(x, y + 40); for (let q = 0; q < 5; q++) g.lineTo(x - 14 + q * 7, y - 20 - R() * 40); g.lineTo(x + 18, y + 40); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(x - 3, y - 10, 3, 30); } g.fillStyle = '#d9a441'; g.fillRect(0, h - 14, w, 14); });
      K.box(3.4, 1.6, 0.2, lacquer, -11.9, 1.5, -7.98); K.add(new T.PlaneGeometry(3.2, 1.4), new T.MeshStandardMaterial({ map: mt, emissiveMap: mt, emissive: 0xffffff, emissiveIntensity: 0.8 }), -11.9, 1.5, -7.86, { cast: false });
      K.sign('GEMAS E METEORITOS', 2.8, 0.36, -11.9, 2.75, -7.95, { color: '#e2bd62', size: 56, w: 1024, h: 128 }); }
    [[-13.7, -5.8, -13.8, -7.0], [-12.0, -2.8, -12.0, -3.6], [-10.4, -6.7, -11.6, -6.6]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'view'));

    // ------------------------------------------------------------ vitrine do meteorito
    const met = (() => {
      const cx = -11.8, cz = -0.8;
      K.box(1.9, 0.7, 1.9, oakDark, cx, 0.35, cz); K.box(1.96, 0.05, 1.96, gilt, cx, 0.72, cz, { cast: false });
      K.box(1.7, 1.4, 1.7, K.glass, cx, 1.45, cz, { cast: false }); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.box(0.05, 1.4, 0.05, gilt, cx + a * 0.85, 1.45, cz + b * 0.85, { cast: false });
      for (const q of [-1, 1]) { K.box(1.76, 0.08, 0.08, gilt, cx, 2.18, cz + q * 0.85); K.box(0.08, 0.08, 1.76, gilt, cx + q * 0.85, 2.18, cz); }
      const strips = []; for (const s of [-1, 1]) { strips.push(K.box(1.6, 0.03, 0.03, K.glow(0xfff0d0, 2.2), cx, 2.12, cz + s * 0.8, { cast: false })); strips.push(K.box(0.03, 0.03, 1.6, K.glow(0xfff0d0, 2.2), cx + s * 0.8, 2.12, cz, { cast: false })); }
      const geo = new T.IcosahedronGeometry(0.5, 2); const pa = geo.attributes.position; for (let i = 0; i < pa.count; i++) { const v = new T.Vector3().fromBufferAttribute(pa, i); const k = 0.82 + Math.sin(v.x * 9) * 0.06 + Math.cos(v.y * 11 + v.z * 7) * 0.07 + R() * 0.05; pa.setXYZ(i, v.x * k * 1.25, v.y * k * 0.85, v.z * k); } geo.computeVertexNormals();
      const rock = K.add(geo, K.mat(0x4a443e, { metalness: 0.75, roughness: 0.45 }), cx, 1.2, cz); rock.rotation.set(0.3, 0.6, 0.1);
      K.cyl(0.25, 0.32, 0.12, brassD, cx, 0.8, cz, {}, 16);
      K.sign('METEORITO DE BENDEGÓ · FRAGMENTO', 1.6, 0.12, cx, 0.45, cz + 0.96, { color: '#e2bd62', size: 30, w: 512, h: 48 });
      K.box(0.12, 0.18, 0.06, M.white, cx + 0.98, 0.45, cz, { cast: false }); const sw = K.box(0.03, 0.06, 0.03, K.glow(0x40ff60, 2), cx + 1.0, 0.47, cz, { cast: false });
      const halo = K.halo(cx, 1.5, cz, 1.2, 0xfff0d0, 0.35), pool = K.pool(cx, cz, 1.8, 0xfff0d0, 0.45);
      const spot = K.spot(cx + 0.5, 4.2, cz + 1.2, cx, 1.1, cz, 0xfff4e0, 3.0, 8, 0.4);
      K.col(-12.9, -1.9, -10.7, 0.3);
      ropeLine([[-13.2, 0.55], [-12.0, 0.75], [-10.8, 0.55]], false);
      return { strips, halo, pool, spot, sw };
    })();
    K.tell('meteorito', (live) => { const off = () => { met.strips.forEach(s => s.visible = false); met.halo.visible = met.pool.visible = false; met.spot.intensity = 0; met.sw.material = K.glow(0xff3020, 2); }; if (live) K.anim(1.2, (e, u) => { if (u >= 1) off(); else { const on = Math.sin(u * 40) > 0; met.spot.intensity = on ? 3 : 0; met.strips.forEach(s => s.visible = on); } }); else off(); }, () => { met.strips.forEach(s => s.visible = true); met.halo.visible = met.pool.visible = true; met.spot.intensity = 3.0; met.sw.material = K.glow(0x40ff60, 2); });
    [[-11.8, 0.95, -11.8, -0.8], [-13.0, 0.95, -11.8, -0.8]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'view'));

    // ------------------------------------------------------------ elefante empalhado
    const trunk = [];
    { const eg = K.group(-11.7, 0.35, 5.6);
      K.box(4.0, 0.35, 2.8, oakDark, 0, -0.175, 0, { parent: eg }); K.box(4.1, 0.05, 2.9, gilt, 0, 0.0, 0, { parent: eg, cast: false });
      const sk = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#857a70'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(50,40,35,.35)'; for (let k = 0; k < 160; k++) { g.lineWidth = 1 + R() * 2; g.beginPath(); const x = R() * w, y = R() * h; g.moveTo(x, y); g.quadraticCurveTo(x + 10, y + R() * 6 - 3, x + 20 + R() * 20, y + R() * 4 - 2); g.stroke(); } K.grain(g, w, h, 18); }, [3, 3]);
      const skin = K.texMat(sk, { roughness: 0.95 });
      K.add(new T.SphereGeometry(1, 18, 14).scale(1.5, 0.95, 0.85), skin, 0, 1.85, 0, { parent: eg });
      for (const [a, b] of [[0.9, 0.45], [0.9, -0.45], [-0.9, 0.45], [-0.9, -0.45]]) { K.cyl(0.27, 0.3, 1.4, skin, a, 0.7, b, { parent: eg }, 12); K.cyl(0.32, 0.32, 0.08, ivory, a, 0.04, b, { parent: eg }, 12); }
      K.add(new T.SphereGeometry(0.62, 14, 12).scale(0.9, 1, 0.85), skin, 1.55, 2.35, 0, { parent: eg });
      for (const s of [-1, 1]) { const ear = K.add(new T.CircleGeometry(0.75, 16).scale(0.75, 1, 1), K.texMat(sk, { roughness: 0.95, side: T.DoubleSide }), 1.25, 2.3, s * 0.6, { parent: eg }); ear.rotation.y = s * 0.35; K.sphere(0.05, M.black, 1.95, 2.5, s * 0.36, { parent: eg }, 6, 4); const tk = K.add(new T.TorusGeometry(0.5, 0.055, 6, 12, Math.PI / 2), ivory, 1.75, 1.6, s * 0.28, { parent: eg }); tk.rotation.set(0, 0, Math.PI * 0.9); }
      const tail = K.cyl(0.03, 0.04, 0.9, skin, -1.55, 1.75, 0, { parent: eg, rz: -0.25 }, 6);
      let par = K.group(1.98, 2.18, 0, 0, eg);
      for (let i = 0; i < 7; i++) { const r = 0.15 - i * 0.014; K.cyl(r * 0.9, r, 0.3, skin, 0, -0.15, 0, { parent: par }, 10); trunk.push(par); par = K.group(0, -0.28, 0, 0, par); }
      K.sphere(0.06, skin, 0, -0.02, 0, { parent: par }, 8, 6);
      K.sign('LOXODONTA AFRICANA', 1.8, 0.2, 0.2, -0.17, 1.42, { parent: eg, color: '#e2bd62', size: 50, w: 512, h: 64 });
      K.spot(-8.6, 3.2, 8.6, -11.7, 1.8, 5.6, 0xffe6c0, 2.4, 12, 0.5); K.pool(-11.7, 5.6, 2.4, 0xffd8a0, 0.25);
      K.col(-13.9, 3.4, -9.6, 7.8);
      ropeLine([[-9.5, 3.3], [-9.5, 5.55], [-9.5, 7.85], [-11.6, 7.85], [-13.8, 7.85]], false);
    }
    const setTrunk = (k) => trunk.forEach((g, i) => { g.rotation.z = 0.04 * i + k * 0.4; });
    setTrunk(0);
    K.tell('elefante', (live) => { if (live) K.anim(1.8, e => setTrunk(e)); else setTrunk(1); }, () => setTrunk(0));
    [[-11.0, 8.45, -11.7, 5.6], [-12.7, 8.45, -11.7, 5.6], [-9.0, 3.0, -11.7, 5.6]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'view'));

    // ------------------------------------------------------------ mesas redondas do jantar
    const plates = [], chargers = [], forks = [], knives = [], coupes = [], napkins = [];
    const tables = [[-6.4, 5.4, 0xc8322f], [-3.0, 8.0, 0xf6f3ec], [0.8, 5.4, 0xd9a441], [4.6, 8.0, 0xf6f3ec], [7.6, 5.0, 0xc8322f]];
    tables.forEach(([cx, cz, fl], ti) => {
      K.table(cx, cz, { r: 0.8, h: 0.76, flower: fl, glasses: 0, candle: false, cloth: K.mat(0xf3eee2, { roughness: 0.9 }) });
      K.cyl(0.82, 0.82, 0.02, K.mat(0x5a0a16, { roughness: 0.95 }), cx, 0.785, cz, { cast: false }, 28);
      // candelabro de prata com 3 velas
      K.cyl(0.08, 0.1, 0.03, K.silver, cx, 0.81, cz, {}, 12); K.cyl(0.015, 0.025, 0.42, K.silver, cx, 1.02, cz, {}, 8);
      for (const a of [0, 2.09, 4.19]) { const x = cx + Math.cos(a) * 0.13, z = cz + Math.sin(a) * 0.13; K.cyl(0.014, 0.014, 0.13, K.silver, x, 1.18, z, { cast: false }, 6); K.cyl(0.016, 0.016, 0.14, M.candle, x, 1.31, z, { cast: false }, 6); K.flame(x, 1.38, z, 0.015); }
      K.pool(cx, cz, 1.6, 0xffb060, 0.28);
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 + 0.3, dx = Math.cos(a), dz = Math.sin(a), px = -dz, pz = dx;
        plates.push([cx + dx * 0.55, 0.8, cz + dz * 0.55]); chargers.push([cx + dx * 0.55, 0.796, cz + dz * 0.55]);
        const ry = Math.atan2(dx, dz); forks.push([cx + dx * 0.55 + px * 0.17, 0.8, cz + dz * 0.55 + pz * 0.17, ry]); knives.push([cx + dx * 0.55 - px * 0.17, 0.8, cz + dz * 0.55 - pz * 0.17, ry]);
        coupes.push([cx + dx * 0.45 - px * 0.15, 0.8, cz + dz * 0.45 - pz * 0.15]); napkins.push([cx + dx * 0.55, 0.81, cz + dz * 0.55, ry]);
        const chx = cx + dx * 1.15, chz = cz + dz * 1.15;
        K.chair(chx, chz, Math.atan2(-dx, -dz), { seat: K.mat(0xf3eee2, { roughness: 0.9 }), frame: gilt, back: gilt });
        if (k !== ti % 6) K.slot(chx, chz, cx, cz, 'sit');
      }
    });
    K.inst(new T.CylinderGeometry(0.12, 0.1, 0.012, 16), M.white, plates, { cast: false });
    K.inst(new T.CylinderGeometry(0.155, 0.155, 0.006, 18), gilt, chargers, { cast: false });
    K.inst(new T.BoxGeometry(0.018, 0.005, 0.18), K.silver, forks, { cast: false }); K.inst(new T.BoxGeometry(0.018, 0.005, 0.2), K.silver, knives, { cast: false });
    K.inst(new T.CylinderGeometry(0.04, 0.012, 0.03, 10).translate(0, 0.1, 0), K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.3, roughness: 0.1 }), coupes, { cast: false });
    K.inst(new T.CylinderGeometry(0.004, 0.004, 0.09, 4).translate(0, 0.045, 0), K.glass, coupes, { cast: false });
    K.inst(new T.ConeGeometry(0.045, 0.12, 4).translate(0, 0.06, 0), K.mat(0x7a1020, { roughness: 0.9 }), napkins, { cast: false });
    K.plight(0.5, 3.4, 6.6, 0xffc080, 1.6, 15);

    // ------------------------------------------------------------ púlpito dos catálogos (entrada)
    const cat = (() => {
      const g = K.group(1.0, 0, 9.35);
      K.cyl(0.06, 0.08, 1.0, oakDark, 0, 0.5, 0, { parent: g }, 10); K.cyl(0.28, 0.32, 0.05, oakDark, 0, 0.03, 0, { parent: g }, 16);
      const top = K.group(0, 1.05, 0, 0, g); top.rotation.x = -0.45;
      K.box(0.7, 0.04, 0.5, oakDark, 0, 0, 0, { parent: top });
      const pageM = K.texMat(K.canvasTex(256, 160, (gg, w, h) => { gg.fillStyle = '#f3ecdc'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#2a2a30'; gg.font = '700 18px Georgia'; gg.fillText('CATÁLOGO', 20, 30); gg.font = '12px Georgia'; for (let k = 0; k < 7; k++) gg.fillRect(20, 50 + k * 14, 90, 3); gg.fillStyle = '#d9a441'; gg.fillRect(140, 30, 90, 90); gg.fillStyle = '#121a36'; gg.font = '700 40px Georgia'; gg.fillText('27', 160, 95); gg.fillStyle = 'rgba(0,0,0,.2)'; gg.fillRect(126, 0, 4, h); }), { roughness: 0.9 });
      const pages = K.box(0.62, 0.03, 0.42, pageM, 0, 0.035, 0, { parent: top, cast: false });
      const st = K.group(-0.75, 0, 0, 0, g); K.box(0.5, 0.8, 0.4, oakDark, 0, 0.4, 0, { parent: st });
      const stack = []; const cm = K.mat(0xf0e6cc, { roughness: 0.7 }); for (let k = 0; k < 8; k++) stack.push(K.box(0.24, 0.03, 0.32, cm, (k % 2) * 0.02 - 0.01, 0.82 + k * 0.032, 0, { parent: st, ry: (R() - 0.5) * 0.2 }));
      K.box(0.2, 0.01, 0.05, gilt, 0, 0.82 + 8 * 0.032, 0.1, { parent: st, cast: false });
      K.lamppost(1.0 + 0.6, 9.5, { h: 1.4, light: false, color: 0xffd090, mat: gilt });
      K.colR(1.0, 9.35, 0.35); K.col(0.0, 9.1, 0.5, 9.6);
      return { pages, pageM, stack, cm, top };
    })();
    K.tell('catalogo', (live) => { const red = K.mat(0xd0182a, { roughness: 0.5, emissive: 0x600008, emissiveIntensity: 0.5 }); cat.stack.forEach(s => s.material = red); cat.pages.material = red; if (live) K.anim(0.8, e => { cat.top.rotation.x = -0.45 - Math.sin(e * Math.PI) * 0.6; }); }, () => { cat.stack.forEach(s => s.material = cat.cm); cat.pages.material = cat.pageM; cat.top.rotation.x = -0.45; });

    // ------------------------------------------------------------ bar de champanhe (direita)
    const mag = (() => {
      const cx = 12.7;
      K.add(K.rbox(0.8, 1.05, 6.6, 0.06), oakDark, cx, 0.525, -0.9); K.box(0.95, 0.06, 6.8, K.mat(0xeee8dc, { roughness: 0.15 }), cx, 1.08, -0.9);
      K.box(0.03, 0.85, 6.4, gilt, cx - 0.41, 0.5, -0.9, { cast: false }); for (let z = -4.0; z <= 2.2; z += 0.62) K.box(0.04, 0.85, 0.04, gilt, cx - 0.42, 0.5, z, { cast: false });
      K.col(12.0, -4.4, 14.8, 2.5);
      // estante espelhada com garrafas
      K.box(0.35, 2.6, 6.6, oakDark, 14.55, 1.3, -0.9); K.add(new T.PlaneGeometry(6.2, 1.5), K.mat(0xbfc8d8, { metalness: 0.95, roughness: 0.08, envMapIntensity: 1.4 }), 14.36, 1.95, -0.9, { ry: -Math.PI / 2, cast: false });
      for (const y of [1.3, 1.85, 2.4]) { K.box(0.3, 0.03, 6.4, gilt, 14.35, y, -0.9, { cast: false }); for (let k = 0; k < 20; k++) { const c = [0x1e4a28, 0x2a3a1a, 0xe8e0c8, 0x1e4a28, 0xc9a227][k % 5]; K.lathe([[0, 0], [0.04, 0], [0.042, 0.18], [0.016, 0.26], [0.014, 0.32], [0, 0.32]], K.mat(c, { roughness: 0.15, metalness: 0.2, emissive: c, emissiveIntensity: 0.12 }), 14.3, y + 0.015, -4.0 + k * 0.32, { cast: false }, 8); K.cyl(0.016, 0.016, 0.05, gilt, 14.3, y + 0.33, -4.0 + k * 0.32, { cast: false }, 5); } }
      K.box(0.05, 0.05, 6.4, K.glow(0xffd090, 2.4), 14.28, 2.62, -0.9, { cast: false });
      K.sign('CHAMPAGNE', 2.6, 0.55, 14.7, 3.05, -0.9, { ry: -Math.PI / 2, neon: true, color: '#ffe0a0', font: 'Georgia, serif', size: 86, k: 2.0 });
      // torre de champanhe na ponta do balcão
      const tw = [], tx = 12.65, tz = 1.6; for (let lv = 0; lv < 5; lv++) { const n = 5 - lv, y = 1.11 + lv * 0.13; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tw.push([tx + (i - (n - 1) / 2) * 0.11, y, tz + (j - (n - 1) / 2) * 0.11]); }
      const champ = K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.4, roughness: 0.1 });
      K.inst(new T.CylinderGeometry(0.05, 0.012, 0.035, 10).translate(0, 0.085, 0), champ, tw, { cast: false }); K.inst(new T.CylinderGeometry(0.004, 0.004, 0.07, 4).translate(0, 0.035, 0), K.glass, tw, { cast: false });
      K.halo(tx, 1.5, tz, 0.6, 0xffd070, 0.4);
      // baldes de gelo e taças no balcão
      for (const z of [-3.6, -2.2, 0.3]) { K.cyl(0.12, 0.1, 0.22, K.silver, 12.6, 1.22, z, {}, 14); K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.016, 0.28], [0.014, 0.34], [0, 0.34]], K.mat(0x1e4a28, { roughness: 0.15, metalness: 0.2 }), 12.6, 1.18, z, { cast: false }, 8); K.cyl(0.018, 0.018, 0.05, gilt, 12.6, 1.54, z, { cast: false }, 5); }
      const cps = []; for (let k = 0; k < 12; k++) cps.push([12.4 + (k % 2) * 0.12, 1.11, -3.9 + k * 0.42]); K.inst(new T.CylinderGeometry(0.045, 0.012, 0.03, 10).translate(0, 0.1, 0), champ, cps, { cast: false }); K.inst(new T.CylinderGeometry(0.004, 0.004, 0.09, 4).translate(0, 0.045, 0), K.glass, cps, { cast: false });
      // a magnum de 1907 (missão)
      K.cyl(0.17, 0.14, 0.3, K.silver, 12.6, 1.26, -1.0, {}, 16);
      const bm = K.mat(0x163a20, { roughness: 0.12, metalness: 0.25 });
      const b = K.lathe([[0, 0], [0.075, 0], [0.08, 0.03], [0.08, 0.34], [0.03, 0.46], [0.024, 0.58], [0, 0.58]], bm, 12.6, 1.12, -1.0, { cast: false }, 14);
      K.cyl(0.03, 0.03, 0.09, gilt, 12.6, 1.66, -1.0, { cast: false }, 8); K.box(0.12, 0.09, 0.005, K.mat(0xf3ecdc), 12.52, 1.42, -1.0, { ry: -Math.PI / 2, cast: false });
      const hl = K.halo(12.6, 1.5, -1.0, 0.5, 0xffd040, 1.6); hl.visible = false;
      K.plight(11.8, 2.4, -1.0, 0xffc890, 1.5, 8);
      [-3.7, -2.7, -1.9, -0.1, 0.8, 1.8].forEach(z => K.slot(11.55, z, 12.6, z, 'bar'));
      // banquetas
      [-3.2, -2.3, 0.4, 1.3].forEach(z => { K.cyl(0.18, 0.18, 0.05, velvet, 11.75, 0.74, z, {}, 14); K.cyl(0.025, 0.04, 0.72, K.brass, 11.75, 0.37, z, {}, 6); K.torus(0.14, 0.012, K.brass, 11.75, 0.3, z, { rx: Math.PI / 2 }); });
      return { b, bm, hl };
    })();
    K.tell('magnum', (live) => { mag.b.material = K.mat(0xd9a441, { metalness: 0.9, roughness: 0.2, emissive: 0xffb020, emissiveIntensity: 0.9 }); mag.hl.visible = true; if (live) K.anim(1.2, (e) => { mag.b.rotation.y = e * Math.PI * 6; mag.b.position.y = 1.12 + Math.sin(e * Math.PI) * 0.25; }); }, () => { mag.b.material = mag.bm; mag.hl.visible = false; mag.b.rotation.y = 0; mag.b.position.y = 1.12; });

    // ------------------------------------------------------------ guarda-volumes (fundo à direita)
    const mink = (() => {
      K.add(K.rbox(4.2, 1.05, 0.6, 0.05), oakDark, 12.3, 0.525, -5.9); K.box(4.3, 0.05, 0.7, K.mat(0xeee8dc, { roughness: 0.2 }), 12.3, 1.07, -5.9);
      K.cyl(0.06, 0.07, 0.05, K.brass, 11.3, 1.12, -5.8, {}, 12); K.sphere(0.055, K.brass, 11.3, 1.15, -5.8, {}, 10, 6);
      for (let k = 0; k < 6; k++) K.box(0.05, 0.005, 0.08, K.mat([0xd9a441, 0xc8322f][k % 2]), 12.6 + k * 0.08, 1.1, -5.75, { cast: false });
      const parts = [];
      for (const z of [-7.45, -6.85]) { for (const x of [10.5, 14.2]) parts.push([boneG([x, 0, z], [x, 1.8, z], 0.02, 0.02), 0xb8893a]); parts.push([boneG([10.5, 1.8, z], [14.2, 1.8, z], 0.015, 0.015), 0xb8893a]);
        for (let k = 0; k < 12; k++) { const x = 10.75 + k * 0.29; if (z === -6.85 && k === 1) continue; parts.push([boxG(0.12, 1.0, 0.48, [x, 1.25, z]), [0x16161a, 0x8a6a48, 0x1a2238, 0x5a1a22, 0x4a4a52, 0xc9b48a, 0x2a3a2e][(k * 3 + (z > -7 ? 1 : 0)) % 7]]); } }
      K.merge(parts, K.vcol({ roughness: 0.85 }));
      const g = K.group(11.04, 1.8, -6.85); const coat = K.add(new T.SphereGeometry(0.3, 10, 8).scale(0.45, 1.85, 0.95), K.mat(0xf2ede4, { roughness: 1 }), 0, -0.58, 0, { parent: g }); K.add(new T.TorusGeometry(0.12, 0.012, 4, 10, Math.PI), K.brass, 0, -0.02, 0, { parent: g, ry: Math.PI / 2 });
      K.sign('GUARDA-VOLUMES', 2.6, 0.4, 12.3, 2.7, -8.06, { color: '#e2bd62', size: 64, w: 1024, h: 128 });
      K.pool(12.3, -6.4, 2.2, 0xffd8a0, 0.35); K.halo(12.3, 2.4, -7.2, 1.0, 0xffd8a0, 0.25);
      K.col(10.0, -8.1, 14.6, -5.6);
      [12.3, 13.5].forEach(x => K.slot(x, -5.15, x, -5.9, 'bar'));
      return { coat, g, m: coat.material };
    })();
    K.tell('casaco', (live) => { mink.coat.material = K.mat(0xd8182a, { roughness: 0.8, emissive: 0x400008, emissiveIntensity: 0.4 }); if (live) K.anim(1.5, e => { mink.g.rotation.x = Math.sin(e * 18) * 0.35 * (1 - e); }); }, () => { mink.coat.material = mink.m; mink.g.rotation.x = 0; });

    // ------------------------------------------------------------ piano de cauda, harpa e contrabaixo (frente à direita)
    { const g = K.group(12.2, 0, 6.9);
      const sh = new T.Shape(); sh.moveTo(-0.9, -0.75); sh.lineTo(-0.9, 0.75); sh.lineTo(0.2, 0.75); sh.bezierCurveTo(0.7, 0.75, 0.6, 0.1, 1.1, -0.1); sh.bezierCurveTo(1.3, -0.25, 1.1, -0.75, 0.7, -0.75); sh.lineTo(-0.9, -0.75);
      const body = new T.ExtrudeGeometry(sh, { depth: 0.32, bevelEnabled: false }); body.rotateX(-Math.PI / 2);
      K.add(body, lacquer, 0, 0.62, 0, { parent: g });
      const lid = K.add(new T.ShapeGeometry(sh).rotateX(-Math.PI / 2), K.mat(0x121216, { roughness: 0.2, side: T.DoubleSide }), 0, 0.95, 0, { parent: g }); lid.rotation.x = -0.0; lid.rotation.z = 0.0; lid.position.y = 0.96; lid.rotation.set(0.5, 0, 0); lid.position.z = 0.05;
      K.cyl(0.01, 0.01, 0.7, gilt, 0.2, 1.2, -0.3, { parent: g }, 4);
      K.box(0.25, 0.08, 1.4, M.white, -1.0, 0.86, 0, { parent: g }); const bk = []; for (let k = 0; k < 20; k++) if (k % 7 !== 2 && k % 7 !== 6) bk.push([12.2 - 0.94, 0.905, 6.9 - 0.65 + k * 0.068]);
      K.inst(new T.BoxGeometry(0.13, 0.03, 0.03), M.black, bk, { cast: false });
      K.box(0.3, 0.12, 1.5, lacquer, -1.05, 0.79, 0, { parent: g });
      for (const [a, b] of [[-0.8, -0.6], [-0.8, 0.6], [0.8, -0.4]]) K.cyl(0.05, 0.04, 0.62, lacquer, a, 0.31, b, { parent: g }, 8);
      K.box(0.04, 0.3, 0.5, K.mat(0xf3ecdc), -0.9, 1.1, 0, { parent: g, rz: 0.2, cast: false });
      K.add(K.rbox(0.35, 0.08, 0.8, 0.03), K.mat(0x121216, { roughness: 0.5 }), 10.85, 0.48, 6.9); for (const s of [-1, 1]) K.box(0.3, 0.44, 0.04, lacquer, 10.85, 0.22, 6.9 + s * 0.36);
      K.slot(10.75, 6.9, 12.2, 6.9, 'piano');
      const hp = K.group(13.8, 0, 8.7, -2.2); K.box(0.4, 0.15, 0.3, gilt, 0, 0.075, 0, { parent: hp }); K.cyl(0.04, 0.05, 1.7, gilt, -0.15, 0.95, 0, { parent: hp }, 8); K.add(new T.TorusGeometry(0.5, 0.045, 6, 16, Math.PI * 0.8), gilt, 0.2, 1.4, 0, { parent: hp, rz: -0.35 }); for (let k = 0; k < 9; k++) K.box(0.004, 1.0 - k * 0.08, 0.004, K.mat(0xf3e0b0), -0.05 + k * 0.07, 0.75 - k * 0.04 + 0.2, 0, { parent: hp, cast: false });
      const cb = K.group(13.9, 0, 5.0, -1.2); K.add(new T.SphereGeometry(0.34, 12, 10).scale(1, 1.7, 0.4), K.mat(0x6a2a10, { roughness: 0.3 }), 0, 0.85, 0, { parent: cb, rz: 0.15 }); K.box(0.06, 0.9, 0.05, M.black, -0.12, 1.75, 0, { parent: cb, rz: 0.15 });
      K.col(11.25, 6.1, 13.4, 7.7); K.colR(13.8, 8.7, 0.35); K.colR(13.9, 5.0, 0.35);
      K.plight(11.4, 2.6, 6.6, 0xffc890, 1.2, 7); K.pool(12.0, 6.9, 2.0, 0xffc080, 0.3);
      [[10.0, 8.7, 11.8, 6.9], [10.2, 5.0, 11.8, 6.9]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'view'));
    }

    // ------------------------------------------------------------ plantas, cordões finais, vagas gerais
    for (const [x, z] of [[-14.0, 9.3], [14.0, 9.4], [-14.0, 2.2], [14.1, 3.5], [-9.2, -2.6]]) K.plant(x, z, 'palm', { pot: K.mat(0xd8cfc0, { roughness: 0.6 }), s: 1.15 });
    for (const [x, z] of [[-3.6, -7.0], [3.6, -7.0]]) { K.lathe([[0, 0], [0.22, 0], [0.3, 0.5], [0.34, 0.55], [0, 0.55]], gilt, x, -0.0, z + 0.55 - 0.35, {}, 14); }
    K.inst(new T.CylinderGeometry(0.025, 0.03, 0.9, 6).translate(0, 0.45, 0), K.brass, posts);
    K.inst(new T.CylinderGeometry(0.13, 0.15, 0.04, 12), K.brass, posts.map(p => [p[0], 0.02, p[2]]));
    K.inst(new T.SphereGeometry(0.045, 8, 6), K.brass, posts.map(p => [p[0], 0.92, p[2]]), { cast: false });
    if (ropeParts.length) K.merge(ropeParts, K.vcol({ roughness: 0.9 }));
    // vagas: T-rex, selfies, conversas
    [[-2.4, 3.8, -2.4, 1.4], [-0.6, 3.8, -0.6, 1.4], [6.2, 1.4, 3, 1.4], [-6.2, 2.9, -3, 1.4], [-1.8, -1.0, -1.8, 1.4], [1.8, -1.0, 1.8, 1.4], [4.6, -1.0, 4.6, 1.4], [-4.6, -1.0, -4.6, 1.4]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'view'));
    K.slot(2.3, 3.85, 2.3, 5, 'selfie'); K.slot(-10.0, 3.0, -9.0, 2.6, 'selfie');
    K.ringSlots(0, -2.9, 3, 0.7, 'talk'); K.ringSlots(8.6, -0.6, 3, 0.7, 'talk'); K.ringSlots(-8.2, -1.7, 3, 0.7, 'talk', 0, 1.0); K.ringSlots(-6.6, 8.9, 3, 0.65, 'talk', 0, 0.2); K.ringSlots(9.4, 2.9, 2, 0.6, 'talk');
    [[7.2, 9.4, 8.0, 9.4], [8.0, 9.4, 7.2, 9.4], [-8.0, -6.0, -8.0, -5.2], [-8.0, -5.2, -8.0, -6.0], [8.6, -5.6, 9.4, -5.6], [9.4, -5.6, 8.6, -5.6]].forEach(([x, z, a, b]) => K.slot(x, z, a, b, 'talk'));

    // ------------------------------------------------------------ exterior: praça, avenida, cidade à noite
    const paveTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2a2a30'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.4)'; for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(k * 32, 0); g.lineTo(k * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, k * 32); g.lineTo(w, k * 32); g.stroke(); } K.grain(g, w, h, 12); }, [60, 60]);
    K.add(new T.PlaneGeometry(240, 240).rotateX(-Math.PI / 2), K.texMat(paveTex, { roughness: 0.9 }), 0, -0.92, 0, { cast: false });
    K.add(new T.PlaneGeometry(240, 9).rotateX(-Math.PI / 2), K.mat(0x16161a, { roughness: 0.6, metalness: 0.1 }), 0, -0.9, 24, { cast: false });
    { const l = []; for (let x = -100; x < 100; x += 4) l.push([x, -0.888, 24, 0, 1]); K.inst(new T.PlaneGeometry(2, 0.15).rotateX(-Math.PI / 2), K.mat(0xe8e0c8), l, { cast: false }); }
    // tapete vermelho descendo a escadaria até a limusine
    K.box(2.4, 0.02, 1.6, velvet, 0, -0.44, 10.75, { cast: false }); K.add(new T.PlaneGeometry(2.4, 8.0).rotateX(-Math.PI / 2), velvet, 0, -0.9, 15.4, { cast: false });
    for (const sx of [-1, 1]) for (let z = 12.2; z <= 18.8; z += 2.2) K.cyl(0.03, 0.03, 0.9, K.brass, sx * 1.6, -0.45, z, {}, 6);
    // limusine estacionada e táxi passando
    const car = (x, z, c, len, ry) => { const g = K.group(x, -0.9, z, ry); K.add(K.rbox(len, 0.55, 1.8, 0.15), K.mat(c, { roughness: 0.2, metalness: 0.6 }), 0, 0.5, 0, { parent: g }); K.add(K.rbox(len * 0.55, 0.45, 1.6, 0.15), K.mat(0x14181e, { roughness: 0.1, metalness: 0.5 }), -0.1, 0.95, 0, { parent: g }); for (const a of [-len * 0.35, len * 0.35]) for (const s of [-1, 1]) K.cyl(0.3, 0.3, 0.2, M.black, a, 0.3, s * 0.85, { parent: g, rx: Math.PI / 2 }, 12); for (const s of [-1, 1]) { K.box(0.05, 0.12, 0.3, K.glow(0xfff4d0, 2.5), len / 2, 0.55, s * 0.6, { parent: g, cast: false }); K.box(0.05, 0.1, 0.3, K.glow(0xff2020, 2), -len / 2, 0.55, s * 0.6, { parent: g, cast: false }); } return g; };
    car(5.5, 20.6, 0x0c0c10, 6.4, 0); car(-9, 20.8, 0x1a2238, 4.6, 0);
    const taxi = car(0, 26.0, 0xf2c14e, 4.4, Math.PI); K.box(0.5, 0.15, 0.25, K.glow(0xffe0a0, 1.6), 0, 1.25, 0, { parent: taxi, cast: false });
    K.tick((dt, t) => { taxi.position.x = 70 - ((t * 9) % 140); });
    // paparazzi do lado de fora (flashes)
    const paps = [[-3.2, 0.8, 14], [3.4, 0.8, 13.2], [-2.8, 0.8, 17]].map(p => { const h = K.halo(p[0], p[1], p[2], 0.6, 0xffffff, 2.5); h.visible = false; return h; });
    K.tick((dt, t) => { paps.forEach((h, i) => { h.visible = Math.sin(t * (2.3 + i * 0.7) + i * 2) > 0.985; }); });
    for (const x of [-12, -4.5, 4.5, 12]) K.lamppost(x, 29.5, { y: -0.9, h: 3.2, light: false, color: 0xffd090 });
    // jardins laterais: sebes baixas, postes, árvores mais longe
    for (const sx of [-1, 1]) {
      for (let z = -10; z <= 12; z += 3.2) K.add(K.rbox(2.6, 0.8, 0.9, 0.2), K.mat(0x23402a, { roughness: 0.95 }), sx * 19, -0.5, z, { cast: false });
      for (const z of [-6, 2, 10]) K.lamppost(sx * 17.2, z, { y: -0.9, h: 3.0, light: false, color: 0xffc070 });
      for (const z of [-14, -4, 6, 16]) { K.cyl(0.18, 0.25, 3, M.walnut, sx * 27, 0.6, z, { cast: false }, 8); K.sphere(2.2, K.mat(0x1c3322, { roughness: 1 }), sx * 27, 4.2, z, { cast: false }, 10, 8); }
    }
    // poleiro do sniper: telhado do Edifício Aurora
    { K.facade(16, 17.2, 10, 2, 50, { y: -0.9, floors: 12, bays: 7, lit: 0.5, wall: '#3a3430' });
      K.box(16.4, 0.5, 0.4, K.mat(0x5a5048), 2, 16.55, 45.0, { cast: false }); K.box(16.4, 0.3, 10.4, K.mat(0x4a4038), 2, 16.25, 50, { cast: false });
      K.cyl(1.2, 1.2, 2.2, K.mat(0x6a5a48), -3, 17.5, 52, { cast: false }, 12); K.cone(1.3, 0.8, K.mat(0x4a3a30), -3, 19.0, 52, { cast: false }, 12);
      K.cyl(0.04, 0.04, 6, K.iron, 7, 19.2, 51, { cast: false }, 4); K.halo(7, 22.2, 51, 0.5, 0xff3020, 1.6);
      K.sign('EDIFÍCIO AURORA', 6, 1.0, 2, 15.4, 44.96, { neon: true, color: '#9fe0ff', size: 72, k: 1.8, ry: Math.PI });
      K.halo(2, 18.2, 45.0, 0.22, 0xff4134, 1.0);
    }
    // cidade: prédios em volta (frente além de 35 m, laterais além de 30 m, fundo alto)
    const city = [[-24, 48, 14, 22], [-40, 46, 12, 30], [24, 49, 12, 26], [40, 47, 14, 20], [-14, 52, 9, 15], [16, 53, 8, 18],
      [-38, 20, 10, 26], [-42, -6, 12, 34], [-38, -30, 12, 28], [38, 22, 10, 22], [42, -4, 12, 38], [36, -28, 12, 30],
      [-26, -42, 12, 40], [-10, -46, 14, 30], [6, -44, 12, 46], [22, -42, 12, 34], [-34, -58, 14, 24], [34, -58, 14, 28]];
    city.forEach(([x, z, w, h], k) => { K.facade(w, h, w * 0.8, x, z, { y: -0.9, floors: Math.round(h / 2.4), bays: Math.round(w / 2), lit: 0.35 + R() * 0.25, wall: ['#232838', '#2a2a36', '#1e2430', '#30303a'][k % 4], glow: 0.5 }); K.box(w + 0.3, 0.3, w * 0.8 + 0.3, K.mat(0x14161c), x, h - 0.75, z, { cast: false }); if (k % 3 === 0) K.halo(x, h + 0.2, z, 0.35, 0xff3020, 1.4); });
    // catedral com cúpula ao fundo
    { const g = K.group(-20, -0.9, -36); K.box(10, 14, 8, K.mat(0x4a4a56), 0, 7, 0, { parent: g, cast: false }); K.cyl(3.4, 3.6, 4, K.mat(0x4a4a56), 0, 16, 0, { parent: g, cast: false }, 16); K.add(new T.SphereGeometry(3.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0x3a5a5a, { metalness: 0.4, roughness: 0.5 }), 0, 18, 0, { parent: g, cast: false }); K.cyl(0.2, 0.3, 2, gilt, 0, 22.5, 0, { parent: g, cast: false }, 6); K.halo(-20, 21, -32, 6, 0xffc080, 0.15); }
    // lua
    K.halo(-40, 60, -110, 9, 0xdfe6ff, 0.5); K.sphere(3.2, K.glow(0xf4f0e0, 1.1), -40, 60, -112, { cast: false }, 16, 12);
    // ------------------------------------------------------------ holofotes de gala atrás do museu, cruzando o céu entre as torres
    // (nascem atrás do prédio e sobem para trás e para os lados: ficam sempre atrás da festa, nunca entre ela e o sniper)
    { const facho = new T.CylinderGeometry(3.2, 0.35, 90, 16, 1, true).translate(0, 45, 0), fm = new T.MeshBasicMaterial({ color: 0xfff2d8, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, toneMapped: false });
      const hs = [-1, 1].map((sx) => { const lamp = K.group(sx * 8.5, 9, -17);
        const f = new T.Mesh(facho, fm); f.userData.noCol = true; f.raycast = () => { }; lamp.add(f); K.halo(0, 0.4, 0, 2.2, 0xfff0d0, 1.4, lamp);
        return { lamp, sx, ph: sx > 0 ? 0 : 2.6 }; });
      K.tick((dt, t) => hs.forEach(h => { const a = 1.1 + Math.sin(t * 0.19 + h.ph) * 0.9, th = 0.28 + Math.sin(t * 0.31 + h.ph) * 0.12; // a: 0 = para fora, π/2 = para trás, além disso cruza
        h.lamp.rotation.set(0, 0, 0); h.lamp.rotateY(h.sx > 0 ? -a : Math.PI + a); h.lamp.rotateZ(-th); }));
    }
    // ------------------------------------------------------------ lasers de segurança na frente da Estrela de Bengala: um leque que
    // gira rente ao chão; quando alguém chega perto da vitrine eles ficam mais fortes e o giroflex vermelho da parede pisca um pouco
    { const lz = K.group(-11.6, 0.22, -5.7), lasers = [], lm = K.glow(0xff2030, 1.2), lf = K.glow(0xff2030, 2.6);
      for (let k = 0; k < 6; k++) lasers.push(K.box(2.6, 0.012, 0.012, lm, 0, (k % 2) * 0.3, 0, { parent: lz, ry: k * Math.PI / 6, cast: false }));
      lz.traverse(o => { o.userData.noCol = true; o.raycast = () => { }; });
      const gx = K.group(-9.9, 2.5, -7.9); K.cyl(0.08, 0.1, 0.06, K.mat(0x222226), 0, -0.03, 0, { parent: gx, cast: false }, 10);
      const dome = K.sphere(0.09, K.mat(0x5a1010, { roughness: 0.3 }), 0, 0.05, 0, { parent: gx, cast: false }, 10, 6), gh = K.halo(0, 0.05, 0.2, 1.4, 0xff2020, 1.8, gx); gh.visible = false;
      const domeOn = K.glow(0xff2a2a, 2.2), domeOff = dome.material;
      let alarme = 0, chk = 0;
      K.tick((dt, t) => { chk -= dt; if (chk <= 0) { chk = 0.3; if (alarme <= 0 && K.perto(-11.6, -6.6, 1.5)) alarme = 4; } alarme -= dt;
        lz.rotation.y = t * 0.25; const on = alarme > 0, pis = on && Math.sin(t * 14) > 0;
        for (const l of lasers) l.material = on ? lf : lm; dome.material = pis ? domeOn : domeOff; gh.visible = pis; gh.position.x = Math.sin(t * 9) * 0.15; });
    }
    // ------------------------------------------------------------ ambiente vivo: poeira dourada flutuando nos fachos dos spots do salão
    K.particles({ modo: 'paira', x0: -3.5, x1: 3.5, z0: -1, z1: 6, y0: 1.6, y1: 6.5, n: 70, cor: [0xffe8c0, 0xfff4e0], tam: 0.035, vel: 0.25, balanco: 0.35, add: true, opacity: 0.55, pisca: 0.8 });
  },
  // ninho do sniper: parapeito art déco do Edifício Aurora. Granilite com filete de latão em zigue-zague e a data gravada,
  // pilares escalonados e o para-raios com a luz vermelha de aviação que pisca
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.6 }), conc = 0xcfc4ae;
    N.tampo(conc, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 41, draw: (c, w, h, R) => {
      c.fillStyle = '#c4bcad'; c.fillRect(0, 0, w, h);
      const chips = ['120,110,100', '240,236,228', '160,90,70', '70,80,90', '200,170,120']; for (let k = 0; k < 2600; k++) { c.fillStyle = `rgba(${chips[(R() * 5) | 0]},.8)`; c.fillRect(R() * w, R() * h, 1 + R() * 3, 1 + R() * 3); }
      c.strokeStyle = '#c89a48'; c.lineWidth = 4; c.beginPath(); for (let x = 0, k = 0; x <= w; x += 40, k++) c.lineTo(x, k % 2 ? 30 : 60); c.stroke();
      c.fillStyle = '#c89a48'; c.fillRect(0, 14, w, 3); c.fillRect(0, 74, w, 3);
      c.fillStyle = 'rgba(60,50,40,.55)'; c.font = '700 26px Futura, "Century Gothic", sans-serif'; c.textAlign = 'center'; c.fillText('AURORA · MCMXXXI', w * 0.22, h * 0.78);
      K.manchas(c, w, h, R, 60, ['80,74,66'], 6, 30, 0.12); K.grain(c, w, h, 10);
    } });
    N.box(5.6, 0.06, 1.0, 0xc89a48, 0, -0.885, -1.1).box(5.6, 0.2, 1.0, conc, 0, -1.02, -1.1).box(5.4, 3.2, 0.9, 0xd8cbb0, 0, -2.7, -0.95);
    for (const sx of [-1, 1]) { N.box(0.9, 1.0, 0.82, conc, sx * 2.3, -0.29, -0.87).box(0.7, 0.55, 0.7, conc, sx * 2.3, 0.48, -0.87).box(0.5, 0.45, 0.56, conc, sx * 2.3, 0.98, -0.87).box(0.92, 0.04, 0.84, 0xc89a48, sx * 2.3, 0.21, -0.87); }
    N.cyl(0.02, 0.025, 0.3, 0x3a3a3e, -2.3, 1.35, -0.87, 6);
    N.fim();
    const red = K.add(new T.SphereGeometry(0.05, 10, 8), K.glow(0xff2a20, 3), -2.3, 1.44, -0.87, { parent: g, cast: false });
    K.tick((dt, t) => { red.visible = (t % 1.6) < 0.5; });
  },
});
