import { GUI } from "dat.gui";
import * as THREE from "three";


 export class AstronomicalObj{
     mesh: THREE.Mesh;
    
  constructor(datGui: GUI = null){
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.mesh = new THREE.Mesh( geometry, material );
  }

 }