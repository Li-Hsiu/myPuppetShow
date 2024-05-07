import * as THREE from 'three';
import { createBox, createFloor, createBackWall, createGreenFloor, createStandingCamera, createSpotlight } from './objects.js';
import { createLight } from './lights.js';
import { initControl, cameraGlide, changeBackground } from './controls.js';
import { changeTextures } from './texture.js';

var scene, camera, renderer, objects, tempObjects, group, floor, backWall, oControls, dControls, isGliding, isViewing, isChanging, isUp;

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
    window.location.href = window.location.href;
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
  floor = createFloor(scene, stageCenter, stageScale, 4);
  backWall = createBackWall(scene, 4);
  createGreenFloor(scene, stageCenter, playgroundScale, tempObjects);
  createStandingCamera(scene, tempObjects);
  createSpotlight(scene, tempObjects);

  objects = [];
  createBox(scene, objects, "cowFight", emptyTex, 0, -100, 43, 36, 20);
  createBox(scene, objects, "cowLook", emptyTex, 0, -110, 31, 36, 20);
  createBox(scene, objects, "cowEat", emptyTex, 0, -120, 43, 36, 20);
  createBox(scene, objects, "cowDance", emptyTex, 0, -130, 28, 36, 20);
  createBox(scene, objects, "cowSleep", emptyTex, -0, -140, 1, 36, 20);
  
  createBox(scene, objects, "house", emptyTex, 70, -140, 1, 40, 40);
  createBox(scene, objects, "tree", emptyTex, 70, -130, 1, 40, 40);
  createBox(scene, objects, "sign", emptyTex, 70, -120, 1, 20, 30);
  createBox(scene, objects, "plough", emptyTex, 70, -110, 1, 30, 20);
  createBox(scene, objects, "fence", emptyTex, 70, -100, 1, 20, 20);
  createBox(scene, objects, "milk", emptyTex, 70, -90, 1, 15, 15);
  createBox(scene, objects, "shoe", emptyTex, 70, -80, 1, 10, 10);

  createBox(scene, objects, "bullfighter", emptyTex, -70, -140, 1, 20, 25);
  createBox(scene, objects, "cowboy", emptyTex, -70, -130, 1, 20, 25);
  createBox(scene, objects, "farmer", emptyTex, -70, -120, 1, 20, 22);
  createBox(scene, objects, "butcher", emptyTex, -70, -110, 1, 18, 22);
  createBox(scene, objects, "cameraMan", emptyTex, -70, -100, 1, 15, 20);
  createBox(scene, objects, "child", emptyTex, -70, -90, 1, 10, 15);

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
    [isChanging, isUp] = changeBackground(backWall, isChanging, isUp, floor);
    renderer.render(scene, camera); 
  } );
}

init();
animate();