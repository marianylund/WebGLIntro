// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import {GUI} from 'dat.gui'; 
import {Euler, Matrix4, Quaternion, Vector3} from "three";

export class ShaderObject{
    positions: number[];
    indices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;
    position: Vector3;
    rotationQ: Quaternion;
    rotationE: Euler;
    objPrimitive: number;
    modelViewMatrix: Matrix4;


    constructor(vertexNum:number, positions: number[], indices: number[], color: number[],
                position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5, datGui: GUI = null){
        this.positions = positions;
        this.indices = indices;
        this.color = color;
        this.vertexNum = vertexNum;
        this.position = new Vector3(position[0], position[1], position[2]);
        this.rotationE = new Euler();
        this.rotationQ = new Quaternion();
        this.objPrimitive = objPrimitive;

        this.modelViewMatrix = new Matrix4();
        const translationMatrix = new Matrix4().makeTranslation(position[0], position[1], position[2]);
        this.modelViewMatrix.multiply(translationMatrix);
    }

    getPosition(){
        return new Vector3().setFromMatrixPosition(this.modelViewMatrix);
    }

    getTranslationMatrix(){
        this.position = new Vector3().setFromMatrixPosition(this.modelViewMatrix);
        return new Matrix4().makeTranslation(this.position.x, this.position.y, this.position.z);
    }

    getNegTranslationMatrix(){
        this.position = new Vector3().setFromMatrixPosition(this.modelViewMatrix);
        return new Matrix4().makeTranslation(- this.position.x, - this.position.y, - this.position.z);
    }

    getQRotation(){
        return new Quaternion().setFromRotationMatrix(this.modelViewMatrix);
    }

    getERotation(){
        return new Euler().setFromRotationMatrix(this.modelViewMatrix);
    }

    getModelViewMatrix(){
        return this.modelViewMatrix;
    }

    updateModelViewMatrix(){
        this.modelViewMatrix = new Matrix4();
        this.rotationQ.setFromEuler(this.rotationE);
        const rotationMatrix = new Matrix4().makeRotationFromQuaternion(this.rotationQ);

        this.modelViewMatrix.multiply(rotationMatrix);
        this.modelViewMatrix.multiply(this.getTranslationMatrix());
    }

    setNewModelViewMatrix(newM:Matrix4){
        this.rotationE = new Euler().setFromRotationMatrix(newM);
        this.rotationQ = new Quaternion().setFromRotationMatrix(newM);
        this.position = new Vector3().setFromMatrixPosition(newM);
        this.modelViewMatrix = newM;
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

    getDirection(dir:Vector3){
        return dir.applyQuaternion(new Quaternion().setFromRotationMatrix(this.modelViewMatrix));
    }

    getUp(){
        return this.getDirection(new Vector3(0, 1, 0));
    }

    getRight(){
        return this.getDirection(new Vector3(1, 0, 0));
    }

    getForward(){
        return this.getDirection(new Vector3(0, 0, 1));
    }

    getDown(){
        return this.getDirection(new Vector3(0, -1, 0));
    }

    getLeft(){
        return this.getDirection(new Vector3(-1, 0, 0));
    }

    getBack(){
        return this.getDirection(new Vector3(0, 0, 1));
    }
}