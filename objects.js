import * as THREE from 'three'

function createFloor(scene, center, size) {
    let pos = center;
    pos.y -= 1;
    let scale = size;

    const texture = new THREE.TextureLoader().load('./assets/stageFloor.jpg');

    let blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ map:texture }));
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    blockPlane.userData.ground = true;
    scene.add(blockPlane);
    return blockPlane;
}

function createBox(scene, objects) {
    let scale = { x: 6, y: 6, z: 1 };
    let pos = { x: 15, y: scale.y / 2, z: -70 };

    let box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0xDC143C }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    box.userData.draggable = true
    scene.add(box);
    objects.push(box);
    return box;
}

export { createBox, createFloor };