import * as THREE from 'three'
import { loadObjectTexture } from './texture.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

function createFloor(scene, center, size, num) {
    let pos = center;
    pos.y -= 1;
    let scale = size;

    var textures = loadObjectTexture("floor", num);
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({map:textures[0]}));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.userData.ground = true;
    blockPlane.userData.textures = textures;
    blockPlane.userData.num = num;
    blockPlane.userData.idx = 0;
    scene.add(blockPlane);

    return blockPlane;
}

function createGreenFloor(scene, center, size, tempObjects) {
    let pos = center;
    pos.y -= 0.1;
    let scale = size;

    var texture = new THREE.TextureLoader().load("./assets/stageFloor.jpg");
    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({map:texture}));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.userData.ground = true;
    tempObjects.push(blockPlane);
    scene.add(blockPlane);
    return blockPlane;
}

function createBackWall(scene, num) {
    let pos = new THREE.Vector3(0,26,-95);
    let scale = new THREE.Vector3(100,54,1);

    var textures = loadObjectTexture("background", num);
    let backWall = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({map:textures[0]}));
    backWall.position.set(pos.x, pos.y, pos.z);
    backWall.scale.set(scale.x, scale.y, scale.z);
    backWall.userData.textures = textures;
    backWall.userData.num = num;
    backWall.userData.idx = 0;
    scene.add(backWall);
    return backWall;
}

function createStandingCamera(scene, objList) {
    const loader = new FBXLoader();
    loader.load('./assets/camera.fbx', (fbx) => {
        fbx.scale.copy(new THREE.Vector3(0.02,0.02,0.02));
        fbx.position.copy(new THREE.Vector3(0,15,-15));
        fbx.rotation.y += Math.PI / 2;
        objList.push(fbx);
        scene.add(fbx);
    }, undefined, (error) => {
        console.error(error);
    });
}

function createSpotlight(scene, objList) {
    const loader = new FBXLoader();
    loader.load('./assets/spotlight.fbx', (fbx) => {
        fbx.scale.copy(new THREE.Vector3(0.15,0.15,0.15));
        fbx.position.copy(new THREE.Vector3(65,0,-35));
        fbx.rotation.y -= 3*Math.PI / 4;
        objList.push(fbx);
        scene.add(fbx);
    }, undefined, (error) => {
        console.error(error);
    });
}

function createBox(scene, objects, name, empty, x, z, frames, sizeX, sizeY) {
    let scale = { x: sizeX, y: sizeY, z: 1 };
    let pos = { x: x, y: scale.y / 2, z: z };

    const loader = new THREE.TextureLoader();
    
    const coverTexture = loader.load("./assets/"+ name + "/" + name + ".png");

    var textures = loadObjectTexture(name, frames);
    
    const newMat = new THREE.MeshPhongMaterial({map: coverTexture, transparent:true, side:THREE.FrontSide});
    const coverMatsArr = [new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),newMat]

    const matsArr = [empty, empty, empty, empty, empty, newMat];

    let box = new THREE.Mesh(new THREE.BoxGeometry(), coverMatsArr); //new THREE.MeshPhongMaterial({ color: 0xDC143C })
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.userData.draggable = true
    var direction = new THREE.Vector3(0, 0, 0).sub(box.position).normalize();
    box.rotation.y = Math.atan2(-direction.x, -direction.z);

    box.userData.frames = frames;
    box.userData.textureList = textures;
    box.userData.coverMatsArr = coverMatsArr;
    box.userData.matsArr = matsArr;
    box.userData.index = -1;
    box.userData.onStage = false;
    box.userData.init = false;

    scene.add(box);
    objects.push(box);
    return box;
}

export { createBox, createFloor, createBackWall, createGreenFloor, createStandingCamera, createSpotlight };