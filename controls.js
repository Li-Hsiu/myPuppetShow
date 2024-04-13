import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

function initControl(objects, camera, renderer, center, scale, scene) {
    const detectDeviceType = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile':'Desktop';
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const intersects = new THREE.Vector3();
    
    const oControls = new OrbitControls(camera, renderer.domElement);
    oControls.maxDistance = 300;
    oControls.minDistance = 50;
    oControls.maxPolarAngle = Math.PI/2;
    oControls.target = center;
    oControls.update();

    console.log(detectDeviceType());
    if (detectDeviceType() == 'Mobile') {
        var seat = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        seat.position.set(0,0,0);
        scene.add(seat);

        const touch = new THREE.Vector2(); 
        window.addEventListener('touchmove', onTouchMove, false);

        function onTouchMove(event) { 
            e.preventDefault(); 
            touch.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1; 
            touch.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1; 
        }
 
        const dControls = new DragControls(objects, camera, renderer.domElement); 
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
            if (intersects.x > center.x+scale.x/2) event.object.position.set(center.x+scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            else if (intersects.x < center.x-scale.x/2) event.object.position.set(center.x-scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            if (intersects.z > center.z+scale.z/2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z+scale.z/2);
            else if (intersects.z < center.z-scale.z/2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z-scale.z/2);
            var direction = new THREE.Vector3(0, 0, 0).sub(event.object.position).normalize();
            event.object.rotation.y = Math.atan2(-direction.x, -direction.z);
        });
    }
    else {
        var seat = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: 0x0000FF }));
        seat.position.set(0,0,0);
        scene.add(seat);

        const mouse = new THREE.Vector2(); 
        window.addEventListener( 'mousemove', onMouseMove, false );

        function onMouseMove(event) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }

        const dControls = new DragControls(objects, camera, renderer.domElement); 
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
            if (intersects.x > center.x+scale.x/2) event.object.position.set(center.x+scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            else if (intersects.x < center.x-scale.x/2) event.object.position.set(center.x-scale.x/2, intersects.y + event.object.scale.y / 2, event.object.position.z);
            if (intersects.z > center.z+scale.z/2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z+scale.z/2);
            else if (intersects.z < center.z-scale.z/2) event.object.position.set(event.object.position.x, intersects.y + event.object.scale.y / 2, center.z-scale.z/2);
            var direction = new THREE.Vector3(0, 0, 0).sub(event.object.position).normalize();
            event.object.rotation.y = Math.atan2(-direction.x, -direction.z);
        });
    }
    

    
}

export {initControl}