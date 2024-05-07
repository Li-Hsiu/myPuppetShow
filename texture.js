import * as THREE from 'three';

function loadObjectTexture(name, frames) {
    var texturesUrl = [];
    for (var i=1; i<=frames; i++) {
        texturesUrl.push("./assets/"+ name + "/" + name + " (" + i + ").png");
    }
    var textures = [];
    const loader = new THREE.TextureLoader();
    texturesUrl.forEach(url => {
        const texture = loader.load(url);
        textures.push(texture);
    });
    return textures;
}

function changeTextures(objects, intervalTime) {
    function updateTexture() {
        objects.forEach(object => {
            if (object.userData.onStage) {
                if (object.userData.frames == 1 && object.userData.init == false) {
                    object.userData.init = true;
                    var newMat = new THREE.MeshPhongMaterial({map: object.userData.textureList[0], transparent:true, side:THREE.FrontSide});
                    object.userData.matsArr[5] = newMat;
                    object.material = object.userData.matsArr;
                    object.material.needsUpdate = true;
                }
                else {
                    var idx = object.userData.index + 1;
                    object.userData.index += 1;
                    if (idx >= object.userData.frames) {
                        idx = 0;
                        object.userData.index = 0;
                    }
                    var newMat = new THREE.MeshPhongMaterial({map: object.userData.textureList[idx], transparent:true, side:THREE.FrontSide});
                    object.userData.matsArr[5] = newMat;
                    object.material = object.userData.matsArr;
                    object.material.needsUpdate = true;
                }
            }
            else{
                object.visible = false;
            }
        });
    }
    setInterval(updateTexture, intervalTime);
}

export{loadObjectTexture, changeTextures};