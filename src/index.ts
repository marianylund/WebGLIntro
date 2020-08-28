import {GUI} from 'dat.gui'; 
import { ShadersLoader } from './ShadersLoader';
import {mat4} from 'gl-matrix';



function main() {
  const canvas = document.createElement('canvas');
  document.querySelector('body').appendChild(canvas);
  const gl = canvas.getContext('webgl');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  const shaders = new ShadersLoader(gl);
  const programInfo = {
    program: shaders.program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaders.program, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaders.program, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaders.program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaders.program, 'uModelViewMatrix'),
    },
  };

  const buffers = initBuffers(gl);

  // Draw the scene
  drawScene(gl, programInfo, buffers);
}

function initBuffers(gl: WebGLRenderingContext) {

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  const colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function drawScene(gl: WebGLRenderingContext, programInfo: any, buffers: any) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

window.onload = main;


// import * as THREE from 'three';
// import {Vector3, Color, MOUSE} from 'three';
// import { WebGLRenderer } from 'three';
// import {OrbitControls} from './OrbitControls.js';
// import {DragControls} from './DragControls.js';
// import { ShaderDependentObj } from './ShaderDependentObj';
// import { LightObj } from './LightObj';
// import { ColorGUIHelper } from './ColorGUIHelper';


// function main() {
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize( window.innerWidth, window.innerHeight );

//     const canvas = renderer.domElement;
//     document.body.appendChild( renderer.domElement );

//     const gui = new GUI();
  
//     const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
//     camera.position.set(0, 10, 20);

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x2e2e2e);
//     gui.addColor(new ColorGUIHelper(scene.background), 'hexValue').name('Background color');

//     //#region OBJECTS
//     const lightObj = new LightObj(scene, gui, new Vector3(7.5, 1, 12.2), 
//                       new THREE.Color(0xffffff), 0.1, 64.0, 0.4);
    
//     const shadersLoader = new ShadersLoader();

//     //#endregion

//     //#region CONTROLS
//     const controls = new OrbitControls(camera, canvas);
//     controls.target.set(0, 5, 0);
//     controls.enableDamping = true;
//     controls.keyPanSpeed = 15.0;
//     controls.dampingFactor = 0.2;
//     controls.mouseButtons = { LEFT: null, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.ROTATE };
//     controls.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 }; //WASD movement
//     controls.update();

//     //#endregion 
    

//     function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
//       const canvas = renderer.domElement;
//       const width = canvas.clientWidth;
//       const height = canvas.clientHeight;
//       const needResize = canvas.width !== width || canvas.height !== height;
//       if (needResize) {
//         renderer.setSize(width, height, false);
//       }
//       return needResize;
//     }
  
//     function render() {
  
//       if (resizeRendererToDisplaySize(renderer)) {
//         const canvas = renderer.domElement;
//         camera.aspect = canvas.clientWidth / canvas.clientHeight;
//         camera.updateProjectionMatrix();
//       }
//       //console.log(lightUniforms.lightPos);
//       controls.update();
//       renderer.render(scene, camera);
//       requestAnimationFrame(render); // Updates on change
//     }
//     requestAnimationFrame(render); // Draws for the first time?
//   }
//   main();

