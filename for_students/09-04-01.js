// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

class SkyBox extends GrObject {
    constructor() {
        const size = 1000;
        const geometry = new T.BoxGeometry(size, size, size);
        const textureLoader = new T.TextureLoader();
        const materials = [
            //sides of cube
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/right.jpg"),
            side: T.BackSide
            }),
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/left.jpg"),
            side: T.BackSide 
            }),
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/top.jpg"),
            side: T.BackSide 
            }),
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/bottom.jpg"),
            side: T.BackSide 
            }),
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/front.jpg"),
            side: T.BackSide 
            }),
            new T.MeshBasicMaterial({ 
            map: textureLoader.load("Skybox/back.jpg"),
            side: T.BackSide 
            })
        ];
        const skybox = new T.Mesh(geometry, materials);
        super("SkyBox", skybox);
    }
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane: false});
world.add(new SkyBox());
const cubeGeom = new T.BoxGeometry(3,3,3);
const cubeMat = new T.MeshStandardMaterial({color: "blue"});
const cube = new T.Mesh(cubeGeom, cubeMat);
cube.position.set(0, 0, 0);
world.scene.add(cube);

world.go();
