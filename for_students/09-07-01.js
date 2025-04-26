/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

function test() {
  let div = document.getElementById("div1");
  let world = new GrWorld({ where: div });
  world.go();

  world.renderer.shadowMap.enabled = true;

  const loader = new T.CubeTextureLoader();
  world.scene.background = loader.load([
    "Skybox/right.jpg",
    "Skybox/left.jpg",
    "Skybox/top.jpg",
    "Skybox/bottom.jpg",
    "Skybox/front.jpg",
    "Skybox/back.jpg"
  ]);
  //for the reflections
  const rt1 = new T.WebGLCubeRenderTarget(256, { format: T.RGBAFormat, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cam1 = new T.CubeCamera(0.1, 1000, rt1);
  world.scene.add(cam1);
  const rt2 = new T.WebGLCubeRenderTarget(256, { format: T.RGBAFormat, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cam2 = new T.CubeCamera(0.1, 1000, rt2);
  world.scene.add(cam2);

  const ground = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshStandardMaterial({ color: "darkgreen" }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.scene.add(ground);
 //screen
  const screenRT = new T.WebGLRenderTarget(1024, 1024, { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat });
  const screen = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshStandardMaterial({ map: screenRT.texture, side: T.DoubleSide }));
  screen.rotation.y = Math.PI / 2;
  screen.position.set(-5, 5, 0);
  screen.receiveShadow = true;
  world.scene.add(screen);
  //cubes
  const cubeGeo = new T.BoxGeometry(0.5, 0.5, 0.5);
  const blueCube = new T.Mesh(cubeGeo, new T.MeshStandardMaterial({ color: "blue" }));
  blueCube.castShadow = true;
  blueCube.receiveShadow = true;
  const redCube = new T.Mesh(cubeGeo, new T.MeshStandardMaterial({ color: "red" }));
  redCube.castShadow = true;
  redCube.receiveShadow = true;
  world.scene.add(blueCube);
  world.scene.add(redCube);

  let cubeTime = 0;
  //spheres
  const sphereGeo = new T.SphereGeometry(1, 32, 32);
  const sphere1 = new T.Mesh(sphereGeo, new T.MeshStandardMaterial({ color: "white", metalness: 1, roughness: 0, envMap: rt1.texture }));
  sphere1.position.set(-1.5, 1, 0);
  sphere1.castShadow = true;
  sphere1.receiveShadow = true;
  world.scene.add(sphere1);

  const sphere2 = new T.Mesh(sphereGeo, new T.MeshStandardMaterial({ color: "white", metalness: 1, roughness: 0, envMap: rt2.texture }));
  sphere2.position.set(1.5, 1, 0);
  sphere2.castShadow = true;
  sphere2.receiveShadow = true;
  world.scene.add(sphere2);
  //recording
  const yellowBall = new T.Mesh(new T.SphereGeometry(0.5, 32, 32), new T.MeshStandardMaterial({ color: "yellow" }));
  yellowBall.castShadow = true;
  yellowBall.receiveShadow = true;
  yellowBall.position.set(0, 10, 0);
  world.scene.add(yellowBall);

  const yellowCam = new T.PerspectiveCamera(75, 1, 0.1, 1000);
  yellowBall.add(yellowCam);
  yellowCam.position.set(0, 0, 0);
  yellowCam.lookAt(0, -10, 0);
  yellowCam.rotation.z = Math.PI;

  let moveTime = 0;
  world.stepWorld = function(delta) {
    moveTime += delta * 0.001;
    yellowBall.position.set(Math.sin(moveTime) * 8, 10, 0);
    yellowCam.lookAt(yellowBall.position.x, 0, 0);
    //moving cubes
    cubeTime += delta * 0.001;
    blueCube.position.set(Math.sin(cubeTime) * 3, 0.5, Math.sin(cubeTime) * Math.cos(cubeTime) * 3);
    redCube.position.set(-Math.sin(cubeTime) * 3, 0.5, -Math.sin(cubeTime) * Math.cos(cubeTime) * 3);

    cam1.position.copy(sphere1.position);
    cam1.update(world.renderer, world.scene);

    cam2.position.copy(sphere2.position);
    cam2.update(world.renderer, world.scene);

    yellowBall.visible = false;
    const currentRT = world.renderer.getRenderTarget();
    world.renderer.setRenderTarget(screenRT);
    world.renderer.render(world.scene, yellowCam);
    world.renderer.setRenderTarget(currentRT);
    yellowBall.visible = true;
  };
  //light for shadow
  const light = new T.DirectionalLight("white", 1);
  light.position.set(10, 20, 10);
  light.castShadow = true;
  light.shadow.camera.far = 50;
  world.scene.add(light);

  world.scene.add(new T.AmbientLight(0x404040));
}

test();
