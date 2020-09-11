import { ShaderObject } from "./ShaderObject";
import {Matrix4, Vector3, Quaternion, Euler} from "three";
import { GUI } from "dat.gui";


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

  const white = [ 1.0,  1.0,  1.0,  1.0];
  const red = [ 1.0,  0.0,  0.0,  1.0];
  const green = [ 0.0,  1.0,  0.0,  1.0];
  const blue = [ 0.0,  0.0,  1.0,  1.0];

  let colors: number[] = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  export class Cube extends ShaderObject{
    state: number[];
    modelViewMatrix: Matrix4;

    angleRot: number;

    constructor(position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5, datGui: GUI = null){
        super(36, positions, indices, colors, position, objPrimitive, datGui);
        this.state = [];
    }
       
    rotateGroup(group:string, rot:number){

        switch (group) {
            case 'F':
                let rotationMatrix = new Matrix4().makeRotationAxis(this.getForward(), rot/2);
                const newModelViewMatrix = new Matrix4().copy(this.modelViewMatrix);
                console.log(" pos: ", new Vector3().setFromMatrixPosition(newModelViewMatrix), "\nrot: ", new Euler().setFromRotationMatrix(newModelViewMatrix));
                newModelViewMatrix.multiply(this.getNegTranslationMatrix());
                console.log("Translate back, origin is zero: ", new Vector3().setFromMatrixPosition(newModelViewMatrix));
                newModelViewMatrix.multiply(rotationMatrix);
                console.log("Rotate ", rot, " degrees: ", new Euler().setFromRotationMatrix(newModelViewMatrix));
                newModelViewMatrix.multiply(this.getTranslationMatrixFromOrigin());
                console.log("Translate back, pos from: " , this.getPosition()," to: ", new Vector3().setFromMatrixPosition(newModelViewMatrix));
                this.setNewModelViewMatrix(newModelViewMatrix);
                // mat4.translate(this.modelViewMatrix, this.modelViewMatrix, negPos);
                // mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, Math.PI/2.0);
                // mat4.translate(this.modelViewMatrix, this.modelViewMatrix, pos);
                // let rot = quat.create();
                // mat4.getRotation(rot, this.modelViewMatrix);
                break;
            case 'R':
                break;
            case 'U':
                break;
            case 'L':
                break;
            case 'B':
                break;
            case 'D':
                break;
            default:
                console.log("Something wrong!. Group: ", group)
                break;
        }
    }    
}