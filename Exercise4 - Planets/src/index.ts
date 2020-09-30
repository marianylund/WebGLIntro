// https://github.com/mozdevs/aframe-demo
// images have been released by NASA in the public domain: images/earth.png, images/moon.jpg, images/stars.jpg.
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html

import {GUI} from 'dat.gui'; 
import * as THREE from "three";
import * as AFRAME from "aframe";
import { ShadersLoader } from './ShadersLoader';


//let renderer:WebGLRenderer;
let scene: THREE.Scene;
let gui: GUI;
//let scene: Scene;
let zoom = 0.02;

const sunOffset = 100
const clock = new THREE.Clock();
let customUniforms = {
      baseTexture: 	{ type: "t", value: new THREE.Texture() },
      baseSpeed:		{ type: "f", value: 0 },
      repeatS:		{ type: "f", value: 0 },
      repeatT:		{ type: "f", value: 0 },
      noiseTexture:	{ type: "t", value: new THREE.Texture() },
      noiseScale:		{ type: "f", value: 0 },
      blendTexture:	{ type: "t", value: new THREE.Texture() },
      blendSpeed: 	{ type: "f", value: 0 },
      blendOffset: 	{ type: "f", value: 0 },
      bumpTexture:	{ type: "t", value: new THREE.Texture() },
      bumpSpeed: 		{ type: "f", value: 0 },
      bumpScale: 		{ type: "f", value: 0 },
      alpha: 			{ type: "f", value: 1.0 },
      time: 			{ type: "f", value: 1.0 }
}

AFRAME.registerComponent('astro', {
  schema: {
    radius: {
      type: 'number',
      default: 1
    },
    position: {
      type: 'number',
      default: 0
    },
    rotationSun: {
      type: 'number',
      default: 112000
    },
    rotationSelf: {
      type: 'number',
      default: 4000
    },
},

  init: function () {
    this.el.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: ' + (this.data.rotationSun *100000));
    const sphere = document.createElement('a-entity');
    sphere.setAttribute('material', 'src: #texture-' + this.el.id);
    sphere.setAttribute('geometry', 'primitive: sphere');
    sphere.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: ' + (this.data.rotationSelf * 25000));
    sphere.setAttribute('position', sunOffset + this.data.position + " 0 0");
    sphere.setAttribute('scale', this.data.radius + " " + this.data.radius + " " + this.data.radius);
    this.el.appendChild(sphere);
  }
});


AFRAME.registerComponent('sunglow', {
  schema: {
    material: {
      type: 'string',
      default: "../src/images/sun.jpg"
    },
    emissiveMaterial: {
      type: 'string',
      default: "../src/images/sun.jpg"
    },
    radius: {
      type: 'number',
      default: 1
    },
    rotationSelf: {
      type: 'number',
      default: 4000
    },
},

  init: function () {
    const shaders = new ShadersLoader();
    // base image texture for mesh
    const lavaTexture = new THREE.TextureLoader().load(this.data.material);
    console.log(lavaTexture);
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping; 
    // multiplier for distortion speed 		
    const baseSpeed = 0.001;
    // number of times to repeat texture in each direction
    const repeatS = 4.0;
    const repeatT = 4.0;
    
    // texture used to generate "randomness", distort all other textures
    const noiseTexture = new THREE.TextureLoader().load(this.data.material);
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
    // magnitude of noise effect
    const noiseScale = 0.1;
    
    // texture to additively blend with base image texture
    const blendTexture = new THREE.TextureLoader().load(this.data.emissiveMaterial);
    blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
    // multiplier for distortion speed 
    const blendSpeed = 0.001;
    // adjust lightness/darkness of blended texture
    const blendOffset = 0.15;

    // texture to determine normal displacement
    const bumpTexture = noiseTexture;
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
    // multiplier for distortion speed 		
    const bumpSpeed   = 0.001;
    // magnitude of normal displacement
    const bumpScale   = 10.0;
    
    // use "this." to create global object
    customUniforms = {
      baseTexture: 	{ type: "t", value: lavaTexture },
      baseSpeed:		{ type: "f", value: baseSpeed },
      repeatS:		{ type: "f", value: repeatS },
      repeatT:		{ type: "f", value: repeatT },
      noiseTexture:	{ type: "t", value: noiseTexture },
      noiseScale:		{ type: "f", value: noiseScale },
      blendTexture:	{ type: "t", value: blendTexture },
      blendSpeed: 	{ type: "f", value: blendSpeed },
      blendOffset: 	{ type: "f", value: blendOffset },
      bumpTexture:	{ type: "t", value: bumpTexture },
      bumpSpeed: 		{ type: "f", value: bumpSpeed },
      bumpScale: 		{ type: "f", value: bumpScale },
      alpha: 			{ type: "f", value: 1.0 },
      time: 			{ type: "f", value: 1.0 }
    };
    
    // create custom material from the shader code above
    //   that is within specially labeled script tags
    var customMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: customUniforms,
        vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });

    var ballGeometry = new AFRAME.THREE.SphereGeometry(this.data.radius, 64, 64);
    var ball = new AFRAME.THREE.Mesh(ballGeometry, customMaterial);
    this.el.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: ' + (this.data.rotationSelf * 25000));
    this.el.setObject3D('mesh', ball);




  },

  tick: function () {
    var delta = clock.getDelta();
	  customUniforms.time.value += delta;
  }
});

function main() {
  //AFRAME.registerComponent('foo', main);

  scene = document.querySelector('a-scene').object3D;
  console.log("IS SCENE: ", scene.isScene);
  

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
