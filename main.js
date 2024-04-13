import * as THREE from 'three'
import { createBox, createFloor } from './objects.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

var scene, camera, renderer, ambientLight, directionalLight, objects, oControls, dControls, plane, intersects, raycaster, touch;

function init() {
  // camera
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(-35, 70, 100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfd1e5);

  // ambient light
  ambientLight = new THREE.AmbientLight(0xffffff, 0.20);
  scene.add(ambientLight);

  // directional light
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(-30, 50, -30);
  scene.add(directionalLight);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -70;
  directionalLight.shadow.camera.right = 70;
  directionalLight.shadow.camera.top = 70;
  directionalLight.shadow.camera.bottom = -70;

  objects = [];

  createFloor(scene);
  createBox(scene, objects);

  // resize
  window.addEventListener('resize', onWindowResize);
  //window.addEventListener( 'mousemove', onMouseMove, false );
  window.addEventListener('touchmove', onTouchMove, false);

  plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  raycaster = new THREE.Raycaster();
  intersects = new THREE.Vector3();

  // orbit control
  oControls = new OrbitControls(camera, renderer.domElement);
  oControls.maxDistance = 300;
  oControls.minDistance = 50;
  oControls.maxPolarAngle = Math.PI/2;

  touch = new THREE.Vector2();

  function onTouchMove(e) { 
    e.preventDefault(); 
    touch.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1; 
    touch.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1; 
  }

  // drag control 
  dControls = new DragControls(objects, camera, renderer.domElement); 
  dControls.addEventListener('dragstart', function (event) { 
    oControls.enabled = false; 
  }); 
  dControls.addEventListener('dragend', function (event) { 
    oControls.enabled = true; 
  }); 
  dControls.addEventListener('drag', function (event) { 
    raycaster.setFromCamera(touch, camera); 
    raycaster.ray.intersectPlane(plane, intersects); 
    event.object.position.set(intersects.x, intersects.y + event.object.scale.y / 2, intersects.z); 
  });

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
animate();