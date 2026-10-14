// 07 · Chalé nos Alpes: après-ski noturno num chalé de luxo em St. Moritz, com neve caindo.
// Deck de madeira com jacuzzi fumegante, fogueira com peles de carneiro, pista de patinação, cabana de glühwein,
// rack de esquis, trenó e boneco de neve. O sniper está na estação do teleférico na encosta em frente.
MIRA_CENARIOS.push({
  id: 'alpes',
  nome: 'Chalé nos Alpes',
  lugar: 'Chalet Edelweiss, St. Moritz, Suíça',
  hora: 'noite de après-ski, nevando',
  resumo: 'Deck nevado com jacuzzi fumegante, fogueira com peles de carneiro, rinque iluminado e cabana de glühwein. Todos de gorro, cachecol e casaco: o sniper precisa ler cores, poses e o que muda no cenário.',
  sniper: { pos: [4, 13, 46], desc: 'cabine da estação do teleférico, na encosta em frente' },
  niveis: [{ nome: 'deck do chalé', y: 0, x0: -14.5, x1: 14.5, z0: -9.6, z1: 9.9 }],
  convidados: 28,
  inicio: [4.4, 7.2, 0],
  ambiente: {
    ceu: ['#03050f', '#0a1230', '#1c2a55', '#3c4a78'], neblina: [0x141c38, 70, 300], hemi: [0x7f96d0, 0x2a2430, 0.2],
    sol: [0x9ab0f0, 0.36, -16, 26, 20], preenche: [0xffa860, 0.16], exposicao: 0.9, bloom: 0.62,
  },
  guardaRoupa: {
    ternos: [[0xb0202a, 'suéter de tricô vermelho'], [0x1f3a6a, 'suéter azul-marinho'], [0xece6da, 'suéter de tricô creme'], [0x2f5a3a, 'suéter verde-pinheiro'], [0x6a4630, 'suéter caramelo'], [0x55585f, 'suéter cinza'], [0xd9822a, 'suéter laranja'], [0x16161a, 'suéter preto de gola alta']],
    vestidos: [[0xf4f1ea, 'vestido de lã branco'], [0x7a1a22, 'vestido bordô'], [0x1b1b22, 'vestido preto'], [0x7a9ac8, 'vestido azul-gelo'], [0xb8a07a, 'vestido caramelo'], [0x5a2a4a, 'vestido ameixa']],
    vestidoChance: 0.4, longo: 0.5, tacas: ['tumbler', 'wine', 'tumbler', 'coupe'], drinks: [0x8a1a22, 0x5a3020, 0xf2c14e, 0xb3122e],
    extra(o, r) {
      const C = (a) => a[Math.floor(r() * a.length)];
      const knit = [[0xc8322f, 'vermelho'], [0xf6f3ec, 'branco'], [0x1f3a6a, 'azul'], [0x2f6a3a, 'verde'], [0xe9b23b, 'mostarda'], [0xd96a8a, 'rosa'], [0x3a3a40, 'grafite']];
      o.shoe = C([0x4a2e1c, 0x2a1a12, 0x6a4a2a, 0x1b1b1f]);
      // sweaters, jackets and parkas: no lapels or tie, sleeves to the wrist, trousers that do not match the top
      if (!o.dress) { o.knit = true; o.bow = false; o.pocket = 0; o.vest = 0; o.pants = [0x2a3a5a, 0x3a3028, 0x1b1b1f, 0x4a4a52][(o.main >> 3) % 4]; }
      else o.robe = 'round'; // wool dresses with sleeves, no straps in the snow
      if (o.dress) { if (r() < 0.75) { const [c, n] = C([[0xf4f1ea, 'casaco de pele branco'], [0x4a3022, 'casaco de lã marrom'], [0x16161a, 'casaco preto'], [0x6a1a22, 'casaco vinho'], [0xb8956a, 'casaco camelo'], [0x8a8f9a, 'casaco cinza-prata']]); o.coat = c; o.name += ', ' + n; } }
      else if (r() < 0.38) { o.stripes = C([0xf6f3ec, 0xc8322f, 0x1f3a6a]); o.name += ', padrão norueguês'; }
      else if (r() < 0.2) { o.coat = C([0x3a2a22, 0x1b1b22, 0x55585f]); o.name += ', sobretudo'; }
      if (r() < 0.55) { const [c, n] = C(knit); o.hat = 'beanie'; o.hatColor = c; o.hatBand = C(knit)[0]; o.name += ', gorro de pompom ' + n; }
      if (r() < 0.5) { const [c, n] = C(knit); o.scarf = c; o.name += ', cachecol ' + n; }
      if (r() < 0.12) { o.glasses = 'goggles'; o.maskColor = C([0xff8a1c, 0x6ad0ff, 0xd9a441]); o.name += ', óculos de esqui'; }
      if (!o.dress && r() < 0.12) { o.gloves = C(knit)[0]; }
    },
  },
  elenco: [
    { x: 12.0, z: 5.3, rot: 0.9, anim: 4, fala: 'Joelhos flexionados, peso para a frente. E nada de glühwein antes da pista!', outfit: { dress: false, main: 0xd01e28, pants: 0x1b1b22, shirt: 0x16161a, tie: 0xd01e28, skin: 2, hair: 0x6b4a2b, hat: 'beanie', hatColor: 0x16161a, hatBand: 0xd01e28, glasses: 'goggles', maskColor: 0xff8a1c, prop: 'pole', gloves: 0x16161a, name: 'instrutor de esqui Jonas, de jaqueta vermelha, gorro preto e óculos de neve' } },
    { x: -8.6, z: -8.45, y: 0.3, rot: 0.15, anim: 6, fala: 'Holadi-ri-diii-hoooo! O eco volta lá do Piz Bernina.', outfit: { dress: false, main: 0x6a4424, pants: 0x5a3a1c, shirt: 0xf2ede0, tie: 0x2f6a34, skin: 0, hair: 0x6b4a2b, beard: true, hat: 'fedora', hatColor: 0x2f5a2a, hatBand: 0xc8322f, gloves: false, name: 'cantor de iodelei Sepp, de chapéu tirolês verde e suspensórios de couro' } },
    { x: -13.5, z: -3.2, rot: 1.06, anim: 2, fala: 'Canela, cravo, laranja e um segredinho. Mais uma caneca?', outfit: { dress: true, gown: false, main: 0x1f4a32, skin: 1, hair: 0xd9b46a, hairStyle: 'bun', apron: 0xf3eee2, scarf: 0xc8322f, necklace: true, earring: true, shoe: 0x2a1a12, name: 'barwoman Vreni, de dirndl verde e avental branco, na concha do glühwein' } },
    { x: 1.8, z: -3.56, rot: -0.585, anim: 7, fala: 'Óculos escuros à noite? Querida, a neve reflete os flashes.', outfit: { dress: true, gown: true, satin: true, main: 0xf4f1ea, coat: 0xfbf9f4, skin: 0, hair: 0xe0c07a, hairStyle: 'long', glasses: 'sun', necklace: true, earring: true, glass: 'coupe', drink: 0xf2c14e, accent: 0xc9ced6, name: 'herdeira Anouk von Albis, de casaco de pele branco e óculos escuros' } },
    { x: -9.6, z: 4.4, rot: 0.5, anim: 3, fala: 'Uma pirueta para o júri! Ninguém? Nem uma palminha?', outfit: { dress: true, gown: false, main: 0x2a8ac8, skirt: 0xff7aa8, skin: 3, hair: 0x1a1411, hairStyle: 'bun', hat: 'beanie', hatColor: 0xf6f3ec, hatBand: 0xff7aa8, gloves: 0xf6f3ec, scarf: 0xf6f3ec, shoe: 0xf6f3ec, name: 'patinadora Lotte, de saia rodada rosa e gorro branco' } },
    { x: -4.1, z: 7.9, rot: 0.25, anim: 18, fala: 'Mano, o pó tava insano hoje. Vai pro story!', outfit: { dress: false, main: 0x2aa87a, pants: 0x2a3a5a, shirt: 0x16161a, tie: 0x2aa87a, skin: 4, hair: 0x1a1411, hat: 'beanie', hatColor: 0x1e3a8b, hatBand: 0xffd23f, scarf: 0xffd23f, name: 'snowboarder Kai, de touca azul e cachecol amarelo' } },
    { x: 1.6, z: -8.2, rot: 0.4, anim: 10, fala: 'Fondue de gruyère no terraço, madame. A raclette já vem.', outfit: { dress: false, main: 0x16161a, pants: 0x16161a, shirt: 0xf6f3ec, tie: 0x16161a, bow: true, skin: 1, hair: 0xa9a9a9, hairStyle: 'quiff', gloves: 0xf6f3ec, prop: 'tray', name: 'mordomo Albert, de fraque, gravata-borboleta e luvas brancas' } },
    { x: 12.1, z: -0.6, rot: -1.25, anim: 4, fala: 'Patrulha para base: pista Diavolezza fechada. Câmbio.', outfit: { dress: false, main: 0xf2c230, pants: 0x1b1b22, shirt: 0x16161a, tie: 0xc8202a, skin: 2, hair: 0x3b2a1e, stripes: 0xdfe6ee, hat: 'beanie', hatColor: 0xc8202a, hatBand: 0xf6f3ec, prop: 'radio', name: 'médico da patrulha Dr. Brunner, de jaqueta amarela refletiva e rádio' } },
  ],
  missoes: [
    { k: 'esqui', label: 'Trocar o esqui marcado no rack', where: 'rack de esquis, à direita na frente', s: [12.5, 7.6], l: [13.9, 7.6] },
    { k: 'treno', label: 'Apagar a lanterna do trenó', where: 'trenó, na beira do deck', s: [7.0, 7.7], l: [7.6, 8.9] },
    { k: 'boneco', label: 'Pôr o pacote no boneco de neve', where: 'boneco de neve, na frente', s: [-1.45, 8.6], l: [-2.6, 8.7] },
    { k: 'jacuzzi', label: 'Desligar o aquecedor da jacuzzi', where: 'painel ao lado da jacuzzi', s: [10.5, -5.6], l: [10.0, -6.6] },
    { k: 'radio', label: 'Mexer no rádio da patrulha', where: 'posto da patrulha, à direita', s: [12.5, 1.5], l: [13.6, 1.5] },
    { k: 'lareira', label: 'Acender a lareira do segundo andar', where: 'porta do chalé', s: [0.0, -9.0], l: [0.0, -10.3] },
    { k: 'gondola', label: 'Sinalizar a gôndola com o holofote', where: 'holofote na beira do deck', s: [2.4, 8.2], l: [2.4, 9.3] },
    { k: 'gluhwein', label: 'Batizar o caldeirão de glühwein', where: 'caldeirão ao lado da cabana', s: [-11.3, -1.9], l: [-12.6, -2.6] },
    { k: 'fogueira', label: 'Jogar o pó colorido na fogueira', where: 'fogueira, no centro', s: [0.5, 0.15], l: [0.5, -1.6] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r, V3 = T.Vector3;
    const sm = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    // ------------------------------------------------------------ materiais e texturas
    const snow = new T.MeshLambertMaterial({ color: 0xc4d0e8, emissive: 0x060b18 });
    const lam = (o) => new T.MeshLambertMaterial(Object.assign({ vertexColors: true }, o));
        const woodD = K.mat(0x3e2616, { roughness: 0.75 }), woodM = K.mat(0x6a4426, { roughness: 0.7 }), woodL = K.mat(0x9a6a3a, { roughness: 0.7 });
    const wool = K.mat(0xf3eee2, { roughness: 1 }), redPaint = K.mat(0xb8262a, { roughness: 0.5 }), greenPaint = K.mat(0x2a5a3a, { roughness: 0.6 });
    const stoneM = K.mat(0x8a8a90, { roughness: 0.9 });
    const logTex = K.canvasTex(512, 512, (g, w, h) => {
      const n = 14, s = h / n;
      for (let i = 0; i < n; i++) {
        const y = i * s, base = 120 + R() * 25; const gr = g.createLinearGradient(0, y, 0, y + s);
        gr.addColorStop(0, `rgb(${base * 0.55},${base * 0.33},${base * 0.18})`); gr.addColorStop(0.45, `rgb(${base},${base * 0.66},${base * 0.38})`); gr.addColorStop(1, `rgb(${base * 0.4},${base * 0.24},${base * 0.12})`);
        g.fillStyle = gr; g.fillRect(0, y, w, s);
        for (let k = 0; k < 10; k++) { g.strokeStyle = `rgba(50,25,10,${0.1 + R() * 0.15})`; g.lineWidth = 1; g.beginPath(); const yy = y + 4 + R() * (s - 8); g.moveTo(0, yy); g.bezierCurveTo(w * 0.3, yy + R() * 4 - 2, w * 0.6, yy + R() * 4 - 2, w, yy); g.stroke(); }
        if (R() < 0.6) { g.fillStyle = 'rgba(40,20,8,.55)'; g.beginPath(); g.ellipse(R() * w, y + s / 2, 4 + R() * 4, 3, 0, 0, 7); g.fill(); }
        g.fillStyle = 'rgba(20,10,4,.8)'; g.fillRect(0, y + s - 2, w, 2);
      }
      K.grain(g, w, h, 12);
    }, [0.25, 0.25]);
    const plankV = K.canvasTex(256, 256, (g, w, h) => {
      for (let i = 0; i < 8; i++) { const v = 70 + R() * 20; g.fillStyle = `rgb(${v},${v * 0.6},${v * 0.36})`; g.fillRect(i * 32, 0, 32, h); g.fillStyle = 'rgba(15,8,3,.85)'; g.fillRect(i * 32, 0, 3, h); g.fillStyle = 'rgba(255,220,180,.06)'; g.fillRect(i * 32 + 3, 0, 4, h); }
      K.grain(g, w, h, 10);
    }, [1, 1]);
    plankV.repeat.set(0.4, 0.4);
    const stoneTex = K.canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#3a3a40'; g.fillRect(0, 0, w, h);
      for (let j = 0; j < 8; j++) for (let i = 0; i < 6; i++) { const v = 110 + R() * 60; g.fillStyle = `rgb(${v},${v - 4},${v - 10})`; g.beginPath(); g.ellipse(i * 44 + (j % 2) * 22 + 10, j * 32 + 16, 19 + R() * 4, 13 + R() * 3, R() * 0.4, 0, 7); g.fill(); }
      K.grain(g, w, h, 18);
    }, [1, 1]);
    stoneTex.repeat.set(0.6, 0.6);
    const logMat = K.texMat(logTex, { roughness: 0.8 }), plankMat = K.texMat(plankV, { roughness: 0.8 }), stoneMat = K.texMat(stoneTex, { roughness: 0.95 });
    const plaid = K.canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#9a1c22'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(20,20,30,.55)'; for (let k = 0; k < 4; k++) { g.fillRect(k * 32 + 10, 0, 10, h); g.fillRect(0, k * 32 + 10, w, 10); } g.fillStyle = 'rgba(240,220,150,.5)'; for (let k = 0; k < 4; k++) { g.fillRect(k * 32 + 26, 0, 2, h); g.fillRect(0, k * 32 + 26, w, 2); } });
    const plaidMat = K.texMat(plaid, { roughness: 0.95 });

    // utilitário: junta geometrias com cor por vértice (para instanciar pinheiros)
    const mergeCol = (parts) => {
      let n = 0; const ps = parts.map(([g, c]) => { const gg = g.index ? g.toNonIndexed() : g; n += gg.attributes.position.count; return [gg, c]; });
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3); let k = 0;
      for (const [g, c] of ps) { const cc = new T.Color(c); pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3); for (let i = 0; i < g.attributes.position.count; i++) { col[(k + i) * 3] = cc.r; col[(k + i) * 3 + 1] = cc.g; col[(k + i) * 3 + 2] = cc.b; } k += g.attributes.position.count; }
      const out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(pos, 3)); out.setAttribute('normal', new T.BufferAttribute(nor, 3)); out.setAttribute('color', new T.BufferAttribute(col, 3)); return out;
    };
    // pinheiro nevado (altura ~3.7 m na escala 1)
    const pineGeo = (() => {
      const parts = [[new T.CylinderGeometry(0.1, 0.15, 0.9, 6).translate(0, 0.45, 0), 0x4a3020]];
      [[1.0, 0.7, 1.3], [0.8, 1.45, 1.15], [0.58, 2.15, 1.0], [0.36, 2.8, 0.85]].forEach(([r, y, h], i) => {
        parts.push([new T.ConeGeometry(r, h, 8).translate(0, y + h / 2, 0), i % 2 ? 0x1d3b2c : 0x234a34]);
        parts.push([new T.ConeGeometry(r * 0.58, h * 0.48, 8).translate(0, y + h - h * 0.24 + 0.02, 0), 0xc4d0e8]);
        parts.push([new T.CylinderGeometry(r * 0.9, r * 1.02, 0.07, 8).translate(0, y + 0.03, 0), 0xb4c2dc]);
      });
      return mergeCol(parts);
    })();
    const pineMat = lam({});

    // ------------------------------------------------------------ terreno nevado (encosta, vale, montes)
    const hgt = (x, z) => {
      const ax = Math.abs(x); if (ax < 15.6 && z > -12.5 && z < 10.9) return -0.6;
      const d = Math.max(ax - 15.6, z - 10.9, -12.5 - z, 0), f = sm(0, 7, d);
      let y = -0.6 + f * (Math.sin(x * 0.21 + z * 0.13) * 0.4 + Math.sin(x * 0.07 - z * 0.19) * 0.6 + Math.sin(x * 0.5 + z * 0.4) * 0.12);
      y -= sm(12, 28, z) * 7 * (1 - sm(30, 70, ax) * 0.5);
      y += sm(34, 54, z) * 17;
      y += sm(20, 60, ax) * 9;
      y += Math.max(0, -z - 45) * 0.5;
      return y;
    };
    { const geo = new T.PlaneGeometry(320, 270, 128, 108).rotateX(-Math.PI / 2); geo.translate(0, 0, -25);
      const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new T.Color();
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = hgt(x, z); p.setY(i, y); const v = 0.6 + Math.sin(x * 1.3 + z * 0.7) * 0.03 + R() * 0.04; c.setRGB(v * 0.84, v * 0.9, v); col.set([c.r, c.g, c.b], i * 3); }
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals();
      K.add(geo, lam({ emissive: 0x060c1c }), 0, 0, 0, { cast: false });
    }
    // montanhas alpinas ao luar (cones facetados com picos nevados)
    const mountain = (x, z, r, h, seed) => {
      const rr = K.rng(seed), geo = new T.ConeGeometry(r, h, 9, 6).toNonIndexed(), p = geo.attributes.position, col = new Float32Array(p.count * 3), jit = new Map();
      for (let i = 0; i < p.count; i++) {
        const key = p.getX(i).toFixed(2) + ',' + p.getY(i).toFixed(2) + ',' + p.getZ(i).toFixed(2);
        if (!jit.has(key)) { const top = p.getY(i) > h / 2 - 0.01; jit.set(key, top ? [0, 0, 0] : [(rr() - 0.5) * r * 0.22, (rr() - 0.5) * h * 0.1, (rr() - 0.5) * r * 0.22]); }
        const j = jit.get(key); p.setXYZ(i, p.getX(i) + j[0], p.getY(i) + j[1], p.getZ(i) + j[2]);
      }
      geo.computeVertexNormals();
      for (let i = 0; i < p.count; i += 3) { const yy = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3 / h + 0.5; const sn = yy > 0.42 + Math.sin(i * 0.7) * 0.1; const c = sn ? [0.72, 0.78, 0.95] : [0.16, 0.18, 0.26]; for (let k = 0; k < 3; k++) col.set(c, (i + k) * 3); }
      geo.setAttribute('color', new T.BufferAttribute(col, 3));
      K.add(geo, lam({ emissive: 0x0c1226 }), x, hgt(x, z) + h / 2 - 4, z, { cast: false, ry: rr() * 6 });
    };
    [[-120, -175, 55, 95], [-70, -200, 60, 120], [-15, -185, 48, 105], [40, -205, 62, 128], [95, -180, 55, 100], [150, -170, 50, 85], [-160, -150, 45, 70], [10, -150, 34, 60], [-45, -150, 32, 52], [70, -140, 30, 50], [120, -130, 34, 46], [-100, -125, 30, 44]].forEach(([x, z, r, h], k) => mountain(x, z, r, h, 77 + k * 13));
    // lua e estrelas
    { const moon = K.add(new T.CircleGeometry(7, 32), new T.MeshBasicMaterial({ color: new T.Color(0xf4f0e0).multiplyScalar(1.6), toneMapped: false, fog: false }), -70, 150, -270, { cast: false });
      moon.lookAt(0, 20, 40);
      const h = K.halo(-70, 150, -269, 30, 0x8fa8ff, 0.5); h.material.fog = false;
      const st = []; for (let k = 0; k < 700; k++) { const a = R() * Math.PI * 2, e = 0.12 + R() * 1.2; st.push(Math.cos(a) * Math.cos(e) * 390, 20 + Math.sin(e) * 380, Math.sin(a) * Math.cos(e) * 390 - 40); }
      const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(st, 3));
      const stars = new T.Points(sg, new T.PointsMaterial({ color: 0xdfe8ff, size: 1.4, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 })); K.root.add(stars);
    }

    // ------------------------------------------------------------ florestas de pinheiros (instanciadas)
    { const list = [], lit = [];
      const put = (x, z, s) => list.push([x, hgt(x, z) - 0.1, z, R() * 6, s]);
      // laterais: perto da borda só pinheiros baixos (<3.4 m); altos a partir de ~10 m
      for (let k = 0; k < 40; k++) { const sx = k % 2 ? 1 : -1, x = sx * (16.5 + R() * 6.5), z = -12 + R() * 26; put(x, z, 0.45 + R() * 0.45); }
      for (let k = 0; k < 120; k++) { const sx = k % 2 ? 1 : -1, x = sx * (25 + R() * 50), z = -50 + R() * 90; put(x, z, 2.0 + R() * 2.2); }
      // atrás do chalé: floresta densa subindo a encosta
      for (let k = 0; k < 170; k++) { const x = -90 + R() * 180, z = -24 - R() * 90; if (Math.abs(x) < 15 && z > -26) continue; put(x, z, 2.2 + R() * 2.4); }
      // frente: só pinheirinhos na descida, e mata alta na encosta do teleférico (>35 m)
      for (let k = 0; k < 26; k++) { const x = -40 + R() * 80, z = 14 + R() * 16; if (Math.abs(x - 4) < 4) continue; put(x, z, 0.35 + R() * 0.3); }
      for (let k = 0; k < 70; k++) { const x = -70 + R() * 140, z = 44 + R() * 40; if (Math.abs(x - 4) < 9 && z < 56) continue; put(x, z, 1.8 + R() * 2); }
      K.inst(pineGeo, pineMat, list, { cast: false });
      // pinheiros grandes enfeitados atrás das alas do chalé
      [[-13.2, -20.5, 2.6], [13.6, -21.5, 2.3], [-20, -16, 2.0], [21, -13, 1.9]].forEach(([x, z, s]) => {
        list.length = 0; put(x, z, s); K.inst(pineGeo, pineMat, list.slice(), { cast: false });
        const y0 = hgt(x, z); for (let k = 0; k < 90; k++) { const u = k / 90, yy = 0.9 + u * 2.6, rr = 1.02 * (1 - (yy - 0.7) / 3.3) + 0.06, a = u * Math.PI * 14; lit.push([x + Math.cos(a) * rr * s, y0 + yy * s, z + Math.sin(a) * rr * s, k % 3]); }
      });
      // estrela no topo do pinheiro maior
      K.halo(-13.2, hgt(-13.2, -20.5) + 3.75 * 2.6, -20.5, 0.6, 0xffd070, 2);
      const fairy = [0xffd08a, 0xff6a6a, 0x8ad0ff].map((c, i) => { const m = K.glow(c, 2.6); K.inst(new T.SphereGeometry(0.07, 6, 4), m, lit.filter(p => p[3] === i).map(p => [p[0], p[1], p[2]]), { cast: false }); return [m, new T.Color(c)]; });
      K.tick((dt, t) => fairy.forEach(([m, c], i) => m.color.copy(c).multiplyScalar(1.6 + Math.sin(t * 2.2 + i * 2.1) * 1.2)));
    }

    // ------------------------------------------------------------ deck de madeira, neve nas bordas, guarda-corpo
    const deckTex = K.canvasTex(1024, 1024, (g, w, h) => {
      const n = 16, s = h / n;
      for (let i = 0; i < n; i++) { let x = -R() * 300; while (x < w) { const L = 280 + R() * 400, v = 105 + R() * 30; g.fillStyle = `rgb(${v},${v * 0.66},${v * 0.42})`; g.fillRect(x, i * s, L, s); for (let k = 0; k < 6; k++) { g.strokeStyle = `rgba(60,30,12,${0.08 + R() * 0.1})`; g.beginPath(); const yy = i * s + 3 + R() * (s - 6); g.moveTo(x, yy); g.lineTo(x + L, yy + R() * 3 - 1.5); g.stroke(); } g.fillStyle = 'rgba(25,12,5,.9)'; g.fillRect(x + L - 2, i * s, 2, s); g.fillStyle = 'rgba(30,20,10,.6)'; g.fillRect(x + 10, i * s + s / 2 - 2, 3, 3); g.fillRect(x + L - 14, i * s + s / 2 - 2, 3, 3); x += L; } g.fillStyle = 'rgba(15,8,3,.95)'; g.fillRect(0, i * s + s - 3, w, 3); }
      for (let k = 0; k < 160; k++) { g.fillStyle = `rgba(235,242,255,${0.05 + R() * 0.12})`; g.beginPath(); g.ellipse(R() * w, R() * h, 6 + R() * 26, 3 + R() * 6, 0, 0, 7); g.fill(); }
      K.grain(g, w, h, 10);
    }, [10, 7]);
    K.floor(-14.8, -10.4, 14.8, 10.3, deckTex, { m: { roughness: 0.62, envMapIntensity: 0.4 } });
    K.box(29.8, 0.6, 20.9, woodD, 0, -0.31, -0.05, { cast: false });
    // neve acumulada nas bordas (camada transparente + montinhos)
    { const t = K.canvasTex(1024, 720, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        for (let k = 0; k < 2600; k++) { const side = k % 3, u = R(); let x, y; if (side === 0) { x = u * w; y = h - Math.pow(R(), 2.2) * 90; } else { x = (k % 2 ? w - Math.pow(R(), 2.2) * 80 : Math.pow(R(), 2.2) * 80); y = u * h; } const r = 6 + R() * 22; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(220,230,250,.38)'); gr.addColorStop(1, 'rgba(220,230,250,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      });
      K.add(new T.PlaneGeometry(29.6, 20.7).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({ map: t, color: 0x8a96b4, transparent: true, depthWrite: false }), 0, 0.016, -0.05, { cast: false, recv: true });
      const drifts = [];
      for (let x = -14.4; x <= 14.4; x += 0.55) drifts.push([x + R() * 0.2, 0.0, 9.95 + R() * 0.15, R() * 3, [0.45 + R() * 0.35, 0.16 + R() * 0.1, 0.35]]);
      for (let z = -9.8; z <= 9.8; z += 0.55) for (const s of [-1, 1]) drifts.push([s * (14.55 + R() * 0.15), 0.0, z + R() * 0.2, R() * 3, [0.35, 0.14 + R() * 0.12, 0.45 + R() * 0.35]]);
      K.inst(new T.SphereGeometry(1, 10, 6), snow, drifts, { cast: false });
    }
    // guarda-corpo de madeira com neve em cima e lanternas
    { const posts = [];
      for (let x = -14.75; x <= 14.8; x += 1.475) posts.push([x, 0.5, 10.2]);
      for (let z = -9.6; z < 10; z += 1.6) { posts.push([-14.85, 0.5, z]); posts.push([14.85, 0.5, z]); }
      K.inst(new T.BoxGeometry(0.14, 1.0, 0.14), woodD, posts);
      K.inst(new T.BoxGeometry(0.2, 0.08, 0.2), snow, posts.map(p => [p[0], 1.04, p[2]]), { cast: false });
      K.box(29.8, 0.08, 0.12, woodM, 0, 0.95, 10.2); K.box(29.8, 0.08, 0.12, woodM, 0, 0.5, 10.2);
      for (const s of [-1, 1]) { K.box(0.12, 0.08, 20.2, woodM, s * 14.85, 0.95, -0.2); K.box(0.12, 0.08, 20.2, woodM, s * 14.85, 0.5, -0.2); K.add(K.rbox(0.22, 0.09, 20.2, 0.04), snow, s * 14.85, 1.03, -0.2, { cast: false }); }
      K.add(K.rbox(29.8, 0.09, 0.22, 0.04), snow, 0, 1.03, 10.2, { cast: false });
      // lanternas de vela nos postes
      const lan = posts.filter((p, i) => i % 2 === 0);
      K.inst(new T.BoxGeometry(0.16, 0.22, 0.16), K.mat(0x1a1a1e, { roughness: 0.4, metalness: 0.5 }), lan.map(p => [p[0], 1.18, p[2]]), { cast: false });
      K.inst(new T.BoxGeometry(0.12, 0.16, 0.17), K.glow(0xffb050, 1.8), lan.map(p => [p[0], 1.18, p[2]]), { cast: false });
      K.inst(new T.ConeGeometry(0.13, 0.1, 4), K.mat(0x1a1a1e, { metalness: 0.5 }), lan.map(p => [p[0], 1.34, p[2], Math.PI / 4]), { cast: false });
      lan.forEach(p => K.pool(p[0], p[2] - (Math.abs(p[0]) > 14 ? 0 : 0.4), 0.9, 0xffa850, 0.32));
    }

    // ------------------------------------------------------------ partículas: neve caindo + vapor/fumaça
    { const N = 2600, H = 26, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) { pos[i * 3] = -42 + R() * 84; pos[i * 3 + 1] = R() * H; pos[i * 3 + 2] = -32 + R() * 66; }
      const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const mat = new T.PointsMaterial({ color: 0xf4f8ff, size: 3, map: K.radialTex, transparent: true, depthWrite: false, opacity: 0.95, sizeAttenuation: true });
      const layers = [0, 1].map(k => { const p = new T.Points(geo, mat); p.frustumCulled = false; p.onBeforeRender = (r, s, cam) => { mat.size = cam.isOrthographicCamera ? 3.4 : 0.22; }; K.root.add(p); return p; });
      K.tick((dt, t) => { const o = -((t * 1.1) % H) - 2; layers[0].position.set(Math.sin(t * 0.3) * 0.8, o, 0); layers[1].position.set(Math.sin(t * 0.3 + 1) * 0.8, o + H, 0); });
    }
    const steam = (x, y, z, o = {}) => {
      const n = o.n || 10, rise = o.rise || 1.6, spread = o.spread || 0.5, s0 = o.s0 || 0.4, s1 = o.s1 || 1.2, op = o.op || 0.3, speed = o.speed || 0.25, drift = o.drift || 0;
      const em = { k: o.k ?? 1, ps: [], setColor(c) { em.ps.forEach(p => p.s.material.color.set(c)); } };
      for (let i = 0; i < n; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: o.color || 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: o.add ? T.AdditiveBlending : T.NormalBlending })); K.root.add(s); em.ps.push({ s, ph: i / n + R() * 0.05, dx: (R() - 0.5) * spread, dz: (R() - 0.5) * spread }); }
      K.tick((dt, t) => { for (const p of em.ps) { const l = (t * speed + p.ph) % 1; p.s.position.set(x + p.dx * (0.4 + l) + Math.sin(t * 0.8 + p.ph * 7) * 0.15 * l + drift * l, y + l * rise, z + p.dz * (0.4 + l)); const sc = s0 + (s1 - s0) * l; p.s.scale.set(sc, sc, 1); p.s.material.opacity = em.k * op * Math.sin(l * Math.PI) * (1 - l * 0.3); p.s.visible = em.k > 0.01; } });
      return em;
    };

    // ------------------------------------------------------------ o chalé (fundo)
    const CZ = -10.3; // face da fachada
    K.box(18.8, 1.1, 12, stoneMat, 0, -0.05, -16.4, { cast: false });
    { // térreo: parede de troncos com janelões e porta (vazada) + interior aceso
      const sh = new T.Shape(); sh.moveTo(-9.2, 0); sh.lineTo(9.2, 0); sh.lineTo(9.2, 3.6); sh.lineTo(-9.2, 3.6); sh.lineTo(-9.2, 0);
      const holes = [[-0.8, 0.8, 0, 2.5], [-7.9, -4.9, 0.6, 3.05], [-4.1, -1.6, 0.6, 3.05], [1.6, 4.1, 0.6, 3.05], [4.9, 7.9, 0.6, 3.05]];
      holes.forEach(([a, b, c, d]) => { const p = new T.Path(); p.moveTo(a, c); p.lineTo(b, c); p.lineTo(b, d); p.lineTo(a, d); p.lineTo(a, c); sh.holes.push(p); });
      const wall = new T.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: false }); wall.translate(0, 0, CZ - 0.3);
      K.add(wall, logMat, 0, 0, 0, { occ: true });
      K.box(18.6, 0.5, 0.36, stoneMat, 0, 0.25, CZ - 0.15, { cast: false });
      // molduras, travessas e vidro
      holes.slice(1).forEach(([a, b, c, d]) => {
        const cx = (a + b) / 2, w = b - a, hh = d - c, cy = (c + d) / 2;
        K.box(w + 0.2, 0.12, 0.42, woodD, cx, c - 0.04, CZ - 0.1); K.box(w + 0.24, 0.14, 0.4, woodD, cx, d + 0.06, CZ - 0.1);
        K.box(0.1, hh, 0.12, woodD, cx, cy, CZ - 0.2); K.box(w, 0.08, 0.12, woodD, cx, c + hh * 0.68, CZ - 0.2);
        for (const s of [-1, 1]) K.box(0.08, hh, 0.12, woodD, cx + s * (w / 2 - 0.04), cy, CZ - 0.2);
        K.add(new T.PlaneGeometry(w, hh), new T.MeshStandardMaterial({ color: 0xffe2b8, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.16, envMapIntensity: 1.4 }), cx, cy, CZ - 0.18, { cast: false });
        // cortinas xadrez nas laterais (lado de dentro)
        for (const s of [-1, 1]) K.box(0.28, hh + 0.1, 0.04, plaidMat, cx + s * (w / 2 - 0.2), cy, CZ - 0.42, { cast: false });
        // jardineira com pinheirinhos nevados sob a janela
        K.box(w - 0.2, 0.26, 0.3, woodM, cx, c - 0.22, CZ + 0.12); K.add(K.rbox(w - 0.2, 0.1, 0.3, 0.04), snow, cx, c - 0.06, CZ + 0.12, { cast: false });
      });
      // porta dupla aberta, guirlanda e arandelas
      for (const s of [-1, 1]) { const d = K.box(0.78, 2.45, 0.07, woodM, 0, 1.23, 0, { parent: K.group(s * 0.8, 0, CZ - 0.25, -s * 1.2) }); d.position.x = -s * 0.39; K.box(0.5, 0.9, 0.08, K.glow(0xffc888, 0.9), -s * 0.39, 1.7, 0, { parent: d.parent, cast: false }); }
      K.torus(0.32, 0.09, K.mat(0x1f4a2a, { roughness: 0.9 }), 0, 3.0, CZ + 0.08, {}, 6, 18); K.box(0.16, 0.12, 0.05, redPaint, 0, 2.72, CZ + 0.14);
      for (let k = 0; k < 8; k++) K.sphere(0.035, K.mat(0xc8202a, { emissive: 0x801010, emissiveIntensity: 0.5 }), Math.cos(k * 0.8) * 0.32, 3.0 + Math.sin(k * 0.8) * 0.32, CZ + 0.15, { cast: false }, 6, 4);
      for (const s of [-1, 1]) { K.box(0.08, 0.2, 0.2, K.iron, s * 1.25, 2.3, CZ + 0.05); K.box(0.2, 0.3, 0.2, K.glow(0xffb050, 1.6), s * 1.25, 2.55, CZ + 0.15, { cast: false }); K.cone(0.18, 0.14, K.iron, s * 1.25, 2.77, CZ + 0.15, {}, 4); }
      K.sign('CHALET EDELWEISS', 3.0, 0.45, 0, 3.32, CZ + 0.05, { bg: '#3a2414', color: '#f1dfb4', size: 62, font: 'Georgia, serif' });
      K.box(3.15, 0.55, 0.06, woodD, 0, 3.32, CZ + 0.01);
      K.rug(0, -9.25, 1.6, 0.7, (g, w, h) => { g.fillStyle = '#5a3a22'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2a1a0e'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); g.fillStyle = '#e9dcb8'; g.font = 'bold 120px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GRÜEZI', w / 2, h / 2); });
      // interior visível: piso, parede do fundo, lareira acesa, sofá, chifres, lustre
      K.floor(-9.0, -14.6, 9.0, CZ - 0.3, K.canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { const v = 90 + R() * 30; g.fillStyle = `rgb(${v},${v * 0.6},${v * 0.35})`; g.fillRect(0, i * 32, w, 32); g.fillStyle = '#1a0e06'; g.fillRect(0, i * 32 + 30, w, 2); } }, [6, 2]), { m: { roughness: 0.4 } });
      K.add(new T.PlaneGeometry(18, 3.6), logMat, 0, 1.8, -14.6, { cast: false });
      for (const s of [-1, 1]) K.add(new T.PlaneGeometry(4.3, 3.6), logMat, s * 9.0, 1.8, -12.45, { cast: false, ry: -s * Math.PI / 2 });
      K.add(new T.PlaneGeometry(18, 4.3), K.mat(0x4a2e1a, { roughness: 0.8 }), 0, 3.55, -12.45, { cast: false, rx: Math.PI / 2 });
      for (let x = -8; x <= 8; x += 2) K.box(0.22, 0.26, 4.2, woodD, x, 3.42, -12.45, { cast: false });
      K.rug(-3.4, -12.3, 3.4, 2.2, (g, w, h) => { g.fillStyle = '#7a1a22'; g.fillRect(0, 0, w, h); g.strokeStyle = '#e9c87a'; g.lineWidth = 12; g.strokeRect(20, 20, w - 40, h - 40); g.fillStyle = '#e9c87a'; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(w / 2, h / 2, 20 + k * 18, 0, 7); g.globalAlpha = 0.15; g.fill(); } g.globalAlpha = 1; });
      { const fx = -3.4; K.box(2.4, 2.6, 0.6, stoneMat, fx, 1.3, -14.3); K.box(1.3, 1.0, 0.3, K.mat(0x0a0604), fx, 0.6, -14.0); K.box(2.7, 0.14, 0.7, woodD, fx, 1.5, -14.2);
        [[-0.25, 0.22], [0, 0.32], [0.25, 0.24], [-0.1, 0.18], [0.12, 0.2]].forEach(([dx, s]) => K.flame(fx + dx, 0.18, -13.95, s, 0xff9a30));
        K.halo(fx, 0.6, -13.7, 1.2, 0xff8a30, 0.8);
        // chifres de alce na parede e velas no consolo
        const ant = K.group(fx, 2.3, -14.0); K.sphere(0.12, woodM, 0, 0, 0, { parent: ant }); for (const s of [-1, 1]) for (let k = 0; k < 4; k++) K.cyl(0.02, 0.03, 0.4 - k * 0.05, K.mat(0xe8dcc0), s * (0.15 + k * 0.1), 0.15 + k * 0.08, 0, { parent: ant, rz: -s * (0.6 + k * 0.25) }, 5);
        for (const dx of [-0.9, -0.6, 0.7, 1.0]) { K.cyl(0.03, 0.03, 0.18, M.candle, fx + dx, 1.66, -14.15, { cast: false }, 6); K.flame(fx + dx, 1.76, -14.15, 0.014); } }
      K.sofa(-3.4, -12.6, 2.6, Math.PI, { cloth: K.mat(0x6a3a22, { roughness: 0.6 }), pillow: 0xc8322f });
      K.sofa(3.4, -13.6, 2.4, 0, { cloth: K.mat(0x2a3a4a, { roughness: 0.85 }), pillow: 0xe9dcb8 });
      K.table(3.4, -12.3, { r: 0.5, h: 0.45, glasses: 2, cloth: false, top: woodD });
      // estante de livros e piano de armário
      K.box(1.8, 2.6, 0.4, woodD, 6.8, 1.3, -14.35); for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) K.box(0.12, 0.42, 0.26, K.mat([0x7a1a22, 0x1f3a6a, 0x2f5a3a, 0xc9a227, 0x5a3a22][(k + r) % 5]), 6.05 + k * 0.17, 0.5 + r * 0.6, -14.2, { cast: false });
      K.box(1.5, 1.3, 0.6, K.mat(0x1a0e08, { roughness: 0.3 }), 0.8, 0.65, -14.25); K.box(1.4, 0.06, 0.25, M.white, 0.8, 0.9, -13.9);
      // lustre de chifres
      const ch = K.group(0, 3.2, -12.2); K.cyl(0.006, 0.006, 0.6, K.iron, 0, 0.1, 0, { parent: ch }); K.torus(0.5, 0.04, K.mat(0xe8dcc0), 0, -0.2, 0, { parent: ch, rx: Math.PI / 2 }, 6, 16);
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; K.cyl(0.02, 0.02, 0.12, M.candle, Math.cos(a) * 0.5, -0.1, Math.sin(a) * 0.5, { parent: ch, cast: false }, 5); K.flame(Math.cos(a) * 0.5, 3.15, -12.2 + Math.sin(a) * 0.5, 0.015); }
      K.plight(-1.0, 2.6, -12.2, 0xffa860, 1.8, 8);
      K.pool(0, -9.2, 1.8, 0xffb070, 0.5); for (const x of [-6.4, -2.85, 2.85, 6.4]) K.pool(x, -9.4, 1.5, 0xffa860, 0.32);
    }
    // segundo andar: tábuas verticais, janelas com venezianas, sacada entalhada
    const winTex = (lit) => K.canvasTex(128, 160, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, 0, h); if (lit) { gr.addColorStop(0, '#ffcf86'); gr.addColorStop(1, '#ff9a40'); } else { gr.addColorStop(0, '#1a2440'); gr.addColorStop(1, '#0a0e1a'); }
      g.fillStyle = gr; g.fillRect(0, 0, w, h); if (!lit) { g.fillStyle = 'rgba(150,180,230,.15)'; g.beginPath(); g.moveTo(10, 10); g.lineTo(50, 10); g.lineTo(10, 70); g.fill(); }
      g.fillStyle = '#2a1a0e'; g.fillRect(0, 0, w, 8); g.fillRect(0, h - 8, w, 8); g.fillRect(0, 0, 8, h); g.fillRect(w - 8, 0, 8, h); g.fillRect(w / 2 - 4, 0, 8, h); g.fillRect(0, h * 0.45, w, 7);
    });
    const winLit = new T.MeshBasicMaterial({ map: winTex(true), color: new T.Color(0xffffff).multiplyScalar(1.3), toneMapped: false });
    const winDark = new T.MeshStandardMaterial({ map: winTex(false), roughness: 0.15, metalness: 0.3 });
    const winFire = new T.MeshBasicMaterial({ map: winTex(true), color: new T.Color(0xffa060).multiplyScalar(1.8), toneMapped: false });
    let upWin = null;
    { K.box(18.4, 3.0, 0.3, plankMat, 0, 5.1, CZ - 0.25, { occ: true });
      K.box(18.8, 0.18, 0.5, woodD, 0, 3.66, CZ - 0.15);
      const shutter = K.canvasTex(64, 128, (g, w, h) => { g.fillStyle = '#2a5a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a3a26'; for (let k = 0; k < 12; k++) g.fillRect(4, 6 + k * 10, w - 8, 3); g.fillStyle = '#c8322f'; g.beginPath(); g.moveTo(32, 70); g.bezierCurveTo(10, 52, 18, 38, 32, 50); g.bezierCurveTo(46, 38, 54, 52, 32, 70); g.fill(); g.strokeStyle = '#e9dcb8'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4); });
      const shM = K.texMat(shutter);
      [[-5.6, 'fogo'], [-2.2, 'lit'], [2.2, 'lit'], [5.6, 'lit']].forEach(([x, k]) => {
        const m = K.add(new T.PlaneGeometry(1.2, 1.5), k === 'fogo' ? winDark : winLit, x, 5.0, CZ - 0.08, { cast: false });
        if (k === 'fogo') upWin = m;
        K.box(1.4, 0.12, 0.2, woodD, x, 4.2, CZ); K.box(1.45, 0.12, 0.2, woodD, x, 5.8, CZ); K.add(K.rbox(1.45, 0.08, 0.24, 0.03), snow, x, 5.9, CZ + 0.02, { cast: false });
        for (const s of [-1, 1]) K.add(new T.PlaneGeometry(0.6, 1.55), shM, x + s * 0.95, 5.0, CZ - 0.06, { cast: false });
        K.box(1.3, 0.22, 0.3, woodM, x, 4.25, CZ + 0.15); for (let j = 0; j < 4; j++) K.sphere(0.08, K.mat(j % 2 ? 0xc8202a : 0x2a6a3a), x - 0.45 + j * 0.3, 4.42, CZ + 0.15, { cast: false }, 6, 4);
      });
      // sacada de madeira recortada (decorativa, sobre a porta)
      const bal = K.canvasTex(512, 64, (g, w, h) => { g.fillStyle = '#5a3820'; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'destination-out'; for (let k = 0; k < 16; k++) { const x = k * 32 + 16; g.beginPath(); g.moveTo(x, 44); g.bezierCurveTo(x - 12, 30, x - 8, 16, x, 24); g.bezierCurveTo(x + 8, 16, x + 12, 30, x, 44); g.fill(); } g.globalCompositeOperation = 'source-over'; g.fillStyle = '#2a1a0e'; g.fillRect(0, 0, w, 5); g.fillRect(0, h - 5, w, 5); });
      const balM = new T.MeshStandardMaterial({ map: bal, transparent: true, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8 });
      K.box(7.6, 0.16, 1.1, woodD, 0, 3.8, CZ + 0.5); K.add(new T.PlaneGeometry(7.6, 0.85), balM, 0, 4.3, CZ + 1.05, { cast: false });
      for (const s of [-1, 1]) K.add(new T.PlaneGeometry(1.1, 0.85), balM, s * 3.8, 4.3, CZ + 0.5, { cast: false, ry: Math.PI / 2 });
      K.add(K.rbox(7.7, 0.12, 0.2, 0.05), snow, 0, 4.78, CZ + 1.05, { cast: false });
      const ic = []; for (let x = -3.7; x <= 3.7; x += 0.18) ic.push([x, 3.7, CZ + 1.02, 0, [1, 0.15 + R() * 0.35, 1]]);
      for (let k = 0; k < 60; k++) { const u = k / 59, s = k % 2 ? 1 : -1; ic.push([s * 10.4 * (1 - u * 0.95), 6.15 + 5.3 * u * 0.95, -9.0, 0, [1.2, 0.2 + R() * 0.5, 1.2]]); }
      K.inst(new T.ConeGeometry(0.035, 1, 5).rotateX(Math.PI).translate(0, -0.5, 0), K.mat(0xdff0ff, { roughness: 0.05, transparent: true, opacity: 0.8, emissive: 0x6a8ab0, emissiveIntensity: 0.6 }), ic, { cast: false });
      // empena com tábuas, janela redonda e telhado nevado
      const gs = new T.Shape(); gs.moveTo(-9.3, 6.6); gs.lineTo(9.3, 6.6); gs.lineTo(0, 11.35); gs.lineTo(-9.3, 6.6);
      const gab = new T.ExtrudeGeometry(gs, { depth: 0.3, bevelEnabled: false }); gab.translate(0, 0, CZ - 0.45); K.add(gab, plankMat, 0, 0, 0, { occ: true });
      K.add(new T.CircleGeometry(0.6, 24), winLit, 0, 8.6, CZ - 0.13, { cast: false }); K.torus(0.62, 0.07, woodD, 0, 8.6, CZ - 0.1, {}, 6, 24); K.box(1.2, 0.06, 0.06, woodD, 0, 8.6, CZ - 0.09); K.box(0.06, 1.2, 0.06, woodD, 0, 8.6, CZ - 0.09);
      K.sign('1898', 1.3, 0.4, 0, 7.4, CZ - 0.12, { color: '#e9dcb8', size: 90 });
      const a = Math.atan2(5.4, 10.6), L = Math.hypot(10.6, 5.4) + 0.4;
      for (const s of [-1, 1]) {
        const cx = s * 5.3, cy = 8.9, n = [s * Math.sin(a), Math.cos(a)];
        K.box(L, 0.3, 13.6, woodD, cx, cy, -15.8, { rz: -s * a, cast: false, occ: true });
        K.add(K.rbox(L - 0.1, 0.38, 13.4, 0.15), snow, cx + n[0] * 0.3, cy + n[1] * 0.3, -15.7, { rz: -s * a, cast: false });
        K.box(L, 0.4, 0.14, K.mat(0x7a1a1a, { roughness: 0.6 }), cx, cy - 0.12, -9.0, { rz: -s * a, cast: false });
        for (let k = 0; k < 5; k++) K.box(0.22, 0.22, 0.6, woodD, s * (1.5 + k * 2.0), 11.1 - (1.5 + k * 2.0) * 5.4 / 10.6 - 0.25, -9.2, { cast: false });
      }
      // chaminés de pedra
      const chim = (x, z) => { const ry = 11.35 - Math.abs(x) * 5.4 / 10.6; K.box(0.95, 3.4, 0.95, stoneMat, x, ry + 0.8, z, { cast: false }); K.box(1.2, 0.14, 1.2, K.mat(0x3a3a40), x, ry + 2.55, z, { cast: false }); K.add(K.rbox(1.15, 0.22, 1.15, 0.08), snow, x, ry + 2.7, z, { cast: false }); return ry + 2.75; };
      const y1 = chim(4.6, -14.5), y2 = chim(-5.6, -12.6);
      steam(4.6, y1, -14.5, { n: 14, rise: 7, spread: 0.6, s0: 0.8, s1: 3.4, op: 0.32, speed: 0.12, color: 0x9aa2b8, drift: 3 });
      var smoke2 = steam(-5.6, y2, -12.6, { n: 14, rise: 7, spread: 0.6, s0: 0.8, s1: 3.4, op: 0.36, speed: 0.12, color: 0xa8aec0, drift: 3, k: 0 });
      // alas laterais térreas com telhado nevado
      for (const s of [-1, 1]) {
        const cx = s * 12.0; const t = K.canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#6a4426'; g.fillRect(0, 0, w, h); for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(20,10,4,.7)'; g.fillRect(0, k * 14 + 12, w, 2); } for (const x of [40, 150]) { g.fillStyle = '#2a1a0e'; g.fillRect(x - 4, 36, 64, 58); g.fillStyle = s < 0 ? '#ffc070' : '#ffd9a0'; g.fillRect(x, 40, 56, 50); g.fillStyle = '#2a1a0e'; g.fillRect(x + 26, 40, 4, 50); g.fillRect(x, 62, 56, 3); } });
        K.add(new T.BoxGeometry(5.4, 3.3, 7.6), [logMat, logMat, logMat, logMat, new T.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.35, roughness: 0.8 }), logMat], cx, 1.65, -14.4, { cast: false });
        K.box(6.0, 0.25, 8.4, woodD, cx, 3.55, -14.2, { rx: 0.12, cast: false }); K.add(K.rbox(5.9, 0.3, 8.2, 0.12), snow, cx, 3.78, -14.2, { rx: 0.12, cast: false });
      }
      K.sign('SKI · RAUM', 2.4, 0.4, 12.0, 2.9, -10.55, { bg: '#2a1a0e', color: '#e9dcb8', size: 70 });
    }
    // lareira do segundo andar (missão): janela escura que acende
    const upLight = K.plight(-5.6, 5.0, -9.6, 0xff8a30, 0, 7);
    const upHalo = K.halo(-5.6, 5.0, -10.1, 1.3, 0xff8a30, 0.9); upHalo.visible = false;
    let upOn = 0; K.tick((dt, t) => { if (upOn > 0) { const f = 0.85 + Math.sin(t * 9) * 0.1 + Math.sin(t * 23) * 0.06; upLight.intensity = 1.6 * f * upOn; winFire.color.setRGB(1.8 * f, 1.05 * f, 0.55 * f); } });
    K.tell('lareira', (live) => { upWin.material = winFire; upHalo.visible = true; if (live) K.anim(2, e => { upOn = e; smoke2.k = e; }); else { upOn = 1; smoke2.k = 1; } }, () => { upWin.material = winDark; upHalo.visible = false; upOn = 0; upLight.intensity = 0; smoke2.k = 0; });

    // ------------------------------------------------------------ terraço da frente do chalé: sofás com peles, fondue
    const sheep = (x, y, z, ry = 0, s = 1) => { const g = new T.IcosahedronGeometry(1, 1); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const k = 1 + Math.sin(p.getX(i) * 9 + p.getZ(i) * 7) * 0.08; p.setXYZ(i, p.getX(i) * k, p.getY(i), p.getZ(i) * k); } g.computeVertexNormals(); return K.add(g, wool, x, y, z, { s: [0.34 * s, 0.07, 0.27 * s], ry, cast: false }); };
    for (const s of [-1, 1]) {
      const x = s * 3.6; K.sofa(x, -9.05, 2.2, 0, { cloth: K.mat(s < 0 ? 0x5a2a1a : 0x3a2a22, { roughness: 0.7 }), pillow: s < 0 ? 0xc8322f : 0xe9dcb8 });
      sheep(x - 0.5, 0.55, -8.95, 0.3); sheep(x + 0.5, 0.55, -8.95, -0.2);
      K.box(1.6, 0.03, 0.9, plaidMat, x + 0.55, 0.75, -9.25, { rx: -0.5, cast: false });
      K.col(x - 1.15, -9.6, x + 1.15, -8.6);
      [-0.55, 0.55].forEach(dx => K.slot(x + dx, -8.95, x + dx, -6, 'sit'));
      // mesinha com fondue
      const tx = x, tz = -7.8; K.cyl(0.45, 0.45, 0.05, woodD, tx, 0.5, tz, {}, 16); K.cyl(0.06, 0.12, 0.48, woodD, tx, 0.24, tz, {}, 8);
      K.cyl(0.13, 0.11, 0.12, K.mat(0xc8322f, { roughness: 0.3 }), tx, 0.66, tz, {}, 14); K.cyl(0.12, 0.12, 0.01, K.mat(0xf2d070, { emissive: 0xc09020, emissiveIntensity: 0.4 }), tx, 0.72, tz, { cast: false }, 14);
      K.cyl(0.1, 0.1, 0.08, K.iron, tx, 0.56, tz, {}, 8); K.flame(tx, 0.55, tz, 0.03, 0x60a0ff);
      for (let k = 0; k < 5; k++) { const a = k * 1.25; K.cyl(0.004, 0.004, 0.36, K.silver, tx + Math.cos(a) * 0.08, 0.8, tz + Math.sin(a) * 0.08, { rz: Math.cos(a) * 0.5, rx: Math.sin(a) * 0.5, cast: false }, 3); }
      for (let k = 0; k < 8; k++) K.box(0.035, 0.035, 0.035, K.mat(0xd9a060), tx + 0.25 + (k % 3) * 0.05, 0.54, tz + 0.1 - Math.floor(k / 3) * 0.05, { cast: false });
      K.colR(tx, tz, 0.45);
      K.slot(x - 1.0, -7.3, tx, tz, 'talk'); K.slot(x + 1.0, -7.3, tx, tz, 'talk');
      // pinheirinho enfeitado em jardineira ao lado da porta
      const px = s * 6.3; K.box(1.0, 0.5, 1.0, woodM, px, 0.25, -9.15); K.add(K.rbox(1.0, 0.12, 1.0, 0.05), snow, px, 0.52, -9.15, { cast: false });
      K.inst(pineGeo, pineMat, [[px, 0.5, -9.15, R() * 6, 0.68]]);
      const bl = []; for (let k = 0; k < 40; k++) { const u = k / 40, yy = 0.9 + u * 2.5, rr = (1.02 * (1 - (yy - 0.7) / 3.3) + 0.08) * 0.68, a = u * Math.PI * 10; bl.push([px + Math.cos(a) * rr, 0.5 + yy * 0.68, -9.15 + Math.sin(a) * rr]); }
      K.inst(new T.SphereGeometry(0.045, 6, 4), K.glow(s < 0 ? 0xffd08a : 0xff7070, 3), bl, { cast: false });
      K.colR(px, -9.15, 0.55);
    }
    // lenha empilhada junto à ala direita
    { const logs = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 9 - r; k++) logs.push([10.4 + k * 0.24 + r * 0.12, 0.12 + r * 0.21, -9.25, 0, 1, Math.PI / 2]);
      const lg = new T.CylinderGeometry(0.11, 0.11, 0.6, 7); K.inst(lg, woodM, logs); K.inst(new T.CircleGeometry(0.1, 7).rotateX(Math.PI / 2), K.mat(0xc9a070), logs.map(p => [p[0], p[1], p[2] + 0.301, 0, 1, Math.PI / 2]), { cast: false });
      K.add(K.rbox(2.3, 0.12, 0.62, 0.05), snow, 11.4, 0.92, -9.25, { cast: false }); K.col(10.25, -9.6, 12.6, -8.9);
      K.box(0.04, 0.9, 0.04, woodM, 12.9, 0.6, -9.2, { rz: 0.3 }); K.box(0.2, 0.25, 0.03, K.iron, 13.05, 0.25, -9.2, { rz: 0.3 }); }

    // ------------------------------------------------------------ palco do iodelei com alphorn e sinos de vaca
    { const px = -8.6, pz = -8.3;
      K.box(2.6, 0.3, 1.8, woodD, px, 0.15, pz); K.box(2.66, 0.04, 1.86, K.mat(0x2a5a3a, { roughness: 0.95 }), px, 0.31, pz, { cast: false });
      K.col(px - 1.3, pz - 0.9, px + 1.3, pz + 0.9);
      for (const s of [-1, 1]) K.box(0.14, 2.6, 0.14, woodD, px + s * 1.2, 1.3, pz - 0.85);
      K.box(2.7, 0.16, 0.18, woodD, px, 2.6, pz - 0.85);
      K.sign('JODLERCHÖRLI', 2.4, 0.4, px, 2.95, pz - 0.82, { bg: '#7a1a1a', color: '#f6e7c0', size: 56 });
      const bells = []; for (let k = 0; k < 5; k++) { const x = px - 0.9 + k * 0.45; K.cyl(0.006, 0.006, 0.3, M.black, x, 2.38, pz - 0.85, { cast: false }, 3); bells.push(K.lathe([[0, 0], [0.11, 0], [0.09, 0.08], [0.07, 0.2], [0, 0.22]], K.brass, x, 2.0, pz - 0.85, {}, 10)); K.box(0.12, 0.05, 0.03, K.mat(0xc8322f), x, 2.23, pz - 0.78); }
      K.tick((dt, t) => bells.forEach((b, i) => b.rotation.z = Math.sin(t * 2 + i) * 0.08));
      // alphorn apoiado no palco
      const ah = K.group(px - 0.15, 0.32, pz + 0.68, 0); K.cyl(0.03, 0.06, 2.6, woodL, 0, 0.12, 0, { parent: ah, rz: Math.PI / 2 - 0.05 }, 8);
      K.lathe([[0.06, 0], [0.09, 0.15], [0.16, 0.3], [0.24, 0.38], [0.22, 0.4]], woodL, 1.35, 0.06, 0, { parent: ah, rz: -Math.PI / 2 - 0.4 }, 14);
      K.torus(0.06, 0.012, K.mat(0x7a1a1a), 0.8, 0.1, 0, { parent: ah, ry: Math.PI / 2 }); K.torus(0.05, 0.012, K.mat(0x7a1a1a), -0.4, 0.14, 0, { parent: ah, ry: Math.PI / 2 });
      K.box(0.08, 0.4, 0.08, woodD, px + 1.05, 0.5, pz - 0.2);
      K.spot(px + 3, 4.2, pz + 4, px, 1.2, pz, 0xffd8a0, 1.2, 12, 0.35);
      // pista de dança na frente do palco
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) K.slot(-7.6 + i * 1.15 + (j % 2) * 0.3, -6.3 + j * 0.95, px, pz, 'dance');
      [[-9.8, -7.0], [-6.4, -7.4]].forEach(([x, z]) => K.slot(x, z, px, pz, 'view'));
    }

    // ------------------------------------------------------------ cabana do glühwein (esquerda) e caldeirão
    let liquid = null, cauldronSteam = null;
    { const x0 = -14.4, x1 = -11.4, z0 = -8.4, z1 = -4.2, cz = (z0 + z1) / 2;
      K.box(0.15, 2.5, z1 - z0, logMat, x0 + 0.08, 1.25, cz);
      for (const z of [z0, z1]) K.box(x1 - x0, 2.5, 0.15, logMat, (x0 + x1) / 2, 1.25, z);
      K.box(0.5, 1.05, z1 - z0, woodM, x1 + 0.1, 0.52, cz); K.box(0.66, 0.07, z1 - z0 + 0.1, woodD, x1 + 0.15, 1.07, cz);
      for (const z of [z0 + 0.1, z1 - 0.1]) K.box(0.14, 2.5, 0.14, woodD, x1 + 0.25, 1.25, z);
      const a = Math.atan2(0.8, 1.9);
      for (const s of [-1, 1]) { const cx = -12.9 + s * 0.95; K.box(2.15, 0.12, z1 - z0 + 0.8, woodD, cx, 2.92, cz, { rz: s * a }); K.add(K.rbox(2.1, 0.18, z1 - z0 + 0.7, 0.07), snow, cx + s * 0.07, 3.06, cz, { rz: s * a, cast: false }); }
      K.box(0.3, 0.6, 0.15, woodD, -12.9, 3.05, z0 - 0.35);
      K.col(-14.5, z0 - 0.1, -11.0, z1 + 0.1);
      // prateleiras com canecas vermelhas e garrafas
      for (const y of [1.3, 1.8]) { K.box(0.3, 0.04, z1 - z0 - 0.3, woodD, x0 + 0.3, y, cz); const mugs = []; for (let k = 0; k < 12; k++) mugs.push([x0 + 0.3, y + 0.06, z0 + 0.4 + k * 0.29]); K.inst(new T.CylinderGeometry(0.045, 0.04, 0.1, 10), K.mat(0xb8262a, { roughness: 0.35 }), mugs, { cast: false }); }
      for (let k = 0; k < 10; k++) K.lathe([[0, 0], [0.04, 0], [0.04, 0.2], [0.014, 0.28], [0, 0.3]], K.mat([0x5a1018, 0x2c4a2a, 0xc9a227][k % 3], { roughness: 0.15, emissive: 0x200808, emissiveIntensity: 0.4 }), x0 + 0.3, 2.04, z0 + 0.5 + k * 0.33, { cast: false }, 8);
      // canecas no balcão, panela de vinho, laranjas e paus de canela
      for (let k = 0; k < 7; k++) { const z = z0 + 0.5 + k * 0.5; K.cyl(0.05, 0.045, 0.11, K.mat(k % 2 ? 0xb8262a : 0xf3eee2, { roughness: 0.35 }), x1 + 0.2, 1.17, z, { cast: false }, 10); K.torus(0.03, 0.008, K.mat(k % 2 ? 0xb8262a : 0xf3eee2), x1 + 0.2, 1.17, z + 0.055, { ry: 0, cast: false }, 4, 8); K.cyl(0.043, 0.043, 0.005, K.mat(0x6a0a14, { emissive: 0x3a0408, emissiveIntensity: 0.5 }), x1 + 0.2, 1.21, z, { cast: false }, 10); }
      for (let k = 0; k < 6; k++) K.sphere(0.05, K.mat(0xff8a1c, { roughness: 0.6 }), x1 + 0.35, 1.15, z1 - 0.4 - k * 0.1, { cast: false }, 8, 6);
      for (let k = 0; k < 5; k++) K.cyl(0.008, 0.008, 0.12, woodL, x1 + 0.35, 1.13, z0 + 0.3 + k * 0.03, { rx: Math.PI / 2, cast: false }, 4);
      // corações de pão de mel pendurados e guirlanda com luzes
      const heart = new T.Shape(); heart.moveTo(0, -0.12); heart.bezierCurveTo(-0.18, 0.02, -0.08, 0.14, 0, 0.05); heart.bezierCurveTo(0.08, 0.14, 0.18, 0.02, 0, -0.12);
      const hg = new T.ShapeGeometry(heart);
      for (let k = 0; k < 6; k++) { const z = z0 + 0.6 + k * 0.6; K.add(hg, K.mat(0x8a4a20, { side: T.DoubleSide }), x1 + 0.27, 2.05 + (k % 2) * 0.1, z, { ry: Math.PI / 2, cast: false }); K.add(new T.RingGeometry(0.07, 0.085, 16), K.mat(0xf6f3ec, { side: T.DoubleSide }), x1 + 0.28, 2.05 + (k % 2) * 0.1, z, { ry: Math.PI / 2, cast: false }); K.cyl(0.003, 0.003, 0.3, M.black, x1 + 0.27, 2.25 + (k % 2) * 0.1, z, { cast: false }, 3); }
      K.inst(new T.SphereGeometry(0.1, 6, 4), K.mat(0x1f4a2a, { roughness: 0.9 }), Array.from({ length: 24 }, (_, k) => [x1 + 0.3, 2.45 - Math.sin(k / 23 * Math.PI) * 0.15, z0 + 0.1 + k * (z1 - z0 - 0.2) / 23]), { cast: false });
      K.bulbs([x1 + 0.35, 2.45, z0 + 0.1], [x1 + 0.35, 2.45, z1 - 0.1], 14, 0.18, 0xffc070, 3.4);
      K.sign('GLÜHWEIN', 2.2, 0.5, x1 + 0.32, 2.7, cz, { ry: Math.PI / 2, neon: true, color: '#ff5a4a', size: 84, k: 2.2, font: 'Georgia, serif' });
      // lousa de preços
      const lousa = K.canvasTex(128, 160, (g, w, h) => { g.fillStyle = '#1a1e1a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a5a32'; g.lineWidth = 10; g.strokeRect(0, 0, w, h); g.fillStyle = '#f0ece0'; g.font = 'bold 15px sans-serif'; ['GLÜHWEIN 8.-', 'PUNSCH  7.-', 'HEISSE', 'SCHOKO 6.-', 'RACLETTE 12.-'].forEach((s, i) => g.fillText(s, 12, 30 + i * 26)); });
      { const g = K.group(-10.7, 0, -8.9, -0.6); K.add(new T.PlaneGeometry(0.6, 0.75), K.texMat(lousa), 0, 0.75, 0.02, { parent: g, cast: false }); for (const s of [-1, 1]) K.box(0.04, 1.2, 0.04, woodM, s * 0.27, 0.55, 0, { parent: g, rx: s * 0.15 }); }
      K.plight(-11.0, 2.3, cz, 0xffa860, 1.6, 7);
      [-7.6, -6.7, -5.8, -4.9].forEach(z => K.slot(-10.35, z, -11.4, z, 'bar'));
      // caldeirão no tripé, com fogo embaixo e concha
      const ccx = -12.6, ccz = -2.6;
      for (let k = 0; k < 3; k++) { const an = k * 2.094 + 0.3; K.cyl(0.025, 0.025, 1.6, K.iron, ccx + Math.cos(an) * 0.42, 0.75, ccz + Math.sin(an) * 0.42, { rz: Math.cos(an) * 0.33, rx: -Math.sin(an) * 0.33 }, 6); }
      K.cyl(0.006, 0.006, 0.5, K.iron, ccx, 1.27, ccz, { cast: false }, 3);
      K.lathe([[0, 0], [0.2, 0.02], [0.33, 0.14], [0.36, 0.3], [0.32, 0.44], [0.34, 0.46], [0.3, 0.46]], K.mat(0x1a1a1e, { roughness: 0.4, metalness: 0.6 }), ccx, 0.48, ccz, {}, 16);
      liquid = K.cyl(0.31, 0.31, 0.01, K.mat(0x6a0a14, { emissive: 0x5a0610, emissiveIntensity: 0.6, roughness: 0.1 }), ccx, 0.9, ccz, { cast: false }, 18);
      const lad = K.group(ccx - 0.1, 0.92, ccz - 0.05, 0.4); K.cyl(0.012, 0.012, 0.8, K.silver, 0, 0.3, 0, { parent: lad, rz: 0.6 }, 5); K.sphere(0.07, K.silver, 0.25, -0.05, 0, { parent: lad }, 8, 5);
      K.tick((dt, t) => { lad.rotation.y = 0.4 + Math.sin(t * 1.4) * 0.5; });
      for (let k = 0; k < 6; k++) K.cyl(0.04, 0.05, 0.5, woodD, ccx + Math.cos(k) * 0.12, 0.08, ccz + Math.sin(k) * 0.12, { rz: Math.PI / 2, ry: k * 1.05 }, 6);
      [[0, 0.14], [0.1, 0.1], [-0.09, 0.11]].forEach(([dx, s]) => K.flame(ccx + dx, 0.1, ccz + dx * 0.5, s, 0xff8a20));
      K.pool(ccx, ccz, 1.6, 0xff7a20, 0.6);
      K.box(0.8, 0.02, 0.8, stoneMat, ccx, 0.012, ccz, { cast: false });
      K.colR(ccx, ccz, 0.6);
      cauldronSteam = steam(ccx, 1.0, ccz, { n: 9, rise: 1.4, spread: 0.3, s0: 0.25, s1: 0.9, op: 0.35, speed: 0.3, color: 0xfff0e6 });
      // barril de apoio com canecas
      K.lathe([[0, 0], [0.3, 0], [0.36, 0.45], [0.3, 0.9], [0, 0.9]], woodM, -13.7, 0, -0.6, {}, 14); K.cyl(0.31, 0.31, 0.03, woodD, -13.7, 0.9, -0.6, {}, 14); for (const y of [0.18, 0.72]) K.torus(0.34, 0.015, K.iron, -13.7, y, -0.6, { rx: Math.PI / 2 }, 4, 16);
      for (let k = 0; k < 3; k++) K.cyl(0.045, 0.04, 0.1, K.mat(0xb8262a, { roughness: 0.35 }), -13.7 + Math.cos(k * 2) * 0.12, 0.97, -0.6 + Math.sin(k * 2) * 0.12, { cast: false }, 8);
      K.colR(-13.7, -0.6, 0.35); K.ringSlots(-13.7, -0.6, 2, 0.8, 'talk', 0, -1.2);
      K.slot(-11.4, -3.4, ccx, ccz, 'bar');
    }
    K.tell('gluhwein', (live) => { liquid.material = K.glow(0x9a30ff, 2.2); cauldronSteam.setColor(0xc070ff); if (live) K.anim(1.2, e => liquid.scale.setScalar(1 + Math.sin(e * 20) * 0.08)); }, () => { liquid.material = K.mat(0x6a0a14, { emissive: 0x5a0610, emissiveIntensity: 0.6, roughness: 0.1 }); cauldronSteam.setColor(0xfff0e6); liquid.scale.setScalar(1); });

    // ------------------------------------------------------------ fogueira circular com bancos e peles de carneiro
    const fireF = [];
    { const cx = 0.5, cz = -1.6;
      K.cyl(1.25, 1.3, 0.02, K.mat(0x3a3a40, { roughness: 0.95 }), cx, 0.012, cz, { cast: false }, 24);
      const st = []; for (let k = 0; k < 14; k++) { const a = k / 14 * Math.PI * 2; st.push([cx + Math.cos(a) * 0.9, 0.14, cz + Math.sin(a) * 0.9, a, [0.26, 0.2, 0.2]]); }
      K.inst(new T.DodecahedronGeometry(1, 0), stoneM, st);
      K.cyl(0.75, 0.75, 0.04, K.mat(0x1a1210, { roughness: 1 }), cx, 0.06, cz, { cast: false }, 16);
      for (let k = 0; k < 6; k++) { const a = k * 1.05; K.cyl(0.06, 0.07, 0.9, woodD, cx + Math.cos(a) * 0.2, 0.3, cz + Math.sin(a) * 0.2, { rz: Math.cos(a) * 0.55, rx: -Math.sin(a) * 0.55 }, 6); }
      const emb = []; for (let k = 0; k < 18; k++) emb.push([cx + (R() - 0.5) * 0.9, 0.09, cz + (R() - 0.5) * 0.9, R() * 6, 0.04 + R() * 0.04]);
      K.inst(new T.IcosahedronGeometry(1, 0), K.glow(0xff5a10, 2.2), emb, { cast: false });
      [[0, 0, 0.34], [0.18, 0.1, 0.24], [-0.16, 0.08, 0.26], [0.05, -0.18, 0.22], [-0.08, 0.2, 0.2], [0.2, -0.14, 0.18], [-0.22, -0.1, 0.2]].forEach(([dx, dz, s]) => fireF.push(K.flame(cx + dx, 0.12, cz + dz, s, 0xff8a20)));
      const sparks = steam(cx, 0.6, cz, { n: 12, rise: 3.2, spread: 0.7, s0: 0.08, s1: 0.03, op: 1, speed: 0.45, color: 0xffa040, add: true });
      steam(cx, 1.0, cz, { n: 8, rise: 4, spread: 0.4, s0: 0.5, s1: 2.0, op: 0.12, speed: 0.15, color: 0x6a6a78 });
      const fl = K.plight(cx, 1.4, cz, 0xff8a30, 2.6, 11); const pool = K.pool(cx, cz, 4.2, 0xff8a30, 0.55);
      let blue = 0; K.tick((dt, t) => { fl.intensity = (2.4 + Math.sin(t * 13) * 0.3 + Math.sin(t * 7.3) * 0.25); });
      fireF.base = fireF.map(f => f.material);
      fireF.light = fl; fireF.pool = pool; fireF.sparks = sparks;
      // bancos curvos de madeira com peles de carneiro
      for (let b = 0; b < 4; b++) {
        const ac = Math.PI / 4 + b * Math.PI / 2, r = 2.35;
        for (let s = 0; s < 3; s++) { const a = ac - 0.32 + s * 0.32, x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; K.box(0.76, 0.09, 0.5, woodL, x, 0.44, z, { ry: -a - Math.PI / 2 }); K.box(0.08, 0.4, 0.4, woodD, x, 0.2, z, { ry: -a - Math.PI / 2 }); K.colR(x, z, 0.28); }
        for (const d of [-0.2, 0.2]) { const a = ac + d, x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; sheep(x, 0.5, z, -a); if (!(b === 3 && d < 0)) K.slot(x, z, cx, cz, 'sit'); }
      }
      K.ringSlots(cx, cz, 6, 3.3, 'talk', 0, 0.25);
      // cesto de lenha e espetos de marshmallow
      K.cyl(0.3, 0.25, 0.4, K.mat(0x8a6a3a, { roughness: 1 }), cx + 3.4, 0.2, cz - 1.5, {}, 12); for (let k = 0; k < 5; k++) K.cyl(0.05, 0.05, 0.6, woodM, cx + 3.4 + (k - 2) * 0.08, 0.45, cz - 1.5, { rx: Math.PI / 2 + 0.2 }, 6); K.colR(cx + 3.4, cz - 1.5, 0.3);
      for (let k = 0; k < 3; k++) { const a = Math.PI * 0.5 + (k - 1) * 0.5; K.cyl(0.006, 0.006, 1.2, woodL, cx + Math.cos(a) * 1.4, 0.45, cz + Math.sin(a) * 1.4, { rx: -Math.sin(a) * 1.1, rz: Math.cos(a) * 1.1, cast: false }, 3); }
    }
    K.tell('fogueira', (live) => { fireF.forEach(f => f.material = K.glow(0x30e0c0, 3)); fireF.light.color.set(0x30d0ff); fireF.pool.material.color.set(0x30d0c0).multiplyScalar(0.6); fireF.sparks.setColor(0x60ffd0); if (live) K.anim(1.0, e => fireF.forEach(f => f.scale.multiplyScalar(1 + Math.sin(e * Math.PI) * 0.4))); }, () => { fireF.forEach((f, i) => f.material = fireF.base[i]); fireF.light.color.set(0xff8a30); fireF.pool.material.color.set(0xff8a30).multiplyScalar(0.55); fireF.sparks.setColor(0xffa040); });

    // ------------------------------------------------------------ jacuzzi fumegante (direita, fundo)
    let water = null, jSteam = null, jLight = null, led = null;
    const waterTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (let k = 0; k < 140; k++) { g.strokeStyle = `rgba(120,200,255,${0.1 + R() * 0.25})`; g.lineWidth = 1 + R() * 2; g.beginPath(); g.arc(R() * w, R() * h, 5 + R() * 20, 0, Math.PI * (0.5 + R())); g.stroke(); } }, [2, 2]);
    const waterOn = new T.MeshStandardMaterial({ color: 0x2ab0d0, map: waterTex, emissive: 0x0890b0, emissiveIntensity: 0.6, roughness: 0.08, metalness: 0.2 });
    const waterOff = new T.MeshStandardMaterial({ color: 0x1a2a5a, map: waterTex, emissive: 0x0a1030, emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.2 });
    { const cx = 7.8, cz = -5.6;
      const stave = K.canvasTex(512, 64, (g, w, h) => { for (let k = 0; k < 32; k++) { const v = 110 + R() * 30; g.fillStyle = `rgb(${v},${v * 0.66},${v * 0.42})`; g.fillRect(k * 16, 0, 16, h); g.fillStyle = 'rgba(20,10,4,.7)'; g.fillRect(k * 16, 0, 2, h); } });
      K.add(new T.CylinderGeometry(1.75, 1.75, 0.78, 32, 1, true), K.texMat(stave, { side: T.DoubleSide }), cx, 0.39, cz);
      for (const y of [0.15, 0.62]) K.torus(1.76, 0.025, K.iron, cx, y, cz, { rx: Math.PI / 2 }, 4, 32);
      K.add(new T.TorusGeometry(1.6, 0.14, 6, 32), woodL, cx, 0.78, cz, { rx: Math.PI / 2 });
      water = K.add(new T.CircleGeometry(1.48, 32), waterOn, cx, 0.66, cz, { rx: -Math.PI / 2, cast: false });
      K.tick((dt, t) => { waterTex.offset.set(Math.sin(t * 0.6) * 0.1, t * 0.05); });
      jLight = K.plight(cx, 1.6, cz, 0x50d8ff, 1.6, 6); K.pool(cx, cz, 3.0, 0x40c8ff, 0.4);
      jSteam = steam(cx, 0.8, cz, { n: 16, rise: 2.2, spread: 2.4, s0: 0.5, s1: 1.6, op: 0.3, speed: 0.2, color: 0xeef6ff });
      // degraus, balde de champanhe, toalhas e roupões
      K.box(1.0, 0.25, 0.45, woodL, cx, 0.12, cz + 1.95); K.box(1.0, 0.25, 0.3, woodL, cx, 0.37, cz + 1.75);
      K.cyl(0.13, 0.1, 0.24, K.silver, cx + 1.2, 0.95, cz + 0.9, {}, 12); K.lathe([[0, 0], [0.04, 0], [0.042, 0.2], [0.015, 0.3], [0, 0.32]], K.mat(0x1a3a1a, { roughness: 0.15 }), cx + 1.2, 0.9, cz + 0.9, { rz: 0.3 }, 8);
      for (let k = 0; k < 2; k++) { K.cyl(0.004, 0.004, 0.08, K.glass, cx - 1.1 + k * 0.15, 0.88, cz + 1.1, { cast: false }, 4); K.cyl(0.03, 0.012, 0.06, K.mat(0xf2d070, { transparent: true, opacity: 0.85 }), cx - 1.1 + k * 0.15, 0.95, cz + 1.1, { cast: false }, 8); }
      K.col(cx - 1.8, cz - 1.8, cx + 1.8, cz + 2.2);
      [0, 1, 2, 3, 4].forEach(k => { const a = -0.4 + k * 1.25; K.slot(cx + Math.cos(a) * 0.95, cz + Math.sin(a) * 0.95, cx, cz, 'tub'); });
      // cabideiro com roupões e toalhas dobradas
      { const rx = 5.2, rz = -7.6; K.cyl(0.03, 0.03, 1.8, woodD, rx, 0.9, rz, {}, 6); K.cyl(0.2, 0.25, 0.05, woodD, rx, 0.03, rz, {}, 10); for (const [dx, c] of [[-0.15, 0xf6f3ec], [0.15, 0xc8c0b0]]) K.add(new T.CylinderGeometry(0.12, 0.22, 1.0, 10, 1, true), K.mat(c, { roughness: 1, side: T.DoubleSide }), rx + dx, 1.15, rz + 0.1); K.colR(rx, rz, 0.3);
        for (let k = 0; k < 4; k++) K.add(K.rbox(0.4, 0.08, 0.3, 0.03), K.mat([0xf6f3ec, 0xc8322f, 0xf6f3ec, 0x1f3a6a][k]), 5.8, 0.04 + k * 0.085, -8.4, { cast: false }); }
      // painel do aquecedor (missão)
      { const g = K.group(10.0, 0, -6.6, -0.6); K.box(0.1, 1.1, 0.1, K.iron, 0, 0.55, 0, { parent: g }); K.box(0.38, 0.5, 0.18, K.mat(0xd8d8dc, { roughness: 0.4, metalness: 0.3 }), 0, 1.2, 0.05, { parent: g });
        led = K.box(0.08, 0.08, 0.02, K.glow(0x30ff60, 3), -0.08, 1.32, 0.15, { parent: g, cast: false }); K.box(0.2, 0.06, 0.02, K.glow(0x60c0ff, 1.4), 0.04, 1.14, 0.15, { parent: g, cast: false }); K.cyl(0.04, 0.04, 0.03, M.black, 0.08, 1.32, 0.15, { parent: g, rx: Math.PI / 2 }, 10);
        K.sign('HEIZUNG', 0.36, 0.08, 0, 1.4, 0.15, { parent: g, color: '#202020', size: 90 }); K.colR(10.0, -6.6, 0.2);
        led.userData.h = K.halo(10.0, 1.32, -6.45, 0.25, 0x30ff60, 1); }
      // espreguiçadeiras com peles
      for (const z of [-7.6, -5.2]) { const g = K.group(12.4, 0, z); K.box(1.9, 0.08, 0.7, woodL, 0, 0.32, 0, { parent: g }); K.box(0.6, 0.08, 0.7, woodL, -0.85, 0.55, 0, { parent: g, rz: -0.6 }); for (const dx of [-0.8, 0.8]) for (const dz of [-0.3, 0.3]) K.box(0.06, 0.3, 0.06, woodD, dx, 0.15, dz, { parent: g }); sheep(12.5, 0.4, z, Math.PI / 2, 1.4); K.col(11.45, z - 0.4, 13.35, z + 0.4); K.slot(12.4, z, 14, z, 'lie'); }
    }
    K.tell('jacuzzi', (live) => { water.material = waterOff; jLight.color.set(0x3040ff); led.material = K.glow(0xff2020, 3); led.userData.h.material.color.set(0xff2020); if (live) K.anim(2.0, e => { jSteam.k = 1 - e; jLight.intensity = 1.6 - e * 1.1; }); else { jSteam.k = 0; jLight.intensity = 0.5; } }, () => { water.material = waterOn; jLight.color.set(0x50d8ff); jLight.intensity = 1.6; jSteam.k = 1; led.material = K.glow(0x30ff60, 3); led.userData.h.material.color.set(0x30ff60); });

    // ------------------------------------------------------------ pista de patinação no gelo (esquerda, frente)
    { const x0 = -12.4, x1 = -5.0, z0 = 2.2, z1 = 7.2, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const iceTex = K.canvasTex(512, 346, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.6); gr.addColorStop(0, '#f4fbff'); gr.addColorStop(1, '#bcd8f0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let k = 0; k < 260; k++) { g.strokeStyle = `rgba(255,255,255,${0.2 + R() * 0.4})`; g.lineWidth = 0.6 + R(); g.beginPath(); const x = R() * w, y = R() * h; g.arc(x, y, 20 + R() * 120, R() * 6, R() * 6 + 0.6 + R()); g.stroke(); } g.strokeStyle = 'rgba(200,40,50,.55)'; g.lineWidth = 5; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); g.beginPath(); g.arc(w / 2, h / 2, 50, 0, 7); g.stroke(); g.strokeStyle = 'rgba(40,80,200,.4)'; for (const x of [w * 0.3, w * 0.7]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } });
      K.add(new T.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2), K.texMat(iceTex, { roughness: 0.06, metalness: 0.25, envMapIntensity: 1.3, emissive: 0x2a4a6a, emissiveMap: iceTex, emissiveIntensity: 0.05, color: 0x8aa8c8 }), cx, 0.03, cz, { cast: false });
      const board = K.mat(0xf2f2f6, { roughness: 0.4 }), cap = K.mat(0xc8202a, { roughness: 0.4 });
      const wall = (ax, az, bx, bz) => { const L = Math.hypot(bx - ax, bz - az), mx = (ax + bx) / 2, mz = (az + bz) / 2, ry = Math.atan2(bz - az, bx - ax); K.box(L, 0.5, 0.1, board, mx, 0.25, mz, { ry: -ry }); K.box(L, 0.06, 0.16, cap, mx, 0.53, mz, { ry: -ry }); K.col(Math.min(ax, bx) - 0.08, Math.min(az, bz) - 0.08, Math.max(ax, bx) + 0.08, Math.max(az, bz) + 0.08); };
      wall(x0, z0, x1, z0); wall(x0, z1, x1, z1); wall(x0, z0, x0, z1); wall(x1, z0, x1, 4.0); wall(x1, 5.4, x1, z1);
      // placas de patrocinadores nas muretas
      ['EISBAHN', 'ST. MORITZ', 'SINCE 1864'].forEach((s, i) => K.sign(s, 1.6, 0.32, x0 + 1.5 + i * 2.4, 0.28, z1 + 0.06, { bg: '#f2f2f6', color: ['#c8202a', '#1f3a6a', '#2a2a2a'][i], size: 64 }));
      // postes de luz nos cantos e varais de lâmpadas
      const corners = [[x0 - 0.2, z0 - 0.2], [x1 + 0.2, z0 - 0.2], [x0 - 0.2, z1 + 0.2], [x1 + 0.2, z1 + 0.2]];
      corners.forEach(([x, z]) => { K.cyl(0.05, 0.07, 3.0, K.iron, x, 1.5, z, {}, 8); K.sphere(0.13, K.glow(0xdff0ff, 2.6), x, 3.05, z, { cast: false }); K.colR(x, z, 0.12); });
      K.bulbs([corners[0][0], 2.95, corners[0][1]], [corners[3][0], 2.95, corners[3][1]], 16, 0.5, 0xbfe4ff, 3.2);
      K.bulbs([corners[1][0], 2.95, corners[1][1]], [corners[2][0], 2.95, corners[2][1]], 16, 0.5, 0xffd08a, 3.2);
      K.bulbs([corners[0][0], 2.95, corners[0][1]], [corners[1][0], 2.95, corners[1][1]], 14, 0.3, 0xff8ab0, 3.0);
      K.bulbs([corners[2][0], 2.95, corners[2][1]], [corners[3][0], 2.95, corners[3][1]], 14, 0.3, 0x8affc0, 3.0);
      K.plight(cx, 3.2, cz, 0xcfe6ff, 1.2, 8); K.pool(cx, cz, 3.2, 0x9fc6ff, 0.14, 0.035);
      // patinação (vagas de dança no gelo), cones de treino
      for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const x = x0 + 1.0 + i * 1.5 + (j % 2) * 0.5, z = z0 + 0.9 + j * 1.55; if (Math.hypot(x + 9.6, z - 4.4) > 0.9) K.slot(x, z, x + 1, z + 0.5 * (j - 1), 'dance'); }
      for (let k = 0; k < 4; k++) K.cone(0.08, 0.2, K.mat(0xff7a1a), x0 + 1.4 + k * 0.5, 0.13, z1 - 0.5, { cast: false }, 8);
      // bancos de trocar patins na lateral com patins pendurados
      for (const z of [3.4, 6.0]) { K.box(0.5, 0.08, 1.6, woodL, -13.9, 0.44, z); for (const dz of [-0.6, 0.6]) K.box(0.4, 0.42, 0.08, woodD, -13.9, 0.21, z + dz); sheep(-13.9, 0.5, z + 0.3, Math.PI / 2); K.col(-14.2, z - 0.85, -13.6, z + 0.85); K.slot(-13.9, z - 0.35, -10, z, 'sit'); K.slot(-13.9, z + 0.4, -10, z, 'sit'); }
      for (let k = 0; k < 3; k++) { const g = K.group(-13.6, 0.5, 4.7 + k * 0.25, 0.3); K.box(0.08, 0.1, 0.26, M.white, 0, 0, 0, { parent: g }); K.box(0.01, 0.03, 0.3, K.silver, 0, -0.07, 0, { parent: g }); }
      K.slot(-4.3, 4.0, cx, cz, 'view'); K.slot(-4.3, 6.4, cx, cz, 'view'); K.slot(-6.0, 8.0, cx, cz, 'view'); K.slot(-10.6, 8.1, cx, cz, 'view');
      K.slot(-5.9, 1.5, cx, cz, 'selfie');
    }

    // ------------------------------------------------------------ boneco de neve (frente) e pacote
    let gift = null, snowHat = null;
    { const x = -2.6, z = 8.7, g = K.group(x, 0, z, -0.2);
      K.add(new T.SphereGeometry(0.58, 16, 12).scale(1, 0.85, 1), snow, 0, 0.45, 0, { parent: g }); K.add(new T.SphereGeometry(0.42, 16, 12), snow, 0, 1.12, 0, { parent: g }); K.add(new T.SphereGeometry(0.3, 14, 10), snow, 0, 1.68, 0, { parent: g });
      for (const s of [-1, 1]) K.sphere(0.035, M.black, s * 0.1, 1.75, 0.27, { parent: g, cast: false }, 6, 4);
      K.cone(0.05, 0.3, K.mat(0xff7a1a), 0, 1.68, 0.42, { parent: g, rx: Math.PI / 2 }, 8);
      for (let k = 0; k < 5; k++) K.sphere(0.022, M.black, -0.12 + k * 0.06, 1.57 - Math.sin(k / 4 * Math.PI) * 0.04, 0.27, { parent: g, cast: false }, 5, 4);
      for (let k = 0; k < 3; k++) K.sphere(0.04, M.black, 0, 1.0 + k * 0.17, 0.4 - Math.abs(k - 1) * 0.02, { parent: g, cast: false }, 6, 4);
      K.torus(0.28, 0.07, redPaint, 0, 1.44, 0, { parent: g, rx: Math.PI / 2 }, 6, 16); K.box(0.12, 0.35, 0.04, redPaint, 0.15, 1.28, 0.25, { parent: g, rz: 0.15 });
      snowHat = K.group(0, 1.94, 0, 0, g); K.cyl(0.28, 0.28, 0.02, M.black, 0, 0, 0, { parent: snowHat }, 16); K.cyl(0.18, 0.18, 0.3, M.black, 0, 0.15, 0, { parent: snowHat }, 16); K.cyl(0.185, 0.185, 0.06, redPaint, 0, 0.05, 0, { parent: snowHat }, 16);
      for (const s of [-1, 1]) { const arm = K.cyl(0.018, 0.012, 0.75, woodD, s * 0.62, 1.32, 0, { parent: g, rz: s * -1.0 }, 5); K.cyl(0.01, 0.008, 0.2, woodD, s * 0.85, 1.5, 0.02, { parent: g, rz: s * -0.3 }, 4); }
      // vassoura apoiada
      K.cyl(0.015, 0.015, 1.4, woodL, 0.55, 0.7, 0.2, { parent: g, rz: 0.25 }); K.cone(0.1, 0.35, K.mat(0xc8a050, { roughness: 1 }), 0.7, 0.1, 0.24, { parent: g, rz: 0.25 }, 8);
      gift = K.group(0.55, 0.0, 0.42, 0.4, g); K.box(0.36, 0.3, 0.36, K.mat(0xd01e28, { roughness: 0.4, emissive: 0x500000, emissiveIntensity: 0.4 }), 0, 0.15, 0, { parent: gift }); K.box(0.38, 0.31, 0.06, K.glow(0xffd040, 1.8), 0, 0.15, 0, { parent: gift, cast: false }); K.box(0.06, 0.31, 0.38, K.glow(0xffd040, 1.8), 0, 0.15, 0, { parent: gift, cast: false });
      for (const s of [-1, 1]) K.torus(0.06, 0.018, K.glow(0xffd040, 1.8), s * 0.05, 0.34, 0, { parent: gift, ry: s * 0.6 }, 4, 10);
      gift.userData.h = K.halo(x + 0.45, 0.4, z + 0.5, 0.7, 0xffc040, 0.8); gift.visible = false; gift.userData.h.visible = false;
      // montes de neve, pá e prancha espetada
      K.inst(new T.SphereGeometry(1, 10, 6), snow, [[x - 0.9, 0, z + 0.4, 0, [0.6, 0.25, 0.5]], [x + 1.0, 0, z + 0.5, 0, [0.5, 0.2, 0.4]], [-5.0, 0, 9.3, 0, [0.8, 0.35, 0.5]]], { cast: false });
      K.add(K.rbox(0.28, 1.45, 0.04, 0.12), K.mat(0x1f3a6a, { roughness: 0.4 }), -5.0, 0.62, 9.35, { rz: 0.15, ry: 0.3 }); K.box(0.2, 0.3, 0.05, K.mat(0xffd23f), -5.0, 0.95, 9.38, { rz: 0.15, ry: 0.3, cast: false });
      K.colR(x, z, 0.62); K.colR(-5.0, 9.3, 0.35);
      K.slot(-1.3, 8.2, x, z, 'selfie'); K.slot(-0.9, 7.2, x, z, 'talk');
    }
    K.tell('boneco', (live) => { gift.visible = true; gift.userData.h.visible = true; snowHat.rotation.z = 0.5; snowHat.position.x = 0.12; if (live) K.anim(1.0, e => { gift.position.y = (1 - e) * 1.2; gift.rotation.y = 0.4 + e * 3; }); else { gift.position.y = 0; gift.rotation.y = 0.4; } }, () => { gift.visible = false; gift.userData.h.visible = false; snowHat.rotation.z = 0; snowHat.position.x = 0; });

    // ------------------------------------------------------------ trenó com lanterna (frente direita)
    let sledLan = null;
    { const g = K.group(6.6, 0, 8.9, 0);
      for (const s of [-1, 1]) { K.box(1.8, 0.04, 0.05, K.iron, -0.1, 0.03, s * 0.32, { parent: g }); K.add(new T.TorusGeometry(0.22, 0.025, 5, 12, Math.PI), K.iron, 0.8, 0.25, s * 0.32, { parent: g, rz: -Math.PI / 2 }); for (const dx of [-0.7, -0.1, 0.5]) K.box(0.05, 0.28, 0.05, woodD, dx, 0.17, s * 0.32, { parent: g }); }
      for (let k = 0; k < 7; k++) K.box(0.18, 0.04, 0.78, k % 2 ? woodM : woodL, -0.75 + k * 0.21, 0.33, 0, { parent: g });
      K.box(0.06, 0.45, 0.78, woodM, -0.86, 0.55, 0, { parent: g, rz: 0.2 });
      K.box(1.0, 0.05, 0.82, plaidMat, -0.25, 0.37, 0, { parent: g, cast: false });
      K.box(0.25, 0.2, 0.25, K.mat(0x2a6a3a), -0.5, 0.48, 0.15, { parent: g }); K.box(0.27, 0.04, 0.27, K.mat(0xd9a441), -0.5, 0.5, 0.15, { parent: g, cast: false }); K.box(0.2, 0.15, 0.2, K.mat(0xf6f3ec), -0.2, 0.46, -0.15, { parent: g });
      K.cyl(0.015, 0.015, 0.9, K.iron, 0.75, 0.55, 0.34, { parent: g }, 6); K.box(0.2, 0.03, 0.03, K.iron, 0.82, 1.0, 0.34, { parent: g });
      sledLan = K.box(0.14, 0.2, 0.14, K.glow(0xffb050, 2.2), 0.9, 0.86, 0.34, { parent: g, cast: false }); K.cone(0.12, 0.09, K.iron, 0.9, 1.0, 0.34, { parent: g }, 4);
      sledLan.userData.f = K.flame(7.5, 0.82, 9.24, 0.03); sledLan.userData.h = K.halo(7.5, 0.86, 9.24, 0.7, 0xffa040, 0.9); sledLan.userData.p = K.pool(7.4, 9.0, 1.8, 0xffa040, 0.55);
      K.cyl(0.01, 0.01, 1.4, M.black, 1.1, 0.3, 0, { parent: g, rz: 1.2, cast: false }, 3);
      K.col(5.6, 8.45, 7.7, 9.35);
    }
    K.tell('treno', (live) => { sledLan.material = K.mat(0x2a2a2a, { roughness: 0.3, metalness: 0.4 }); sledLan.userData.f.visible = false; if (live) K.anim(0.8, e => { sledLan.userData.h.material.opacity = 1 - e; sledLan.userData.p.material.opacity = 1 - e; }); else { sledLan.userData.h.material.opacity = 0; sledLan.userData.p.material.opacity = 0; } }, () => { sledLan.material = K.glow(0xffb050, 2.2); sledLan.userData.f.visible = true; sledLan.userData.h.material.opacity = 1; sledLan.userData.p.material.opacity = 1; });

    // ------------------------------------------------------------ rack de esquis e snowboards (direita, frente)
    let markSki = null;
    { const x = 14.0; K.box(0.1, 1.5, 0.1, woodD, x + 0.2, 0.75, 4.0); K.box(0.1, 1.5, 0.1, woodD, x + 0.2, 0.75, 8.4); K.box(0.1, 0.1, 4.5, woodD, x + 0.2, 1.45, 6.2); K.box(0.4, 0.08, 4.5, woodD, x - 0.05, 0.1, 6.2); K.add(K.rbox(0.18, 0.08, 4.5, 0.03), snow, x + 0.2, 1.54, 6.2, { cast: false });
      const cols = [0xd01e28, 0x1e3a8b, 0xf6f3ec, 0x16161a, 0xff7a1a, 0x2aa87a, 0x9a2ac8, 0x16161a, 0xd9a441, 0x1e3a8b];
      cols.forEach((c, k) => { const z = 4.25 + k * 0.38; for (const dz of [-0.05, 0.05]) { const m = K.box(0.09, 1.75, 0.025, K.mat(c, { roughness: 0.35 }), x - 0.15, 0.85, z + dz, { rz: -0.2 }); if (k === 9 && dz > 0) markSki = m; } K.box(0.1, 0.08, 0.06, K.mat(0x16161a), x - 0.24, 0.45, z, { rz: -0.2, cast: false }); });
      // o esqui marcado: amarelo com faixa preta
      markSki.material = K.mat(0xffd23f, { roughness: 0.35, emissive: 0x403000, emissiveIntensity: 0.4 }); markSki.position.z = 8.0;
      for (const [z, c] of [[4.0, 0x16161a], [8.25, 0xd01e28]]) K.add(K.rbox(0.3, 1.5, 0.04, 0.14), K.mat(c, { roughness: 0.35 }), x - 0.1, 0.78, z, { rz: -0.15, ry: Math.PI / 2 });
      for (let k = 0; k < 6; k++) K.cyl(0.012, 0.012, 1.2, K.silver, x + 0.05, 0.62, 4.3 + k * 0.7, { rz: -0.12, cast: false }, 4);
      K.sign('SKI DEPOT', 1.6, 0.35, x + 0.27, 1.25, 6.2, { ry: -Math.PI / 2, bg: '#2a1a0e', color: '#e9dcb8', size: 70 });
      K.col(13.3, 3.85, 14.5, 8.5);
      K.slot(12.6, 4.2, 14, 4.2, 'talk'); K.slot(12.7, 6.6, 14, 6.6, 'talk');
    }
    const skiBase = markSki.material, skiPos = [markSki.position.x, markSki.position.y, markSki.position.z, markSki.rotation.z];
    K.tell('esqui', (live) => { markSki.material = K.mat(0x30ff60, { roughness: 0.3, emissive: 0x18c040, emissiveIntensity: 0.9 }); const end = () => { markSki.position.set(skiPos[0] - 0.4, skiPos[1] - 0.2, skiPos[2] + 0.3); markSki.rotation.z = -0.65; }; if (live) K.anim(1.0, e => { markSki.position.y = skiPos[1] + Math.sin(e * Math.PI) * 0.6; if (e >= 1) end(); }); else end(); }, () => { markSki.material = skiBase; markSki.position.set(skiPos[0], skiPos[1], skiPos[2]); markSki.rotation.z = skiPos[3]; });

    // ------------------------------------------------------------ posto da patrulha de neve (direita)
    let beacon = null, radioScr = null, antenna = null;
    { K.cyl(0.06, 0.06, 2.9, K.iron, 13.9, 1.45, -2.6, {}, 8); K.colR(13.9, -2.6, 0.15);
      const sg = K.canvasTex(256, 200, (g, w, h) => { g.fillStyle = '#c8202a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.fillRect(100, 22, 56, 120); g.fillRect(68, 54, 120, 56); g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.fillText('PATRULHA', w / 2, 180); g.strokeStyle = '#fff'; g.lineWidth = 6; g.strokeRect(4, 4, w - 8, h - 8); });
      K.add(new T.PlaneGeometry(1.0, 0.78), K.texMat(sg, { side: T.DoubleSide, emissive: 0x401010, emissiveMap: sg, emissiveIntensity: 0.6 }), 13.85, 2.2, -2.5, { ry: -0.4 });
      beacon = K.group(13.9, 2.98, -2.6); K.cyl(0.11, 0.11, 0.16, K.mat(0xffb020, { transparent: true, opacity: 0.7, emissive: 0xff9a10, emissiveIntensity: 1.2 }), 0, 0, 0, { parent: beacon }, 12); const lens = K.box(0.06, 0.12, 0.18, K.glow(0xffc040, 3.2), 0.06, 0, 0, { parent: beacon, cast: false });
      beacon.userData = { lens, h: K.halo(13.9, 2.98, -2.6, 0.9, 0xffa020, 0.9), speed: 2.5 };
      K.tick((dt, t) => { beacon.rotation.y = t * beacon.userData.speed; beacon.userData.h.material.opacity = 0.55 + Math.max(0, Math.sin(t * beacon.userData.speed)) * 0.45; });
      // tobogã de resgate laranja no suporte, maca e caixa de primeiros socorros
      K.box(0.8, 0.4, 0.06, woodD, 13.7, 0.2, -1.8); K.box(0.8, 0.4, 0.06, woodD, 13.7, 0.2, 0.3);
      K.add(K.rbox(0.75, 0.32, 2.4, 0.12), K.mat(0xff6a1a, { roughness: 0.4 }), 13.7, 0.58, -0.75); K.box(0.6, 0.04, 2.1, K.mat(0x1a1a20), 13.7, 0.76, -0.75, { cast: false }); for (const dz of [-0.4, 0.4]) K.box(0.65, 0.03, 0.08, K.mat(0xffd23f), 13.7, 0.79, -0.75 + dz, { cast: false });
      K.box(0.4, 0.3, 0.25, K.mat(0xf6f3ec), 13.0, 0.15, -2.4); K.box(0.12, 0.04, 0.26, redPaint, 13.0, 0.2, -2.4, { cast: false }); K.box(0.04, 0.16, 0.26, redPaint, 13.0, 0.2, -2.4, { cast: false });
      K.col(13.25, -2.75, 14.5, 0.45); K.col(12.75, -2.6, 13.25, -2.2);
      // mesinha com rádio-base (missão)
      K.box(0.8, 0.05, 0.6, woodL, 13.6, 0.85, 1.5); for (const dx of [-0.35, 0.35]) for (const dz of [-0.25, 0.25]) K.box(0.05, 0.85, 0.05, woodD, 13.6 + dx, 0.42, 1.5 + dz);
      K.box(0.42, 0.22, 0.28, K.mat(0x2a2a2e, { roughness: 0.4, metalness: 0.4 }), 13.65, 0.99, 1.5);
      radioScr = K.box(0.2, 0.08, 0.02, K.glow(0x40ff80, 2.2), 13.6, 1.03, 1.65, { cast: false }); for (let k = 0; k < 3; k++) K.cyl(0.025, 0.025, 0.03, M.black, 13.5 + k * 0.08, 0.94, 1.65, { rx: Math.PI / 2, cast: false }, 8);
      antenna = K.group(13.8, 1.1, 1.45); K.cyl(0.01, 0.006, 1.0, K.silver, 0, 0.5, 0, { parent: antenna }, 4); const tip = K.sphere(0.04, K.glow(0x40ff80, 2.5), 0, 1.0, 0, { parent: antenna, cast: false }, 6, 4); antenna.userData.tip = tip;
      K.box(0.18, 0.06, 0.12, K.mat(0x1a1a1a), 13.35, 0.91, 1.42, { cast: false }); K.cyl(0.04, 0.04, 0.1, K.mat(0xf6f3ec), 13.85, 0.92, 1.68, { cast: false }, 8);
      K.col(13.15, 1.15, 14.05, 1.85);
      K.pool(13.2, -0.8, 2.2, 0xffb040, 0.25);
      K.slot(11.6, -2.4, 13.5, -1, 'talk'); K.slot(11.4, 0.8, 13.5, 0.5, 'talk');
    }
    let radioBlink = 0; K.tick((dt, t) => { if (radioBlink) { const on = Math.sin(t * 14) > 0; radioScr.visible = on; antenna.userData.tip.visible = !on; } });
    K.tell('radio', (live) => { radioScr.material = K.glow(0xff2020, 2.6); antenna.userData.tip.material = K.glow(0xff2020, 3); beacon.userData.lens.material = K.glow(0xff2020, 3.4); beacon.userData.h.material.color.set(0xff2020); beacon.userData.speed = 9; radioBlink = 1; if (live) K.anim(0.8, e => { antenna.rotation.z = e * 1.1; }); else antenna.rotation.z = 1.1; }, () => { radioScr.material = K.glow(0x40ff80, 2.2); antenna.userData.tip.material = K.glow(0x40ff80, 2.5); beacon.userData.lens.material = K.glow(0xffc040, 3.2); beacon.userData.h.material.color.set(0xffa020).multiplyScalar(0.9); beacon.userData.speed = 2.5; radioBlink = 0; radioScr.visible = true; antenna.userData.tip.visible = true; antenna.rotation.z = 0; });

    // ------------------------------------------------------------ teleférico ao fundo: cabos, torres e gôndolas
    const A = new V3(-62, hgt(-62, -46) + 10, -46), B = new V3(48, hgt(48, -150) + 9, -150);
    const side = new V3().subVectors(B, A).setY(0).normalize(); const perp = new V3(-side.z, 0, side.x);
    const cab = (u, s) => new V3().lerpVectors(A, B, u).addScaledVector(perp, s * 1.6).add(new V3(0, -Math.sin(u * Math.PI) * 4, 0));
    for (const s of [-1, 1]) { const pts = []; for (let i = 0; i <= 60; i++) pts.push(cab(i / 60, s)); K.root.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x14141a }))); }
    for (const u of [0.12, 0.27, 0.42, 0.57, 0.72, 0.87]) { const p = cab(u, 0), base = hgt(p.x, p.z), hh = p.y - base + 0.6; K.box(0.6, hh, 0.6, K.mat(0x5a5f6a, { metalness: 0.6, roughness: 0.5 }), p.x, base + hh / 2, p.z, { cast: false }); K.box(0.4, 0.3, 4.0, K.mat(0x5a5f6a, { metalness: 0.6 }), p.x, p.y + 0.3, p.z, { cast: false, ry: -Math.atan2(perp.z, perp.x) + Math.PI / 2 }); K.halo(p.x, p.y + 0.8, p.z, 0.6, 0xff3030, 1.4); }
    for (const [P, w] of [[A, 7], [B, 8]]) { K.box(w, 5, 6, K.mat(0x6a6a72, { roughness: 0.8 }), P.x, P.y - 2.5, P.z, { cast: false }); K.box(w + 1, 0.5, 7, snow, P.x, P.y + 0.2, P.z, { cast: false }); K.box(w - 1, 1.2, 0.1, K.glow(0xffc070, 1.2), P.x, P.y - 2.2, P.z + 3.05, { cast: false }); }
    const gondolas = [];
    for (let k = 0; k < 6; k++) {
      const g = K.group(0, 0, 0); K.box(0.06, 1.6, 0.06, K.iron, 0, -0.8, 0, { parent: g, cast: false });
      K.add(K.rbox(1.6, 1.5, 1.4, 0.2), K.mat(k === 0 ? 0xc8202a : [0xc8202a, 0xf2f2f6, 0x1f3a6a][k % 3], { roughness: 0.4, metalness: 0.3 }), 0, -2.3, 0, { parent: g, cast: false });
      const win = K.box(1.64, 0.5, 1.2, K.glow(0xffd8a0, 1.6), 0, -2.1, 0, { parent: g, cast: false });
      const h = K.halo(0, -2.2, 0, 1.6, 0xffc070, 0.45, g);
      gondolas.push({ g, win, h, u0: k / 6, s: k % 2 ? 1 : -1 });
    }
    K.tick((dt, t) => { for (const c of gondolas) { let u = (c.u0 + t * 0.006) % 1; if (c.s > 0) u = 1 - u; const p = cab(u, c.s); c.g.position.copy(p); c.g.rotation.y = -Math.atan2(side.z, side.x); } });
    const gMark = gondolas[0];
    // holofote de sinalização na beira do deck (missão)
    let beam = null, lampLens = null;
    { const lx = 2.4, ly = 1.45, lz = 9.3; const tgt = cab(0.3, -1); const dir = new V3(tgt.x - lx, tgt.y - ly, tgt.z - lz).normalize();
      for (let k = 0; k < 3; k++) { const a = k * 2.094; K.cyl(0.02, 0.02, 1.5, K.iron, lx + Math.cos(a) * 0.25, 0.7, lz + Math.sin(a) * 0.25, { rz: Math.cos(a) * 0.32, rx: -Math.sin(a) * 0.32 }, 5); }
      const head = K.group(lx, ly, lz); head.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir);
      K.cyl(0.22, 0.17, 0.5, K.mat(0x3a3a40, { metalness: 0.7, roughness: 0.35 }), 0, 0, 0, { parent: head }, 16);
      K.torus(0.22, 0.03, K.brass, 0, 0.25, 0, { parent: head, rx: Math.PI / 2 }, 6, 18);
      lampLens = K.cyl(0.2, 0.2, 0.02, K.mat(0x8a9ab0, { roughness: 0.1, metalness: 0.5 }), 0, 0.26, 0, { parent: head, cast: false }, 18);
      const am = K.canvasTex(4, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#fff'); gr.addColorStop(0.4, '#777'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); am.encoding = T.LinearEncoding;
      beam = K.add(new T.ConeGeometry(2.4, 34, 20, 1, true).translate(0, -17, 0), new T.MeshBasicMaterial({ color: new T.Color(0x8affb0).multiplyScalar(0.55), alphaMap: am, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, toneMapped: false }), lx, ly, lz, { cast: false });
      beam.quaternion.setFromUnitVectors(new V3(0, -1, 0), dir); beam.position.addScaledVector(dir, 0.25); beam.visible = false;
      K.colR(lx, lz, 0.38);
    }
    K.tell('gondola', (live) => { beam.visible = true; lampLens.material = K.glow(0xb0ffc8, 3); gMark.win.material = K.glow(0x30ff70, 2.4); gMark.h.material.color.set(0x30ff70).multiplyScalar(1.2); if (live) K.anim(1.5, e => { beam.material.opacity = Math.sin(e * 18) > 0 ? 1 : 0.2; if (e >= 1) beam.material.opacity = 1; }); }, () => { beam.visible = false; beam.material.opacity = 1; lampLens.material = K.mat(0x8a9ab0, { roughness: 0.1, metalness: 0.5 }); gMark.win.material = K.glow(0xffd8a0, 1.6); gMark.h.material.color.set(0xffc070).multiplyScalar(0.45); });

    // ------------------------------------------------------------ estação do teleférico do sniper (encosta em frente)
    { const sx = 4, sz = 46, gy = hgt(sx, sz);
      K.box(10, 12.0 - gy, 7, K.mat(0x7a7a80, { roughness: 0.85 }), sx, (12.0 + gy) / 2, sz + 3.6, { cast: false });
      K.box(3.6, 0.3, 2.4, K.mat(0x5a5a60), sx, 11.85, sz + 0.6, { cast: false });
      K.box(3.6, 0.55, 0.15, K.mat(0x4a4a50), sx, 12.27, sz - 0.6, { cast: false });
      for (const s of [-1, 1]) K.box(0.2, 2.6, 0.2, K.mat(0x4a4a50), sx + s * 1.7, 13.1, sz - 0.55, { cast: false });
      K.box(3.8, 0.3, 2.6, K.mat(0x4a4a50), sx, 14.5, sz + 0.5, { cast: false }); K.box(4.0, 0.3, 2.8, snow, sx, 14.75, sz + 0.5, { cast: false });
      K.box(10.4, 0.5, 7.4, snow, sx, 12.25, sz + 3.6, { cast: false });
      K.cyl(3.2, 3.2, 0.5, K.mat(0x3a3a40, { metalness: 0.6 }), sx, 13.0, sz + 4.5, { cast: false }, 24);
      for (let y = gy + 1.5; y < 9.6; y += 2.2) K.box(9.0, 0.7, 0.05, K.glow(0xffc070, 0.9), sx, y, sz + 0.06, { cast: false });
      K.sign('MUOTTAS', 4, 0.8, sx, 10.6, sz - 0.05, { ry: Math.PI, neon: true, color: '#ff4a3a', size: 90, k: 2 });
      K.halo(sx - 1.7, 14.2, sz - 0.6, 0.35, 0xff3030, 1.2);
      for (const s of [-1, 1]) { const pts = [new V3(sx + s * 1.6, 13.2, sz + 4.5), new V3(sx + s * 1.6 + 40, 40, sz + 60)]; K.root.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x14141a }))); }
    }

    // ------------------------------------------------------------ meio do deck: aquecedores, barris-mesa, varais de luz
    for (const [x, z] of [[3.8, 2.4], [-3.3, 2.9], [10.2, 2.2], [-5.0, -3.4]]) {
      K.cyl(0.22, 0.26, 0.12, K.iron, x, 0.06, z, {}, 12); K.cyl(0.035, 0.05, 2.2, K.metal(0x8a8f98, 0.35), x, 1.15, z, {}, 8);
      K.cyl(0.13, 0.13, 0.35, K.glow(0xff6a20, 1.6), x, 2.05, z, { cast: false }, 12); K.cone(0.55, 0.22, K.metal(0x8a8f98, 0.35), x, 2.35, z, {}, 16);
      K.add(new T.SphereGeometry(0.56, 16, 4, 0, Math.PI * 2, 0, 0.2), snow, x, 2.0, z, { cast: false });
      K.pool(x, z, 2.0, 0xff7a30, 0.35); K.colR(x, z, 0.25);
    }
    const barrel = (x, z, n) => {
      K.lathe([[0, 0], [0.32, 0], [0.38, 0.5], [0.32, 1.0], [0, 1.0]], woodM, x, 0, z, {}, 16); K.cyl(0.34, 0.34, 0.04, woodD, x, 1.02, z, {}, 16);
      for (const y of [0.18, 0.82]) K.torus(0.36, 0.015, K.iron, x, y, z, { rx: Math.PI / 2 }, 4, 18);
      for (let k = 0; k < 3; k++) { const a = k * 2.1 + R(); K.cyl(0.045, 0.04, 0.1, K.mat(k % 2 ? 0xb8262a : 0xf3eee2, { roughness: 0.35 }), x + Math.cos(a) * 0.18, 1.09, z + Math.sin(a) * 0.18, { cast: false }, 8); }
      K.box(0.12, 0.16, 0.12, K.mat(0x1a1a1e, { metalness: 0.5 }), x, 1.12, z, { cast: false }); K.flame(x, 1.1, z, 0.02);
      K.colR(x, z, 0.38); K.ringSlots(x, z, n, 0.8, 'talk', 0, R() * 2);
    };
    [[5.6, 4.6, 3], [8.6, 3.4, 3], [2.0, 5.4, 3], [-1.4, 4.6, 3], [9.8, 6.8, 2]].forEach(([x, z, n]) => barrel(x, z, n));
    // mesa de jass (cartas suíças)
    { const cx = -6.0, cz = -1.2; K.table(cx, cz, { r: 0.6, h: 0.74, cloth: false, top: woodL, candle: true, glasses: 0 });
      const jass = K.canvasTex(64, 96, (g, w, h) => { g.fillStyle = '#f6f3ec'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8202a'; g.beginPath(); g.arc(32, 48, 14, 0, 7); g.fill(); g.fillStyle = '#2a6a3a'; g.fillRect(28, 20, 8, 10); g.strokeStyle = '#222'; g.strokeRect(2, 2, w - 4, h - 4); });
      for (let k = 0; k < 9; k++) K.add(new T.PlaneGeometry(0.06, 0.09).rotateX(-Math.PI / 2), K.texMat(jass), cx + Math.cos(k * 0.7) * 0.3, 0.765, cz + Math.sin(k * 1.3) * 0.25, { ry: k, cast: false });
      K.box(0.3, 0.02, 0.14, K.mat(0x1a1a1e), cx, 0.77, cz + 0.05, { cast: false });
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; K.chair(cx + Math.cos(a) * 0.95, cz + Math.sin(a) * 0.95, Math.atan2(-Math.cos(a), -Math.sin(a)), { seat: plaidMat, frame: woodD, back: woodM }); K.slot(cx + Math.cos(a) * 0.9, cz + Math.sin(a) * 0.9, cx, cz, 'cards'); }
    }
    // varais de lâmpadas partindo da sacada até os postes da frente
    for (const [x0, x1] of [[-3.6, -7.0], [-1.2, -0.5], [1.2, 4.0], [3.6, 9.0]]) K.bulbs([x0, 3.75, -9.2], [x1, 2.55, 9.6], 22, 0.9, 0xffd08a, 3.0);
    for (const x of [-7.0, -0.5, 4.0, 9.0]) { K.cyl(0.05, 0.06, 2.6, woodD, x, 1.3, 9.75, {}, 6); K.colR(x, 9.75, 0.1); }
    K.plight(5.0, 3.0, 4.2, 0xffb070, 1.3, 9);
    K.plight(-3.0, 3.0, 6.0, 0xffb070, 1.0, 8);

    // ------------------------------------------------------------ laterais: motos de neve, sauna em barril, trilha de tochas
    const snowmobile = (x, z, ry, c) => { const g = K.group(x, hgt(x, z), z, ry); K.add(K.rbox(2.0, 0.5, 0.8, 0.18), K.mat(c, { roughness: 0.35, metalness: 0.3 }), 0, 0.55, 0, { parent: g, cast: false }); K.add(K.rbox(0.9, 0.18, 0.5, 0.08), K.mat(0x16161a), -0.3, 0.88, 0, { parent: g, cast: false }); K.box(0.05, 0.4, 0.6, K.mat(0x9ab8d8, { transparent: true, opacity: 0.5 }), 0.65, 1.0, 0, { parent: g, rz: 0.5, cast: false }); for (const s of [-1, 1]) K.box(1.4, 0.04, 0.1, K.iron, 0.6, 0.1, s * 0.4, { parent: g, cast: false }); K.box(1.3, 0.3, 0.6, K.mat(0x1a1a1e), -0.5, 0.25, 0, { parent: g, cast: false }); K.add(K.rbox(1.6, 0.12, 0.7, 0.05), snow, -0.2, 0.98, 0, { parent: g, cast: false }); K.sphere(0.07, K.glow(0xfff0c0, 2), 1.0, 0.65, 0, { parent: g, cast: false }); };
    snowmobile(-18.0, 2.5, 0.3, 0xd01e28); snowmobile(-18.6, 6.0, 0.15, 0x1f3a6a); snowmobile(19.0, 6.5, 2.9, 0xffd23f);
    { const sx = 19.0, sz = -3.0, gy = hgt(sx, sz); K.add(new T.CylinderGeometry(1.2, 1.2, 3.2, 20), logMat, sx, gy + 1.2, sz, { rx: Math.PI / 2, cast: false }); for (const dz of [-1.5, 1.5]) K.add(new T.CylinderGeometry(1.24, 1.24, 0.12, 20), K.iron, sx, gy + 1.2, sz + dz, { rx: Math.PI / 2, cast: false });
      K.add(new T.CylinderGeometry(1.25, 1.25, 3.3, 20, 1, true, -1.1, 2.2), snow, sx, gy + 1.25, sz, { rx: Math.PI / 2, cast: false });
      K.add(new T.CircleGeometry(0.4, 16), K.glow(0xffa860, 1.4), sx, gy + 1.2, sz + 1.62, { cast: false }); K.cyl(0.1, 0.1, 1.3, K.iron, sx + 0.5, gy + 2.7, sz - 1.0, { cast: false }, 8);
      steam(sx + 0.5, gy + 3.4, sz - 1.0, { n: 8, rise: 3, spread: 0.3, s0: 0.3, s1: 1.4, op: 0.3, speed: 0.18, color: 0xb8c0d0, drift: 1 });
      K.sign('SAUNA', 1.2, 0.3, sx, gy + 2.15, sz + 1.66, { bg: '#2a1a0e', color: '#e9dcb8', size: 70 }); K.pool(sx, sz + 2.2, 1.6, 0xffa860, 0.35, gy + 0.03); }
    // trilha de tochas descendo a encosta
    for (let k = 0; k < 9; k++) { const z = 12.5 + k * 2.2, x = -8 + Math.sin(k * 0.6) * 3 + (k % 2 ? 1.6 : -1.6), y = hgt(x, z); K.cyl(0.03, 0.04, 1.2, woodD, x, y + 0.6, z, { cast: false }, 5); K.flame(x, y + 1.2, z, 0.07, 0xff8a20); K.pool(x, z, 1.3, 0xff8a20, 0.4, y + 0.03); }
    // esquis cruzados espetados na neve na frente
    for (const [x, z] of [[-11.5, 12.2], [9.5, 12.6]]) { const y = hgt(x, z); for (const s of [-1, 1]) K.box(0.08, 1.7, 0.03, K.mat(s > 0 ? 0xd01e28 : 0xf6f3ec, { roughness: 0.4 }), x, y + 0.7, z, { rz: s * 0.25, cast: false }); }
    // montes de neve fora do deck
    { const m = []; for (let k = 0; k < 40; k++) { const sx = k % 2 ? 1 : -1, x = sx * (15.6 + R() * 7), z = -11 + R() * 24; m.push([x, hgt(x, z), z, R() * 3, [0.8 + R() * 1.5, 0.3 + R() * 0.5, 0.8 + R() * 1.2]]); }
      for (let k = 0; k < 18; k++) { const x = -14 + R() * 28, z = 11 + R() * 3; m.push([x, hgt(x, z), z, R() * 3, [0.8 + R(), 0.3 + R() * 0.3, 0.6 + R() * 0.5]]); }
      K.inst(new T.SphereGeometry(1, 10, 6), snow, m, { cast: false }); }

    // ------------------------------------------------------------ vagas extras (conversa geral e vista)
    [[-12.0, 9.3], [-8.8, 9.3], [0.6, 9.3], [4.4, 9.3], [10.6, 9.3], [12.4, 9.0]].forEach(([x, z]) => K.slot(x, z, x, 16, 'view'));
    [[3.6, -5.0], [5.0, -1.6], [-2.6, -5.6], [-0.2, -6.8], [8.2, 0.4], [6.6, 6.8], [-3.6, 0.6], [11.0, 4.0], [-9.0, -0.4], [-9.4, 1.1]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), z + (R() - 0.5) * 2, 'talk'));
    K.slot(10.2, -3.2, 7.8, -5.6, 'talk'); K.slot(5.4, -3.2, 7.8, -5.6, 'talk');
  },
  // ninho do sniper: janela da cabine do teleférico. Peitoril de madeira coberto de neve fofa (sombras azuladas, pegadas
  // de passarinho, agulhas de pinheiro), pingentes de gelo na frente e a plaquinha esmaltada da estação no batente
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.9 }), wood = 0x6a4a30;
    N.tampo(0xeef3f8, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 71, draw: (c, w, h, R) => {
      c.fillStyle = '#eef2f7'; c.fillRect(0, 0, w, h); K.manchas(c, w, h, R, 160, ['150,175,210', '255,255,255'], 10, 60, 0.35);
      c.fillStyle = 'rgba(110,80,50,.9)'; c.fillRect(0, h - 10, w, 10); K.manchas(c, w, 22, R, 40, ['238,242,247'], 6, 24, 1);
      c.strokeStyle = 'rgba(120,140,170,.7)'; c.lineWidth = 1.5; for (let k = 0; k < 9; k++) { const x = w * 0.08 + k * 26, y = h * 0.45 + Math.sin(k) * 14; for (const a of [-0.5, 0, 0.5]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(a + 0.3) * 9, y - Math.cos(a + 0.3) * 9); c.stroke(); } }
      c.strokeStyle = 'rgba(40,70,40,.7)'; c.lineWidth = 1.2; for (let k = 0; k < 24; k++) { const x = R() * w, y = R() * h, a = R() * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12); c.stroke(); }
      c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(0, 0, w, 6); K.grain(c, w, h, 6);
    } });
    N.box(5.6, 0.12, 1.0, wood, 0, -0.98, -1.1).box(5.62, 0.04, 0.4, 0xf4f7fb, 0, -0.9, -1.4).box(5.4, 3.2, 0.9, 0x5a3e28, 0, -2.66, -0.95);
    const R = K.rng(73); for (let x = -2.6; x <= 2.61; x += 0.16 + R() * 0.12) { const l = 0.08 + R() * 0.3; N.geo(new T.ConeGeometry(0.025 + R() * 0.015, l, 6), 0xd8ecf8, x, -1.04 - l / 2, -1.58, 0, Math.PI); }
    for (const sx of [-1, 1]) N.box(0.5, 2.2, 0.6, wood, sx * 2.1, 0.31, -0.98).box(0.56, 0.1, 0.64, 0xf4f7fb, sx * 2.1, 1.45, -0.98);
    N.fim();
    const tex = K.canvasTex(256, 160, (c, w, h) => { c.fillStyle = '#c8102a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '700 34px Arial, sans-serif'; c.fillText('SEILBAHN', w / 2, 66); c.font = '700 40px Arial, sans-serif'; c.fillText('2 214 m', w / 2, 120); });
    K.add(new T.PlaneGeometry(0.4, 0.25), K.texMat(tex, { roughness: 0.3 }), 2.1, 0.5, -1.285, { parent: g, cast: false });
  },
});
