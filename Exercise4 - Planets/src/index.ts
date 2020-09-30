// https://github.com/mozdevs/aframe-demo
// images have been released by NASA in the public domain: images/earth.png, images/moon.jpg, images/stars.jpg.
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/planet_table_ratio.html

import {GUI} from 'dat.gui'; 
import * as THREE from "three";
import * as AFRAME from "aframe";
import { ShadersLoader } from './ShadersLoader';

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
    if(this.data.radius == 0){
      return;
    }
    this.el.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; easing:linear; dur: ' + (this.data.rotationSun *100000));
    const sphere = document.createElement('a-entity');
    sphere.setAttribute('material', 'src: #texture-' + this.el.id);
    sphere.setAttribute('geometry', 'primitive: sphere');
    sphere.setAttribute('id', this.el.id + '-sphere');
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

const PlanetsSettings = {Mercury: false, Venus: false, Earth: false, Mars: false, Jupiter: false, Saturn: false, Uranus: false, Neptune: false};
let planet_id = "";

AFRAME.registerComponent('uimenu', {
  schema: {
    radius: {
      type: 'number',
      default: 1
    },
},

  init: function () {
    const datGui = new GUI();

    const primitivesFolder = datGui.addFolder("Follow Planets");
    for (let i = 0; i < Object.keys(PlanetsSettings).length; i++) {
      const UIKey = Object.keys(PlanetsSettings)[i];
      primitivesFolder.add(PlanetsSettings, UIKey).name(UIKey).onChange(v => {
        console.log("Change to: ", v);
        if(v){
          let indexPrim = getFirstUISettingIndex(PlanetsSettings);
          planet_id = '#' + Object.keys(PlanetsSettings)[indexPrim].toLowerCase() + '-sphere';
          console.log("Planed_id", planet_id);

        }else{
          planet_id = "";
        }
      })
    }
  },
  tick: function() {
    if( planet_id != ""){
      const objToMoveTo = document.querySelector(planet_id).object3D;
      const mainCamera = document.querySelector('#main-camera').object3D;
      var newVec = new THREE.Vector3(); // create once an reuse it
      objToMoveTo.getWorldPosition(newVec);
      mainCamera.position.set(newVec.x + objToMoveTo.scale.x  * 1.1, newVec.y  + objToMoveTo.scale.y * 1.1, newVec.z + objToMoveTo.scale.z * 1.1);
    }
  }
});

function getFirstUISettingIndex(UISettings: any){
  for (let i = 0; i < Object.keys(UISettings).length; i++) {
    if(Object.values(UISettings)[i]){
      return i;
    }
  }
  return -1;
}

