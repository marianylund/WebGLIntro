// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import {GUI} from 'dat.gui'; 
import {Euler, Matrix4, Vector3} from "three";

export class ShaderObject{
    positions: number[];
    indices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;
    position: Vector3;
    rotation: Euler;
    objPrimitive: number;
    modelViewMatrix: Matrix4;


    constructor(vertexNum:number, positions: number[], indices: number[], color: number[],
                position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5, datGui: GUI = null){
        this.positions = positions;
        this.indices = indices;
        this.color = color;
        this.vertexNum = vertexNum;
        this.position = new Vector3(position[0], position[1], position[2]);
        this.rotation = new Euler(0, 0, 0);
        this.objPrimitive = objPrimitive;

        this.modelViewMatrix = new Matrix4();
        const translationMatrix = new Matrix4().makeTranslation(position[0], position[1], position[2]);
        this.modelViewMatrix.multiply(translationMatrix);

        if(datGui != null){
            const posFolder = datGui.addFolder("CubePosition");
            posFolder.add(this.position, 'x', -10, 10, 0.01);
            posFolder.add(this.position, 'y', -10, 10, 0.01);
            posFolder.add(this.position, 'z', -20, 0, 0.01);

            const rotFolder = datGui.addFolder("CubeRotation");
            rotFolder.add(this.rotation, 'x', -4, 4, 0.01);
            rotFolder.add(this.rotation, 'y', -4, 4, 0.01);
            rotFolder.add(this.rotation, 'z', -4, 4, 0.01);
        }
    
    }

    getPosition(){
        return this.position;
    }

    getRotation(){
        return this.rotation;
    }

    getModelViewMatrix(){
        return this.modelViewMatrix;
    }

    initBuffers(gl: WebGLRenderingContext){
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);

    }
}