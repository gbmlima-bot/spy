// ---- idioma.js
// Mira na Cobertura em inglês: o jogo escreve tudo em português e esta camada traduz o texto que aparece na tela.
// Um observador do DOM troca cada nó de texto (e placeholder, aria-label, title) pela tradução do dicionário (en.tsv):
// frase exata, a mesma frase com inicial minúscula, padrões com {1}, {2} (as partes também são traduzidas) e descrições de
// roupa separadas por vírgula. O que não estiver no dicionário fica em português. Trocar de idioma recarrega a página.
// Idioma: ?lang=en|pt, depois o escolhido no menu (localStorage mira-lang), depois o do navegador (pt-* fica em português).
window.MIRA_IDIOMA = (() => {
  const EN = window.MIRA_EN || {};
  let lang = 'pt';
  try {
    const q = new URLSearchParams(location.search).get('lang'), s = localStorage.getItem('mira-lang');
    lang = q === 'en' || q === 'pt' ? q : s === 'en' || s === 'pt' ? s : /^pt\b/i.test(navigator.language || 'pt') ? 'pt' : 'en';
  } catch (e) { }
  const exact = new Map(), lower = new Map(), anyCase = new Map(), pats = [];
  const lcFirst = s => s && s[0].toLowerCase() + s.slice(1), ucFirst = s => s && s[0].toUpperCase() + s.slice(1);
  for (const [pt, en] of Object.entries(EN)) {
    if (/\{\d+\}/.test(pt)) {
      const parts = pt.split(/\{(\d+)\}/), order = [];
      let re = '^';
      parts.forEach((p, i) => { if (i % 2) { re += '(.*?)'; order.push(+p); } else re += p.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&'); });
      pats.push({ re: new RegExp(re + '$'), order, en, n: pt.replace(/\{\d+\}/g, '').length });
    } else { exact.set(pt, en); if (pt[0] !== lcFirst(pt)[0]) lower.set(lcFirst(pt), lcFirst(en)); if (!anyCase.has(pt.toLowerCase())) anyCase.set(pt.toLowerCase(), lcFirst(en)); }
  }
  pats.sort((a, b) => b.n - a.n);
  const PT_CH = /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]|\b(de|da|do|um|uma|na|no|com|para|você|não|missão|missões|rodada|sala)\b/i;
  const cache = new Map(), misses = new Set();
  function tr(s, depth = 0) {
    if (!s || depth > 3) return null;
    if (exact.has(s)) return exact.get(s);
    if (lower.has(s)) return lower.get(s);
    if (s === s.toLowerCase() && anyCase.has(s)) return anyCase.get(s); // a label written all in lower case ("missão real: …")
    if (/^[\d\s.,:;·×%+\-–—/()|!?…✓↳▾▸●✕#]*$/.test(s)) return null;
    // a few glued pieces: "nome · lugar", roupas "vestido azul, cabelo ruivo"
    for (const sep of [' · ', ', ']) if (s.includes(sep)) {
      const ps = s.split(sep), ts = ps.map(p => tr(p.trim(), depth + 1));
      if (ts.some(t => t != null) && ts.every((t, i) => t != null || !PT_CH.test(ps[i]))) return ps.map((p, i) => ts[i] ?? p).join(sep);
    }
    for (const P of pats) {
      const m = P.re.exec(s); if (!m) continue;
      const g = m.slice(1).map(x => { const y = tr(x.trim(), depth + 1); return y == null ? x : x.replace(x.trim(), y); });
      return P.en.replace(/\{(\d+)\}/g, (_, k) => g[P.order.indexOf(+k)] ?? '');
    }
    return null;
  }
  function t(s) {
    if (lang !== 'en' || typeof s !== 'string') return s;
    const k = s.trim(); if (!k) return s;
    let en = cache.get(k);
    if (en === undefined) { en = tr(k); if (en == null && PT_CH.test(k)) misses.add(k); if (cache.size > 5000) cache.clear(); cache.set(k, en); }
    return en == null ? s : s.replace(k, en);
  }
  const done = new WeakMap();
  function text(n) {
    const v = n.nodeValue; if (!v || done.get(n) === v || !/[A-Za-zÀ-ú]/.test(v) || !n.parentElement || /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName) || n.parentElement.closest('[translate=no]')) return;
    const o = t(v); done.set(n, o); if (o !== v) n.nodeValue = o;
  }
  const ATTRS = ['placeholder', 'aria-label', 'title'];
  function el(e) { for (const a of ATTRS) if (e.hasAttribute && e.hasAttribute(a)) { const v = e.getAttribute(a), o = t(v); if (o !== v) e.setAttribute(a, o); } }
  function walk(root) {
    if (root.nodeType === 3) return text(root);
    if (root.nodeType !== 1 || root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    el(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    for (let n = w.nextNode(); n; n = w.nextNode()) { if (n.nodeType === 3) text(n); else el(n); }
  }
  function start() {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    if (lang !== 'en') return;
    walk(document.body);
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'characterData') text(m.target);
        else if (m.type === 'attributes') el(m.target);
        else for (const n of m.addedNodes) walk(n);
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function set(l) { try { localStorage.setItem('mira-lang', l); } catch (e) { } const u = new URL(location.href); u.searchParams.delete('lang'); location.replace(u.toString()); }
  if (document.body) start(); else addEventListener('DOMContentLoaded', start);
  return { get lang() { return lang; }, t, set, misses, size: exact.size + pats.length };
})();
