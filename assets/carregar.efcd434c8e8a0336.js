// Manifest paths are relative to the document, including GitHub Pages subdirectories.
(() => {
  const manifest = window.MIRA_MANIFEST, pending = new Map(), done = new Set();
  window.MIRA_CENARIOS = manifest.scenarios.map(s => ({ ...s }));
  function script(asset) {
    if (done.has(asset.url)) return Promise.resolve();
    if (pending.has(asset.url)) return pending.get(asset.url);
    const promise = new Promise((resolve, reject) => {
      const el = document.createElement('script'); el.src = new URL(asset.url, document.baseURI).href;
      el.integrity = asset.integrity;
      el.onload = () => { done.add(asset.url); resolve(); };
      el.onerror = () => { el.remove(); reject(Error('Failed to load ' + asset.url)); };
      document.head.append(el);
    }).finally(() => pending.delete(asset.url));
    pending.set(asset.url, promise); return promise;
  }
  const mapPending = new Map(), ready = new Set();
  window.MIRA_ASSETS = {
    ready: id => ready.has(+id),
    ensureMapAssets(id) {
      id = +id;
      if (!Number.isInteger(id) || !manifest.maps[id]) return Promise.reject(Error('Unknown map: ' + id));
      if (ready.has(id)) return Promise.resolve();
      if (mapPending.has(id)) return mapPending.get(id);
      const promise = (async () => {
        for (const asset of [...manifest.common, ...manifest.maps[id]]) await script(asset);
        if (id && !window.MIRA_CENARIOS[id - 1]?.build) throw Error('Scenario did not register');
        if (!id && !window.MIRA_ROOFTOP_BUILD) throw Error('Rooftop did not register');
        ready.add(id);
      })().finally(() => mapPending.delete(id));
      mapPending.set(id, promise); return promise;
    }
  };
  function failure(message) {
    window.MIRA_BOOT_ERROR = message;
    const box = document.getElementById('loading'); box.hidden = false;
    box.textContent = window.MIRA_IDIOMA?.lang === 'en' ? 'Unable to start the game. Check WebGL and reload.' : 'Não foi possível abrir o jogo. Verifique o WebGL e recarregue.';
    const button = document.createElement('button'); button.textContent = window.MIRA_IDIOMA?.lang === 'en' ? 'Reload' : 'Recarregar'; button.onclick = () => location.reload(); box.append(button);
  }
  addEventListener('error', e => { if (!window.__mira) failure(e.message || 'Asset load error'); });
  window.MIRA_ASSET_ERROR = failure;
})();
