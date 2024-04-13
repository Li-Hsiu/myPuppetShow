import * as THREE from 'three';
import { createBox, createFloor } from './objects.js';
import { createLight } from './lights.js';
import { initControl } from './controls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

var scene, camera, renderer, objects;

function init() {
  const stageCenter = new THREE.Vector3(0,0,-70);
  const stageScale = new THREE.Vector3(100,2,70);

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(-70,70,70);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a);

  createLight(scene);

  objects = [];

  var floor = createFloor(scene, stageCenter, stageScale);
  var box = createBox(scene, objects);

  initControl(objects, camera, renderer, stageCenter, stageScale, scene);

  window.addEventListener('resize', onWindowResize);

  document.body.appendChild( VRButton.createButton( renderer ) );
  renderer.xr.enabled = true;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var vrInit = false;
function animate() {
  
  renderer.setAnimationLoop( function () { 
    if (renderer.xr.isPresenting && vrInit == false) {
      vrInit = true;
    }
    renderer.render( scene, camera ); 
  } );
}

init();
animate();