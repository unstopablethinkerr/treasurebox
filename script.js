let scene, camera, renderer, video, texture, models = [];

init();
animate();

function init() {
  // Access the camera feed
  video = document.getElementById('video');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream;
      video.play();

      // Create a texture from the video feed
      texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;

      // Create the scene
      scene = new THREE.Scene();

      // Create the camera
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

      // Create the renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Add lighting to the scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5).normalize();
      scene.add(directionalLight);

      // Load the 3D model
      const loader = new THREE.GLTFLoader();
      loader.load('treasure_box.glb', function (gltf) {
        for (let i = 0; i < 4; i++) {
          const model = gltf.scene.clone();
          model.scale.set(1, 1, 1); // Increase size of the 3D object
          model.position.set((i - 1.5) * 2, -0.5, -2); // Adjust position for equal spacing
          scene.add(model);
          models.push(model);
        }

        // Hide the loading message
        document.getElementById('loading').style.display = 'none';
      }, undefined, function (error) {
        console.error('An error occurred while loading the model:', error);
      });

      // Add a transparent plane to display the video texture
      const geometry = new THREE.PlaneGeometry(16, 9); // Aspect ratio 16:9
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.scale.set(1.5, 1.5, 1); // Adjust to cover the screen
      plane.position.z = -4; // Position it behind the 3D objects
      scene.add(plane);

      // Handle window resize
      window.addEventListener('resize', onWindowResize, false);
    })
    .catch(err => {
      console.error('Error accessing the camera:', err);
    });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate the models for a floating effect
  models.forEach(model => {
    model.rotation.y += 0.01; // Rotate around Y-axis
    model.position.y = Math.sin(Date.now() * 0.002) * 0.1; // Floating effect
  });

  renderer.render(scene, camera);
}
