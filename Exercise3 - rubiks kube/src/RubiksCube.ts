import { ShaderObject } from "./ShaderObject";
import { Cube } from "./Cube";
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

  export class RubiksCube{
      cubeState: Cube[];
      RotationGroups = {'F': false, 'R':false, 'U':false, 'L':false, 'B':false, 'D':false};
      
    constructor(shaderObjects: ShaderObject[], dim: number = 2, datGui: GUI = null){

        this.cubeState = [];
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                for (let k = 0; k < dim; k++) {
                    let newCube = new Cube([i * 2.0, j *2.0, k*2.0 - 12.0]);
                    newCube.state = [i, j, k];
                    shaderObjects.push(newCube);
                    this.cubeState.push(newCube);
                }
            }
        }
        this.addGUI(datGui);
    }

    addGUI(datGui: GUI = null){
        if(datGui != null){
            for (let i = 0; i < Object.keys(this.RotationGroups).length; i++) {
                const key = Object.keys(this.RotationGroups)[i];
                const rot = Object.values(this.RotationGroups)[i];

                datGui.add(this.RotationGroups, key).name(key).onChange(v => {
                    if(v){
                        this.rotateGroup(key);
                    }
                });

            }
        }
    }

    rotateGroup(group:string){
        const groupOfCubes = this.getAllCubesOfGroup(group);
        groupOfCubes.forEach(cube => {
            cube.rotateGroup(group);
        });
    }

    isInGroup(cube: Cube, group:string){
        switch (group) {
            case 'F':
                return cube.state[2] == 1;
            case 'R':
                return cube.state[0] == 1;
            case 'U':
                return cube.state[1] == 1;
            case 'L':
                return cube.state[0] == 0;
            case 'B':
                return cube.state[2] == 0;
            case 'D':
                return cube.state[1] == 0;
            default:
                console.log("Something wrong!. Group: ", group)
                break;
        }
    }
    
    getAllCubesOfGroup(group:string){
        return this.cubeState.filter(x => this.isInGroup(x, group));
    }

}