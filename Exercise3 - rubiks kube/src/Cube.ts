import { ShaderObject } from "./ShaderObject";
import {Matrix4, Vector3, Vector4} from "three";
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
        const pos = this.getPosition();
        const point = new Vector3(0, 0, pos.z);
        const posToPoint = new Vector3();
        posToPoint.subVectors(pos, point);
        const posToPoint4 = new Matrix4().makeTranslation(posToPoint.x, posToPoint.y, posToPoint.z);

        const pointToPos = new Vector3();
        pointToPos.subVectors(point, pos);
        const pointToPos4 = new Matrix4().makeTranslation(pointToPos.x, pointToPos.y, pointToPos.z);

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
                break;
            case 'B':
                break;
            case 'D':
                break;
            default:
                console.log("Something wrong!. Group: ", group)
                break;
        }
        // glm::vec4 pos_rot_h = rotate * glm::vec4( start_position - p, 1.0f );
        // glm::vec3 pos_rot   = glm::vec3( pos_rot_h ) + p;

        let rotationMatrix = new Matrix4().makeRotationAxis(direction, rot);
        const newModelViewMatrix = new Matrix4().copy(this.modelViewMatrix);
        
        //rotationMatrix.multiply(pointToPos4);
        rotationMatrix.multiply(newModelViewMatrix);
        //rotationMatrix.multiply(posToPoint4);
        this.setNewModelViewMatrix(rotationMatrix);
    }    
}