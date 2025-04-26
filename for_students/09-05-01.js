// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";


const loader = new T.CubeTextureLoader();
const texture = loader.load([
    "Skybox/right.jpg",
    "Skybox/left.jpg",
    "Skybox/top.jpg",
    "Skybox/bottom.jpg",
    "Skybox/front.jpg",
    "Skybox/back.jpg"
]);
//reflective mat for cube
const reflectiveMaterial = new T.MeshStandardMaterial({
    envMap: texture,
    metalness: 1.0,
    roughness: 0,
});

//bump sphere
const bumpMap = new T.TextureLoader().load("bumpmap.png");
const advancedMaterial = new T.MeshStandardMaterial({
    envMap: texture,
    metalness: 1.0,
    roughness: 0,
    bumpMap: bumpMap,
    bumpScale: 5,
});

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane: false });
world.scene.background = texture;
const cubeGeometry = new T.BoxGeometry(4, 4, 4);
const reflectiveCube = new T.Mesh(cubeGeometry, reflectiveMaterial);
reflectiveCube.position.set(4, 2, 0);
world.scene.add(reflectiveCube);

const sphereGeometry = new T.SphereGeometry(2, 32, 32);
const reflectiveSphere = new T.Mesh(sphereGeometry, advancedMaterial);
reflectiveSphere.position.set(-4, 2, 0);
world.scene.add(reflectiveSphere);

world.go();
