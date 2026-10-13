// 10 · Expresso Oriente: noite de partida de um trem de luxo de 1934 numa gare art déco.
// Plataforma de pedra com o trem azul-marinho e dourado ao fundo; dois vagões em corte (restaurante e salão) mostram o interior
// como num diorama. Passarela de ferro elevada na frente (nível 1). O sniper está na torre do relógio da fachada, do outro lado dos trilhos.
MIRA_CENARIOS.push({
  id: 'expresso',
  nome: 'Expresso Oriente',
  lugar: 'Gare do Oriente, plataforma 1',
  hora: 'noite de partida, 1934',
  resumo: 'O expresso de luxo azul e dourado espera o apito: vagão-restaurante com abajures, salão com piano, locomotiva soltando vapor, carregadores, malas e baús. Todo mundo tem um bilhete e um segredo.',
  sniper: { pos: [2, 23.6, 48.6], desc: 'torre do relógio da fachada da estação, do outro lado dos trilhos' },
  niveis: [
    { nome: 'plataforma e vagões', y: 0, x0: -14.5, x1: 14.5, z0: -12.0, z1: 10.0 },
    { nome: 'passarela de ferro', y: 3.6, x0: -13.6, x1: 13.6, z0: 6.6, z1: 9.4 },
  ],
  escadas: [{ de: 0, para: 1, a: [-5.3, 8.75], b: [-13.0, 8.7], rotulo: 'passarela de ferro' }],
  convidados: 28,
  inicio: [1.6, 3.4, 0],
  ambiente: {
    ceu: ['#04060d', '#0a1128', '#18203f', '#3a2c3c'], neblina: [0x121828, 60, 175], hemi: [0x8496c8, 0x3a2e24, 0.2],
    sol: [0xa4b6ff, 0.55, -16, 26, 22], preenche: [0xffb070, 0.24], exposicao: 0.9, bloom: 0.7,
  },
  guardaRoupa: {
    ternos: [[0x2a2c30, 'terno risca de giz grafite'], [0x1b2238, 'terno azul-marinho'], [0x5a4632, 'terno de tweed marrom'], [0xcfc3a6, 'terno de linho bege'], [0x16161a, 'smoking preto'], [0x3d4a3a, 'terno verde-oliva'], [0x6a6a70, 'terno cinza-pombo']],
    vestidos: [[0x7a1424, 'vestido bordô'], [0x1b1b22, 'vestido preto de franjas'], [0xd8c9a8, 'vestido champanhe'], [0x2a4a6a, 'vestido azul-petróleo'], [0x5a2a5a, 'vestido ameixa'], [0xe8e2d6, 'vestido marfim'], [0x2f5a46, 'vestido verde-jade']],
    vestidoChance: 0.45, longo: 0.5, taca: 0.45, tacas: ['coupe', 'coupe', 'tumbler', 'wine'], drinks: [0xf2d070, 0xffd9a0, 0xb3122e, 0xd98a2a],
    extra(o, r) {
      const pk = (a) => a[Math.floor(r() * a.length)];
      if (!o.dress) {
        const h = r();
        if (h < 0.55) { o.hat = 'fedora'; o.hatColor = pk([0x2a2622, 0x4a3a2a, 0x5a5a5e, 0x1b1b1f, 0x6a5a44]); o.hatBand = 0x16161a; o.name += ', chapéu fedora'; }
        else if (h < 0.72) { o.hat = 'bowler'; o.hatColor = 0x16161a; o.name += ', chapéu-coco'; }
        else if (h < 0.8) { o.hat = 'boater'; o.hatBand = pk([0x1b2238, 0x8b1e2d]); o.name += ', chapéu de palha'; }
        if (r() < 0.35) { o.coat = pk([0x3a3a3e, 0x5a4a3a, 0x1f2430, 0x8a7a5a]); o.name += ', sobretudo'; }
        if (r() < 0.12) { o.propL = 'cane'; o.name += ', bengala'; } else if (r() < 0.12) { o.propL = 'book'; o.propColor = 0xeee6d0; o.name += ', jornal dobrado'; }
      } else {
        const h = r();
        if (h < 0.5) { o.hat = 'bowler'; o.hatColor = pk([0x7a1424, 0x1b1b22, 0x2a4a6a, 0xd8c9a8, 0x5a2a5a]); o.name += ', chapéu cloche'; }
        else if (h < 0.62) { o.hat = 'beret'; o.hatColor = pk([0x1b1b22, 0x7a1424]); o.name += ', boina'; }
        if (r() < 0.6) o.hairStyle = 'bob';
        if (r() < 0.4) { o.scarf = pk([0xd9c8a8, 0x8a5a32, 0xf2eee6]); o.name += ', estola de pele'; }
        if (r() < 0.3) { o.gloves = pk([0xf2eee6, 0x16161a]); o.name += ', luvas longas'; }
        if (r() < 0.18) { o.coat = pk([0x3a2a3a, 0x8a7a5a, 0x1f2430]); o.name += ', casaco de lã'; }
      }
    },
  },
  elenco: [
    { x: -5.4, z: -8.5, rot: 0.3, anim: 6, fala: 'Senhores passageiros, o Expresso parte às vinte e uma e quarenta. Pontualmente.', outfit: { dress: false, main: 0x152447, pants: 0x152447, shirt: 0xf6f3ec, tie: 0x152447, skin: 1, hair: 0x6b4a2b, beard: true, hat: 'cap', hatColor: 0x152447, hatBand: 0xd9a441, pocket: 0xd9a441, accent: 0xd9a441, prop: 'whistle', name: 'condutor Maurice, de quepe azul com galão dourado, apito e relógio de bolso' } },
    { x: -4.75, z: -7.55, rot: 1.57, anim: 10, fala: 'Cuidado com esse baú, madame, pesa mais do que parece.', outfit: { dress: false, main: 0x5a0e18, pants: 0x1b1b1f, shirt: 0xf6f3ec, tie: 0x16161a, skin: 4, hair: 0x1a1411, hat: 'cap', hatColor: 0xc8102a, hatBand: 0x16161a, gloves: 0xf2eee6, name: 'carregador Abdel, de quepe vermelho e luvas brancas' } },
    { x: 0.9, z: -4.6, rot: -0.5, anim: 0, fala: 'As pequenas células cinzentas, mon ami, nunca tiram férias.', outfit: { dress: false, main: 0x2a2c30, pants: 0x2a2c30, shirt: 0xf6f3ec, tie: 0x8b1e2d, bow: true, skin: 0, hair: 0x1a1411, beard: true, hat: 'bowler', hatColor: 0x16161a, coat: 0x34343a, pocket: 0xf6f3ec, prop: 'cane', propL: 'magnifier', name: 'detetive belga Hercule, de bigode encerado, chapéu-coco e bengala' } },
    { x: -1.4, z: -6.3, rot: -2.3, anim: 4, fala: 'Em São Petersburgo, os trens esperavam por mim.', outfit: { dress: true, gown: true, satin: true, main: 0x3a1a4a, skin: 0, hair: 0xd9b46a, hairStyle: 'bun', necklace: true, earring: true, hat: 'tiara', coat: 0xeee6d8, scarf: 0xf6f2ea, gloves: 0xf6f2ea, accent: 0xc9ced6, glass: 'coupe', drink: 0xf2d070, name: 'princesa Natalia Dragomiroff, de casaco de arminho e tiara' } },
    { x: 2.45, z: -10.25, rot: 0.5, anim: 10, fala: 'Linguado ao molho Mornay. E ninguém desce antes da sobremesa.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x2a2a2e, shirt: 0xf6f3ec, tie: 0xf6f3ec, skin: 2, hair: 0x3b2a1e, beard: true, hat: 'chef', apron: 0xf6f3ec, scarf: 0xc8322f, prop: 'tray', name: 'chef Auguste, de touca alta e lenço vermelho' } },
    { x: -10.5, z: -1.2, rot: 0.6, anim: 6, fala: 'Extra! Extra! Herdeiro americano desaparece no túnel do Simplon!', outfit: { dress: false, main: 0x5a4a3a, pants: 0x3a3028, shirt: 0xe8dcc0, tie: 0x5a4a3a, skin: 2, hair: 0x8a3a22, hat: 'cap', hatColor: 0x6a5a48, hatBand: 0x5a4a3a, scarf: 0x2a4a6a, prop: 'book', propColor: 0xeee6d0, name: 'jornaleiro Pippo, de boné de tweed e pilha de jornais' } },
    { x: 5.3, z: 1.42, rot: 0, anim: 7, fala: 'Meu marido também viajava neste trem. Uma vez.', outfit: { dress: true, gown: true, satin: false, main: 0x111114, skin: 0, hair: 0x1a1411, hairStyle: 'bun', hat: 'veil', hatColor: 0x0c0c10, gloves: 0x111114, necklace: true, accent: 0xf2eee6, clutch: true, name: 'viúva misteriosa, de luto fechado e véu negro' } },
    { x: 7.5, z: -10.4, rot: 0.9, anim: 19, fala: 'Doze atmosferas na caldeira. Ela quer partir.', outfit: { dress: false, main: 0x3a4250, pants: 0x3a4250, shirt: 0x5a5a5a, tie: 0x3a4250, skin: 3, hair: 0x3b2a1e, beard: true, hat: 'cap', hatColor: 0x2a3550, hatBand: 0xf2eee6, scarf: 0xc8322f, gloves: 0x2a2622, apron: 0x2a2622, name: 'maquinista Gaston, de macacão sujo de carvão e lenço vermelho' } },
  ],
  missoes: [
    { k: 'mala', label: 'Trocar a mala no carrinho', where: 'carrinho de bagagem, porta do vagão-restaurante', s: [-3.4, -6.55], l: [-3.4, -7.6] },
    { k: 'relogio', label: 'Adiantar o relógio da estação', where: 'manivela na coluna do relógio, sobre o tênder', s: [4.8, -8.25], l: [4.8, -9.15] },
    { k: 'sinal', label: 'Virar o sinal ferroviário', where: 'ponta da plataforma, na frente da locomotiva', s: [13.2, -6.6], l: [14.0, -7.5] },
    { k: 'bau', label: 'Trocar a etiqueta do baú', where: 'carrinho de baús, perto da cabine', s: [7.6, -5.85], l: [7.6, -6.9] },
    { k: 'jornal', label: 'Esconder o bilhete no jornal', where: 'banca de jornais, à esquerda', s: [-11.35, -3.0], l: [-12.4, -3.0] },
    { k: 'vapor', label: 'Fechar a válvula de vapor', where: 'lateral da locomotiva', s: [10.2, -8.6], l: [10.2, -9.45] },
    { k: 'painel', label: 'Mudar o destino no painel de palhetas', where: 'painel de partidas, à direita', s: [9.7, -3.45], l: [9.7, -4.4] },
    { k: 'abajur', label: 'Trocar o abajur da mesa 3', where: 'vagão-restaurante, mesa do meio', s: [-0.8, -10.2], l: [-0.8, -11.8] },
    { k: 'placa', label: 'Virar a placa de Istambul', where: 'passarela de ferro, lado da frente', s: [5.0, 7.45], l: [5.0, 8.1], lv: 1 },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r, root = K.root;
    const PI = Math.PI;

    // ------------------------------------------------------------ materiais
    const navy = K.mat(0x152447, { roughness: 0.3, metalness: 0.25 }), navyD = K.mat(0x0d1730, { roughness: 0.4, metalness: 0.2 });
    const gilt = K.metal(0xd4a34a, 0.25), brass = K.brass, iron = K.iron, ironG = K.metal(0x24302c, 0.5);
    const cream = K.mat(0xeadfc6, { roughness: 0.6 }), black = K.mat(0x121216, { roughness: 0.3, metalness: 0.35 });
    const teak = K.mat(0x6a3e20, { roughness: 0.45 }), teakD = K.mat(0x3e2412, { roughness: 0.5 });
    const velvetB = K.mat(0x1f3a6a, { roughness: 0.9 }), velvetR = K.mat(0x4e0c16, { roughness: 0.9 });
    const stoneM = K.mat(0xb6ab98, { roughness: 0.85 }), roofM = K.mat(0x2a2e36, { roughness: 0.55, metalness: 0.3, side: T.DoubleSide });
    const redW = K.mat(0x8a1a1a, { roughness: 0.4, metalness: 0.3 }), steel = K.metal(0xaab0b8, 0.3);
    const pk = (a) => a[Math.floor(R() * a.length)];
    const UP = new T.Vector3(0, 1, 0);
    const strut = (a, b, r, m, o = {}) => { const A = new T.Vector3(a[0], a[1], a[2]), B = new T.Vector3(b[0], b[1], b[2]); const d = B.clone().sub(A); const me = K.cyl(r, r, d.length(), m, (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2, o, o.seg || 6); me.quaternion.setFromUnitVectors(UP, d.normalize()); return me; };
    const brickTex = (rep, base = [112, 52, 36]) => K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#3a2c24'; g.fillRect(0, 0, w, h); const bh = 32, bw = 64;
      for (let j = 0; j < h / bh; j++) for (let i = -1; i < w / bw + 1; i++) { const x = i * bw + (j % 2) * bw / 2, v = R(); g.fillStyle = `rgb(${base[0] + v * 40 | 0},${base[1] + v * 22 | 0},${base[2] + v * 14 | 0})`; g.fillRect(x + 2, j * bh + 2, bw - 4, bh - 4); }
      K.grain(g, w, h, 14);
    }, rep);
    const enamel = (text, w = 512, h = 128, bg = '#1b3a8a', fg = '#f4f1e8') => K.canvasTex(w, h, (g) => {
      g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = fg; g.lineWidth = 7; g.strokeRect(10, 10, w - 20, h - 20);
      g.fillStyle = fg; g.font = `700 ${Math.round(h * 0.52)}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 4);
      for (let k = 0; k < 7; k++) { g.fillStyle = 'rgba(20,20,24,.75)'; g.beginPath(); g.arc(R() < 0.5 ? R() * 24 : w - R() * 24, R() * h, 2 + R() * 5, 0, 7); g.fill(); }
      g.fillStyle = '#d9d4c4'; for (const [x, y] of [[22, 22], [w - 22, 22], [22, h - 22], [w - 22, h - 22]]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
    });

    // ------------------------------------------------------------ piso da plataforma (lajes de pedra) e bordas
    const platTex = K.canvasTex(1024, 1024, (g, w, h) => {
      g.fillStyle = '#5c564e'; g.fillRect(0, 0, w, h); const s = w / 8;
      for (let j = 0; j < 8; j++) for (let i = -1; i < 9; i++) { const x = i * s + (j % 2) * s / 2, v = 84 + R() * 22 - 11; g.fillStyle = `rgb(${v + 10},${v + 4},${v - 6})`; g.fillRect(x + 3, j * s + 3, s - 6, s - 6);
        for (let k = 0; k < 4; k++) { g.fillStyle = `rgba(40,34,28,${R() * 0.12})`; g.beginPath(); g.ellipse(x + R() * s, j * s + R() * s, 6 + R() * 24, 4 + R() * 14, R() * 3, 0, 7); g.fill(); } }
      K.grain(g, w, h, 16);
    }, [3, 2]);
    K.floor(-24, -9.35, 24, 10, platTex, { m: { roughness: 0.7, metalness: 0.02, envMapIntensity: 0.4 } });
    // faixa branca de segurança junto ao trem e na borda da frente
    K.box(48, 0.012, 0.18, K.mat(0xe8e2d2, { roughness: 0.6 }), 0, 0.006, -9.05, { cast: false });
    K.box(48, 0.012, 0.18, K.mat(0xe8e2d2, { roughness: 0.6 }), 0, 0.006, 9.55, { cast: false });
    K.box(48, 0.14, 0.4, stoneM, 0, -0.06, 9.85, { cast: false });
    K.box(48, 1.1, 0.3, K.mat(0x6a6258, { roughness: 0.9 }), 0, -0.6, 10.0, { cast: false });

    // ------------------------------------------------------------ leito de trilhos (frente e lados) com dormentes e trilhos
    const gravelTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#2c2824'; g.fillRect(0, 0, w, h); for (let k = 0; k < 1600; k++) { const v = 40 + R() * 60; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.fillRect(R() * w, R() * h, 2 + R() * 3, 2 + R() * 3); } }, [60, 30]);
    K.add(new T.PlaneGeometry(200, 120).rotateX(-PI / 2), K.texMat(gravelTex, { roughness: 1 }), 0, -1.1, 45, { cast: false });
    const sleeperGeo = new T.BoxGeometry(0.22, 0.12, 2.5), railGeo = new T.BoxGeometry(80, 0.12, 0.07);
    const track = (z, x0 = -40, x1 = 40) => { const l = []; for (let x = x0; x < x1; x += 0.62) l.push([x, -1.04, z, PI / 2]); K.inst(sleeperGeo, K.mat(0x3a2a1e, { roughness: 1 }), l.map(p => [p[0], p[1], p[2], 0]), { cast: false }); for (const s of [-0.72, 0.72]) K.add(railGeo, steel, (x0 + x1) / 2, -0.92, z + s, { cast: false, s: [(x1 - x0) / 80, 1, 1] }); };
    track(11.6); track(19.5); track(24.5); track(30.5);
    // plataforma-ilha da frente, baixa
    K.box(60, 1.1, 4.2, K.mat(0x7a7266, { roughness: 0.9 }), 0, -0.55, 15.2, { cast: false });
    K.floor(-30, 13.1, 30, 17.3, platTex, { m: { roughness: 0.8 } });
    for (let x = -24; x <= 24; x += 8) { K.cyl(0.05, 0.07, 2.6, ironG, x, 1.3, 15.2, { cast: false }, 8); K.sphere(0.2, K.glow(0xffd9a0, 1.8), x, 2.75, 15.2, { cast: false }); K.pool(x, 15.2, 1.6, 0xffb060, 0.3); }
    for (let x = -20; x <= 20; x += 8) { K.box(1.8, 0.08, 0.45, teak, x + 4, 0.45, 15.6, { cast: false }); K.box(1.8, 0.4, 0.06, teak, x + 4, 0.7, 15.85, { cast: false }); }
    // vagões de carga parados ao longe (baixos)
    for (const [x, c] of [[-22, 0x4a2a1e], [-10, 0x3a3a34], [8, 0x4a2a1e], [20, 0x2a3a4a]]) { K.box(9, 1.6, 2.6, K.mat(c, { roughness: 0.9 }), x, -0.1 + 0.3, 30.5, { cast: false }); K.box(9.2, 0.12, 2.8, K.mat(0x1a1a1a), x, 1.15, 30.5, { cast: false }); }

    // ------------------------------------------------------------ fachada da estação do outro lado (+z) e torre do relógio (sniper)
    { const fac = K.canvasTex(1024, 256, (g, w, h) => {
        g.fillStyle = '#c8b894'; g.fillRect(0, 0, w, h);
        for (let k = 0; k < 14; k++) { const x = 20 + k * 72; g.fillStyle = R() < 0.7 ? '#ffcf86' : '#2a2630'; g.fillRect(x, 70, 40, 120); g.beginPath(); g.arc(x + 20, 70, 20, PI, 0); g.fill(); g.fillStyle = 'rgba(80,60,40,.6)'; g.fillRect(x - 8, 60, 4, 140); g.fillRect(x + 44, 60, 4, 140); }
        g.fillStyle = '#a89870'; g.fillRect(0, 0, w, 22); g.fillRect(0, h - 26, w, 26);
      });
      const fm = new T.MeshStandardMaterial({ map: fac, emissiveMap: fac, emissive: 0xffffff, emissiveIntensity: 0.4, roughness: 0.9 });
      K.add(new T.BoxGeometry(90, 12, 8), fm, 0, 5, 54, { cast: false });
      K.box(90.6, 0.6, 8.6, K.mat(0x9a8a64), 0, 11.2, 54, { cast: false });
      const tw = K.group(2, 0, 50);
      K.box(5.2, 28, 5.2, K.mat(0xc2b08a, { roughness: 0.85 }), 0, 14, 0, { parent: tw, cast: false });
      for (let k = 0; k < 4; k++) K.box(0.5, 28, 0.5, K.mat(0xa89870), (k % 2 ? 1 : -1) * 2.55, 14, (k < 2 ? 1 : -1) * 2.55, { parent: tw, cast: false });
      K.box(5.8, 0.5, 5.8, K.mat(0xa89870), 0, 28.2, 0, { parent: tw, cast: false });
      K.box(3.6, 2.2, 3.6, K.mat(0xc2b08a), 0, 29.5, 0, { parent: tw, cast: false });
      K.cone(0.6, 2.2, gilt, 0, 31.7, 0, { parent: tw, cast: false }, 8);
      // mostrador do relógio da fachada (aceso) e a janela escura do sniper logo abaixo
      K.cyl(1.7, 1.7, 0.1, K.glow(0xffe6b0, 1.4), 0, 25.8, -2.62, { parent: tw, cast: false, rx: PI / 2 }, 32);
      K.torus(1.75, 0.12, gilt, 0, 25.8, -2.68, { parent: tw, cast: false }, 8, 32);
      const hh = K.box(0.12, 1.0, 0.05, black, 0, 25.8, -2.72, { parent: tw, cast: false }); hh.geometry.translate(0, 0.45, 0); hh.rotation.z = 0.6;
      const mh = K.box(0.08, 1.45, 0.05, black, 0, 25.8, -2.76, { parent: tw, cast: false }); mh.geometry.translate(0, 0.65, 0); mh.rotation.z = -2.3;
      K.add(new T.PlaneGeometry(2.2, 2.4), K.mat(0x0a0a10), 0, 23.4, -2.63, { parent: tw, cast: false, ry: PI });
      K.box(2.6, 0.2, 0.6, K.mat(0xa89870), 0, 22.15, -2.8, { parent: tw, cast: false });
      K.halo(2, 21.6, 47.1, 0.35, 0xff4134, 1.0);
      K.sign('GARE DO ORIENTE', 16, 1.6, 2, 9.4, 49.9, { neon: true, color: '#ffd38a', size: 80, k: 1.5, ry: PI, w: 1024, h: 102 });
    }

    // ------------------------------------------------------------ cidade ao redor (prédios com janelas acesas, longe)
    for (let k = 0; k < 4; k++) { const z = -40 + k * 10; K.facade(9, 14 + R() * 12, 8, -38 - R() * 6, z, { lit: 0.45, bays: 5, floors: 10, wall: pk(['#2a2f3a', '#3a2e2a', '#2e2a36']) }); K.facade(9, 14 + R() * 12, 8, 40 + R() * 6, z, { lit: 0.45, bays: 5, floors: 10, wall: pk(['#2a2f3a', '#3a2e2a', '#2e2a36']) }); }
    for (let k = 0; k < 8; k++) K.facade(12, 22 + R() * 10, 8, -42 + k * 12, -34, { lit: 0.4, bays: 6, floors: 14 });

    // ------------------------------------------------------------ parede de tijolos do fundo com arcos e janelões art déco
    { const bt = brickTex([20, 4.5], [78, 36, 26]);
      K.add(new T.BoxGeometry(64, 14, 1), K.texMat(bt, { roughness: 0.9 }), 0, 6.5, -18.2, { cast: false });
      const winTex = K.canvasTex(512, 512, (g, w, h) => {
        const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf86'); gr.addColorStop(1, '#c87a3a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#1a1612'; g.lineWidth = 10; for (let k = 1; k < 8; k++) { g.beginPath(); g.moveTo(k * w / 8, 0); g.lineTo(k * w / 8, h); g.stroke(); } for (let k = 1; k < 8; k++) { g.beginPath(); g.moveTo(0, k * h / 8); g.lineTo(w, k * h / 8); g.stroke(); }
        g.lineWidth = 14; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(w / 2, h, 70 + k * 60, PI, 0); g.stroke(); }
      });
      const wm = new T.MeshBasicMaterial({ map: winTex, color: new T.Color(0xffffff).multiplyScalar(0.75) });
      for (const x of [-20, -7, 7, 20]) {
        const sh = new T.Shape(); sh.moveTo(-3.6, 0); sh.lineTo(3.6, 0); sh.lineTo(3.6, 4.5); sh.absarc(0, 4.5, 3.6, 0, PI, false); sh.lineTo(-3.6, 0);
        const geo = new T.ShapeGeometry(sh, 20); const uv = geo.attributes.uv, p = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) + 3.6) / 7.2, p.getY(i) / 8.1);
        K.add(geo, wm, x, 3.4, -17.68, { cast: false });
        K.add(new T.TorusGeometry(3.85, 0.25, 6, 24, PI), K.mat(0xd8c8a4, { roughness: 0.8 }), x, 7.9, -17.6, { cast: false });
        K.box(0.5, 4.6, 0.5, K.mat(0xd8c8a4), x - 3.85, 5.6, -17.6, { cast: false }); K.box(0.5, 4.6, 0.5, K.mat(0xd8c8a4), x + 3.85, 5.6, -17.6, { cast: false });
      }
      // pilastras e friso em zigue-zague
      for (let x = -30; x <= 30; x += 13.5) K.box(1.0, 14, 0.6, K.mat(0xd8c8a4, { roughness: 0.8 }), x + 0.25, 6.5, -17.55, { cast: false });
      K.box(64, 0.6, 0.6, K.mat(0xd8c8a4), 0, 12.6, -17.55, { cast: false });
      K.sign('ESTAÇÃO DO ORIENTE', 11, 1.1, 0, 11.6, -17.2, { neon: true, color: '#ffd38a', size: 72, k: 1.8, w: 1024, h: 102 });
    }
    // trilho de trás (atrás dos vagões)
    track(-14.6, -30, 30);

    // ------------------------------------------------------------ cobertura de ferro e vidro (só no fundo, sobre o trem)
    { const zF = -9.15, yF = 8.0, zB = -17.6, yB = 12.6;
      // viga da frente (treliça) e colunas
      K.box(52, 0.42, 0.26, ironG, 0, yF + 0.1, zF, { cast: false }); K.box(52, 0.06, 0.3, gilt, 0, yF - 0.13, zF, { cast: false });
      for (let x = -25.5; x < 25.5; x += 0.8) strut([x, yF - 0.1, zF], [x + 0.4, yF + 0.3, zF], 0.025, ironG, { cast: false });
      for (const x of [-21, -13.2, -3.6, 4.8, 13.2, 21]) {
        K.cyl(0.11, 0.13, yF, ironG, x, yF / 2, zF, {}, 10); K.box(0.4, 0.4, 0.4, ironG, x, 0.2, zF); K.cyl(0.24, 0.13, 0.35, gilt, x, yF - 0.3, zF, {}, 10);
        for (const s of [-1, 1]) K.add(new T.TorusGeometry(0.7, 0.04, 5, 10, PI / 2), ironG, x + s * 0.7, yF - 0.75, zF, { ry: s > 0 ? PI : 0, rz: 0, cast: false });
        if (Math.abs(x) < 14.5) K.colR(x, zF, 0.15);
      }
      // tesouras curvas do telhado
      for (let x = -24; x <= 24; x += 6) {
        const top = (u) => [x, yF + (yB - yF) * u + Math.sin(u * PI) * 0.8, zF + (zB - zF) * u], bot = (u) => [x, yF + (yB - 1.6 - yF) * u + Math.sin(u * PI) * 0.1, zF + (zB - zF) * u];
        for (let k = 0; k < 8; k++) { const a = k / 8, b = (k + 1) / 8; strut(top(a), top(b), 0.06, ironG, { cast: false }); strut(bot(a), bot(b), 0.05, ironG, { cast: false }); strut(top(a), bot(b), 0.025, ironG, { cast: false }); strut(bot(b), top(b), 0.025, ironG, { cast: false }); }
      }
      // vidro com caixilhos
      const gt = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = 'rgba(150,180,220,.07)'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(20,26,30,.7)'; g.lineWidth = 3; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * w / 4, 0); g.lineTo(k * w / 4, h); g.stroke(); g.beginPath(); g.moveTo(0, k * h / 4); g.lineTo(w, k * h / 4); g.stroke(); } }, [24, 5]);
      const L = Math.hypot(zB - zF, yB - yF), ang = Math.atan2(yB - yF, zF - zB);
      const gl = K.add(new T.PlaneGeometry(52, L + 0.6), new T.MeshStandardMaterial({ map: gt, transparent: true, side: T.DoubleSide, depthWrite: false, roughness: 0.1, metalness: 0.3, emissive: 0x1a2440, emissiveIntensity: 0.15 }), 0, (yF + yB) / 2 + 0.35, (zF + zB) / 2, { cast: false, recv: false });
      gl.rotation.x = -PI / 2 + ang;
      // lâmpadas-globo penduradas na viga
      for (let x = -11; x <= 11; x += 4.4) { if (Math.abs(x - 4.8) < 1) continue; K.cyl(0.008, 0.008, 2.2, iron, x, yF - 1.2, zF + 0.05, { cast: false }, 4); K.cyl(0.05, 0.25, 0.18, ironG, x, yF - 2.3, zF + 0.05, { cast: false }, 10); K.sphere(0.17, K.glow(0xffe0b0, 2.0), x, yF - 2.45, zF + 0.05, { cast: false }); K.halo(x, yF - 2.45, zF + 0.05, 0.8, 0xffc080, 0.35); }
    }

    // ------------------------------------------------------------ fumaça e vapor (partículas)
    const puffs = [];
    for (let i = 0; i < 130; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false })); s.visible = false; s.userData = { life: 0, age: 0 }; root.add(s); puffs.push(s); }
    const emitters = [];
    const emitter = (p, v, rate, life, s0, s1, op, col) => { const e = { p, v, rate, life, s0, s1, op, col, on: true, acc: 0 }; emitters.push(e); return e; };
    const chimney = emitter([14.15, 4.1, -10.8], [0.5, 1.6, -0.25], 5, 4.2, 0.5, 3.2, 0.55, 0xb8bcc4);
    const cock1 = emitter([14.3, 0.35, -9.35], [0.5, 0.35, 1.6], 9, 2.0, 0.35, 1.9, 0.7, 0xf4f6fa);
    const cock2 = emitter([9.0, 0.35, -9.35], [-0.3, 0.3, 1.5], 8, 1.9, 0.35, 1.8, 0.65, 0xf4f6fa);
    const valveJet = emitter([10.75, 1.05, -9.3], [0.2, 1.6, 0.7], 12, 1.4, 0.2, 1.3, 0.85, 0xffffff);
    const safety = emitter([11.6, 3.4, -10.8], [0, 1.8, 0], 3, 1.3, 0.15, 0.8, 0.5, 0xffffff);
    K.tick((dt) => {
      for (const e of emitters) { if (!e.on) continue; e.acc += dt * e.rate; while (e.acc >= 1) { e.acc -= 1; const s = puffs.find(q => !q.visible); if (!s) break; s.visible = true; s.userData = { life: e.life * (0.8 + R() * 0.4), age: 0, v: [e.v[0] + (R() - 0.5) * 0.4, e.v[1] * (0.8 + R() * 0.4), e.v[2] + (R() - 0.5) * 0.4], s0: e.s0, s1: e.s1, op: e.op }; s.material.color.set(e.col); s.position.set(e.p[0] + (R() - 0.5) * 0.2, e.p[1], e.p[2] + (R() - 0.5) * 0.2); } }
      for (const s of puffs) { if (!s.visible) continue; const d = s.userData; d.age += dt; const u = d.age / d.life; if (u >= 1) { s.visible = false; s.material.opacity = 0; continue; } const slow = 1 - u * 0.6; s.position.x += d.v[0] * dt * slow; s.position.y += d.v[1] * dt * slow; s.position.z += d.v[2] * dt * slow; const sc = d.s0 + (d.s1 - d.s0) * Math.sqrt(u); s.scale.set(sc, sc, 1); s.material.opacity = d.op * Math.sin(Math.min(1, u * 3) * PI / 2) * (1 - u); }
    });

    // ------------------------------------------------------------ vagões em corte (salão e restaurante)
    const ZB = -12.1, ZF = -9.45, CAR_H = 2.95;
    const carpet = (c1, c2, len) => K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h); g.strokeStyle = c2; g.lineWidth = 3; for (let x = 0; x < w; x += 42) for (let y = 0; y < h; y += 42) { g.beginPath(); g.moveTo(x + 21, y + 4); g.lineTo(x + 38, y + 21); g.lineTo(x + 21, y + 38); g.lineTo(x + 4, y + 21); g.closePath(); g.stroke(); g.fillStyle = c2; g.fillRect(x + 19, y + 19, 4, 4); } g.strokeStyle = c2; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16); K.grain(g, w, h, 8); }, [Math.max(1, Math.round(len / 4)), 1]);
    // parede interna do fundo com janelas noturnas, painéis de marchetaria e vidros Lalique
    const carWall = (x0, x1, wins, wood) => {
      const len = x1 - x0, ppm = 110, W = Math.round(len * ppm), H = Math.round(CAR_H * ppm);
      const tex = K.canvasTex(W, H, (g) => {
        const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, wood[0]); gr.addColorStop(1, wood[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        for (let k = 0; k < 220; k++) { g.strokeStyle = `rgba(30,14,4,${R() * 0.15})`; g.lineWidth = 1; const x = R() * W; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 6, H / 3, x - 6, H * 0.6, x + 3, H); g.stroke(); }
        const yW0 = (CAR_H - 2.15) * ppm, yW1 = (CAR_H - 1.0) * ppm;
        g.fillStyle = 'rgba(20,8,2,.35)'; g.fillRect(0, (CAR_H - 0.85) * ppm, W, 0.85 * ppm);
        g.strokeStyle = '#d4a34a'; g.lineWidth = 3; g.strokeRect(4, (CAR_H - 0.8) * ppm, W - 8, 0.72 * ppm);
        for (let x = 0; x < W; x += 0.9 * ppm) { g.strokeStyle = 'rgba(212,163,74,.55)'; g.strokeRect(x + 12, (CAR_H - 0.72) * ppm, 0.9 * ppm - 24, 0.56 * ppm); }
        wins.forEach(wx => {
          const cx = (wx - x0) * ppm, ww = 1.0 * ppm;
          const sk = g.createLinearGradient(0, yW0, 0, yW1); sk.addColorStop(0, '#0a1230'); sk.addColorStop(1, '#22305a'); g.fillStyle = sk; g.fillRect(cx - ww / 2, yW0, ww, yW1 - yW0);
          for (let k = 0; k < 8; k++) { g.fillStyle = R() < 0.5 ? '#ffd27a' : '#fff0c0'; g.fillRect(cx - ww / 2 + R() * ww, yW0 + (0.5 + R() * 0.45) * (yW1 - yW0), 2, 2); }
          g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(cx - ww / 2 + 10, yW0); g.lineTo(cx - ww / 2 + 40, yW0); g.lineTo(cx - ww / 2 + 10, yW0 + 60); g.fill();
          g.strokeStyle = '#c99a44'; g.lineWidth = 6; g.strokeRect(cx - ww / 2, yW0, ww, yW1 - yW0);
          g.lineWidth = 3; g.beginPath(); g.moveTo(cx - ww / 2, yW0 + 30); g.lineTo(cx + ww / 2, yW0 + 30); g.stroke();
        });
        // painéis Lalique (vidro fosco com ramos) entre as janelas
        for (let k = 0; k <= wins.length; k++) {
          const a = k === 0 ? x0 : wins[k - 1], b = k === wins.length ? x1 : wins[k], mid = ((a + b) / 2 - x0) * ppm; if ((b - a) < 1.3) continue;
          const pw = 0.32 * ppm, py = yW0 + 6, ph = yW1 - yW0 - 12;
          g.fillStyle = '#efe6cc'; g.fillRect(mid - pw / 2, py, pw, ph); g.strokeStyle = 'rgba(160,130,80,.8)'; g.lineWidth = 2;
          for (let j = 0; j < 6; j++) { g.beginPath(); g.moveTo(mid, py + ph - j * 18); g.quadraticCurveTo(mid + 14, py + ph - j * 18 - 10, mid + 4, py + ph - j * 18 - 20); g.stroke(); g.beginPath(); g.moveTo(mid, py + ph - j * 18); g.quadraticCurveTo(mid - 14, py + ph - j * 18 - 10, mid - 4, py + ph - j * 18 - 20); g.stroke(); }
          g.strokeStyle = '#c99a44'; g.lineWidth = 4; g.strokeRect(mid - pw / 2, py, pw, ph);
        }
        g.fillStyle = '#c99a44'; g.fillRect(0, 6, W, 5); g.fillRect(0, (CAR_H - 2.3) * ppm, W, 3);
      });
      const m = new T.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.16, roughness: 0.5 });
      K.add(new T.PlaneGeometry(len, CAR_H), m, (x0 + x1) / 2, CAR_H / 2, ZB + 0.06, { cast: false });
      K.box(len, CAR_H, 0.08, navy, (x0 + x1) / 2, CAR_H / 2, ZB + 0.0, { cast: false });
      // cortinas presas com cordão dourado e arandelas
      wins.forEach(wx => { for (const s of [-1, 1]) { K.box(0.16, 1.25, 0.06, K.mat(0x8a2232, { roughness: 0.9 }), wx + s * 0.6, 1.62, ZB + 0.12); K.sphere(0.035, gilt, wx + s * 0.6, 1.45, ZB + 0.16, { cast: false }, 6, 4); } K.box(1.4, 0.12, 0.1, gilt, wx, 2.25, ZB + 0.12, { cast: false }); });
    };
    // meia cobertura em corte (só a metade de trás) com friso dourado no corte
    const halfRoof = (x0, x1) => {
      const sh = new T.Shape(); const pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10 * 0.42 * PI; pts.push([1.33 * Math.cos(t), 2.95 + 0.5 * Math.sin(t)]); }
      sh.moveTo(pts[0][0], pts[0][1]); pts.forEach(p => sh.lineTo(p[0], p[1])); for (let k = pts.length - 1; k >= 0; k--) sh.lineTo(pts[k][0] * 0.96, pts[k][1] - 0.07); sh.lineTo(pts[0][0], pts[0][1]);
      const geo = new T.ExtrudeGeometry(sh, { depth: x1 - x0, bevelEnabled: false }); geo.rotateY(PI / 2);
      // depois de girar: u (x da forma) vira -z; ajusta para o centro do vagão
      K.add(geo, roofM, x0, 0, -10.78, { cast: true });
      const cutZ = -10.78 - 1.33 * Math.cos(0.42 * PI), cutY = 2.95 + 0.5 * Math.sin(0.42 * PI);
      K.box(x1 - x0, 0.06, 0.08, gilt, (x0 + x1) / 2, cutY - 0.02, cutZ, { cast: false });
      K.box(x1 - x0, 0.1, 0.1, gilt, (x0 + x1) / 2, CAR_H, ZB + 0.02, { cast: false });
      // claraboias do teto (por dentro)
      for (let x = x0 + 0.8; x < x1 - 0.5; x += 1.6) K.box(0.6, 0.03, 0.4, K.glow(0xffe0b0, 1.2), x, 3.18, -11.55, { cast: false, rx: -0.35 });
    };
    // painel inferior da frente (corte na linha da janela), com portas abertas e letreiro dourado
    const frontPanel = (x0, x1, doors, label) => {
      const segs = []; let a = x0; doors.forEach(([d0, d1]) => { segs.push([a, d0]); a = d1; }); segs.push([a, x1]);
      segs.forEach(([s0, s1]) => {
        if (s1 - s0 < 0.05) return;
        K.box(s1 - s0, 0.9, 0.08, navy, (s0 + s1) / 2, 0.45, ZF, {});
        K.box(s1 - s0, 0.05, 0.12, gilt, (s0 + s1) / 2, 0.92, ZF, { cast: false }); K.box(s1 - s0, 0.025, 0.1, gilt, (s0 + s1) / 2, 0.12, ZF + 0.01, { cast: false });
        K.box(s1 - s0 - 0.1, 0.02, 0.09, gilt, (s0 + s1) / 2, 0.78, ZF + 0.01, { cast: false });
        K.col(s0, ZF - 0.12, s1, ZF + 0.08);
      });
      doors.forEach(([d0, d1]) => {
        // degrau, folha da porta aberta para dentro e corrimãos de latão
        K.box(d1 - d0, 0.05, 0.3, gilt, (d0 + d1) / 2, 0.025, ZF + 0.1, { cast: false });
        const dg = K.group(d0, 0, ZF, 1.35); K.box(0.06, 2.05, 0.75 * 0 + 0.06, navy, 0, 1.02, 0, { parent: dg }); K.box(0.6, 2.05, 0.05, navy, 0.3, 1.02, 0, { parent: dg }); K.box(0.42, 0.6, 0.06, K.mat(0x22305a, { emissive: 0x0a1020, roughness: 0.1 }), 0.3, 1.55, 0, { parent: dg, cast: false });
        for (const x of [d0 + 0.05, d1 - 0.05]) K.cyl(0.018, 0.018, 1.0, brass, x, 1.2, ZF + 0.08, { cast: false }, 6);
      });
      // letreiro em letras douradas no painel
      const big = segs.reduce((b, s) => (s[1] - s[0] > b[1] - b[0] ? s : b), segs[0]);
      K.sign(label, 4.0, 0.3, (big[0] + big[1]) / 2, 0.5, ZF + 0.05, { color: '#e2b65a', font: 'Georgia, serif', size: 62, weight: 700, w: 1024, h: 77 });
      K.sign('EXPRESSO ORIENTE', 1.9, 0.13, (big[0] + big[1]) / 2, 0.27, ZF + 0.05, { color: '#e2b65a', size: 56, w: 1024, h: 70 });
    };
    const carEnd = (x, solid) => {
      K.box(0.1, CAR_H, 1.55, navy, x, CAR_H / 2, -11.32, {}); K.box(0.12, CAR_H + 0.05, 0.08, gilt, x, CAR_H / 2, -10.55, { cast: false });
      if (solid) K.box(0.1, CAR_H, 1.1, navy, x, CAR_H / 2, -10.0, {}); else K.box(0.1, 0.85, 1.1, navy, x, CAR_H - 0.42, -10.0, {});
      K.col(x - 0.08, -12.0, x + 0.08, solid ? -9.4 : -10.55);
    };

    // ===== vagão-salão (esquerda)
    { const x0 = -14.3, x1 = -6.55;
      K.floor(x0, -12.05, x1, ZF, carpet('#1a2a4a', '#c99a44', x1 - x0), { y: 0.01 });
      carWall(x0, x1, [-12.9, -10.9, -9.0, -7.4], ['#3a1e10', '#5a3018']);
      halfRoof(x0, x1); carEnd(x0, true); carEnd(x1, false);
      frontPanel(x0, x1, [[-9.3, -8.05]], 'VAGÃO-SALÃO');
      K.col(-14.5, -12.0, x0 + 0.05, -9.3);
      // piano de cauda
      const pg = K.group(-11.85, 0.62, -11.3);
      const ps = new T.Shape(); ps.moveTo(0, 0.7); ps.lineTo(-1.9, 0.7); ps.lineTo(-1.9, 0.4); ps.quadraticCurveTo(-1.75, -0.15, -1.0, -0.25); ps.quadraticCurveTo(-0.45, -0.32, -0.3, -0.7); ps.lineTo(0, -0.7); ps.lineTo(0, 0.7);
      const pGeo = new T.ExtrudeGeometry(ps, { depth: 0.3, bevelEnabled: false }); pGeo.rotateX(-PI / 2);
      const pianoM = K.mat(0x0a0a0c, { roughness: 0.12, metalness: 0.3 });
      K.add(pGeo, pianoM, 0, 0, 0, { parent: pg });
      const harp = new T.ShapeGeometry(ps); harp.rotateX(-PI / 2); harp.scale(0.94, 1, 0.9);
      K.add(harp, K.mat(0xb8893a, { metalness: 0.7, roughness: 0.35 }), -0.04, 0.31, 0, { parent: pg, cast: false });
      const lidGeo = new T.ExtrudeGeometry(ps, { depth: 0.025, bevelEnabled: false }); lidGeo.rotateX(-PI / 2); lidGeo.translate(0, 0, 0.7);
      const lg = K.group(0, 0.31, -0.7, 0, pg); K.add(lidGeo, pianoM, 0, 0, 0, { parent: lg }); lg.rotation.x = -0.6;
      strut([-0.9, 0.31, 0.2], [-0.9, 0.95, 0.2], 0.012, pianoM);
      K.box(0.2, 0.08, 1.36, K.mat(0xf4f0e6, { roughness: 0.3 }), 0.1, 0.12, 0, { parent: pg });
      for (let k = 0; k < 20; k++) K.box(0.11, 0.025, 0.025, black, 0.13, 0.17, -0.62 + k * 0.066 + (k % 3 === 0 ? 0.01 : 0), { parent: pg, cast: false });
      K.box(0.03, 0.22, 0.5, pianoM, -0.02, 0.42, 0, { parent: pg });
      K.box(0.3, 0.2, 0.02, K.mat(0xf6f1e4), 0.02, 0.45, 0.0, { parent: pg, cast: false, ry: PI / 2, rx: 0 });
      for (const [x, z] of [[-0.1, 0.55], [-0.1, -0.55], [-1.7, 0.5]]) K.cyl(0.05, 0.04, 0.62, pianoM, x, -0.31, z, { parent: pg }, 8);
      K.add(K.rbox(0.36, 0.08, 0.7, 0.03), velvetB, -11.3, 0.48, -11.3); K.box(0.3, 0.44, 0.6, pianoM, -11.3, 0.22, -11.3);
      K.col(-13.8, -12.0, -11.72, -10.55);
      K.slot(-11.3, -11.3, -12.5, -11.3, 'piano');
      // candelabro de prata sobre o piano
      K.cyl(0.02, 0.07, 0.35, K.silver, -12.6, 1.12, -11.6, {}, 8); for (const s of [-0.12, 0, 0.12]) { K.cyl(0.016, 0.016, 0.12, M.candle, -12.6 + s, 1.34, -11.6, { cast: false }, 6); K.flame(-12.6 + s, 1.41, -11.6, 0.013); }
      // poltronas de clube, mesinha com abajur e gramofone
      const club = (x, z, ry) => { const g = K.group(x, 0, z, ry); K.add(K.rbox(0.7, 0.25, 0.7, 0.08), velvetB, 0, 0.32, 0, { parent: g }); K.add(K.rbox(0.7, 0.55, 0.18, 0.08), velvetB, 0, 0.65, -0.28, { parent: g }); for (const s of [-1, 1]) K.add(K.rbox(0.14, 0.4, 0.66, 0.06), velvetB, s * 0.34, 0.45, 0, { parent: g }); K.box(0.74, 0.12, 0.72, teakD, 0, 0.1, 0, { parent: g }); };
      club(-10.15, -11.5, 0.15); club(-8.75, -11.5, -0.15);
      K.slot(-10.15, -11.45, -10.15, -9.8, 'sit'); K.slot(-8.75, -11.45, -8.75, -9.8, 'sit');
      K.cyl(0.24, 0.24, 0.03, teak, -9.45, 0.58, -11.75, {}, 16); K.cyl(0.03, 0.05, 0.56, gilt, -9.45, 0.29, -11.75, {}, 6);
      K.cyl(0.015, 0.02, 0.3, gilt, -9.45, 0.75, -11.8, { cast: false }, 6); K.cyl(0.07, 0.12, 0.14, K.glow(0xffc890, 1.6), -9.45, 0.95, -11.8, { cast: false }, 12);
      K.halo(-9.45, 0.95, -11.8, 0.45, 0xffb070, 0.4);
      K.cyl(0.05, 0.05, 0.02, K.mat(0x7a7a7a, { metalness: 0.6 }), -9.35, 0.61, -11.6, { cast: false }, 10);
      const gram = K.group(-8.15, 0, -11.78, 0.3);
      K.box(0.4, 0.62, 0.4, teak, 0, 0.31, 0, { parent: gram }); K.box(0.36, 0.1, 0.36, teakD, 0, 0.67, 0, { parent: gram });
      const disc = K.cyl(0.15, 0.15, 0.01, black, 0, 0.73, 0, { parent: gram, cast: false }, 18); K.cyl(0.04, 0.04, 0.012, K.mat(0xc8322f), 0, 0.735, 0, { parent: disc, cast: false }, 10);
      K.cyl(0.012, 0.012, 0.3, brass, 0.14, 0.86, -0.1, { parent: gram, cast: false }, 5);
      K.add(new T.ConeGeometry(0.26, 0.5, 14, 1, true).translate(0, -0.25, 0), K.mat(0xd4a34a, { metalness: 0.85, roughness: 0.25, side: T.DoubleSide }), 0.14, 1.25, 0.05, { parent: gram, rx: -2.3 });
      K.tick((dt) => { disc.rotation.y += dt * 3.5; });
      K.col(-8.4, -12.0, -7.9, -11.55);
      // bar do salão: armário com espelho, garrafas e copos
      K.box(0.95, 1.0, 0.55, teakD, -7.35, 0.5, -11.75); K.box(1.0, 0.04, 0.6, K.mat(0x1a1a1a, { roughness: 0.15, metalness: 0.4 }), -7.35, 1.02, -11.75);
      K.box(0.9, 0.9, 0.03, K.mat(0xc0ccd8, { roughness: 0.05, metalness: 0.9 }), -7.35, 1.6, -11.98, { cast: false });
      K.bottles(-7.72, 1.04, -11.88, 7, 0.11); for (let k = 0; k < 5; k++) K.cyl(0.03, 0.025, 0.08, K.glass, -7.65 + k * 0.13, 1.08, -11.6, { cast: false }, 8);
      K.col(-7.85, -12.0, -6.85, -11.45);
      K.slot(-7.35, -10.85, -7.35, -11.8, 'bar'); K.slot(-8.1, -10.95, -7.4, -11.7, 'bar');
      K.plant(-13.85, -10.0, 'palm', { pot: K.mat(0x1f3a5a, { roughness: 0.3 }), s: 0.75 });
      K.slot(-10.5, -10.1, -9.6, -10.1, 'talk'); K.slot(-9.6, -10.15, -10.5, -10.1, 'talk');
      const salonL = K.plight(-10.2, 2.5, -10.7, 0xffc080, 1.5, 7);
      K.pool(-10.2, -10.9, 2.6, 0xffb060, 0.25, 0.03);
    }

    // ===== vagão-restaurante (centro)
    const lampShades = [];
    { const x0 = -6.2, x1 = 3.0;
      K.floor(x0, -12.05, x1, ZF, carpet('#5a1420', '#c99a44', x1 - x0), { y: 0.01 });
      const tables = [-4.8, -2.8, -0.8, 1.2];
      carWall(x0, x1, tables, ['#4a2612', '#6a3a1a']);
      halfRoof(x0, x1); carEnd(x0, false); carEnd(x1, true);
      frontPanel(x0, x1, [[-6.05, -4.8], [1.5, 2.75]], 'VAGÃO-RESTAURANTE');
      // sanfona (fole) entre os vagões
      for (let k = 0; k < 5; k++) { K.box(0.08, 2.6, 1.5, K.mat(0x1a1a1a, { roughness: 0.9 }), -6.48 + k * 0.06, 1.3, -11.32, { cast: false }); K.box(0.08, 0.6, 1.1, K.mat(0x1a1a1a, { roughness: 0.9 }), -6.48 + k * 0.06, 2.62, -10.0, { cast: false }); }
      K.col(-6.55, ZF - 0.12, -6.2, ZF + 0.08);
      const plates = [], glasses = [], forks = [], napk = [];
      tables.forEach((tx, ti) => {
        const tz = -11.48;
        K.box(0.8, 0.04, 1.05, M.linen, tx, 0.74, tz); K.add(new T.BoxGeometry(0.84, 0.26, 1.08), K.mat(0xf3eee2, { roughness: 0.95 }), tx, 0.62, tz);
        K.cyl(0.04, 0.12, 0.5, teakD, tx, 0.25, tz, {}, 8);
        K.col(tx - 0.4, -12.0, tx + 0.4, tz + 0.53);
        for (const sx of [-1, 1]) for (const dz of [-0.26, 0.26]) {
          const cx = tx + sx * 0.72, cz = tz + dz;
          K.chair(cx, cz, sx < 0 ? PI / 2 : -PI / 2, { seat: velvetR, frame: teak, back: teak });
          K.slot(cx, cz, tx, cz, 'sit');
          plates.push([tx + sx * 0.24, 0.768, cz, 0, 1]); napk.push([tx + sx * 0.24, 0.8, cz, R() * 3, 1]);
          forks.push([tx + sx * 0.24, 0.764, cz - 0.15, 0, 1]); forks.push([tx + sx * 0.24, 0.764, cz + 0.15, 0, 1]);
          glasses.push([tx + sx * 0.1, 0.76, cz + 0.16, 0, 1]); glasses.push([tx + sx * 0.12, 0.76, cz - 0.02 + 0.2, 0, 0.8]);
        }
        // abajur de mesa com cúpula plissada
        K.cyl(0.07, 0.08, 0.02, brass, tx, 0.77, -11.86, { cast: false }, 12); K.cyl(0.012, 0.012, 0.3, brass, tx, 0.92, -11.86, { cast: false }, 6);
        const shade = K.cyl(0.07, 0.13, 0.15, K.glow(0xffb08a, 1.5), tx, 1.1, -11.86, { cast: false }, 10);
        const halo = K.halo(tx, 1.08, -11.82, 0.5, 0xffa070, 0.45);
        lampShades.push({ shade, halo });
        // centro: rosa num vaso de cristal, garrafa, cardápio
        K.cyl(0.025, 0.02, 0.15, K.glass, tx + 0.18, 0.84, -11.75, { cast: false }, 8); K.sphere(0.035, K.mat(ti % 2 ? 0xc8102a : 0xf6e8e8), tx + 0.18, 0.95, -11.75, { cast: false }, 8, 6); K.cyl(0.004, 0.004, 0.12, M.leaf, tx + 0.18, 0.88, -11.75, { cast: false }, 4);
        K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.015, 0.28], [0.015, 0.34], [0, 0.34]], K.mat(ti % 2 ? 0x1a3a1a : 0x5a1018, { roughness: 0.15, metalness: 0.2 }), tx - 0.18, 0.76, -11.72, { cast: false }, 8);
        K.box(0.1, 0.14, 0.004, K.mat(0xf3ead2), tx - 0.05, 0.83, -11.3, { cast: false, rx: -0.2 });
        if (ti % 2 === 0) { K.cyl(0.09, 0.07, 0.2, K.silver, tx - 0.62, 0.9, -11.9, {}, 12); K.cyl(0.015, 0.015, 0.8, K.silver, tx - 0.62, 0.4, -11.9, {}, 6); K.lathe([[0, 0], [0.035, 0], [0.037, 0.18], [0.012, 0.26], [0, 0.26]], K.mat(0x1a3a1a, { roughness: 0.15 }), tx - 0.62, 0.9, -11.9, { cast: false }, 8); K.cyl(0.013, 0.013, 0.03, gilt, tx - 0.62, 1.17, -11.9, { cast: false }, 6); }
      });
      K.inst(new T.CylinderGeometry(0.11, 0.08, 0.014, 16), K.mat(0xfbf8f0, { roughness: 0.3 }), plates, { cast: false });
      K.inst(new T.TorusGeometry(0.1, 0.006, 4, 18).rotateX(PI / 2), gilt, plates.map(p => [p[0], p[1] + 0.008, p[2], 0, 1]), { cast: false });
      K.inst(new T.ConeGeometry(0.035, 0.08, 4), K.mat(0xffffff, { roughness: 0.9 }), napk, { cast: false });
      K.inst(new T.BoxGeometry(0.012, 0.004, 0.16).rotateY(PI / 2).rotateY(PI / 2), K.silver, forks, { cast: false });
      K.inst(new T.LatheGeometry([[0, 0], [0.028, 0], [0.028, 0.004], [0.004, 0.01], [0.004, 0.08], [0.02, 0.09], [0.03, 0.12], [0.028, 0.16]].map(p => new T.Vector2(p[0], p[1])), 8), K.glass, glasses, { cast: false });
      // copa do chef: balcão inox, panelas de cobre, bolo sob redoma
      K.box(0.8, 0.92, 1.0, K.mat(0xb0b6bc, { metalness: 0.7, roughness: 0.3 }), 2.55, 0.46, -11.5); K.box(0.84, 0.04, 1.04, steel, 2.55, 0.94, -11.5);
      for (let k = 0; k < 3; k++) { K.cyl(0.11 - k * 0.015, 0.1 - k * 0.015, 0.14 - k * 0.02, K.metal(0xb86a3a, 0.35), 2.45 + (k % 2) * 0.2, 1.03, -11.8 + k * 0.3, {}, 14); }
      K.cyl(0.16, 0.16, 0.12, K.mat(0x5a2a1a), 2.6, 1.02, -11.15, {}, 16); K.sphere(0.2, K.glass, 2.6, 0.98, -11.15, { cast: false }, 14, 8).scale.y = 1.1;
      K.box(0.8, 0.5, 0.4, teakD, 2.55, 2.1, -11.9); for (let k = 0; k < 6; k++) K.cyl(0.04, 0.04, 0.08, K.mat(0xf6f3ec), 2.25 + k * 0.12, 1.92, -11.85, { cast: false }, 8);
      K.col(2.15, -12.0, 2.95, -10.98);
      K.plight(-1.8, 2.5, -10.6, 0xffc488, 1.8, 9);
      K.pool(-1.8, -10.9, 3.6, 0xffb070, 0.25, 0.03);
      K.slot(-3.8, -10.2, -2.8, -10.2, 'talk'); K.slot(0.2, -10.2, 1.2, -10.2, 'talk');
      // mesa 3: o abajur da missão
      const ab = lampShades[2], abM = ab.shade.material;
      K.tell('abajur', (live) => { ab.shade.material = K.glow(0x40ff7a, 2.4); ab.halo.material.color.set(new T.Color(0x40ff7a).multiplyScalar(0.9)); ab.halo.scale.set(1.4, 1.4, 1); if (live) K.anim(1.2, (e) => { ab.shade.visible = Math.sin(e * 40) > -0.3; }); else ab.shade.visible = true; },
        () => { ab.shade.material = abM; ab.shade.visible = true; ab.halo.material.color.set(new T.Color(0xffa070).multiplyScalar(0.45)); ab.halo.scale.set(1, 1, 1); });
    }

    // ===== tênder e locomotiva (direita)
    { // tênder
      K.box(3.0, 2.5, 2.55, navyD, 4.85, 1.0, -10.8); K.box(3.1, 0.08, 2.65, gilt, 4.85, 2.27, -10.8, { cast: false }); K.box(3.0, 0.06, 0.05, gilt, 4.85, 0.6, ZF + 0.05, { cast: false });
      const coal = []; for (let k = 0; k < 420; k++) coal.push([3.5 + R() * 2.7, 2.28 + R() * 0.3 + Math.sin((k % 37) / 37 * PI) * 0.15, -11.9 + R() * 2.2, R() * 3, 0.04 + R() * 0.045]);
      K.inst(new T.DodecahedronGeometry(1, 0), K.mat(0x141416, { roughness: 0.4, metalness: 0.2 }), coal, { cast: false });
      K.sign('EXPRESSO ORIENTE', 2.4, 0.3, 4.85, 1.35, ZF + 0.06, { color: '#e2b65a', size: 84, w: 1024, h: 128 });
      for (const x of [3.6, 6.1]) K.cyl(0.42, 0.42, 0.1, redW, x, -0.15, ZF - 0.05, { rx: PI / 2 }, 16);
      K.col(3.05, -12.0, 14.5, ZF + 0.1);
      // cabine do maquinista (aberta do lado da plataforma)
      K.box(2.1, 0.3, 2.6, navyD, 7.6, 0.15, -10.8);
      K.box(2.1, 1.1, 0.08, navyD, 7.6, 0.85, ZF); K.box(2.1, 0.05, 0.12, gilt, 7.6, 1.42, ZF, { cast: false });
      K.box(0.12, 3.3, 0.12, navyD, 6.6, 1.65, ZF); K.box(0.12, 3.3, 0.12, navyD, 8.6, 1.65, ZF);
      K.box(2.1, 3.3, 0.08, navyD, 7.6, 1.65, -12.05); K.box(0.08, 3.3, 2.6, navyD, 8.62, 1.65, -10.8);
      K.add(new T.CylinderGeometry(1.6, 1.6, 2.4, 16, 1, false, -PI / 2, PI).rotateX(PI / 2).rotateY(PI / 2).scale(1, 0.25, 1), K.mat(0x1a1a1e, { roughness: 0.6 }), 7.6, 3.3, -10.8);
      // fornalha acesa
      const fire = K.box(0.06, 0.4, 0.55, K.glow(0xff7020, 2.6), 8.56, 0.7, -10.8, { cast: false });
      K.box(0.04, 0.55, 0.7, brass, 8.57, 0.7, -10.8, { cast: false }).scale.set(1, 1, 1);
      for (let k = 0; k < 5; k++) { K.cyl(0.05, 0.05, 0.06, brass, 8.5, 1.6 + (k % 2) * 0.3, -11.6 + k * 0.32, { rz: PI / 2, cast: false }, 10); K.cyl(0.04, 0.04, 0.01, K.glow(0xf6f1e0, 1.1), 8.47, 1.6 + (k % 2) * 0.3, -11.6 + k * 0.32, { rz: PI / 2, cast: false }, 10); }
      const fireL = K.plight(8.0, 1.0, -10.2, 0xff7a2a, 1.4, 5);
      K.tick((dt, t) => { fireL.intensity = 1.2 + Math.sin(t * 13) * 0.25 + Math.sin(t * 31) * 0.15; fire.scale.y = 1 + Math.sin(t * 17) * 0.1; });
      // pá de carvão encostada
      strut([6.85, 0.3, -9.75], [7.05, 1.2, -9.85], 0.02, teak); K.box(0.2, 0.02, 0.25, iron, 6.83, 0.33, -9.72, { rz: 0.3, cast: false });
      // caldeira com cintas de latão
      const boilerM = K.mat(0x101418, { roughness: 0.25, metalness: 0.45 });
      K.cyl(0.95, 0.95, 6.0, boilerM, 11.65, 2.0, -10.8, { rz: PI / 2 }, 24);
      for (let x = 9.0; x <= 14.4; x += 1.1) K.torus(0.955, 0.035, brass, x, 2.0, -10.8, { ry: PI / 2, cast: false }, 6, 24);
      K.cyl(1.0, 1.0, 0.8, K.mat(0x0a0a0c, { roughness: 0.5 }), 15.05, 2.0, -10.8, { rz: PI / 2 }, 24);
      K.cyl(0.85, 0.85, 0.06, K.mat(0x16161a, { roughness: 0.4, metalness: 0.4 }), 15.48, 2.0, -10.8, { rz: PI / 2 }, 24); K.cyl(0.08, 0.08, 0.1, brass, 15.52, 2.0, -10.8, { rz: PI / 2 }, 10);
      K.box(0.2, 0.25, 1.9, redW, 15.55, 0.65, -10.8);
      K.lathe([[0, 0], [0.3, 0], [0.26, 0.4], [0.3, 0.7], [0.36, 0.78], [0.3, 0.8], [0, 0.8]], K.mat(0x0a0a0c, { roughness: 0.4 }), 14.15, 2.85, -10.8, {}, 16);
      K.torus(0.33, 0.04, brass, 14.15, 3.6, -10.8, { rx: PI / 2, cast: false });
      K.lathe([[0, 0], [0.42, 0], [0.4, 0.25], [0.3, 0.5], [0, 0.56]], K.metal(0xd4a34a, 0.25), 11.6, 2.85, -10.8, {}, 16);
      K.lathe([[0, 0], [0.32, 0], [0.3, 0.2], [0.2, 0.38], [0, 0.42]], boilerM, 10.2, 2.85, -10.8, {}, 14);
      K.cyl(0.04, 0.03, 0.35, brass, 9.0, 3.0, -10.8, { cast: false }, 8); K.cone(0.06, 0.12, brass, 9.0, 3.24, -10.8, { cast: false }, 8);
      // plataforma lateral, corrimão e faróis
      K.box(6.6, 0.06, 0.45, K.mat(0x16161a), 11.8, 1.02, -9.7); K.box(6.6, 0.12, 0.04, redW, 11.8, 0.96, -9.47, { cast: false });
      K.cyl(0.014, 0.014, 5.8, brass, 11.8, 2.25, -9.82, { rz: PI / 2, cast: false }, 6);
      for (const [y, z] of [[0.95, -10.2], [0.95, -11.4], [3.0, -10.8]]) { K.cyl(0.13, 0.15, 0.25, K.mat(0x16161a), 15.62, y, z, { rz: PI / 2 }, 12); K.cyl(0.1, 0.1, 0.02, K.glow(0xfff0c8, 3.0), 15.76, y, z, { rz: PI / 2, cast: false }, 12); K.halo(15.85, y, z, 0.55, 0xffe0a0, 0.6); }
      // bandeirolas brancas na frente (tremulam)
      const flags = []; for (const z of [-10.05, -11.55]) { K.cyl(0.012, 0.012, 0.6, iron, 15.5, 1.3, z, { cast: false }, 4); const f = K.add(new T.PlaneGeometry(0.3, 0.2).translate(-0.15, 0, 0), K.mat(0xf6f3ec, { side: T.DoubleSide }), 15.5, 1.5, z, { cast: false }); flags.push(f); }
      K.tick((dt, t) => flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 6 + i) * 0.4; }));
      // rodas motrizes vermelhas, bielas e cilindro
      const wheels = [];
      for (const x of [9.6, 11.4, 13.2]) { const wg = K.group(x, -0.15, ZF - 0.08); K.torus(0.85, 0.07, redW, 0, 0, 0, { parent: wg }, 6, 28); K.cyl(0.12, 0.12, 0.12, redW, 0, 0, 0, { parent: wg, rx: PI / 2 }, 10); for (let k = 0; k < 12; k++) K.box(0.04, 0.8, 0.03, redW, 0, 0, 0, { parent: wg, rz: k * PI / 6 }).geometry.translate(0, 0.4, 0); K.box(0.2, 0.42, 0.05, redW, 0, -0.45, -0.02, { parent: wg }); wheels.push(wg); }
      const rod = K.box(3.8, 0.08, 0.05, steel, 11.4, 0.2, ZF + 0.02, { cast: false });
      K.cyl(0.3, 0.3, 0.9, K.mat(0x16161a, { roughness: 0.4 }), 14.6, 0.25, ZF - 0.05, { rz: PI / 2 }, 14); K.cyl(0.04, 0.04, 1.4, steel, 13.8, 0.25, ZF + 0.02, { rz: PI / 2, cast: false }, 6);
      K.tick((dt, t) => { const a = Math.sin(t * 0.6) * 0.03; wheels.forEach(w => w.rotation.z = a); rod.position.y = 0.2 + Math.sin(a) * 0.4; });
      K.sign('230-G', 0.7, 0.24, 8.0, 2.5, ZF + 0.06, { color: '#e2b65a', size: 84, bg: '#152447' });
      // válvula de vapor (missão): volante vermelho na lateral
      const vg = K.group(10.2, 1.25, ZF + 0.12);
      K.cyl(0.04, 0.04, 0.3, brass, 0, -0.25, -0.05, { parent: vg }, 6); K.cyl(0.06, 0.06, 0.18, brass, 0, 0, -0.06, { parent: vg, rx: PI / 2 }, 8);
      const vw = K.group(0, 0, 0.06, 0, vg); K.torus(0.17, 0.025, K.mat(0xd02020, { roughness: 0.4 }), 0, 0, 0, { parent: vw }, 6, 16); for (let k = 0; k < 3; k++) K.box(0.025, 0.32, 0.02, K.mat(0xd02020), 0, 0, 0, { parent: vw, rz: k * PI / 3 });
      K.cyl(0.035, 0.035, 0.6, brass, 10.5, 1.05, ZF + 0.08, { rz: PI / 2, cast: false }, 6); K.cyl(0.05, 0.03, 0.12, brass, 10.75, 1.05, ZF + 0.12, { rx: PI / 2, cast: false }, 6);
      const tag = K.box(0.12, 0.18, 0.01, K.mat(0xf6f3ec), 10.2, 0.98, ZF + 0.2, { cast: false });
      K.tell('vapor', (live) => {
        cock1.on = cock2.on = valveJet.on = false; chimney.col = 0x1a1a1c; chimney.op = 0.85; chimney.rate = 8; chimney.s1 = 4.2; tag.material = K.glow(0xff2a2a, 2);
        if (live) K.anim(1.2, (e) => { vw.rotation.z = -e * PI * 3; }); else vw.rotation.z = -PI * 3;
      }, () => { cock1.on = cock2.on = valveJet.on = true; chimney.col = 0xb8bcc4; chimney.op = 0.55; chimney.rate = 5; chimney.s1 = 3.2; vw.rotation.z = 0; tag.material = K.mat(0xf6f3ec); });
      // vagão-dormitório parado no trilho de trás (só o teto aparece)
      K.box(20, 3.0, 2.6, K.mat(0x1a2a4a, { roughness: 0.4 }), -4, 0.4, -14.6, { cast: false }); K.box(20, 0.25, 2.4, roofM, -4, 2.0, -14.6, { cast: false });
    }

    // ------------------------------------------------------------ relógio pendurado na viga (sobre o tênder) com manivela na coluna
    const clockHands = [];
    { const cx = 4.8, cy = 4.15, cz = -9.15;
      const face = K.canvasTex(256, 256, (g, w, h) => {
        g.fillStyle = '#f4ecd6'; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = '#1a1a1a'; g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 116, 0, 7); g.stroke();
        g.fillStyle = '#1a1a1a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 30px Georgia, serif';
        const rn = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
        for (let k = 0; k < 12; k++) { const a = k / 12 * PI * 2; g.save(); g.translate(128 + Math.sin(a) * 92, 128 - Math.cos(a) * 92); g.rotate(a); g.fillText(rn[k], 0, 0); g.restore(); }
        for (let k = 0; k < 60; k++) { const a = k / 60 * PI * 2; g.fillRect(128 + Math.sin(a) * 110 - 1, 128 - Math.cos(a) * 110 - 1, 3, 3); }
        g.font = '600 13px Georgia, serif'; g.fillText('GARE DO ORIENTE', 128, 170);
      });
      const fm = new T.MeshStandardMaterial({ map: face, emissiveMap: face, emissive: 0xffffff, emissiveIntensity: 0.7, roughness: 0.5 });
      K.cyl(0.66, 0.66, 0.32, ironG, cx, cy, cz, { rx: PI / 2 }, 28);
      for (const s of [1, -1]) {
        K.add(new T.CircleGeometry(0.6, 28), fm, cx, cy, cz + s * 0.165, { cast: false, ry: s > 0 ? 0 : PI });
        K.torus(0.63, 0.04, gilt, cx, cy, cz + s * 0.17, { cast: false }, 6, 28);
        const hh = K.box(0.05, 0.3, 0.012, black, cx, cy, cz + s * 0.18, { cast: false }); hh.geometry.translate(0, 0.13, 0);
        const mh = K.box(0.035, 0.48, 0.012, black, cx, cy, cz + s * 0.19, { cast: false }); mh.geometry.translate(0, 0.21, 0);
        const sh = K.box(0.012, 0.5, 0.008, K.mat(0xc8102a), cx, cy, cz + s * 0.2, { cast: false }); sh.geometry.translate(0, 0.18, 0);
        clockHands.push({ hh, mh, sh, s });
      }
      for (const s of [-0.35, 0.35]) K.cyl(0.015, 0.015, 8.0 - cy - 0.5, iron, cx + s, (8.0 + cy + 0.5) / 2, cz, { cast: false }, 4);
      K.sphere(0.09, gilt, cx, cy + 0.72, cz, { cast: false }, 10, 8); K.cone(0.1, 0.18, gilt, cx, cy - 0.78, cz, { rx: PI, cast: false }, 8);
      const redLamp = K.sphere(0.07, K.mat(0x3a1010), cx, cy + 0.84, cz, { cast: false }, 8, 6);
      const redHalo = K.halo(cx, cy + 0.84, cz + 0.05, 0.5, 0xff2020, 0.0); redHalo.visible = false;
      // caixa da manivela na coluna
      K.box(0.26, 0.38, 0.14, ironG, cx, 1.2, cz + 0.17); const crank = K.group(cx, 1.22, cz + 0.27); K.box(0.03, 0.2, 0.03, brass, 0, 0.08, 0, { parent: crank }); K.cyl(0.02, 0.02, 0.08, K.mat(0x3a2414), 0, 0.18, 0.04, { parent: crank, rx: PI / 2 }, 6);
      let off = 0; const base = 21 * 60 + 32;
      const setClock = (sec) => { const mins = base + off; clockHands.forEach(c => { c.hh.rotation.z = -c.s * ((mins / 60) % 12) / 12 * PI * 2; c.mh.rotation.z = -c.s * (mins % 60) / 60 * PI * 2; if (sec != null) c.sh.rotation.z = -c.s * sec / 60 * PI * 2; }); };
      setClock(0);
      K.tick((dt, t) => { setClock(Math.floor(t) % 60); });
      K.tell('relogio', (live) => { redLamp.material = K.glow(0xff2a2a, 3); redHalo.visible = true; redHalo.material.color.set(new T.Color(0xff2020).multiplyScalar(0.9)); if (live) K.anim(1.6, (e) => { off = 45 * e; crank.rotation.z = e * PI * 8; }); else off = 45; },
        () => { off = 0; redLamp.material = K.mat(0x3a1010); redHalo.visible = false; crank.rotation.z = 0; });
    }

    // ------------------------------------------------------------ sinal ferroviário (semáforo) na ponta da plataforma
    { const sx = 14.0, sz = -7.5;
      K.box(0.4, 0.3, 0.4, stoneM, sx, 0.15, sz); K.cyl(0.07, 0.09, 3.2, K.mat(0xd8d2c4, { roughness: 0.6 }), sx, 1.75, sz, {}, 8); K.sphere(0.1, black, sx, 3.4, sz, {}, 8, 6);
      for (let y = 0.5; y < 3.0; y += 0.3) K.box(0.3, 0.025, 0.025, iron, sx + 0.12, y, sz, { cast: false });
      const arm = K.group(sx, 3.0, sz + 0.1); const armBlade = K.box(1.0, 0.18, 0.04, K.mat(0xc8102a, { roughness: 0.4 }), -0.5, 0, 0, { parent: arm }); K.box(0.12, 0.17, 0.045, M.white, -0.8, 0, 0, { parent: arm, cast: false });
      K.box(0.2, 0.4, 0.15, black, sx, 2.6, sz + 0.12); const lamp = K.sphere(0.075, K.glow(0xff2a20, 3.2), sx, 2.6, sz + 0.22, { cast: false }, 10, 8);
      const lh = K.halo(sx, 2.6, sz + 0.3, 0.6, 0xff2a20, 0.9);
      K.colR(sx, sz, 0.25);
      K.tick((dt, t) => { lh.scale.setScalar(1.2 + Math.sin(t * 2.2) * 0.08); });
      K.tell('sinal', (live) => { lamp.material = K.glow(0x30ff70, 3.2); lh.material.color.set(new T.Color(0x30ff70).multiplyScalar(0.9)); if (live) K.anim(1.0, (e) => { arm.rotation.z = -0.8 * e; }); else arm.rotation.z = -0.8; },
        () => { lamp.material = K.glow(0xff2a20, 3.2); lh.material.color.set(new T.Color(0xff2a20).multiplyScalar(0.9)); arm.rotation.z = 0; });
      K.slot(12.6, -6.4, 14.5, -9.0, 'selfie');
    }

    // ------------------------------------------------------------ carrinhos de bagagem com malas e baús
    const cart = (x, z, ry) => {
      const g = K.group(x, 0, z, ry);
      K.box(1.8, 0.06, 0.9, teak, 0, 0.36, 0, { parent: g }); for (let k = 0; k < 5; k++) K.box(1.8, 0.012, 0.12, teakD, 0, 0.395, -0.36 + k * 0.18, { parent: g, cast: false });
      K.box(1.82, 0.06, 0.06, iron, 0, 0.32, 0.45, { parent: g }); K.box(1.82, 0.06, 0.06, iron, 0, 0.32, -0.45, { parent: g });
      for (const [a, b] of [[-0.7, 0.42], [0.7, 0.42], [-0.7, -0.42], [0.7, -0.42]]) { K.cyl(0.16, 0.16, 0.06, iron, a, 0.17, b, { parent: g, rx: PI / 2 }, 14); K.cyl(0.05, 0.05, 0.07, brass, a, 0.17, b, { parent: g, rx: PI / 2 }, 8); }
      K.box(0.04, 0.9, 0.04, iron, 0.9, 0.8, 0.42, { parent: g }); K.box(0.04, 0.9, 0.04, iron, 0.9, 0.8, -0.42, { parent: g }); K.cyl(0.025, 0.025, 0.9, K.mat(0x3a2414), 0.9, 1.25, 0, { parent: g, rx: PI / 2 }, 6);
      return g;
    };
    const suitcase = (g, x, y, z, w, h, d, c, o = {}) => {
      const m = K.mat(c, { roughness: 0.55 }); const s = K.add(K.rbox(w, h, d, 0.03), m, x, y + h / 2, z, { parent: g, ry: o.ry || 0 });
      K.box(w + 0.01, 0.025, 0.04, K.mat(0x3a2414), 0, 0, d * 0.3, { parent: s, cast: false }); K.box(w + 0.01, 0.025, 0.04, K.mat(0x3a2414), 0, 0, -d * 0.3, { parent: s, cast: false });
      K.box(0.12, 0.03, 0.03, brass, 0, h / 2 + 0.01, 0, { parent: s, cast: false });
      if (o.sticker) K.cyl(0.05, 0.05, 0.005, K.mat(o.sticker), w * 0.2, 0, d / 2 + 0.003, { parent: s, rx: PI / 2, cast: false }, 12);
      return s;
    };
    const stickerTex = K.canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#5a3a1e'; g.fillRect(0, 0, w, h); for (let k = 0; k < 6; k++) { g.fillStyle = '#3a2412'; g.fillRect(0, k * 46 + 10, w, 12); }
      const st = [['PARIS', '#c8322f'], ['VENEZA', '#1f6a8a'], ['ISTAMBUL', '#d9a441'], ['SIMPLON', '#2c6e49'], ['ATENAS', '#f2efe8'], ['VIENA', '#8a2a6a']];
      st.forEach(([t, c], k) => { const x = 60 + (k % 3) * 160, y = 70 + Math.floor(k / 3) * 110; g.save(); g.translate(x, y); g.rotate((R() - 0.5) * 0.5); g.fillStyle = c; if (k % 2) { g.beginPath(); g.arc(0, 0, 44, 0, 7); g.fill(); } else g.fillRect(-60, -30, 120, 60); g.fillStyle = c === '#f2efe8' ? '#1a1a1a' : '#fff'; g.font = '700 22px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 0); g.restore(); });
      for (let x = 0; x < w; x += 64) { g.fillStyle = '#c9a050'; g.fillRect(x, 0, 6, h); }
    });
    // carrinho A (missão: trocar a mala)
    let topCase = null;
    { const g = cart(-3.4, -7.6, 0);
      suitcase(g, -0.45, 0.4, 0, 0.75, 0.24, 0.5, 0x6a3a1e, { sticker: 0xc8322f }); suitcase(g, 0.4, 0.4, 0.05, 0.7, 0.28, 0.48, 0x2a2a30, { sticker: 0xd9a441 });
      suitcase(g, -0.4, 0.64, 0.02, 0.62, 0.22, 0.45, 0x8a6a3a, { ry: 0.1 }); suitcase(g, 0.35, 0.68, -0.02, 0.55, 0.2, 0.42, 0x5a1a22, { ry: -0.08 });
      K.cyl(0.2, 0.2, 0.26, K.mat(0xd8c4a0, { roughness: 0.7 }), 0.35, 1.01, 0.05, { parent: g }, 16); K.cyl(0.205, 0.205, 0.04, K.mat(0x5a1a22), 0.35, 1.12, 0.05, { parent: g, cast: false }, 16);
      topCase = suitcase(g, -0.38, 0.86, 0.0, 0.58, 0.2, 0.4, 0x9a5a2a, { ry: 0.05 });
      K.col(-4.35, -8.1, -2.45, -7.1);
      const orig = topCase.material, yel = K.mat(0xffcc1a, { roughness: 0.4, emissive: 0x6a5000, emissiveIntensity: 0.5 });
      K.tell('mala', (live) => { topCase.material = yel; if (live) K.anim(1.0, (e) => { topCase.position.y = 0.96 + Math.sin(e * PI) * 0.35; topCase.rotation.y = 0.05 + e * 0.9; }); else topCase.rotation.y = 0.95; topCase.position.y = 0.96; },
        () => { topCase.material = orig; topCase.rotation.y = 0.05; topCase.position.y = 0.96; });
    }
    // carrinho B (missão: etiqueta do baú)
    { const g = cart(7.6, -6.9, 0);
      const trunkM = K.texMat(stickerTex, { roughness: 0.6 });
      const tb = K.box(1.05, 0.55, 0.62, trunkM, -0.2, 0.67, 0, { parent: g });
      for (const s of [-1, 1]) { K.box(0.04, 0.56, 0.64, brass, -0.2 + s * 0.5, 0.67, 0, { parent: g, cast: false }); }
      const lid = K.group(-0.2, 0.95, -0.31, 0, g); K.box(1.05, 0.12, 0.62, trunkM, 0, 0.06, 0.31, { parent: lid }); K.box(1.07, 0.03, 0.64, brass, 0, 0.0, 0.31, { parent: lid, cast: false });
      const lining = K.box(0.98, 0.01, 0.56, K.mat(0xc8102a, { roughness: 0.9 }), -0.2, 0.94, 0, { parent: g, cast: false });
      const tagG = K.group(0.1, 0.9, 0.32, 0, g); K.cyl(0.004, 0.004, 0.12, K.mat(0x8a6a3a), 0, -0.06, 0, { parent: tagG, cast: false }, 4);
      const tagM = K.box(0.16, 0.1, 0.008, K.mat(0xf3ead2), 0.03, -0.16, 0.01, { parent: tagG, cast: false });
      suitcase(g, 0.55, 0.4, 0.05, 0.5, 0.3, 0.5, 0x2a3a5a, {}); K.box(0.45, 0.35, 0.4, K.mat(0x3a2412, { roughness: 0.6 }), 0.55, 0.88, 0.05, { parent: g });
      K.col(6.65, -7.4, 8.55, -6.4);
      const tagOrig = tagM.material;
      K.tell('bau', (live) => { tagM.material = K.glow(0xff2a2a, 2.2); tagM.scale.set(2.2, 2.2, 1); if (live) K.anim(1.2, (e) => { lid.rotation.x = -1.9 * e; tagG.rotation.z = Math.sin(e * 20) * 0.5 * (1 - e); }); else lid.rotation.x = -1.9; },
        () => { tagM.material = tagOrig; tagM.scale.set(1, 1, 1); lid.rotation.x = 0; tagG.rotation.z = 0; });
      lining.visible = true;
    }
    // pilha de baús perto do salão
    { const g = K.group(-12.4, 0, -8.4, 0.2);
      K.box(1.0, 0.55, 0.6, K.texMat(stickerTex), 0, 0.28, 0, { parent: g }); K.box(0.8, 0.45, 0.5, K.mat(0x1f3a5a, { roughness: 0.5 }), 0.05, 0.78, 0.0, { parent: g }); K.cyl(0.2, 0.2, 0.3, K.mat(0xe8dcc0), 0.1, 1.16, 0, { parent: g }, 14);
      K.box(1.04, 0.04, 0.64, brass, 0, 0.56, 0, { parent: g, cast: false }); K.col(-13.0, -8.85, -11.8, -7.95);
    }

    // ------------------------------------------------------------ painel de partidas de palhetas
    { const bx = 9.7, bz = -4.4;
      const rowStr = (h, d, v, p) => (h + ' ' + d.padEnd(10) + ' ' + v.padEnd(9) + ' ' + p).slice(0, 28);
      const drawRow = (g, y0, hgt, str, fg, bg) => { g.font = '700 40px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; const cw = 35; for (let i = 0; i < str.length; i++) { const x = 14 + i * cw; g.fillStyle = bg; g.fillRect(x, y0 + 6, cw - 4, hgt - 12); g.fillStyle = fg; g.fillText(str[i], x + (cw - 4) / 2, y0 + hgt / 2 + 2); g.fillStyle = 'rgba(0,0,0,.65)'; g.fillRect(x, y0 + hgt / 2 - 1, cw - 4, 2); } };
      const rows = [['21:55', 'VENEZA', 'MILÃO', '3'], ['22:10', 'PARIS', 'DIJON', '2'], ['22:30', 'BUCARESTE', 'VIENA', '4'], ['23:05', 'ATENAS', 'BELGRADO', '5']];
      const tex = K.canvasTex(1024, 512, (g, w, h) => {
        g.fillStyle = '#0c0c10'; g.fillRect(0, 0, w, h); g.fillStyle = '#152447'; g.fillRect(0, 0, w, 100);
        g.fillStyle = '#e2b65a'; g.font = '700 54px Georgia, serif'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('PARTIDAS', 24, 52);
        g.font = '600 24px Georgia, serif'; g.fillText('HORA   DESTINO       VIA     PLAT.', 420, 54);
        rows.forEach((r, k) => drawRow(g, 120 + (k + 1) * 78, 78, rowStr(...r), '#f2e6c0', '#1c1c22'));
      });
      const rowA = K.canvasTex(1024, 78, (g) => { g.fillStyle = '#0c0c10'; g.fillRect(0, 0, 1024, 78); drawRow(g, 0, 78, rowStr('21:40', 'ISTAMBUL', 'SIMPLON', '1'), '#ffd23f', '#1c1c22'); });
      const rowB = K.canvasTex(1024, 78, (g) => { g.fillStyle = '#0c0c10'; g.fillRect(0, 0, 1024, 78); drawRow(g, 0, 78, rowStr('21:40', 'BAGDÁ', 'ALEPO', '1'), '#ffffff', '#c8102a'); });
      const g = K.group(bx, 0, bz, -0.2);
      for (const s of [-1.45, 1.45]) { K.cyl(0.07, 0.09, 3.3, ironG, s, 1.65, 0, { parent: g }, 8); K.box(0.26, 0.2, 0.26, ironG, s, 0.1, 0, { parent: g }); }
      K.box(3.2, 1.7, 0.2, K.mat(0x16161a, { roughness: 0.4 }), 0, 2.45, 0, { parent: g }); K.box(3.26, 0.06, 0.24, gilt, 0, 3.32, 0, { parent: g, cast: false }); K.box(3.26, 0.06, 0.24, gilt, 0, 1.58, 0, { parent: g, cast: false });
      K.add(new T.PlaneGeometry(3.0, 1.5), new T.MeshBasicMaterial({ map: tex, color: new T.Color(0xffffff).multiplyScalar(1.05) }), 0, 2.45, 0.105, { parent: g, cast: false });
      const rowM = new T.MeshBasicMaterial({ map: rowA, color: new T.Color(0xffffff).multiplyScalar(1.15), toneMapped: false });
      const row = K.add(new T.PlaneGeometry(3.0, 1.5 * 78 / 512), rowM, 0, 2.45 + 0.75 - (120 + 39) / 512 * 1.5, 0.11, { parent: g, cast: false });
      K.box(0.5, 0.5, 0.25, K.mat(0x152447), 0, 3.6, 0, { parent: g }); K.sign('1', 0.3, 0.3, 0, 3.6, 0.13, { parent: g, color: '#e2b65a', size: 100, w: 128, h: 128 });
      K.halo(bx, 2.5, bz + 0.6, 1.4, 0xffe0a0, 0.18);
      const cosR = Math.cos(-0.2), sinR = Math.sin(-0.2); for (const s of [-1.45, 1.45]) K.colR(bx + s * cosR, bz - s * sinR, 0.12);
      // palhetas que giram sozinhas de vez em quando
      K.tell('painel', (live) => { if (live) K.anim(1.0, (e, u) => { row.scale.y = Math.abs(Math.cos(u * PI * 3)); if (u > 0.5) rowM.map = rowB; }); else rowM.map = rowB; },
        () => { rowM.map = rowA; row.scale.y = 1; });
      [[8.8, -2.6], [10.6, -2.6]].forEach(([x, z]) => K.slot(x, z, bx, bz, 'view'));
    }

    // ------------------------------------------------------------ bilheteria (cabine de madeira com guichês)
    { const g = K.group(13.45, 0, -0.8);
      K.box(1.9, 2.4, 3.4, teak, 0, 1.2, 0, { parent: g }); K.box(2.1, 0.18, 3.6, teakD, 0, 2.5, 0, { parent: g }); K.box(1.7, 0.4, 3.2, K.mat(0x152447), 0, 2.78, 0, { parent: g });
      K.sign('BILHETES', 2.8, 0.32, -0.86, 2.78, 0, { parent: g, ry: -PI / 2, color: '#e2b65a', size: 84, w: 1024, h: 117 });
      K.sign('BILHETES', 1.5, 0.3, 0, 2.78, 1.62, { parent: g, color: '#e2b65a', size: 84, w: 640, h: 128 });
      for (const z of [-0.9, 0.0, 0.9]) {
        K.box(0.04, 0.8, 0.7, K.glow(0xffd9a0, 0.9), -0.96, 1.5, z, { parent: g, cast: false });
        for (let k = 0; k < 7; k++) K.box(0.02, 0.8, 0.015, brass, -0.99, 1.5, z - 0.3 + k * 0.1, { parent: g, cast: false });
        K.box(0.3, 0.05, 0.75, K.mat(0x3a2414), -1.1, 1.05, z, { parent: g });
        K.cyl(0.04, 0.04, 0.008, brass, -1.1, 1.09, z + 0.2, { parent: g, cast: false }, 10);
      }
      K.box(0.05, 0.6, 1.0, M.white, -0.97, 0.45, 0, { parent: g, cast: false });
      const tt = K.canvasTex(256, 192, (gg, w, h) => { gg.fillStyle = '#f3ead2'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#152447'; gg.font = '700 22px Georgia'; gg.textAlign = 'center'; gg.fillText('HORÁRIOS', w / 2, 26); gg.font = '13px Georgia'; for (let k = 0; k < 9; k++) { gg.fillText(['PARIS', 'LAUSANNE', 'MILÃO', 'VENEZA', 'TRIESTE', 'ZAGREB', 'BELGRADO', 'SÓFIA', 'ISTAMBUL'][k] + ' ....... ' + (19 + k) % 24 + ':' + (k * 7 % 6) + '5', w / 2, 52 + k * 15); } });
      K.add(new T.PlaneGeometry(0.8, 0.6), K.texMat(tt), -0.96, 1.5, -1.6, { parent: g, ry: -PI / 2, cast: false });
      K.plight(12.0, 2.0, -0.8, 0xffcf96, 0.9, 5);
      K.col(12.45, -2.55, 14.5, 0.95);
      [[11.7, -1.7], [11.7, -0.8], [11.7, 0.1], [10.9, -0.8]].forEach(([x, z]) => K.slot(x, z, 13, z, 'talk'));
    }

    // ------------------------------------------------------------ quiosque de flores
    { const fx = 11.6, fz = 4.2;
      K.cyl(0.9, 0.95, 0.9, K.mat(0x2c5a46, { roughness: 0.5 }), fx, 0.45, fz, {}, 16); K.cyl(0.98, 0.98, 0.06, teak, fx, 0.93, fz, {}, 16);
      K.cyl(0.05, 0.05, 1.7, ironG, fx, 1.8, fz, {}, 8);
      const aw = K.canvasTex(256, 64, (g, w, h) => { for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#f2efe8' : '#2c6e49'; g.fillRect(k * 16, 0, 16, h); } });
      K.add(new T.ConeGeometry(1.5, 0.7, 16, 1, true), K.texMat(aw, { side: T.DoubleSide }), fx, 2.85, fz); K.sphere(0.08, gilt, fx, 3.25, fz);
      for (let k = 0; k < 16; k++) { const a = k / 16 * PI * 2; K.add(new T.ConeGeometry(0.09, 0.14, 4), K.mat(k % 2 ? 0xf2efe8 : 0x2c6e49), fx + Math.cos(a) * 1.45, 2.42, fz + Math.sin(a) * 1.45, { rx: PI, cast: false }); }
      const fl = [], buckets = [];
      for (let k = 0; k < 9; k++) { const a = k / 9 * PI * 2; const bx = fx + Math.cos(a) * 0.72, bz = fz + Math.sin(a) * 0.72; buckets.push([bx, 0.96, bz, 0, 1]); const c = [0xc8102a, 0xffffff, 0xf2c14e, 0xe86aa0, 0x8a3aa0][k % 5]; for (let j = 0; j < 7; j++) fl.push([bx + (R() - 0.5) * 0.18, 1.18 + R() * 0.15, bz + (R() - 0.5) * 0.18, 0, 0.6 + R() * 0.4, c]); }
      K.inst(new T.CylinderGeometry(0.1, 0.08, 0.2, 10).translate(0, 0.1, 0), K.metal(0x8a8a90, 0.4), buckets);
      [0xc8102a, 0xffffff, 0xf2c14e, 0xe86aa0, 0x8a3aa0].forEach(c => K.inst(new T.SphereGeometry(0.045, 6, 4), K.mat(c, { roughness: 0.7 }), fl.filter(p => p[5] === c).map(p => p.slice(0, 5)), { cast: false }));
      for (let k = 0; k < 12; k++) K.add(new T.PlaneGeometry(0.06, 0.2), K.mat(0x3f7a3a, { side: T.DoubleSide }), fx + Math.cos(k) * 0.7, 1.15, fz + Math.sin(k) * 0.7, { ry: k, rx: 0.4, cast: false });
      K.plight(fx, 2.2, fz + 0.6, 0xffd9a0, 0.8, 4.5);
      K.colR(fx, fz, 1.0);
      K.ringSlots(fx, fz, 4, 1.7, 'talk', 0, 2.2);
    }

    // ------------------------------------------------------------ banca de jornais (missão: bilhete no jornal)
    let headline = null, risePaper = null, standLampM = null;
    { const nx = -13.1, nz = -3.0;
      const g = K.group(nx, 0, nz);
      K.box(1.3, 1.0, 2.4, K.mat(0x2c5a46, { roughness: 0.5 }), 0, 0.5, 0, { parent: g }); K.box(1.4, 0.05, 2.5, teak, 0, 1.02, 0, { parent: g });
      K.box(0.12, 2.5, 2.4, K.mat(0x2c5a46), -0.62, 1.25, 0, { parent: g }); K.box(1.6, 0.12, 2.7, K.mat(0x1a3a2e), 0, 2.55, 0, { parent: g });
      K.sign('JORNAIS · REVISTAS', 2.4, 0.26, 0.82, 2.55, 0, { parent: g, ry: PI / 2, color: '#f2e6c0', size: 64, bg: '#1a3a2e', w: 1024, h: 112 });
      const mags = K.canvasTex(512, 256, (gg, w, h) => { const cs = ['#c8322f', '#f2c14e', '#1f6a8a', '#e86aa0', '#2c6e49', '#f2efe8', '#8a2a6a', '#d98a2a']; const tl = ['VOGUE', 'LIFE', 'L\'ILLUS.', 'PARIS', 'VIAGEM', 'CINE', 'MODA', 'ESPORTE']; for (let j = 0; j < 3; j++) for (let i = 0; i < 6; i++) { const x = 6 + i * 84, y = 6 + j * 84, c = cs[(i + j * 3) % 8]; gg.fillStyle = c; gg.fillRect(x, y, 76, 76); gg.fillStyle = c === '#f2efe8' ? '#1a1a1a' : '#fff'; gg.font = '700 13px Georgia'; gg.textAlign = 'center'; gg.fillText(tl[(i * 2 + j) % 8], x + 38, y + 16); gg.fillStyle = 'rgba(0,0,0,.25)'; gg.beginPath(); gg.ellipse(x + 38, y + 52, 18, 22, 0, 0, 7); gg.fill(); } });
      K.add(new T.PlaneGeometry(2.3, 1.15), K.texMat(mags, { emissiveMap: mags, emissive: 0xffffff, emissiveIntensity: 0.12 }), -0.54, 1.75, 0, { parent: g, ry: PI / 2, cast: false });
      for (let k = 0; k < 6; k++) { K.box(0.4, 0.04 + R() * 0.04, 0.3, K.mat(0xeee6d0, { roughness: 0.9 }), 0.25, 1.06 + k * 0.0, -0.9 + k * 0.36, { parent: g, ry: (R() - 0.5) * 0.3 }); }
      risePaper = K.box(0.36, 0.5, 0.01, K.mat(0xeee6d0), 0.25, 1.1, 0.5, { parent: g, cast: false, ry: PI / 2 });
      const lampG = K.group(0.6, 2.35, 0, 0, g); K.cone(0.15, 0.12, K.mat(0x2c5a46), 0, 0, 0, { parent: lampG }, 10); standLampM = K.sphere(0.06, K.glow(0xffd9a0, 2.4), 0, -0.07, 0, { parent: lampG, cast: false }, 8, 6);
      K.plight(nx + 1.0, 2.2, nz, 0xffd9a0, 0.9, 5);
      K.col(nx - 0.7, nz - 1.25, nx + 0.7, nz + 1.25);
      // cavalete com a manchete
      const hl = (txt, bg, fg) => K.canvasTex(256, 320, (gg, w, h) => { gg.fillStyle = bg; gg.fillRect(0, 0, w, h); gg.fillStyle = fg; gg.textAlign = 'center'; gg.font = '700 40px Georgia'; gg.fillText(txt[0], w / 2, 70); gg.font = '700 30px Georgia'; gg.fillText(txt[1], w / 2, 130); gg.fillText(txt[2], w / 2, 175); gg.font = '16px Georgia'; for (let k = 0; k < 6; k++) gg.fillRect(30, 210 + k * 16, w - 60, 4); });
      const tA = hl(['LE MATIN', 'MISTÉRIO', 'NO SIMPLON'], '#f3ead2', '#1a1a1a'), tB = hl(['EXTRA!', 'ASSASSINATO', 'A BORDO?'], '#c8102a', '#ffffff');
      const sb = K.group(-11.7, 0, -4.6, 0.7);
      for (const s of [-1, 1]) { const p = K.group(0, 0, s * 0.18, 0, sb); p.rotation.x = s * 0.2; K.box(0.62, 1.0, 0.03, teak, 0, 0.52, 0, { parent: p }); }
      headline = K.add(new T.PlaneGeometry(0.52, 0.66), K.texMat(tA, { emissiveMap: tA, emissive: 0xffffff, emissiveIntensity: 0.2 }), 0, 0.55, 0.3, { parent: sb, cast: false, rx: 0.2 });
      K.colR(-11.7, -4.6, 0.3);
      const hm = headline.material;
      K.tell('jornal', (live) => { headline.material = K.texMat(tB, { emissiveMap: tB, emissive: 0xffffff, emissiveIntensity: 0.45 }); standLampM.material = K.glow(0xff3030, 2.6); if (live) K.anim(1.0, (e) => { risePaper.position.y = 1.1 + e * 0.5; risePaper.rotation.z = Math.sin(e * 12) * 0.2; }); else risePaper.position.y = 1.6; },
        () => { headline.material = hm; standLampM.material = K.glow(0xffd9a0, 2.4); risePaper.position.y = 1.1; risePaper.rotation.z = 0; });
      [[-11.3, -1.8], [-11.2, -4.0]].forEach(([x, z]) => K.slot(x, z, -12.6, nz, 'view'));
    }

    // ------------------------------------------------------------ coluna de cartazes, balança, máquina de chocolates, bebedouro
    { const mx = -5.0, mz = -1.6;
      const posters = K.canvasTex(1024, 512, (g, w, h) => {
        const P = [['VENEZA', '#1f6a8a', '#f2c14e'], ['ISTAMBUL', '#c8322f', '#f2efe8'], ['CÔTE D\'AZUR', '#2a6ab0', '#ffe08a'], ['ALPES', '#2c6e49', '#f2efe8'], ['ATENAS', '#d98a2a', '#1a1a1a']];
        P.forEach(([t, c1, c2], k) => { const x = k * w / 5; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, c1); gr.addColorStop(1, '#0a0a14'); g.fillStyle = gr; g.fillRect(x + 6, 0, w / 5 - 12, h);
          g.fillStyle = c2; g.beginPath(); g.arc(x + w / 10, h * 0.42, 50, 0, 7); g.fill(); g.fillStyle = 'rgba(0,0,0,.5)'; g.beginPath(); g.moveTo(x + 10, h * 0.75); g.lineTo(x + w / 10, h * 0.5); g.lineTo(x + w / 5 - 10, h * 0.75); g.fill();
          g.fillStyle = c2; g.font = '700 30px Georgia'; g.textAlign = 'center'; g.fillText(t, x + w / 10, 50); g.font = '16px Georgia'; g.fillText('PELO EXPRESSO', x + w / 10, h - 40); });
      });
      K.cyl(0.55, 0.55, 2.4, K.mat(0x2c3a36), mx, 1.2, mz, {}, 20);
      K.add(new T.CylinderGeometry(0.56, 0.56, 1.6, 20, 1, true), K.texMat(posters, { emissiveMap: posters, emissive: 0xffffff, emissiveIntensity: 0.15 }), mx, 1.4, mz);
      K.cyl(0.65, 0.62, 0.15, ironG, mx, 2.45, mz, {}, 20); K.sphere(0.5, ironG, mx, 2.5, mz, {}, 16, 8).scale.y = 0.6; K.sphere(0.08, gilt, mx, 2.85, mz);
      K.cyl(0.62, 0.65, 0.2, ironG, mx, 0.1, mz, {}, 20); K.colR(mx, mz, 0.6);
      K.ringSlots(mx, mz, 3, 1.05, 'talk', 0, 0.6);
      // balança de plataforma
      const bg = K.group(-13.7, 0, -6.2, PI / 2); K.box(0.5, 0.12, 0.6, K.mat(0x8a1a1a), 0, 0.06, 0, { parent: bg }); K.box(0.25, 1.4, 0.2, K.mat(0x8a1a1a, { roughness: 0.4, metalness: 0.3 }), 0, 0.8, -0.2, { parent: bg });
      K.cyl(0.2, 0.2, 0.06, K.mat(0x8a1a1a), 0, 1.55, -0.15, { parent: bg, rx: PI / 2 }, 18); K.cyl(0.16, 0.16, 0.02, K.glow(0xf6ecd0, 1.1), 0, 1.55, -0.11, { parent: bg, rx: PI / 2, cast: false }, 18);
      K.colR(-13.7, -6.2, 0.35);
      // máquina de chocolates com espelho
      K.box(0.5, 1.6, 0.4, K.mat(0x7a1424, { roughness: 0.3, metalness: 0.3 }), -13.95, 0.8, -0.2); K.box(0.04, 0.9, 0.3, K.mat(0xc0ccd8, { roughness: 0.05, metalness: 0.9 }), -13.68, 1.1, -0.2, { cast: false });
      K.sign('CHOCOLATES', 0.42, 0.1, -13.68, 1.68, -0.2, { ry: PI / 2, color: '#f2c14e', size: 60 }); K.col(-14.5, -0.45, -13.65, 0.05);
    }

    // ------------------------------------------------------------ bancos de madeira
    const bench = (x, z, ry, seats) => {
      const g = K.group(x, 0, z, ry);
      for (let k = 0; k < 4; k++) K.box(2.2, 0.03, 0.09, teak, 0, 0.45, -0.15 + k * 0.1, { parent: g });
      for (let k = 0; k < 3; k++) K.box(2.2, 0.08, 0.025, teak, 0, 0.62 + k * 0.12, -0.24, { parent: g, rx: -0.12 });
      for (const s of [-1.0, 1.0]) { K.box(0.06, 0.45, 0.45, ironG, s, 0.23, 0, { parent: g }); K.box(0.06, 0.55, 0.06, ironG, s, 0.72, -0.24, { parent: g }); K.box(0.06, 0.05, 0.42, ironG, s, 0.62, -0.02, { parent: g }); }
      const c = Math.cos(ry), sn = Math.sin(ry);
      K.col(x - Math.abs(c) * 1.1 - Math.abs(sn) * 0.3, z - Math.abs(sn) * 1.1 - Math.abs(c) * 0.3, x + Math.abs(c) * 1.1 + Math.abs(sn) * 0.3, z + Math.abs(sn) * 1.1 + Math.abs(c) * 0.3);
      (seats || [-0.7, 0, 0.7]).forEach(lx => { const wx = x + c * lx + sn * 0.05, wz = z - sn * lx + c * 0.05; K.slot(wx, wz, wx + sn, wz + c, 'sit'); });
    };
    bench(-8.6, 0.85, 0); bench(-8.6, 0.05, PI); bench(-1.6, 1.0, 0); bench(-1.6, 0.2, PI);
    bench(6.0, 1.3, 0, [0.7]); bench(1.6, -7.2, PI, [-0.7, 0.7]); bench(-9.9, -6.8, PI, [-0.7, 0.7]);

    // ------------------------------------------------------------ carrinho de champanhe (bar) e lampiões
    { const cx = 2.4, cz = -1.6;
      K.box(1.4, 0.06, 0.7, M.linen, cx, 0.9, cz); K.add(new T.BoxGeometry(1.44, 0.4, 0.74), K.mat(0xf3eee2, { roughness: 0.95 }), cx, 0.72, cz); K.box(1.3, 0.04, 0.6, brass, cx, 0.35, cz);
      for (const [a, b] of [[-0.62, 0.3], [0.62, 0.3], [-0.62, -0.3], [0.62, -0.3]]) { K.cyl(0.015, 0.015, 0.9, brass, cx + a, 0.45, cz + b, {}, 6); K.cyl(0.06, 0.06, 0.03, iron, cx + a, 0.06, cz + b, { rx: PI / 2 }, 10); }
      K.cyl(0.13, 0.1, 0.24, K.silver, cx - 0.3, 1.05, cz, {}, 14); for (let k = 0; k < 3; k++) K.lathe([[0, 0], [0.035, 0], [0.037, 0.18], [0.012, 0.26], [0, 0.26]], K.mat(0x1a3a1a, { roughness: 0.15 }), cx - 0.36 + k * 0.06, 0.98, cz - 0.04 + (k % 2) * 0.06, { cast: false }, 8);
      const tw = []; for (let lvl = 0; lvl < 3; lvl++) { const n = 3 - lvl; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tw.push([cx + 0.3 + (i - (n - 1) / 2) * 0.1, 0.93 + lvl * 0.12, cz + (j - (n - 1) / 2) * 0.1]); }
      K.inst(new T.CylinderGeometry(0.045, 0.012, 0.035, 10).translate(0, 0.08, 0), K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.35, roughness: 0.1 }), tw, { cast: false });
      K.inst(new T.CylinderGeometry(0.004, 0.004, 0.07, 4).translate(0, 0.035, 0), K.glass, tw, { cast: false });
      K.col(cx - 0.75, cz - 0.4, cx + 0.75, cz + 0.4);
      [[1.7, -0.75], [2.5, -0.75], [3.3, -0.75], [3.4, -2.3]].forEach(([x, z]) => K.slot(x, z, cx, cz, 'bar'));
    }
    const lampost = (x, z, light) => {
      const g = K.group(x, 0, z);
      K.cyl(0.14, 0.2, 0.4, ironG, 0, 0.2, 0, { parent: g }, 8); K.cyl(0.05, 0.07, 3.0, ironG, 0, 1.7, 0, { parent: g }, 8);
      for (let k = 0; k < 4; k++) K.box(0.015, 1.2, 0.04, gilt, Math.cos(k * PI / 2) * 0.07, 1.2, Math.sin(k * PI / 2) * 0.07, { parent: g, ry: k * PI / 2, cast: false });
      K.box(0.9, 0.05, 0.05, ironG, 0, 3.0, 0, { parent: g });
      for (const s of [-0.42, 0.42]) { K.cyl(0.005, 0.005, 0.15, iron, s, 2.92, 0, { parent: g, cast: false }, 4); K.sphere(0.16, K.glow(0xffe2b0, 2.0), s, 2.72, 0, { parent: g, cast: false }, 12, 8); K.halo(x + s, 2.72, z, 0.7, 0xffc078, 0.35); }
      K.sphere(0.07, gilt, 0, 3.12, 0, { parent: g });
      K.pool(x, z, 2.2, 0xffb060, 0.32);
      if (light) K.plight(x, 2.8, z, 0xffc888, 1.2, 8);
      K.colR(x, z, 0.18);
    };
    lampost(-6.6, -4.4, true); lampost(4.4, -4.6, true); lampost(-0.4, 4.0, true); lampost(-11.4, 3.6, false); lampost(8.3, 3.4, false); lampost(13.6, -4.9, false);
    // palmeiras em vasos de ferro
    for (const [x, z] of [[-13.8, 5.0], [13.9, 2.3], [-3.2, 5.4], [3.0, 5.4]]) K.plant(x, z, 'palm', { pot: K.mat(0x24302c, { roughness: 0.4, metalness: 0.4 }), s: 0.9 });

    // ------------------------------------------------------------ passarela de ferro elevada (nível 1)
    const Y1 = 3.6, BZ0 = 6.6, BZ1 = 8.0;
    { // grade vazada do piso e treliças laterais (texturas com transparência)
      const grate = K.canvasTex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#2a332f'; for (let k = 0; k < 16; k++) { g.fillRect(k * 16, 0, 5, h); } for (let k = 0; k < 8; k++) g.fillRect(0, k * 32, w, 4); }, [27, 2]);
      const gm = new T.MeshStandardMaterial({ map: grate, alphaTest: 0.5, transparent: false, side: T.DoubleSide, roughness: 0.6, metalness: 0.5 });
      K.add(new T.PlaneGeometry(27.2, BZ1 - BZ0).rotateX(-PI / 2), gm, 0, Y1, (BZ0 + BZ1) / 2, { cast: true });
      const grate2 = K.canvasTex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = '#2a332f'; for (let k = 0; k < 16; k++) g.fillRect(k * 16, 0, 5, h); for (let k = 0; k < 8; k++) g.fillRect(0, k * 32, w, 4); }, [1.2, 1.4]);
      K.add(new T.PlaneGeometry(1.2, 1.4).rotateX(-PI / 2), new T.MeshStandardMaterial({ map: grate2, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.6, metalness: 0.5 }), -13.0, Y1, 8.7, {});
      const latt = K.canvasTex(512, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#24302c'; g.lineWidth = 7; g.strokeRect(3, 3, w - 6, h - 6); for (let k = 0; k < 16; k++) { g.beginPath(); g.moveTo(k * 32, 4); g.lineTo(k * 32 + 32, h - 4); g.moveTo(k * 32 + 32, 4); g.lineTo(k * 32, h - 4); g.stroke(); } }, [6, 1]);
      const lm = new T.MeshStandardMaterial({ map: latt, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.5, metalness: 0.5 });
      for (const z of [BZ0, BZ1]) { K.add(new T.PlaneGeometry(27.2, 0.55), lm, 0, Y1 - 0.28, z, { cast: false }); K.box(27.2, 0.06, 0.12, ironG, 0, Y1 - 0.03, z); K.box(27.2, 0.05, 0.1, ironG, 0, Y1 - 0.55, z); }
      // guarda-corpo art déco
      const rail = K.canvasTex(512, 128, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = '#24302c'; g.lineWidth = 6; for (let k = 0; k < 8; k++) { const x = k * 64; g.strokeRect(x + 3, 3, 58, h - 6); g.beginPath(); g.arc(x + 32, h, 28, PI, 0); g.stroke(); g.beginPath(); g.moveTo(x + 32, 4); g.lineTo(x + 32, h - 30); g.stroke(); g.beginPath(); g.moveTo(x + 4, 40); g.lineTo(x + 60, 40); g.stroke(); } g.fillStyle = '#c99a44'; for (let k = 0; k < 8; k++) { g.beginPath(); g.arc(k * 64 + 32, 40, 6, 0, 7); g.fill(); } }, [14, 1]);
      const rm = new T.MeshStandardMaterial({ map: rail, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.5, metalness: 0.5 });
      const railRun = (x0, z0, x1, z1) => { const len = Math.hypot(x1 - x0, z1 - z0), ry = Math.atan2(-(z1 - z0), x1 - x0); const r2 = rm.clone(); r2.map = rail.clone(); r2.map.needsUpdate = true; r2.map.repeat.set(Math.max(1, Math.round(len / 2)), 1); K.add(new T.PlaneGeometry(len, 0.95), r2, (x0 + x1) / 2, Y1 + 0.48, (z0 + z1) / 2, { ry, cast: false }); K.add(new T.BoxGeometry(len, 0.07, 0.09), gilt, (x0 + x1) / 2, Y1 + 1.0, (z0 + z1) / 2, { ry }); };
      railRun(-13.6, BZ0, 13.6, BZ0); railRun(-12.4, BZ1, 13.6, BZ1); railRun(-13.6, BZ0, -13.6, 9.4); railRun(-13.6, 9.4, -12.4, 9.4); railRun(13.6, BZ0, 13.6, BZ1);
      for (let x = -13.6; x <= 13.61; x += 1.7) for (const z of [BZ0, BZ1]) { if (z === BZ1 && x < -12.4) continue; K.box(0.08, 1.05, 0.08, ironG, x, Y1 + 0.5, z, { cast: false }); K.sphere(0.05, gilt, x, Y1 + 1.08, z, { cast: false }, 6, 4); }
      K.col(-12.4, BZ1, 13.6, 9.4, 1);
      // colunas de ferro fundido
      for (const x of [-13.4, -4.5, 4.5, 13.4]) for (const z of [BZ0 + 0.15, BZ1 - 0.15]) { K.cyl(0.09, 0.11, Y1 - 0.55, ironG, x, (Y1 - 0.55) / 2, z, {}, 10); K.box(0.32, 0.3, 0.32, ironG, x, 0.15, z); K.cyl(0.2, 0.1, 0.25, gilt, x, Y1 - 0.62, z, {}, 10); K.colR(x, z, 0.16); }
      for (const [x, z] of [[-13.4, 9.25], [-12.55, 9.25]]) { K.cyl(0.09, 0.11, Y1, ironG, x, Y1 / 2, z, {}, 10); K.colR(x, z, 0.16); }
      // escada que desce ao longo da passarela
      const sx0 = -12.4, sx1 = -6.0, n = 18, run = (sx1 - sx0) / n;
      const steps = []; for (let k = 0; k < n; k++) steps.push([sx0 + (k + 0.5) * run, Y1 - (k + 1) * (Y1 / n) + 0.02, 8.75]);
      K.inst(new T.BoxGeometry(Math.abs(run) + 0.04, 0.05, 1.15), K.mat(0x3a3530, { roughness: 0.6, metalness: 0.4 }), steps);
      for (const z of [8.15, 9.35]) { strut([sx0, Y1, z], [sx1, 0, z], 0.06, ironG); strut([sx0, Y1 + 0.95, z], [sx1, 0.95, z], 0.03, gilt); for (let k = 0; k <= 6; k++) { const u = k / 6, x = sx0 + (sx1 - sx0) * u, y = Y1 * (1 - u); strut([x, y, z], [x, y + 0.95, z], 0.015, ironG, { cast: false }); } }
      K.col(-12.4, 8.12, -6.0, 9.38);
      // placas esmaltadas penduradas na frente da passarela (e o verso para a plataforma)
      const hang = (x, txt, bg) => { const g = K.group(x, Y1 - 0.6, BZ1 + 0.04); for (const s of [-0.75, 0.75]) K.cyl(0.008, 0.008, 0.25, iron, s, 0.1, 0, { parent: g, cast: false }, 4); const t = enamel(txt, 512, 128, bg); const sg = K.group(0, -0.25, 0, 0, g); K.box(1.9, 0.5, 0.04, K.mat(0x16161a), 0, 0, 0, { parent: sg }); K.add(new T.PlaneGeometry(1.86, 0.46), K.texMat(t, { roughness: 0.25, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.18 }), 0, 0, 0.025, { parent: sg, cast: false }); K.add(new T.PlaneGeometry(1.86, 0.46), K.texMat(t, { roughness: 0.25, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.18 }), 0, 0, -0.025, { parent: sg, cast: false, ry: PI }); return { g, sg }; };
      hang(-3.0, 'PARIS', '#1b3a8a'); hang(1.0, 'VENEZA', '#1b3a8a'); const ist = hang(5.0, 'ISTAMBUL', '#8a1a1a'); hang(9.4, 'SAÍDA ›', '#2c6e49');
      K.tick((dt, t) => { ist.g.rotation.x = Math.sin(t * 1.3) * 0.03; });
      K.tell('placa', (live) => { if (live) K.anim(1.2, (e) => { ist.sg.rotation.z = PI * e; ist.sg.rotation.x = Math.sin(e * PI) * 0.6; }); else { ist.sg.rotation.z = PI; ist.sg.rotation.x = 0; } ist.sg.position.y = -0.25; },
        () => { ist.sg.rotation.z = 0; ist.sg.rotation.x = 0; });
      // lanternas na passarela
      for (const x of [-9, 0, 9]) { K.cyl(0.03, 0.03, 0.8, ironG, x, Y1 + 1.4, BZ0, { cast: false }, 6); K.box(0.2, 0.28, 0.2, K.glow(0xffd9a0, 1.8), x, Y1 + 1.9, BZ0, { cast: false }); K.cone(0.18, 0.12, ironG, x, Y1 + 2.1, BZ0, { cast: false }, 4); K.pool(x, 7.3, 1.4, 0xffb060, 0.3, Y1 + 0.02); }
      K.plight(0, Y1 + 1.8, 7.3, 0xffc888, 1.0, 9);
      // vagas no nível 1
      [-11, -8, -5.5, -2, 1.5, 7.5, 10.5].forEach(x => K.slot(x, 6.95, x, 2, 'view', 1));
      [-9.5, 3.0, 12.0].forEach(x => K.slot(x, 7.65, x, 14, 'view', 1));
      [[-6.8, 7.3], [-6.0, 7.3], [11.6, 7.3], [12.4, 7.3]].forEach(([x, z], k) => K.slot(x, z, x + (k % 2 ? -1 : 1), z, 'talk', 1));
    }

    // ------------------------------------------------------------ laterais: mureta de tijolo com grade (esq.) e fim da plataforma (dir.)
    { const bt = brickTex([10, 0.6]);
      K.add(new T.BoxGeometry(0.5, 1.0, 19.4), K.texMat(bt), -14.95, 0.5, 0.3); K.box(0.6, 0.1, 19.5, stoneM, -14.95, 1.05, 0.3);
      for (let z = -9.2; z <= 9.8; z += 0.32) K.cyl(0.015, 0.015, 0.7, ironG, -14.95, 1.45, z, { cast: false }, 4);
      K.box(0.06, 0.06, 19.4, ironG, -14.95, 1.8, 0.3, { cast: false });
      // rua lateral: táxi antigo e lampiões
      K.add(new T.PlaneGeometry(14, 40).rotateX(-PI / 2), K.mat(0x2a2a2e, { roughness: 0.6, metalness: 0.2 }), -22, -0.3, 0, { cast: false });
      const taxi = (x, z, c) => { const g = K.group(x, -0.3, z, 0.05); K.add(K.rbox(1.6, 0.6, 4.0, 0.15), K.mat(c, { roughness: 0.25, metalness: 0.4 }), 0, 0.65, 0, { parent: g }); K.add(K.rbox(1.4, 0.6, 2.0, 0.15), K.mat(0x16161a, { roughness: 0.3 }), 0, 1.2, -0.3, { parent: g }); for (const [a, b] of [[-0.8, 1.3], [0.8, 1.3], [-0.8, -1.3], [0.8, -1.3]]) K.cyl(0.36, 0.36, 0.22, K.mat(0x111111), a, 0.36, b, { parent: g, rz: PI / 2 }, 14); for (const s of [-0.55, 0.55]) { K.sphere(0.12, K.glow(0xfff0c8, 2.5), s, 0.85, 2.0, { parent: g, cast: false }); } K.halo(x, 0.6, z + 2.6, 1.0, 0xffe0a0, 0.3); };
      taxi(-19.5, -2, 0x7a1424); taxi(-19.0, 5, 0x1f3a5a);
      for (const z of [-8, 2, 10]) { K.cyl(0.05, 0.07, 3.0, ironG, -17.2, 1.2, z, { cast: false }, 8); K.sphere(0.2, K.glow(0xffd9a0, 1.8), -17.2, 2.8, z, { cast: false }); K.pool(-17.2, z, 2.0, 0xffb060, 0.3, -0.28); }
      K.facade(8, 7, 14, -29, -10, { lit: 0.5, bays: 6, floors: 3, wall: '#4a3024', glow: 0.25 });
      // direita: rampa do fim da plataforma, grua d'água, para-choque
      K.box(3.0, 0.1, 19.4, K.mat(0x6a6258), 16.0, -0.55, 0.3, { rz: 0.35, cast: false });
      K.add(new T.PlaneGeometry(14, 30).rotateX(-PI / 2), K.texMat(gravelTex), 22, -1.08, 0, { cast: false });
      track(-1.0, 15, 40); track(4.0, 15, 40);
      const wc = K.group(18.5, -1.1, -6.5); K.cyl(0.18, 0.24, 3.4, K.mat(0x24302c, { roughness: 0.5, metalness: 0.4 }), 0, 1.7, 0, { parent: wc }, 10); K.cyl(0.12, 0.12, 2.0, K.mat(0x24302c), -0.9, 3.4, 0, { parent: wc, rz: PI / 2 }, 8); K.cyl(0.14, 0.1, 0.8, K.mat(0x2a2a2a), -1.9, 3.0, 0, { parent: wc }, 8);
      for (const z of [-1.0, 4.0]) { K.box(0.5, 1.0, 2.2, K.mat(0x8a1a1a), 29, -0.6, z); K.sphere(0.12, K.glow(0xff2a20, 2.5), 29, 0.1, z); }
      K.facade(7, 14, 7, 30, -10, { lit: 0.7, bays: 3, floors: 5, wall: '#3a2e2a' });
      K.sign('CABINE DE SINALIZAÇÃO', 6, 0.5, 30, 6.0, -6.45, { neon: true, color: '#ffcf86', size: 52, k: 1.2, w: 1024, h: 85 });
    }

    // ------------------------------------------------------------ carrinho do correio com sacos e caixotes (canto da frente, à direita)
    { const g = cart(8.2, 5.2, 0.3);
      for (let k = 0; k < 5; k++) K.add(new T.SphereGeometry(0.22, 8, 6).scale(1.2, 0.8, 0.9), K.mat(0x8a7a5a, { roughness: 0.95 }), -0.55 + (k % 3) * 0.5, 0.58 + Math.floor(k / 3) * 0.3, (k % 2) * 0.2 - 0.1, { parent: g });
      K.sign('CORREIO', 0.8, 0.2, 0, 0.32, 0.47, { parent: g, color: '#f2c14e', size: 70, bg: '#7a1424', w: 512, h: 128 });
      K.col(7.2, 4.5, 9.2, 5.9);
      for (const [x, z, h] of [[6.1, 6.1, 0.5], [6.6, 6.2, 0.4], [6.3, 6.15, 0.95]]) K.box(0.5, 0.45, 0.5, K.mat(0x9a7448, { roughness: 0.8 }), x, h - 0.22, z, { ry: x });
      K.col(5.8, 5.8, 6.9, 6.45);
      K.slot(8.0, 4.0, 8.2, 5.2, 'talk'); K.slot(7.7, 6.3, 8.2, 5.2, 'talk');
    }
    // ------------------------------------------------------------ vagas extras de conversa e de vista do trem
    [[-7.8, -8.4], [-6.6, -8.6], [0.2, -8.5], [-2.2, -8.6], [3.4, -8.4], [6.2, -8.3], [8.6, -8.3]].forEach(([x, z]) => K.slot(x, z, x, -11, 'view'));
    [[-6.5, 2.6], [-5.5, 3.0], [1.5, 2.8], [2.5, 3.2], [6.8, -1.2], [7.6, -0.6], [-2.6, -3.6], [-1.6, -3.2], [-7.6, -2.0], [-8.4, -2.6], [5.4, 3.6], [9.6, 0.4], [-11.6, 1.6], [-10.6, 2.0], [0.0, -1.0], [-3.6, -5.4]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));
    [[1.6, -5.6], [12.6, -5.4]].forEach(([x, z]) => K.slot(x, z, x + 1, -9.5, 'selfie'));
    // pombos no guarda-corpo e no carrinho de champanhe (balançam a cabeça)
    const pigeons = [];
    for (const [x, y, z] of [[-7.6, Y1 + 1.05, BZ0], [2.6, Y1 + 1.05, BZ0], [11.2, Y1 + 1.05, BZ1], [-2.0, 8.3, -9.15], [8.2, 8.3, -9.15]]) { const g = K.group(x, y, z, R() * 6); K.add(new T.SphereGeometry(0.09, 8, 6).scale(1.4, 1, 1), K.mat(0x7a7e88), 0, 0.08, 0, { parent: g }); const h = K.sphere(0.05, K.mat(0x5a6070), 0.11, 0.15, 0, { parent: g }, 8, 6); pigeons.push(h); }
    K.tick((dt, t) => pigeons.forEach((h, i) => { h.position.x = 0.11 + Math.max(0, Math.sin(t * 3 + i * 2)) * 0.03; }));
    // papéis e bitucas no chão, sombra suave sob o trem
    { const l = []; for (let k = 0; k < 40; k++) l.push([-14 + R() * 28, 0.015, -8.5 + R() * 17, R() * 6, 0.6 + R() * 0.6]); K.inst(new T.PlaneGeometry(0.1, 0.14).rotateX(-PI / 2), K.mat(0xe8e0cc, { roughness: 0.9 }), l, { cast: false }); }
    K.blob(-4, -9.3, 22, 1.2, 0.35);

    // ------------------------------------------------------------ luz geral da plataforma
    K.plight(-7.5, 4.2, 1.5, 0xffd0a0, 1.0, 12); K.plight(7.5, 4.2, 0.0, 0xffd0a0, 1.0, 12);
    K.pool(-4, 0, 6, 0xffb070, 0.12); K.pool(5, -2, 6, 0xffb070, 0.12);
  },
});
