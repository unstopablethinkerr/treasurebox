let scene, camera, renderer, model, controls;
let isGestureControlEnabled = false; // Track gesture control state

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('ar-container').appendChild(renderer.domElement);

  // Lighting
  setupLights();

  // Load GLB Model
  loadModel('treasure_box.glb');

  // Ground Plane
  setupGround();

  // Controls
  setupControls();

  // UI Event Listeners
  setupEventListeners();

  // Handle Window Resize
  window.addEventListener('resize', onWindowResize, false);
}

function setupLights() {
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5).normalize();
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);
}

function loadModel(url) {
  const loader = new THREE.GLTFLoader();
  loader.load(
    url,
    function (gltf) {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.y = 0.5;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the model:', error);
    }
  );
}

function setupGround() {
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);
}

function setupControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
}

function setupEventListeners() {
  // Size Slider
  const sizeSlider = document.getElementById('size-slider');
  sizeSlider.addEventListener('input', (e) => {
    if (model) {
      const scale = parseFloat(e.target.value);
      model.scale.set(scale, scale, scale);
      model.position.y = 0.5 * scale; // Adjust height based on scale
    }
  });

  // Rotation Slider
  const rotationSlider = document.getElementById('rotation-slider');
  rotationSlider.addEventListener('input', (e) => {
    if (model) {
      const rotation = (parseFloat(e.target.value) * Math.PI) / 180;
      model.rotation.y = rotation;
    }
  });

  // Gesture Control Button
  const gestureControlButton = document.getElementById('gesture-control');
  gestureControlButton.addEventListener('click', () => {
    isGestureControlEnabled = !isGestureControlEnabled;
    gestureControlButton.textContent = isGestureControlEnabled ? '🛑' : '✋';
    alert(isGestureControlEnabled ? 'Gesture control activated!' : 'Gesture control deactivated!');
    // Add gesture detection logic here
  });

  // Reset View Button
  const resetButton = document.getElementById('reset-view');
  resetButton.addEventListener('click', () => {
    if (controls) controls.reset();
    if (camera) camera.position.set(0, 2, 5);
    if (model) {
      model.scale.set(1, 1, 1);
      model.rotation.y = 0;
      model.position.y = 0.5;
    }
    sizeSlider.value = 1;
    rotationSlider.value = 0;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
