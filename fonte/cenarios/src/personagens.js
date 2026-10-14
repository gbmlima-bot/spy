// Mira na Cobertura: acessórios extras dos personagens (chapéus, máscaras, aventais, objetos nas mãos).
// O makeChar do jogo chama, no fim: if (window.MIRA_VESTIR) MIRA_VESTIR(T, o, B, m, mat, glow, headG);
// Tudo fica preso aos ossos do rig Mixamo, em centímetros (o rig é escalado para metros pelo makeChar).
// Campos novos do outfit (todos opcionais):
//   hat: 'top' | 'bowler' | 'fedora' | 'tricorn' | 'boater' | 'beret' | 'chef' | 'cap' | 'beanie' | 'fez' | 'cowboy' | 'veil' | 'tiara' | 'feathers' | 'turban' | 'kasa' | 'hardhat' | 'flower'
//   hatColor, hatBand, mask: 'venetian' | 'domino' | 'plague' | 'kitsune' | 'ski', maskColor, glasses: 'sun' | 'round' | 'monocle' | 'goggles'
//   apron, scarf, sash, cape, gloves, stripes (cores), coat (casaco longo, cor), skirt (saia rodada, cor), lei (colar de flores, cor)
//   trayUp: bandeja nivelada na palma (garçom de braço erguido); prop (mão direita) e propL (mão esquerda): 'tray' | 'camera' | 'violin' | 'fan' | 'bouquet' | 'clipboard' | 'umbrella' | 'oar' | 'binoculars' | 'teapot' | 'cane'
//     | 'mic' | 'torch' | 'book' | 'baton' | 'shaker' | 'lantern' | 'cigar' | 'flute' | 'tablet' | 'radio' | 'ski' | 'pole' | 'tambourine' | 'whistle' | 'map' | 'magnifier' | 'gavel' | 'skewer' | 'scroll'
(function () {
  const G = {};
  function geos(T) {
    if (G.ok) return G;
    const cyl = (rt, rb, h, s = 14) => new T.CylinderGeometry(rt, rb, h, s);
    Object.assign(G, {
      ok: true,
      brim: cyl(17, 17, 1.2, 20), crownTall: cyl(10.5, 11, 17, 18), crownLow: cyl(11, 11.6, 9, 18), bowler: new T.SphereGeometry(12, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      fedoraCrown: (() => { const g = cyl(9.5, 11.5, 10, 16); g.scale(1, 1, 0.9); return g; })(), band: cyl(11.7, 11.7, 2.4, 18),
      tricorn: (() => { const g = new T.TorusGeometry(13, 3.4, 6, 3); g.rotateX(Math.PI / 2); return g; })(),
      beret: (() => { const g = new T.SphereGeometry(13.5, 16, 8); g.scale(1, 0.32, 1); return g; })(),
      chef: cyl(13, 11, 20, 16), chefTop: (() => { const g = new T.SphereGeometry(14, 14, 8); g.scale(1, 0.55, 1); return g; })(),
      capTop: (() => { const g = cyl(12.5, 11.4, 7, 16); return g; })(), visor: (() => { const g = cyl(8, 8, 0.8, 12, 1, false, -Math.PI / 2, Math.PI); g.scale(1, 1, 1); return g; })(),
      beanie: new T.SphereGeometry(12.4, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), pom: new T.SphereGeometry(3.5, 8, 6),
      fez: cyl(8.5, 10.5, 12, 14), tassel: cyl(0.4, 0.4, 9, 4),
      cowboyBrim: (() => { const g = cyl(21, 21, 1.2, 20); g.scale(1, 1, 0.8); return g; })(),
      veil: cyl(11, 26, 70, 18, 1, true), tiara: new T.TorusGeometry(10.5, 0.8, 4, 16, Math.PI),
      feather: (() => { const g = new T.SphereGeometry(3, 6, 6); g.scale(1, 6, 0.3); return g; })(),
      turban: (() => { const g = new T.TorusGeometry(10, 5, 8, 16); g.rotateX(Math.PI / 2); return g; })(),
      kasa: new T.ConeGeometry(24, 11, 18), hard: new T.SphereGeometry(12.8, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), hardBrim: cyl(14.5, 14.5, 1, 16),
      flower: new T.SphereGeometry(3, 8, 6),
      mask: (() => { const g = new T.SphereGeometry(11.8, 14, 8, Math.PI * 0.62, Math.PI * 0.76, Math.PI * 0.28, Math.PI * 0.26); g.scale(0.95, 1.12, 1.05); return g; })(),
      maskFull: (() => { const g = new T.SphereGeometry(12, 14, 10, Math.PI * 0.6, Math.PI * 0.8, Math.PI * 0.2, Math.PI * 0.55); g.scale(0.95, 1.12, 1.08); return g; })(),
      beak: (() => { const g = new T.ConeGeometry(3.6, 18, 8); g.rotateX(Math.PI / 2); g.translate(0, 0, 9); return g; })(),
      snout: (() => { const g = new T.ConeGeometry(4.5, 9, 6); g.rotateX(Math.PI / 2); g.translate(0, 0, 4.5); return g; })(), ear: new T.ConeGeometry(3, 7, 4),
      lens: cyl(2.6, 2.6, 0.8, 12), monocle: new T.TorusGeometry(2.6, 0.35, 4, 12), bridge: new T.BoxGeometry(3, 0.6, 0.6), goggle: new T.BoxGeometry(20, 5, 2),
      apron: new T.BoxGeometry(26, 48, 1.2), apronBib: new T.BoxGeometry(18, 18, 1.2), scarf: new T.TorusGeometry(7, 2.6, 6, 14), scarfTail: new T.BoxGeometry(5, 22, 1.4),
      sash: (() => { const g = new T.CylinderGeometry(14.4, 14.4, 6, 16, 1, true); return g; })(), sashBow: new T.BoxGeometry(14, 8, 4),
      cape: (() => { const g = new T.CylinderGeometry(17, 30, 90, 16, 1, true, Math.PI * 0.62, Math.PI * 1.76); g.translate(0, -45, -2); return g; })(),
      coat: new T.CylinderGeometry(15, 22, 62, 14, 1, true).translate(0, -31, 0), skirt: new T.CylinderGeometry(14, 40, 62, 18, 1, true).translate(0, -31, 0),
      stripe: (() => { const g = new T.TorusGeometry(15.2, 0.9, 4, 18); g.rotateX(Math.PI / 2); return g; })(), glove: new T.SphereGeometry(5, 8, 6), lei: new T.TorusGeometry(9, 2.2, 6, 18),
      tray: cyl(15, 15, 1, 18), trayGlass: cyl(1.8, 1.0, 5, 8), camBody: new T.BoxGeometry(12, 8, 6), camLens: cyl(3, 3.4, 7, 10),
      violin: (() => { const g = new T.SphereGeometry(7, 10, 8); g.scale(1, 1.6, 0.35); return g; })(), neck: new T.BoxGeometry(2, 22, 1.5), bow: new T.BoxGeometry(0.6, 50, 0.6),
      fan: (() => { const g = new T.CircleGeometry(16, 12, 0, Math.PI * 0.9); return g; })(), stem: cyl(0.5, 0.5, 26, 5), bloom: new T.SphereGeometry(3.2, 7, 5),
      board: new T.BoxGeometry(16, 22, 1.2), umbTop: new T.ConeGeometry(60, 18, 10, 1, true), umbPole: cyl(0.7, 0.7, 90, 6),
      oarShaft: cyl(1.2, 1.2, 260, 6), oarBlade: new T.BoxGeometry(12, 45, 1.5), binoc: cyl(2.4, 2.8, 10, 10), teapot: (() => { const g = new T.SphereGeometry(7, 12, 8); g.scale(1, 0.85, 1); return g; })(),
      spout: cyl(0.8, 1.6, 10, 6), cane: cyl(1, 1, 85, 6), mic: new T.SphereGeometry(3, 8, 6), micStick: cyl(1.2, 1.6, 16, 8), torch: cyl(1.6, 2.4, 28, 8),
      book: new T.BoxGeometry(14, 19, 3.5), baton: cyl(0.4, 0.6, 32, 5), shaker: cyl(3.4, 3, 16, 10), lantern: new T.BoxGeometry(10, 13, 10), cigar: cyl(0.9, 0.9, 11, 6),
      flute: cyl(1, 1, 55, 6), tablet: new T.BoxGeometry(16, 22, 1.2), radio: new T.BoxGeometry(5, 14, 3.5), antenna: cyl(0.4, 0.4, 10, 4), ski: new T.BoxGeometry(8, 170, 1.5),
      pole: cyl(0.6, 0.6, 115, 5), tambourine: new T.TorusGeometry(10, 2, 6, 16), map: new T.PlaneGeometry(30, 22), magRing: new T.TorusGeometry(5, 0.7, 6, 14), gavel: new T.BoxGeometry(5, 5, 12), skewer: cyl(0.3, 0.3, 26, 4), scroll: cyl(2.2, 2.2, 20, 8),
    });
    return G;
  }

  function hand(T, kind, B, side, m, mat, glow, o) {
    const P = side === 'R' ? B.RightHand : B.LeftHand, sx = side === 'R' ? -1 : 1;
    const g = new T.Group(); g.position.set(sx * 7, -2, 3); P.add(g);
    const dark = mat(0x16161a, { roughness: 0.35, metalness: 0.3 }), wood = mat(0x5a3a22, { roughness: 0.55 }), brass = mat(0xd9a441, { metalness: 0.85, roughness: 0.28 }), silver = mat(0xc9ced6, { metalness: 0.85, roughness: 0.25 });
    const c = o.propColor || 0xc8322f;
    switch (kind) {
      case 'tray': { const t = m(G.tray, silver, 0, 2, 10, g); if (o.trayUp) t.rotation.x = Math.PI / 2; for (let i = 0; i < 4; i++) m(G.trayGlass, mat(0xf2c14e, { emissive: 0xf2c14e, emissiveIntensity: 0.3, roughness: 0.2 }), Math.cos(i * 1.6) * 8, 3.5, Math.sin(i * 1.6) * 8, t); break; }
      case 'camera': { const b = m(G.camBody, dark, 0, 0, 6, g); m(G.camLens, dark, 0, 0, 6, b).rotation.x = Math.PI / 2; m(new T.BoxGeometry(4, 3, 3), glow(0xffffff, 1.5), 4, 5, 0, b); break; }
      case 'violin': { const v = new T.Group(); v.position.set(0, 4, 10); v.rotation.set(0.4, 0, 1.2); g.add(v); m(G.violin, mat(0x8a3a12, { roughness: 0.35 }), 0, 0, 0, v); m(G.neck, dark, 0, 16, 0, v); break; }
      case 'fan': { const f = m(G.fan, mat(c, { side: T.DoubleSide, roughness: 0.6 }), 0, 4, 4, g); f.rotation.set(0, 0, 0.2); break; }
      case 'bouquet': { m(G.stem, mat(0x3f6b34), 0, 0, 4, g).rotation.x = 0.2; for (let i = 0; i < 7; i++) m(G.bloom, mat(i % 2 ? 0xffffff : c), Math.cos(i) * 4, 14 + (i % 3) * 2, 4 + Math.sin(i) * 4, g); break; }
      case 'clipboard': m(G.board, mat(0x9a7448), 0, 4, 6, g).rotation.x = -0.8; break;
      case 'tablet': m(G.tablet, dark, 0, 4, 6, g).rotation.x = -0.9; m(new T.PlaneGeometry(14, 19), glow(0x9fd0ff, 1.2), 0, 4.5, 7.2, g).rotation.x = -0.9; break;
      case 'umbrella': { m(G.umbPole, wood, 0, 40, 0, g); m(G.umbTop, mat(c, { side: T.DoubleSide, roughness: 0.7 }), 0, 85, 0, g); break; }
      case 'oar': { const s = m(G.oarShaft, wood, 0, 0, 0, g); s.rotation.z = 0.3; m(G.oarBlade, wood, 0, -140, 0, s); break; }
      case 'binoculars': for (const s of [-3, 3]) m(G.binoc, dark, s, 0, 6, g).rotation.x = Math.PI / 2; break;
      case 'teapot': { m(G.teapot, silver, 0, -2, 8, g); m(G.spout, silver, 8, 0, 8, g).rotation.z = -0.8; break; }
      case 'cane': m(G.cane, dark, 0, -40, 3, g); m(new T.SphereGeometry(2, 8, 6), brass, 0, 2, 3, g); break;
      case 'mic': m(G.micStick, dark, 0, 2, 4, g); m(G.mic, silver, 0, 11, 4, g); break;
      case 'torch': m(G.torch, wood, 0, 6, 4, g); { const f = new T.Mesh(new T.SphereGeometry(4, 8, 6).scale(1, 1.8, 1), glow(0xffa040, 3)); f.position.set(0, 24, 4); g.add(f); } break;
      case 'book': m(G.book, mat(c, { roughness: 0.8 }), 0, 2, 6, g).rotation.x = -0.4; break;
      case 'scroll': m(G.scroll, mat(0xe9dcb8, { roughness: 0.9 }), 0, 2, 6, g).rotation.z = Math.PI / 2; break;
      case 'baton': m(G.baton, mat(0xf6f3ec), 0, 14, 4, g).rotation.x = 0.5; break;
      case 'shaker': m(G.shaker, silver, 0, 4, 4, g); break;
      case 'lantern': { m(new T.CylinderGeometry(0.4, 0.4, 10, 4), dark, 0, -4, 4, g); m(G.lantern, glow(o.propColor || 0xffb050, 1.8), 0, -14, 4, g); break; }
      case 'cigar': { m(G.cigar, mat(0x5a3a22), -2, 0, 5, g).rotation.z = Math.PI / 2; m(new T.SphereGeometry(1, 6, 4), glow(0xff5020, 3), -8, 0, 5, g); break; }
      case 'flute': m(G.flute, silver, 0, 0, 6, g).rotation.z = Math.PI / 2; break;
      case 'radio': m(G.radio, dark, 0, 4, 4, g); m(G.antenna, dark, 1.5, 15, 4, g); break;
      case 'ski': m(G.ski, mat(c, { roughness: 0.4 }), 0, 30, 0, g); m(G.ski, mat(c, { roughness: 0.4 }), 9, 30, 0, g); break;
      case 'pole': m(G.pole, silver, 0, -50, 2, g); break;
      case 'tambourine': m(G.tambourine, wood, 0, 4, 6, g).rotation.y = Math.PI / 2; break;
      case 'whistle': m(new T.BoxGeometry(2, 2, 5), silver, 0, 0, 4, g); break;
      case 'map': { const p = m(G.map, mat(0xe9dcb8, { side: T.DoubleSide, roughness: 0.9 }), 0, 6, 10, g); p.rotation.x = -1.0; break; }
      case 'magnifier': m(G.magRing, brass, 0, 10, 4, g); m(new T.CylinderGeometry(0.8, 0.8, 9, 5), wood, 0, 2, 4, g); break;
      case 'gavel': m(G.gavel, wood, 0, 10, 4, g).rotation.y = Math.PI / 2; m(new T.CylinderGeometry(0.7, 0.7, 12, 5), wood, 0, 4, 4, g); break;
      case 'skewer': m(G.skewer, wood, 0, 6, 6, g).rotation.x = 0.8; for (let i = 0; i < 4; i++) m(new T.SphereGeometry(1.6, 6, 4), mat(i % 2 ? 0x8a4a22 : 0xc8322f), 0, 10 + i * 2.5, 9 + i * 2, g); break;
    }
    return g;
  }

  window.MIRA_VESTIR = function (T, o, B, m, mat, glow, headG) {
    if (!o) return;
    geos(T);
    if (!headG) { headG = new T.Group(); headG.position.set(0, 9.5, 1.5); B.Head.add(headG); }
    const hc = mat(o.hatColor ?? 0x1b1b1f, { roughness: 0.6 }), band = mat(o.hatBand ?? 0x8b1e2d, { roughness: 0.5 });
    switch (o.hat) {
      case 'top': m(G.brim, hc, 0, 9, -1, headG); m(G.crownTall, hc, 0, 18, -1, headG); m(G.band, band, 0, 11.5, -1, headG); break;
      case 'bowler': m(G.bowler, hc, 0, 8, -1, headG); m(G.brim, hc, 0, 8, -1, headG).scale.set(0.82, 1, 0.82); break;
      case 'fedora': { m(G.brim, hc, 0, 9, -1, headG).rotation.x = -0.08; m(G.fedoraCrown, hc, 0, 14, -1, headG); m(G.band, band, 0, 10.5, -1, headG).scale.set(0.95, 1, 0.9); break; }
      case 'tricorn': m(G.tricorn, hc, 0, 11, -1, headG); m(G.crownLow, hc, 0, 13, -1, headG); break;
      case 'boater': m(G.brim, mat(o.hatColor ?? 0xe9d79a, { roughness: 0.8 }), 0, 9.5, -1, headG); m(G.crownLow, mat(o.hatColor ?? 0xe9d79a, { roughness: 0.8 }), 0, 14, -1, headG); m(G.band, band, 0, 12, -1, headG).scale.set(0.95, 1, 0.95); break;
      case 'beret': { const b = m(G.beret, hc, 1.5, 11, -2, headG); b.rotation.z = 0.25; break; }
      case 'chef': m(G.chef, mat(0xffffff, { roughness: 0.8 }), 0, 16, -1, headG); m(G.chefTop, mat(0xffffff, { roughness: 0.8 }), 0, 26, -1, headG); break;
      case 'cap': m(G.capTop, hc, 0, 12, -1, headG); m(G.visor, dark(mat), 0, 9, 4, headG); m(G.band, band, 0, 10, -1, headG).scale.set(1.02, 0.6, 1.02); break;
      case 'beanie': m(G.beanie, hc, 0, 2.5, -1, headG); m(G.pom, band, 0, 15, -1, headG); break;
      case 'fez': m(G.fez, mat(o.hatColor ?? 0xa8172a, { roughness: 0.7 }), 0, 13, -1, headG); m(G.tassel, mat(0x16161a), 5, 15, -1, headG).rotation.z = 0.5; break;
      case 'cowboy': m(G.cowboyBrim, hc, 0, 10, -1, headG); m(G.fedoraCrown, hc, 0, 15, -1, headG); break;
      case 'veil': { const dk = o.hatColor != null && o.hatColor < 0x808080; m(G.veil, mat(o.hatColor ?? 0xffffff, { transparent: true, opacity: dk ? 0.82 : 0.55, side: T.DoubleSide, roughness: 0.9 }), 0, -24, -4, headG); m(G.tiara, dk ? mat(0x16161a, { metalness: 0.6, roughness: 0.3 }) : mat(0xe8e8f0, { metalness: 0.9, roughness: 0.2 }), 0, 9, 0, headG).rotation.x = -0.3; break; }
      case 'tiara': m(G.tiara, mat(0xe8e8f0, { metalness: 0.9, roughness: 0.15 }), 0, 9, 0, headG).rotation.x = -0.3; break;
      case 'feathers': { const cs = [o.hatColor ?? 0xff3d7f, 0xffd23f, 0x2ec4b6, 0xff6b2c, 0x9b5de5]; for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.3; const f = m(G.feather, glow(cs[i % cs.length], 1.2), Math.sin(a) * 14, 22 + Math.cos(a) * 6, -4, headG); f.rotation.z = -a * 0.8; } m(G.band, mat(0xd9a441, { metalness: 0.8, roughness: 0.3 }), 0, 8, -1, headG); break; }
      case 'turban': m(G.turban, hc, 0, 9, -1, headG); m(G.crownLow, hc, 0, 11, -1, headG); m(new T.SphereGeometry(2, 8, 6), mat(0xc8322f, { metalness: 0.5, roughness: 0.2 }), 0, 11, 13, headG); break;
      case 'kasa': m(G.kasa, mat(o.hatColor ?? 0xc9a36a, { roughness: 0.9 }), 0, 15, -1, headG); break;
      case 'hardhat': m(G.hard, mat(o.hatColor ?? 0xf2c14e, { roughness: 0.4 }), 0, 7, -1, headG); m(G.hardBrim, mat(o.hatColor ?? 0xf2c14e, { roughness: 0.4 }), 0, 7, 1, headG); break;
      case 'flower': for (let i = 0; i < 5; i++) m(G.flower, mat(i ? (o.hatColor ?? 0xff5d8f) : 0xffd23f), 9 + Math.cos(i * 1.25) * (i ? 3 : 0), 6 + Math.sin(i * 1.25) * (i ? 3 : 0), 2, headG); break;
    }
    const mc = mat(o.maskColor ?? 0xd9a441, { metalness: o.maskColor ? 0.2 : 0.7, roughness: 0.3 });
    switch (o.mask) {
      case 'venetian': { m(G.mask, mc, 0, 2.6, 0.7, headG); for (let i = 0; i < 3; i++) { const f = m(G.feather, mat(o.maskFeather ?? 0xf6f3ec, { roughness: 0.8 }), 6 + i * 2.5, 10 + i, 2, headG); f.rotation.z = -0.4 - i * 0.25; f.scale.setScalar(0.7); } break; }
      case 'domino': m(G.mask, mat(o.maskColor ?? 0x16161a, { roughness: 0.4 }), 0, 2.6, 0.6, headG).scale.set(1, 0.7, 1); break;
      case 'plague': m(G.maskFull, mat(o.maskColor ?? 0xf1ece2, { roughness: 0.5 }), 0, 0, 0.6, headG); m(G.beak, mat(o.maskColor ?? 0xf1ece2, { roughness: 0.5 }), 0, -2, 10, headG).rotation.x = 0.35; break;
      case 'kitsune': { m(G.maskFull, mat(0xffffff, { roughness: 0.5 }), 0, 0, 0.6, headG); m(G.snout, mat(0xffffff, { roughness: 0.5 }), 0, -1.5, 11, headG); for (const s of [-1, 1]) { m(G.ear, mat(0xffffff), s * 6, 12, 3, headG).rotation.z = -s * 0.3; m(new T.BoxGeometry(4, 0.8, 0.5), mat(0xc8322f), s * 4, 2.5, 11.6, headG).rotation.z = s * 0.4; } break; }
      case 'ski': m(G.maskFull, mat(o.maskColor ?? 0x16161a, { roughness: 0.9 }), 0, 0, 0.4, headG); break;
    }
    switch (o.glasses) {
      case 'sun': case 'round': { const lm = o.glasses === 'sun' ? mat(0x111111, { roughness: 0.1, metalness: 0.6 }) : mat(0xdde8f0, { transparent: true, opacity: 0.35, roughness: 0.05 }); for (const s of [-1, 1]) m(G.lens, lm, s * 3.9, 1.4, 11.6, headG).rotation.x = Math.PI / 2; m(G.bridge, mat(0x16161a, { metalness: 0.8 }), 0, 1.6, 11.8, headG); break; }
      case 'monocle': m(G.monocle, mat(0xd9a441, { metalness: 0.9, roughness: 0.2 }), 3.9, 1.3, 11.7, headG); break;
      case 'goggles': m(G.goggle, mat(o.maskColor ?? 0xff9a3c, { roughness: 0.1, metalness: 0.5, emissive: 0x552200, emissiveIntensity: 0.4 }), 0, 2, 9.5, headG); break;
    }
    if (o.apron) { m(G.apron, mat(o.apron, { roughness: 0.85 }), 0, -12, 12, B.Hips); m(G.apronBib, mat(o.apron, { roughness: 0.85 }), 0, 6, 12.6, B.Spine2); }
    if (o.scarf) { m(G.scarf, mat(o.scarf, { roughness: 0.9 }), 0, 4, 1, B.Neck).rotation.x = Math.PI / 2; m(G.scarfTail, mat(o.scarf, { roughness: 0.9 }), 4, 10, 13, B.Spine2).rotation.z = 0.15; }
    if (o.sash) { m(G.sash, mat(o.sash, { roughness: 0.6 }), 0, 4, 0, B.Spine); m(G.sashBow, mat(o.sash, { roughness: 0.6 }), 0, 4, -14, B.Spine); }
    if (o.cape) m(G.cape, mat(o.cape, { side: T.DoubleSide, roughness: 0.7 }), 0, 22, -4, B.Spine2);
    if (o.coat) m(G.coat, mat(o.coat, { side: T.DoubleSide, roughness: 0.8 }), 0, 4, 0, B.Hips);
    if (o.skirt) m(G.skirt, mat(o.skirt, { side: T.DoubleSide, roughness: 0.75 }), 0, 0, 0, B.Hips);
    if (o.lei) m(G.lei, mat(o.lei, { roughness: 0.8 }), 0, 16, 5, B.Spine2).rotation.x = Math.PI / 2 + 0.4;
    // horizontal bands round the shirt, each fitted to the torso's width at its height (the torso is 0.62 as deep as it is wide)
    if (o.stripes) for (let i = 0; i < 4; i++) { const k = ([14.6, 15.2, 16.2, 17.2][i] + 0.4) / 15.2; m(G.stripe, mat(o.stripes, { roughness: 0.7 }), 0, 6 + i * 7, 0, B.Spine).scale.set(k, 1.4, k * 0.62); }
    if (o.gloves) for (const s of ['Left', 'Right']) m(G.glove, mat(o.gloves, { roughness: 0.6 }), s === 'Left' ? 5 : -5, 0, 0, B[s + 'Hand']).scale.set(1.5, 0.75, 1);
    if (o.prop2) hand(T, o.prop2, B, 'R', m, mat, glow, o);
    if (o.propL) hand(T, o.propL, B, 'L', m, mat, glow, o);
  };
  function dark(mat) { return mat(0x16161a, { roughness: 0.35 }); }
  // props da mão direita que o jogo original não conhece passam por aqui (o jogo trata 'can', 'sax', 'brush')
  window.MIRA_VESTIR.props = ['tray', 'camera', 'violin', 'fan', 'bouquet', 'clipboard', 'umbrella', 'oar', 'binoculars', 'teapot', 'cane', 'mic', 'torch', 'book', 'baton', 'shaker', 'lantern', 'cigar', 'flute', 'tablet', 'radio', 'ski', 'pole', 'tambourine', 'whistle', 'map', 'magnifier', 'gavel', 'skewer', 'scroll'];
  // a mão direita usa o campo prop do jogo; se for um dos nossos, desenha aqui
  const base = window.MIRA_VESTIR;
  window.MIRA_VESTIR = function (T, o, B, m, mat, glow, headG) {
    base(T, o, B, m, mat, glow, headG);
    if (o && o.prop && base.props.includes(o.prop)) hand(T, o.prop, B, 'R', m, mat, glow, o);
  };
  window.MIRA_VESTIR.props = base.props;
})();
