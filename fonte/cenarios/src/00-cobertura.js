// 00 · Cobertura: detalhes extras da torre de seis andares (o mapa padrão), feitos com o mesmo kit dos cenários extras.
// O mira.html chama MIRA_COBERTURA(K, LEVELS) depois de montar a cobertura; tudo vai num grupo próprio por andar
// (K.lvGroup[k], já na altura do piso), entra na junção estática, vira obstáculo na grade de navegação pela própria
// geometria e, quando passa da altura do peito, entra nos oclusores do tiro (K.occ).
// Regra de equilíbrio: só área livre da grade, nada que feche corredor, escada, vaga ou ponto de missão.
// K.noite é ligado pelo jogo na "Cobertura à noite": pássaros de dia, fogos à noite.
window.MIRA_COBERTURA = function (K, LEVELS) {
  const T = K.T, M = K.M, R = K.r;
  const lvg = (k) => ({ parent: K.lvGroup[k] });
  const at = (k, o = {}) => Object.assign({ parent: K.lvGroup[k] }, o);
  const mahog = K.mat(0x4a2318, { roughness: 0.5 }), felt = K.mat(0x1f6a3a, { roughness: 0.95 }), gold = K.gold, brass = K.brass;
  const red = K.mat(0x8a1f2a, { roughness: 0.75 }), black = M.black, cream = K.mat(0xf1ece2, { roughness: 0.6 });
  const chip = [K.mat(0xd9a441, { roughness: 0.4 }), K.mat(0xb8252a, { roughness: 0.4 }), K.mat(0x2e5fa8, { roughness: 0.4 }), K.mat(0xf6f1e8, { roughness: 0.4 })];
  K.noite = false;

  // tapete estampado no chão (plano: não entra na grade de navegação)
  const rugTex = (bg, border, motif) => K.canvasTex(512, 384, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h); g.strokeStyle = border; g.lineWidth = 14; g.strokeRect(14, 14, w - 28, h - 28); g.lineWidth = 3; g.strokeRect(36, 36, w - 72, h - 72);
    g.fillStyle = motif; for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) { const x = 70 + i * 47, y = 70 + j * 49; g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-7, -7, 14, 14); g.restore(); }
    K.grain(g, w, h, 14);
  });
  const rug = (k, x, z, w, d, tex) => K.add(new T.PlaneGeometry(w, d).rotateX(-Math.PI / 2), K.texMat(tex, { roughness: 0.95 }), x, 0.013, z, at(k, { cast: false }));
  // banqueta redonda de bar (baixa: assento a 0,72 m)
  const stool = (k, x, z) => { K.cyl(0.2, 0.2, 0.07, red, x, 0.72, z, at(k), 14); K.cyl(0.03, 0.03, 0.7, brass, x, 0.36, z, at(k, { cast: false }), 6); K.torus(0.15, 0.012, brass, x, 0.28, z, at(k, { cast: false, rx: Math.PI / 2 }), 6, 16); K.cyl(0.18, 0.2, 0.03, brass, x, 0.015, z, at(k, { cast: false }), 14); };
  // pilha de fichas
  const chips = (k, x, y, z, n, c) => K.cyl(0.035, 0.035, 0.008 * n, chip[c % 4], x, y + 0.004 * n, z, at(k, { cast: false }), 12);
  // palmeira em vaso de latão, encostada na parede (passa do peito: bloqueia o tiro)
  const palm = (k, x, z) => {
    K.lathe([[0, 0], [0.32, 0], [0.38, 0.1], [0.34, 0.55], [0.4, 0.62], [0, 0.62]], brass, x, 0, z, at(k));
    K.cyl(0.05, 0.08, 1.5, K.mat(0x6a5236, { roughness: 0.9 }), x, 1.3, z, at(k, { occ: true }), 7);
    const fr = []; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, g = new T.ConeGeometry(0.16, 1.2, 4); g.rotateX(Math.PI / 2 + 0.55); g.rotateY(a); g.translate(x + Math.sin(a) * 0.45, 2.05, z + Math.cos(a) * 0.45); fr.push([g, i % 2 ? 0x3f6b34 : 0x4f7a3a]); }
    const m = K.merge(fr, K.vcol({ roughness: 0.8 }), at(k)); K.occ.push(m);
  };

  // ============================================================ andar 3: cassino
  {
    const k = 3;
    // mesa de blackjack em meia-lua, crupiê do lado da parede; três banquetas do lado redondo
    {
      const x = -4.6, z = -45.5;
      K.add(new T.CylinderGeometry(1.25, 1.25, 0.1, 28, 1, false, -Math.PI / 2, Math.PI), mahog, x, 0.84, z, at(k));
      K.add(new T.CylinderGeometry(1.12, 1.12, 0.02, 28, 1, false, -Math.PI / 2, Math.PI), felt, x, 0.9, z, at(k, { cast: false }));
      K.add(new T.TorusGeometry(1.2, 0.05, 6, 28, Math.PI), K.mat(0x2a1410, { roughness: 0.6 }), x, 0.91, z, at(k, { cast: false, rx: -Math.PI / 2, rz: Math.PI }));
      K.box(1.6, 0.8, 0.3, mahog, x, 0.4, z + 0.15, at(k));
      K.box(0.18, 0.1, 0.12, black, x + 0.55, 0.96, z + 0.12, at(k, { cast: false })); // sapato de cartas
      for (let i = 0; i < 6; i++) chips(k, x - 0.5 + i * 0.12, 0.91, z + 0.1, 3 + i % 4, i);
      for (let i = 0; i < 3; i++) { const a = -0.6 + i * 0.6; K.box(0.06, 0.004, 0.09, cream, x + Math.sin(a) * 0.8, 0.915, z + Math.cos(a) * 0.8, at(k, { cast: false, ry: a })); K.box(0.06, 0.004, 0.09, cream, x + Math.sin(a) * 0.8 + 0.03, 0.92, z + Math.cos(a) * 0.8 + 0.02, at(k, { cast: false, ry: a + 0.2 })); }
      for (let i = 0; i < 3; i++) { const a = -0.75 + i * 0.75; stool(k, x + Math.sin(a) * 1.65, z + Math.cos(a) * 1.65); K.slot(x + Math.sin(a) * 2.15, z + Math.cos(a) * 2.15, x, z, 'talk', k); }
      rug(k, x, z + 0.4, 4.6, 3.4, rugTex('#2a1a3a', '#d9a441', 'rgba(217,164,65,.35)'));
      K.pool(x, z + 0.3, 2.2, 0xffc27a, 0.22, 0.022, K.lvGroup[k]);
    }
    // mesa de dados: comprida, com trilho alto e dois dados no feltro
    {
      const x = 4.6, z = -45.4;
      K.add(K.rbox(3.8, 0.9, 1.7, 0.25), mahog, x, 0.45, z, at(k));
      K.add(K.rbox(3.5, 0.03, 1.4, 0.2), felt, x, 0.91, z, at(k, { cast: false }));
      const rail = K.mat(0x2a1410, { roughness: 0.6 }); for (const sz of [-0.86, 0.86]) K.box(3.9, 0.14, 0.1, rail, x, 0.98, z + sz, at(k, { cast: false })); for (const sx of [-1.9, 1.9]) K.box(0.1, 0.14, 1.82, rail, x + sx, 0.98, z, at(k, { cast: false }));
      const lay = K.canvasTex(256, 96, (g, w, h) => { g.fillStyle = '#1f6a3a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f6f1e8'; g.lineWidth = 2; g.strokeRect(8, 8, w - 16, h - 16); g.beginPath(); g.arc(w / 2, h / 2, 26, 0, 7); g.stroke(); g.font = 'bold 14px Georgia'; g.fillStyle = '#f6f1e8'; g.textAlign = 'center'; g.fillText('PASS LINE', w / 2, h - 16); g.fillText('7', w / 2, h / 2 + 5); g.fillStyle = '#b8252a'; for (const xx of [40, 216]) g.fillRect(xx - 16, 30, 32, 36); });
      K.add(new T.PlaneGeometry(3.2, 1.2).rotateX(-Math.PI / 2), K.texMat(lay, { roughness: 0.9 }), x, 0.93, z, at(k, { cast: false }));
      const die = K.mat(0xf6f1e8, { roughness: 0.3 }); K.box(0.07, 0.07, 0.07, die, x + 0.9, 0.965, z - 0.2, at(k, { cast: false, ry: 0.4 })); K.box(0.07, 0.07, 0.07, die, x + 1.02, 0.965, z - 0.1, at(k, { cast: false, ry: 1.1 }));
      K.cyl(0.008, 0.008, 1.0, mahog, x - 1.1, 1.0, z + 0.4, at(k, { cast: false, rz: Math.PI / 2 + 0.1 }), 4); // vareta do crupiê
      for (let i = 0; i < 8; i++) chips(k, x - 1.4 + (i % 4) * 0.1, 0.93, z + 0.5 - Math.floor(i / 4) * 0.12, 2 + i % 5, i + 1);
      for (const [sx, sz] of [[-1.2, 1.35], [0, 1.4], [1.2, 1.35], [-2.5, 0], [2.5, 0], [0.6, -1.35]]) K.slot(x + sx, z + sz, x, z, 'talk', k);
      rug(k, x, z, 5.6, 3.8, rugTex('#3a1420', '#d9a441', 'rgba(246,241,232,.25)'));
      K.pool(x, z, 2.6, 0xffc27a, 0.22, 0.022, K.lvGroup[k]);
    }
    // letreiro de cassino com lâmpadas em perseguição, na parede do fundo sobre os caça-níqueis
    {
      const x = -4.4, y = 3.05, z = -48.42;
      const sign = K.canvasTex(512, 96, (g, w, h) => { g.fillStyle = '#15151a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd98a'; g.font = 'bold 62px Georgia'; g.textAlign = 'center'; g.fillText('CASSINO DO TOPO', w / 2, 70); });
      K.add(new T.PlaneGeometry(5.2, 0.9), new T.MeshBasicMaterial({ map: sign, toneMapped: false }), x, y, z, at(k, { cast: false }));
      K.box(5.5, 1.15, 0.06, K.mat(0x8a1f2a, { roughness: 0.5 }), x, y, z - 0.04, at(k, { cast: false }));
      const ring = [[], []]; let n = 0;
      for (let i = 0; i <= 22; i++) for (const yy of [-0.5, 0.5]) ring[(n++) % 2].push([x - 2.65 + i * 5.3 / 22, y + yy, z + 0.02, 0, 1]);
      for (let j = 0; j < 4; j++) for (const xx of [-2.65, 2.65]) ring[(n++) % 2].push([x + xx, y - 0.3 + j * 0.2, z + 0.02, 0, 1]);
      const bulbA = K.inst(new T.SphereGeometry(0.035, 6, 4), K.glow(0xffe0a0, 3), ring[0], at(k, { cast: false })), bulbB = K.inst(new T.SphereGeometry(0.035, 6, 4), K.glow(0xffe0a0, 3), ring[1], at(k, { cast: false }));
      K.tick((dt, t) => { const on = Math.floor(t * 3) % 2 === 0; bulbA.visible = on; bulbB.visible = !on; });
    }
    palm(k, -10.6, -47.7); palm(k, 10.6, -47.7);
  }

  // ============================================================ andar 4: heliponto e galeria
  {
    const k = 4, F = LEVELS[k].z1;
    // marcação do heliponto: anel tracejado branco em volta do círculo amarelo (planos, fora da grade)
    {
      const cx = 8.0, cz = -55.9, segs = [];
      for (let i = 0; i < 24; i++) { const a0 = i / 24 * Math.PI * 2; const g = new T.RingGeometry(5.2, 5.42, 4, 1, a0, Math.PI / 24); g.rotateX(-Math.PI / 2); g.translate(cx, 0.02, cz); segs.push([g, 0xf6f1e8]); }
      K.merge(segs, K.vcol({ roughness: 0.8 }), at(k, { cast: false, recv: true }));
      const letters = K.canvasTex(256, 64, (g, w, h) => { g.fillStyle = 'rgba(0,0,0,0)'; g.clearRect(0, 0, w, h); g.fillStyle = '#f6f1e8'; g.font = 'bold 44px Arial'; g.textAlign = 'center'; g.fillText('4,5 t  ·  D 12', w / 2, 46); });
      K.add(new T.PlaneGeometry(2.6, 0.65).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({ map: letters, transparent: true, roughness: 0.9, depthWrite: false }), cx, 0.021, cz + 5.9, at(k, { cast: false }));
      // cones de sinalização
      for (const [x, z] of [[2.6, -53.4], [2.6, -58.4], [13.0, -52.2], [13.0, -59.6]]) { K.cone(0.14, 0.42, K.mat(0xff6a1a, { roughness: 0.6 }), x, 0.23, z, at(k), 10); K.cyl(0.115, 0.13, 0.05, K.mat(0xf6f1e8), x, 0.22, z, at(k, { cast: false }), 10); K.box(0.36, 0.03, 0.36, K.mat(0x15151a), x, 0.015, z, at(k, { cast: false })); }
    }
    // carrinho de bagagem de hotel com malas, esperando o helicóptero
    {
      const x = 0.9, z = -61.0;
      K.box(1.3, 0.06, 0.7, K.mat(0x7a2a2a, { roughness: 0.8 }), x, 0.26, z, at(k)); K.box(1.32, 0.03, 0.72, brass, x, 0.3, z, at(k, { cast: false }));
      for (const sx of [-0.62, 0.62]) { K.cyl(0.018, 0.018, 1.5, brass, x + sx, 1.0, z - 0.33, at(k, { cast: false }), 6); K.cyl(0.018, 0.018, 1.5, brass, x + sx, 1.0, z + 0.33, at(k, { cast: false }), 6); }
      K.add(new T.TorusGeometry(0.62, 0.018, 6, 20, Math.PI), brass, x, 1.75, z - 0.33, at(k, { cast: false })); K.add(new T.TorusGeometry(0.62, 0.018, 6, 20, Math.PI), brass, x, 1.75, z + 0.33, at(k, { cast: false }));
      K.cyl(0.015, 0.015, 0.66, brass, x, 2.37, z, at(k, { cast: false, rx: Math.PI / 2 }), 6);
      for (const [sx, sz] of [[-0.45, -0.25], [0.45, -0.25], [-0.45, 0.25], [0.45, 0.25]]) K.cyl(0.07, 0.07, 0.05, black, x + sx, 0.08, z + sz, at(k, { cast: false, rz: Math.PI / 2 }), 10);
      const bags = [[0x2e5fa8, 0.5, 0.65, 0.22, -0.32, 0.62, 0], [0xb8252a, 0.42, 0.55, 0.2, 0.15, 0.57, 0.05], [0x5a3a22, 0.55, 0.38, 0.3, 0.38, 0.5, -0.1], [0xd9b77a, 0.4, 0.28, 0.24, -0.25, 1.08, 0.05]];
      for (const [c, w, h, d, sx, y, sz] of bags) { K.add(K.rbox(w, h, d, 0.04), K.mat(c, { roughness: 0.55 }), x + sx, y, z + sz, at(k)); K.box(0.12, 0.03, 0.03, black, x + sx, y + h / 2 + 0.015, z + sz, at(k, { cast: false })); }
    }
    // caixas de equipamento (flight cases) empilhadas junto ao parapeito do fundo
    {
      const x = -3.6, z = -61.3, cs = K.mat(0x1b1d22, { roughness: 0.45, metalness: 0.2 }), al = K.silver;
      for (const [w, h, d, y, ry] of [[1.0, 0.5, 0.55, 0.25, 0], [0.8, 0.4, 0.5, 0.7, 0.12]]) { K.box(w, h, d, cs, x, y, z, at(k, { ry })); for (const sx of [-1, 1]) for (const sy of [-1, 1]) K.box(0.06, 0.06, d + 0.02, al, x + sx * (w / 2 - 0.02), y + sy * (h / 2 - 0.02), z, at(k, { cast: false, ry })); }
      K.sign('FRÁGIL', 0.5, 0.12, x, 0.3, z + 0.28, at(k, { cast: false }));
    }
    // banco de galeria no meio das esculturas, e anemômetro girando no canto
    {
      K.box(2.0, 0.08, 0.5, K.mat(0xd9cdb6, { roughness: 0.7 }), -8.4, 0.45, -57.6, at(k)); for (const dx of [-0.8, 0.8]) K.box(0.4, 0.42, 0.44, K.mat(0xd9cdb6, { roughness: 0.7 }), -8.4 + dx, 0.21, -57.6, at(k));
      K.slot(-8.4, -58.4, -8.4, -57.6, 'view', k);
      const ax = -14.0, az = -61.6; K.cyl(0.025, 0.03, 2.4, K.iron, ax, 1.2, az, at(k, { cast: false }), 6);
      const cups = K.group(ax, 2.45, az, 0, K.lvGroup[k]);
      for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; K.cyl(0.006, 0.006, 0.3, K.iron, Math.cos(a) * 0.15, 0, Math.sin(a) * 0.15, { parent: cups, cast: false, rz: Math.PI / 2, ry: -a }, 4); K.sphere(0.05, K.mat(0xf6f1e8), Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3, { parent: cups, cast: false }, 8, 6); }
      K.tick((dt, t) => { cups.rotation.y = t * 4.2; });
    }
    // luzes de borda piscando em sequência no parapeito da frente
    {
      const list = []; for (let i = 0; i < 14; i++) list.push([-13 + i * 2, 0.08, F - 0.25, 0, 1]);
      const lamps = list.map(p => K.sphere(0.05, K.glow(0x9fd0ff, 0.6), p[0], p[1], p[2], at(k, { cast: false }), 8, 6));
      const on = K.glow(0x9fd0ff, 4), off = lamps[0].material;
      K.tick((dt, t) => { const i0 = Math.floor(t * 7) % 18; lamps.forEach((l, i) => { l.material = i === i0 || i === i0 - 1 ? on : off; }); });
    }
  }

  // ============================================================ andar 0: festa
  {
    const k = 0;
    // medalhão de mármore incrustado no centro do salão (plano: a festa continua andando por cima)
    const med = K.canvasTex(512, 512, (g, w, h) => {
      g.clearRect(0, 0, w, h); const c = w / 2;
      const ring = (r, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke(); };
      g.fillStyle = 'rgba(232,224,208,1)'; g.beginPath(); g.arc(c, c, 250, 0, 7); g.fill();
      ring(244, '#b8893a', 8); ring(226, '#3a3a40', 4); ring(150, '#b8893a', 5);
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, long = i % 2 === 0; g.fillStyle = long ? '#3a3a40' : '#b8893a'; g.beginPath(); g.moveTo(c, c); g.lineTo(c + Math.cos(a - 0.09) * 40, c + Math.sin(a - 0.09) * 40); g.lineTo(c + Math.cos(a) * (long ? 220 : 145), c + Math.sin(a) * (long ? 220 : 145)); g.lineTo(c + Math.cos(a + 0.09) * 40, c + Math.sin(a + 0.09) * 40); g.fill(); }
      g.fillStyle = '#b8893a'; g.beginPath(); g.arc(c, c, 30, 0, 7); g.fill(); K.grain(g, w, h, 10);
    });
    K.add(new T.CircleGeometry(2.6, 48).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({ map: med, transparent: true, roughness: 0.35, metalness: 0.05, envMapIntensity: 0.4 }), 1.4, 0.009, -1.2, at(k, { cast: false }));
    // confete e serpentina caídos em volta da pista de dança (um mesh só, rente ao chão)
    const bits = [], cols = [0xff5a7a, 0xffc860, 0x7ad8ff, 0xb48cff, 0xf6f1e8, 0x6ad89a];
    for (let i = 0; i < 420; i++) { const a = R() * Math.PI * 2, d = 2.4 + R() * 3.6; const x = 6.9 + Math.cos(a) * d * 1.1, z = 6.0 + Math.sin(a) * d * 0.7; if (z > 9.2 || x > 14.2 || x < -1) continue; const g = new T.PlaneGeometry(0.07, 0.1).rotateX(-Math.PI / 2); g.rotateY(R() * 3); g.translate(x, 0.011 + R() * 0.003, z); bits.push([g, cols[i % cols.length]]); }
    for (let i = 0; i < 9; i++) { const pts = []; const x0 = 3 + R() * 8, z0 = 3 + R() * 5.5; for (let j = 0; j < 12; j++) pts.push(new T.Vector3(x0 + j * 0.06, 0.012, z0 + Math.sin(j * 0.9) * 0.08)); const g = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 16, 0.006, 3, false); bits.push([g, cols[(i + 2) % cols.length]]); }
    K.merge(bits, K.vcol({ roughness: 0.7, side: T.DoubleSide }), at(k, { cast: false }));
  }

  // ============================================================ céu: gaivotas de dia, fogos atrás da torre à noite
  {
    const birds = K.birds({ x: 0, y: 36, z: -30, r: 24, n: 9, cor: 0xe8e4dc, tam: 0.45, vel: 0.16 });
    const fw = K.fireworks({ x0: -40, x1: 40, y: 40, dy: 8, z: -112, dz: 16, raio: 9, tam: 1.0, cada: 2.1, n: 4, cores: [0xffc860, 0xff4aa4, 0x35d8ff, 0xffa24a, 0xf6f1e8] });
    K.tick(() => { birds.visible = !K.noite; if (!K.noite) for (const sh of fw) sh.pts.visible = false; });
  }
};
