let scene, camera, renderer, controls, model, mixer;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.getElementById('ar-container').appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Load GLB Model
  const loader = new THREE.GLTFLoader();
  loader.load('treasure_box.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    scene.add(model);
  });

  // Sliders
  const sizeSlider = document.getElementById('size-slider');
  const rotationSlider = document.getElementById('rotation-slider');

  sizeSlider.addEventListener('input', (e) => {
    if (model) {
      const scale = parseFloat(e.target.value);
      model.scale.set(scale, scale, scale);
    }
  });

  rotationSlider.addEventListener('input', (e) => {
    if (model) {
      const rotation = (parseFloat(e.target.value) * Math.PI) / 180;
      model.rotation.y = rotation;
    }
  });

  // Handle Window Resize
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
