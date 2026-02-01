/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";

class SimpleCar extends T.Group {
  constructor(color = 0xFF6B6B) {
    super();
    const scale = 0.28;
    
    const bodyGeom = new T.BoxGeometry(1.8 * scale, 1.2 * scale, 2.5 * scale);
    const bodyMesh = new T.Mesh(bodyGeom, new T.MeshStandardMaterial({ color }));
    bodyMesh.position.y = 1.1 * scale;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.add(bodyMesh);
    
    const cabinGeom = new T.BoxGeometry(1.6 * scale, 0.8 * scale, 1.8 * scale);
    const cabinMesh = new T.Mesh(cabinGeom, new T.MeshStandardMaterial({ color }));
    cabinMesh.position.set(0, 2.0 * scale, -0.3 * scale);
    cabinMesh.castShadow = true;
    cabinMesh.receiveShadow = true;
    this.add(cabinMesh);
    
    // Create wheels
    const wheelR = 0.4 * scale;
    const wheelGeom = new T.CylinderGeometry(wheelR, wheelR, 0.3 * scale, 12);
    const wheelMat = new T.MeshStandardMaterial({ color: 0x333333 });
    
    const frWheel = new T.Mesh(wheelGeom, wheelMat);
    frWheel.position.set(0.8 * scale, wheelR, 0.8 * scale);
    frWheel.rotation.z = Math.PI / 2;
    frWheel.castShadow = true;
    frWheel.receiveShadow = true;
    this.add(frWheel);
    
    const flWheel = new T.Mesh(wheelGeom, wheelMat);
    flWheel.position.set(-0.8 * scale, wheelR, 0.8 * scale);
    flWheel.rotation.z = Math.PI / 2;
    flWheel.castShadow = true;
    flWheel.receiveShadow = true;
    this.add(flWheel);
    
    const brWheel = new T.Mesh(wheelGeom, wheelMat);
    brWheel.position.set(0.8 * scale, wheelR, -0.8 * scale);
    brWheel.rotation.z = Math.PI / 2;
    brWheel.castShadow = true;
    brWheel.receiveShadow = true;
    this.add(brWheel);
    
    const blWheel = new T.Mesh(wheelGeom, wheelMat);
    blWheel.position.set(-0.8 * scale, wheelR, -0.8 * scale);
    blWheel.rotation.z = Math.PI / 2;
    blWheel.castShadow = true;
    blWheel.receiveShadow = true;
    this.add(blWheel);
    
    // Create headlight visuals and spotlights
    const hlGeom = new T.BoxGeometry(0.3 * scale, 0.2 * scale, 0.1 * scale);
    const hlMat = new T.MeshStandardMaterial({ color: 0xFFFFAA, emissive: 0xFFFF88, emissiveIntensity: 0.8 });
    const rhl = new T.Mesh(hlGeom, hlMat);
    rhl.position.set(0.6 * scale, 1.0 * scale, 1.3 * scale);
    this.add(rhl);

    const lhl = new T.Mesh(hlGeom, hlMat);
    lhl.position.set(-0.6 * scale, 1.0 * scale, 1.3 * scale);
    this.add(lhl);

    const rightSpotlight = new T.SpotLight(0xffffdd, 2, 8, Math.PI / 6, 0.5, 1);
    rightSpotlight.position.set(0.6 * scale, 1.0 * scale, 1.3 * scale);
    rightSpotlight.target.position.set(0.6 * scale, 0, 3 * scale);
    rightSpotlight.castShadow = true;
    rightSpotlight.shadow.mapSize.width = 512;
    rightSpotlight.shadow.mapSize.height = 512;
    this.add(rightSpotlight);
    this.add(rightSpotlight.target);

    const leftSpotlight = new T.SpotLight(0xffffdd, 2, 8, Math.PI / 6, 0.5, 1);
    leftSpotlight.position.set(-0.6 * scale, 1.0 * scale, 1.3 * scale);
    leftSpotlight.target.position.set(-0.6 * scale, 0, 3 * scale);
    leftSpotlight.castShadow = true;
    leftSpotlight.shadow.mapSize.width = 512;
    leftSpotlight.shadow.mapSize.height = 512;
    this.add(leftSpotlight);
    this.add(leftSpotlight.target);
  }
}

