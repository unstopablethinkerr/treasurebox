let camera, scene, renderer, model;

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
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Enable WebXR AR
  renderer.xr.enabled = true;
  document.body.appendChild(THREE.ARButton.createButton(renderer));

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Load 3D Model
  const loader = new THREE.GLTFLoader();
  loader.load('treasure_box.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5); // Adjust scale
    scene.add(model);
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
  renderer.setAnimationLoop(render);
}

function render() {
  if (model) {
    model.rotation.y += 0.01; // Rotate the model for a realistic effect
  }
  renderer.render(scene, camera);
}
