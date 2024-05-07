import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

function initControl(objects, camera, renderer, center, scale, stageScale) {
    const detectDeviceType = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile':'Desktop';
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const intersects = new THREE.Vector3();
    
    var oControls = new OrbitControls(camera, renderer.domElement);
    oControls.maxDistance = 300;
    oControls.minDistance = 50;
    oControls.maxPolarAngle = Math.PI/2;
    oControls.target = new THREE.Vector3(center.x,center.y+15,center.z);
    oControls.update();

    var dControls;

    console.log(detectDeviceType());
    if (detectDeviceType() == 'Mobile') {
        const touch = new THREE.Vector2(); 
        window.addEventListener('touchmove', onTouchMove, false);

        function onTouchMove(event) { 
            event.preventDefault(); 
            touch.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1; 
            touch.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1; 
        }
 
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
            if (intersects.x > center.x+scale.x/2-event.object.scale.x/2) event.object.position.set(center.x+scale.x/2-event.object.scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            else if (intersects.x < center.x-scale.x/2+event.object.scale.x/2) event.object.position.set(center.x-scale.x/2+event.object.scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            if (intersects.z > center.z+scale.z/2-event.object.scale.x/4-2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z+scale.z/2-event.object.scale.x/4-2);
            else if (intersects.z < center.z-scale.z/2+event.object.scale.x/4+2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z-scale.z/2+event.object.scale.x/4+2);
            if (intersects.x < center.x+stageScale.x/2 && intersects.x > center.x-stageScale.x/2 && intersects.z < center.z+stageScale.z/2 && intersects.z > center.z-stageScale.z/2) event.object.userData.onStage = true;
            else event.object.userData.onStage = false;
            var direction = new THREE.Vector3(0, 0, 0).sub(event.object.position).normalize();
            event.object.rotation.y = Math.atan2(-direction.x, -direction.z);
        });
    }
    else {
        const mouse = new THREE.Vector2(); 
        window.addEventListener( 'mousemove', onMouseMove, false );

        function onMouseMove(event) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }

        dControls = new DragControls(objects, camera, renderer.domElement); 
        dControls.addEventListener('dragstart', function (event) { 
            oControls.enabled = false; 
        }); 
        dControls.addEventListener('dragend', function (event) { 
            oControls.enabled = true; 
        }); 
        dControls.addEventListener('drag', function (event) { 
            raycaster.setFromCamera(mouse, camera); 
            raycaster.ray.intersectPlane(plane, intersects); 
            event.object.position.set(intersects.x, intersects.y + event.object.scale.y / 2, intersects.z); 
            if (intersects.x > center.x+scale.x/2-event.object.scale.x/2) event.object.position.set(center.x+scale.x/2-event.object.scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            else if (intersects.x < center.x-scale.x/2+event.object.scale.x/2) event.object.position.set(center.x-scale.x/2+event.object.scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            if (intersects.z > center.z+scale.z/2-event.object.scale.x/4-2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z+scale.z/2-event.object.scale.x/4-2);
            else if (intersects.z < center.z-scale.z/2+event.object.scale.x/4+2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z-scale.z/2+event.object.scale.x/4+2);
            if (intersects.x < center.x+stageScale.x/2 && intersects.x > center.x-stageScale.x/2 && intersects.z < center.z+stageScale.z/2 && intersects.z > center.z-stageScale.z/2) event.object.userData.onStage = true;
            else event.object.userData.onStage = false;
            var direction = new THREE.Vector3(0, 0, 0).sub(event.object.position).normalize();
            event.object.rotation.y = Math.atan2(-direction.x, -direction.z);
        });
    }
    return [oControls,dControls];
}

function cameraGlide(camera, center, oControls, dControls, isGliding, isViewing, renderer) {
    if (!isGliding) return [false, isViewing];
    oControls.enabled = false;
    dControls.enabled = false;
    const startPosition = camera.position;
    const targetPosition = new THREE.Vector3(0,40,50);
    const displacementVector = new THREE.Vector3().subVectors(targetPosition, startPosition);
    if (displacementVector.length() <= 1) {
        camera.position.copy(new THREE.Vector3(0,40,50));
        camera.lookAt(new THREE.Vector3(center.x,20,center.z));
        document.body.appendChild(VRButton.createButton(renderer));
        renderer.xr.enabled = true;
        return [false, true];
    }
    else {
        displacementVector.normalize();
        camera.position.add(displacementVector);
    }
    camera.lookAt(new THREE.Vector3(center.x,20,center.z));
    return [true, false];
}

function changeBackground(backWall, isChanging, isUp, floor) {
    if (!isChanging) return [false, isUp];
    if (isUp) {
        backWall.position.y += 1;
        if (backWall.position.y >= 200) {
            var idx = backWall.userData.idx + 1;
            backWall.userData.idx += 1;
            if (idx >= backWall.userData.num) {
                idx = 0;
                backWall.userData.idx = 0;
            }
            backWall.material.map = backWall.userData.textures[idx];
            return [true, false];
        }
        return [true, true];
    }
    else {
        backWall.position.y -= 1;
        if (backWall.position.y <= 26) {
            backWall.position.y = 26;
            var idx = floor.userData.idx + 1;
            floor.userData.idx += 1;
            if (idx >= floor.userData.num) {
                idx = 0;
                floor.userData.idx = 0;
            }
            floor.material.map = floor.userData.textures[idx];
            return [false, true];
        }
        return [true, false];
    }
}

export {initControl, cameraGlide, changeBackground}