// 08 · Desfile em Paris: terraço de cobertura de um prédio haussmanniano, noite de desfile de alta-costura.
// Passarela espelhada no meio, primeira fila de cadeiras douradas, pódio dos fotógrafos, backstage aberto, bar de champanhe.
// Em volta, só telhados de zinco, chaminés de terracota e, lá longe, a Torre Eiffel cintilando. O sniper está atrás de uma
// chaminé no telhado do prédio do outro lado do bulevar.
MIRA_CENARIOS.push({
  id: 'paris',
  nome: 'Desfile em Paris',
  lugar: 'Cobertura haussmanniana no 8º arrondissement, Paris',
  hora: 'noite de desfile de alta-costura',
  resumo: 'Passarela espelhada sob os spots, primeira fila de cadeiras douradas, flashes no pódio da imprensa, backstage aberto com araras e espelhos de camarim, torres de macarons e a Torre Eiffel cintilando atrás dos telhados de zinco.',
  sniper: { pos: [3.2, 11.6, 46.4], desc: 'atrás de uma chaminé, no telhado do prédio do outro lado do bulevar' },
  niveis: [
    { nome: 'terraço da cobertura', y: 0, x0: -14.5, x1: 14.5, z0: -10, z1: 9.8 },
    { nome: 'passarela', y: 0.5, x0: -1.05, x1: 1.05, z0: -9.4, z1: 5.0 },
  ],
  escadas: [{ de: 0, para: 1, a: [-1.95, -8.3], b: [-0.3, -8.3], rotulo: 'passarela' }],
  convidados: 28,
  inicio: [-8.8, 2.4, 0],
  // cores de luz e neblina em valores lineares (o motor não converte; antes eram 0x1a1d38, 0x8ea0d8/0x2a2430, 0x9fb0ff e 0xffb0b8 lidos como lineares,
  // que saíam desbotados): noite de verdade, sombra no azul do céu, luz quente só onde há lâmpada
  ambiente: {
    ceu: ['#060a1c', '#121b40', '#2b2f5e', '#6a4a72'], neblina: [0x03030a, 75, 330], hemi: [0x5f69a1, 0x060408, 0.5],
    sol: [0x93a1de, 0.75, -18, 24, 20], preenche: [0xff6f7a, 0.2], exposicao: 0.95, bloom: 0.8,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [23, 22, 0] },
  guardaRoupa: {
    ternos: [[0x16161a, 'terno preto'], [0xf2efe8, 'terno branco'], [0x2a2a30, 'terno grafite'], [0x1f2a44, 'smoking azul-noite'], [0xb08a5a, 'terno caramelo'], [0x4a1a26, 'smoking de veludo bordô'], [0x16161a, 'smoking preto']],
    vestidos: [[0x16161a, 'vestido preto'], [0xf4f1ea, 'vestido branco'], [0xb0102a, 'vestido vermelho'], [0xe8d6b0, 'vestido champanhe'], [0xc9ced6, 'vestido prateado'], [0x1f5a48, 'vestido esmeralda'], [0xf2c4cc, 'vestido rosa-pó'], [0x16161a, 'tubinho preto']],
    vestidoChance: 0.55, longo: 0.6, tacas: ['coupe', 'coupe', 'wine'], drinks: [0xf2d070, 0xf6e0a0, 0xf4b6c2, 0xf2d070],
    extra(o, r) {
      if (r() < 0.36) { o.glasses = 'sun'; o.name += ', óculos escuros'; }
      if (o.dress) {
        const h = r();
        if (h < 0.16) { o.hat = 'fedora'; o.hatColor = r() < 0.6 ? 0x16161a : 0xf2efe8; o.hatBand = 0x16161a; o.name += ', chapéu de abas'; }
        else if (h < 0.3) { o.hat = 'feathers'; o.hatColor = [0x16161a, 0xf2efe8, 0xb0102a][Math.floor(r() * 3)]; o.name += ', fascinator de plumas'; }
        if (r() < 0.22) { o.gloves = r() < 0.7 ? 0x16161a : 0xf2efe8; o.name += o.gloves === 0x16161a ? ', luvas pretas' : ', luvas brancas'; }
        if (r() < 0.18) { o.propL = 'fan'; o.propColor = [0x16161a, 0xf2efe8, 0xd9a441][Math.floor(r() * 3)]; o.clutch = false; o.name += ', leque'; }
        if (r() < 0.12) { o.cape = [0x16161a, 0xf2efe8, 0xb0102a][Math.floor(r() * 3)]; o.name += ', capa'; }
      } else {
        const h = r();
        if (h < 0.14) { o.hat = 'beret'; o.hatColor = 0x16161a; o.name += ', boina'; }
        else if (h < 0.26) { o.hat = 'fedora'; o.hatColor = r() < 0.5 ? 0x16161a : 0x8a7a68; o.hatBand = 0x16161a; o.name += ', fedora'; }
        else if (h < 0.3) { o.hat = 'top'; o.hatColor = 0x16161a; o.hatBand = 0x16161a; o.name += ', cartola'; }
        if (r() < 0.22) { o.coat = [0x16161a, 0xb08a5a, 0x6b6e75, 0xf2efe8][Math.floor(r() * 4)]; o.name += ', sobretudo longo'; }
        if (r() < 0.2) { o.scarf = [0xf2efe8, 0x16161a, 0xb0102a, 0xd9a441][Math.floor(r() * 4)]; o.name += ', echarpe'; }
      }
      // garçons de bistrô, de colete preto e avental comprido (qualquer convidado pode ser sorteado, o agente também)
      if (!o.dress && r() < 0.1) { Object.assign(o, { main: 0x16161a, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x16161a, bow: true, apron: 0xf6f3ec, prop: 'tray', trayUp: true, glass: false, hat: false, glasses: false, scarf: 0, pocket: 0 }); o.name = 'garçom de bistrô, de colete preto e avental branco' + (o.beard ? ', de barba' : ''); }
    },
  },
  elenco: [
    { x: -3.3, z: -7.9, rot: 1.57, anim: 14, fala: 'Menos é mais. E mais é Lumière!', outfit: { dress: false, main: 0x16161a, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x16161a, skin: 1, hair: 0xa9a9a9, hairStyle: 'quiff', beard: true, glasses: 'sun', hat: 'beret', hatColor: 0x16161a, scarf: 0xc8102e, gloves: 0x16161a, prop: 'cane', name: 'estilista Gaspard Vionnet, de óculos escuros, cachecol vermelho e boina' } },
    { x: 0, z: 4.3, lv: 1, rot: 0, anim: 0, fala: 'Não sorrio. Está no contrato.', outfit: { dress: true, gown: true, satin: true, main: 0xb0102a, skirt: 0xb0102a, skin: 3, hair: 0x1a1411, hairStyle: 'bun', necklace: true, earring: true, accent: 0xd9a441, shoe: 0x16161a, gloves: 0x16161a, hat: 'feathers', hatColor: 0x16161a, name: 'modelo Anouk, de vestido escultural carmim no fim da passarela' } },
    { x: 1.75, z: -0.8, rot: -1.57, anim: 7, fala: 'Três looks. Um só vale a capa.', outfit: { dress: true, gown: false, main: 0x16161a, skin: 0, hair: 0xe8dcc0, hairStyle: 'bun', glasses: 'round', earring: true, necklace: true, accent: 0xc9ced6, prop: 'tablet', name: 'editora Margaux, de óculos, coque platinado e tablet' } },
    { x: -0.7, z: 6.6, rot: 3.14, anim: 18, fala: 'Ici! Ici! Olha pra cá!', outfit: { dress: false, main: 0x2a2420, pants: 0x16161a, shirt: 0x3a3a40, tie: 0x2a2420, skin: 2, hair: 0x3b2a1e, hairStyle: 'short', beard: true, hat: 'cap', hatColor: 0x16161a, prop: 'camera', name: 'fotógrafo Ruben, de jaqueta de couro, boné e câmera' } },
    { x: -9.1, z: -4.3, rot: 2.28, anim: 2, fala: 'Fique parada, chérie, é só o contorno.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0xf2b8c6, skin: 4, hair: 0xd9b46a, hairStyle: 'quiff', apron: 0xf2b8c6, earring: true, prop: 'baton', name: 'maquiador Lou, de avental rosa e pincel na mão' } },
    { x: -10.2, z: 4.8, rot: 0, anim: 0, fala: 'Seu nome não está na lista.', outfit: { dress: false, main: 0x101012, pants: 0x101012, shirt: 0x16161a, tie: 0x16161a, skin: 5, hair: 0x1a1411, hairStyle: 'short', beard: true, glasses: 'sun', prop: 'radio', name: 'segurança Bastien, grandão, de terno preto e rádio' } },
    { x: -1.75, z: 0.7, rot: 1.57, anim: 7, fala: 'Já vi coleção melhor em 1987.', outfit: { dress: true, gown: true, satin: true, main: 0x4a2a5a, skin: 1, hair: 0x8a3a22, hairStyle: 'bob', necklace: true, earring: true, accent: 0xd9a441, hat: 'fedora', hatColor: 0x16161a, hatBand: 0xd9a441, glasses: 'sun', propL: 'fan', propColor: 0x16161a, name: 'crítica Hortense Dubois, de chapéu de abas e leque' } },
    { x: -9.2, z: 7.2, rot: -1.57, anim: 10, fala: '(finge estar preso numa caixa invisível)', outfit: { dress: false, main: 0xf6f3ec, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x16161a, skin: 0, hair: 0x1a1411, hairStyle: 'short', stripes: 0x16161a, hat: 'beret', hatColor: 0x16161a, gloves: 0xf6f3ec, scarf: 0xc8102e, name: 'mímico Marcel, de listras, boina e luvas brancas' } },
  ],
  missoes: [
    { k: 'vestido', label: 'Trocar o vestido da arara', where: 'backstage, arara de roupas', s: [-11.6, -5.7], l: [-11.6, -6.6] },
    { k: 'spot', label: 'Desviar o spot da passarela', where: 'torre de luz, fim da passarela', s: [3.4, 6.1], l: [3.4, 5.3] },
    { k: 'cartao', label: 'Trocar o cartão do lugar na primeira fila', where: 'primeira fila, à direita', s: [3.3, 2.2], l: [1.75, 2.2] },
    { k: 'macaron', label: 'Esconder o microfilme no macaron', where: 'torre de macarons, perto do bar', s: [5.0, -3.55], l: [5.0, -4.6] },
    { k: 'claraboia', label: 'Abrir a claraboia', where: 'claraboia de vidro, à direita', s: [7.2, 2.8], l: [7.2, 1.6] },
    { k: 'filme', label: 'Trocar o filme da câmera do tripé', where: 'pódio dos fotógrafos', s: [2.3, 7.3], l: [2.3, 8.5] },
    { k: 'letreiro', label: 'Desligar o letreiro da grife', where: 'quadro de força atrás do painel', s: [5.6, -9.0], l: [5.6, -9.75] },
    { k: 'manequim', label: 'Pôr a echarpe vermelha no manequim', where: 'backstage, manequins', s: [-12.7, -3.8], l: [-13.7, -3.8] },
    { k: 'lenco', label: 'Amarrar o lenço de seda na grade', where: 'grade da frente, à direita', s: [11.0, 9.1], l: [11.0, 9.9] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r;
    const STREET = -22;
    // ------------------------------------------------------------ helpers locais
    // prisma de um retângulo embaixo para outro em cima: [cx, cz, w, d, y]
    const pr = (b, t) => { const g = new T.BoxGeometry(1, 1, 1), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const r = p.getY(i) > 0 ? t : b; p.setXYZ(i, r[0] + p.getX(i) * r[2], r[4], r[1] + p.getZ(i) * r[3]); } g.computeVertexNormals(); return g; };
    const mergeGeos = (list) => { const gs = list.map(g => g.index ? g.toNonIndexed() : g); let n = 0; gs.forEach(g => n += g.attributes.position.count); const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2); let k = 0; gs.forEach(g => { pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); if (g.attributes.uv) uv.set(g.attributes.uv.array, k * 2); k += g.attributes.position.count; }); const o = new T.BufferGeometry(); o.setAttribute('position', new T.BufferAttribute(pos, 3)); o.setAttribute('normal', new T.BufferAttribute(nor, 3)); o.setAttribute('uv', new T.BufferAttribute(uv, 2)); return o; };
    const vglow = new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false });
    const dyn = (...a) => a.forEach(o => { o.userData.dyn = true; });
    const goldParts = [], cushParts = [], dormParts = [], dormWin = [], stackParts = [], pots = [], trussParts = [], ironBars = [], ironRings = [];

    // ------------------------------------------------------------ materiais e texturas
    const stone = K.mat(0xe4dac6, { roughness: 0.85 }), stoneD = K.mat(0xcbbfa6, { roughness: 0.9 }), cornM = K.mat(0xd8ccb2, { roughness: 0.85 });
    const lacquer = K.mat(0x0c0c10, { roughness: 0.18, metalness: 0.3 }), mirror = K.mat(0x1a1d26, { metalness: 0.95, roughness: 0.05, envMapIntensity: 1.8 });
    const velvetR = K.mat(0x7a0f1e, { roughness: 0.9 }), velvetP = K.mat(0xd88aa0, { roughness: 0.9 }), ironM = K.metal(0x1d1f24, 0.5), gold = K.gold, silver = K.silver;
    const zincTex = (base, rep) => K.canvasTex(256, 128, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x, 0, 2, h); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x + 2, 0, 1, h); } for (let k = 0; k < 300; k++) { g.fillStyle = `rgba(${R() < 0.5 ? '255,255,255' : '0,0,0'},${R() * 0.06})`; g.fillRect(R() * w, R() * h, 4, 2); } }, rep);
    const zinc = new T.MeshLambertMaterial({ map: zincTex('#5f6b7a', [5, 1]) }), zincTop = new T.MeshLambertMaterial({ map: zincTex('#6e7b8a', [4, 2]) }), lamb = (c) => new T.MeshLambertMaterial({ color: c }), cornL = lamb(0xd8ccb2);
    const haussTex = (wall, seed, rep) => {
      const rr = K.rng(seed), lit = [], shop = [];
      for (let i = 0; i < 40; i++) lit.push(rr() < 0.42 ? (rr() < 0.35 ? '#ffe4b8' : '#ffbf6a') : null);
      for (let i = 0; i < 5; i++) shop.push(['#7a1f2a', '#1f4a3a', '#1f2a44', '#3a2a1a'][Math.floor(rr() * 4)]);
      const draw = (em) => (g, w, h) => {
        g.fillStyle = em ? '#000' : wall; g.fillRect(0, 0, w, h);
        if (!em) { for (let y = 0; y < h; y += 12) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, y, w, 1); } for (let k = 0; k < 300; k++) { g.fillStyle = `rgba(0,0,0,${R() * 0.05})`; g.fillRect(R() * w, R() * h, 3, 3); } }
        const floors = [[22, 50], [96, 56], [172, 56], [250, 62], [338, 46]];
        floors.forEach(([y, wh], f) => { for (let b = 0; b < 5; b++) { const x = 16 + b * 48, c = lit[f * 5 + b];
          if (em) { if (c) { g.fillStyle = c; g.fillRect(x, y, 24, wh); } continue; }
          g.fillStyle = '#f1e9d6'; g.fillRect(x - 4, y - 5, 32, wh + 8);
          g.fillStyle = c || '#1d2130'; g.fillRect(x, y, 24, wh); g.fillStyle = 'rgba(240,230,210,.5)'; g.fillRect(x + 11, y, 2, wh); g.fillRect(x, y + wh * 0.38, 24, 2);
          if (f === 1 || f === 2) { g.fillStyle = '#e2d6bc'; g.fillRect(x - 6, y - 13, 36, 6); }
          if (f === 1 || f === 2 || f === 4) { g.fillStyle = '#16161a'; g.fillRect(x - 2, y + wh - 13, 28, 2); for (let k = 0; k < 7; k++) g.fillRect(x - 1 + k * 4.4, y + wh - 13, 1.5, 12); } } });
        if (!em) for (const y of [22 + 50, 250 + 62]) { g.fillStyle = '#f1e9d6'; g.fillRect(0, y + 2, w, 6); g.fillStyle = '#16161a'; g.fillRect(0, y - 15, w, 3); for (let x = 0; x < w; x += 5) g.fillRect(x, y - 15, 1.6, 16); for (let x = 0; x < w; x += 20) { g.beginPath(); g.arc(x + 10, y - 7, 4, 0, 7); g.lineWidth = 1.2; g.strokeStyle = '#16161a'; g.stroke(); } }
        for (let b = 0; b < 5; b++) { const x = 8 + b * 48, lt = lit[25 + b];
          if (em) { if (lt) { g.fillStyle = '#ffcf80'; g.fillRect(x, 430, 40, 72); } continue; }
          g.fillStyle = shop[b]; g.fillRect(x - 2, 410, 44, 16); g.fillStyle = lt ? '#ffd79a' : '#22252e'; g.fillRect(x, 430, 40, 76); }
        if (!em) { g.fillStyle = '#f1e9d6'; g.fillRect(0, 398, w, 8); g.fillRect(0, 0, w, 8); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 8, w, 3); }
      };
      const map = K.canvasTex(256, 512, draw(false), rep), em = K.canvasTex(256, 512, draw(true), rep);
      return new T.MeshLambertMaterial({ map, emissiveMap: em, emissive: 0xffffff, emissiveIntensity: 1.0 });
    };
    const HM = [haussTex('#c2b69c', 11), haussTex('#cdc3ae', 23), haussTex('#b8aa8a', 37), haussTex('#c0b29a', 51)];

    // ------------------------------------------------------------ piso de pedra e tapete da plateia
    const floorTex = K.canvasTex(1024, 1024, (g, w, h) => {
      const n = 8, s = w / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 196 + R() * 16; g.fillStyle = `rgb(${v},${v - 8},${v - 22})`; g.fillRect(i * s, j * s, s, s); for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(${R() < 0.5 ? '120,100,80' : '255,250,240'},${R() * 0.1})`; g.beginPath(); g.arc(i * s + R() * s, j * s + R() * s, 1 + R() * 3, 0, 7); g.fill(); } }
      g.strokeStyle = 'rgba(90,80,70,.45)'; g.lineWidth = 3; for (let k = 0; k <= n; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke(); }
      K.grain(g, w, h, 8);
    }, [3.7, 2.5]);
    K.floor(-14.8, -10.2, 14.8, 10.1, floorTex, { m: { roughness: 0.6, envMapIntensity: 0.5 } });
    K.rug(0, -2.0, 6.8, 15.6, (g, w, h) => { g.fillStyle = '#26262c'; g.fillRect(0, 0, w, h); for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(255,255,255,${R() * 0.035})`; g.fillRect(R() * w, R() * h, 2, 2); } g.strokeStyle = '#8a7340'; g.lineWidth = 5; g.strokeRect(10, 10, w - 20, h - 20); });
    // piso de borracha preta no backstage, com marcas de fita
    K.rug(-9.85, -6.5, 9.3, 7.0, (g, w, h) => { g.fillStyle = '#1c1c20'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.05)'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2); g.fillStyle = '#e8d24a'; for (let k = 0; k < 9; k++) { g.save(); g.translate(40 + R() * (w - 80), 40 + R() * (h - 80)); g.rotate(R() * 3); g.fillRect(-14, -2, 28, 4); g.fillRect(-2, -14, 4, 28); g.restore(); } g.fillStyle = '#ff5a8a'; g.font = 'bold 22px Arial'; g.fillText('LOOK 01 → 24', 30, h - 26); });

    // ------------------------------------------------------------ o próprio prédio: fachada, balcão corrido, platibanda e grade de ferro
    K.add(new T.BoxGeometry(30.4, 21.95, 20.6), haussTex('#e0d4bc', 77, [3, 1]), 0, STREET + 10.975 - 0.05, -0.1, { cast: false });
    K.box(30.9, 0.45, 0.6, cornM, 0, -0.45, 10.35, { cast: false }); K.box(30.9, 0.2, 0.7, stone, 0, -0.15, 10.35, { cast: false });
    // balcão corrido do 5º andar com grade de ferro
    K.box(30.6, 0.14, 0.8, stone, 0, -3.1, 10.6, { cast: false });
    for (let x = -15.1; x <= 15.1; x += 0.11) ironBars.push([x, -3.03, 10.95, 0, [1, 0.95, 1]]);
    for (let x = -14.8; x <= 14.8; x += 0.55) ironRings.push([x, -2.6, 10.95, 0, 1.1]);
    K.box(30.6, 0.05, 0.06, ironM, 0, -2.1, 10.95, { cast: false });
    // platibanda de pedra + grade de ferro batido (frente, laterais, fundo nas partes abertas)
    const parapet = (x0, z0, x1, z1) => { const along = Math.abs(x1 - x0) > Math.abs(z1 - z0), L = along ? Math.abs(x1 - x0) : Math.abs(z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      K.box(along ? L : 0.32, 0.45, along ? 0.32 : L, stone, cx, 0.225, cz); K.box(along ? L + 0.06 : 0.38, 0.06, along ? 0.38 : L + 0.06, stoneD, cx, 0.48, cz, { cast: false });
      const n = Math.floor(L / 0.12); for (let k = 0; k <= n; k++) { const u = k / n; ironBars.push([x0 + (x1 - x0) * u, 0.51, z0 + (z1 - z0) * u, 0, [1, 0.62, 1]]); }
      const m = Math.floor(L / 0.6); for (let k = 0; k < m; k++) { const u = (k + 0.5) / m; ironRings.push([x0 + (x1 - x0) * u, 0.83, z0 + (z1 - z0) * u, along ? 0 : Math.PI / 2, 1]); }
      K.box(along ? L : 0.05, 0.05, along ? 0.05 : L, ironM, cx, 1.12, cz, { cast: false }); K.box(along ? L : 0.04, 0.03, along ? 0.04 : L, ironM, cx, 0.58, cz, { cast: false });
      for (let k = 0; k <= Math.floor(L / 3); k++) { const u = k / Math.max(1, Math.floor(L / 3)); K.sphere(0.06, gold, x0 + (x1 - x0) * u, 1.18, z0 + (z1 - z0) * u, { cast: false }, 8, 6); }
    };
    parapet(-14.85, 10.0, 14.85, 10.0); parapet(-14.95, -10.2, -14.95, 9.9); parapet(14.95, -10.2, 14.95, 9.9); parapet(-5.2, -10.25, 6.4, -10.25);
    K.inst(new T.CylinderGeometry(0.012, 0.012, 1, 5).translate(0, 0.5, 0), ironM, ironBars, { cast: false });
    K.inst(new T.TorusGeometry(0.11, 0.012, 4, 12), ironM, ironRings, { cast: false });

    // ------------------------------------------------------------ telhados de Paris (vizinhos, fundo, bulevar)
    const unitMansard = mergeGeos([pr([0, 0, 1, 1, 0], [0, 0, 0.84, 0.82, 0.78]), pr([0, 0, 0.84, 0.82, 0.78], [0, 0, 0.5, 0.42, 1])]);
    const instBody = HM.map(() => []), instMan = [], instCorn = [];
    const dormGeo = () => new T.BoxGeometry(0.72, 0.9, 0.9), dormCap = () => new T.CylinderGeometry(0.5, 0.5, 1.0, 3).rotateX(-Math.PI / 2).scale(0.85, 0.55, 1);
    const dormers = (cx, cz, w, d, y0, sides) => {
      for (const s of sides) { const along = s === 'f' || s === 'b', L = along ? w : d, n = Math.max(1, Math.floor((L - 1.5) / 2.4)), ry = { f: 0, b: Math.PI, r: Math.PI / 2, l: -Math.PI / 2 }[s];
        for (let k = 0; k < n; k++) { const u = (k + 0.5) / n - 0.5, off = (along ? d : w) / 2 - 0.62;
          const lx = along ? u * L : 0, lz = along ? 0 : u * L;
          const px = cx + (s === 'r' ? off : s === 'l' ? -off : lx), pz = cz + (s === 'f' ? off : s === 'b' ? -off : lz);
          dormParts.push([K.at(dormGeo(), px, y0 + 1.0, pz, ry), 0xe2d8c4]); dormParts.push([K.at(dormCap(), px, y0 + 1.58, pz, ry), 0x5f6b78]);
          const win = new T.PlaneGeometry(0.36, 0.5).translate(0, 0, 0.46); dormWin.push([K.at(win, px, y0 + 0.98, pz, ry), R() < 0.5 ? 0xffc27a : 0x1c2030]);
        } }
    };
    const chimney = (x, z, h, len, y0, rz) => { stackParts.push([K.at(new T.BoxGeometry(rz ? len : 0.55, h, rz ? 0.55 : len), x, y0 + h / 2, z), R() < 0.5 ? 0xc9a184 : 0xd8c8b0]); stackParts.push([K.at(new T.BoxGeometry(rz ? len + 0.12 : 0.67, 0.1, rz ? 0.67 : len + 0.12), x, y0 + h, z), 0xe8dcc6]); const n = Math.max(1, Math.round(len / 0.3)); for (let k = 0; k < n; k++) { const u = (k + 0.5) / n - 0.5; pots.push([x + (rz ? u * len : 0), y0 + h + 0.05, z + (rz ? 0 : u * len), 0, 0.8 + R() * 0.5]); } };
    // bloco haussmanniano: corpo até a cornija (yTop), mansarda de zinco em cima
    const block = (cx, cz, w, d, yTop, v, o = {}) => {
      const h = yTop - STREET; instBody[v].push([cx, STREET + h / 2, cz, 0, [w, h, d]]); instCorn.push([cx, yTop + 0.12, cz, 0, [w + 0.4, 0.3, d + 0.4]]);
      const mh = o.mh || 3.0; instMan.push([cx, yTop + 0.27, cz, 0, [w, mh, d]]);
      if (o.dorm) dormers(cx, cz, w, d, yTop + 0.27, o.dorm);
      if (o.chim !== false) { const nc = o.nc || 2; for (let k = 0; k < nc; k++) { const side = k % 2 ? 1 : -1; chimney(cx + side * (w / 2 - 0.3), cz + (R() - 0.5) * d * 0.5, (o.ch || 2.2) * (0.7 + R() * 0.4), 0.9 + R() * 0.9, yTop + 0.27 + mh * 0.6); } }
    };
    // vizinhos colados (baixos, para não tapar a câmera)
    block(-23.0, -1.15, 15.6, 22.7, -2.2, 0, { mh: 3.2, dorm: ['f', 'r', 'b'], nc: 0 });
    block(22.6, -1.15, 15.0, 22.7, -1.7, 2, { mh: 3.1, dorm: ['f', 'l', 'b'], nc: 0 });
    for (const z of [-8.0, -2.0, 4.5]) { chimney(-15.4, z, 1.6 + R() * 0.8, 1.6, 0.6, false); chimney(15.4, z + 1.5, 1.4 + R() * 0.9, 1.5, 0.9, false); }
    // claraboias nos telhados vizinhos (vidro aceso)
    const skyl = (x, y, z, w, d) => { K.add(pr([x, z, w, d, y], [x, z, w * 0.2, d, y + 0.45]), K.mat(0x9fc0e0, { roughness: 0.1, metalness: 0.2, emissive: 0xffc890, emissiveIntensity: 0.35, transparent: true, opacity: 0.85 }), 0, 0, 0, { cast: false }); K.box(w + 0.1, 0.12, d + 0.1, ironM, x, y, z, { cast: false }); };
    skyl(-22.5, 0.95, -5.0, 2.0, 3.0); skyl(-24.5, 0.95, 3.5, 2.0, 2.4); skyl(22.0, 1.4, -6.0, 2.2, 2.6); skyl(23.4, 1.4, 2.5, 1.8, 3.2);
    // fileira do fundo (do outro lado do pátio interno), mais adiante e mais alta
    let bx = -46; while (bx < 46) { const w = 10 + R() * 4; block(bx + w / 2, -22.5, w, 13, -2.6 + R() * 1.8, Math.floor(R() * 4), { mh: 2.8 + R() * 0.6, dorm: ['f'], nc: 2, ch: 2.0 }); bx += w + 0.2; }
    bx = -60; while (bx < 60) { const w = 11 + R() * 5; block(bx + w / 2, -38, w, 14, -1.0 + R() * 2.5, Math.floor(R() * 4), { mh: 3 + R(), dorm: ['f'], nc: 2 }); bx += w + 0.3; }
    // laterais mais longe (já podem ser mais altas)
    for (const s of [-1, 1]) for (let z = -12; z < 30; z += 14) { const w = 12 + R() * 3; block(s * (31.5 + w / 2), z + 6, w, 13, -0.5 + R() * 2.5, Math.floor(R() * 4), { mh: 3.2, dorm: ['f', s > 0 ? 'l' : 'r'], nc: 2 }); }
    // horizonte de Paris: quadras e quadras de prédios iguais até a neblina
    for (let z = -56; z > -215; z -= 18 + R() * 5) for (let x = -130 - z * 0.2; x < 130 + z * -0.2; x += 14 + R() * 7) {
      if (x > -70 && x < -14 && z < -112 && z > -168) continue; // Champ de Mars
      block(x, z, 11 + R() * 4, 12, -2 + R() * 4.5, Math.floor(R() * 4), { mh: 2.6 + R() * 1.2, chim: R() < 0.5, nc: 1 });
    }
    // fileira do outro lado do bulevar (onde o sniper está) e laterais da frente
    K.add(new T.BoxGeometry(84, 30.4, 12), haussTex('#d6caae', 91, [8, 1]), 0, STREET + 15.2, 51.0, { cast: false });
    K.box(84.4, 0.35, 12.4, cornL, 0, 8.55, 51.0, { cast: false });
    K.add(pr([0, 51.0, 84, 12, 8.6], [0, 51.0, 81, 9.2, 11.0]), zinc, 0, 0, 0, { cast: false }); K.add(pr([0, 51.0, 81, 9.2, 11.0], [0, 51.0, 76, 5, 11.5]), zincTop, 0, 0, 0, { cast: false });
    for (let x = -38; x < 38; x += 2.6) if (Math.abs(x - 3.2) > 2.4) { dormParts.push([K.at(dormGeo(), x, 9.7, 45.5, Math.PI), 0xe2d8c4]); dormParts.push([K.at(dormCap(), x, 10.3, 45.5, Math.PI), 0x5f6b78]); dormWin.push([K.at(new T.PlaneGeometry(0.36, 0.5).translate(0, 0, 0.46), x, 9.68, 45.5, Math.PI), R() < 0.55 ? 0xffc27a : 0x1c2030]); }
    for (const x of [-30, -18, -8, 16, 27]) chimney(x, 49.5, 2.0, 1.8, 11.0, true);
    // poleiro do sniper: chaminé larga ao lado, telha solta, sacos de areia
    chimney(4.9, 46.9, 1.8, 1.6, 11.0, false); K.box(1.2, 0.18, 0.5, K.mat(0x4a4a3a, { roughness: 1 }), 3.2, 11.12, 46.9, { cast: false }); K.box(0.3, 0.22, 0.4, K.mat(0x5a5442, { roughness: 1 }), 2.5, 11.13, 46.5, { cast: false });
    K.halo(3.2, 11.55, 46.2, 0.3, 0xff3a2a, 1.2);
    // bulevar lá embaixo: asfalto, plátanos e postes
    K.add(new T.PlaneGeometry(160, 40).rotateX(-Math.PI / 2), K.mat(0x1a1c22, { roughness: 0.95 }), 0, STREET, 28, { cast: false });
    { const tr = [], lamps = []; for (let x = -40; x <= 40; x += 6.5) { tr.push([x + R(), -13 - R(), 14.6, R() * 6, 1.1 + R() * 0.3]); tr.push([x + 3 + R(), -10.8 - R(), 42.5, R() * 6, 1.6 + R() * 0.4]); lamps.push([x + 3.2, STREET + 4.5, 15.6]); }
      K.inst(new T.IcosahedronGeometry(1.4, 1).scale(1.4, 0.8, 1.2), new T.MeshLambertMaterial({ color: 0x1e3420, emissive: 0x0c1608 }), tr, { cast: false });
      K.inst(new T.SphereGeometry(0.22, 8, 6), K.glow(0xffd090, 2.2), lamps, { cast: false }); }

    // ------------------------------------------------------------ fundo: Torre Eiffel iluminada (cintila de tempos em tempos) e Sacré-Cœur
    const latticeTex = K.canvasTex(128, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 7; g.strokeRect(3, 3, w - 6, h - 6); g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); }, [2, 3]);
    latticeTex.encoding = T.LinearEncoding;
    const eiffel = new T.MeshBasicMaterial({ map: latticeTex, color: new T.Color(0xffa63a).multiplyScalar(1.5), alphaTest: 0.35, side: T.DoubleSide, toneMapped: false });
    const eiffelSolid = new T.MeshBasicMaterial({ color: new T.Color(0xffb04a).multiplyScalar(1.25), toneMapped: false });
    const EG = K.group(-40, STREET, -140); const ES = 75 / 324; EG.scale.setScalar(ES);
    const frusta = [];
    const ep = (b, t, m = eiffel) => { frusta.push([b, t]); K.add(pr(b, t), m, 0, 0, 0, { parent: EG, cast: false, recv: false }); };
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { ep([sx * 50, sz * 50, 25, 25, 0], [sx * 27, sz * 27, 13, 13, 57]); ep([sx * 25, sz * 25, 12, 12, 63], [sx * 15, sz * 15, 8, 8, 115]); K.box(30, 6, 30, eiffelSolid, sx * 50, 3, sz * 50, { parent: EG, cast: false }); }
    K.box(76, 6, 76, eiffelSolid, 0, 60, 0, { parent: EG, cast: false }); K.box(80, 1.5, 80, K.glow(0xffe0a0, 2), 0, 63.5, 0, { parent: EG, cast: false });
    for (let k = 0; k < 4; k++) K.add(new T.TorusGeometry(36, 2.2, 6, 20, Math.PI), eiffel, Math.sin(k * Math.PI / 2) * 44, 2, Math.cos(k * Math.PI / 2) * 44, { parent: EG, cast: false, ry: k * Math.PI / 2 });
    K.box(44, 5, 44, eiffelSolid, 0, 117.5, 0, { parent: EG, cast: false }); K.box(46, 1.2, 46, K.glow(0xffe0a0, 2), 0, 120.4, 0, { parent: EG, cast: false });
    ep([0, 0, 30, 30, 120], [0, 0, 9, 9, 276]);
    K.box(18, 6, 18, eiffelSolid, 0, 279, 0, { parent: EG, cast: false }); K.box(10, 12, 10, eiffelSolid, 0, 288, 0, { parent: EG, cast: false });
    K.cyl(0.9, 1.6, 30, eiffelSolid, 0, 309, 0, { parent: EG, cast: false }, 8);
    // farol do topo: dois fachos girando sobre Paris
    const beacon = K.group(0, 296, 0, 0, EG); dyn(beacon);
    for (const s of [0, Math.PI]) { const b = K.add(new T.ConeGeometry(14, 260, 16, 1, true).translate(0, -130, 0).rotateZ(Math.PI / 2), new T.MeshBasicMaterial({ color: new T.Color(0xfff0c0).multiplyScalar(0.35), transparent: true, opacity: 0.35, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, toneMapped: false }), 0, 0, 0, { parent: beacon, cast: false, ry: s }); b.rotation.z = -0.06; }
    K.halo(0, 296, 0, 9, 0xfff0c0, 1.6, EG);
    // cintilância: milhares de lampadinhas brancas (pontos com cor por vértice, aditivos)
    const NSP = 900, spPos = new Float32Array(NSP * 3), spCol = new Float32Array(NSP * 3);
    for (let i = 0; i < NSP; i++) { const [b, t] = frusta[Math.floor(R() * frusta.length)], v = R(), f = Math.floor(R() * 4), u = R() - 0.5; const cx = b[0] + (t[0] - b[0]) * v, cz = b[1] + (t[1] - b[1]) * v, w = b[2] + (t[2] - b[2]) * v, y = b[4] + (t[4] - b[4]) * v; const ox = f < 2 ? (f ? 0.5 : -0.5) * w : u * w, oz = f < 2 ? u * w : (f === 2 ? 0.5 : -0.5) * w; spPos.set([cx + ox, y, cz + oz], i * 3); }
    const spGeo = new T.BufferGeometry(); spGeo.setAttribute('position', new T.BufferAttribute(spPos, 3)); spGeo.setAttribute('color', new T.BufferAttribute(spCol, 3));
    const spark = new T.Points(spGeo, new T.PointsMaterial({ size: 5, sizeAttenuation: false, map: K.radialTex, vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); EG.add(spark);
    K.tick((dt, t) => { beacon.rotation.y = t * 0.6; const on = (t % 26) < 9; for (let i = 0; i < NSP; i++) { const k = on && R() < 0.3 ? 2.2 + R() * 1.2 : 0; spCol[i * 3] = k * 0.9; spCol[i * 3 + 1] = k * 0.95; spCol[i * 3 + 2] = k; } spGeo.attributes.color.needsUpdate = true; });
    // Sacré-Cœur no alto de Montmartre, bem longe à direita
    { const g = K.group(75, STREET, -235), wm = K.mat(0xf3ecdc, { emissive: 0xf0e2c8, emissiveIntensity: 0.6, roughness: 0.8 });
      K.add(new T.SphereGeometry(60, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1.3, 0.42, 0.9), K.mat(0x1a2420, { roughness: 1 }), 0, 0, 0, { parent: g, cast: false });
      K.box(26, 14, 34, wm, 0, 31, 0, { parent: g, cast: false }); K.cyl(7, 7, 9, wm, 0, 42, 0, { parent: g, cast: false }, 16);
      K.add(new T.SphereGeometry(7.2, 16, 10).scale(1, 1.5, 1), wm, 0, 47, 0, { parent: g, cast: false }); K.cyl(1.2, 1.6, 6, wm, 0, 59, 0, { parent: g, cast: false }, 8);
      for (const [x, z] of [[-10, 12], [10, 12], [-10, -12], [10, -12]]) { K.cyl(3, 3, 5, wm, x, 40, z, { parent: g, cast: false }, 10); K.add(new T.SphereGeometry(3.1, 10, 8).scale(1, 1.5, 1), wm, x, 43, z, { parent: g, cast: false }); }
      K.box(7, 28, 7, wm, 0, 38, -22, { parent: g, cast: false }); K.add(new T.SphereGeometry(4, 10, 8).scale(1, 1.4, 1), wm, 0, 54, -22, { parent: g, cast: false });
      K.halo(75, STREET + 42, -232, 26, 0xfff0d8, 0.25); }
    // lua
    K.halo(-150, 110, -320, 12, 0xe8eeff, 1.4); K.halo(-150, 110, -320, 34, 0x8090c0, 0.35);

    // ------------------------------------------------------------ passarela espelhada (nível 1) e painel da grife
    K.box(2.2, 0.5, 14.7, lacquer, 0, 0.25, -2.25); K.box(2.06, 0.02, 14.6, mirror, 0, 0.505, -2.25, { cast: false });
    for (const s of [-1, 1]) { K.box(0.04, 0.03, 14.7, K.glow(0xfff4e8, 2.6), s * 1.09, 0.5, -2.25, { cast: false }); K.box(0.03, 0.03, 14.7, K.glow(0xffe8d0, 1.6), s * 1.11, 0.04, -2.25, { cast: false }); }
    K.col(-1.15, -9.6, 1.15, 5.1);
    // marca do fim da passarela (fita dourada em cruz)
    K.box(0.5, 0.004, 0.05, K.glow(0xffd070, 1.6), 0, 0.512, 4.3, { cast: false }); K.box(0.05, 0.004, 0.5, K.glow(0xffd070, 1.6), 0, 0.512, 4.3, { cast: false });
    for (const z of [-7, -4, -1, 2]) K.pool(0, z, 0.9, 0xfff0e0, 0.28, 0.52);
    // escadinha do backstage para a passarela
    K.box(0.42, 0.17, 0.9, lacquer, -1.75, 0.085, -8.3); K.box(0.42, 0.34, 0.9, lacquer, -1.33, 0.17, -8.3);
    K.box(0.42, 0.01, 0.9, K.mat(0x2a2a30), -1.75, 0.175, -8.3, { cast: false }); K.box(0.42, 0.01, 0.9, K.mat(0x2a2a30), -1.33, 0.345, -8.3, { cast: false });
    // painel do fundo com porta das modelos
    const panelTex = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#efe9df'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(160,140,110,.25)'; g.lineWidth = 1; for (let x = 0; x < w; x += 32) for (let y = 0; y < h; y += 32) { g.beginPath(); g.arc(x + 16, y + 16, 10, 0, 7); g.stroke(); } K.grain(g, w, h, 6); });
    const panelM = K.texMat(panelTex, { roughness: 0.7 });
    K.box(3.85, 4.8, 0.3, panelM, -3.075, 2.4, -9.75); K.box(3.85, 4.8, 0.3, panelM, 3.075, 2.4, -9.75); K.box(2.3, 1.7, 0.3, panelM, 0, 3.95, -9.75);
    K.col(-5.0, -10.0, -1.15, -9.55); K.col(1.15, -10.0, 5.0, -9.55);
    K.box(10.1, 0.12, 0.36, gold, 0, 4.86, -9.75, { cast: false }); for (const s of [-1, 1]) K.box(0.08, 3.1, 0.34, gold, s * 1.17, 1.55, -9.75, { cast: false });
    // cortina de veludo preto na porta, luz do backstage vazando
    { const ct = K.canvasTex(128, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); for (let k = 0; k <= 8; k++) gr.addColorStop(k / 8, k % 2 ? '#0c0c10' : '#26262e'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
      K.add(new T.PlaneGeometry(2.26, 3.1), K.texMat(ct, { roughness: 0.95 }), 0, 1.55, -9.88, { cast: false }); K.halo(0, 2.0, -9.6, 1.4, 0xffd8b0, 0.25); }
    // monograma dourado acima da porta
    K.torus(0.38, 0.03, gold, 0, 3.55, -9.58, {}, 6, 32); K.sign('L', 0.6, 0.6, 0, 3.55, -9.57, { color: '#d9a441', size: 100, font: 'Didot, Georgia, serif', w: 128, h: 128 });
    // letreiro de neon da grife (missão: desligar)
    const neonOn = K.sign('LUMIÈRE', 7.0, 1.2, 0, 5.55, -9.6, { neon: true, color: '#fff2e0', font: 'Didot, Georgia, serif', size: 92, weight: 400, k: 2.4, w: 1024, h: 176 });
    const neonOff = K.sign('LUMIÈRE', 7.0, 1.2, 0, 5.55, -9.6, { color: '#4a4640', font: 'Didot, Georgia, serif', size: 92, weight: 400, w: 1024, h: 176 }); neonOff.visible = false;
    K.sign('PARIS · HAUTE COUTURE · AUTOMNE', 6.0, 0.34, 0, 4.72, -9.58, { color: '#2a2622', font: 'Georgia, serif', size: 38, weight: 400, w: 1024, h: 64 });
    K.box(7.4, 1.35, 0.08, K.mat(0x121216, { roughness: 0.5 }), 0, 5.55, -9.68, { cast: false }); for (const s of [-1, 1]) K.box(0.08, 0.7, 0.08, ironM, s * 3.2, 5.0, -9.7, { cast: false });
    const neonHalo = K.halo(0, 5.55, -9.4, 3.6, 0xfff0e0, 0.3);
    const washL = K.plight(0, 3.2, -7.6, 0xfff0e0, 1.5, 9);
    // quadro de força (missão)
    const fuse = K.group(5.6, 0, -9.8); dyn(fuse);
    K.box(0.6, 0.8, 0.22, K.mat(0x7a7e86, { metalness: 0.6, roughness: 0.4 }), 0, 1.3, 0, { parent: fuse }); K.box(0.08, 1.0, 0.08, ironM, 0, 0.5, 0, { parent: fuse });
    const fuseLed = K.box(0.06, 0.06, 0.02, K.glow(0x40ff70, 3), 0.18, 1.55, 0.12, { parent: fuse, cast: false });
    const lever = K.box(0.05, 0.22, 0.05, K.mat(0xc8322f), -0.12, 1.3, 0.14, { parent: fuse }); K.mutable(lever).geometry.translate(0, 0.1, 0);
    K.sign('⚡ 380V', 0.4, 0.12, 5.6, 1.62, -9.68, { color: '#f2d040', bg: '#1a1a1a', size: 60, w: 256, h: 64 });
    for (let k = 0; k < 4; k++) K.cyl(0.02, 0.02, 1.2, K.mat(0x16161a), 5.3 + k * 0.05, 0.6, -9.85, { cast: false }, 4);
    K.col(5.25, -10.0, 5.95, -9.6);
    K.tell('letreiro', (live) => { lever.rotation.z = 2.6; fuseLed.material = K.glow(0xff2a2a, 3); if (live) K.anim(1.4, (e, u) => { const on = u < 0.9 && Math.sin(u * 60) > 0.2; neonOn.visible = on; neonOff.visible = !on; neonHalo.visible = on; washL.intensity = on ? 1.5 : 0.4; }); else { neonOn.visible = false; neonOff.visible = true; neonHalo.visible = false; washL.intensity = 0.4; } },
      () => { lever.rotation.z = 0; fuseLed.material = K.glow(0x40ff70, 3); neonOn.visible = true; neonOff.visible = false; neonHalo.visible = true; washL.intensity = 1.5; });
    // arranjos de hortênsias brancas nos lados do painel
    for (const x of [-4.4, 4.4]) { K.lathe([[0, 0], [0.2, 0], [0.26, 0.5], [0.34, 0.9], [0, 0.9]], K.mat(0xf2efe8, { roughness: 0.3 }), x, 0, -9.2, {}, 16); for (let k = 0; k < 9; k++) K.sphere(0.2 + R() * 0.06, K.mat(k % 3 ? 0xf6f3ee : 0xe8eef6, { roughness: 0.95 }), x + (R() - 0.5) * 0.5, 1.05 + R() * 0.35, -9.2 + (R() - 0.5) * 0.4, {}, 8, 6); K.colR(x, -9.2, 0.38); }

    // ------------------------------------------------------------ primeira fila: cadeiras douradas (Chiavari) com cartões
    const chiavari = (x, z, ry) => {
      const P = (geo, lx, ly, lz) => goldParts.push([K.at(geo.translate(lx, ly, lz), x, 0, z, ry), 0xd9a441]);
      for (const [a, b] of [[-0.18, -0.17], [0.18, -0.17], [-0.18, 0.18], [0.18, 0.18]]) P(new T.CylinderGeometry(0.014, 0.012, 0.45, 5), a, 0.225, b);
      P(new T.BoxGeometry(0.42, 0.04, 0.4), 0, 0.45, 0);
      for (const s of [-1, 1]) P(new T.CylinderGeometry(0.014, 0.014, 0.52, 5), s * 0.18, 0.72, -0.18);
      for (const y of [0.62, 0.8, 0.96]) P(new T.BoxGeometry(0.38, 0.025, 0.025), 0, y, -0.18);
      for (const s of [-0.09, 0, 0.09]) P(new T.CylinderGeometry(0.008, 0.008, 0.33, 4), s, 0.79, -0.18);
      cushParts.push([K.at(new T.BoxGeometry(0.38, 0.05, 0.36).translate(0, 0.495, 0.01), x, 0, z, ry), 0xf4efe6]);
    };
    const cards = [], seatZ = k => -6.8 + k * 0.75;
    for (const side of [-1, 1]) {
      for (const rx of [1.75, 2.55]) for (let k = 0; k < 15; k++) { const x = side * rx, z = seatZ(k); chiavari(x, z, side > 0 ? -Math.PI / 2 : Math.PI / 2); if (rx === 1.75 && !(side > 0 && k === 12)) cards.push([x, 0.53, z, R() * 0.4 - 0.2]); }
      K.col(side * 1.5, -7.1, side * 2.85, 4.0);
      // vagas: só algumas cadeiras (as outras ficam com cartão "reservado")
      const r1 = side > 0 ? [0, 2, 4, 6, 10, 14] : [0, 2, 4, 6, 8, 12, 14], r2 = [1, 3, 5, 7, 9, 11, 13];
      r1.forEach(k => K.slot(side * 1.75, seatZ(k), 0, seatZ(k), 'sit')); r2.forEach(k => K.slot(side * 2.55, seatZ(k), 0, seatZ(k), 'sit'));
    }
    K.inst(new T.BoxGeometry(0.1, 0.07, 0.006), K.mat(0xfaf6ee, { roughness: 0.6 }), cards, { cast: false });
    // cadeira da missão: cartão e (depois) laço vermelho
    const mCard = K.box(0.1, 0.07, 0.006, K.mat(0xfaf6ee), 1.75, 0.53, 2.2, { cast: false, ry: -Math.PI / 2 });
    const bow = K.group(1.95, 0.98, 2.2, -Math.PI / 2); bow.visible = false; dyn(mCard, bow);
    { const red = K.mat(0xd0102a, { emissive: 0x700010, emissiveIntensity: 0.6, roughness: 0.5 }); for (const s of [-1, 1]) K.add(new T.SphereGeometry(0.12, 10, 6).scale(1.3, 0.8, 0.35), red, s * 0.13, 0, 0, { parent: bow, rz: s * 0.4 }); K.sphere(0.05, red, 0, 0, 0, { parent: bow }); for (const s of [-1, 1]) K.box(0.05, 0.3, 0.02, red, s * 0.06, -0.18, 0, { parent: bow, rz: s * 0.25 }); }
    K.tell('cartao', (live) => { bow.visible = true; mCard.material = K.mat(0xd0102a, { emissive: 0x600010, emissiveIntensity: 0.6 }); mCard.scale.set(2.4, 2.4, 1); if (live) K.anim(0.8, e => bow.scale.setScalar(0.2 + e * 0.8)); else bow.scale.setScalar(1); }, () => { bow.visible = false; mCard.material = K.mat(0xfaf6ee); mCard.scale.set(1, 1, 1); });

    // ------------------------------------------------------------ torres de luz (treliça) com spots
    const truss = (x, z, h) => {
      for (const [a, b] of [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]]) trussParts.push([K.at(new T.CylinderGeometry(0.022, 0.022, h, 5), x + a, h / 2, z + b), 0xb8bec8]);
      for (let y = 0.25; y < h; y += 0.5) { for (const s of [-1, 1]) { trussParts.push([K.at(new T.BoxGeometry(0.3, 0.015, 0.015), x, y, z + s * 0.15), 0xb8bec8]); trussParts.push([K.at(new T.BoxGeometry(0.015, 0.015, 0.3), x + s * 0.15, y, z), 0xb8bec8]); trussParts.push([K.at(new T.BoxGeometry(0.012, 0.58, 0.012), x + s * 0.15, y + 0.25, z, 0, 0.55), 0xb8bec8]); } }
      trussParts.push([K.at(new T.BoxGeometry(0.6, 0.06, 0.6), x, 0.03, z), 0x2a2a30]); trussParts.push([K.at(new T.BoxGeometry(0.46, 0.08, 0.46), x, h, z), 0x2a2a30]);
      K.colR(x, z, 0.3);
    };
    const spotHead = (x, y, z, tx, ty, tz, parentless) => { const g = K.group(x, y, z); g.lookAt(tx, ty, tz); K.cyl(0.13, 0.1, 0.36, K.mat(0x16161a, { roughness: 0.4, metalness: 0.4 }), 0, 0, 0, { parent: g, rx: Math.PI / 2 }, 12); K.cyl(0.11, 0.11, 0.01, K.glow(0xfff4e0, 3.5), 0, 0, 0.185, { parent: g, rx: Math.PI / 2, cast: false }, 12); K.box(0.36, 0.02, 0.02, ironM, 0, 0, 0, { parent: g }); return g; };
    truss(-3.4, 5.3, 4.6); truss(3.4, 5.3, 4.6); truss(-3.0, -9.0, 4.6); truss(3.0, -9.0, 4.6);
    spotHead(-3.25, 4.75, 5.15, 0, 0.5, -2); spotHead(-3.25, 4.5, 5.15, 0, 0.5, 1.5); spotHead(-2.85, 4.75, -8.85, 0, 0.5, 2); spotHead(2.85, 4.75, -8.85, 0, 0.5, 2); spotHead(2.85, 4.5, -8.85, 0, 1.5, -1);
    K.spot(-3.25, 4.75, 5.15, 0, 0.5, -2.5, 0xfff2e4, 3.0, 18, 0.32);
    // spot da missão (torre da frente, à direita): mira a modelo no fim da passarela
    const mSpot = spotHead(3.25, 4.75, 5.15, 0, 0.5, 4.3); dyn(mSpot); spotHead(3.25, 4.45, 5.15, 0, 0.5, 0);
    const mSpotL = K.spot(3.25, 4.75, 5.15, 0, 0.5, 4.3, 0xfff2e4, 3.4, 14, 0.22);
    const mPool = K.pool(0, 4.3, 0.85, 0xfff2e0, 0.75, 0.53);
    const spotAim = (x, y, z) => { mSpot.lookAt(x, y, z); mSpotL.target.position.set(x, y, z); mSpotL.target.updateMatrixWorld(); mPool.position.set(x, y + 0.03, z); };
    K.tell('spot', (live) => { const go = (e) => { spotAim(0 + e * 4.6, 0.5 - e * 0.5, 4.3 - e * 2.0); }; mSpotL.color.set(0xff3cc8); mPool.material.color.set(new T.Color(0xff3cc8).multiplyScalar(1.4)); if (live) K.anim(1.2, go); else go(1); }, () => { spotAim(0, 0.5, 4.3); mSpotL.color.set(0xfff2e4); mPool.material.color.set(new T.Color(0xfff2e0).multiplyScalar(0.75)); });
    // cordões de lâmpadas entre as torres e sobre a plateia
    for (const s of [-1, 1]) { K.bulbs([s * 3.0, 4.6, -9.0], [s * 3.4, 4.6, 5.3], 28, 0.7, 0xffe0a8, 3.0); K.bulbs([s * 3.4, 4.6, 5.3], [s * 9.5, 3.2, 8.2], 14, 0.5, 0xffd08a, 3.0); K.bulbs([s * 3.0, 4.6, -9.0], [s * 9.0, 3.0, -2.2], 14, 0.6, 0xffd08a, 3.0); }
    K.bulbs([-3.0, 4.6, -9.0], [3.0, 4.6, -9.0], 16, 0.25, 0xfff0d0, 3.2);

    // ------------------------------------------------------------ pódio dos fotógrafos (fim da passarela), flashes
    K.box(6.4, 0.35, 1.4, K.mat(0x1c1c22, { roughness: 0.6 }), 0, 0.175, 8.65); K.box(6.4, 0.35, 0.7, K.mat(0x1c1c22, { roughness: 0.6 }), 0, 0.525, 9.0);
    K.box(6.42, 0.04, 0.04, gold, 0, 0.35, 7.95, { cast: false }); K.col(-3.2, 7.95, 3.2, 9.4);
    K.sign('PRESSE', 1.2, 0.26, 0, 0.18, 7.94, { color: '#f2e6c8', bg: '#16161a', size: 70, weight: 700, font: 'Arial, sans-serif', w: 512, h: 112 });
    const tripod = (x, z, y0) => { const g = K.group(x, y0, z, Math.PI); for (let k = 0; k < 3; k++) { const a = k * 2.094; K.cyl(0.012, 0.012, 1.45, K.mat(0x1a1a1e), Math.sin(a) * 0.18, 0.7, Math.cos(a) * 0.18, { parent: g, rx: Math.cos(a) * 0.13, rz: -Math.sin(a) * 0.13 }, 4); }
      const head = K.group(0, 1.42, 0, 0, g); K.box(0.16, 0.11, 0.09, K.mat(0x16161a, { roughness: 0.4 }), 0, 0.06, 0, { parent: head }); K.cyl(0.04, 0.045, 0.2, K.mat(0x222226, { roughness: 0.3, metalness: 0.4 }), 0, 0.06, 0.13, { parent: head, rx: Math.PI / 2 }, 10); K.box(0.06, 0.05, 0.05, K.mat(0x2a2a2e), 0, 0.15, -0.02, { parent: head }); return { g, head }; };
    [-2.4, -1.2, 0.0, 1.2].forEach(x => tripod(x, 8.7, 0.35));
    const mTri = tripod(2.3, 8.7, 0.35); dyn(mTri.head);
    // sombrinha de flash (softbox) ao lado do tripé da missão
    const sbG = K.group(2.95, 0.35, 8.95, Math.PI + 0.3); dyn(sbG); K.cyl(0.015, 0.015, 1.8, K.mat(0x1a1a1e), 0, 0.9, 0, { parent: sbG }, 5);
    const sbMat = K.glow(0xffffff, 1.3); const sbDisk = K.add(new T.ConeGeometry(0.45, 0.35, 12, 1, true), K.mat(0xf6f6f6, { side: T.DoubleSide, roughness: 0.6, emissive: 0xffffff, emissiveIntensity: 0.25 }), 0, 1.85, 0.12, { parent: sbG, rx: -Math.PI / 2 }); const sbFace = K.add(new T.CircleGeometry(0.43, 12), sbMat, 0, 1.85, -0.06, { parent: sbG, ry: Math.PI, cast: false });
    const sbHalo = K.halo(2.95, 2.2, 8.75, 0.6, 0xffffff, 0.3);
    K.tell('filme', (live) => { sbFace.material = K.glow(0xff2030, 2.4); sbHalo.material.color.set(new T.Color(0xff2030).multiplyScalar(0.9)); mTri.head.rotation.x = -0.5; if (live) K.anim(1.2, (e, u) => { sbHalo.scale.setScalar(Math.sin(u * 40) > 0 ? 2.6 : 1.2); }); else sbHalo.scale.setScalar(1.2); }, () => { sbFace.material = sbMat; sbHalo.material.color.set(new T.Color(0xffffff).multiplyScalar(0.3)); sbHalo.scale.setScalar(1.2); mTri.head.rotation.x = 0; });
    [[-2.6, 6.9], [-1.7, 7.3], [0.3, 7.2], [1.3, 6.7], [-1.6, 6.0], [0.9, 7.6]].forEach(([x, z]) => K.slot(x, z, x * 0.3, 3.5, 'selfie'));
    // flashes dos fotógrafos (estouros aleatórios)
    const flashes = [[-2.6, 8.9], [-1.7, 9.1], [-0.7, 7.2], [0.3, 7.8], [1.3, 7.4], [-2.4, 8.7], [0, 8.7], [1.2, 8.7], [-1.2, 8.7]].map(([x, z]) => { const h = K.halo(x, 1.75 + (z > 8.2 ? 0.25 : 0), z - 0.15, 0.5, 0xeef4ff, 3.2); h.visible = false; return { h, t: R() * 3 }; });
    const flashPool = K.pool(0, 4.3, 1.6, 0xeef4ff, 0.0, 0.54);
    // rajada: de vez em quando a imprensa toda dispara junto (alguém posou na ponta da passarela); espanta os pombos da frente
    let rajada = 18;
    K.tick((dt) => { let any = 0; rajada -= dt; if (rajada < 0) { rajada = 25 + R() * 25; flashes.forEach((f, i) => { f.t = i * 0.07 + R() * 0.15; }); assustaveis.forEach(b => b.assustar()); }
      for (const f of flashes) { f.t -= dt; if (f.t < 0) { f.t = 0.4 + R() * 3.2; f.on = 0.08; } if (f.on > 0) { f.on -= dt; any = 1; } f.h.visible = f.on > 0; } flashPool.material.color.setScalar(any ? 0.6 : 0); });
    K.plight(0, 2.8, 7.2, 0xffe6cc, 1.0, 7);

    // ------------------------------------------------------------ backstage aberto (fundo à esquerda)
    { // parede branca de fundo com quadro de looks
      K.box(9.4, 3.0, 0.2, K.mat(0xf2efe8, { roughness: 0.8 }), -9.9, 1.5, -10.05);
      const board = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#e9e3d6'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a2622'; g.font = 'italic 28px Georgia'; g.fillText('Collection Lumière — 24 looks', 18, 34); for (let k = 0; k < 24; k++) { const x = 18 + (k % 8) * 61, y = 52 + Math.floor(k / 8) * 66; g.fillStyle = '#fff'; g.fillRect(x, y, 48, 58); g.fillStyle = ['#b0102a', '#16161a', '#f4f1ea', '#e8d6b0', '#1f5a48', '#f2c4cc'][k % 6]; g.beginPath(); g.moveTo(x + 24, y + 8); g.lineTo(x + 36, y + 48); g.lineTo(x + 12, y + 48); g.fill(); g.fillStyle = '#ffd0d0'; g.beginPath(); g.arc(x + 24, y + 8, 4, 0, 7); g.fill(); } });
      K.add(new T.PlaneGeometry(2.6, 1.3), K.texMat(board), -5.95, 2.1, -9.94, { cast: false });
      // penteadeiras com espelhos de camarim (lâmpadas em volta)
      const bulbsL = [];
      for (const x of [-13.2, -11.4, -9.6, -7.8]) {
        K.box(1.5, 0.05, 0.6, K.mat(0xf6f3ee, { roughness: 0.4 }), x, 0.76, -9.55); K.box(1.5, 0.7, 0.55, K.mat(0xe8e2d8), x, 0.38, -9.6);
        K.box(1.1, 1.15, 0.03, mirror, x, 1.5, -9.92, { cast: false }); K.box(1.2, 1.25, 0.02, K.mat(0x16161a), x, 1.5, -9.94, { cast: false });
        for (let k = 0; k < 6; k++) { bulbsL.push([x - 0.58, 1.0 + k * 0.2, -9.88]); bulbsL.push([x + 0.58, 1.0 + k * 0.2, -9.88]); } for (let k = 0; k < 5; k++) bulbsL.push([x - 0.4 + k * 0.2, 2.16, -9.88]);
        // maquiagem: pincéis no copo, frascos, paleta, secador
        K.cyl(0.04, 0.035, 0.1, K.mat(0x16161a), x - 0.5, 0.84, -9.5, { cast: false }, 8); for (let k = 0; k < 5; k++) K.cyl(0.006, 0.004, 0.2, K.mat([0xd9a441, 0x16161a, 0xf2b8c6][k % 3]), x - 0.5 + (k - 2) * 0.012, 0.92, -9.5, { cast: false, rz: (k - 2) * 0.12 }, 4);
        for (let k = 0; k < 4; k++) K.cyl(0.02, 0.025, 0.08 + (k % 2) * 0.05, K.mat([0xf2c4cc, 0xe8d6b0, 0x16161a, 0xd9a441][k], { roughness: 0.2 }), x - 0.2 + k * 0.07, 0.83, -9.6, { cast: false }, 8);
        K.box(0.18, 0.015, 0.12, K.mat(0x16161a), x + 0.25, 0.79, -9.45, { cast: false }); for (let k = 0; k < 6; k++) K.cyl(0.016, 0.016, 0.006, K.mat([0xb0102a, 0xf2c4cc, 0x8a5a3a, 0x6b3f8c, 0xd9a441, 0xe8a080][k]), x + 0.19 + (k % 3) * 0.05, 0.8, -9.48 + Math.floor(k / 3) * 0.05, { cast: false }, 8);
        K.chair(x, -8.85, Math.PI, { seat: velvetP, frame: K.mat(0x16161a), back: K.mat(0x16161a) }); K.slot(x, -8.85, x, -9.6, 'sit');
      }
      K.inst(new T.SphereGeometry(0.035, 8, 6), K.glow(0xfff0d0, 3.2), bulbsL, { cast: false });
      K.col(-14.1, -10.0, -7.0, -9.25);
      K.cone(0.06, 0.12, K.mat(0xf2b8c6), -10.5, 0.85, -9.4, { rz: 1.4 }, 8); K.cyl(0.03, 0.03, 0.12, K.mat(0xf2b8c6), -10.6, 0.8, -9.4, { cast: false }, 6);
      // araras de roupa
      const rack = (x0, x1, z) => { const xm = (x0 + x1) / 2; K.cyl(0.018, 0.018, x1 - x0, silver, xm, 1.68, z, { rz: Math.PI / 2 }, 6); for (const x of [x0, x1]) { K.cyl(0.02, 0.02, 1.68, silver, x, 0.84, z, {}, 6); K.box(0.06, 0.04, 0.6, silver, x, 0.06, z); for (const s of [-1, 1]) K.sphere(0.035, K.mat(0x16161a), x, 0.035, z + s * 0.28, { cast: false }, 6, 4); } K.col(x0 - 0.1, z - 0.32, x1 + 0.1, z + 0.32); };
      const dressGeo = (len) => new T.LatheGeometry([[0, 0], [0.3, 0], [0.24, len * 0.35], [0.15, len * 0.68], [0.17, len * 0.86], [0.11, len], [0, len]].map(p => new T.Vector2(p[0], p[1])), 10).scale(1, 1, 0.32);
      const hangG = new T.TorusGeometry(0.07, 0.008, 4, 10, Math.PI);
      const hang = (x, z, c, len, sat) => { const g = K.group(x, 0, z); K.add(hangG, silver, 0, 1.66, 0, { parent: g, cast: false }); K.add(new T.BoxGeometry(0.36, 0.015, 0.015), silver, 0, 1.6, 0, { parent: g, cast: false }); const d = K.add(dressGeo(len), K.mat(c, { roughness: sat ? 0.3 : 0.85, metalness: sat ? 0.15 : 0 }), 0, 1.58 - len, 0, { parent: g }); return { g, d }; };
      rack(-13.0, -10.2, -6.6); rack(-9.0, -6.4, -6.6);
      const cols = [0x16161a, 0xf4f1ea, 0xb0102a, 0xe8d6b0, 0x1f5a48, 0xf2c4cc, 0x16161a, 0xc9ced6, 0x4a2a5a, 0xd9a441];
      let mDress = null;
      for (let k = 0; k < 9; k++) { const x = -12.8 + k * 0.31; if (Math.abs(x - -11.6) < 0.12) continue; hang(x, -6.6, cols[k % 10], 0.8 + R() * 0.5, R() < 0.5).g.rotation.y = (R() - 0.5) * 0.3; }
      mDress = hang(-11.6, -6.6, 0xf6f3ee, 1.3, true); dyn(mDress.g);
      for (let k = 0; k < 8; k++) hang(-8.8 + k * 0.32, -6.6, cols[(k + 4) % 10], 0.7 + R() * 0.6, R() < 0.5).g.rotation.y = (R() - 0.5) * 0.3;
      const mdMat = mDress.d.material;
      K.tick((dt, t) => { mDress.g.rotation.y = Math.sin(t * 0.9) * 0.08 + (mDress.swing || 0) * Math.sin(t * 4) * 0.5; });
      K.tell('vestido', (live) => { mDress.d.material = K.mat(0xd0102a, { emissive: 0x700012, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.15 }); mDress.swing = 1; if (live) K.anim(1.0, e => mDress.d.scale.setScalar(1 + Math.sin(e * Math.PI) * 0.25)); }, () => { mDress.d.material = mdMat; mDress.swing = 0; mDress.d.scale.setScalar(1); });
      // vaporizador de roupas
      K.cyl(0.12, 0.14, 0.3, K.mat(0xf2efe8), -9.6, 0.15, -5.8); K.cyl(0.012, 0.012, 1.4, silver, -9.6, 1.0, -5.8, {}, 5); K.box(0.12, 0.08, 0.05, K.mat(0xf2efe8), -9.6, 1.72, -5.78); K.colR(-9.6, -5.8, 0.18);
      // cadeira de maquiagem (diretor) e carrinho
      { const g = K.group(-8.4, 0, -4.9, 0); for (const s of [-1, 1]) { K.box(0.04, 1.1, 0.04, K.mat(0x16161a), s * 0.26, 0.55, -0.2, { parent: g }); K.box(0.04, 0.75, 0.04, K.mat(0x16161a), s * 0.26, 0.38, 0.2, { parent: g }); K.box(0.04, 0.04, 0.44, K.mat(0x16161a), s * 0.26, 0.72, 0, { parent: g }); } K.box(0.52, 0.03, 0.4, K.mat(0x16161a), 0, 0.62, 0, { parent: g }); K.box(0.52, 0.28, 0.02, K.mat(0x16161a), 0, 0.95, -0.21, { parent: g }); K.sign('LUMIÈRE', 0.5, 0.12, 0, 0.95, -0.195, { parent: g, color: '#f2e6c8', size: 60, w: 256, h: 64 }); }
      K.slot(-8.4, -4.85, -8.4, -3.5, 'sit');
      { const g = K.group(-7.5, 0, -4.4); K.box(0.5, 0.04, 0.4, silver, 0, 0.8, 0, { parent: g }); K.box(0.5, 0.04, 0.4, silver, 0, 0.45, 0, { parent: g }); for (const [a, b] of [[-0.23, -0.18], [0.23, -0.18], [-0.23, 0.18], [0.23, 0.18]]) K.cyl(0.012, 0.012, 0.8, silver, a, 0.4, b, { parent: g }, 4); for (let k = 0; k < 8; k++) K.box(0.05, 0.03 + R() * 0.05, 0.05, K.mat([0xb0102a, 0xf2c4cc, 0x16161a, 0xd9a441][k % 4], { roughness: 0.3 }), -0.18 + (k % 4) * 0.12, 0.84, -0.1 + Math.floor(k / 4) * 0.15, { parent: g, cast: false }); K.colR(-7.5, -4.4, 0.3); }
      // manequins de costura (missão: echarpe)
      const dummy = (x, z, c, drape) => { const g = K.group(x, 0, z, Math.PI / 2); for (let k = 0; k < 3; k++) { const a = k * 2.094; K.cyl(0.012, 0.012, 0.45, K.walnut || M.walnut, Math.sin(a) * 0.14, 0.18, Math.cos(a) * 0.14, { parent: g, rx: Math.cos(a) * 0.6, rz: -Math.sin(a) * 0.6 }, 4); }
        K.cyl(0.015, 0.015, 0.75, silver, 0, 0.6, 0, { parent: g }, 5);
        K.add(new T.LatheGeometry([[0, 0], [0.13, 0], [0.17, 0.12], [0.13, 0.3], [0.18, 0.48], [0.12, 0.6], [0.05, 0.66], [0.04, 0.74], [0, 0.74]].map(p => new T.Vector2(p[0], p[1])), 14).scale(1, 1, 0.75), K.mat(c, { roughness: 0.9 }), 0, 0.95, 0, { parent: g });
        K.sphere(0.035, M.walnut, 0, 1.72, 0, { parent: g }, 8, 6);
        if (drape) { K.add(new T.CylinderGeometry(0.14, 0.42, 0.75, 14, 1, true), K.mat(drape, { side: T.DoubleSide, roughness: 0.6 }), 0, 0.72, 0, { parent: g }); for (let k = 0; k < 6; k++) K.sphere(0.008, K.mat(0xd9a441), Math.cos(k) * 0.16, 1.3 + k * 0.03, Math.sin(k) * 0.1, { parent: g, cast: false }, 4, 3); }
        K.colR(x, z, 0.3); return g; };
      dummy(-13.7, -5.2, 0xe8dcc4, 0x16161a); const mDum = dummy(-13.7, -3.8, 0xe8dcc4, 0xf4f1ea); dyn(mDum); dummy(-13.7, -2.4, 0x2a2a2e, 0xb0102a);
      const scarf = K.group(0, 1.58, 0, 0, mDum); scarf.visible = false;
      { const red = K.mat(0xd0102a, { emissive: 0x800014, emissiveIntensity: 0.8, roughness: 0.5 }); K.add(new T.TorusGeometry(0.1, 0.035, 6, 14), red, 0, 0, 0, { parent: scarf, rx: Math.PI / 2 }); K.box(0.07, 0.55, 0.02, red, 0.06, -0.3, 0.1, { parent: scarf, rz: 0.1 }); K.box(0.07, 0.45, 0.02, red, -0.04, -0.25, 0.11, { parent: scarf, rz: -0.12 }); K.cyl(0.16, 0.16, 0.012, K.mat(0x16161a), 0, 0.22, 0, { parent: scarf }, 14); K.cyl(0.08, 0.09, 0.1, K.mat(0x16161a), 0, 0.27, 0, { parent: scarf }, 12); }
      K.tell('manequim', (live) => { scarf.visible = true; if (live) K.anim(1.2, e => { mDum.rotation.y = Math.PI / 2 + e * Math.PI; scarf.scale.setScalar(0.3 + e * 0.7); }); else { mDum.rotation.y = Math.PI * 1.5; scarf.scale.setScalar(1); } }, () => { scarf.visible = false; mDum.rotation.y = Math.PI / 2; });
      // estante de sapatos e caixas de chapéu
      K.box(0.4, 0.9, 1.4, K.mat(0xf2efe8), -14.25, 0.45, -7.9); for (const y of [0.3, 0.6, 0.9]) for (let k = 0; k < 5; k++) { const c = [0xb0102a, 0x16161a, 0xd9a441, 0xf2c4cc, 0xc9ced6][(k + y * 10) % 5]; for (const s of [0, 0.06]) K.box(0.16, 0.06, 0.05, K.mat(c, { roughness: 0.3 }), -14.18, y + 0.03, -8.45 + k * 0.27 + s, { cast: false }); }
      K.col(-14.5, -8.65, -14.0, -7.15);
      for (let k = 0; k < 4; k++) { const r = 0.24 - k * 0.03, tex = K.canvasTex(128, 32, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#f6f1e8' : (k % 2 ? '#16161a' : '#e8a0b4'); g.fillRect(i * 8, 0, 8, h); } }); K.cyl(r, r, 0.22, K.texMat(tex), -6.4, 0.11 + k * 0.22, -9.5, {}, 18); K.cyl(r + 0.01, r + 0.01, 0.03, K.mat(0x16161a), -6.4, 0.22 + k * 0.22, -9.5, { cast: false }, 18); }
      K.colR(-6.4, -9.5, 0.3);
      // biombo dobrável separando o backstage
      for (let k = 0; k < 3; k++) { const z = -9.3 + k * 0.72; K.box(0.04, 1.9, 0.7, K.mat(0x16161a, { roughness: 0.5 }), -5.3 + (k % 2) * 0.12, 0.98, z); K.box(0.02, 1.6, 0.55, K.mat(0xe8dcc4, { roughness: 0.8 }), -5.27 + (k % 2) * 0.12, 1.0, z); }
      K.col(-5.45, -9.7, -5.1, -7.15);
      // mesa de ateliê: rolos de tecido, máquina de costura, tesoura
      K.box(2.0, 0.05, 0.9, K.mat(0xe8dcc4, { roughness: 0.7 }), -7.0, 0.88, -3.3); for (const [a, b] of [[-0.95, -0.4], [0.95, -0.4], [-0.95, 0.4], [0.95, 0.4]]) K.box(0.05, 0.86, 0.05, K.mat(0x16161a), -7.0 + a, 0.43, -3.3 + b);
      for (let k = 0; k < 4; k++) K.cyl(0.07, 0.07, 0.8, K.mat([0xb0102a, 0xf2c4cc, 0x16161a, 0xe8d6b0][k], { roughness: 0.7 }), -7.6 + k * 0.17, 0.98, -3.2, { rz: Math.PI / 2, ry: 0.1 }, 10);
      K.box(0.36, 0.2, 0.16, K.mat(0xf2efe8, { roughness: 0.3 }), -6.4, 1.0, -3.45); K.box(0.36, 0.06, 0.16, K.mat(0xf2efe8, { roughness: 0.3 }), -6.4, 1.13, -3.45); K.box(0.06, 0.2, 0.16, K.mat(0xf2efe8, { roughness: 0.3 }), -6.25, 1.0, -3.45); K.cyl(0.03, 0.03, 0.05, K.mat(0xc8322f), -6.4, 0.94, -3.32, { cast: false }, 8);
      K.box(0.04, 0.005, 0.18, silver, -6.9, 0.91, -3.0, { ry: 0.6, cast: false }); K.sphere(0.04, K.mat(0xc8322f), -7.3, 0.93, -3.0, { cast: false }, 8, 6);
      K.col(-8.05, -3.8, -5.95, -2.8);
      K.plight(-9.6, 2.6, -7.0, 0xffe2c4, 1.6, 9);
      K.bulbs([-14.3, 2.9, -9.6], [-5.6, 2.9, -9.6], 20, 0.2, 0xfff0d0, 2.6);
      [[-12.2, -7.6], [-10.6, -7.7], [-8.8, -7.6], [-12.2, -5.4], [-10.6, -4.4], [-7.0, -5.4], [-12.0, -2.6], [-5.9, -5.2]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));
    }

    // ------------------------------------------------------------ bar de champanhe e macarons (fundo à direita)
    { // estante espelhada do bar com garrafas
      K.box(8.0, 2.6, 0.3, K.mat(0x16161a, { roughness: 0.4 }), 10.4, 1.3, -10.0); K.box(7.6, 2.0, 0.02, mirror, 10.4, 1.35, -9.84, { cast: false });
      const bot = [], foil = [];
      for (const y of [0.55, 1.15, 1.75]) { K.box(7.6, 0.04, 0.3, gold, 10.4, y, -9.72, { cast: false }); for (let k = 0; k < 30; k++) { const x = 6.8 + k * 0.245 + R() * 0.03; bot.push([x, y + 0.02, -9.72, R() * 6, 1]); foil.push([x, y + 0.31, -9.72, 0, 1]); } }
      K.inst(new T.LatheGeometry([[0, 0], [0.04, 0], [0.042, 0.2], [0.016, 0.28], [0.014, 0.33], [0, 0.33]].map(p => new T.Vector2(p[0], p[1])), 8), K.mat(0x14301c, { roughness: 0.15, metalness: 0.3 }), bot, { cast: false });
      K.inst(new T.CylinderGeometry(0.016, 0.018, 0.06, 6), K.metal(0xd9b450, 0.3), foil, { cast: false });
      K.sign('Champagne', 3.0, 0.8, 10.4, 2.3, -9.8, { neon: true, color: '#ff9ec4', font: 'Georgia, serif', weight: 'italic 400', size: 96, k: 2.2 });
      // balcão art déco
      K.add(K.rbox(6.4, 1.06, 0.7, 0.04), K.mat(0x16161a, { roughness: 0.3 }), 10.2, 0.53, -7.6);
      K.box(6.5, 0.05, 0.8, K.mat(0xf6f3ee, { roughness: 0.15, metalness: 0.05 }), 10.2, 1.08, -7.6);
      for (let k = 0; k < 16; k++) K.box(0.04, 0.9, 0.02, gold, 7.2 + k * 0.4, 0.5, -7.24, { cast: false });
      K.box(6.4, 0.04, 0.02, gold, 10.2, 0.97, -7.24, { cast: false });
      K.col(6.9, -8.0, 13.5, -7.2);
      // torre de taças
      const tw = [], tx = 8.2, tz = -7.6;
      for (let lvl = 0; lvl < 5; lvl++) { const n = 5 - lvl, y = 1.12 + lvl * 0.13; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tw.push([tx + (i - (n - 1) / 2) * 0.11, y, tz + (j - (n - 1) / 2) * 0.11]); }
      const champ = K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.4, roughness: 0.1 });
      K.inst(new T.CylinderGeometry(0.05, 0.012, 0.035, 10).translate(0, 0.085, 0), champ, tw, { cast: false });
      K.inst(new T.CylinderGeometry(0.004, 0.004, 0.07, 4).translate(0, 0.035, 0), K.glass, tw, { cast: false });
      // baldes de gelo com garrafas
      for (const x of [9.5, 12.4]) { K.cyl(0.13, 0.1, 0.24, silver, x, 1.22, -7.6, {}, 14); for (const s of [-1, 1]) { K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.016, 0.28], [0.014, 0.33], [0, 0.33]], K.mat(0x14301c, { roughness: 0.15, metalness: 0.3 }), x + s * 0.04, 1.2, -7.6, { cast: false, rz: s * 0.25 }, 8); } }
      // macarons: torrinhas no balcão + torre grande (croquembouche) da missão
      const macC = [0xf4a6c0, 0xa8e0c0, 0xc8b0e8, 0xf6e08a, 0xf3e6d0, 0xe0607a], macL = macC.map(() => []);
      const macTower = (cx, y0, cz, h, r0, s) => { const rows = Math.round(h / (0.075 * s)); let c = 0; for (let k = 0; k < rows; k++) { const r = r0 * (1 - k / (rows + 1.5)), y = y0 + k * 0.075 * s, n = Math.max(3, Math.round(Math.PI * 2 * r / (0.075 * s))); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + k * 0.3; macL[(c++ + k) % 6].push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, -a, s, 0, Math.PI / 2]); } } K.cone(r0 * 0.95, h, K.mat(0xf3e6d0), cx, y0 + h / 2 - 0.03, cz, { cast: false }, 12); };
      macTower(10.6, 1.14, -7.6, 0.4, 0.13, 0.8); macTower(11.2, 1.14, -7.6, 0.5, 0.15, 0.8); macTower(11.8, 1.14, -7.6, 0.36, 0.12, 0.8);
      // pedestal da torre grande
      const mx = 5.0, mz = -4.6;
      K.cyl(0.5, 0.5, 0.04, gold, mx, 0.9, mz, {}, 24); K.cyl(0.08, 0.22, 0.88, K.mat(0x16161a, { roughness: 0.3 }), mx, 0.44, mz, {}, 12); K.cyl(0.42, 0.42, 0.015, K.mat(0xf6f3ee), mx, 0.93, mz, { cast: false }, 24);
      const tower = K.group(mx, 0, mz);
      macTower(mx, 0.97, mz, 1.05, 0.34, 1.0);
      K.colR(mx, mz, 0.5);
      const macGeo = new T.CylinderGeometry(0.034, 0.034, 0.032, 12);
      macL.forEach((l, i) => K.inst(macGeo, K.mat(macC[i], { roughness: 0.75 }), l, { cast: false }));
      // coroa da torre: macaron gigante rosa com folha de ouro (vira o esconderijo do microfilme)
      const crown = K.group(mx, 2.07, mz); dyn(crown); const crownM = K.mat(0xf06a9a, { roughness: 0.7 });
      const cTop = K.add(new T.SphereGeometry(0.11, 14, 8).scale(1, 0.45, 1), crownM, 0, 0.05, 0, { parent: crown }); const cBot = K.add(new T.SphereGeometry(0.11, 14, 8).scale(1, 0.45, 1), crownM, 0, -0.05, 0, { parent: crown }); K.cyl(0.1, 0.1, 0.04, K.mat(0xfff0e0), 0, 0, 0, { parent: crown }, 14);
      K.box(0.05, 0.004, 0.04, K.gold, 0.02, 0.1, 0.01, { parent: crown, ry: 0.5, cast: false });
      const crownHalo = K.halo(mx, 2.07, mz, 0.5, 0x40ff90, 1.0); crownHalo.visible = false;
      K.tell('macaron', (live) => { const m = K.mat(0x30e080, { emissive: 0x20c060, emissiveIntensity: 1.2, roughness: 0.4 }); cTop.material = m; cBot.material = m; crownHalo.visible = true; if (live) K.anim(1.4, e => { crown.rotation.z = Math.sin(e * Math.PI * 3) * 0.4; crown.position.y = 2.07 + Math.sin(e * Math.PI) * 0.3; }); else crown.rotation.z = 0.35; }, () => { cTop.material = crownM; cBot.material = crownM; crownHalo.visible = false; crown.rotation.z = 0; crown.position.y = 2.07; });
      K.tick((dt, t) => { if (crownHalo.visible) crownHalo.scale.setScalar(0.9 + Math.sin(t * 5) * 0.25); });
      [[7.4, -6.6], [8.4, -6.6], [9.4, -6.6], [10.4, -6.6], [11.4, -6.6], [12.4, -6.6]].forEach(([x, z]) => K.slot(x, z, x, -7.6, 'bar'));
      K.plight(10.2, 2.4, -6.2, 0xffd0b0, 1.5, 8);
      K.halo(10.4, 2.3, -9.5, 1.4, 0xff9ec4, 0.3);
    }

    // ------------------------------------------------------------ claraboia de vidro (missão: abrir)
    { const cx = 7.2, cz = 1.2;
      K.box(2.6, 0.4, 2.0, stone, cx, 0.2, cz); K.box(2.7, 0.06, 2.1, stoneD, cx, 0.42, cz, { cast: false });
      const glassM = K.mat(0xa8c8e8, { transparent: true, opacity: 0.45, roughness: 0.05, metalness: 0.2, emissive: 0xffc890, emissiveIntensity: 0.25 });
      // água de trás (fixa)
      const back = K.group(cx, 1.1, cz, 0); K.add(new T.PlaneGeometry(2.5, 1.18), glassM, 0, -0.33, -0.48, { parent: back, rx: 0.96, cast: false });
      K.box(2.5, 0.05, 0.05, ironM, cx, 1.1, cz, { cast: false });
      for (let k = 0; k < 5; k++) { const x = cx - 1.2 + k * 0.6; K.box(0.03, 0.03, 1.15, ironM, x, 0.77, cz - 0.48, { rx: -0.6, cast: false }); }
      // água da frente (abre): dobradiça na cumeeira
      const pane = K.group(cx, 1.1, cz, 0); dyn(pane); const pM = K.add(new T.PlaneGeometry(2.5, 1.18), glassM, 0, -0.33, 0.48, { parent: pane, rx: -0.96, cast: false });
      for (let k = 0; k < 5; k++) K.box(0.03, 0.03, 1.15, ironM, -1.2 + k * 0.6, -0.33, 0.48, { parent: pane, rx: 0.6, cast: false }); K.box(2.5, 0.04, 0.04, ironM, 0, -0.66, 0.96, { parent: pane, cast: false });
      K.pool(cx, cz, 1.0, 0xffc890, 0.5, 0.43);
      const skyLight = { intensity: 0 }; const skyPool = K.pool(cx, cz + 1.2, 1.6, 0xffc890, 0.0); const skyHalo = K.halo(cx, 1.6, cz + 0.5, 1.6, 0xffc890, 0.0);
      K.col(cx - 1.35, cz - 1.05, cx + 1.35, cz + 1.05);
      K.tell('claraboia', (live) => { const f = (e) => { pane.rotation.x = -e * 1.05; skyLight.intensity = e * 2.2; skyHalo.material.color.set(new T.Color(0xffc890).multiplyScalar(e * 0.7)); skyPool.material.color.set(new T.Color(0xffc890).multiplyScalar(e * 0.6)); }; if (live) K.anim(1.5, f); else f(1); }, () => { pane.rotation.x = 0; skyLight.intensity = 0; skyHalo.material.color.set(0x000000); skyPool.material.color.set(0x000000); });
      [[5.4, 0.2], [5.4, 2.3], [9.0, 0.2], [9.0, 2.3]].forEach(([x, z]) => K.slot(x, z, cx, cz, 'talk'));
    }

    // ------------------------------------------------------------ parede de fotos (step-and-repeat) à direita
    { const t = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#f6f3ee'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.textBaseline = 'middle'; for (let j = 0; j < 6; j++) for (let i = 0; i < 5; i++) { const x = 50 + i * 104 + (j % 2) * 52, y = 22 + j * 42; g.fillStyle = '#16161a'; if ((i + j) % 2) { g.font = '400 22px Georgia'; g.fillText('LUMIÈRE', x, y); } else { g.font = '400 28px Didot, Georgia'; g.strokeStyle = '#b8893a'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 15, 0, 7); g.stroke(); g.fillStyle = '#b8893a'; g.fillText('L', x, y + 2); } } });
      K.box(0.12, 2.6, 5.0, K.mat(0x16161a), 14.05, 1.3, 3.0); K.add(new T.PlaneGeometry(4.9, 2.5), K.texMat(t, { roughness: 0.6 }), 13.98, 1.32, 3.0, { ry: -Math.PI / 2, cast: false });
      K.col(13.8, 0.4, 14.5, 5.6);
      // tapete vermelho e postes de veludo
      K.add(new T.PlaneGeometry(1.6, 5.2).rotateX(-Math.PI / 2), K.mat(0x8a0f1e, { roughness: 0.95 }), 13.1, 0.013, 3.0, { cast: false });
      for (const z of [0.6, 5.4]) { K.cyl(0.03, 0.03, 0.95, gold, 12.3, 0.48, z, {}, 8); K.cyl(0.14, 0.16, 0.04, gold, 12.3, 0.02, z, {}, 12); K.sphere(0.05, gold, 12.3, 0.98, z, {}, 8, 6); K.colR(12.3, z, 0.12); }
      // ring light
      { const g = K.group(12.0, 0, 6.2); K.cyl(0.012, 0.012, 1.6, K.mat(0x16161a), 0, 0.8, 0, { parent: g }, 5); K.torus(0.25, 0.03, K.glow(0xfff8f0, 2.4), 0, 1.65, 0, { parent: g, ry: 1.2 }, 6, 24); K.colR(12.0, 6.2, 0.2); }
      [[12.9, 1.5], [12.9, 3.0], [12.9, 4.5]].forEach(([x, z]) => K.slot(x, z, x - 1, z, 'selfie'));
    }

    // ------------------------------------------------------------ lounge à direita, na frente: sofás de veludo, aquecedor, lavanda
    K.sofa(8.0, 8.6, 2.4, Math.PI, { cloth: velvetR, pillow: 0xd9a441 }); K.col(6.8, 8.2, 9.2, 9.05); [7.4, 8.6].forEach(x => K.slot(x, 8.55, x, 7, 'sit'));
    K.sofa(8.0, 5.8, 2.4, 0, { cloth: K.mat(0x16161a, { roughness: 0.85 }), pillow: 0xf2c4cc }); K.col(6.8, 5.4, 9.2, 6.25); [7.4, 8.6].forEach(x => K.slot(x, 5.85, x, 7, 'sit'));
    K.cyl(0.45, 0.45, 0.04, K.mat(0xf6f3ee, { roughness: 0.15 }), 8.0, 0.42, 7.2, {}, 20); K.cyl(0.05, 0.2, 0.4, gold, 8.0, 0.2, 7.2, {}, 10); K.colR(8.0, 7.2, 0.4);
    for (let k = 0; k < 3; k++) { K.cyl(0.035, 0.03, 0.09, K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.3 }), 7.8 + k * 0.15, 0.49, 7.1 + (k % 2) * 0.12, { cast: false }, 8); }
    K.cyl(0.06, 0.05, 0.12, K.glass, 8.2, 0.5, 7.35, { cast: false }, 8); for (let k = 0; k < 5; k++) K.cyl(0.005, 0.005, 0.25, K.mat(0x7a5ab8), 8.2 + (k - 2) * 0.012, 0.62, 7.35, { cast: false, rz: (k - 2) * 0.15 }, 3);
    [[10.2, 7.4], [10.6, 6.2], [5.6, 7.6], [5.2, 6.4]].forEach(([x, z]) => K.slot(x, z, 8, 7.2, 'talk'));
    // aquecedores de terraço (cogumelo) com chama alaranjada
    const heaters = [];
    for (const [x, z] of [[-6.2, 2.4], [4.6, -1.8], [11.2, 0.0], [-7.6, -1.6]]) { K.cyl(0.22, 0.26, 0.12, K.mat(0x3a3a40, { metalness: 0.7, roughness: 0.4 }), x, 0.06, z, {}, 14); K.cyl(0.04, 0.05, 2.1, silver, x, 1.1, z, {}, 8); K.add(new T.ConeGeometry(0.55, 0.22, 16, 1, true), K.mat(0xc9ced6, { metalness: 0.8, roughness: 0.3, side: T.DoubleSide }), x, 2.32, z); const c = K.cyl(0.1, 0.1, 0.3, K.glow(0xff6a20, 2.2), x, 2.1, z, { cast: false }, 10); heaters.push(c); K.pool(x, z, 1.4, 0xff8040, 0.25); K.colR(x, z, 0.3); }
    dyn(...heaters); K.tick((dt, t) => heaters.forEach((c, i) => c.scale.set(1, 0.9 + Math.sin(t * 3 + i) * 0.1, 1)));
    // floreiras de lavanda (frente e laterais)
    const lav = [], stems = [];
    const planter = (x0, x1, z0, z1) => { const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0; K.box(w, 0.45, d, K.mat(0xd8cfc0, { roughness: 0.8 }), cx, 0.225, cz); K.box(w - 0.08, 0.02, d - 0.08, M.soil, cx, 0.44, cz, { cast: false }); const n = Math.round(w * d * 60); for (let k = 0; k < n; k++) { const x = x0 + 0.08 + R() * (w - 0.16), z = z0 + 0.08 + R() * (d - 0.16), h = 0.25 + R() * 0.2; stems.push([x, 0.45, z, 0, [1, h / 0.3, 1], (R() - 0.5) * 0.3, (R() - 0.5) * 0.3]); lav.push([x + (R() - 0.5) * 0.02, 0.45 + h, z + (R() - 0.5) * 0.02, 0, 0.8 + R() * 0.4]); } K.col(x0, z0, x1, z1); };
    planter(-8.6, -4.4, 9.2, 9.75); planter(4.0, 6.2, 9.2, 9.75); planter(12.0, 14.4, 9.2, 9.75); planter(14.0, 14.5, -3.4, -1.0); planter(-14.5, -14.0, 5.0, 7.2);
    K.inst(new T.CylinderGeometry(0.004, 0.004, 0.3, 3).translate(0, 0.15, 0), K.mat(0x5a7a4a), stems, { cast: false });
    K.inst(new T.SphereGeometry(0.022, 5, 4).scale(1, 3, 1), K.mat(0x8a6ac8, { roughness: 0.8, emissive: 0x2a1a4a, emissiveIntensity: 0.4 }), lav, { cast: false });
    // lenço de seda (missão): amarrado na grade da frente, tremulando
    const silk = K.group(11.0, 1.08, 10.05); silk.visible = false; dyn(silk);
    { const red = new T.MeshStandardMaterial({ color: 0xe0102a, emissive: 0x900018, emissiveIntensity: 0.8, roughness: 0.4, side: T.DoubleSide }); K.add(new T.PlaneGeometry(0.32, 1.5, 1, 8).translate(0, -0.75, 0), red, 0, 0, 0.05, { parent: silk, cast: false }); K.sphere(0.06, red, 0, 0, 0, { parent: silk, cast: false }, 8, 6); K.add(new T.PlaneGeometry(0.2, 0.5).translate(0, -0.25, 0), red, 0.1, 0, 0.06, { parent: silk, cast: false, rz: 0.5 }); }
    K.tick((dt, t) => { if (silk.visible) { silk.rotation.z = Math.sin(t * 3.1) * 0.25; silk.rotation.x = 0.3 + Math.sin(t * 4.7) * 0.15; } });
    K.tell('lenco', (live) => { silk.visible = true; if (live) K.anim(0.9, e => silk.scale.set(1, e, 1)); else silk.scale.set(1, 1, 1); }, () => { silk.visible = false; });
    [[-12.0, 9.1], [-3.8, 9.2], [9.4, 9.2], [13.4, 8.6]].forEach(([x, z]) => K.slot(x, z, x, 14, 'view'));

    // ------------------------------------------------------------ entrada: édicule da escada, fila de veludo, segurança e mímico (esquerda, frente)
    { const g = K.group(-13.4, 0, 8.7);
      K.box(2.0, 2.3, 1.9, K.mat(0xe2d8c4, { roughness: 0.85 }), 0, 1.15, 0, { parent: g }); K.add(pr([0, 0, 2.3, 2.2, 2.3], [0, 0, 1.6, 1.2, 2.9]), zinc, 0, 0, 0, { parent: g });
      K.box(0.06, 1.9, 1.0, K.mat(0x1c2a24, { roughness: 0.5 }), 1.0, 0.95, 0, { parent: g }); K.box(0.04, 1.6, 0.8, K.glow(0xffc87a, 1.2), 1.02, 0.95, 0, { parent: g, cast: false });
      K.sign('ENTRÉE', 0.8, 0.2, 1.03, 2.05, 0, { parent: g, ry: Math.PI / 2, color: '#f2e6c8', bg: '#16161a', size: 64, w: 256, h: 64 });
      K.cyl(0.015, 0.015, 0.9, ironM, -0.6, 3.1, -0.5, { parent: g }, 4);
      const flag = K.group(-0.6, 3.5, -0.5, 0, g); dyn(flag); const ft = K.canvasTex(96, 64, (gg, w, h) => { ['#1f3a8a', '#f6f3ee', '#d0102a'].forEach((c, i) => { gg.fillStyle = c; gg.fillRect(i * w / 3, 0, w / 3, h); }); });
      const fm = K.add(new T.PlaneGeometry(0.6, 0.4, 6, 1).translate(0.3, -0.2, 0), K.texMat(ft, { side: T.DoubleSide }), 0, 0, 0, { parent: flag, cast: false });
      const fp = fm.geometry.attributes.position, fx0 = Array.from({ length: fp.count }, (_, i) => fp.getX(i));
      K.tick((dt, t) => { for (let i = 0; i < fp.count; i++) fp.setZ(i, Math.sin(t * 5 + fx0[i] * 9) * 0.05 * fx0[i] / 0.6); fp.needsUpdate = true; flag.rotation.y = Math.sin(t * 0.7) * 0.2; });
      K.col(-14.5, 7.7, -12.35, 9.8); K.halo(-12.3, 1.2, 8.7, 1.0, 0xffc87a, 0.35); }
    // postes de veludo formando o corredor da fila
    { const posts = []; for (const x of [-11.7, -10.3]) for (const z of [5.6, 6.6, 7.6, 8.6]) { posts.push([x, z]); K.colR(x, z, 0.1); }
      posts.forEach(([x, z]) => { K.cyl(0.025, 0.025, 0.95, gold, x, 0.48, z, {}, 8); K.cyl(0.13, 0.15, 0.04, gold, x, 0.02, z, {}, 12); K.sphere(0.045, gold, x, 0.97, z, {}, 8, 6); });
      for (const x of [-11.7, -10.3]) for (const z of [5.6, 6.6, 7.6]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push(new T.Vector3(x, 0.9 - Math.sin(u * Math.PI) * 0.18, z + u)); } K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 8, 0.022, 5), velvetR, 0, 0, 0, { cast: false }); }
      [6.0, 6.8, 7.6, 8.35].forEach(z => K.slot(-11.0, z, -11.0, z - 1, 'talk'));
      // púlpito com a lista de convidados
      K.box(0.5, 1.05, 0.4, K.mat(0x16161a, { roughness: 0.4 }), -12.2, 0.53, 4.9); K.box(0.55, 0.04, 0.45, gold, -12.2, 1.07, 4.9, { rx: -0.2 }); K.box(0.3, 0.005, 0.38, M.white, -12.2, 1.1, 4.9, { rx: -0.2, cast: false }); K.cyl(0.012, 0.012, 0.3, K.metal(0x2a2a2e), -12.05, 1.2, 4.75, {}, 4);
      K.colR(-12.2, 4.9, 0.3);
      K.pool(-11.0, 7.0, 2.2, 0xffc890, 0.3); }
    // postes de luz parisienses (sem luz real; brilho barato)
    for (const [x, z] of [[-14.0, 4.2], [14.0, -4.6], [14.0, 6.6], [-14.0, -2.8]]) K.lamppost(x, z, { h: 3.0, color: 0xffd090, light: false });

    // ------------------------------------------------------------ DJ à esquerda (meio), com pista pequena
    { const g = K.group(-13.2, 0, 0.8);
      K.box(0.8, 0.95, 2.0, K.mat(0x16161a, { roughness: 0.4 }), 0, 0.475, 0, { parent: g }); K.box(0.85, 0.04, 2.05, K.mat(0x2a2a30), 0, 0.97, 0, { parent: g });
      const decks = [-0.55, 0.55].map(z => { K.box(0.4, 0.04, 0.42, K.mat(0x222226), 0, 1.0, z, { parent: g }); return K.cyl(0.15, 0.15, 0.015, K.mat(0x0a0a0a, { roughness: 0.2 }), 0, 1.03, z, { parent: g }, 18); });
      K.box(0.25, 0.015, 0.34, K.glow(0x9ab8ff, 1.2), -0.15, 1.0, 0, { parent: g, cast: false });
      const eq = []; for (let k = 0; k < 10; k++) eq.push(K.box(0.02, 0.5, 0.12, K.glow(k % 3 ? 0xff3cc8 : 0x3cc8ff, 2.2), 0.42, 0.48, -0.8 + k * 0.18, { parent: g, cast: false }));
      for (const z of [-1.5, 3.1]) { K.box(0.5, 1.2, 0.5, K.mat(0x16161a, { roughness: 0.6 }), -13.6, 0.95, z, {}); K.cyl(0.04, 0.04, 0.35, ironM, -13.6, 0.18, z, {}, 5); for (const y of [0.75, 1.25]) K.cyl(0.14 - (y > 1 ? 0.06 : 0), 0.14 - (y > 1 ? 0.06 : 0), 0.02, K.mat(0x2a2a30), -13.34, y, z, { rz: Math.PI / 2, cast: false }, 14); K.colR(-13.6, z, 0.3); }
      dyn(...decks, ...eq); K.tick((dt, t) => { decks.forEach(d => d.rotation.y = t * 3.5); eq.forEach((b, k) => { const s = 0.3 + Math.abs(Math.sin(t * 6 + k * 1.3) * Math.sin(t * 2.3 + k)) * 1.3; b.scale.y = s; b.position.y = 0.23 + 0.25 * s; }); });
      K.col(-13.7, -0.3, -12.7, 1.9);
      K.rug(-10.6, 0.8, 3.2, 3.0, (gg, w, h) => { gg.fillStyle = '#121218'; gg.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { gg.fillStyle = (i + j) % 2 ? '#2a2236' : '#1a1a24'; gg.fillRect(i * w / 6, j * h / 6, w / 6 - 2, h / 6 - 2); } });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) K.slot(-11.6 + i * 1.0, 0.2 + j * 1.2, -13, 0.8, 'dance');
      K.pool(-10.6, 0.8, 1.8, 0xff3cc8, 0.22); }

    // ------------------------------------------------------------ mesas altas de coquetel e conversa geral
    for (const [x, z] of [[-6.4, -1.0], [-8.6, 4.4], [-4.4, 4.4], [7.6, -3.4], [10.4, -4.0], [12.6, -2.4], [10.4, 3.6], [-4.4, -5.0], [4.4, 2.6]]) K.table(x, z, { r: 0.4, h: 1.05, cloth: K.mat(0x16161a, { roughness: 0.9 }), top: K.mat(0xf6f3ee), flower: 0x8a6ac8, slots: 3 });
    [[-4.2, -2.4], [-4.0, 0.6], [-4.3, 2.4], [4.0, -6.4], [4.2, -3.0], [4.2, 0.2], [4.6, 4.4], [-5.6, 5.6], [-7.4, 6.2], [-3.9, -7.6], [6.6, -5.2], [9.0, -5.4], [-9.6, 2.8], [-8.0, -0.4], [12.0, 1.4], [-2.4, 5.8], [2.4, 5.8]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));
    // passarela: modelos em pose
    [-6.6, -4.2, -1.8, 0.6].forEach(z => K.slot(0, z, 0, z + 5, 'view', 1));

    // ------------------------------------------------------------ peças repetidas e fundidas (um draw call cada)
    K.merge(goldParts, K.vcol({ metalness: 0.85, roughness: 0.3, envMapIntensity: 1.0 }));
    K.merge(cushParts, K.vcol({ roughness: 0.9 }));
    K.merge(trussParts, K.vcol({ metalness: 0.75, roughness: 0.35 }));
    K.merge(dormParts, new T.MeshLambertMaterial({ vertexColors: true }), { cast: false });
    K.merge(dormWin, vglow, { cast: false });
    K.merge(stackParts, new T.MeshLambertMaterial({ vertexColors: true }), { cast: false });
    K.inst(new T.CylinderGeometry(0.09, 0.11, 0.42, 8).translate(0, 0.21, 0), lamb(0xb5603a), pots, { cast: false });
    HM.forEach((m, v) => { if (instBody[v].length) K.inst(new T.BoxGeometry(1, 1, 1), m, instBody[v], { cast: false }); });
    K.inst(new T.BoxGeometry(1, 1, 1), cornL, instCorn, { cast: false });
    K.inst(unitMansard, zinc, instMan, { cast: false });
    // fumacinha saindo de algumas chaminés
    const puffs = []; for (const [x, y, z] of [[-15.4, 3.0, -8.0], [15.4, 3.2, 6.0], [-22, 3.4, -26], [12, 3.6, -24]]) for (let k = 0; k < 4; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: 0x8a90a8, transparent: true, opacity: 0.3, depthWrite: false })); s.position.set(x, y, z); K.root.add(s); puffs.push({ s, x, y, z, o: k / 4 }); }
    K.tick((dt, t) => puffs.forEach(p => { const u = (t * 0.15 + p.o) % 1; p.s.position.set(p.x + u * 1.2, p.y + u * 2.2, p.z - u * 0.5); p.s.scale.setScalar(0.4 + u * 1.4); p.s.material.opacity = 0.35 * (1 - u); }));
    // pombos na platibanda: andam em fila em cima da pedra, levantam voo quando alguém encosta na grade
    // ou quando a imprensa dispara vários flashes de uma vez (os bandos perto do pódio)
    const bandosP = [[-14.95, -6.0, 'z', 1.1, 5], [14.95, 2.4, 'z', 0.9, 4], [9.2, 10.0, 'x', 1.0, 4], [-12.6, 10.0, 'x', 1.0, 5]].map(([x, z, eixo, r, n]) =>
      K.pombos({ x, z, y: 0.51, eixo, r, larg: 0.05, n, alerta: 1.0, voo: 4.5, tam: 0.95, cor: 0x50545e }));
    const assustaveis = [bandosP[2], bandosP[3]];
    // gato do vizinho: anda pela beira do telhado de zinco à direita, senta, lambe a pata, abana o rabo; quando os pombos
    // voam, para, se encolhe e acompanha o bando com a cabeça
    { const pelo = K.mat(0x2a2624, { roughness: 0.95 }), pelo2 = K.mat(0xd8d0c4, { roughness: 0.95 }), olho = K.glow(0xc8ff70, 1.6);
      const cat = K.group(19.15, 1.67, 0); dyn(cat); const S = 1.25; cat.scale.setScalar(S);
      const body = K.group(0, 0.16, 0, 0, cat); K.add(new T.SphereGeometry(0.1, 10, 8).scale(0.85, 0.85, 1.7), pelo, 0, 0, 0, { parent: body });
      K.add(new T.SphereGeometry(0.06, 8, 6).scale(1, 0.8, 1.2), pelo2, 0, -0.035, 0.09, { parent: body, cast: false });
      const head = K.group(0, 0.07, 0.17, 0, body); K.add(new T.SphereGeometry(0.065, 10, 8).scale(1, 0.9, 1), pelo, 0, 0, 0, { parent: head });
      K.add(new T.SphereGeometry(0.03, 8, 6).scale(1, 0.75, 1), pelo2, 0, -0.022, 0.05, { parent: head, cast: false });
      for (const sx of [-1, 1]) { K.add(new T.ConeGeometry(0.028, 0.06, 4), pelo, sx * 0.037, 0.06, -0.005, { parent: head, rz: -sx * 0.25 }); K.add(new T.SphereGeometry(0.011, 6, 4), olho, sx * 0.026, 0.012, 0.055, { parent: head, cast: false }); }
      const legs = [[-0.045, 0.1], [0.045, 0.1], [-0.045, -0.1], [0.045, -0.1]].map(([x, z]) => { const l = K.group(x, 0.13, z, 0, cat); K.cyl(0.024, 0.02, 0.13, pelo, 0, -0.065, 0, { parent: l }, 6); return l; });
      const tail = K.group(0, 0.03, -0.16, 0, body); let tp = tail; const tails = [];
      for (let k = 0; k < 5; k++) { const sg = K.group(0, 0, 0, 0, tp); if (k) sg.position.y = 0.055; K.cyl(0.016 - k * 0.0015, 0.018 - k * 0.0015, 0.06, pelo, 0, 0.03, 0, { parent: sg }, 5); tails.push(sg); tp = sg; }
      // trajeto: vai e volta pela beira (z), com paradas para sentar
      const Z0 = -5.3, Z1 = 3.1, rc = K.rng(8808); let z = -1, dir = 1, estado = 'anda', te = 6, alvo = Z1;
      K.tick((dt, t) => {
        dt = Math.min(dt, 0.1); te -= dt; const assusta = K.bandos.some(b => b.voando());
        if (estado === 'anda') { const v = 0.32 * dt * dir; z += v; if ((dir > 0 && z >= alvo) || (dir < 0 && z <= alvo) || te <= 0) { estado = 'senta'; te = 5 + rc() * 7; } }
        else if (te <= 0) { estado = 'anda'; te = 8 + rc() * 8; if (rc() < 0.5 || z >= Z1 - 0.2 || z <= Z0 + 0.2) dir = z > (Z0 + Z1) / 2 ? -1 : 1; alvo = dir > 0 ? Z1 : Z0; }
        const anda = estado === 'anda' && !assusta, senta = estado === 'senta' && !assusta; if (estado === 'anda' && assusta) z -= 0.32 * dt * dir;
        cat.position.z = z; cat.rotation.y = dir > 0 ? 0 : Math.PI;
        const ph = t * 7;
        legs.forEach((l, i) => { l.rotation.x = anda ? Math.sin(ph + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.45 : senta && i < 2 ? -0.15 : 0; l.scale.y = senta && i >= 2 ? 0.45 : 1; });
        body.rotation.x = senta ? -0.5 : 0; body.position.y = assusta ? 0.11 : senta ? 0.13 : 0.16 + (anda ? Math.abs(Math.sin(ph)) * 0.006 : 0); body.position.z = senta ? -0.04 : 0;
        // cabeça: olha à frente andando; sentado vira para a festa (à esquerda) e às vezes lambe a pata; assustado mira os pombos no alto
        const lado = dir > 0 ? -1 : 1, lambe = senta && (t % 9) < 2.2;
        head.rotation.set(assusta ? -0.9 : lambe ? 0.9 + Math.sin(t * 9) * 0.15 : senta ? 0.5 : 0, assusta ? lado * Math.sin(t * 0.8) * 0.8 : senta && !lambe ? lado * 1.1 + Math.sin(t * 0.4) * 0.3 : 0, 0);
        tails.forEach((sg, k) => { sg.rotation.x = (k ? 0.22 : senta ? -1.9 : -1.1) + (assusta ? 0.05 : 0); sg.rotation.z = Math.sin(t * (assusta ? 6 : 1.8) - k * 0.7) * (assusta ? 0.25 : 0.18) * (k + 1) * 0.5; });
      }); }


    // ------------------------------------------------------------ junta as peças estáticas por material (menos draw calls; o WebGL por software agradece)
    { const root = K.root; root.updateMatrixWorld(true); const inv = new T.Matrix4().copy(root.matrixWorld).invert(), groups = new Map(), flames = new Set(K.flames);
      root.traverse(o => {
        if (!o.isMesh || o.isInstancedMesh || !o.geometry || !o.geometry.attributes.normal) return;
        for (let q = o; q; q = q.parent) if (q.userData.dyn || !q.visible) return;
        const m = o.material; if (Array.isArray(m) || m.transparent || m.blending !== T.NormalBlending || flames.has(o)) return;
        let key = m.uuid; if (m.isMeshBasicMaterial && !m.map && !m.vertexColors) key = 'b' + m.color.getHexString() + m.toneMapped;
        key += (o.castShadow ? 'c' : '') + (o.receiveShadow ? 'r' : '') + (o.renderOrder || 0);
        if (!groups.has(key)) groups.set(key, { m, list: [] }); groups.get(key).list.push(o);
      });
      const mtx = new T.Matrix4();
      groups.forEach(({ m, list }) => {
        if (list.length < 2) return;
        const uv = list.every(o => o.geometry.attributes.uv), col = !!m.vertexColors;
        const gs = list.map(o => { let g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); mtx.multiplyMatrices(inv, o.matrixWorld); g.applyMatrix4(mtx); return g; });
        let n = 0; gs.forEach(g => n += g.attributes.position.count);
        const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uvs = uv ? new Float32Array(n * 2) : null, cs = col ? new Float32Array(n * 3) : null; let k = 0;
        gs.forEach(g => { pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); if (uv) uvs.set(g.attributes.uv.array, k * 2); if (col) cs.set(g.attributes.color.array, k * 3); k += g.attributes.position.count; g.dispose(); });
        const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); if (uv) out.setAttribute('uv', new T.BufferAttribute(uvs, 2)); if (col) out.setAttribute('color', new T.BufferAttribute(cs, 3));
        const me = new T.Mesh(out, m); me.castShadow = list[0].castShadow; me.receiveShadow = list[0].receiveShadow; me.renderOrder = list[0].renderOrder; root.add(me);
        list.forEach(o => o.parent.remove(o));
      });
    }
    // ------------------------------------------------------------ luz geral
    K.plight(-7.0, 3.0, 1.0, 0xffd2a8, 1.2, 9);
    K.plight(6.8, 3.0, 3.6, 0xffd2a8, 1.2, 9);
    K.pool(-7.0, 1.0, 3.0, 0xffb880, 0.2); K.pool(6.8, 3.6, 3.0, 0xffb880, 0.2);
    // menos reflexo da sala neutra: à noite a sombra fica no azul do céu e só acende onde há luz
    K.reflexo(0.3);
  },
  // ninho do sniper: atrás da chaminé, no telhado de zinco. Chapas com juntas em pé, pátina e escorridos de ferrugem,
  // a calha na frente, a chaminé de tijolo com potes de terracota à direita e a antena velha à esquerda
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.55 }), zinc = 0x8a9098;
    N.tampo(zinc, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 81, mat: { roughness: 0.45, metalness: 0.4 }, draw: (c, w, h, R) => {
      c.fillStyle = '#8a9098'; c.fillRect(0, 0, w, h); K.manchas(c, w, h, R, 120, ['230,232,236', '90,96,104'], 8, 50, 0.3);
      for (let x = 50; x < w; x += 100) { c.fillStyle = 'rgba(220,224,230,.8)'; c.fillRect(x, 0, 3, h); c.fillStyle = 'rgba(40,44,50,.6)'; c.fillRect(x + 3, 0, 3, h); }
      for (let k = 0; k < 10; k++) { const x = R() * w, l = 20 + R() * 60; const gr = c.createLinearGradient(0, 0, 0, l); gr.addColorStop(0, 'rgba(150,80,30,.5)'); gr.addColorStop(1, 'rgba(150,80,30,0)'); c.fillStyle = gr; c.save(); c.translate(x, 0); c.fillRect(0, 0, 4 + R() * 6, l); c.restore(); }
      c.fillStyle = 'rgba(40,44,50,.8)'; for (let x = 10; x < w; x += 34) c.beginPath(), c.arc(x, h - 12, 2, 0, 7), c.fill();
      c.save(); c.translate(w * 0.2, h * 0.5); c.rotate(0.6); c.strokeStyle = '#4a4e58'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.stroke(); for (let k = -22; k < 24; k += 3) { c.beginPath(); c.moveTo(k, 0); c.lineTo(k - 4, -7); c.moveTo(k, 0); c.lineTo(k - 4, 7); c.stroke(); } c.restore();
      K.grain(c, w, h, 10);
    } });
    N.cyl(0.08, 0.08, 5.6, 0x7a8088, 0, -0.95, -1.42, 12, 0, 0, Math.PI / 2).box(5.4, 3.0, 0.9, 0x6a7078, 0, -2.5, -0.95);
    N.box(1.0, 1.9, 0.8, 0xa85a3c, 2.35, 0.16, -0.87).box(1.06, 0.08, 0.84, 0x8a4a30, 2.35, 1.1, -0.87);
    for (const [x, hh] of [[2.12, 0.34], [2.36, 0.28], [2.6, 0.34]]) N.cyl(0.08, 0.1, hh, 0xc8643a, x, 1.14 + hh / 2, -0.85, 10);
    for (let k = 0; k < 9; k++) N.box(1.0, 0.012, 0.01, 0x6a3a28, 2.35, -0.7 + k * 0.2, -1.275);
    N.cyl(0.015, 0.015, 2.2, 0x5a5e66, -2.2, 0.32, -0.9, 6).box(0.7, 0.015, 0.015, 0x5a5e66, -2.2, 1.2, -0.9, 0.4).box(0.6, 0.015, 0.015, 0x5a5e66, -2.2, 1.35, -0.9, 0.4).box(0.012, 0.012, 0.9, 0x5a5e66, -2.2, 1.0, -0.9, 0, 0.6);
    N.fim();
    const smoke = K.particles({ x0: 2.3, x1: 2.42, z0: -0.9, z1: -0.8, y0: 1.32, y1: 1.5, n: 10, cor: 0xb8b8c0, tam: 0.18, vel: 0.05, modo: 'paira', opacity: 0.25, parent: g });
  },
});
