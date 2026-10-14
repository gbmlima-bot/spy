// 02 · Superiate em Mônaco: festa ao pôr do sol no deck de popa do Luna d'Oro, atracado no Port Hercule, Monte Carlo.
// Dois níveis: o deck principal (piscina de borda infinita, bar de mármore, lounge branco, mesa de sushi, hidromassagem)
// e o flybridge (DJ, espreguiçadeiras, timão, radar). O sniper está numa sacada de hotel na encosta do outro lado do porto.
MIRA_CENARIOS.push({
  id: 'iate',
  nome: 'Pôr do Sol no Iate',
  lugar: "Superiate Luna d'Oro, Port Hercule, Mônaco",
  hora: 'pôr do sol',
  resumo: 'Deck de teca com piscina de borda infinita, bar de mármore, sushi fresco e DJ no flybridge. Jet-skis amarrados na popa, o cassino acendendo na encosta e todo mundo de linho claro.',
  sniper: { pos: [-6, 16.4, 53.0], desc: 'sacada de uma suíte do Hôtel Belvédère, na encosta do outro lado do porto' },
  niveis: [
    { nome: 'deck principal', y: 0, x0: -12.5, x1: 12.5, z0: -9.0, z1: 9.3 },
    { nome: 'flybridge', y: 3.2, x0: -12.2, x1: 12.2, z0: -15.0, z1: -8.3 },
  ],
  escadas: [{ de: 0, para: 1, a: [10.3, -2.9], b: [10.3, -8.8], rotulo: 'flybridge' }],
  convidados: 28,
  inicio: [0.0, 1.2, 0],
  // cores de luz e neblina em valores lineares (o motor não converte): 0xc2412e sai na tela como um salmão (226, 138, 118)
  ambiente: {
    ceu: ['#2a2452', '#5e3a78', '#b8577e', '#ee8a62', '#ffc47e'], neblina: [0xc2412e, 40, 235], hemi: [0x7a3a78, 0x1a1020, 0.6],
    sol: [0xff6720, 2.4, -30, 9, 4], preenche: [0x283093, 0.5], exposicao: 0.85, bloom: 0.6,
  },
  // o que os convidados fazem parados em cada tipo de vaga (anims do jogo: 22 mãos para trás, 23 braços cruzados, 24 esfregando as mãos, 25 reverência)
  rotinas: { view: [23, 22, 0] },
  guardaRoupa: {
    ternos: [[0xece2c8, 'linho areia'], [0xf6f3ec, 'linho branco'], [0xa9c4dc, 'linho azul-claro'], [0x22304e, 'blazer marinho'], [0xc6ad84, 'linho cáqui'], [0xe7a99a, 'linho salmão'], [0x9fb39a, 'linho sálvia']],
    vestidos: [[0xff7a62, 'vestido coral'], [0x2ec4b6, 'vestido turquesa'], [0xf7f3ea, 'vestido branco de verão'], [0xf4d35e, 'vestido limão'], [0xc9a0dc, 'vestido lilás'], [0xe63e7a, 'vestido fúcsia'], [0x8fd3ff, 'vestido azul-piscina'], [0xf1c3a8, 'vestido pêssego']],
    vestidoChance: 0.5, longo: 0.35, tacas: ['coupe', 'wine', 'coupe', 'tumbler'], drinks: [0xf2d070, 0xff8a5c, 0xffc0cb, 0xf5e6b0, 0x9be0c0],
    extra(o, r) {
      const pk = (a) => a[Math.floor(r() * a.length)];
      if (!o.dress) {
        // camisa aberta, sem gravata: o laço some na cor da camisa
        o.shirt = pk([0xf6f3ec, 0xf6f3ec, 0xbfd8ef, 0xf3d6c8, 0xe8f0e0]); o.tie = o.shirt; o.bow = false;
        // metade deixa o paletó na cadeira: camisa de manga dobrada por dentro da calça de linho
        if (((o.main ^ o.shirt ^ o.hair) >> 2) % 2) { o.camisa = true; o.pants = o.main === 0x22304e ? 0xece2c8 : o.main; o.main = o.shirt; o.shirt = 0xf6f3ec; o.pocket = 0; o.name = 'camisa ' + { 0xf6f3ec: 'branca', 0xbfd8ef: 'azul-clara', 0xf3d6c8: 'rosada', 0xe8f0e0: 'verde-clara' }[o.main] + ' de manga dobrada, calça ' + o.name.replace(/^(linho|blazer) /, '').replace(/^marinho/, 'areia'); }
        if (r() < 0.42) { o.hat = 'fedora'; o.hatColor = 0xeadfc0; o.hatBand = 0x1b1b1f; o.name += ', chapéu panamá'; }
        if (r() < 0.2) { o.scarf = pk([0x1f2a44, 0xc8322f, 0xf2c14e]); o.name += ', lenço no pescoço'; }
        if (r() < 0.25) { o.pocket = pk([0xc8322f, 0x2ec4b6, 0xf2c14e]); }
      } else {
        if (r() < 0.38) { o.hat = 'boater'; o.hatColor = 0xf0e0b0; o.hatBand = pk([0xc8322f, 0x1f2a44, 0xf6f3ec, 0x2ec4b6]); o.name += ', chapéu de palha'; }
        else if (r() < 0.12) { o.hat = 'flower'; o.hatColor = pk([0xff5d8f, 0xffffff, 0xff9a3c]); o.name += ', flor no cabelo'; }
        if (r() < 0.2) { o.propL = 'fan'; o.propColor = pk([0xf6f3ec, 0xff7a62, 0x2ec4b6]); o.clutch = false; o.name += ', leque'; }
      }
      if (r() < 0.5) { o.glasses = 'sun'; o.name += ', óculos escuros'; }
      // tripulação: marinheiros de camisa listrada e boné de pompom (qualquer convidado pode ser sorteado, o agente também)
      if (!o.dress && r() < 0.12) { Object.assign(o, { camisa: false, tee: true, main: 0xf6f3ec, stripes: 0x1f2a44, pants: 0x1f2a44, hat: 'beanie', hatColor: 0xf6f3ec, hatBand: 0xc8322f, scarf: 0, pocket: 0, glasses: r() < 0.3 ? 'sun' : false }); o.name = 'marinheiro de camisa listrada e boné de pompom' + (o.glasses ? ', óculos escuros' : '') + (o.beard ? ', de barba' : ''); }
    },
  },
  elenco: [
    { x: 6.1, z: -12.9, lv: 1, rot: 0.55, anim: 0, fala: 'Vento de terra às oito. Ninguém sai do porto antes disso.', outfit: { dress: false, main: 0xf7f5ef, pants: 0xf7f5ef, shirt: 0xf7f5ef, tie: 0x14213d, skin: 1, hair: 0xa9a9a9, hairStyle: 'short', beard: true, hat: 'cap', hatColor: 0xf7f5ef, hatBand: 0x14213d, sash: 0xd9a441, gloves: 0xf7f5ef, propL: 'binoculars', accent: 0xd9a441, pocket: 0xd9a441, name: 'capitão Marchetti, de quepe branco e uniforme de gala com faixa dourada' } },
    { x: 4.2, z: -7.05, rot: 0, anim: 2, fala: 'O atum chegou de Sète hoje de manhã. Ainda está sorrindo.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x1b1b1f, shirt: 0xf6f3ec, tie: 0xf6f3ec, skin: 2, hair: 0x1a1411, hairStyle: 'short', hat: 'turban', hatColor: 0xf6f3ec, apron: 0x1f2a44, prop: 'skewer', name: 'chef Hiroshi, de faixa branca na cabeça e avental índigo' } },
    { x: 0.0, z: -12.35, lv: 1, rot: 0, anim: 14, fala: 'Quando o sol encostar no mar, eu solto o grave.', outfit: { dress: false, main: 0xc9ced6, pants: 0x16161a, shirt: 0x16161a, tie: 0x16161a, satin: true, skin: 4, hair: 0xff4fa3, hairStyle: 'bob', glasses: 'sun', earring: true, necklace: true, prop: 'mic', name: 'DJ Nova, de óculos escuros, cabelo rosa e jaqueta prateada' } },
    { x: -4.5, z: -7.05, rot: 0, anim: 7, fala: 'Este barco? Ganhei numa mão de pôquer. O anterior era maior.', outfit: { dress: false, main: 0xe6d8b8, pants: 0xe6d8b8, shirt: 0xf6f3ec, tie: 0xf6f3ec, skin: 0, hair: 0xd9d9d9, hairStyle: 'quiff', glasses: 'sun', hat: 'fedora', hatColor: 0xeadfc0, hatBand: 0x5a3a22, prop: 'cigar', pocket: 0xc8322f, name: 'magnata Aristide Vlahos, de linho bege, panamá e charuto' } },
    { x: 2.6, z: 6.0, rot: 2.5, anim: 18, fala: 'Espera, a luz está perfeita. Mais uma. Só mais uma!', outfit: { dress: true, gown: false, satin: true, main: 0xff5d8f, skin: 1, hair: 0xd9b46a, hairStyle: 'long', glasses: 'sun', hat: 'flower', hatColor: 0xffffff, necklace: true, earring: true, accent: 0xd9a441, name: 'influencer Bella, de vestido rosa-chiclete tirando selfie' } },
    { x: -11.0, z: 8.35, rot: 0.6, anim: 19, fala: 'Nó de escota, nó de escota... quem amarrou isso foi um turista.', outfit: { dress: false, main: 0xf6f3ec, pants: 0x1f2a44, shirt: 0xf6f3ec, tie: 0xf6f3ec, skin: 3, hair: 0x6b4a2b, hairStyle: 'short', beard: true, stripes: 0x1f2a44, hat: 'beanie', hatColor: 0xf6f3ec, hatBand: 0xc8322f, name: 'marinheiro Jean-Luc, de camisa listrada e boné de pompom vermelho' } },
    { x: 9.9, z: 4.3, rot: -0.3, anim: 0, fala: 'Papai comprou o porto. Ou foi o cassino? Sempre confundo.', outfit: { dress: true, gown: true, satin: true, main: 0xf8e8b0, skin: 0, hair: 0x8a3a22, hairStyle: 'long', hat: 'cowboy', hatColor: 0xf3e6c8, necklace: true, earring: true, accent: 0xd9a441, glass: 'coupe', drink: 0xf2d070, name: 'herdeira Céleste, de vestido esvoaçante e chapéu de abas largas' } },
    { x: 4.0, z: 8.45, rot: 0.3, anim: 0, fala: 'Lá embaixo tem uma âncora velha. E uma maleta que ninguém reclamou.', outfit: { dress: false, main: 0x16161a, pants: 0x16161a, shirt: 0x16161a, tie: 0x16161a, skin: 2, hair: 0x1a1411, hairStyle: 'short', stripes: 0x2a8acb, glasses: 'goggles', maskColor: 0x2a8acb, gloves: 0x16161a, name: 'mergulhador Rafa, de neoprene preto e máscara de mergulho azul' } },
  ],
  missoes: [
    { k: 'balde', label: 'Trocar a garrafa no balde de gelo', where: 'lounge branco, mesa de centro', s: [-4.5, -3.9], l: [-4.5, -5.3] },
    { k: 'sushi', label: 'Esconder o pendrive no sushi', where: 'mesa de sushi do chef', s: [4.2, -4.7], l: [4.2, -5.9] },
    { k: 'jetski', label: 'Soltar a amarra do jet-ski', where: 'popa, cunho de bombordo', s: [-8.6, 8.6], l: [-8.6, 12.8] },
    { k: 'bandeira', label: 'Hastear outra bandeira na popa', where: 'mastro da popa, boreste', s: [11.0, 8.5], l: [11.9, 9.1] },
    { k: 'piscina', label: 'Ligar a luz subaquática da piscina', where: 'painel da piscina de borda infinita', s: [-8.0, 4.0], l: [-7.4, 4.4] },
    { k: 'guardasol', label: 'Fechar o guarda-sol de boreste', where: 'mesa com guarda-sol, à direita', s: [8.1, 1.9], l: [7.0, 0.8] },
    { k: 'radar', label: 'Desligar o radar pelo painel do timão', where: 'flybridge, posto de comando', s: [10.2, -13.3], l: [10.1, -14.6], lv: 1 },
    { k: 'vinil', label: 'Trocar o disco da DJ', where: 'flybridge, cabine da DJ', s: [2.3, -10.6], l: [1.0, -11.5], lv: 1 },
    { k: 'holofote', label: 'Apontar o holofote para o cassino', where: 'flybridge, guarda-corpo da frente', s: [-6.0, -8.9], l: [-6.0, -8.15], lv: 1 },
  ],
  build(K) {
    const T = K.T, M = K.M, R = K.r, Y1 = 3.2, WY = -1.9;
    // ------------------------------------------------------------ materiais
    const gel = K.mat(0xe9e4da, { roughness: 0.38, metalness: 0.05, envMapIntensity: 0.45 });
    const gelM = K.mat(0xeeebe4, { roughness: 0.5 });
    const chrome = K.metal(0xe8ebf0, 0.14), navy = K.mat(0x14213d, { roughness: 0.3, metalness: 0.25 }), goldLine = K.metal(0xd9a441, 0.25);
    const darkGlass = K.mat(0x141a28, { roughness: 0.06, metalness: 0.92, envMapIntensity: 1.5 });
    const leatherW = K.mat(0xf5f2ea, { roughness: 0.55 }), linenW = K.mat(0xf6f3ec, { roughness: 0.92 }), cushionN = K.mat(0x1f2a44, { roughness: 0.9 });
    const teakDark = K.mat(0x6a4426, { roughness: 0.6 }), lacquer = K.mat(0x121214, { roughness: 0.18, metalness: 0.2 }), hinoki = K.mat(0xe2c79a, { roughness: 0.7 });
    const rope = K.mat(0xd8c8a0, { roughness: 1 }), rubber = K.mat(0x2a2c30, { roughness: 0.8 });
    // instâncias com cor por cópia
    const instC = (geo, m, list, cols, o = {}) => { const im = K.inst(geo, m, list, o); const c = new T.Color(); list.forEach((p, i) => im.setColorAt(i, c.set(cols[i % cols.length]))); im.instanceColor.needsUpdate = true; return im; };
    // corda em curva (catenária) entre pontos
    const ropeLine = (pts, r = 0.025, m = rope) => { const cv = new T.CatmullRomCurve3(pts.map(p => new T.Vector3(p[0], p[1], p[2]))); return K.add(new T.TubeGeometry(cv, 24, r, 5, false), m, 0, 0, 0, { cast: false }); };
    const sagRope = (a, b, sag, r) => { const pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u]); } return ropeLine(pts, r); };

    // palmeiras de fundo instanciadas (tronco + folhas num draw call cada)
    const palmT = [], palmF = [];
    const palm = (x, y, z, h) => { const d = new T.Object3D(); d.position.set(x, y + h / 2, z); d.scale.set(1, h, 1); d.updateMatrix(); palmT.push(d.matrix.clone()); const a0 = R() * 6; for (let i = 0; i < 8; i++) { d.position.set(x, y + h - 0.1, z); d.scale.set(1, 1, 1); d.rotation.set(-1.0 - (i % 2) * 0.35, a0 + i * 0.8, 0, 'YXZ'); d.updateMatrix(); palmF.push(d.matrix.clone()); d.rotation.set(0, 0, 0); } };
    const flushPalms = () => { const mk = (geo, m, arr) => { const im = new T.InstancedMesh(geo, m, arr.length); arr.forEach((mm, i) => im.setMatrixAt(i, mm)); K.root.add(im); }; mk(new T.CylinderGeometry(0.16, 0.26, 1, 6), K.mat(0x8a6a4a, { roughness: 0.9 }), palmT); mk(new T.PlaneGeometry(0.7, 3.1, 1, 3).translate(0, 1.55, 0), K.mat(0x4f7a3a, { side: T.DoubleSide, roughness: 0.8 }), palmF); };
    // ------------------------------------------------------------ texturas
    const teakTex = K.canvasTex(512, 512, (g, w, h) => {
      const n = 32, pw = w / n;
      for (let i = 0; i < n; i++) {
        let y = -R() * 200;
        while (y < h) { const L = 120 + R() * 220, v = R(); g.fillStyle = `rgb(${168 + v * 40},${112 + v * 30},${62 + v * 22})`; g.fillRect(i * pw, y, pw, L);
          for (let k = 0; k < 5; k++) { g.strokeStyle = `rgba(90,50,20,${0.08 + R() * 0.12})`; g.lineWidth = 0.8; g.beginPath(); const xx = i * pw + 2 + R() * (pw - 4); g.moveTo(xx, y); g.bezierCurveTo(xx + R() * 3 - 1.5, y + L * 0.3, xx + R() * 3 - 1.5, y + L * 0.6, xx, y + L); g.stroke(); }
          g.fillStyle = 'rgba(25,18,12,.85)'; g.fillRect(i * pw, y + L - 1.5, pw, 1.5); y += L; }
        g.fillStyle = 'rgba(25,18,12,.9)'; g.fillRect(i * pw + pw - 2, 0, 2, h);
      }
      K.grain(g, w, h, 8);
    });
    const deckPiece = (x0, z0, x1, z1, y = 0) => {
      const t = teakTex.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set((x1 - x0) / 4, (z1 - z0) / 4); t.offset.set(x0 / 4, -z1 / 4);
      return K.add(new T.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2), K.texMat(t, { roughness: 0.62, envMapIntensity: 0.35 }), (x0 + x1) / 2, y, (z0 + z1) / 2, { cast: false });
    };
    const marbleTex = K.canvasTex(512, 256, (g, w, h) => {
      g.fillStyle = '#f2efe9'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(${120 + R() * 60},${120 + R() * 50},${130 + R() * 50},${0.1 + R() * 0.25})`; g.lineWidth = 0.6 + R() * 2.2; g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += R() * 90 - 20; y += R() * 60 - 30; g.lineTo(x, y); } g.stroke(); }
      g.strokeStyle = 'rgba(200,160,90,.35)'; g.lineWidth = 1.2; for (let k = 0; k < 6; k++) { g.beginPath(); let x = R() * w, y = R() * h; g.moveTo(x, y); for (let j = 0; j < 5; j++) { x += R() * 80; y += R() * 50 - 25; g.lineTo(x, y); } g.stroke(); }
      K.grain(g, w, h, 5);
    });
    const marble = K.texMat(marbleTex, { roughness: 0.18, metalness: 0.02, envMapIntensity: 0.9 });
    // janelas espelhadas da superestrutura: reflexo do pôr do sol
    const mirrorTex = (w, h, cols, rows) => K.canvasTex(512, 256, (g, W, H) => {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2a2440'); gr.addColorStop(0.45, '#6a3a5a'); gr.addColorStop(0.62, '#d07a6a'); gr.addColorStop(0.7, '#1c1a26'); gr.addColorStop(1, '#0c0e16');
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let k = 0; k < 14; k++) { g.fillStyle = `rgba(255,${190 + R() * 50},${150 + R() * 60},${0.05 + R() * 0.1})`; g.save(); g.translate(R() * W, 0); g.rotate(0.5); g.fillRect(0, -40, 6 + R() * 26, H * 2); g.restore(); }
      g.fillStyle = '#d8dce2'; for (let i = 0; i <= cols; i++) g.fillRect(i * W / cols - 2, 0, 4, H); for (let j = 0; j <= rows; j++) g.fillRect(0, j * H / rows - 2, W, 4);
    });
    const salonTex = mirrorTex(512, 256, 10, 1);
    const salonMat = new T.MeshStandardMaterial({ map: salonTex, emissiveMap: salonTex, emissive: 0xffffff, emissiveIntensity: 0.18, roughness: 0.08, metalness: 0.5, envMapIntensity: 1.2 });
    const bandTex = mirrorTex(512, 256, 16, 1);
    const bandMat = new T.MeshStandardMaterial({ map: bandTex, emissiveMap: bandTex, emissive: 0xffffff, emissiveIntensity: 0.15, roughness: 0.08, metalness: 0.5, envMapIntensity: 1.2 });

    // ------------------------------------------------------------ água do porto
    const waterTex = K.canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = '#1d4560'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 1300; k++) { const x = R() * w, y = R() * h, l = 6 + R() * 30, warm = R() < 0.45; g.strokeStyle = warm ? `rgba(255,${150 + R() * 70},${110 + R() * 60},${0.06 + R() * 0.16})` : `rgba(${120 + R() * 60},${180 + R() * 50},${210 + R() * 40},${0.05 + R() * 0.12})`; g.lineWidth = 1 + R() * 1.8; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 2, x + l, y); g.stroke(); }
    }, [60, 50]);
    const waterMat = new T.MeshStandardMaterial({ color: 0x1d5f7e, map: waterTex, roughness: 0.12, metalness: 0.45, envMapIntensity: 0.9, emissive: 0x2a1830, emissiveIntensity: 0.35 });
    K.add(new T.PlaneGeometry(700, 560).rotateX(-Math.PI / 2), waterMat, 0, WY, 10, { cast: false });
    K.tick((dt, t) => { waterTex.offset.set(Math.sin(t * 0.05) * 0.04, t * 0.006); });
    // trilha dourada do sol na água (para a esquerda, de onde vem a luz) e reflexos
    for (let k = 0; k < 26; k++) K.pool(-16 - k * 3.2 + R() * 2, 14 + R() * 18 - k * 0.6, 0.8 + R() * 1.6, 0xffb060, 0.28, WY + 0.02);
    for (let k = 0; k < 18; k++) K.pool(-14 + R() * 30, 12 + R() * 14, 0.4 + R() * 0.8, 0xffc890, 0.18, WY + 0.02);

    // ------------------------------------------------------------ casco do iate (popa em +z, proa lá no fundo)
    const hullShape = (s = 1) => { const sh = new T.Shape(); sh.moveTo(-12.8 * s, -9.6); sh.lineTo(12.8 * s, -9.6); sh.lineTo(12.8 * s, 28); sh.quadraticCurveTo(12.6 * s, 52, 0, 68); sh.quadraticCurveTo(-12.6 * s, 52, -12.8 * s, 28); sh.lineTo(-12.8 * s, -9.6); return sh; };
    const hullSh = hullShape(); { const hp = new T.Path(); hp.moveTo(-7.05, -9.5); hp.lineTo(1.05, -9.5); hp.lineTo(1.05, -4.55); hp.lineTo(-7.05, -4.55); hp.lineTo(-7.05, -9.5); hullSh.holes.push(hp); }
    const hullBody = new T.ExtrudeGeometry(hullSh, { depth: 2.3, bevelEnabled: false, curveSegments: 14 }); hullBody.rotateX(-Math.PI / 2); hullBody.translate(0, WY - 0.45, 0);
    K.add(hullBody, gel, 0, 0, 0, { cast: false });
    const boot = new T.ExtrudeGeometry(hullShape(1.004), { depth: 0.32, bevelEnabled: false, curveSegments: 14 }); boot.rotateX(-Math.PI / 2); boot.translate(0, WY - 0.12, -0.02);
    K.add(boot, navy, 0, 0, 0, { cast: false });
    const pin = new T.ExtrudeGeometry(hullShape(1.005), { depth: 0.06, bevelEnabled: false, curveSegments: 14 }); pin.rotateX(-Math.PI / 2); pin.translate(0, -0.72, -0.03);
    K.add(pin, goldLine, 0, 0, 0, { cast: false });
    // vigias (escotilhas) no costado
    { const l = []; for (let z = -6; z > -60; z -= 2.2) for (const s of [-1, 1]) if (z > -28 || R() < 0.7) l.push([s * 12.82, -1.05, z, s * Math.PI / 2]); K.inst(new T.CylinderGeometry(0.16, 0.16, 0.04, 14).rotateX(Math.PI / 2), darkGlass, l, { cast: false }); }
    // nome na popa (espelho de popa)
    K.sign("LUNA D'ORO", 7.2, 0.9, 6.6, -0.45, 9.63, { color: '#d9a441', font: 'Didot, Georgia, serif', size: 86, weight: 400 });
    K.sign('MONACO', 2.6, 0.4, 6.6, -1.05, 9.63, { color: '#14213d', font: 'Georgia, serif', size: 70, weight: 700 });
    // janela de aquário da piscina no espelho de popa
    const aquaWin = K.box(7.6, 0.75, 0.04, K.glow(0x3ad0e8, 1.15), -3.0, -0.55, 9.62, { cast: false });
    // plataforma de banho (teca) com escadinhas
    deckPiece(-11.4, 9.6, 11.4, 12.2, WY + 0.55);
    K.box(22.8, 0.5, 2.6, gel, 0, WY + 0.28, 10.9, { cast: false });
    for (const sx of [-1, 1]) for (let k = 0; k < 4; k++) { const y = WY + 0.55 + (k + 1) * 0.33, z = 11.3 - k * 0.45; K.box(1.1, 0.06, 0.45, teakDark, sx * 10.6, y, z, { cast: false }); K.box(1.1, y - WY - 0.55, 0.45, gel, sx * 10.6, (y + WY + 0.55) / 2, z, { cast: false }); }
    // escada de banho cromada (ao lado do mergulhador)
    for (const s of [-0.25, 0.25]) K.add(new T.TorusGeometry(0.35, 0.025, 6, 12, Math.PI), chrome, 4.0 + s, -0.05, 9.42, { ry: Math.PI / 2, cast: false });
    // defensas (fenders) penduradas
    { const l = []; for (const x of [-11.6, -6.8, 6.8, 11.6]) l.push([x, WY + 0.35, 12.42, 0]); for (let z = 6; z > -40; z -= 5.5) for (const s of [-1, 1]) l.push([s * 13.05, -0.9, z, 0]);
      K.inst(new T.CylinderGeometry(0.2, 0.2, 0.8, 12), K.mat(0x1f2a44, { roughness: 0.5 }), l);
      K.inst(new T.SphereGeometry(0.2, 10, 6), K.mat(0x1f2a44, { roughness: 0.5 }), l.map(p => [p[0], p[1] + 0.4, p[2]]));
      K.inst(new T.SphereGeometry(0.2, 10, 6), K.mat(0x1f2a44, { roughness: 0.5 }), l.map(p => [p[0], p[1] - 0.4, p[2]]));
      l.forEach(p => { const top = p[2] > 12 ? WY + 0.55 : 0, len = top - (p[1] + 0.6); K.cyl(0.012, 0.012, len, rope, p[0], p[1] + 0.6 + len / 2, p[2], { cast: false }, 4); }); }

    // ------------------------------------------------------------ deck principal (nível 0): teca recortada em volta da piscina
    deckPiece(-12.8, -9.3, 12.8, 4.6);
    deckPiece(-12.8, 4.6, -7.0, 9.6); deckPiece(1.0, 4.6, 12.8, 9.6);
    K.box(25.7, 0.06, 0.12, gel, 0, 0.02, 9.6, { cast: false });
    // guarda-corpo de vidro com corrimão cromado (laterais e popa)
    const railGlass = K.mat(0xd8ecf5, { roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, envMapIntensity: 1.4, depthWrite: false });
    const rail = (x0, z0, x1, z1, y = 0, h = 1.0) => {
      const L = Math.hypot(x1 - x0, z1 - z0), ry = Math.atan2(x1 - x0, z1 - z0), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      K.box(0.03, h - 0.08, L, railGlass, cx, y + (h - 0.08) / 2, cz, { ry, cast: false });
      K.add(new T.CylinderGeometry(0.035, 0.035, L, 8).rotateX(Math.PI / 2), chrome, cx, y + h, cz, { ry, cast: false });
      const n = Math.max(1, Math.round(L / 1.6)), l = []; for (let i = 0; i <= n; i++) l.push([x0 + (x1 - x0) * i / n, y + h / 2, z0 + (z1 - z0) * i / n]);
      K.inst(new T.CylinderGeometry(0.025, 0.025, h, 6), chrome, l, { cast: false });
    };
    rail(-12.65, -9.2, -12.65, 9.5); rail(12.65, -9.2, 12.65, 9.5);
    rail(-12.65, 9.5, -7.1, 9.5); rail(1.1, 9.5, 3.6, 9.5); rail(4.4, 9.5, 12.65, 9.5);
    // boias salva-vidas com o nome do iate
    const buoyTex = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#ff6a2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; for (let k = 0; k < 4; k++) g.fillRect(k * 64, 0, 28, h); });
    const buoy = (x, y, z, ry) => { K.add(new T.TorusGeometry(0.32, 0.09, 8, 20), K.texMat(buoyTex, { roughness: 0.6 }), x, y, z, { ry, cast: false }); };
    buoy(-12.72, 0.62, 2.6, Math.PI / 2); buoy(12.72, 0.62, -1.0, Math.PI / 2); buoy(-10.0, 0.62, 9.56, 0); buoy(-12.72, Y1 + 0.62, -12.5, Math.PI / 2);
    // cunhos (cleats) e cabeços cromados
    const cleat = (x, z, y = 0) => { K.box(0.34, 0.05, 0.08, chrome, x, y + 0.11, z, { cast: false }); K.box(0.06, 0.1, 0.06, chrome, x - 0.1, y + 0.05, z, { cast: false }); K.box(0.06, 0.1, 0.06, chrome, x + 0.1, y + 0.05, z, { cast: false }); };
    [[-11.8, 9.25], [-8.6, 9.25], [8.8, 9.25], [11.4, 9.25], [-12.2, 0], [12.2, -6]].forEach(([x, z]) => cleat(x, z));
    // espias (cabos de amarração) da popa até boias no porto
    sagRope([-11.8, 0.12, 9.3], [-14, WY + 0.2, 26], 1.2, 0.03); sagRope([11.4, 0.12, 9.3], [15, WY + 0.2, 27], 1.2, 0.03);
    for (const [x, z, c] of [[-14, 26, 0xc8322f], [15, 27, 0xf6f3ec], [-26, 30, 0xc8322f], [30, 32, 0x2c7a4b]]) { K.sphere(0.45, K.mat(c, { roughness: 0.4 }), x, WY + 0.15, z, { cast: false }, 12, 8); K.cyl(0.05, 0.05, 0.5, K.iron, x, WY + 0.6, z, { cast: false }, 6); }

    const lounger = (x, z, ry, y = 0, towel = 0xf6f3ec) => {
      const g = K.group(x, y, z, ry);
      K.box(0.72, 0.08, 1.95, teakDark, 0, 0.3, 0, { parent: g }); for (const s of [-1, 1]) for (const zz of [-0.8, 0.8]) K.box(0.06, 0.3, 0.06, chrome, s * 0.3, 0.15, zz, { parent: g, cast: false });
      K.add(K.rbox(0.68, 0.08, 1.3, 0.03), linenW, 0, 0.38, 0.3, { parent: g });
      const b = K.add(K.rbox(0.68, 0.08, 0.7, 0.03), linenW, 0, 0.55, -0.55, { parent: g }); b.rotation.x = 0.7;
      K.box(0.5, 0.012, 0.9, K.mat(towel, { roughness: 0.95 }), 0, 0.43, 0.35, { parent: g, cast: false });
      return g;
    };
    // ------------------------------------------------------------ superestrutura: salão com vidro espelhado e flybridge em cima
    K.box(25.6, 3.0, 20.5, gel, 0, 1.5, -19.75, { cast: false });                     // corpo do salão (vai até o meio do barco)
    K.add(new T.PlaneGeometry(25.2, 2.7), salonMat, 0, 1.4, -9.48, { cast: false });  // fachada envidraçada
    for (let k = 0; k <= 10; k++) K.box(0.07, 2.8, 0.08, chrome, -12.5 + k * 2.5, 1.4, -9.44, { cast: false });
    K.box(25.6, 0.12, 0.12, chrome, 0, 2.82, -9.44, { cast: false });
    // porta de correr aberta (luz quente do salão)
    K.add(new T.PlaneGeometry(2.4, 2.6), K.glow(0xffc890, 0.85), -0.0, 1.32, -9.46, { cast: false });
    K.pool(0, -8.6, 1.6, 0xffc080, 0.35);
    // laje do flybridge com faixa de LED sob a borda
    K.box(25.6, 0.22, 7.6, gel, 0, Y1 - 0.11, -11.9, { cast: false });
    K.box(25.6, 0.04, 0.05, K.glow(0xffd8a0, 2.4), 0, Y1 - 0.24, -8.12, { cast: false });
    K.box(25.7, 0.06, 0.08, goldLine, 0, Y1 - 0.05, -8.08, { cast: false });
    deckPiece(-12.8, -15.6, 12.8, -8.1, Y1);
    K.col(-12.5, -9.6, 12.5, -9.0);
    // bloco de cima (passadiço) com faixa de janelas escuras
    K.box(20.6, 3.3, 14.5, gel, 0, Y1 + 1.65, -22.85, { cast: false });
    K.add(new T.PlaneGeometry(20.2, 1.5), bandMat, 0, Y1 + 1.75, -15.58, { cast: false });
    for (const s of [-1, 1]) K.add(new T.PlaneGeometry(14, 1.5), bandMat, s * 10.32, Y1 + 1.75, -22.8, { ry: s * Math.PI / 2, cast: false });
    K.box(21.4, 0.2, 15.4, gel, 0, Y1 + 3.4, -22.6, { cast: false });
    K.box(21.5, 0.05, 0.05, K.glow(0xffd8a0, 2.0), 0, Y1 + 3.28, -14.92, { cast: false });
    // ponte de comando (wheelhouse) mais atrás e mais alta
    K.box(15, 2.6, 9, gel, 0, Y1 + 3.5 + 1.3, -26.0, { cast: false });
    K.add(new T.PlaneGeometry(14.6, 1.2), bandMat, 0, Y1 + 3.5 + 1.5, -21.48, { cast: false });
    K.box(15.6, 0.18, 9.6, gel, 0, Y1 + 6.2, -26.0, { cast: false });
    K.col(-12.5, -15.6, 12.5, -15.0, 1);
    // solário no teto do bloco de cima (decoração, fora da área jogável)
    deckPiece(-10.4, -21.4, 10.4, -15.0, Y1 + 3.51);
    rail(-10.6, -15.05, 10.6, -15.05, Y1 + 3.5, 0.9);
    [-9.2, -7.8, 7.8, 9.2].forEach((x, k) => lounger(x, -17.2, 0, Y1 + 3.5, [0xff7a62, 0xf6f3ec, 0x2ec4b6, 0xf6f3ec][k]));
    K.cyl(1.2, 1.2, 0.45, gel, -6.6, Y1 + 3.72, -20.0, {}, 20); K.add(new T.CircleGeometry(1.05, 20).rotateX(-Math.PI / 2), K.glow(0x40d0e0, 0.9), -6.6, Y1 + 3.96, -20.0, { cast: false });
    // convés de proa com heliponto (visto da luneta)
    { const t = K.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#3a3d44'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f6f3ec'; g.lineWidth = 8; g.beginPath(); g.arc(128, 128, 100, 0, 7); g.stroke(); g.strokeStyle = '#f2c14e'; g.lineWidth = 5; g.beginPath(); g.arc(128, 128, 116, 0, 7); g.stroke(); g.fillStyle = '#f6f3ec'; g.font = '700 130px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', 128, 136); });
      K.add(new T.CircleGeometry(7, 40).rotateX(-Math.PI / 2), K.texMat(t, { roughness: 0.7 }), 0, 0.01, -46, { cast: false }); }
    deckPiece(-12.6, -58, 12.6, -30, -0.005);

    // ------------------------------------------------------------ escada para o flybridge (boreste)
    { const x0 = 9.6, x1 = 11.0, n = 16, run = 4.4 / n;
      for (let i = 0; i < n; i++) { const y = (i + 1) * 0.2, z = -3.6 - (i + 0.5) * run; K.box(x1 - x0, 0.05, run + 0.04, teakDark, (x0 + x1) / 2, y, z); K.box(x1 - x0 - 0.06, 0.012, 0.02, K.glow(0xffd8a0, 1.6), (x0 + x1) / 2, y - 0.03, z + run / 2, { cast: false }); }
      const L = Math.hypot(4.4, 3.2), a = Math.atan2(3.2, 4.4);
      for (const x of [x0 - 0.04, x1 + 0.04]) { K.box(0.06, 0.32, L, gel, x, 1.55, -5.8, { rx: a }); K.add(new T.CylinderGeometry(0.03, 0.03, L, 6).rotateX(Math.PI / 2), chrome, x, 2.45, -5.8, { rx: a, cast: false }); for (let k = 0; k < 4; k++) { const zz = -3.9 - k * 1.2, sy = (-3.6 - zz) / 4.4 * 3.2; K.cyl(0.018, 0.018, 0.9, chrome, x, sy + 0.45, zz, { cast: false }, 6); } }
      K.box(x1 - x0 + 0.1, 3.0, 0.1, gel, (x0 + x1) / 2, 1.5, -8.2, { cast: false });
      K.col(9.4, -9.0, 11.2, -3.55);
    }

    // ------------------------------------------------------------ piscina de borda infinita (popa)
    const caustTex = K.canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#7ad8e6'; g.fillRect(0, 0, w, h);
      for (let k = 0; k < 70; k++) { g.strokeStyle = `rgba(255,255,255,${0.25 + R() * 0.4})`; g.lineWidth = 1 + R() * 2.5; g.beginPath(); const x = R() * w, y = R() * h, r = 8 + R() * 22; for (let j = 0; j <= 6; j++) { const a = j / 6 * Math.PI * 2; const rr = r * (0.7 + R() * 0.5); j ? g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : g.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.stroke(); }
    }, [3, 2]);
    const poolMat = new T.MeshStandardMaterial({ color: 0x5ad6e8, map: caustTex, emissive: 0x1fb6d0, emissiveMap: caustTex, emissiveIntensity: 0.75, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.86, envMapIntensity: 1.3 });
    const tileTex = K.canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 16; j++) { const v = R(); g.fillStyle = `rgb(${20 + v * 30},${110 + v * 50},${150 + v * 50})`; g.fillRect(i * 16 + 1, j * 16 + 1, 14, 14); } }, [4, 3]);
    const tileMat = K.texMat(tileTex, { roughness: 0.3 });
    { const x0 = -7.0, x1 = 1.0, z0 = 4.6, z1 = 9.55, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, d = 1.2;
      K.box(x1 - x0, 0.05, z1 - z0, tileMat, cx, -d, cz, { cast: false });
      K.box(x1 - x0, d, 0.06, tileMat, cx, -d / 2, z0, { cast: false }); K.box(x1 - x0, d - 0.3, 0.06, tileMat, cx, -d / 2 - 0.15, 9.45, { cast: false });
      for (const x of [x0, x1]) K.box(0.06, d, z1 - z0, tileMat, x, -d / 2, cz, { cast: false });
      // borda de mármore nas três bordas secas
      K.box(x1 - x0 + 0.5, 0.06, 0.25, marble, cx, 0.03, z0 - 0.1, { cast: false });
      for (const x of [x0 - 0.1, x1 + 0.1]) K.box(0.25, 0.06, z1 - z0, marble, x, 0.03, cz, { cast: false });
      // espelho d'água rente ao deck, transbordando na popa
      K.add(new T.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2), poolMat, cx, -0.04, cz, { cast: false });
      K.add(new T.PlaneGeometry(x1 - x0, 0.5), poolMat, cx, -0.3, z1 + 0.01, { cast: false });
      K.col(x0 - 0.05, z0 - 0.05, x1 + 0.05, 9.4);
      // luzes subaquáticas (pontos na parede)
      const lamps = []; for (let k = 0; k < 6; k++) lamps.push(K.sphere(0.07, K.glow(0xbff6ff, 2.2), x0 + 0.7 + k * 1.3, -0.6, z0 + 0.05, { cast: false }, 8, 6));
      const poolGlow = K.pool(cx, cz, 4.6, 0x40e0ff, 0.3, 0.02);
      const poolLight = K.plight(cx, 0.6, cz, 0x5fe4ff, 1.0, 7);
      // painel da piscina (missão)
      K.box(0.25, 1.0, 0.18, chrome, -7.4, 0.5, 4.4); const pBtn = K.box(0.14, 0.14, 0.02, K.glow(0x40e0ff, 1.6), -7.4, 0.85, 4.5, { cast: false }); K.colR(-7.4, 4.4, 0.15);
      // boias de piscina: flamingo e rosquinha
      const flam = K.group(-4.6, 0.0, 6.6, 0.7); K.torus(0.42, 0.14, K.mat(0xff8fb0, { roughness: 0.4 }), 0, 0.05, 0, { parent: flam, rx: Math.PI / 2 }); K.add(new T.TorusGeometry(0.28, 0.06, 6, 12, Math.PI * 1.2), K.mat(0xff8fb0, { roughness: 0.4 }), 0.35, 0.35, 0, { parent: flam, rz: 0.3 }); K.sphere(0.09, K.mat(0xff8fb0), 0.25, 0.62, 0, { parent: flam }); K.cone(0.04, 0.12, K.mat(0x16161a), 0.16, 0.6, 0, { parent: flam, rz: 1.6 });
      const donut = K.group(-1.2, 0.0, 7.8); K.torus(0.38, 0.13, K.mat(0xf6e0b0, { roughness: 0.4 }), 0, 0.05, 0, { parent: donut, rx: Math.PI / 2 }); K.torus(0.38, 0.135, K.mat(0xff5d8f, { roughness: 0.4 }), 0, 0.09, 0, { parent: donut, rx: Math.PI / 2, s: [1, 1, 0.5] });
      K.tick((dt, t) => { flam.position.y = Math.sin(t * 1.3) * 0.03; flam.rotation.y = 0.7 + Math.sin(t * 0.2) * 0.4; donut.position.y = Math.sin(t * 1.1 + 1) * 0.03; donut.position.x = -1.2 + Math.sin(t * 0.15) * 0.5; caustTex.offset.set(t * 0.02, Math.sin(t * 0.3) * 0.05); });
      // quem está na água
      [[-5.6, 6.0], [-3.4, 5.6], [-1.6, 6.0], [-5.8, 8.4], [-0.2, 8.4]].forEach(([x, z]) => K.slot(x, z, x, z + 1, 'tub'));
      const poolMat0 = { c: poolMat.color.getHex(), e: poolMat.emissive.getHex() };
      const setPool = (c, e, l) => { poolMat.color.set(c); poolMat.emissive.set(e); poolGlow.material.color.set(l).multiplyScalar(0.7); poolLight.color.set(l); aquaWin.material.color.set(l).multiplyScalar(1.2); lamps.forEach(m => m.material.color.set(l).multiplyScalar(2.2)); pBtn.material.color.set(l).multiplyScalar(1.6); };
      K.tell('piscina', (live) => { setPool(0xd070ff, 0xc020d0, 0xff40e0); poolLight.intensity = 1.8; if (live) K.anim(1.4, e => { poolLight.intensity = Math.sin(e * 30) > 0 ? 2.2 : 0.3; }); },
        () => { setPool(poolMat0.c, poolMat0.e, 0x40e0ff); poolLight.intensity = 1.0; });
    }

    // ------------------------------------------------------------ hidromassagem (boreste da popa)
    { const cx = 7.5, cz = 6.5;
      K.cyl(1.5, 1.55, 0.5, gel, cx, 0.25, cz, {}, 28); K.torus(1.5, 0.06, marble, cx, 0.5, cz, { rx: Math.PI / 2 }, 6, 32);
      const jw = new T.MeshStandardMaterial({ color: 0x8ae8f0, map: caustTex, emissive: 0x30c8d8, emissiveMap: caustTex, emissiveIntensity: 0.8, roughness: 0.05, transparent: true, opacity: 0.9 });
      K.add(new T.CircleGeometry(1.36, 28).rotateX(-Math.PI / 2), jw, cx, 0.44, cz, { cast: false });
      const bl = []; for (let k = 0; k < 36; k++) bl.push([cx + Math.cos(k * 2.4) * (0.3 + (k % 5) * 0.2), 0.45, cz + Math.sin(k * 2.4) * (0.3 + (k % 5) * 0.2), 0, 1]);
      const bub = K.inst(new T.SphereGeometry(0.035, 6, 4), K.mat(0xffffff, { transparent: true, opacity: 0.8, roughness: 0.1 }), bl, { cast: false });
      const dm = new T.Object3D();
      K.tick((dt, t) => { for (let k = 0; k < bl.length; k++) { const u = (t * 0.8 + k * 0.137) % 1; dm.position.set(bl[k][0] + Math.sin(t * 3 + k) * 0.03, 0.44 + u * 0.05, bl[k][2]); dm.scale.setScalar(0.5 + u); dm.updateMatrix(); bub.setMatrixAt(k, dm.matrix); } bub.instanceMatrix.needsUpdate = true; });
      K.pool(cx, cz, 2.4, 0x40e0ff, 0.18, 0.03); K.plight(cx, 1.2, cz, 0x7fe8ff, 0.5, 4.5);
      // toalhas enroladas e balde de champanhe na borda
      for (let k = 0; k < 3; k++) K.add(new T.CylinderGeometry(0.1, 0.1, 0.5, 10).rotateZ(Math.PI / 2), K.mat([0xf6f3ec, 0x1f2a44, 0xf6f3ec][k]), cx - 1.0 + k * 0.22, 0.6, cz - 1.25, { cast: false });
      K.cyl(0.1, 0.08, 0.2, chrome, cx + 1.1, 0.6, cz - 0.95, { cast: false }, 12);
      K.colR(cx, cz, 1.45);
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.6; K.slot(cx + Math.cos(a) * 0.75, cz + Math.sin(a) * 0.75, cx, cz, 'tub'); }
    }

    // ------------------------------------------------------------ espreguiçadeiras e sun pads
    lounger(-10.0, 5.6, Math.PI, 0, 0x2ec4b6); lounger(-11.5, 5.6, Math.PI, 0, 0xff7a62);
    K.col(-12.0, 4.6, -9.6, 6.6); K.slot(-10.0, 5.5, -10.0, 9, 'lie'); K.slot(-11.5, 5.5, -11.5, 9, 'lie');
    // sun pads de boreste (meio do deck)
    for (const z of [-0.2, 2.3]) { K.add(K.rbox(1.9, 0.35, 2.1, 0.08), leatherW, 11.4, 0.18, z); K.add(K.rbox(1.8, 0.12, 2.0, 0.05), linenW, 11.4, 0.42, z); K.add(K.rbox(1.6, 0.18, 0.3, 0.08), cushionN, 11.4, 0.55, z - 0.82); K.box(0.6, 0.012, 1.2, K.mat(0xf2c14e, { roughness: 0.95 }), 11.2, 0.49, z + 0.3, { cast: false }); K.col(10.45, z - 1.05, 12.4, z + 1.05); K.slot(11.2, z + 0.1, 11.2, z + 3, 'lie'); }
    // espreguiçadeira com protetor solar e revista
    K.cyl(0.03, 0.03, 0.14, K.mat(0xffa040), 12.0, 0.55, 2.9, { cast: false }, 8); K.box(0.22, 0.01, 0.3, K.mat(0xc8322f), 10.9, 0.49, -0.6, { ry: 0.3, cast: false });

    // ------------------------------------------------------------ bar de mármore (bombordo)
    { const x = -11.35;
      K.box(1.0, 1.05, 5.6, K.mat(0x1b1b20, { roughness: 0.25, metalness: 0.3 }), x, 0.52, -4.8);
      const fl = []; for (let k = 0; k < 26; k++) fl.push([x + 0.51, 0.52, -7.5 + k * 0.21]); K.inst(new T.CylinderGeometry(0.05, 0.05, 1.0, 8), goldLine, fl, { cast: false });
      K.box(1.25, 0.08, 5.8, marble, x, 1.09, -4.8);
      K.add(new T.CylinderGeometry(0.025, 0.025, 5.4, 8).rotateX(Math.PI / 2), goldLine, x + 0.75, 0.22, -4.8, { cast: false });
      for (let k = 0; k < 4; k++) K.box(0.26, 0.03, 0.03, goldLine, x + 0.62, 0.22, -7.2 + k * 1.6, { cast: false });
      K.box(0.4, 0.95, 5.6, K.mat(0x1b1b20, { roughness: 0.3 }), -12.4, 0.48, -4.8);
      K.box(0.42, 0.05, 5.6, marble, -12.4, 0.97, -4.8);
      // prateleira iluminada de garrafas (baixa, para não tapar a lateral)
      K.box(0.3, 0.9, 5.4, K.mat(0x2a1a10), -12.45, 1.45, -4.8, { cast: false }); K.box(0.32, 0.03, 5.4, K.glow(0xffc070, 1.6), -12.4, 1.42, -4.8, { cast: false });
      const bc = [0x2c6e49, 0xe8e0c8, 0x7a1f2a, 0xc9a227, 0x1e3a8b, 0xff7a2a, 0x3a3a3a, 0xf2f2f2];
      for (const y of [1.0, 1.45]) { const l = [], cs = []; for (let k = 0; k < 22; k++) { l.push([-12.42, y, -7.4 + k * 0.245, 0, 0.9 + R() * 0.3]); cs.push(bc[(k * 3 + (y > 1.2 ? 1 : 0)) % bc.length]); }
        instC(new T.LatheGeometry([[0, 0], [0.04, 0], [0.042, 0.02], [0.042, 0.18], [0.015, 0.25], [0.012, 0.32], [0, 0.32]].map(p => new T.Vector2(p[0], p[1])), 8), K.mat(0xffffff, { roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.88, emissive: 0x222222 }), l, cs, { cast: false }); }
      // champanhe no balde grande, coqueteleira, taças e limões
      K.lathe([[0, 0], [0.2, 0], [0.24, 0.32], [0.26, 0.34], [0, 0.34]], chrome, x, 1.13, -6.6, { cast: false }, 18);
      for (let k = 0; k < 4; k++) K.lathe([[0, 0], [0.045, 0], [0.048, 0.2], [0.018, 0.3], [0.016, 0.4], [0, 0.4]], K.mat(0x1a3a1a, { roughness: 0.15, metalness: 0.2 }), x + Math.cos(k * 1.6) * 0.1, 1.2, -6.6 + Math.sin(k * 1.6) * 0.1, { cast: false, rz: 0.15 * Math.cos(k) }, 8);
      K.cyl(0.04, 0.035, 0.2, chrome, x + 0.2, 1.23, -5.6, { cast: false }, 10);
      const cl = []; for (let k = 0; k < 10; k++) cl.push([x + 0.3 - (k % 2) * 0.2, 1.13, -5.2 + Math.floor(k / 2) * 0.3]);
      K.inst(new T.CylinderGeometry(0.045, 0.012, 0.05, 10).translate(0, 0.12, 0), K.mat(0xffd9a0, { transparent: true, opacity: 0.8, emissive: 0xf2c14e, emissiveIntensity: 0.3, roughness: 0.1 }), cl, { cast: false });
      K.inst(new T.CylinderGeometry(0.004, 0.004, 0.1, 4).translate(0, 0.05, 0), K.glass, cl, { cast: false });
      for (let k = 0; k < 6; k++) K.sphere(0.035, K.mat(k % 2 ? 0xf2d23e : 0x7ac142), x - 0.25 + (k % 3) * 0.07, 1.16, -3.1 + Math.floor(k / 3) * 0.07, { cast: false }, 8, 6);
      K.cyl(0.12, 0.1, 0.08, K.mat(0xf6f3ec), x - 0.25, 1.17, -3.05, { cast: false }, 12);
      K.sign('LUNA BAR', 1.8, 0.4, -12.29, 2.1, -4.8, { ry: Math.PI / 2, neon: true, color: '#ffd8a0', font: 'Didot, Georgia, serif', size: 84, k: 2.0 });
      K.col(-12.6, -7.65, -10.8, -1.95);
      // banquetas cromadas com assento branco
      [-7.0, -6.0, -5.0, -4.0, -3.0].forEach(z => { K.cyl(0.2, 0.2, 0.06, leatherW, -10.45, 0.76, z, {}, 14); K.cyl(0.025, 0.06, 0.74, chrome, -10.45, 0.37, z, {}, 8); K.cyl(0.18, 0.18, 0.02, chrome, -10.45, 0.01, z, { cast: false }, 14); });
      [-7.3, -6.5, -5.5, -4.5, -3.5, -2.6].forEach(z => K.slot(-10.15, z, -11.2, z, 'bar'));
      K.plight(-10.8, 2.0, -4.8, 0xffc080, 1.3, 6);
    }

    // ------------------------------------------------------------ lounge de sofás brancos + mesa de centro (missão: balde de gelo)
    { K.rug(-4.5, -5.4, 6.0, 4.4, (g, w, h) => { g.fillStyle = '#e8e0d0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9b89a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); for (let k = 0; k < 40; k++) { g.strokeStyle = 'rgba(160,140,110,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, k * h / 40); g.lineTo(w, k * h / 40); g.stroke(); } K.grain(g, w, h, 6); });
      K.sofa(-4.5, -7.4, 4.2, 0, { cloth: leatherW, pillow: 0x1f2a44 }); K.col(-6.6, -7.8, -2.4, -7.0);
      K.sofa(-7.0, -5.0, 2.8, Math.PI / 2, { cloth: leatherW, pillow: 0xd9a441 }); K.col(-7.4, -6.4, -6.6, -3.6);
      K.sofa(-2.0, -5.0, 2.8, -Math.PI / 2, { cloth: leatherW, pillow: 0x2ec4b6 }); K.col(-2.4, -6.4, -1.6, -3.6);
      [[-5.8, -7.05], [-3.2, -7.05]].forEach(([x, z]) => K.slot(x, z, x, -3, 'sit'));
      [[-6.65, -5.6], [-6.65, -4.4]].forEach(([x, z]) => K.slot(x, z, 0, z, 'sit'));
      [[-2.35, -5.6], [-2.35, -4.4]].forEach(([x, z]) => K.slot(x, z, -9, z, 'sit'));
      // mesa de centro de travertino
      const cx = -4.5, cz = -5.3;
      K.cyl(0.7, 0.7, 0.08, marble, cx, 0.4, cz, {}, 28); K.cyl(0.45, 0.5, 0.36, K.mat(0xd8c8a8, { roughness: 0.8 }), cx, 0.18, cz, {}, 20);
      K.colR(cx, cz, 0.6);
      // balde de gelo com a garrafa (missão)
      K.lathe([[0, 0], [0.12, 0], [0.15, 0.24], [0.16, 0.25], [0, 0.25]], chrome, cx, 0.44, cz, { cast: false }, 16);
      const ice = []; for (let k = 0; k < 8; k++) ice.push([cx + Math.cos(k) * 0.08, 0.68, cz + Math.sin(k * 1.3) * 0.08, k, 1]); K.inst(new T.BoxGeometry(0.05, 0.05, 0.05), K.mat(0xeaf6ff, { transparent: true, opacity: 0.8, roughness: 0.05 }), ice, { cast: false });
      const btlG = K.group(cx, 0.5, cz); btlG.rotation.z = 0.22;
      const btlM0 = K.mat(0x1d3a22, { roughness: 0.12, metalness: 0.3 });
      const btl = K.lathe([[0, 0], [0.05, 0], [0.052, 0.24], [0.02, 0.34], [0.018, 0.44], [0, 0.44]], btlM0, 0, 0, 0, { parent: btlG, cast: false }, 12);
      const foil = K.cyl(0.021, 0.021, 0.08, goldLine, 0, 0.42, 0, { parent: btlG, cast: false }, 8);
      const lab = K.cyl(0.054, 0.054, 0.08, K.mat(0xf3e6c0), 0, 0.14, 0, { parent: btlG, cast: false }, 12);
      const btlHalo = K.halo(cx, 0.9, cz, 1.2, 0xff3fa0, 1.6); btlHalo.visible = false;
      for (let k = 0; k < 4; k++) { const a = k * 1.5 + 0.4; K.cyl(0.035, 0.012, 0.12, K.mat(0xf2d070, { transparent: true, opacity: 0.85, emissive: 0xf2c14e, emissiveIntensity: 0.3 }), cx + Math.cos(a) * 0.45, 0.58, cz + Math.sin(a) * 0.45, { cast: false }, 8); K.cyl(0.004, 0.004, 0.12, K.glass, cx + Math.cos(a) * 0.45, 0.48, cz + Math.sin(a) * 0.45, { cast: false }, 4); }
      K.cyl(0.14, 0.1, 0.05, K.mat(0xf6f3ec), cx + 0.2, 0.47, cz + 0.35, { cast: false }, 14); for (let k = 0; k < 7; k++) K.sphere(0.028, K.mat(0xd0202a, { roughness: 0.5 }), cx + 0.2 + Math.cos(k) * 0.06, 0.51, cz + 0.35 + Math.sin(k) * 0.06, { cast: false }, 6, 4);
      K.cyl(0.08, 0.08, 0.025, K.mat(0x2a2a30, { metalness: 0.5, roughness: 0.3 }), cx - 0.35, 0.455, cz + 0.15, { cast: false }, 12);
      K.box(0.3, 0.01, 0.4, K.mat(0x2e5fa8), cx - 0.3, 0.445, cz - 0.3, { ry: 0.4, cast: false }); K.box(0.3, 0.01, 0.4, K.mat(0xf6f3ec), cx - 0.25, 0.455, cz - 0.28, { ry: 0.6, cast: false });
      const pinkM = K.glow(0xff4fb0, 1.8);
      K.tell('balde', (live) => { btl.material = pinkM; lab.material = K.mat(0x16161a); foil.material = K.glow(0xffffff, 2); btlHalo.visible = true; if (live) K.anim(1.2, e => { btlG.rotation.z = 0.22 + Math.sin(e * Math.PI * 3) * 0.3; btlHalo.scale.setScalar(2.4 * (1 + Math.sin(e * 20) * 0.3)); }); else btlG.rotation.z = 0.22; },
        () => { btl.material = btlM0; lab.material = K.mat(0xf3e6c0); foil.material = goldLine; btlHalo.visible = false; btlG.rotation.z = 0.22; });
      K.plight(-4.5, 2.4, -5.6, 0xffc890, 1.0, 6);
      // plantas: oliveiras em vasos brancos
      for (const [x, z] of [[-8.3, -8.5], [-0.9, -8.5], [-8.3, -2.8]]) K.plant(x, z, 'bush', { pot: K.mat(0xf2efe8, { roughness: 0.4 }), s: 1.1 });
      // jogo de gamão aberto no sofá
      K.box(0.4, 0.03, 0.3, K.mat(0x7a2a10), -2.1, 0.47, -6.1, { cast: false });
    }

    // ------------------------------------------------------------ mesa de sushi do chef (missão: pendrive)
    const sushiFx = {};
    { const cx = 4.2, cz = -5.9;
      K.box(4.4, 0.9, 0.9, lacquer, cx, 0.45, cz); K.box(4.6, 0.07, 1.1, hinoki, cx, 0.94, cz);
      K.box(4.3, 0.04, 0.02, K.glow(0xffd8a0, 1.4), cx, 0.12, cz + 0.46, { cast: false });
      K.col(cx - 2.3, cz - 0.55, cx + 2.3, cz + 0.55);
      // tábuas (geta) com nigiris
      const rice = [], fishT = [], fishS = [], fishW = [];
      for (let b = 0; b < 4; b++) { const bx = cx - 1.8 + b * 0.62 + (b > 1 ? 1.0 : 0); K.box(0.5, 0.05, 0.28, K.mat(0xc9a06a, { roughness: 0.7 }), bx, 1.0, cz + 0.2, { cast: false });
        for (let k = 0; k < 5; k++) { const x = bx - 0.18 + k * 0.09; rice.push([x, 1.045, cz + 0.2, 0, 1]); [fishT, fishS, fishW][(k + b) % 3].push([x, 1.07, cz + 0.2, 0, 1]); } }
      K.inst(new T.BoxGeometry(0.06, 0.035, 0.1), K.mat(0xfaf6ee, { roughness: 0.9 }), rice, { cast: false });
      K.inst(new T.BoxGeometry(0.065, 0.016, 0.12), K.mat(0xc8203a, { roughness: 0.4 }), fishT, { cast: false });
      K.inst(new T.BoxGeometry(0.065, 0.016, 0.12), K.mat(0xff8a4a, { roughness: 0.4 }), fishS, { cast: false });
      K.inst(new T.BoxGeometry(0.065, 0.016, 0.12), K.mat(0xf2ead8, { roughness: 0.4 }), fishW, { cast: false });
      // barco de sushi (funamori) no centro, com makis
      const boat = K.group(cx, 0.98, cz - 0.05);
      { const sh = new T.Shape(); sh.moveTo(-0.55, 0); sh.quadraticCurveTo(0, -0.22, 0.55, 0); sh.quadraticCurveTo(0, 0.22, -0.55, 0); const bg = new T.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false }); bg.rotateX(-Math.PI / 2); K.add(bg, K.mat(0xb07a42, { roughness: 0.6 }), 0, 0, 0, { parent: boat }); K.box(0.02, 0.35, 0.02, K.mat(0xb07a42), -0.3, 0.3, 0, { parent: boat }); K.box(0.01, 0.2, 0.18, K.mat(0xf6f3ec, { side: T.DoubleSide }), -0.29, 0.38, 0.02, { parent: boat, cast: false }); }
      const mk = []; for (let k = 0; k < 8; k++) mk.push([-0.35 + k * 0.1, 0.16, (k % 2) * 0.07 - 0.035, 0, 1]);
      K.inst(new T.CylinderGeometry(0.04, 0.04, 0.05, 10), K.mat(0x1a2a1a, { roughness: 0.7 }), mk, { cast: false, parent: boat });
      K.inst(new T.CylinderGeometry(0.03, 0.03, 0.052, 10), K.mat(0xfaf6ee), mk, { cast: false, parent: boat });
      const usb = K.cyl(0.045, 0.045, 0.06, K.mat(0x1a2a1a), 0.38, 0.16, 0.0, { parent: boat, cast: false }, 10);
      sushiFx.usb = usb;
      for (let k = 0; k < 5; k++) K.add(new T.SphereGeometry(0.05, 8, 5).scale(1.4, 0.4, 1), K.mat(0xff8a4a, { roughness: 0.4 }), 0.1 + k * 0.06, 0.15, -0.04 + (k % 2) * 0.06, { parent: boat, cast: false, ry: k });
      // gengibre, wasabi, shoyu, hashis, sakê
      for (let k = 0; k < 6; k++) { const x = cx - 2.0 + k * 0.8; K.cyl(0.05, 0.04, 0.015, K.mat(0x16161a, { roughness: 0.2 }), x, 0.985, cz + 0.42, { cast: false }, 12); K.box(0.008, 0.008, 0.22, K.mat(0xd9b07a), x + 0.09, 0.985, cz + 0.4, { cast: false }); K.box(0.008, 0.008, 0.22, K.mat(0xd9b07a), x + 0.105, 0.985, cz + 0.4, { cast: false }); }
      K.sphere(0.04, K.mat(0x8ac040), cx + 0.8, 1.0, cz - 0.2, { cast: false }, 8, 6); for (let k = 0; k < 4; k++) K.box(0.05, 0.008, 0.05, K.mat(0xf6b8b8), cx + 0.95 + k * 0.03, 0.995 + k * 0.005, cz - 0.2, { ry: k, cast: false });
      K.lathe([[0, 0], [0.06, 0], [0.07, 0.12], [0.03, 0.2], [0.025, 0.26], [0, 0.26]], K.mat(0xf6f3ec, { roughness: 0.3 }), cx + 1.9, 0.98, cz - 0.25, { cast: false }, 12);
      for (let k = 0; k < 3; k++) K.box(0.07, 0.06, 0.07, K.mat(0xe2c79a), cx + 1.7 - k * 0.12, 1.01, cz - 0.1, { cast: false });
      // tábua de corte e faca do chef
      K.box(0.6, 0.04, 0.35, hinoki, cx, 0.99, cz - 0.38, { cast: false }); K.box(0.32, 0.005, 0.03, chrome, cx + 0.05, 1.015, cz - 0.38, { ry: 0.2, cast: false }); K.add(new T.SphereGeometry(0.08, 8, 6).scale(2.2, 0.5, 0.9), K.mat(0xb8202a, { roughness: 0.4 }), cx - 0.12, 1.03, cz - 0.38, { cast: false });
      // ikebana
      K.cyl(0.06, 0.08, 0.18, lacquer, cx - 2.0, 1.07, cz - 0.3, { cast: false }, 10); K.cyl(0.006, 0.006, 0.6, K.mat(0x3a5a2a), cx - 2.0, 1.4, cz - 0.3, { rz: 0.3, cast: false }, 4); K.sphere(0.05, K.mat(0xff5d8f), cx - 2.08, 1.68, cz - 0.3, { cast: false }, 8, 6);
      // lanternas de papel (chōchin) nos postes de bambu
      sushiFx.lan = [];
      for (const x of [cx - 2.45, cx + 2.45]) { K.cyl(0.03, 0.035, 2.3, K.mat(0xc8b070, { roughness: 0.7 }), x, 1.15, cz - 0.2, {}, 6); const L = K.add(new T.SphereGeometry(0.22, 12, 10).scale(1, 1.25, 1), K.glow(0xff5a3a, 1.5), x, 2.05, cz - 0.2, { cast: false }); K.cyl(0.12, 0.12, 0.05, lacquer, x, 2.34, cz - 0.2, { cast: false }, 10); K.cyl(0.12, 0.12, 0.05, lacquer, x, 1.76, cz - 0.2, { cast: false }, 10); sushiFx.lan.push(L); }
      const usbHalo = K.halo(cx + 0.38, 1.25, cz - 0.05, 1.1, 0x3a8aff, 1.8); usbHalo.visible = false;
      K.plight(cx, 2.0, cz + 0.2, 0xffb890, 1.1, 5);
      const usbM0 = usb.material;
      K.tell('sushi', (live) => { usb.material = K.glow(0x3a8aff, 3); usbHalo.visible = true; sushiFx.lan.forEach(L => L.material = K.glow(0x4a90ff, 1.8)); if (live) K.anim(1.2, e => { usbHalo.scale.setScalar(2.2 * (1 + Math.sin(e * 24) * 0.4)); sushiFx.lan.forEach(L => L.rotation.z = Math.sin(e * 12) * 0.3 * (1 - e)); }); },
        () => { usb.material = usbM0; usbHalo.visible = false; sushiFx.lan.forEach(L => { L.material = K.glow(0xff5a3a, 1.5); L.rotation.z = 0; }); });
      [2.4, 3.3, 5.1, 6.0].forEach(x => K.slot(x, cz + 1.2, x, cz, 'bar'));
      // flores altas atrás do chef
      K.plant(7.4, -8.5, 'bush', { pot: K.mat(0x14213d, { roughness: 0.3 }), s: 1.0 });
    }

    // ------------------------------------------------------------ pista central: rosa dos ventos marchetada
    { const t = K.canvasTex(512, 512, (g, w, h) => { g.clearRect(0, 0, w, h); g.translate(w / 2, h / 2); g.strokeStyle = '#3a2414'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 236, 0, 7); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 218, 0, 7); g.stroke();
        for (let k = 0; k < 16; k++) { const L = k % 4 === 0 ? 210 : k % 2 ? 110 : 150; g.save(); g.rotate(k * Math.PI / 8); g.fillStyle = k % 2 ? '#e8d8b0' : '#3a2414'; g.beginPath(); g.moveTo(0, -L); g.lineTo(18, 0); g.lineTo(0, 18); g.lineTo(-18, 0); g.fill(); g.fillStyle = k % 2 ? '#3a2414' : '#e8d8b0'; g.beginPath(); g.moveTo(0, -L); g.lineTo(18, 0); g.lineTo(0, 0); g.fill(); g.restore(); }
        g.fillStyle = '#d9a441'; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); });
      K.add(new T.CircleGeometry(2.6, 48).rotateX(-Math.PI / 2), K.texMat(t, { transparent: true, roughness: 0.5 }), 0.4, 0.008, 0.6, { cast: false });
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = -1.4 + i * 1.2, z = -1.2 + j * 1.2; if (Math.hypot(x - 0.4, z - 0.6) < 2.4) K.slot(x, z, 0.4, 0.6, 'dance'); }
      // varais de lâmpadas da laje do flybridge até postes da popa
      for (const [ax, bx] of [[-9, -10.5], [-3, -6.5], [3, 3.0], [9, 9.0]]) K.bulbs([ax, Y1 - 0.25, -8.1], [bx, 2.4, 4.0], 14, 0.6, 0xffd08a, 3.0);
      for (const x of [-10.5, -6.5, 3.0, 9.0]) { K.cyl(0.035, 0.05, 2.4, chrome, x, 1.2, 4.05, { cast: false }, 8); K.colR(x, 4.05, 0.08); }
      K.plight(0.4, 3.0, 0.6, 0xffc890, 1.4, 9);
      K.pool(0.4, 0.6, 3.2, 0xffb070, 0.32);
    }

    // ------------------------------------------------------------ mesas altas cromadas com tampo de mármore
    for (const [x, z, n] of [[-8.4, 0.4, 4], [-8.8, 3.0, 3], [-5.6, 2.8, 4], [4.4, 3.4, 4], [4.6, -2.4, 3], [-4.6, -1.6, 3], [7.4, -2.2, 3]]) {
      K.table(x, z, { r: 0.4, h: 1.05, cloth: false, top: marble, leg: chrome, candle: true, flower: R() < 0.5 ? 0xff5d8f : 0xf6f3ec, glasses: 3, slots: n });
    }
    // conversa solta pelo deck
    [[-10.0, -0.6], [-6.4, 0.6], [-2.6, 3.6], [1.6, 3.4], [6.2, 4.0], [8.8, 2.9], [-1.0, -3.4], [1.2, -3.0], [-9.4, 7.6], [-6.4, -8.4], [-2.6, -8.4], [2.6, -8.4], [6.0, -8.4], [10.0, 6.4], [2.6, 8.5]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), z + (R() - 0.5), 'talk'));
    // vista: gente encostada no guarda-corpo olhando o porto
    [[-11.9, 2.2], [-11.9, -0.8], [11.9, 5.0], [11.9, -3.2], [-12.0, 8.8], [-7.6, 8.9], [6.0, 8.9], [9.6, 8.9]].forEach(([x, z]) => K.slot(x, z, x + (x < -11 ? -3 : x > 11 ? 3 : 0), z + (Math.abs(x) > 11 ? 0 : 3), 'view'));
    // selfie com o pôr do sol
    K.slot(-5.0, 4.0, -5.0, 9, 'selfie'); K.slot(10.6, 7.8, 10.6, 12, 'selfie');

    // ------------------------------------------------------------ guarda-sol de boreste (missão)
    { const cx = 7.0, cz = 0.8;
      K.table(cx, cz, { r: 0.5, h: 0.74, cloth: false, top: marble, leg: chrome, candle: false, flower: 0xf2c14e, glasses: 2 });
      K.chair(cx - 0.9, cz - 0.2, Math.PI / 2 - 0.2, { seat: leatherW, frame: chrome, back: leatherW }); K.chair(cx + 0.2, cz - 0.95, 0.1, { seat: leatherW, frame: chrome, back: leatherW });
      K.slot(cx - 0.9, cz - 0.2, cx, cz, 'sit'); K.slot(cx + 0.2, cz - 0.95, cx, cz, 'sit');
      K.cyl(0.035, 0.035, 2.6, chrome, cx, 1.3, cz, {}, 8);
      const can = K.group(cx, 2.45, cz);
      const canTex = K.canvasTex(256, 64, (g, w, h) => { for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#f6f3ec' : '#14213d'; g.fillRect(k * 32, 0, 32, h); } });
      const cone = K.add(new T.ConeGeometry(1.7, 0.55, 16, 1, true), K.texMat(canTex, { side: T.DoubleSide, roughness: 0.85 }), 0, 0, 0, { parent: can });
      K.add(new T.CylinderGeometry(1.7, 1.7, 0.12, 16, 1, true), K.texMat(canTex, { side: T.DoubleSide, roughness: 0.85 }), 0, -0.32, 0, { parent: can, cast: false });
      K.sphere(0.06, goldLine, 0, 0.3, 0, { parent: can });
      const setCan = (u) => { can.scale.set(1 - u * 0.86, 1 + u * 1.8, 1 - u * 0.86); can.position.y = 2.45 - u * 0.5; };
      K.colR(cx, cz, 0.45);
      K.tell('guardasol', (live) => { if (live) K.anim(1.4, e => setCan(e)); else setCan(1); }, () => setCan(0));
    }

    // ------------------------------------------------------------ mastro da bandeira na popa (missão)
    const flagGeo = (w, h) => { const g = new T.PlaneGeometry(w, h, 10, 4); g.translate(w / 2, 0, 0); g.userData.p0 = g.attributes.position.array.slice(); return g; };
    const flags = [];
    const waveFlags = (t) => { for (const f of flags) { const p = f.geometry.attributes.position, p0 = f.geometry.userData.p0, w = f.userData.w; for (let i = 0; i < p.count; i++) { const x = p0[i * 3]; p.array[i * 3 + 2] = Math.sin(x * 5 - t * 6 + f.userData.ph) * 0.08 * (x / w); p.array[i * 3 + 1] = p0[i * 3 + 1] - (x / w) * 0.05; } p.needsUpdate = true; f.geometry.computeVertexNormals(); } };
    K.tick((dt, t) => waveFlags(t));
    { const px = 11.9, pz = 9.15;
      const pole = K.group(px, 0, pz); pole.rotation.x = 0.35;
      K.cyl(0.03, 0.04, 2.6, K.mat(0x8a5a32, { roughness: 0.4 }), 0, 1.3, 0, { parent: pole }, 8); K.sphere(0.05, goldLine, 0, 2.62, 0, { parent: pole });
      K.cyl(0.08, 0.1, 0.12, chrome, px, 0.06, pz, {}, 10); K.colR(px, pz, 0.12);
      const flagHold = K.group(0, 2.2, 0, -0.6, pole);
      const tMonaco = K.canvasTex(128, 96, (g, w, h) => { g.fillStyle = '#d4202f'; g.fillRect(0, 0, w, h / 2); g.fillStyle = '#ffffff'; g.fillRect(0, h / 2, w, h / 2); });
      const tPirata = K.canvasTex(128, 96, (g, w, h) => { g.fillStyle = '#121214'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2c14e'; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 14 : 34; g.lineTo(64 + Math.cos(a) * r, 48 + Math.sin(a) * r); } g.fill(); });
      const fm = new T.Mesh(flagGeo(1.1, 0.75), K.texMat(tMonaco, { side: T.DoubleSide, roughness: 0.8 })); fm.userData = { w: 1.1, ph: 0 }; fm.position.y = 0; flagHold.add(fm); flags.push(fm);
      K.tell('bandeira', (live) => { fm.material = K.texMat(tPirata, { side: T.DoubleSide, roughness: 0.8, emissive: 0x3a2a00, emissiveIntensity: 0.4 }); if (live) K.anim(1.6, e => { flagHold.position.y = 0.5 + e * 1.7; }); else flagHold.position.y = 2.2; },
        () => { fm.material = K.texMat(tMonaco, { side: T.DoubleSide, roughness: 0.8 }); flagHold.position.y = 2.2; });
      // rolo de cabo do marinheiro
      for (let k = 0; k < 4; k++) K.torus(0.28 - k * 0.05, 0.03, rope, -10.6, 0.04 + k * 0.03, 8.85, { rx: Math.PI / 2 }, 5, 18);
    }

    // ------------------------------------------------------------ jet-skis e tender amarrados na popa (missão: jet-ski)
    const jetski = (x, z, ry, c) => {
      const g = K.group(x, WY + 0.05, z, ry);
      K.add(K.rbox(0.95, 0.42, 2.9, 0.18), K.mat(0xf6f3ec, { roughness: 0.3 }), 0, 0.15, 0, { parent: g });
      K.add(K.rbox(0.9, 0.12, 2.0, 0.06), K.mat(c, { roughness: 0.3, metalness: 0.2 }), 0, 0.38, 0.1, { parent: g });
      K.add(K.rbox(0.38, 0.16, 1.1, 0.07), K.mat(0x16161a, { roughness: 0.5 }), 0, 0.52, 0.35, { parent: g });
      K.add(K.rbox(0.6, 0.25, 0.4, 0.08), K.mat(c, { roughness: 0.3 }), 0, 0.55, -0.5, { parent: g });
      K.add(new T.CylinderGeometry(0.02, 0.02, 0.8, 6).rotateZ(Math.PI / 2), chrome, 0, 0.75, -0.55, { parent: g, cast: false });
      K.box(0.5, 0.12, 0.2, darkGlass, 0, 0.7, -0.66, { parent: g, rx: -0.5, cast: false });
      return g;
    };
    const js1 = jetski(-8.6, 12.9, 0.05, 0xff6a2a), js2 = jetski(-6.0, 13.2, -0.1, 0x2ec4b6);
    const jsLine = sagRope([-8.6, 0.12, 9.3], [-8.6, WY + 0.4, 11.5], 0.25, 0.02);
    // tender (bote semirrígido) cinza com console e motor de popa
    const tender = K.group(6.6, WY + 0.1, 14.6, 0.08);
    { const sh = new T.Shape(); sh.moveTo(-0.95, 0); sh.lineTo(0.95, 0); sh.lineTo(0.95, 3.0); sh.quadraticCurveTo(0.9, 4.3, 0, 4.8); sh.quadraticCurveTo(-0.9, 4.3, -0.95, 3.0); sh.lineTo(-0.95, 0);
      const tube = new T.ExtrudeGeometry(sh, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 3 }); tube.rotateX(-Math.PI / 2); tube.translate(0, 0, 2.4);
      K.add(tube, K.mat(0x55595f, { roughness: 0.7 }), 0, 0, 0, { parent: tender });
      K.box(1.7, 0.05, 4.0, teakDark, 0, 0.42, 0.2, { parent: tender }); K.box(0.6, 0.7, 0.5, gel, 0, 0.8, -0.2, { parent: tender }); K.box(0.55, 0.3, 0.05, darkGlass, 0, 1.25, -0.42, { parent: tender, rx: -0.4 });
      K.add(K.rbox(1.4, 0.3, 0.6, 0.08), cushionN, 0, 0.65, 1.2, { parent: tender }); K.box(0.4, 0.8, 0.45, K.mat(0x16161a, { roughness: 0.3 }), 0, 0.55, 2.55, { parent: tender }); K.box(0.12, 0.6, 0.15, K.mat(0x16161a), 0, 0.0, 2.7, { parent: tender });
      K.sign('TENDER · LUNA', 1.4, 0.18, 0.99, 0.35, 0.5, { parent: tender, ry: Math.PI / 2, color: '#f6f3ec', font: 'Arial', size: 52 }); }
    sagRope([8.8, 0.12, 9.3], [6.6, WY + 0.5, 12.3], 0.6, 0.02);
    let jsLoose = 0;
    K.tick((dt, t) => {
      js2.position.y = WY + 0.05 + Math.sin(t * 1.4 + 1) * 0.04; js2.rotation.z = Math.sin(t * 1.1) * 0.03;
      js1.position.y = WY + 0.05 + Math.sin(t * 1.3) * 0.04; js1.rotation.z = Math.sin(t * 1.2 + 2) * 0.03 * (1 + jsLoose * 2);
      tender.position.y = WY + 0.1 + Math.sin(t * 0.9 + 0.5) * 0.05; tender.rotation.x = Math.sin(t * 0.7) * 0.02;
    });
    const jsDangle = sagRope([-8.6, 0.12, 9.3], [-8.4, -1.3, 9.75], 0.05, 0.02);
    const setJs = (u) => { jsLoose = u; js1.position.x = -8.6 - u * 2.6; js1.position.z = 12.9 + u * 4.8; js1.rotation.y = 0.05 + u * 1.1; jsLine.visible = u < 0.15; jsDangle.visible = u >= 0.15; };
    K.tell('jetski', (live) => { if (live) K.anim(2.6, e => setJs(e)); else setJs(1); }, () => setJs(0));
    // marolas brancas em volta dos barquinhos
    for (const [x, z, r] of [[-8.6, 12.9, 1.8], [-6.0, 13.2, 1.8], [6.6, 14.6, 3.0]]) K.pool(x, z, r, 0xffffff, 0.12, WY + 0.03);

    // ------------------------------------------------------------ flybridge (nível 1)
    // guarda-corpo do flybridge (abertura da escada em x 9.6..11)
    rail(-12.65, -8.08, 9.55, -8.08, Y1); rail(11.05, -8.08, 12.65, -8.08, Y1);
    rail(-12.65, -15.4, -12.65, -8.08, Y1); rail(12.65, -15.4, 12.65, -8.08, Y1);
    // cabine da DJ
    const djFx = {};
    { const g = K.group(0, Y1, -11.5);
      K.box(3.0, 1.0, 0.8, K.mat(0x16161a, { roughness: 0.3, metalness: 0.3 }), 0, 0.5, 0, { parent: g });
      K.box(3.1, 0.05, 0.9, chrome, 0, 1.02, 0, { parent: g });
      djFx.strip = K.box(2.9, 0.06, 0.02, K.glow(0xff4fa3, 2.2), 0, 0.85, 0.41, { parent: g, cast: false });
      K.sign('NOVA', 1.4, 0.35, 0, 0.45, 0.42, { parent: g, neon: true, color: '#ff8fd0', font: 'Arial Black, Arial', size: 90, k: 1.8 });
      djFx.plat = [];
      for (const s of [-1, 1]) { K.box(0.6, 0.06, 0.5, K.mat(0x2a2a30, { metalness: 0.4 }), s * 0.9, 1.07, 0, { parent: g }); const p = K.cyl(0.21, 0.21, 0.02, K.mat(0x0a0a0c, { roughness: 0.2 }), s * 0.9, 1.11, 0, { parent: g, cast: false }, 20); K.cyl(0.07, 0.07, 0.022, K.mat(s < 0 ? 0xf2c14e : 0xff5d8f), s * 0.9, 1.115, 0, { parent: g, cast: false }, 12); djFx.plat.push(p); K.box(0.02, 0.02, 0.25, chrome, s * 0.9 + 0.2, 1.13, -0.05, { parent: g, ry: 0.3, cast: false }); }
      K.box(0.5, 0.08, 0.45, K.mat(0x1a1a1e, { metalness: 0.4 }), 0, 1.08, 0, { parent: g });
      const kn = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) kn.push([-0.15 + i * 0.1, 1.13, -0.15 + j * 0.1]); K.inst(new T.CylinderGeometry(0.015, 0.015, 0.02, 8), K.glow(0x7fd0ff, 1.5), kn, { cast: false, parent: g });
      K.add(new T.TorusGeometry(0.1, 0.02, 6, 12, Math.PI), K.mat(0xff4fa3), 0.55, 1.12, 0.25, { parent: g, rx: -Math.PI / 2, cast: false });
      // caixas de som
      for (const s of [-1, 1]) { K.box(0.6, 1.5, 0.55, K.mat(0x16161a, { roughness: 0.4 }), s * 2.2, 0.75, 0, { parent: g }); for (const y of [0.45, 1.1]) { K.cyl(0.2, 0.2, 0.02, K.mat(0x2a2a30), s * 2.2, y, 0.28, { parent: g, rx: Math.PI / 2, cast: false }, 16); } const ring = K.torus(0.2, 0.02, K.glow(0xff4fa3, 2), s * 2.2, 0.45, 0.29, { parent: g, cast: false }); (djFx.rings = djFx.rings || []).push(ring); }
      K.col(-2.55, -11.95, 2.55, -11.05, 1);
      // telão de LED atrás da DJ
      K.box(5.4, 0.1, 0.1, chrome, 0, 2.55, -2.1, { parent: g }); for (const s of [-1, 1]) K.box(0.1, 2.55, 0.1, chrome, s * 2.7, 1.27, -2.1, { parent: g });
      const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96; const ctx = cv.getContext('2d');
      const ledTex = new T.CanvasTexture(cv); ledTex.encoding = T.sRGBEncoding;
      djFx.mode = 0;
      const drawLed = (t) => {
        const green = djFx.mode === 1; ctx.fillStyle = green ? '#03140a' : '#14051a'; ctx.fillRect(0, 0, 256, 96);
        for (let i = 0; i < 32; i++) { const v = 0.25 + 0.75 * Math.abs(Math.sin(t * 3.1 + i * 0.7) * Math.cos(t * 1.7 + i * 0.31)); const hh = v * 80; const hue = green ? 120 + i * 1.5 : 300 + i * 2.2; ctx.fillStyle = `hsl(${hue},95%,${45 + v * 20}%)`; for (let y = 0; y < hh; y += 6) ctx.fillRect(i * 8 + 1, 92 - y, 6, 4); }
        ctx.font = '900 44px Arial Black, Arial'; ctx.textAlign = 'center'; ctx.fillStyle = green ? '#c8ffd8' : '#ffe0f0'; ctx.fillText(green ? '♫ MAYDAY ♫' : 'LUNA ☀', 128, 46);
        ledTex.needsUpdate = true;
      };
      drawLed(0);
      djFx.led = K.add(new T.PlaneGeometry(5.2, 1.95), new T.MeshBasicMaterial({ map: ledTex, toneMapped: false, color: new T.Color(0xffffff).multiplyScalar(1.4) }), 0, 1.5, -2.06, { parent: g, cast: false });
      K.box(5.4, 2.1, 0.08, K.mat(0x16161a), 0, 1.5, -2.16, { parent: g });
      K.col(-2.8, -13.75, 2.8, -13.45, 1);
      let acc = 0;
      K.tick((dt, t) => { djFx.plat.forEach(p => p.rotation.y += dt * 3.5); acc += dt; if (acc > 0.12) { acc = 0; drawLed(t); } const b = 1 + Math.max(0, Math.sin(t * 13)) * 0.15; djFx.rings.forEach(r => r.scale.setScalar(b)); });
      djFx.light = K.plight(0, Y1 + 2.2, -10.4, 0xff70c0, 1.6, 8);
      djFx.pool = K.pool(0, -9.8, 3.0, 0xff4fa3, 0.4, Y1 + 0.02);
      K.tell('vinil', (live) => { djFx.mode = 1; drawLed(0); djFx.strip.material = K.glow(0x40ff80, 2.4); djFx.light.color.set(0x50ff90); djFx.pool.material.color.set(0x40ff80).multiplyScalar(0.4); djFx.rings.forEach(r => r.material = K.glow(0x40ff80, 2)); if (live) K.anim(1.0, e => { djFx.led.scale.y = 0.2 + e * 0.8; }); },
        () => { djFx.mode = 0; drawLed(0); djFx.strip.material = K.glow(0xff4fa3, 2.2); djFx.light.color.set(0xff70c0); djFx.pool.material.color.set(0xff4fa3).multiplyScalar(0.4); djFx.rings.forEach(r => r.material = K.glow(0xff4fa3, 2)); djFx.led.scale.y = 1; });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) K.slot(-2.0 + i * 2.0, -10.3 + j * 1.15, 0, -11.5, 'dance', 1);
    }
    // espreguiçadeiras do flybridge
    [-11.0, -9.6, -8.2, -6.8].forEach((x, k) => { lounger(x, -13.4, 0, Y1, [0x2ec4b6, 0xf6f3ec, 0xff7a62, 0xf6f3ec][k]); K.col(x - 0.4, -14.45, x + 0.4, -12.4, 1); K.slot(x, -13.6, x, -9, 'lie', 1); });
    // pufes e mesinha de gamão
    for (const [x, z, c] of [[-5.4, -10.6, 0xf6f3ec], [-4.2, -9.7, 0x2ec4b6]]) { K.add(new T.SphereGeometry(0.48, 14, 10).scale(1, 0.55, 1), K.mat(c, { roughness: 0.9 }), x, Y1 + 0.25, z); K.colR(x, z, 0.35, 1); K.slot(x, z, x, z + 2, 'bean', 1); }
    { const cx = -8.6, cz = -10.4; K.box(0.7, 0.05, 0.7, marble, cx, Y1 + 0.72, cz); K.cyl(0.05, 0.08, 0.7, chrome, cx, Y1 + 0.35, cz, {}, 8);
      const bt = K.canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#e8d8b0'; g.fillRect(0, 0, w, h); for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? '#7a1f2a' : '#14213d'; const x = (k % 6) * 20 + 4 + (k > 5 ? 0 : 0); g.beginPath(); if (k < 6) { g.moveTo(x, 0); g.lineTo(x + 8, 52); g.lineTo(x + 16, 0); } else { g.moveTo(x, h); g.lineTo(x + 8, h - 52); g.lineTo(x + 16, h); } g.fill(); } g.fillStyle = '#5a3a22'; g.fillRect(60, 0, 8, h); });
      K.add(new T.PlaneGeometry(0.6, 0.6).rotateX(-Math.PI / 2), K.texMat(bt), cx, Y1 + 0.75, cz, { cast: false });
      for (let k = 0; k < 8; k++) K.cyl(0.025, 0.025, 0.012, K.mat(k % 2 ? 0xf6f3ec : 0x16161a), cx - 0.2 + (k % 4) * 0.12, Y1 + 0.76, cz - 0.15 + Math.floor(k / 4) * 0.3, { cast: false }, 10);
      K.colR(cx, cz, 0.4, 1);
      for (const s of [-1, 1]) { K.chair(cx + s * 0.75, cz, -s * Math.PI / 2, { y: Y1, seat: leatherW, frame: chrome, back: leatherW }); K.slot(cx + s * 0.75, cz, cx, cz, 'chess', 1); } }
    // posto de comando: console, timão, telas, cadeiras do comandante
    const radarFx = {};
    { const g = K.group(8.4, Y1, -14.65);
      K.box(4.0, 1.0, 0.7, gel, 0, 0.5, 0, { parent: g });
      const dash = K.box(4.0, 0.06, 0.6, K.mat(0x16161a, { roughness: 0.3 }), 0, 1.05, 0.1, { parent: g }); dash.rotation.x = 0.35;
      const scr = K.canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#0a1a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3ad0ff'; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.arc(64, 64, k * 18, 0, 7); c.stroke(); } c.fillStyle = '#2ad070'; c.beginPath(); c.moveTo(150, 120); c.bezierCurveTo(170, 60, 210, 90, 250, 20); c.lineTo(256, 128); c.fill(); c.fillStyle = '#ffd040'; c.fillRect(186, 70, 6, 6); });
      for (const x of [-1.2, 0, 1.2]) K.add(new T.PlaneGeometry(0.9, 0.42), K.texMat(scr, { emissiveMap: scr, emissive: 0xffffff, emissiveIntensity: 0.9 }), x, 1.12, 0.22, { parent: g, rx: -Math.PI / 2 + 0.35 + Math.PI / 2 - 1.2, cast: false });
      K.torus(0.32, 0.025, chrome, 0, 1.25, 0.45, { parent: g }, 6, 28); for (let k = 0; k < 6; k++) K.box(0.6, 0.02, 0.02, chrome, 0, 1.25, 0.45, { parent: g, rz: k * Math.PI / 6, cast: false }); K.cyl(0.05, 0.05, 0.3, chrome, 0, 1.25, 0.3, { parent: g, rx: Math.PI / 2 }, 8);
      K.box(0.12, 0.2, 0.12, K.mat(0x16161a), 0.9, 1.15, 0.35, { parent: g });
      radarFx.btn = K.box(0.22, 0.1, 0.02, K.glow(0x40ff80, 2), 1.7, 1.12, 0.36, { parent: g, cast: false });
      K.col(6.35, -15.0, 10.45, -14.25, 1);
      for (const x of [7.4, 9.2]) { const c = K.group(x, Y1, -13.7, Math.PI); K.cyl(0.05, 0.1, 0.55, chrome, 0, 0.28, 0, { parent: c }, 8); K.add(K.rbox(0.6, 0.14, 0.55, 0.05), leatherW, 0, 0.6, 0, { parent: c }); K.add(K.rbox(0.6, 0.6, 0.12, 0.05), leatherW, 0, 0.95, -0.28, { parent: c }); K.colR(x, -13.7, 0.3, 1); }
      K.slot(8.3, -13.0, 8.3, -14.6, 'talk', 1);
    }
    // bar do flybridge
    { K.box(2.0, 1.05, 0.7, K.mat(0x1b1b20, { roughness: 0.25, metalness: 0.3 }), 4.4, Y1 + 0.52, -14.6); K.box(2.2, 0.06, 0.85, marble, 4.4, Y1 + 1.08, -14.55);
      K.bottles(3.6, Y1 + 1.11, -14.75, 8, 0.11); K.col(3.35, -15.0, 5.45, -14.15, 1);
      [3.7, 4.4, 5.1].forEach(x => { K.cyl(0.18, 0.18, 0.05, leatherW, x, Y1 + 0.76, -13.75, {}, 14); K.cyl(0.025, 0.05, 0.74, chrome, x, Y1 + 0.37, -13.75, {}, 8); K.slot(x, -13.4, x, -15, 'bar', 1); }); }
    // mesa alta, plantas e vista no flybridge
    K.table(5.6, -10.8, { y: Y1, lv: 1, r: 0.4, h: 1.05, cloth: false, top: marble, leg: chrome, flower: 0xff5d8f, slots: 3 });
    K.plant(12.0, -14.6, 'palm', { y: Y1, lv: 1, pot: K.mat(0xf2efe8, { roughness: 0.4 }), s: 0.9 });
    K.plant(-3.2, -14.6, 'bush', { y: Y1, lv: 1, pot: K.mat(0xf2efe8, { roughness: 0.4 }) });
    [[-11.0, -8.8], [-8.4, -8.8], [-3.6, -8.8], [3.4, -8.8], [6.6, -8.8], [8.6, -8.8]].forEach(([x, z]) => K.slot(x, z, x, -2, 'view', 1));
    [[-3.6, -12.4], [7.6, -12.0], [11.4, -11.4], [-10.6, -11.2], [2.8, -12.6]].forEach(([x, z]) => K.slot(x, z, x + (R() - 0.5), z + 1, 'talk', 1));
    K.slot(-11.6, -9.4, -14, -2, 'selfie', 1);
    K.plight(-6.0, Y1 + 2.4, -11.8, 0xffc890, 1.0, 8);
    K.plight(7.0, Y1 + 2.4, -12.0, 0xffc890, 1.0, 8);

    // ------------------------------------------------------------ holofote de busca no guarda-corpo (missão)
    { const g = K.group(-6.0, Y1 + 1.0, -8.2);
      K.cyl(0.08, 0.1, 0.1, chrome, 0, 0.05, 0, { parent: g }, 10);
      const yoke = K.group(0, 0.1, 0, 0, g);
      for (const s of [-1, 1]) K.box(0.03, 0.3, 0.06, chrome, s * 0.17, 0.15, 0, { parent: yoke }); K.box(0.37, 0.03, 0.06, chrome, 0, 0.015, 0, { parent: yoke });
      const head = K.group(0, 0.25, 0, 0, yoke);
      K.add(new T.CylinderGeometry(0.15, 0.12, 0.38, 14).rotateX(Math.PI / 2), K.mat(0xf6f3ec, { roughness: 0.3 }), 0, 0, 0, { parent: head });
      const lens = K.add(new T.CircleGeometry(0.14, 14), K.mat(0xc8d8e8, { roughness: 0.1, metalness: 0.5 }), 0, 0, 0.195, { parent: head, cast: false });
      const beamG = new T.CylinderGeometry(3.2, 0.14, 34, 18, 1, true); beamG.translate(0, 17, 0); beamG.rotateX(Math.PI / 2);
      const beamMat = new T.MeshBasicMaterial({ color: new T.Color(0xfff2d0).multiplyScalar(0.5), transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, toneMapped: false });
      const beam = K.add(beamG, beamMat, 0, 0, 0.2, { parent: head, cast: false }); beam.visible = false;
      const lensHalo = K.halo(0, 0, 0.3, 0.7, 0xfff2d0, 2.0, head); lensHalo.visible = false;
      const sp = K.spot(-6.0, Y1 + 1.3, -8.2, -30, 14, -60, 0xfff2d0, 0, 60, 0.12);
      const aim = (u) => { yoke.rotation.y = u * (Math.PI + 0.42); head.rotation.x = 0.25 - u * 0.57; };
      aim(0);
      K.colR(-6.0, -8.2, 0.2, 1);
      K.tell('holofote', (live) => { beam.visible = true; lensHalo.visible = true; lens.material = K.glow(0xfff2d0, 3); sp.intensity = 2; if (live) K.anim(1.6, e => aim(e)); else aim(1); },
        () => { beam.visible = false; lensHalo.visible = false; lens.material = K.mat(0xc8d8e8, { roughness: 0.1, metalness: 0.5 }); sp.intensity = 0; aim(0); });
    }

    // ------------------------------------------------------------ arco do radar, antenas, domos e bandeiras (no topo, ao fundo)
    { const top = Y1 + 3.5, z = -19.5;
      for (const s of [-1, 1]) { K.box(0.5, 3.4, 0.9, gel, s * 4.6, top + 1.6, z, { rz: s * 0.18, cast: false }); }
      K.box(10.4, 0.5, 1.1, gel, 0, top + 3.35, z, { cast: false });
      K.box(10.4, 0.04, 0.06, K.glow(0xffd8a0, 1.5), 0, top + 3.08, z + 0.56, { cast: false });
      // domos de satélite
      for (const x of [-3.2, 3.2]) { K.cyl(0.15, 0.2, 0.4, gel, x, top + 3.8, z, {}, 10); K.add(new T.SphereGeometry(0.62, 16, 12), gel, x, top + 4.35, z); }
      // antenas de chicote e buzina
      for (const [x, h] of [[-4.6, 3.0], [-4.2, 2.2], [4.3, 2.6], [4.7, 3.4]]) K.cyl(0.015, 0.03, h, K.mat(0xf6f3ec), x, top + 3.6 + h / 2, z + 0.2, { cast: false }, 5);
      K.cone(0.1, 0.4, chrome, 1.5, top + 3.7, z + 0.4, { rx: Math.PI / 2 });
      // radar de barra girando
      const radar = K.group(0, top + 3.75, z);
      K.cyl(0.25, 0.3, 0.35, gel, 0, 0, 0, { parent: radar }, 12);
      const bar = K.group(0, 0.32, 0, 0, radar); K.add(K.rbox(3.0, 0.24, 0.24, 0.08), K.mat(0xf6f3ec, { roughness: 0.4 }), 0, 0, 0, { parent: bar }); K.box(2.8, 0.1, 0.02, K.mat(0x16161a), 0, 0, 0.13, { parent: bar, cast: false });
      radarFx.on = true;
      // luz de topo / farol (vira vermelho quando o radar é desligado)
      radarFx.beacon = K.sphere(0.12, K.glow(0xffffff, 2), 0, top + 4.35, z, { cast: false }, 10, 8);
      K.cyl(0.03, 0.03, 0.5, K.mat(0xf6f3ec), 0, top + 4.05, z, { cast: false }, 5);
      radarFx.halo = K.halo(0, top + 4.35, z, 1.2, 0xff2020, 2.2); radarFx.halo.visible = false;
      K.tick((dt, t) => { if (radarFx.on) bar.rotation.y += dt * 2.4; else { const b = Math.sin(t * 9) > 0; radarFx.halo.visible = b; } });
      K.tell('radar', (live) => { radarFx.on = false; bar.rotation.y = 0.0; radarFx.beacon.material = K.glow(0xff2020, 3.5); radarFx.btn.material = K.glow(0xff3030, 2.2); if (live) K.anim(0.8, e => { bar.rotation.y = e * 0.6; }); },
        () => { radarFx.on = true; radarFx.beacon.material = K.glow(0xffffff, 2); radarFx.btn.material = K.glow(0x40ff80, 2); radarFx.halo.visible = false; });
      // adriça com bandeiras de sinais e bandeira de cortesia
      const sig = [0xd4202f, 0xf2c14e, 0x1e3a8b, 0xf6f3ec, 0x2c7a4b, 0xd4202f, 0x1e3a8b, 0xf2c14e];
      const sl = []; for (let k = 0; k < 8; k++) { const u = (k + 0.5) / 8; sl.push([4.6 + u * 7.4, top + 3.4 - u * 6.0 + Math.sin(u * Math.PI) * 0.4, z + u * 5.6]); }
      instC(new T.ConeGeometry(0.22, 0.45, 3).rotateX(Math.PI), K.mat(0xffffff, { side: T.DoubleSide, roughness: 0.8 }), sl.map(p => [p[0], p[1] - 0.25, p[2], 0.6]), sig, { cast: false });
      sagRope([4.6, top + 3.4, z], [12.4, Y1 + 1.0, -14.2], 0.4, 0.01);
      const cf = new T.Mesh(flagGeo(0.9, 0.6), K.texMat(K.canvasTex(64, 48, (g, w, h) => { g.fillStyle = '#d4202f'; g.fillRect(0, 0, w, h / 2); g.fillStyle = '#fff'; g.fillRect(0, h / 2, w, h / 2); }), { side: T.DoubleSide })); cf.userData = { w: 0.9, ph: 2 }; cf.position.set(-4.6, top + 6.3, z + 0.2); cf.rotation.y = -Math.PI / 2 + 0.4; K.root.add(cf); flags.push(cf);
    }

    // ------------------------------------------------------------ iates vizinhos (mais baixos) e marina ao fundo
    const yacht = (cx, sz, len, beam, o = {}) => {
      const g = K.group(cx, 0, sz, o.ry || 0), hb = beam / 2, fb = o.fb ?? 1.6;
      const sh = new T.Shape(); sh.moveTo(-hb, 0); sh.lineTo(hb, 0); sh.lineTo(hb, len * 0.55); sh.quadraticCurveTo(hb * 0.95, len * 0.85, 0, len); sh.quadraticCurveTo(-hb * 0.95, len * 0.85, -hb, len * 0.55); sh.lineTo(-hb, 0);
      const hg = new T.ExtrudeGeometry(sh, { depth: fb + 0.4, bevelEnabled: false, curveSegments: 8 }); hg.rotateX(-Math.PI / 2); hg.translate(0, WY - 0.4, 0);
      K.add(hg, K.mat(o.hull ?? 0xf7f5f0, { roughness: 0.3, envMapIntensity: 0.6 }), 0, 0, 0, { parent: g, cast: false });
      const bt = new T.ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: false, curveSegments: 8 }); bt.rotateX(-Math.PI / 2); bt.scale(1.01, 1, 1.004); bt.translate(0, WY - 0.08, 0.01);
      K.add(bt, K.mat(o.boot ?? 0x14213d, { roughness: 0.4 }), 0, 0, 0, { parent: g, cast: false });
      const dy = WY + fb;
      const dk = new T.ShapeGeometry(sh); dk.rotateX(-Math.PI / 2); K.add(dk, teakDark, 0, dy + 0.01, 0, { parent: g, cast: false });
      const tiers = o.tiers ?? 2;
      for (let i = 0; i < tiers; i++) {
        const w = beam * (0.84 - i * 0.14), L = len * (0.46 - i * 0.1), zc = -len * 0.36 - i * 0.6, y = dy + i * 1.45;
        K.box(w, 1.35, L, K.mat(0xf7f5f0, { roughness: 0.35 }), 0, y + 0.68, zc, { parent: g, cast: false });
        K.box(w + 0.04, 0.55, L + 0.04, darkGlass, 0, y + 0.75, zc, { parent: g, cast: false });
        K.box(w + 0.3, 0.1, L + 0.5, K.mat(0xf7f5f0, { roughness: 0.35 }), 0, y + 1.4, zc + 0.15, { parent: g, cast: false });
      }
      const ty = dy + tiers * 1.45;
      K.cyl(0.05, 0.07, o.mast ?? 1.6, K.mat(0xf6f3ec), 0, ty + (o.mast ?? 1.6) / 2, -len * 0.38, { parent: g, cast: false }, 6);
      K.box(1.2, 0.1, 0.12, K.mat(0xf6f3ec), 0, ty + (o.mast ?? 1.6) - 0.2, -len * 0.38, { parent: g, cast: false });
      // almofadas coloridas no deck de popa
      for (let k = 0; k < 3; k++) K.add(K.rbox(1.0, 0.25, 0.9, 0.06), K.mat(o.acc ?? 0x2ec4b6, { roughness: 0.9 }), -1.2 + k * 1.2, dy + 0.15, -len * 0.08, { parent: g, cast: false });
      // sofá em U, mesa e espreguiçadeiras na popa; corrimão cromado nas bordas
      K.add(K.rbox(beam * 0.6, 0.4, 0.7, 0.08), K.mat(0xf6f3ec, { roughness: 0.9 }), 0, dy + 0.2, -len * 0.08 - 1.4, { parent: g, cast: false });
      K.cyl(0.5, 0.5, 0.06, teakDark, 0, dy + 0.5, -len * 0.08 - 0.4, { parent: g, cast: false }, 14); K.cyl(0.06, 0.12, 0.47, chrome, 0, dy + 0.235, -len * 0.08 - 0.4, { parent: g, cast: false }, 8);
      for (const sx of [-1, 1]) { K.add(K.rbox(0.7, 0.18, 1.8, 0.05), K.mat(0xf6f3ec, { roughness: 0.9 }), sx * hb * 0.55, dy + 0.12, -1.3, { parent: g, cast: false }); K.add(new T.CylinderGeometry(0.03, 0.03, len * 0.55, 6).rotateX(Math.PI / 2), chrome, sx * (hb - 0.1), dy + 0.9, -len * 0.27, { parent: g, cast: false }); }
      K.add(new T.CylinderGeometry(0.03, 0.03, beam - 0.2, 6).rotateZ(Math.PI / 2), chrome, 0, dy + 0.9, -0.1, { parent: g, cast: false });
      { const ps = []; for (const sx of [-1, 1]) for (let k = 0; k <= 4; k++) ps.push([sx * (hb - 0.1), dy + 0.45, -0.1 - k * len * 0.1375]); for (const x of [-beam / 4, 0, beam / 4]) ps.push([x, dy + 0.45, -0.1]); K.inst(new T.CylinderGeometry(0.018, 0.018, 0.9, 5), chrome, ps, { parent: g, cast: false }); }
      if (o.name) K.sign(o.name, beam * 0.5, 0.45, 0, WY + fb * 0.55, 0.02, { parent: g, color: '#14213d', font: 'Georgia, serif', size: 70 });
      // luzes de cortesia
      K.halo(0, dy + 1.0, -0.2, 0.6, 0xffd8a0, 0.35, g);
      const ph = R() * 6; K.tick((dt, t) => { g.position.y = Math.sin(t * 0.7 + ph) * 0.05; g.rotation.z = Math.sin(t * 0.5 + ph) * 0.006; });
      return g;
    };
    yacht(-25.5, 8.5, 44, 10, { tiers: 2, name: 'SEABREEZE', acc: 0xff7a62, mast: 1.4 });
    yacht(25.5, 8.0, 42, 9.6, { tiers: 2, name: 'ARIA', acc: 0x2ec4b6, hull: 0x22304e, boot: 0xd9a441, mast: 1.4 });
    yacht(-40, 6.0, 52, 11, { tiers: 3, name: 'VALKYRIE', acc: 0xf2c14e, mast: 2.6 });
    yacht(41, 5.0, 48, 10.5, { tiers: 3, name: 'BLUE HORIZON', acc: 0xc9a0dc, hull: 0xe8e4dc, mast: 2.6 });
    yacht(-55, 4.0, 40, 9, { tiers: 2, acc: 0x2ec4b6 }); yacht(56, 3.0, 38, 8.8, { tiers: 2, acc: 0xff7a62 });
    // marina do fundo: fileira de barcos atracados no cais
    for (let k = 0; k < 11; k++) { const x = -100 + k * 19 + R() * 3; if (Math.abs(x) < 18) continue; yacht(x, -54 + R() * 3, 20 + R() * 8, 6 + R() * 2, { tiers: 1 + (k % 2), mast: 1.2, acc: [0x2ec4b6, 0xff7a62, 0xf2c14e, 0xc9a0dc][k % 4], hull: k % 5 === 0 ? 0x1f2a44 : 0xf7f5f0 }); }
    // veleiros com mastros altos, longe na marina
    for (let k = 0; k < 10; k++) { const x = -120 + k * 26 + R() * 6; if (Math.abs(x) < 20) continue; const z = -64 - R() * 4; K.box(2.6, 1.2, 10, K.mat(0xf6f3ec, { roughness: 0.4 }), x, WY + 0.5, z, { cast: false }); K.cyl(0.08, 0.1, 14, K.mat(0xe8e8e8), x, WY + 7.5, z, { cast: false }, 6); }

    // ------------------------------------------------------------ cais do fundo, encostas de Mônaco e cassino
    const quayStone = K.mat(0xcfc2a8, { roughness: 0.9 });
    K.box(320, 2.6, 10, quayStone, 0, WY + 1.2, -76, { cast: false });
    K.box(320, 0.12, 0.5, K.mat(0xe8e0d0), 0, WY + 2.5, -71.2, { cast: false });
    for (let x = -150; x <= 150; x += 14) { K.cyl(0.12, 0.15, 5, K.iron, x, WY + 5, -72.5, { cast: false }, 6); K.halo(x, WY + 7.6, -72.5, 1.1, 0xffc070, 1.1); }
    for (let x = -144; x <= 150; x += 9) palm(x, WY + 2.5, -74 - R() * 2, 6 + R() * 1.5);
    // encosta em relevo
    const hFn = (x, z) => { const d = -z - 80; if (d < 0) return WY + 0.6; return WY + 0.6 + d * 0.42 + Math.min(1, d / 40) * (7 * Math.sin(x * 0.021 + 1.2) + 4 * Math.sin(x * 0.05 + z * 0.03) + 3 * Math.cos(z * 0.08)); };
    { const geo = new T.PlaneGeometry(560, 220, 80, 30); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -190); const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new T.Color();
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = hFn(x, z); p.setY(i, y); const v = 0.5 + 0.5 * Math.sin(x * 0.13 + z * 0.07); c.set(y > 50 ? 0x8a8a6a : v > 0.6 ? 0x5a7a44 : 0x6e8a50).offsetHSL(0, 0, (R() - 0.5) * 0.06); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals(); K.add(geo, K.vcol({ roughness: 0.95 }), 0, 0, 0, { cast: false, recv: false }); }
    // prédios em tons pastel subindo a encosta
    { const winTex = K.canvasTex(64, 128, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { g.fillStyle = '#5a5a6a'; g.fillRect(5 + i * 15, 6 + j * 15, 8, 9); g.fillStyle = '#ffffff'; g.fillRect(4 + i * 15, 15 + j * 15, 10, 1.5); } });
      const litTex = K.canvasTex(64, 128, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) if (R() < 0.35) { g.fillStyle = R() < 0.5 ? '#ffc070' : '#ffe0a8'; g.fillRect(5 + i * 15, 6 + j * 15, 8, 9); } });
      const bm = new T.MeshStandardMaterial({ map: winTex, emissiveMap: litTex, emissive: 0xffffff, emissiveIntensity: 0.7, roughness: 0.85 });
      const pastel = [0xf2d0a4, 0xf5c6b8, 0xf8e7c2, 0xe8b4a0, 0xf3dfd0, 0xdcc8e6, 0xc9dbe8, 0xf6efe0, 0xeec9a0, 0xf0b8b0, 0xfff2d8];
      const list = [], cols = [], roofs = [];
      for (let k = 0; k < 340; k++) { const x = -260 + R() * 520, z = -84 - R() * 130; if (x > -60 && x < -24 && z > -112 && z < -86) continue; const w = 5 + R() * 6, h = 6 + R() * (z < -150 ? 10 : 16), d = 5 + R() * 5, y = hFn(x, z) - 1.5; list.push([x, y, z, (R() - 0.5) * 0.3, [w, h, d]]); cols.push(pastel[k % pastel.length]); roofs.push([x, y + h, z, list[list.length - 1][3], [w + 0.4, 0.4, d + 0.4]]); }
      instC(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), bm, list, cols, { cast: false });
      K.inst(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), K.mat(0xb5603a, { roughness: 0.85 }), roofs.filter((r, i) => i % 3), { cast: false });
      // pinheiros-mansos e ciprestes na encosta
      const tr = []; for (let k = 0; k < 260; k++) { const x = -260 + R() * 520, z = -82 - R() * 140; tr.push([x, hFn(x, z) + 1.5, z, R() * 6, [2 + R() * 2.5, 1.2 + R() * 1.5, 2 + R() * 2.5]]); }
      K.inst(new T.SphereGeometry(1, 8, 6), K.mat(0x2f4f2a, { roughness: 0.9 }), tr, { cast: false });
      // torres altas de Monte Carlo
      for (const [x, z, h, c] of [[60, -110, 48, 0xf6efe0], [78, -118, 40, 0xe8d8c8], [-90, -120, 36, 0xf2e0c8], [110, -100, 30, 0xf3dfd0], [-130, -110, 32, 0xe8e0d8]]) K.facade(10, h, 10, x, z, { y: hFn(x, z) - 1, wall: '#' + c.toString(16), dark: '#6a6a78', lit: 0.3, glow: 0.35, bays: 5, floors: 16 });
    }
    // Cassino de Monte-Carlo iluminado (cúpula e duas torres)
    { const cx = -42, cz = -98, y0 = hFn(cx, cz) - 0.5, g = K.group(cx, y0, cz, 0.12);
      const cTex = K.canvasTex(512, 128, (g2, w, h) => { g2.fillStyle = '#efe0c0'; g2.fillRect(0, 0, w, h); for (let k = 0; k < 14; k++) { const x = 14 + k * 35; g2.fillStyle = '#ffcf7a'; g2.beginPath(); g2.moveTo(x, 110); g2.lineTo(x, 50); g2.quadraticCurveTo(x + 11, 34, x + 22, 50); g2.lineTo(x + 22, 110); g2.fill(); g2.fillStyle = '#d8c49a'; g2.fillRect(x - 6, 30, 4, 90); } g2.fillStyle = '#c9b48a'; g2.fillRect(0, 0, w, 14); g2.fillRect(0, h - 10, w, 10); });
      const cM = new T.MeshStandardMaterial({ map: cTex, emissiveMap: cTex, emissive: 0xffffff, emissiveIntensity: 0.45, roughness: 0.8 });
      K.box(34, 9, 14, cM, 0, 4.5, 0, { parent: g, cast: false });
      K.box(35, 0.8, 15, K.mat(0xd8c49a), 0, 9.2, 0, { parent: g, cast: false });
      K.box(10, 4, 10, cM, 0, 11.2, 0, { parent: g, cast: false });
      const copper = K.mat(0x5fa08a, { roughness: 0.5, metalness: 0.4 });
      K.add(new T.SphereGeometry(5, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), copper, 0, 13.2, 0, { parent: g, cast: false });
      K.cyl(0.8, 1.0, 2.4, K.mat(0xd8c49a), 0, 19.2, 0, { parent: g, cast: false }, 10); K.cone(1.0, 2.2, copper, 0, 21.4, 0, { parent: g, cast: false }, 10);
      for (const s of [-1, 1]) { K.box(4, 16, 4, cM, s * 13, 8, 2, { parent: g, cast: false }); K.add(new T.SphereGeometry(2.4, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), copper, s * 13, 16, 2, { parent: g, cast: false }); K.cone(0.5, 3, copper, s * 13, 19.2, 2, { parent: g, cast: false }, 8); K.halo(cx + s * 13, y0 + 12, cz + 4.5, 3.5, 0xffc070, 0.9); }
      K.halo(cx, y0 + 6, cz + 8, 9, 0xffb860, 0.7); K.halo(cx, y0 + 15, cz, 6, 0xffd090, 0.6);
      K.sign('CASINO', 9, 1.6, 0, 7.6, 7.05, { parent: g, neon: true, color: '#ffe6a8', font: 'Didot, Georgia, serif', size: 96, k: 2.4 });
      // jardins com fonte na frente
      K.add(new T.CircleGeometry(9, 24).rotateX(-Math.PI / 2), K.mat(0x4a7a3a), 0, 0.3, 16, { parent: g, cast: false });
      K.cyl(2.4, 2.6, 0.5, K.mat(0xe8e0d0), 0, 0.5, 16, { parent: g, cast: false }, 18); K.cyl(2.1, 2.1, 0.05, K.glow(0x60c0ff, 0.8), 0, 0.76, 16, { parent: g, cast: false }, 18);
    }
    // o Rochedo do Palácio à direita, longe
    { const g = K.group(150, 0, -70);
      K.add(new T.SphereGeometry(40, 16, 10).scale(1.6, 0.6, 1.0), K.mat(0x8a7a62, { roughness: 1 }), 0, WY, 0, { parent: g, cast: false });
      for (let k = 0; k < 18; k++) { const x = -40 + R() * 80, z = -20 + R() * 30; K.box(6 + R() * 6, 5 + R() * 6, 6 + R() * 5, K.mat([0xf2d0a4, 0xf5c6b8, 0xf8e7c2][k % 3], { roughness: 0.85 }), x, 19 + R() * 4, z, { parent: g, cast: false }); }
      K.box(30, 8, 12, K.mat(0xe8b8a0, { roughness: 0.85 }), -10, 25, 0, { parent: g, cast: false }); for (let k = 0; k < 6; k++) K.box(1.4, 3, 1.4, K.mat(0xe8b8a0), -24 + k * 5.6, 30, -5.6, { parent: g, cast: false });
    }
    // sol baixo encostando no mar (visível pela luneta e pelos lados)
    { const s = K.halo(-200, 14, -140, 30, 0xffa050, 1.4); s.material.fog = false; const s2 = K.halo(-200, 14, -140, 9, 0xfff0c0, 2.4); s2.material.fog = false; }

    // ------------------------------------------------------------ margem da frente: cais, palmeiras e o hotel do sniper
    K.box(320, 2.8, 8, quayStone, 0, WY + 1.3, 48, { cast: false });
    { const geo = new T.PlaneGeometry(400, 90, 40, 10); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, 97); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const z = p.getZ(i), x = p.getX(i); p.setY(i, WY + 2.8 + Math.max(0, z - 52) * 0.5 + Math.sin(x * 0.05) * 2); } geo.computeVertexNormals(); K.add(geo, K.mat(0x6e7a4a, { roughness: 1 }), 0, 0, 0, { cast: false, recv: false }); }
    for (let x = -150; x <= 150; x += 12) { if (Math.abs(x + 6) < 10) continue; palm(x, WY + 2.7, 46.5, 5.5 + R() * 1.5); }
    flushPalms();
    { const pastel = ['#f2d0a4', '#f5c6b8', '#f8e7c2', '#e8b4a0', '#dcc8e6', '#c9dbe8'];
      for (let k = 0; k < 14; k++) { const x = -130 + k * 19 + R() * 4; if (Math.abs(x + 6) < 20) continue; const h = 10 + R() * 12; K.facade(14, h, 10, x, 60 + R() * 8, { y: WY + 3 + R() * 4, wall: pastel[k % 6], dark: '#4a4a5a', lit: 0.4, glow: 0.4, bays: 6, floors: 6 }); } }
    // Hôtel Belvédère: sacada da suíte do sniper
    { const hx = -6, hz = 58.5, hy = WY + 3.2;
      const hTex = K.canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#f3e3c8'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 9; j++) { const x = 20 + i * 61, y = 20 + j * 55; g.fillStyle = R() < 0.4 ? '#ffd090' : '#3a3440'; g.fillRect(x, y, 26, 36); g.fillStyle = '#8a3a2a'; g.fillRect(x - 6, y, 5, 36); g.fillRect(x + 27, y, 5, 36); } });
      K.add(new T.BoxGeometry(26, 26, 9), new T.MeshStandardMaterial({ map: hTex, emissiveMap: hTex, emissive: 0xffffff, emissiveIntensity: 0.25, roughness: 0.85 }), hx, hy + 13, hz, { cast: false });
      K.box(27, 1.2, 10, K.mat(0xb5603a), hx, hy + 26.4, hz, { cast: false });
      const bl = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) bl.push([hx - 10.5 + i * 4.2, hy + 3 + j * 3.2, hz - 4.9]); K.inst(new T.BoxGeometry(3.0, 0.15, 1.0), K.mat(0xf6f3ec), bl, { cast: false }); K.inst(new T.BoxGeometry(3.0, 0.8, 0.06), K.iron, bl.map(p => [p[0], p[1] + 0.45, p[2] - 0.48]), { cast: false });
      K.sign('HÔTEL BELVÉDÈRE', 16, 2.0, hx, hy + 28.2, hz - 4.6, { ry: Math.PI, neon: true, color: '#ffd8a0', font: 'Didot, Georgia, serif', size: 64, k: 2.2 });
      // a sacada do sniper (piso, parapeito baixo, toldo listrado)
      const sx = -6, sy = 16.4, sz = 53.0;
      K.box(3.2, 0.2, 1.8, K.mat(0xf6f3ec), sx, sy - 1.5, sz + 0.2, { cast: false });
      K.box(3.2, 0.62, 0.1, K.iron, sx, sy - 1.08, sz - 0.65, { cast: false });
      const aw = K.canvasTex(256, 64, (g, w, h) => { for (let k = 0; k < 8; k++) { g.fillStyle = k % 2 ? '#f6f3ec' : '#2e8a7a'; g.fillRect(k * 32, 0, 32, h); } });
      K.add(new T.PlaneGeometry(3.4, 1.6), K.texMat(aw, { side: T.DoubleSide }), sx, sy + 1.3, sz - 0.1, { rx: -1.1, cast: false });
      K.halo(sx, sy - 0.2, sz + 0.6, 0.5, 0xff4134, 1.0);
      // quebra-mar com farol na frente, longe
      K.box(40, 2.0, 4, quayStone, 42, WY + 0.8, 40, { ry: 0.3, cast: false }); K.cyl(1.2, 1.5, 7, K.mat(0xf6f3ec), 60, WY + 4, 40, { cast: false }, 12); K.cyl(0.8, 0.8, 1.4, K.glow(0xffe0a0, 2), 60, WY + 8.2, 40, { cast: false }, 10); K.cone(1.2, 1.2, K.mat(0xc8322f), 60, WY + 9.5, 40, { cast: false }, 12);
    }

    // ------------------------------------------------------------ gaivotas circulando
    { const gulls = []; const wing = new T.PlaneGeometry(0.7, 0.18).translate(0.35, 0, 0); const gm = K.mat(0xf6f3ec, { side: T.DoubleSide, roughness: 0.8 });
      for (let k = 0; k < 7; k++) { const g = K.group(0, 0, 0); const wl = K.add(wing, gm, 0, 0, 0, { parent: g, cast: false }); const wr = K.add(wing, gm, 0, 0, 0, { parent: g, cast: false }); wr.scale.x = -1; K.add(new T.SphereGeometry(0.1, 6, 4).scale(0.8, 0.8, 2.2), gm, 0, 0, 0, { parent: g, cast: false }); gulls.push({ g, wl, wr, r: 14 + R() * 18, h: 13 + R() * 6, s: 0.15 + R() * 0.15, ph: R() * 6, cx: -10 + R() * 20, cz: -20 + R() * 20 }); }
      K.tick((dt, t) => { for (const q of gulls) { const a = t * q.s + q.ph; q.g.position.set(q.cx + Math.cos(a) * q.r, q.h + Math.sin(t * 0.7 + q.ph) * 0.6, q.cz + Math.sin(a) * q.r * 0.6); q.g.rotation.y = -a; const f = Math.sin(t * 6 + q.ph) * 0.5; q.wl.rotation.z = f; q.wr.rotation.z = -f; } }); }

    // ------------------------------------------------------------ embandeiramento: bandeiras de sinal do alto do arco do radar até as
    // quinas do teto, para trás e para os lados (sempre atrás de quem está no deck, nunca entre o sniper e a festa)
    { const SIG = [['#f6f3ec', '#1f3a8a', 'q'], ['#d8202a', '#f6f3ec', 'x'], ['#f2c41e', '#1f3a8a', 'v'], ['#1f3a8a', '#f6f3ec', 'q'], ['#f2c41e', '#d8202a', 'd'], ['#f6f3ec', '#d8202a', 'x'], ['#1f3a8a', '#f2c41e', 'h'], ['#d8202a', '#f2c41e', 'd'], ['#f6f3ec', '#16161a', 'q'], ['#f2c41e', '#16161a', 'h'], ['#1f3a8a', '#d8202a', 'x'], ['#d8202a', '#f6f3ec', 'h']];
      const atlas = K.canvasTex(SIG.length * 32, 24, (c, w, h) => { SIG.forEach(([a, b, k], i) => { const x0 = i * 32; c.fillStyle = a; c.fillRect(x0, 0, 32, h); c.fillStyle = b;
        if (k === 'q') c.fillRect(x0 + 10, 6, 12, 12); else if (k === 'h') c.fillRect(x0 + 16, 0, 16, h); else if (k === 'd') { c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 32, 0); c.lineTo(x0, h); c.fill(); } else if (k === 'v') { c.lineWidth = 5; c.strokeStyle = b; c.beginPath(); c.moveTo(x0, 0); c.lineTo(x0 + 32, h); c.moveTo(x0 + 32, 0); c.lineTo(x0, h); c.stroke(); } else { c.fillRect(x0 + 13, 0, 6, h); c.fillRect(x0, 9, 32, 6); } }); }, [1, 1]);
      const top = Y1 + 3.5, A = new T.Vector3(0, top + 3.75, -19.5), fw = 0.5, fh = 0.38, pos = [], uv = [], idx = [], base = [], lm = new T.LineBasicMaterial({ color: 0x3a3a40 });
      let n = 0;
      for (const B of [new T.Vector3(-9.6, top + 0.15, -24.5), new T.Vector3(9.6, top + 0.15, -24.5)]) {
        const N = 13, d = new T.Vector3().subVectors(B, A).setY(0).normalize(), nx = -d.z, nz = d.x, at = (u) => { const p = new T.Vector3().lerpVectors(A, B, u); p.y -= Math.sin(u * Math.PI) * 0.7; return p; };
        for (let i = 0; i < N; i++) { const p = at((i + 0.8) / (N + 0.6)), sg = n % SIG.length, u0 = sg / SIG.length, u1 = (sg + 1) / SIG.length, v0 = pos.length / 3;
          for (const [e, dy, uu, vv] of [[0.5, 0, u0, 1], [-0.5, 0, u1, 1], [0.5, -fh, u0, 0], [-0.5, -fh, u1, 0]]) { const x = p.x + d.x * e * fw, z = p.z + d.z * e * fw; pos.push(x, p.y + dy, z); uv.push(uu, vv); base.push(x, p.y + dy, z, -dy / fh, n, nx, nz); }
          idx.push(v0, v0 + 2, v0 + 1, v0 + 1, v0 + 2, v0 + 3); n++; }
        const lp = []; for (let i = 0; i <= 24; i++) lp.push(at(i / 24)); K.root.add(new T.Line(new T.BufferGeometry().setFromPoints(lp), lm));
      }
      const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); fg.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); fg.setIndex(idx); fg.computeVertexNormals();
      K.add(fg, K.texMat(atlas, { side: T.DoubleSide, roughness: 0.8 }), 0, 0, 0, { cast: false }).userData.noCol = true;
      const fp = fg.attributes.position;
      K.tick((dt, t) => { for (let k = 0; k < fp.count; k++) { const b = k * 7, d = base[b + 3], i = base[b + 4], w = d * (0.14 + Math.sin(t * 5.5 + i * 0.9 + d * 2) * 0.09); fp.setXYZ(k, base[b] + base[b + 5] * w, base[b + 1] + d * Math.sin(t * 3.1 + i) * 0.03, base[b + 2] + base[b + 6] * w); } fp.needsUpdate = true; });
    }
    // ------------------------------------------------------------ golfinhos saltando no porto, em dupla ou trio, de tempos em tempos
    { const corpo = new T.LatheGeometry([[0, -1.22], [0.06, -1.15], [0.14, -0.8], [0.25, -0.3], [0.31, 0.15], [0.28, 0.55], [0.2, 0.85], [0.12, 1.0], [0.065, 1.08], [0.05, 1.28], [0, 1.31]].map(([r, y]) => new T.Vector2(r, y)), 12).rotateX(Math.PI / 2);
      const dg = K.juntar([[corpo, 0], [new T.ConeGeometry(0.05, 0.36, 5).scale(1, 1, 3.2).rotateX(-0.55).translate(0, 0.36, -0.1), 0], [new T.BoxGeometry(0.62, 0.035, 0.2).translate(0, 0, -1.2), 0], [new T.BoxGeometry(0.5, 0.05, 0.18).rotateZ(0.5).translate(0.32, -0.15, 0.35), 0], [new T.BoxGeometry(0.5, 0.05, 0.18).rotateZ(-0.5).translate(-0.32, -0.15, 0.35), 0]]);
      dg.deleteAttribute('color'); const dm = K.mat(0x3e4c5c, { roughness: 0.3, metalness: 0.1 }), esp = new T.MeshBasicMaterial({ color: 0xf2f6f8, transparent: true, opacity: 0.8, depthWrite: false });
      const ds = [0, 1, 2].map((k) => ({ m: Object.assign(K.add(dg, dm, 0, -9, 0, { cast: false }), { name: 'golfinho' + k }), sp: [0, 1].map(() => K.add(new T.RingGeometry(0.2, 0.55, 16).rotateX(-Math.PI / 2), esp.clone(), 0, WY + 0.04, 0, { cast: false })) }));
      ds.forEach(d => d.sp.forEach(s => { s.visible = false; s.userData.noCol = true; })); ds.forEach(d => d.m.userData.noCol = true);
      let x0 = 0, z0 = 0, dir = 1, n = 2; const salto = 2.1, L = 5.4, H = 1.9;
      K.tick((dt, t) => {
        const u = t % 26; // a cada 26 s um grupo salta duas vezes seguidas, num ponto sorteado do porto
        const ciclo = Math.floor(t / 26), rr = K.rng(808 + ciclo); x0 = -22 + rr() * 44; z0 = 16 + rr() * 6; dir = rr() < 0.5 ? 1 : -1; n = 2 + (rr() < 0.4 ? 1 : 0);
        ds.forEach((d, k) => {
          const v = u - k * 0.45 - (k === 2 ? 0.2 : 0), j = Math.floor(v / (salto + 0.7)), f = (v - j * (salto + 0.7)) / salto, on = k < n && v >= 0 && j < 2 && f <= 1;
          d.m.visible = on;
          if (on) { const x = x0 + dir * (j * (L + 1.2) + f * L), z = z0 + k * 1.5 - j * 0.3, y = WY - 0.5 + Math.sin(f * Math.PI) * H;
            d.m.position.set(x, y, z); d.m.rotation.set(0, dir * Math.PI / 2, 0); d.m.rotateX(-Math.atan2(Math.cos(f * Math.PI) * Math.PI * H, L)); }
          d.sp.forEach((s, e) => { const fe = e ? f - 1 : f, w = Math.abs(fe) < 0.4 && k < n && v >= 0 && j < 2 ? 1 - Math.abs(fe) / 0.4 : 0; s.visible = w > 0;
            if (w > 0) { s.position.set(x0 + dir * (j * (L + 1.2) + (e ? L : 0)), WY + 0.04, z0 + k * 1.5 - j * 0.3); s.scale.setScalar(0.6 + (1 - w) * 1.4); s.material.opacity = 0.8 * w; } });
        });
      });
    }
    // ------------------------------------------------------------ luz de preenchimento (pôr do sol)
    K.pool(-6, 2, 6, 0xffa860, 0.12); K.pool(6, -4, 5, 0xffa860, 0.1);
    // ------------------------------------------------------------ ambiente vivo: sol poente cintilando no porto em volta do iate
    K.glints({ x0: -40, x1: 40, z0: 22, z1: 46, y0: WY + 0.05, n: 140, cor: [0xffc080, 0xffe0b0, 0xff9a60], tam: 0.22, pisca: 1.6 });
    K.glints({ x0: -30, x1: -14, z0: -12, z1: 22, y0: WY + 0.05, n: 50, cor: [0xffc080, 0xffe0b0], tam: 0.2, pisca: 1.6 });
    K.glints({ x0: 14, x1: 30, z0: -12, z1: 22, y0: WY + 0.05, n: 50, cor: [0xffc080, 0xffe0b0], tam: 0.2, pisca: 1.6 });
    // menos reflexo da sala neutra: o lado da sombra fica lilás (céu) e o do sol, dourado
    K.reflexo(0.2);
    // reflexo do sol na água dançando no espelho de popa e nos costados (faixas de luz que correm devagar)
    { const ond = K.canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.lineCap = 'round';
        for (let k = 0; k < 46; k++) { const y = R() * h, x = R() * w, L = 18 + R() * 50; g.strokeStyle = `rgba(255,${200 + R() * 40},${140 + R() * 50},${0.35 + R() * 0.5})`; g.lineWidth = 2 + R() * 3.5; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + L * 0.3, y - 4, x + L * 0.6, y + 4, x + L, y); g.stroke(); } }, [3, 1]);
      const om = new T.MeshBasicMaterial({ map: ond, color: new T.Color(1.7, 1.4, 1.05), transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0.8 });
      const ms = [K.add(new T.PlaneGeometry(25.4, 1.9), om, 0, WY + 0.75, 9.68, { cast: false })];
      for (const sx of [-1, 1]) ms.push(K.add(new T.PlaneGeometry(35, 1.9), om, sx * 12.86, WY + 0.75, -8.2, { cast: false, ry: sx * Math.PI / 2 }));
      ms.forEach(m => { m.renderOrder = 2; m.userData.noCol = true; m.raycast = () => { }; });
      K.tick((dt, t) => { ond.offset.set(Math.sin(t * 0.4) * 0.06 + t * 0.015, Math.sin(t * 0.9) * 0.08); om.opacity = 0.7 + Math.sin(t * 1.3) * 0.15; }); }
  },
  // ninho do sniper: sacada da suíte do Hôtel Belvédère. Balaustrada de mármore com veios, corrimão de latão polido,
  // marca de copo e o cartão do quarto; buganvília num vaso à direita e o balde de champanhe à esquerda
  ninho(K, g) {
    const T = K.T, N = K.ninhoPecas(g, { roughness: 0.4 }), marble = 0xe2ddd4;
    N.tampo(marble, { x0: -2.7, x1: 2.7, z0: -1.3, z1: -0.4, seed: 21, mat: { roughness: 0.25 }, draw: (c, w, h, R) => {
      c.fillStyle = '#e6e1d8'; c.fillRect(0, 0, w, h); K.manchas(c, w, h, R, 120, ['200,196,188', '245,243,238'], 6, 40, 0.3);
      c.lineCap = 'round'; for (let k = 0; k < 14; k++) { c.strokeStyle = `rgba(110,110,120,${0.15 + R() * 0.25})`; c.lineWidth = 0.6 + R() * 1.6; c.beginPath(); let x = R() * w, y = R() * h; c.moveTo(x, y); c.bezierCurveTo(x + R() * 200 - 60, y + R() * 60 - 30, x + R() * 260, y + R() * 80 - 40, x + 120 + R() * 260, y + R() * 60 - 30); c.stroke(); }
      c.strokeStyle = 'rgba(150,110,70,.35)'; c.lineWidth = 3; c.beginPath(); c.arc(w * 0.27, h * 0.55, 15, 0.3, 5.6); c.stroke();
      c.save(); c.translate(w * 0.13, h * 0.5); c.rotate(0.12); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(-58, -32, 120, 70); c.fillStyle = '#f6f0e2'; c.fillRect(-62, -36, 120, 70); c.fillStyle = '#1f3a5a'; c.fillRect(-62, -36, 120, 14);
      c.fillStyle = '#c8a050'; c.font = '700 10px Georgia, serif'; c.textAlign = 'center'; c.fillText('HÔTEL BELVÉDÈRE', -2, -25); c.fillStyle = '#1f3a5a'; c.font = '700 22px Georgia, serif'; c.fillText('512', -2, 14); c.restore();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(0, 0, w, 5); K.grain(c, w, h, 8);
    } });
    N.box(5.6, 0.1, 1.0, marble, 0, -0.97, -1.1).cyl(0.05, 0.05, 5.6, 0xd8a848, 0, -0.91, -1.46, 12, 0, 0, Math.PI / 2);
    N.box(5.4, 3.2, 0.9, 0xe8d8b8, 0, -2.6, -0.95);
    for (let x = -2.4; x <= 2.41; x += 0.3) N.cyl(0.06, 0.05, 0.6, marble, x, -1.35, -1.42, 8);
    for (const sx of [-1, 1]) N.box(0.8, 1.3, 0.8, marble, sx * 2.25, -0.14, -0.87).box(0.86, 0.08, 0.84, 0xd0cac0, sx * 2.25, 0.55, -0.87);
    // buganvília no vaso de terracota
    N.cyl(0.2, 0.15, 0.32, 0xb8643a, 2.3, 0.75, -0.85, 12); const R = K.rng(23);
    for (let k = 0; k < 26; k++) N.geo(new T.SphereGeometry(0.07 + R() * 0.06, 6, 4), k % 4 ? 0xd02a8a : 0x3a7a3a, 2.3 + (R() - 0.5) * 0.7, 0.95 + R() * 0.4, -0.85 + (R() - 0.5) * 0.6);
    // balde de champanhe com a garrafa
    N.cyl(0.13, 0.1, 0.24, 0xc9ced6, -2.25, 0.71, -0.9, 14).cyl(0.045, 0.045, 0.3, 0x1f4a2a, -2.22, 0.88, -0.9, 8, 0, 0, 0.15).cyl(0.018, 0.03, 0.1, 0xd8b048, -2.2, 1.07, -0.9, 8, 0, 0, 0.15);
    N.fim();
  },
});
