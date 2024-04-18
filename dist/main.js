import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, cube, floor, loadedModel;

init();
animate()

function init() {
    scene = new THREE.Scene(); 
    scene.background = new THREE.Color('skyblue');

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100); 
    camera.lookAt(0, 0, 5);
    camera.position.set(0,1.6,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio); 

    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    const targetObject = new THREE.Object3D(); 
    targetObject.position.set(0,0,20);
    scene.add(targetObject);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.target = targetObject;
    scene.add(directionalLight);
    
    const geometryCube = new THREE.BoxGeometry(2, 2, 2); 
    const materialCube = new THREE.MeshStandardMaterial( { color: 0xFFC0CB } ); 
    cube = new THREE.Mesh(geometryCube, materialCube); 
    cube.position.set(5, 5, 20);
    scene.add(cube);

    const geometryFloor = new THREE.BoxGeometry(100, 1, 100); 
    const materialFloor = new THREE.MeshStandardMaterial( { color: 0xD7C8AC } ); 
    floor = new THREE.Mesh(geometryFloor, materialFloor); 
    floor.position.set(0, -1, 0);
    scene.add(floor);
    
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/sci_fi_base/scene.gltf', (gltfScene) => {
        gltfScene.scene.traverse(c => {
            c.castShadow = true;
        });
        gltfScene.scene.rotation.y = Math.PI/2;
        gltfScene.scene.position.set(0,0,20);
        gltfScene.scene.scale.set(1, 1, 1);
        scene.add(gltfScene.scene);
    });

    gltfLoader.load('./assets/mushroom/scene.gltf', (gltfScene) => {
        loadedModel = gltfScene;
        gltfScene.scene.traverse(c => {
            c.castShadow = true;
        });
        gltfScene.scene.rotation.y = Math.PI/2;
        gltfScene.scene.position.set(0,-0.43,10);
        gltfScene.scene.scale.set(0.75, 0.75, 0.75);
        scene.add(gltfScene.scene);
    });
    
    window.addEventListener('resize', onWindowResize);
}

function animate() { 
    //requestAnimationFrame(animate); 
    renderer.setAnimationLoop(render); 
}

function render() {
    cube.rotation.x += 0.01; 
    cube.rotation.y += 0.01;
    if (loadedModel) {
        loadedModel.scene.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}