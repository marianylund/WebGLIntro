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
  var cube = new AstronomicalObj().mesh;
  scene.add(cube );

  const aSphere = document.createElement('a-sphere');
  document.querySelector('a-scene').appendChild(aSphere);

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
