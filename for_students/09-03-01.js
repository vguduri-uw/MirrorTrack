// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

class NormalMapSphere extends GrObject {
    constructor() {
        const geometry = new T.SphereGeometry(1, 64, 64);
        const material = new T.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.0,
            normalMap: new T.TextureLoader().load("normalmap.jpg"),
            normalScale: new T.Vector2(1.0, 1.0)
        });

        const sphere = new T.Mesh(geometry, material);
        const group = new T.Group();
        group.add(sphere);

        super("GolfBallSphere", group);
        this.sphere = sphere;

        group.position.x = -2;
        group.position.y = 1;
    }

    stepWorld(delta, timeOfDay) {
        this.sphere.rotation.y += delta / 1000;
    }
}

class BumpMapSphere extends GrObject {
    constructor() {
        const geometry = new T.SphereGeometry(1, 64, 64);
        const material = new T.MeshStandardMaterial({
            color: "white",
            roughness: 0.4,
            metalness: 0.1,
            bumpMap: new T.TextureLoader().load("bumpmap.png"),
            bumpScale: 10
        });

        const sphere = new T.Mesh(geometry, material);
        const group = new T.Group();
        group.add(sphere);

        super("BumpMapSphere", group);
        this.sphere = sphere;

        group.position.x = 2;
        group.position.y = 1;
    }

    stepWorld(delta, timeOfDay) {
        this.sphere.rotation.y += delta / 1000;
    }
}

class CombinedMapSphere extends GrObject {
    constructor() {
        const geometry = new T.SphereGeometry(1, 64, 64);
        const material = new T.MeshStandardMaterial({
            color: "white",
            roughness: 0.3,
            metalness: 0.0,
            map: new T.TextureLoader().load("holes.png"), 
            normalMap: new T.TextureLoader().load("normalmap.jpg"), 
            normalScale: new T.Vector2(1.0, 1.0)
        });

        const sphere = new T.Mesh(geometry, material);
        const group = new T.Group();
        group.add(sphere);

        super("CombinedMapSphere", group);
        this.sphere = sphere;

        group.position.x = 0;
        group.position.y = 1;
    }

    stepWorld(delta, timeOfDay) {
        this.sphere.rotation.y += delta / 1000;
    }
}



let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });
world.add(new NormalMapSphere());
world.add(new BumpMapSphere());
world.add(new CombinedMapSphere());
world.go();
