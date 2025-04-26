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

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane: false });
world.scene.background = texture;
const cubeGeometry = new T.BoxGeometry(3, 3, 3);
const cubeMaterial = new T.MeshStandardMaterial({ color: "red" });
const cube = new T.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
world.scene.add(cube);
world.go();