function test() {
  let div = document.getElementById("div1");
  let world = new GrWorld({ where: div, groundplane: false });
  world.go();
  world.renderer.shadowMap.enabled = true;

  // Load skybox
  const loader = new T.CubeTextureLoader();
  world.scene.background = loader.load([
    "Skybox/right.jpg",
    "Skybox/left.jpg",
    "Skybox/top.jpg",
    "Skybox/bottom.jpg",
    "Skybox/front.jpg",
    "Skybox/back.jpg"
  ]);
  
  // Setup cube cameras for reflections
  const rt1 = new T.WebGLCubeRenderTarget(256, { format: T.RGBAFormat, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cam1 = new T.CubeCamera(0.1, 1000, rt1);
  world.scene.add(cam1);
  const rt2 = new T.WebGLCubeRenderTarget(256, { format: T.RGBAFormat, generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
  const cam2 = new T.CubeCamera(0.1, 1000, rt2);
  world.scene.add(cam2);

  // Create screen for recording camera view
  const screenRT = new T.WebGLRenderTarget(1024, 1024, { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat });
  const screen = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshStandardMaterial({ map: screenRT.texture, side: T.DoubleSide }));
  screen.rotation.y = Math.PI / 2;
  screen.position.set(-5, 5, 0);
  screen.receiveShadow = true;
  world.scene.add(screen);
  
  // Create figure-8 track
  const trackScale = 3;
  const trackWidth = 1.0;
  const trackThickness = 0.15;
  const trackPoints = [];
  const numSegments = 200;

  for (let i = 0; i <= numSegments; i++) {
    const t = (i / numSegments) * 2 * Math.PI;
    const x = trackScale * Math.sin(t);
    const z = trackScale * Math.sin(t) * Math.cos(t);
    trackPoints.push(new T.Vector3(x, 0, z));
  }

  // Build track geometry with thickness
  const vertices = [];
  const indices = [];

  for (let i = 0; i < numSegments; i++) {
    const p1 = trackPoints[i];
    const p2 = trackPoints[i + 1];
    
    const forward = new T.Vector3().subVectors(p2, p1).normalize();
    const right = new T.Vector3(-forward.z, 0, forward.x).multiplyScalar(trackWidth / 2);
    
    const leftPosTop = new T.Vector3().addVectors(p1, right);
    leftPosTop.y += trackThickness / 2;
    const rightPosTop = new T.Vector3().subVectors(p1, right);
    rightPosTop.y += trackThickness / 2;
    const leftPosBottom = new T.Vector3().addVectors(p1, right);
    leftPosBottom.y -= trackThickness / 2;
    const rightPosBottom = new T.Vector3().subVectors(p1, right);
    rightPosBottom.y -= trackThickness / 2;
    
    vertices.push(leftPosTop.x, leftPosTop.y, leftPosTop.z);
    vertices.push(rightPosTop.x, rightPosTop.y, rightPosTop.z);
    vertices.push(leftPosBottom.x, leftPosBottom.y, leftPosBottom.z);
    vertices.push(rightPosBottom.x, rightPosBottom.y, rightPosBottom.z);
    
    // Create triangles for all faces
    if (i < numSegments - 1) {
      const base = i * 4;
      indices.push(base, base + 1, base + 4);
      indices.push(base + 1, base + 5, base + 4);
      indices.push(base + 2, base + 6, base + 3);
      indices.push(base + 3, base + 6, base + 7);
      indices.push(base, base + 4, base + 2);
      indices.push(base + 4, base + 6, base + 2);
      indices.push(base + 1, base + 3, base + 5);
      indices.push(base + 5, base + 3, base + 7);
    }
  }

  // Close the track loop
  const base = (numSegments - 1) * 4;
  indices.push(base, base + 1, 0);
  indices.push(base + 1, 1, 0);
  indices.push(base + 2, 0 + 2, base + 3);
  indices.push(base + 3, 0 + 2, 1 + 2);
  indices.push(base, 0, base + 2);
  indices.push(0, 0 + 2, base + 2);
  indices.push(base + 1, base + 3, 1);
  indices.push(1, base + 3, 1 + 2);

  const trackGeometry = new T.BufferGeometry();
  trackGeometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
  trackGeometry.setIndex(indices);
  trackGeometry.computeVertexNormals();

  const trackMaterial = new T.MeshStandardMaterial({
    color: 0x404040,
    roughness: 0.9,
    metalness: 0.1,
    side: T.DoubleSide
  });

  const track = new T.Mesh(trackGeometry, trackMaterial);
  track.receiveShadow = true;
  track.castShadow = false;
  world.scene.add(track);

  // Add dotted center line
  const numDashes = 50;
  const trackCurve = new T.CatmullRomCurve3(trackPoints, true);

  for (let i = 0; i < numDashes; i++) {
    const u = i / numDashes;
    const position = trackCurve.getPointAt(u);
    const tangent = trackCurve.getTangentAt(u);
    const angle = Math.atan2(tangent.x, tangent.z);
    
    const dashGeometry = new T.PlaneGeometry(0.2, 0.05);
    const dashMaterial = new T.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0x444400
    });
    const dash = new T.Mesh(dashGeometry, dashMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.rotation.z = angle - Math.PI / 2;
    dash.position.set(position.x, trackThickness / 2 + 0.01, position.z);
    world.scene.add(dash);
  }
  
  // Add cars
  const blueCar = new SimpleCar(0x0000ff);
  const redCar = new SimpleCar(0xff0000);
  world.scene.add(blueCar);
  world.scene.add(redCar);

  let cubeTime = 0;
  
  // Add reflective spheres
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
  
  // Add recording camera on moving ball
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
  
  // Animation loop
  world.stepWorld = function(delta) {
    moveTime += delta * 0.001;
    yellowBall.position.set(Math.sin(moveTime) * 8, 10, 0);
    yellowCam.lookAt(yellowBall.position.x, 0, 0);
    
    cubeTime += delta * 0.001;
    
    const blueX = trackScale * Math.sin(cubeTime);
    const blueZ = trackScale * Math.sin(cubeTime) * Math.cos(cubeTime);
    blueCar.position.set(blueX, 0, blueZ);
    
    const blueDX = trackScale * Math.cos(cubeTime);
    const blueDZ = trackScale * (Math.cos(cubeTime) * Math.cos(cubeTime) - Math.sin(cubeTime) * Math.sin(cubeTime));
    const blueAngle = Math.atan2(blueDX, blueDZ);
    blueCar.rotation.y = blueAngle;
    
    const redX = trackScale * Math.sin(cubeTime + Math.PI);
    const redZ = trackScale * Math.sin(cubeTime + Math.PI) * Math.cos(cubeTime + Math.PI);
    redCar.position.set(redX, 0, redZ);
    
    const redDX = trackScale * Math.cos(cubeTime + Math.PI);
    const redDZ = trackScale * (Math.cos(cubeTime + Math.PI) * Math.cos(cubeTime + Math.PI) - Math.sin(cubeTime + Math.PI) * Math.sin(cubeTime + Math.PI));
    const redAngle = Math.atan2(redDX, redDZ);
    redCar.rotation.y = redAngle;

    cam1.position.copy(sphere1.position);
    cam1.update(world.renderer, world.scene);

    cam2.position.copy(sphere2.position);
    cam2.update(world.renderer, world.scene);

    // Render to screen texture
    yellowBall.visible = false;
    const currentRT = world.renderer.getRenderTarget();
    world.renderer.setRenderTarget(screenRT);
    world.renderer.render(world.scene, yellowCam);
    world.renderer.setRenderTarget(currentRT);
    yellowBall.visible = true;
  };
  
  // Setup lighting
  const light = new T.DirectionalLight("white", 1);
  light.position.set(10, 20, 10);
  light.castShadow = true;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.near = 0.5;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  world.scene.add(light);

  world.scene.add(new T.AmbientLight(0x404040));
}

test();