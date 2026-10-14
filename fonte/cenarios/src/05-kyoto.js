// 05 · Festival de Lanternas: matsuri de verão numa rua de templo em Higashiyama, Kyoto, à noite.
// Rua de pedra entre barracas yatai, centenas de chōchin vermelhas e brancas, um torii vermelho e o portão do templo no alto da escadaria.
// O sniper está no último andar de um pagode de cinco andares do outro lado do rio Kamo. Metade da multidão usa yukata parecido:
// o sniper precisa ler faixas obi, máscaras, leques e as mudanças que as missões deixam nas barracas, no riacho e no templo.
MIRA_CENARIOS.push({
  id: 'kyoto',
  nome: 'Festival de Lanternas',
  lugar: 'Rua do templo em Higashiyama, Kyoto',
  hora: 'noite de matsuri de verão',
  resumo: 'Barracas de takoyaki, pescaria de peixinhos e tiro ao alvo sob centenas de lanternas de papel, tambores taiko, um riacho com ponte vermelha e o portão do templo no alto da escadaria.',
  sniper: { pos: [-6, 13.4, 49.4], desc: 'último andar do pagode de cinco andares, do outro lado do rio Kamo' },
  niveis: [
    { nome: 'rua do templo', y: 0, x0: -14.5, x1: 14.5, z0: -10, z1: 11.2 },
    { nome: 'terraço do santuário', y: 1.05, x0: -9, x1: 9, z0: -10, z1: -6.2 },
  ],
  escadas: [{ de: 0, para: 1, a: [0, -4.2], b: [0, -6.9], rotulo: 'escadaria do templo' }],
  convidados: 28,
  inicio: [0.6, 5.4, 0],
  ambiente: {
    ceu: ['#03040c', '#0b1030', '#22183a', '#5a2a38'], neblina: [0x16142a, 60, 175], hemi: [0x6a78b8, 0x2a1810, 0.2],
    sol: [0x8fa0ff, 0.34, -16, 26, 22], preenche: [0xff9a58, 0.26], exposicao: 0.92, bloom: 0.9,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [22, 0], talk: [4, 4, 25, 25] },
  guardaRoupa: {
    ternos: [[0x1f2a4a, 'yukata índigo'], [0x2e2e34, 'jinbei cinza-carvão'], [0x3a4a3a, 'yukata verde-musgo'], [0x5a4632, 'yukata marrom'], [0x26405e, 'jinbei azul'], [0xd8d2c4, 'yukata cru']],
    vestidos: [[0xd84a6a, 'yukata rosa'], [0x2e4fa8, 'yukata azul de flores'], [0xf2efe8, 'yukata branco'], [0x7a4fa0, 'yukata lilás'], [0xe8a02a, 'yukata amarelo'], [0x1b1b26, 'yukata preto'], [0xc8322f, 'yukata vermelho'], [0x3aa098, 'yukata verde-água']],
    vestidoChance: 0.55, longo: 1, taca: 0.12, tacas: ['tumbler'], drinks: [0x9be0f0, 0xff6a8a, 0xf2c14e],
    extra(o, r) {
      const pk = (a) => a[Math.floor(r() * a.length)];
      const [obi, obiN] = pk([[0xd9a441, 'obi dourado'], [0xc8322f, 'obi vermelho'], [0xf2c14e, 'obi amarelo'], [0x16161a, 'obi preto'], [0xff8ab0, 'obi rosa'], [0x2e4fa8, 'obi azul'], [0xf2efe8, 'obi branco']]);
      o.sash = obi; o.shoe = 0x7a5a3a; o.robe = 'cross'; // sleeves and a crossed collar, no straps or tie o.clutch = false; o.necklace = false; o.bow = false; o.pocket = 0;
      if (o.dress) {
        o.gown = true; o.satin = false; o.hairStyle = r() < 0.7 ? 'bun' : 'bob'; o.name += ', ' + obiN;
        r(); // (was a second skirt over the yukata; the draw stays so the rest of the wardrobe is unchanged)
        if (r() < 0.45) { o.hat = 'flower'; o.hatColor = pk([0xff5d8f, 0xf6f3ec, 0xffd23f, 0xc8322f]); o.name += ', kanzashi de flor'; }
      } else {
        o.pants = o.main; o.tie = o.main; o.shirt = o.main;
        if (r() < 0.2) { o.main = o.pants = o.shirt = o.tie = 0x1e3a8b; o.stripes = 0xf2efe8; o.sash = 0xc8322f; o.name = 'casaco happi azul'; }
        else if (/yukata/.test(o.name) && r() < 0.6) { o.robeLong = true; o.name += ', ' + obiN; }
        if (r() < 0.12) { o.hat = 'turban'; o.hatColor = 0xf2efe8; o.name += ', hachimaki'; }
      }
      if (r() < 0.14) { o.mask = 'kitsune'; o.name += ', máscara kitsune'; }
      const pr = r();
      if (pr < 0.24) { o.propL = 'fan'; o.propColor = pk([0x2e8ac8, 0xff6a3a, 0xf2efe8, 0xd84a6a]); o.name += ', leque uchiwa'; }
      else if (pr < 0.38) { o.propL = 'lantern'; o.propColor = pk([0xff3b1e, 0xfff1d6]); o.name += o.propColor === 0xff3b1e ? ', lanterninha vermelha' : ', lanterninha branca'; }
    },
  },
  elenco: [
    { x: 2.0, z: -7.5, lv: 1, rot: 0.25, anim: 10, fala: 'Até o sino do templo sabe esperar a hora certa.', outfit: { dress: false, main: 0xe8901a, pants: 0xe8901a, shirt: 0xe8901a, tie: 0xe8901a, skin: 2, hair: 0xb9845e, hairStyle: 'short', coat: 0xe08516, sash: 0x8a3a12, lei: 0x3a2010, shoe: 0x7a5a3a, name: 'monge Jōshin, de manto açafrão e contas de oração' } },
    { x: 9.6, z: 1.6, rot: -0.9, anim: 4, fala: 'Um leque fechado diz mais que mil palavras.', outfit: { dress: true, gown: true, satin: true, main: 0x5a1a3a, skin: 0, hair: 0x0a0a0a, hairStyle: 'bun', sash: 0xd9a441, hat: 'flower', hatColor: 0xd8323a, propL: 'fan', propColor: 0xd9a441, accent: 0xd9a441, name: 'gueixa Kikuha, de quimono ameixa e leque dourado' } },
    { x: -5.2, z: 5.75, rot: 1.9, anim: 2, fala: 'Oito bolinhas, um polvo inteiro! Cuidado que queima!', outfit: { dress: false, main: 0xf2efe8, pants: 0x2a2a30, shirt: 0xf2efe8, tie: 0xf2efe8, skin: 2, hair: 0x1a1411, hat: 'turban', hatColor: 0xf6f3ec, apron: 0x1e3a8b, prop: 'skewer', name: 'Tetsu do takoyaki, de hachimaki branco e avental azul' } },
    { x: -8.75, z: -1.5, rot: 1.57, anim: 14, fala: 'Don! Don! O coração da festa é o tambor.', outfit: { dress: false, main: 0x1f2a6a, pants: 0xf2efe8, shirt: 0xf2efe8, tie: 0xf2efe8, skin: 3, hair: 0x1a1411, hairStyle: 'quiff', sash: 0xc8322f, stripes: 0xf2efe8, hat: 'turban', hatColor: 0xc8322f, prop: 'baton', name: 'taikista Daigo, de casaco happi índigo e faixa vermelha' } },
    { x: -1.7, z: -2.6, rot: 0.5, anim: 0, fala: 'A raposa vê tudo e não conta nada.', outfit: { dress: true, gown: true, main: 0xf2efe8, sash: 0xc8322f, skin: 0, hair: 0x1a1411, hairStyle: 'long', mask: 'kitsune', propL: 'lantern', propColor: 0xff3b1e, name: 'moça da máscara kitsune, de yukata branco e lanterna vermelha' } },
    { x: 2.4, z: 9.7, rot: 3.6, anim: 0, fala: 'Sem empurra-empurra na ponte, por favor!', outfit: { dress: false, main: 0x1a2340, pants: 0x1a2340, shirt: 0xa8c0e0, tie: 0x1a2340, skin: 1, hair: 0x1a1411, hat: 'cap', hatColor: 0x1a2340, hatBand: 0xd9a441, gloves: 0xf6f3ec, prop: 'lantern', propColor: 0xfff6d8, name: 'guarda Satō, de quepe e lanterna' } },
    { x: 3.4, z: 4.05, rot: -1.57, anim: 19, fala: 'O peixe escolhe a rede, não o contrário.', outfit: { dress: false, main: 0x5a5040, pants: 0x3a3a30, shirt: 0x8a7a5a, tie: 0x5a5040, skin: 2, hair: 0xd8d8d8, beard: true, hat: 'kasa', hatColor: 0xc9a36a, apron: 0x2a4a6a, name: 'vovô Genji dos peixinhos, de chapéu cônico' } },
    { x: 0.5, z: 7.9, rot: 0.1, anim: 18, fala: 'Mais uma! Agora com o torii atrás!', outfit: { dress: false, main: 0xff8a3a, pants: 0xc9b48a, shirt: 0xff8a3a, tie: 0xff8a3a, skin: 0, hair: 0xd9b46a, hat: 'fedora', hatColor: 0xe9d79a, hatBand: 0x2e4fa8, glasses: 'sun', prop: 'camera', name: 'turista Mike, de camisa laranja e câmera' } },
  ],
  missoes: [
    { k: 'omamori', label: 'Trocar o omamori do balcão de amuletos', where: 'terraço do templo, à esquerda', s: [-6.5, -7.6], l: [-6.5, -8.9], lv: 1 },
    { k: 'lanterna', label: 'Soltar a lanterna no riacho', where: 'margem do riacho, à direita', s: [6.5, 9.35], l: [6.5, 8.6] },
    { k: 'alvo', label: 'Mudar o alvo do tiro ao alvo', where: 'barraca de shateki', s: [3.45, 1.5], l: [5.3, 1.5] },
    { k: 'peixe', label: 'Trocar o peixe dourado do tanque', where: 'pescaria de peixinhos', s: [3.45, 4.9], l: [4.4, 4.9] },
    { k: 'gongo', label: 'Bater o grande sino do templo', where: 'campanário, fundo à direita', s: [11.8, -6.45], l: [11.8, -8.2] },
    { k: 'omikuji', label: 'Amarrar o omikuji vermelho', where: 'árvore dos papéis da sorte', s: [10.2, -2.5], l: [10.2, -3.2] },
    { k: 'toro', label: 'Apagar a lanterna de pedra', where: 'margem do riacho, à esquerda', s: [-4.2, 9.25], l: [-4.2, 10.2] },
    { k: 'mascara', label: 'Trocar a máscara de oni', where: 'barraca de máscaras', s: [-3.45, -1.9], l: [-5.4, -1.9] },
    { k: 'takoyaki', label: 'Virar a placa do polvo', where: 'barraca de takoyaki', s: [-3.45, 3.9], l: [-4.8, 4.9] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r;
    const JP = '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","IPAMincho","IPAGothic","Noto Sans JP",serif';
    // ------------------------------------------------------------ materiais
    const verm = K.mat(0xc8361e, { roughness: 0.5 }), vermD = K.mat(0x8e2414, { roughness: 0.6 }), lac = K.mat(0x141210, { roughness: 0.4 });
    const woodD = K.mat(0x3a2618, { roughness: 0.75 }), woodM = K.mat(0x6a4a2e, { roughness: 0.75 }), woodL = K.mat(0xa67e50, { roughness: 0.7 }), woodG = K.mat(0x7a6a58, { roughness: 0.9 });
    const plaster = K.mat(0xe6dfcf, { roughness: 0.9 }), stoneG = K.mat(0x8c877e, { roughness: 0.92 }), stoneD = K.mat(0x5e5a54, { roughness: 0.95 }), stoneL = K.mat(0xb0aa9e, { roughness: 0.9 });
    const bamboo = K.mat(0x8a9a4a, { roughness: 0.6 }), bambooDry = K.mat(0xb8a468, { roughness: 0.7 }), rope = K.mat(0xd8c89a, { roughness: 0.95 });
    const brass = K.brass, bronze = K.metal(0x4a5a3a, 0.5), iron = K.iron, paper = K.mat(0xf6f0e0, { roughness: 0.9 });
    const redL = K.glow(0xff3b1e, 1.55), whiteL = K.glow(0xfff1d6, 1.25), warmL = K.glow(0xffc070, 1.8);
    const tileTex = K.canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#2c3038'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1d22'; g.fillRect(0, 0, w, 14); g.fillStyle = 'rgba(120,130,150,.18)'; g.fillRect(0, 14, w, 4); K.grain(g, w, h, 12); }, [1, 4]);
    const tileM = K.texMat(tileTex, { roughness: 0.6, side: T.DoubleSide }), tileEdge = K.mat(0x1e2026, { roughness: 0.6 });
    const roofGeo = (w, d, h, t = 0.14, up = 0.22) => {
      const s = new T.Shape(), hd = d / 2;
      s.moveTo(-hd, up); s.quadraticCurveTo(-hd * 0.4, h * 0.22, 0, h); s.quadraticCurveTo(hd * 0.4, h * 0.22, hd, up);
      s.lineTo(hd - 0.05, up - t); s.quadraticCurveTo(hd * 0.4, h * 0.22 - t, 0, h - t); s.quadraticCurveTo(-hd * 0.4, h * 0.22 - t, -hd + 0.05, up - t); s.lineTo(-hd, up);
      const g = new T.ExtrudeGeometry(s, { depth: w, bevelEnabled: false, curveSegments: 8 }); g.translate(0, 0, -w / 2); g.rotateY(Math.PI / 2); return g;
    };
    // telhado curvo japonês com cumeeira e empenas (cumeeira ao longo de x; ry gira)
    const roof = (w, d, h, x, y, z, o = {}) => {
      const g = K.group(x, y, z, o.ry || 0, o.parent);
      K.add(roofGeo(w, d, h, o.t, o.up), o.mat || tileM, 0, 0, 0, { parent: g, cast: o.cast });
      K.box(w + 0.1, 0.16, 0.22, tileEdge, 0, h + 0.02, 0, { parent: g, cast: false });
      for (const s of [-1, 1]) { K.box(0.2, 0.34, 0.3, tileEdge, s * (w / 2 + 0.02), h + 0.12, 0, { parent: g, cast: false });
        const sh = new T.Shape(), hd = d / 2 - 0.35; sh.moveTo(-hd, 0.2); sh.quadraticCurveTo(-hd * 0.4, h * 0.22, 0, h - 0.18); sh.quadraticCurveTo(hd * 0.4, h * 0.22, hd, 0.2); sh.lineTo(-hd, 0.2);
        K.add(new T.ShapeGeometry(sh).rotateY(Math.PI / 2), o.gable || K.mat(0x4a3424, { side: T.DoubleSide, roughness: 0.8 }), s * (w / 2 - 0.3), 0, 0, { parent: g, cast: false }); }
      return g;
    };
    const kanjiTex = (txt, o = {}) => K.canvasTex(o.w || 128, o.h || 256, (g, w, h) => {
      g.fillStyle = o.bg || '#f6f0e0'; g.fillRect(0, 0, w, h);
      if (o.border) { g.strokeStyle = o.border; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, h - 10); }
      g.fillStyle = o.color || '#16161a'; g.textAlign = 'center'; g.textBaseline = 'middle'; const sz = o.size || Math.min(w * 0.75, h / (txt.length + 0.4)); g.font = `700 ${sz}px ${JP}`;
      if (o.horiz) g.fillText(txt, w / 2, h / 2); else [...txt].forEach((c, i, a) => g.fillText(c, w / 2, h / 2 + (i - (a.length - 1) / 2) * sz * 1.02));
    });
    // locais → mundo (barracas giradas)
    const L2W = (X, Z, ry, lx, lz) => [X + lx * Math.cos(ry) + lz * Math.sin(ry), Z - lx * Math.sin(ry) + lz * Math.cos(ry)];
    const colL = (X, Z, ry, x0, z0, x1, z1, lv = 0) => { const a = L2W(X, Z, ry, x0, z0), b = L2W(X, Z, ry, x1, z1); K.col(a[0], a[1], b[0], b[1], lv); };

    // ------------------------------------------------------------ chão: cascalho, rua de lajes, margem
    const gravelTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#4e4a44'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 9000; k++) { const v = 50 + R() * 70; g.fillStyle = `rgba(${v + 10},${v + 4},${v - 6},${0.3 + R() * 0.5})`; g.beginPath(); g.arc(R() * w, R() * h, 0.8 + R() * 2.2, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(40,36,30,.18)'; g.lineWidth = 2; for (let y = 8; y < h; y += 22) { g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.05 + y) * 2); g.stroke(); }
    }, [9, 7]);
    const gravelM = K.texMat(gravelTex, { roughness: 0.95 });
    K.floor(-14.5, -10, 14.5, 7.0, gravelM);
    K.floor(-14.5, 8.6, 14.5, 11.2, gravelM);
    const slabTex = K.canvasTex(512, 1024, (g, w, h) => {
      g.fillStyle = '#3a3630'; g.fillRect(0, 0, w, h);
      let y = 0; while (y < h) { const rh = 60 + R() * 70; let x = 0; while (x < w) { const rw = 90 + R() * 150; const v = 96 + R() * 34; g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.fillRect(x + 3, y + 3, Math.min(rw, w - x) - 6, rh - 6); for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(${R() < 0.5 ? 60 : 200},${R() < 0.5 ? 60 : 190},${R() < 0.5 ? 50 : 170},.07)`; g.fillRect(x + R() * rw, y + R() * rh, 4 + R() * 14, 2 + R() * 6); } x += rw; } y += rh; }
      K.grain(g, w, h, 14);
    }, [1, 2.4]);
    K.floor(-2.8, -4.7, 2.8, 7.0, K.texMat(slabTex, { roughness: 0.6, metalness: 0.05, envMapIntensity: 0.6 }), { y: 0.008 });
    // borda de pedra da rua
    for (const s of [-1, 1]) K.box(0.18, 0.06, 11.7, stoneL, s * 2.85, 0.03, 1.15, { cast: false });
    // chão de fora (escuro) para fechar o diorama
    K.add(new T.PlaneGeometry(140, 70).rotateX(-Math.PI / 2), K.mat(0x14120f, { roughness: 1 }), 0, -0.02, -45, { cast: false });
    for (const s of [-1, 1]) K.add(new T.PlaneGeometry(40, 25).rotateX(-Math.PI / 2), K.mat(0x1c1a16, { roughness: 1 }), s * 34.5, -0.02, 0.6, { cast: false });

    // ------------------------------------------------------------ céu: estrelas e lua
    { const pts = []; for (let k = 0; k < 420; k++) { const a = R() * Math.PI * 2, e = 0.12 + R() * 1.2; pts.push(Math.cos(a) * Math.cos(e) * 150, 20 + Math.sin(e) * 140, Math.sin(a) * Math.cos(e) * 150 - 30); }
      const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
      K.root.add(new T.Points(gg, new T.PointsMaterial({ color: 0xdfe6ff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 })));
      const moon = new T.Mesh(new T.SphereGeometry(4, 16, 12), new T.MeshBasicMaterial({ color: 0xfff2d0, fog: false })); moon.position.set(-55, 62, -120); K.root.add(moon);
      const mh = K.halo(-55, 62, -119, 16, 0xffe0a0, 0.35); mh.material.fog = false; }

    // ------------------------------------------------------------ colinas de Higashiyama e o pagode iluminado ao fundo
    { const hillM = K.mat(0x121a1c, { roughness: 1 }), hill2 = K.mat(0x0d1416, { roughness: 1 });
      [[-50, -62, 38, 14], [-14, -70, 44, 20], [30, -66, 40, 17], [64, -58, 34, 12], [-80, -48, 30, 10], [8, -52, 26, 9]].forEach(([x, z, r, h], k) => K.add(new T.SphereGeometry(r, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, h / r, 0.7), k % 2 ? hillM : hill2, x, -0.5, z, { cast: false }));
      const trees = []; for (let k = 0; k < 160; k++) { const x = -90 + R() * 180, z = -38 - R() * 30, d = Math.abs(z + 60); trees.push([x, Math.max(0, 9 - d * 0.25) * R() + 0.5, z, R() * 6, 1.4 + R() * 1.6]); }
      K.inst(new T.ConeGeometry(1.2, 3.8, 6).translate(0, 1.9, 0), K.mat(0x16241c, { roughness: 1 }), trees, { cast: false });
      // pagode de Yasaka, aceso, na encosta
      const pg = K.group(16, 4.5, -44);
      const wallLit = new T.MeshStandardMaterial({ color: 0x8a3020, emissive: 0xff8a40, emissiveIntensity: 0.55, roughness: 0.8 });
      for (let i = 0; i < 5; i++) { const w = 5.2 - i * 0.6, y = i * 3.1; K.box(w * 0.8, 2.0, w * 0.8, wallLit, 0, y + 1.0, 0, { parent: pg, cast: false });
        const rf = K.cone(w * 0.95, 0.9, K.mat(0x1c1f24, { roughness: 0.7 }), 0, y + 2.4, 0, { parent: pg, cast: false }, 4); rf.rotation.y = Math.PI / 4;
        for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.halo(16 + a * w * 0.62, 4.5 + y + 2.1, -44 + b * w * 0.62, 0.35, 0xffb050, 0.9); }
      K.cyl(0.08, 0.08, 3.6, brass, 0, 15.5 + 1.8, 0, { parent: pg, cast: false }, 6); for (let k = 0; k < 7; k++) K.torus(0.22, 0.04, brass, 0, 15.8 + k * 0.4, 0, { parent: pg, rx: Math.PI / 2, cast: false });
      K.halo(16, 10, -42, 9, 0xff7a30, 0.12);
      // bosque escuro em volta do templo (fecha o fundo)
      const fo = [], tr = []; for (let k = 0; k < 240; k++) { const x = -48 + R() * 96, z = -13 - R() * 28; if (Math.abs(x) < 14.5 && z > -27) continue; if (Math.abs(x) < 6 && z > -32) continue; const s = 1.2 + R() * 1.4; fo.push([x, 3.2 * s + R(), z, R() * 6, s * 1.6]); fo.push([x + (R() - 0.5) * 2, 4.4 * s, z + (R() - 0.5) * 2, R() * 6, s * 1.2]); tr.push([x, 0, z, 0, [s, s * 3, s]]); }
      K.inst(new T.IcosahedronGeometry(1, 0), K.mat(0x16261c, { roughness: 1, flatShading: true }), fo, { cast: false });
      K.inst(new T.CylinderGeometry(0.15, 0.22, 1, 5).translate(0, 0.5, 0), K.mat(0x2a1e16), tr, { cast: false });
      // pátio do salão (plataforma de pedra) e caminho de lanternas de pedra
      K.box(26, 1.05, 15, K.mat(0x3a3630, { roughness: 0.95 }), 0, 0.52, -20.4, { cast: false });
      for (let k = 0; k < 2; k++) for (const s of [-1, 1]) toro(s * 3.0, -13.8 - k * 1.6, 1.05, 0.75);
      // lanterninhas subindo a encosta
      for (let k = 0; k < 24; k++) K.halo(-30 + k * 2.6 + R(), 1 + Math.sin(k * 0.4) * 2 + k * 0.25, -40 - R() * 4, 0.25, 0xffb050, 0.9);
    }

    // ------------------------------------------------------------ templo: portão (rōmon), muros e salão principal
    const giantLantern = (() => {
      // salão principal ao fundo, grande telhado
      const hall = K.group(0, 1.05, -21);
      K.box(22, 5.5, 9, K.mat(0x5a2a1c, { roughness: 0.85 }), 0, 2.75, 0, { parent: hall, cast: false });
      const hallLit = K.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#2a1408'; g.fillRect(0, 0, w, h); for (let k = 0; k < 8; k++) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf7a'); gr.addColorStop(1, '#b8601a'); g.fillStyle = gr; g.fillRect(k * 64 + 6, 10, 52, h - 16); g.strokeStyle = 'rgba(60,30,10,.7)'; g.lineWidth = 2; for (let j = 0; j < 6; j++) { g.beginPath(); g.moveTo(k * 64 + 6, 10 + j * 20); g.lineTo(k * 64 + 58, 10 + j * 20); g.stroke(); } for (let j = 1; j < 4; j++) { g.beginPath(); g.moveTo(k * 64 + 6 + j * 13, 10); g.lineTo(k * 64 + 6 + j * 13, h - 6); g.stroke(); } } });
      K.add(new T.PlaneGeometry(20, 3.6), new T.MeshBasicMaterial({ map: hallLit, color: new T.Color(0xffffff).multiplyScalar(1.1), toneMapped: false }), 0, 2.2, 4.52, { parent: hall, cast: false });
      for (let k = 0; k < 9; k++) K.cyl(0.22, 0.22, 5.4, verm, -10 + k * 2.5, 2.7, 4.7, { parent: hall, cast: false }, 10);
      roof(26, 15, 6.2, 0, 5.3, -21, { cast: false }).position.y = 6.3;
      // muros com faixas brancas (suji-bei) de cada lado do portão
      const wallTex = K.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#d8b878'; g.fillRect(0, 0, w, h); g.fillStyle = '#f4ecd8'; for (let k = 0; k < 5; k++) g.fillRect(0, 22 + k * 18, w, 5); K.grain(g, w, h, 10); g.fillStyle = 'rgba(60,40,20,.5)'; for (let k = 0; k < 4; k++) g.fillRect(k * 128 + 124, 0, 8, h); }, [2, 1]);
      for (const s of [-1, 1]) { const cx = s * 9.4;
        K.add(new T.BoxGeometry(10.4, 2.4, 0.5), K.texMat(wallTex), cx, 1.2, -10.35, { cast: false });
        K.box(10.8, 0.12, 0.9, tileEdge, cx, 2.46, -10.35, { cast: false }); roof(10.8, 1.0, 0.32, cx, 2.45, -10.35, { cast: false, t: 0.06, up: 0.04 }); }
      // portão de dois andares
      const gx = 0, gz = -11.7, gy = 1.05, gate = K.group(gx, gy, gz);
      for (const x of [-3.6, -1.2, 1.2, 3.6]) for (const z of [-1.3, 1.3]) { K.cyl(0.24, 0.26, 4.2, verm, x, 2.1, z, { parent: gate, cast: false }, 12); K.cyl(0.32, 0.36, 0.3, stoneL, x, 0.15, z, { parent: gate, cast: false }, 10); }
      for (const z of [-1.3, 1.3]) { K.box(7.8, 0.36, 0.3, verm, 0, 3.7, z, { parent: gate, cast: false }); K.box(7.8, 0.2, 0.26, vermD, 0, 2.9, z, { parent: gate, cast: false }); }
      // paredes brancas nos vãos laterais com janelas de treliça
      for (const s of [-1, 1]) { K.box(2.2, 2.6, 0.2, plaster, s * 2.4, 1.6, 0, { parent: gate, cast: false });
        K.add(new T.PlaneGeometry(1.2, 1.0), K.texMat(K.canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#ffcf86'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5a2010'; g.lineWidth = 4; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * 16, 0); g.lineTo(k * 16, h); g.stroke(); g.beginPath(); g.moveTo(0, k * 16); g.lineTo(w, k * 16); g.stroke(); } }), { emissive: 0xffa040, emissiveIntensity: 0.5 }), s * 2.4, 2.0, 0.11, { parent: gate, cast: false });
        // guardiões Niō sugeridos: estátuas vermelhas nas grades
        K.box(0.6, 1.6, 0.4, K.mat(0x9a2a1a), s * 2.4, 0.9, 0.35, { parent: gate, cast: false }); K.sphere(0.24, K.mat(0x9a2a1a), s * 2.4, 1.9, 0.35, { parent: gate, cast: false }); }
      // vão central iluminado
      K.add(new T.PlaneGeometry(2.3, 3.4), K.glow(0xffa860, 0.55), 0, 1.75, -1.32, { parent: gate, cast: false });
      roof(10, 4.8, 1.3, 0, 4.0, 0, { parent: gate, cast: false, up: 0.35 });
      K.box(6.2, 2.2, 2.4, verm, 0, 5.4, 0, { parent: gate, cast: false });
      K.box(6.6, 0.12, 2.8, vermD, 0, 4.45, 0, { parent: gate, cast: false });
      const balTex = K.canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#c8361e'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd08a'; for (let k = 0; k < 8; k++) g.fillRect(8 + k * 31, 12, 20, 40); });
      K.add(new T.PlaneGeometry(5.6, 1.2), new T.MeshStandardMaterial({ map: balTex, emissiveMap: balTex, emissive: 0xffffff, emissiveIntensity: 0.5 }), 0, 5.5, 1.21, { parent: gate, cast: false });
      const bal = []; for (let x = -3.2; x <= 3.2; x += 0.25) bal.push([x, 4.55, 1.45]); K.inst(new T.BoxGeometry(0.05, 0.5, 0.05), verm, bal, { parent: gate, cast: false }); K.box(6.8, 0.06, 0.08, verm, 0, 4.82, 1.45, { parent: gate, cast: false });
      roof(9, 5.2, 2.0, 0, 6.4, 0, { parent: gate, cast: false, up: 0.45 });
      for (const s of [-1, 1]) { K.sphere(0.12, brass, s * 4.55, 6.85, 2.6, { parent: gate, cast: false }, 6, 4); K.sphere(0.1, brass, s * 4.9, 4.35, 2.4, { parent: gate, cast: false }, 6, 4); }
      // placa do portão
      K.add(new T.PlaneGeometry(0.8, 1.3), K.texMat(kanjiTex('祇園', { bg: '#1a1a1a', color: '#e8c060', border: '#c9a040' }), { emissive: 0x332200, emissiveIntensity: 0.6 }), 0, 5.6, 1.35, { parent: gate, cast: false });
      // lanterna gigante no vão do portão
      const lg = K.group(0, gy + 2.45, gz + 1.2);
      const lt = K.canvasTex(512, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#a8140a'); gr.addColorStop(0.5, '#e8301a'); gr.addColorStop(1, '#a8140a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#16161a'; g.font = `700 150px ${JP}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('祭', w * 0.25, h / 2 + 6); g.fillText('灯', w * 0.75, h / 2 + 6); g.strokeStyle = 'rgba(60,0,0,.35)'; g.lineWidth = 2; for (let y = 6; y < h; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
      const lantMat = new T.MeshBasicMaterial({ map: lt, color: new T.Color(0xffffff).multiplyScalar(1.35), toneMapped: false });
      const lathe = new T.LatheGeometry([[0, -0.9], [0.55, -0.9], [0.82, -0.6], [0.92, 0], [0.82, 0.6], [0.55, 0.9], [0, 0.9]].map(p => new T.Vector2(p[0], p[1])), 24);
      K.add(lathe, lantMat, 0, 0, 0, { parent: lg, cast: false });
      for (const s of [-1, 1]) K.cyl(0.6, 0.6, 0.16, lac, 0, s * 0.95, 0, { parent: lg }, 20);
      K.cyl(0.03, 0.03, 1.0, iron, 0, 1.4, 0, { parent: lg }, 6);
      K.halo(0, gy + 2.45, gz + 1.6, 2.2, 0xff5020, 0.35);
      return lg;
    })();
    K.tick((dt, t) => { giantLantern.rotation.z = Math.sin(t * 0.9) * 0.02; });

    // ------------------------------------------------------------ terraço do santuário (nível 1) e escadaria
    const TY = 1.05;
    { const ishiTex = K.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#3a3630'; g.fillRect(0, 0, w, h); for (let k = 0; k < 70; k++) { const x = R() * w, y = R() * h, rw = 30 + R() * 40, rh = 22 + R() * 26, v = 90 + R() * 50; g.fillStyle = `rgb(${v},${v - 3},${v - 10})`; g.beginPath(); g.ellipse(x, y, rw / 2, rh / 2, R(), 0, 7); g.fill(); } K.grain(g, w, h, 16); }, [4, 1]);
      K.add(new T.BoxGeometry(18, TY, 3.8), [K.texMat(ishiTex), K.texMat(ishiTex), stoneG, stoneG, K.texMat(ishiTex), K.texMat(ishiTex)], 0, TY / 2, -8.1);
      const terTex = K.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#4a463e'; g.fillRect(0, 0, w, h); const s = 64; for (let i = 0; i < w / s; i++) for (let j = 0; j < h / s; j++) { const v = 104 + R() * 26; g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4); } K.grain(g, w, h, 12); }, [4.5, 1]);
      K.floor(-9, -10, 9, -6.2, K.texMat(terTex, { roughness: 0.7 }), { y: TY + 0.005 });
      K.col(-9, -10, 9, -6.2, 0);
      // degraus
      for (let k = 0; k < 6; k++) { const y = (k + 1) * TY / 6, z = -4.75 - k * 0.24; K.box(3.4, 0.05, 0.26, stoneL, 0, y - 0.025, z - 0.12); K.box(3.4, y - 0.05, 0.26, stoneG, 0, (y - 0.05) / 2, z - 0.12); }
      for (const s of [-1, 1]) { K.box(0.3, 0.9, 1.6, stoneD, s * 1.85, 0.45, -5.45); K.box(0.36, 0.08, 1.7, stoneL, s * 1.85, 0.92, -5.45); }
      K.col(-2.0, -6.2, 2.0, -4.62, 0);
      // cerca baixa vermelha (tamagaki) na borda do terraço
      const posts = []; for (let x = -8.9; x <= 8.9; x += 0.9) if (Math.abs(x) > 2.0) posts.push([x, TY + 0.3, -6.3]);
      K.inst(new T.BoxGeometry(0.09, 0.6, 0.09), verm, posts);
      for (const s of [-1, 1]) { K.box(6.9, 0.07, 0.07, verm, s * 5.45, TY + 0.55, -6.3); K.box(6.9, 0.05, 0.05, verm, s * 5.45, TY + 0.3, -6.3); }
      // corda sagrada shimenawa com shide no alto da escada
      for (const s of [-1, 1]) K.cyl(0.07, 0.08, 2.4, woodD, s * 1.85, TY + 1.2, -6.35, {}, 8);
      { const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push(new T.Vector3(-1.85 + 3.7 * u, TY + 2.3 - Math.sin(u * Math.PI) * 0.35, -6.35)); }
        K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 20, 0.07, 6), rope, 0, 0, 0);
        for (let k = 0; k < 5; k++) { const u = (k + 0.5) / 5, x = -1.85 + 3.7 * u, y = TY + 2.3 - Math.sin(u * Math.PI) * 0.35; K.add(new T.PlaneGeometry(0.12, 0.38), K.mat(0xffffff, { side: T.DoubleSide, roughness: 0.9, emissive: 0x555555 }), x, y - 0.25, -6.35, { cast: false, rz: 0.15 }); } }
      // komainu (cães-leão) nos pedestais
      for (const s of [-1, 1]) { const g = K.group(s * 2.6, TY, -6.75, s * -0.3);
        K.box(0.8, 0.7, 0.8, stoneD, 0, 0.35, 0, { parent: g }); K.box(0.9, 0.08, 0.9, stoneL, 0, 0.74, 0, { parent: g });
        K.add(new T.SphereGeometry(0.26, 10, 8).scale(1, 0.9, 1.3), stoneL, 0, 1.0, -0.05, { parent: g }); K.sphere(0.2, stoneL, 0, 1.38, 0.12, { parent: g }, 10, 8);
        K.add(new T.SphereGeometry(0.22, 10, 8).scale(1.2, 1, 0.6), stoneG, 0, 1.38, 0.04, { parent: g }); for (const e of [-1, 1]) K.sphere(0.03, K.mat(0x2a2010), e * 0.08, 1.42, 0.3, { parent: g, cast: false }, 6, 4);
        K.colR(s * 2.6, -6.75, 0.45, 1); }
      // caixa de oferendas, sinos suzu
      { K.box(2.0, 0.7, 0.75, woodD, 0, TY + 0.35, -9.05); for (let k = 0; k < 12; k++) K.box(0.06, 0.06, 0.7, woodL, -0.9 + k * 0.165, TY + 0.73, -9.05, { cast: false, rx: 0.4 });
        K.add(new T.PlaneGeometry(1.0, 0.35), K.texMat(kanjiTex('奉納', { horiz: true, w: 256, h: 96, bg: '#2a1a10', color: '#e8c060', size: 70 })), 0, TY + 0.42, -8.67, { cast: false });
        K.col(-1.05, -9.45, 1.05, -8.65, 1);
        for (const s of [-1, 1]) { const tw = K.add(new T.CylinderGeometry(0.045, 0.045, 2.4, 6), K.texMat(K.canvasTex(16, 64, (g, w, h) => { const c = ['#c8322f', '#f6f3ec', '#6b3f8c']; for (let k = 0; k < 16; k++) { g.fillStyle = c[k % 3]; g.save(); g.translate(0, k * 4); g.transform(1, 0.5, 0, 1, 0, 0); g.fillRect(0, 0, w, 4); g.restore(); } }, [1, 6])), s * 0.55, TY + 1.95, -9.6, { cast: false }); K.sphere(0.14, brass, s * 0.55, TY + 3.2, -9.6, {}, 10, 8); } }
      // queimador de incenso de bronze (fumaça)
      { const ix = -3.9, iz = -8.8; // atrás, perto do muro: entre ele e o komainu fica a passagem para o balcão de amuletos K.lathe([[0, 0], [0.4, 0], [0.5, 0.15], [0.55, 0.55], [0.6, 0.62], [0, 0.62]], bronze, ix, TY + 0.3, iz, {}, 14); for (let k = 0; k < 3; k++) { const a = k * 2.1; K.cyl(0.05, 0.07, 0.35, bronze, ix + Math.cos(a) * 0.35, TY + 0.17, iz + Math.sin(a) * 0.35, {}, 6); }
        K.box(0.9, 0.06, 0.9, bronze, ix, TY + 1.4, iz); K.cone(0.7, 0.45, bronze, ix, TY + 1.65, iz, {}, 6); K.sphere(0.08, brass, ix, TY + 1.95, iz); for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.cyl(0.03, 0.03, 0.5, bronze, ix + a * 0.38, TY + 1.15, iz + b * 0.38, {}, 4);
        K.pool(ix, iz, 0.8, 0xff7030, 0.3, TY + 0.02); K.halo(ix, TY + 0.95, iz, 0.4, 0xff6020, 0.6); K.colR(ix, iz, 0.55, 1); }
      // lanternas de pedra do terraço
      for (const s of [-1, 1]) toro(s * 8.3, -6.8, TY, 0.85, false), K.colR(s * 8.3, -6.8, 0.35, 1);
      // barril de saquê empilhado (komodaru) aos pés da escadaria
      for (const s of [-1, 1]) { const tex = K.canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#efe6cc'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a7a50'; g.lineWidth = 2; for (let y = 4; y < h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.fillStyle = s > 0 ? '#c8322f' : '#1e3a8b'; g.font = `700 70px ${JP}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s > 0 ? '月桂' : '白鶴', w / 2, h / 2); g.fillStyle = '#16161a'; g.fillRect(0, 0, w, 10); g.fillRect(0, h - 10, w, 10); });
        const bm = K.texMat(tex, { roughness: 0.9 }), list = [];
        for (let r = 0; r < 3; r++) for (let i = 0; i < 4 - r; i++) list.push([s * 6.0 + (i - (3 - r) / 2) * 0.5, 0.24 + r * 0.46, -5.5, 0, 1]);
        K.inst(new T.CylinderGeometry(0.24, 0.24, 0.48, 14).rotateZ(Math.PI / 2).rotateY(Math.PI / 2), bm, list.map(p => [p[0], p[1], p[2]])); // tampa voltada para a câmera
        K.box(2.2, 0.06, 0.6, woodD, s * 6.0, 0.03, -5.5, { cast: false }); K.col(s * 6.0 - 1.05, -5.85, s * 6.0 + 1.05, -5.15); }
      // vagas no terraço
      [[-1.0, -8.0], [1.0, -8.0]].forEach(([x, z]) => K.slot(x, z, 0, -9.1, 'talk', 1));
      [[-5.4, -6.7], [-4.0, -6.7], [4.2, -6.7], [5.6, -6.7]].forEach(([x, z]) => K.slot(x, z, x * 0.6, 2, 'view', 1));
      K.slot(-2.8, -8.2, -3.9, -8.8, 'talk', 1); K.slot(-4.9, -8.0, -3.9, -8.8, 'talk', 1);
      K.slot(3.6, -7.4, 3.6, -3, 'selfie', 1);
    }

    // ------------------------------------------------------------ lanterna de pedra (tōrō) estilo kasuga
    function toro(x, z, y0, s, lit = true) {
      const g = K.group(x, y0, z);
      K.cyl(0.32 * s, 0.38 * s, 0.18 * s, stoneG, 0, 0.09 * s, 0, { parent: g }, 6);
      K.cyl(0.1 * s, 0.13 * s, 0.75 * s, stoneG, 0, 0.55 * s, 0, { parent: g }, 8);
      K.cyl(0.3 * s, 0.22 * s, 0.16 * s, stoneG, 0, 1.0 * s, 0, { parent: g }, 6);
      const box = K.cyl(0.22 * s, 0.22 * s, 0.36 * s, stoneL, 0, 1.26 * s, 0, { parent: g }, 6);
      const win = K.box(0.26 * s, 0.2 * s, 0.46 * s, lit ? K.glow(0xffb050, 2.2) : K.mat(0x1a1612), 0, 1.27 * s, 0, { parent: g, cast: false });
      K.cone(0.46 * s, 0.32 * s, stoneG, 0, 1.6 * s, 0, { parent: g }, 6); K.sphere(0.07 * s, stoneG, 0, 1.8 * s, 0, { parent: g }, 8, 6);
      K.sphere(0.04 * s, stoneG, 0, 1.88 * s, 0, { parent: g }, 6, 4);
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; K.cyl(0.02 * s, 0.03 * s, 0.06 * s, stoneG, Math.cos(a) * 0.43 * s, 1.47 * s, Math.sin(a) * 0.43 * s, { parent: g, cast: false }, 4); }
      return { g, win, box };
    }

    // ------------------------------------------------------------ torii
    { const z = -3.9, h = 5.0, w = 5.4;
      for (const s of [-1, 1]) { K.cyl(0.2, 0.24, h, verm, s * 2.7, h / 2, z, {}, 14); K.cyl(0.27, 0.27, 0.5, lac, s * 2.7, 0.25, z, {}, 14); K.colR(s * 2.7, z, 0.27); }
      const sh = new T.Shape(); sh.moveTo(-w / 2 - 0.7, 0.32); sh.quadraticCurveTo(0, -0.1, w / 2 + 0.7, 0.32); sh.lineTo(w / 2 + 0.62, 0.52); sh.quadraticCurveTo(0, 0.14, -w / 2 - 0.62, 0.52); sh.lineTo(-w / 2 - 0.7, 0.32);
      const kas = new T.ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: false, curveSegments: 12 }); kas.translate(0, 0, -0.25);
      K.add(kas, lac, 0, h + 0.12, z); const sh2 = kas.clone(); K.add(sh2, verm, 0, h - 0.1, z, { s: [0.97, 1, 0.9] });
      K.box(w + 0.9, 0.28, 0.32, verm, 0, h - 0.95, z); K.box(0.22, 0.75, 0.24, verm, 0, h - 0.45, z);
      K.add(new T.PlaneGeometry(0.62, 0.8), K.texMat(kanjiTex('八坂', { bg: '#141210', color: '#e8c060', border: '#c9a040' }), { emissive: 0x332200, emissiveIntensity: 0.5 }), 0, h - 0.45, z + 0.14, { cast: false });
      K.spot(0, 0.3, z + 3.2, 0, h - 0.6, z, 0xffb070, 2.6, 9, 0.55);
      K.slot(1.3, -3.0, 0, 3, 'selfie'); K.slot(-0.6, -2.9, 0, -5, 'talk');
    }

    // ------------------------------------------------------------ lanternas de papel em cordões (balançam)
    const chochinGeo = new T.SphereGeometry(0.15, 10, 8).scale(1, 1.3, 1), capGeo = new T.CylinderGeometry(0.085, 0.085, 0.05, 8), hangGeo = new T.CylinderGeometry(0.006, 0.006, 1, 3).translate(0, -0.5, 0);
    const lantTex = K.canvasTex(128, 64, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 3; y < h; y += 6) g.fillRect(0, y, w, 1); g.fillStyle = '#16161a'; g.font = `700 30px ${JP}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('祭', w * 0.25, h / 2); g.fillText('祭', w * 0.75, h / 2); });
    const redLT = new T.MeshBasicMaterial({ map: lantTex, color: new T.Color(0xff3b1e).multiplyScalar(1.6), toneMapped: false });
    const whiteLT = new T.MeshBasicMaterial({ map: lantTex, color: new T.Color(0xfff1d6).multiplyScalar(1.3), toneMapped: false });
    const swayers = [];
    const string = (a, b, n, sag, pat = 'rw', o = {}) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dz);
      const g = K.group(a[0], a[1], a[2], Math.atan2(dx, dz)), sw = K.group(0, 0, 0, 0, g);
      const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push(new T.Vector3(0, dy * u - Math.sin(u * Math.PI) * sag, L * u)); }
      sw.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x1a1410 })));
      const lr = [], lw = [], caps = [], hangs = [], drop = o.drop || 0.3;
      for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, y = dy * u - Math.sin(u * Math.PI) * sag, p = [0, y - drop, L * u, R() * 3];
        (pat[i % pat.length] === 'r' ? lr : lw).push(p); caps.push([0, y - drop + 0.2, L * u]); caps.push([0, y - drop - 0.2, L * u]); hangs.push([0, y, L * u, 0, [1, drop - 0.2, 1]]); }
      if (lr.length) K.inst(chochinGeo, redLT, lr, { cast: false, parent: sw }); if (lw.length) K.inst(chochinGeo, whiteLT, lw, { cast: false, parent: sw });
      K.inst(capGeo, lac, caps, { cast: false, parent: sw }); K.inst(hangGeo, lac, hangs, { cast: false, parent: sw });
      swayers.push({ sw, ph: R() * 6, a: 0.04 + R() * 0.05, f: 1.0 + R() * 0.6 });
      if (o.pools !== false) for (let k = 1; k <= 2; k++) { const u = k / 3; K.pool(a[0] + dx * u, a[2] + dz * u, 1.3, pat[0] === 'r' ? 0xff6030 : 0xffb070, 0.16, (o.y0 || 0) + 0.024); }
      return sw;
    };
    K.tick((dt, t) => { for (const s of swayers) s.sw.rotation.z = Math.sin(t * s.f + s.ph) * s.a + Math.sin(t * 2.3 + s.ph * 2) * s.a * 0.3; });
    const pole = (x, z, h = 3.0) => { K.cyl(0.07, 0.09, h, woodD, x, h / 2, z, {}, 8); K.box(0.5, 0.06, 0.06, woodD, x, h - 0.12, z); K.cyl(0.12, 0.14, 0.2, stoneG, x, 0.1, z, {}, 8); K.colR(x, z, 0.14); };

    // ------------------------------------------------------------ barracas yatai
    const smokes = [];
    const smokeAt = (x, y, z, n, c = 0xb8b0a8, op = 0.28) => { for (let k = 0; k < n; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: c, transparent: true, opacity: 0, depthWrite: false })); s.userData = { x, y, z, ph: k / n, op, sp: 0.22 + R() * 0.08 }; K.root.add(s); smokes.push(s); } };
    K.tick((dt, t) => { for (const s of smokes) { const d = s.userData, u = (t * d.sp + d.ph) % 1; s.position.set(d.x + Math.sin(t * 0.9 + d.ph * 9) * 0.25 * u + u * 0.3, d.y + u * 1.9, d.z + Math.cos(t * 0.7 + d.ph * 7) * 0.2 * u); s.scale.setScalar(0.25 + u * 1.1); s.material.opacity = d.op * (1 - u) * Math.min(1, u * 6); } });
    const yatai = (X, Z, ry, o) => {
      const g = K.group(X, 0, Z, ry);
      for (const [lx, lz] of [[-1.25, -0.95], [1.25, -0.95], [-1.25, 0.75], [1.25, 0.75]]) K.box(0.08, 2.45, 0.08, woodM, lx, 1.22, lz, { parent: g });
      K.box(2.6, 0.86, 0.5, woodD, 0, 0.43, 0.5, { parent: g }); K.box(2.72, 0.05, 0.62, woodL, 0, 0.885, 0.5, { parent: g });
      // painel da frente do balcão
      const ft = K.canvasTex(512, 128, (gg, w, h) => { gg.fillStyle = o.panel || '#f6f0e0'; gg.fillRect(0, 0, w, h); gg.fillStyle = o.ink || '#c8322f'; gg.font = `700 84px ${JP}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(o.txt, w / 2, h / 2 + 4); gg.strokeStyle = o.ink || '#c8322f'; gg.lineWidth = 6; gg.strokeRect(6, 6, w - 12, h - 12); });
      K.add(new T.PlaneGeometry(2.5, 0.62), K.texMat(ft, { emissive: 0x302018, emissiveIntensity: 0.4 }), 0, 0.46, 0.756, { parent: g, cast: false });
      K.box(2.5, 1.3, 0.3, woodM, 0, 0.65, -0.85, { parent: g }); K.box(2.5, 0.04, 0.34, woodL, 0, 1.32, -0.85, { parent: g });
      // toldo listrado inclinado
      const aw = K.canvasTex(256, 128, (gg, w, h) => { for (let k = 0; k < 8; k++) { gg.fillStyle = k % 2 ? '#f6f0e0' : o.stripe; gg.fillRect(k * 32, 0, 32, h); } K.grain(gg, w, h, 8); });
      K.add(new T.BoxGeometry(2.9, 0.04, 2.1), K.texMat(aw, { roughness: 0.85 }), 0, 2.52, -0.1, { parent: g, rx: -0.14 });
      // noren / faixa da frente com nome
      const nt = K.canvasTex(512, 96, (gg, w, h) => { gg.fillStyle = o.noren; gg.fillRect(0, 0, w, h); gg.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 1; k < 4; k++) gg.fillRect(k * w / 4 - 2, 30, 4, h); gg.fillStyle = '#ffffff'; gg.font = `700 64px ${JP}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(o.txt, w / 2, h / 2 + 3); });
      K.add(new T.PlaneGeometry(2.8, 0.5), K.texMat(nt, { side: T.DoubleSide, emissive: 0x201010, emissiveIntensity: 0.3 }), 0, 2.2, 0.96, { parent: g, cast: false });
      // lâmpada nua e lanterninhas
      K.sphere(0.06, K.glow(0xffe0a0, 3), 0, 2.15, 0.1, { parent: g, cast: false }, 8, 6);
      for (const lx of [-1.2, 1.2]) { K.add(chochinGeo, lx < 0 ? redLT : whiteLT, lx, 1.9, 0.98, { parent: g, cast: false }); K.cyl(0.08, 0.08, 0.04, lac, lx, 2.1, 0.98, { parent: g, cast: false }, 8); }
      colL(X, Z, ry, -1.33, -1.05, 1.33, 0.8);
      // fregueses diante do balcão
      for (const lx of o.slots || [-0.7, 0.7]) { const p = L2W(X, Z, ry, lx, 1.4); const f = L2W(X, Z, ry, lx, 0); K.slot(p[0], p[1], f[0], f[1], 'bar'); }
      K.pool(...L2W(X, Z, ry, 0, 1.0), 1.6, 0xffc080, 0.28);
      return g;
    };
    const LX = -4.8, RX = 4.8, LR = Math.PI / 2, RR = -Math.PI / 2;
    // --- takoyaki (esquerda, frente)
    const takoSign = (() => {
      const Z = 4.9, g = yatai(LX, Z, LR, { txt: 'たこ焼', noren: '#c8322f', stripe: '#c8322f', slots: [-0.8] });
      // chapa com cavidades e bolinhas
      K.box(1.1, 0.08, 0.42, iron, -0.5, 0.94, 0.5, { parent: g }); const balls = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) balls.push([-0.95 + i * 0.13, 0.985, 0.36 + j * 0.13]);
      K.inst(new T.SphereGeometry(0.045, 8, 6), K.mat(0xc07a3a, { roughness: 0.6 }), balls, { parent: g, cast: false });
      for (let k = 0; k < 4; k++) { const b = K.box(0.2, 0.03, 0.11, K.mat(0xd8b88a), 0.35 + (k % 2) * 0.26, 0.93, 0.38 + Math.floor(k / 2) * 0.18, { parent: g, cast: false }); for (let j = 0; j < 4; j++) K.sphere(0.035, K.mat(0x8a4a1a, { roughness: 0.4 }), b.position.x - 0.06 + (j % 2) * 0.1, 0.97, b.position.z - 0.025 + Math.floor(j / 2) * 0.05, { parent: g, cast: false }, 6, 4); }
      K.cyl(0.05, 0.05, 0.2, K.mat(0x3a1a0a, { roughness: 0.3 }), 1.0, 1.0, 0.65, { parent: g, cast: false }, 8); K.cyl(0.05, 0.05, 0.2, K.mat(0xf6f0d0, { roughness: 0.3 }), 1.12, 1.0, 0.65, { parent: g, cast: false }, 8);
      K.box(0.5, 0.25, 0.35, K.mat(0xd8d0c0), 0.0, 1.45, -0.85, { parent: g });
      smokeAt(LX + 0.5, 1.1, Z + 0.5, 7);
      // placa do polvo sobre o toldo (frente laranja / verso azul de esgotado)
      const sg = K.group(LX + 0.1, 2.75, Z + 0.15, 0.25);
      K.cyl(0.03, 0.03, 0.5, woodD, 0, -0.2, 0, { parent: sg }, 6);
      const oct = K.canvasTex(256, 256, (gg, w, h) => { gg.fillStyle = '#f6e6c0'; gg.beginPath(); gg.arc(w / 2, h / 2, 124, 0, 7); gg.fill(); gg.fillStyle = '#e8501a'; gg.beginPath(); gg.ellipse(w / 2, h * 0.38, 70, 62, 0, 0, 7); gg.fill(); for (let k = 0; k < 8; k++) { gg.beginPath(); const x = 60 + k * 19; gg.moveTo(x, 140); gg.quadraticCurveTo(x - 10 + (k % 2) * 20, 200, x + (k % 2 ? 12 : -12), 222); gg.lineWidth = 13; gg.strokeStyle = '#e8501a'; gg.stroke(); }
        gg.fillStyle = '#fff'; for (const s of [-1, 1]) { gg.beginPath(); gg.arc(w / 2 + s * 26, h * 0.38, 15, 0, 7); gg.fill(); } gg.fillStyle = '#16161a'; for (const s of [-1, 1]) { gg.beginPath(); gg.arc(w / 2 + s * 26, h * 0.38 + 3, 7, 0, 7); gg.fill(); } gg.fillStyle = '#16161a'; gg.beginPath(); gg.ellipse(w / 2, h * 0.5, 12, 8, 0, 0, 7); gg.fill();
        gg.lineWidth = 8; gg.strokeStyle = '#c8322f'; gg.beginPath(); gg.arc(w / 2, h / 2, 120, 0, 7); gg.stroke(); });
      const blue = K.canvasTex(256, 256, (gg, w, h) => { gg.fillStyle = '#2a7ad8'; gg.beginPath(); gg.arc(w / 2, h / 2, 124, 0, 7); gg.fill(); gg.fillStyle = '#ffffff'; gg.font = `700 72px ${JP}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('売切', w / 2, h / 2); });
      const disc = new T.CircleGeometry(0.62, 28);
      K.add(disc, new T.MeshBasicMaterial({ map: oct, transparent: true, color: new T.Color(0xffffff).multiplyScalar(1.15), toneMapped: false }), 0, 0.55, 0.01, { parent: sg, cast: false });
      K.add(disc, new T.MeshBasicMaterial({ map: blue, transparent: true, color: new T.Color(0xffffff).multiplyScalar(1.2), toneMapped: false }), 0, 0.55, -0.01, { parent: sg, cast: false, ry: Math.PI });
      K.cyl(0.64, 0.64, 0.02, woodD, 0, 0.55, 0, { parent: sg, rx: Math.PI / 2, cast: false }, 28);
      return sg;
    })();
    K.tell('takoyaki', (live) => { if (live) K.anim(1.2, e => { takoSign.rotation.y = 0.25 + e * Math.PI; }); else takoSign.rotation.y = 0.25 + Math.PI; }, () => { takoSign.rotation.y = 0.25; });
    // --- yakisoba (esquerda, meio)
    { const Z = 1.5, g = yatai(LX, Z, LR, { txt: 'やきそば', noren: '#1e3a8b', stripe: '#e8a02a' });
      K.box(1.6, 0.08, 0.46, iron, -0.2, 0.94, 0.5, { parent: g });
      const nd = []; for (let k = 0; k < 90; k++) nd.push([-0.9 + R() * 1.3, 0.985, 0.33 + R() * 0.34, R() * 6, 1]); K.inst(new T.CylinderGeometry(0.008, 0.008, 0.16, 4).rotateZ(Math.PI / 2), K.mat(0xc8903a, { roughness: 0.5 }), nd, { parent: g, cast: false });
      const cb = []; for (let k = 0; k < 30; k++) cb.push([-0.9 + R() * 1.3, 0.99, 0.33 + R() * 0.34, R() * 6, 1]); K.inst(new T.BoxGeometry(0.03, 0.01, 0.03), K.mat(0x7aa040), cb, { parent: g, cast: false });
      for (const lx of [-0.5, 0.1]) K.box(0.12, 0.01, 0.2, K.silver, lx, 1.0, 0.45, { parent: g, cast: false, ry: 0.3 });
      for (let k = 0; k < 6; k++) K.box(0.18, 0.05, 0.12, K.mat(0xf2efe8), 0.85, 0.93 + k * 0.05, 0.6, { parent: g, cast: false });
      K.cyl(0.04, 0.04, 0.22, K.mat(0x3a1a0a), 0.8, 1.0, 0.3, { parent: g, cast: false }, 8);
      smokeAt(LX + 0.5, 1.1, Z + 0.2, 7);
    }
    // --- máscaras (esquerda, fundo)
    const oniMask = (() => {
      const Z = -1.9, g = yatai(LX, Z, LR, { txt: 'お面', noren: '#2e4fa8', stripe: '#2e4fa8' });
      K.box(2.5, 1.0, 0.05, K.mat(0x2a2a30), 0, 1.85, -0.72, { parent: g });
      const face = new T.SphereGeometry(0.16, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2).scale(0.85, 1.1, 0.7);
      const kinds = [0xf6f3ec, 0xf0c8a0, 0xf6f3ec, 0xc8322f, 0x2e8ac8, 0xff8ab0, 0xf2c14e, 0x3aa098, 0xf6f3ec, 0x9a2a1a];
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { if (i === 2 && j === 0) continue; const c = kinds[(i * 2 + j) % kinds.length], x = -1.0 + i * 0.4, y = 2.15 - j * 0.48;
        K.add(face, K.mat(c, { roughness: 0.4 }), x, y, -0.68, { parent: g, cast: false });
        for (const s of [-1, 1]) K.sphere(0.02, K.mat(c === 0xf6f3ec ? 0xc8322f : 0x16161a), x + s * 0.05, y + 0.03, -0.57, { parent: g, cast: false }, 6, 4);
        if (c === 0xf6f3ec && (i + j) % 2) for (const s of [-1, 1]) K.cone(0.04, 0.1, K.mat(0xf6f3ec), x + s * 0.08, y + 0.17, -0.68, { parent: g, cast: false }, 4); }
      // a grande máscara de oni (missão): vermelha, chifres dourados
      const og = K.group(0, 2.95, 0.1, -Math.PI / 2, g); og.scale.setScalar(2.2); K.cyl(0.02, 0.02, 0.6, woodD, 0, 2.55, 0.1, { parent: g }, 4); K.add(new T.CircleGeometry(0.42, 20), K.mat(0x16161a), 0, 2.95, 0.1 + 0.0, { parent: g, ry: -Math.PI / 2, cast: false }).position.x = 0.05;
      const m = K.add(face, K.mat(0xc8221a, { roughness: 0.35 }), 0, 0, 0, { parent: og, cast: false, s: 1.5 });
      for (const s of [-1, 1]) { K.cone(0.04, 0.18, K.gold, s * 0.11, 0.22, 0, { parent: og, cast: false, rz: -s * 0.3 }, 6); K.sphere(0.028, K.glow(0xffe040, 1.6), s * 0.07, 0.04, 0.12, { parent: og, cast: false }, 6, 4); }
      K.box(0.14, 0.03, 0.02, K.mat(0xf6f3ec), 0, -0.08, 0.13, { parent: og, cast: false });
      // máscaras no balcão e cata-ventos
      for (let k = 0; k < 4; k++) K.add(face, K.mat(kinds[(k * 3) % kinds.length]), -0.9 + k * 0.5, 0.95, 0.5, { parent: g, cast: false, rx: -Math.PI / 2 });
      for (let k = 0; k < 5; k++) { const pw = K.group(1.05, 1.2 + k * 0.12, 0.35 + (k % 2) * 0.12, 0, g); K.cyl(0.006, 0.006, 0.3, woodL, 0, -0.15, 0, { parent: pw, cast: false }, 3); for (let b = 0; b < 4; b++) K.add(new T.PlaneGeometry(0.08, 0.08).translate(0.04, 0.04, 0), K.mat([0xff3d7f, 0xffd23f, 0x2ec4b6, 0xff6b2c][b], { side: T.DoubleSide }), 0, 0, 0, { parent: pw, cast: false, rz: b * Math.PI / 2 });
        swayers.push({ sw: pw, ph: k, a: 0, f: 0, spin: true }); }
      return { og, m };
    })();
    const oniMat = oniMask.m.material;
    K.tell('mascara', (live) => { oniMask.m.material = new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88aaff, emissiveIntensity: 0.6, roughness: 0.3 }); if (live) K.anim(1.0, e => { oniMask.og.rotation.y = e * Math.PI * 2; }); else oniMask.og.rotation.y = 0; }, () => { oniMask.m.material = oniMat; oniMask.og.rotation.y = 0; });
    // --- pescaria de peixinhos dourados (direita, frente)
    const kingyo = (() => {
      const Z = 4.9, g = yatai(RX, Z, RR, { txt: '金魚すくい', noren: '#2e8ac8', stripe: '#2e8ac8', slots: [0.85] });
      // tanque raso azul na frente (sobre o balcão baixo)
      const tx = 4.42, tz = Z;
      K.box(0.8, 0.12, 2.5, K.mat(0x2a7ad8, { roughness: 0.4 }), tx, 0.95, tz);
      const water = K.add(new T.PlaneGeometry(0.7, 2.4).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({ color: 0x3ac0e0, emissive: 0x0a6a8a, emissiveIntensity: 0.9, roughness: 0.05, transparent: true, opacity: 0.85 }), tx, 1.0, tz, { cast: false });
      const fish = [], fg = new T.SphereGeometry(0.03, 8, 6).scale(1.8, 0.8, 0.9), tg = new T.ConeGeometry(0.03, 0.06, 4).rotateZ(Math.PI / 2).scale(1, 1, 0.3);
      const fm = K.mat(0xff6a1a, { emissive: 0xff4a00, emissiveIntensity: 0.5, roughness: 0.3 });
      for (let k = 0; k < 16; k++) { const f = K.group(tx, 0.985, tz); K.add(fg, k === 0 ? K.mat(0xf2c14e, { emissive: 0xd9a020, emissiveIntensity: 0.7, metalness: 0.5, roughness: 0.2 }) : k % 5 === 0 ? K.mat(0x16161a) : fm, 0, 0, 0, { parent: f, cast: false, s: k === 0 ? 1.8 : 1 }); K.add(tg, k % 5 === 0 && k ? K.mat(0x16161a) : fm, -0.07 * (k === 0 ? 1.8 : 1), 0, 0, { parent: f, cast: false, s: k === 0 ? 1.8 : 1 }); fish.push({ f, ph: R() * 6, sp: (0.4 + R() * 0.6) * (R() < 0.5 ? -1 : 1), rx: 0.08 + R() * 0.2, rz: 0.3 + R() * 0.8, cz: tz + (R() - 0.5) * 0.4 }); }
      K.tick((dt, t) => { for (const q of fish) { const a = t * q.sp + q.ph, x = tx + Math.cos(a) * q.rx, z = q.cz + Math.sin(a) * q.rz, dx = -Math.sin(a) * q.rx * q.sp, dz = Math.cos(a) * q.rz * q.sp; q.f.position.set(x, 0.985, z); q.f.rotation.y = Math.atan2(-dz, dx); } });
      // poi (redinhas) e tigelas
      for (let k = 0; k < 5; k++) { K.torus(0.05, 0.008, K.mat(0xf2efe8), 3.98, 1.04, tz - 1.0 + k * 0.45, { rx: Math.PI / 2, cast: false }, 6, 12); K.cyl(0.006, 0.006, 0.12, K.mat(0xf2efe8), 3.98, 1.04, tz - 0.92 + k * 0.45, { rx: Math.PI / 2, cast: false }, 4); }
      for (let k = 0; k < 3; k++) K.cyl(0.07, 0.05, 0.06, K.mat(0xf6f3ec), 4.9, 1.0, tz - 0.6 + k * 0.4, { cast: false }, 12);
      // saquinhos com peixes pendurados
      const bags = [], bf = []; for (let k = 0; k < 9; k++) { const z = tz - 1.2 + k * 0.3; bags.push([4.05, 1.62 + (k % 2) * 0.08, z]); bf.push([4.05, 1.6 + (k % 2) * 0.08, z, k]); }
      K.inst(new T.SphereGeometry(0.075, 10, 8).scale(1, 1.2, 1), new T.MeshStandardMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.45, roughness: 0.05 }), bags, { cast: false }); K.inst(fg, fm, bf, { cast: false });
      K.box(0.02, 0.02, 2.6, woodD, 4.05, 1.78, tz, { cast: false });
      // lanterna em forma de peixe dourado sobre a barraca (missão)
      const lg = K.group(RX + 0.2, 3.0, Z, 0);
      const lm = new T.MeshBasicMaterial({ color: new T.Color(0xff4a1a).multiplyScalar(1.7), toneMapped: false });
      K.add(new T.SphereGeometry(0.32, 14, 10).scale(1, 0.85, 1.6), lm, 0, 0, 0, { parent: lg, cast: false });
      K.add(new T.ConeGeometry(0.3, 0.4, 4).rotateX(-Math.PI / 2).scale(0.2, 1, 1), lm, 0, 0.05, -0.62, { parent: lg, cast: false });
      for (const s of [-1, 1]) { K.sphere(0.06, K.mat(0x16161a), s * 0.22, 0.08, 0.32, { parent: lg, cast: false }, 8, 6); K.add(new T.PlaneGeometry(0.2, 0.14), lm, s * 0.3, -0.12, 0.05, { parent: lg, cast: false, ry: s * 0.6 }); }
      K.add(new T.PlaneGeometry(0.02, 0.4), K.mat(0x16161a), 0, 0.45, 0, { parent: lg, cast: false });
      K.cyl(0.02, 0.02, 0.6, woodD, RX + 0.2, 2.55, Z, {}, 4);
      const lh = K.halo(RX + 0.2, 3.0, Z, 0.9, 0xff5020, 0.4);
      const tp = K.pool(tx, tz, 1.2, 0x30c0ff, 0.35, 1.02);
      swayers.push({ sw: lg, ph: 1, a: 0, f: 0, bob: true });
      return { lg, lm, lh, tp, gold: fish[0].f.children[0] };
    })();
    K.tell('peixe', (live) => { kingyo.lm.color.copy(new T.Color(0x30a0ff).multiplyScalar(1.8)); kingyo.lh.material.color.set(0x3080ff).multiplyScalar(0.5); kingyo.gold.material = K.mat(0x16161a); if (live) K.anim(1.2, e => { kingyo.lg.scale.setScalar(1 + Math.sin(e * Math.PI * 3) * 0.2); }); },
      () => { kingyo.lm.color.copy(new T.Color(0xff4a1a).multiplyScalar(1.7)); kingyo.lh.material.color.set(0xff5020).multiplyScalar(0.4); kingyo.gold.material = K.mat(0xf2c14e, { emissive: 0xd9a020, emissiveIntensity: 0.7, metalness: 0.5, roughness: 0.2 }); kingyo.lg.scale.setScalar(1); });
    // --- tiro ao alvo (direita, meio)
    const shateki = (() => {
      const Z = 1.5, g = yatai(RX, Z, RR, { txt: '射的', noren: '#1b6a3a', stripe: '#1b6a3a' });
      // prateleiras de prêmios no fundo (local -z)
      for (let k = 0; k < 3; k++) K.box(2.4, 0.04, 0.3, woodL, 0, 1.4 + k * 0.32, -0.75, { parent: g });
      const pc = [0xff3d7f, 0xffd23f, 0x2ec4b6, 0xff6b2c, 0x9b5de5, 0xf6f3ec, 0x2e8ac8];
      for (let k = 0; k < 3; k++) for (let i = 0; i < 9; i++) { if (k === 2 && i === 4) continue; const c = pc[(i + k * 3) % pc.length]; if ((i + k) % 3) K.box(0.12, 0.16 + (i % 2) * 0.06, 0.08, K.mat(c, { roughness: 0.5 }), -1.05 + i * 0.26, 1.5 + k * 0.32, -0.75, { parent: g, cast: false }); else { K.cyl(0.05, 0.06, 0.14, K.mat(c), -1.05 + i * 0.26, 1.49 + k * 0.32, -0.75, { parent: g, cast: false }, 8); K.sphere(0.05, K.mat(0xf6e0c8), -1.05 + i * 0.26, 1.6 + k * 0.32, -0.75, { parent: g, cast: false }, 8, 6); } }
      // daruma grande no topo (missão)
      const dg = K.group(0, 2.06, -0.75, 0, g);
      K.add(new T.SphereGeometry(0.2, 14, 10).scale(1, 1.1, 0.95), K.mat(0xd8201a, { roughness: 0.35 }), 0, 0.2, 0, { parent: dg });
      K.add(new T.CircleGeometry(0.11, 14), K.mat(0xf6e0c8), 0, 0.26, 0.19, { parent: dg, cast: false });
      for (const s of [-1, 1]) K.sphere(0.025, K.mat(0x16161a), s * 0.045, 0.27, 0.2, { parent: dg, cast: false }, 6, 4);
      K.box(0.12, 0.02, 0.01, K.gold, 0, 0.12, 0.19, { parent: dg, cast: false });
      // alvo redondo na parede do fundo
      const tgtTex = (c) => K.canvasTex(128, 128, (gg, w, h) => { for (let k = 5; k > 0; k--) { gg.fillStyle = k % 2 ? c : '#f6f3ec'; gg.beginPath(); gg.arc(64, 64, k * 12.5, 0, 7); gg.fill(); } });
      const tm = new T.MeshBasicMaterial({ map: tgtTex('#d8201a'), color: new T.Color(0xffffff).multiplyScalar(1.1), toneMapped: false });
      const tgt = K.add(new T.CircleGeometry(0.34, 24), tm, 0.85, 2.0, -0.6, { parent: g, cast: false });
      // espingardas de rolha no balcão
      for (let k = 0; k < 3; k++) { const gun = K.group(-0.8 + k * 0.6, 0.94, 0.5, 0.15 * (k - 1), g); K.box(0.06, 0.05, 0.55, woodM, 0, 0, 0, { parent: gun, cast: false }); K.cyl(0.012, 0.012, 0.4, iron, 0, 0.02, -0.4, { parent: gun, cast: false, rx: Math.PI / 2 }, 6); }
      for (let k = 0; k < 10; k++) K.cyl(0.015, 0.012, 0.03, K.mat(0xc9a36a), 0.9 + (k % 5) * 0.04, 0.93, 0.35 + Math.floor(k / 5) * 0.05, { parent: g, cast: false }, 6);
      // alvo grande sobre o toldo, virado para a rua da frente
      const sg = K.group(RX - 0.1, 2.95, Z + 0.15, -0.25); K.cyl(0.03, 0.03, 0.5, woodD, 0, -0.2, 0, { parent: sg }, 6);
      const big = K.add(new T.CircleGeometry(0.6, 28), tm, 0, 0.55, 0.012, { parent: sg, cast: false }); K.cyl(0.62, 0.62, 0.02, woodD, 0, 0.55, 0, { parent: sg, rx: Math.PI / 2, cast: false }, 28);
      return { dg, tgt, big, sg, tm, blue: new T.MeshBasicMaterial({ map: tgtTex('#2a7ad8'), color: new T.Color(0xffffff).multiplyScalar(1.4), toneMapped: false }) };
    })();
    K.tell('alvo', (live) => { shateki.tgt.material = shateki.blue; shateki.big.material = shateki.blue; if (live) K.anim(1.0, e => { shateki.sg.rotation.z = Math.sin(e * Math.PI * 3) * 0.4 * (1 - e); }); const end = () => { shateki.dg.rotation.x = 1.4; shateki.dg.position.y = 1.86; }; if (live) K.anim(0.9, e => { shateki.dg.rotation.x = e * 1.4; shateki.dg.position.y = 2.06 - e * 0.2; shateki.tgt.scale.setScalar(1 + Math.sin(e * Math.PI) * 0.4); }); else end(); },
      () => { shateki.tgt.material = shateki.tm; shateki.big.material = shateki.tm; shateki.sg.rotation.z = 0; shateki.dg.rotation.x = 0; shateki.dg.position.y = 2.06; shateki.tgt.scale.setScalar(1); });
    // --- maçã do amor e algodão-doce (direita, fundo)
    { const Z = -1.9, g = yatai(RX, Z, RR, { txt: 'りんご飴', noren: '#d84a6a', stripe: '#d84a6a', panel: '#fff0f4', ink: '#d84a6a' });
      const ap = [], st = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) { const x = -1.0 + i * 0.22, z = 0.36 + j * 0.14; ap.push([x, 1.12, z]); st.push([x, 1.0, z]); }
      K.box(1.9, 0.08, 0.5, K.mat(0xf6f3ec), -0.15, 0.95, 0.5, { parent: g });
      K.inst(new T.SphereGeometry(0.055, 10, 8), K.mat(0xd8101a, { roughness: 0.08, metalness: 0.1, emissive: 0x500000, emissiveIntensity: 0.5 }), ap, { parent: g, cast: false });
      K.inst(new T.CylinderGeometry(0.005, 0.005, 0.2, 4), woodL, st, { parent: g, cast: false });
      const bags = []; for (let k = 0; k < 10; k++) bags.push([-1.1 + k * 0.24, 1.75 + (k % 2) * 0.12, -0.6]);
      ['#ff5d8f', '#2ec4b6', '#ffd23f', '#9b5de5', '#ff6b2c'].forEach((c, ci) => K.inst(new T.SphereGeometry(0.1, 10, 8).scale(0.8, 1.2, 0.5), K.mat(c, { roughness: 0.3, emissive: c, emissiveIntensity: 0.25 }), bags.filter((_, k) => k % 5 === ci), { parent: g, cast: false }));
      K.cyl(0.25, 0.18, 0.3, K.silver, 0.95, 1.05, 0.45, { parent: g }, 16); K.sphere(0.16, K.mat(0xffc0d8, { roughness: 1, emissive: 0xff80b0, emissiveIntensity: 0.3 }), 0.95, 1.4, 0.45, { parent: g, cast: false }, 10, 8);
    }

    // ------------------------------------------------------------ cordões de lanternas sobre a rua
    pole(-4.05, 6.4); pole(4.05, 6.4); pole(-4.05, -3.45); pole(4.05, -3.45);
    for (const s of [-1, 1]) string([s * 4.05, 2.9, 6.4], [s * 4.05, 2.9, -3.45], 22, 0.35, s < 0 ? 'rw' : 'wr');
    string([-4.05, 2.9, 6.4], [4.05, 2.9, 6.4], 11, 0.5, 'rrw');
    string([-4.05, 2.9, -3.45], [4.05, 2.9, -3.45], 11, 0.5, 'rrw');
    string([-4.05, 2.75, 3.2], [4.05, 2.75, 3.2], 11, 0.45, 'wwr');
    string([-4.05, 2.75, -0.2], [4.05, 2.75, -0.2], 11, 0.45, 'wwr');
    string([-4.05, 2.9, 6.4], [4.05, 2.75, 3.2], 12, 0.6, 'r', { pools: false });
    string([4.05, 2.9, -3.45], [-4.05, 2.75, -0.2], 12, 0.6, 'r', { pools: false });

    // ------------------------------------------------------------ palco do taiko (yagura baixo) e roda de bon-odori
    { const cx = -11.2, cz = 0.6, hw = 1.5;
      const kh = K.canvasTex(256, 64, (g, w, h) => { for (let k = 0; k < 16; k++) { g.fillStyle = k % 2 ? '#f6f3ec' : '#c8221a'; g.fillRect(k * 16, 0, 16, h); } });
      K.box(hw * 2, 0.9, hw * 2, woodD, cx, 0.45, cz);
      for (const [a, ry] of [[[0, hw + 0.01], 0], [[0, -hw - 0.01], Math.PI], [[hw + 0.01, 0], Math.PI / 2], [[-hw - 0.01, 0], -Math.PI / 2]]) K.add(new T.PlaneGeometry(hw * 2, 0.86), K.texMat(kh, { roughness: 0.85 }), cx + a[0], 0.44, cz + a[1], { ry, cast: false });
      K.box(hw * 2 + 0.1, 0.06, hw * 2 + 0.1, woodL, cx, 0.92, cz);
      for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.box(0.12, 2.5, 0.12, woodM, cx + a * (hw - 0.08), 2.1, cz + b * (hw - 0.08));
      for (const s of [-1, 1]) { K.box(hw * 2, 0.1, 0.1, woodM, cx, 3.3, cz + s * (hw - 0.08)); K.box(0.1, 0.1, hw * 2, woodM, cx + s * (hw - 0.08), 3.3, cz); }
      // grade de lanternas em volta do topo do palco
      const top = []; for (const s of [-1, 1]) for (let k = 0; k < 6; k++) { top.push([cx - hw + 0.25 + k * 0.5, 3.0, cz + s * (hw - 0.08)]); top.push([cx + s * (hw - 0.08), 3.0, cz - hw + 0.25 + k * 0.5]); }
      K.inst(chochinGeo, redLT, top.filter((_, k) => k % 2 === 0), { cast: false }); K.inst(chochinGeo, whiteLT, top.filter((_, k) => k % 2 === 1), { cast: false });
      // bandeirolas nobori
      for (const [x, z, c] of [[cx - hw - 0.4, cz - hw - 0.3, '#c8221a'], [cx + hw + 0.3, cz + hw + 0.4, '#1e3a8b']]) { K.cyl(0.03, 0.03, 3.3, woodD, x, 1.65, z, {}, 6); const f = K.add(new T.PlaneGeometry(0.5, 2.0).translate(0.27, 0, 0), K.texMat(kanjiTex('夏祭', { w: 64, h: 256, bg: c, color: '#ffffff' }), { side: T.DoubleSide }), x, 2.2, z, { cast: false, ry: 0.6 }); swayers.push({ sw: f, ph: x, a: 0, f: 0, flag: true }); K.colR(x, z, 0.1); }
      // tambores pequenos (shime-daiko) no palco
      for (const [x, z] of [[-0.6, -0.5], [0.5, 0.4], [-0.4, 0.6]]) { K.cyl(0.24, 0.24, 0.22, K.mat(0x6a2a10, { roughness: 0.4 }), cx + x, 1.3, cz + z, {}, 16); for (const s of [-1, 1]) K.cyl(0.3, 0.3, 0.03, K.mat(0xe8dcc0), cx + x, 1.3 + s * 0.12, cz + z, {}, 16); K.box(0.06, 0.4, 0.06, woodD, cx + x, 1.0, cz + z); }
      K.col(cx - hw - 0.05, cz - hw - 0.05, cx + hw + 0.05, cz + hw + 0.05);
      // o-daiko em pé no chão, ao lado do palco
      { const dx = -7.8, dz = -1.5, dg = K.group(dx, 0, dz);
        for (const s of [-1, 1]) { K.box(0.1, 1.2, 0.1, woodD, s * 0.35, 0.55, -0.35, { parent: dg, rz: s * 0.3 }); K.box(0.1, 1.2, 0.1, woodD, s * 0.35, 0.55, 0.35, { parent: dg, rz: s * 0.3 }); }
        K.box(0.9, 0.08, 0.8, woodD, 0, 0.05, 0, { parent: dg });
        K.add(new T.CylinderGeometry(0.55, 0.55, 0.8, 22).rotateZ(Math.PI / 2), K.mat(0x7a3418, { roughness: 0.35 }), 0, 1.25, 0, { parent: dg });
        K.add(new T.SphereGeometry(0.6, 22, 8, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.3).rotateZ(Math.PI / 2), K.mat(0x7a3418, { roughness: 0.35 }), 0, 1.25, 0, { parent: dg });
        for (const s of [-1, 1]) { K.add(new T.CircleGeometry(0.5, 22), K.mat(0xe8dcc0, { roughness: 0.8 }), s * 0.42, 1.25, 0, { parent: dg, ry: s * Math.PI / 2, cast: false }); K.torus(0.5, 0.025, brass, s * 0.4, 1.25, 0, { parent: dg, ry: Math.PI / 2, cast: false }, 6, 22); }
        for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; for (const s of [-1, 1]) K.sphere(0.02, brass, s * 0.36, 1.25 + Math.cos(a) * 0.53, Math.sin(a) * 0.53, { parent: dg, cast: false }, 4, 3); }
        K.add(new T.PlaneGeometry(0.4, 0.4), K.texMat(kanjiTex('太鼓', { w: 128, h: 128, horiz: false, bg: '#7a3418', color: '#f6e0a0', size: 54 })), 0, 1.25, 0.58, { parent: dg, cast: false });
        K.col(dx - 0.5, dz - 0.5, dx + 0.5, dz + 0.5); }
      K.plight(cx + 1.2, 3.0, cz, 0xffb070, 1.8, 10);
      K.pool(cx, cz, 4.0, 0xff8040, 0.25);
      // roda de dança em volta do palco
      for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, x = cx + Math.cos(a) * 2.6, z = cz + Math.sin(a) * 2.6; if (Math.hypot(x + 7.8, z + 1.5) < 1.2 || Math.hypot(x + 8.75, z + 1.5) < 0.8 || x < -14.1) continue; K.slot(x, z, x - Math.sin(a), z + Math.cos(a), 'dance'); }
      // cordões radiais do palco até os postes
      pole(-14.0, -4.0, 2.9); pole(-14.0, 5.2, 2.9); pole(-7.2, -4.6, 2.9); pole(-7.2, 6.1, 2.9);
      string([cx - hw, 3.3, cz - hw], [-14.0, 2.8, -4.0], 7, 0.25, 'rw'); string([cx - hw, 3.3, cz + hw], [-14.0, 2.8, 5.2], 7, 0.25, 'wr');
      string([cx + hw, 3.3, cz - hw], [-7.2, 2.8, -4.6], 9, 0.3, 'rw'); string([cx + hw, 3.3, cz + hw], [-7.2, 2.8, 6.1], 9, 0.3, 'wr');
      string([-7.2, 2.8, -4.6], [-4.05, 2.9, -3.45], 5, 0.2, 'r'); string([-7.2, 2.8, 6.1], [-4.05, 2.9, 6.4], 5, 0.2, 'r');
      string([-14.0, 2.8, 5.2], [-7.2, 2.8, 6.1], 11, 0.4, 'rw');
    }
    // geladeira de ramune (balde de madeira com gelo e garrafinhas) e lixeiras
    { const x = -12.6, z = 5.4; K.cyl(0.5, 0.45, 0.55, woodM, x, 0.28, z, {}, 16); for (let k = 0; k < 3; k++) K.torus(0.48, 0.015, iron, x, 0.1 + k * 0.2, z, { rx: Math.PI / 2, cast: false }, 4, 20);
      K.cyl(0.46, 0.46, 0.02, K.mat(0xdff4ff, { roughness: 0.1, transparent: true, opacity: 0.8, emissive: 0x406070, emissiveIntensity: 0.4 }), x, 0.5, z, { cast: false }, 16);
      const bt = []; for (let k = 0; k < 14; k++) { const a = k * 2.4, r = 0.1 + (k % 4) * 0.08; bt.push([x + Math.cos(a) * r, 0.5, z + Math.sin(a) * r, 0, 1, (R() - 0.5) * 0.5, (R() - 0.5) * 0.5]); }
      K.inst(new T.LatheGeometry([[0, 0], [0.03, 0], [0.03, 0.1], [0.018, 0.14], [0.022, 0.17], [0.012, 0.22], [0, 0.22]].map(p => new T.Vector2(p[0], p[1])), 8), K.mat(0x7ad8e0, { roughness: 0.05, transparent: true, opacity: 0.8, emissive: 0x2a8a90, emissiveIntensity: 0.4 }), bt, { cast: false });
      K.add(new T.PlaneGeometry(0.5, 0.2), K.texMat(kanjiTex('ラムネ', { horiz: true, w: 256, h: 96, bg: '#2e8ac8', color: '#ffffff', size: 64 })), x, 0.32, z + 0.48, { cast: false, rx: -0.08 });
      K.colR(x, z, 0.5);
      for (const [bx, bz, c] of [[-13.9, 3.6, 0x2e6a3a], [-13.9, 4.2, 0x2e4fa8]]) { K.cyl(0.22, 0.2, 0.7, K.mat(c), bx, 0.35, bz, {}, 12); K.cyl(0.23, 0.23, 0.04, K.mat(0x16161a), bx, 0.71, bz, {}, 12); K.colR(bx, bz, 0.22); }
      K.slot(-12.6, 6.2, -12.6, 5.4, 'talk'); K.slot(-11.8, 5.2, -12.6, 5.4, 'talk');
    }

    // ------------------------------------------------------------ chōzuya (fonte de purificação) no canto esquerdo do fundo
    { const x = -11.8, z = -8.0, g = K.group(x, 0, z);
      K.box(1.8, 0.6, 0.8, stoneG, 0, 0.3, 0, { parent: g }); K.box(1.6, 0.02, 0.6, K.mat(0x2a8a8a, { roughness: 0.05, metalness: 0.3, emissive: 0x0a4a4a, emissiveIntensity: 0.6 }), 0, 0.57, 0, { parent: g, cast: false });
      for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.cyl(0.08, 0.08, 2.4, woodM, a * 1.1, 1.2, b * 0.6, { parent: g }, 8);
      roof(2.8, 2.0, 0.55, 0, 2.35, 0, { parent: g, t: 0.08, up: 0.1 });
      // dragão de bronze cuspindo água
      const dr = K.group(-0.7, 0.75, 0, 0, g); K.add(new T.SphereGeometry(0.12, 8, 6).scale(1.6, 0.8, 0.8), bronze, 0, 0, 0, { parent: dr }); K.cone(0.05, 0.14, bronze, 0.1, 0.08, 0, { parent: dr, rz: -0.6 }, 5); K.sphere(0.025, K.glow(0x60ff90, 1.4), 0.12, 0.04, 0.06, { parent: dr, cast: false }, 6, 4);
      const jet = K.cyl(0.015, 0.03, 0.2, new T.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.7 }), -0.48, 0.66, 0, { parent: g, cast: false, rz: 0.6 }, 6);
      K.tick((dt, t) => { jet.scale.set(1 + Math.sin(t * 20) * 0.15, 1, 1 + Math.cos(t * 17) * 0.15); jet.material.opacity = 0.55 + Math.sin(t * 13) * 0.15; });
      // conchas de bambu (hishaku)
      for (let k = 0; k < 5; k++) { K.cyl(0.04, 0.04, 0.07, bambooDry, -0.2 + k * 0.18, 0.64, 0.25, { parent: g, cast: false }, 8); K.cyl(0.008, 0.008, 0.4, bambooDry, -0.2 + k * 0.18, 0.62, 0.05, { parent: g, cast: false, rx: Math.PI / 2 - 0.15 }, 4); }
      K.col(x - 1.2, z - 0.7, x + 1.2, z + 0.7);
      K.plight(x, 2.0, z + 0.8, 0x9fd8ff, 0.7, 5); K.pool(x, z, 1.4, 0x60c0ff, 0.2);
      K.slot(x - 0.5, z + 1.05, x - 0.5, z, 'talk'); K.slot(x + 0.5, z + 1.05, x + 0.5, z, 'talk');
      toro(-13.9, -6.0, 0, 0.8); K.colR(-13.9, -6.0, 0.3); toro(-9.6, -9.3, 0, 0.8); K.colR(-9.6, -9.3, 0.3);
    }

    // ------------------------------------------------------------ campanário com grande sino (direita, fundo)
    const bell = (() => {
      const x = 11.8, z = -8.2;
      K.box(2.6, 0.3, 2.4, stoneG, x, 0.15, z);
      for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.box(0.16, 2.9, 0.16, verm, x + a * 1.1, 1.6, z + b * 1.0, { rz: -a * 0.04 });
      K.box(2.6, 0.16, 0.2, verm, x, 2.95, z); K.box(2.6, 0.12, 0.16, verm, x, 2.4, z - 1.0); K.box(2.6, 0.12, 0.16, verm, x, 2.4, z + 1.0);
      roof(3.0, 2.8, 0.5, x, 3.0, z, { t: 0.08, up: 0.12 });
      const bg = K.group(x, 2.85, z);
      K.lathe([[0, -0.02], [0.08, -0.02], [0.12, -0.12], [0.38, -0.2], [0.42, -0.5], [0.44, -1.2], [0.48, -1.32], [0.4, -1.32], [0, -1.32]], bronze, 0, 0, 0, { parent: bg }, 20);
      const band = K.torus(0.445, 0.025, K.metal(0x6a7a4a, 0.4), 0, -0.85, 0, { parent: bg, rx: Math.PI / 2, cast: false }, 6, 24);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; K.sphere(0.025, bronze, Math.cos(a) * 0.4, -0.35 - r * 0.1, Math.sin(a) * 0.4, { parent: bg, cast: false }, 4, 3); }
      const ring = K.halo(x, 3.9, z, 1.7, 0xffd070, 0.0);
      // tronco batedor (shumoku)
      const sg = K.group(x, 2.3, z + 0.3, 0);
      const log = K.cyl(0.09, 0.09, 1.3, woodL, 0, -0.55, 0.7, { parent: sg, rx: Math.PI / 2 }, 10);
      for (const s of [-0.4, 0.4]) K.cyl(0.006, 0.006, 0.6, rope, 0, -0.27, 0.7 + s, { parent: sg, cast: false }, 3);
      const pull = K.cyl(0.02, 0.02, 1.2, K.mat(0xf6f3ec), 0, -1.1, 1.35, { parent: sg, cast: false }, 4);
      K.col(x - 1.3, z - 1.2, x + 1.3, z + 1.2);
      K.slot(x - 1.2, z + 1.75, x, z, 'view'); K.slot(x + 1.0, z + 1.75, x, z, 'view');
      const bandMat = band.material;
      return { bg, ring, sg, band, bandMat };
    })();
    K.tell('gongo', (live) => { bell.ring.material.color.set(0xffd070).multiplyScalar(0.55); bell.band.material = K.glow(0xffc040, 2.2); if (live) K.anim(2.4, (e, u) => { bell.sg.rotation.x = Math.sin(u * Math.PI) * 0.5; bell.bg.rotation.x = Math.sin(u * 18) * 0.12 * (1 - u) + 0.15 * u; bell.ring.scale.setScalar(3.4 + Math.sin(u * 30) * 0.8); }); else { bell.bg.rotation.x = 0.15; bell.sg.rotation.x = 0; } },
      () => { bell.ring.material.color.set(0x000000); bell.band.material = bell.bandMat; bell.bg.rotation.x = 0; bell.sg.rotation.x = 0; bell.ring.scale.setScalar(3.4); });

    // ------------------------------------------------------------ árvores (bordos e cerejeira) baixas
    const tree = (x, z, s, cols, o = {}) => {
      const g = K.group(x, o.y || 0, z, R() * 6);
      K.cyl(0.07 * s, 0.12 * s, 1.5 * s, K.mat(0x3a2a1e, { roughness: 0.9 }), 0, 0.75 * s, 0, { parent: g }, 7);
      for (let k = 0; k < 3; k++) K.cyl(0.03 * s, 0.05 * s, 0.8 * s, K.mat(0x3a2a1e), Math.cos(k * 2.1) * 0.25 * s, 1.5 * s, Math.sin(k * 2.1) * 0.25 * s, { parent: g, rz: Math.cos(k * 2.1) * 0.6, rx: -Math.sin(k * 2.1) * 0.6 }, 5);
      const n = o.n || 7; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, r = (0.35 + R() * 0.4) * s; K.add(new T.IcosahedronGeometry((0.45 + R() * 0.25) * s, 0), K.mat(cols[k % cols.length], { roughness: 0.85, flatShading: true }), Math.cos(a) * r, (1.9 + R() * 0.7) * s, Math.sin(a) * r, { parent: g }); }
      if (o.col !== false) K.colR(x, z, 0.25 * s, o.lv || 0);
      return g;
    };
    const maple = [0xb8321a, 0xd8501a, 0x8a2a1a, 0x5a7a2a], green = [0x3f6b34, 0x4f7a3a, 0x2f5a2a], sakura = [0xf2a8c0, 0xe890b0, 0xf8c8d8];
    tree(13.8, -2.2, 1.15, maple); tree(12.6, 6.4, 0.95, green); tree(-13.9, -2.4, 1.1, sakura); tree(7.6, -5.6, 0.95, maple); tree(-7.8, -5.9, 1.0, green); tree(-14.0, 8.1 + 1.6, 0.9, maple, { col: false });

    // ------------------------------------------------------------ árvore dos omikuji (direita)
    const omikuji = (() => {
      const x = 10.2, z = -3.2;
      for (const s of [-1, 1]) K.box(0.08, 1.5, 0.08, woodM, x + s * 1.0, 0.75, z);
      const ropes = []; for (let r = 0; r < 3; r++) { K.cyl(0.006, 0.006, 2.0, rope, x, 0.75 + r * 0.3, z, { rz: Math.PI / 2, cast: false }, 3); for (let k = 0; k < 22; k++) ropes.push([x - 0.95 + k * 0.09 + R() * 0.02, 0.75 + r * 0.3 - 0.02, z + (R() - 0.5) * 0.04, R() * 0.4 - 0.2, 1, 0, (R() - 0.5) * 0.6]); }
      K.inst(new T.BoxGeometry(0.035, 0.09, 0.012), K.mat(0xf6f3ec, { roughness: 0.9, emissive: 0x333333 }), ropes, { cast: false });
      K.add(new T.PlaneGeometry(0.4, 0.7), K.texMat(kanjiTex('おみくじ', { w: 64, h: 256, bg: '#f6f0e0', color: '#c8221a' })), x + 1.2, 1.1, z + 0.05, { cast: false });
      K.box(0.06, 1.4, 0.06, woodD, x + 1.2, 0.7, z);
      K.col(x - 1.1, z - 0.2, x + 1.1, z + 0.2);
      // pinheiro baixo atrás com papéis amarrados (à esquerda do arco: à direita ele tapava o campanário para o sniper)
      const pg = K.group(x - 0.8, 0, z - 1.1);
      K.cyl(0.1, 0.15, 1.7, K.mat(0x4a3a2a), 0, 0.85, 0, { parent: pg }, 7);
      for (const [a, y, r] of [[0, 1.8, 0.9], [2.1, 2.3, 0.7], [4.2, 2.0, 0.8], [1.0, 2.8, 0.5]]) K.add(new T.SphereGeometry(r, 9, 6).scale(1, 0.4, 1), K.mat(0x23402a, { roughness: 0.9 }), Math.cos(a) * 0.4, y, Math.sin(a) * 0.4, { parent: pg });
      const pp = []; for (let k = 0; k < 40; k++) { const a = R() * 6.28, r = 0.3 + R() * 0.6; pp.push([x - 0.8 + Math.cos(a) * r, 1.7 + R() * 0.9, z - 1.1 + Math.sin(a) * r, R() * 3, 1]); }
      K.inst(new T.BoxGeometry(0.04, 0.1, 0.012), K.mat(0xf6f3ec, { emissive: 0x444444 }), pp, { cast: false });
      K.colR(x - 0.8, z - 1.1, 0.3);
      // o omikuji vermelho (missão): faixa longa que tremula
      const rg = K.group(x - 0.8, 3.35, z - 0.5); rg.scale.setScalar(0.001);
      const strip = K.add(new T.PlaneGeometry(0.3, 1.4).translate(0, -0.7, 0), new T.MeshBasicMaterial({ color: new T.Color(0xff2a1a).multiplyScalar(1.4), side: T.DoubleSide, toneMapped: false }), 0, 0, 0, { parent: rg, cast: false });
      K.box(0.2, 0.06, 0.06, K.mat(0xff2a1a), 0, 0, 0, { parent: rg, cast: false });
      K.tick((dt, t) => { strip.rotation.x = Math.sin(t * 3.1) * 0.25; strip.rotation.y = Math.sin(t * 1.7) * 0.4; });
      K.slot(x - 0.7, z + 0.7, x - 0.7, z, 'talk'); K.slot(x + 0.6, z + 0.8, x + 0.6, z, 'talk');
      return rg;
    })();
    K.tell('omikuji', (live) => { if (live) K.anim(0.8, e => omikuji.scale.setScalar(Math.max(0.001, e))); else omikuji.scale.setScalar(1); }, () => omikuji.scale.setScalar(0.001));

    // ------------------------------------------------------------ bancos vermelhos com guarda-sóis (nodate-gasa)
    { const benches = [[8.6, -0.8, 0], [8.6, 3.1, 0], [12.0, 1.4, Math.PI / 2]];
      const feltM = K.mat(0xc8221a, { roughness: 0.95 });
      const umbTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#c8221a'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,220,180,.35)'; g.lineWidth = 2; for (let k = 0; k < 24; k++) { g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + Math.cos(k / 24 * 6.28) * 180, h / 2 + Math.sin(k / 24 * 6.28) * 180); g.stroke(); } g.strokeStyle = 'rgba(255,240,220,.6)'; g.lineWidth = 6; g.beginPath(); g.arc(w / 2, h / 2, 60, 0, 7); g.stroke(); });
      benches.forEach(([x, z, ry]) => { const g = K.group(x, 0, z, ry);
        K.box(1.8, 0.08, 0.55, woodM, 0, 0.42, 0, { parent: g }); K.box(1.84, 0.03, 0.62, feltM, 0, 0.475, 0, { parent: g }); K.box(1.84, 0.25, 0.02, feltM, 0, 0.36, 0.31, { parent: g, cast: false });
        for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.box(0.06, 0.4, 0.06, woodD, a * 0.82, 0.2, b * 0.22, { parent: g });
        K.cyl(0.18, 0.08, 0.08, K.mat(0x2a2a2a), 0.5, 0.52, -0.05, { parent: g, cast: false }, 12); K.cyl(0.035, 0.03, 0.07, K.mat(0x4a7a3a), 0.4, 0.53, 0.05, { parent: g, cast: false }, 8);
        K.box(0.22, 0.03, 0.14, K.mat(0xf6f3ec), -0.4, 0.51, 0.05, { parent: g, cast: false }); for (let k = 0; k < 3; k++) K.sphere(0.03, K.mat([0xff9ac0, 0xf6f3ec, 0x7ac05a][k]), -0.47 + k * 0.07, 0.54, 0.05, { parent: g, cast: false }, 6, 4);
        K.cyl(0.025, 0.025, 2.5, woodL, 0, 1.25, -0.45, { parent: g }, 6);
        K.add(new T.ConeGeometry(1.5, 0.55, 24, 1, true), K.texMat(umbTex, { side: T.DoubleSide, roughness: 0.9, emissive: 0x401010, emissiveIntensity: 0.4 }), 0, 2.45, -0.45, { parent: g });
        const a = L2W(x, z, ry, -0.9, -0.3), b = L2W(x, z, ry, 0.9, 0.3); K.col(a[0], a[1], b[0], b[1]);
        for (const lx of [-0.45, 0.45]) { const p = L2W(x, z, ry, lx, 0.02), f = L2W(x, z, ry, lx, 1); K.slot(p[0], p[1], f[0], f[1], 'sit'); } });
      K.pool(9.8, 1.2, 3.5, 0xffa060, 0.22);
      K.slot(10.4, 0.3, 9.6, 1.6, 'talk'); K.slot(10.6, 2.6, 9.6, 1.6, 'talk'); K.slot(7.2, 1.2, 9, 1.2, 'talk');
    }
    // kakigori (raspadinha de gelo) na lateral direita
    { const X = 13.55, Z = 4.4, g = yatai(X, Z, RR, { txt: 'かき氷', noren: '#2e8ac8', stripe: '#2e8ac8', panel: '#f6f6ff', ink: '#2e5fa8', slots: [-0.6, 0.6] });
      K.cyl(0.12, 0.12, 0.35, K.mat(0xc8221a), -0.6, 1.08, 0.5, { parent: g }, 10); K.box(0.32, 0.06, 0.32, K.mat(0xc8221a), -0.6, 1.3, 0.5, { parent: g }); K.cyl(0.02, 0.02, 0.35, iron, -0.6, 1.5, 0.5, { parent: g }, 6);
      for (let k = 0; k < 5; k++) K.lathe([[0, 0], [0.03, 0], [0.03, 0.18], [0.012, 0.24], [0, 0.24]], K.mat([0xff2a3a, 0x2ac0ff, 0x3ad84a, 0xffd23f, 0xff8ab0][k], { roughness: 0.1, transparent: true, opacity: 0.85, emissive: [0xff2a3a, 0x2ac0ff, 0x3ad84a, 0xffd23f, 0xff8ab0][k], emissiveIntensity: 0.35 }), 0.1 + k * 0.12, 0.91, 0.62, { parent: g, cast: false }, 8);
      for (let k = 0; k < 3; k++) { K.cyl(0.06, 0.04, 0.07, K.mat(0xf6f3ec, { transparent: true, opacity: 0.7 }), 0.85 + k * 0.0, 0.95, 0.3 + k * 0.15, { parent: g, cast: false }, 10); K.sphere(0.06, K.mat([0xff6a8a, 0x6ad0ff, 0x8ae06a][k], { roughness: 0.9 }), 0.85, 1.0, 0.3 + k * 0.15, { parent: g, cast: false }, 8, 6); }
      // bandeira 氷
      const ft = K.canvasTex(128, 128, (gg, w, h) => { gg.fillStyle = '#f6f6ff'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#2e5fa8'; gg.beginPath(); for (let x = 0; x <= w; x += 8) gg.lineTo(x, h - 26 + Math.sin(x * 0.12) * 6); gg.lineTo(w, h); gg.lineTo(0, h); gg.fill(); gg.fillStyle = '#d8101a'; gg.font = `700 76px ${JP}`; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText('氷', w / 2, h / 2 - 8); });
      const fl = K.add(new T.PlaneGeometry(0.7, 0.7), K.texMat(ft, { side: T.DoubleSide, emissive: 0x404050, emissiveIntensity: 0.6 }), 0, 2.15, 1.3, { parent: g, cast: false, ry: 0 });
      swayers.push({ sw: fl, ph: 2, a: 0, f: 0, flag: true });
    }

    // ------------------------------------------------------------ riacho com ponte vermelha arqueada
    const waterTex = K.canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#0c2630'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 700; k++) { const x = R() * w, y = R() * h, l = 10 + R() * 40; g.strokeStyle = `rgba(${130 + R() * 80},${180 + R() * 60},${190 + R() * 50},${0.06 + R() * 0.14})`; g.lineWidth = 1 + R() * 1.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 2, x + l, y); g.stroke(); }
    }, [10, 1]);
    const waterM = new T.MeshStandardMaterial({ color: 0x2a6a72, map: waterTex, roughness: 0.1, metalness: 0.35, envMapIntensity: 1.1, emissive: 0x0a2a32, emissiveIntensity: 0.7 });
    K.add(new T.PlaneGeometry(90, 1.6).rotateX(-Math.PI / 2), waterM, 0, -0.28, 7.8, { cast: false });
    K.add(new T.PlaneGeometry(90, 1.6).rotateX(-Math.PI / 2), K.mat(0x1a1612, { roughness: 1 }), 0, -0.45, 7.8, { cast: false });
    K.tick((dt, t) => { waterTex.offset.x = -t * 0.06; });
    for (const z of [7.0, 8.6]) { K.box(90, 0.3, 0.12, stoneD, 0, -0.14, z, { cast: false }); }
    { const rk = []; for (let k = 0; k < 120; k++) { const z = R() < 0.5 ? 7.0 + R() * 0.12 : 8.48 + R() * 0.12; rk.push([-16 + R() * 32, -0.02, z, R() * 6, 0.12 + R() * 0.14]); }
      K.inst(new T.DodecahedronGeometry(1, 0).scale(1.3, 0.6, 1), K.mat(0x7a756c, { roughness: 0.95, flatShading: true }), rk); }
    for (let k = 0; k < 18; k++) K.pool(-14 + k * 1.7 + R(), 7.8, 0.5 + R() * 0.4, k % 3 ? 0xffa050 : 0xff5030, 0.2, -0.26);
    K.col(-14.5, 6.95, -10.65, 8.65); K.col(-9.35, 6.95, -1.45, 8.65); K.col(1.45, 6.95, 14.5, 8.65);
    // vaga-lumes (hotaru) dançando sobre o riacho
    { const n = 40, pos = new Float32Array(n * 3), seeds = []; for (let k = 0; k < n; k++) seeds.push([-14 + R() * 28, 7.0 + R() * 2.2, R() * 6, 0.3 + R() * 0.5]);
      const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.BufferAttribute(pos, 3));
      const pm = new T.PointsMaterial({ color: new T.Color(0xc8ff60).multiplyScalar(2), map: K.radialTex, size: 0.22, transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false });
      K.root.add(new T.Points(gg, pm));
      K.tick((dt, t) => { seeds.forEach(([x, z, ph, sp], k) => { pos[k * 3] = x + Math.sin(t * sp + ph) * 0.8; pos[k * 3 + 1] = 0.4 + Math.sin(t * sp * 1.7 + ph * 2) * 0.3 + 0.3; pos[k * 3 + 2] = z + Math.cos(t * sp * 0.8 + ph) * 0.5; }); gg.attributes.position.needsUpdate = true; pm.opacity = 0.75 + Math.sin(t * 3) * 0.2; }); }
    // carpas (koi) no riacho: nadam devagar de um lado para o outro e se juntam embaixo da ponte quando alguém para nela
    { const kg = new T.SphereGeometry(0.07, 8, 5).scale(1, 0.45, 2.6), cauda = new T.ConeGeometry(0.07, 0.14, 4).rotateX(-Math.PI / 2).scale(1, 0.25, 1).translate(0, 0, -0.24);
      const geo = K.juntar([[kg, 0], [cauda, 0]]); geo.deleteAttribute('color');
      const cores = [0xf06a1e, 0xf4f0ea, 0xe8b830], peixes = [], ims = cores.map(c => { const m = new T.InstancedMesh(geo, K.mat(c, { roughness: 0.4 }), 4); m.frustumCulled = false; m.userData.noCol = true; m.raycast = () => { }; m.castShadow = false; K.root.add(m); return m; });
      const r = K.rng(4242); for (let k = 0; k < 12; k++) peixes.push({ c: k % 3, i: Math.floor(k / 3), x: -13 + r() * 26, z: 7.25 + r() * 1.1, tx: 0, tz: 7.8, v: 0.25 + r() * 0.15, ph: r() * 6.28, esp: 0 });
      peixes.forEach(p => { p.tx = p.x; p.tz = p.z; });
      const q = new T.Object3D(); let chk = 0, ponte = false;
      K.tick((dt, t) => { dt = Math.min(dt, 0.1); chk -= dt; if (chk <= 0) { chk = 0.4; ponte = K.perto(0, 7.8, 1.4, 0) > 0; }
        for (const p of peixes) {
          const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz);
          if (d < 0.1) { if (ponte) { p.tx = (r() - 0.5) * 2.2; p.tz = 7.3 + r() * 1.0; } else { p.tx = Math.max(-14, Math.min(14, p.x + (r() < 0.5 ? -1 : 1) * (2 + r() * 6))); p.tz = 7.25 + r() * 1.1; } }
          else if (ponte && Math.abs(p.tx) > 1.2) { p.tx = (r() - 0.5) * 2.2; p.tz = 7.3 + r() * 1.0; }
          const sp = (ponte ? 0.7 : p.v) * Math.min(1, d * 2), ang = Math.atan2(dx, dz);
          p.x += Math.sin(ang) * sp * dt; p.z += Math.cos(ang) * sp * dt;
          q.position.set(p.x, -0.262, p.z); q.rotation.set(0, ang + Math.sin(t * 5 + p.ph) * 0.15, 0); q.scale.setScalar(1 + (p.c === 1 ? 0.1 : 0)); q.updateMatrix(); ims[p.c].setMatrixAt(p.i, q.matrix);
        }
        ims.forEach(m => m.instanceMatrix.needsUpdate = true); });
    }
    // shishi-odoshi na beira do riacho, de perfil para o sniper: o bambu enche com a bica, vira, despeja e bate na pedra (~7 s)
    { const g = K.group(-6.5, -0.05, 8.25, -Math.PI / 2), bambu = K.mat(0x8a9a4a, { roughness: 0.6 }), bambuV = K.mat(0x6a7a32, { roughness: 0.6 });
      for (const sx of [-1, 1]) K.box(0.05, 0.85, 0.05, woodM, sx * 0.1, 0.43, 0, { parent: g });
      K.add(new T.DodecahedronGeometry(0.17), stoneG, 0, 0.36, 0.4, { parent: g, s: [1, 1.9, 1] });
      const tb = K.group(0, 0.8, 0, 0, g); K.cyl(0.055, 0.055, 0.95, bambu, 0, 0, -0.12, { parent: tb, rx: Math.PI / 2 }, 8);
      for (const z of [-0.2, 0.18]) K.cyl(0.062, 0.062, 0.03, bambuV, 0, 0, z, { parent: tb, rx: Math.PI / 2 }, 8);
      K.cyl(0.035, 0.04, 1.3, bambuV, 0, 0.62, 0.62, { parent: g }, 6); K.cyl(0.03, 0.03, 1.09, bambu, 0, 1.2, 0.085, { parent: g, rx: -1.75 }, 6); // a bica (kakehi)
      const fio = K.cyl(0.008, 0.008, 0.22, new T.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.6 }), 0, 1.05, -0.45, { parent: g, cast: false }, 4);
      const resp = K.add(new T.RingGeometry(0.05, 0.16, 12).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ color: 0xdff4ff, transparent: true, opacity: 0, depthWrite: false }), -5.93, -0.27, 8.25, { cast: false });
      [g, resp].forEach(o => o.traverse(m => { m.userData.noCol = true; }));
      K.tick((dt, t) => { const u = t % 7; let a;
        if (u < 5.6) a = 0.32 - (u / 5.6) * 0.22; else if (u < 5.9) a = 0.1 - ((u - 5.6) / 0.3) * 0.75; else if (u < 6.3) a = -0.65; else { const v = (u - 6.3) / 0.7; a = -0.65 + Math.min(1, v * 2.2) * 0.97 + (v > 0.45 ? Math.sin((v - 0.45) * 30) * 0.05 * (1 - v) : 0); }
        tb.rotation.x = a; fio.visible = u < 5.6;
        const sp = u > 5.75 && u < 6.6 ? (u - 5.75) / 0.85 : -1; resp.material.opacity = sp >= 0 ? 0.7 * (1 - sp) : 0; resp.scale.setScalar(sp >= 0 ? 0.6 + sp * 2.2 : 1); });
    }
    // pedras de travessia
    for (const z of [7.2, 7.65, 8.1, 8.5]) K.cyl(0.4, 0.45, 0.32, stoneG, -10.0 + (z === 7.65 ? 0.12 : -0.05), -0.15, z, {}, 9);
    // ponte arqueada vermelha (taiko-bashi)
    { const z0 = 6.5, z1 = 9.1, L = z1 - z0, H = 0.12, arcY = (u) => Math.sin(u * Math.PI) * H;
      for (let k = 0; k < 14; k++) { const u = (k + 0.5) / 14, z = z0 + u * L; K.box(2.5, 0.07, L / 14 + 0.01, woodM, 0, arcY(u) + 0.02, z, { rx: -Math.cos(u * Math.PI) * H * Math.PI / L, cast: false }).userData.noCol = true; } // o tabuleiro é chão: dá para atravessar
      // viga em arco por baixo
      for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push(new T.Vector3(s * 1.15, -0.3 + Math.sin(u * Math.PI) * 0.55, z0 - 0.2 + u * (L + 0.4))); } K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 16, 0.07, 6), verm, 0, 0, 0); }
      // guarda-corpo com giboshi de latão
      for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push(new T.Vector3(s * 1.28, 0.75 + arcY(u) * 1.2, z0 + u * L)); } K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 16, 0.045, 6), verm, 0, 0, 0);
        const pts2 = pts.map(p => new T.Vector3(p.x, p.y - 0.32, p.z)); K.add(new T.TubeGeometry(new T.CatmullRomCurve3(pts2), 16, 0.03, 5), verm, 0, 0, 0);
        for (let k = 0; k <= 5; k++) { const u = k / 5, z = z0 + u * L, y = arcY(u); K.box(0.1, 0.8, 0.1, verm, s * 1.28, y + 0.4, z); if (k === 0 || k === 5) { K.lathe([[0, 0], [0.07, 0], [0.09, 0.06], [0.06, 0.14], [0.02, 0.22], [0, 0.26]], brass, s * 1.28, y + 0.8, z, {}, 10); } } }
      K.col(-1.5, z0, -1.2, z1); K.col(1.2, z0, 1.5, z1);
      K.plight(0, 2.4, 8.3, 0xffb070, 1.0, 8);
      K.slot(-0.7, 7.4, -3, 7.4, 'view');
    }
    // lanterna flutuante (tōrō nagashi) — missão
    const floatL = (() => {
      K.box(1.0, 0.06, 0.9, woodM, 6.5, -0.04, 8.45, { cast: false }); for (const s of [-1, 1]) K.cyl(0.05, 0.05, 0.5, woodD, 6.5 + s * 0.45, -0.25, 8.05, {}, 6);
      const g = K.group(6.5, 0.0, 8.75);
      K.box(0.32, 0.05, 0.32, woodL, 0, 0.03, 0, { parent: g });
      const pm = K.mat(0xf6f0e0, { roughness: 0.9 }), lit = new T.MeshBasicMaterial({ map: kanjiTex('祈', { w: 64, h: 64, bg: '#fff0d0', color: '#c8221a', size: 44 }), color: new T.Color(0xffffff).multiplyScalar(1.8), toneMapped: false });
      const box = K.box(0.26, 0.28, 0.26, pm, 0, 0.2, 0, { parent: g, cast: false });
      K.box(0.3, 0.03, 0.3, woodD, 0, 0.35, 0, { parent: g });
      const halo = K.halo(0, 0.3, 0, 1.2, 0xffb040, 0.0, g);
      const pool = K.pool(0, 0, 0.9, 0xffa040, 0.0, 0.01, g);
      for (let k = 0; k < 4; k++) { const b = K.group(7.4 + k * 0.38, -0.02, 8.95 + (k % 2) * 0.12); K.box(0.26, 0.04, 0.26, woodL, 0, 0.02, 0, { parent: b }); K.box(0.2, 0.22, 0.2, pm, 0, 0.15, 0, { parent: b, cast: false }); }
      let floating = false;
      K.tick((dt, t) => { if (floating) { g.position.y = -0.24 + Math.sin(t * 1.8) * 0.02; g.rotation.y = Math.sin(t * 0.4) * 0.3; } });
      return { g, box, pm, lit, halo, pool, set(f) { floating = f; } };
    })();
    K.tell('lanterna', (live) => { floatL.box.material = floatL.lit; floatL.halo.material.color.set(0xffb040).multiplyScalar(0.7); floatL.pool.material.color.set(0xffa040).multiplyScalar(0.5);
      const end = () => { floatL.g.position.set(9.0, -0.24, 7.75); floatL.set(true); };
      if (live) K.anim(3.0, e => { floatL.g.position.set(6.5 + e * 2.5, 0.0 - Math.min(1, e * 4) * 0.24, 8.75 - Math.min(1, e * 3) * 1.0); if (e >= 1) end(); }); else end(); },
      () => { floatL.set(false); floatL.box.material = floatL.pm; floatL.halo.material.color.set(0x000000); floatL.pool.material.color.set(0x000000); floatL.g.position.set(6.5, 0.0, 8.75); floatL.g.rotation.y = 0; });

    // ------------------------------------------------------------ margem da frente: lanternas de pedra, hortênsias, cerca de bambu
    const bigToro = toro(-4.2, 10.2, 0, 1.0, true); K.colR(-4.2, 10.2, 0.4);
    const toroLight = K.plight(-4.2, 1.4, 9.6, 0xffa850, 0.9, 5);
    const toroPool = K.pool(-4.2, 10.2, 1.6, 0xffa850, 0.5);
    const toroFlame = K.flame(-4.2, 1.18, 10.2, 0.05);
    const toroWin = bigToro.win.material;
    K.tell('toro', (live) => { bigToro.win.material = K.mat(0x14100c); toroFlame.visible = false; if (live) K.anim(1.0, e => { toroLight.intensity = 0.9 * (1 - e) * (Math.sin(e * 40) > 0 ? 1 : 0.3); toroPool.material.opacity = 1 - e; }); else { toroLight.intensity = 0; toroPool.material.opacity = 0; } },
      () => { bigToro.win.material = toroWin; toroFlame.visible = true; toroLight.intensity = 0.9; toroPool.material.opacity = 1; });
    toro(4.2, 10.2, 0, 1.0, true); K.colR(4.2, 10.2, 0.4); K.pool(4.2, 10.2, 1.4, 0xffa850, 0.4); K.flame(4.2, 1.18, 10.2, 0.05);
    { // cerca de bambu baixa (fora da área, na beira da frente)
      const bb = []; for (let x = -14.4; x <= 14.4; x += 0.11) bb.push([x, 0.45, 11.35, 0, [1, 0.9 + Math.sin(x * 9) * 0.05, 1]]);
      K.inst(new T.CylinderGeometry(0.045, 0.045, 1, 6), bambooDry, bb);
      for (const y of [0.3, 0.7]) K.box(28.8, 0.05, 0.05, K.mat(0x3a2a1e), 0, y, 11.42);
      for (let x = -14.4; x <= 14.4; x += 1.8) K.box(0.08, 0.95, 0.08, woodD, x, 0.47, 11.44);
      // cercas laterais baixas
      for (const s of [-1, 1]) { const sb = []; for (let z = -9.8; z <= 6.9; z += 0.11) sb.push([s * 14.65, 0.42, z, 0, [1, 0.84, 1]]); for (let z = 8.7; z <= 11.3; z += 0.11) sb.push([s * 14.65, 0.42, z, 0, [1, 0.84, 1]]); K.inst(new T.CylinderGeometry(0.04, 0.04, 1, 6), bambooDry, sb); }
    }
    { // hortênsias (ajisai) e bambus baixos ao longo da margem
      const cols = [0x5a7ad8, 0x8a6ad8, 0xd88ac8, 0x6a9ae8];
      cols.forEach((c, ci) => { const l = []; for (let k = 0; k < 26; k++) { const x = -14 + R() * 28; if (Math.abs(x) < 1.8 || Math.abs(x - 6.5) < 0.8 || Math.abs(x + 4.2) < 0.7 || Math.abs(x - 4.2) < 0.7 || Math.abs(x + 10) < 0.8) continue; if (k % 4 !== ci) continue; l.push([x, 0.32, 10.85 + R() * 0.25, R() * 6, 0.9 + R() * 0.4]); }
        K.inst(new T.IcosahedronGeometry(0.2, 0), K.mat(c, { roughness: 0.9, flatShading: true, emissive: c, emissiveIntensity: 0.12 }), l); });
      const lv = []; for (let k = 0; k < 60; k++) lv.push([-14 + R() * 28, 0.18, 10.8 + R() * 0.35, R() * 6, 0.8 + R() * 0.5]); K.inst(new T.IcosahedronGeometry(0.2, 0), K.mat(0x2f5a2a, { flatShading: true }), lv);
      K.col(-14.5, 10.75, 14.5, 11.2);
    }
    [[-12.2, 9.4], [-8.0, 9.4], [-6.4, 9.4], [-2.4, 9.4], [3.2, 9.3], [8.8, 9.4], [10.6, 9.4], [12.6, 9.4]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), 7.8, 'view'));
    // cordões de lanternas ao longo do riacho
    pole(-14.0, 6.4, 2.9); pole(7.2, 6.2, 2.9); pole(14.0, 6.3, 2.9); pole(14.0, -4.4, 2.9); pole(7.2, -4.6, 2.9);
    string([-14.0, 2.8, 6.4], [-7.2, 2.8, 6.1], 10, 0.35, 'rw');
    string([4.05, 2.9, 6.4], [7.2, 2.8, 6.2], 5, 0.2, 'r'); string([7.2, 2.8, 6.2], [14.0, 2.8, 6.3], 10, 0.35, 'wr');
    string([4.05, 2.9, -3.45], [7.2, 2.8, -4.6], 5, 0.2, 'r'); string([7.2, 2.8, -4.6], [14.0, 2.8, -4.4], 10, 0.35, 'rw');
    string([7.2, 2.8, 6.2], [7.2, 2.8, -4.6], 14, 0.45, 'wr'); string([14.0, 2.8, 6.3], [14.0, 2.8, -4.4], 14, 0.45, 'rw');
    // muro de lanternas brancas votivas (chōchin-dana) no terraço
    { const wl = [], wr = [], caps = [];
      for (const s of [-1, 1]) { const x0 = s * 4.5, x1 = s * 8.8; for (const y of [1.9, 2.5, 3.1]) { K.box(Math.abs(x1 - x0) + 0.3, 0.06, 0.08, woodD, (x0 + x1) / 2, TY + y + 0.28, -9.8); for (let k = 0; k < 12; k++) { const x = x0 + (x1 - x0) * (k + 0.5) / 12; ((k + (y > 2 ? 1 : 0)) % 4 === 0 ? wr : wl).push([x, TY + y, -9.8]); caps.push([x, TY + y + 0.2, -9.8]); caps.push([x, TY + y - 0.2, -9.8]); } }
        for (const x of [x0, (x0 + x1) / 2, x1]) K.box(0.1, 3.0, 0.1, woodD, x, TY + 1.95, -9.85); K.col(Math.min(x0, x1) - 0.1, -10, Math.max(x0, x1) + 0.1, -9.5, 1); }
      K.inst(chochinGeo, whiteLT, wl, { cast: false }); K.inst(chochinGeo, redLT, wr, { cast: false }); K.inst(capGeo, lac, caps, { cast: false });
      for (const s of [-1, 1]) K.pool(s * 6.6, -9.0, 2.6, 0xffd0a0, 0.25, TY + 0.02); }
    // balcão de amuletos (juyosho) — missão omamori
    const omamori = (() => {
      const x = -6.5, z = -9.0, g = K.group(x, TY, z);
      K.box(2.2, 0.8, 0.7, K.mat(0xf6f3ec, { roughness: 0.9 }), 0, 0.4, 0, { parent: g }); K.box(2.3, 0.05, 0.8, woodL, 0, 0.82, 0, { parent: g });
      K.box(0.08, 2.1, 0.08, woodM, -1.1, 1.05, 0.38, { parent: g }); K.box(0.08, 2.1, 0.08, woodM, 1.1, 1.05, 0.38, { parent: g });
      roof(2.6, 1.6, 0.4, 0, 2.05, 0.0, { parent: g, t: 0.06, up: 0.08 });
      // tabuleiro inclinado de amuletos
      const pm = [0xc8221a, 0x2e4fa8, 0xd9a441, 0xff8ab0, 0x1b6a3a, 0x6b3f8c, 0xf6f3ec], om = [];
      pm.forEach((c, ci) => { const l = []; for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) if ((i + j * 5) % pm.length === ci) l.push([-0.95 + i * 0.17, 0.9 + j * 0.05, -0.05 + j * 0.13, 0, 1, -1.1]); om.push(K.inst(new T.BoxGeometry(0.08, 0.12, 0.02), K.mat(c, { roughness: 0.5, metalness: 0.2 }), l, { parent: g, cast: false })); });
      K.add(new T.PlaneGeometry(0.5, 0.9), K.texMat(kanjiTex('御守', { w: 64, h: 128, bg: '#f6f0e0', color: '#c8221a' })), 0.8, 1.45, 0.42, { parent: g, cast: false });
      // amuleto grande pendurado na frente
      const big = K.group(-0.5, 2.25, 0.45, 0, g); big.scale.setScalar(1.8);
      K.cyl(0.005, 0.005, 0.3, K.mat(0xd9a441), 0, 0.15, 0, { parent: big, cast: false }, 3);
      const bm = K.mat(0xc8221a, { roughness: 0.4, metalness: 0.2 });
      const body = K.add(K.rbox(0.32, 0.46, 0.06, 0.03), bm, 0, -0.22, 0, { parent: big, cast: false });
      K.add(new T.PlaneGeometry(0.18, 0.3), K.texMat(kanjiTex('守', { w: 64, h: 128, bg: '#c8221a', color: '#f2c14e' })), 0, -0.22, 0.035, { parent: big, cast: false });
      K.halo(x, TY + 2.2, z + 0.6, 0.6, 0xffc080, 0.25);
      K.col(x - 1.2, z - 0.45, x + 1.2, z + 0.5, 1);
      K.slot(x - 0.8, z + 1.1, x - 0.8, z, 'bar', 1); K.slot(x + 0.9, z + 1.1, x + 0.9, z, 'bar', 1);
      const hl = K.halo(x - 0.5, TY + 1.9, z + 0.6, 1.1, 0, 0);
      return { big, body, bm, hl };
    })();
    K.tell('omamori', (live) => { omamori.body.material = K.glow(0xffc840, 1.6); if (live) K.anim(1.2, e => { omamori.big.rotation.y = e * Math.PI * 4; omamori.big.scale.setScalar(1.8 * (1 + Math.sin(e * Math.PI) * 0.5)); }); else { omamori.big.rotation.y = 0; } omamori.hl.material.color.set(0xffc040).multiplyScalar(0.8); },
      () => { omamori.body.material = omamori.bm; omamori.big.rotation.y = 0; omamori.big.scale.setScalar(1.8); omamori.hl.material.color.set(0); });
    // quadro de ema (plaquinhas de madeira com desejos)
    { const x = 6.5, z = -9.0;
      for (const s of [-1, 1]) K.box(0.1, 1.9, 0.1, woodD, x + s * 1.0, TY + 0.95, z);
      roof(2.4, 0.9, 0.3, x, TY + 1.85, z, { t: 0.05, up: 0.05 });
      const em = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 14; k++) em.push([x - 0.9 + k * 0.135 + R() * 0.02, TY + 0.85 + r * 0.24, z + 0.05 + (k % 2) * 0.02, (R() - 0.5) * 0.3, 1, 0, (R() - 0.5) * 0.3]);
      const emTex = K.canvasTex(64, 48, (g, w, h) => { g.fillStyle = '#d8b07a'; g.beginPath(); g.moveTo(0, 14); g.lineTo(w / 2, 0); g.lineTo(w, 14); g.lineTo(w, h); g.lineTo(0, h); g.fill(); g.fillStyle = '#16161a'; for (let k = 0; k < 3; k++) g.fillRect(10 + k * 16, 18, 3, 22); g.fillStyle = '#c8221a'; g.beginPath(); g.arc(46, 34, 6, 0, 7); g.fill(); });
      K.inst(new T.PlaneGeometry(0.12, 0.09), K.texMat(emTex, { side: T.DoubleSide, transparent: true }), em, { cast: false });
      for (const y of [0.88, 1.12, 1.36, 1.6]) K.box(2.0, 0.03, 0.03, woodM, x, TY + y + 0.04, z);
      K.col(x - 1.1, z - 0.25, x + 1.1, z + 0.25, 1);
      K.slot(x - 0.5, z + 0.9, x - 0.5, z, 'talk', 1); K.slot(x + 0.5, z + 0.9, x + 0.5, z, 'talk', 1);
    }

    // ------------------------------------------------------------ casas machiya baixas nas laterais
    const machiya = (side, z0, z1, k) => {
      const w = z1 - z0, zc = (z0 + z1) / 2, xf = side * 15.0, xc = side * 18.0;
      const wall = [0x4a3424, 0x3a2a1e, 0x54392a][k % 3];
      K.box(6, 2.5, w - 0.1, K.mat(wall, { roughness: 0.85 }), xc, 1.25, zc, { cast: false });
      roof(w + 0.3, 7.0, 0.95, xc, 2.45, zc, { ry: Math.PI / 2, cast: false, up: 0.12 });
      // fachada: treliça koshi iluminada + noren na porta + mushiko-mado em cima
      const lat = K.canvasTex(256, 128, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffc878'); gr.addColorStop(1, '#c87a30'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = '#2a1a10'; for (let x = 0; x < W; x += 9) g.fillRect(x, 0, 5, H); g.fillRect(0, 0, W, 6); g.fillRect(0, H - 6, W, 6); g.fillRect(0, H / 2 - 2, W, 4); });
      const latM = new T.MeshStandardMaterial({ map: lat, emissiveMap: lat, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.8 });
      const ry = side < 0 ? Math.PI / 2 : -Math.PI / 2, fx = xf - side * 0.02;
      K.add(new T.PlaneGeometry(w * 0.45, 1.3), latM, fx, 0.95, zc - w * 0.2, { ry, cast: false });
      const nr = K.canvasTex(128, 128, (g, W, H) => { g.fillStyle = ['#1e3a8b', '#5a1a3a', '#2a4a3a', '#1b1b26'][k % 4]; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(W / 2 - 2, 20, 4, H); g.strokeStyle = '#f6f3ec'; g.lineWidth = 6; g.beginPath(); g.arc(W / 2, 46, 22, 0, 7); g.stroke(); g.fillStyle = '#f6f3ec'; g.font = `700 28px ${JP}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(['茶', '酒', '菓', '宿'][k % 4], W / 2, 47); });
      K.add(new T.PlaneGeometry(1.1, 0.9), K.texMat(nr, { side: T.DoubleSide }), fx - side * 0.05, 1.6, zc + w * 0.25, { ry, cast: false });
      K.add(new T.PlaneGeometry(1.1, 1.9), K.glow(0x6a3a1a, 1.0), fx, 0.95, zc + w * 0.25, { ry, cast: false });
      const mush = K.canvasTex(256, 64, (g, W, H) => { g.fillStyle = '#e6dcc8'; g.fillRect(0, 0, W, H); g.fillStyle = '#ffcf86'; for (let x = 20; x < W - 20; x += 22) g.fillRect(x, 18, 10, 30); });
      K.add(new T.PlaneGeometry(w * 0.8, 0.5), new T.MeshStandardMaterial({ map: mush, emissiveMap: mush, emissive: 0xffffff, emissiveIntensity: 0.25 }), fx, 2.1, zc, { ry, cast: false });
      // inuyarai (cerca curva de bambu) e lanterninha
      const inu = []; for (let z = zc - w * 0.42; z < zc + 0.0; z += 0.1) inu.push([xf - side * 0.25, 0.3, z, 0, 1, 0, side * 0.5]);
      K.inst(new T.CylinderGeometry(0.02, 0.02, 0.7, 4), bambooDry, inu, { cast: false });
      K.add(chochinGeo, k % 2 ? redLT : whiteLT, xf - side * 0.3, 1.95, zc + w * 0.25 - 0.75, { cast: false });
      K.pool(xf - side * 0.6, zc, 1.5, 0xffb060, 0.2);
    };
    [[-10, -5.4], [-5.2, -1.0], [-0.8, 3.6], [3.8, 8.4]].forEach(([a, b], k) => { machiya(-1, a, b, k); machiya(1, a, b, k + 1); });
    // segunda fileira (mais alta, longe da borda)
    for (const s of [-1, 1]) for (let k = 0; k < 5; k++) { const z = -12 + k * 5.2, h = 5 + R() * 2; K.facade(7, h, 4.8, s * 28, z, { wall: '#2a1e18', dark: '#120c0a', lit: 0.35, bays: 4, floors: 3, glow: 0.45 }); roof(5.2, 8, 1.3, s * 28, h - 0.1, z, { ry: Math.PI / 2, cast: false }); }
    // bambuzal alto atrás das laterais
    { const bb = []; for (let k = 0; k < 160; k++) { const s = R() < 0.5 ? -1 : 1; bb.push([s * (23 + R() * 3), 4, -16 + R() * 10, 0, [1, 0.8 + R() * 0.5, 1], (R() - 0.5) * 0.1, (R() - 0.5) * 0.1]); }
      K.inst(new T.CylinderGeometry(0.06, 0.07, 10, 5), bamboo, bb, { cast: false }); const lf = bb.map(p => [p[0], 8 + R() * 2, p[2], R() * 6, 1.2]); K.inst(new T.IcosahedronGeometry(0.8, 0), K.mat(0x2f4a2a, { flatShading: true }), lf, { cast: false }); }

    // ------------------------------------------------------------ frente: margem do rio Kamo e o pagode do sniper
    K.add(new T.PlaneGeometry(140, 3).rotateX(-Math.PI / 2), K.mat(0x2e2b26, { roughness: 0.95 }), 0, 0, 12.9, { cast: false });
    K.box(140, 0.5, 0.4, stoneG, 0, 0.0, 14.5, { cast: false });
    const riverTex = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#0a1c26'; g.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { const x = R() * w, y = R() * h, l = 6 + R() * 26; g.strokeStyle = `rgba(${110 + R() * 80},${150 + R() * 60},${180 + R() * 50},${0.05 + R() * 0.1})`; g.lineWidth = 1 + R() * 1.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 2, x + l, y); g.stroke(); } }, [14, 8]);
    K.add(new T.PlaneGeometry(240, 40).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({ color: 0x24525e, map: riverTex, roughness: 0.12, metalness: 0.35, envMapIntensity: 1.1, emissive: 0x061a22, emissiveIntensity: 0.6 }), 0, -1.0, 34.5, { cast: false });
    K.tick((dt, t) => { riverTex.offset.set(-t * 0.008, Math.sin(t * 0.1) * 0.02); });
    for (let k = 0; k < 22; k++) K.pool(-30 + k * 2.8 + R() * 2, 18 + R() * 24, 0.6 + R() * 1.2, k % 4 ? 0xffa850 : 0xff4030, 0.2, -0.97);
    // margem oposta: casas baixas iluminadas e kawadoko (terraços sobre o rio)
    K.add(new T.PlaneGeometry(240, 30).rotateX(-Math.PI / 2), K.mat(0x1c1a18, { roughness: 1 }), 0, 0, 69.5, { cast: false });
    for (let k = 0; k < 14; k++) { const x = -50 + k * 7.4, h = 3 + R() * 3; K.facade(6.6, h, 6, x, 60 + R() * 4, { wall: '#2a201a', dark: '#100c0a', lit: 0.5, bays: 4, floors: 2, glow: 0.5 }); roof(6.8, 7, 1.0, x, h, 62, { cast: false }); K.box(6.4, 0.15, 3.0, woodD, x, 0.9, 55.6, { cast: false }); for (let j = 0; j < 4; j++) K.halo(x - 2.4 + j * 1.6, 1.5, 54.4, 0.3, 0xffb050, 0.9); }
    // pagode de cinco andares (sniper no último andar)
    { const px = -6, pz = 52.5, base = 0.8, pg = K.group(px, 0, pz);
      K.box(7.6, base, 7.6, stoneG, 0, base / 2, 0, { parent: pg, cast: false });
      const wallM = K.mat(0x9a2a1a, { roughness: 0.8 }), litM = new T.MeshStandardMaterial({ color: 0x5a1a10, emissive: 0xff8040, emissiveIntensity: 0.3 });
      for (let i = 0; i < 5; i++) { const w = 5.4 - i * 0.55, y = base + i * 2.85;
        K.box(w * 0.82, 1.9, w * 0.82, i === 4 ? litM : wallM, 0, y + 0.95, 0, { parent: pg, cast: false });
        for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.box(0.14, 1.9, 0.14, verm, a * w * 0.41, y + 0.95, b * w * 0.41, { parent: pg, cast: false });
        K.box(w * 1.0, 0.14, w * 1.0, woodD, 0, y + 1.95, 0, { parent: pg, cast: false });
        const rf = K.cone(w * 0.98, 0.8, K.mat(0x22252b, { roughness: 0.7 }), 0, y + 2.42, 0, { parent: pg, cast: false }, 4); rf.rotation.y = Math.PI / 4;
        for (const [a, b] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) K.sphere(0.07, brass, a * w * 0.68, y + 2.0, b * w * 0.68, { parent: pg, cast: false }, 5, 4); }
      K.cyl(0.07, 0.07, 3.4, brass, 0, base + 5 * 2.85 + 1.4, 0, { parent: pg, cast: false }, 6); for (let k = 0; k < 9; k++) K.torus(0.24 - k * 0.012, 0.035, brass, 0, base + 14.6 + k * 0.28, 0, { parent: pg, rx: Math.PI / 2, cast: false }, 4, 14);
      // sacada do último andar com a janela aberta
      const y4 = base + 4 * 2.85; K.box(3.4, 0.08, 1.2, woodD, 0, y4 + 0.02, -1.9, { parent: pg, cast: false }); K.box(3.4, 0.5, 0.06, verm, 0, y4 + 0.3, -2.48, { parent: pg, cast: false });
      K.box(1.2, 1.1, 0.05, K.mat(0x0a0808), 0, y4 + 1.0, -1.17, { parent: pg, cast: false });
      K.halo(px, 13.4, 49.6, 0.35, 0xff4134, 1.2);
      for (let k = 0; k < 8; k++) K.halo(px - 3.4 + k, base + 2.3 + (k % 3) * 2.85, pz - 2.9, 0.25, 0xffb050, 0.7);
    }

    // ------------------------------------------------------------ vagas extras de conversa e passeio na rua
    [[-1.4, 5.6], [1.6, 4.2], [-0.8, 2.6], [1.2, 1.0], [-1.6, 0.0], [0.4, -1.4], [-2.2, 3.8], [2.2, -0.8], [-6.6, 3.2], [-6.6, -0.2], [6.4, 3.2], [6.4, 0.2], [6.6, -2.8], [-6.4, -3.6], [-9.0, 4.4], [-5.2, 6.6], [10.2, 5.4], [12.4, -0.6]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));

    // ------------------------------------------------------------ animações gerais (bandeiras, cata-ventos, lanterna-peixe)
    K.tick((dt, t) => { for (const s of swayers) { if (s.spin) s.sw.rotation.z = t * 3 + s.ph; else if (s.flag) s.sw.rotation.y = 0.6 + Math.sin(t * 1.6 + s.ph) * 0.18; else if (s.bob) s.sw.position.y = 3.0 + Math.sin(t * 1.4) * 0.05; } });

    // ------------------------------------------------------------ luzes principais
    K.plight(-3.2, 2.6, 3.3, 0xffa860, 1.3, 8); K.plight(-3.2, 2.6, -0.4, 0xffa860, 1.3, 8);
    K.plight(3.2, 2.6, 3.3, 0xffa860, 1.3, 8); K.plight(3.2, 2.6, -0.4, 0xffa860, 1.3, 8);
    K.plight(0, 4.2, -8.2, 0xff8a50, 1.8, 11);
    K.plight(10.4, 2.6, 1.0, 0xffb070, 1.1, 9);
    K.plight(11.0, 2.6, -5.4, 0xffc080, 0.9, 7);
    K.pool(0, 1.0, 3.0, 0xffb070, 0.22); K.pool(0, -3.9, 2.4, 0xff7040, 0.25);
    // ------------------------------------------------------------ ambiente vivo: hanabi sobre o rio, atrás do templo, e pétalas da cerejeira
    K.fireworks({ x0: -30, x1: 30, y: 19, dy: 3, z: -44, dz: 10, raio: 5, tam: 0.6, cada: 2.2, n: 4, cores: [0xffb04a, 0xff5a7a, 0x9ad8ff, 0xc8ff60, 0xffffff] });
    K.particles({ modo: 'cai', x0: -15.5, x1: -11.5, z0: -4.6, z1: 0.6, y0: 0.05, y1: 4.2, n: 46, cor: [0xf6b8cc, 0xf8d0dc, 0xe890b0], tam: 0.07, vel: 0.35, balanco: 0.45 });
  },
  // ninho do sniper: último andar do pagode. Corrimão de laca vermelha gasta (o preto aparece nas bordas), pétalas de
  // sakura, beiral de telhas escuras logo abaixo, uma lanterna de papel acesa e um sino de vento (fūrin) que balança
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.5 }), lac = 0xa8302a;
    N.tampo(lac, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 51, mat: { roughness: 0.35 }, draw: (c, w, h, R) => {
      c.fillStyle = '#a8322a'; c.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 2) { c.fillStyle = `rgba(${R() < 0.5 ? '70,14,10' : '200,80,60'},${0.04 + R() * 0.08})`; c.fillRect(0, y, w, 2); }
      c.fillStyle = 'rgba(30,18,14,.85)'; for (let k = 0; k < 30; k++) { const x = R() * w; c.beginPath(); c.ellipse(x, R() < 0.5 ? 3 : h - 3, 8 + R() * 40, 3 + R() * 4, 0, 0, 7); c.fill(); }
      K.manchas(c, w, h, R, 50, ['40,14,10'], 4, 26, 0.25);
      for (let k = 0; k < 16; k++) { c.save(); c.translate(R() * w, R() * h); c.rotate(R() * 6); c.fillStyle = R() < 0.5 ? '#f6c8d4' : '#f2b4c4'; c.beginPath(); c.ellipse(0, 0, 7, 4, 0, 0, 7); c.fill(); c.restore(); }
      c.fillStyle = 'rgba(255,220,200,.25)'; c.fillRect(0, h * 0.1, w, 3); K.grain(c, w, h, 10);
    } });
    N.box(5.8, 0.1, 1.0, 0x2a2420, 0, -0.97, -1.1);
    for (let x = -2.8; x <= 2.81; x += 0.2) N.cyl(0.07, 0.07, 1.3, 0x3a3e44, x, -1.13, -1.75, 8, 0, Math.PI / 2 - 0.35);
    N.box(5.6, 3.0, 0.9, 0x3a2a22, 0, -2.6, -0.95);
    for (const sx of [-1, 1]) N.cyl(0.11, 0.11, 2.3, lac, sx * 2.0, 0.35, -0.95, 10).box(0.6, 0.12, 0.3, 0x2a2420, sx * 2.15, 1.42, -0.95);
    N.cyl(0.006, 0.006, 0.35, 0xe8e0c8, 2.3, 1.2, -1.05, 4).cyl(0.006, 0.006, 0.3, 0xe8e0c8, -2.3, 1.25, -0.95, 4);
    N.fim();
    const lan = K.add(new T.CylinderGeometry(0.2, 0.2, 0.42, 14), new T.MeshStandardMaterial({ color: 0xf0e0c0, emissive: 0xff8a40, emissiveIntensity: 0.9, roughness: 0.8 }), -2.3, 0.85, -0.95, { parent: g, cast: false });
    K.cyl(0.21, 0.21, 0.04, K.mat(0x1a1a1a), 0, 0.22, 0, { parent: lan, cast: false }); K.cyl(0.21, 0.21, 0.04, K.mat(0x1a1a1a), 0, -0.22, 0, { parent: lan, cast: false });
    const fu = K.group(2.3, 1.03, -1.05, 0, g); K.add(new T.SphereGeometry(0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), K.mat(0xa8dcf0, { transparent: true, opacity: 0.75, roughness: 0.1, side: T.DoubleSide }), 0, -0.07, 0, { parent: fu, cast: false });
    const tanzaku = K.add(new T.PlaneGeometry(0.06, 0.2).translate(0, -0.1, 0), K.mat(0xe8384a, { side: T.DoubleSide }), 0, -0.12, 0, { parent: fu, cast: false });
    K.tick((dt, t) => { fu.rotation.z = Math.sin(t * 1.3) * 0.12; tanzaku.rotation.x = Math.sin(t * 2.1) * 0.5; tanzaku.rotation.y = Math.sin(t * 0.7) * 0.6; lan.rotation.z = Math.sin(t * 0.9 + 1) * 0.05; });
  },
});
