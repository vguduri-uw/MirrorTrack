// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
let tabTexture = new T.TextureLoader().load("./tablet.jpeg");
tabTexture.flipY = false;

const tabWidth = 7.5 / 12;
const tabLength = 9.7 / 12;
const tabHeight = 0.3 / 12;
const overhang = 0.03;

export class Tablet extends GrObject {
    constructor(plain) {
        const positions = new Float32Array([
            0, 0, 0, 
            tabWidth, 0, 0,
            tabWidth, 0, tabLength,
            0, 0, tabLength,
            0, tabHeight, 0,
            tabWidth, tabHeight, 0,
            tabWidth, tabHeight, tabLength,
            0, tabHeight, tabLength,
            0, 0, 0,
            0, 0, tabLength,
            0, tabHeight, tabLength,
            0, tabHeight, 0,
            0, 0, overhang,
            tabWidth-overhang, 0, overhang,
            tabWidth-overhang, tabHeight, overhang,
            0, tabHeight, overhang,
            tabWidth-overhang, 0, overhang,
            tabWidth-overhang, 0, tabLength-overhang,
            tabWidth-overhang, tabHeight, tabLength-overhang,
            tabWidth-overhang, tabHeight, overhang,
            0, 0, tabLength-overhang,
            tabWidth-overhang, 0, tabLength-overhang,
            tabWidth-overhang, tabHeight, tabLength-overhang,
            0, tabHeight, tabLength-overhang,
        ]);
        
        const normals = new Float32Array([
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ]);
        
        const uvs = new Float32Array([
            0, 0,
            0.5, 0,
            0.5, 1,
            0, 1,
            0.5, 0,
            1, 0,
            1, 1,
            0.5, 1,
            0, 0,
            0, 1,
            0.5, 1,
            0.5, 0,
            0.5, 0,
            0.5, 1,
            1, 1,
            1, 0,
            0.5, 0,
            0.5, 1,
            1, 1,
            1, 0,
            0, 0,
            0, 1,
            0.5, 1,
            0.5, 0
        ]);

        let geometry = new T.BufferGeometry();
        geometry.setAttribute("position", new T.BufferAttribute(positions, 3));
        geometry.setAttribute("normal", new T.BufferAttribute(normals, 3));
        geometry.setAttribute("uv", new T.BufferAttribute(uvs, 2));
        geometry.setIndex([
            0, 1, 2,
            0, 2, 3,
            6, 5, 4,
            7, 6, 4,
            8, 10, 9,
            8, 11, 10,
            12, 13, 14,
            12, 14, 15,
            16, 17, 18,
            16, 18, 19,
            20, 22, 21,
            20, 23, 22 
        ]);

        let mat;
        if (plain) {
            mat = new T.MeshStandardMaterial({color: "gray"});
        } else {
            mat = new T.MeshStandardMaterial({
                color: "gray", 
                map: tabTexture, 
                side: T.DoubleSide
            });
        }

        let mesh = new T.Mesh(geometry, mat);
        super("tab"+(plain?"-plain":"-textured"), mesh);
        this.tgeom = geometry;
        this.mat = mat;
    }
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });
let tab = new Tablet(false);
tab.objects[0].translateY(0.01);
tab.objects[0].scale.set(3, 3, 3);
world.add(tab);
world.go();
