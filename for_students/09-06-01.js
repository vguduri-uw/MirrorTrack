/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import * as Simple from "../libs/CS559-Framework/SimpleObjects.js";

/**
 *
 * @param {GrObject} obj
 * @param {number} [speed=1] - rotations per second
 */
function spinY(obj, speed = 1) {
  obj.stepWorld = function(delta, timeOfDay) {
    obj.objects.forEach(obj => obj.rotateY(((speed * delta) / 1000) * Math.PI));
  };
  return obj;
}

function test() {
  let parentOfCanvas = document.getElementById("div1");
  let world = new GrWorld({ where: parentOfCanvas });
  world.renderer.shadowMap.enabled = true;

  /**
   * Some Stuff in the world to cast and receive shadows
   */
  // a high object to cast shadows on lower objects
  let gr = new T.Group();
  let mat = new T.MeshStandardMaterial({ color: "blue" });
  let geom = new T.TorusGeometry();
  let tmesh = new T.Mesh(geom, mat);
  tmesh.rotateX(Math.PI / 2);
  tmesh.scale.set(0.5, 0.5, 0.25);
  tmesh.translateX(-2);
  tmesh.castShadow = true; //me
  gr.add(tmesh);
  gr.translateY(3);
  let highobj = new GrObject("high obj", gr);
  spinY(highobj);
  world.add(highobj);

  // some low objects to be shadowed - although these
  // should cast shadows on the ground plane
  let cube = new Simple.GrCube({ x: -3, y: 1 });
  cube.objects[0].castShadow = true; 
  cube.objects[0].receiveShadow = true; 
  world.add(spinY(cube));//changed these to cast and receive shadows

  let torusKnot = new Simple.GrTorusKnot({ x: 3, y: 1, size: 0.5 });
  torusKnot.objects[0].castShadow = true; 
  torusKnot.objects[0].receiveShadow = true; 
  world.add(spinY(torusKnot));

  //couldn't figure out the receive shadows through the parent
  let groundGeom = new T.PlaneGeometry(10, 10);
  let groundMat = new T.MeshStandardMaterial({ color: "darkgreen" });
  let ground = new T.Mesh(groundGeom, groundMat);
  ground.rotateX(-Math.PI / 2);
  ground.receiveShadow = true; 
  world.scene.add(ground);
  let spotlight = new T.SpotLight("white", 100);
  spotlight.position.set(0, 10, 0);
  spotlight.castShadow = true;
  spotlight.angle = Math.PI / 4;
  world.scene.add(spotlight);
  world.go();
}
test();
