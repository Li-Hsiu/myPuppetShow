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

function createBox(scene, objects, texture, empty, x, z) {
    let scale = { x: 12, y: 12, z: 1 };
    let pos = { x: x, y: scale.y / 2, z: z };

    
    const newMat = new THREE.MeshPhongMaterial({ map: texture, transparent:true, side:THREE.FrontSide});
    const matsArr = [empty, empty, empty, empty, empty, newMat];

    let box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshPhongMaterial({ color: 0xFFFFFF })); //new THREE.MeshPhongMaterial({ color: 0xDC143C })
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.userData.draggable = true
    var direction = new THREE.Vector3(0, 0, 0).sub(box.position).normalize();
    box.rotation.y = Math.atan2(-direction.x, -direction.z);
    scene.add(box);
    objects.push(box);
    return box;
}

export { createBox, createFloor };