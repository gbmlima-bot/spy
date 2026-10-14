// 01 · Baile de Máscaras: terraço de um palazzo gótico no Grande Canal, Veneza, noite de carnaval.
// O sniper está no campanário do outro lado do canal. Todo mundo de máscara: identificar alguém pelo rosto é impossível,
// então o sniper precisa ler roupas, gestos e as mudanças que as missões deixam no cenário.
MIRA_CENARIOS.push({
  id: 'veneza',
  nome: 'Baile de Máscaras',
  lugar: 'Palazzo no Grande Canal, Veneza',
  hora: 'noite de carnaval',
  resumo: 'Loggia gótica, quarteto de cordas, lustre de Murano sobre a pista, banca de máscaras e gôndolas atracadas. Quase ninguém mostra o rosto.',
  sniper: { pos: [-4, 15.5, 44], desc: 'campanário de San Vidal, do outro lado do canal' },
  niveis: [{ nome: 'terraço do palazzo', y: 0, x0: -14.5, x1: 14.5, z0: -10, z1: 13.4 }],
  convidados: 28,
  inicio: [1.5, 7.5, 0],
  ambiente: {
    ceu: ['#070b1e', '#16224a', '#34305a', '#7a4a52'], neblina: [0x1a1f36, 55, 170], hemi: [0x8ea4d6, 0x3a2c22, 0.22],
    sol: [0x9fb4ff, 0.6, -18, 24, 20], preenche: [0xffa860, 0.22], exposicao: 0.92, bloom: 0.75,
  },
  guardaRoupa: {
    ternos: [[0x1b1b1f, 'casaca preta'], [0x5b2232, 'casaca bordô'], [0x1f2a44, 'casaca azul-noite'], [0xece6da, 'casaca marfim'], [0x2f4a3a, 'casaca verde-garrafa'], [0x4a3a6a, 'casaca violeta']],
    vestidos: [[0x8a1020, 'vestido carmim'], [0xd9b77a, 'vestido dourado'], [0x1b1b22, 'vestido preto'], [0x2e5fa8, 'vestido azul-real'], [0x6b3f8c, 'vestido púrpura'], [0xf1ece2, 'vestido de cetim branco'], [0x1f8a78, 'vestido verde-laguna']],
    longo: 0.85, tacas: ['coupe', 'wine', 'coupe'], drinks: [0xff7a2a, 0xf2c14e, 0xffd9a0, 0xb3122e],
    extra(o, r) {
      const mc = [0xd9a441, 0xc9ced6, 0xf1ece2, 0x16161a, 0x8a1020][Math.floor(r() * 5)];
      if (r() < 0.82) { o.mask = r() < 0.2 ? 'domino' : 'venetian'; o.maskColor = mc; o.maskFeather = [0xf6f3ec, 0x16161a, 0x8a1020, 0xd9a441][Math.floor(r() * 4)]; o.name += mc === 0xd9a441 ? ', máscara dourada' : mc === 0xc9ced6 ? ', máscara prateada' : mc === 0x16161a ? ', máscara negra' : mc === 0x8a1020 ? ', máscara vermelha' : ', máscara branca'; }
      if (!o.dress && r() < 0.3) { o.hat = 'tricorn'; o.hatColor = 0x16161a; o.name += ', tricórnio'; }
      if (r() < 0.18) { o.cape = [0x16161a, 0x5b2232, 0x1f2a44][Math.floor(r() * 3)]; o.name += ', capa'; }
      if (o.dress && r() < 0.25) { o.propL = 'fan'; o.propColor = [0x16161a, 0xd9a441, 0x8a1020][Math.floor(r() * 3)]; o.clutch = false; o.name += ', leque'; }
    },
  },
  elenco: [
    { x: 4.6, z: -8.6, rot: 0.15, anim: 7, fala: 'Em Veneza, quem mostra o rosto já perdeu.', outfit: { dress: true, gown: true, satin: true, main: 0x8a1020, skin: 0, hair: 0x1a1411, hairStyle: 'bun', necklace: true, earring: true, accent: 0xd9a441, hat: 'tiara', mask: 'venetian', maskColor: 0xd9a441, maskFeather: 0x16161a, propL: 'fan', propColor: 0x16161a, name: 'Contessa Ludovica, de vestido carmim e leque negro' } },
    { x: -1.3, z: -3.9, rot: 0.6, anim: 0, fala: 'Não há cura para a curiosidade.', outfit: { dress: false, main: 0x16161a, pants: 0x16161a, shirt: 0x2a2a30, tie: 0x16161a, skin: 1, hair: 0x1a1411, mask: 'plague', hat: 'top', hatColor: 0x16161a, hatBand: 0x16161a, cape: 0x16161a, gloves: 0x16161a, prop: 'cane', name: 'Dottore della Peste, de bico branco e capa preta' } },
    { x: 11.6, z: 11.4, rot: -1.4, anim: 19, y: 0.05, fala: 'Gôndola não tem pressa, signore.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x8b1e2d, skin: 2, hair: 0x3b2a1e, stripes: 0x1f2a6a, hat: 'boater', hatBand: 0xc8322f, scarf: 0xc8322f, prop: 'oar', name: 'gondoleiro Beppe, de camisa listrada e chapéu de palha' } },
    { x: -10.9, z: 2.7, rot: 0.9, anim: 13, y: 0.3, fala: 'Vivaldi, de novo? Sempre Vivaldi.', outfit: { dress: true, gown: true, satin: true, main: 0x1f8a78, skin: 1, hair: 0x8a3a22, hairStyle: 'long', earring: true, mask: 'domino', maskColor: 0x16161a, prop: 'violin', name: 'violinista Chiara, de vestido verde-laguna' } },
    { x: -9.2, z: 3.5, rot: -2.3, anim: 14, y: 0.3, fala: 'Mais piano, mais piano!', outfit: { dress: false, main: 0x16161a, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0xf6f3ec, bow: true, skin: 0, hair: 0xa9a9a9, hairStyle: 'quiff', glasses: 'monocle', prop: 'baton', name: 'maestro Arrigo, de fraque e monóculo' } },
    { x: -12.6, z: -3.6, rot: 1.57, anim: 10, fala: 'Spritz com Aperol ou com Select?', outfit: { dress: false, main: 0x6b1e2a, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x16161a, bow: true, skin: 3, hair: 0x1a1411, hairStyle: 'short', beard: true, stripes: 0xd9a441, prop: 'shaker', name: 'barman Toni, de colete listrado' } },
    { x: 6.0, z: 3.6, rot: 2.2, anim: 3, fala: 'Ninguém dança como o Arlequim!', outfit: { dress: false, main: 0xc8322f, pants: 0x2e5fa8, shirt: 0xe9c33b, tie: 0x2c7a4b, skin: 2, hair: 0x1a1411, mask: 'domino', maskColor: 0x16161a, hat: 'tricorn', hatColor: 0x2c7a4b, stripes: 0xe9c33b, name: 'Arlequim, de remendos coloridos' } },
    { x: 12.4, z: -1.8, rot: -2.4, anim: 18, fala: 'Um sorriso, signora! Ah, a máscara.', outfit: { dress: false, main: 0x8a7a5a, pants: 0x3a3a30, shirt: 0xf0ead8, tie: 0x5a4a30, skin: 4, hair: 0x1a1411, hairStyle: 'short', glasses: 'round', hat: 'beret', hatColor: 0x2a2a30, prop: 'camera', name: 'fotógrafo da revista, de colete cáqui e boina' } },
  ],
  missoes: [
    { k: 'poco', label: 'Deixar o bilhete no poço', where: 'poço de pedra, no centro', s: [0.0, -0.6], l: [0.0, -2.0] },
    { k: 'torre', label: 'Trocar a taça do topo da torre de champanhe', where: 'bufê, na frente', s: [-2.3, 4.4], l: [-2.3, 5.4] },
    { k: 'mascara', label: 'Trocar a máscara dourada da banca', where: 'banca de máscaras, à direita', s: [11.5, -2.9], l: [11.5, -4.3] },
    { k: 'gondola', label: 'Esconder o mapa na gôndola', where: 'píer das gôndolas', s: [8.0, 11.0], l: [9.6, 11.0] },
    { k: 'leao', label: 'Fotografar o leão alado', where: 'coluna na beira do canal', s: [-2.95, 8.6], l: [-4.0, 8.75] },
    { k: 'lustre', label: 'Afrouxar o lustre de Murano', where: 'pista de dança, pilar do arco', s: [1.7, 1.2], l: [1.0, 1.2] },
    { k: 'partitura', label: 'Trocar a partitura do quarteto', where: 'palco do quarteto', s: [-7.1, 2.4], l: [-8.6, 2.4] },
    { k: 'aperol', label: 'Marcar a garrafa de Aperol', where: 'bacaro, balcão', s: [-10.2, -1.2], l: [-11.2, -2.2] },
    { k: 'relogio', label: 'Adiantar o relógio da loggia', where: 'loggia, à direita', s: [9.4, -8.2], l: [9.4, -9.4] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r;
    // ------------------------------------------------------------ materiais e texturas
    const marbleW = K.mat(0xeee8dc, { roughness: 0.35, metalness: 0.02 }), marbleR = K.mat(0xc98f86, { roughness: 0.4 }), istria = K.mat(0xe3dccb, { roughness: 0.7 });
    const plaster = K.mat(0xd29a72, { roughness: 0.9 }), plasterDark = K.mat(0xa86a48, { roughness: 0.9 });
    const gilt = K.metal(0xd4a34a, 0.25), velvet = K.mat(0x6b1020, { roughness: 0.9 }), oakDark = K.mat(0x3a2414, { roughness: 0.6 });
    const floorTex = K.canvasTex(1024, 1024, (g, w, h) => {
      const n = 8, s = w / n;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const pink = (i + j) % 2; const v = 230 + (R() * 14 - 7);
        g.fillStyle = pink ? `rgb(${v - 60},${v - 130},${v - 128})` : `rgb(${v - 12},${v - 20},${v - 34})`; g.fillRect(i * s, j * s, s, s);
        for (let k = 0; k < 18; k++) { g.strokeStyle = pink ? 'rgba(120,50,50,.12)' : 'rgba(140,130,120,.13)'; g.lineWidth = 1 + R() * 1.5; g.beginPath(); const x = i * s + R() * s, y = j * s + R() * s; g.moveTo(x, y); g.bezierCurveTo(x + R() * 60 - 30, y + R() * 60 - 30, x + R() * 80 - 40, y + R() * 80 - 40, x + R() * 120 - 60, y + R() * 120 - 60); g.stroke(); }
      }
      g.strokeStyle = 'rgba(90,70,60,.5)'; g.lineWidth = 2; for (let k = 0; k <= n; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke(); g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke(); }
      K.grain(g, w, h, 10);
    }, [4, 3.2]);
    floorTex.rotation = Math.PI / 4; floorTex.center.set(0.5, 0.5);
    K.floor(-14.5, -10, 14.5, 9.8, floorTex, { m: { roughness: 0.32, metalness: 0.05, envMapIntensity: 0.6 } });
    // borda de pedra da Ístria ao redor do piso
    K.box(29.4, 0.06, 0.5, istria, 0, 0.03, 9.6, { cast: false });

    // ------------------------------------------------------------ canal, água, fondamenta do outro lado
    const waterTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#0d2a33'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 900; k++) { const x = R() * w, y = R() * h, l = 6 + R() * 26; g.strokeStyle = `rgba(${120 + R() * 80},${170 + R() * 60},${170 + R() * 50},${0.05 + R() * 0.12})`; g.lineWidth = 1 + R() * 1.6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 2, x + l, y); g.stroke(); }
    }, [14, 8]);
    const waterMat = new T.MeshStandardMaterial({ color: 0x2a6a72, map: waterTex, roughness: 0.12, metalness: 0.35, envMapIntensity: 1.1, emissive: 0x08242a, emissiveIntensity: 0.6 });
    K.add(new T.PlaneGeometry(220, 80).rotateX(-Math.PI / 2), waterMat, 0, -0.65, 49.8, { cast: false });
    K.tick((dt, t) => { waterTex.offset.set(Math.sin(t * 0.07) * 0.05, t * 0.01); });
    // reflexos de luz na água (manchas aditivas)
    for (let k = 0; k < 14; k++) K.pool(-14 + k * 2.2 + R(), 13 + R() * 14, 0.6 + R() * 1.2, 0xffa850, 0.22, -0.62);
    // muro de pedra do canal
    K.box(60, 0.9, 0.5, istria, 0, -0.2, 10.05, { cast: false });
    // margem oposta: palazzi com janelas acesas, longe o bastante para não tapar a câmera isométrica
    const palTex = (base, seed) => K.canvasTex(256, 512, (g, w, h) => {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (let f = 0; f < 4; f++) for (let b = 0; b < 4; b++) {
        const x = 18 + b * 58, y = 40 + f * 115, lit = R() < 0.6; g.fillStyle = lit ? '#ffc070' : '#1c1a22';
        g.beginPath(); g.moveTo(x, y + 60); g.lineTo(x, y + 22); g.quadraticCurveTo(x, y, x + 18, y - 8); g.quadraticCurveTo(x + 36, y, x + 36, y + 22); g.lineTo(x + 36, y + 60); g.fill();
        g.fillStyle = 'rgba(240,230,210,.8)'; g.fillRect(x - 4, y + 60, 44, 5);
      }
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, h - 40, w, 40);
    });
    const opp = [['#c98a6a', 13], ['#e0c49a', 16], ['#a85a4a', 12], ['#d9b48a', 15], ['#b87a5a', 14], ['#e8d2b0', 13], ['#9a6a5a', 17], ['#cf9a7a', 12], ['#dcb890', 15]];
    let ox = -46;
    opp.forEach(([c, hgt], k) => {
      const w = 9 + R() * 3, tex = palTex(c, k);
      K.add(new T.BoxGeometry(w, hgt, 9), new T.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.35, roughness: 0.9 }), ox + w / 2, hgt / 2 - 0.6, 50, { cast: false });
      K.box(w + 0.4, 0.4, 9.4, K.mat(0x8a4a3a), ox + w / 2, hgt - 0.4, 50, { cast: false });
      ox += w + 0.3;
    });
    // campanário (onde o sniper está)
    { const g = K.group(-4, -0.6, 47);
      K.box(4.2, 16, 4.2, K.mat(0xa04a36, { roughness: 0.9 }), 0, 8, 0, { parent: g, cast: false });
      K.box(4.6, 3, 4.6, istria, 0, 17.5, 0, { parent: g, cast: false });
      for (const [x, z] of [[-1.4, 2.31], [0, 2.31], [1.4, 2.31]]) K.box(0.8, 2.1, 0.1, K.mat(0x0a0a10), x, 17.4, z, { parent: g, cast: false });
      K.cone(3.1, 5, K.mat(0x4a7a6a, { roughness: 0.5, metalness: 0.3 }), 0, 21.5, 0, { parent: g, cast: false }, 4).rotation.y = Math.PI / 4;
      K.sphere(0.35, gilt, 0, 24.3, 0, { parent: g, cast: false }); K.halo(-4, 16.4, 44.8, 0.4, 0xff4134, 1.2); }
    // palazzi vizinhos nas laterais (fecham o diorama)
    const sideTex = (c) => palTex(c, 0);
    // perto da festa só construções baixas (a câmera gira e não pode ser tapada); os palazzi altos ficam mais longe
    [[-1, 0x9a5a4a, '#b87a5a', 13], [1, 0x8a5a3a, '#d9b48a', 11]].forEach(([sd, roof, c, hgt]) => {
      const t = sideTex(c), fm = new T.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.25, roughness: 0.9 });
      K.add(new T.BoxGeometry(12, hgt, 24), fm, sd * 32, hgt / 2 - 0.6, -2, { cast: false }); K.box(12.4, 0.4, 24.4, K.mat(roof), sd * 32, hgt - 0.4, -2, { cast: false });
      // casa de barcos baixa com telhado de telha, colada no terraço
      const bt = K.canvasTex(256, 64, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let k = 0; k < 4; k++) { g.fillStyle = '#2a1e18'; g.beginPath(); g.moveTo(14 + k * 62, h); g.lineTo(14 + k * 62, 26); g.quadraticCurveTo(14 + k * 62, 8, 34 + k * 62, 8); g.quadraticCurveTo(54 + k * 62, 8, 54 + k * 62, 26); g.lineTo(54 + k * 62, h); g.fill(); } });
      K.add(new T.BoxGeometry(10, 3, 20), [K.texMat(bt), K.texMat(bt), K.mat(roof), K.mat(roof), K.texMat(bt), K.texMat(bt)], sd * 20.2, 0.9, -1, { cast: false });
      const roofG = new T.CylinderGeometry(0.01, 6, 1.6, 4, 1); roofG.rotateY(Math.PI / 4); roofG.scale(1.2, 1, 2.4);
      K.add(roofG, K.mat(0xa84a32, { roughness: 0.85 }), sd * 20.2, 3.2, -1, { cast: false });
      for (let k = 0; k < 4; k++) K.cyl(0.15, 0.2, 0.7, K.mat(0xa84a32), sd * (17 + k * 2.2), 3.4, -1 + (k % 2) * 4, { cast: false });
      K.add(new T.PlaneGeometry(10, 26).rotateX(-Math.PI / 2), K.mat(0x7a6a5a, { roughness: 0.95 }), sd * 20.2, -0.58, 1, { cast: false });
    });
    // paline: postes listrados de atracar
    const palina = (x, z, c) => { const g = K.group(x, -0.65, z); for (let k = 0; k < 6; k++) K.cyl(0.11, 0.11, 0.5, k % 2 ? K.mat(0xf2efe8) : K.mat(c), 0, 0.25 + k * 0.5, 0, { parent: g }, 10); K.sphere(0.14, gilt, 0, 3.1, 0, { parent: g }, 10, 6); };
    [[-12, 12.5], [-11.2, 12.9], [3.2, 12.6], [13.5, 12.8], [14.3, 12.4]].forEach(([x, z], k) => palina(x, z, k % 2 ? 0xc8322f : 0x1f3a8a));

    // ------------------------------------------------------------ píer de madeira e gôndolas
    const plank = K.mat(0x6a4a2e, { roughness: 0.85 });
    for (let k = 0; k < 9; k++) K.box(3.1, 0.08, 0.36, k % 3 ? plank : K.mat(0x5a3e26, { roughness: 0.9 }), 7.0, -0.02, 10.0 + k * 0.4, { cast: false });
    for (const x of [5.6, 8.4]) for (const z of [10.4, 13.2]) K.cyl(0.1, 0.1, 1.3, oakDark, x, -0.3, z);
    K.col(-14.5, 9.8, 5.45, 13.4); K.col(8.55, 9.8, 14.5, 13.4);
    const gondola = (x, z, ry, lanternC) => {
      const g = K.group(x, -0.55, z, ry);
      const sh = new T.Shape(); sh.moveTo(-5.5, 0.6); sh.quadraticCurveTo(-3, -0.05, 0, 0); sh.quadraticCurveTo(3, -0.05, 5.3, 0.9); sh.lineTo(5.0, 1.0); sh.quadraticCurveTo(3, 0.45, 0, 0.42); sh.quadraticCurveTo(-3, 0.45, -5.3, 0.75); sh.lineTo(-5.5, 0.6);
      const hull = new T.ExtrudeGeometry(sh, { depth: 1.3, bevelEnabled: false }); hull.translate(0, 0, -0.65);
      K.add(hull, K.mat(0x0c0c10, { roughness: 0.25, metalness: 0.3 }), 0, 0, 0, { parent: g });
      K.box(8, 0.06, 1.1, K.mat(0x5a2a1a), 0, 0.42, 0, { parent: g });
      // ferro de proa (pettine) e assento de veludo
      const fe = K.group(5.05, 0.95, 0, 0, g); for (let k = 0; k < 6; k++) K.box(0.05, 0.08, 0.32, K.silver, -k * 0.12, 0.05, 0, { parent: fe }); K.box(0.7, 0.07, 0.04, K.silver, -0.3, 0.25, 0, { parent: fe }); K.box(0.06, 0.55, 0.36, K.silver, 0.05, 0.25, 0, { parent: fe });
      K.add(K.rbox(1.2, 0.3, 0.8, 0.08), velvet, -0.8, 0.6, 0, { parent: g }); K.add(K.rbox(0.25, 0.5, 0.8, 0.06), velvet, -1.4, 0.75, 0, { parent: g });
      for (const s of [-1, 1]) K.add(new T.TorusGeometry(0.12, 0.03, 6, 10), gilt, -0.8, 0.85, s * 0.42, { parent: g });
      K.box(0.3, 0.3, 0.3, oakDark, 3.0, 0.55, 0.25, { parent: g });
      const lan = K.box(0.16, 0.24, 0.16, K.glow(lanternC, 2), 1.5, 1.0, 0.5, { parent: g, cast: false });
      K.cyl(0.015, 0.015, 0.5, K.iron, 1.5, 0.7, 0.5, { parent: g });
      return { g, lan };
    };
    const gMain = gondola(11.4, 11.0, Math.PI, 0xffb050);
    gondola(-8.5, 12.0, 0.08, 0xffb050);
    const gonLight = K.plight(9.9, 0.6, 11.5, 0xffb050, 0.8, 4);
    K.tick((dt, t) => { gMain.g.position.y = -0.55 + Math.sin(t * 1.1) * 0.03; gMain.g.rotation.z = Math.sin(t * 0.8) * 0.015; });
    K.tell('gondola', (live) => { gMain.lan.material = K.glow(0x40ff80, 2.2); gonLight.color.set(0x40ff80); if (live) K.anim(1.2, (e) => { gonLight.intensity = 0.8 + Math.sin(e * 30) * 0.6; }); }, () => { gMain.lan.material = K.glow(0xffb050, 2); gonLight.color.set(0xffb050); gonLight.intensity = 0.8; });

    // ------------------------------------------------------------ palazzo: fachada gótica + loggia em arcos
    const facTex = K.canvasTex(1024, 512, (g, w, h) => {
      g.fillStyle = '#c48a66'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(${150 + R() * 60},${90 + R() * 40},${60 + R() * 30},${R() * 0.08})`; g.fillRect(R() * w, R() * h, 2 + R() * 8, 2 + R() * 8); }
      // janelas góticas em trifora no piano nobile
      const win = (x, y, ww, hh, lit) => { g.fillStyle = '#efe6d4'; g.fillRect(x - 6, y - 6, ww + 12, hh + 12); g.fillStyle = lit ? '#ffcf86' : '#24202a'; g.beginPath(); g.moveTo(x, y + hh); g.lineTo(x, y + hh * 0.35); g.quadraticCurveTo(x, y + hh * 0.1, x + ww / 2, y); g.quadraticCurveTo(x + ww, y + hh * 0.1, x + ww, y + hh * 0.35); g.lineTo(x + ww, y + hh); g.fill(); g.strokeStyle = '#efe6d4'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + ww / 2, y + 8); g.lineTo(x + ww / 2, y + hh); g.stroke(); };
      for (let k = 0; k < 9; k++) win(40 + k * 108, 70, 52, 120, R() < 0.75);
      for (let k = 0; k < 9; k++) win(52 + k * 108, 300, 30, 80, R() < 0.5);
      g.fillStyle = '#efe6d4'; g.fillRect(0, 222, w, 10); g.fillRect(0, 440, w, 14);
    });
    const facM = new T.MeshStandardMaterial({ map: facTex, emissiveMap: facTex, emissive: 0xffffff, emissiveIntensity: 0.05, roughness: 0.9 });
    K.add(new T.BoxGeometry(31, 8.2, 0.6), facM, 0, 4.5 + 4.1, -10.3, { cast: false });
    K.box(31, 4.6, 0.6, plaster, 0, 2.3, -10.3, { cast: false });
    // balcão do piano nobile com balaústres
    K.box(29.4, 0.3, 3.8, istria, 0, 4.55, -8.5);
    const bal = []; for (let x = -14.2; x <= 14.2; x += 0.32) bal.push([x, 4.95, -6.68]);
    K.inst(new T.LatheGeometry([[0, 0], [0.06, 0], [0.06, 0.05], [0.035, 0.12], [0.075, 0.3], [0.035, 0.46], [0.06, 0.52], [0, 0.52]].map(p => new T.Vector2(p[0], p[1])), 8), istria, bal);
    K.box(29.4, 0.1, 0.24, istria, 0, 5.52, -6.68);
    // arcada da loggia (parede com arcos vazados)
    { const sh = new T.Shape(); sh.moveTo(-14.7, 0); sh.lineTo(14.7, 0); sh.lineTo(14.7, 4.4); sh.lineTo(-14.7, 4.4); sh.lineTo(-14.7, 0);
      for (let k = 0; k < 9; k++) { const cx = -12.8 + k * 3.2, hw = 1.25, hp = new T.Path(); hp.moveTo(cx - hw, 0); hp.lineTo(cx + hw, 0); hp.lineTo(cx + hw, 2.7); hp.quadraticCurveTo(cx + hw, 3.6, cx, 3.95); hp.quadraticCurveTo(cx - hw, 3.6, cx - hw, 2.7); hp.lineTo(cx - hw, 0); sh.holes.push(hp); }
      const arc = new T.ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false }); arc.translate(0, 0, -6.95);
      K.add(arc, K.mat(0xe8dfcc, { roughness: 0.7 }), 0, 0, 0);
      for (let k = 0; k < 10; k++) { const x = -14.4 + k * 3.2; K.col(x - 0.2, -6.95, x + 0.2, -6.5); K.box(0.5, 0.25, 0.6, istria, x, 0.12, -6.72); K.box(0.55, 0.25, 0.62, istria, x, 2.62, -6.72); }
      K.col(-14.5, -6.95, -14.0, -6.5); K.col(14.0, -6.95, 14.5, -6.5);
    }
    // teto de caixotões dourados visto por baixo + piso da loggia
    K.box(29.4, 0.1, 3.4, K.mat(0x3a2414, { roughness: 0.7 }), 0, 4.38, -8.6, { cast: false });
    K.box(29.4, 0.02, 3.5, K.mat(0x6e1e26, { roughness: 0.95 }), 0, 0.012, -8.5, { cast: false });
    // retratos com molduras douradas na parede do fundo
    const portrait = (x, hue) => { K.box(1.3, 1.7, 0.08, gilt, x, 2.4, -9.94); const t = K.canvasTex(128, 168, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, `hsl(${hue},30%,22%)`); gr.addColorStop(1, '#100c08'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#e0b090'; g.beginPath(); g.ellipse(64, 66, 22, 28, 0, 0, 7); g.fill(); g.fillStyle = `hsl(${hue},45%,30%)`; g.beginPath(); g.ellipse(64, 160, 52, 60, 0, 0, 7); g.fill(); g.fillStyle = '#2a1a10'; g.beginPath(); g.ellipse(64, 46, 25, 16, 0, Math.PI, 0); g.fill(); }); K.add(new T.PlaneGeometry(1.1, 1.5), K.texMat(t), x, 2.4, -9.89, { cast: false }); K.box(0.06, 0.4, 0.06, gilt, x, 3.4, -9.92); };
    [-11.2, -4.8, 1.6, 8.0, 12.8].forEach((x, k) => portrait(x, k * 60 + 10));
    // candelabros de parede com velas
    for (const x of [-8, -1.6, 4.8, 11.2]) { K.box(0.08, 0.3, 0.12, gilt, x, 2.6, -9.92); for (const s of [-0.15, 0, 0.15]) { K.cyl(0.02, 0.02, 0.12, M.candle, x + s, 2.82, -9.78, { cast: false }); K.flame(x + s, 2.88, -9.78, 0.014); } }
    // sofás de veludo, mesa de cartas e o trono da contessa
    K.sofa(-6.0, -9.2, 2.4, 0, { cloth: velvet, pillow: 0xd9a441 }); K.col(-7.2, -9.65, -4.8, -8.8);
    [-6.7, -5.3].forEach(x => K.slot(x, -9.05, x, -7, 'sit'));
    K.sofa(-1.4, -9.2, 2.4, 0, { cloth: K.mat(0x1f3a3a, { roughness: 0.9 }), pillow: 0xc8322f }); K.col(-2.6, -9.65, -0.2, -8.8);
    [-2.1, -0.7].forEach(x => K.slot(x, -9.05, x, -7, 'sit'));
    { // mesa de cartas
      const cx = -10.6, cz = -8.4; K.cyl(0.6, 0.6, 0.05, K.mat(0x1d5a3a, { roughness: 0.95 }), cx, 0.76, cz, {}, 20); K.cyl(0.62, 0.62, 0.04, gilt, cx, 0.74, cz, {}, 20); K.cyl(0.08, 0.2, 0.74, oakDark, cx, 0.37, cz);
      for (let k = 0; k < 6; k++) K.box(0.06, 0.004, 0.09, M.white, cx + Math.cos(k) * 0.3, 0.79, cz + Math.sin(k * 1.7) * 0.25, { ry: k, cast: false });
      for (let k = 0; k < 3; k++) K.cyl(0.03, 0.03, 0.02 + k * 0.01, K.mat([0xc8322f, 0x1e3a8b, 0xf2efe8][k]), cx - 0.15 + k * 0.08, 0.8, cz - 0.1, { cast: false }, 10);
      K.colR(cx, cz, 0.5);
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; K.chair(cx + Math.cos(a) * 0.95, cz + Math.sin(a) * 0.95, Math.atan2(-Math.cos(a), -Math.sin(a)) + 0, { seat: velvet, frame: gilt }); K.slot(cx + Math.cos(a) * 0.9, cz + Math.sin(a) * 0.9, cx, cz, 'cards'); }
    }
    { // trono da contessa
      const g = K.group(4.6, 0, -8.75, 0.15); K.add(K.rbox(0.9, 0.2, 0.75, 0.05), velvet, 0, 0.45, 0, { parent: g }); K.add(K.rbox(0.95, 1.5, 0.15, 0.06), gilt, 0, 1.0, -0.4, { parent: g }); K.add(K.rbox(0.8, 1.2, 0.08, 0.04), velvet, 0, 1.05, -0.32, { parent: g }); K.sphere(0.09, gilt, 0, 1.8, -0.4, { parent: g });
      for (const s of [-1, 1]) K.box(0.1, 0.3, 0.7, gilt, s * 0.45, 0.62, 0, { parent: g }); K.col(4.1, -9.2, 5.1, -8.3);
      K.plant(3.2, -9.4, 'topiary', { pot: K.mat(0x1f3a5a, { roughness: 0.3 }) }); K.plant(6.0, -9.4, 'topiary', { pot: K.mat(0x1f3a5a, { roughness: 0.3 }) });
    }
    // relógio de coluna (missão)
    const clockG = K.group(9.4, 0, -9.55);
    K.box(0.7, 2.3, 0.4, oakDark, 0, 1.15, 0, { parent: clockG }); K.box(0.8, 0.25, 0.45, gilt, 0, 2.38, 0, { parent: clockG }); K.cone(0.42, 0.3, gilt, 0, 2.66, 0, { parent: clockG }, 4).rotation.y = Math.PI / 4;
    K.cyl(0.27, 0.27, 0.04, M.white, 0, 1.9, 0.21, { parent: clockG, rx: Math.PI / 2 }, 24); K.torus(0.28, 0.025, gilt, 0, 1.9, 0.22, { parent: clockG });
    const hHour = K.box(0.025, 0.14, 0.01, M.black, 0, 1.9, 0.245, { parent: clockG }); hHour.geometry.translate(0, 0.06, 0);
    const hMin = K.box(0.018, 0.22, 0.01, M.black, 0, 1.9, 0.25, { parent: clockG }); hMin.geometry.translate(0, 0.1, 0);
    const pend = K.group(0, 1.55, 0.21, 0, clockG); K.cyl(0.006, 0.006, 0.7, gilt, 0, -0.35, 0, { parent: pend }); K.cyl(0.08, 0.08, 0.02, gilt, 0, -0.7, 0, { parent: pend, rx: Math.PI / 2 }, 14);
    K.box(0.5, 0.9, 0.01, K.glass, 0, 1.05, 0.205, { parent: clockG, cast: false });
    K.col(9.0, -9.8, 9.8, -9.3);
    let clockOff = 0; const setClock = () => { hHour.rotation.z = -(10 + clockOff) / 12 * Math.PI * 2; hMin.rotation.z = -((10 + clockOff) % 1) * Math.PI * 2 - Math.PI * 0.6; };
    K.tick((dt, t) => { pend.rotation.z = Math.sin(t * 3.1) * 0.18; });
    K.tell('relogio', (live) => { if (live) K.anim(1.5, e => { clockOff = 2 * e; setClock(); }); else { clockOff = 2; setClock(); } }, () => { clockOff = 0; setClock(); });
    // vista: gente encostada nos arcos olhando a festa
    [-11.2, -4.8, 1.6, 8.0].forEach(x => K.slot(x, -7.4, x, -4, 'talk'));

    // ------------------------------------------------------------ bacaro (bar) à esquerda
    { const cx = -12.1;
      K.add(K.rbox(1.0, 1.1, 4.4, 0.05), oakDark, cx + 0.95, 0.55, -2.9); K.box(1.15, 0.06, 4.6, K.mat(0x1a1a1a, { roughness: 0.2, metalness: 0.3 }), cx + 0.95, 1.13, -2.9);
      K.box(0.04, 0.9, 4.2, gilt, cx + 1.46, 0.55, -2.9, { cast: false });
      K.col(cx + 0.4, -5.15, cx + 1.5, -0.65);
      // estante de garrafas na parede
      K.box(0.4, 2.6, 4.6, oakDark, -14.3, 1.3, -2.9); for (const y of [1.25, 1.75, 2.25]) { K.box(0.4, 0.04, 4.4, K.mat(0x2a1a10), -14.1, y, -2.9); K.bottles(-14.05, y + 0.02, -5.0, 0, 0); }
      for (const y of [1.27, 1.77, 2.27]) for (let k = 0; k < 18; k++) { const c = [0xff7a2a, 0x2c6e49, 0x7a1f2a, 0xe8e0c8, 0xc9a227][k % 5]; K.lathe([[0, 0], [0.035, 0], [0.04, 0.02], [0.04, 0.16], [0.014, 0.22], [0.012, 0.28], [0, 0.28]], K.mat(c, { roughness: 0.15, transparent: true, opacity: 0.85, emissive: c, emissiveIntensity: 0.2 }), -14.05, y, -5.0 + k * 0.24, { cast: false }, 8); }
      K.box(0.05, 0.05, 4.4, K.glow(0xffb060, 2.5), -13.92, 2.55, -2.9, { cast: false });
      // garrafa de Aperol (missão): grande, laranja, no balcão
      const ap = K.lathe([[0, 0], [0.06, 0], [0.065, 0.02], [0.065, 0.22], [0.025, 0.3], [0.02, 0.38], [0, 0.38]], K.mat(0xff6a1a, { roughness: 0.1, transparent: true, opacity: 0.9, emissive: 0xff5a10, emissiveIntensity: 0.3 }), cx + 0.85, 1.16, -2.2, { cast: false }, 12);
      K.box(0.1, 0.07, 0.005, K.mat(0xf6f1e8), cx + 0.85, 1.28, -2.135, { cast: false });
      // cicchetti e taças de spritz
      for (let k = 0; k < 5; k++) { K.cyl(0.11, 0.11, 0.015, M.white, cx + 0.9, 1.17, -4.6 + k * 0.33, { cast: false }, 14); for (let j = 0; j < 3; j++) K.box(0.05, 0.03, 0.05, K.mat([0xd9a060, 0x8a3a22, 0xf3e0b0][j]), cx + 0.88 + j * 0.03, 1.19, -4.62 + k * 0.33 + j * 0.03, { cast: false }); }
      for (let k = 0; k < 4; k++) { K.cyl(0.035, 0.03, 0.09, K.mat(0xff7a2a, { transparent: true, opacity: 0.85, emissive: 0xff6a1a, emissiveIntensity: 0.35 }), cx + 1.3, 1.21, -3.9 + k * 0.5, { cast: false }, 8); K.sphere(0.012, K.mat(0x3a7a2a), cx + 1.32, 1.27, -3.9 + k * 0.5, { cast: false }, 6, 4); }
      K.sign('BACARO', 2.2, 0.55, -14.08, 3.2, -2.9, { ry: Math.PI / 2, neon: true, color: '#ffcf86', font: 'Georgia, serif', size: 92, k: 2.0 });
      K.plight(-12.5, 2.4, -2.9, 0xffad5c, 2.0, 7);
      const apLight = K.plight(cx + 0.85, 1.5, -2.2, 0xff5a10, 0, 2.5);
      K.tell('aperol', (live) => { ap.material = K.glow(0xff7a2a, 2.4); apLight.intensity = 0.9; if (live) K.anim(1, e => { ap.scale.setScalar(1 + Math.sin(e * 18) * 0.06); }); }, () => { ap.material = K.mat(0xff6a1a, { roughness: 0.1, transparent: true, opacity: 0.9, emissive: 0xff5a10, emissiveIntensity: 0.3 }); apLight.intensity = 0; ap.scale.setScalar(1); });
      [-4.6, -3.7, -2.8, -1.9, -1.1].forEach(z => K.slot(cx + 1.95, z, cx + 1, z, 'bar'));
      // banquetas
      [-4.6, -3.7, -2.8, -1.9].forEach(z => { K.cyl(0.18, 0.18, 0.05, velvet, cx + 1.75, 0.72, z + 0.45, {}, 14); K.cyl(0.025, 0.04, 0.7, K.brass, cx + 1.75, 0.36, z + 0.45, {}, 6); });
    }

    // ------------------------------------------------------------ palco do quarteto (esquerda)
    { const px = -10.2, pz = 2.8;
      K.box(5.0, 0.3, 3.4, oakDark, px, 0.15, pz); K.box(5.1, 0.04, 3.5, K.mat(0x6e1e26, { roughness: 0.95 }), px, 0.31, pz, { cast: false });
      K.col(px - 2.5, pz - 1.7, px + 2.5, pz + 1.7);
      // cadeiras, estantes de partitura, violoncelo apoiado
      [[-11.8, 3.5], [-10.4, 3.9], [-12.4, 2.0]].forEach(([x, z]) => K.chair(x, z, 0.5, { y: 0.3, seat: velvet, frame: oakDark }));
      const stand = (x, z, ry) => { const g = K.group(x, 0.3, z, ry); K.cyl(0.01, 0.015, 1.0, K.iron, 0, 0.5, 0, { parent: g }, 6); const p = K.box(0.45, 0.32, 0.02, K.iron, 0, 1.08, 0, { parent: g }); p.rotation.x = -0.4; const sh = K.box(0.4, 0.28, 0.005, M.white, 0, 1.09, 0.02, { parent: g, cast: false }); sh.rotation.x = -0.4; return sh; };
      const sheet = stand(-8.6, 2.4, -1.3); stand(-11.2, 2.2, 0.4); stand(-12.0, 3.2, 0.9);
      // violoncelo
      const cel = K.group(-12.9, 0.3, 3.9, 0.5); K.add(new T.SphereGeometry(0.28, 12, 10).scale(1, 1.5, 0.4), K.mat(0x7a2a10, { roughness: 0.3 }), 0, 0.55, 0, { parent: cel, rz: 0.15 }); K.box(0.05, 0.6, 0.04, M.black, -0.1, 1.15, 0, { parent: cel, rz: 0.15 });
      // harpa dourada
      const hp = K.group(-7.95, 0.3, 3.9, -0.6); K.box(0.08, 1.6, 0.1, gilt, 0, 0.8, 0, { parent: hp }); K.add(new T.TorusGeometry(0.55, 0.04, 6, 16, Math.PI * 0.8), gilt, 0.35, 1.25, 0, { parent: hp, rz: -0.3 }); for (let k = 0; k < 8; k++) K.box(0.004, 0.9 - k * 0.08, 0.004, K.mat(0xf3e0b0), 0.1 + k * 0.08, 0.75 - k * 0.04 + 0.2, 0, { parent: hp, cast: false });
      // candelabros de pé dos lados do palco
      for (const [x, z] of [[-12.9, 1.3], [-7.6, 1.3]]) { K.cyl(0.03, 0.06, 1.6, gilt, x, 1.1, z, {}, 8); K.cyl(0.2, 0.2, 0.04, gilt, x, 1.9, z, {}, 12); for (let k = 0; k < 5; k++) { const a = k * 1.256, xx = x + Math.cos(a) * 0.16, zz = z + Math.sin(a) * 0.16; K.cyl(0.018, 0.018, 0.16, M.candle, xx, 2.0, zz, { cast: false }, 6); K.flame(xx, 2.08, zz, 0.015); } }
      K.plight(-10.2, 2.4, 2.4, 0xffb870, 1.6, 7);
      const sheetMat = sheet.material;
      K.tell('partitura', (live) => { sheet.material = K.mat(0xd8323a, { roughness: 0.7 }); if (live) K.anim(0.8, e => { sheet.rotation.y = Math.sin(e * Math.PI) * 1.2; }); }, () => { sheet.material = sheetMat; sheet.rotation.y = 0; });
      // plateia em pé na frente do palco
      [[-11.5, 5.2], [-10, 5.4], [-8.5, 5.2], [-7.2, 4.6]].forEach(([x, z]) => K.slot(x, z, -10.2, 2.8, 'view'));
    }

    // ------------------------------------------------------------ poço veneziano (vera da pozzo) no centro
    const bucket = (() => {
      const g = K.group(0, 0, -2.0);
      K.add(new T.CylinderGeometry(1.05, 1.1, 0.14, 8), istria, 0, 0.07, 0, { parent: g });
      K.add(new T.CylinderGeometry(0.72, 0.78, 0.95, 8), K.mat(0xdcd2bd, { roughness: 0.8 }), 0, 0.6, 0, { parent: g });
      K.add(new T.CylinderGeometry(0.82, 0.72, 0.12, 8), istria, 0, 1.12, 0, { parent: g });
      K.add(new T.CylinderGeometry(0.6, 0.6, 0.02, 16), K.mat(0x0a1418, { roughness: 0.1, metalness: 0.5 }), 0, 1.0, 0, { parent: g, cast: false });
      // relevos: leões de São Marcos em medalhões
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 8; K.add(new T.CircleGeometry(0.2, 12), K.mat(0xc9bea5, { roughness: 0.9 }), Math.cos(a) * 0.77, 0.62, Math.sin(a) * 0.77, { parent: g, ry: -a + Math.PI / 2 }); }
      // arco de ferro com roldana e balde
      for (const s of [-1, 1]) K.cyl(0.025, 0.025, 1.5, K.iron, s * 0.62, 1.85, 0, { parent: g }, 6);
      K.add(new T.TorusGeometry(0.62, 0.025, 6, 16, Math.PI), K.iron, 0, 2.58, 0, { parent: g });
      K.torus(0.07, 0.015, K.iron, 0, 2.95, 0, { parent: g, ry: Math.PI / 2 });
      const rope = K.cyl(0.006, 0.006, 1, K.mat(0x9a7a4a), 0, 2.4, 0, { parent: g, cast: false }, 4);
      const b = K.group(0, 1.85, 0, 0, g); K.cyl(0.12, 0.09, 0.18, K.mat(0x7a5030), 0, 0, 0, { parent: b }); K.torus(0.12, 0.012, K.iron, 0, 0.06, 0, { parent: b, rx: Math.PI / 2 });
      K.add(new T.TorusGeometry(0.13, 0.008, 4, 10, Math.PI), K.iron, 0, 0.1, 0, { parent: b });
      K.colR(0, -2.0, 0.85);
      return { b, rope };
    })();
    const setBucket = (y) => { bucket.b.position.y = y; bucket.rope.scale.y = (2.95 - y) / 1; bucket.rope.position.y = (2.95 + y) / 2; };
    setBucket(1.85);
    K.tell('poco', (live) => { if (live) K.anim(1.6, e => setBucket(1.85 - e * 0.95)); else setBucket(0.9); }, () => setBucket(1.85));
    K.ringSlots(0, -2.0, 6, 1.5, 'talk', 0, 0.9);

    // ------------------------------------------------------------ pista de dança com arco dourado e lustre de Murano
    { // piso de mármore em estrela
      const t = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#efe7d6'; g.fillRect(0, 0, w, h); g.translate(w / 2, h / 2); for (let k = 0; k < 16; k++) { g.rotate(Math.PI / 8); g.fillStyle = k % 2 ? '#1a1a22' : '#b8865a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(30, 230); g.lineTo(-30, 230); g.fill(); } g.fillStyle = '#d4a34a'; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.fill(); g.strokeStyle = '#d4a34a'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 240, 0, 7); g.stroke(); });
      K.add(new T.CircleGeometry(3.0, 48).rotateX(-Math.PI / 2), K.texMat(t, { roughness: 0.25, metalness: 0.1, envMapIntensity: 0.8 }), 5.0, 0.015, 2.6, { cast: false });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = 3.2 + i * 1.2, z = 0.9 + j * 1.15; if (Math.hypot(x - 5, z - 2.6) < 2.6) K.slot(x, z, 5.0, 2.6, 'dance'); }
    }
    const arch = K.group(5.0, 0, 2.6);
    for (const s of [-1, 1]) { K.cyl(0.09, 0.12, 4.6, gilt, s * 4.0, 2.3, 0, { parent: arch }, 10); K.cyl(0.22, 0.25, 0.3, gilt, s * 4.0, 0.15, 0, { parent: arch }, 10); K.colR(5.0 + s * 4.0, 2.6, 0.22); }
    K.add(new T.TorusGeometry(4.0, 0.08, 8, 32, Math.PI), gilt, 0, 4.6, 0, { parent: arch, s: [1, 0.35, 1] });
    // fios de luz em leque partindo do topo do arco
    for (let k = 0; k < 8; k++) { const a = k / 7 * Math.PI; K.bulbs([5.0, 6.0, 2.6], [5.0 + Math.cos(a) * 6.5, 3.0, 2.6 + Math.sin(a) * 6.5 * 0.9], 9, 0.5, 0xffd08a, 3.0); }
    const chand = K.group(5.0, 4.55, 2.6);
    K.cyl(0.012, 0.012, 1.4, gilt, 0, -0.1, 0, { parent: chand, cast: false }, 4);
    const glassC = [0xff6aa0, 0x6ad0ff, 0xffe070, 0x80ffb0, 0xffffff];
    K.lathe([[0, 0], [0.18, 0.05], [0.12, 0.3], [0.05, 0.5], [0, 0.55]], K.mat(0xe8f2ff, { transparent: true, opacity: 0.55, roughness: 0.05, emissive: 0x405060, emissiveIntensity: 0.4 }), 0, -1.35, 0, { parent: chand, cast: false });
    for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; const arm = K.group(0, -1.15, 0, -a, chand); K.add(new T.TorusGeometry(0.35, 0.02, 6, 12, Math.PI * 0.6), K.mat(glassC[k % 5], { transparent: true, opacity: 0.8, roughness: 0.1, emissive: glassC[k % 5], emissiveIntensity: 0.6 }), 0.35, 0, 0, { parent: arm, cast: false, rx: Math.PI / 2 }); K.cyl(0.04, 0.03, 0.08, K.mat(glassC[(k + 2) % 5], { emissive: glassC[(k + 2) % 5], emissiveIntensity: 0.7 }), 0.68, 0.06, 0, { parent: arm, cast: false }, 8); K.flame(0, 0, 0, 0.018, 0xffc060, arm).position.set(0.68, 0.11, 0); }
    for (let k = 0; k < 14; k++) { const a = k * 0.45; K.sphere(0.035, K.mat(glassC[k % 5], { transparent: true, opacity: 0.85, emissive: glassC[k % 5], emissiveIntensity: 0.8 }), Math.cos(a) * 0.45, -1.55 - (k % 3) * 0.06, Math.sin(a) * 0.45, { parent: chand, cast: false }, 8, 6); }
    const chLight = K.plight(5.0, 3.0, 2.6, 0xffc890, 2.4, 10);
    K.pool(5.0, 2.6, 3.4, 0xffb070, 0.45);
    let chSwing = 0;
    K.tick((dt, t) => { chand.rotation.z = Math.sin(t * 1.3) * 0.02 * (1 + chSwing * 6); chand.rotation.x = Math.cos(t * 1.1) * 0.015 * (1 + chSwing * 4); });
    K.tell('lustre', (live) => { chSwing = 1; chand.rotation.y = 0.4; chLight.intensity = 1.2; chLight.color.set(0xffa070); if (live) K.anim(1.6, e => { chLight.intensity = Math.sin(e * 40) > 0 ? 2.4 : 0.4; }); }, () => { chSwing = 0; chand.rotation.y = 0; chLight.intensity = 2.4; chLight.color.set(0xffc890); });

    // ------------------------------------------------------------ bufê com cicchetti, bolo e torre de champanhe
    { const bx = -5.2, bz = 5.6;
      K.box(5.6, 0.06, 1.0, M.linen, bx, 0.78, bz); K.add(new T.BoxGeometry(5.7, 0.74, 1.1), K.mat(0xf3eee2, { roughness: 0.95 }), bx, 0.38, bz);
      K.box(5.72, 0.12, 1.12, K.mat(0x6e1e26, { roughness: 0.9 }), bx, 0.7, bz, { cast: false });
      K.col(bx - 2.85, bz - 0.55, bx + 2.85, bz + 0.55);
      // bandejas de prata com doces e frutas
      for (let k = 0; k < 6; k++) { const x = bx - 2.5 + k * 0.62; K.cyl(0.2, 0.2, 0.02, K.silver, x, 0.82, bz + 0.05, { cast: false }, 16); for (let j = 0; j < 7; j++) K.sphere(0.035, K.mat([0xf2c14e, 0x8a3a22, 0xe8a0b0, 0x7a9a3a, 0xf3e0b0][(j + k) % 5]), x + Math.cos(j) * 0.11, 0.85, bz + 0.05 + Math.sin(j) * 0.11, { cast: false }, 6, 4); }
      // bolo de três andares
      [[0.28, 0.16], [0.2, 0.14], [0.13, 0.12]].reduce((y, [r, h]) => { K.cyl(r, r, h, K.mat(0xf6efe4, { roughness: 0.7 }), bx - 1.6, y + h / 2, bz - 0.25, {}, 18); K.torus(r, 0.015, K.mat(0xe8a0b0), bx - 1.6, y + h - 0.01, bz - 0.25, { rx: Math.PI / 2 }); return y + h; }, 0.81);
      K.sphere(0.04, K.mat(0xc8322f), bx - 1.6, 1.28, bz - 0.25);
      // candelabro de prata
      K.cyl(0.02, 0.06, 0.45, K.silver, bx + 0.3, 1.03, bz - 0.2, {}, 8); for (const s of [-0.14, 0, 0.14]) { K.cyl(0.015, 0.015, 0.14, M.candle, bx + 0.3 + s, 1.32, bz - 0.2, { cast: false }, 6); K.flame(bx + 0.3 + s, 1.39, bz - 0.2, 0.014); }
      // torre de champanhe: pirâmide de taças
      const tw = [], tx = -2.3, tz = 5.4; let topCoupe = null;
      for (let lvl = 0; lvl < 4; lvl++) { const n = 4 - lvl, y = 0.84 + lvl * 0.13; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tw.push([tx + (i - (n - 1) / 2) * 0.11, y, tz + (j - (n - 1) / 2) * 0.11]); }
      const champ = K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.35, roughness: 0.1 });
      K.inst(new T.CylinderGeometry(0.05, 0.012, 0.035, 10).translate(0, 0.085, 0), champ, tw, { cast: false });
      K.inst(new T.CylinderGeometry(0.004, 0.004, 0.07, 4).translate(0, 0.035, 0), K.glass, tw, { cast: false });
      topCoupe = K.cyl(0.05, 0.012, 0.035, champ, tx, 0.84 + 4 * 0.13 + 0.085, tz, { cast: false }, 10);
      K.cyl(0.004, 0.004, 0.07, K.glass, tx, 0.84 + 4 * 0.13 + 0.035, tz, { cast: false }, 4);
      K.box(0.6, 0.04, 0.6, K.silver, tx, 0.82, tz, { cast: false });
      for (let k = 0; k < 3; k++) K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.015, 0.28], [0.015, 0.33], [0, 0.33]], K.mat(0x1a3a1a, { roughness: 0.15, metalness: 0.2 }), tx - 0.45 + k * 0.08, 0.82, tz - 0.35, { cast: false }, 8);
      K.cyl(0.13, 0.11, 0.22, K.silver, tx + 0.45, 0.92, tz - 0.3, {}, 14);
      K.plight(-4.0, 1.8, 5.0, 0xffc07a, 1.2, 6);
      K.tell('torre', (live) => { topCoupe.material = K.mat(0xc8102a, { emissive: 0xa00010, emissiveIntensity: 0.6, roughness: 0.1 }); if (live) K.anim(0.9, e => topCoupe.scale.setScalar(1 + Math.sin(e * Math.PI) * 0.6)); }, () => { topCoupe.material = champ; topCoupe.scale.setScalar(1); });
      [-7.2, -6.0, -4.8, -3.6].forEach(x => K.slot(x, bz - 1.0, x, bz, 'bar'));
    }

    // ------------------------------------------------------------ banca de máscaras (direita)
    { const sx = 11.6, sz = -4.9;
      const g = K.group(sx, 0, sz);
      K.box(2.8, 0.9, 0.8, K.mat(0x3a2a20), 0, 0.45, 0.2, { parent: g }); K.box(2.9, 0.05, 0.9, K.mat(0x6e1e26), 0, 0.92, 0.2, { parent: g });
      for (const s of [-1, 1]) K.box(0.08, 2.6, 0.08, oakDark, s * 1.4, 1.3, -0.15, { parent: g });
      // toldo listrado
      const aw = K.canvasTex(256, 64, (gg, w, h) => { for (let k = 0; k < 8; k++) { gg.fillStyle = k % 2 ? '#f2efe8' : '#8a1020'; gg.fillRect(k * 32, 0, 32, h); } gg.fillStyle = '#d4a34a'; for (let k = 0; k < 16; k++) { gg.beginPath(); gg.arc(k * 16 + 8, h, 8, Math.PI, 0); gg.fill(); } });
      K.add(new T.PlaneGeometry(3.0, 1.0), K.texMat(aw, { side: T.DoubleSide }), 0, 2.55, 0.3, { parent: g, rx: -1.0 });
      // painel de máscaras
      K.box(2.7, 1.5, 0.06, K.mat(0x1a1a22), 0, 1.75, -0.2, { parent: g });
      const mcol = [0xd9a441, 0xc9ced6, 0xf1ece2, 0x8a1020, 0x1f3a8a, 0x2c7a4b, 0x16161a, 0xd9a441, 0x6b3f8c, 0xf1ece2, 0xc8322f, 0xd9a441];
      const mg = new T.SphereGeometry(0.16, 12, 6, Math.PI * 0.2, Math.PI * 0.6, Math.PI * 0.3, Math.PI * 0.35); mg.scale(1.3, 0.9, 0.5);
      let gold = null;
      mcol.forEach((c, k) => { const x = -1.1 + (k % 6) * 0.44, y = 2.15 - Math.floor(k / 6) * 0.6; const mm = K.add(mg, K.mat(c, { metalness: c === 0xd9a441 || c === 0xc9ced6 ? 0.8 : 0.1, roughness: 0.3 }), x, y, -0.2, { parent: g, cast: false, ry: -Math.PI / 2 }); mm.rotation.set(0, -Math.PI / 2, 0); if (k === 7) gold = mm; for (let f = 0; f < 2; f++) K.add(new T.SphereGeometry(0.03, 6, 6).scale(1, 5, 0.3), K.mat([0xf6f3ec, 0x16161a, 0xc8322f][(k + f) % 3]), x + 0.12 + f * 0.04, y + 0.15, -0.14, { parent: g, cast: false, rz: -0.5 }); });
      // máscaras soltas sobre a bancada
      for (let k = 0; k < 5; k++) K.add(mg, K.mat(mcol[(k * 5) % 12], { metalness: 0.5, roughness: 0.35 }), -1.0 + k * 0.5, 0.98, 0.35, { parent: g, cast: false, rx: -Math.PI / 2 });
      K.col(sx - 1.45, sz - 0.3, sx + 1.45, sz + 0.62);
      K.halo(sx, 2.35, sz + 0.6, 0.9, 0xffc070, 0.35); K.plight(sx, 2.3, sz + 1.3, 0xffcf96, 1.0, 5);
      const goldMat = gold.material;
      K.tell('mascara', (live) => { gold.material = K.mat(0x16161a, { roughness: 0.3 }); if (live) K.anim(1, e => gold.rotation.x = Math.sin(e * Math.PI * 4) * 0.4); }, () => { gold.material = goldMat; gold.rotation.x = 0; });
      [[10.4, -3.3], [12.8, -3.3]].forEach(([x, z]) => K.slot(x, z, x, sz, 'view'));
    }

    // ------------------------------------------------------------ coluna com o leão alado de São Marcos
    const lionEyes = [];
    { const cx = -4.0, cz = 8.75;
      K.box(0.9, 0.5, 0.9, istria, cx, 0.25, cz); K.lathe([[0, 0], [0.32, 0], [0.28, 0.2], [0.24, 3.2], [0.3, 3.4], [0.38, 3.5], [0, 3.5]], K.mat(0xd8cfc0, { roughness: 0.6 }), cx, 0.5, cz, {}, 18);
      K.box(0.9, 0.18, 0.7, istria, cx, 4.08, cz);
      const lg = K.group(cx, 4.17, cz, Math.PI);
      const bronze = K.metal(0x6a5a2a, 0.45);
      K.add(new T.SphereGeometry(0.22, 10, 8).scale(1.8, 0.9, 0.9), bronze, 0, 0.3, 0, { parent: lg }); // corpo
      K.add(new T.SphereGeometry(0.17, 10, 8), bronze, 0.38, 0.5, 0, { parent: lg }); // cabeça
      K.add(new T.SphereGeometry(0.22, 10, 8).scale(0.6, 1, 1.1), K.metal(0x8a6a2a, 0.5), 0.33, 0.5, 0, { parent: lg }); // juba
      for (const s of [-1, 1]) { const w = K.add(new T.ConeGeometry(0.22, 0.75, 4).rotateZ(-0.6), bronze, -0.05, 0.62, s * 0.18, { parent: lg }); w.rotation.x = s * 0.5; lionEyes.push(K.sphere(0.022, K.mat(0x2a2010), 0.52, 0.55, s * 0.06, { parent: lg, cast: false }, 6, 4)); }
      for (const [a, b] of [[0.25, 0.12], [0.25, -0.12], [-0.25, 0.12], [-0.25, -0.12]]) K.cyl(0.04, 0.04, 0.26, bronze, a, 0.1, b, { parent: lg }, 6);
      K.add(new T.BoxGeometry(0.2, 0.28, 0.03), K.mat(0xf3ecdc), 0.42, 0.25, 0, { parent: lg, ry: Math.PI / 2 }); // o livro do evangelho
      K.cyl(0.02, 0.01, 0.45, bronze, -0.42, 0.42, 0, { parent: lg, rz: 1.0 });
      K.colR(cx, cz, 0.5);
      K.spot(cx + 1.5, 0.2, cz - 1.5, cx, 4.4, cz, 0xffd8a0, 2.2, 8, 0.4);
      const eyeM = lionEyes[0].material;
      K.tell('leao', (live) => { lionEyes.forEach(e => e.material = K.glow(0xff3030, 4)); if (live) K.anim(1.2, e => lionEyes.forEach(x => x.scale.setScalar(1 + Math.sin(e * 25) * 0.6))); }, () => lionEyes.forEach(e => { e.material = eyeM; e.scale.setScalar(1); }));
    }

    // ------------------------------------------------------------ balaustrada na beira do canal, lanternas, mesas
    { const bal = []; for (let x = -14.3; x <= 5.2; x += 0.3) if (Math.abs(x + 4) > 0.55) bal.push([x, 0, 9.65]); for (let x = 8.8; x <= 14.3; x += 0.3) bal.push([x, 0, 9.65]);
      K.inst(new T.LatheGeometry([[0, 0], [0.06, 0], [0.06, 0.05], [0.035, 0.12], [0.075, 0.32], [0.035, 0.52], [0.06, 0.58], [0, 0.58]].map(p => new T.Vector2(p[0], p[1])), 8), istria, bal);
      K.box(19.4, 0.1, 0.26, istria, -4.6, 0.63, 9.65); K.box(5.6, 0.1, 0.26, istria, 11.6, 0.63, 9.65);
      for (const x of [-14.3, -9, 5.4, 8.6, 14.3]) K.box(0.36, 0.8, 0.36, istria, x, 0.4, 9.65);
      K.col(-14.5, 9.45, 5.55, 9.85); K.col(8.45, 9.45, 14.5, 9.85);
      [-12, -7.2, -1.2, 3.0, 10.4, 12.8].forEach(x => K.slot(x, 9.0, x, 14, 'view'));
    }
    // lanternas venezianas em postes (ferro + vidro âmbar)
    for (const [x, z] of [[-13.6, 8.6], [5.0, 8.6], [9.0, 8.6], [13.6, 8.6], [-13.6, -5.6], [13.6, -6.0]]) K.lamppost(x, z, { h: 2.9, color: 0xffb060, i: 0.9, d: 6 });
    // candelabros de pé espalhados
    for (const [x, z] of [[-6.5, -5.4], [6.5, -5.4], [-1.2, 8.4]]) { K.cyl(0.03, 0.07, 1.7, gilt, x, 0.85, z, {}, 8); K.cyl(0.18, 0.22, 0.06, gilt, x, 0.03, z, {}, 10); for (let k = 0; k < 3; k++) { const xx = x + (k - 1) * 0.16; K.cyl(0.018, 0.018, 0.18, M.candle, xx, 1.8, z, { cast: false }, 6); K.flame(xx, 1.9, z, 0.016); } K.colR(x, z, 0.2); K.pool(x, z, 1.2, 0xffb060, 0.3); }
    // mesas altas com toalha, velas e flores
    for (const [x, z, n] of [[-6.2, 1.2, 4], [-2.8, 2.2, 4], [10.8, 1.8, 4], [12.0, 6.4, 3], [-11.4, 7.2, 4], [1.0, 6.2, 4], [-7.8, -2.6, 3], [7.6, -2.6, 4]]) K.table(x, z, { r: 0.42, h: 1.05, flower: R() < 0.5 ? 0xc8322f : 0xf6f3ec, slots: n });
    // vasos com ciprestes e topiarias ao longo das laterais
    for (const [x, z, k] of [[-14.0, -6.0, 'cypress'], [-14.0, 6.0, 'cypress'], [14.0, 4.0, 'cypress'], [14.0, -6.4, 'cypress'], [-8.6, 8.8, 'topiary'], [1.6, 8.8, 'topiary'], [14.0, 8.8, 'topiary']]) K.plant(x, z, k, { pot: K.mat(0xd8cfc0, { roughness: 0.7 }), s: k === 'cypress' ? 1.2 : 1 });
    // confete e serpentina no chão
    { const cols = [0xff3d7f, 0xffd23f, 0x2ec4b6, 0xd4a34a, 0xf6f3ec]; cols.forEach((cc, i) => { const l = []; for (let k = 0; k < 90; k++) l.push([-14 + R() * 28, 0.019, -6 + R() * 15.5, R() * 6, 1]); K.inst(new T.PlaneGeometry(0.045, 0.045).rotateX(-Math.PI / 2), K.mat(cc, { roughness: 0.7 }), l, { cast: false }); }); }
    // gente na beira da pista e conversa geral (vagas extras)
    [[3.0, 6.4], [7.4, 6.2], [9.4, 3.0], [-0.6, 3.6], [-4.6, 3.2], [8.2, -0.6], [2.6, -4.6], [-4.2, -3.6]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), z + (R() - 0.5), 'talk'));
    [[-1.8, -6.0], [-0.6, -6.0], [10.6, -7.6], [11.8, -7.6]].forEach(([x, z]) => K.slot(x, z, x, -9, 'talk'));

    // ------------------------------------------------------------ luz principal
    K.plight(0, 3.2, -1.0, 0xffc07a, 1.4, 8);
    K.plight(-4.5, 3.0, -8.4, 0xffb070, 1.5, 9); K.plight(6.0, 3.0, -8.4, 0xffb070, 1.5, 9);
    K.plight(11.0, 2.2, 6.5, 0xffa860, 0.9, 6);
    K.pool(0, -2.0, 2.2, 0xffb070, 0.3); K.pool(-4.6, 5.6, 2.4, 0xffc080, 0.3);
    // ------------------------------------------------------------ pombos no pé do leão: ciscam e levantam voo quando alguém chega
    K.pombos({ x: -2.5, z: 7.5, r: 0.8, n: 11, alerta: 1.4, voo: 5.5, tam: 1.25, cor: 0x585c66 });
    // ------------------------------------------------------------ gôndola de passeio atravessando o canal, gondoleiro remando
    // passa no meio do canal (a faixa que se vê por cima do peitoril), baixa demais para tapar alguém: ali a linha do sniper
    // até a cabeça de quem está na festa passa a ~5 m de altura
    { const gp = gondola(0, 0, 0, 0xffb050); gp.g.name = 'gondola-passeio'; const gd = K.group(-4.25, 0.78, -0.12, 0, gp.g);
      const listra = K.canvasTex(32, 64, (c, w, h) => { for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? '#f4f1ea' : '#1c2a4a'; c.fillRect(0, k * h / 8, w, h / 8); } }, [1, 1]);
      const calca = K.mat(0x1a1a20), pele = K.mat(0xc89070, { roughness: 0.7 });
      for (const s of [-1, 1]) K.box(0.13, 0.82, 0.14, calca, 0, 0.41, s * 0.09, { parent: gd });
      const tronco = K.group(0, 0.82, 0, 0, gd);
      K.add(new T.CylinderGeometry(0.17, 0.15, 0.6, 10), K.texMat(listra, { roughness: 0.9 }), 0, 0.3, 0, { parent: tronco });
      K.sphere(0.11, pele, 0, 0.74, 0, { parent: tronco });
      K.cyl(0.21, 0.21, 0.015, K.mat(0xe8d49a, { roughness: 0.9 }), 0, 0.84, 0, { parent: tronco }); K.cyl(0.12, 0.12, 0.09, K.mat(0xe8d49a, { roughness: 0.9 }), 0, 0.89, 0, { parent: tronco }); K.cyl(0.122, 0.122, 0.03, K.mat(0xa8202a), 0, 0.86, 0, { parent: tronco });
      // remo apoiado na forcola do lado direito: a pá entra na água atrás e volta pelo ar
      const fo = K.group(-3.7, 0.95, 0.55, 0, gp.g); K.box(0.06, 0.35, 0.08, oakDark, 0, -0.15, 0, { parent: fo });
      const remo = K.group(0, 0.05, 0, 0, fo); K.box(3.6, 0.04, 0.05, K.mat(0xb08a5a, { roughness: 0.7 }), -1.1, 0, 0, { parent: remo }); K.box(0.5, 0.02, 0.14, K.mat(0xb08a5a, { roughness: 0.7 }), -2.75, 0, 0, { parent: remo });
      for (const s of [-1, 1]) K.box(0.5, 0.07, 0.07, K.texMat(listra, { roughness: 0.9 }), -0.3, 1.25, s * 0.2, { parent: gd, ry: s * 0.4 });
      const ida = 92, pausa = 14, ciclo = 2 * (ida + pausa);
      K.tick((dt, t) => {
        const u = t % ciclo, volta = u >= ida + pausa, v = volta ? u - ida - pausa : u, andando = v < ida, f = Math.min(1, v / ida), x = volta ? 42 - 84 * f : -42 + 84 * f;
        gp.g.position.set(x, -0.55 + Math.sin(t * 1.3) * 0.025, volta ? 16.3 : 15.8); gp.g.rotation.y = volta ? Math.PI : 0; gp.g.rotation.x = Math.sin(t * 0.9) * 0.012;
        const st = andando ? Math.sin(t * 1.6) : 0; remo.rotation.set(0, -0.35 + st * 0.3, -0.42 - Math.max(0, st) * 0.12); tronco.rotation.z = 0.05 + st * 0.12;
      });
    }
    // ------------------------------------------------------------ ambiente vivo: fogos sobre a laguna, atrás do palazzo, e brilho das lanternas no canal
    K.fireworks({ x0: -24, x1: 24, y: 12.5, dy: 4, z: -44, dz: 10, raio: 4.5, tam: 0.6, cada: 2.4, n: 3, cores: [0xffc860, 0xff4a6a, 0x7ad8ff, 0xf6f1e8] });
    K.glints({ x0: -16, x1: 16, z0: 14.2, z1: 36, y0: -0.6, n: 90, cor: [0xffb060, 0xffd090, 0xff9040], tam: 0.16 });
  },
  // ninho do sniper: janela do campanário de San Vidal. Peitoril de pedra da Ístria gasto (musgo, iniciais riscadas,
  // marcas de pombo), pilares de tijolo com capitel, a corda do sino e gerânios espiando por cima da borda
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.85 }), stone = 0xb8ad98, brick = 0x8a4030, brickD = 0x6a3022;
    N.tampo(stone, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 11, draw: (c, w, h, R) => {
      c.fillStyle = '#b9ae98'; c.fillRect(0, 0, w, h);
      for (let k = 0; k < 260; k++) { c.fillStyle = `rgba(${R() < 0.5 ? '90,80,64' : '230,224,210'},${0.05 + R() * 0.1})`; c.beginPath(); c.ellipse(R() * w, R() * h, 4 + R() * 30, 2 + R() * 8, R() * 3, 0, 7); c.fill(); }
      c.strokeStyle = 'rgba(80,72,60,.35)'; c.lineWidth = 1.2; for (let k = 0; k < 9; k++) { c.beginPath(); let x = R() * w, y = R() * h; c.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (R() - 0.3) * 50; y += (R() - 0.5) * 18; c.lineTo(x, y); } c.stroke(); }
      for (const x of [w * 0.12, w * 0.36, w * 0.64, w * 0.88]) { c.fillStyle = 'rgba(40,34,26,.55)'; c.fillRect(x, 0, 2, h); } // juntas entre os blocos
      c.fillStyle = 'rgba(70,96,40,.55)'; for (let k = 0; k < 22; k++) c.fillRect(w * 0.36 - 3 + R() * 6, R() * h, 2 + R() * 3, 2 + R() * 4);
      c.fillStyle = 'rgba(250,250,240,.75)'; for (let k = 0; k < 14; k++) { c.beginPath(); c.arc(R() * w, R() * h, 2 + R() * 4, 0, 7); c.fill(); }
      c.fillStyle = 'rgba(255,255,245,.35)'; c.fillRect(0, 0, w, 6); c.fillStyle = 'rgba(40,34,26,.25)'; c.fillRect(0, h - 5, w, 5);
      c.save(); c.translate(w * 0.3, h * 0.55); c.rotate(-0.06); c.strokeStyle = 'rgba(60,52,40,.6)'; c.lineWidth = 2; c.font = '28px Georgia, serif'; c.strokeText('G ♥ L  1797', 0, 0); c.restore();
      K.grain(c, w, h, 14);
    } });
    N.box(5.4, 3.6, 0.9, brick, 0, -2.81, -0.95).box(5.6, 0.14, 1.0, stone, 0, -0.98, -1.1);
    for (let k = 0; k < 7; k++) N.box(5.4, 0.015, 0.02, brickD, 0, -1.25 - k * 0.24, -1.405);
    for (const sx of [-1, 1]) { N.box(0.8, 2.1, 0.8, brick, sx * 2.25, 0.26, -0.87).box(0.86, 0.18, 0.84, stone, sx * 2.25, 1.41, -0.87).box(0.86, 0.1, 0.84, stone, sx * 2.25, -0.74, -0.87); }
    N.cyl(0.018, 0.018, 2.0, 0xc8b48a, 1.95, 0.35, -0.75, 6);
    // floreira pendurada do lado de fora: só os gerânios aparecem por cima da borda
    N.box(1.0, 0.16, 0.24, 0x7a5a3a, -1.35, -1.0, -1.74);
    const R = K.rng(71); for (let k = 0; k < 16; k++) N.geo(new T.SphereGeometry(0.045 + R() * 0.03, 6, 4), k % 3 ? 0xd8283a : 0x3f7a3a, -1.8 + R() * 0.9, -0.93 + R() * 0.01, -1.66 - R() * 0.14);
    N.fim();
  },
});
