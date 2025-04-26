// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

class MaterialPropertySphere extends GrObject {
    constructor() {
        const geometry = new T.SphereGeometry(1, 64, 64);
        const metalnessMap = new T.TextureLoader().load("matpropmat.jpg");
        const material = new T.MeshStandardMaterial({
            color: 0x88aadd,
            roughness: 0.4,
            metalness: 1.0,
            metalnessMap: metalnessMap
        });
        const sphere = new T.Mesh(geometry, material);
        const group = new T.Group();
        group.add(sphere);
        //in addition to existing lighting
        const dirLight = new T.DirectionalLight(0xffffff, 2);
        dirLight.position.set(3, 2, 3);
        dirLight.target = sphere;
        group.add(dirLight);
        super("MaterialPropertySphere", group);
        this.sphere = sphere;
        this.dirLight = dirLight;
    }
    stepWorld(delta, timeOfDay) {
        this.sphere.rotation.y += delta / 2000;
    }
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });
world.add(new MaterialPropertySphere());
world.go();
