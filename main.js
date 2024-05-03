import * as THREE from 'three';
import { createBox, createFloor, createBackWall, createGreenFloor, createStandingCamera, createSpotlight } from './objects.js';
import { createLight } from './lights.js';
import { initControl, cameraGlide, changeBackground } from './controls.js';
import { changeTextures } from './texture.js';

var scene, camera, renderer, objects, tempObjects, group, standingCamera, backWall, oControls, dControls, isGliding, isViewing, isChanging, isUp;

function init() {
  const stageCenter = new THREE.Vector3(0,0,-70);
  const stageScale = new THREE.Vector3(100,2,50);
  const playgroundScale = new THREE.Vector3(200,2,150);
  isGliding = false;
  isChanging = false;
  isUp = true;

  const buttonBackground = document.getElementById('button1');
  buttonBackground.addEventListener('click', () => {
    isChanging = true;
  });
  const buttonView = document.getElementById('button2');
  buttonView.addEventListener('click', () => {
    isGliding = true;
    
  });
  const buttonReset = document.getElementById('button3');
  buttonReset.addEventListener('click', () => {
    location.reload();
  });

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
  camera.position.set(-70,70,70);

  group = new THREE.Group();
  group.position.set(0,0,0);
  group.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a);
  scene.add(group);

  createLight(scene);

  const emptyTex = new THREE.TextureLoader().load("assets/empty.png");

  tempObjects = [];
  createFloor(scene, stageCenter, stageScale);
  createGreenFloor(scene, stageCenter, playgroundScale, tempObjects);
  backWall = createBackWall(scene, 2);
  createStandingCamera(scene, tempObjects);
  createSpotlight(scene, tempObjects);

  objects = [];
  createBox(scene, objects, "motion", emptyTex, -15, -50, 10);
  createBox(scene, objects, "motion", emptyTex, 10, -60, 10);
  createBox(scene, objects, "motion", emptyTex, 20, -80, 10);
  createBox(scene, objects, "motion", emptyTex, -30, -70, 10);
  
  [oControls, dControls] = initControl(objects, camera, renderer, stageCenter, playgroundScale, stageScale);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var vrInit = false;
var viewInit = false;
function animate() {
  renderer.setAnimationLoop( function () { 
    if (renderer.xr.isPresenting && vrInit == false) {
      vrInit = true;
      group.position.set(0,20,-10);
    }
    if (isViewing == true && viewInit == false) {
      viewInit = true;
      tempObjects.forEach(object => {object.visible = false});
      changeTextures(objects,125);
    }
    [isGliding,isViewing] = cameraGlide(camera, new THREE.Vector3(0,0,-70), oControls, dControls, isGliding, isViewing, renderer);
    [isChanging, isUp] = changeBackground(backWall, isChanging, isUp);
    renderer.render(scene, camera); 
  } );
}

init();
animate();