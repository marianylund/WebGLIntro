import {GUI} from 'dat.gui'; 
import { ShadersLoader } from './ShadersLoader';
import { ShaderObject } from './ShaderObject';
import {mat4, vec3} from 'gl-matrix';

const PrimitivesUISettings = {POINTS: false, LINES: false, LINE_STRIP: false, LINE_LOOP: true, TRIANGLES: false, TRIANGLE_STRIP: false, TRIANGLE_FAN: false};
const OtherUISettings = {TRS: true, TSR: false, STR: false, SRT: false, RTS: false, RST: false};

let gl:WebGLRenderingContext;
let gui: GUI;
let programInfo:any;
let shaderObjects: ShaderObject[] = [];
let cameraPosition: vec3 = [0.0, 0.0, 0.0];
const mousePosition: vec3 = [0.0, 0.0, 0.0];
const cameraSpeed = 0.1;

function main() {
  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  document.querySelector('body').appendChild(canvas);
  gl = canvas.getContext('webgl');

  document.addEventListener('keydown', onKeyDown, false);
  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  gui = new GUI();
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

  onmousemove = function(e){
    console.log("mouse location:", e.clientX, e.clientY);
    mousePosition[0] = e.clientX/canvas.width * 10.0;
    mousePosition[1] = e.clientY/window.innerHeight * 10.0;
    
  }
  

  var then = 0;

  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    // Draw the scene
    drawScene(gl, programInfo, shaderObjects, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function drawScene(gl: WebGLRenderingContext, programInfo: any, shaderObjects: any, deltaTime:number) {
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
  mat4.translate(projectionMatrix, projectionMatrix, cameraPosition);
  
  const primitives = [gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];
  
  shaderObjects.forEach((obj: ShaderObject) => {
    obj.initBuffers(gl);
    setUpBuffer(3, obj.positionBuffer, programInfo.attribLocations.vertexPosition);
    setUpBuffer(4, obj.colorBuffer, programInfo.attribLocations.vertexColor);
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    
    const modelViewMatrix = mat4.create();

    switch (getFirstUISettingIndex(OtherUISettings)) {
      case 0:
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        rotateObj(obj);
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        break;
      case 1:
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        rotateObj(obj);
        break;
      case 2:
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        rotateObj(obj);
      break;
      case 3:
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        rotateObj(obj);
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        break;
      case 4:
        rotateObj(obj);
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        break;
      case 5:
        rotateObj(obj);
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        break;
    
      default:
        mat4.translate(modelViewMatrix, modelViewMatrix, obj.getPosition());
        rotateObj(obj);
        mat4.scale(modelViewMatrix, modelViewMatrix, obj.getScale());
    }
    
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

    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    let indexPrim = getFirstUISettingIndex(PrimitivesUISettings);
    if( indexPrim == -1){
      indexPrim = 4;
    }

    gl.drawElements(primitives[indexPrim], obj.vertexNum, type, offset);

    function rotateObj(obj: ShaderObject) {
      const rot = obj.getRotation();
      mat4.rotateX(modelViewMatrix, modelViewMatrix, rot[0]);
      mat4.rotateY(modelViewMatrix, modelViewMatrix, rot[1]);
      mat4.rotateZ(modelViewMatrix, modelViewMatrix, rot[2]);
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

  const primitivesFolder = datGui.addFolder("WebGL Primitives");
  for (let i = 0; i < Object.keys(PrimitivesUISettings).length; i++) {
    const UIKey = Object.keys(PrimitivesUISettings)[i];
    primitivesFolder.add(PrimitivesUISettings, UIKey).name(UIKey)
  }

  const transformationsFolder = datGui.addFolder("TransformationsOrder");
  for (let i = 0; i < Object.keys(OtherUISettings).length; i++) {
    const UIKey = Object.keys(OtherUISettings)[i];
    transformationsFolder.add(OtherUISettings, UIKey).name(UIKey)
  }
}

function addObjectsToDraw(shaderObjects: ShaderObject[]){
  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  let colors: number[] = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const white = [ 1.0,  1.0,  1.0,  1.0];
  const red = [ 1.0,  0.0,  0.0,  1.0];
  const green = [ 0.0,  1.0,  0.0,  1.0];
  const blue = [ 0.0,  0.0,  1.0,  1.0];

  const square6 = new ShaderObject(36, positions, indices, colors, [0, -1.0, -9.0], 6, gui);
  shaderObjects.push(square6);

}

function onKeyDown(event: KeyboardEvent)
{
  switch (event.key) {
    case "ArrowDown":
      cameraPosition[1] += cameraSpeed;
      break;
    case "ArrowUp":
      cameraPosition[1] -= cameraSpeed;
      break;
    case "ArrowLeft":
      cameraPosition[0] -= cameraSpeed;
      break;
    case "ArrowRight":
      cameraPosition[0] += cameraSpeed;
      break;
}
}

window.onload = main;
