// 03 · Casamento na Toscana: recepção de casamento no pátio de uma villa entre vinhedos do Chianti, na hora dourada.
// O sniper está numa torre de vigia medieval na colina do outro lado do vale. Multidão em linho e tons pastel:
// a noiva é a única de branco; o resto se distingue por chapéus, gravatas-borboleta e pelo que mexe no cenário.
MIRA_CENARIOS.push({
  id: 'toscana',
  nome: 'Casamento na Toscana',
  lugar: 'Villa entre vinhedos, Chianti, Toscana',
  hora: 'hora dourada, fim de tarde',
  resumo: 'Pérgola de glicínias sobre a mesa do banquete, bolo de cinco andares, arco de flores, adega de tonéis e uma carroça de feno. Ao fundo, ciprestes e uma torre medieval no morro.',
  sniper: { pos: [7, 17.6, 46.9], desc: 'torre de vigia medieval na colina do outro lado do vale' },
  niveis: [{ nome: 'pátio da villa', y: 0, x0: -14.5, x1: 14.5, z0: -10, z1: 10 }],
  convidados: 28,
  inicio: [0, 8.6, 0],
  // cores de luz e neblina em valores lineares (o motor não converte): sol dourado baixo, sombra azulada do céu, bruma lilás ao longe
  ambiente: {
    ceu: ['#5a7aa8', '#a9b2bc', '#f0c88a', '#ffb466', '#ffd8a0'], neblina: [0x937483, 60, 320], hemi: [0x4e67ad, 0x1a1105, 0.5],
    sol: [0xff863e, 2.0, -26, 11, 12], preenche: [0x3043a4, 0.35], exposicao: 0.85, bloom: 0.3,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [22, 0, 0] },
  guardaRoupa: {
    ternos: [[0xe8dcc0, 'terno de linho cru'], [0xa9c4da, 'terno azul-claro'], [0xc9b79c, 'terno bege'], [0x9aa58a, 'terno verde-sálvia'], [0x7d8ea0, 'terno cinza-azulado'], [0xd9c8a8, 'terno cor de areia']],
    vestidos: [[0xf0b0b8, 'vestido rosa-claro'], [0x9cc4e6, 'vestido azul-bebê'], [0xc8b0e6, 'vestido lavanda'], [0xf0cc68, 'vestido amarelo-manteiga'], [0xa8d4a0, 'vestido verde-menta'], [0xf2b89c, 'vestido pêssego'], [0xe0a0a8, 'vestido rosa-antigo'], [0xa8d8d0, 'vestido verde-água']],
    vestidoChance: 0.52, longo: 0.55, tacas: ['wine', 'wine', 'coupe'], drinks: [0x7a1020, 0xf2e2a0, 0xf6e7b0, 0x9a1830],
    extra(o, r) {
      const pastel = [0xf2c4c8, 0xb8d4ea, 0xd8c8ea, 0xf4e2a0, 0xc4e0c0, 0xe0a0a8];
      if (!o.dress) {
        if (r() < 0.38) { o.hat = 'boater'; o.hatColor = 0xe6d09a; o.hatBand = pastel[Math.floor(r() * 6)]; o.name += ', chapéu de palha'; }
        if (r() < 0.55) { o.bow = true; o.tie = [0xe0a0a8, 0xa9c4da, 0x9aa58a, 0xf4e2a0, 0x7a1020][Math.floor(r() * 5)]; o.name += ', gravata-borboleta'; }
        o.shirt = r() < 0.3 ? 0xdde8f2 : 0xf6f3ec; o.pocket = r() < 0.4 ? pastel[Math.floor(r() * 6)] : 0;
        if (r() < 0.12) { o.glasses = 'sun'; o.name += ', óculos escuros'; }
      } else {
        const k = r();
        if (k < 0.24) { o.hat = 'boater'; o.hatColor = 0xeedcae; o.hatBand = pastel[Math.floor(r() * 6)]; o.name += ', chapéu de palha'; }
        else if (k < 0.48) { o.hat = 'flower'; o.hatColor = pastel[Math.floor(r() * 6)]; o.name += ', flores no cabelo'; }
        if (r() < 0.16) { o.propL = 'fan'; o.propColor = [0xf6f3ec, 0xe0a0a8, 0xd8c8ea][Math.floor(r() * 3)]; o.clutch = false; o.name += ', leque'; }
        if (r() < 0.12) { o.scarf = pastel[Math.floor(r() * 6)]; o.name += ', echarpe'; }
      }
      // garçons do casamento, de avental de couro e bandeja (qualquer convidado pode ser sorteado, o agente também)
      if (!o.dress && r() < 0.1) { Object.assign(o, { main: 0x3a2a22, pants: 0x1b1b1f, shirt: 0xf6f3ec, tie: 0x5a1020, bow: true, apron: 0x6a4024, prop: 'tray', trayUp: true, glass: false, hat: false, pocket: 0, glasses: false }); o.name = 'garçom de colete marrom, avental de couro e bandeja' + (o.beard ? ', de barba' : ''); }
    },
  },
  elenco: [
    { x: 5.75, z: 3.35, rot: 0.35, anim: 10, fala: 'Se chover no casamento dá sorte. Hoje não precisa.', outfit: { dress: true, gown: true, satin: true, main: 0xfbf8f2, skin: 0, hair: 0x6b4a2b, hairStyle: 'bun', necklace: true, earring: true, accent: 0xe8e2d6, shoe: 0xf6f3ec, hat: 'veil', prop: 'bouquet', propColor: 0xf4a6b8, name: 'a noiva Giulia, de véu longo e buquê de peônias' } },
    { x: 6.5, z: 2.85, rot: -0.35, anim: 4, fala: 'A nonna jurou que eu nunca casaria. Olha ela chorando ali.', outfit: { dress: false, main: 0x8e9298, pants: 0x8e9298, shirt: 0xffffff, tie: 0xc9ced6, skin: 2, hair: 0x1a1411, hairStyle: 'quiff', pocket: 0xffffff, glass: 'wine', drink: 0x7a1020, name: 'o noivo Matteo, de terno cinza e flor branca na lapela' } },
    { x: 10.6, z: -7.55, rot: 0, anim: 0, fala: 'O que Deus uniu, o vinho não separa.', outfit: { dress: false, main: 0x141416, pants: 0x141416, shirt: 0x141416, tie: 0xf6f3ec, coat: 0x141416, scarf: 0xf2ece0, skin: 1, hair: 0xa9a9a9, hairStyle: 'short', glasses: 'round', prop: 'book', propColor: 0x8a1020, name: 'Don Alfonso, o padre, de batina preta e livro vermelho' } },
    { x: -4.75, z: 5.5, rot: 1.15, anim: 7, fala: 'No meu casamento, a festa durou três dias.', outfit: { dress: true, gown: true, main: 0x16161a, skin: 1, hair: 0xdedede, hairStyle: 'bun', necklace: true, earring: true, accent: 0xd9a441, glasses: 'round', propL: 'fan', propColor: 0x16161a, name: 'Nonna Assunta, toda de preto, com leque e óculos' } },
    { x: -8.8, z: -5.7, rot: 0.55, anim: 10, fala: 'Brunello de 1997. Deixe respirar antes de beber.', outfit: { dress: false, main: 0x3a2a22, pants: 0x1b1b1f, shirt: 0xf6f3ec, tie: 0x5a1020, bow: true, apron: 0x6a4024, skin: 3, hair: 0x1a1411, hairStyle: 'short', beard: true, prop: 'tray', name: 'Lorenzo, o sommelier, de avental de couro e bandeja' } },
    { x: -3.95, z: 3.6, rot: 1.45, anim: 10, fala: 'Mais uma tarantella e ninguém fica sentado!', outfit: { dress: false, main: 0x2f4a3a, pants: 0x3a3a30, shirt: 0xf6f3ec, tie: 0x8a1020, stripes: 0x8a1020, skin: 2, hair: 0xa9a9a9, hairStyle: 'short', beard: true, hat: 'beret', hatColor: 0x1b1b1f, scarf: 0xc8322f, name: 'Peppino, o acordeonista, de colete verde e boina' } },
    { x: 7.4, z: 0.75, rot: -0.45, anim: 0, fala: 'O bolo entra em seis minutos. Ninguém encosta no bolo.', outfit: { dress: true, gown: false, main: 0x2c3e5a, skin: 4, hair: 0x1a1411, hairStyle: 'bob', earring: true, accent: 0xc9ced6, prop: 'clipboard', propL: 'radio', name: 'Benedetta, a cerimonialista, de prancheta e rádio' } },
    { x: 3.4, z: 8.2, rot: 2.75, anim: 18, fala: 'Todo mundo dizendo “formaggio”!', outfit: { dress: false, main: 0x6b6e58, pants: 0x3a3a30, shirt: 0xe8e0cc, tie: 0x6b6e58, skin: 5, hair: 0x1a1411, glasses: 'round', hat: 'fedora', hatColor: 0xd8c08a, hatBand: 0x3a2a1a, prop: 'camera', name: 'Ettore, o fotógrafo do casamento, de colete e panamá' } },
  ],
  missoes: [
    { k: 'alianca', label: 'Trocar as alianças no altar', where: 'altar do arco de flores, à direita', s: [10.6, -6.0], l: [10.6, -6.8] },
    { k: 'fita', label: 'Cortar a fita do arco de flores', where: 'coluna esquerda do arco', s: [9.0, -6.5], l: [9.4, -7.4] },
    { k: 'pomba', label: 'Soltar a pomba da gaiola', where: 'gaiola branca ao lado do arco', s: [13.2, -6.3], l: [13.2, -7.3] },
    { k: 'safra', label: 'Trocar a garrafa da safra rara', where: 'adega, vitrine da safra de 1961', s: [-9.3, -7.4], l: [-9.3, -8.3] },
    { k: 'tonel', label: 'Abrir a torneira do tonel', where: 'adega, tonel grande', s: [-12.7, -7.2], l: [-12.7, -8.1] },
    { k: 'cartao', label: 'Trocar o cartão no mapa de mesas', where: 'cavalete na entrada da pérgola', s: [6.0, 0.0], l: [6.0, -0.9] },
    { k: 'bolo', label: 'Trocar o topo do bolo', where: 'mesa do bolo, ao lado da pista', s: [4.2, 2.9], l: [5.0, 2.0] },
    { k: 'catavento', label: 'Girar o cata-vento do poço', where: 'poço de pedra, à esquerda', s: [-8.2, 4.5], l: [-9.6, 3.6] },
    { k: 'carroca', label: 'Soltar o freio da carroça de feno', where: 'carroça, canto da frente à esquerda', s: [-10.2, 8.8], l: [-10.6, 7.8] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r;
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const sh = (hex, l) => { const n = parseInt(hex.slice(1), 16); return `rgb(${clamp((n >> 16) + l)},${clamp(((n >> 8) & 255) + l)},${clamp((n & 255) + l)})`; };
    const hs = (a, b) => { const t = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return t - Math.floor(t); };

    // ------------------------------------------------------------ materiais e texturas
    const stoneTex = (rep, base = '#d8ae72', mortar = '#b89870') => K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = mortar; g.fillRect(0, 0, w, h);
      let y = 0; while (y < h) { const ch = 22 + R() * 24; let x = -R() * 40; while (x < w) { const cw = 38 + R() * 70; g.fillStyle = sh(base, -16 + R() * 30); g.fillRect(x + 2, y + 2, cw - 4, ch - 4); g.fillStyle = 'rgba(255,240,210,.12)'; g.fillRect(x + 3, y + 3, cw - 8, 3); x += cw; } y += ch; }
      for (let k = 0; k < 300; k++) { g.fillStyle = `rgba(90,70,40,${R() * 0.1})`; g.fillRect(R() * w, R() * h, 2 + R() * 6, 2 + R() * 6); }
      K.grain(g, w, h, 16);
    }, rep);
    const honey = K.texMat(stoneTex([6, 2.2]), { roughness: 0.92 });
    const honeyS = K.texMat(stoneTex([1.5, 1]), { roughness: 0.92 });
    const honeyD = K.texMat(stoneTex([3, 1], '#b8905c', '#8a7050'), { roughness: 0.95 });
    const travert = K.mat(0xe6d6b8, { roughness: 0.8 }), travertD = K.mat(0xcbb898, { roughness: 0.85 });
    const chestnut = K.mat(0x6a4428, { roughness: 0.75 }), oakDark = K.mat(0x4a3020, { roughness: 0.7 }), oakL = K.mat(0x9a7448, { roughness: 0.65 });
    const terra = K.mat(0xb8643c, { roughness: 0.85 }), straw = K.mat(0xd2ac5c, { roughness: 0.95 }), hay = K.mat(0xd9b860, { roughness: 1 });
    const shutterTex = K.canvasTex(64, 128, (g, w, h) => { g.fillStyle = '#4e6e4a'; g.fillRect(0, 0, w, h); for (let y = 6; y < h - 4; y += 7) { g.fillStyle = 'rgba(20,40,20,.45)'; g.fillRect(4, y, w - 8, 2); g.fillStyle = 'rgba(200,230,190,.15)'; g.fillRect(4, y + 2, w - 8, 1); } g.strokeStyle = '#3a5636'; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, h - 4); K.grain(g, w, h, 12); });
    const shutterM = K.texMat(shutterTex, { roughness: 0.7 });
    const winLit = K.mat(0x3a2a1a, { emissive: 0xffb060, emissiveIntensity: 0.55, roughness: 0.2 }), winDark = K.mat(0x2a2622, { roughness: 0.15, metalness: 0.3 });
    const white = K.mat(0xf6f3ec, { roughness: 0.6 }), linen = M.linen;
    const fl = { pink: K.mat(0xf4a6b8, { roughness: 0.8 }), blush: K.mat(0xf8d2cc, { roughness: 0.8 }), white: K.mat(0xfbf8f0, { roughness: 0.8 }), cream: K.mat(0xf3e2b8, { roughness: 0.8 }), green: K.mat(0x5a7a44, { roughness: 0.85 }), sage: K.mat(0x8a9a72, { roughness: 0.85 }) };
    const wineM = K.mat(0x5a0814, { roughness: 0.08, metalness: 0.1, emissive: 0x3a0008, emissiveIntensity: 0.3 });

    // ------------------------------------------------------------ chão do pátio: cascalho, lajes de travertino, piso de cotto
    const gravelTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#b39870'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 9000; k++) { const v = R(); g.fillStyle = v < 0.3 ? `rgba(222,204,170,${0.5 + R() * 0.5})` : v < 0.6 ? `rgba(150,128,96,${0.4 + R() * 0.5})` : v < 0.8 ? `rgba(206,186,150,.8)` : `rgba(120,104,84,.6)`; const s = 1 + R() * 3.2; g.beginPath(); g.ellipse(R() * w, R() * h, s, s * (0.6 + R() * 0.5), R() * 3, 0, 7); g.fill(); }
      K.grain(g, w, h, 14);
    }, [10, 7]);
    K.floor(-14.7, -10.6, 14.7, 10.6, gravelTex, { m: { roughness: 0.97 } });
    const paverTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#9a8a70'; g.fillRect(0, 0, w, h);
      for (let j = 0; j < 8; j++) { let x = (j % 2) * -40; while (x < w) { const cw = 60 + R() * 50; g.fillStyle = sh('#ddc9a6', -14 + R() * 22); g.fillRect(x + 2, j * 64 + 2, cw - 4, 60); for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(150,120,90,.25)'; g.fillRect(x + R() * cw, j * 64 + R() * 60, 6 + R() * 10, 1.5); } x += cw; } }
      K.grain(g, w, h, 14);
    }, [5, 3]);
    K.floor(-7.4, -10.6, 5.2, -0.6, paverTex, { y: 0.006, m: { roughness: 0.85 } });
    // caminho de lajes que liga a frente ao centro
    for (let k = 0; k < 9; k++) K.box(0.9 + R() * 0.3, 0.02, 0.6 + R() * 0.2, k % 2 ? travert : travertD, -5.4 + (R() - 0.5) * 0.3, 0.01, 0.0 + k * 1.05, { cast: false, ry: (R() - 0.5) * 0.3 });
    const cottoTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7a4a30'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = sh('#b0623a', -18 + R() * 26); g.fillRect(i * 32 + 1.5, j * 32 + 1.5, 29, 29); } K.grain(g, w, h, 16); }, [4, 2]);
    K.floor(-14.6, -10.6, -7.4, -6.5, cottoTex, { y: 0.01, m: { roughness: 0.8 } });

    // ------------------------------------------------------------ terreno: vale de vinhedos na frente, colinas onduladas, ciprestes
    const H = (x, z) => {
      const ax = Math.abs(x);
      if (ax < 15.4 && z > -11 && z < 10.8) return -0.06;
      let h = 0;
      if (z > 10.6) { const u = Math.min(1, (z - 10.6) / 7); h -= 5.5 * u * u * (3 - 2 * u); }
      h += 12.5 * Math.exp(-((x - 7) ** 2 / 600 + (z - 52) ** 2 / 110));
      if (ax > 24) { const v = Math.min(1, (ax - 24) / 30); h += v * 9 + Math.sin(z * 0.07 + x * 0.04) * 1.8 * v + Math.sin(z * 0.13 - x * 0.09) * 0.9 * v; }
      if (z < -20) { const v = Math.min(1, (-z - 20) / 40); h += v * 15 + Math.sin(x * 0.06) * 2.5 * v + Math.sin(x * 0.17 + 1) * 0.8 * v; }
      if (z > 30) h += Math.sin(x * 0.05 + 2) * 1.5 * Math.min(1, (z - 30) / 20);
      return h;
    };
    { const geo = new T.PlaneGeometry(340, 320, 170, 160); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -20);
      const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new T.Color();
      const pal = ['#7d8a3e', '#a69a4c', '#c9a659', '#6c7a38', '#8e8a4a', '#b8935a', '#94a050', '#c2b070'];
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i), y = H(x, z); p.setY(i, y); const ax = Math.abs(x);
        let hex;
        if ((ax > 15 && ax < 26 && z < 11 && z > -12)) hex = '#8a8048';
        else if (z > 11 && z < 42 && Math.abs(x - 7) > 6) hex = '#7f7a44';
        else hex = pal[Math.floor(hs(Math.floor((x + 400) / 17), Math.floor((z + 400) / 13)) * pal.length)];
        // a paleta foi pensada como cor de tela: converte para linear (sem isso as colinas saíam cor de palha)
        c.set(hex).convertSRGBToLinear(); const n = (hs(x * 0.7, z * 0.7) - 0.5) * 0.04; c.r += n; c.g += n; c.b += n * 0.6;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals();
      K.add(geo, K.vcol({ roughness: 0.97, envMapIntensity: 0.2 }), 0, 0, 0, { cast: false });
    }
    // muro de arrimo na frente (o pátio fica num terraço sobre o vale)
    K.box(52, 6, 0.6, honeyD, 0, -3, 10.95, { cast: false });
    // estrada branca de terra que desce o vale até a torre
    const road = [[-15.6, 10.9], [-12, 16], [-4, 22], [4, 27], [9, 33], [8, 40], [7, 46]];
    const roadD = (x, z) => { let d = 1e9; for (let i = 0; i < road.length - 1; i++) { const [ax, az] = road[i], [bx, bz] = road[i + 1], vx = bx - ax, vz = bz - az; const u = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz))); d = Math.min(d, Math.hypot(x - ax - vx * u, z - az - vz * u)); } return d; };
    { const roadM = K.mat(0xd2bf98, { roughness: 1 }), pts = [];
      for (let i = 0; i < road.length - 1; i++) { const [ax, az] = road[i], [bx, bz] = road[i + 1], L = Math.hypot(bx - ax, bz - az), n = Math.ceil(L / 0.8); for (let k = 0; k < n; k++) { const u = k / n; pts.push([ax + (bx - ax) * u, az + (bz - az) * u]); } }
      pts.push(road[road.length - 1]);
      const pos = [], idx = [];
      pts.forEach((p, i) => { const q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)], dx = q[0] - o[0], dz = q[1] - o[1], L = Math.hypot(dx, dz) || 1, nx = dz / L * 1.25, nz = -dx / L * 1.25; for (const s of [-1, 1]) { const x = p[0] + nx * s, z = p[1] + nz * s; pos.push(x, H(x, z) + 0.07, z); } if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
      const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); rg.setIndex(idx); rg.computeVertexNormals();
      K.add(rg, K.mat(0xd2bf98, { roughness: 1, side: T.DoubleSide }), 0, 0, 0, { cast: false });
      const cyp = []; for (let i = 1; i < road.length - 1; i++) for (const s of [-1, 1]) { const [ax, az] = road[i], [bx, bz] = road[i + 1]; for (let u = 0.15; u < 1; u += 0.35) { const x = ax + (bx - ax) * u, z = az + (bz - az) * u, L = Math.hypot(bx - ax, bz - az); const nx = (bz - az) / L * s * 2.4, nz = -(bx - ax) / L * s * 2.4; cyp.push([x + nx, H(x + nx, z + nz) - 0.2, z + nz, 0, 0.55 + R() * 0.15]); } }
      K.inst(new T.SphereGeometry(1, 10, 10).scale(0.85, 4.2, 0.85).translate(0, 4.0, 0), K.mat(0x2a4024, { roughness: 0.9 }), cyp, { cast: false });
    }
    // vinhas: fileiras nas laterais (perto, com uvas) e descendo o vale (longe)
    { const folA = [], folB = [], posts = [], grapes = [];
      const row = (x, z0, z1, step, near) => { for (let z = z0; z <= z1; z += step) { if (!near && roadD(x, z) < 2.4) continue; const y = H(x, z); (R() < 0.5 ? folA : folB).push([x, y, z, 0, [0.85 + R() * 0.3, 0.85 + R() * 0.3, 1]]); if (near && R() < 0.85) for (let k = 0; k < 3; k++) grapes.push([x + (R() < 0.5 ? -1 : 1) * 0.27, y + 0.55 + R() * 0.15, z + (R() - 0.5) * 1.0, R() * 6, 0.8 + R() * 0.5]); } posts.push([x, H(x, z0 - 0.7), z0 - 0.7]); posts.push([x, H(x, z1 + 0.7), z1 + 0.7]); };
      for (let x = 16.2; x <= 24.5; x += 1.8) { row(x, -9.6, 10.2, 1.25, true); row(-x, -6.0, 10.2, 1.25, true); }
      for (let x = -70; x <= 70; x += 2.0) row(x, 13, x > -2 && x < 16 ? 40 : 46, 1.15, false);
      for (let x = 27; x <= 66; x += 2.4) { row(x, -34, 9, 1.3, false); row(-x, -34, 9, 1.3, false); }
      const vg = new T.BoxGeometry(0.55, 0.9, 1.15).translate(0, 0.78, 0);
      const fa = folA.filter(f => Math.abs(f[0]) < 26 && f[2] < 11), fb = folB.filter(f => Math.abs(f[0]) < 26 && f[2] < 11), fA = folA.filter(f => !fa.includes(f)), fB = folB.filter(f => !fb.includes(f));
      const vmA = K.mat(0x3e5c26, { roughness: 0.9 }), vmB = K.mat(0x58762e, { roughness: 0.9 });
      K.inst(vg, vmA, fa); K.inst(vg, vmB, fb); K.inst(vg, vmA, fA, { cast: false }); K.inst(vg, vmB, fB, { cast: false });
      K.inst(new T.CylinderGeometry(0.04, 0.05, 1.5, 5).translate(0, 0.75, 0), oakDark, posts, { cast: false });
      K.inst(new T.ConeGeometry(0.07, 0.17, 6).rotateX(Math.PI), K.mat(0x4a1e4e, { roughness: 0.4 }), grapes, { cast: false });
      // arames das fileiras próximas
      for (let x = 16.2; x <= 24.5; x += 1.8) for (const s of [-1, 1]) { const w = K.box(0.012, 0.012, 20.6, K.iron, s * x, 1.25, s > 0 ? 0.3 : 2.1, { cast: false }); if (s < 0) w.scale.z = 16.8 / 20.6; }
    }
    // ciprestes (fileiras em estradas, perto de casas e no morro)
    { const list = [];
      const line = (x0, z0, x1, z1, n, s0 = 1) => { for (let k = 0; k <= n; k++) { const u = k / n, x = x0 + (x1 - x0) * u, z = z0 + (z1 - z0) * u; list.push([x, H(x, z) - 0.3, z, R() * 6, s0 * (0.85 + R() * 0.3)]); } };
      line(-30, -6, -78, 40, 16); line(34, -34, 34, 18, 12); line(-26, -26, 30, -26, 16, 1.1); line(-14, 44, -40, 60, 7); line(18, 40, 40, 56, 6);
      for (let k = 0; k < 8; k++) { const a = k * 0.8; list.push([7 + Math.cos(a) * 7.5, H(7 + Math.cos(a) * 7.5, 50 + Math.sin(a) * 5) - 0.3, 50 + Math.sin(a) * 5, 0, 0.8 + R() * 0.3]); }
      for (let k = 0; k < 6; k++) list.push([-40 - k * 3.5, H(-40 - k * 3.5, -36) - 0.3, -36 + (k % 2), 0, 1]);
      K.inst(new T.SphereGeometry(1, 10, 10).scale(0.85, 4.2, 0.85).translate(0, 4.0, 0), K.mat(0x2e4428, { roughness: 0.9 }), list, { cast: false });
      // oliveiras soltas nas colinas
      const ol = [], tr = [];
      for (let k = 0; k < 220; k++) { const x = (R() < 0.5 ? -1 : 1) * (28 + R() * 60), z = -60 + R() * 70; const y = H(x, z); ol.push([x, y + 1.9, z, R() * 6, 0.9 + R() * 0.6]); tr.push([x, y, z, 0, 1]); }
      for (let k = 0; k < 60; k++) { const x = -30 + R() * 60, z = -30 - R() * 30; const y = H(x, z); ol.push([x, y + 1.9, z, R() * 6, 0.9 + R() * 0.6]); tr.push([x, y, z, 0, 1]); }
      K.inst(new T.SphereGeometry(1.3, 8, 6).scale(1.2, 0.75, 1.1), K.mat(new T.Color(0x8a9a6a).convertSRGBToLinear().getHex(), { roughness: 0.95 }), ol, { cast: false });
      K.inst(new T.CylinderGeometry(0.12, 0.2, 1.6, 5).translate(0, 0.8, 0), oakDark, tr, { cast: false });
    }
    // casa de fazenda e borgo medieval com torre ao longe
    const house = (x, z, w, d, hh, c, ry = 0, roofC = 0xa85a3a) => { const y = H(x, z) - 0.5; const g = K.group(x, y, z, ry); K.box(w, hh, d, K.mat(c, { roughness: 0.95 }), 0, hh / 2, 0, { parent: g, cast: false }); const r = K.add(new T.ConeGeometry(Math.hypot(w, d) / 2 * 1.02, 1.6, 4), K.mat(roofC, { roughness: 0.9 }), 0, hh + 0.8, 0, { parent: g, cast: false, ry: Math.PI / 4 }); r.scale.set(w / Math.hypot(w, d) * 1.45, 1, d / Math.hypot(w, d) * 1.45); return g; };
    [[-52, -44, 6, 5, 6, 0xd8b884], [-46, -48, 5, 6, 7, 0xc9a070], [-58, -38, 7, 5, 5, 0xe0c494], [-40, -44, 5, 5, 8, 0xd0a878], [-56, -50, 6, 6, 6, 0xc49a6a], [-44, -38, 4, 6, 5, 0xdcbc8c], [-62, -45, 5, 5, 7, 0xd0ac7c], [-50, -54, 6, 4, 6, 0xc8a070]].forEach(([x, z, w, d, hh, c], k) => house(x, z, w, d, hh, c, k * 0.3));
    { const x = -48, z = -44, y = H(x, z) - 0.5; K.box(4, 26, 4, K.mat(0xc8a878, { roughness: 0.95 }), x, y + 13, z, { cast: false }); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; K.box(0.7, 1.0, 0.7, K.mat(0xc8a878), x + Math.round(Math.cos(a)) * 1.7, y + 26.5, z + Math.round(Math.sin(a)) * 1.7, { cast: false }); } K.box(0.8, 1.6, 0.1, K.mat(0x1a1410), x, y + 22, z + 2.02, { cast: false }); }
    { const x = -36, z = -50, y = H(x, z) - 0.5; K.box(3, 18, 3, K.mat(0xd8b88a), x, y + 9, z, { cast: false }); K.cone(2.4, 3, K.mat(0xa85a3a), x, y + 19.5, z, { cast: false }, 4).rotation.y = Math.PI / 4; }
    house(48, -12, 10, 7, 6, 0xdcbc8c, 0.2); house(54, -6, 6, 6, 9, 0xd0aa78, 0.2); house(-60, 20, 9, 6, 6, 0xe0c494, -0.4); house(60, 30, 8, 6, 5, 0xd8b884, 0.6);
    // o sol baixo e o calor do horizonte
    K.halo(-150, 26, -10, 26, 0xffb050, 1.1); K.halo(-150, 26, -10, 7, 0xfff0c0, 2.0);

    // ------------------------------------------------------------ torre de vigia medieval (sniper) no morro em frente
    { const x = 7, z = 49.6, base = H(7, 49.6), g = K.group(x, base, z);
      const tw = K.texMat(stoneTex([2, 6], '#c4a070', '#8a7454'), { roughness: 0.95 });
      K.box(4.4, 15.5 + 3, 4.4, tw, 0, (15.5 + 3) / 2 - 3, 0, { parent: g, cast: false });
      K.box(4.9, 0.5, 4.9, tw, 0, 15.7, 0, { parent: g, cast: false });
      K.box(4.4, 2.0, 4.4, tw, 0, 16.9 + 0.3, 0, { parent: g, cast: false });
      for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { K.box(0.55, 0.8, 0.5, tw, -1.95 + i * 0.975, 18.7, s * 2.2, { parent: g, cast: false }); K.box(0.5, 0.8, 0.55, tw, s * 2.2, 18.7, -1.95 + i * 0.975, { parent: g, cast: false }); }
      // janela do atirador + sacada de madeira mais baixa que a linha de visada
      K.box(1.3, 1.6, 0.1, K.mat(0x0c0a08), 0, 17.6 - base, -2.22, { parent: g, cast: false });
      K.box(1.8, 0.12, 1.0, oakDark, 0, 16.3 - base + 0, -2.7, { parent: g, cast: false });
      for (const s of [-1, 1]) K.box(0.08, 0.5, 0.08, oakDark, s * 0.85, 16.6 - base, -3.15, { parent: g, cast: false });
      K.box(1.8, 0.06, 0.06, oakDark, 0, 16.85 - base, -3.15, { parent: g, cast: false });
      for (const yy of [6, 10.5]) K.box(0.5, 0.9, 0.1, K.mat(0x14100c), 0, yy, -2.22, { parent: g, cast: false });
      K.cyl(0.04, 0.04, 3.4, K.iron, 1.6, 20.3, 1.6, { parent: g, cast: false }, 5);
      const flagTex = K.canvasTex(128, 64, (gg, w, h) => { gg.fillStyle = '#f2ece0'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#b01e2a'; gg.fillRect(0, 0, w, h / 2); });
      const flag = K.add(new T.PlaneGeometry(1.6, 0.8, 8, 1).translate(0.8, 0, 0), K.texMat(flagTex, { side: T.DoubleSide }), 1.6, 21.5, 1.6, { parent: g, cast: false });
      const fp = flag.geometry.attributes.position, fx0 = Array.from({ length: fp.count }, (_, i) => fp.getX(i));
      K.tick((dt, t) => { for (let i = 0; i < fp.count; i++) fp.setZ(i, Math.sin(t * 4 + fx0[i] * 4) * 0.12 * fx0[i]); fp.needsUpdate = true; });
      K.halo(x, 17.5, 46.95, 0.3, 0xff4134, 1.0);
    }

    // ------------------------------------------------------------ a villa: fachada de pedra cor de mel, persianas verdes, telhado de telha
    const zF = -10.6;
    K.box(34, 9.4, 8.4, honey, 0, 4.7, -14.8, { cast: false });
    K.box(34.2, 0.9, 0.12, honeyD, 0, 0.45, zF + 0.04, { cast: false }); // rodapé
    K.box(34.4, 0.22, 0.3, travert, 0, 3.75, zF + 0.1, { cast: false }); // friso entre andares
    K.box(34.6, 0.35, 0.55, travert, 0, 9.3, zF + 0.2, { cast: false }); // cornija
    for (const x of [-17, 17]) for (let k = 0; k < 12; k++) K.box(0.62 + (k % 2) * 0.3, 0.42, 0.62 + (k % 2) * 0.3, travertD, x + (x < 0 ? 0.2 : -0.2), 0.4 + k * 0.78, zF - 0.2, { cast: false });
    // telhado
    { const tileTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7a3a22'; g.fillRect(0, 0, w, h); for (let j = 0; j < 8; j++) for (let i = 0; i < 16; i++) { const x = i * 16 + (j % 2) * 8, y = j * 32, c = sh('#b8603a', -22 + R() * 30); const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, 'rgba(60,20,10,.9)'); gr.addColorStop(0.5, c); gr.addColorStop(1, 'rgba(60,20,10,.9)'); g.fillStyle = gr; g.fillRect(x, y, 16, 30); g.fillStyle = 'rgba(30,10,5,.5)'; g.fillRect(x, y + 28, 16, 4); } K.grain(g, w, h, 12); }, [22, 4]);
      const roofM = K.texMat(tileTex, { roughness: 0.85 });
      const a = Math.atan(3.04 / 4.6), L = Math.hypot(4.6, 3.04);
      K.box(35, 0.18, L, roofM, 0, 10.68, -12.5, { rx: a, cast: false });
      K.box(35, 0.18, L, roofM, 0, 10.68, -17.1, { rx: -a, cast: false });
      K.cyl(0.18, 0.18, 35, terra, 0, 12.25, -14.8, { rz: Math.PI / 2, cast: false }, 8);
      for (const s of [-1, 1]) { const shp = new T.Shape(); shp.moveTo(-4.2, 0); shp.lineTo(4.2, 0); shp.lineTo(0, 2.8); shp.lineTo(-4.2, 0); const gg = new T.ExtrudeGeometry(shp, { depth: 0.3, bevelEnabled: false }); gg.rotateY(Math.PI / 2); K.add(gg, honeyS, s * 16.85 - 0.15, 9.4, -14.8, { cast: false }); }
      for (const [x, z] of [[-6.5, -13.6], [7.5, -16.2]]) { K.box(0.9, 1.9, 0.9, honeyS, x, 12.0, z); K.box(1.1, 0.12, 1.1, terra, x, 13.0, z); for (const s of [-1, 1]) K.box(0.3, 0.25, 0.9, terra, x + s * 0.3, 13.2, z, { rz: s * 0.5 }); }
      // fumaça da chaminé
      const smoke = []; for (let k = 0; k < 7; k++) smoke.push(K.halo(-6.5, 13.4, -13.6, 0.5, 0xcfc4b8, 0.35));
      K.tick((dt, t) => smoke.forEach((s, k) => { const u = ((t * 0.12 + k / 7) % 1); s.position.set(-6.5 + u * 2.4 + Math.sin(t + k) * 0.2, 13.4 + u * 5, -13.6 + u * 0.8); s.scale.setScalar(0.6 + u * 2.4); s.material.opacity = (1 - u) * 0.6; }));
    }
    // pombal (torre da villa) atrás da adega
    { const x = -11.6, z = -14.2; K.box(3.6, 14.6, 3.6, honey, x, 7.3, z, { cast: false }); K.box(3.9, 0.25, 3.9, travert, x, 12.2, z, { cast: false });
      for (const dx of [-0.9, 0, 0.9]) { K.box(0.5, 0.9, 0.06, K.mat(0x1a1410), x + dx, 13.2, z + 1.82, { cast: false }); K.box(0.6, 0.06, 0.2, travert, x + dx, 12.72, z + 1.9, { cast: false }); }
      K.cone(3.0, 2.2, K.mat(0xa85a3a, { roughness: 0.85 }), x, 15.7, z, { cast: false }, 4).rotation.y = Math.PI / 4;
      K.cyl(0.03, 0.03, 1.4, K.iron, x, 17.4, z, { cast: false }, 5); K.sphere(0.12, K.gold, x, 17.9, z, { cast: false });
      // pombos no parapeito
      for (let k = 0; k < 4; k++) { K.add(new T.SphereGeometry(0.1, 8, 6).scale(1.5, 1, 1), K.mat(0xb0b4bc), x - 1.2 + k * 0.75, 12.42, z + 1.95, { cast: false, ry: R() * 3 }); K.sphere(0.05, K.mat(0x8a8e98), x - 1.07 + k * 0.75, 12.52, z + 1.95, { cast: false }, 6, 4); }
    }
    // janelas com persianas abertas
    const windowAt = (x, y, w, h, lit, open = 1) => {
      K.box(w, h, 0.05, lit ? winLit : winDark, x, y, zF + 0.02, { cast: false });
      K.box(w + 0.3, 0.14, 0.3, travert, x, y - h / 2 - 0.07, zF + 0.14);
      K.box(w + 0.3, 0.18, 0.12, travert, x, y + h / 2 + 0.09, zF + 0.06, { cast: false });
      for (const s of [-1, 1]) { K.box(0.12, h, 0.1, travert, x + s * (w / 2 + 0.06), y, zF + 0.05, { cast: false }); const hg = K.group(x + s * (w / 2 + 0.12), y, zF + 0.1, s * (Math.PI - 0.22) * open + (1 - open) * s * 0.5); K.box(w / 2, h, 0.05, shutterM, -s * w / 4, 0, 0, { parent: hg }); }
      K.box(0.03, h, 0.04, K.mat(0x3a2a1a), x, y, zF + 0.05, { cast: false }); K.box(w, 0.03, 0.04, K.mat(0x3a2a1a), x, y + h * 0.15, zF + 0.05, { cast: false });
    };
    const geran = [], geranL = [];
    [-15, -12, -9, -6, -3, 3, 6, 9, 12, 15].forEach((x, k) => {
      if (x > -8) windowAt(x, 1.95, 1.0, 1.8, k % 3 !== 1);
      windowAt(x, 5.6, 1.0, 1.75, (k * 7) % 3 !== 0, k === 2 ? 0.4 : 1);
      windowAt(x, 8.05, 0.6, 0.6, k % 4 === 0, 0);
      // floreira de gerânios
      K.box(1.1, 0.2, 0.26, terra, x, 4.62, zF + 0.2);
      for (let i = 0; i < 7; i++) { geran.push([x - 0.45 + i * 0.15, 4.8 + R() * 0.06, zF + 0.2 + (R() - 0.5) * 0.12, 0, 0.8 + R() * 0.5]); geranL.push([x - 0.45 + i * 0.15, 4.74, zF + 0.24, R() * 6, 1]); }
    });
    K.inst(new T.SphereGeometry(0.06, 6, 5), K.mat(0xd8283a, { roughness: 0.7 }), geran, { cast: false });
    K.inst(new T.SphereGeometry(0.08, 6, 4).scale(1, 0.6, 1), fl.green, geranL, { cast: false });
    // portal de entrada com guirlanda de casamento e sacada
    { K.box(2.6, 3.4, 0.3, travert, 0, 1.7, zF + 0.1); K.box(1.9, 2.9, 0.1, oakDark, 0, 1.45, zF + 0.26, { cast: false });
      for (const s of [-1, 1]) { K.box(0.9, 2.8, 0.06, chestnut, s * 0.47, 1.42, zF + 0.32, { cast: false }); for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) K.sphere(0.025, K.iron, s * (0.25 + j * 0.45), 0.5 + k * 0.6, zF + 0.36, { cast: false }, 5, 4); K.torus(0.07, 0.012, K.brass, s * 0.12, 1.3, zF + 0.37, { cast: false }); }
      for (let k = 0; k < 3; k++) K.box(3.2 + k * 0.5, 0.15, 0.4, travertD, 0, 0.075 + k * 0.0, zF + 0.45 + k * 0.4, { cast: false });
      K.col(-1.6, -10, 1.6, -9.75);
      // guirlanda de oliveira e flores brancas no arco do portal
      const gl = [], gw = [];
      for (let k = 0; k <= 30; k++) { const u = k / 30, a = Math.PI * u; const x = -Math.cos(a) * 1.35, y = 2.9 + Math.sin(a) * 0.55 - (k === 0 || k === 30 ? 0 : 0); gl.push([x, y, zF + 0.32, R() * 6, 0.9 + R() * 0.4]); if (k % 2) gw.push([x + (R() - 0.5) * 0.1, y + (R() - 0.5) * 0.1, zF + 0.42, 0, 0.9 + R() * 0.5]); }
      for (const s of [-1, 1]) for (let k = 0; k < 12; k++) { gl.push([s * (1.35 + (R() - 0.5) * 0.1), 2.85 - k * 0.2, zF + 0.32, R() * 6, 0.7 + R() * 0.3]); if (k % 3 === 0) gw.push([s * 1.38, 2.8 - k * 0.2, zF + 0.42, 0, 0.9]); }
      K.inst(new T.SphereGeometry(0.13, 7, 5).scale(1.3, 0.8, 0.8), K.mat(0x6a8450, { roughness: 0.9 }), gl, { cast: false });
      K.inst(new T.SphereGeometry(0.075, 7, 5), fl.white, gw, { cast: false });
      // sacada do primeiro andar
      K.box(3.4, 0.2, 1.1, travert, 0, 4.0, zF + 0.55); const rl = []; for (let x = -1.6; x <= 1.6; x += 0.14) rl.push([x, 4.1, zF + 1.05]);
      K.inst(new T.CylinderGeometry(0.012, 0.012, 0.85, 4).translate(0, 0.42, 0), K.iron, rl, { cast: false }); K.box(3.3, 0.05, 0.05, K.iron, 0, 4.95, zF + 1.05, { cast: false });
      K.box(1.1, 2.2, 0.05, winLit, 0, 5.2, zF + 0.02, { cast: false });
      // lençol de linho pendurado com as iniciais
      const ban = K.canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#f6f1e6'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9a44a'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = '#6a8450'; g.font = 'italic 700 110px Georgia, serif'; g.textAlign = 'center'; g.fillText('G', 80, 170); g.fillText('M', 180, 220); g.font = '700 60px Georgia'; g.fillStyle = '#c9a44a'; g.fillText('&', 128, 190); g.font = '28px Georgia'; g.fillStyle = '#6a8450'; g.fillText('X · X · MMXXVI', 128, 290); });
      K.add(new T.PlaneGeometry(1.5, 1.9), K.texMat(ban, { side: T.DoubleSide }), 0, 4.0, zF + 1.1, { cast: false });
    }
    // lanternas de ferro na fachada
    for (const x of [-4.5, 4.5, 10.5, 13.5]) { K.box(0.06, 0.06, 0.4, K.iron, x, 3.1, zF + 0.2); K.box(0.2, 0.3, 0.2, K.glow(0xffc070, 1.6), x, 2.9, zF + 0.4, { cast: false }); K.cone(0.17, 0.14, K.iron, x, 3.12, zF + 0.4, {}, 4).rotation.y = Math.PI / 4; K.halo(x, 2.9, zF + 0.45, 0.5, 0xffb060, 0.5); }
    // buganvília subindo pela fachada à direita
    { const bl = [], bg = []; for (let k = 0; k < 260; k++) { const x = 6.8 + R() * 8, y = R() * 4.4 * (1 - Math.abs(x - 10.5) / 6) + 0.2; (R() < 0.6 ? bl : bg).push([x, y, zF + 0.12 + R() * 0.2, R() * 6, 0.7 + R() * 0.7]); }
      K.inst(new T.SphereGeometry(0.11, 6, 5), K.mat(0xc8287a, { roughness: 0.8 }), bl, { cast: false }); K.inst(new T.SphereGeometry(0.12, 6, 5), K.mat(0x4f6e32, { roughness: 0.85 }), bg, { cast: false }); }

    // ------------------------------------------------------------ adega (cantina) com arcos, barris e o tonel
    { // parede em arcos
      const shp = new T.Shape(); shp.moveTo(-3.6, 0); shp.lineTo(3.6, 0); shp.lineTo(3.6, 3.3); shp.lineTo(-3.6, 3.3); shp.lineTo(-3.6, 0);
      for (const cx of [-1.7, 1.7]) { const hp = new T.Path(), hw = 1.45; hp.moveTo(cx - hw, 0); hp.lineTo(cx + hw, 0); hp.lineTo(cx + hw, 2.1); hp.quadraticCurveTo(cx + hw, 2.85, cx, 2.95); hp.quadraticCurveTo(cx - hw, 2.85, cx - hw, 2.1); hp.lineTo(cx - hw, 0); shp.holes.push(hp); }
      const ag = new T.ExtrudeGeometry(shp, { depth: 0.45, bevelEnabled: false }); ag.translate(-11.0, 0, -6.95);
      const arcM = K.texMat(stoneTex([0.5, 0.5], '#d0a46a', '#a08860'), { roughness: 0.92 }); arcM.map.repeat.set(0.45, 0.45);
      K.add(ag, arcM);
      K.col(-14.7, -6.95, -14.15, -6.5); K.col(-11.25, -6.95, -10.75, -6.5); K.col(-7.85, -6.95, -7.2, -6.5);
      for (const cx of [-12.7, -9.3]) K.box(0.5, 0.36, 0.5, travert, cx, 3.0, -6.48, { cast: false }); // chave do arco
      // parede lateral direita e esquerda
      K.box(0.4, 3.5, 3.9, honeyS, -7.4, 1.75, -8.6); K.col(-7.6, -10, -7.2, -6.5);
      K.box(0.4, 3.4, 4.2, honeyS, -14.75, 1.7, -8.6);
      // telhado inclinado e caibros
      const tileTex2 = K.canvasTex(128, 128, (g, w, h) => { for (let j = 0; j < 4; j++) for (let i = 0; i < 8; i++) { const x = i * 16 + (j % 2) * 8; const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, '#5a2a18'); gr.addColorStop(0.5, sh('#b8603a', -20 + R() * 30)); gr.addColorStop(1, '#5a2a18'); g.fillStyle = gr; g.fillRect(x, j * 32, 16, 30); } }, [8, 2]);
      K.box(7.9, 0.16, 4.5, K.texMat(tileTex2, { roughness: 0.85 }), -11.0, 3.72, -8.55, { rx: 0.245 });
      for (let k = 0; k < 7; k++) K.box(0.12, 0.14, 4.3, chestnut, -14.3 + k * 1.1, 3.55, -8.55, { rx: 0.245, cast: false });
      // prateleiras de garrafas na parede esquerda
      K.box(0.5, 2.3, 3.1, oakDark, -14.35, 1.15, -8.5);
      { const ends = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 14; j++) ends.push([-14.08, 0.2 + i * 0.24, -9.85 + j * 0.2, 0, 1, 0, Math.PI / 2]); K.inst(new T.CylinderGeometry(0.04, 0.04, 0.1, 8), K.mat(0x1e3a1e, { roughness: 0.15, metalness: 0.2 }), ends, { cast: false }); }
      K.col(-14.7, -10, -14.1, -6.95);
      // fileira de barris deitados no fundo (dois andares)
      const barrelGeo = new T.LatheGeometry([[0, -0.36], [0.3, -0.36], [0.355, -0.18], [0.37, 0], [0.355, 0.18], [0.3, 0.36], [0, 0.36]].map(p => new T.Vector2(p[0], p[1])), 14);
      const bList = [], hoops = [];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const x = -10.75 + i * 0.78 + j * 0.39, y = 0.42 + j * 0.68, z = -9.55; if (j && i === 3) continue; bList.push([x, y, z, 0, 1, Math.PI / 2]); for (const dz of [-0.28, -0.12, 0.12, 0.28]) hoops.push([x, y, z + dz, 0, Math.abs(dz) > 0.2 ? 0.92 : 1.0]); }
      K.inst(barrelGeo, K.mat(0x8a5a34, { roughness: 0.7 }), bList); K.inst(new T.TorusGeometry(0.36, 0.018, 4, 18), K.iron, hoops, { cast: false });
      for (let i = 0; i < 4; i++) K.box(0.7, 0.12, 0.8, chestnut, -10.75 + i * 0.78, 0.06, -9.55);
      bList.forEach(b => { K.cyl(0.29, 0.29, 0.01, K.mat(0x6a4024), b[0], b[1], -9.18, { rx: Math.PI / 2, cast: false }, 14); K.box(0.12, 0.04, 0.01, K.mat(0xf2ece0), b[0], b[1] + 0.12, -9.17, { cast: false }); });
      K.col(-11.2, -10, -7.6, -9.1);
      // o tonel grande deitado (missão)
      const tx = -12.7, tz = -8.95;
      K.add(new T.CylinderGeometry(0.95, 0.95, 1.7, 24, 1, true), K.mat(0x7a4a28, { roughness: 0.7, side: T.DoubleSide }), tx, 1.05, tz, { rx: Math.PI / 2 });
      const staveTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#8a5a34'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(40,20,10,.5)'; g.lineWidth = 2; for (let k = 0; k < 12; k++) { g.beginPath(); g.moveTo(0, k * 22 + 6); g.lineTo(w, k * 22 + 6); g.stroke(); } g.strokeStyle = '#5a3418'; g.lineWidth = 6; g.beginPath(); g.ellipse(128, 128, 70, 52, 0, 0, 7); g.stroke(); g.fillStyle = '#e8d4a0'; g.font = 'italic 700 40px Georgia'; g.textAlign = 'center'; g.fillText('1924', 128, 142); K.grain(g, w, h, 14); });
      K.add(new T.CircleGeometry(0.93, 24), K.texMat(staveTex), tx, 1.05, tz + 0.86, { cast: false });
      for (const dz of [-0.75, -0.45, 0.45, 0.78]) K.torus(0.965, 0.03, K.iron, tx, 1.05, tz + dz, {}, 6, 28);
      for (const s of [-1, 1]) K.box(0.25, 0.32, 1.5, chestnut, tx + s * 0.6, 0.16, tz);
      K.cyl(0.04, 0.04, 0.22, K.brass, tx, 0.42, tz + 0.95, { rx: Math.PI / 2 }, 8); K.box(0.04, 0.12, 0.04, K.brass, tx, 0.5, tz + 1.04);
      const tap = K.box(0.16, 0.03, 0.03, K.brass, tx, 0.57, tz + 1.04);
      K.cyl(0.24, 0.2, 0.22, oakL, tx, 0.11, tz + 1.3, {}, 14); K.torus(0.235, 0.012, K.iron, tx, 0.18, tz + 1.3, { rx: Math.PI / 2 });
      const stream = K.cyl(0.018, 0.012, 1, wineM, tx, 0.36, tz + 1.12, { cast: false }, 6); stream.visible = false;
      const puddle = K.add(new T.CircleGeometry(1, 28).rotateX(-Math.PI / 2), K.mat(0x6a0a18, { roughness: 0.05, metalness: 0.3, emissive: 0x3a0008, emissiveIntensity: 0.4 }), tx, 0.02, tz + 1.55, { cast: false }); puddle.scale.set(0.001, 1, 0.001);
      K.col(tx - 1.0, -10, tx + 1.0, tz + 0.95);
      const setTonel = (e) => { stream.visible = e > 0; stream.scale.y = 0.4; puddle.scale.set(0.001 + e * 1.15, 1, 0.001 + e * 0.8); tap.rotation.z = e > 0 ? Math.PI / 2 : 0; };
      K.tell('tonel', (live) => { if (live) K.anim(3.0, (e) => setTonel(Math.max(0.02, e))); else setTonel(1); }, () => setTonel(0));
      K.tick((dt, t) => { if (stream.visible) stream.scale.x = stream.scale.z = 1 + Math.sin(t * 30) * 0.2; });
      // vitrine da safra rara (missão)
      const vx = -9.3, vz = -8.3;
      K.box(0.7, 0.95, 0.6, oakDark, vx, 0.475, vz); K.box(0.8, 0.06, 0.7, travert, vx, 0.98, vz);
      const rare = K.group(vx, 1.01, vz);
      K.lathe([[0, 0], [0.042, 0], [0.045, 0.02], [0.045, 0.22], [0.02, 0.28], [0.015, 0.36], [0, 0.36]], K.mat(0x1a0c10, { roughness: 0.1, metalness: 0.3 }), 0, 0, 0, { parent: rare, cast: false }, 12);
      const label = K.box(0.095, 0.09, 0.01, K.mat(0xd9b860, { metalness: 0.6, roughness: 0.3 }), 0, 0.12, 0.045, { parent: rare, cast: false });
      const seal = K.cyl(0.02, 0.02, 0.04, K.mat(0x9a1020, { roughness: 0.4 }), 0, 0.37, 0, { parent: rare, cast: false }, 8);
      const cloche = K.add(new T.SphereGeometry(0.17, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 2.6, 1), K.glass, vx, 1.01, vz, { cast: false });
      K.box(0.16, 0.05, 0.005, K.brass, vx, 0.82, vz + 0.355, { cast: false }); K.sign('1961', 0.14, 0.04, vx, 0.82, vz + 0.36, { color: '#2a1a0a', size: 90 });
      K.col(vx - 0.4, vz - 0.35, vx + 0.4, vz + 0.35);
      const spot = K.spot(vx + 0.6, 2.9, vz + 1.6, vx, 1.1, vz, 0xffd8a0, 3.0, 5, 0.35);
      const labelM = label.material, sealM = seal.material;
      K.tell('safra', (live) => { label.material = K.glow(0x40e070, 1.6); seal.material = K.glow(0x40e070, 1.4); spot.color.set(0x60ff90); cloche.position.set(vx + 0.32, 0.86, vz + 0.18); cloche.rotation.z = 1.4; if (live) K.anim(1, e => rare.rotation.y = e * Math.PI * 2); }, () => { label.material = labelM; seal.material = sealM; spot.color.set(0xffd8a0); cloche.position.set(vx, 1.01, vz); cloche.rotation.z = 0; rare.rotation.y = 0; });
      // caixotes de vinho e garrafões de vime
      for (const [x, z, n] of [[-8.2, -9.6, 3], [-8.2, -8.9, 2]]) for (let k = 0; k < n; k++) { K.box(0.5, 0.32, 0.36, oakL, x, 0.16 + k * 0.33, z, { ry: (R() - 0.5) * 0.2 }); K.sign('CHIANTI', 0.4, 0.1, x, 0.16 + k * 0.33, z + 0.185, { color: '#5a2a14', size: 70 }); }
      for (const [x, z] of [[-8.0, -7.6], [-14.0, -7.3]]) { K.add(new T.SphereGeometry(0.26, 12, 10).scale(1, 1.15, 1), K.mat(0x2c5a2c, { roughness: 0.1, transparent: true, opacity: 0.85 }), x, 0.3, z); K.add(new T.SphereGeometry(0.265, 10, 6, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55).scale(1, 1.15, 1), straw, x, 0.3, z); K.cyl(0.05, 0.08, 0.16, K.mat(0x2c5a2c, { transparent: true, opacity: 0.85 }), x, 0.62, z, {}, 8); }
      K.col(-8.45, -9.85, -7.6, -8.6);
      // lampião pendurado
      K.cyl(0.01, 0.01, 0.6, K.iron, -11.0, 3.15, -8.3, { cast: false }, 4); K.sphere(0.13, K.glow(0xffc070, 2.2), -11.0, 2.75, -8.3, { cast: false }); K.halo(-11.0, 2.75, -8.3, 0.7, 0xffb060, 0.5);
      K.plight(-11.0, 2.5, -7.9, 0xffb060, 1.4, 7);
    }
    // barris de degustação na frente da adega e o sommelier
    const barrelUp = new T.LatheGeometry([[0, 0], [0.34, 0], [0.4, 0.25], [0.42, 0.5], [0.4, 0.75], [0.34, 1.0], [0, 1.0]].map(p => new T.Vector2(p[0], p[1])), 16);
    const upBarrel = (x, z, top = true) => { K.add(barrelUp, K.mat(0x8a5a34, { roughness: 0.7 }), x, 0, z); for (const y of [0.12, 0.3, 0.7, 0.88]) K.torus(y > 0.2 && y < 0.8 ? 0.415 : 0.37, 0.016, K.iron, x, y, z, { rx: Math.PI / 2, cast: false }, 4, 20); if (top) { K.cyl(0.5, 0.5, 0.05, oakL, x, 1.03, z, {}, 18); } K.colR(x, z, 0.42); };
    for (const [x, z] of [[-12.4, -5.2], [-10.2, -4.7]]) {
      upBarrel(x, z);
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + 0.3; K.lathe([[0, 0], [0.035, 0], [0.006, 0.01], [0.006, 0.08], [0.04, 0.1], [0.045, 0.16], [0.035, 0.2], [0, 0.19]], K.glass, x + Math.cos(a) * 0.28, 1.055, z + Math.sin(a) * 0.28, { cast: false }, 10); K.cyl(0.03, 0.035, 0.03, wineM, x + Math.cos(a) * 0.28, 1.17, z + Math.sin(a) * 0.28, { cast: false }, 8); }
      K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.015, 0.28], [0.014, 0.34], [0, 0.34]], K.mat(0x1e3a1e, { roughness: 0.15, metalness: 0.2 }), x - 0.1, 1.055, z - 0.05, { cast: false }, 10);
      K.box(0.3, 0.03, 0.2, oakL, x + 0.12, 1.07, z - 0.12, { cast: false }); for (let k = 0; k < 4; k++) K.box(0.05, 0.03, 0.05, K.mat([0xf2d890, 0xb85a3a, 0xe8d4a0, 0x6a2a1a][k]), x + 0.04 + k * 0.06, 1.1, z - 0.12, { cast: false });
      K.ringSlots(x, z, 3, 0.85, 'talk', 0, 0.5);
    }
    // placa de giz da adega
    { const ch = K.canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#1e2420'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a6a44'; g.lineWidth = 14; g.strokeRect(0, 0, w, h); g.fillStyle = '#f2ece0'; g.textAlign = 'center'; g.font = 'italic 700 40px Georgia'; g.fillText('Cantina', 128, 60); g.font = '24px Georgia'; ['Chianti Classico', 'Brunello 1997', 'Vin Santo', 'Prosecco'].forEach((s, i) => g.fillText(s, 128, 120 + i * 44)); g.fillStyle = '#e0a0a8'; g.beginPath(); g.arc(128, 290, 8, 0, 7); g.fill(); });
      const g = K.group(-7.0, 0, -6.1, -0.4); K.add(new T.PlaneGeometry(0.62, 0.8), K.texMat(ch), 0, 0.9, 0, { parent: g, rx: -0.15 }); for (const s of [-1, 1]) K.box(0.04, 1.3, 0.04, oakL, s * 0.3, 0.62, -0.1, { parent: g, rx: -0.15 }); K.colR(-7.0, -6.1, 0.25); }

    // ------------------------------------------------------------ bar de barris à esquerda (vinho e prosecco)
    { const bx = -13.7;
      upBarrel(bx, -2.9, false); upBarrel(bx, 0.9, false);
      K.box(0.9, 0.08, 4.6, chestnut, bx, 1.06, -1.0); K.box(0.06, 0.12, 4.6, oakDark, bx + 0.45, 1.0, -1.0, { cast: false });
      K.box(0.7, 0.8, 2.6, K.mat(0x8a6040, { roughness: 0.8 }), bx, 0.45, -1.0); K.col(bx - 0.5, -3.4, bx + 0.5, 1.4);
      // caixotes empilhados atrás com garrafas
      for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) K.box(0.4, 0.36, 0.95, oakL, -14.45, 0.18 + j * 0.37, -2.8 + k * 1.0, { ry: (R() - 0.5) * 0.1 });
      K.bottles(-14.45, 0.75, -3.2, 18, 0.2, { colors: [0x1e3a1e, 0x2c5a2c, 0xe8e0c8, 0x5a1020, 0x1e3a1e] });
      // garrafas e taças no balcão
      for (let k = 0; k < 6; k++) { const z = -3.0 + k * 0.75; K.lathe([[0, 0], [0.038, 0], [0.04, 0.2], [0.014, 0.27], [0.013, 0.33], [0, 0.33]], K.mat(k % 3 ? 0x1e3a1e : 0xe8e0c8, { roughness: 0.12, transparent: true, opacity: 0.88 }), bx - 0.15, 1.1, z, { cast: false }, 10); for (let j = 0; j < 2; j++) { const zz = z + 0.2 + j * 0.15; K.lathe([[0, 0], [0.035, 0], [0.006, 0.01], [0.006, 0.08], [0.04, 0.1], [0.045, 0.16], [0.035, 0.2], [0, 0.19]], K.glass, bx + 0.2, 1.1, zz, { cast: false }, 10); K.cyl(0.03, 0.035, 0.03, j ? wineM : K.mat(0xf2e2a0, { transparent: true, opacity: 0.8 }), bx + 0.2, 1.22, zz, { cast: false }, 8); } }
      K.cyl(0.16, 0.13, 0.25, K.silver, bx - 0.1, 1.22, 0.9, {}, 14); for (let k = 0; k < 3; k++) K.lathe([[0, 0], [0.035, 0], [0.036, 0.22], [0.012, 0.3], [0, 0.3]], K.mat(0x2c5a2c, { roughness: 0.1 }), bx - 0.14 + k * 0.04, 1.22, 0.86 + k * 0.04, { cast: false, rz: 0.25 }, 8);
      // pequeno toldo de linho
      for (const z of [-3.4, 1.4]) K.cyl(0.04, 0.04, 2.6, oakDark, -14.35, 1.3, z, {}, 6);
      K.add(new T.PlaneGeometry(1.4, 5.0).rotateX(-Math.PI / 2), K.mat(0xf2ece0, { side: T.DoubleSide, roughness: 0.95 }), -13.8, 2.5, -1.0, { rz: -0.3 });
      K.bulbs([-14.35, 2.55, -3.4], [-14.35, 2.55, 1.4], 10, 0.3);
      K.sign('VINO · PROSECCO', 2.2, 0.32, -14.32, 2.25, -1.0, { ry: Math.PI / 2, color: '#6a3a1a', size: 56, bg: '#f2e6c8', w: 640, h: 96 });
      [-2.6, -1.6, -0.6, 0.4].forEach(z => K.slot(bx + 1.2, z, bx, z, 'bar'));
      K.plight(-12.6, 2.2, -1.0, 0xffb870, 1.0, 6);
    }

    // ------------------------------------------------------------ pérgola de glicínias sobre a mesa longa do banquete
    const pX = [-6.6, -3.9, -1.2, 1.5, 4.2], pZ = [-5.4, -1.0];
    { for (const x of pX) for (const z of pZ) { K.box(0.32, 0.25, 0.32, travert, x, 0.12, z); K.box(0.24, 2.85, 0.24, honeyS, x, 1.5, z); K.box(0.32, 0.12, 0.32, travert, x, 2.92, z); K.colR(x, z, 0.18); }
      for (const z of pZ) K.box(11.8, 0.2, 0.2, chestnut, -1.2, 3.08, z);
      const raft = []; for (let x = -7.0; x <= 4.6; x += 0.6) raft.push([x, 3.24, -3.2]);
      K.inst(new T.BoxGeometry(0.1, 0.12, 5.4), chestnut, raft);
      // troncos retorcidos da glicínia subindo pelos pilares
      for (const x of pX) for (const z of pZ) for (let k = 0; k < 6; k++) { const a = k * 1.1; K.cyl(0.035, 0.045, 0.6, K.mat(0x5a4a3a, { roughness: 0.95 }), x + Math.cos(a) * 0.16, 0.3 + k * 0.48, z + Math.sin(a) * 0.16, { rz: Math.sin(a) * 0.4, rx: Math.cos(a) * 0.4, cast: false }, 5); }
      // folhagem e cachos roxos pendentes
      const leaves = [], wA = [], wB = [], wC = [];
      const tops = [[], [], []];
      for (let k = 0; k < 170; k++) { const x = -7.2 + R() * 12, z = -5.8 + R() * 5.2; leaves.push([x, 3.32 + R() * 0.12, z, R() * 6, 0.45 + R() * 0.45]); }
      for (let k = 0; k < 330; k++) { const x = -7.3 + R() * 12.2, z = -5.9 + R() * 5.4; tops[k % 3].push([x, 3.36 + R() * 0.16, z, R() * 6, [0.8 + R() * 0.6, 0.6 + R() * 0.4, 0.8 + R() * 0.6]]); }
      for (let k = 0; k < 420; k++) { let x, z; if (k < 160) { x = pX[0] + R() * (pX[4] - pX[0]); z = pZ[R() < 0.5 ? 0 : 1] + (R() - 0.5) * 0.5; } else { x = -7.0 + Math.floor(R() * 20) * 0.6 + (R() - 0.5) * 0.1; z = -5.6 + R() * 4.8; } const l = [wA, wB, wC][Math.floor(R() * 3)]; l.push([x, 3.2 - R() * 0.12, z, R() * 6, [0.9 + R() * 0.4, 0.8 + R() * 0.8, 0.9 + R() * 0.4]]); }
      K.inst(new T.SphereGeometry(0.35, 8, 6).scale(1.4, 0.45, 1.0), K.mat(0x46662e, { roughness: 0.85 }), leaves);
      const blos = new T.SphereGeometry(0.16, 7, 5).scale(1, 0.8, 1);
      [0x8a68c0, 0xaa8ad8, 0x6e4c9e].forEach((c, i) => K.inst(blos, K.mat(c, { roughness: 0.75 }), tops[i]));
      const rac = new T.ConeGeometry(0.07, 0.5, 6).rotateX(Math.PI).translate(0, -0.25, 0);
      K.inst(rac, K.mat(0x9a78c8, { roughness: 0.75 }), wA, { cast: false }); K.inst(rac, K.mat(0xb89ae0, { roughness: 0.75 }), wB, { cast: false }); K.inst(rac, K.mat(0x7a58a8, { roughness: 0.75 }), wC, { cast: false });
      // cordões de luz entre os pilares
      for (const z of pZ) K.bulbs([pX[0], 2.95, z], [pX[4], 2.95, z], 24, 0.35);
      for (let k = 0; k < 4; k++) K.bulbs([pX[k], 3.0, pZ[0]], [pX[k + 1], 3.0, pZ[1]], 10, 0.45);
      K.plight(-4.0, 2.4, -3.2, 0xffc890, 1.3, 8); K.plight(1.6, 2.4, -3.2, 0xffc890, 1.3, 8);
    }
    // a mesa do banquete
    { const x0 = -6.0, x1 = 3.6, cx = (x0 + x1) / 2, cz = -3.2, L = x1 - x0;
      K.box(L, 0.05, 1.2, linen, cx, 0.76, cz); K.box(L + 0.04, 0.6, 1.22, K.mat(0xf3eee2, { roughness: 0.95 }), cx, 0.46, cz);
      K.box(L, 0.012, 0.36, K.mat(0xc8d0b8, { roughness: 0.9 }), cx, 0.79, cz, { cast: false }); // trilho de gaze sálvia
      K.col(x0 - 0.05, cz - 0.55, x1 + 0.05, cz + 0.55);
      const plates = [], chargers = [], wg = [], wgw = [], forks = [], knives = [], napk = [], cards = [], fol = [], fw = [], fiaschi = [], necks = [], caps = [], bread = [];
      for (let x = x0 + 0.4; x < x1 - 0.2; x += 0.8) for (const s of [-1, 1]) {
        const z = cz + s * 0.38;
        chargers.push([x, 0.792, z]); plates.push([x, 0.8, z]); napk.push([x, 0.81, z, 0.4 * s]);
        forks.push([x - 0.2, 0.792, z]); knives.push([x + 0.2, 0.792, z]);
        wg.push([x + 0.15, 0.785, z - s * 0.22]); wgw.push([x + 0.15, 0.785, z - s * 0.22]); wg.push([x + 0.27, 0.785, z - s * 0.17]);
        cards.push([x, 0.83, z - s * 0.17, 0]);
      }
      for (let x = x0 + 0.2; x < x1 - 0.1; x += 0.13) { fol.push([x, 0.81, cz + (R() - 0.5) * 0.12, R() * 6, 0.7 + R() * 0.6]); if (R() < 0.45) fw.push([x, 0.86, cz + (R() - 0.5) * 0.14, 0, 0.8 + R() * 0.5]); }
      for (let x = x0 + 0.8; x < x1 - 0.3; x += 1.6) { fiaschi.push([x, 0.79, cz + 0.05]); necks.push([x, 0.79, cz + 0.05]); caps.push([x, 0.79, cz + 0.05]); bread.push([x + 0.6, 0.83, cz - 0.08, R() * 3]); }
      K.inst(new T.CylinderGeometry(0.16, 0.16, 0.012, 20), K.mat(0xc9a35a, { roughness: 0.6, metalness: 0.4 }), chargers, { cast: false });
      K.inst(new T.CylinderGeometry(0.13, 0.11, 0.016, 20), white, plates, { cast: false });
      K.inst(new T.BoxGeometry(0.12, 0.03, 0.1), K.mat(0x9aa58a, { roughness: 0.9 }), napk, { cast: false });
      K.inst(new T.BoxGeometry(0.02, 0.006, 0.19), K.silver, forks, { cast: false }); K.inst(new T.BoxGeometry(0.02, 0.006, 0.21), K.silver, knives, { cast: false });
      const glassGeo = new T.LatheGeometry([[0, 0], [0.035, 0], [0.006, 0.01], [0.006, 0.09], [0.035, 0.11], [0.045, 0.17], [0.035, 0.22], [0.033, 0.215]].map(p => new T.Vector2(p[0], p[1])), 10);
      K.inst(glassGeo, K.glass, wg, { cast: false });
      K.inst(new T.CylinderGeometry(0.036, 0.03, 0.035, 8).translate(0, 0.14, 0), wineM, wgw, { cast: false });
      K.inst(new T.BoxGeometry(0.07, 0.045, 0.004), K.mat(0xfbf6ea), cards.map(c => [c[0], c[1], c[2], 0, 1, 0.4]), { cast: false });
      K.inst(new T.SphereGeometry(0.06, 6, 4).scale(1.6, 0.5, 0.9), K.mat(0x7a8a5e, { roughness: 0.9 }), fol, { cast: false });
      K.inst(new T.SphereGeometry(0.035, 6, 5), fl.white, fw, { cast: false });
      // fiaschi de Chianti com palha
      K.inst(new T.LatheGeometry([[0, 0], [0.07, 0.01], [0.1, 0.06], [0.1, 0.12], [0.075, 0.18], [0.03, 0.21], [0, 0.21]].map(p => new T.Vector2(p[0], p[1])), 12), straw, fiaschi);
      K.inst(new T.CylinderGeometry(0.02, 0.028, 0.18, 8).translate(0, 0.29, 0), K.mat(0x2c5a2c, { roughness: 0.1, transparent: true, opacity: 0.85 }), necks, { cast: false });
      K.inst(new T.CylinderGeometry(0.024, 0.024, 0.035, 8).translate(0, 0.39, 0), K.mat(0xb01e2a), caps, { cast: false });
      K.inst(new T.SphereGeometry(0.08, 8, 6).scale(1.8, 0.7, 0.9), K.mat(0xc8904a, { roughness: 0.9 }), bread, { cast: false });
      // velas altas em castiçais de latão
      for (let x = x0 + 0.4; x < x1; x += 1.6) { K.cyl(0.035, 0.05, 0.08, K.brass, x, 0.83, cz - 0.06, { cast: false }, 8); K.cyl(0.014, 0.014, 0.26, M.candle, x, 0.99, cz - 0.06, { cast: false }, 6); K.flame(x, 1.13, cz - 0.06, 0.014); }
      // tigelas de azeitonas e galheteiros
      for (let x = x0 + 1.2; x < x1; x += 2.4) { K.cyl(0.08, 0.05, 0.05, white, x, 0.81, cz + 0.12, { cast: false }, 12); for (let k = 0; k < 6; k++) K.sphere(0.016, K.mat(0x4a5a22), x + Math.cos(k) * 0.04, 0.84, cz + 0.12 + Math.sin(k) * 0.04, { cast: false }, 5, 4); K.lathe([[0, 0], [0.03, 0], [0.032, 0.1], [0.008, 0.16], [0, 0.17]], K.mat(0x9aa030, { transparent: true, opacity: 0.8, roughness: 0.1 }), x + 0.15, 0.79, cz - 0.13, { cast: false }, 8); }
      // cadeiras de madeira com almofada sálvia + vagas de sentar
      for (let x = x0 + 0.4; x < x1 - 0.2; x += 0.8) for (const s of [-1, 1]) { const z = cz + s * 0.8; K.chair(x, z, s < 0 ? 0 : Math.PI, { seat: K.mat(0xb8c4a6, { roughness: 0.95 }), frame: oakL, back: oakL }); K.slot(x, z, x, cz, 'sit'); }
      // oliveiras em vasos nas pontas da mesa
    }
    const oliveTree = (x, z, s = 1, pot = true) => {
      const g = K.group(x, 0, z, R() * 6);
      if (pot) { K.lathe([[0, 0], [0.32 * s, 0], [0.42 * s, 0.5 * s], [0.46 * s, 0.56 * s], [0.4 * s, 0.6 * s], [0, 0.6 * s]], terra, 0, 0, 0, { parent: g }, 14); K.cyl(0.4 * s, 0.4 * s, 0.02, M.soil, 0, 0.56 * s, 0, { parent: g, cast: false }, 12); K.torus(0.44 * s, 0.03, terra, 0, 0.5 * s, 0, { parent: g, rx: Math.PI / 2 }, 4, 18); }
      const y0 = pot ? 0.56 * s : 0;
      for (let k = 0; k < 3; k++) K.cyl(0.04 * s, 0.07 * s, 1.1 * s, K.mat(0x6a5a48, { roughness: 1 }), Math.cos(k * 2.1) * 0.06 * s, y0 + 0.5 * s, Math.sin(k * 2.1) * 0.06 * s, { parent: g, rz: Math.cos(k * 2.1) * 0.25, rx: Math.sin(k * 2.1) * 0.25 }, 5);
      for (let k = 0; k < 7; k++) K.add(new T.SphereGeometry(0.32 * s, 8, 6).scale(1.2, 0.75, 1.1), K.mat(k % 2 ? 0x8a9a6a : 0x76885a, { roughness: 0.95 }), Math.cos(k * 0.9) * 0.35 * s * (k ? 1 : 0), y0 + (1.1 + (k % 3) * 0.2) * s, Math.sin(k * 0.9) * 0.35 * s * (k ? 1 : 0), { parent: g });
      if (pot) K.colR(x, z, 0.42 * s);
      return g;
    };
    oliveTree(-7.7, -3.2, 1.05); oliveTree(5.3, -3.2, 1.05); oliveTree(-6.4, 0.6, 0.9); oliveTree(4.0, -0.2, 0.85);
    // limoeiros e lavandas em vasos
    const lemon = (x, z) => { const g = K.group(x, 0, z); K.lathe([[0, 0], [0.22, 0], [0.3, 0.45], [0.33, 0.5], [0, 0.5]], K.mat(0xc87a50, { roughness: 0.8 }), 0, 0, 0, { parent: g }, 12); K.cyl(0.03, 0.04, 0.7, M.walnut, 0, 0.8, 0, { parent: g }, 5); K.sphere(0.42, K.mat(0x3f6a2a, { roughness: 0.85 }), 0, 1.4, 0, { parent: g }, 10, 8); for (let k = 0; k < 9; k++) { const a = k * 2.4, b = (k % 3) * 0.4 - 0.4; K.add(new T.SphereGeometry(0.05, 6, 5).scale(1, 1.25, 1), K.mat(0xf2d230, { roughness: 0.5 }), Math.cos(a) * 0.4 * Math.cos(b), 1.4 + Math.sin(b) * 0.4, Math.sin(a) * 0.4 * Math.cos(b), { parent: g, cast: false }); } K.colR(x, z, 0.32); };
    [[-1.55, -9.6], [1.55, -9.6], [-13.9, 9.4], [13.9, 9.4], [-3.6, 9.5], [3.6, 9.5]].forEach(([x, z]) => lemon(x, z));
    const lavender = (x, z) => { K.lathe([[0, 0], [0.16, 0], [0.2, 0.28], [0, 0.28]], terra, x, 0, z, {}, 10); const l = []; for (let k = 0; k < 26; k++) { const a = R() * 6.28, r = R() * 0.17; l.push([x + Math.cos(a) * r, 0.3, z + Math.sin(a) * r, 0, [1, 0.8 + R() * 0.5, 1], (R() - 0.5) * 0.4, (R() - 0.5) * 0.4]); } K.inst(new T.CylinderGeometry(0.012, 0.004, 0.42, 4).translate(0, 0.21, 0), K.mat(0x7a8a6a), l, { cast: false }); K.inst(new T.CylinderGeometry(0.022, 0.012, 0.12, 5).translate(0, 0.42, 0), K.mat(0x8a6ac8, { roughness: 0.7 }), l, { cast: false }); K.colR(x, z, 0.2); };
    [[-7.6, -5.6], [5.2, -5.6], [-7.6, -0.8], [-14.0, 3.0], [-14.0, 5.6], [8.2, 9.5], [-8.6, 9.5], [14.0, 0.2], [14.0, 2.4]].forEach(([x, z]) => lavender(x, z));

    // ------------------------------------------------------------ bufê de antepasti e mesa de doces junto à fachada
    { const buffet = (cx, w) => { K.box(w, 0.05, 0.8, linen, cx, 0.86, -9.25); K.box(w + 0.04, 0.82, 0.82, K.mat(0xf3eee2, { roughness: 0.95 }), cx, 0.43, -9.25); K.box(w + 0.05, 0.16, 0.84, K.mat(0x9aa58a, { roughness: 0.9 }), cx, 0.74, -9.25, { cast: false }); K.col(cx - w / 2, -9.7, cx + w / 2, -8.8); };
      buffet(-4.6, 3.6); buffet(4.6, 3.6);
      // antepasti: rodas de pecorino, presunto no suporte, pães, uvas
      for (let k = 0; k < 3; k++) { K.cyl(0.17, 0.17, 0.12, K.mat(0xe8cc80, { roughness: 0.7 }), -6.0 + k * 0.5, 0.95, -9.3, {}, 18); K.cyl(0.172, 0.172, 0.02, K.mat(0xb08a40), -6.0 + k * 0.5, 0.94, -9.3, { cast: false }, 18); }
      K.box(0.7, 0.04, 0.3, oakL, -4.5, 0.9, -9.2); const ham = K.add(new T.SphereGeometry(0.14, 10, 8).scale(2.2, 1, 1), K.mat(0xa84a3a, { roughness: 0.6 }), -4.5, 1.0, -9.2); ham.rotation.z = 0.25; K.cyl(0.02, 0.02, 0.2, white, -4.2, 1.1, -9.2, { rz: 1.2 }, 5);
      for (let k = 0; k < 5; k++) K.add(new T.SphereGeometry(0.08, 8, 6).scale(2.2, 0.8, 0.9), K.mat(0xc8904a, { roughness: 0.9 }), -3.6 + (k % 2) * 0.18, 0.94, -9.4 + k * 0.12, { ry: R() });
      for (let k = 0; k < 3; k++) { const gx = -3.0 + k * 0.05, gz = -9.15; K.cyl(0.18, 0.14, 0.04, K.silver, gx, 0.9, gz, { cast: false }, 14); for (let j = 0; j < 14; j++) K.sphere(0.025, K.mat(j % 2 ? 0x4a1e4e : 0x6a2a5a, { roughness: 0.4 }), gx + Math.cos(j * 1.3) * 0.08, 0.95 + (j % 3) * 0.025, gz + Math.sin(j * 1.3) * 0.08, { cast: false }, 6, 4); }
      for (let k = 0; k < 4; k++) { K.cyl(0.13, 0.13, 0.015, white, -5.6 + k * 0.6, 0.9, -8.98, { cast: false }, 14); for (let j = 0; j < 5; j++) K.box(0.05, 0.02, 0.05, K.mat([0xa83a3a, 0xe8d090, 0x4a5a22, 0xf2e6c8][(j + k) % 4]), -5.6 + k * 0.6 + Math.cos(j) * 0.07, 0.915, -8.98 + Math.sin(j) * 0.07, { cast: false }); }
      // doces: cantucci, cannoli, crostata e vin santo
      for (let k = 0; k < 3; k++) { K.cyl(0.02, 0.02, 0.1 + k * 0.06, K.silver, 3.4 + k * 0.7, 0.93 + k * 0.03, -9.3, { cast: false }, 6); K.cyl(0.18, 0.18, 0.015, white, 3.4 + k * 0.7, 0.98 + k * 0.06, -9.3, { cast: false }, 16); for (let j = 0; j < 8; j++) K.add(new T.CylinderGeometry(0.02, 0.02, 0.09, 6), K.mat(j % 2 ? 0xd8b070 : 0xf2ece0), 3.4 + k * 0.7 + Math.cos(j * 0.8) * 0.1, 1.0 + k * 0.06, -9.3 + Math.sin(j * 0.8) * 0.1, { cast: false, rz: Math.PI / 2, ry: j * 0.8 }); }
      K.cyl(0.2, 0.2, 0.05, K.mat(0xc8803a), 5.6, 0.91, -9.15, { cast: false }, 18); for (let k = 0; k < 6; k++) K.box(0.4, 0.012, 0.02, K.mat(0x8a3a2a), 5.6, 0.94, -9.15, { ry: k * 0.52, cast: false });
      for (let k = 0; k < 5; k++) K.lathe([[0, 0], [0.025, 0], [0.004, 0.01], [0.004, 0.05], [0.025, 0.06], [0.03, 0.1], [0, 0.1]], K.glass, 6.1 - k * 0.12, 0.88, -8.95, { cast: false }, 8);
      K.lathe([[0, 0], [0.05, 0], [0.05, 0.16], [0.016, 0.22], [0.016, 0.3], [0, 0.3]], K.mat(0xc88a30, { roughness: 0.1, transparent: true, opacity: 0.85 }), 6.3, 0.88, -9.35, { cast: false }, 10);
      [-5.8, -4.6, -3.4, 3.4, 4.6, 5.8].forEach(x => K.slot(x, -8.25, x, -9.3, 'bar'));
      K.plight(0, 3.0, -8.6, 0xffc080, 1.0, 9);
    }

    // ------------------------------------------------------------ cerimônia: arco de flores, altar, cadeiras brancas, gaiola da pomba
    { const ax = 10.6, az = -7.6;
      // colunas e arco
      for (const s of [-1, 1]) { K.cyl(0.07, 0.08, 2.0, M.white, ax + s * 1.2, 1.0, az, {}, 8); K.colR(ax + s * 1.2, az, 0.22); }
      K.add(new T.TorusGeometry(1.2, 0.06, 6, 24, Math.PI), M.white, ax, 2.0, az);
      const fP = [], fW = [], fB = [], fG = [];
      const pushF = (x, y, z) => { const r = R(); (r < 0.3 ? fP : r < 0.6 ? fW : r < 0.8 ? fB : fG).push([x + (R() - 0.5) * 0.18, y + (R() - 0.5) * 0.15, z + (R() - 0.5) * 0.25, R() * 6, 0.7 + R() * 0.7]); };
      for (let k = 0; k < 140; k++) { const u = R(), a = Math.PI * u; const dense = Math.abs(u - 0.5) > 0.25 ? 1 : 0.5; if (R() > dense + 0.2) continue; pushF(ax - Math.cos(a) * 1.2, 2.0 + Math.sin(a) * 1.2, az); }
      for (const s of [-1, 1]) for (let k = 0; k < 40; k++) { const y = R() < 0.6 ? 0.2 + R() * 0.7 : 1.4 + R() * 0.6; pushF(ax + s * 1.2, y, az); }
      const fgeo = new T.SphereGeometry(0.075, 7, 5);
      K.inst(fgeo, fl.pink, fP, { cast: false }); K.inst(fgeo, fl.white, fW, { cast: false }); K.inst(fgeo, fl.blush, fB, { cast: false }); K.inst(new T.SphereGeometry(0.09, 6, 4).scale(1.4, 0.6, 1), K.mat(0x6a8450, { roughness: 0.9 }), fG, { cast: false });
      // véus de chiffon
      for (const s of [-1, 1]) { const d = K.add(new T.PlaneGeometry(0.5, 2.4, 1, 6), K.mat(0xffffff, { transparent: true, opacity: 0.6, side: T.DoubleSide, roughness: 0.95 }), ax + s * 1.32, 1.9, az - 0.08, { cast: false }); const dp = d.geometry.attributes.position; for (let i = 0; i < dp.count; i++) dp.setZ(i, Math.sin(dp.getY(i) * 3) * 0.06); dp.needsUpdate = true; }
      // laço de cetim na coluna esquerda (missão: cortar a fita)
      const bow = K.group(ax - 1.2, 1.45, az + 0.14);
      const satin = K.mat(0xf2a8bc, { roughness: 0.35, metalness: 0.1 });
      for (const s of [-1, 1]) { K.add(new T.TorusGeometry(0.12, 0.035, 6, 14).scale(1.3, 0.7, 0.5), satin, s * 0.15, 0.03, 0, { parent: bow, rz: s * 0.25 }); K.box(0.08, 0.75, 0.01, satin, s * 0.08, -0.4, 0, { parent: bow, rz: s * 0.12 }); }
      K.sphere(0.05, satin, 0, 0, 0, { parent: bow }, 8, 6);
      const bowP = bow.position.clone();
      K.tell('fita', (live) => { const fall = (e) => { bow.position.set(bowP.x + 0.25 * e, bowP.y - 1.38 * e, bowP.z + 0.35 * e); bow.rotation.set(-Math.PI / 2 * e, 0, 0.6 * e); }; if (live) K.anim(1.2, fall); else fall(1); }, () => { bow.position.copy(bowP); bow.rotation.set(0, 0, 0); });
      // tapete do corredor e pétalas
      const runTex = K.canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#f6f2e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#c9a44a'; g.fillRect(3, 0, 3, h); g.fillRect(w - 6, 0, 3, h); K.grain(g, w, h, 8); });
      K.add(new T.PlaneGeometry(1.0, 5.6).rotateX(-Math.PI / 2), K.texMat(runTex, { roughness: 0.95 }), ax, 0.015, -3.9, { cast: false });
      const pet = []; for (let k = 0; k < 160; k++) pet.push([ax + (R() - 0.5) * 1.3, 0.022, -6.6 + R() * 5.4, R() * 6]); K.inst(new T.CircleGeometry(0.03, 5).rotateX(-Math.PI / 2), K.mat(0xf2a0b4, { roughness: 0.8 }), pet, { cast: false });
      // altar com toalha, velas e o estojo das alianças (missão)
      K.box(0.9, 0.8, 0.42, K.mat(0xf6f1e6, { roughness: 0.95 }), ax, 0.4, -6.8); K.box(0.95, 0.04, 0.46, M.white, ax, 0.82, -6.8); K.col(ax - 0.47, -7.03, ax + 0.47, -6.57);
      const altarFlames = [];
      for (const s of [-1, 1]) { K.cyl(0.04, 0.05, 0.06, K.brass, ax + s * 0.33, 0.87, -6.85, { cast: false }, 8); K.cyl(0.03, 0.03, 0.3, M.candle, ax + s * 0.33, 1.05, -6.85, { cast: false }, 8); altarFlames.push(K.flame(ax + s * 0.33, 1.2, -6.85, 0.02)); }
      K.add(K.rbox(0.26, 0.06, 0.2, 0.03), K.mat(0xfbf8f0, { roughness: 0.6 }), ax, 0.87, -6.75);
      const box = K.group(ax, 0.9, -6.75); K.box(0.09, 0.05, 0.08, K.mat(0x1f3a5a, { roughness: 0.6 }), 0, 0.025, 0, { parent: box });
      const lid = K.group(0, 0.05, -0.04, 0, box); K.box(0.09, 0.03, 0.08, K.mat(0x1f3a5a, { roughness: 0.6 }), 0, 0.015, 0.04, { parent: lid });
      const rings = [K.torus(0.018, 0.005, K.gold, -0.015, 0.06, 0.005, { parent: box, cast: false }, 6, 14), K.torus(0.015, 0.005, K.gold, 0.017, 0.06, 0.005, { parent: box, cast: false }, 6, 14)];
      const ringHalo = K.halo(ax, 1.05, -6.72, 0.35, 0xff2030, 1.4); ringHalo.visible = false;
      K.tell('alianca', (live) => { rings.forEach(r => r.material = K.iron); ringHalo.visible = true; altarFlames.forEach(f => f.visible = false); if (live) K.anim(0.8, e => lid.rotation.x = -1.9 * e); else lid.rotation.x = -1.9; }, () => { rings.forEach(r => r.material = K.gold); ringHalo.visible = false; altarFlames.forEach(f => f.visible = true); lid.rotation.x = 0; });
      K.plight(ax, 2.6, -6.2, 0xffd0a0, 1.2, 7);
      // cadeiras dobráveis brancas em fileiras
      const seats = [], backs = [], rails = [], legs = [], bows = [];
      const rowsZ = [-5.3, -4.45, -3.6, -2.75, -1.9], colsX = [7.6, 8.3, 9.0, 9.7, 11.5, 12.2, 12.9, 13.6];
      rowsZ.forEach((z, ri) => colsX.forEach((x, ci) => {
        seats.push([x, 0.45, z]); backs.push([x, 0.75, z + 0.19]); rails.push([x, 0.98, z + 0.19]);
        for (const [a, b] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.19], [0.17, 0.19]]) legs.push([x + a, 0.22, z + b]);
        if (ci === 3 || ci === 4) bows.push([x + (ci === 3 ? 0.22 : -0.22), 0.8, z + 0.19]);
        if ((ri < 2 && (ci % 2 === 0)) || (ri === 3 && (ci === 1 || ci === 6))) K.slot(x, z, x, z - 1, 'sit');
      }));
      K.inst(new T.BoxGeometry(0.4, 0.04, 0.38), white, seats); K.inst(new T.BoxGeometry(0.4, 0.3, 0.025), white, backs); K.inst(new T.BoxGeometry(0.42, 0.04, 0.035), white, rails, { cast: false });
      K.inst(new T.CylinderGeometry(0.014, 0.014, 0.45, 5), white, legs, { cast: false });
      K.inst(new T.SphereGeometry(0.09, 7, 5).scale(1, 1.2, 0.6), fl.pink, bows, { cast: false });
      K.col(7.3, -5.55, 10.0, -1.65); K.col(11.2, -5.55, 13.9, -1.65);
      // ganchos com potes de vidro e velas ao longo do corredor
      for (const z of [-5.0, -3.2, -1.4]) for (const s of [-1, 1]) { const x = ax + s * 0.58; K.cyl(0.012, 0.012, 1.3, K.iron, x, 0.65, z, { cast: false }, 4); K.add(new T.TorusGeometry(0.1, 0.01, 4, 10, Math.PI), K.iron, x - s * 0.1, 1.3, z, { cast: false }); K.cyl(0.045, 0.045, 0.1, K.glass, x - s * 0.2, 1.18, z, { cast: false }, 8); K.flame(x - s * 0.2, 1.17, z, 0.01); }
      // sebe de roseiras atrás do arco
      const hedge = []; for (let k = 0; k < 40; k++) hedge.push([7.2 + R() * 7.2, 0.35 + R() * 0.3, -9.7 + R() * 0.5, R() * 6, 0.8 + R() * 0.5]);
      K.inst(new T.SphereGeometry(0.35, 8, 6), K.mat(0x4a6a34, { roughness: 0.9 }), hedge); const roses = []; for (let k = 0; k < 70; k++) roses.push([7.2 + R() * 7.2, 0.5 + R() * 0.45, -9.45 + R() * 0.35, 0, 0.7 + R() * 0.5]); K.inst(new T.SphereGeometry(0.06, 6, 5), K.mat(0xf6f0f2), roses, { cast: false });
      K.col(7.0, -10, 14.5, -9.3);
      // gaiola branca com a pomba (missão)
      const cx = 13.2, cz = -7.3;
      K.lathe([[0, 0], [0.22, 0], [0.16, 0.1], [0.08, 0.2], [0.08, 0.95], [0.18, 1.0], [0, 1.0]], white, cx, 0, cz, {}, 14);
      const cage = K.group(cx, 1.0, cz);
      K.cyl(0.24, 0.24, 0.03, white, 0, 0.015, 0, { parent: cage }, 18);
      const bars = []; for (let k = 0; k < 18; k++) { const a = k / 18 * Math.PI * 2; if (k === 0) continue; bars.push([cx + Math.cos(a) * 0.22, 1.0, cz + Math.sin(a) * 0.22]); }
      K.inst(new T.CylinderGeometry(0.006, 0.006, 0.42, 4).translate(0, 0.21, 0), white, bars, { cast: false });
      K.add(new T.SphereGeometry(0.22, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0xf6f3ec, { roughness: 0.5, wireframe: true }), 0, 0.42, 0, { parent: cage, cast: false });
      K.torus(0.05, 0.008, white, 0, 0.68, 0, { parent: cage, cast: false });
      const door = K.group(0.22, 0.02, 0, 0, cage); for (let k = 0; k < 3; k++) K.box(0.006, 0.3, 0.006, white, 0, 0.15, -0.06 + k * 0.06, { parent: door, cast: false }); K.box(0.006, 0.006, 0.14, white, 0, 0.3, 0, { parent: door, cast: false });
      for (let k = 0; k < 10; k++) K.sphere(0.04, k % 2 ? fl.white : fl.green, cx + Math.cos(k * 0.63) * 0.24, 1.02, cz + Math.sin(k * 0.63) * 0.24, { cast: false }, 6, 4);
      K.colR(cx, cz, 0.3);
      const dove = K.group(cx, 1.12, cz);
      const dWhite = K.mat(0xffffff, { roughness: 0.6, emissive: 0xffffff, emissiveIntensity: 0.15 });
      K.add(new T.SphereGeometry(0.07, 10, 8).scale(1.7, 0.95, 1), dWhite, 0, 0, 0, { parent: dove }); K.sphere(0.042, dWhite, 0.1, 0.05, 0, { parent: dove }, 8, 6); K.cone(0.012, 0.035, K.mat(0xe0a060), 0.15, 0.05, 0, { parent: dove, rz: -Math.PI / 2 }, 5);
      K.add(new T.ConeGeometry(0.05, 0.14, 4).rotateZ(Math.PI / 2).scale(1, 1, 0.3), dWhite, -0.15, 0.01, 0, { parent: dove });
      const wings = [-1, 1].map(s => { const w = K.group(0, 0.03, s * 0.04, 0, dove); K.add(new T.PlaneGeometry(0.16, 0.2).translate(0, 0, s * 0.1).rotateX(Math.PI / 2), K.mat(0xffffff, { side: T.DoubleSide, roughness: 0.6, emissive: 0xffffff, emissiveIntensity: 0.15 }), 0, 0, 0, { parent: w, cast: false }); return w; });
      let flying = false, flyT = 0; const doveGlow = K.halo(0, 0, 0, 0.45, 0xfff4e0, 0.9, dove); doveGlow.visible = false;
      K.tick((dt, t) => {
        if (!flying) { dove.position.set(cx, 1.12 + Math.abs(Math.sin(t * 2)) * 0.01, cz); dove.rotation.set(0, Math.sin(t * 0.7) * 0.6, 0); wings.forEach((w, i) => w.rotation.x = (i ? -1 : 1) * 0.15); return; }
        flyT += dt; const a = flyT * 0.75, rise = Math.min(1, flyT / 2);
        dove.position.set(ax + Math.cos(a) * 3.2 * rise + (cx - ax) * (1 - rise), 1.12 + rise * 4.6 + Math.sin(a * 2) * 0.3, -5.0 + Math.sin(a) * 2.6 * rise + (cz + 5.0) * (1 - rise));
        dove.rotation.set(0, -a - Math.PI / 2 * rise, 0.25 * rise); dove.scale.setScalar(1.8);
        wings.forEach((w, i) => w.rotation.x = (i ? -1 : 1) * Math.sin(t * 16) * 0.9);
      });
      K.tell('pomba', (live) => { doveGlow.visible = true; flying = true; flyT = live ? 0 : 3; door.rotation.y = -1.9; }, () => { doveGlow.visible = false; flying = false; flyT = 0; door.rotation.y = 0; dove.scale.setScalar(1); });
      // cordões de luz sobre a cerimônia
      K.bulbs([ax - 1.2, 2.6, az], [7.2, 2.4, -1.2], 12, 0.4); K.bulbs([ax + 1.2, 2.6, az], [14.2, 2.4, -1.2], 12, 0.4);
      for (const [x, z] of [[7.2, -1.2], [14.2, -1.2]]) { K.cyl(0.05, 0.06, 2.5, chestnut, x, 1.25, z, {}, 6); K.colR(x, z, 0.12); }
      // vagas: quem está em pé atrás das cadeiras e para foto no arco
      [[8.2, -0.9], [9.2, -0.8], [12.2, -0.9], [13.2, -0.8]].forEach(([x, z]) => K.slot(x, z, ax, az, 'talk'));
      K.slot(9.6, -6.6, ax, az, 'selfie');
    }

    // ------------------------------------------------------------ cavalete com o mapa de mesas (missão)
    { const ex = 6.0, ez = -0.9, g = K.group(ex, 0, ez, -0.15);
      for (const s of [-1, 1]) K.box(0.05, 1.8, 0.05, oakL, s * 0.45, 0.9, 0.05, { parent: g, rz: -s * 0.06 }); K.box(0.05, 1.7, 0.05, oakL, 0, 0.85, -0.35, { parent: g, rx: -0.25 });
      K.box(1.05, 0.04, 0.12, oakL, 0, 0.62, 0.12, { parent: g });
      const mapT = K.canvasTex(320, 420, (gg, w, h) => { gg.fillStyle = '#f6f1e4'; gg.fillRect(0, 0, w, h); gg.strokeStyle = '#9aa58a'; gg.lineWidth = 8; gg.strokeRect(10, 10, w - 20, h - 20); gg.fillStyle = '#6a8450'; gg.textAlign = 'center'; gg.font = 'italic 700 42px Georgia'; gg.fillText('Tavoli', w / 2, 66); const nm = ['Chianti', 'Siena', 'Lucca', 'Pisa', 'Arezzo', 'Volterra']; nm.forEach((n, i) => { const x = 30 + (i % 2) * 140, y = 100 + Math.floor(i / 2) * 100; gg.fillStyle = '#efe6d0'; gg.fillRect(x, y, 120, 84); gg.fillStyle = '#6a8450'; gg.font = '700 20px Georgia'; gg.fillText(n, x + 60, y + 22); gg.fillStyle = '#8a7a64'; for (let k = 0; k < 4; k++) gg.fillRect(x + 16, y + 34 + k * 11, 70 + (k * 13) % 20, 3); }); gg.fillStyle = '#e0a0a8'; gg.beginPath(); gg.arc(w / 2, 395, 8, 0, 7); gg.fill(); });
      K.box(0.9, 1.15, 0.03, oakL, 0, 1.25, 0.08, { parent: g });
      K.add(new T.PlaneGeometry(0.84, 1.1), K.texMat(mapT, { roughness: 0.9 }), 0, 1.25, 0.1, { parent: g, cast: false });
      const card = K.box(0.26, 0.18, 0.012, K.mat(0xf2ead0, { roughness: 0.8 }), 0.12, 0.98, 0.115, { parent: g, cast: false });
      for (let k = 0; k < 6; k++) K.sphere(0.05, k % 2 ? fl.white : fl.pink, -0.42 + k * 0.17, 1.82, 0.1, { parent: g, cast: false }, 6, 5);
      K.colR(ex, ez, 0.4);
      const cardM = card.material;
      K.tell('cartao', (live) => { card.material = K.glow(0xe0283a, 1.2); if (live) K.anim(0.8, e => { card.rotation.y = Math.PI * 2 * e; card.scale.setScalar(1 + e * 0.4); }); else { card.scale.setScalar(1.4); } card.rotation.z = 0.25; }, () => { card.material = cardM; card.rotation.set(0, 0, 0); card.scale.setScalar(1); });
    }

    // ------------------------------------------------------------ pista de dança de madeira, postes com luzes, acordeão
    { const woodTex = K.canvasTex(512, 512, (g, w, h) => { for (let j = 0; j < 16; j++) { let x = -R() * 120; while (x < w) { const L = 120 + R() * 160; g.fillStyle = sh('#b07a48', -20 + R() * 30); g.fillRect(x, j * 32, L, 31); g.fillStyle = 'rgba(60,30,10,.35)'; g.fillRect(x, j * 32 + 31, L, 1); g.fillRect(x + L - 1, j * 32, 1, 32); for (let k = 0; k < 5; k++) { g.fillStyle = 'rgba(80,40,20,.15)'; g.fillRect(x, j * 32 + 5 + k * 5, L, 1); } x += L; } } K.grain(g, w, h, 10); }, [2, 1.6]);
      K.box(6.0, 0.05, 4.6, K.texMat(woodTex, { roughness: 0.4, metalness: 0.05, envMapIntensity: 0.6 }), 0, 0.025, 3.9, { cast: false });
      for (const s of [-1, 1]) { K.box(6.1, 0.06, 0.08, chestnut, 0, 0.03, 3.9 + s * 2.32, { cast: false }); K.box(0.08, 0.06, 4.7, chestnut, s * 3.02, 0.03, 3.9, { cast: false }); }
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) K.slot(-2.1 + i * 1.4, 2.5 + j * 1.35, 0, 3.9, 'dance');
      const poles = [[-3.3, 1.35], [3.3, 1.35], [-3.3, 6.5], [3.3, 6.5]];
      for (const [x, z] of poles) { K.cyl(0.06, 0.08, 3.6, chestnut, x, 1.8, z, {}, 7); K.cyl(0.2, 0.22, 0.3, K.mat(0x8a8070), x, 0.15, z, {}, 10); K.colR(x, z, 0.16); }
      const P = poles.map(([x, z]) => [x, 3.5, z]);
      K.bulbs(P[0], P[1], 16, 0.4); K.bulbs(P[2], P[3], 16, 0.4); K.bulbs(P[0], P[2], 12, 0.35); K.bulbs(P[1], P[3], 12, 0.35); K.bulbs(P[0], P[3], 18, 0.6); K.bulbs(P[1], P[2], 18, 0.6);
      K.bulbs([pX[1], 2.95, pZ[1]], P[0], 12, 0.5); K.bulbs([pX[3], 2.95, pZ[1]], P[1], 12, 0.5);
      K.plight(0, 3.2, 3.9, 0xffd090, 1.5, 9); K.pool(0, 3.9, 3.4, 0xffb070, 0.22);
      // acordeão nas mãos do Peppino (objeto do cenário, o fole respira)
      const acc = K.group(-3.62, 1.08, 3.62, 1.45);
      const accRed = K.mat(0xa01828, { roughness: 0.25, metalness: 0.2 });
      for (const s of [-1, 1]) K.box(0.08, 0.36, 0.3, accRed, 0, 0, s * 0.17, { parent: acc, ry: Math.PI / 2 });
      K.box(0.03, 0.3, 0.04, M.white, 0.0, 0, 0.17 + 0.0, { parent: acc, ry: Math.PI / 2 }).position.set(0.15, 0, 0.17);
      const bel = K.group(0, 0, 0, 0, acc); for (let k = 0; k < 7; k++) K.box(0.03, 0.34, 0.28, k % 2 ? K.mat(0x1b1b1f) : K.mat(0xe8e0d0), -0.1 + k * 0.033, 0, 0, { parent: bel, cast: false }); bel.rotation.y = Math.PI / 2;
      K.tick((dt, t) => { bel.scale.x = 0.85 + Math.sin(t * 2.2) * 0.18; });
      // banquinho e cadeira da nonna
      K.chair(-4.75, 5.5, 1.15, { seat: K.mat(0x8a1f2a, { roughness: 0.85 }), frame: oakDark });
      K.cyl(0.18, 0.18, 0.04, oakL, -5.25, 0.46, 6.15, {}, 12); for (let k = 0; k < 3; k++) K.cyl(0.02, 0.02, 0.45, oakL, -5.25 + Math.cos(k * 2.1) * 0.12, 0.22, 6.15 + Math.sin(k * 2.1) * 0.12, {}, 5);
      K.cyl(0.1, 0.08, 0.08, K.glass, -5.25, 0.52, 6.15, { cast: false }, 8); K.colR(-4.85, 5.6, 0.4);
      // gente em volta da pista
      [[-4.6, 1.6], [4.0, 6.8], [-2.0, 7.2], [0.6, 7.3], [-4.4, 7.4], [4.2, 5.0]].forEach(([x, z]) => K.slot(x, z, 0, 3.9, 'talk'));
    }

    // ------------------------------------------------------------ bolo de casamento de cinco andares (missão)
    { const bx = 5.0, bz = 2.0;
      K.cyl(0.6, 0.6, 0.04, linen, bx, 0.76, bz, {}, 24); K.add(new T.CylinderGeometry(0.62, 0.72, 0.74, 24, 1, true), K.mat(0xfbf6ee, { roughness: 0.95 }), bx, 0.37, bz);
      K.add(new T.CylinderGeometry(0.63, 0.74, 0.5, 24, 1, true), K.mat(0xffffff, { transparent: true, opacity: 0.35, roughness: 0.9, side: T.DoubleSide }), bx, 0.5, bz, { cast: false });
      for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; K.sphere(0.05, k % 2 ? fl.pink : fl.white, bx + Math.cos(a) * 0.64, 0.74, bz + Math.sin(a) * 0.64, { cast: false }, 6, 5); }
      K.cyl(0.36, 0.36, 0.03, K.silver, bx, 0.795, bz, {}, 22);
      const tiers = [[0.34, 0.18], [0.28, 0.17], [0.22, 0.16], [0.16, 0.15], [0.11, 0.14]];
      const cakeM = K.mat(0xefe6d6, { roughness: 0.6 }), pearl = K.mat(0xf2ece0, { roughness: 0.25, metalness: 0.3 });
      const pivotY = 0.81 + 0.18 + 0.17 + 0.16;
      const upper = K.group(bx, pivotY, bz); let y = 0.81; let topY = 0;
      tiers.forEach(([r, h], i) => {
        const par = i >= 3 ? upper : K.root; const ox = i >= 3 ? 0 : bx, oz = i >= 3 ? 0 : bz;
        const y0 = y; if (i >= 3) y -= pivotY;
        K.cyl(r, r, h, cakeM, ox, y + h / 2, oz, { parent: par }, 24);
        K.torus(r, 0.012, pearl, ox, y + 0.012, oz, { parent: par, rx: Math.PI / 2, cast: false }, 4, 28); K.torus(r * 0.98, 0.008, K.mat(0xe8c8a0), ox, y + h * 0.6, oz, { parent: par, rx: Math.PI / 2, cast: false }, 4, 28);
        for (let k = 0; k < 4 + i; k++) { const a = k * 1.7 + i; K.sphere(0.032, (k + i) % 3 ? fl.blush : fl.pink, ox + Math.cos(a) * r, y + h * 0.4 + (k % 2) * 0.05, oz + Math.sin(a) * r, { parent: par, cast: false }, 6, 5); if (k % 2) K.add(new T.SphereGeometry(0.03, 5, 4).scale(1.6, 0.4, 0.8), fl.green, ox + Math.cos(a + 0.2) * r, y + h * 0.3, oz + Math.sin(a + 0.2) * r, { parent: par, cast: false }); }
        y = y0 + h; topY = y - pivotY;
      });
      // topo: os noivinhos
      const topper = K.group(0, topY, 0, 0, upper);
      K.cyl(0.025, 0.035, 0.1, K.mat(0xfbf8f2), -0.03, 0.05, 0, { parent: topper, cast: false }, 8); K.sphere(0.018, K.mat(0xf0c8a0), -0.03, 0.12, 0, { parent: topper, cast: false }, 6, 5);
      K.cyl(0.02, 0.022, 0.1, K.mat(0x8e9298), 0.03, 0.05, 0, { parent: topper, cast: false }, 8); K.sphere(0.018, K.mat(0xc89070), 0.03, 0.12, 0, { parent: topper, cast: false }, 6, 5);
      const heart = K.group(0, topY + 0.1, 0, 0, upper); const hm = K.glow(0xe0203a, 1.4); K.sphere(0.05, hm, -0.035, 0.03, 0, { parent: heart, cast: false }, 8, 6); K.sphere(0.05, hm, 0.035, 0.03, 0, { parent: heart, cast: false }, 8, 6); K.cone(0.075, 0.1, hm, 0, -0.035, 0, { parent: heart, rx: Math.PI, cast: false }, 8); heart.visible = false;
      // faca, pratinhos e garfos
      K.box(0.03, 0.004, 0.28, K.silver, bx + 0.42, 0.8, bz + 0.15, { ry: 0.5, cast: false }); K.box(0.04, 0.02, 0.1, K.mat(0xfbf8f0), bx + 0.5, 0.8, bz + 0.3, { ry: 0.5, cast: false });
      for (let k = 0; k < 6; k++) K.cyl(0.08, 0.07, 0.01, white, bx - 0.42, 0.8 + k * 0.012, bz + 0.2, { cast: false }, 14);
      K.colR(bx, bz, 0.5);
      K.plight(bx, 2.3, bz + 0.6, 0xffe0b0, 0.9, 5);
      const tiltUpper = (e) => { upper.rotation.z = 0.2 * e; upper.position.x = bx - 0.03 * e; };
      K.tell('bolo', (live) => { topper.visible = false; heart.visible = true; if (live) K.anim(1.0, e => { tiltUpper(e); heart.scale.setScalar(0.3 + e * 1.0); }); else { tiltUpper(1); heart.scale.setScalar(1.3); } }, () => { topper.visible = true; heart.visible = false; tiltUpper(0); heart.scale.setScalar(1); });
      K.slot(5.0, 0.95, bx, bz, 'selfie');
    }

    // ------------------------------------------------------------ poço de pedra com cata-vento (missão)
    { const wx = -9.6, wz = 3.6;
      K.lathe([[0, 0], [0.85, 0], [0.85, 0.85], [0.92, 0.9], [0.92, 1.0], [0.68, 1.0], [0.68, 0.2], [0, 0.2]], K.texMat(stoneTex([3, 0.6], '#c8a470', '#9a8060'), { roughness: 0.95 }), wx, 0, wz, {}, 20);
      K.cyl(0.67, 0.67, 0.02, K.mat(0x0a1418, { roughness: 0.1, metalness: 0.4 }), wx, 0.6, wz, { cast: false }, 18);
      for (const s of [-1, 1]) K.box(0.18, 1.9, 0.18, honeyS, wx + s * 0.78, 1.85, wz);
      K.box(1.8, 0.16, 0.24, chestnut, wx, 2.85, wz); K.cyl(0.06, 0.06, 1.5, oakDark, wx, 2.35, wz, { rz: Math.PI / 2 }, 8);
      K.cyl(0.006, 0.006, 1.1, K.mat(0x9a7a4a), wx, 1.8, wz, { cast: false }, 4);
      const bk = K.cyl(0.12, 0.09, 0.2, K.mat(0x7a5030), wx, 1.15, wz, {}, 10); K.add(new T.TorusGeometry(0.13, 0.008, 4, 10, Math.PI), K.iron, wx, 1.27, wz);
      K.box(0.4, 0.04, 0.04, K.iron, wx + 0.9, 2.35, wz); K.box(0.04, 0.25, 0.04, K.iron, wx + 1.1, 2.24, wz);
      // vasos de gerânio em volta
      for (let k = 0; k < 4; k++) { const a = k * 1.57 + 0.4, x = wx + Math.cos(a) * 1.05, z = wz + Math.sin(a) * 1.05; K.cyl(0.13, 0.1, 0.22, terra, x, 0.11, z, {}, 10); for (let j = 0; j < 6; j++) K.sphere(0.05, j % 2 ? K.mat(0xd8283a) : fl.green, x + Math.cos(j) * 0.07, 0.27 + (j % 2) * 0.04, z + Math.sin(j) * 0.07, { cast: false }, 6, 4); }
      K.colR(wx, wz, 0.95);
      // cata-vento com galo de cobre
      K.cyl(0.018, 0.018, 0.75, K.iron, wx, 3.3, wz, { cast: false }, 5);
      for (const [dx, dz, L] of [[1, 0, 'L'], [-1, 0, 'O'], [0, 1, 'S'], [0, -1, 'N']]) { K.box(Math.abs(dx) * 0.5 + 0.015, 0.015, Math.abs(dz) * 0.5 + 0.015, K.iron, wx + dx * 0.125, 3.25, wz + dz * 0.125, { cast: false }); K.sign(L, 0.1, 0.1, wx + dx * 0.3, 3.25, wz + dz * 0.3, { color: '#2a2a2e', size: 100, ry: Math.atan2(dx, dz) + Math.PI / 2 }); }
      const vane = K.group(wx, 3.62, wz);
      const roosterT = K.canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#b8743a'; g.beginPath(); g.moveTo(20, 90); g.quadraticCurveTo(10, 40, 40, 30); g.lineTo(50, 10); g.lineTo(58, 26); g.lineTo(68, 12); g.lineTo(70, 34); g.quadraticCurveTo(84, 42, 78, 60); g.lineTo(96, 58); g.quadraticCurveTo(120, 30, 118, 80); g.quadraticCurveTo(110, 100, 80, 100); g.lineTo(70, 118); g.lineTo(60, 100); g.lineTo(40, 100); g.closePath(); g.fill(); g.fillStyle = '#c8322f'; g.beginPath(); g.arc(52, 20, 6, 0, 7); g.fill(); });
      K.add(new T.PlaneGeometry(0.42, 0.42), K.mat(0xffffff, { map: roosterT, transparent: true, alphaTest: 0.4, side: T.DoubleSide, metalness: 0.6, roughness: 0.35 }), 0.06, 0.2, 0, { parent: vane, cast: false });
      K.box(0.7, 0.02, 0.02, K.metal(0xb8743a, 0.35), 0, 0, 0, { parent: vane, cast: false }); K.cone(0.05, 0.12, K.metal(0xb8743a, 0.35), 0.38, 0, 0, { parent: vane, rz: -Math.PI / 2, cast: false }, 4); K.box(0.02, 0.14, 0.14, K.metal(0xb8743a, 0.35), -0.34, 0, 0, { parent: vane, cast: false, rx: Math.PI / 4 });
      let spin = 0, spinRot = 0;
      K.tick((dt, t) => { if (spin) { spinRot += dt * 9; vane.rotation.y = spinRot; } else vane.rotation.y = 0.6 + Math.sin(t * 0.5) * 0.25 + Math.sin(t * 1.7) * 0.06; });
      K.tell('catavento', (live) => { spin = 1; }, () => { spin = 0; spinRot = 0; });
      K.plight(-10.0, 2.6, 6.0, 0xffc080, 1.0, 8);
      K.ringSlots(wx, wz, 3, 1.55, 'talk', 0, 1.9);
    }

    // ------------------------------------------------------------ carroça de feno (missão) e fardos
    { const cx0 = -11.6, cz = 7.45;
      const cart = K.group(cx0, 0, cz);
      K.box(2.7, 0.12, 1.4, oakL, 0, 0.72, 0, { parent: cart });
      for (const s of [-1, 1]) { K.box(2.7, 0.3, 0.06, oakL, 0, 0.92, s * 0.7, { parent: cart }); for (let k = 0; k < 6; k++) K.box(0.05, 0.5, 0.05, oakDark, -1.3 + k * 0.52, 0.95, s * 0.72, { parent: cart }); }
      K.box(0.06, 0.32, 1.4, oakL, -1.33, 0.92, 0, { parent: cart }); K.box(0.06, 0.32, 1.4, oakL, 1.33, 0.92, 0, { parent: cart });
      K.box(1.4, 0.07, 0.07, oakDark, 2.0, 0.58, 0.25, { parent: cart, rz: 0.25 }); K.box(1.4, 0.07, 0.07, oakDark, 2.0, 0.58, -0.25, { parent: cart, rz: 0.25 }); K.box(0.07, 0.07, 0.6, oakDark, 2.66, 0.42, 0, { parent: cart });
      const wheels = [];
      for (const [x, s] of [[-0.85, -1], [-0.85, 1], [0.85, -1], [0.85, 1]]) { const w = K.group(x, 0.48, s * 0.82, 0, cart); K.torus(0.46, 0.04, oakDark, 0, 0, 0, { parent: w }, 6, 22); K.cyl(0.08, 0.08, 0.16, oakDark, 0, 0, 0, { parent: w, rx: Math.PI / 2 }, 8); for (let k = 0; k < 8; k++) K.box(0.03, 0.88, 0.03, oakDark, 0, 0, 0, { parent: w, rz: k * Math.PI / 8 }); K.torus(0.47, 0.012, K.iron, 0, 0, 0, { parent: w, cast: false }, 4, 22); wheels.push(w); }
      // feno: monte arredondado + palhas soltas
      for (let k = 0; k < 7; k++) K.add(new T.SphereGeometry(0.45, 9, 7).scale(1.2, 0.6, 1.1), hay, -1.0 + k * 0.33, 1.05 + Math.sin(k) * 0.08, (R() - 0.5) * 0.3, { parent: cart });
      const straws = []; for (let k = 0; k < 140; k++) straws.push([cx0 - 1.3 + R() * 2.6, 1.15 + R() * 0.3, cz + (R() - 0.5) * 1.3, R() * 6, 1, (R() - 0.5) * 1.5, (R() - 0.5) * 1.5]);
      const strawIM = K.inst(new T.CylinderGeometry(0.006, 0.006, 0.3, 3), hay, straws, { cast: false });
      // guirlanda e placa "Sposi"
      K.sign('Just Sposi', 0.9, 0.3, 0, 0.95, 0.74, { parent: cart, color: '#5a3a1a', bg: '#f2e6c8', size: 64, w: 320, h: 110 });
      for (let k = 0; k < 9; k++) K.sphere(0.05, k % 3 ? fl.white : fl.pink, -1.2 + k * 0.3, 1.1 - Math.sin(k / 8 * Math.PI) * 0.15, 0.75, { parent: cart, cast: false }, 6, 4);
      // alavanca do freio
      const lever = K.group(1.0, 0.75, 0.78, 0, cart); K.box(0.04, 0.6, 0.04, K.iron, 0, 0.3, 0, { parent: lever }); K.sphere(0.04, K.mat(0xb01e2a), 0, 0.62, 0, { parent: lever }, 6, 5); lever.rotation.z = 0.3;
      // fardo de feno em cima (cai quando a carroça anda)
      const bale = K.group(cx0 - 0.7, 1.45, cz);
      K.box(0.9, 0.4, 0.5, hay, 0, 0, 0, { parent: bale }); for (const dx of [-0.25, 0.25]) K.box(0.02, 0.42, 0.52, K.mat(0x8a5a2a), dx, 0, 0, { parent: bale, cast: false });
      K.col(cx0 - 1.45, cz - 0.9, cx0 + 1.45, cz + 0.9);
      const setCart = (e, b) => { cart.position.x = cx0 + 0.9 * e; strawIM.position.x = 0.9 * e; wheels.forEach(w => w.rotation.z = -0.9 * e / 0.46); lever.rotation.z = 0.3 - 0.9 * Math.min(1, e * 3); bale.position.set(cx0 - 0.7 - 0.9 * b, 1.45 - 1.22 * b * b, cz + 0.2 * b); bale.rotation.set(0, 0.4 * b, 1.2 * b); };
      K.tell('carroca', (live) => { if (live) K.anim(2.0, (e, u) => setCart(e, Math.max(0, Math.min(1, (u - 0.3) / 0.5)))); else setCart(1, 1); }, () => setCart(0, 0));
      // fardos para sentar
      for (const [x, z, ry] of [[-7.4, 8.9, 0.1], [-6.0, 9.1, -0.1], [-12.9, 5.4, 1.4]]) { K.box(1.0, 0.45, 0.55, hay, x, 0.225, z, { ry }); for (const d of [-0.3, 0.3]) K.box(0.02, 0.47, 0.57, K.mat(0x8a5a2a), x + Math.cos(ry) * d, 0.225, z - Math.sin(ry) * d, { ry, cast: false }); K.slot(x, z, x, z - 2, 'sit'); }
      K.col(-13.25, 4.8, -12.55, 6.0);
      // placa de boas-vindas num barril
      upBarrel(-6.6, 7.4, false); { const w = K.canvasTex(320, 220, (g, ww, hh) => { g.fillStyle = '#efe4c8'; g.fillRect(0, 0, ww, hh); g.strokeStyle = '#8a6a44'; g.lineWidth = 10; g.strokeRect(5, 5, ww - 10, hh - 10); g.fillStyle = '#6a8450'; g.textAlign = 'center'; g.font = 'italic 700 40px Georgia'; g.fillText('Benvenuti', ww / 2, 70); g.fillStyle = '#5a3a1a'; g.font = '700 34px Georgia'; g.fillText('Giulia & Matteo', ww / 2, 130); g.font = '22px Georgia'; g.fillText('10 · ottobre', ww / 2, 180); });
        K.box(0.66, 0.46, 0.04, oakDark, -6.6, 1.32, 7.42, { rx: -0.25 }); K.add(new T.PlaneGeometry(0.6, 0.41), K.texMat(w), -6.6, 1.32, 7.45, { rx: -0.25, cast: false }); }
    }

    // ------------------------------------------------------------ mesas de canto (frente à direita), a Vespa dos noivos
    for (const [x, z, n] of [[9.4, 4.6, 3], [12.6, 4.0, 3], [10.2, 7.8, 3], [12.9, 7.4, 3], [-9.2, -0.7, 3]]) K.table(x, z, { r: 0.45, h: 1.02, cloth: K.mat(0xb8c4a6, { roughness: 0.95 }), flower: R() < 0.5 ? 0xf4a6b8 : 0xfbf8f0, slots: n });
    { const g = K.group(7.6, 0, 8.6, 0.5), cream = K.mat(0xeee0c0, { roughness: 0.35, metalness: 0.2 });
      K.add(new T.SphereGeometry(0.3, 12, 8).scale(1.5, 1, 0.9), cream, -0.25, 0.48, 0, { parent: g }); K.box(0.5, 0.08, 0.3, K.mat(0x6a4024, { roughness: 0.6 }), -0.25, 0.78, 0, { parent: g });
      K.box(0.12, 0.6, 0.32, cream, 0.38, 0.5, 0, { parent: g, rz: -0.25 }); K.cyl(0.015, 0.015, 0.5, K.silver, 0.5, 1.0, 0, { parent: g, rx: Math.PI / 2 }, 6); K.sphere(0.06, K.glow(0xfff0c0, 1.2), 0.55, 0.88, 0, { parent: g, cast: false }, 8, 6);
      for (const x of [-0.5, 0.42]) { K.torus(0.15, 0.05, M.black, x, 0.17, 0, { parent: g }, 6, 16); K.cyl(0.08, 0.08, 0.09, K.silver, x, 0.17, 0, { parent: g, rx: Math.PI / 2 }, 8); }
      K.box(0.28, 0.2, 0.02, M.white, -0.62, 0.62, 0, { parent: g, ry: Math.PI / 2, cast: false });
      const cans = []; for (let k = 0; k < 4; k++) cans.push(K.cyl(0.04, 0.04, 0.1, K.silver, -0.85 - k * 0.22, 0.05, (k % 2 - 0.5) * 0.25, { parent: g, rz: Math.PI / 2 }, 8));
      K.sign('Just Married', 0.5, 0.14, -0.66, 0.42, 0, { parent: g, ry: -Math.PI / 2, color: '#c8322f', size: 64, bg: '#ffffff', w: 360, h: 100 });
      K.colR(7.6, 8.6, 0.6);
      K.slot(6.8, 7.8, 7.6, 8.6, 'selfie');
    }

    // ------------------------------------------------------------ parapeito da frente e muros baixos laterais
    { K.box(29.6, 0.55, 0.4, honeyS, 0, 0.275, 10.35); K.box(29.8, 0.08, 0.5, travert, 0, 0.59, 10.35, { cast: false });
      for (const x of [-14.6, -9.8, -4.9, 0, 4.9, 9.8, 14.6]) { K.box(0.6, 0.85, 0.6, honeyS, x, 0.42, 10.35); K.box(0.7, 0.08, 0.7, travert, x, 0.88, 10.35); K.lathe([[0, 0], [0.12, 0], [0.22, 0.25], [0.26, 0.4], [0.22, 0.45], [0, 0.45]], terra, x, 0.92, 10.35, {}, 12); K.sphere(0.2, K.mat(0x5a7a3a), x, 1.45, 10.35, {}, 8, 6); }
      for (const s of [-1, 1]) { const z0 = s < 0 ? -6.5 : -10.6, len = 10.6 - z0; K.box(0.4, 0.65, len, honeyS, s * 14.85, 0.325, (z0 + 10.6) / 2); K.box(0.5, 0.06, len, travert, s * 14.85, 0.68, (z0 + 10.6) / 2, { cast: false }); }
      [-12.0, -7.6, -1.6, 1.6, 6.4, 11.6].forEach(x => K.slot(x, 9.55, x, 14, 'view'));
      K.slot(14.0, 6.0, 20, 6, 'view'); K.slot(14.0, -6.2, 20, -6.2, 'view');
    }
    // vagas de conversa espalhadas
    [[-1.2, 0.1], [1.0, 0.2], [-3.0, -0.1], [2.6, 0.9], [-8.6, -2.6], [-6.4, -7.4], [6.8, -7.4], [8.2, 2.4], [-11.2, 1.8], [10.8, 1.6], [-2.4, 8.6], [-0.4, -7.6]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), z + (R() - 0.5), 'talk'));
    K.slot(-5.6, -7.6, -5.6, -9.3, 'bar');

    // ------------------------------------------------------------ andorinhas, pétalas no chão, vaga-lumes da hora dourada
    { const birds = []; for (let k = 0; k < 9; k++) { const g = K.group(0, 0, 0); for (const s of [-1, 1]) K.add(new T.PlaneGeometry(0.28, 0.07).translate(0.14 * s, 0, 0), K.mat(0x1e1e24, { side: T.DoubleSide }), 0, 0, 0, { parent: g, cast: false, rz: s * 0.3 }); birds.push(g); }
      K.tick((dt, t) => birds.forEach((b, k) => { const a = t * (0.35 + k * 0.03) + k * 0.7, r = 8 + (k % 3) * 4; const cx = k < 5 ? 0 : 7, cz = k < 5 ? -6 : 46, cy = k < 5 ? 10 + (k % 3) : 22; b.position.set(cx + Math.cos(a) * r, cy + Math.sin(a * 2.3) * 1.2, cz + Math.sin(a) * r * 0.6); b.rotation.y = -a; b.children.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * (0.2 + Math.sin(t * 12 + k) * 0.4)); }));
      const pet = []; for (let k = 0; k < 260; k++) { const x = -3 + R() * 6, z = 1.5 + R() * 4.8; if (R() < 0.5) pet.push([x, 0.06, z, R() * 6]); else pet.push([-14 + R() * 28, 0.02, -1 + R() * 10, R() * 6]); }
      K.inst(new T.CircleGeometry(0.025, 5).rotateX(-Math.PI / 2), K.mat(0xfbf0f2, { roughness: 0.8 }), pet, { cast: false });
    }
    // ------------------------------------------------------------ borboletas nas lavandas: fogem quando alguém passa e voltam
    K.borboletas({ pontos: [[-7.6, -5.6], [5.2, -5.6], [-7.6, -0.8], [8.2, 9.5], [-8.6, 9.5], [14.0, 2.4]], y: 0.7, n: 4, tam: 1.5, cores: [0xf6f2e6, 0xf2b630, 0xe87a30] });
    // ------------------------------------------------------------ balão de ar quente subindo devagar atrás da villa, com o maçarico
    // acendendo de vez em quando; sai do vale, sobe até sumir no alto e recomeça (ciclo de 4 min)
    { const gomos = K.canvasTex(256, 128, (c, w, h) => { const cs = ['#d8402a', '#f2c14e', '#2a6aa8', '#f6efe0', '#d8402a', '#3a8a5a', '#f2c14e', '#f6efe0']; for (let k = 0; k < 16; k++) { c.fillStyle = cs[k % cs.length]; c.fillRect(k * w / 16, 0, w / 16 + 1, h); } c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(0, h * 0.78, w, 3); c.fillRect(0, h * 0.22, w, 3); }, [1, 1]);
      const bal = K.group(0, -40, 0); bal.name = 'balao';
      K.add(new T.LatheGeometry([[0, -3.4], [0.9, -3.1], [2.2, -1.6], [3.3, 0.3], [3.5, 1.6], [3.1, 2.9], [2.1, 3.8], [0, 4.2]].map(([x, y]) => new T.Vector2(x, y)), 16), K.texMat(gomos, { roughness: 0.7 }), 0, 4.6, 0, { parent: bal, cast: false });
      K.box(1.1, 0.8, 1.1, K.mat(0x8a5a30, { roughness: 0.9 }), 0, 0, 0, { parent: bal, cast: false });
      for (const [x, z] of [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]]) K.box(0.03, 1.4, 0.03, K.mat(0x3a3028), x * 1.3, 1.0, z * 1.3, { parent: bal, cast: false });
      const chama = K.cone(0.22, 0.9, K.glow(0xffa040, 3), 0, 1.25, 0, { parent: bal, cast: false }, 8), luz = K.halo(0, 1.6, 0, 3.2, 0xffa040, 1.4, bal);
      const ciclo = 240, xs = -34, zs = -70;
      K.tick((dt, t) => { const u = (t % ciclo) / ciclo, k = Math.floor(t / ciclo);
        bal.position.set(xs + u * 22 + Math.sin(t * 0.05) * 1.5, -14 + u * 70, zs - (k % 2) * 8); bal.rotation.y = t * 0.02;
        const fogo = Math.sin(t * 0.7) > 0.55 || (t % 13) < 1.2; chama.visible = fogo; luz.visible = fogo; if (fogo) chama.scale.set(1, 0.8 + Math.sin(t * 31) * 0.25, 1); });
    }
    // brilho geral (manchas de luz quente no chão)
    K.pool(-1.2, -3.2, 4.2, 0xffc080, 0.18); K.pool(10.6, -6.2, 2.2, 0xffd0a0, 0.2); K.pool(-9.6, 3.6, 2.2, 0xffb070, 0.15); K.pool(-11.0, -7.8, 2.4, 0xffb060, 0.25);
    // menos reflexo da sala neutra: a sombra pega o azul do céu e o lado do sol fica dourado
    K.reflexo(0.25);
    // velas, lampiões e fogo oscilando um pouco
    K.tremular({ amp: 0.08 });
    // poeira dourada flutuando na luz baixa sobre o pátio
    K.particles({ modo: 'paira', x0: -14, x1: 14, z0: -10, z1: 10, y0: 0.6, y1: 4.5, n: 90, cor: [0xffd890, 0xfff0c8, 0xffc070], tam: 0.03, vel: 0.15, balanco: 0.4, add: true, opacity: 0.5, pisca: 0.7 });
  },
  // ninho do sniper: ameias da torre de vigia medieval. Pedra arenítica irregular com argamassa, líquen laranja e uma
  // lagartixa tomando sol; mísulas de pedra na frente e hera subindo pela ameia da direita
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.95 }), stone = 0xa88c66;
    N.tampo(stone, { x0: -2.8, x1: 2.8, z0: -1.3, z1: -0.4, seed: 31, draw: (c, w, h, R) => {
      c.fillStyle = '#8a7458'; c.fillRect(0, 0, w, h);
      let x = 0; while (x < w) { const sw = 70 + R() * 120; let y = 0; while (y < h) { const sh = 40 + R() * 90; const v = 150 + R() * 40; c.fillStyle = `rgb(${v + 20},${v},${v - 34})`; c.beginPath(); c.moveTo(x + 3 + R() * 4, y + 3); c.lineTo(x + sw - 3, y + 2 + R() * 5); c.lineTo(x + sw - 4 - R() * 4, y + sh - 3); c.lineTo(x + 3, y + sh - 2 - R() * 5); c.closePath(); c.fill(); y += sh; } x += sw; }
      K.manchas(c, w, h, R, 160, ['90,70,50', '220,200,170'], 3, 22, 0.25);
      for (let k = 0; k < 26; k++) { c.fillStyle = R() < 0.6 ? 'rgba(214,150,40,.55)' : 'rgba(170,180,140,.5)'; c.beginPath(); c.arc(R() * w, R() * h, 3 + R() * 9, 0, 7); c.fill(); }
      c.save(); c.translate(w * 0.14, h * 0.45); c.rotate(-0.4); c.fillStyle = '#5a7a3a'; c.beginPath(); c.ellipse(0, 0, 20, 6, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(24, 0, 7, 5, 0, 0, 7); c.fill();
      c.strokeStyle = '#5a7a3a'; c.lineWidth = 3; c.beginPath(); c.moveTo(-18, 0); c.quadraticCurveTo(-40, 8, -52, -4); c.stroke(); c.lineWidth = 2; for (const [a, b] of [[8, 1], [8, -1], [-10, 1], [-10, -1]]) { c.beginPath(); c.moveTo(a, 0); c.lineTo(a + 6, b * 13); c.stroke(); } c.restore();
      c.fillStyle = 'rgba(255,240,210,.25)'; c.fillRect(0, 0, w, 6); K.grain(c, w, h, 20);
    } });
    N.box(5.8, 0.12, 1.0, 0x9a8060, 0, -0.97, -1.1).box(5.6, 3.4, 0.9, 0x9a8060, 0, -2.75, -0.95);
    for (let x = -2.5; x <= 2.51; x += 0.55) N.box(0.26, 0.2, 0.45, 0x8a7050, x, -1.13, -1.62);
    const R = K.rng(33);
    for (const sx of [-1, 1]) { N.box(0.9, 1.9, 0.82, stone, sx * 2.3, 0.16, -0.87); for (let k = 0; k < 6; k++) N.box(0.2 + R() * 0.3, 0.02, 0.01, 0x6a5440, sx * 2.3 + (R() - 0.5) * 0.3, -0.6 + k * 0.32, -1.285); }
    for (let k = 0; k < 40; k++) N.geo(new T.SphereGeometry(0.04 + R() * 0.03, 5, 3), R() < 0.5 ? 0x2f5a2a : 0x3f7a35, 1.95 + R() * 0.7, -0.7 + Math.pow(R(), 0.7) * 1.7, -1.22);
    N.fim();
  },
});
