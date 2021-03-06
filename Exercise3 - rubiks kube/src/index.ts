import {GUI} from 'dat.gui'; 
import { ShadersLoader } from './ShadersLoader';
import { ShaderObject } from './ShaderObject';
import {Matrix4, Quaternion, Vector3} from "three";
import { RubiksCube } from './RubiksCube';

const PrimitivesUISettings = {POINTS: false, LINES: false, LINE_STRIP: false, LINE_LOOP: false, TRIANGLES: true, TRIANGLE_STRIP: false, TRIANGLE_FAN: false};
const RotationGroups = ['F', 'R', 'U', 'L', 'B', 'D'];

let gl:WebGLRenderingContext;
let gui: GUI;
let programInfo:any;
let shaderObjects: ShaderObject[] = [];
let cameraPosition: Vector3 = new Vector3(0.0, 0.0, -12.0);
const mousePosition: Vector3 = new Vector3(0.0, 0.0, 0.0);
const cameraSpeed = 0.1;
let zoom = 0.02;
let theta:number = 0, phi:number = 0;

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

  AddInputListeners(canvas);

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

function drawScene(gl: WebGLRenderingContext, programInfo: any, shaderObjects: ShaderObject[], deltaTime:number) {
  gl.clearColor(0.894, 0.831, 0.847, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  
  let top = zNear * Math.tan( Math.PI/180 * 0.5 * fieldOfView ) / zoom; // divide by zoom
  let height = 2 * top;
  let width = aspect * height;
  let left = - 0.5 * width;

  const projectionMatrix = new Matrix4();
  const rotationMatrix = new Matrix4();
  const cameraTranslationMatrix = new Matrix4().makeTranslation(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  const negCameraTranslationMatrix = new Matrix4().makeTranslation(-cameraPosition.x, -cameraPosition.y, -cameraPosition.z);
  
  let eyeVector = new Vector3(cameraPosition.z*Math.cos(phi) * Math.sin(theta), cameraPosition.z*Math.sin(phi)*Math.sin(theta), cameraPosition.z*Math.cos(theta));
  rotationMatrix.lookAt(eyeVector, new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  projectionMatrix.makePerspective(left, left + width, top, top - height, zNear, zFar);
  projectionMatrix.multiply(cameraTranslationMatrix);
  projectionMatrix.multiply(rotationMatrix);
  projectionMatrix.multiply(negCameraTranslationMatrix);
  projectionMatrix.multiply(cameraTranslationMatrix);

  
  const primitives = [gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];
  
  let posBuffer:WebGLBuffer;
  let colBuffer:WebGLBuffer;
  let indBuffer:WebGLBuffer;

  shaderObjects.forEach((obj: ShaderObject) => {
    if(posBuffer == null){
      obj.initBuffers(gl);
      setUpBuffer(3, obj.positionBuffer, programInfo.attribLocations.vertexPosition);
      setUpBuffer(4, obj.colorBuffer, programInfo.attribLocations.vertexColor);
      // Tell WebGL which indices to use to index the vertices
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
      posBuffer = obj.positionBuffer;
      colBuffer = obj.colorBuffer;
      indBuffer = obj.indexBuffer;
    }else{
      obj.setBuffers(posBuffer, indBuffer, colBuffer);
      setUpBuffer(3, obj.positionBuffer, programInfo.attribLocations.vertexPosition);
      setUpBuffer(4, obj.colorBuffer, programInfo.attribLocations.vertexColor);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    }
    
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix.toArray());
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        obj.getModelViewMatrix(deltaTime).toArray());

    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    let indexPrim = getFirstUISettingIndex(PrimitivesUISettings);
    if( indexPrim == -1){
      indexPrim = 4;
    }

    gl.drawElements(gl.TRIANGLES, obj.vertexNum, type, offset);
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

}

function addObjectsToDraw(shaderObjects: ShaderObject[]){
  new RubiksCube(shaderObjects, 2, gui);
}

function AddInputListeners(canvas:HTMLCanvasElement){

  let oldX:number, oldY:number;
  let rotate: boolean = false;
  const rotateMultiplier = 0.01;

  canvas.addEventListener('mousedown', function(event){
    rotate = false;
    if(event.button == 0){ // right button
      oldX = event.x;
      oldY = event.y;
      rotate = true;
    } 
  });

  canvas.addEventListener('mouseup', function(event){
    if(event.button == 0){ // right button
      rotate = false;
    } 
  });

  canvas.addEventListener('mousemove', function(event){
    if(rotate) {
      theta += (event.x-oldX)*rotateMultiplier;
      phi   += (event.y-oldY)*rotateMultiplier;
    }
    oldX = event.x; 
    oldY = event.y; 
  });

  canvas.addEventListener('wheel', function(event){
    event.preventDefault();

    zoom += event.deltaY * -0.001;

    // Restrict scale
    zoom = Math.min(Math.max(.005, zoom), 0.1);
  });
}

function onKeyDown(event: KeyboardEvent)
{
  switch (event.key) {
    case "ArrowDown":
      cameraPosition.y += cameraSpeed;
      break;
    case "ArrowUp":
      cameraPosition.y -= cameraSpeed;
      break;
    case "ArrowLeft":
      cameraPosition.x -= cameraSpeed;
      break;
    case "ArrowRight":
      cameraPosition.x += cameraSpeed;
      break;
}
}

window.onload = main;
