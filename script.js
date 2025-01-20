let video, videoTexture, videoMaterial;

// Initialize the camera feed
function initCameraFeed() {
  video = document.getElementById('camera-feed');

  // Access the device's camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      console.error('Error accessing the camera:', error);
    });

  // Create a video texture from the camera feed
  videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBFormat;

  // Create a material using the video texture
  videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true });

  // Create a plane geometry to display the video feed
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.Mesh(planeGeometry, videoMaterial);

  // Position the plane behind the 3D model
  plane.position.z = -5; // Adjust this value based on your scene
  scene.add(plane);
}

// Call initCameraFeed in your init function
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

  // Initialize camera feed
  initCameraFeed();

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

// Update the animate function to ensure the video texture is updated
function animate() {
  requestAnimationFrame(animate);

  // Update the video texture
  if (videoTexture) {
    videoTexture.needsUpdate = true;
  }

  controls.update();
  renderer.render(scene, camera);
}
