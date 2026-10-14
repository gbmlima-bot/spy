// 06 · Bloco em Santa Teresa: um bloco de carnaval desce a ladeira do bonde no fim de tarde, Rio de Janeiro.
// Dois níveis: a rua de paralelepípedos com os trilhos e o bondinho amarelo parado (nível 0) e o largo do mirante (nível 1),
// ligados por uma escadaria de azulejos no estilo Selarón. O sniper está na torre da igrejinha no morro em frente.
// Todo mundo fantasiado, confete no ar: o sniper precisa ler fantasias, gestos e as mudanças que as missões deixam na rua.
MIRA_CENARIOS.push({
  id: 'carnaval',
  nome: 'Bloco em Santa Teresa',
  lugar: 'Ladeira do bonde, Santa Teresa, Rio de Janeiro',
  hora: 'fim de tarde de carnaval',
  resumo: 'O bloco desce a ladeira de paralelepípedos: bateria, carro de som, bondinho amarelo parado nos trilhos, churrasquinho na brasa e a escadaria de azulejos subindo até o mirante sobre a Baía de Guanabara. Confete pra todo lado.',
  sniper: { pos: [-4, 15, 50], desc: 'torre da igrejinha no morro em frente, entre os sinos' },
  niveis: [
    { nome: 'ladeira do bonde', y: 0, x0: -14.5, x1: 14.5, z0: -6.4, z1: 10 },
    { nome: 'largo do mirante', y: 2.8, x0: -9.2, x1: 9.2, z0: -12.6, z1: -7.1 },
  ],
  escadas: [{ de: 0, para: 1, a: [-3.8, -5.8], b: [-3.8, -10.9], rotulo: 'escadaria de azulejos' }],
  convidados: 28,
  inicio: [0.4, 6.4, 0],
  ambiente: {
    ceu: ['#3d4f93', '#8a6fae', '#ee8f78', '#ffcf8f'], neblina: [0xeab08e, 90, 430], hemi: [0xa8b4e8, 0x6a4a34, 0.42],
    sol: [0xffa868, 1.25, -20, 15, 17], preenche: [0xff9070, 0.22], exposicao: 0.88, bloom: 0.32, semReflexo: true,
  },
  guardaRoupa: {
    ternos: [[0xc8322f, 'camisa vermelha do bloco'], [0x1f9a6a, 'abadá verde do bloco'], [0xffd23f, 'abadá amarelo'], [0xf6f3ec, 'camisa branca'], [0x2e5fa8, 'camisa azul'], [0xff5da2, 'camisa rosa-choque'], [0x6b3f8c, 'camisa roxa'], [0xff7a2a, 'camisa laranja']],
    vestidos: [[0xff3d7f, 'vestido rosa de paetê'], [0xffd23f, 'vestido amarelo de chita'], [0x2ec4b6, 'vestido turquesa'], [0xc8322f, 'vestido vermelho de bolinha'], [0xf6f3ec, 'vestido branco'], [0x9b5de5, 'vestido lilás'], [0x1f9a6a, 'vestido verde do bloco']],
    vestidoChance: 0.48, longo: 0.12, taca: 0.55, tacas: ['tumbler', 'tumbler', 'tumbler', 'wine'], drinks: [0xf2c14e, 0xf2c14e, 0xc8e070, 0xffd9a0, 0xff7a2a],
    extra(o, r) {
      const pk = (a) => a[Math.floor(r() * a.length)], q = r();
      if (q < 0.12) { o.main = 0xf6f3ec; o.pants = o.dress ? o.pants : 0xf6f3ec; if (!o.dress) o.stripes = 0x1f3a8a; o.hat = 'cap'; o.hatColor = 0xf6f3ec; o.hatBand = 0x1f3a8a; o.name = o.dress ? 'fantasia de marinheira, quepe branco' : 'fantasia de marinheiro, camisa listrada'; }
      else if (q < 0.21) { o.hat = 'tricorn'; o.hatColor = 0x16161a; o.mask = 'domino'; o.maskColor = 0x16161a; o.sash = 0xc8322f; if (!o.dress) { o.main = 0x1b1b1f; o.stripes = 0xf6f3ec; } o.name = o.dress ? 'fantasia de pirata, faixa vermelha' : 'fantasia de pirata, tapa-olho e tricórnio'; }
      else if (q < 0.33) { o.lei = pk([0xff5d8f, 0xffd23f, 0xff7a2a, 0xf6f3ec, 0x9b5de5]); o.hat = 'boater'; o.hatColor = 0xe9d79a; o.hatBand = pk([0xc8322f, 0x1f9a6a, 0xff5d8f]); o.name += ', fantasia de havaiano, colar de flores'; }
      else if (q < 0.43) { o.hat = 'feathers'; o.hatColor = pk([0xff3d7f, 0x2ec4b6, 0xffd23f, 0x9b5de5]); o.name += ', cocar de plumas'; }
      else if (q < 0.51) { o.glasses = 'sun'; o.earring = true; o.accent = 0xd9a441; o.name += ', óculos escuros e glitter'; }
      else if (q < 0.59) { o.hat = 'boater'; o.hatColor = 0xe2c98a; o.hatBand = 0x8b1e2d; o.name += ', chapéu de palha'; }
      else if (q < 0.65) { o.hat = 'flower'; o.hatColor = pk([0xff5d8f, 0xffd23f, 0xff7a2a]); o.name += ', flor no cabelo'; }
      else if (q < 0.70) { o.hat = 'tiara'; o.mask = 'domino'; o.maskColor = pk([0xff3d7f, 0xd9a441, 0x2ec4b6]); o.name += ', máscara colorida e tiara'; }
      else if (q < 0.74) { o.hat = 'cowboy'; o.hatColor = 0x8a5a2a; o.scarf = 0xc8322f; o.name += ', fantasia de caubói'; }
      else if (q < 0.77) { o.hat = 'chef'; o.apron = 0xf6f3ec; o.name += ', fantasia de cozinheiro'; }
      else if (q < 0.80) { o.hat = 'turban'; o.hatColor = pk([0xffd23f, 0xff5d8f]); o.name += ', turbante de baiana'; }
      if (r() < 0.16) { o.lei = o.lei || pk([0xff5d8f, 0xffd23f, 0xf6f3ec]); if (!/colar/.test(o.name)) o.name += ', colar de flores'; }
      if (o.dress && r() < 0.18) { o.propL = 'fan'; o.propColor = pk([0xff3d7f, 0xffd23f, 0x2ec4b6]); o.clutch = false; o.name += ', leque'; }
      else if (!o.dress && r() < 0.1) { o.propL = 'tambourine'; o.name += ', pandeiro'; }
    },
  },
  elenco: [
    { x: 1.0, z: 2.1, rot: 0.9, anim: 3, fala: 'Cortejo bonito é o que nunca deixa a bandeira tocar o chão.', outfit: { dress: false, main: 0xf6f3ec, pants: 0xf6f3ec, shirt: 0xe8c25a, tie: 0xd9a441, bow: true, coat: 0xf6f3ec, gloves: 0xffffff, skin: 4, hair: 0x1a1411, hairStyle: 'short', hat: 'tricorn', hatColor: 0xf6f3ec, hatBand: 0xd9a441, stripes: 0xd9a441, propL: 'fan', propColor: 0xd9a441, accent: 0xd9a441, name: 'mestre-sala Seu Jorjão, de casaca branca bordada a ouro e bicorne' } },
    { x: 2.7, z: 2.8, rot: -2.2, anim: 3, fala: 'Essa bandeira já subiu essa ladeira quarenta carnavais.', outfit: { dress: true, gown: true, satin: true, main: 0x1f9a6a, skirt: 0x1f9a6a, accent: 0xd9a441, necklace: true, earring: true, gloves: 0xffffff, skin: 5, hair: 0x1a1411, hairStyle: 'bun', hat: 'tiara', prop: 'umbrella', propColor: 0xffd23f, name: 'porta-bandeira Dona Celeste, de saia rodada verde e o pavilhão amarelo do bloco' } },
    { x: -1.9, z: 3.7, rot: 0.3, anim: 3, fala: 'Samba no pé não se ensina, se herda!', outfit: { dress: true, gown: false, satin: true, main: 0xffd23f, accent: 0xff3d7f, necklace: true, earring: true, shoe: 0xd9a441, skin: 3, hair: 0x2a1a12, hairStyle: 'long', hat: 'feathers', hatColor: 0xff3d7f, name: 'passista Jéssica, de cocar de plumas e paetê dourado' } },
    { x: -6.3, z: -1.0, rot: 0.4, anim: 14, fala: 'Tamborim é o tempero: sem ele o samba fica sem sal.', outfit: { dress: false, main: 0x1f9a6a, pants: 0xf6f3ec, shirt: 0xffd23f, tie: 0x1f9a6a, skin: 2, hair: 0x1a1411, beard: true, hat: 'fedora', hatColor: 0xf6f3ec, hatBand: 0x1f9a6a, prop: 'baton', propL: 'tambourine', name: 'ritmista Dudu do Tamborim, de camisa verde da bateria e panamá' } },
    { x: 2.25, z: -5.35, rot: 0.7, anim: 10, fala: 'Limão, cachaça e gelo. Açúcar é a gosto do freguês.', outfit: { dress: false, main: 0xf2efe8, pants: 0x3a4a6a, shirt: 0xf2efe8, tie: 0xf2efe8, skin: 4, hair: 0xa9a9a9, beard: true, apron: 0x2c9a4b, hat: 'cap', hatColor: 0xffd23f, hatBand: 0x2c9a4b, prop: 'shaker', name: 'Seu Valdir da caipirinha, de avental verde e boné amarelo' } },
    { x: 7.9, z: 1.9, rot: -0.6, anim: 3, fala: 'Bloco passa, eu passo junto. E a ladeira fica um brinco!', outfit: { dress: false, main: 0xff6a1a, pants: 0xff6a1a, shirt: 0xff6a1a, tie: 0xff6a1a, stripes: 0xdfeaea, skin: 5, hair: 0x1a1411, hat: 'cap', hatColor: 0xff6a1a, hatBand: 0xdfeaea, gloves: 0xf2c14e, prop: 'pole', name: 'gari Tião Vassoura, de uniforme laranja, sambando' } },
    { x: -9.0, z: 8.9, rot: 2.6, anim: 18, fala: 'Is this the line for the… cai-pi-ri-nha?', outfit: { dress: false, main: 0x2ec4b6, pants: 0xd8c8a0, shirt: 0xff7a2a, tie: 0xffd23f, skin: 0xf09a86, hair: 0xd9b46a, hairStyle: 'short', glasses: 'sun', hat: 'boater', hatColor: 0xe9d79a, hatBand: 0x2e5fa8, lei: 0xff5d8f, prop: 'camera', name: 'turista gringo Kevin, vermelho de sol, de camisa florida, colar havaiano e câmera' } },
    { x: 4.3, z: 7.45, rot: 0.5, anim: 13, fala: 'O bonde para, mas o samba não.', outfit: { dress: false, main: 0xf6f3ec, pants: 0xf6f3ec, shirt: 0xc8322f, tie: 0x16161a, skin: 4, hair: 0xa9a9a9, beard: true, hat: 'fedora', hatColor: 0xf6f3ec, hatBand: 0x16161a, prop: 'violin', pocket: 0xc8322f, name: 'Mestre Zé do Cavaco, de terno branco, encostado no estribo do bonde' } },
  ],
  missoes: [
    { k: 'estandarte', label: 'Trocar o estandarte do bloco', where: 'mastro ao lado da bateria', s: [1.7, -1.7], l: [0.9, -2.6] },
    { k: 'freio', label: 'Soltar o freio do bonde', where: 'bondinho amarelo, cabine da frente', s: [13.75, 5.7], l: [12.6, 5.7] },
    { k: 'som', label: 'Cortar o fio do carro de som', where: 'cabo do trio, junto ao poste da esquerda', s: [-9.2, -5.0], l: [-10.0, -5.4] },
    { k: 'surdo', label: 'Trocar o surdo de marcação', where: 'bateria, fileira de trás', s: [-5.6, -4.3], l: [-5.6, -3.3] },
    { k: 'fita', label: 'Amarrar as fitas no azulejo', where: 'alto da escadaria Selarón, no mirante', s: [-6.0, -8.7], l: [-5.3, -8.7], lv: 1 },
    { k: 'brasa', label: 'Apagar a brasa do churrasquinho', where: 'carrinho de churrasquinho, à direita', s: [11.4, -1.85], l: [11.4, -3.0] },
    { k: 'placa', label: 'Virar a placa da caipirinha', where: 'barraca de caipirinha, encostada no muro', s: [7.15, -4.2], l: [6.75, -5.0] },
    { k: 'pipa', label: 'Soltar a pipa do mirante', where: 'guarda-corpo do mirante, à direita', s: [7.3, -11.9], l: [7.3, -12.8], lv: 1 },
    { k: 'grafite', label: 'Assinar o grafite do muro', where: 'muro grafitado, à esquerda da escadaria', s: [-7.0, -5.65], l: [-7.0, -6.6] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r, root = K.root, L1 = 2.8;
    // ------------------------------------------------------------ utilidades
    const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
    const cat = (a, b, sag, n = 20) => { const p = []; for (let i = 0; i <= n; i++) { const u = i / n; p.push(new T.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u)); } return p; };
    const wireM = new T.LineBasicMaterial({ color: 0x141416 }), stringM = new T.LineBasicMaterial({ color: 0xf3ecdc });
    const wire = (a, b, sag, m = wireM, parent = root) => { const l = new T.Line(new T.BufferGeometry().setFromPoints(cat(a, b, sag)), m); parent.add(l); return l; };
    const tube = (pts, r, m, o = {}) => K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p => new T.Vector3(p[0], p[1], p[2]))), o.seg || 48, r, o.rs || 5, false), m, 0, 0, 0, { cast: o.cast !== false, parent: o.parent });
    const D = (o) => { o.userData.dyn = 1; return o; };
    const css = (c) => '#' + new T.Color(c).getHexString();
    const wood = K.mat(0x7a4a26, { roughness: 0.65 }), woodDark = K.mat(0x4a2e18, { roughness: 0.7 }), darkM = K.mat(0x1d1d20, { roughness: 0.55, metalness: 0.4 });
    const plaster = K.mat(0xe2c79a, { roughness: 0.9 }), stoneM = K.mat(0xb9ab94, { roughness: 0.9 }), concrete = K.mat(0xa8a49c, { roughness: 0.95 });
    const yel = K.mat(0xf2b81e, { roughness: 0.42, metalness: 0.1 }), redM = K.mat(0xb8262a, { roughness: 0.5 }), steel = K.metal(0x9a9ea6, 0.35);
    const whiteP = K.mat(0xf3efe6, { roughness: 0.6 }), greenIron = K.mat(0x1f3a2e, { roughness: 0.5, metalness: 0.5 });

    // ------------------------------------------------------------ texturas
    const cobTex = (rep) => K.canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#2e2a28'; g.fillRect(0, 0, w, h);
      const rows = 22, rh = h / rows;
      for (let j = 0; j < rows; j++) { let x = -(j % 2) * 22 - R() * 10; while (x < w) { const bw = 34 + R() * 22, v = 98 + R() * 52, wm = R() * 20; g.fillStyle = `rgb(${v + wm | 0},${v + wm * 0.55 | 0},${v - 6 | 0})`; rr(g, x + 3, j * rh + 3, bw - 6, rh - 6, 8); g.fill(); g.fillStyle = 'rgba(255,240,220,.09)'; rr(g, x + 6, j * rh + 4, bw - 12, (rh - 6) * 0.38, 5); g.fill(); x += bw; } }
      for (let k = 0; k < 40; k++) { g.fillStyle = 'rgba(40,60,30,.25)'; g.fillRect(R() * w, R() * h, 2 + R() * 30, 2); }
      K.grain(g, w, h, 16);
    }, rep);
    const calcTex = (rep, kind) => K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#6a645a'; g.fillRect(0, 0, w, h); const s = 11;
      for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
        const cx = x + s / 2, cy = y + s / 2; let dark;
        if (kind === 'onda') dark = Math.abs(((cy + Math.sin(cx / w * Math.PI * 4) * 46 + 512) % 128) - 64) < 20;
        else { const dx = (cx % 128) - 64, dy = (cy % 128) - 64, a = Math.atan2(dy, dx), rad = Math.hypot(dx, dy); dark = (rad < 48 && Math.cos(a * 4) > 0.2 && rad > 14) || rad < 7; }
        const v = dark ? 38 + R() * 26 : 214 + R() * 32;
        g.fillStyle = dark ? `rgb(${v | 0},${v | 0},${v + 4 | 0})` : `rgb(${v | 0},${v - 7 | 0},${v - 18 | 0})`;
        g.fillRect(x + 1 + R() * 1.5, y + 1 + R() * 1.5, s - 2.6, s - 2.6);
      }
      K.grain(g, w, h, 10);
    }, rep);
    const mosaic = (w, h, cell, pal, rep) => K.canvasTex(w, h, (g, W, H) => {
      g.fillStyle = '#d9d2c4'; g.fillRect(0, 0, W, H);
      for (let y = 0; y < H; y += cell) for (let x = 0; x < W; x += cell) {
        const c = pal[Math.floor(R() * pal.length)], q = R(), j = 1.5 + R();
        g.fillStyle = c; g.fillRect(x + j, y + j, cell - 2 * j, cell - 2 * j);
        if (q < 0.1) { g.fillStyle = '#f6f3ec'; g.beginPath(); g.arc(x + cell / 2, y + cell / 2, cell * 0.3, 0, 7); g.fill(); g.fillStyle = pal[Math.floor(R() * pal.length)]; g.beginPath(); g.arc(x + cell / 2, y + cell / 2, cell * 0.15, 0, 7); g.fill(); }
        else if (q < 0.17) { g.fillStyle = '#f2efe6'; g.fillRect(x + j, y + j, cell - 2 * j, cell - 2 * j); g.strokeStyle = '#2a4aa8'; g.lineWidth = Math.max(1.5, cell / 14); g.beginPath(); g.moveTo(x + cell / 2, y + 3); g.lineTo(x + cell - 3, y + cell / 2); g.lineTo(x + cell / 2, y + cell - 3); g.lineTo(x + 3, y + cell / 2); g.closePath(); g.stroke(); g.beginPath(); g.arc(x + cell / 2, y + cell / 2, cell * 0.12, 0, 7); g.stroke(); }
        else if (q < 0.21) { g.fillStyle = '#1f9a4a'; g.fillRect(x + j, y + j, cell - 2 * j, cell - 2 * j); g.fillStyle = '#ffd23f'; g.beginPath(); g.moveTo(x + cell / 2, y + 4); g.lineTo(x + cell - 4, y + cell / 2); g.lineTo(x + cell / 2, y + cell - 4); g.lineTo(x + 4, y + cell / 2); g.fill(); g.fillStyle = '#2a4aa8'; g.beginPath(); g.arc(x + cell / 2, y + cell / 2, cell * 0.16, 0, 7); g.fill(); }
        else if (q < 0.24) { g.fillStyle = '#1a1a1a'; g.font = `700 ${cell * 0.32 | 0}px sans-serif`; g.textAlign = 'center'; g.fillText(['RIO', 'LAPA', 'AMOR', 'BRASIL', '1990'][Math.floor(R() * 5)], x + cell / 2, y + cell * 0.6); }
        g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(x + j + 1, y + j + 1, cell - 2 * j - 4, Math.max(2, cell * 0.08));
      }
      K.grain(g, W, H, 10);
    }, rep);
    const selaronRed = ['#c8202a', '#d42a2a', '#b81e28', '#e03a2a', '#c8202a', '#a8182a', '#ffd23f', '#1f9a4a', '#2a4aa8', '#f2efe6'];
    const selaronMix = ['#c8202a', '#ffd23f', '#1f9a4a', '#2a4aa8', '#f2efe6', '#ff7a2a', '#e84a8a', '#c8202a', '#3ab0d8'];
    const winPath = (g, arch, x, y, w, h) => { g.beginPath(); if (arch) { g.moveTo(x, y + h); g.lineTo(x, y + w / 2); g.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); g.lineTo(x + w, y + h); } else g.rect(x, y, w, h); g.closePath(); };

    // ------------------------------------------------------------ chão: rua de paralelepípedos, trilhos e calçadas
    K.floor(-45, -4.6, 45, 8.4, cobTex([22.5, 3.25]), { m: { roughness: 0.85 } });
    // faixa de pedra ao longo dos trilhos
    K.box(90, 0.02, 1.9, K.mat(0x7a7268, { roughness: 0.9 }), 0, 0.006, 5.7, { cast: false });
    for (const z of [5.2, 6.2]) { K.box(90, 0.07, 0.07, steel, 0, 0.03, z, { cast: false }); K.box(90, 0.02, 0.03, darkM, 0, 0.055, z - 0.05, { cast: false }); }
    // calçada de trás (pedra portuguesa) e de frente
    K.floor(-45, -6.62, 45, -4.6, calcTex([22, 1], 'onda'), { y: 0.06, m: { roughness: 0.8 } }); K.box(90, 0.12, 0.14, stoneM, 0, 0.03, -4.6, { cast: false });
    K.floor(-45, 8.4, 45, 10.1, calcTex([22, 0.85], 'onda'), { y: 0.06, m: { roughness: 0.8 } }); K.box(90, 0.12, 0.14, stoneM, 0, 0.03, 8.4, { cast: false });
    // mureta da frente (o morro cai logo depois)
    K.box(90, 0.75, 0.32, plaster, 0, 0.4, 10.28); K.box(90, 0.08, 0.42, K.mat(0xd9cbb0, { roughness: 0.8 }), 0, 0.8, 10.28);
    { // muro de arrimo de pedra, com musgo escorrendo e trepadeira caindo da mureta
      const pedra = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#3a3428'; g.fillRect(0, 0, w, h);
        let y = 0; while (y < h) { const rh = 26 + R() * 30; let x = -R() * 40; while (x < w) { const rw = 40 + R() * 70, v = 110 + R() * 50; g.fillStyle = `rgb(${v},${v - 10},${v - 28})`; g.fillRect(x + 2, y + 2, rw - 4, rh - 4); x += rw; } y += rh; }
        for (let k = 0; k < 40; k++) { const x = R() * w, l = 30 + R() * 120, gr = g.createLinearGradient(0, 0, 0, l); gr.addColorStop(0, 'rgba(60,90,40,.7)'); gr.addColorStop(1, 'rgba(60,90,40,0)'); g.fillStyle = gr; g.save(); g.translate(x, 0); g.fillRect(0, 0, 6 + R() * 16, l); g.restore(); }
        K.grain(g, w, h, 18); }, [18, 1.2]);
      K.box(90, 6, 0.4, K.texMat(pedra, { roughness: 1 }), 0, -2.95, 10.6, { cast: false });
      const leaf = new T.PlaneGeometry(0.22, 0.16).translate(0, -0.08, 0), vines = [[], [], []];
      for (let x = -40; x < 40; x += 0.9 + R() * 2.4) { const len = 0.6 + R() * 2.6; for (let y = 0; y > -len; y -= 0.13) vines[(R() * 3) | 0].push([x + (R() - 0.5) * 0.3 + Math.sin(y * 3) * 0.08, 0.02 + y, 10.82 + R() * 0.03, (R() - 0.5) * 0.8, 0.7 + R() * 0.6, 0, (R() - 0.5) * 1.2]); }
      [0x2f6a2a, 0x3f8a34, 0x245a28].forEach((c, i) => K.inst(leaf, K.mat(c, { roughness: 0.8, side: T.DoubleSide }), vines[i], { cast: false }));
      // buganvílias floridas em alguns trechos
      const flor = []; for (let k = 0; k < 160; k++) { const x = -30 + R() * 60; if (Math.sin(x * 0.4) < 0.4) continue; flor.push([x, -R() * 1.2, 10.86 + R() * 0.04, R() * 6, 0.5 + R() * 0.5]); }
      K.inst(new T.IcosahedronGeometry(0.08, 0), K.mat(0xd02a8a, { roughness: 0.7 }), flor, { cast: false });
    }
    // bueiros, tampas e marcas na rua
    for (const [x, z] of [[-6.5, -4.3], [9.5, -4.3], [-12, 8.1]]) { K.box(0.8, 0.02, 0.3, darkM, x, 0.015, z, { cast: false }); for (let k = 0; k < 6; k++) K.box(0.03, 0.025, 0.24, K.mat(0x0a0a0a), x - 0.3 + k * 0.12, 0.02, z, { cast: false }); }
    K.cyl(0.32, 0.32, 0.02, K.metal(0x4a4a4e, 0.6), -1.2, 0.012, 1.0, { cast: false }, 18);

    // ------------------------------------------------------------ muro de arrimo + largo do mirante (nível 1) + escadaria Selarón
    const wallM = K.mat(0xd8b88a, { roughness: 0.92 });
    K.box(4.1, L1, 6.2, wallM, -7.25, L1 / 2, -9.7); K.box(11.7, L1, 6.2, wallM, 3.45, L1 / 2, -9.7); K.box(2.8, L1, 2.4, wallM, -3.8, L1 / 2, -11.6);
    const lv1Tex = calcTex([2, 3], 'rosa');
    K.add(new T.PlaneGeometry(4.1, 6.2).rotateX(-Math.PI / 2), K.texMat(lv1Tex, { roughness: 0.8 }), -7.25, L1 + 0.005, -9.7, { cast: false });
    const lv1TexB = calcTex([5.7, 3], 'rosa');
    K.add(new T.PlaneGeometry(11.7, 6.2).rotateX(-Math.PI / 2), K.texMat(lv1TexB, { roughness: 0.8 }), 3.45, L1 + 0.005, -9.7, { cast: false });
    K.add(new T.PlaneGeometry(2.8, 2.4).rotateX(-Math.PI / 2), K.texMat(lv1Tex, { roughness: 0.8 }), -3.8, L1 + 0.005, -11.6, { cast: false });
    // parapeito da frente do largo, com capa de azulejo
    const capTex = mosaic(512, 32, 16, selaronMix, [6, 1]);
    for (const [x0, x1] of [[-9.3, -5.2], [-2.4, 9.3]]) { const w = x1 - x0, cx = (x0 + x1) / 2; K.box(w, 0.9, 0.24, wallM, cx, L1 + 0.45, -6.74); K.add(new T.BoxGeometry(w + 0.04, 0.07, 0.32), K.texMat(capTex), cx, L1 + 0.93, -6.74); }
    // faixa do bloco pendurada no parapeito
    const faixaTex = K.canvasTex(1024, 128, (g, w, h) => {
      g.fillStyle = '#f6f1e2'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f9a6a'; g.fillRect(0, 0, w, 16); g.fillRect(0, h - 16, w, 16);
      g.font = '900 64px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 6; g.strokeStyle = '#1f9a6a'; g.strokeText('BLOCO LADEIRA ACIMA · DESDE 1987', w / 2, h / 2 + 3); g.fillStyle = '#ffd23f'; g.fillText('BLOCO LADEIRA ACIMA · DESDE 1987', w / 2, h / 2 + 3);
      for (let k = 0; k < 30; k++) { g.fillStyle = ['#ff3d7f', '#2ec4b6', '#ffd23f'][k % 3]; g.beginPath(); g.arc(R() * w, 8 + R() * 6, 3, 0, 7); g.fill(); }
    });
    { const f = K.add(new T.PlaneGeometry(7.6, 0.85, 12, 2), K.texMat(faixaTex, { side: T.DoubleSide, roughness: 0.85 }), 3.6, L1 + 0.42, -6.6, { cast: false }); const p = f.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 1.3) * 0.04 + (p.getY(i) < 0 ? 0.03 : 0)); p.needsUpdate = true; f.geometry.computeVertexNormals();
      for (const x of [-0.2, 7.4]) K.cyl(0.015, 0.015, 0.35, K.mat(0xc9b48a), x, L1 + 0.82, -6.6, { cast: false }, 4); }
    // escadaria: 14 degraus de 0.2 m, espelhos de mosaico colorido (cada degrau com um pedaço diferente da textura)
    { const n = 14, run = 3.8 / n, rise = L1 / n, z0 = -6.6, x0 = -3.8, w = 2.8;
      const riserTex = mosaic(512, 512, 24, selaronMix), treadTex = mosaic(512, 64, 20, selaronRed, [1, 1]);
      const riserM = K.texMat(riserTex, { roughness: 0.35, metalness: 0.05, envMapIntensity: 0.7 }), treadM = K.texMat(treadTex, { roughness: 0.4, envMapIntensity: 0.6 });
      for (let i = 0; i < n; i++) {
        const g = new T.PlaneGeometry(w, rise); const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setY(k, (i + uv.getY(k)) / n); uv.needsUpdate = true;
        K.add(g, riserM, x0, rise * (i + 0.5), z0 - run * i, { cast: false });
        K.add(new T.BoxGeometry(w, 0.05, run + 0.02), treadM, x0, rise * (i + 1) - 0.025, z0 - run * (i + 0.5));
        K.box(w, rise * (i + 1) - 0.05, run, K.mat(0x9a8a78), x0, (rise * (i + 1) - 0.05) / 2, z0 - run * (i + 0.5), { cast: false });
      }
      // paredes laterais cobertas de azulejo (vistas de dentro da escadaria)
      const sideTex = mosaic(512, 512, 22, selaronRed);
      for (const [x, ry] of [[-5.19, Math.PI / 2], [-2.41, -Math.PI / 2]]) K.add(new T.PlaneGeometry(3.85, L1 + 0.9), K.texMat(sideTex, { roughness: 0.4, envMapIntensity: 0.6 }), x, (L1 + 0.9) / 2, -8.5, { ry, cast: false });
      // muretas de azulejo em volta do vão no largo
      const capM = K.texMat(mosaic(256, 512, 22, selaronMix), { roughness: 0.45 });
      K.add(new T.BoxGeometry(0.22, 0.9, 3.9), capM, -5.31, L1 + 0.45, -8.55); K.add(new T.BoxGeometry(0.22, 0.9, 3.9), capM, -2.29, L1 + 0.45, -8.55);
      // pilastras de azulejo na boca da escadaria (na calçada)
      const pilM = K.texMat(mosaic(128, 512, 20, selaronMix), { roughness: 0.45 });
      for (const x of [-5.35, -2.25]) { K.box(0.32, L1 + 1.1, 0.32, pilM, x, (L1 + 1.1) / 2, -6.62); K.sphere(0.16, K.mat(0xf6f3ec, { roughness: 0.3 }), x, L1 + 1.25, -6.62); }
      K.col(-5.6, -6.4, -5.1, -6.3); K.col(-2.5, -6.4, -2.0, -6.3);
      // corrimão de ferro no meio da escada
      tube([[x0, 1.0, z0 + 0.05], [x0, L1 + 0.95, z0 - 3.85]], 0.025, K.iron, { seg: 4 });
      for (let i = 0; i <= 4; i++) K.cyl(0.018, 0.018, 0.95, K.iron, x0, rise * i * 3.5 + 0.48, z0 - i * 0.95, {}, 6);
      // placa de azulejo azul e branco
      K.sign('Escadaria do Bloco', 1.2, 0.36, -5.18, 2.2, -7.2, { ry: Math.PI / 2, bg: '#f3efe6', color: '#2a4aa8', size: 52, font: 'Georgia, serif' });
      K.col(-5.45, -10.45, -2.15, -7.0, 1);
    }
    // grafites no muro de arrimo (fachada voltada para a rua)
    const grafA = K.canvasTex(512, 352, (g, w, h) => { // retrato com flores
      g.fillStyle = '#2a7ab0'; g.fillRect(0, 0, w, h); const gr = g.createRadialGradient(250, 170, 20, 250, 170, 260); gr.addColorStop(0, '#ffd23f'); gr.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = '#5a3020'; g.beginPath(); g.ellipse(250, 180, 70, 92, 0, 0, 7); g.fill(); g.fillStyle = '#1a1010'; g.beginPath(); g.ellipse(250, 110, 110, 70, 0, Math.PI, 0); g.fill();
      g.fillStyle = '#ff3d7f'; g.beginPath(); g.ellipse(250, 70, 120, 40, 0, 0, 7); g.fill(); for (let k = 0; k < 9; k++) { g.fillStyle = ['#ffd23f', '#2ec4b6', '#ff7a2a'][k % 3]; g.beginPath(); g.arc(150 + k * 25, 60 + Math.sin(k) * 14, 14, 0, 7); g.fill(); }
      g.fillStyle = '#f6f3ec'; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(250 + s * 28, 170, 14, 8, 0, 0, 7); g.fill(); } g.fillStyle = '#1a1010'; for (const s of [-1, 1]) { g.beginPath(); g.arc(250 + s * 28, 170, 5, 0, 7); g.fill(); }
      g.fillStyle = '#c8202a'; g.beginPath(); g.ellipse(250, 228, 22, 9, 0, 0, 7); g.fill();
      for (let k = 0; k < 14; k++) { const x = R() * w, y = 220 + R() * 130; g.fillStyle = ['#ff3d7f', '#ffd23f', '#f6f3ec', '#2ec4b6'][k % 4]; for (let p = 0; p < 5; p++) { g.beginPath(); g.ellipse(x + Math.cos(p * 1.26) * 12, y + Math.sin(p * 1.26) * 12, 10, 5, p * 1.26, 0, 7); g.fill(); } g.fillStyle = '#3a7a2a'; g.fillRect(x - 2, y + 12, 4, 30); }
      g.font = 'italic 700 34px Georgia, serif'; g.fillStyle = '#f6f3ec'; g.fillText('Iemanjá', 360, 330); K.grain(g, w, h, 18);
    });
    K.add(new T.PlaneGeometry(4.0, 2.75), K.texMat(grafA, { roughness: 0.9 }), -7.25, 1.38, -6.585, { cast: false });
    const grafB = K.canvasTex(1024, 512, (g, w, h) => { // letras CARNAVAL em bolha
      g.fillStyle = '#e8d8b8'; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#3a1a6a'); gr.addColorStop(1, '#0a6a7a'); g.fillStyle = gr; rr(g, 10, 30, w - 20, h - 60, 40); g.fill();
      for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(255,255,255,${R() * 0.6})`; const x = R() * w, y = R() * h; g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 3, y); g.lineTo(x, y + 8); g.lineTo(x - 3, y); g.fill(); }
      g.font = '900 190px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.lineWidth = 34; g.strokeStyle = '#111'; g.strokeText('CARNAVAL', w / 2, h / 2 + 10); g.lineWidth = 18; g.strokeStyle = '#f6f3ec'; g.strokeText('CARNAVAL', w / 2, h / 2 + 10);
      const fg = g.createLinearGradient(0, h / 2 - 90, 0, h / 2 + 90); fg.addColorStop(0, '#ffd23f'); fg.addColorStop(0.5, '#ff7a2a'); fg.addColorStop(1, '#ff3d7f'); g.fillStyle = fg; g.fillText('CARNAVAL', w / 2, h / 2 + 10);
      g.font = '700 46px "Comic Sans MS", cursive'; g.fillStyle = '#2ec4b6'; g.fillText('é pra quem sobe a ladeira', w / 2, h - 70);
      for (let k = 0; k < 8; k++) { g.strokeStyle = '#ffd23f'; g.lineWidth = 3; g.beginPath(); g.moveTo(80 + k * 120, 70); g.lineTo(80 + k * 120 + 10, 50); g.stroke(); } K.grain(g, w, h, 14);
    });
    K.add(new T.PlaneGeometry(5.1, 2.5), K.texMat(grafB, { roughness: 0.9 }), 0.25, 1.35, -6.585, { cast: false });
    const grafC = K.canvasTex(256, 352, (g, w, h) => { // tucano entre folhas
      g.fillStyle = '#1f6a4a'; g.fillRect(0, 0, w, h); for (let k = 0; k < 18; k++) { g.fillStyle = ['#2c9a4b', '#5bbf4a', '#145a3a'][k % 3]; g.beginPath(); g.ellipse(R() * w, R() * h, 50, 16, R() * 3, 0, 7); g.fill(); }
      g.fillStyle = '#111'; g.beginPath(); g.ellipse(120, 200, 50, 80, 0.2, 0, 7); g.fill(); g.fillStyle = '#f6f3ec'; g.beginPath(); g.ellipse(132, 150, 30, 28, 0, 0, 7); g.fill();
      const bk = g.createLinearGradient(140, 120, 240, 160); bk.addColorStop(0, '#ffd23f'); bk.addColorStop(1, '#ff5a1a'); g.fillStyle = bk; g.beginPath(); g.moveTo(140, 130); g.quadraticCurveTo(230, 120, 250, 160); g.quadraticCurveTo(200, 165, 140, 160); g.fill();
      g.fillStyle = '#2ec4b6'; g.beginPath(); g.arc(135, 140, 9, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(135, 140, 4, 0, 7); g.fill(); K.grain(g, w, h, 18);
    });
    K.add(new T.PlaneGeometry(2.4, 2.6), K.texMat(grafC, { roughness: 0.9 }), 8.05, 1.35, -6.585, { cast: false });
    // missão: tag novo em rosa-neon por cima do retrato
    const tagTex = K.canvasTex(512, 256, (g, w, h) => {
      g.font = '900 150px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
      g.lineWidth = 26; g.strokeStyle = '#120a1a'; g.strokeText('XIS!', w / 2, h / 2); g.fillStyle = '#ff2fd0'; g.fillText('XIS!', w / 2, h / 2);
      g.strokeStyle = '#3affd0'; g.lineWidth = 8; g.beginPath(); g.moveTo(40, 210); g.quadraticCurveTo(250, 250, 470, 200); g.stroke();
      for (let k = 0; k < 40; k++) { g.fillStyle = '#ff2fd0'; g.fillRect(60 + R() * 400, 200 + R() * 50, 3, 3 + R() * 18); }
    });
    const tag = D(K.add(new T.PlaneGeometry(2.4, 1.2), new T.MeshBasicMaterial({ map: tagTex, transparent: true, opacity: 0, toneMapped: false, color: new T.Color(0xffffff).multiplyScalar(1.25), depthWrite: false }), -7.0, 1.55, -6.57, { cast: false }));
    const sprayCan = D(K.group(-6.6, 0, -6.2)); K.cyl(0.035, 0.035, 0.18, K.mat(0xff2fd0, { metalness: 0.5, roughness: 0.3 }), 0, 0.09, 0, { parent: sprayCan }, 10); K.cyl(0.012, 0.012, 0.03, M.white, 0, 0.195, 0, { parent: sprayCan }, 6);
    K.tell('grafite', (live) => { sprayCan.visible = true; if (live) K.anim(2.2, e => { tag.material.opacity = e; tag.scale.set(0.6 + e * 0.4, 0.6 + e * 0.4, 1); }); else { tag.material.opacity = 1; tag.scale.set(1, 1, 1); } }, () => { tag.material.opacity = 0; sprayCan.visible = false; });
    // primavera (buganvília) caindo pelo muro
    { const pinks = [[], []]; for (const [cx, n] of [[-8.7, 26], [-6.2, 14], [2.4, 22], [6.6, 18], [9.0, 20]]) for (let k = 0; k < n; k++) { const x = cx + (R() - 0.5) * 1.6, y = L1 + 0.95 - Math.pow(R(), 1.6) * 1.9, z = -6.5 + R() * 0.25; pinks[k % 2].push([x, y, z, R() * 6, 0.09 + R() * 0.08]); }
      K.inst(new T.IcosahedronGeometry(1, 0), K.mat(0xe0358a, { roughness: 0.8, flatShading: true }), pinks[0], { cast: false }); K.inst(new T.IcosahedronGeometry(1, 0), K.mat(0x3f7a34, { roughness: 0.85, flatShading: true }), pinks[1], { cast: false }); }

    // ------------------------------------------------------------ casarões coloniais (fundo, nos cantos) e casas térreas (laterais, baixas)
    const sacadaBars = [], urns = [];
    const casarao = (x0, x1, zf, depth, h, o) => {
      const w = x1 - x0, cx = (x0 + x1) / 2, floors = o.floors || 2, bays = o.bays || 3, fhW = h / floors;
      const tex = K.canvasTex(512, Math.round(512 * h / w), (g, W, H) => {
        g.fillStyle = o.base; g.fillRect(0, 0, W, H);
        for (let k = 0; k < 1500; k++) { g.fillStyle = R() < 0.5 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.06)'; g.fillRect(R() * W, R() * H, 2 + R() * 10, 2 + R() * 10); }
        for (let k = 0; k < 6; k++) { g.fillStyle = 'rgba(150,95,70,.28)'; g.beginPath(); g.ellipse(R() * W, H * 0.5 + R() * H * 0.5, 8 + R() * 26, 5 + R() * 14, R(), 0, 7); g.fill(); }
        const dg = g.createLinearGradient(0, H * 0.75, 0, H); dg.addColorStop(0, 'rgba(60,40,30,0)'); dg.addColorStop(1, 'rgba(60,40,30,.35)'); g.fillStyle = dg; g.fillRect(0, H * 0.75, W, H * 0.25);
        const PH = H / floors; g.fillStyle = o.trim;
        g.fillRect(0, 0, W, PH * 0.07); for (let f = 1; f < floors; f++) g.fillRect(0, f * PH - 5, W, 10);
        g.fillRect(0, 0, W * 0.05, H); g.fillRect(W * 0.95, 0, W * 0.05, H);
        g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, H - PH * 0.07, W, PH * 0.07);
        for (let f = 0; f < floors; f++) for (let b = 0; b < bays; b++) {
          const ground = f === floors - 1, door = ground && b === o.door, cxp = (b + 0.5) * W / bays, ww = W / bays * (door ? 0.5 : 0.42);
          const top = f * PH + PH * (door ? 0.14 : 0.2), bot = f * PH + PH * (ground ? 0.93 : 0.84), wh = bot - top, arch = ground || o.arch;
          g.fillStyle = o.trim; winPath(g, arch, cxp - ww / 2 - 8, top - 8, ww + 16, wh + 8); g.fill();
          g.save(); winPath(g, arch, cxp - ww / 2, top, ww, wh); g.clip();
          if (door) { g.fillStyle = o.doorC || '#6a3a1e'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3; for (const s of [0.25, 0.75]) { g.strokeRect(cxp - ww / 2 + ww * s - ww * 0.18, top + wh * 0.3, ww * 0.36, wh * 0.25); g.strokeRect(cxp - ww / 2 + ww * s - ww * 0.18, top + wh * 0.62, ww * 0.36, wh * 0.28); } g.fillStyle = '#d9a441'; g.fillRect(cxp + 4, top + wh * 0.58, 6, 6); }
          else if (R() < 0.35) { g.fillStyle = R() < 0.6 ? '#ffc979' : '#2a2220'; g.fillRect(0, 0, W, H); g.fillStyle = o.shut; g.fillRect(cxp - ww / 2, top, ww * 0.16, wh); g.fillRect(cxp + ww / 2 - ww * 0.16, top, ww * 0.16, wh); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(cxp - ww * 0.3, top + wh * 0.1, ww * 0.6, wh * 0.03); }
          else { g.fillStyle = o.shut; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(0,0,0,.28)'; for (let yy = top + 3; yy < bot; yy += 7) g.fillRect(cxp - ww / 2, yy, ww, 2.5); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(cxp - 1.5, top, 3, wh); }
          g.restore();
          if (ground && !door) { g.strokeStyle = '#222'; g.lineWidth = 3; for (let k = 1; k < 7; k++) { g.beginPath(); g.moveTo(cxp - ww / 2 + k * ww / 7, top + wh * 0.45); g.lineTo(cxp - ww / 2 + k * ww / 7, bot); g.stroke(); } g.beginPath(); g.moveTo(cxp - ww / 2, top + wh * 0.45); g.lineTo(cxp + ww / 2, top + wh * 0.45); g.stroke(); }
        }
        if (o.azulejo) { const at = H - PH * 0.07 - 26; for (let x = 0; x < W; x += 13) { g.fillStyle = (x / 13) % 2 ? '#2a4aa8' : '#f2efe6'; g.fillRect(x, at, 12, 12); g.fillStyle = (x / 13) % 2 ? '#f2efe6' : '#2a4aa8'; g.fillRect(x, at + 13, 12, 12); } }
        if (o.numero) { g.fillStyle = '#f2efe6'; g.fillRect(W * 0.07, H - PH * 0.5, 34, 24); g.fillStyle = '#2a4aa8'; g.font = '700 18px Georgia'; g.fillText(o.numero, W * 0.07 + 5, H - PH * 0.5 + 18); }
      });
      const sideM = K.mat(new T.Color(o.base).getHex(), { roughness: 0.9 }), fm = new T.MeshStandardMaterial({ map: tex, roughness: 0.85, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.05 });
      K.add(new T.BoxGeometry(w, h, depth), [sideM, sideM, sideM, sideM, fm, sideM], cx, h / 2, zf - depth / 2);
      const trimM = K.mat(new T.Color(o.trim).getHex(), { roughness: 0.7 });
      K.box(w + 0.3, 0.22, 0.32, trimM, cx, h - 0.1, zf + 0.04); K.box(w + 0.1, 0.55, 0.2, sideM, cx, h + 0.27, zf - 0.08); K.box(w + 0.22, 0.08, 0.28, trimM, cx, h + 0.56, zf - 0.08);
      for (let k = 0; k <= (o.urns ?? 2); k++) urns.push([x0 + 0.15 + k * (w - 0.3) / (o.urns ?? 2), h + 0.6, zf - 0.08]);
      const roofTex = K.canvasTex(256, 256, (g, W, H) => { g.fillStyle = '#8a3f24'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 16) for (let x = -(y / 16 % 2) * 12; x < W; x += 24) { g.fillStyle = `rgb(${150 + R() * 40 | 0},${70 + R() * 25 | 0},${40 + R() * 15 | 0})`; g.beginPath(); g.ellipse(x + 12, y + 10, 11, 9, 0, 0, Math.PI); g.fill(); } K.grain(g, W, H, 14); }, [3, 3]);
      K.add(new T.ConeGeometry(0.7071, 1, 4).rotateY(Math.PI / 4), K.texMat(roofTex, { roughness: 0.85, flatShading: true }), cx, h + 0.35 + (o.roofH || 1.6) / 2, zf - depth / 2 - 0.1, { s: [w + 0.4, o.roofH || 1.6, depth + 0.4] });
      // sacadas de ferro nas portas-janelas dos andares de cima
      for (let j = 1; j < floors; j++) for (let b = 0; b < bays; b++) {
        const x = x0 + (b + 0.5) * w / bays, ww = w / bays * 0.42 + 0.35, y = (j + 0.16) * fhW;
        K.box(ww, 0.08, 0.55, K.mat(0xd9cdb6, { roughness: 0.8 }), x, y, zf + 0.27);
        for (let k = 0; k <= Math.round(ww / 0.1); k++) sacadaBars.push([x - ww / 2 + k * ww / Math.round(ww / 0.1), y + 0.46, zf + 0.53]);
        for (const s of [-1, 1]) for (let k = 0; k < 5; k++) sacadaBars.push([x + s * ww / 2, y + 0.46, zf + 0.06 + k * 0.1]);
        K.box(ww + 0.04, 0.04, 0.04, K.iron, x, y + 0.9, zf + 0.53); for (const s of [-1, 1]) K.box(0.04, 0.04, 0.5, K.iron, x + s * ww / 2, y + 0.9, zf + 0.29);
        // vasos com flores e roupa no varal em algumas sacadas
        if (R() < 0.7) { K.cyl(0.11, 0.08, 0.18, M.terracotta, x - ww / 2 + 0.2, y + 0.13, zf + 0.35, {}, 8); for (let p = 0; p < 4; p++) K.sphere(0.07, K.mat([0xc8202a, 0xff5d8f, 0xffd23f][p % 3]), x - ww / 2 + 0.17 + (p % 2) * 0.07, y + 0.29 + (p > 1 ? 0.05 : 0), zf + 0.33 + (p % 3) * 0.03, { cast: false }, 6, 4); }
        if (o.flag && b === 1 && j === floors - 1) { K.cyl(0.015, 0.015, 1.4, K.iron, x + ww / 2 - 0.1, y + 1.0, zf + 0.75, { rx: 0.6 }, 4); K.add(new T.PlaneGeometry(0.8, 0.55), K.texMat(o.flag, { side: T.DoubleSide }), x + ww / 2 + 0.3, y + 1.45, zf + 1.05, { rx: 0.6, cast: false }); }
      }
      return { cx, w, h };
    };
    const flagBR = K.canvasTex(128, 88, (g, w, h) => { g.fillStyle = '#1f9a4a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd23f'; g.beginPath(); g.moveTo(w / 2, 8); g.lineTo(w - 10, h / 2); g.lineTo(w / 2, h - 8); g.lineTo(10, h / 2); g.fill(); g.fillStyle = '#2a4aa8'; g.beginPath(); g.arc(w / 2, h / 2, 18, 0, 7); g.fill(); g.strokeStyle = '#f6f3ec'; g.lineWidth = 3; g.beginPath(); g.arc(w / 2, h / 2 + 22, 26, -2.2, -0.9); g.stroke(); });
    const flagBloco = K.canvasTex(128, 88, (g, w, h) => { g.fillStyle = '#1f9a6a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd23f'; g.font = '900 30px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('L.A.', w / 2, h / 2 + 10); });
    casarao(-15.0, -9.4, -6.62, 8, 6.8, { base: '#f0c64a', trim: '#f6f1e2', shut: '#2f6a4a', floors: 2, bays: 3, door: 1, azulejo: true, numero: '214', flag: flagBR });
    casarao(9.4, 15.0, -6.62, 8, 6.8, { base: '#4f8fc0', trim: '#f6f1e2', shut: '#f2efe6', floors: 2, bays: 3, door: 0, arch: true, numero: '230', flag: flagBloco, doorC: '#2f4a6a' });
    casarao(-22.6, -15.2, -6.62, 6, 3.3, { base: '#e8869a', trim: '#f6f1e2', shut: '#2a5a8a', floors: 1, bays: 3, door: 1, urns: 3, roofH: 1.3 });
    casarao(15.2, 22.6, -6.62, 6, 3.3, { base: '#9ac46a', trim: '#f6f1e2', shut: '#8a3a22', floors: 1, bays: 3, door: 2, urns: 3, roofH: 1.3, azulejo: true });
    casarao(-34, -23.0, -6.62, 9, 9.6, { base: '#d77a4a', trim: '#f2e6cc', shut: '#2f6a4a', floors: 3, bays: 4, door: 2, urns: 4 });
    casarao(23.0, 34, -6.62, 9, 8.8, { base: '#c9a0d8', trim: '#f6f1e2', shut: '#3a3a6a', floors: 3, bays: 4, door: 1, urns: 4, arch: true });
    K.inst(new T.CylinderGeometry(0.012, 0.012, 0.86, 4), K.iron, sacadaBars, { cast: false });
    K.inst(new T.LatheGeometry([[0, 0], [0.1, 0], [0.12, 0.08], [0.06, 0.14], [0.13, 0.24], [0.1, 0.36], [0.02, 0.44], [0, 0.5]].map(p => new T.Vector2(p[0], p[1])), 10), K.mat(0xf3ecdc, { roughness: 0.6 }), urns);
    K.col(-14.5, -6.4, -9.4, -6.3); K.col(9.4, -6.4, 14.5, -6.3);
    // lampiões de parede nos casarões (brilho barato)
    for (const [x, y] of [[-12.2, 3.6], [12.2, 3.6], [-18.9, 2.6], [18.9, 2.6]]) { K.box(0.05, 0.05, 0.45, K.iron, x, y, -6.4); K.box(0.22, 0.3, 0.22, K.glow(0xffc070, 1.8), x, y - 0.12, -6.18, { cast: false }); K.cone(0.2, 0.16, K.iron, x, y + 0.1, -6.18, {}, 4); K.halo(x, y - 0.1, -6.1, 0.55, 0xffb060, 0.5); }
    // samambaias penduradas e gato na sacada
    for (const [x, y] of [[-13.6, 6.0], [10.8, 6.0], [13.6, 2.95]]) { wire([x, y + 0.6, -6.3], [x, y + 0.2, -6.3], 0, wireM); K.plant(x, -6.3, 'fern', { y, s: 0.7, col: false }); }
    { const c = K.group(-12.1, 3.62, -6.25, 0.5); K.add(new T.SphereGeometry(0.12, 8, 6).scale(1.5, 1, 1), K.mat(0x2a2a2a), 0, 0.12, 0, { parent: c }); K.sphere(0.08, K.mat(0x2a2a2a), 0.17, 0.22, 0, { parent: c }, 8, 6); for (const s of [-1, 1]) K.cone(0.03, 0.06, K.mat(0x2a2a2a), 0.19, 0.31, s * 0.04, { parent: c }, 4); K.add(new T.TorusGeometry(0.12, 0.015, 4, 10, Math.PI), K.mat(0x2a2a2a), -0.2, 0.1, 0, { parent: c, rx: Math.PI / 2 }); }

    // ------------------------------------------------------------ poste com a fiação embolada (esquerda) e cabo do carro de som
    const posteX = -9.6, posteZ = -5.95;
    { K.cyl(0.11, 0.17, 8.6, concrete, posteX, 4.3, posteZ, {}, 8); K.colR(posteX, posteZ, 0.2);
      for (const [y, w] of [[8.1, 1.8], [7.3, 1.4]]) { K.box(w, 0.1, 0.12, concrete, posteX, y, posteZ); for (let k = 0; k < 3; k++) K.cyl(0.03, 0.04, 0.12, M.white, posteX - w / 2 + 0.15 + k * (w - 0.3) / 2, y + 0.1, posteZ, { cast: false }, 6); }
      K.cyl(0.26, 0.26, 0.7, K.mat(0x7a7e80, { metalness: 0.4, roughness: 0.5 }), posteX + 0.32, 6.4, posteZ - 0.1, {}, 12); for (let k = 0; k < 5; k++) K.box(0.03, 0.6, 0.1, K.mat(0x6a6e70), posteX + 0.6, 6.4, posteZ - 0.3 + k * 0.1);
      K.box(0.35, 0.45, 0.2, K.mat(0x9a9a90), posteX + 0.05, 2.1, posteZ + 0.18); K.box(0.36, 0.05, 0.21, darkM, posteX + 0.05, 2.35, posteZ + 0.18);
      const tops = [[posteX - 0.75, 8.2, posteZ], [posteX, 8.2, posteZ], [posteX + 0.75, 8.2, posteZ], [posteX - 0.55, 7.4, posteZ], [posteX + 0.55, 7.4, posteZ]];
      for (const [b, s] of [[[-12.2, 6.2, -6.6], 0.3], [[-30, 7.6, -6.6], 1.2], [[10.6, 6.0, -6.6], 1.6], [[-12, 5.2, 9.6], 1.4], [[-4, 5.2, 9.6], 1.6], [[-9.6, 7.4, -22], 1.0], [[2, 6.8, -6.6], 1.2]]) for (let k = 0; k < 3; k++) { const a = tops[(k + Math.floor(R() * 5)) % 5]; wire(a, [b[0] + (R() - 0.5) * 0.3, b[1] - k * 0.12, b[2]], s + k * 0.15); }
      // o ninho de fios: laços e rolos pendurados
      for (let k = 0; k < 14; k++) { const a = tops[k % 5], b = [posteX + (R() - 0.5) * 1.6, 6.6 + R() * 1.2, posteZ + (R() - 0.5) * 0.6]; wire(a, b, 0.3 + R() * 0.6); }
      K.add(new T.TorusKnotGeometry(0.32, 0.025, 80, 5, 3, 7), darkM, posteX - 0.2, 6.9, posteZ + 0.15, { cast: false }); K.add(new T.TorusKnotGeometry(0.22, 0.02, 60, 5, 2, 5), darkM, posteX + 0.4, 7.7, posteZ + 0.1, { cast: false });
      // par de tênis pendurado no fio
      for (const s of [-1, 1]) { const sx = posteX + 2.3 + s * 0.08; wire([sx, 6.75, -6.2], [sx, 6.35, -6.2], 0, wireM); K.box(0.1, 0.09, 0.26, K.mat(s < 0 ? 0xf6f3ec : 0xe9e9e9), sx, 6.3, -6.2); K.box(0.11, 0.03, 0.27, K.mat(0xc8202a), sx, 6.25, -6.2); }
      // placa de rua azul
      K.box(0.04, 0.4, 0.04, K.iron, posteX, 2.9, posteZ + 0.15); K.sign('R. Alm. Alexandrino', 1.1, 0.24, posteX, 3.1, posteZ + 0.19, { bg: '#1e3a8b', color: '#f6f3ec', size: 54, font: 'Arial, sans-serif' });
    }
    // cabo grosso do som: vem do carro e sobe até a caixa de luz do poste (duas metades + emenda)
    const cabM = K.mat(0x111114, { roughness: 0.6 });
    const cabA = D(tube([[-12.4, 0.86, -3.45], [-12.2, 0.1, -3.9], [-11.4, 0.04, -4.45], [-10.55, 0.04, -4.95]], 0.035, cabM, { cast: false }));
    const cabB = tube([[-10.35, 0.04, -5.05], [-9.9, 0.05, -5.5], [-9.62, 0.6, -5.78], [-9.55, 1.9, -5.77]], 0.035, cabM, { cast: false });
    const emenda = D(K.cyl(0.05, 0.05, 0.26, K.mat(0xffd23f, { roughness: 0.5 }), -10.45, 0.05, -5.0, { rz: Math.PI / 2, ry: 0.45, cast: false }, 8));
    const spark = K.halo(-10.45, 0.12, -5.0, 0.35, 0xbfe4ff, 0); const sparkCore = D(K.sphere(0.04, K.glow(0xd8f0ff, 4), -10.45, 0.1, -5.0, { cast: false }, 6, 4)); sparkCore.visible = false;

    // ------------------------------------------------------------ carro de som (trio pequeno) à esquerda
    let somOn = true;
    const ledMats = [], cones = [];
    { const g = K.group(-12.0, 0, -2.4);
      K.box(4.4, 0.3, 1.9, darkM, 0, 0.62, 0, { parent: g });
      for (const x of [-1.35, 1.35]) for (const z of [-0.92, 0.92]) { K.cyl(0.38, 0.38, 0.24, K.mat(0x151515, { roughness: 0.8 }), x, 0.38, z, { parent: g, rx: Math.PI / 2 }, 14); K.cyl(0.18, 0.18, 0.25, steel, x, 0.38, z, { parent: g, rx: Math.PI / 2 }, 10); }
      // cabine branca com faixa azul
      K.add(K.rbox(1.35, 1.45, 1.95, 0.12), K.mat(0xf2efe8, { roughness: 0.4 }), 1.55, 1.5, 0, { parent: g }); K.box(1.37, 0.14, 1.97, K.mat(0x2a6ab8), 1.55, 1.15, 0, { parent: g });
      K.box(0.04, 0.6, 1.6, K.glass, 2.23, 1.85, 0, { parent: g, cast: false }); for (const z of [-0.98, 0.98]) K.box(0.8, 0.5, 0.03, K.glass, 1.6, 1.85, z, { parent: g, cast: false });
      for (const z of [-0.7, 0.7]) K.cyl(0.11, 0.11, 0.05, K.glow(0xfff2c0, 1.2), 2.24, 1.0, z, { parent: g, rz: Math.PI / 2, cast: false }, 10);
      K.box(0.1, 0.12, 1.8, K.metal(0xc9ced6, 0.3), 2.28, 0.72, 0, { parent: g });
      // carroceria com as caixas de som
      K.box(3.05, 0.14, 1.95, K.mat(0x3a3a40), -0.7, 0.84, 0, { parent: g });
      const spkM = K.mat(0x121214, { roughness: 0.7 }), coneM = K.mat(0x2a2a2e, { roughness: 0.5, metalness: 0.3 }), capM = K.mat(0x55555a, { metalness: 0.6, roughness: 0.3 });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
        const x = -1.85 + i * 0.78, y = 1.27 + j * 0.72;
        K.box(0.74, 0.7, 0.6, spkM, x, y, -0.35, { parent: g });
        const cg = K.group(x, y, -0.04, 0, g); K.add(new T.CircleGeometry(0.27, 20), coneM, 0, 0, 0, { parent: cg, cast: false }); K.sphere(0.07, capM, 0, 0, 0.01, { parent: cg, cast: false }, 8, 6); K.torus(0.28, 0.02, steel, 0, 0, 0.01, { parent: cg, cast: false });
        cones.push(D(cg));
      }
      for (const z of [-0.65, 0.65]) { K.box(0.6, 1.3, 0.55, spkM, -2.0, 1.56, z * 0.4 + 0.45, { parent: g }); const cg = K.group(-2.31, 1.7, z * 0.4 + 0.45, -Math.PI / 2, g); K.add(new T.CircleGeometry(0.22, 18), coneM, 0, 0, 0, { parent: cg, cast: false }); K.sphere(0.06, capM, 0, 0, 0.01, { parent: cg, cast: false }, 8, 6); cones.push(D(cg)); }
      // mesa do DJ
      K.box(0.9, 0.08, 0.5, darkM, 0.25, 1.75, 0.45, { parent: g }); K.box(0.06, 0.8, 0.06, steel, 0.25, 1.35, 0.45, { parent: g });
      K.box(0.32, 0.03, 0.24, K.mat(0x2a2a2e), 0.12, 1.81, 0.45, { parent: g }); K.box(0.3, 0.02, 0.2, K.glow(0x8fd0ff, 1.3), 0.12, 1.83, 0.42, { parent: g, cast: false, rx: -0.9 });
      for (let k = 0; k < 6; k++) K.cyl(0.015, 0.015, 0.02, K.glow([0xff3d7f, 0x2ec4b6, 0xffd23f][k % 3], 2), 0.36 + (k % 3) * 0.06, 1.8, 0.4 + Math.floor(k / 3) * 0.08, { parent: g, cast: false }, 6);
      // tenda com fita de LED e banner
      for (const [x, z] of [[-2.15, -0.9], [-2.15, 0.9], [0.75, -0.9], [0.75, 0.9]]) K.cyl(0.03, 0.03, 2.25, steel, x, 2.0, z, { parent: g }, 6);
      K.box(3.05, 0.06, 1.95, K.mat(0x1d1d22, { roughness: 0.6 }), -0.7, 3.14, 0, { parent: g });
      for (const [w, d, x, z] of [[3.05, 0.06, -0.7, 0.99], [3.05, 0.06, -0.7, -0.99], [0.06, 1.95, -2.24, 0], [0.06, 1.95, 0.84, 0]]) { const m = K.glow(0xff3d7f, 2.2); ledMats.push(m); K.box(w, 0.06, d, m, x, 3.08, z, { parent: g, cast: false }); }
      const banTex = K.canvasTex(512, 96, (gg, w, h) => { gg.fillStyle = '#1f9a6a'; gg.fillRect(0, 0, w, h); gg.font = '900 50px Impact, sans-serif'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillStyle = '#ffd23f'; gg.fillText('SOM NA LADEIRA', w / 2, h / 2 + 2); for (let k = 0; k < 20; k++) { gg.fillStyle = '#ff3d7f'; gg.beginPath(); gg.arc(10 + k * 26, 8, 4, 0, 7); gg.fill(); gg.beginPath(); gg.arc(10 + k * 26, h - 8, 4, 0, 7); gg.fill(); } });
      K.add(new T.PlaneGeometry(3.0, 0.5), K.texMat(banTex, { side: T.DoubleSide }), -0.7, 2.86, 1.0, { parent: g, cast: false });
      K.add(new T.PlaneGeometry(1.9, 0.5), K.texMat(banTex, { side: T.DoubleSide }), 0.86, 2.86, 0, { parent: g, cast: false, ry: Math.PI / 2 });
      K.col(-14.3, -3.45, -9.7, -1.35);
    }
    const somLight = K.plight(-11.5, 2.6, -0.6, 0xff3d7f, 1.6, 9);
    K.pool(-10.8, 0.2, 2.6, 0xff4fb0, 0.35);
    K.tick((dt, t) => {
      if (!somOn) return;
      const hue = (t * 0.12) % 1; ledMats.forEach((m, i) => m.color.setHSL((hue + i * 0.25) % 1, 1, 0.5).multiplyScalar(2.2)); somLight.color.setHSL(hue, 1, 0.55);
      const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 2.1)), 4); cones.forEach((c, i) => { c.position.z = (i < 6 ? -0.04 : 0) + beat * 0.035; c.scale.setScalar(1 + beat * 0.05); });
    });
    K.tell('som', (live) => {
      somOn = false; emenda.visible = false; cabA.position.set(-0.12, 0, 0.1); ledMats.forEach(m => m.color.set(0x140808)); somLight.intensity = 0; cones.forEach((c, i) => { c.position.z = i < 6 ? -0.04 : 0; c.scale.setScalar(1); });
      if (live) { sparkCore.visible = true; K.anim(2.4, (e, u, t) => { const f = Math.random() < 0.5 ? 1 : 0; spark.material.color.set(0xbfe4ff).multiplyScalar(f * (1 - u) * 3); sparkCore.visible = f > 0 && u < 0.95; }); }
      else { sparkCore.visible = false; spark.material.color.set(0x000000); }
    }, () => { somOn = true; emenda.visible = true; cabA.position.set(0, 0, 0); somLight.intensity = 1.6; spark.material.color.set(0x000000); sparkCore.visible = false; });

    // ------------------------------------------------------------ a bateria do bloco (surdos, caixas, repiques)
    const drum = (x, z, r, h, c1, c2, o = {}) => {
      const g = K.group(x, 0, z, o.ry ?? (R() - 0.5) * 0.6), y0 = o.y0 ?? 0.55;
      for (let k = 0; k < 3; k++) { const a = k * 2.094; K.cyl(0.012, 0.012, y0 + 0.08, K.iron, Math.cos(a) * 0.16, y0 / 2, Math.sin(a) * 0.16, { parent: g, rz: Math.cos(a) * 0.3, rx: -Math.sin(a) * 0.3 }, 4); }
      const body = K.cyl(r, r, h, K.mat(c1, { metalness: 0.55, roughness: 0.28 }), 0, y0 + h / 2, 0, { parent: g }, 20);
      const band = K.cyl(r + 0.004, r + 0.004, h * 0.32, K.mat(c2, { roughness: 0.4, metalness: 0.2 }), 0, y0 + h / 2, 0, { parent: g, cast: false }, 20);
      for (const yy of [y0 + 0.01, y0 + h - 0.01]) K.torus(r + 0.01, 0.016, K.silver, 0, yy, 0, { parent: g, rx: Math.PI / 2, cast: false }, 6, 20);
      const head = K.cyl(r * 0.97, r * 0.97, 0.012, o.headM || K.mat(0xf3efe6, { roughness: 0.6 }), 0, y0 + h + 0.004, 0, { parent: g, cast: false }, 20);
      const rods = []; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; rods.push([Math.cos(a) * (r + 0.012), y0 + h / 2, Math.sin(a) * (r + 0.012)]); } K.inst(new T.BoxGeometry(0.012, h * 0.9, 0.012), K.silver, rods, { parent: g, cast: false });
      if (o.sticks) for (const s of [-1, 1]) K.cyl(0.012, 0.016, 0.38, K.mat(0xe8d8b0), s * 0.08, y0 + h + 0.03, 0.05, { parent: g, rz: Math.PI / 2 + s * 0.3, cast: false }, 5);
      K.colR(x, z, r * 0.9);
      return { g, body, band, head };
    };
    const verde = 0x1f9a6a, rosa = 0xff3d7f, ouro = 0xd9a441;
    drum(-8.3, -3.2, 0.3, 0.55, verde, rosa, { sticks: true }); drum(-7.0, -3.25, 0.3, 0.55, rosa, verde, { sticks: true });
    drum(-2.2, -3.2, 0.3, 0.55, verde, rosa, { sticks: true }); drum(-0.9, -3.25, 0.28, 0.5, ouro, verde, { sticks: true });
    for (const [x, z] of [[-8.0, -2.0], [-6.6, -2.05], [-5.2, -2.0], [-2.4, -2.0], [-1.0, -2.05]]) drum(x, z, 0.19, 0.18, 0xc9ced6, verde, { y0: 0.75, sticks: true });
    for (const [x, z] of [[-7.4, -0.9], [-1.6, -0.9]]) drum(x, z, 0.17, 0.42, verde, ouro, { y0: 0.6 });
    // o surdo de marcação (missão): grande, verde e rosa, pele com a estrela do bloco
    const starTex = (bg, fg, ring) => K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = bg; g.beginPath(); g.arc(128, 128, 128, 0, 7); g.fill(); g.strokeStyle = ring; g.lineWidth = 16; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.stroke(); g.fillStyle = fg; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? 36 : 88; g.lineTo(128 + Math.cos(a) * rr2, 128 + Math.sin(a) * rr2); } g.fill(); });
    const headA = K.texMat(starTex('#f3efe6', '#1f9a6a', '#ff3d7f'), { roughness: 0.6 }), headB = new T.MeshStandardMaterial({ map: starTex('#ffd23f', '#c8202a', '#2a4aa8'), roughness: 0.5, emissive: 0x6a4a00, emissiveIntensity: 0.4 });
    const marc = drum(-5.6, -3.3, 0.36, 0.62, verde, rosa, { headM: headA, ry: 0, sticks: true }); D(marc.g);
    const marcBody = marc.body.material, marcBand = marc.band.material;
    K.tell('surdo', (live) => { marc.body.material = K.mat(0xc8202a, { metalness: 0.55, roughness: 0.25 }); marc.band.material = K.mat(0x2a4aa8, { roughness: 0.4 }); marc.head.material = headB; if (live) K.anim(1.2, e => { marc.g.rotation.y = e * Math.PI * 2; marc.g.position.y = Math.sin(e * Math.PI) * 0.25; }); else { marc.g.rotation.y = 0; marc.g.position.y = 0; } }, () => { marc.body.material = marcBody; marc.band.material = marcBand; marc.head.material = headA; marc.g.rotation.y = 0; marc.g.position.y = 0; });
    // cones de trânsito marcando a bateria e garrafas d'água
    for (const [x, z] of [[-9.0, -0.4], [-0.3, -0.4], [-9.0, -3.9]]) { K.cone(0.14, 0.45, K.mat(0xff6a1a, { roughness: 0.5 }), x, 0.23, z, {}, 10); K.cyl(0.145, 0.145, 0.06, M.white, x, 0.22, z, { cast: false }, 10); K.box(0.32, 0.03, 0.32, K.mat(0xff6a1a), x, 0.015, z); K.colR(x, z, 0.16); }
    K.inst(new T.CylinderGeometry(0.035, 0.035, 0.22, 8), K.mat(0x9ad0ff, { transparent: true, opacity: 0.7, roughness: 0.1 }), [[-8.6, 0.11, -3.75], [-7.6, 0.11, -3.8], [-1.6, 0.11, -3.7], [-6.2, 0.11, -0.55]], { cast: false });

    // ------------------------------------------------------------ o estandarte do bloco
    const bannerTex = (bg, fg, l1, l2, l3, ring) => K.canvasTex(384, 512, (g, w, h) => {
      g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = fg; g.lineWidth = 14; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 3; g.strokeRect(30, 30, w - 60, h - 60);
      g.textAlign = 'center'; g.fillStyle = fg; g.font = '700 40px Georgia, serif'; g.fillText(l1, w / 2, 86); g.font = '900 64px Impact, "Arial Black", sans-serif'; g.fillText(l2, w / 2, 400); g.font = '900 56px Impact, "Arial Black", sans-serif'; g.fillText(l3, w / 2, 458);
      g.fillStyle = ring; g.beginPath(); g.arc(w / 2, 225, 100, 0, 7); g.fill(); g.fillStyle = bg; g.beginPath(); g.arc(w / 2, 225, 86, 0, 7); g.fill();
      if (l2 === 'LADEIRA') { g.fillStyle = '#ffd23f'; rr(g, w / 2 - 70, 190, 140, 60, 10); g.fill(); g.fillStyle = bg; for (let k = 0; k < 5; k++) g.fillRect(w / 2 - 60 + k * 25, 200, 18, 22); g.fillStyle = '#222'; for (const s of [-1, 1]) { g.beginPath(); g.arc(w / 2 + s * 40, 256, 10, 0, 7); g.fill(); } g.strokeStyle = '#222'; g.lineWidth = 3; g.beginPath(); g.moveTo(w / 2, 190); g.lineTo(w / 2 + 30, 150); g.stroke(); }
      else { g.fillStyle = fg; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? 32 : 76; g.lineTo(w / 2 + Math.cos(a) * rr2, 225 + Math.sin(a) * rr2); } g.fill(); }
      for (let k = 0; k < 24; k++) { g.fillStyle = ring; g.beginPath(); g.arc(40 + R() * (w - 80), 110 + R() * 30, 3, 0, 7); g.fill(); }
    });
    const banA = bannerTex('#1f9a6a', '#ffd23f', 'G.R.B.C.', 'LADEIRA', 'ACIMA', '#ff3d7f'), banB = bannerTex('#5a1a8a', '#ff8a2a', 'BLOCO DOS', 'ESCORREGA', 'MAS NÃO CAI', '#f6f3ec');
    const est = D(K.group(0.9, 0, -2.6));
    K.cyl(0.26, 0.32, 0.12, K.mat(0x2a2a2e), 0, 0.06, 0, { parent: est }, 14); K.cyl(0.03, 0.03, 3.6, K.gold, 0, 1.8, 0, { parent: est }, 8);
    K.cone(0.06, 0.3, K.gold, 0, 3.75, 0, { parent: est }, 8); K.sphere(0.07, K.gold, 0, 3.58, 0, { parent: est }, 10, 6);
    const estArm = K.group(0, 3.3, 0.05, 0, est);
    K.cyl(0.018, 0.018, 1.5, K.gold, 0, 0, 0, { parent: estArm, rz: Math.PI / 2 }, 6); for (const s of [-1, 1]) K.sphere(0.04, K.gold, s * 0.77, 0, 0, { parent: estArm }, 8, 6);
    const banMat = new T.MeshStandardMaterial({ map: banA, side: T.DoubleSide, roughness: 0.55, metalness: 0.05, emissive: 0xffffff, emissiveMap: banA, emissiveIntensity: 0.12 });
    const banner = K.add(new T.PlaneGeometry(1.4, 1.85, 4, 6), banMat, 0, -1.0, 0, { parent: estArm });
    { const fr = []; for (let k = 0; k <= 14; k++) fr.push([-0.7 + k * 0.1, -1.98, 0]); K.inst(new T.CylinderGeometry(0.018, 0.006, 0.14, 5), K.gold, fr, { parent: estArm, cast: false }); }
    for (const s of [-1, 1]) wire([s * 0.75, 0, 0], [s * 0.2, 0.45, 0], 0, wireM, estArm);
    K.colR(0.9, -2.6, 0.3);
    let estSpin = 0; K.tick((dt, t) => { estArm.rotation.y = Math.sin(t * 0.7) * 0.16 + estSpin; banner.rotation.x = Math.sin(t * 1.3) * 0.05; });
    K.tell('estandarte', (live) => { const set = () => { banMat.map = banB; banMat.emissiveMap = banB; banMat.needsUpdate = true; }; if (live) K.anim(1.4, (e, u) => { estSpin = e * Math.PI * 4; if (u > 0.5) set(); }); else set(); }, () => { banMat.map = banA; banMat.emissiveMap = banA; banMat.needsUpdate = true; estSpin = 0; });

    // ------------------------------------------------------------ barraca de caipirinha + isopor de cerveja (encostados no muro)
    { const bx = 4.7, bz = -5.6;
      for (const [x, z] of [[-1.75, -0.75], [1.75, -0.75], [-1.75, 0.9], [1.75, 0.9]]) K.cyl(0.04, 0.04, 2.5, wood, bx + x, 1.25, bz + z, {}, 6);
      const panTex = K.canvasTex(512, 96, (g, w, h) => { g.fillStyle = '#2c9a4b'; g.fillRect(0, 0, w, h); for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? '#ffd23f' : '#f6f3ec'; g.beginPath(); g.moveTo(k * 44, h); g.lineTo(k * 44 + 22, h - 18); g.lineTo(k * 44 + 44, h); g.fill(); } g.font = '900 54px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 8; g.strokeStyle = '#145a2a'; g.strokeText('CAIPIRINHA', w / 2, 40); g.fillStyle = '#ffd23f'; g.fillText('CAIPIRINHA', w / 2, 40); for (const x of [40, w - 40]) { g.fillStyle = '#7ac83a'; g.beginPath(); g.arc(x, 40, 22, 0, 7); g.fill(); g.strokeStyle = '#e8f8c8'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x + Math.cos(k) * 20, 40 + Math.sin(k) * 20); g.stroke(); } } });
      K.box(3.4, 1.0, 0.55, woodDark, bx, 0.5, bz + 0.6); K.add(new T.PlaneGeometry(3.38, 0.95), K.texMat(panTex), bx, 0.52, bz + 0.88, { cast: false });
      K.box(3.6, 0.05, 0.7, K.mat(0xe8e2d2, { roughness: 0.5 }), bx, 1.03, bz + 0.6);
      K.box(3.4, 0.05, 0.5, wood, bx, 1.5, bz - 0.55); K.box(3.4, 0.05, 0.5, wood, bx, 1.95, bz - 0.55);
      // toldo listrado verde e branco com franja
      const awn = K.canvasTex(512, 256, (g, w, h) => { for (let k = 0; k < 10; k++) { g.fillStyle = k % 2 ? '#f6f3ec' : '#2c9a4b'; g.fillRect(k * w / 10, 0, w / 10, h); } K.grain(g, w, h, 10); });
      K.add(new T.PlaneGeometry(3.9, 2.0), K.texMat(awn, { side: T.DoubleSide }), bx, 2.42, bz + 0.15, { rx: -Math.PI / 2 + 0.22 });
      { const fr = []; for (let k = 0; k < 20; k++) fr.push([bx - 1.9 + k * 0.2, 2.12, bz + 1.13, 0, 1]); K.inst(new T.ConeGeometry(0.1, 0.16, 3).rotateX(Math.PI), K.mat(0xffd23f, { roughness: 0.6 }), fr, { cast: false }); }
      K.bulbs([bx - 1.9, 2.18, bz + 1.18], [bx + 1.9, 2.18, bz + 1.18], 12, 0.12, 0xffe0a0, 3.0);
      // no balcão: limões, copos, cachaça, açúcar, pilão, gelo
      const lim = []; for (let k = 0; k < 40; k++) { const a = R() * 6.28, rr2 = R() * 0.17; lim.push([bx - 1.15 + Math.cos(a) * rr2, 1.1 + R() * 0.06, bz + 0.55 + Math.sin(a) * rr2 * 0.8, 0, 0.035 + R() * 0.01]); }
      K.cyl(0.22, 0.16, 0.08, K.mat(0x8a6a3a, { roughness: 0.9 }), bx - 1.15, 1.09, bz + 0.55, {}, 14); K.inst(new T.SphereGeometry(1, 8, 6), K.mat(0x6ab83a, { roughness: 0.5 }), lim, { cast: false });
      const cups = []; for (let k = 0; k < 10; k++) cups.push([bx - 0.55 + (k % 5) * 0.14, 1.11, bz + 0.5 + Math.floor(k / 5) * 0.16]);
      K.inst(new T.CylinderGeometry(0.04, 0.03, 0.12, 10), K.mat(0xd8f0b0, { transparent: true, opacity: 0.75, roughness: 0.1, emissive: 0x405a20, emissiveIntensity: 0.3 }), cups, { cast: false });
      K.inst(new T.BoxGeometry(0.03, 0.025, 0.03), K.mat(0x4a9a2a), cups.map(c => [c[0] + 0.01, c[1] + 0.05, c[2]]), { cast: false });
      K.bottles(bx + 0.4, 1.05, bz + 0.45, 5, 0.1, { colors: [0xe8e0c8, 0xd8c890, 0xe8e0c8, 0x9ad0a0, 0xc8a050] });
      K.box(0.22, 0.18, 0.14, K.mat(0xf6f3ec, { roughness: 0.9 }), bx + 1.15, 1.14, bz + 0.5); K.sign('AÇÚCAR', 0.2, 0.05, bx + 1.15, 1.16, bz + 0.575, { bg: '#f6f3ec', color: '#c8202a', size: 70 });
      K.cyl(0.02, 0.025, 0.25, wood, bx + 0.95, 1.18, bz + 0.72, { rz: 0.4 }, 6);
      K.box(0.4, 0.12, 0.3, K.mat(0x3a7ac8, { roughness: 0.4 }), bx + 1.45, 1.11, bz + 0.62); { const ic = []; for (let k = 0; k < 14; k++) ic.push([bx + 1.3 + R() * 0.3, 1.18, bz + 0.52 + R() * 0.2, R() * 3, 0.03]); K.inst(new T.BoxGeometry(1, 1, 1), K.mat(0xe8f4ff, { transparent: true, opacity: 0.8, roughness: 0.05 }), ic, { cast: false }); }
      // garrafas na prateleira de trás e frutas penduradas
      K.bottles(bx - 1.55, 1.53, bz - 0.55, 28, 0.11); K.bottles(bx - 1.55, 1.98, bz - 0.55, 20, 0.155, { colors: [0xffd23f, 0xff7a2a, 0xc8202a, 0x6ab83a] });
      for (let k = 0; k < 6; k++) { const x = bx - 1.5 + k * 0.6; wire([x, 2.2, bz + 0.6], [x, 1.85, bz + 0.6], 0, stringM); if (k % 2) { for (let b = 0; b < 5; b++) K.add(new T.CylinderGeometry(0.02, 0.025, 0.22, 6), K.mat(0xffd23f), x + Math.cos(b) * 0.04, 1.75, bz + 0.6 + Math.sin(b) * 0.04, { rz: 0.3 * Math.cos(b * 2), rx: 0.3 * Math.sin(b * 2), cast: false }); } else { K.sphere(0.07, K.mat(k === 2 ? 0xff9a2a : 0xe8c83a, { roughness: 0.6 }), x, 1.8, bz + 0.6, { cast: false }, 8, 6); } }
      // cardápio de giz no cavalete
      const menuTex = K.canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#7a4a26'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f2a24'; g.fillRect(12, 12, w - 24, h - 24); g.fillStyle = '#f3efe6'; g.font = '700 30px "Comic Sans MS", cursive'; g.textAlign = 'center'; g.fillText('HOJE TEM', w / 2, 56); g.font = '24px "Comic Sans MS", cursive'; g.textAlign = 'left'; [['Caipirinha', '15'], ['Caipiroska', '18'], ['Maracujá', '15'], ['Sacolé', '5'], ['Água', '4']].forEach(([a, b], k) => { g.fillStyle = ['#ffd23f', '#9be0c0', '#ff9a2a', '#ff7aa8', '#f3efe6'][k]; g.fillText(a, 30, 110 + k * 40); g.fillText('R$' + b, 170, 110 + k * 40); }); });
      const cav = K.group(2.4, 0, -4.4, 0.3); for (const s of [-1, 1]) K.add(new T.BoxGeometry(0.5, 0.75, 0.03), K.texMat(menuTex), 0, 0.37, s * 0.12, { parent: cav, rx: s * 0.18, ry: s < 0 ? Math.PI : 0 }); K.colR(2.4, -4.4, 0.25);
      // a placa pendurada (missão): de um lado o preço, do outro "ACABOU O LIMÃO"
      const sgA = K.canvasTex(256, 144, (g, w, h) => { g.fillStyle = '#f6f3ec'; g.fillRect(0, 0, w, h); g.fillStyle = '#2c9a4b'; g.fillRect(8, 8, w - 16, h - 16); g.fillStyle = '#ffd23f'; g.font = '900 40px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('CAIPIRINHA', w / 2, 60); g.fillStyle = '#f6f3ec'; g.font = '900 50px Impact, sans-serif'; g.fillText('R$ 15', w / 2, 118); });
      const sgB = K.canvasTex(256, 144, (g, w, h) => { g.fillStyle = '#ffd23f'; g.fillRect(0, 0, w, h); g.fillStyle = '#d0101a'; g.fillRect(8, 8, w - 16, h - 16); g.fillStyle = '#ffffff'; g.font = '900 44px Impact, sans-serif'; g.textAlign = 'center'; g.fillText('ACABOU', w / 2, 62); g.fillText('O LIMÃO!', w / 2, 116); });
      const plG = D(K.group(bx + 2.05, 2.05, bz + 0.6));
      wire([-0.3, 0.38, 0], [-0.25, 0.0, 0], 0, wireM, plG); wire([0.3, 0.38, 0], [0.25, 0.0, 0], 0, wireM, plG);
      const sgM = K.texMat(sgA, { roughness: 0.6, emissive: 0xffffff, emissiveMap: sgA, emissiveIntensity: 0.15 }), sgMB = new T.MeshBasicMaterial({ map: sgB, color: new T.Color(0xffffff).multiplyScalar(1.15), toneMapped: false });
      const plaq = K.add(new T.BoxGeometry(0.85, 0.48, 0.03), [woodDark, woodDark, woodDark, woodDark, sgM, sgMB], 0, -0.24, 0, { parent: plG });
      K.box(0.06, 2.4, 0.06, wood, bx + 2.05, 1.2, bz + 0.15); K.box(0.06, 0.06, 0.55, wood, bx + 2.05, 2.42, bz + 0.38); K.colR(bx + 2.05, bz + 0.15, 0.12);
      K.tell('placa', (live) => { if (live) K.anim(1.6, (e, u) => { plaq.rotation.y = e * Math.PI + Math.sin(u * Math.PI * 3) * 0.3 * (1 - u); }); else plaq.rotation.y = Math.PI; }, () => { plaq.rotation.y = 0; });
      K.col(bx - 1.85, -6.4, bx + 1.85, bz + 0.92);
      K.pool(bx, bz + 1.4, 1.8, 0xffd9a0, 0.3);
      [-1.2, -0.4, 0.4, 1.2].forEach(dx => K.slot(bx + dx, bz + 1.45, bx + dx, bz, 'bar'));
      // isopor de cerveja e caixas de engradado
      const iso = (x, z, c, lc) => { const g = K.group(x, 0, z, (R() - 0.5) * 0.3); K.box(0.75, 0.48, 0.48, K.mat(c, { roughness: 0.95 }), 0, 0.24, 0, { parent: g }); K.box(0.78, 0.07, 0.5, K.mat(lc, { roughness: 0.6 }), 0, 0.5, -0.14, { parent: g, rx: -1.2 });
        const cans = []; for (let k = 0; k < 12; k++) cans.push([-0.28 + (k % 6) * 0.11, 0.45, -0.08 + Math.floor(k / 6) * 0.14, 0, 1]); K.inst(new T.CylinderGeometry(0.033, 0.033, 0.12, 10), K.metal(0xc8202a, 0.3), cans.slice(0, 6), { parent: g, cast: false }); K.inst(new T.CylinderGeometry(0.033, 0.033, 0.12, 10), K.metal(0xd9a441, 0.3), cans.slice(6), { parent: g, cast: false });
        const ic = []; for (let k = 0; k < 18; k++) ic.push([(R() - 0.5) * 0.66, 0.44, (R() - 0.5) * 0.4, R() * 3, 0.035]); K.inst(new T.BoxGeometry(1, 1, 1), K.mat(0xeaf6ff, { transparent: true, opacity: 0.8, roughness: 0.05 }), ic, { parent: g, cast: false }); return g; };
      iso(7.6, -5.7, 0xf6f3ec, 0x2a6ab8); iso(8.55, -5.75, 0xf6f3ec, 0xc8202a); K.col(7.15, -6.4, 9.0, -5.4);
      K.box(0.6, 0.35, 0.4, K.mat(0xc8202a, { roughness: 0.6 }), 8.6, 0.6, -6.1); K.box(0.6, 0.35, 0.4, K.mat(0xffd23f, { roughness: 0.6 }), 8.55, 0.95, -6.12, { ry: 0.1 });
      K.sign('CERVEJA GELADA 3 x R$10', 1.2, 0.22, 8.1, 0.36, -5.43, { bg: '#c9a06a', color: '#2a1a10', size: 44, font: '"Comic Sans MS", cursive' });
      K.slot(8.1, -4.75, 8.1, -5.7, 'bar');
    }

    // ------------------------------------------------------------ churrasquinho na brasa (direita) + mesas de plástico
    let brasaOn = true; const smoke = []; let smokeK = 0.32, smokeC = new T.Color(0x8a847c);
    { const cx = 11.4, cz = -3.0;
      const g = K.group(cx, 0, cz);
      for (const [x, z] of [[-0.6, -0.22], [0.6, -0.22], [-0.6, 0.22], [0.6, 0.22]]) K.cyl(0.02, 0.02, 0.85, steel, x, 0.42, z, { parent: g }, 6);
      K.cyl(0.13, 0.13, 0.05, K.mat(0x222), -0.62, 0.1, 0.3, { parent: g, rx: Math.PI / 2 }, 10);
      K.box(1.3, 0.22, 0.5, K.metal(0x8a8a8a, 0.55), 0, 0.92, 0, { parent: g }); K.box(1.34, 0.03, 0.54, K.metal(0x6a6a6a, 0.5), 0, 1.04, 0, { parent: g });
      const coals = []; for (let k = 0; k < 70; k++) coals.push([(R() - 0.5) * 1.15, 1.0 + R() * 0.03, (R() - 0.5) * 0.38, R() * 3, 0.035 + R() * 0.03]);
      const coalM = K.glow(0xff5a1a, 1.7), coalDead = K.mat(0x2a2624, { roughness: 1 });
      const coalMesh = K.inst(new T.IcosahedronGeometry(1, 0), coalM, coals, { parent: g, cast: false });
      const grill = []; for (let k = 0; k < 12; k++) grill.push([-0.6 + k * 0.11, 1.07, 0]); K.inst(new T.BoxGeometry(0.008, 0.008, 0.5), steel, grill, { parent: g, cast: false });
      // espetinhos: carne, frango, coração, queijo coalho, linguiça
      for (let k = 0; k < 9; k++) { const x = -0.5 + k * 0.12; K.cyl(0.005, 0.005, 0.62, K.mat(0xe0c890), x, 1.11, 0.04, { parent: g, rx: Math.PI / 2, cast: false }, 4); const c = [0x7a3a1a, 0xc8803a, 0x5a1a1a, 0xf0d890, 0x9a3a2a][k % 5]; for (let j = 0; j < 4; j++) K.box(0.05, 0.045, 0.05, K.mat(c, { roughness: 0.7 }), x, 1.12, -0.12 + j * 0.07, { parent: g, cast: false }); }
      const glowL = K.plight(cx, 1.5, cz + 0.4, 0xff7a2a, 1.3, 5); const pool = K.pool(cx, cz + 0.2, 1.4, 0xff6a20, 0.4);
      // mesinha com farofa, vinagrete e o abano de palha
      K.box(0.6, 0.04, 0.4, K.mat(0xe8e2d2), 1.0, 0.75, 0.05, { parent: g }); K.box(0.04, 0.75, 0.04, steel, 1.0, 0.37, 0.05, { parent: g });
      K.cyl(0.07, 0.07, 0.12, K.mat(0xe0c890, { transparent: true, opacity: 0.9 }), 0.9, 0.83, 0.05, { parent: g }, 10); K.cyl(0.07, 0.07, 0.1, K.mat(0xc8402a, { transparent: true, opacity: 0.85 }), 1.1, 0.82, 0.05, { parent: g }, 10);
      K.add(new T.CircleGeometry(0.16, 10), K.mat(0xc9a36a, { side: T.DoubleSide, roughness: 0.9 }), -0.75, 1.05, 0.25, { parent: g, ry: 0.4, rx: -0.3, cast: false });
      K.cyl(0.12, 0.1, 0.3, K.mat(0x3a5a8a, { roughness: 0.6 }), -0.95, 0.15, -0.3, { parent: g }, 10);
      // guarda-sol listrado
      K.cyl(0.02, 0.02, 2.5, steel, 0.4, 1.25, -0.3, { parent: g }, 6);
      const usTex = K.canvasTex(256, 64, (gg, w, h) => { for (let k = 0; k < 8; k++) { gg.fillStyle = ['#ff3d7f', '#ffd23f', '#2ec4b6', '#f6f3ec'][k % 4]; gg.fillRect(k * 32, 0, 32, h); } });
      K.add(new T.ConeGeometry(1.25, 0.45, 8, 1, true), K.texMat(usTex, { side: T.DoubleSide }), 0.4, 2.55, -0.3, { parent: g });
      K.sign('CHURRASQUINHO R$10', 1.0, 0.2, 0, 0.7, 0.26, { parent: g, bg: '#f2e6c8', color: '#c8202a', size: 42, font: '"Comic Sans MS", cursive' });
      K.col(cx - 0.75, cz - 0.35, cx + 1.3, cz + 0.32);
      // fumaça da brasa
      for (let k = 0; k < 10; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: 0x8a847c, transparent: true, opacity: 0.3, depthWrite: false })); root.add(s); smoke.push({ s, ph: k / 10, dx: (R() - 0.5) * 0.8 }); }
      K.tick((dt, t) => { smoke.forEach(p => { const u = (t * 0.22 + p.ph) % 1; p.s.position.set(cx + p.dx + u * 0.9, 1.15 + u * 3.4, cz + 0.1 - u * 0.5); p.s.scale.setScalar(0.35 + u * (1.3 + smokeK)); p.s.material.opacity = (1 - u) * smokeK * Math.min(1, u * 6); p.s.material.color.copy(smokeC); }); if (brasaOn) glowL.intensity = 1.1 + Math.sin(t * 9) * 0.15 + Math.sin(t * 23) * 0.1; });
      const bucket = D(K.group(cx + 0.85, 0, cz + 0.65, 0)); K.cyl(0.14, 0.11, 0.26, K.mat(0x2a6ab8, { roughness: 0.5 }), 0, 0.13, 0, { parent: bucket }, 12); bucket.visible = false;
      const puddle = D(K.add(new T.CircleGeometry(0.5, 16).rotateX(-Math.PI / 2), K.mat(0x3a3a40, { roughness: 0.05, metalness: 0.4, transparent: true, opacity: 0.7 }), cx + 0.5, 0.02, cz + 0.6, { cast: false })); puddle.visible = false;
      K.tell('brasa', (live) => { brasaOn = false; coalMesh.material = coalDead; glowL.intensity = 0; pool.visible = false; bucket.visible = true; bucket.rotation.z = 1.4; puddle.visible = true; smokeC = new T.Color(0xf6f6f6); if (live) K.anim(3, (e, u) => { smokeK = 0.9 - u * 0.35; }); else smokeK = 0.55; }, () => { brasaOn = true; coalMesh.material = coalM; glowL.intensity = 1.3; pool.visible = true; bucket.visible = false; puddle.visible = false; smokeC = new T.Color(0x8a847c); smokeK = 0.32; });
      K.slot(cx - 0.9, cz + 0.95, cx, cz, 'bar'); K.slot(cx + 1.0, cz + 0.95, cx, cz, 'bar');
    }
    // mesas e cadeiras de plástico, com garrafas de cerveja de 600 ml
    const plasticChair = (x, z, ry, c) => { const g = K.group(x, 0, z, ry), m = K.mat(c, { roughness: 0.45 }); K.box(0.44, 0.04, 0.42, m, 0, 0.44, 0, { parent: g }); for (const [a, b] of [[-0.19, -0.17], [0.19, -0.17], [-0.19, 0.17], [0.19, 0.17]]) K.cyl(0.018, 0.022, 0.44, m, a, 0.22, b, { parent: g }, 5); K.box(0.44, 0.38, 0.04, m, 0, 0.66, -0.22, { parent: g, rx: -0.12 }); for (const s of [-1, 1]) K.box(0.04, 0.04, 0.38, m, s * 0.22, 0.6, -0.02, { parent: g }); };
    const beer = new T.LatheGeometry([[0, 0], [0.038, 0], [0.04, 0.02], [0.04, 0.17], [0.016, 0.24], [0.014, 0.3], [0, 0.3]].map(p => new T.Vector2(p[0], p[1])), 10);
    const beerM = K.mat(0x5a2a0a, { roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.9, emissive: 0x3a1a00, emissiveIntensity: 0.2 });
    for (const [x, z, c] of [[9.5, 0.5, 0xf6f3ec], [12.6, 0.9, 0xc8202a], [10.9, 2.9, 0xf6f3ec]]) {
      const tm = K.mat(0xf0c020, { roughness: 0.45 }); K.box(0.72, 0.04, 0.72, tm, x, 0.72, z); for (const [a, b] of [[-0.32, -0.32], [0.32, -0.32], [-0.32, 0.32], [0.32, 0.32]]) K.cyl(0.02, 0.025, 0.72, tm, x + a, 0.36, z + b, {}, 5);
      K.add(beer, beerM, x - 0.1, 0.74, z + 0.05); K.add(beer, beerM, x + 0.12, 0.74, z - 0.1); for (let k = 0; k < 3; k++) K.cyl(0.03, 0.026, 0.1, K.mat(0xf2d070, { transparent: true, opacity: 0.8, roughness: 0.1 }), x + Math.cos(k * 2.1) * 0.22, 0.79, z + Math.sin(k * 2.1) * 0.22, { cast: false }, 8);
      K.cyl(0.1, 0.1, 0.015, M.white, x + 0.05, 0.75, z + 0.18, { cast: false }, 12); for (let k = 0; k < 3; k++) K.box(0.18, 0.012, 0.012, K.mat(0x7a3a1a), x + 0.05, 0.765, z + 0.15 + k * 0.03, { ry: 0.2, cast: false });
      K.colR(x, z, 0.38);
      for (let k = 0; k < (z > 2 ? 3 : 4); k++) { const a = k * Math.PI / 2 + 0.2, px = x + Math.cos(a) * 0.62, pz = z + Math.sin(a) * 0.62; plasticChair(px, pz, Math.atan2(x - px, z - pz), c); K.slot(px, pz, x, z, 'sit'); }
    }
    // vira-lata caramelo deitado na calçada
    { const d = K.group(13.6, 0, 9.3, -0.5), cm = K.mat(0xc8843a, { roughness: 0.9 }); K.add(new T.SphereGeometry(0.2, 10, 8).scale(1.7, 0.75, 1), cm, 0, 0.14, 0, { parent: d }); K.sphere(0.12, cm, 0.36, 0.17, 0.05, { parent: d }, 10, 8); K.add(new T.SphereGeometry(0.06, 8, 6).scale(1.4, 0.8, 1), K.mat(0xd8a060), 0.47, 0.14, 0.07, { parent: d }); K.sphere(0.02, M.black, 0.54, 0.15, 0.07, { parent: d }, 6, 4); for (const s of [-1, 1]) K.add(new T.ConeGeometry(0.05, 0.1, 4), K.mat(0xa8642a), 0.34, 0.27, 0.05 + s * 0.07, { parent: d, rz: -0.4 }); K.cyl(0.03, 0.02, 0.3, cm, -0.42, 0.1, -0.05, { parent: d, rz: 1.2, ry: 0.6 }, 6); for (const s of [-1, 1]) K.cyl(0.03, 0.03, 0.26, cm, 0.22, 0.05, s * 0.12, { parent: d, rz: Math.PI / 2 }, 6); K.colR(13.6, 9.3, 0.35); }
    // carrinho de gari laranja com vassoura
    { const g = K.group(9.3, 0, -4.35, -0.2), om = K.mat(0xff6a1a, { roughness: 0.5 }); K.box(0.7, 0.75, 0.55, om, 0, 0.55, 0, { parent: g }); for (const s of [-1, 1]) K.cyl(0.14, 0.14, 0.05, K.mat(0x1a1a1a), s * 0.3, 0.14, 0.3, { parent: g, rx: Math.PI / 2 }, 12); K.cyl(0.015, 0.015, 0.8, steel, -0.35, 1.0, -0.3, { parent: g, rz: 0.7 }, 5); K.cyl(0.015, 0.015, 1.4, wood, 0.25, 1.0, -0.2, { parent: g, rz: -0.25 }, 5); K.box(0.35, 0.1, 0.06, K.mat(0x2a2a2a), 0.42, 1.68, -0.2, { parent: g, rz: -0.25 }); K.box(0.66, 0.04, 0.5, K.mat(0x2a2a2e, { roughness: 0.4 }), 0, 0.92, 0.04, { parent: g }); K.col(8.85, -4.75, 9.75, -3.95); }
    // sacos de lixo e latinhas
    for (const [x, z] of [[14.1, -5.9], [13.6, -6.0], [-14.1, -5.9]]) K.add(new T.SphereGeometry(0.28, 8, 6).scale(1, 1.1, 0.9), K.mat(0x1a1a1e, { roughness: 0.3, metalness: 0.2 }), x, 0.28, z);
    K.colR(13.85, -5.95, 0.42); K.colR(-14.1, -5.9, 0.3);
    { const cans = []; for (let k = 0; k < 40; k++) cans.push([-14 + R() * 28, 0.035, -6 + R() * 15.5, R() * 6, 1, Math.PI / 2, 0]); K.inst(new T.CylinderGeometry(0.033, 0.033, 0.12, 8), K.metal(0xc8c8d0, 0.35), cans.filter((c, i) => i % 2), { cast: false }); K.inst(new T.CylinderGeometry(0.033, 0.033, 0.12, 8), K.metal(0xc8202a, 0.35), cans.filter((c, i) => !(i % 2)), { cast: false }); }

    // ------------------------------------------------------------ o bondinho amarelo, parado nos trilhos
    const bonde = D(K.group(8.8, 0.08, 5.7));
    { for (const sx of [-2.6, 2.6]) { K.box(1.8, 0.3, 1.45, darkM, sx, 0.5, 0, { parent: bonde }); for (const ox of [-0.55, 0.55]) for (const oz of [-0.5, 0.5]) { K.cyl(0.3, 0.3, 0.07, darkM, sx + ox, 0.3, oz, { parent: bonde, rx: Math.PI / 2 }, 14); K.cyl(0.08, 0.08, 0.09, steel, sx + ox, 0.3, oz, { parent: bonde, rx: Math.PI / 2 }, 8); } }
      K.box(8.0, 0.18, 2.0, woodDark, 0, 0.73, 0, { parent: bonde });
      for (const s of [-1, 1]) { K.box(8.0, 0.42, 0.06, yel, 0, 0.6, s * 1.02, { parent: bonde }); K.box(8.02, 0.07, 0.07, redM, 0, 0.47, s * 1.02, { parent: bonde }); K.box(7.0, 0.05, 0.3, wood, 0, 0.32, s * 1.22, { parent: bonde }); for (let k = 0; k < 5; k++) K.box(0.05, 0.25, 0.05, darkM, -3 + k * 1.5, 0.43, s * 1.2, { parent: bonde }); K.sign('10', 0.42, 0.28, 2.6 * s, 0.62, s * 1.06, { parent: bonde, ry: s > 0 ? 0 : Math.PI, bg: '#f2b81e', color: '#b8262a', size: 110, font: 'Impact, sans-serif' }); }
      // bancos de madeira atravessados (o bonde de Santa Teresa é aberto dos lados)
      { const seats = [], backs = [], legs = []; for (let i = 0; i < 8; i++) { const x = -3.15 + i * 0.9; seats.push([x, 1.24, 0]); for (let s = 0; s < 3; s++) backs.push([x - 0.21, 1.45 + s * 0.13, 0, 0, 1, 0, 0.1]); for (const z of [-0.8, 0.8]) legs.push([x, 1.03, z]); } K.inst(new T.BoxGeometry(0.42, 0.04, 1.75), wood, seats, { parent: bonde }); K.inst(new T.BoxGeometry(0.03, 0.08, 1.75), wood, backs, { parent: bonde }); K.inst(new T.BoxGeometry(0.04, 0.42, 0.04), woodDark, legs, { parent: bonde }); }
      const posts = []; for (let i = 0; i <= 8; i++) for (const z of [-0.98, 0.98]) posts.push([-3.6 + i * 0.9, 1.88, z]); K.inst(new T.CylinderGeometry(0.03, 0.03, 2.1, 6), yel, posts, { parent: bonde });
      K.box(8.3, 0.1, 2.35, K.mat(0xe8e2d2, { roughness: 0.6 }), 0, 2.97, 0, { parent: bonde }); K.box(6.6, 0.22, 1.1, K.mat(0xe0d8c4, { roughness: 0.6 }), 0, 3.13, 0, { parent: bonde });
      for (const s of [-1, 1]) { K.box(8.3, 0.14, 0.05, yel, 0, 2.86, s * 1.16, { parent: bonde }); K.cyl(0.05, 0.05, 7.6, K.mat(0x8a6a3a, { roughness: 0.8 }), 0, 2.75, s * 1.08, { parent: bonde, rz: Math.PI / 2 }, 8); }
      for (const s of [-1, 1]) { // cabeceiras
        K.box(0.1, 0.95, 2.0, yel, s * 3.95, 1.3, 0, { parent: bonde }); K.box(0.11, 0.07, 2.02, redM, s * 3.95, 1.0, 0, { parent: bonde });
        for (const z of [-0.95, 0, 0.95]) K.box(0.08, 1.15, 0.08, yel, s * 3.95, 2.35, z, { parent: bonde }); K.box(0.03, 0.95, 1.8, K.glass, s * 3.97, 2.27, 0, { parent: bonde, cast: false });
        K.box(0.14, 0.32, 1.5, darkM, s * 3.98, 2.85, 0, { parent: bonde }); K.sign('SANTA TERESA', 1.4, 0.24, s * 4.06, 2.85, 0, { parent: bonde, ry: s * Math.PI / 2, neon: true, color: '#ffd77a', size: 66, font: 'Arial, sans-serif', k: 1.6 });
        K.box(0.25, 0.06, 1.6, darkM, s * 4.1, 0.75, 0, { parent: bonde });
      }
      const headLs = []; for (const s of [-1, 1]) { K.cyl(0.13, 0.13, 0.08, K.iron, s * 4.03, 1.45, 0, { parent: bonde, rz: Math.PI / 2 }, 12); const h = K.cyl(0.1, 0.1, 0.02, K.glow(0xfff2c0, 0.5), s * 4.08, 1.45, 0, { parent: bonde, rz: Math.PI / 2, cast: false }, 12); headLs.push(h); }
      bonde.userData.headLs = headLs;
      // controlador, freio de mão e sino na cabine da frente (+x)
      K.box(0.3, 0.9, 0.3, darkM, 3.6, 1.27, -0.6, { parent: bonde }); K.cyl(0.02, 0.02, 0.2, K.brass, 3.6, 1.8, -0.6, { parent: bonde }, 6); K.box(0.25, 0.03, 0.03, K.brass, 3.6, 1.88, -0.55, { parent: bonde });
      K.cyl(0.025, 0.025, 1.0, K.iron, 3.65, 1.32, 0.6, { parent: bonde }, 6);
      const brakeW = K.group(3.65, 1.85, 0.6, 0, bonde); K.torus(0.2, 0.025, redM, 0, 0, 0, { parent: brakeW, rx: Math.PI / 2 }, 6, 20); for (let k = 0; k < 3; k++) K.box(0.4, 0.02, 0.02, redM, 0, 0, 0, { parent: brakeW, ry: k * 1.05 });
      bonde.userData.brakeW = brakeW;
      const bell = K.lathe([[0, 0], [0.12, 0], [0.1, 0.05], [0.07, 0.14], [0.03, 0.18], [0, 0.18]], K.brass, 3.5, 2.55, 0, { parent: bonde }, 12); bonde.userData.bell = bell;
      // alavanca do trolley até o fio aéreo
      K.box(0.4, 0.12, 0.3, darkM, -2.8, 3.28, 0, { parent: bonde }); K.cyl(0.03, 0.03, 2.42, darkM, -3.7, 4.05, 0, { parent: bonde, rz: 0.83 }, 6); K.torus(0.06, 0.015, K.brass, -4.6, 4.86, 0, { parent: bonde }, 6, 10);
      for (let k = 0; k < 4; k++) K.sphere(0.05, K.glow(0xffe0a0, 2.4), -2.7 + k * 1.8, 2.88, 0, { parent: bonde, cast: false }, 8, 6);
      // bandeirinhas e serpentina no bonde
      const bf = []; for (let k = 0; k < 18; k++) bf.push([-4 + k * 0.47, 2.72, 1.17, 0, 1]); const bfm = K.inst(new T.ConeGeometry(0.09, 0.18, 3).rotateX(Math.PI), K.mat(0xff3d7f, { roughness: 0.6 }), bf.filter((b, i) => i % 2), { parent: bonde, cast: false }); K.inst(new T.ConeGeometry(0.09, 0.18, 3).rotateX(Math.PI), K.mat(0x2ec4b6, { roughness: 0.6 }), bf.filter((b, i) => !(i % 2)), { parent: bonde, cast: false });
    }
    const bondeLight = K.pool(8.8, 5.7, 2.4, 0xffd9a0, 0.22, 0.93);
    K.col(4.3, 4.35, 13.25, 7.05);
    K.tick((dt, t) => { bonde.rotation.z = Math.sin(t * 0.9) * 0.002; });
    const brakeHalo = K.halo(12.95, 1.53, 5.7, 0.9, 0xfff2c0, 0); const brakeHalo2 = K.halo(4.65, 1.53, 5.7, 0.7, 0xff4030, 0);
    K.tell('freio', (live) => {
      const fin = () => { bonde.userData.headLs.forEach((h, i) => h.material = K.glow(i ? 0xfff2c0 : 0xff4030, 4)); brakeHalo.material.color.set(0xfff2c0).multiplyScalar(1.4); brakeHalo2.material.color.set(0xff4030).multiplyScalar(1.6); };
      if (live) K.anim(2.4, (e, u) => { bonde.position.x = 8.8 - e * 0.9; bonde.userData.brakeW.rotation.y = e * 9; bonde.userData.bell.rotation.z = Math.sin(u * 40) * 0.4 * (1 - u); bondeLight.position.x = bonde.position.x; brakeHalo.position.x = 12.95 - e * 0.9; brakeHalo2.position.x = 4.65 - e * 0.9; if (u > 0.2) fin(); });
      else { bonde.position.x = 7.9; bonde.userData.brakeW.rotation.y = 9; bondeLight.position.x = 7.9; brakeHalo.position.x = 12.05; brakeHalo2.position.x = 3.75; fin(); }
    }, () => { bonde.position.x = 8.8; bonde.userData.brakeW.rotation.y = 0; bonde.userData.bell.rotation.z = 0; bondeLight.position.x = 8.8; bonde.userData.headLs.forEach(h => h.material = K.glow(0xfff2c0, 0.5)); brakeHalo.position.x = 12.95; brakeHalo2.position.x = 4.65; brakeHalo.material.color.set(0); brakeHalo2.material.color.set(0); });

    // ------------------------------------------------------------ postes da frente com o fio do bonde, lampiões
    for (const x of [-12, -4, 4, 12]) { K.cyl(0.07, 0.1, 5.3, greenIron, x, 2.65, 9.62, {}, 8); K.cyl(0.14, 0.16, 0.5, greenIron, x, 0.25, 9.62, {}, 8); K.box(0.06, 0.06, 4.0, greenIron, x, 4.95, 7.65); K.cyl(0.02, 0.02, 0.7, greenIron, x, 4.6, 9.3, { rx: -0.9 }, 4); K.colR(x, 9.62, 0.16);
      K.box(0.06, 0.35, 0.06, greenIron, x, 3.6, 9.42); K.box(0.24, 0.3, 0.24, K.glow(0xffc070, 1.6), x, 3.3, 9.3, { cast: false }); K.cone(0.2, 0.15, greenIron, x, 3.52, 9.3, {}, 4); K.halo(x, 3.3, 9.3, 0.5, 0xffb060, 0.45); K.pool(x, 9.0, 1.4, 0xffb060, 0.25); }
    wire([-45, 4.9, 5.7], [45, 4.9, 5.7], 0.05);
    
    // ------------------------------------------------------------ largo do mirante (nível 1)
    { // guarda-corpo de ferro no fundo, olhando a baía
      const bars = []; for (let x = -9.2; x <= 9.2; x += 0.12) bars.push([x, L1 + 0.5, -12.78]); K.inst(new T.CylinderGeometry(0.012, 0.012, 1.0, 4), K.iron, bars, { cast: false });
      K.box(18.5, 0.06, 0.08, K.iron, 0, L1 + 1.02, -12.78); K.box(18.5, 0.04, 0.05, K.iron, 0, L1 + 0.12, -12.78);
      for (let x = -9.2; x <= 9.3; x += 2.3) { K.box(0.14, 1.1, 0.14, K.iron, x, L1 + 0.55, -12.78); K.sphere(0.07, K.brass, x, L1 + 1.15, -12.78, {}, 8, 6); }
      K.box(18.8, 0.25, 0.4, stoneM, 0, L1 - 0.1, -12.85, { cast: false });
      // bancos de azulejo virados para a vista
      const bM = K.texMat(mosaic(512, 64, 16, selaronMix, [2, 1]), { roughness: 0.4 });
      for (const x of [-7.6, -0.9, 2.7]) { K.box(1.8, 0.42, 0.5, concrete, x, L1 + 0.21, -11.9); K.add(new T.BoxGeometry(1.85, 0.06, 0.55), bM, x, L1 + 0.45, -11.9); K.col(x - 0.9, -12.1, x + 0.9, -11.7, 1); for (const s of [-0.45, 0.45]) K.slot(x + s, -11.85, x + s, -14, 'sit', 1); }
      // binóculo de moeda
      { const g = K.group(0.8, L1, -12.25, Math.PI); K.cyl(0.06, 0.1, 1.15, K.metal(0x2a5a8a, 0.4), 0, 0.57, 0, { parent: g }, 10); K.box(0.32, 0.2, 0.22, K.metal(0x2a5a8a, 0.4), 0, 1.25, 0, { parent: g }); for (const s of [-1, 1]) K.cyl(0.055, 0.065, 0.3, K.metal(0x2a5a8a, 0.4), s * 0.07, 1.27, 0.2, { parent: g, rx: Math.PI / 2 }, 10); K.colR(0.8, -12.25, 0.15, 1); K.slot(0.8, -11.7, 0.8, -14, 'view', 1); }
      // pipoqueiro
      { const g = K.group(3.8, L1, -8.6, 0.2); K.box(0.9, 0.7, 0.55, K.mat(0xc8202a, { roughness: 0.5 }), 0, 0.65, 0, { parent: g }); for (let k = 0; k < 4; k++) K.box(0.9, 0.08, 0.56, M.white, 0, 0.42 + k * 0.17, 0.001, { parent: g, cast: false }); K.box(0.7, 0.45, 0.45, K.glass, 0, 1.25, 0, { parent: g, cast: false }); const pc = []; for (let k = 0; k < 60; k++) pc.push([(R() - 0.5) * 0.6, 1.06 + R() * 0.2, (R() - 0.5) * 0.36, 0, 0.025]); K.inst(new T.IcosahedronGeometry(1, 0), K.mat(0xffe8a0, { roughness: 0.8 }), pc, { parent: g, cast: false }); K.box(0.75, 0.04, 0.5, K.mat(0xc8202a), 0, 1.5, 0, { parent: g }); for (const s of [-1, 1]) K.cyl(0.2, 0.2, 0.05, K.mat(0x1a1a1a), s * 0.48, 0.2, 0, { parent: g, rz: Math.PI / 2 }, 12); K.sign('PIPOCA', 0.6, 0.16, 0, 1.62, 0, { parent: g, bg: '#ffd23f', color: '#c8202a', size: 80, font: 'Impact, sans-serif' }); K.cyl(0.015, 0.015, 1.2, steel, 0.4, 1.9, -0.2, { parent: g }, 5); K.add(new T.ConeGeometry(0.6, 0.25, 8, 1, true), K.mat(0xffd23f, { side: T.DoubleSide }), 0.4, 2.5, -0.2, { parent: g }); K.col(3.3, -9.0, 4.3, -8.2, 1); }
      K.lamppost(-8.4, -9.7, { y: L1, h: 3.0, lv: 1, light: false }); K.lamppost(1.4, -8.0, { y: L1, h: 3.0, lv: 1, light: false });
      // floreiras
      for (const [x, z] of [[-8.7, -12.2], [8.7, -12.2], [-1.6, -12.3], [5.2, -12.3]]) K.plant(x, z, 'bush', { y: L1, lv: 1, s: 0.9, pot: K.mat(0xd8cfc0, { roughness: 0.7 }) });
      // mastros de bambu que seguram as bandeirinhas
      for (const x of [-7.5, -0.8, 6.0]) { K.cyl(0.04, 0.05, 3.5, K.mat(0xc9b06a, { roughness: 0.7 }), x, L1 + 1.75, -7.3, {}, 6); for (let k = 1; k < 5; k++) K.cyl(0.05, 0.05, 0.03, K.mat(0x9a8040), x, L1 + k * 0.7, -7.3, { cast: false }, 6); K.colR(x, -7.3, 0.1, 1); }
    }
    // imperial palms e a mangueira no fundo
    const palm = (x, z, y0, h, lean = 0) => { const g = K.group(x, y0, z, R() * 6); const tr = K.add(new T.CylinderGeometry(0.16, 0.24, h, 10), K.mat(0x9a948a, { roughness: 0.95 }), 0, h / 2, 0, { parent: g }); tr.rotation.z = lean; const top = K.group(-Math.sin(lean) * h, h, 0, 0, g); K.cyl(0.17, 0.18, 1.0, K.mat(0x5a8a3a, { roughness: 0.7 }), 0, 0.5, 0, { parent: top }, 10); for (let i = 0; i < 11; i++) { const f = K.add(new T.PlaneGeometry(0.5, 2.6, 1, 4).translate(0, 1.3, 0), K.mat(0x3f7a34, { side: T.DoubleSide, roughness: 0.8 }), 0, 1.0, 0, { parent: top }); f.rotation.set(-1.15 - (i % 3) * 0.25, i * 0.57, 0, 'YXZ'); const p = f.geometry.attributes.position; for (let k = 0; k < p.count; k++) p.setZ(k, -Math.pow(p.getY(k) / 2.6, 2) * 0.8); p.needsUpdate = true; } return g; };
    palm(-8.6, -13.3, L1 - 1.5, 10.5); palm(8.9, -13.4, L1 - 1.5, 9.5, 0.05); palm(-27, 14.5, -6, 9, -0.25); palm(28, 15, -7, 9.5, 0.22);
    const mangueira = (x, z, y0, s) => { const g = K.group(x, y0, z); K.cyl(0.35 * s, 0.5 * s, 3.2 * s, K.mat(0x5a4030, { roughness: 1 }), 0, 1.6 * s, 0, { parent: g }, 8); for (const a of [0.6, 2.4, 4.2]) K.cyl(0.12 * s, 0.2 * s, 2.2 * s, K.mat(0x5a4030), Math.cos(a) * 0.6 * s, 3.4 * s, Math.sin(a) * 0.6 * s, { parent: g, rz: Math.cos(a) * 0.6, rx: -Math.sin(a) * 0.6 }, 6); const cn = [], cn2 = []; for (let k = 0; k < 22; k++) { const a = R() * 6.28, rr2 = R() * 2.6 * s; (k % 3 ? cn : cn2).push([Math.cos(a) * rr2, (4.0 + R() * 2.4) * s - rr2 * 0.3, Math.sin(a) * rr2, R() * 3, (1.3 + R() * 0.9) * s]); } K.inst(new T.IcosahedronGeometry(1, 1), K.mat(0x2f5a2a, { roughness: 0.9, flatShading: true }), cn, { parent: g }); K.inst(new T.IcosahedronGeometry(1, 1), K.mat(0x4a7a34, { roughness: 0.9, flatShading: true }), cn2, { parent: g }); const mg = []; for (let k = 0; k < 16; k++) { const a = R() * 6.28; mg.push([Math.cos(a) * 2.4 * s, (3.6 + R() * 1.5) * s, Math.sin(a) * 2.4 * s, 0, 0.12 * s]); } K.inst(new T.SphereGeometry(1, 6, 5), K.mat(0xe8a020, { roughness: 0.6 }), mg, { parent: g, cast: false }); return g; };
    mangueira(4.0, -16.0, -3.0, 1.05); mangueira(-13.5, -16.5, -1.0, 0.9); mangueira(-27, -15, 0, 1.0); mangueira(28, -14, 0, 1.1); mangueira(-25, 15, -6, 1.1); mangueira(26, 16, -7, 1.0);

    // ------------------------------------------------------------ missão: fitas no azulejo (alto da escadaria)
    { const fitas = []; for (let k = 0; k < 22; k++) fitas.push([-5.21 + (k % 2) * 0.01, L1 + 0.75 - R() * 0.15, -7.1 - k * 0.15, 0, [1, 0.6 + R() * 0.5, 1]]);
      const fc = [0xc8202a, 0xffd23f, 0x2a6ab8, 0xf6f3ec, 0x1f9a4a, 0xff7a2a]; fc.forEach((c, i) => K.inst(new T.BoxGeometry(0.01, 0.4, 0.035).translate(0, -0.2, 0), K.mat(c, { roughness: 0.6 }), fitas.filter((f, j) => j % fc.length === i), { cast: false }));
      const longF = []; const fitaG = D(K.group(-5.17, L1 + 0.88, -8.7));
      [0xffe53f, 0x3fe07a, 0xf6f3ec].forEach((c, i) => { const g = new T.PlaneGeometry(0.11, 2.6, 1, 14).translate(0, -1.3, 0); const m = new T.Mesh(g, new T.MeshStandardMaterial({ color: c, side: T.DoubleSide, roughness: 0.5, emissive: c, emissiveIntensity: 0.35 })); m.position.set(0.02 + i * 0.01, 0, (i - 1) * 0.16); m.rotation.y = Math.PI / 2; fitaG.add(m); longF.push(m); });
      K.torus(0.06, 0.012, K.mat(0xffe53f), 0, 0, 0, { parent: fitaG, ry: Math.PI / 2, cast: false });
      fitaG.visible = false; let fitaLen = 1;
      K.tick((dt, t) => { if (!fitaG.visible) return; longF.forEach((m, i) => { m.rotation.x = Math.sin(t * 1.8 + i) * 0.08; m.rotation.z = Math.sin(t * 2.3 + i * 2) * 0.05; m.scale.y = fitaLen; }); });
      K.tell('fita', (live) => { fitaG.visible = true; if (live) K.anim(1.8, e => { fitaLen = 0.05 + e * 0.95; }); else fitaLen = 1; }, () => { fitaG.visible = false; fitaLen = 1; });
    }
    // ------------------------------------------------------------ missão: a pipa do mirante
    { const kiteTex = K.canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#ff2f9a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffe53f'; g.fillRect(0, 0, w / 2, h / 2); g.fillRect(w / 2, h / 2, w / 2, h / 2); g.fillStyle = '#2ec4b6'; g.beginPath(); g.arc(w / 2, h / 2, 16, 0, 7); g.fill(); });
      const kite = D(K.group(9.4, 7.4, -15.2)); const kb = K.add(new T.PlaneGeometry(1.0, 1.0), new T.MeshStandardMaterial({ map: kiteTex, side: T.DoubleSide, roughness: 0.5, emissive: 0xffffff, emissiveMap: kiteTex, emissiveIntensity: 0.35 }), 0, 0, 0, { parent: kite, cast: false }); kb.rotation.z = Math.PI / 4; kb.scale.set(1, 1.35, 1);
      K.cyl(0.01, 0.01, 1.4, wood, 0, 0, 0.01, { parent: kite, cast: false }, 4); K.cyl(0.01, 0.01, 1.0, wood, 0, 0.1, 0.01, { parent: kite, rz: Math.PI / 2, cast: false }, 4);
      const tail = []; for (let k = 0; k < 9; k++) tail.push(K.box(0.14, 0.05, 0.01, K.mat(k % 2 ? 0xffe53f : 0xff2f9a, { side: T.DoubleSide }), 0, -0.75 - k * 0.22, 0, { parent: kite, cast: false }));
      const linePts = new Float32Array(17 * 3); const lineGeo = new T.BufferGeometry(); lineGeo.setAttribute('position', new T.BufferAttribute(linePts, 3)); const kLine = new T.Line(lineGeo, new T.LineBasicMaterial({ color: 0xf6f3ec })); root.add(kLine);
      const hand = [7.3, L1 + 1.25, -12.75]; let kU = 1;
      const setLine = () => { const kp = kite.position; for (let i = 0; i <= 16; i++) { const u = i / 16; linePts[i * 3] = hand[0] + (kp.x - hand[0]) * u; linePts[i * 3 + 1] = hand[1] + (kp.y - 0.6 - hand[1]) * u - Math.sin(u * Math.PI) * 0.6; linePts[i * 3 + 2] = hand[2] + (kp.z - hand[2]) * u; } lineGeo.attributes.position.needsUpdate = true; lineGeo.computeBoundingSphere(); };
      const folded = D(K.group(7.9, L1 + 0.02, -12.4, 0.5)); K.add(new T.PlaneGeometry(0.5, 0.7), K.texMat(kiteTex, { side: T.DoubleSide }), 0, 0.01, 0, { parent: folded, rx: -Math.PI / 2, cast: false }); K.cyl(0.05, 0.05, 0.12, wood, 0.3, 0.06, 0.1, { parent: folded }, 8);
      kite.visible = false; kLine.visible = false;
      K.tick((dt, t) => { if (!kite.visible) return; kite.position.set(7.3 + (9.4 - 7.3) * kU + Math.sin(t * 0.9) * 0.4 * kU, (L1 + 1.3) + (7.4 - L1 - 1.3) * kU + Math.sin(t * 1.7) * 0.25 * kU, -12.75 + (-15.2 + 12.75) * kU); kite.rotation.z = Math.sin(t * 1.3) * 0.25; tail.forEach((b, k) => { b.position.x = Math.sin(t * 3 - k * 0.6) * 0.06 * k; b.rotation.z = Math.sin(t * 3 - k * 0.6) * 0.5; }); setLine(); });
      K.tell('pipa', (live) => { kite.visible = true; kLine.visible = true; folded.visible = false; if (live) K.anim(2.6, e => { kU = e; }); else kU = 1; setLine(); }, () => { kite.visible = false; kLine.visible = false; folded.visible = true; kU = 1; });
    }

    // ------------------------------------------------------------ bandeirinhas cruzando a rua (tremulam) + serpentinas
    { const flagGeo = new T.BufferGeometry(); flagGeo.setAttribute('position', new T.Float32BufferAttribute([-0.12, 0, 0, 0.12, 0, 0, 0, -0.28, 0], 3)); flagGeo.computeVertexNormals();
      const cols = [0xff3d7f, 0xffd23f, 0x2ec4b6, 0xff6b2c, 0x9b5de5, 0x3fbf5a, 0xf6f3ec], flags = [];
      const line = (a, b, sag) => { wire(a, b, sag, stringM); const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.floor(L / 0.42), ry = Math.atan2(-(b[2] - a[2]), b[0] - a[0]); for (let i = 1; i < n; i++) { const u = i / n; flags.push({ p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u], ry, ph: R() * 6, c: cols[(i + flags.length * 3) % cols.length] }); } };
      const back = [[-12.2, 5.8, -6.5], [-7.5, L1 + 3.45, -7.3], [-0.8, L1 + 3.45, -7.3], [6.0, L1 + 3.45, -7.3], [12.2, 5.8, -6.5]], front = [[-12, 5.15, 9.62], [-4, 5.15, 9.62], [4, 5.15, 9.62], [12, 5.15, 9.62]];
      [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3]].forEach(([b, f]) => line(back[b], front[f], 0.75));
      for (let k = 0; k < 4; k++) line(back[k], back[k + 1], 0.45); for (let k = 0; k < 3; k++) line(front[k], front[k + 1], 0.5);
      line([-7.5, L1 + 3.3, -7.3], [-9.6, L1 + 2.0, -12.7], 0.3); line([6.0, L1 + 3.3, -7.3], [8.9, L1 + 2.2, -12.7], 0.3); line([-0.8, L1 + 3.3, -7.3], [1.2, L1 + 2.4, -12.7], 0.3);
      const fm = new T.InstancedMesh(flagGeo, K.mat(0xffffff, { side: T.DoubleSide, roughness: 0.7 }), flags.length); flags.forEach((f, i) => fm.setColorAt(i, new T.Color(f.c))); root.add(fm);
      const d = new T.Object3D(); d.rotation.order = 'YXZ';
      const setF = (t) => { flags.forEach((f, i) => { d.position.set(f.p[0], f.p[1], f.p[2]); d.rotation.set(Math.sin(t * 3.1 + f.ph) * 0.35, f.ry, 0); d.updateMatrix(); fm.setMatrixAt(i, d.matrix); }); fm.instanceMatrix.needsUpdate = true; };
      setF(0); K.tick((dt, t) => setF(t));
      // serpentinas penduradas nos fios e caídas no chão
      const sc = [0xff3d7f, 0xffd23f, 0x2ec4b6, 0x9b5de5, 0x3fbf5a, 0xff7a2a];
      for (let k = 0; k < 16; k++) { const f = flags[Math.floor(R() * flags.length)].p, pts = [], L = 0.8 + R() * 1.6; for (let i = 0; i <= 14; i++) { const u = i / 14, a = u * 18; pts.push([f[0] + Math.cos(a) * 0.05, f[1] - u * L, f[2] + Math.sin(a) * 0.05]); } tube(pts, 0.008, K.mat(sc[k % sc.length], { roughness: 0.6 }), { seg: 40, rs: 3, cast: false }); }
      for (let k = 0; k < 26; k++) { const x0 = -14 + R() * 28, z0 = -4.4 + R() * 12.6, pts = [], a0 = R() * 6; for (let i = 0; i <= 18; i++) { const u = i / 18, a = a0 + u * 3; pts.push([x0 + Math.cos(a) * u * 0.9 + Math.cos(u * 30) * 0.06, 0.02, z0 + Math.sin(a) * u * 0.9 + Math.sin(u * 30) * 0.06]); } tube(pts, 0.008, K.mat(sc[k % sc.length], { roughness: 0.6 }), { seg: 60, rs: 3, cast: false }); }
    }
    // ------------------------------------------------------------ confete no chão e caindo
    { const cc = [0xff3d7f, 0xffd23f, 0x2ec4b6, 0x9b5de5, 0x3fbf5a, 0xf6f3ec, 0xff7a2a], pg = new T.PlaneGeometry(0.05, 0.05).rotateX(-Math.PI / 2);
      cc.forEach(c => { const l = []; for (let k = 0; k < 170; k++) l.push([-14.5 + R() * 29, 0.075 + R() * 0.005, -6.5 + R() * 16.6, R() * 6, 0.8 + R() * 0.6]); for (let k = 0; k < 36; k++) l.push([-9 + R() * 18, L1 + 0.012, -12.6 + R() * 5.4, R() * 6, 1]); K.inst(pg, K.mat(c, { roughness: 0.6 }), l, { cast: false }); });
      const N = 280, fall = [], im = new T.InstancedMesh(new T.PlaneGeometry(0.06, 0.045), K.mat(0xffffff, { side: T.DoubleSide, roughness: 0.6, emissive: 0x303030 }), N);
      for (let i = 0; i < N; i++) { fall.push({ x: -14 + R() * 28, y: R() * 6, z: -12 + R() * 22, v: 0.3 + R() * 0.4, ph: R() * 6, w: 2 + R() * 4 }); im.setColorAt(i, new T.Color(cc[i % cc.length])); } root.add(im);
      const d = new T.Object3D();
      const upd = (dt, t) => { fall.forEach((f, i) => { f.y -= f.v * dt; const fl = f.z < -7 && f.x > -9.2 && f.x < 9.2 ? L1 : 0; if (f.y < fl + 0.05) { f.y = 6.5; f.x = -14 + R() * 28; } d.position.set(f.x + Math.sin(t * 1.3 + f.ph) * 0.3, f.y, f.z + Math.cos(t + f.ph) * 0.2); d.rotation.set(t * f.w + f.ph, t * f.w * 0.7, f.ph); d.updateMatrix(); im.setMatrixAt(i, d.matrix); }); im.instanceMatrix.needsUpdate = true; };
      upd(0, 0); K.tick(upd);
    }

    // ------------------------------------------------------------ vagas (gente)
    { const cast = [[1.0, 2.1], [2.7, 2.8], [-1.9, 3.7], [7.9, 1.9], [-6.3, -1.0]], far = (x, z) => cast.every(([a, b]) => Math.hypot(a - x, b - z) > 0.85);
      for (const x of [-3, -1.6, -0.2, 1.2, 2.6, 4.0, 5.4, 6.8]) for (const z of [0.4, 1.5, 2.6, 3.7]) if (far(x, z)) K.slot(x, z, x, z + 1, 'dance');
      for (const x of [-9.4, -8.0, -6.6, -5.2]) for (const z of [0.7, 2.1]) if (far(x, z)) K.slot(x, z, -11.5, -1.5, 'dance');
      [[-7.65, -2.6], [-5.95, -2.6], [-1.6, -2.6]].forEach(([x, z]) => K.slot(x, z, x, z + 1, 'dance'));
      [[-12.5, 6.5], [-6.5, 6.8], [-1.0, 7.0], [1.8, 8.2], [-3.0, 9.0], [8.0, 8.4], [11.0, 8.6], [-10.5, 4.6], [-7.5, 4.2], [-12.6, 1.0], [12.9, -4.8], [-1.2, -5.2], [1.6, -5.4], [-13.2, -5.0], [13.4, 3.4]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));
      [-13, -6.5, -2, 2.5, 7.5, 10.0].forEach(x => K.slot(x, 9.45, x, 14, 'view'));
      K.slot(-2.6, -5.4, -2.6, 0, 'selfie'); K.slot(-5.0, -5.4, -5.0, 0, 'selfie'); K.slot(-11.6, 8.9, -11.6, 0, 'selfie');
      // largo do mirante
      [-8.6, -6.6, 0.0, 2.6, 4.6, 7.4, 8.6].forEach(x => K.slot(x, -7.6, x, 0, 'view', 1));
      [-6.1, -4.4, -2.8, 3.9, 8.0].forEach(x => K.slot(x, -12.2, x, -20, 'view', 1));
      [[-7.0, -10.2], [-1.0, -9.6], [5.8, -9.6], [1.5, -10.3]].forEach(([x, z]) => K.slot(x, z, x + 0.5, z + 0.5, 'talk', 1));
      K.slot(-3.8, -11.9, -3.8, 0, 'selfie', 1); K.slot(8.2, -9.4, 8.2, 0, 'selfie', 1);
      [[-7.2, -8.8], [6.4, -8.8], [7.6, -10.4]].forEach(([x, z]) => K.slot(x, z, x, z + 1, 'dance', 1));
    }

    // ------------------------------------------------------------ fundo: encosta de Santa Teresa, casinhas, a Baía e o Pão de Açúcar
    const lump = (geo, k = 0.12) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = 1 + (Math.sin(x * 3.1 + y * 1.7) * Math.cos(z * 2.3 + x * 1.1) + Math.sin(y * 5.3 + z * 2.9) * 0.5) * k; p.setXYZ(i, x * n, y * n, z * n); } geo.computeVertexNormals(); return geo; };
    const forest = K.mat(0x3a6a30, { roughness: 1, flatShading: true }), forest2 = K.mat(0x2c5428, { roughness: 1, flatShading: true });
    // muro de arrimo atrás do mirante e a encosta que desce até a água
    K.box(18.8, 7, 0.6, K.mat(0x9a8a70, { roughness: 1 }), 0, L1 - 3.6, -13.25, { cast: false });
    { const g = new T.PlaneGeometry(220, 52, 30, 10); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, (R() - 0.5) * 1.6); g.computeVertexNormals(); K.add(g.rotateX(-Math.PI / 2), K.mat(0x4a6a34, { roughness: 1, flatShading: true }), 0, -13.5, -36, { rx: -0.5, cast: false }); }
        { const parts = [], wins = [], hc = [0xf2c14e, 0xe8869a, 0x4f8fc0, 0xf6f3ec, 0x9ac46a, 0xd77a4a, 0xc9a0d8, 0xe8d8b8, 0xff9a6a, 0x6ac0c0];
      for (let k = 0; k < 120; k++) { const x = (R() - 0.5) * 120, s = 0.08 + R() * 0.85; if (Math.abs(x) < 13 && s < 0.2) continue; const z = -16 - s * 44, y = -3.2 - s * 25, w = 2.5 + R() * 4, h = 2.4 + R() * 4.5, dd = 2.5 + R() * 3, c = hc[Math.floor(R() * hc.length)];
        parts.push([K.at(new T.BoxGeometry(w, h, dd), x, y + h / 2, z), c]); parts.push([K.at(new T.BoxGeometry(w + 0.2, 0.18, dd + 0.2), x, y + h + 0.09, z), R() < 0.5 ? 0x8a8a84 : 0xa8583a]);
        if (R() < 0.6) parts.push([K.at(new T.CylinderGeometry(0.45, 0.45, 0.7, 8), x + w * 0.25, y + h + 0.5, z), 0x2e6fb8]);
        for (let j = 0; j < 2; j++) wins.push([K.at(new T.BoxGeometry(0.5, 0.6, 0.05), x - w * 0.25 + j * w * 0.5, y + h * 0.6, z + dd / 2 + 0.03), R() < 0.45 ? 0xffc070 : 0x2a2a30]); }
      K.merge(parts, K.vcol({ roughness: 0.85 }), { cast: false }); K.merge(wins, new T.MeshBasicMaterial({ vertexColors: true, toneMapped: false }), { cast: false });
      const tr = [[], []]; for (let k = 0; k < 160; k++) { const x = (R() - 0.5) * 140, s = R(); tr[k % 2].push([x, -3.2 - s * 25 + 1.2, -15 - s * 44, R() * 3, 1.2 + R() * 2.2]); } K.inst(new T.IcosahedronGeometry(1, 1), forest, tr[0], { cast: false }); K.inst(new T.IcosahedronGeometry(1, 1), forest2, tr[1], { cast: false });
    }
    // a cidade lá embaixo e a baía
    // como os morros: sem neblina, com o sol baixo e a bruma pintados por vértice (com a neblina virava uma faixa bege lisa)
    { const parts = []; for (let k = 0; k < 90; k++) { const x = -120 + R() * 240, z = -62 - R() * 30, w = 4 + R() * 8, h = 4 + R() * 26; parts.push([K.at(new T.BoxGeometry(w, h, w), x, -28 + h / 2, z), [0xd8c4a8, 0xb0a494, 0x8e96a0, 0xe0cfb4, 0xc0a888][k % 5]]); }
      const cid = K.merge(parts, new T.MeshBasicMaterial({ vertexColors: true, fog: false, toneMapped: false }), { cast: false }), ga = cid.geometry.attributes, cc = new T.Color(), sun = new T.Vector3(-20, 15, 17).normalize(), nv = new T.Vector3(), bru = new T.Color(0xc88a8a);
      for (let i = 0; i < ga.position.count; i++) { nv.fromBufferAttribute(ga.normal, i); const k = 0.42 + Math.max(0, nv.dot(sun)) * 0.55 + Math.max(0, nv.y) * 0.1, hy = Math.min(1, (ga.position.getY(i) + 28) / 30);
        cc.fromBufferAttribute(ga.color, i).multiplyScalar(k * (0.75 + hy * 0.25)).lerp(bru, 0.28).convertSRGBToLinear(); ga.color.setXYZ(i, cc.r, cc.g, cc.b); } }
    const waterTex = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#d8e2ea'; g.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { g.strokeStyle = `rgba(${220 + R() * 35},${190 + R() * 50},${150 + R() * 60},${0.05 + R() * 0.15})`; g.lineWidth = 1 + R() * 1.5; const x = R() * w, y = R() * h, l = 6 + R() * 24; g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y); g.stroke(); } }, [40, 30]);
    // a baía também sem neblina (de longe ela virava a faixa bege atrás das casas): azul perto, o rosa do céu refletido no horizonte
    { const wg = new T.PlaneGeometry(1400, 900, 1, 30).rotateX(-Math.PI / 2), wp = wg.attributes.position, wc = new Float32Array(wp.count * 3), perto = new T.Color(0x2e5878), longe = new T.Color(0xb48ea8), cc = new T.Color();
      for (let i = 0; i < wp.count; i++) { const d = Math.min(1, Math.max(0, (-490 + wp.getZ(i) + 60) / -440)); cc.copy(perto).lerp(longe, Math.pow(d, 0.7)).convertSRGBToLinear(); wc.set([cc.r, cc.g, cc.b], i * 3); }
      wg.setAttribute('color', new T.BufferAttribute(wc, 3)); K.add(wg, new T.MeshBasicMaterial({ vertexColors: true, map: waterTex, fog: false, toneMapped: false }), 0, -28.5, -490, { cast: false }); }
    K.tick((dt, t) => { waterTex.offset.set(t * 0.003, Math.sin(t * 0.05) * 0.02); });
    for (let k = 0; k < 7; k++) { const b = K.group(-60 + R() * 140, -28.4, -120 - R() * 200, R() * 6); K.box(3 + R() * 3, 0.6, 1.2, M.white, 0, 0.3, 0, { parent: b, cast: false }); if (k % 2) K.add(new T.ConeGeometry(1.2, 4, 3), M.white, 0, 2.4, 0, { parent: b, cast: false }); }
    // Pão de Açúcar, Morro da Urca e o bondinho; Niterói ao longe; morros verdes dos lados; Corcovado
    // os morros de longe não levam a neblina nem a luz do motor (com elas ficavam cor de areia): a luz do sol baixo, a
    // sombra e a bruma do fim de tarde vêm pintadas por vértice, mata atlântica embaixo e granito nu em cima
    const haze = new T.Color(0xc88a8a), sunD = new T.Vector3(-20, 15, 17).normalize();
    const morro = (geo, x, y, z, s, o) => { const p = geo.attributes.position, nr = geo.attributes.normal, col = new Float32Array(p.count * 3), cc = new T.Color(), nv = new T.Vector3();
      const tone = (lit, dark, k) => cc.copy(dark).lerp(lit, k);
      const rl = new T.Color(o.rocha[0]), rd = new T.Color(o.rocha[1]), ml = new T.Color(o.mata[0]), md = new T.Color(o.mata[1]);
      for (let i = 0; i < p.count; i++) { const yy = p.getY(i), xx = p.getX(i), zz = p.getZ(i), n = Math.sin(xx * 7.1 + zz * 3.3) * 0.12 + Math.sin(xx * 2.3 - zz * 5.7 + yy * 4) * 0.08, u = (yy - (o.base || 0)) / (o.alto || 1);
        nv.set(nr.getX(i) / s[0], nr.getY(i) / s[1], nr.getZ(i) / s[2]).normalize(); const k = Math.max(0, nv.dot(sunD)) * 0.8 + Math.max(0, nv.y) * 0.2;
        if (u < o.mata_ate + n) tone(ml, md, k); else tone(rl, rd, k).multiplyScalar(0.94 + ((i * 13) % 7) * 0.02);
        cc.lerp(haze, o.bruma).convertSRGBToLinear(); col.set([cc.r, cc.g, cc.b], i * 3); } // cores pensadas como na tela
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); return K.add(geo, new T.MeshBasicMaterial({ vertexColors: true, fog: false, toneMapped: false }), x, y, z, Object.assign({ s, cast: false }, o.add)); };
    const ROCHA = [0x9a8288, 0x463e52], MATA = [0x4a6a3a, 0x1e3428], MATA_FUNDO = [0x3e5a34, 0x1a2c24];
    morro(lump(new T.SphereGeometry(1, 32, 22), 0.04), 62, -28, -240, [26, 92, 30], { rocha: ROCHA, mata: MATA, bruma: 0.22, base: -1, alto: 2, mata_ate: 0.5, add: { rz: -0.12 } });
    morro(lump(new T.SphereGeometry(1, 20, 12), 0.08), 62, -28, -240, [44, 26, 40], { rocha: MATA, mata: MATA, bruma: 0.22, mata_ate: 2 });
    morro(lump(new T.SphereGeometry(1, 24, 16), 0.06), 26, -28, -212, [32, 40, 30], { rocha: ROCHA, mata: MATA, bruma: 0.18, base: -1, alto: 2, mata_ate: 0.7 });
    morro(lump(new T.SphereGeometry(1, 20, 12), 0.08), 26, -28, -212, [40, 22, 36], { rocha: MATA, mata: MATA, bruma: 0.18, mata_ate: 2 });
    wire([26, 12, -212], [60, 63, -240], 2.5, new T.LineBasicMaterial({ color: 0x3a3a44 })); K.box(1.2, 0.9, 1.2, K.mat(0xe8e2d2), 43, 34.5, -226, { cast: false });
    for (const [x, z, sx, sy] of [[-160, -470, 90, 40], [-40, -500, 70, 55], [60, -480, 60, 34], [180, -460, 110, 48]]) morro(lump(new T.SphereGeometry(1, 18, 10), 0.08), x, -28, z, [sx, sy, 40], { rocha: [0x7a7a9a, 0x3e3e5e], mata: [0x5a6a7a, 0x34405a], bruma: 0.5, base: -1, alto: 2, mata_ate: 0.6 });
    K.add(lump(new T.SphereGeometry(1, 22, 14), 0.1), forest2, -95, -30, -95, { s: [55, 70, 50], cast: false });
    K.add(lump(new T.SphereGeometry(1, 22, 14), 0.1), forest, 120, -30, -80, { s: [60, 62, 45], cast: false });
    morro(lump(new T.ConeGeometry(1, 1, 16, 8), 0.06), -170, -30, -190, [50, 140, 50], { rocha: ROCHA, mata: MATA_FUNDO, bruma: 0.3, base: -0.5, alto: 1, mata_ate: 0.6 });
    morro(lump(new T.SphereGeometry(1, 20, 12), 0.1), -170, -30, -190, [80, 70, 70], { rocha: MATA_FUNDO, mata: MATA_FUNDO, bruma: 0.3, mata_ate: 2 });
    // o Cristo no topo do Corcovado
    { const cr = K.group(-170, 39.5, -190, 0.4); K.box(0.9, 5, 0.8, K.mat(0xf2efe6), 0, 2.5, 0, { parent: cr, cast: false }); K.box(5.5, 0.7, 0.6, K.mat(0xf2efe6), 0, 4, 0, { parent: cr, cast: false }); }
    K.add(lump(new T.SphereGeometry(1, 22, 14), 0.1), forest, -78, -12, -10, { s: [40, 32, 60], cast: false });
    K.add(lump(new T.SphereGeometry(1, 22, 14), 0.1), forest2, 80, -14, 5, { s: [44, 30, 60], cast: false });

    // ------------------------------------------------------------ frente: o vale e o morro da igrejinha (poleiro do sniper)
    K.add(new T.PlaneGeometry(400, 60).rotateX(-Math.PI / 2), K.mat(0x3a5a2a, { roughness: 1 }), 0, -9, 40, { cast: false });
    { const mato = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2f4a24'; g.fillRect(0, 0, w, h); for (let k = 0; k < 500; k++) { g.fillStyle = ['#3e5e2c', '#26401e', '#4a6e34', '#344f26'][(R() * 4) | 0]; g.beginPath(); g.ellipse(R() * w, R() * h, 4 + R() * 12, 3 + R() * 7, R() * 3, 0, 7); g.fill(); } }, [60, 1.2]);
      K.add(new T.PlaneGeometry(400, 7).rotateX(-Math.PI / 2), K.texMat(mato, { roughness: 1 }), 0, -4.5, 13.6, { rx: 0.9, cast: false }); }
    { const parts = [], tr = [[], []], hc = [0xf2c14e, 0xe8869a, 0x4f8fc0, 0xf6f3ec, 0x9ac46a, 0xd77a4a, 0xe8d8b8];
      for (let k = 0; k < 70; k++) { const x = (R() - 0.5) * 110, z = 14 + R() * 26, w = 3 + R() * 4, h = 2.5 + R() * 2.5, y = z < 17 ? -9 + (17 - z) * 0.9 - 2 : -9; if (y + h > -3.5) continue; parts.push([K.at(new T.BoxGeometry(w, h, w * 0.8), x, y + h / 2, z, R()), hc[k % hc.length]]); parts.push([K.at(new T.ConeGeometry(w * 0.75, 1.4, 4), x, y + h + 0.7, z, Math.PI / 4 + R() * 0.2), 0xa8583a]); }
      K.merge(parts, K.vcol({ roughness: 0.85 }), { cast: false });
      // mata da encosta: copas em três verdes, ipês amarelos e quaresmeiras roxas florindo, e bananeiras perto do muro
      tr.push([], [], []); const ground = (z) => z < 17 ? -9 + (17 - z) * 0.9 : -9;
      for (let k = 0; k < 190; k++) { const x = (R() - 0.5) * 130, z = 12.5 + R() * 34, base = ground(z), s = 1.2 + R() * 2; if (base + s * 1.4 > -1) continue; const r = R(); tr[r < 0.07 ? 3 : r < 0.12 ? 4 : k % 3 === 2 ? 2 : k % 2].push([x, base + s * 0.8, z, R() * 3, [s, s * (0.75 + R() * 0.3), s]]); }
      K.inst(new T.IcosahedronGeometry(1, 1), forest, tr[0], { cast: false }); K.inst(new T.IcosahedronGeometry(1, 1), forest2, tr[1], { cast: false });
      K.inst(new T.IcosahedronGeometry(1, 1), K.mat(0x4f7e36, { roughness: 1, flatShading: true }), tr[2], { cast: false });
      K.inst(new T.IcosahedronGeometry(1, 1), K.mat(0xe8b820, { roughness: 0.9, flatShading: true }), tr[3], { cast: false });
      K.inst(new T.IcosahedronGeometry(1, 1), K.mat(0x8a4ab0, { roughness: 0.9, flatShading: true }), tr[4], { cast: false });
      const folha = new T.PlaneGeometry(0.45, 1.7, 1, 3).translate(0, 0.85, 0); { const p = folha.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.pow(p.getY(i) / 1.7, 2) * 0.7); folha.rotateX(0.75).computeVertexNormals(); } // abre para fora e verga na ponta
      const caule = [], folhas = [];
      for (let k = 0; k < 46; k++) { const x = (R() - 0.5) * 80, z = 11.3 + R() * 2.4, base = ground(z), h = 1.2 + R() * 0.8; if (base + h + 1.2 > -1.2) continue; caule.push([x, base + h / 2, z, 0, [1, h, 1]]);
        for (let j = 0; j < 5; j++) folhas.push([x, base + h - 0.1, z, j * 1.26 + R() * 0.5, 0.8 + R() * 0.4]); }
      K.inst(new T.CylinderGeometry(0.09, 0.13, 1, 6), K.mat(0x6a7a3a, { roughness: 1 }), caule, { cast: false });
      K.inst(folha, K.mat(0x5a9a3a, { roughness: 0.8, side: T.DoubleSide }), folhas, { cast: false });
    }
    // morro e igrejinha colonial (a torre é o poleiro do sniper)
    K.add(lump(new T.SphereGeometry(34, 26, 16), 0.04), K.mat(0x4f7a38, { roughness: 1, flatShading: true }), -2, -26.5, 64, { cast: false });
    { const tx = -4, tz = 51.4, white = K.mat(0xf3efe6, { roughness: 0.8 }), trim = K.mat(0x2a5aa8, { roughness: 0.6 }), ochre = K.mat(0xe8c25a, { roughness: 0.7 });
      K.box(3.2, 11.3, 3.2, white, tx, 8.15, tz, { cast: false }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.box(0.3, 11.3, 0.3, ochre, tx + sx * 1.55, 8.15, tz + sz * 1.55, { cast: false });
      K.box(3.6, 0.3, 3.6, ochre, tx, 13.95, tz, { cast: false });
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.box(0.42, 3.0, 0.42, white, tx + sx * 1.45, 15.6, tz + sz * 1.45, { cast: false });
      K.box(2.6, 0.5, 0.15, white, tx, 14.35, tz - 1.5, { cast: false }); K.box(3.0, 0.08, 0.2, K.iron, tx, 14.62, tz - 1.62, { cast: false });
      K.box(3.6, 0.35, 3.6, ochre, tx, 17.25, tz, { cast: false }); K.add(new T.ConeGeometry(2.4, 2.8, 4).rotateY(Math.PI / 4), trim, tx, 18.85, tz, { cast: false });
      K.box(0.12, 1.1, 0.12, K.gold, tx, 20.8, tz, { cast: false }); K.box(0.6, 0.1, 0.1, K.gold, tx, 20.95, tz, { cast: false });
      K.lathe([[0, 0], [0.42, 0], [0.38, 0.12], [0.26, 0.55], [0.12, 0.7], [0, 0.7]], K.brass, tx + 0.6, 15.6, tz + 0.7, { cast: false }, 12);
      // nave com frontão
      K.box(8.0, 7.0, 12, white, 2.0, 8.5, tz + 6.4, { cast: false }); for (const s of [-1, 1]) K.box(4.6, 0.18, 12.4, trim, 2.0 + s * 2.05, 12.85, tz + 6.4, { rz: -s * 0.5, cast: false });
      { const sh = new T.Shape(); sh.moveTo(-4.1, 0); sh.lineTo(4.1, 0); sh.lineTo(0, 2.2); sh.lineTo(-4.1, 0); K.add(new T.ShapeGeometry(sh), white, 2.0, 12.0, tz + 0.38, { ry: Math.PI, cast: false }); K.add(new T.CircleGeometry(0.4, 16), K.glow(0xffc070, 1.2), 2.0, 12.8, tz + 0.36, { ry: Math.PI, cast: false }); }
      const facTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f3efe6'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8c25a'; g.fillRect(0, 0, 14, h); g.fillRect(w - 14, 0, 14, h); g.fillRect(0, h - 16, w, 16); g.fillStyle = '#2a5aa8'; winPath(g, true, 98, 150, 60, 92); g.fill(); g.fillStyle = '#6a3a1e'; winPath(g, true, 104, 158, 48, 84); g.fill(); g.fillStyle = '#ffc070'; g.beginPath(); g.arc(128, 80, 26, 0, 7); g.fill(); g.strokeStyle = '#2a5aa8'; g.lineWidth = 6; g.beginPath(); g.arc(128, 80, 28, 0, 7); g.stroke(); for (const x of [50, 206]) { g.fillStyle = '#2a5aa8'; winPath(g, true, x - 16, 110, 32, 60); g.fill(); g.fillStyle = '#ffc070'; winPath(g, true, x - 11, 116, 22, 50); g.fill(); } });
      K.add(new T.PlaneGeometry(8.0, 7.0), new T.MeshStandardMaterial({ map: facTex, emissiveMap: facTex, emissive: 0xffffff, emissiveIntensity: 0.12, roughness: 0.8 }), 2.0, 8.5, tz + 0.39, { ry: Math.PI, cast: false });
      K.halo(tx, 15.0, 49.7, 0.25, 0xff4134, 0.9);
      for (const [x, z] of [[-9, 47], [8, 46], [12, 52]]) palm(x, z, 3.0, 7, (R() - 0.5) * 0.3);
    }
    // ------------------------------------------------------------ otimização: funde as peças estáticas por material (menos draw calls)
    { root.updateMatrixWorld(true); const inv = new T.Matrix4().copy(root.matrixWorld).invert(), buckets = new Map(), rm = [];
      root.traverse(o => {
        if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || o.renderOrder) return;
        for (let p = o; p && p !== root; p = p.parent) if (p.userData.dyn || !p.visible) return;
        const m = o.material, g = o.geometry; if (m.transparent || m.blending !== T.NormalBlending) return;
        if (Object.keys(g.attributes).sort().join(',') !== 'normal,position,uv' || g.morphAttributes.position) return;
        const k = m.uuid + '|' + o.castShadow + '|' + o.receiveShadow; if (!buckets.has(k)) buckets.set(k, { m, cast: o.castShadow, recv: o.receiveShadow, list: [] });
        buckets.get(k).list.push([o, new T.Matrix4().multiplyMatrices(inv, o.matrixWorld)]);
      });
      buckets.forEach(b => { if (b.list.length < 2) return; let n = 0; const gs = b.list.map(([o, mx]) => { const gg = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(); gg.applyMatrix4(mx); if (mx.determinant() < 0) { const p = gg.attributes.position.array, nn = gg.attributes.normal.array, uv = gg.attributes.uv.array; for (let i = 0; i < p.length; i += 9) for (const a of [p, nn]) for (let c = 0; c < 3; c++) { const t = a[i + 3 + c]; a[i + 3 + c] = a[i + 6 + c]; a[i + 6 + c] = t; } for (let i = 0; i < uv.length; i += 6) for (let c = 0; c < 2; c++) { const t = uv[i + 2 + c]; uv[i + 2 + c] = uv[i + 4 + c]; uv[i + 4 + c] = t; } } n += gg.attributes.position.count; rm.push(o); return gg; });
        const out = new T.BufferGeometry(); for (const [name, sz] of [['position', 3], ['normal', 3], ['uv', 2]]) { const arr = new Float32Array(n * sz); let off = 0; gs.forEach(gg => { arr.set(gg.attributes[name].array, off); off += gg.attributes[name].array.length; }); out.setAttribute(name, new T.BufferAttribute(arr, sz)); }
        const me = new T.Mesh(out, b.m); me.castShadow = b.cast; me.receiveShadow = b.recv; root.add(me); });
      rm.forEach(o => o.parent.remove(o));
    }
  },
  // ninho do sniper: torre da igrejinha, entre os sinos. Peitoril caiado descascando (aparece o tijolo), faixa de azulejo
  // azul e branco, confete e serpentina que voaram do bloco, e os dois sinos de bronze balançando devagar nas laterais
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.9 }), cal = 0xe2dccc;
    N.tampo(cal, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 61, draw: (c, w, h, R) => {
      c.fillStyle = '#e4ddcc'; c.fillRect(0, 0, w, h); K.manchas(c, w, h, R, 140, ['200,190,170', '250,248,240'], 6, 40, 0.3);
      for (let k = 0; k < 7; k++) { c.fillStyle = '#b06848'; const x = R() * w, y = 30 + R() * (h - 50); c.beginPath(); c.moveTo(x, y); for (let j = 0; j < 7; j++) c.lineTo(x + Math.cos(j) * (10 + R() * 22), y + Math.sin(j) * (6 + R() * 10)); c.fill(); }
      for (let x = 0; x < w; x += 22) for (let r = 0; r < 1; r++) { c.fillStyle = '#f2f0ea'; c.fillRect(x, 2, 21, 21); c.fillStyle = '#2a5aa8'; c.beginPath(); c.arc(x + 10.5, 12.5, 6, 0, 7); c.fill(); c.fillRect(x + 9, 3, 3, 19); c.fillRect(x + 1, 11, 19, 3); }
      const cf = ['#ff3d7f', '#ffd23f', '#2ec4b6', '#7a3aff', '#ff7a2a', '#3fe07a']; for (let k = 0; k < 420; k++) { c.fillStyle = cf[(R() * 6) | 0]; c.save(); c.translate(R() * w, 26 + R() * (h - 26)); c.rotate(R() * 3); c.fillRect(-2.5, -1.5, 5, 3); c.restore(); }
      for (const [col, y0] of [['#ff3d7f', h * 0.5], ['#ffd23f', h * 0.7]]) { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); for (let x = w * 0.05; x < w * 0.45; x += 4) c.lineTo(x, y0 + Math.sin(x * 0.05) * 12 + Math.sin(x * 0.013) * 20); c.stroke(); }
      K.grain(c, w, h, 10);
    } });
    N.box(5.6, 0.1, 1.0, 0x2a5aa8, 0, -0.96, -1.1).box(5.6, 0.06, 1.02, 0xf2f0ea, 0, -0.88, -1.1).box(5.4, 3.2, 0.9, 0xe0d8c4, 0, -2.6, -0.95);
    for (const sx of [-1, 1]) N.box(0.8, 2.2, 0.8, cal, sx * 2.25, 0.31, -0.87).box(0.4, 0.06, 0.06, 0x5a4030, sx * 2.25, 1.38, -0.9);
    N.fim();
    const bronze = K.metal(0x8a6a3a, 0.45), bells = [];
    for (const sx of [-1, 1]) { const b = K.group(sx * 2.25, 1.36, -0.9, 0, g); K.lathe([[0, -0.02], [0.12, -0.02], [0.17, -0.2], [0.22, -0.42], [0.3, -0.5], [0.3, -0.53], [0, -0.53]], bronze, 0, 0, 0, { parent: b, cast: false }, 18); K.sphere(0.05, bronze, 0, -0.47, 0, { parent: b, cast: false }, 8, 6); bells.push(b); }
    K.tick((dt, t) => bells.forEach((b, i) => { b.rotation.x = Math.sin(t * 0.8 + i * 1.7) * 0.08; }));
  },
});
