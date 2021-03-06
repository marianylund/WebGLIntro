import {GUI} from 'dat.gui'; 
import { ShadersLoader } from './ShadersLoader';
import { ShaderObject } from './ShaderObject';
import {mat4} from 'gl-matrix';

const UISettings = {POINTS: true, LINES: true, LINE_STRIP: true, LINE_LOOP: true, TRIANGLES: true, TRIANGLE_STRIP: true, TRIANGLE_FAN: true};
let gl:WebGLRenderingContext;
let programInfo:any;
let shaderObjects: ShaderObject[] = [];

function main() {
  const canvas = document.createElement('canvas');
  document.querySelector('body').appendChild(canvas);
  gl = canvas.getContext('webgl');

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const gui = new GUI();
  initGUI(gui);

  const shaders = new ShadersLoader(gl);
  programInfo = {
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

  addObjectsToDraw(shaderObjects);

  // Draw the scene
  drawScene(gl, programInfo, shaderObjects);
}

function redrawScene(){
  drawScene(gl, programInfo, shaderObjects);
}


function drawScene(gl: WebGLRenderingContext, programInfo: any, shaderObjects: any) {
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
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const primitives = [gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];

  shaderObjects.forEach((obj: ShaderObject) => {
    if(!Object.values(UISettings)[obj.objPrimitive]){
      return;
    }
    obj.initBuffers(gl);
    setUpBuffer(2, obj.positionBuffer, programInfo.attribLocations.vertexPosition);
    setUpBuffer(4, obj.colorBuffer, programInfo.attribLocations.vertexColor);
    const modelViewMatrix = mat4.create();
  
    mat4.translate(modelViewMatrix,     // destination matrix
                  modelViewMatrix,     // matrix to translate
                  obj.position);  // amount to translate

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

    gl.drawArrays(obj.objPrimitive, 0, obj.vertexNum); // 0 is offset
  });



  function setUpBuffer(numOfComponents: number, buffer:WebGLBuffer, attribLocation: number){
    const numComponents = numOfComponents;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
        attribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
      attribLocation);
  }

}

function initGUI(datGui:GUI){
  if(datGui == null){
      return;
  }

  for (let i = 0; i < Object.keys(UISettings).length; i++) {
    const UIKey = Object.keys(UISettings)[i];
    datGui.add(UISettings, UIKey)
                .name(UIKey)
                .listen()
                .onChange(v => redrawScene());
  }
}

function addObjectsToDraw(shaderObjects: ShaderObject[]){
  const p0 = [0.0, 2.0];
  const p1 = [1.5, 1.5];
  const p2 = [2.0, 0.0];
  const p3 = [1.5, -1.5];
  const p4 = [0.0, -2.0];
  const p5 = [-1.5, -1.5];
  const p6 = [-2.0, 0.0];
  const p7 = [-1.5, 1.5];

  const white = [ 1.0,  1.0,  1.0,  1.0];
  const red = [ 1.0,  0.0,  0.0,  1.0];
  const green = [ 0.0,  1.0,  0.0,  1.0];
  const blue = [ 0.0,  0.0,  1.0,  1.0];

  const point0 = new ShaderObject(2, p0.concat(p1), white.concat(red), [0.0, 0.0, 0.0], 0);
  shaderObjects.push(point0);

  const line1 = new ShaderObject(2, p2.concat(p3), white.concat(red), [2.0, -1.0, -7.0], 1);
  shaderObjects.push(line1);

  const lineStrip2 = new ShaderObject(3, p4.concat(p5).concat(p6), white.concat(red).concat(green), [0.0, 2.5, -7.0], 2);
  shaderObjects.push(lineStrip2);
  
  const lineLoop3 = new ShaderObject(4, p4.concat(p5).concat(p6).concat(p4), white.concat(red).concat(green).concat(blue), [2.0, 2.5, -7.0], 3);
  shaderObjects.push(lineLoop3);

  const triangle4 = new ShaderObject(3, p1.concat(p2).concat(p3), red.concat(green).concat(blue), [1.0, 0.5, -7.0], 4);
  shaderObjects.push(triangle4);

  const triangle5 = new ShaderObject(3, p1.concat(p2).concat(p3), red.concat(green).concat(blue), [2.0, 0.5, -7.0], 5);
  shaderObjects.push(triangle5);

  const triangle6 = new ShaderObject(3, p1.concat(p2).concat(p3), red.concat(green).concat(blue), [3.0, 0.5, -7.0], 6);
  shaderObjects.push(triangle6);

  const square4 = new ShaderObject(4, p1.concat(p3).concat(p5).concat(p7), red.concat(green).concat(blue).concat(white), [1.0, -1.0, -9.0], 4);
  shaderObjects.push(square4);

  const square5 = new ShaderObject(4, p1.concat(p3).concat(p5).concat(p7), red.concat(green).concat(blue).concat(white), [-2.3, -1.0, -9.0], 5);
  shaderObjects.push(square5);

  const square6 = new ShaderObject(4, p1.concat(p3).concat(p5).concat(p7), red.concat(green).concat(blue).concat(white), [-5.6, -1.0, -9.0], 6);
  shaderObjects.push(square6);

}

window.onload = main;
