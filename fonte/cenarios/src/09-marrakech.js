// 09 · Noite no Riad: festa à luz de velas num riad da medina de Marrakech, noite de lua cheia.
// Pátio com fonte de zellige e pétalas de rosa, laranjeiras, galeria de arcos em ferradura, terraço superior com tendas.
// O sniper está no alto do minarete do bairro, do outro lado dos telhados. Djellabas, kaftans e fezes por toda parte:
// é preciso ler cores, objetos e as mudanças que as missões deixam no pátio.
MIRA_CENARIOS.push({
  id: 'marrakech',
  nome: 'Noite no Riad',
  lugar: 'Riad na medina de Marrakech',
  hora: 'noite de lua cheia',
  resumo: 'Pátio de zellige à luz de velas, fonte com pétalas de rosa, laranjeiras, chá de menta servido do alto, músicos gnawa e um terraço com tendas berberes sob a Koutoubia iluminada.',
  sniper: { pos: [-3, 21.2, 49.3], desc: 'varanda do minarete da mesquita do bairro, do outro lado dos telhados da medina' },
  niveis: [
    { nome: 'pátio do riad', y: 0, x0: -14.5, x1: 14.5, z0: -8.5, z1: 10 },
    { nome: 'terraço superior', y: 3.4, x0: -13.5, x1: 14.3, z0: -12.4, z1: -8.9 },
  ],
  escadas: [{ de: 0, para: 1, a: [13.4, -2.5], b: [13.4, -9.2], rotulo: 'terraço' }],
  convidados: 28,
  inicio: [-1.6, 3.4, 0],
  ambiente: {
    ceu: ['#050818', '#0e1838', '#23295a', '#5a3e5a'], neblina: [0x141a34, 80, 330], hemi: [0x8ea4d6, 0x4a2a1a, 0.24],
    sol: [0xa8bcff, 0.4, -16, 26, 20], preenche: [0xffa060, 0.24], exposicao: 1.0, bloom: 0.85, semReflexo: true,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [22, 0, 0], talk: [4, 4, 4, 25] },
  guardaRoupa: {
    ternos: [[0xf0e6cf, 'djellaba creme'], [0x6a4a32, 'djellaba de lã marrom'], [0x2a3a6a, 'djellaba índigo'], [0x5a6a3a, 'djellaba verde-oliva'], [0x8a8a86, 'djellaba cinza'], [0x3a2a2a, 'djellaba cor de tâmara'], [0x7a1f2a, 'djellaba bordô']],
    vestidos: [[0x0f6a4a, 'kaftan esmeralda'], [0x9a1030, 'kaftan rubi'], [0xe0a020, 'kaftan açafrão'], [0x3a4ad0, 'kaftan azul-majorelle'], [0xb0207a, 'kaftan magenta'], [0x1aa0a0, 'kaftan turquesa'], [0xf2e6c8, 'kaftan marfim bordado'], [0x5a2a7a, 'kaftan ameixa']],
    vestidoChance: 0.48, longo: 0.92, taca: 0.55, tacas: ['tumbler'], drinks: [0xc8962a, 0x9bbf5a, 0xd9a441, 0xb87a30],
    extra(o, r) {
      const pk = (a) => a[Math.floor(r() * a.length)];
      if (!o.dress) {
        o.robe = 'round'; o.robeLong = true; o.pants = o.main; // djellaba: long robe with sleeves o.shoe = r() < 0.6 ? 0xe9c33b : 0xf0e6cf; o.bow = false; o.pocket = 0;
        const h = r();
        if (h < 0.34) { o.hat = 'fez'; o.hatColor = r() < 0.8 ? 0xa8172a : 0x16161a; o.name += o.hatColor === 0x16161a ? ', fez preto' : ', fez vermelho'; }
        else if (h < 0.54) { o.hat = 'beanie'; o.hatColor = 0xf6f3ec; o.name += ', solidéu branco'; }
        else if (h < 0.72) { o.hat = 'turban'; o.hatColor = pk([0xf0e6cf, 0x1e3a8b, 0xe9a43b, 0x6a1a1a]); o.name += ', turbante'; }
        if (r() < 0.2) { o.sash = 0xd9a441; o.name += ', faixa dourada'; }
        if (r() < 0.3) o.beard = true;
      } else {
        o.robe = 'round'; o.collar = 0xd9a441; // kaftan: sleeves and a gold trimmed neck
        o.accent = 0xd9a441; o.earring = true; o.necklace = r() < 0.75; o.clutch = false; o.shoe = pk([0xd9a441, 0xc9ced6, o.main]);
        if (r() < 0.7) { o.sash = r() < 0.8 ? 0xd9a441 : 0xc9ced6; o.name += o.sash === 0xd9a441 ? ', cinto dourado' : ', cinto prateado'; }
        if (r() < 0.3) { o.scarf = pk([0xf2e6c8, 0xe0a020, 0x1aa0a0, 0xb0207a]); o.name += ', lenço no pescoço'; }
        else if (r() < 0.25) { o.hat = 'turban'; o.hatColor = pk([0xe0a020, 0x9a1030, 0x0f6a4a, 0xf2e6c8]); o.name += ', lenço na cabeça'; }
      }
      // servidores do chá, de fez vermelho e bule (qualquer convidado pode ser sorteado, o agente também)
      if (!o.dress && r() < 0.1) { Object.assign(o, { main: 0xf0e6cf, pants: 0xf0e6cf, hat: 'fez', hatColor: 0xa8172a, apron: 0x2c6e49, prop: 'teapot', glass: false, glasses: false }); o.name = 'servidor do chá, de fez vermelho, avental verde e bule' + (o.beard ? ', de barba' : ''); }
    },
  },
  elenco: [
    { x: 2.3, z: 2.7, rot: 0.5, anim: 4, fala: 'Bem-vindos ao meu riad. Aqui a noite não tem pressa.', outfit: { dress: false, main: 0xf4f1ea, pants: 0xf4f1ea, shirt: 0xf4f1ea, tie: 0xf4f1ea, coat: 0xf4f1ea, skin: 3, hair: 0xa9a9a9, hairStyle: 'short', beard: true, hat: 'fez', hatColor: 0xa8172a, shoe: 0xe9c33b, sash: 0xd9a441, name: 'Si Abdellah, o anfitrião, de djellaba branca e fez vermelho' } },
    { x: -3.0, z: -11.75, lv: 1, rot: 0, anim: 7, fala: 'E na noite mil e duas, o sultão percebeu que alguém o observava do minarete…', outfit: { dress: false, main: 0x6a4a2a, pants: 0x6a4a2a, shirt: 0xe8dcc0, tie: 0x6a4a2a, coat: 0x5a3a20, skin: 4, hair: 0xa9a9a9, beard: true, hat: 'turban', hatColor: 0xf0e6cf, scarf: 0xc8962a, prop: 'book', propColor: 0x8a1020, shoe: 0xe9c33b, name: 'Hadj Mbarek, o contador de histórias, de turbante e livro vermelho' } },
    { x: -12.5, z: 7.6, rot: 1.2, anim: 13, fala: 'O oud chora, o guembri responde. E a noite escuta.', outfit: { dress: false, main: 0x1f3a5a, pants: 0x1f3a5a, shirt: 0xf0e6cf, tie: 0x1f3a5a, coat: 0x1f3a5a, skin: 5, hair: 0x1a1411, beard: true, hat: 'beanie', hatColor: 0xc8322f, stripes: 0xd9a441, prop: 'violin', shoe: 0xf0e6cf, name: 'Mustapha, tocador de oud, de djellaba índigo e gorro vermelho' } },
    { x: 12.0, z: 6.6, rot: -1.2, anim: 10, fala: 'Cominho, açafrão, ras el hanout… o segredo está na mistura.', outfit: { dress: true, gown: true, main: 0xb8601e, skin: 4, hair: 0x1a1411, hairStyle: 'bun', hat: 'turban', hatColor: 0xe9a43b, scarf: 0xc8322f, sash: 0xd9a441, necklace: true, earring: true, prop: 'tray', name: 'Lalla Fatima, a vendedora de especiarias, de lenço açafrão e cesto' } },
    { x: 1.0, z: 7.3, rot: 0.2, anim: 3, fala: 'Se o pandeiro parar, alguém aqui está mentindo.', outfit: { dress: true, gown: false, main: 0x8a1a6a, skirt: 0xe0307a, sash: 0xd9a441, skin: 2, hair: 0x1a1411, hairStyle: 'long', necklace: true, earring: true, accent: 0xd9a441, prop: 'tambourine', shoe: 0xd9a441, name: 'Yasmina, a dançarina, de saia rodada fúcsia e pandeiro' } },
    { x: -13.75, z: -6.2, rot: 1.57, anim: 6, fala: 'O primeiro copo é amargo como a vida; o terceiro, suave como a morte.', outfit: { dress: false, main: 0xe8dcc0, pants: 0xe8dcc0, shirt: 0xf6f3ec, tie: 0xe8dcc0, coat: 0xe8dcc0, skin: 3, hair: 0x1a1411, beard: true, hat: 'beanie', hatColor: 0xf6f3ec, apron: 0x2c6e49, prop: 'teapot', shoe: 0xe9c33b, name: 'Mâalem Driss, o mestre do chá, de solidéu branco e bule de prata' } },
    { x: -13.1, z: 2.5, rot: 0.9, anim: 0, fala: 'Depois da meia-noite, esta porta não abre. Para ninguém.', outfit: { dress: false, main: 0x1a2a5a, pants: 0x16161a, shirt: 0x1a2a5a, tie: 0x1a2a5a, coat: 0x1a2a5a, skin: 4, hair: 0x1a1411, beard: true, hat: 'turban', hatColor: 0x1e3a8b, scarf: 0x1e3a8b, sash: 0xc8322f, prop: 'lantern', propColor: 0xffb050, name: 'Brahim, o guarda do portão, de turbante azul e lanterna' } },
    { x: 9.4, z: -11.15, lv: 1, rot: 0.2, anim: 2, fala: 'Este astrolábio é do século XIV. Ou de terça-feira passada.', outfit: { dress: false, main: 0x5a4a3a, pants: 0x3a3028, shirt: 0xe8dcc0, tie: 0x8a3a22, skin: 1, hair: 0xa9a9a9, hairStyle: 'short', hat: 'fedora', hatColor: 0x6a5a40, hatBand: 0x2a1a10, glasses: 'round', prop: 'magnifier', name: 'Monsieur Haddad, o antiquário, de óculos redondos e lupa' } },
  ],
  missoes: [
    { k: 'chave', label: 'Trocar a chave na fonte de zellige', where: 'fonte, no centro do pátio', s: [0, 2.75], l: [0, 0.4] },
    { k: 'tapete', label: 'Marcar o tapete certo', where: 'varal de tapetes, à direita', s: [12.6, 1.1], l: [13.9, 1.1] },
    { k: 'lanterna', label: 'Apagar a lanterna perfurada', where: 'arco central da galeria, no fundo', s: [0, -7.4], l: [0, -8.75] },
    { k: 'bule', label: 'Trocar o bule do mestre do chá', where: 'balcão do chá, à esquerda', s: [-11.75, -4.4], l: [-12.7, -4.95] },
    { k: 'mapa', label: 'Esconder o mapa no tajine', where: 'mesa baixa de jantar, à direita', s: [8.6, -4.55], l: [8.6, -5.8] },
    { k: 'porta', label: 'Destrancar a porta cravejada', where: 'portão do riad, à esquerda', s: [-13.5, 4.2], l: [-14.6, 4.2] },
    { k: 'petalas', label: 'Soltar as pétalas do terraço', where: 'parapeito do terraço superior', s: [-7, -9.5], l: [-7, -8.7], lv: 1 },
    { k: 'incenso', label: 'Acender o incensário de latão', where: 'terraço superior, ao centro', s: [4.0, -10.85], l: [4.0, -12.0], lv: 1 },
    { k: 'paprica', label: 'Derrubar a pirâmide de páprica', where: 'banca de especiarias, à direita', s: [12.2, 8.6], l: [13.6, 8.6] },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r, PI = Math.PI, L1 = 3.4;
    const pk = (a) => a[Math.floor(R() * a.length)];
    // ------------------------------------------------------------ materiais
    const plaster = K.mat(0xd99a6c, { roughness: 0.92 }), plasterLt = K.mat(0xecd3ad, { roughness: 0.9 }), terra = K.mat(0xb4613d, { roughness: 0.95 }), terraDk = K.mat(0x8a4429, { roughness: 0.95 });
    const cedar = K.mat(0x6a3e22, { roughness: 0.6 }), cedarDk = K.mat(0x3e2414, { roughness: 0.65 }), marble = K.mat(0xf0e8da, { roughness: 0.3 });
    const brass = K.metal(0xc89a3a, 0.3), copper = K.metal(0xb8693a, 0.35), silver = K.silver, iron = K.iron;
    const greenTile = K.mat(0x1f6a4a, { roughness: 0.25, metalness: 0.1 }), soil = M.soil;
    const leathers = [0xa8642a, 0x8a2a1a, 0xd9a441, 0x3a5a3a, 0xe0cfa8, 0x6a2a4a].map(c => K.mat(c, { roughness: 0.65 }));
    const fabric = (c) => K.mat(c, { roughness: 0.92 });

    // ------------------------------------------------------------ texturas desenhadas à mão
    // zellige: estrelas de 8 pontas, cruzes e losangos, com rejunte e brilho de esmalte
    const zelTex = (pal, n, rep, seed) => K.canvasTex(512, 512, (g, w, h) => {
      const r = K.rng(seed), s = w / n;
      g.fillStyle = pal[5] || '#efe6d2'; g.fillRect(0, 0, w, h);
      const poly = (cx, cy, pts, col) => { g.fillStyle = col; g.beginPath(); pts.forEach(([a, rr], i) => { const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.closePath(); g.fill(); g.strokeStyle = 'rgba(40,28,18,.6)'; g.lineWidth = 2; g.stroke(); };
      const star = (cx, cy, r1, r2, col, rot = 0) => poly(cx, cy, Array.from({ length: 16 }, (_, k) => [rot + k * PI / 8, k % 2 ? r2 : r1]), col);
      for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) { star(i * s, j * s, s * 0.36, s * 0.24, (i + j) % 2 ? pal[1] : pal[2]); star(i * s, j * s, s * 0.15, s * 0.1, pal[3], PI / 8); }
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const cx = (i + 0.5) * s, cy = (j + 0.5) * s;
        poly(cx, cy, [[0, s * 0.19], [PI / 2, s * 0.19], [PI, s * 0.19], [PI * 1.5, s * 0.19]], pal[0]);
        for (let k = 0; k < 4; k++) { const a = k * PI / 2 + PI / 4; poly(cx + Math.cos(a) * s * 0.27, cy + Math.sin(a) * s * 0.27, [[a, s * 0.07], [a + PI / 2, s * 0.045], [a + PI, s * 0.07], [a - PI / 2, s * 0.045]], pal[4]); }
      }
      for (let k = 0; k < 500; k++) { g.fillStyle = `rgba(255,255,255,${r() * 0.09})`; g.fillRect(r() * w, r() * h, 3 + r() * 12, 2 + r() * 5); }
    }, rep);
    const PAL_F = ['#1f4f8a', '#1d6a4a', '#f2ead8', '#c8902a', '#1a1a1a'];
    const PAL_D = ['#f2ead8', '#1d6a4a', '#1f4f8a', '#1a1a1a', '#c8902a'];
    const PAL_W = ['#c8902a', '#1a1a1a', '#1d6a4a', '#f2ead8', '#1f4f8a', '#e9dcc0'];
    const zelMat = (pal, rep, seed, o = {}) => K.texMat(zelTex(pal, 4, rep, seed), Object.assign({ roughness: 0.28, metalness: 0.05, envMapIntensity: 0.7 }, o));
    // estuque entalhado: entrelaçado de círculos com luz e sombra
    const stuccoTex = (rep) => K.canvasTex(256, 96, (g, w, h) => {
      g.fillStyle = '#eadcbf'; g.fillRect(0, 0, w, h); const s = 32;
      for (let i = -1; i <= w / s + 1; i++) for (let j = -1; j <= h / s + 1; j++) for (const [d, c] of [[1.6, 'rgba(110,70,35,.5)'], [-0.8, 'rgba(255,250,235,.85)']]) { g.strokeStyle = c; g.lineWidth = 2; g.beginPath(); g.arc(i * s + d, j * s + d + 16, s * 0.68, 0, 7); g.stroke(); }
      g.fillStyle = 'rgba(110,70,35,.45)'; for (let k = 0; k < w / 16; k++) { g.beginPath(); g.arc(k * 16 + 8, h, 7, PI, 0); g.fill(); }
      g.fillStyle = 'rgba(90,60,30,.55)'; g.fillRect(0, 0, w, 5); g.fillRect(0, h - 12, w, 2);
    }, rep);
    // piso: bejmat (tijolinhos esmaltados) em trama de cesto
    const floorTex = K.canvasTex(1024, 1024, (g, w, h) => {
      const c = 48, n = w / c;
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const hz = (i + j) % 2;
        for (let k = 0; k < 2; k++) {
          const v = R(), col = `rgb(${178 + v * 32 | 0},${108 + v * 24 | 0},${74 + v * 20 | 0})`; g.fillStyle = col;
          if (hz) g.fillRect(i * c + 1, j * c + k * c / 2 + 1, c - 2, c / 2 - 2); else g.fillRect(i * c + k * c / 2 + 1, j * c + 1, c / 2 - 2, c - 2);
        }
      }
      for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(${R() < 0.5 ? '255,240,220' : '80,40,20'},${R() * 0.07})`; g.fillRect(R() * w, R() * h, 2 + R() * 6, 2 + R() * 6); }
      K.grain(g, w, h, 8);
    }, [9, 6]);
    floorTex.rotation = PI / 4; floorTex.center.set(0.5, 0.5);
    // madeira cravejada das portas
    const doorTex = K.canvasTex(256, 512, (g, w, h) => {
      g.fillStyle = '#5a3418'; g.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 32) { g.fillStyle = `rgba(0,0,0,${0.15 + R() * 0.2})`; g.fillRect(x, 0, 3, h); for (let k = 0; k < 14; k++) { g.strokeStyle = `rgba(${R() < 0.5 ? '120,70,30' : '40,20,10'},.35)`; g.beginPath(); const xx = x + 4 + R() * 26; g.moveTo(xx, 0); g.bezierCurveTo(xx + 4, h * 0.3, xx - 4, h * 0.6, xx + 2, h); g.stroke(); } }
      g.strokeStyle = '#b8893a'; g.lineWidth = 10; g.strokeRect(10, 10, w - 20, h - 20); g.lineWidth = 6; g.strokeRect(40, 60, w - 80, h - 140);
      for (let y = 30; y < h; y += 44) for (let x = 26; x < w; x += 51) { const gr = g.createRadialGradient(x - 2, y - 2, 1, x, y, 8); gr.addColorStop(0, '#fff0b0'); gr.addColorStop(0.4, '#d4a04a'); gr.addColorStop(1, '#4a3010'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); }
      g.strokeStyle = '#d4a04a'; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h * 0.52, 22, 0, 7); g.stroke();
    });
    const doorMat = K.texMat(doorTex, { roughness: 0.55, metalness: 0.15 });
    // latão perfurado das lanternas e o padrão de luz que elas projetam
    const pierceTex = K.canvasTex(128, 128, (g, w, h) => {
      g.fillStyle = '#2a1a08'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff2c8';
      for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) { const x = i * 21.3 + (j % 2) * 10.6 + 5, y = j * 21.3 + 10; g.beginPath(); for (let k = 0; k < 8; k++) { const a = k * PI / 4, rr = k % 2 ? 2.5 : 6; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.fill(); g.fillRect(x + 9, y - 1, 2, 2); }
    }, [3, 2]);
    const projTex = K.canvasTex(256, 256, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      for (let ring = 1; ring < 10; ring++) { const n = 6 + ring * 5, rr = ring * 12.5, al = Math.pow(1 - ring / 10, 1.2); for (let k = 0; k < n; k++) { const a = k / n * PI * 2 + ring * 0.37, x = w / 2 + Math.cos(a) * rr, y = h / 2 + Math.sin(a) * rr, s = 2 + ring * 0.35; g.fillStyle = `rgba(255,255,255,${al})`; g.beginPath(); for (let q = 0; q < 8; q++) { const b = q * PI / 4 + a, r2 = q % 2 ? s * 0.45 : s; g.lineTo(x + Math.cos(b) * r2, y + Math.sin(b) * r2); } g.fill(); } }
      const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 26); gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    });
    const UNIT = new T.PlaneGeometry(1, 1).rotateX(-PI / 2);
    const projPool = (x, z, r, color, k, y = 0.026) => { const m = new T.Mesh(UNIT, new T.MeshBasicMaterial({ map: projTex, color: new T.Color(color).multiplyScalar(k), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); m.scale.set(r * 2, 1, r * 2); m.position.set(x, y, z); m.rotation.y = R() * 3; m.renderOrder = 2; K.root.add(m); return m; };
    // tapetes berberes
    const fringe = (g, w, h) => { g.strokeStyle = 'rgba(240,232,214,.95)'; g.lineWidth = 2; for (let x = 3; x < w; x += 6) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 1, 12); g.stroke(); g.beginPath(); g.moveTo(x, h); g.lineTo(x - 1, h - 12); g.stroke(); } };
    const rugDraw = (style, seed) => (g, w, h) => {
      const r = K.rng(seed);
      if (style === 'beni') {
        g.fillStyle = '#ece3cf'; g.fillRect(0, 0, w, h);
        for (let k = 0; k < 4000; k++) { g.fillStyle = `rgba(${200 + r() * 50 | 0},${190 + r() * 45 | 0},${165 + r() * 40 | 0},.6)`; g.fillRect(r() * w, r() * h, 2, 5); }
        g.strokeStyle = '#2b2420'; g.lineWidth = w * 0.022; g.lineJoin = 'round'; const s = w / 3.5;
        for (let k = -h; k < w + h; k += s) for (const sg of [1, -1]) { g.beginPath(); for (let y = 0; y <= h; y += 16) g.lineTo(k + sg * y + (r() - 0.5) * 7, y); g.stroke(); }
      } else if (style === 'kilim') {
        const base = pk(['#9a2a22', '#7a1a1a', '#b8401e']), cols = ['#1a1a2a', '#f0a030', '#efe4cc', '#2a4a8a', '#d86a2a', '#3a6a3a'];
        g.fillStyle = base; g.fillRect(0, 0, w, h); const bh = h / (5 + Math.floor(r() * 4));
        for (let y = bh * 0.4; y < h - bh * 0.6; y += bh) {
          const c1 = cols[Math.floor(r() * cols.length)], c2 = cols[Math.floor(r() * cols.length)];
          g.fillStyle = c1; g.fillRect(0, y, w, bh * 0.14); g.fillRect(0, y + bh * 0.86, w, bh * 0.14);
          const n = 5 + Math.floor(r() * 5), s = w / n;
          for (let k = 0; k < n; k++) { const cx = (k + 0.5) * s, cy = y + bh / 2; g.fillStyle = k % 2 ? c2 : c1; g.beginPath(); g.moveTo(cx, cy - bh * 0.32); g.lineTo(cx + s * 0.42, cy); g.lineTo(cx, cy + bh * 0.32); g.lineTo(cx - s * 0.42, cy); g.fill(); g.fillStyle = base; g.fillRect(cx - 4, cy - 4, 8, 8); }
        }
        g.strokeStyle = '#1a1a2a'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16);
      } else if (style === 'azilal') {
        g.fillStyle = '#efe4cc'; g.fillRect(0, 0, w, h); const cols = ['#d23a2a', '#f08a24', '#2a5aa8', '#e85a9a', '#f2c230', '#2a8a6a'];
        for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(255,255,255,${r() * 0.3})`; g.fillRect(r() * w, r() * h, 2, 4); }
        for (let k = 0; k < 24; k++) { g.save(); g.translate(r() * w, r() * h); g.rotate(r() * 3); g.fillStyle = cols[k % cols.length]; const s = 20 + r() * 60; if (r() < 0.5) g.fillRect(-s / 2, -s / 4, s, s / 2); else { g.beginPath(); g.moveTo(0, -s / 2); g.lineTo(s / 3, 0); g.lineTo(0, s / 2); g.lineTo(-s / 3, 0); g.fill(); } g.restore(); }
        g.strokeStyle = '#1a1a1a'; g.lineWidth = 3; for (let k = 0; k < 7; k++) { g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let q = 0; q < 6; q++) { x += (r() - 0.5) * 120; y += (r() - 0.3) * 60; g.lineTo(x, y); } g.stroke(); }
      } else {
        for (let y = 0; y < h; y += 7) for (let x = 0; x < w; x += 9) { const zone = Math.floor(x / 90 + Math.sin(y / 40) * 0.6) + Math.floor(y / 70) * 3; const hue = (zone * 67) % 360; g.fillStyle = `hsl(${hue + r() * 20},${55 + r() * 25}%,${40 + r() * 22}%)`; g.fillRect(x + (r() - 0.5) * 3, y, 9, 7); }
      }
      fringe(g, w, h); K.grain(g, w, h, 16);
    };
    let rugN = 0;
    const rug = (x, z, w, d, style, o = {}) => K.rug(x, z, w, d, rugDraw(style, 300 + rugN * 17), Object.assign({ y: 0.004 * (rugN++ % 4) }, o));
    // parede de taipa do fundo com mashrabiyas acesas (mapa + emissivo com o mesmo desenho)
    const wallTex = (emit) => K.canvasTex(1024, 256, (g, w, h) => {
      const r = K.rng(77), rn = K.rng(78);
      g.fillStyle = emit ? '#000' : '#b4613d'; g.fillRect(0, 0, w, h);
      if (!emit) for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(${130 + rn() * 70 | 0},${60 + rn() * 40 | 0},${30 + rn() * 30 | 0},${rn() * 0.18})`; g.fillRect(rn() * w, rn() * h, 2 + rn() * 9, 2 + rn() * 6); }
      for (let i = 0; i < 9; i++) {
        const big = i === 4, ww = big ? 80 : 44, hh = big ? 120 : 84, x = 57 + i * 113 - ww / 2, y = big ? 52 : 70, lit = r() < 0.75;
        g.save(); g.beginPath(); g.moveTo(x, y + hh); g.lineTo(x, y + ww * 0.45); g.arc(x + ww / 2, y + ww * 0.45, ww / 2 * 1.05, PI * 1.06, PI * 1.94 + PI * 0.0); g.lineTo(x + ww, y + hh); g.closePath();
        g.fillStyle = emit ? (lit ? (r() < 0.3 ? '#ffd9a0' : '#ffb860') : '#000') : (lit ? '#ffc070' : '#2a160c'); g.fill(); g.clip();
        g.strokeStyle = emit ? '#000' : '#3a2010'; g.lineWidth = 3; for (let k = -hh; k < ww + hh; k += 9) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k + hh, y + hh); g.stroke(); g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k - hh, y + hh); g.stroke(); }
        g.restore();
        if (!emit) { g.strokeStyle = '#ecd8b0'; g.lineWidth = 5; g.strokeRect(x - 6, y - 10, ww + 12, hh + 14); g.fillStyle = '#1d6a4a'; g.fillRect(x - 10, y + hh + 4, ww + 20, 8); } else r();
      }
      if (!emit) { g.fillStyle = '#1d6a4a'; g.fillRect(0, 0, w, 10); g.fillStyle = '#e9dcc0'; g.fillRect(0, 10, w, 4); for (let x = 0; x < w; x += 24) { g.fillStyle = (x / 24) % 2 ? '#1f4f8a' : '#c8902a'; g.fillRect(x, h - 18, 12, 12); } }
    });
    const backWallMat = new T.MeshStandardMaterial({ map: wallTex(false), emissiveMap: wallTex(true), emissive: 0xffffff, emissiveIntensity: 1.1, roughness: 0.9 });
    // casas da medina: reboco ocre/rosado com janelinhas
    const medTex = (base, seed, lit = 0.25) => K.canvasTex(128, 256, (g, w, h) => {
      const r = K.rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 600; k++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,220,190' : '60,30,20'},${r() * 0.12})`; g.fillRect(r() * w, r() * h, 2 + r() * 6, 2 + r() * 6); }
      for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { if (r() < 0.45) continue; const x = 12 + i * 40 + r() * 6, y = 20 + j * 48, on = r() < lit; g.fillStyle = on ? (r() < 0.5 ? '#ffc070' : '#ffdca0') : '#1a120e'; g.beginPath(); g.moveTo(x, y + 22); g.lineTo(x, y + 7); g.arc(x + 7, y + 7, 7, PI, 0); g.lineTo(x + 14, y + 22); g.fill(); if (r() < 0.4) { g.fillStyle = 'rgba(40,90,60,.9)'; g.fillRect(x - 2, y + 22, 18, 3); } }
    });
    const medMats = [['#9a5a3e', 1], ['#a8704e', 2], ['#8a4a32', 3], ['#b08060', 4], ['#985040', 5], ['#7a4430', 6]].map(([c, s]) => { const t = medTex(c, s); return new T.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: 0.22, roughness: 0.95 }); });

    // ------------------------------------------------------------ helpers de objetos
    const candleList = [], flameAt = [];
    const candles = (x, z, n = 3, y = 0, spread = 0.1, pool = true) => { for (let k = 0; k < n; k++) { const a = k * 2.4 + R(), d = k ? spread : 0, cx = x + Math.cos(a) * d, cz = z + Math.sin(a) * d, h = 0.08 + R() * 0.2; candleList.push([cx, y, cz, 0, [1, h / 0.2, 1]]); flameAt.push(K.flame(cx, y + h + 0.004, cz, 0.016 + R() * 0.006)); } if (pool) K.pool(x, z, 0.55, 0xffb050, 0.34, y + 0.02); };
    const lantern = (x, y, z, s, o = {}) => {
      const g = K.group(x, y, z, R() * 3, o.parent);
      const bodyM = new T.MeshBasicMaterial({ map: pierceTex, color: new T.Color(o.color || 0xffb860).multiplyScalar((o.k || 2.0) * 1.35), toneMapped: false });
      const body = K.lathe([[0.07, 0], [0.16, 0.08], [0.19, 0.2], [0.16, 0.33], [0.08, 0.42]].map(p => [p[0] * s, p[1] * s]), bodyM, 0, 0, 0, { parent: g, cast: false }, 10);
      K.cone(0.11 * s, 0.2 * s, brass, 0, 0.52 * s, 0, { parent: g }, 10); K.sphere(0.03 * s, brass, 0, 0.64 * s, 0, { parent: g, cast: false }, 8, 6);
      K.cyl(0.075 * s, 0.05 * s, 0.05 * s, brass, 0, -0.02 * s, 0, { parent: g }, 10); K.torus(0.025 * s, 0.006 * s, brass, 0, 0.68 * s, 0, { parent: g, cast: false });
      if (o.hang) K.cyl(0.006, 0.006, o.hang, iron, 0, 0.68 * s + o.hang / 2, 0, { parent: g, cast: false }, 4);
      const halo = K.halo(0, 0.2 * s, 0, 0.45 * s, o.color || 0xffb860, o.hk || 0.5, g);
      return { g, body, bodyM, halo };
    };
    const teapot = (x, y, z, s, m, parent, ry) => {
      const g = K.group(x, y, z, ry ?? R() * 6, parent);
      K.lathe([[0, 0], [0.05, 0], [0.07, 0.03], [0.075, 0.07], [0.06, 0.1], [0.035, 0.115], [0.03, 0.13], [0.04, 0.15], [0.02, 0.2], [0.008, 0.23], [0, 0.24]].map(p => [p[0] * s, p[1] * s]), m, 0, 0, 0, { parent: g }, 12);
      K.cyl(0.006 * s, 0.014 * s, 0.13 * s, m, 0.085 * s, 0.1 * s, 0, { parent: g, rz: -0.95 }, 6);
      K.add(new T.TorusGeometry(0.045 * s, 0.007 * s, 4, 10, PI), m, -0.07 * s, 0.085 * s, 0, { parent: g, rz: PI / 2 });
      return g;
    };
    const glassCols = [0x2c8a5a, 0xc8322f, 0x2a5aa8, 0xd9a441, 0x8a2a8a, 0x1aa0a0];
    const glassLists = glassCols.map(() => []);
    const teaGlasses = (x, y, z, n, rr = 0.12) => { for (let k = 0; k < n; k++) { const a = k / n * PI * 2 + R(); glassLists[k % glassCols.length].push([x + Math.cos(a) * rr * (0.4 + R() * 0.6), y, z + Math.sin(a) * rr * (0.4 + R() * 0.6)]); } };
    const trayTex = K.canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#f0c870'); gr.addColorStop(1, '#a87a2a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(80,50,10,.6)'; g.lineWidth = 2; for (let k = 1; k < 8; k++) { g.beginPath(); g.arc(w / 2, h / 2, k * 15, 0, 7); g.stroke(); } g.translate(w / 2, h / 2); for (let k = 0; k < 16; k++) { g.rotate(PI / 8); g.beginPath(); g.moveTo(0, 20); g.bezierCurveTo(20, 50, -20, 80, 0, 110); g.stroke(); } });
    const trayTop = K.texMat(trayTex, { roughness: 0.3, metalness: 0.8 });
    const lowTable = (x, z, r = 0.5, h = 0.4, o = {}) => {
      const g = K.group(x, o.y || 0, z, R() * 0.6);
      K.add(new T.CylinderGeometry(r * 0.75, r * 0.8, h - 0.04, 8, 1, true), cedar, 0, (h - 0.04) / 2, 0, { parent: g });
      K.cyl(r, r, 0.03, brass, 0, h - 0.02, 0, { parent: g }, 24); K.add(new T.CircleGeometry(r * 0.97, 24).rotateX(-PI / 2), trayTop, 0, h + 0.002, 0, { parent: g, cast: false }); K.torus(r, 0.015, brass, 0, h, 0, { parent: g, rx: PI / 2 });
      if (o.col !== false) K.colR(x, z, r * 0.85, o.lv || 0);
      return g;
    };
    const pouf = (x, z, o = {}) => { const r = o.r || 0.27, h = o.h || 0.3; const g = K.group(x, o.y || 0, z, R() * 6); const m = o.m || pk(leathers); K.lathe([[0, 0], [r * 0.85, 0], [r, h * 0.2], [r * 1.03, h * 0.5], [r * 0.96, h * 0.82], [r * 0.65, h], [0, h * 1.02]], m, 0, 0, 0, { parent: g }, 14); K.torus(r * 1.02, 0.012, K.mat(0xe9c33b, { roughness: 0.6 }), 0, h * 0.5, 0, { parent: g, rx: PI / 2, cast: false }); return g; };
    const cushion = (x, y, z, w, d, h, c, o = {}) => K.add(K.rbox(w, h, d, Math.min(h, 0.08) * 0.45), fabric(c), x, y, z, { ry: o.ry || 0, rx: o.rx || 0, parent: o.parent });
    const steamList = [];
    const steam = (x, y, z, n = 3, c = 0xffffff, op = 0.22, sc = 0.18, rise = 0.6) => { const out = []; for (let k = 0; k < n; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: c, transparent: true, opacity: op, depthWrite: false })); s.position.set(x, y, z); s.scale.setScalar(sc); K.root.add(s); const e = { s, x, y, z, ph: k / n, op, sc, rise }; steamList.push(e); out.push(e); } return out; };
    const tajine = (x, y, z, s, glaze) => {
      const g = K.group(x, y, z, R() * 6); const gm = K.mat(glaze, { roughness: 0.3 });
      K.lathe([[0, 0], [0.1 * s, 0], [0.15 * s, 0.02 * s], [0.17 * s, 0.05 * s], [0.16 * s, 0.055 * s], [0, 0.05 * s]], gm, 0, 0, 0, { parent: g }, 18);
      for (let k = 0; k < 6; k++) K.sphere(0.03 * s, K.mat([0xd9a441, 0xc8322f, 0x7a9a3a, 0xf2c14e, 0x8a4a22][k % 5]), Math.cos(k) * 0.07 * s, 0.06 * s, Math.sin(k) * 0.07 * s, { parent: g, cast: false }, 6, 4);
      const lid = K.group(0, 0.05 * s, 0, 0, g); K.lathe([[0.15 * s, 0], [0.12 * s, 0.03 * s], [0.06 * s, 0.1 * s], [0.025 * s, 0.17 * s], [0.03 * s, 0.2 * s], [0, 0.21 * s]], gm, 0, 0, 0, { parent: lid }, 16);
      K.torus(0.135 * s, 0.006 * s, K.mat(0xf2ead8), 0, 0.012 * s, 0, { parent: lid, rx: PI / 2, cast: false });
      return { g, lid, st: steam(x, y + 0.25 * s, z, 3, 0xffffff, 0.2, 0.16, 0.7) };
    };
    const door = (w, h, parent, x, y, z, ry) => { const g = K.group(x, y, z, ry || 0, parent); K.box(w, h, 0.08, doorMat, 0, h / 2, 0, { parent: g }); K.box(w + 0.16, 0.12, 0.12, cedarDk, 0, h + 0.06, 0, { parent: g }); return g; };
    const horseshoe = (p, cx, y0, hw, jamb, k = 1.13) => { const r = hw * k, d = Math.sqrt(r * r - hw * hw), yc = y0 + jamb + d, phi = Math.atan2(d, hw); p.moveTo(cx - hw, y0); p.lineTo(cx + hw, y0); p.lineTo(cx + hw, y0 + jamb); p.absarc(cx, yc, r, -phi, PI + phi, false); p.lineTo(cx - hw, y0); return { yc, r, phi, top: yc + r }; };
    const orangeList = [], petalLists = [[], [], []];
    const orangeTree = (x, z, y0, s = 1) => {
      K.cyl(0.06 * s, 0.1 * s, 1.3 * s, K.mat(0x5a4030, { roughness: 0.9 }), x, y0 + 0.65 * s, z, {}, 7);
      for (const a of [0.5, 2.6, 4.4]) K.cyl(0.025, 0.04, 0.6 * s, K.mat(0x5a4030), x + Math.cos(a) * 0.15, y0 + 1.3 * s, z + Math.sin(a) * 0.15, { rz: Math.cos(a) * 0.5, rx: -Math.sin(a) * 0.5 }, 5);
      const parts = []; for (let k = 0; k < 10; k++) { const px = x + (R() - 0.5) * 1.0 * s, py = y0 + 1.75 * s + (R() - 0.35) * 0.7 * s, pz = z + (R() - 0.5) * 1.0 * s; parts.push([K.at(new T.IcosahedronGeometry(0.4 * s * (0.7 + R() * 0.5), 1), px, py, pz), pk([0x1f3f1c, 0x2a4f24, 0x183a1a, 0x335a28])]); }
      K.merge(parts, K.vcol({ roughness: 0.85, flatShading: true }));
      for (let k = 0; k < 16; k++) { const a = R() * PI * 2, e = (R() - 0.3) * 1.2, rr = 0.72 * s; orangeList.push([x + Math.cos(a) * Math.cos(e) * rr, y0 + 1.8 * s + Math.sin(e) * rr * 0.8, z + Math.sin(a) * Math.cos(e) * rr]); }
      K.blob(x, z, 2.2 * s, 2.2 * s, 0.3);
    };

    // ------------------------------------------------------------ piso do pátio + caminhos de zellige
    K.floor(-14.75, -8.6, 14.75, 10.1, floorTex, { m: { roughness: 0.45, metalness: 0.05, envMapIntensity: 0.5 } });
    const pathZ = zelMat(PAL_W, [16, 1], 11), pathX = zelMat(PAL_W, [1, 12], 12);
    K.add(new T.PlaneGeometry(29.2, 0.9).rotateX(-PI / 2), pathZ, 0, 0.008, 0.4, { cast: false });
    K.add(new T.PlaneGeometry(0.9, 18.4).rotateX(-PI / 2), pathX, 0, 0.009, 0.75, { cast: false });
    for (const z of [-0.07, 0.87]) K.box(29.2, 0.012, 0.06, K.mat(0x1a1a1a, { roughness: 0.3 }), 0, 0.012, z, { cast: false });
    for (const x of [-0.47, 0.47]) K.box(0.06, 0.012, 18.4, K.mat(0x1a1a1a, { roughness: 0.3 }), x, 0.013, 0.75, { cast: false });

    // ------------------------------------------------------------ fonte de zellige no centro
    const FX = 0, FZ = 0.4;
    const waterTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#0e4a52'; g.fillRect(0, 0, w, h); for (let k = 0; k < 500; k++) { const x = R() * w, y = R() * h, l = 6 + R() * 22; g.strokeStyle = `rgba(${150 + R() * 80 | 0},${220 + R() * 35 | 0},${230},${0.08 + R() * 0.2})`; g.lineWidth = 1 + R() * 1.5; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 3, x + l, y); g.stroke(); } }, [2, 2]);
    const waterMat = new T.MeshStandardMaterial({ color: 0x3aa0a0, map: waterTex, roughness: 0.08, metalness: 0.3, envMapIntensity: 1.2, emissive: 0x0a5a60, emissiveIntensity: 0.9, transparent: true, opacity: 0.92 });
    const curtainTex = K.canvasTex(64, 256, (g, w, h) => { g.clearRect(0, 0, w, h); for (let k = 0; k < 120; k++) { g.strokeStyle = `rgba(220,250,255,${0.15 + R() * 0.5})`; g.lineWidth = 1 + R(); const x = R() * w; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (R() - 0.5) * 3, h); g.stroke(); } }, [6, 1]);
    const fountain = (() => {
      const g = K.group(FX, 0, FZ);
      K.add(new T.CylinderGeometry(2.1, 2.15, 0.06, 8), greenTile, 0, 0.03, 0, { parent: g, ry: PI / 8 });
      K.add(new T.CylinderGeometry(1.82, 1.86, 0.5, 8, 1, true), zelMat(PAL_F, [8, 1], 3), 0, 0.28, 0, { parent: g, ry: PI / 8 });
      K.lathe([[1.66, 0], [1.94, 0], [1.94, 0.09], [1.66, 0.09], [1.66, 0]], marble, 0, 0.52, 0, { parent: g, ry: PI / 8 }, 8);
      const water = K.add(new T.CylinderGeometry(1.7, 1.7, 0.02, 8), waterMat, 0, 0.46, 0, { parent: g, ry: PI / 8, cast: false });
      K.add(new T.CylinderGeometry(1.7, 1.7, 0.3, 8, 1, true), K.mat(0x0a2a30, { side: T.BackSide, roughness: 0.4 }), 0, 0.33, 0, { parent: g, ry: PI / 8, cast: false });
      K.lathe([[0, 0], [0.32, 0], [0.24, 0.12], [0.15, 0.3], [0.12, 0.62], [0.2, 0.72], [0.12, 0.76], [0, 0.76]], marble, 0, 0.47, 0, { parent: g }, 16);
      K.lathe([[0, 0], [0.12, 0], [0.5, 0.1], [0.62, 0.2], [0.6, 0.23], [0.5, 0.17], [0, 0.12]], K.texMat(zelTex(PAL_F, 4, [6, 1], 4), { roughness: 0.3, side: T.DoubleSide }), 0, 1.2, 0, { parent: g }, 20);
      K.cyl(0.52, 0.52, 0.015, waterMat, 0, 1.38, 0, { parent: g, cast: false }, 20);
      K.lathe([[0, 0], [0.08, 0], [0.06, 0.2], [0.24, 0.3], [0.26, 0.34], [0, 0.32]], marble, 0, 1.36, 0, { parent: g }, 14);
      const curtMat = new T.MeshBasicMaterial({ map: curtainTex, color: 0xbfefff, transparent: true, opacity: 0.55, depthWrite: false, side: T.DoubleSide });
      const curtain = K.add(new T.CylinderGeometry(0.61, 0.8, 0.82, 20, 1, true), curtMat, 0, 0.98, 0, { parent: g, cast: false });
      const jetMat = new T.MeshBasicMaterial({ color: 0xdff8ff, transparent: true, opacity: 0.55, depthWrite: false });
      const jet = K.add(new T.CylinderGeometry(0.012, 0.03, 0.7, 6).translate(0, 0.35, 0), jetMat, 0, 1.68, 0, { parent: g, cast: false });
      const crown = K.add(new T.SphereGeometry(0.16, 10, 6, 0, PI * 2, 0, PI / 2), new T.MeshBasicMaterial({ color: 0xcff4ff, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide }), 0, 2.32, 0, { parent: g, cast: false, s: [1, 0.6, 1] });
      // pétalas de rosa boiando (giram devagar com a água)
      const petG = K.group(FX, 0, FZ);
      const petal = new T.CircleGeometry(0.045, 6).rotateX(-PI / 2).scale(1, 1, 0.6);
      const pc = [0xe0305a, 0xf06a8a, 0xb8102a];
      const pl = [[], [], []]; for (let k = 0; k < 150; k++) { const a = R() * PI * 2, rr = Math.sqrt(R()) * 1.6; if (rr < 0.35) continue; pl[k % 3].push([Math.cos(a) * rr, 0.475, Math.sin(a) * rr, R() * 6]); }
      for (let k = 0; k < 40; k++) { const a = R() * PI * 2, rr = 0.15 + R() * 0.35; pl[k % 3].push([Math.cos(a) * rr, 1.395, Math.sin(a) * rr, R() * 6]); }
      pl.forEach((l, i) => K.inst(petal, K.mat(pc[i], { roughness: 0.7, side: T.DoubleSide }), l, { parent: petG, cast: false }));
      // velas na borda de mármore
      for (let k = 0; k < 8; k++) { const a = k * PI / 4 + PI / 8, rr = 1.88; candles(FX + Math.cos(a) * rr, FZ + Math.sin(a) * rr, 1, 0.6, 0, false); }
      K.colR(FX, FZ, 1.75);
      return { g, water, curtain, jet, crown, petG };
    })();
    const fLight = K.plight(FX, 0.9, FZ, 0x40d8c8, 1.4, 7);
    const fPool = K.pool(FX, FZ, 3.2, 0x30c0b0, 0.35);
    const keyGlint = K.halo(FX + 0.6, 0.6, FZ + 0.3, 0.3, 0xffd060, 0); keyGlint.visible = false;
    K.tick((dt, t) => {
      waterTex.offset.set(Math.sin(t * 0.2) * 0.05, t * 0.03); curtainTex.offset.y = -t * 0.9;
      fountain.jet.scale.y = 1 + Math.sin(t * 7) * 0.05 + Math.sin(t * 13) * 0.03; fountain.crown.scale.set(1 + Math.sin(t * 6) * 0.08, 0.6, 1 + Math.cos(t * 6) * 0.08);
      fountain.petG.rotation.y = t * 0.05; fLight.intensity = (keyGlint.visible ? 1.8 : 1.4) + Math.sin(t * 3) * 0.12;
    });
    K.tell('chave', (live) => {
      waterMat.emissive.set(0xffa818); waterMat.emissiveIntensity = 1.5; fLight.color.set(0xffb030); fPool.material.color.set(new T.Color(0xffa010).multiplyScalar(0.75)); keyGlint.visible = true; keyGlint.scale.setScalar(1.4); keyGlint.material.color.set(new T.Color(0xffd060).multiplyScalar(1.8));
      if (live) K.anim(1.4, (e) => { fountain.jet.scale.x = fountain.jet.scale.z = 1 - e; fountain.crown.visible = e < 0.5; fountain.curtain.material.opacity = 0.55 * (1 - e); }); else { fountain.jet.visible = false; fountain.crown.visible = false; fountain.curtain.material.opacity = 0; }
    }, () => { waterMat.emissive.set(0x0a5a60); waterMat.emissiveIntensity = 0.9; fLight.color.set(0x40d8c8); fPool.material.color.set(new T.Color(0x30c0b0).multiplyScalar(0.35)); keyGlint.visible = false; fountain.jet.visible = true; fountain.jet.scale.x = fountain.jet.scale.z = 1; fountain.crown.visible = true; fountain.curtain.material.opacity = 0.55; });
    K.ringSlots(FX, FZ, 8, 2.55, 'talk', 0, 0.4);
    K.slot(-1.9, 2.6, -4, 6, 'selfie'); K.slot(2.6, -1.2, 5, -3, 'selfie');

    // ------------------------------------------------------------ canteiros com laranjeiras (quatro quadrantes)
    const bedSide = zelMat(PAL_D, [5, 1], 21), bedLeaves = [], bedFlowers = [[], [], []];
    for (const [bx, bz] of [[-4.6, -3.8], [4.6, -3.8], [-4.6, 4.1], [4.6, 4.1]]) {
      K.add(new T.BoxGeometry(2.3, 0.45, 2.3), [bedSide, bedSide, soil, soil, bedSide, bedSide], bx, 0.225, bz);
      for (const [dx, dz, w, d] of [[0, -1.12, 2.4, 0.12], [0, 1.12, 2.4, 0.12], [-1.12, 0, 0.12, 2.4], [1.12, 0, 0.12, 2.4]]) K.box(w, 0.06, d, greenTile, bx + dx, 0.48, bz + dz, { cast: false });
      orangeTree(bx, bz, 0.45, 1.3);
      // menta, rosas e flores no canteiro
      for (let k = 0; k < 16; k++) { const a = R() * PI * 2, rr = 0.45 + R() * 0.55; bedLeaves.push([bx + Math.cos(a) * rr, 0.5, bz + Math.sin(a) * rr, R() * 6, 0.7 + R() * 0.8]); }
      for (let k = 0; k < 10; k++) { const a = R() * PI * 2, rr = 0.6 + R() * 0.4; bedFlowers[k % 3].push([bx + Math.cos(a) * rr, 0.6 + R() * 0.06, bz + Math.sin(a) * rr]); }
      K.col(bx - 1.17, bz - 1.17, bx + 1.17, bz + 1.17);
      // lanterninha perfurada no canto do canteiro, com padrão de luz no chão
      const lx = bx + (bx < 0 ? 1.0 : -1.0), lz = bz + (bz < 0 ? 1.0 : -1.0);
      lantern(lx, 0.51, lz, 0.6, { k: 2.2, hk: 0.4 }); projPool(lx, lz, 1.1, 0xffb050, 0.35);
    }
    K.inst(new T.SphereGeometry(0.1, 7, 5), K.mat(0x2f5a28, { roughness: 0.85 }), bedLeaves, { cast: false }); bedFlowers.forEach((l, i) => K.inst(new T.SphereGeometry(0.04, 6, 4), K.mat([0xe0305a, 0xf6f3ec, 0xf06a8a][i], { roughness: 0.7 }), l, { cast: false }));
    K.inst(new T.SphereGeometry(0.05, 7, 5), K.mat(0xf08a1a, { roughness: 0.45, emissive: 0x803000, emissiveIntensity: 0.25 }), orangeList, { cast: false });
    // pétalas espalhadas pelo chão do pátio
    { const pc = [0xe0305a, 0xf06a8a, 0xb8102a]; const pet = new T.CircleGeometry(0.04, 6).rotateX(-PI / 2).scale(1, 1, 0.6); const l = [[], [], []];
      for (let k = 0; k < 360; k++) { const a = R() * PI * 2, rr = 2.2 + Math.pow(R(), 1.6) * 5.5, x = FX + Math.cos(a) * rr, z = FZ + Math.sin(a) * rr * 0.9; if (Math.abs(x) > 3.3 && Math.abs(x) < 5.9 && ((z > -5.1 && z < -2.5) || (z > 2.8 && z < 5.4))) continue; l[k % 3].push([x, 0.016, z, R() * 6]); }
      l.forEach((ll, i) => K.inst(pet, K.mat(pc[i], { roughness: 0.75, side: T.DoubleSide }), ll, { cast: false })); }

    // ------------------------------------------------------------ galeria do fundo: arcos em ferradura, estuque entalhado, zellige
    const ARC = [-10.2, -6.8, -3.4, 0, 3.4, 6.8, 10.2], AHW = 0.85, AJ = 1.35;
    let arcInfo = null;
    { const sh = new T.Shape(); sh.moveTo(-14.75, 0); sh.lineTo(14.75, 0); sh.lineTo(14.75, 3.2); sh.lineTo(-14.75, 3.2); sh.lineTo(-14.75, 0);
      for (const cx of ARC) { const hp = new T.Path(); arcInfo = horseshoe(hp, cx, 0, AHW, AJ); sh.holes.push(hp); }
      const geo = new T.ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: false, curveSegments: 18 }); geo.translate(0, 0, -9.0);
      K.add(geo, plasterLt, 0, 0, 0);
      const stuc = K.texMat(stuccoTex([1, 1]), { roughness: 0.85 });
      for (const cx of ARC) {
        const { yc, r, phi } = arcInfo;
        K.add(new T.TorusGeometry(r + 0.05, 0.045, 6, 30, PI + 2 * phi), K.mat(0xf2e6cc, { roughness: 0.8 }), cx, yc, -8.53, { rz: -phi, cast: false });
        K.add(new T.TorusGeometry(r + 0.17, 0.03, 4, 30, PI + 2 * phi), K.mat(0xc8902a, { roughness: 0.5, metalness: 0.3 }), cx, yc, -8.53, { rz: -phi, cast: false });
        // alfiz (moldura retangular) e painéis de estuque nos tímpanos
        K.box(2 * (r + 0.3), 0.05, 0.04, K.mat(0x1d6a4a, { roughness: 0.3 }), cx, yc + r + 0.25, -8.52, { cast: false });
        for (const s of [-1, 1]) { K.box(0.05, r + 0.6, 0.04, K.mat(0x1d6a4a, { roughness: 0.3 }), cx + s * (r + 0.3), yc + 0.05, -8.52, { cast: false }); const p = K.add(new T.PlaneGeometry(0.42, 0.62), stuc, cx + s * (r - 0.02), yc + r - 0.12, -8.535, { cast: false }); p.material = stuc; }
      }
      // pilares: rodapé de zellige
      const dado = zelMat(PAL_D, [3, 2], 31);
      for (let k = 0; k < ARC.length - 1; k++) K.add(new T.PlaneGeometry(1.5, 1.0), dado, (ARC[k] + ARC[k + 1]) / 2, 0.52, -8.535, { cast: false });
      for (const x of [-12.85, 12.85]) K.add(new T.PlaneGeometry(3.4, 1.0), zelMat(PAL_D, [6, 2], 32), x, 0.52, -8.535, { cast: false });
      // friso de estuque entalhado e beiral de telhas verdes
      K.add(new T.PlaneGeometry(29.4, 0.34), K.texMat(stuccoTex([24, 1]), { roughness: 0.8 }), 0, 2.98, -8.535, { cast: false });
      K.box(29.6, 0.08, 0.3, cedarDk, 0, 3.18, -8.45, { cast: false });
      for (let x = -14.6; x <= 14.6; x += 0.3) K.box(0.06, 0.06, 0.32, cedar, x, 3.1, -8.42, { cast: false });
      const tileTex = K.canvasTex(256, 32, (g, w, h) => { for (let x = 0; x < w; x += 8) { const gr = g.createLinearGradient(x, 0, x + 8, 0); gr.addColorStop(0, '#0e3a28'); gr.addColorStop(0.5, '#3a9a6a'); gr.addColorStop(1, '#0e3a28'); g.fillStyle = gr; g.fillRect(x, 0, 8, h); } }, [30, 1]);
      K.add(new T.PlaneGeometry(29.8, 0.6), K.texMat(tileTex, { roughness: 0.25, metalness: 0.1, side: T.DoubleSide }), 0, 3.28, -8.35, { rx: -PI / 2 + 0.45, cast: false });
      K.box(29.8, 0.05, 0.05, greenTile, 0, 3.17, -8.08, { cast: false });
      // guirlanda de luzinhas no beiral
      K.bulbs([-14.5, 3.0, -8.3], [-0.2, 3.0, -8.3], 26, 0.25, 0xffc070, 2.6); K.bulbs([0.2, 3.0, -8.3], [12.4, 3.0, -8.3], 22, 0.25, 0xffc070, 2.6);
      // interior da galeria (visto através dos arcos)
      K.add(new T.PlaneGeometry(29.4, 3.0).rotateX(-PI / 2), K.mat(0x4a2a1c, { roughness: 0.6 }), 0, 0.006, -10.4, { cast: false });
      K.box(29.4, 3.2, 0.2, plaster, 0, 1.6, -11.9, { cast: false });
      K.add(new T.PlaneGeometry(29.4, 1.0), zelMat(PAL_D, [26, 1], 33), 0, 0.5, -11.79, { cast: false });
      K.box(29.4, 0.08, 3.0, cedarDk, 0, 3.16, -10.4, { cast: false });
      for (const x of [-6.8, 6.8]) door(1.3, 2.3, K.root, x, 0, -11.77);
      for (const x of [-10.2, -3.4, 3.4, 10.2]) { const t = K.canvasTex(64, 128, (g, w, h) => { g.fillStyle = '#2a140a'; g.fillRect(0, 0, w, h); const gr = g.createRadialGradient(32, 80, 4, 32, 80, 50); gr.addColorStop(0, '#ffcf80'); gr.addColorStop(1, 'rgba(255,140,40,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); K.add(new T.PlaneGeometry(0.6, 1.1), new T.MeshBasicMaterial({ map: t, color: 0xffffff, toneMapped: false }), x, 1.75, -11.78, { cast: false }); K.box(0.8, 0.06, 0.25, cedar, x, 1.2, -11.7); }
      for (const x of [-10.2, -6.8, -3.4, 3.4, 6.8, 10.2]) { lantern(x, 2.05, -9.9, 0.7, { hang: 0.75, k: 2.2, hk: 0.6 }); K.pool(x, -9.9, 1.0, 0xffb050, 0.45, 0.012); }
      for (const x of [-8.5, 8.5, -1.7, 1.7]) { K.add(K.rbox(1.6, 0.3, 0.6, 0.06), fabric(pk([0x8a1a2a, 0x1f3a5a, 0x2c5a3a])), x, 0.2, -11.4); for (let k = 0; k < 3; k++) cushion(x - 0.5 + k * 0.5, 0.5, -11.6, 0.42, 0.14, 0.38, pk([0xd9a441, 0xc8322f, 0x2a5aa8, 0xf2ead8]), { rx: -0.2 }); }
    }
    // a grande lanterna perfurada no arco central (missão)
    const bigLan = lantern(0, 1.25, -8.78, 2.1, { hang: 0.15, k: 2.4, hk: 0.9, color: 0xffb050 });
    const bigLight = K.plight(0, 1.6, -8.2, 0xffb050, 2.2, 9);
    const bigProj = projPool(0, -7.2, 3.0, 0xffa040, 0.85, 0.03);
    const bigProjW = (() => { const m = new T.Mesh(new T.PlaneGeometry(4, 4), new T.MeshBasicMaterial({ map: projTex, color: new T.Color(0xffa040).multiplyScalar(0.45), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); m.position.set(0, 1.6, -11.77); K.root.add(m); return m; })();
    K.tick((dt, t) => { bigLan.g.rotation.y = t * 0.25; bigLan.g.rotation.z = Math.sin(t * 0.9) * 0.03; bigProj.rotation.y = t * 0.25; });
    K.tell('lanterna', (live) => {
      const off = () => { bigLan.bodyM.color.set(0x2a1a10); bigLan.halo.visible = false; bigLight.intensity = 0; bigProj.visible = false; bigProjW.visible = false; };
      if (live) K.anim(1.2, (e, u) => { const on = Math.sin(u * 40) > 0 && u < 0.8; bigLight.intensity = on ? 2.2 : 0.2; bigLan.bodyM.color.set(new T.Color(0xffb050).multiplyScalar(on ? 2.4 : 0.3)); if (u >= 1) off(); }); else off();
    }, () => { bigLan.bodyM.color.set(new T.Color(0xffb050).multiplyScalar(2.4)); bigLan.halo.visible = true; bigLight.intensity = 2.2; bigProj.visible = true; bigProjW.visible = true; });
    // gente ao longo da galeria
    [-11.6, -8.5, -5.1, -1.7, 1.7, 5.1, 10.4].forEach(x => K.slot(x, -7.75, x, -5, 'talk'));
    // velas no chão diante dos arcos
    for (const x of [-12, -8.5, -5.1, -1.7, 1.7, 5.1, 8.5, 11.8]) candles(x, -8.25, 3, 0, 0.1);

    // ------------------------------------------------------------ escada para o terraço (lado direito)
    { const n = 17, z0 = -3.0, run = 5.6, tread = run / n, stepM = K.mat(0xc98a5e, { roughness: 0.8 });
      for (let k = 0; k < n; k++) { const h = (k + 1) * 0.2, z = z0 - (k + 0.5) * tread; K.box(1.7, h, tread + 0.005, plaster, 13.45, h / 2, z); K.box(1.72, 0.03, tread, stepM, 13.45, h + 0.012, z, { cast: false }); K.box(1.7, 0.16, 0.012, greenTile, 13.45, h - 0.1, z + tread / 2 + 0.002, { cast: false }); }
      const ang = Math.atan2(3.4, run), len = Math.hypot(3.4, run);
      const wall = K.box(0.18, 0.7, len, plasterLt, 12.55, 1.7 + 0.35, z0 - run / 2); wall.rotation.x = ang;
      const cap = K.box(0.24, 0.06, len, greenTile, 12.55, 1.7 + 0.72, z0 - run / 2, { cast: false }); cap.rotation.x = ang;
      K.add(new T.PlaneGeometry(len, 0.5), zelMat(PAL_D, [10, 1], 41), 12.45, 1.7, z0 - run / 2, { cast: false }).rotation.set(-ang, -PI / 2, 0, 'YXZ');
      for (let k = 2; k < n; k += 4) { const z = z0 - (k + 0.5) * tread, y = (k + 1) * 0.2; candles(12.75, z, 1, y + 0.02, 0, false); }
      K.col(12.5, -8.5, 14.5, -3.05);
      lantern(12.55, 0.72, -2.85, 0.7, { k: 2.2 });
      // jarros de barro sob a escada
      for (let k = 0; k < 3; k++) K.lathe([[0, 0], [0.12, 0], [0.22, 0.2], [0.2, 0.45], [0.09, 0.6], [0.1, 0.68], [0, 0.68]], K.mat(pk([0xb5603a, 0x8a4a2a, 0x1f6a4a]), { roughness: 0.6 }), 11.3 + k * 0.4, 0, -7.9 - (k % 2) * 0.3, {}, 12);
      K.col(11.0, -8.3, 12.3, -7.5);
    }

    // ------------------------------------------------------------ terraço superior (nível 1)
    { const y = L1, tileTex = K.canvasTex(512, 512, (g, w, h) => { const c = 32; for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const v = R(); g.fillStyle = `rgb(${176 + v * 30 | 0},${96 + v * 22 | 0},${62 + v * 16 | 0})`; g.fillRect(i * c + 1, j * c + 1, c - 2, c - 2); if ((i + j) % 4 === 0) { g.fillStyle = '#1d6a4a'; g.fillRect(i * c + 12, j * c + 12, 8, 8); } } K.grain(g, w, h, 10); }, [8, 2]);
      K.box(29.5, 0.22, 4.4, plaster, 0, y - 0.11, -10.75, { cast: false });
      K.floor(-14.75, -12.75, 14.75, -8.55, tileTex, { y: y + 0.002, m: { roughness: 0.75 } });
      // parapeito com merlões escalonados (abertura para a escada à direita)
      K.box(26.3, 0.6, 0.18, plasterLt, -0.65, y + 0.3, -8.68); K.box(26.4, 0.05, 0.24, greenTile, -0.65, y + 0.62, -8.68, { cast: false });
      K.add(new T.PlaneGeometry(26.3, 0.6), zelMat(PAL_W, [36, 1], 51), -0.65, y + 0.3, -8.585, { cast: false });
      for (const [x, z0, z1] of [[-13.85, -12.75, -8.6], [14.55, -12.75, -8.6]]) { K.box(0.18, 0.6, z1 - z0, plasterLt, x, y + 0.3, (z0 + z1) / 2); K.box(0.24, 0.05, z1 - z0, greenTile, x, y + 0.62, (z0 + z1) / 2, { cast: false }); }
      const mer = []; for (let x = -13.6; x <= 12.4; x += 0.85) mer.push([x, y + 0.65, -8.68]);
      for (let z = -12.4; z <= -8.9; z += 0.85) { mer.push([-13.85, y + 0.65, z]); mer.push([14.55, y + 0.65, z]); }
      K.inst(new T.BoxGeometry(0.42, 0.14, 0.2).translate(0, 0.07, 0), plasterLt, mer); K.inst(new T.BoxGeometry(0.26, 0.14, 0.2).translate(0, 0.21, 0), plasterLt, mer); K.inst(new T.BoxGeometry(0.1, 0.1, 0.2).translate(0, 0.33, 0), plasterLt, mer);
      // parede alta do fundo (taipa terracota com mashrabiyas) e balcão de madeira
      K.add(new T.BoxGeometry(29.6, 6.6, 0.5), [plaster, plaster, terra, terra, backWallMat, terra], 0, y + 3.3, -13.0, { cast: false });
      K.box(29.9, 0.16, 0.8, greenTile, 0, y + 6.65, -12.8, { cast: false }); K.box(29.9, 0.1, 0.6, cedarDk, 0, y + 6.52, -12.8, { cast: false });
      const mer2 = []; for (let x = -14.4; x <= 14.4; x += 0.9) mer2.push([x, y + 6.73, -13.0]);
      K.inst(new T.BoxGeometry(0.5, 0.2, 0.4).translate(0, 0.1, 0), terra, mer2, { cast: false }); K.inst(new T.BoxGeometry(0.3, 0.2, 0.4).translate(0, 0.3, 0), terra, mer2, { cast: false });
      { const bx = 0, by = y + 2.2, g = K.group(bx, by, -12.55);
        K.box(3.0, 0.14, 0.75, cedarDk, 0, 0, 0, { parent: g }); K.box(3.0, 0.12, 0.85, cedarDk, 0, 2.1, 0, { parent: g });
        const ms = K.canvasTex(128, 128, (gg, w, h) => { gg.clearRect(0, 0, w, h); gg.strokeStyle = '#4a2a14'; gg.lineWidth = 5; for (let k = 0; k <= w; k += 16) { gg.beginPath(); gg.moveTo(k, 0); gg.lineTo(k, h); gg.stroke(); gg.beginPath(); gg.moveTo(0, k); gg.lineTo(w, k); gg.stroke(); } gg.fillStyle = '#4a2a14'; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) { gg.beginPath(); gg.arc(i * 16, j * 16, 4.5, 0, 7); gg.fill(); } }, [4, 3]);
        const msM = new T.MeshStandardMaterial({ map: ms, transparent: true, alphaTest: 0.4, side: T.DoubleSide, roughness: 0.7 });
        K.add(new T.PlaneGeometry(2.9, 2.0), msM, 0, 1.05, 0.37, { parent: g });
        for (const s of [-1, 1]) K.add(new T.PlaneGeometry(0.72, 2.0), msM, s * 1.45, 1.05, 0.0, { parent: g, ry: PI / 2 });
        K.add(new T.PlaneGeometry(2.8, 1.9), new T.MeshBasicMaterial({ color: new T.Color(0xffa850).multiplyScalar(1.4), toneMapped: false }), 0, 1.05, -0.2, { parent: g, cast: false });
        for (let k = 0; k < 4; k++) K.box(0.08, 0.4, 0.08, cedar, -1.3 + k * 0.866, -0.25, 0.3, { parent: g });
      }
      // luzinhas ao longo da parede do fundo
      K.bulbs([-13.5, y + 2.6, -12.7], [-1.9, y + 2.6, -12.7], 18, 0.35, 0xffd08a, 3); K.bulbs([1.9, y + 2.6, -12.7], [14.0, y + 2.6, -12.7], 18, 0.35, 0xffd08a, 3);
    }
    // tenda berbere no canto esquerdo do terraço
    { const y = L1, g = K.group(-12.0, y, -11.5);
      const tTex = K.canvasTex(256, 128, (gg, w, h) => { for (let k = 0; k < 16; k++) { gg.fillStyle = ['#2a1e18', '#4a3628', '#e8dcc0', '#2a1e18', '#8a2a1a', '#4a3628'][k % 6]; gg.fillRect(0, k * 8, w, 8); } K.grain(gg, w, h, 20); });
      const tM = K.texMat(tTex, { side: T.DoubleSide, roughness: 0.95 });
      for (const s of [-1, 1]) { const p = K.add(new T.PlaneGeometry(3.0, 1.45), tM, 0, 1.7, s * 0.62, { parent: g }); p.rotation.set(-s * 0.95, 0, 0); }
      for (const x of [-1.45, 1.45]) K.cyl(0.04, 0.05, 2.35, cedar, x, 1.17, 0, { parent: g }, 6);
      K.cyl(0.035, 0.035, 3.1, cedar, 0, 2.32, 0, { parent: g, rz: PI / 2 }, 6);
      const flap = K.add(new T.PlaneGeometry(1.0, 1.3), tM, 1.1, 1.4, 1.1, { parent: g, ry: 0.9 });
      for (let k = 0; k < 4; k++) cushion(-1.0 + k * 0.6, 0.18, -0.5, 0.5, 0.5, 0.26, pk([0xc8322f, 0xd9a441, 0x2a5aa8, 0x8a1a6a]), { parent: g });
      rug(-12.0, -11.3, 2.8, 1.8, 'kilim', { y: y });
      lantern(0, 1.55, 0, 0.6, { parent: g, hang: 0.55, k: 2.2 });
      K.tick((dt, t) => { flap.rotation.y = 0.9 + Math.sin(t * 1.3) * 0.08; });
      K.col(-13.5, -12.4, -10.5, -10.5, 1);
      K.slot(-11.1, -10.1, -11.5, -11.4, 'talk', 1); K.slot(-12.4, -10.0, -12.0, -11.4, 'talk', 1);
    }
    // colchão para deitar ao longo da parede
    { const y = L1; K.add(K.rbox(3.0, 0.2, 0.85, 0.06), fabric(0x8a1a2a), -8.7, y + 0.1, -12.25); for (let k = 0; k < 4; k++) cushion(-9.9 + k * 0.8, y + 0.42, -12.55, 0.55, 0.18, 0.38, pk([0xd9a441, 0x2a5aa8, 0xf2ead8, 0x1d6a4a]), { rx: -0.25 });
      K.slot(-9.4, -12.15, -9.4, -9, 'lie', 1); K.slot(-8.0, -12.15, -8.0, -9, 'lie', 1); }
    // contador de histórias: banquinho, tapete em meia-lua, pufes da plateia e o dossel
    { const y = L1, cx = -3.0, cz = -11.75;
      rug(cx, -11.0, 4.6, 2.8, 'beni', { y });
      K.cyl(0.24, 0.2, 0.42, cedar, cx, y + 0.21, cz - 0.15, {}, 8); K.cyl(0.26, 0.26, 0.05, K.mat(0x8a1a2a, { roughness: 0.9 }), cx, y + 0.44, cz - 0.15, {}, 12);
      K.colR(cx, cz - 0.15, 0.25, 1);
      for (const a of [0.35, 0.95, 1.57, 2.2, 2.8]) { const px = cx + Math.cos(a) * 1.65, pz = cz + Math.sin(a) * 1.55; pouf(px, pz, { y, r: 0.25, h: 0.44 }); K.slot(px, pz, cx, cz, 'sit', 1); }
      teapot(cx + 0.55, y, cz - 0.3, 1.3, silver); teaGlasses(cx + 0.75, y + 0.0, cz - 0.1, 3, 0.1);
      candles(cx - 0.7, cz - 0.4, 3, y, 0.1); candles(cx + 1.6, cz - 0.4, 2, y, 0.1);
      // dossel listrado entre a parede e dois mastros
      for (const x of [-5.3, -0.7]) { K.cyl(0.04, 0.05, 2.5, cedar, x, y + 1.25, -10.75, {}, 6); K.sphere(0.07, brass, x, y + 2.55, -10.75, {}, 8, 6); K.colR(x, -10.75, 0.12, 1); }
      const sTex = K.canvasTex(256, 128, (g, w, h) => { for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? '#f2e6c8' : '#c8402a'; g.fillRect(k * w / 12, 0, w / 12, h); } g.fillStyle = '#d9a441'; for (let k = 0; k < 24; k++) { g.beginPath(); g.arc(k * w / 24 + 5, h, 6, PI, 0); g.fill(); } });
      const sGeo = new T.PlaneGeometry(4.7, 2.1, 10, 4); { const p = sGeo.attributes.position; for (let i = 0; i < p.count; i++) { const u = p.getX(i) / 2.35, v = p.getY(i) / 1.05; p.setZ(i, -(1 - u * u) * 0.18 - (1 - v * v) * 0.1); } sGeo.computeVertexNormals(); }
      const sail = K.add(sGeo, K.texMat(sTex, { side: T.DoubleSide, roughness: 0.9 }), -3.0, y + 2.75, -11.75, { cast: true }); sail.rotation.set(-PI / 2 + 0.28, 0, 0);
      for (const x of [-4.3, -3.0, -1.7]) lantern(x, y + 1.95, -10.85, 0.55, { hang: 0.4, k: 2.2 });
      K.tick((dt, t) => { sail.rotation.x = -PI / 2 + 0.28 + Math.sin(t * 1.1) * 0.025; });
    }
    // incensário de latão (missão)
    const incense = (() => { const y = L1, x = 4.0, z = -12.0, g = K.group(x, y, z);
      K.box(0.55, 0.5, 0.55, cedar, 0, 0.25, 0, { parent: g }); K.add(new T.PlaneGeometry(0.45, 0.4), zelMat(PAL_F, [1, 1], 61), 0, 0.25, 0.28, { parent: g, cast: false });
      K.lathe([[0, 0], [0.14, 0], [0.1, 0.06], [0.06, 0.16], [0.16, 0.24], [0.18, 0.3], [0, 0.3]], brass, 0, 0.5, 0, { parent: g }, 12);
      const domeM = new T.MeshBasicMaterial({ map: pierceTex, color: new T.Color(0x553010), toneMapped: false });
      K.add(new T.SphereGeometry(0.17, 12, 8, 0, PI * 2, 0, PI / 2), domeM, 0, 0.8, 0, { parent: g, cast: false });
      K.cone(0.05, 0.16, brass, 0, 1.03, 0, { parent: g }, 8); K.sphere(0.03, brass, 0, 1.13, 0, { parent: g }, 8, 6);
      const ember = K.halo(0, 0.88, 0, 0.35, 0xff6020, 1.2, g); ember.visible = false;
      K.col(x - 0.35, z - 0.35, x + 0.35, z + 0.35, 1);
      // dois vasos de latão e uma bandeja com bakhoor
      for (const s of [-1, 1]) K.lathe([[0, 0], [0.1, 0], [0.15, 0.2], [0.07, 0.4], [0.1, 0.5], [0, 0.5]], copper, x + s * 0.7, y, z + 0.05, {}, 12);
      const smoke = []; for (let k = 0; k < 16; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: K.radialTex, color: 0xe8dcff, transparent: true, opacity: 0, depthWrite: false })); s.position.set(x, y + 1.1, z); K.root.add(s); smoke.push({ s, ph: k / 16 }); }
      const light = K.plight(x, y + 1.6, z + 0.4, 0xffa060, 0, 6);
      return { domeM, ember, smoke, light, on: false, x, y, z };
    })();
    K.tick((dt, t) => { if (!incense.on) return; incense.smoke.forEach((p, i) => { const u = (t * 0.12 + p.ph) % 1; p.s.position.set(incense.x + Math.sin(u * 9 + i) * 0.15 * u * 3, incense.y + 1.1 + u * 5.5, incense.z + Math.cos(u * 7 + i) * 0.1 * u * 3); p.s.scale.setScalar(0.35 + u * 2.4); p.s.material.opacity = 0.75 * Math.sin(u * PI) * (1 - u * 0.3); }); incense.light.intensity = 1.6 + Math.sin(t * 9) * 0.25; });
    K.tell('incenso', (live) => { incense.on = true; incense.ember.visible = true; incense.domeM.color.set(new T.Color(0xff8030).multiplyScalar(2.6)); if (live) K.anim(1, e => { incense.ember.scale.setScalar(0.7 * (0.5 + e)); }); }, () => { incense.on = false; incense.ember.visible = false; incense.domeM.color.set(0x553010); incense.light.intensity = 0; incense.smoke.forEach(p => p.s.material.opacity = 0); });
    // banca do antiquário no terraço
    { const y = L1, g = K.group(9.4, y, -12.05);
      K.box(3.6, 0.66, 0.7, cedarDk, 0, 0.33, 0, { parent: g }); K.box(3.7, 0.04, 0.8, K.mat(0x4a0f1a, { roughness: 0.95 }), 0, 0.68, 0, { parent: g }); K.box(3.72, 0.3, 0.82, K.mat(0x4a0f1a, { roughness: 0.95 }), 0, 0.55, 0, { parent: g, cast: false });
      // lâmpadas de Aladim, astrolábio, livros, punhais, caixa de joias
      for (let k = 0; k < 4; k++) { const lg = K.group(-1.5 + k * 0.32, 0.7, 0.1 - (k % 2) * 0.15, k, g); K.lathe([[0, 0], [0.04, 0], [0.07, 0.03], [0.06, 0.06], [0.02, 0.07], [0.015, 0.11], [0, 0.11]], k % 2 ? brass : copper, 0, 0, 0, { parent: lg }, 10); K.cyl(0.006, 0.014, 0.12, brass, 0.08, 0.05, 0, { parent: lg, rz: -1.1 }, 5); }
      const ast = K.group(0.1, 0.7, 0.05, 0.3, g); K.cyl(0.18, 0.18, 0.015, brass, 0, 0.22, 0, { parent: ast, rx: PI / 2 }, 24); K.torus(0.19, 0.012, brass, 0, 0.22, 0, { parent: ast }); K.box(0.36, 0.01, 0.005, K.mat(0x2a1a08), 0, 0.22, 0.012, { parent: ast, rz: 0.6 }); K.torus(0.02, 0.006, brass, 0, 0.43, 0, { parent: ast }); K.box(0.06, 0.2, 0.06, cedarDk, 0, 0.05, 0, { parent: ast });
      for (let k = 0; k < 4; k++) K.box(0.22, 0.05, 0.16, K.mat(pk([0x6a1a1a, 0x1a3a2a, 0x3a2a1a, 0x1f2a5a]), { roughness: 0.8 }), 0.75, 0.73 + k * 0.05, 0.05, { parent: g, ry: k * 0.2 });
      for (let k = 0; k < 2; k++) { const dg = K.group(1.2 + k * 0.25, 0.71, 0.15, 0.4 + k * 0.3, g); K.add(new T.TorusGeometry(0.1, 0.018, 4, 10, PI * 0.6), silver, 0, 0, 0, { parent: dg, rx: PI / 2 }); K.box(0.08, 0.02, 0.03, K.mat(0x3a2010), -0.07, 0, 0.08, { parent: dg }); }
      K.add(K.rbox(0.26, 0.14, 0.18, 0.03), K.mat(0xd9c8a0, { roughness: 0.4 }), 1.5, 0.78, -0.1, { parent: g }); K.sphere(0.03, K.mat(0x1f6a4a, { metalness: 0.4, roughness: 0.2 }), 1.5, 0.87, -0.1, { parent: g, cast: false }, 8, 6);
      K.add(new T.PlaneGeometry(0.4, 0.3).rotateX(-PI / 2), K.mat(0xe0cfa0, { roughness: 0.9, side: T.DoubleSide }), -0.55, 0.705, 0.12, { parent: g, ry: 0.2, cast: false });
      // espelhos e bandejas de latão pendurados na parede
      for (let k = 0; k < 5; k++) { const x = -1.6 + k * 0.8, yy = 1.4 + (k % 2) * 0.35; if (k % 2) { K.cyl(0.24, 0.24, 0.03, brass, x, yy, -0.68, { parent: g, rx: PI / 2 }, 20); } else { K.box(0.4, 0.55, 0.04, K.mat(0xe8dcc0, { roughness: 0.5 }), x, yy, -0.68, { parent: g }); K.box(0.3, 0.42, 0.01, K.mat(0x8aa0b8, { roughness: 0.05, metalness: 0.9 }), x, yy, -0.655, { parent: g, cast: false }); } }
      teapot(-1.1, 0.7, -0.1, 1.2, copper, g);
      K.col(7.5, -12.45, 11.3, -11.6, 1);
      K.plight(9.4, y + 2.0, -10.6, 0xffb870, 1.2, 6);
      candles(7.4, -11.3, 2, y, 0.1); K.plant(11.9, -12.0, 'palm', { y, lv: 1, pot: K.mat(0x1f6a4a, { roughness: 0.35 }), s: 1.0 });
      K.slot(8.6, -10.7, 8.8, -12, 'view', 1); K.slot(10.4, -10.6, 10.0, -12, 'talk', 1);
    }
    // vasos, luzes e vagas do terraço
    { const y = L1; K.plant(-13.1, -9.4, 'palm', { y, lv: 1, s: 0.9, pot: K.mat(0xb5603a) }); K.plant(-6.0, -12.2, 'bush', { y, lv: 1, pot: K.mat(0x1f6a4a, { roughness: 0.35 }) }); K.plant(6.2, -12.2, 'fern', { y, lv: 1, pot: K.mat(0x1f4f8a, { roughness: 0.35 }) });
      K.plight(-3.0, y + 2.3, -10.6, 0xffb060, 1.6, 8);
      for (const x of [-11.6, -9.6, -4.6, -1.0, 1.6, 6.2, 8.8, 11.2]) K.slot(x, -9.35, x, -4, 'view', 1);
      K.slot(1.0, -10.8, 2.0, -11.2, 'talk', 1); K.slot(2.0, -10.3, 1.0, -10.8, 'talk', 1); K.slot(6.4, -10.6, 7.2, -10.2, 'talk', 1); K.slot(7.2, -10.0, 6.4, -10.6, 'talk', 1);
      K.slot(12.2, -10.3, 9, -6, 'selfie', 1);
      for (const x of [-9.0, -5.6, 0.3, 5.4, 11.6]) candles(x, -8.95, 2, y + 0.62, 0.06, false);
    }
    // bacia de pétalas no parapeito (missão): as pétalas caem no pátio
    const petals = (() => { const y = L1, x = -7, z = -8.7;
      const g = K.group(x, y + 0.66, z);
      const bowl = K.group(0, 0, 0, 0, g); K.lathe([[0, 0], [0.12, 0], [0.3, 0.1], [0.34, 0.2], [0.32, 0.21], [0, 0.12]], copper, 0, 0, 0, { parent: bowl }, 16);
      const pc = [0xe0305a, 0xf06a8a, 0xb8102a]; const pet = new T.CircleGeometry(0.045, 6).rotateX(-PI / 2).scale(1, 1, 0.6);
      const l = [[], [], []]; for (let k = 0; k < 60; k++) { const a = R() * PI * 2, rr = Math.sqrt(R()) * 0.28; l[k % 3].push([Math.cos(a) * rr, 0.16 + R() * 0.05, Math.sin(a) * rr, R() * 6]); }
      l.forEach((ll, i) => K.inst(pet, K.mat(pc[i], { roughness: 0.7, side: T.DoubleSide }), ll, { parent: bowl, cast: false }));
      // pétalas que vão cair no chão do pátio (escondidas até a missão)
      const fall = K.group(0, 0, 0); const fl = [[], [], []]; for (let k = 0; k < 260; k++) { const a = R() * PI * 2, rr = Math.pow(R(), 0.7) * 1.7; fl[k % 3].push([x + Math.cos(a) * rr * 1.2, 0.02 + R() * 0.004, -7.4 + Math.sin(a) * rr * 0.6, R() * 6]); }
      fl.forEach((ll, i) => K.inst(new T.CircleGeometry(0.06, 6).rotateX(-PI / 2).scale(1, 1, 0.6), K.mat(pc[i], { roughness: 0.7, side: T.DoubleSide, emissive: pc[i], emissiveIntensity: 0.35 }), ll, { parent: fall, cast: false }));
      fall.visible = false;
      return { bowl, fall };
    })();
    K.tell('petalas', (live) => { petals.fall.visible = true; if (live) K.anim(1.6, (e) => { petals.bowl.rotation.x = e * 1.3; petals.fall.position.y = (1 - e) * 3.6; petals.fall.scale.set(0.4 + 0.6 * e, 1, 0.4 + 0.6 * e); petals.fall.position.x = -7 * (1 - (0.4 + 0.6 * e)); petals.fall.position.z = -7.4 * (1 - (0.4 + 0.6 * e)); }); else { petals.bowl.rotation.x = 1.3; petals.fall.position.set(0, 0, 0); petals.fall.scale.set(1, 1, 1); } }, () => { petals.fall.visible = false; petals.bowl.rotation.x = 0; petals.fall.position.set(0, 0, 0); petals.fall.scale.set(1, 1, 1); });

    // ------------------------------------------------------------ paredes laterais baixas do pátio e o portão cravejado
    { const capT = greenTile, wallH = 1.1;
      for (const [x, z0, z1] of [[-14.85, -8.55, 2.95], [-14.85, 5.45, 10.1], [14.85, -3.0, 10.1]]) { K.box(0.3, wallH, z1 - z0, plaster, x, wallH / 2, (z0 + z1) / 2); K.box(0.4, 0.06, z1 - z0, capT, x, wallH + 0.03, (z0 + z1) / 2, { cast: false }); K.add(new T.PlaneGeometry(z1 - z0, 0.5), zelMat(PAL_D, [Math.round((z1 - z0) / 0.5), 1], 71), x + (x < 0 ? 0.152 : -0.152), 0.27, (z0 + z1) / 2, { ry: x < 0 ? PI / 2 : -PI / 2, cast: false }); }
      const mer = []; for (let z = -8.3; z <= 9.9; z += 0.8) { if (z > 2.7 && z < 5.7) continue; mer.push([-14.85, wallH + 0.06, z]); if (z > -2.9) mer.push([14.85, wallH + 0.06, z]); }
      K.inst(new T.BoxGeometry(0.3, 0.14, 0.4).translate(0, 0.07, 0), plaster, mer); K.inst(new T.BoxGeometry(0.3, 0.12, 0.24).translate(0, 0.2, 0), plaster, mer);
      // frente: parapeito baixo com vasos de gerânio
      K.box(29.9, 0.7, 0.3, plaster, 0, 0.35, 10.25); K.box(30.0, 0.06, 0.4, capT, 0, 0.73, 10.25, { cast: false }); K.add(new T.PlaneGeometry(29.9, 0.42), zelMat(PAL_D, [60, 1], 72), 0, 0.3, 10.095, { cast: false });
      const mf = []; for (let x = -14.6; x <= 14.6; x += 0.8) mf.push([x, 0.76, 10.25]); K.inst(new T.BoxGeometry(0.4, 0.12, 0.3).translate(0, 0.06, 0), plaster, mf); K.inst(new T.BoxGeometry(0.22, 0.12, 0.3).translate(0, 0.18, 0), plaster, mf);
      for (let x = -13; x <= 13; x += 3.25) { K.lathe([[0, 0], [0.12, 0], [0.17, 0.22], [0.18, 0.25], [0, 0.25]], M.terracotta, x, 0.0, 9.75, {}, 10); for (let k = 0; k < 5; k++) K.sphere(0.08, k % 2 ? M.leaf : M.leaf2, x + (R() - 0.5) * 0.18, 0.3 + R() * 0.08, 9.75 + (R() - 0.5) * 0.18, { cast: false }, 6, 5); for (let k = 0; k < 4; k++) K.sphere(0.035, K.mat(0xd8203a, { roughness: 0.6 }), x + (R() - 0.5) * 0.22, 0.4, 9.75 + (R() - 0.5) * 0.2, { cast: false }, 5, 4); K.colR(x, 9.75, 0.2); }
      for (let x = -11.4; x <= 12; x += 3.25) candles(x, 9.8, 3, 0, 0.09);
      // fachada do riad descendo até o beco (vista de longe)
      K.box(30.4, 4.2, 0.3, K.mat(0xc9774e, { roughness: 0.95 }), 0, -2.1, 10.3, { cast: false });
    }
    // portão: moldura em ferradura, folhas cravejadas, aldrabas e o beco iluminado atrás
    const gate = (() => { const zc = 4.2, g = K.group(-14.85, 0, zc, PI / 2);
      const sh = new T.Shape(); sh.moveTo(-1.35, 0); sh.lineTo(1.35, 0); sh.lineTo(1.35, 3.25); sh.lineTo(-1.35, 3.25); sh.lineTo(-1.35, 0);
      const hp = new T.Path(); const inf = horseshoe(hp, 0, 0, 0.78, 1.75, 1.12); sh.holes.push(hp);
      const geo = new T.ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: false, curveSegments: 16 }); geo.translate(0, 0, -0.25);
      K.add(geo, plasterLt, 0, 0, 0, { parent: g });
      K.add(new T.TorusGeometry(inf.r + 0.06, 0.05, 6, 28, PI + 2 * inf.phi), brass, 0, inf.yc, 0.27, { parent: g, rz: -inf.phi });
      K.add(new T.PlaneGeometry(2.7, 0.55), zelMat(PAL_F, [5, 1], 81), 0, 2.98, 0.255, { parent: g, cast: false });
      K.add(new T.PlaneGeometry(0.5, 1.0), zelMat(PAL_D, [1, 2], 82), -1.08, 0.52, 0.255, { parent: g, cast: false }); K.add(new T.PlaneGeometry(0.5, 1.0), zelMat(PAL_D, [1, 2], 82), 1.08, 0.52, 0.255, { parent: g, cast: false });
      const tymp = new T.Shape(); tymp.moveTo(-0.78, 1.75); tymp.absarc(0, inf.yc, inf.r, -inf.phi, PI + inf.phi, false); tymp.lineTo(-0.78, 1.75);
      K.add(new T.ShapeGeometry(tymp, 16), doorMat, 0, 0, 0.0, { parent: g });
      const leaves = [-1, 1].map(s => { const hinge = K.group(s * 0.78, 0, 0.0, 0, g); K.box(0.78, 1.74, 0.08, doorMat, -s * 0.39, 0.88, 0, { parent: hinge }); K.torus(0.06, 0.012, brass, -s * 0.62, 1.05, 0.06, { parent: hinge }); K.sphere(0.03, brass, -s * 0.62, 1.12, 0.06, { parent: hinge }, 6, 4); return hinge; });
      // beco atrás do portão
      const glowM = new T.MeshBasicMaterial({ color: new T.Color(0xffa850).multiplyScalar(0.2), toneMapped: false });
      K.add(new T.PlaneGeometry(2.4, 3.0), glowM, 0, 1.5, -1.9, { parent: g, cast: false });
      for (const s of [-1, 1]) K.box(0.2, 2.6, 1.9, K.mat(0xc9774e), s * 1.25, 1.3, -1.1, { parent: g, cast: false });
      K.add(new T.PlaneGeometry(2.4, 2.0).rotateX(-PI / 2), K.mat(0x7a5a40, { roughness: 1 }), 0, 0.005, -1.0, { parent: g, cast: false });
      lantern(0, 2.35, -0.9, 0.55, { parent: g, hang: 0.4, k: 2.2 });
      K.col(-14.5, 2.95, -13.9, 3.35); K.col(-14.5, 5.05, -13.9, 5.45);
      const light = K.plight(-15.7, 2.0, zc, 0xffa850, 0, 6);
      K.halo(-14.2, 3.45, zc, 0.5, 0xffb050, 0.4);
      return { leaves, glowM, light };
    })();
    K.tell('porta', (live) => { const set = (e) => { gate.leaves[0].rotation.y = -e * 1.6; gate.leaves[1].rotation.y = e * 1.6; gate.glowM.color.set(new T.Color(0xffa850).multiplyScalar(0.2 + e * 1.8)); gate.light.intensity = e * 2.0; }; if (live) K.anim(1.6, set); else set(1); }, () => { gate.leaves[0].rotation.y = 0; gate.leaves[1].rotation.y = 0; gate.glowM.color.set(new T.Color(0xffa850).multiplyScalar(0.2)); gate.light.intensity = 0; });
    K.slot(-12.0, 4.6, -14, 4.2, 'talk'); K.slot(-11.6, 3.5, -14, 4.2, 'talk');

    // ------------------------------------------------------------ balcão do chá (esquerda, fundo)
    const tea = (() => { const x = -12.7, z0 = -7.8, z1 = -4.6, zc = (z0 + z1) / 2;
      K.add(K.rbox(0.62, 0.85, z1 - z0, 0.03), cedar, x, 0.425, zc); K.box(0.7, 0.05, z1 - z0 + 0.08, K.mat(0xe8dcc0, { roughness: 0.35 }), x, 0.87, zc);
      K.add(new T.PlaneGeometry(z1 - z0 - 0.1, 0.55), zelMat(PAL_F, [6, 1], 91), x + 0.315, 0.42, zc, { ry: PI / 2, cast: false });
      K.col(x - 0.32, z0, x + 0.32, z1);
      // bandeja grande com copos coloridos, bules, açúcar em pão, menta
      K.cyl(0.34, 0.34, 0.02, trayTop, x, 0.905, -6.9, {}, 24); teaGlasses(x, 0.915, -6.9, 14, 0.26);
      teapot(x - 0.05, 0.915, -6.3, 1.4, silver); teapot(x + 0.05, 0.895, -5.8, 1.2, silver);
      K.cone(0.07, 0.22, K.mat(0xf6f3ec, { roughness: 0.6 }), x - 0.1, 1.0, -7.55, {}, 10);
      for (let k = 0; k < 9; k++) K.sphere(0.05, k % 2 ? M.leaf2 : K.mat(0x4a9a3a), x + (R() - 0.5) * 0.25, 0.92 + R() * 0.05, -5.35 + (R() - 0.5) * 0.25, { cast: false }, 6, 4);
      // samovar de cobre com brasa
      K.lathe([[0, 0], [0.14, 0], [0.1, 0.08], [0.17, 0.2], [0.18, 0.45], [0.1, 0.55], [0.05, 0.65], [0, 0.66]], copper, x - 0.05, 0.895, -7.35, {}, 14); K.cyl(0.012, 0.012, 0.16, brass, x + 0.13, 1.05, -7.35, { rz: PI / 2 }, 5);
      K.halo(x - 0.05, 0.95, -7.35, 0.18, 0xff5010, 0.8); steam(x - 0.05, 1.6, -7.35, 3, 0xffffff, 0.22, 0.2, 0.8);
      // estante na parede com copos e bules
      K.box(0.32, 2.1, 3.2, cedarDk, -14.35, 1.05, zc); for (const yy of [0.9, 1.35, 1.8]) { K.box(0.36, 0.04, 3.1, cedar, -14.3, yy, zc, { cast: false }); for (let k = 0; k < 10; k++) glassLists[k % glassCols.length].push([-14.27, yy + 0.02, z0 + 0.2 + k * 0.3]); }
      for (let k = 0; k < 4; k++) teapot(-14.28, 2.12, z0 + 0.4 + k * 0.8, 1.1, k % 2 ? brass : silver);
      for (let k = 0; k < 4; k++) { const pz = z0 + 0.3 + k * 0.85; K.cyl(0.004, 0.004, 0.3, iron, -14.2, 2.35, pz, { cast: false }, 3); K.add(new T.CylinderGeometry(0.12, 0.09, 0.14, 12, 1, true), copper, -14.2, 2.13, pz, { cast: false }); }
      K.sign('أتاي  ·  CHÁ DE MENTA', 2.4, 0.4, -14.5, 2.55, zc, { ry: PI / 2, neon: true, color: '#9be0a0', size: 54, k: 1.6 });
      K.plight(-12.0, 2.3, -6.2, 0xffb070, 1.5, 7);
      // o bule cerimonial (missão)
      const big = teapot(x, 0.895, -4.95, 2.6, silver, K.root, 0.4); const bigSteam = steam(x + 0.05, 1.55, -4.95, 3, 0xffffff, 0.24, 0.22, 0.6);
      const halo = K.halo(x, 1.2, -4.95, 0.8, 0x3a8aff, 0); halo.visible = false;
      [-7.2, -6.3, -5.4].forEach(z => K.slot(-11.75, z, -12.7, z, 'bar'));
      return { big, halo };
    })();
    const blueEnamel = K.mat(0x1a5ad8, { roughness: 0.2, metalness: 0.3, emissive: 0x1040a0, emissiveIntensity: 0.6 });
    K.tell('bule', (live) => { tea.big.traverse(m => { if (m.isMesh) m.material = blueEnamel; }); tea.halo.visible = true; tea.halo.material.color.set(new T.Color(0x3a8aff).multiplyScalar(1.3)); if (live) K.anim(1.0, e => { tea.big.position.y = 0.895 + Math.sin(e * PI) * 0.35; tea.big.rotation.y = 0.4 + e * PI * 2; }); }, () => { tea.big.traverse(m => { if (m.isMesh) m.material = silver; }); tea.halo.visible = false; tea.big.position.y = 0.895; tea.big.rotation.y = 0.4; });

    // ------------------------------------------------------------ salão à esquerda: tapetes sobrepostos, sedari, pufes, mesa de cartas
    { rug(-11.2, -1.0, 4.4, 3.4, 'kilim', { ry: 0.05 }); rug(-11.6, -0.6, 3.0, 2.2, 'azilal', { ry: -0.12 }); rug(-8.8, 0.9, 2.4, 1.8, 'beni', { ry: 0.2 });
      // sedari (banco baixo encostado na parede) com almofadas listradas
      const stripe = K.canvasTex(128, 64, (g, w, h) => { for (let k = 0; k < 16; k++) { g.fillStyle = ['#8a1a2a', '#d9a441', '#1f3a5a', '#f2e6c8'][k % 4]; g.fillRect(0, k * 4, w, 4); } }, [1, 1]);
      const stM = K.texMat(stripe, { roughness: 0.9 });
      K.add(K.rbox(0.8, 0.42, 4.8, 0.05), stM, -14.05, 0.21, -1.0); K.add(K.rbox(0.25, 0.55, 4.8, 0.08), fabric(0x8a1a2a), -14.42, 0.68, -1.0);
      for (let k = 0; k < 6; k++) cushion(-14.25, 0.62, -3.0 + k * 0.8, 0.14, 0.5, 0.42, pk([0xd9a441, 0x1f3a5a, 0xf2e6c8, 0x2c6e49, 0xc8322f]), { ry: PI / 2, rx: 0 }).rotation.set(0, PI / 2, -0.2);
      K.col(-14.5, -3.4, -13.65, 1.4);
      [-2.8, -1.6, -0.4, 0.8].forEach(z => K.slot(-13.85, z, -10, z, 'sit'));
      // mesa octogonal com chá + pufes de couro
      lowTable(-11.6, -1.0, 0.5, 0.4); teapot(-11.55, 0.4, -1.05, 1.2, silver); teaGlasses(-11.6, 0.405, -0.95, 5, 0.3); K.add(new T.CylinderGeometry(0.12, 0.08, 0.06, 10), K.mat(0xe8dcc0), -11.8, 0.43, -0.8, { cast: false });
      for (let k = 0; k < 6; k++) K.sphere(0.03, K.mat(pk([0x6a3a1a, 0xd9a441, 0x8a4a22])), -11.8 + (R() - 0.5) * 0.08, 0.47, -0.8 + (R() - 0.5) * 0.08, { cast: false }, 5, 4);
      for (const [px, pz] of [[-11.6, -2.2], [-10.4, -1.2], [-11.4, 0.2], [-12.7, -1.9]]) { pouf(px, pz); K.slot(px, pz, -11.6, -1.0, 'bean'); }
      // mesa de cartas (ronda) com banquinhos
      const cx = -8.8, cz = 0.9; K.cyl(0.45, 0.45, 0.04, K.mat(0x1d4a3a, { roughness: 0.9 }), cx, 0.66, cz, {}, 20); K.cyl(0.47, 0.47, 0.03, brass, cx, 0.64, cz, {}, 20); K.cyl(0.06, 0.18, 0.64, cedar, cx, 0.32, cz, {}, 8); K.colR(cx, cz, 0.38);
      for (let k = 0; k < 7; k++) K.box(0.06, 0.004, 0.09, M.white, cx + Math.cos(k * 1.3) * 0.22, 0.685, cz + Math.sin(k * 1.9) * 0.2, { ry: k, cast: false });
      for (let k = 0; k < 4; k++) { const a = k * PI / 2 + 0.3, sx = cx + Math.cos(a) * 0.85, sz = cz + Math.sin(a) * 0.85; K.cyl(0.18, 0.15, 0.44, cedar, sx, 0.22, sz, {}, 8); K.cyl(0.2, 0.2, 0.04, K.mat(0x8a1a2a, { roughness: 0.9 }), sx, 0.45, sz, {}, 10); K.slot(sx, sz, cx, cz, 'cards'); }
      // lanterna de chão grande com padrão de luz
      lantern(-9.6, 0.0, -2.9, 1.6, { k: 2.3, hk: 0.7 }); projPool(-9.6, -2.9, 2.2, 0xffa850, 0.55); K.colR(-9.6, -2.9, 0.3);
      candles(-12.9, 0.9, 3, 0, 0.1); candles(-10.2, 1.6, 2, 0, 0.1);
      K.plight(-11.0, 2.2, -0.6, 0xffb070, 1.3, 7);
      K.plant(-13.9, -3.9, 'palm', { s: 1.1, pot: K.mat(0x1f6a4a, { roughness: 0.35 }) }); K.plant(-13.9, 1.9, 'fern', { pot: K.mat(0x1f4f8a, { roughness: 0.35 }) });
      [[-9.0, -1.4], [-7.9, -0.6], [-7.6, 2.6]].forEach(([x, z]) => K.slot(x, z, x + 0.6, z + 0.4, 'talk'));
    }

    // ------------------------------------------------------------ músicos gnawa (esquerda, frente)
    { rug(-12.0, 7.7, 4.6, 3.6, 'kilim', { ry: PI / 2 + 0.05 });
      K.add(K.rbox(0.7, 0.42, 3.2, 0.05), fabric(0x1f3a5a), -14.0, 0.21, 7.8); K.add(K.rbox(0.22, 0.5, 3.2, 0.06), fabric(0xd9a441), -14.4, 0.6, 7.8);
      K.col(-14.5, 6.2, -13.65, 9.4);
      [6.8, 7.8, 8.8].forEach(z => K.slot(-13.9, z, -10, z, 'sit'));
      // guembri (alaúde-baixo) encostado, tambor tbal, qraqeb de ferro, gorros com búzios no gancho
      const gb = K.group(-13.4, 0, 9.5, -0.3); K.add(K.rbox(0.22, 0.6, 0.16, 0.05), K.mat(0x6a3a1a, { roughness: 0.5 }), 0, 0.4, 0, { parent: gb, rz: 0.25 }); K.cyl(0.02, 0.02, 0.8, cedarDk, -0.2, 1.0, 0, { parent: gb, rz: 0.25 }, 5); K.box(0.18, 0.01, 0.005, K.mat(0xe8dcc0), 0, 0.5, 0.085, { parent: gb, rz: 0.25 });
      const dr = K.group(-12.6, 0, 9.3, 0.4); K.cyl(0.26, 0.26, 0.5, K.mat(0x8a3a1a, { roughness: 0.6 }), 0, 0.25, 0, { parent: dr }, 16); K.cyl(0.265, 0.265, 0.01, K.mat(0xe8d8b0, { roughness: 0.8 }), 0, 0.505, 0, { parent: dr }, 16); for (let k = 0; k < 10; k++) K.box(0.01, 0.5, 0.01, K.mat(0xe8dcc0), Math.cos(k * 0.628) * 0.268, 0.25, Math.sin(k * 0.628) * 0.268, { parent: dr, cast: false });
      for (let k = 0; k < 3; k++) { const q = K.group(-13.9, 0.44, 6.6 + k * 0.5, k); for (const s of [-1, 1]) K.add(new T.SphereGeometry(0.06, 8, 6).scale(1.6, 0.35, 1), iron, s * 0.06, 0.02, 0, { parent: q, cast: false }); }
      for (let k = 0; k < 2; k++) { const c = K.group(-13.0 - k * 0.5, 0.0, 9.65, 0); K.sphere(0.12, K.mat(0xc8322f), 0, 0.08, 0, { parent: c, cast: false }, 10, 6); for (let q = 0; q < 6; q++) K.sphere(0.018, M.white, Math.cos(q) * 0.11, 0.1, Math.sin(q) * 0.11, { parent: c, cast: false }, 5, 4); }
      lantern(-11.2, 0.0, 9.3, 1.3, { k: 2.2 }); projPool(-11.2, 9.0, 1.6, 0xffa850, 0.5); K.colR(-11.2, 9.3, 0.25);
      candles(-10.4, 6.0, 3, 0, 0.1);
      K.plight(-11.6, 2.3, 7.8, 0xffa860, 1.3, 7);
      [[-10.4, 6.8], [-10.0, 7.9], [-10.3, 9.0]].forEach(([x, z]) => K.slot(x, z, -13, 7.8, 'view'));
    }

    // ------------------------------------------------------------ pista de dança na frente (tapete grande + lanternas de pé)
    { rug(1.0, 7.4, 6.6, 3.2, 'boucherouite'); rug(1.0, 7.4, 3.2, 2.2, 'beni', { ry: 0.08 });
      for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const x = -1.4 + i * 1.2, z = 6.3 + j * 1.05; if (Math.hypot(x - 1.0, z - 7.3) < 0.9) continue; K.slot(x, z, 1.0, 7.4, 'dance'); }
      for (const [x, z] of [[-2.8, 6.0], [4.8, 6.0], [-2.8, 9.2], [4.8, 9.2]]) { lantern(x, 0, z, 1.25, { k: 2.3, hk: 0.6 }); projPool(x, z, 1.8, 0xffa850, 0.5); K.colR(x, z, 0.22); }
      K.plight(1.0, 3.0, 6.8, 0xffb878, 1.5, 9);
      [[-3.6, 7.6], [5.6, 7.6], [1.0, 5.3]].forEach(([x, z]) => K.slot(x, z, 1.0, 7.4, 'view'));
    }

    // ------------------------------------------------------------ jantar à direita: mesas baixas, tajines fumegantes, pufes
    let tajMission = null;
    { rug(9.3, -4.0, 5.0, 5.4, 'kilim', { ry: 0.04 }); rug(8.6, -5.7, 2.6, 2.0, 'azilal', { ry: 0.3 }); rug(9.8, -2.0, 2.6, 2.0, 'beni', { ry: -0.2 });
      lowTable(8.6, -5.8, 0.55, 0.42); tajMission = tajine(8.6, 0.425, -5.8, 2.1, 0x2a6a9a);
      teaGlasses(8.6, 0.425, -5.8, 4, 0.45); K.cyl(0.08, 0.08, 0.02, K.mat(0xe8dcc0), 8.25, 0.44, -5.55, { cast: false }, 10);
      for (const [px, pz] of [[7.45, -5.9], [9.75, -5.9], [8.6, -6.95]]) { pouf(px, pz); K.slot(px, pz, 8.6, -5.8, 'bean'); }
      lowTable(9.8, -2.0, 0.55, 0.42); tajine(9.65, 0.425, -2.1, 1.7, 0xb5603a); tajine(10.0, 0.425, -1.8, 1.3, 0x1d6a4a);
      for (let k = 0; k < 5; k++) K.cyl(0.07, 0.07, 0.015, K.mat(0xd9b070, { roughness: 0.8 }), 9.8 + Math.cos(k * 1.25) * 0.4, 0.43, -2.0 + Math.sin(k * 1.25) * 0.4, { cast: false }, 10);
      for (const [px, pz] of [[8.6, -2.0], [11.0, -2.0], [9.8, -0.8], [9.8, -3.2]]) { pouf(px, pz); K.slot(px, pz, 9.8, -2.0, 'bean'); }
      K.plight(9.2, 2.4, -4.0, 0xffb070, 1.5, 8);
      lantern(11.6, 0.0, -4.6, 1.4, { k: 2.3, hk: 0.6 }); projPool(11.6, -4.6, 1.9, 0xffa850, 0.5); K.colR(11.6, -4.6, 0.25);
      candles(7.0, -3.6, 3, 0, 0.1); candles(11.4, -0.4, 2, 0, 0.1);
      // o mapa escondido (aparece quando a tampa sai)
      const map = K.add(new T.PlaneGeometry(0.34, 0.24).rotateX(-PI / 2), K.mat(0xe6d3a3, { roughness: 0.9, side: T.DoubleSide, emissive: 0x403020, emissiveIntensity: 0.3 }), 8.6, 0.56, -5.8, { cast: false, ry: 0.5 }); map.visible = false;
      const lidHalo = K.halo(8.6, 0.9, -5.8, 0.75, 0xfff0d0, 0); lidHalo.visible = false;
      K.tell('mapa', (live) => {
        const t = tajMission; t.st.forEach(e => e.off = true); map.visible = true; lidHalo.visible = true; lidHalo.material.color.set(new T.Color(0xfff0d0).multiplyScalar(0.9));
        const set = (e) => { t.lid.position.set(e * 0.55, 0.105 + Math.sin(e * PI) * 0.5, e * 0.25); t.lid.rotation.z = -e * 1.2; };
        if (live) K.anim(1.2, set); else set(1);
      }, () => { const t = tajMission; t.st.forEach(e => e.off = false); map.visible = false; lidHalo.visible = false; t.lid.position.set(0, 0.105, 0); t.lid.rotation.z = 0; });
    }

    // ------------------------------------------------------------ varal de tapetes na parede direita (missão)
    const rack = (() => { const x = 13.95;
      for (const z of [-0.95, 3.15]) { K.cyl(0.05, 0.06, 2.55, cedarDk, x, 1.27, z, {}, 6); K.sphere(0.07, brass, x, 2.6, z, {}, 8, 6); }
      K.cyl(0.035, 0.035, 4.2, cedar, x, 2.45, 1.1, { rx: PI / 2 }, 6);
      const mk = (style, seed) => K.texMat(K.canvasTex(256, 410, rugDraw(style, seed)), { roughness: 0.95, side: T.DoubleSide });
      const rugs = [['azilal', 901, -0.3], ['kilim', 902, 1.1], ['beni', 903, 2.5]].map(([st, sd, z]) => { const g = K.group(x - 0.05, 2.42, z); const p = K.add(new T.PlaneGeometry(1.25, 2.0), mk(st, sd), 0, -1.0, 0, { parent: g, ry: -PI / 2 }); return { g, p, m: p.material }; });
      for (let k = 0; k < 4; k++) K.add(K.rbox(1.0, 0.09, 0.7, 0.03), fabric(pk([0x9a2a22, 0xece3cf, 0x2a4a8a, 0xd86a2a])), 14.15, 0.05 + k * 0.09, 3.3, { ry: k * 0.1 + PI / 2 });
      const markTex = K.canvasTex(256, 410, (g, w, h) => {
        g.fillStyle = '#1a2a7a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c230'; g.lineWidth = 14; g.strokeRect(12, 12, w - 24, h - 24);
        g.fillStyle = '#f6f3ec'; g.beginPath(); g.ellipse(w / 2, h * 0.58, 70, 85, 0, 0, 7); g.fill();
        for (let k = 0; k < 5; k++) { const fx = w / 2 - 64 + k * 32, len = k === 0 || k === 4 ? 70 : 100; g.beginPath(); g.ellipse(fx, h * 0.42 - len / 2 + 10, 14, len / 2, 0, 0, 7); g.fill(); }
        g.fillStyle = '#1a2a7a'; g.beginPath(); g.ellipse(w / 2, h * 0.6, 34, 18, 0, 0, 7); g.fill(); g.fillStyle = '#2aa0e0'; g.beginPath(); g.arc(w / 2, h * 0.6, 11, 0, 7); g.fill();
        fringe(g, w, h);
      });
      const markM = K.texMat(markTex, { roughness: 0.9, side: T.DoubleSide, emissive: 0x2030a0, emissiveIntensity: 0.35 });
      K.col(13.4, -1.0, 14.5, 3.2);
      K.slot(12.2, -0.4, 14, -0.4, 'view'); K.slot(12.3, 2.6, 14, 2.6, 'view');
      return { r: rugs[1], markM };
    })();
    K.tick((dt, t) => { rack.r.g.rotation.x = Math.sin(t * 0.8) * 0.02; });
    K.tell('tapete', (live) => { rack.r.p.material = rack.markM; if (live) K.anim(1.2, e => { rack.r.g.rotation.y = e * PI * 2; }); else rack.r.g.rotation.y = 0; }, () => { rack.r.p.material = rack.r.m; rack.r.g.rotation.y = 0; });

    // ------------------------------------------------------------ mesa de xadrez (direita)
    { const cx = 9.4, cz = 4.6;
      const bt = K.canvasTex(256, 256, (g, w, h) => { const s = w / 8; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#3a2214' : '#e8d4b0'; g.fillRect(i * s, j * s, s, s); } g.strokeStyle = '#c89a3a'; g.lineWidth = 8; g.strokeRect(0, 0, w, h); });
      K.box(0.7, 0.05, 0.7, cedarDk, cx, 0.68, cz); K.add(new T.PlaneGeometry(0.6, 0.6).rotateX(-PI / 2), K.texMat(bt, { roughness: 0.4 }), cx, 0.706, cz, { cast: false });
      K.add(new T.CylinderGeometry(0.22, 0.3, 0.66, 8, 1, true), cedar, cx, 0.33, cz); K.colR(cx, cz, 0.36);
      const pw = [], pb = []; for (let i = 0; i < 8; i++) for (const j of [0, 1, 6, 7]) if (R() < 0.75) (j < 2 ? pw : pb).push([cx - 0.2625 + i * 0.075, 0.705, cz - 0.2625 + j * 0.075, 0, j === 0 || j === 7 ? 1.4 : 1]);
      const pg = new T.LatheGeometry([[0, 0], [0.022, 0], [0.018, 0.012], [0.009, 0.03], [0.014, 0.045], [0, 0.055]].map(p => new T.Vector2(p[0], p[1])), 8);
      K.inst(pg, K.mat(0xf2ead8, { roughness: 0.4 }), pw, { cast: false }); K.inst(pg, K.mat(0x1a1410, { roughness: 0.3 }), pb, { cast: false });
      for (const s of [-1, 1]) { K.cyl(0.2, 0.17, 0.44, cedar, cx + s * 0.8, 0.22, cz, {}, 8); K.cyl(0.22, 0.22, 0.04, K.mat(0x1f3a5a, { roughness: 0.9 }), cx + s * 0.8, 0.45, cz, {}, 10); K.slot(cx + s * 0.8, cz, cx, cz, 'chess'); }
      teapot(cx + 0.25, 0.705, cz + 0.28, 0.9, brass); candles(cx - 0.2, cz + 0.6, 1, 0, 0, false);
      K.slot(cx, cz + 1.0, cx, cz, 'talk'); K.slot(cx + 0.2, cz - 1.0, cx, cz, 'talk');
    }

    // ------------------------------------------------------------ banca de especiarias (direita, frente) com a pirâmide de páprica
    const spice = (() => { const x0 = 13.3, z0 = 5.9, z1 = 9.6, zc = (z0 + z1) / 2;
      K.add(K.rbox(1.15, 0.8, z1 - z0, 0.03), cedar, 13.9, 0.4, zc); K.box(1.2, 0.04, z1 - z0 + 0.05, cedarDk, 13.9, 0.82, zc);
      K.add(new T.PlaneGeometry(z1 - z0 - 0.1, 0.5), zelMat(PAL_W, [7, 1], 101), x0 - 0.03, 0.4, zc, { ry: -PI / 2, cast: false });
      const SP = [[0xc8281a, 'páprica'], [0xf2b81a, 'cúrcuma'], [0x7a4a22, 'cominho'], [0xe0701a, 'ras el hanout'], [0x4a7a2a, 'hena'], [0x2a1a14, 'pimenta'], [0xd8a050, 'gengibre'], [0xa8203a, 'rosas secas']];
      let k = 0, pap = null;
      for (const xx of [13.6, 14.15]) for (let zz = 6.2; zz < 9.4; zz += 0.6) {
        const [c] = SP[k % SP.length]; k++;
        const big = xx === 13.6 && Math.abs(zz - 8.6) < 0.1, r = big ? 0.22 : 0.15, h = big ? 0.5 : 0.22 + R() * 0.12;
        K.cyl(r + 0.03, r, 0.08, K.mat(pk([0xb5603a, 0x1d6a4a, 0x1f4f8a]), { roughness: 0.35 }), xx, 0.88, zz, {}, 14);
        const cone = K.cone(r, h, K.mat(c, { roughness: 0.95 }), xx, 0.92 + h / 2, zz, {}, 16);
        if (big) { cone.material = K.mat(0xd02818, { roughness: 0.9, emissive: 0x501008, emissiveIntensity: 0.4 }); pap = { cone, h, x: xx, z: zz }; }
      }
      // cestos no chão com especiarias e pétalas secas
      for (let q = 0; q < 4; q++) { const z = 6.2 + q * 0.75; K.lathe([[0, 0], [0.16, 0], [0.22, 0.28], [0.23, 0.3], [0, 0.3]], K.mat(0xb8904a, { roughness: 0.95 }), 13.05, 0, z, {}, 12); K.cyl(0.21, 0.21, 0.02, K.mat(SP[(q + 3) % SP.length][0], { roughness: 0.95 }), 13.05, 0.29, z, { cast: false }, 12); K.cone(0.12, 0.12, K.mat(SP[(q + 3) % SP.length][0], { roughness: 0.95 }), 13.05, 0.35, z, { cast: false }, 10); }
      K.col(12.8, z0, 14.5, z1);
      // toldo listrado e ervas penduradas
      for (const z of [z0 + 0.05, z1 - 0.05]) K.cyl(0.04, 0.05, 2.4, cedarDk, 12.95, 1.2, z, {}, 6);
      const aw = K.canvasTex(256, 64, (g, w, h) => { for (let q = 0; q < 10; q++) { g.fillStyle = q % 2 ? '#f2e6c8' : '#1d6a4a'; g.fillRect(q * w / 10, 0, w / 10, h); } g.fillStyle = '#c8902a'; for (let q = 0; q < 20; q++) { g.beginPath(); g.arc(q * w / 20 + 6, h, 6, PI, 0); g.fill(); } });
      K.add(new T.PlaneGeometry(z1 - z0 + 0.3, 1.8), K.texMat(aw, { side: T.DoubleSide }), 13.85, 2.5, zc, { cast: true }).rotation.set(-PI / 2, 0.2, PI / 2, 'YXZ');
      for (let q = 0; q < 7; q++) { const z = z0 + 0.3 + q * 0.5; K.cyl(0.003, 0.003, 0.25, K.mat(0x8a7a5a), 13.0, 2.15, z, { cast: false }, 3); K.add(new T.ConeGeometry(0.07, 0.3, 6), K.mat(pk([0x5a7a3a, 0x8a6a3a, 0xa8203a, 0x4a6a2a]), { roughness: 1 }), 13.0, 1.9, z, { cast: false, rx: PI }); }
      // balança de latão
      { const g = K.group(14.1, 0.84, 9.35); K.cyl(0.012, 0.015, 0.4, brass, 0, 0.2, 0, { parent: g }, 6); K.box(0.42, 0.012, 0.012, brass, 0, 0.4, 0, { parent: g }); for (const s of [-1, 1]) K.cyl(0.08, 0.06, 0.02, brass, s * 0.2, 0.26, 0, { parent: g, cast: false }, 12); }
      K.sign('ÉPICES  ·  توابل', 2.6, 0.45, 14.62, 2.0, zc, { ry: -PI / 2, neon: true, color: '#ffcf86', size: 64, k: 1.7 });
      K.plight(11.8, 2.4, 7.2, 0xffb070, 1.4, 8);
      lantern(11.4, 0, 9.4, 1.0, { k: 2.2 }); K.colR(11.4, 9.4, 0.2); candles(10.6, 9.5, 2, 0, 0.1);
      K.slot(11.0, 8.4, 9, 6, 'selfie'); K.slot(11.2, 7.4, 13.5, 7.4, 'view');
      const dust = K.halo(pap.x, 1.1, pap.z, 0.7, 0xff3010, 0); dust.visible = false;
      const red = K.pool(pap.x - 0.6, pap.z, 1.6, 0xff2010, 0); red.visible = false;
      return { pap, dust, red };
    })();
    K.tell('paprica', (live) => { const p = spice.pap; spice.dust.visible = true; spice.red.visible = true; spice.red.material.color.set(new T.Color(0xff2010).multiplyScalar(0.9));
      const set = (e) => { p.cone.scale.set(1 + e * 0.9, 1 - e * 0.75, 1 + e * 0.9); p.cone.position.y = 0.92 + p.h * (1 - e * 0.75) / 2; spice.dust.material.color.set(new T.Color(0xff3010).multiplyScalar(0.9 * (live ? Math.sin(e * PI) + 0.6 : 0.6))); spice.dust.scale.setScalar(1.4 + e * 1.2); };
      if (live) K.anim(1.2, set); else set(1); },
    () => { const p = spice.pap; p.cone.scale.set(1, 1, 1); p.cone.position.y = 0.92 + p.h / 2; spice.dust.visible = false; spice.red.visible = false; });

    // ------------------------------------------------------------ cantinho da hena (esquerda) e braseiro de espetinhos (direita)
    { const cx = -8.2, cz = 4.7; rug(cx, cz, 2.2, 1.7, 'azilal', { ry: 0.15 });
      for (const [px, pz] of [[-8.9, 4.4], [-7.5, 4.9]]) { pouf(px, pz, { r: 0.25, h: 0.44, m: leathers[px < -8 ? 1 : 2] }); K.slot(px, pz, cx, cz + 0.6, 'sit'); }
      const tg = K.group(cx, 0, cz + 0.55); K.cyl(0.3, 0.3, 0.02, trayTop, 0, 0.32, 0, { parent: tg }, 20); K.cyl(0.2, 0.24, 0.3, cedar, 0, 0.15, 0, { parent: tg }, 8);
      for (let k = 0; k < 5; k++) K.cone(0.018, 0.13, K.mat(0x5a3a1a, { roughness: 0.6 }), Math.cos(k * 1.2) * 0.15, 0.4, Math.sin(k * 1.2) * 0.15, { parent: tg, cast: false, rz: PI / 2 - 0.1, ry: k }, 6);
      for (let k = 0; k < 3; k++) K.cyl(0.05, 0.04, 0.04, K.mat([0x4a7a2a, 0x8a3a1a, 0xf2ead8][k], { roughness: 0.6 }), -0.12 + k * 0.12, 0.35, -0.1, { parent: tg, cast: false }, 10);
      K.colR(cx, cz + 0.55, 0.28);
      lantern(cx - 1.0, 0, cz + 1.0, 0.9, { k: 2.2 }); projPool(cx - 1.0, cz + 1.0, 1.4, 0xffa850, 0.45);
      K.sign('حناء', 0.8, 0.3, cx, 0.62, cz + 0.86, { neon: false, color: '#5a3a1a', bg: '#f2ead8', size: 70 });
    }
    { const bx = 10.2, bz = 1.4, g = K.group(bx, 0, bz);
      for (const s of [-1, 1]) for (const t of [-1, 1]) K.cyl(0.02, 0.02, 0.6, iron, s * 0.3, 0.3, t * 0.15, { parent: g }, 5);
      K.box(0.75, 0.16, 0.4, iron, 0, 0.66, 0, { parent: g }); K.box(0.66, 0.02, 0.32, K.glow(0xff4a10, 1.6), 0, 0.745, 0, { parent: g, cast: false });
      for (let k = 0; k < 7; k++) { K.cyl(0.004, 0.004, 0.55, K.silver, -0.27 + k * 0.09, 0.78, 0, { parent: g, rx: PI / 2, cast: false }, 3); for (let q = 0; q < 4; q++) K.box(0.035, 0.035, 0.035, K.mat(q % 2 ? 0x6a2a12 : 0x8a4a22, { roughness: 0.7 }), -0.27 + k * 0.09, 0.78, -0.12 + q * 0.08, { parent: g, cast: false }); }
      K.halo(bx, 0.85, bz, 0.5, 0xff5010, 0.6); K.pool(bx, bz, 1.4, 0xff6020, 0.4); steam(bx, 1.0, bz, 4, 0xb8b0a8, 0.3, 0.3, 1.6);
      K.colR(bx, bz, 0.42); K.slot(bx - 0.9, bz + 0.3, bx, bz, 'bar'); K.slot(bx, bz + 0.85, bx, bz, 'bar');
    }

    // ------------------------------------------------------------ conversa geral pelo pátio
    [[-2.2, -5.6], [2.2, -5.6], [-7.2, -5.2], [6.8, -2.6], [-6.8, 2.2], [6.8, 2.0], [-2.6, -1.0], [3.0, 5.4], [-7.0, 6.4], [7.6, 7.6], [-4.6, 6.6], [6.4, -7.4]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5) * 2, z + (R() - 0.5) * 2, 'talk'));
    for (const [x, z] of [[-6.8, -6.6], [6.8, -6.6], [-6.6, 8.6], [7.4, 8.8], [6.6, -0.6], [-6.6, -0.4]]) candles(x, z, 3, 0, 0.1);

    // ------------------------------------------------------------ instâncias acumuladas (velas e copos)
    K.inst(new T.CylinderGeometry(0.035, 0.035, 0.2, 8).translate(0, 0.1, 0), M.candle, candleList, { cast: false });
    glassLists.forEach((l, i) => { if (l.length) K.inst(new T.CylinderGeometry(0.028, 0.022, 0.08, 8).translate(0, 0.04, 0), K.mat(glassCols[i], { transparent: true, opacity: 0.85, roughness: 0.12, emissive: glassCols[i], emissiveIntensity: 0.35 }), l, { cast: false }); });
    K.tick((dt, t) => { for (const e of steamList) { const u = (t * 0.35 + e.ph) % 1; e.s.position.set(e.x + Math.sin(u * 6 + e.ph * 9) * 0.05, e.y + u * e.rise, e.z); e.s.scale.setScalar(e.sc * (1 + u * 2)); e.s.material.opacity = e.off ? 0 : e.op * Math.sin(u * PI); } });

    // ------------------------------------------------------------ vizinhança: terraços baixos nas laterais, telhados da medina na frente
    const roofM = K.mat(0x5e3c2c, { roughness: 1, envMapIntensity: 0 }), roofM2 = K.mat(0x4e3226, { roughness: 1, envMapIntensity: 0 });
    const dishes = [], tanks = [], rims = [], pots = [], bushes = [], clothes = [];
    const block = (x0, x1, z0, z1, top, o = {}) => {
      const w = x1 - x0, d = z1 - z0, h = top + 4.2, m = o.m || pk(medMats);
      K.add(new T.BoxGeometry(w, h, d), [m, m, R() < 0.5 ? roofM : roofM2, roofM, m, m], (x0 + x1) / 2, top - h / 2, (z0 + z1) / 2, { cast: false });
      if (o.rim !== false && top + 0.35 < (o.max ?? 99)) for (const [cx, cz, ww, dd] of [[(x0 + x1) / 2, z0 + 0.08, w, 0.16], [(x0 + x1) / 2, z1 - 0.08, w, 0.16], [x0 + 0.08, (z0 + z1) / 2, 0.16, d], [x1 - 0.08, (z0 + z1) / 2, 0.16, d]]) rims.push([cx, top + 0.16, cz, 0, [ww, 0.32, dd]]);
      if (o.props === false) return;
      if (R() < 0.6) dishes.push([x0 + 0.6 + R() * (w - 1.2), top + 0.35, z0 + 0.6 + R() * (d - 1.2), R() * 6, 0.8 + R() * 0.4]);
      if (R() < 0.5) tanks.push([x0 + 0.7 + R() * (w - 1.4), top + 0.4, z0 + 0.7 + R() * (d - 1.4), 0, 1]);
      if (R() < 0.6) { const px = x0 + 0.5 + R() * (w - 1), pz = z0 + 0.5 + R() * (d - 1); pots.push([px, top, pz]); bushes.push([px, top + 0.45, pz, R() * 6, 0.8 + R() * 0.5]); }
      if (o.laundry && w > 2.5 && d > 2.5) { // varal com roupas
        const ax = x0 + 0.5, bx = x1 - 0.5, zz = z0 + 0.5 + R() * (d - 1), yy = top + 1.1; K.cyl(0.02, 0.02, 1.1, iron, ax, top + 0.55, zz, { cast: false }, 4); K.cyl(0.02, 0.02, 1.1, iron, bx, top + 0.55, zz, { cast: false }, 4);
        const pts = [new T.Vector3(ax, yy, zz), new T.Vector3((ax + bx) / 2, yy - 0.12, zz), new T.Vector3(bx, yy, zz)]; K.root.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x2a2a2a })));
        for (let q = 0; q < 4; q++) { const u = (q + 0.5) / 4, cl = K.add(new T.PlaneGeometry(0.4, 0.55), K.mat(pk([0xf2e6c8, 0xc8322f, 0x2a5aa8, 0xe0a020, 0x1aa0a0, 0xb0207a]), { side: T.DoubleSide, roughness: 1 }), ax + (bx - ax) * u, yy - 0.35 - Math.sin(u * PI) * 0.1, zz, { cast: false }); clothes.push(cl); }
      }
      if (o.kiosk) { const kx = x0 + 1.0, kz = z0 + 1.0; K.box(1.4, 2.0, 1.4, m, kx, top + 1.0, kz, { cast: false }); K.box(0.7, 1.4, 0.05, doorMat, kx, top + 0.7, kz + 0.72, { cast: false }); }
    };
    // laterais (até 8 m da borda, tudo abaixo de ~3.5 m)
    block(-21.5, -15.1, -13.0, -4.6, 3.0, { max: 3.5, laundry: true }); block(-21.5, -15.1, -4.2, 2.8, 2.2, { max: 3.5, laundry: true }); block(-21.5, -17.0, 2.8, 5.8, 1.4, { max: 3.5, laundry: true }); block(-21.5, -15.1, 6.2, 12.0, 2.7, { max: 3.5, laundry: true });
    block(-26.5, -21.9, -13.0, -1.0, 0.9, { kiosk: true }); block(-26.5, -21.9, -0.6, 12.0, 0.4, { kiosk: true });
    block(15.1, 21.5, -13.0, -3.2, 3.2, { max: 3.5, laundry: true }); block(15.1, 21.5, -2.8, 4.2, 2.0, { max: 3.5, laundry: true }); block(15.1, 21.5, 4.6, 12.0, 2.6, { max: 3.5, laundry: true });
    block(21.9, 26.5, -13.0, 2.0, 0.6, { kiosk: true }); block(21.9, 26.5, 2.4, 12.0, 1.2, { kiosk: true });
    K.box(4.0, 0.04, 1.8, K.mat(0x7a5a40, { roughness: 1 }), -19.3, 1.42, 4.3, { cast: false });
    // casas altas a partir de 11 m da borda
    for (const sx of [-1, 1]) for (let z = -16; z < 16; z += 5 + R() * 2) { const x0 = sx < 0 ? -38 + R() * 2 : 27 + R() * 1.5, x1 = sx < 0 ? -27 - R() * 1.5 : 37 + R() * 2; block(Math.min(x0, x1), Math.max(x0, x1), z, z + 4.6 + R() * 1.5, 5 + R() * 6, { rim: true }); }
    // frente: telhados baixos da medina até o minarete
    for (let z = 11.0; z < 46; z += 4.5 + R() * 2.5) for (let x = -46; x < 46; x += 5 + R() * 3) { if (Math.abs(x + 3) < 7 && z > 42) continue; const far = z > 34, top = far ? -1 + R() * 4 : -3.4 + R() * 3.6; block(x, x + 4 + R() * 2.5, z, z + 3.6 + R() * 2, Math.min(top, far ? 3 : 0.4), { kiosk: !far && R() < 0.15 && top < -1, props: z < 30 }); }
    // fundo: casas atrás da parede do riad (aparecem por cima dela)
    for (let z = -14.5; z > -44; z -= 5 + R() * 3) for (let x = -44; x < 44; x += 5.5 + R() * 3) { if (x > -46 && x < -34 && z < -30) continue; block(x, x + 4.5 + R() * 2.5, z - 4 - R() * 2, z, 6 + R() * 7 + (z < -25 ? 2 : 0), { rim: z > -25, props: z > -20 }); }
    K.inst(new T.SphereGeometry(0.35, 10, 6, 0, PI * 2, 0, PI / 2.6).rotateX(-1.2), K.mat(0xe8e8e8, { roughness: 0.5, side: T.DoubleSide }), dishes, { cast: false });
    K.inst(new T.CylinderGeometry(0.35, 0.35, 0.8, 10), K.mat(0x3a6aa8, { roughness: 0.5 }), tanks, { cast: false });
    K.inst(new T.BoxGeometry(1, 1, 1), K.mat(0x8a5a40, { roughness: 1 }), rims, { cast: false });
    K.inst(new T.LatheGeometry([[0, 0], [0.15, 0], [0.2, 0.3], [0, 0.3]].map(q => new T.Vector2(q[0], q[1])), 8), M.terracotta, pots, { cast: false }); K.inst(new T.SphereGeometry(0.25, 8, 6), M.leaf, bushes, { cast: false });
    K.tick((dt, t) => { clothes.forEach((c, i) => { c.rotation.x = Math.sin(t * 1.6 + i) * 0.18; }); });
    K.add(new T.PlaneGeometry(400, 400).rotateX(-PI / 2), K.mat(0x2a1c14, { roughness: 1 }), 0, -4.2, 0, { cast: false });
    // palmeiras na medina
    const palm = (x, z, y, h) => { K.cyl(0.12, 0.18, h, K.mat(0x5a4030, { roughness: 1 }), x, y + h / 2, z, { cast: false }, 6); for (let k = 0; k < 9; k++) { const f = K.add(new T.PlaneGeometry(0.5, 2.4, 1, 4).translate(0, 1.2, 0), K.mat(0x2a4a2a, { side: T.DoubleSide, roughness: 1 }), x, y + h, z, { cast: false }); f.rotation.set(-1.1 - (k % 3) * 0.25, k * 0.7, 0, 'YXZ'); } };
    palm(-30, 18, -4.2, 9); palm(31, 22, -4.2, 10); palm(-18, -22, -4.2, 14); palm(16, -26, -4.2, 15); palm(-46, -70, -4.2, 12); palm(-35, -82, -4.2, 13);

    // ------------------------------------------------------------ cegonhas: ninho no alto de uma ruína de taipa atrás do riad
    // (como nas muralhas do El Badi). O casal bate o bico (cabeça jogada para trás, matraca) de tempos em tempos e se
    // revezam: um sai, plana em círculos largos sobre os telhados do fundo e volta ao ninho
    { const rc = K.rng(9091), branco = K.mat(0xf2efe8, { roughness: 0.9 }), preto = K.mat(0x1a1818, { roughness: 0.9 }), bico = K.mat(0xd84a28, { roughness: 0.6 });
      const NX = 6.5, NZ = -17.5, NY = 15.2, taipa = K.mat(0xb06a44, { roughness: 1 });
      K.box(1.5, NY + 4.2, 1.5, taipa, NX, (NY - 4.2) / 2, NZ, { cast: false });
      for (const [dx, dz] of [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]]) K.box(0.4, 0.45, 0.4, taipa, NX + dx, NY + 0.22, NZ + dz, { cast: false });
      // ninho: monte de gravetos (cilindro largo e um aro mais escuro), com palhas soltas
      K.cyl(0.95, 0.7, 0.4, K.mat(0x5a4028, { roughness: 1 }), NX, NY + 0.3, NZ, { cast: false }, 10);
      K.add(new T.TorusGeometry(0.8, 0.14, 5, 14).rotateX(PI / 2), K.mat(0x4a321e, { roughness: 1 }), NX, NY + 0.48, NZ, { cast: false });
      for (let k = 0; k < 14; k++) { const a = k / 14 * PI * 2 + rc() * 0.3; K.cyl(0.015, 0.015, 0.7, K.mat(0x6a5030, { roughness: 1 }), NX + Math.cos(a) * 0.85, NY + 0.35, NZ + Math.sin(a) * 0.85, { cast: false, rz: (rc() - 0.5) * 1.2, ry: a, rx: 1.2 }, 3); }
      const cegonha = (voa) => {
        const g = K.group(NX, NY + 0.5, NZ), corpo = K.group(0, 0.42, 0, 0, g);
        // peças paradas de cada parte numa malha só (cor por vértice): menos chamadas de desenho
        const vc = K.vcol({ roughness: 0.9 });
        K.merge([[new T.SphereGeometry(0.2, 10, 8).scale(0.85, 0.8, 1.7), 0xf2efe8], [new T.BoxGeometry(0.14, 0.03, 0.18).translate(0, 0.02, -0.38), 0xf2efe8]], vc, { parent: corpo });
        const asas = [-1, 1].map(sx => { const a = K.group(sx * 0.15, 0.05, 0.05, 0, corpo); K.merge([[new T.BoxGeometry(0.05, 0.15, 0.4).translate(0, 0, -0.05), 0xf2efe8], [new T.BoxGeometry(0.05, 0.09, 0.3).translate(0, -0.03, -0.32), 0x1a1818]], vc, { parent: a });
          // asa aberta (só a que voa): outro grupo, mostrado no voo no lugar da asa dobrada
          if (voa) { const ab = K.group(0, 0, 0, 0, a); ab.visible = false; a.userData.ab = ab;
            const pa = [[new T.BoxGeometry(0.9, 0.03, 0.42).translate(sx * 0.45, 0, 0), 0xf2efe8], [new T.BoxGeometry(0.55, 0.03, 0.4).translate(sx * 1.15, 0, -0.02), 0x1a1818]];
            for (let f = 0; f < 4; f++) pa.push([K.at(new T.BoxGeometry(0.24, 0.02, 0.06), sx * (1.5 + f * 0.03), 0, 0.14 - f * 0.11, -sx * (0.1 + f * 0.12)), 0x1a1818]);
            K.merge(pa, vc, { parent: ab }); }
          return a; });
        const pesc = K.group(0, 0.12, 0.25, 0, corpo); K.cyl(0.05, 0.065, 0.42, branco, 0, 0.2, 0, { parent: pesc }, 7);
        const cab = K.group(0, 0.42, 0, 0, pesc); K.sphere(0.075, branco, 0, 0, 0, { parent: cab }, 9, 7);
        const bSup = K.group(0, 0.01, 0.05, 0, cab); K.add(new T.ConeGeometry(0.025, 0.36, 6).rotateX(PI / 2).translate(0, 0.012, 0.18), bico, 0, 0, 0, { parent: bSup });
        const bInf = K.group(0, -0.012, 0.05, 0, cab); K.add(new T.ConeGeometry(0.02, 0.33, 6).rotateX(PI / 2).translate(0, -0.01, 0.165), bico, 0, 0, 0, { parent: bInf });
        const pernas = [-1, 1].map(sx => { const l = K.group(sx * 0.07, -0.1, 0.02, 0, corpo); K.cyl(0.018, 0.016, 0.36, bico, 0, -0.18, 0, { parent: l }, 5); return l; });
        g.scale.setScalar(1.45); return { g, corpo, asas, pesc, cab, bInf, pernas };
      };
      const A = cegonha(false), B = cegonha(true); A.g.position.x -= 0.28; A.g.rotation.y = 0.6; B.g.position.x += 0.3; B.g.rotation.y = 2.4;
      // B sai do ninho em ciclos de 90 s: 0–55 s no ninho, 55–85 s voando (decola, círculos largos, pousa), depois de novo no ninho
      const CX = 2, CZ = -33, RV = 14, HV = 13.5, ninhoB = new T.Vector3(NX + 0.3, NY + 0.5, NZ), P = new T.Vector3(), Q = new T.Vector3(), ease = (u) => u * u * (3 - 2 * u);
      const voo = (v) => { const a = 1.2 + v * 0.42; return P.set(CX + Math.cos(a) * RV, HV + Math.sin(v * 0.9) * 1.2, CZ + Math.sin(a) * RV); };
      const pose = (c, t, matraca, fase) => {
        // matraca: pescoço jogado para trás até o bico apontar para o céu, mandíbula batendo rápido, asas meio abertas
        const k = matraca ? Math.min(1, matraca * 3, (1 - matraca) * 3) : 0;
        c.pesc.rotation.x = 0.25 - k * 1.1 + (k ? 0 : Math.sin(t * 0.7 + fase) * 0.12); c.cab.rotation.x = k ? -k * 1.0 : 0.35; c.cab.rotation.y = k ? 0 : Math.sin(t * 0.37 + fase) * 0.6;
        c.bInf.rotation.x = k > 0.5 ? Math.max(0, Math.sin(t * 34)) * 0.35 : 0;
        c.asas.forEach((a, i) => { a.rotation.z = (i ? -1 : 1) * k * 0.5; });
      };
      let pc = 4 + rc() * 6, mt = -1;
      K.tick((dt, t) => {
        dt = Math.min(dt, 0.1); pc -= dt;
        if (pc <= 0 && mt < 0) { mt = 0; pc = 18 + rc() * 14; }
        const mm = mt >= 0 ? mt / 2.6 : 0; if (mt >= 0) { mt += dt; if (mt > 2.6) mt = -1; }
        // respiração: o grupo todo se mexe sempre um pouco, e assim o motor não o junta às peças paradas
        A.g.position.y = NY + 0.5 + Math.sin(t * 1.3) * 0.006; pose(A, t, mm, 0);
        const c = t % 90, voando = c > 55 && c < 85;
        if (!voando) { B.g.position.copy(ninhoB); B.g.position.y += Math.sin(t * 1.3 + 1) * 0.006; B.g.rotation.set(0, 2.4, 0); B.corpo.rotation.set(0, 0, 0); pose(B, t, mm, 2); B.asas.forEach(a => { a.userData.ab.visible = false; a.children.forEach(m => { if (m !== a.userData.ab) m.visible = true; }); }); B.pernas.forEach(l => l.rotation.x = 0); return; }
        // em voo: asas abertas, pescoço e pernas esticados, planando com batidas raras
        const v = c - 55; B.asas.forEach((a, i) => { a.userData.ab.visible = true; a.children.forEach(m => { if (m !== a.userData.ab) m.visible = false; }); a.rotation.z = (i ? 1 : -1) * (v % 7 < 1.2 ? Math.sin(v * 9) * 0.35 : 0.05); });
        B.pesc.rotation.x = 1.15; B.cab.rotation.set(0.35, 0, 0); B.bInf.rotation.x = 0; B.pernas.forEach(l => l.rotation.x = -1.35);
        const ida = Math.min(1, v / 4), volta = Math.max(0, (v - 26) / 4); voo(v); Q.copy(P);
        if (ida < 1) P.lerpVectors(ninhoB, Q, ease(ida)); else if (volta > 0) P.lerpVectors(Q, ninhoB, ease(volta));
        const dx = P.x - B.g.position.x, dz = P.z - B.g.position.z; B.g.position.copy(P); if (dx * dx + dz * dz > 1e-8) B.g.rotation.set(0, Math.atan2(dx, dz), 0);
        B.corpo.rotation.set(0, 0, ida >= 1 && volta === 0 ? -0.25 : 0);
      });
    }
    // fumaça das grelhas da praça (Jemaa el-Fna) subindo entre os telhados do fundo, acesa de laranja por baixo
    { const rf = K.rng(9137), plumes = [];
      for (const [x, z, y0] of [[-23, -24, 9.5], [15, -33, 11]]) {
        K.halo(x, y0 + 0.4, z, 6, 0xff8a3a, 0.6);
        for (let k = 0; k < 8; k++) { const sm = new T.SpriteMaterial({ map: K.radialTex, color: 0xb8aaa0, transparent: true, opacity: 0, depthWrite: false }); const sp = new T.Sprite(sm); K.root.add(sp); plumes.push({ sp, x, z, y0, ph: k / 8 + rf() * 0.05, w: rf() * 6 }); }
      }
      const quente = new T.Color(0xff9a50), frio = new T.Color(0x9a9298);
      K.tick((dt, t) => plumes.forEach(p => { const u = (t * 0.06 + p.ph) % 1; p.sp.position.set(p.x + u * 3.2 + Math.sin(t * 0.5 + p.w) * 0.4 * u, p.y0 + u * 9, p.z - u * 1.5); p.sp.scale.setScalar(1.2 + u * 4.5);
        p.sp.material.opacity = 0.6 * Math.min(1, u * 6) * (1 - u); p.sp.material.color.copy(quente).lerp(frio, Math.min(1, u * 2.5)); }));
    }

    // ------------------------------------------------------------ minarete do bairro (poleiro do sniper)
    const minTex = (w0, h0, seed) => K.canvasTex(w0, h0, (g, w, h) => {
      const r = K.rng(seed); g.fillStyle = '#c47a52'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 1500; k++) { g.fillStyle = `rgba(${r() < 0.5 ? '255,210,170' : '90,40,20'},${r() * 0.15})`; g.fillRect(r() * w, r() * h, 2 + r() * 5, 2 + r() * 4); }
      g.strokeStyle = 'rgba(250,215,170,.75)'; g.lineWidth = 3;
      const panel = (y0, y1) => { g.strokeRect(w * 0.18, y0, w * 0.64, y1 - y0); const s = w * 0.16; for (let x = w * 0.18; x < w * 0.82 - 1; x += s) for (let y = y0 + s; y < y1; y += s) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + s / 2, y - s * 0.9, x + s, y); g.stroke(); } };
      panel(h * 0.1, h * 0.28); panel(h * 0.42, h * 0.6);
      for (const y of [h * 0.33, h * 0.68]) { g.fillStyle = '#1a0e08'; g.beginPath(); g.moveTo(w * 0.42, y + 34); g.lineTo(w * 0.42, y + 10); g.arc(w / 2, y + 10, w * 0.08, PI, 0); g.lineTo(w * 0.58, y + 34); g.fill(); }
      for (let x = 0; x < w; x += 10) { g.fillStyle = (x / 10) % 2 ? '#1d6a4a' : '#f2ead8'; g.fillRect(x, h * 0.03, 10, 10); g.fillRect(x, h * 0.8, 10, 8); }
    });
    { const x = -3, z = 52, top = 20, g = K.group(x, 0, z);
      const t = minTex(128, 512, 5), mm = new T.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffc890, emissiveIntensity: 0.5, roughness: 0.95 });
      K.add(new T.BoxGeometry(4.2, top + 4.2, 4.2), mm, 0, (top - 4.2) / 2, 0, { parent: g, cast: false });
      K.box(5.2, 0.25, 5.2, K.mat(0xd8a070), 0, top + 0.12, 0, { parent: g, cast: false });
      const mr = []; for (let k = -2; k <= 2; k++) for (const [a, b] of [[k, -2.5], [k, 2.5], [-2.5, k], [2.5, k]]) mr.push([x + a, top + 0.25, z + b]);
      K.inst(new T.BoxGeometry(0.5, 0.35, 0.5).translate(0, 0.17, 0), K.mat(0xc47a52), mr, { cast: false }); K.inst(new T.BoxGeometry(0.28, 0.3, 0.28).translate(0, 0.5, 0), K.mat(0xc47a52), mr, { cast: false });
      const t2 = minTex(128, 160, 6), m2 = new T.MeshStandardMaterial({ map: t2, emissiveMap: t2, emissive: 0xffc890, emissiveIntensity: 0.5, roughness: 0.95 });
      K.add(new T.BoxGeometry(2.4, 3.0, 2.4), m2, 0, top + 1.75, 0, { parent: g, cast: false });
      K.cone(1.9, 1.5, greenTile, 0, top + 4.0, 0, { parent: g, cast: false }, 4).rotation.y = PI / 4;
      K.cyl(0.04, 0.04, 1.8, K.gold, 0, top + 5.3, 0, { parent: g, cast: false }, 5); for (const [yy, rr] of [[top + 4.9, 0.26], [top + 5.45, 0.2], [top + 5.9, 0.14]]) K.sphere(rr, K.gold, 0, yy, 0, { parent: g, cast: false }, 10, 8);
      K.box(1.2, 1.7, 0.1, K.mat(0x0a0606), 0, top + 1.6, -1.22, { parent: g, cast: false });
      K.halo(x, top + 1.2, z - 2.75, 0.35, 0xff4134, 1.0);
      K.halo(x, 6, z - 3, 6, 0xffb070, 0.25);
      // sala de oração com telhados de telha verde
      K.box(22, 4.6, 12, K.mat(0xd8a070, { roughness: 0.95 }), x + 9, -1.9, z + 4, { parent: K.root, cast: false });
      for (let k = 0; k < 5; k++) { const rf = K.add(new T.CylinderGeometry(0.01, 1.6, 12, 4, 1), greenTile, x + 1.2 + k * 3.6, 1.0, z + 4, { cast: false, rx: PI / 2 }); rf.rotation.set(PI / 2, PI / 4, 0, 'XYZ'); rf.scale.set(1, 1, 0.55); }
    }
    // a Koutoubia, iluminada, ao longe
    { const x = -40, z = -110, top = 46, g = K.group(x, -4.2, z, 0.3);
      const t = minTex(128, 512, 9), mm = new T.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffc080, emissiveIntensity: 0.85, roughness: 0.95 });
      K.add(new T.BoxGeometry(9, top, 9), mm, 0, top / 2, 0, { parent: g, cast: false });
      K.box(10, 0.6, 10, K.mat(0xd8a070), 0, top + 0.3, 0, { parent: g, cast: false });
      const t2 = minTex(128, 160, 10), m2 = new T.MeshStandardMaterial({ map: t2, emissiveMap: t2, emissive: 0xffc080, emissiveIntensity: 0.85, roughness: 0.95 });
      K.add(new T.BoxGeometry(4.6, 6.5, 4.6), m2, 0, top + 3.8, 0, { parent: g, cast: false });
      K.sphere(1.6, K.mat(0xd8a070), 0, top + 7.2, 0, { parent: g, cast: false }, 10, 6);
      K.cyl(0.08, 0.08, 4, K.gold, 0, top + 9.0, 0, { parent: g, cast: false }, 5); for (const [yy, rr] of [[top + 8.6, 0.6], [top + 9.6, 0.45], [top + 10.4, 0.3]]) K.sphere(rr, K.glow(0xffd070, 1.4), 0, yy, 0, { parent: g, cast: false }, 10, 8);
      K.halo(x, 18, z, 26, 0xffa060, 0.22); K.halo(x, top + 4, z, 6, 0xffd090, 0.35);
      K.box(40, 6, 22, K.mat(0xc08060, { roughness: 1 }), x + 22, -1.2, z + 4, { cast: false });
    }
    // Atlas ao luar, lua e estrelas
    { const mm = new T.MeshStandardMaterial({ color: 0x2c3450, roughness: 1, flatShading: true, fog: false, emissive: 0x0c1020, emissiveIntensity: 1 });
      const sm = new T.MeshStandardMaterial({ color: 0xdfe6f6, roughness: 0.8, flatShading: true, fog: false, emissive: 0x404a68, emissiveIntensity: 1 });
      for (let k = 0; k < 11; k++) { const x = -330 + k * 64 + R() * 30, h = 55 + R() * 70, r = 60 + R() * 50, z = -300 - R() * 50; K.add(new T.ConeGeometry(r, h, 6 + (k % 3)), mm, x, h / 2 - 8, z, { cast: false, ry: R() * 3 }); K.add(new T.ConeGeometry(r * 0.3, h * 0.3, 6 + (k % 3)), sm, x, h - 8 - h * 0.15 + 0.5, z, { cast: false, ry: R() * 3 }); }
      const moon = K.add(new T.SphereGeometry(10, 20, 14), new T.MeshBasicMaterial({ color: 0xf2f0e6, fog: false }), 120, 150, -380, { cast: false });
      K.halo(120, 150, -380, 60, 0xb8c8ff, 0.5); moon.renderOrder = -1;
      const sp = []; for (let k = 0; k < 500; k++) { const a = R() * PI * 2, e = 0.12 + R() * 1.3, rr = 380; sp.push(Math.cos(a) * Math.cos(e) * rr, Math.sin(e) * rr, Math.sin(a) * Math.cos(e) * rr - 60); }
      const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
      K.root.add(new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.85 })));
    }
    // peças miúdas não projetam sombra (alivia o mapa de sombras)
    const sc = new T.Vector3();
    K.root.traverse(m => { if (!m.isMesh || !m.castShadow || m.isInstancedMesh) return; m.geometry.computeBoundingSphere(); m.getWorldScale(sc); if (m.geometry.boundingSphere.radius * Math.max(sc.x, sc.y, sc.z) < 0.16) m.castShadow = false; });
    // ------------------------------------------------------------ ambiente vivo: mariposas rodeando a grande lanterna perfurada
    K.particles({ modo: 'paira', x0: -0.9, x1: 0.9, z0: -8.9, z1: -7.6, y0: 1.9, y1: 3.0, n: 14, cor: [0xffe0a0], tam: 0.04, vel: 2.2, balanco: 0.35, add: true, pisca: 3 });
    // velas, lampiões e fogo oscilando um pouco
    K.tremular({ amp: 0.12 });
  },
  // ninho do sniper: varanda do minarete. Zellige verde, branco e ocre com estrelas de oito pontas, poeira de areia,
  // pilares de azulejo e uma lanterna de latão vazada balançando
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.4 }), plaster = 0xe2d2b2;
    N.tampo(0x1f7a5a, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 91, mat: { roughness: 0.3 }, draw: (c, w, h, R) => {
      c.fillStyle = '#e8dcc0'; c.fillRect(0, 0, w, h); const s = 30;
      for (let y = 0; y < h + s; y += s) for (let x = 0; x < w + s; x += s) { const i = ((x / s) + (y / s)) % 2;
        c.fillStyle = i ? '#1f7a5a' : '#ece4d0'; c.fillRect(x + 1, y + 1, s - 2, s - 2);
        if (!i) { c.fillStyle = ((x / s) % 4) < 2 ? '#c8902a' : '#1f4a8a'; c.save(); c.translate(x + s / 2, y + s / 2); for (let r = 0; r < 2; r++) { c.rotate(Math.PI / 4); c.fillRect(-7, -7, 14, 14); } c.restore(); } }
      c.fillStyle = 'rgba(200,170,120,.25)'; K.manchas(c, w, h, R, 120, ['210,180,130'], 10, 50, 0.35); c.fillStyle = '#d8c4a0'; c.fillRect(0, 0, w, 10); c.fillRect(0, h - 10, w, 10); K.grain(c, w, h, 10);
    } });
    N.box(5.6, 0.12, 1.0, plaster, 0, -0.98, -1.1).box(5.4, 3.2, 0.9, 0xd8b888, 0, -2.7, -0.95);
    for (const sx of [-1, 1]) N.box(0.6, 2.2, 0.6, 0x1f7a5a, sx * 2.15, 0.31, -0.95).box(0.7, 0.1, 0.7, plaster, sx * 2.15, 1.45, -0.95).box(0.62, 0.06, 0.62, 0xc8902a, sx * 2.15, 0.6, -0.95);
    N.fim();
    const lan = K.group(2.15, 1.38, -0.62, 0, g), brass = K.brass;
    K.cyl(0.005, 0.005, 0.3, K.iron, 0, -0.15, 0, { parent: lan, cast: false }, 4);
    K.cyl(0.04, 0.14, 0.14, brass, 0, -0.36, 0, { parent: lan, cast: false }, 8); K.cyl(0.13, 0.13, 0.26, K.mat(0x8a6a3a, { metalness: 0.7, roughness: 0.4, wireframe: true }), 0, -0.56, 0, { parent: lan, cast: false }, 8);
    K.sphere(0.07, K.glow(0xffb060, 2.4), 0, -0.56, 0, { parent: lan, cast: false }, 10, 8); K.cone(0.14, 0.1, brass, 0, -0.74, 0, { parent: lan, rx: Math.PI, cast: false }, 8);
    K.tick((dt, t) => { lan.rotation.z = Math.sin(t * 0.9) * 0.06; lan.rotation.x = Math.sin(t * 0.7 + 1) * 0.04; });
  },
});
