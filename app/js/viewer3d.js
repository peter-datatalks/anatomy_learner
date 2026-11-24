/* 3D anatomy viewer (ES module, loaded on demand from app.js).
   Reads app/models/<id>.json + .bin produced by tools/build_3d.py. */
import * as THREE from 'three';
import { OrbitControls } from '../vendor/three/OrbitControls.js';

const cache = new Map();

async function loadModel(id) {
  if (!cache.has(id)) {
    cache.set(id, (async () => {
      const v = (document.querySelector('meta[name=build]') || {}).content || 'dev';
      const [manifest, buf] = await Promise.all([
        fetch(`models/${id}.json?v=${v}`).then(r => { if (!r.ok) throw new Error('manifest ' + r.status); return r.json(); }),
        fetch(`models/${id}.bin?v=${v}`).then(r => { if (!r.ok) throw new Error('mesh ' + r.status); return r.arrayBuffer(); })
      ]);
      const lo = manifest.bboxMin, hi = manifest.bboxMax, span = hi.map((h, i) => h - lo[i]);
      const centre = lo.map((l, i) => l + span[i] / 2);
      const geometries = {};
      for (const p of manifest.parts) {
        const q = new Uint16Array(buf, p.positionOffset, p.vertexCount * 3);
        const pos = new Float32Array(q.length);
        for (let i = 0; i < q.length; i++) {
          const a = i % 3;
          pos[i] = lo[a] + (q[i] / 65535) * span[a] - centre[a];
        }
        const idx = p.indexType === 'uint32'
          ? new Uint32Array(buf, p.indexOffset, p.indexCount)
          : new Uint16Array(buf, p.indexOffset, p.indexCount);
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setIndex(new THREE.BufferAttribute(idx, 1));
        g.computeVertexNormals();
        g.computeBoundingBox();
        geometries[p.key] = { geometry: g, kind: p.kind };
      }
      return { manifest, geometries };
    })());
  }
  return cache.get(id);
}

function cssColor(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  try { return new THREE.Color(v || fallback); } catch { return new THREE.Color(fallback); }
}

/**
 * Mount a viewer into `el`. Returns {highlight(structureId), setLayer(kind, visible), dispose()}.
 * Everything renders on demand (no animation loop) to save battery.
 */
export async function mountViewer(el, { modelId = 'upper-limb', structure = null, labels = {} } = {}) {
  const { manifest, geometries } = await loadModel(modelId);
  const canvasWrap = document.createElement('div');
  canvasWrap.className = 'v3d-canvas';
  el.replaceChildren(canvasWrap);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  canvasWrap.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 10000);
  camera.up.set(0, 0, 1); // BodyParts3D is z-up, in millimetres
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-300, -500, 600);
  scene.add(key);

  const colors = {
    bone: cssColor('--bone', '#cdb68c').lerp(new THREE.Color('#f3ead8'), 0.55),
    muscle: cssColor('--muscle', '#b23a48'),
    hi: cssColor('--nerve', '#e2b94a')
  };
  const meshes = {};
  for (const [k, { geometry, kind }] of Object.entries(geometries)) {
    const mat = new THREE.MeshStandardMaterial({ color: colors[kind], roughness: kind === 'bone' ? 0.75 : 0.55, metalness: 0, transparent: true });
    const m = new THREE.Mesh(geometry, mat);
    m.userData = { key: k, kind };
    scene.add(m);
    meshes[k] = m;
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.addEventListener('change', render);

  const layers = { bone: true, muscle: true };
  let current = null;

  function render() { renderer.render(scene, camera); }

  function resize() {
    const w = canvasWrap.clientWidth || 300, h = canvasWrap.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  }

  function frame(keys) {
    const box = new THREE.Box3();
    (keys.length ? keys : Object.keys(meshes)).forEach(k => meshes[k] && box.union(meshes[k].geometry.boundingBox));
    const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3()).length();
    const dist = Math.max(size, 60) / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.45;
    controls.target.copy(c);
    const dir = camera.position.clone().sub(c);
    if (dir.lengthSq() < 1) dir.set(0, -1, 0.15); // first view: from the front
    camera.position.copy(c).add(dir.normalize().multiplyScalar(dist));
    camera.near = dist / 100; camera.far = dist * 20;
    camera.updateProjectionMatrix();
    controls.update();
  }

  function apply() {
    const sel = new Set(current ? manifest.structures[current] || [] : []);
    for (const m of Object.values(meshes)) {
      const { key: k, kind } = m.userData;
      const on = sel.has(k);
      m.visible = on || layers[kind];
      m.material.color.copy(on ? colors.hi : colors[kind]);
      m.material.emissive.copy(on ? colors.hi : new THREE.Color(0)).multiplyScalar(on ? 0.25 : 0);
      m.material.opacity = !sel.size || on || kind === 'bone' ? 1 : 0.08;
      m.material.depthWrite = m.material.opacity === 1;
      m.renderOrder = on ? 2 : kind === 'bone' ? 0 : 1;
    }
    render();
  }

  // tap a part to identify it
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let downAt = null;
  renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(Object.values(meshes).filter(m => m.visible && m.material.opacity > 0.5), false)[0];
    el.dispatchEvent(new CustomEvent('v3d-pick', { detail: hit ? hit.object.userData : null, bubbles: true }));
  });

  const ro = new ResizeObserver(resize);
  ro.observe(canvasWrap);

  const api = {
    highlight(structureId) {
      current = structureId && manifest.structures[structureId] ? structureId : null;
      apply();
      frame(current ? manifest.structures[current] : []);
      render();
    },
    setLayer(kind, visible) { layers[kind] = visible; apply(); },
    resetView() { camera.position.set(0, 0, 0); frame(current ? manifest.structures[current] : []); render(); },
    has: id => !!manifest.structures[id],
    source: manifest.source,
    dispose() { ro.disconnect(); controls.dispose(); renderer.dispose(); el.replaceChildren(); }
  };
  resize();
  api.highlight(structure);
  return api;
}

/** Which structures have a 3D view (without building any geometry). */
export async function structuresWithModel(modelId = 'upper-limb') {
  const v = (document.querySelector('meta[name=build]') || {}).content || 'dev';
  const m = await fetch(`models/${modelId}.json?v=${v}`).then(r => r.json());
  return Object.keys(m.structures);
}
