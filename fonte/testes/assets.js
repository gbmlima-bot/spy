// The same pinned browser libraries as index.html, served locally during tests.
// A container's optional cdn/index.txt can still override these files.
const fs = require('fs'), path = require('path');
module.exports = function assets(dir) {
  const files = {};
  const three = path.dirname(require.resolve('three/package.json'));
  const put = (url, file) => { files[url] = fs.readFileSync(file); };
  put('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', path.join(three, 'build/three.min.js'));
  for (const file of ['shaders/FXAAShader.js', 'shaders/CopyShader.js', 'shaders/LuminosityHighPassShader.js', 'postprocessing/EffectComposer.js', 'postprocessing/RenderPass.js', 'postprocessing/ShaderPass.js', 'postprocessing/UnrealBloomPass.js', 'environments/RoomEnvironment.js']) {
    put('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/' + file, path.join(three, 'examples/js', file));
  }
  put('https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js', path.join(path.dirname(require.resolve('peerjs/package.json')), 'dist/peerjs.min.js'));
  const index = path.join(dir, 'cdn/index.txt');
  if (fs.existsSync(index)) for (const line of fs.readFileSync(index, 'utf8').trim().split('\n')) {
    const [file, url] = line.split(' '); if (file && url) put(url, path.join(dir, 'cdn', file));
  }
  return files;
};
