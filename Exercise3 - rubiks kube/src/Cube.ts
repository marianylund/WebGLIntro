import { ShaderObject } from "./ShaderObject";
import {Matrix4, MathUtils, Vector3, Quaternion, QuadraticBezierCurve} from "three";
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
    [0.0,  0.95,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [0.0,  0.0,  0.0,  1.0],    // Right face: black
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
    isRotating: boolean = false;

    constructor(position: any = [0.0, 0.0, 0.0], objPrimitive: number = 5, datGui: GUI = null){
        super(36, positions, indices, colors, position, objPrimitive, datGui);
        this.state = [Math.round(this.position.x), Math.round(this.position.y), Math.round(this.position.z)];
        console.assert(this.getAllGroups().length == 3, "Cube should always have 3 groups", position, this.getAllGroups());
    }
       
    rotateGroup(group:string, val:number){
        if(!this.isInGroup(group)){
            console.error("This cube is not parth of the ", group, " group");
            return;
        }

        if(this.isRotating){
            return;
        }

        let direction = this.getForward();
        switch (group) {
            case 'F':
                direction = this.getForward();
                break;
            case 'R':
                direction = this.getRight();
                break;
            case 'U':
                direction = this.getUp();
                break;
            case 'L':
                direction = this.getLeft();
                break;
            case 'B':
                direction = this.getBack();
                break;
            case 'D':
                direction = this.getDown();
                break;
            default:
                console.log("Something wrong!. Group: ", group)
                break;
        }
        this.isRotating = true;
        this.rotatingAngle = Math.PI/2 * -val;
        this.rotatingDirection = direction;
        this.rotatedSoFar = 0.0;
        this.startModelMatrix = this.getModelViewMatrix();
    }

    rotatingAngle: number;
    rotatingDirection: Vector3;
    rotatedSoFar: number = 0.0;
    rotatingSpeed: number = 0.5;
    delta:number;
    startModelMatrix: Matrix4;

    getModelViewMatrix(delta: number = 0.0){
        if(this.isRotating){
            this.delta = delta;
            this.interpolateRotation();
        }
        return this.modelViewMatrix;
    }
    
    interpolateRotation(){
        const lerpVal = this.delta/this.rotatingSpeed;
        const lerpedRot = this.rotatingAngle * lerpVal;
        this.rotatedSoFar += lerpedRot;

        if(Math.abs(this.rotatedSoFar) >= Math.abs(this.rotatingAngle)){
            let rotationMatrix = new Matrix4().makeRotationAxis(this.rotatingDirection, this.rotatingAngle);
            const newModelViewMatrix = new Matrix4().copy(this.startModelMatrix);
            
            rotationMatrix.multiply(newModelViewMatrix);
            this.setNewModelViewMatrix(rotationMatrix);
            this.position = this.position.round();
            this.state = [this.position.x, this.position.y, this.position.z];
            this.isRotating = false;
            console.assert(this.getAllGroups().length == 3, "Cube should always have 3 groups", this.position, this.getAllGroups());
        }else{
            let rotationMatrix = new Matrix4().makeRotationAxis(this.rotatingDirection, lerpedRot);
            const newModelViewMatrix = new Matrix4().copy(this.modelViewMatrix);
            
            rotationMatrix.multiply(newModelViewMatrix);
            this.setNewModelViewMatrix(rotationMatrix);
        }
    }

    isInGroup(group:string){
        switch (group) {
            case 'F':
                return this.state[2] == -1;
            case 'R':
                return this.state[0] == 1;
            case 'U':
                return this.state[1] == 1;
            case 'L':
                return this.state[0] == -1;
            case 'B':
                return this.state[2] == 1;
            case 'D':
                return this.state[1] == -1;
            default:
                console.log("Something wrong!. Group: ", group)
                break;
        }
    }

    getAllGroups(){
        let rotationGroups = ['L', 'R', 'D', 'U', 'F', 'B'];
        rotationGroups = rotationGroups.filter((x:string) => this.isInGroup(x));
        return rotationGroups;
    }
}