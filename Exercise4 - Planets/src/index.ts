// https://github.com/mozdevs/aframe-demo
// images have been released by NASA in the public domain: images/earth.png, images/moon.jpg, images/stars.jpg.

import {GUI} from 'dat.gui'; 
import * as THREE from "three";
import * as AFRAME from "aframe";
import { AstronomicalObj } from './AstronomicalObj';


//let renderer:WebGLRenderer;
let scene: THREE.Scene;
let gui: GUI;
//let scene: Scene;
let zoom = 0.02;

function main() {
  AFRAME.registerComponent('foo', main);

  scene = document.querySelector('a-scene').object3D;
  console.log(scene.isScene);


//   var materials = [new THREE.MeshBasicMaterial({
//     color: 0xFF0000
// }), new THREE.MeshBasicMaterial({
//     color: 0x00FF00
// })]

//this.el.getObject3D('mesh').material = materials;
//console.log(sceneEl.querySelectorAll('a-box'));



  // const aSphereJupyter = document.createElement('a-sphere');
  // aSphereJupyter.setAttribute('src', 'src/images/jupyter.jpg');
  // aSphereJupyter.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: 80000');
  // const elJupyter = document.createElement('a-entity');
  // elJupyter.id = "jupyter";
  // elJupyter.setAttribute('position', '0 0 -10');
  // elJupyter.appendChild(aSphereJupyter);
  // elJupyter.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: 100000');
  // document.querySelector('a-scene').appendChild(elJupyter);
  // document.querySelector('a-scene').appendChild(aSphere);


  // var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  // renderer = new WebGLRenderer();
  // renderer.setSize( window.innerWidth, window.innerHeight );
  // document.querySelector('body').appendChild(renderer.domElement);
  
  // // Only continue if WebGL is available and working
  // if (renderer === null) {
  //   alert("Unable to initialize WebGL. Your browser or machine may not support it.");
  //   return;
  // }

  // var geometry = new BoxGeometry();
  // var material = new MeshBasicMaterial( { color: 0x00ff00 } );
  // var cube = new AstronomicalObj().mesh;
  // scene.add(cube );

  // const aSphere = document.createElement('a-sphere');
  // document.querySelector('a-scene').appendChild(aSphere);

  // camera.position.z = 5;

  // function animate() {
  //   requestAnimationFrame( animate );
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   renderer.render( scene, camera );
  // }
  // animate();

  };


  
window.onload = main;
