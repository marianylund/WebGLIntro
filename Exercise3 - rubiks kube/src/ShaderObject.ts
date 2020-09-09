// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import {GUI} from 'dat.gui'; 
import { vec3, mat4, quat } from 'gl-matrix';

export class ShaderObject{
    positions: number[];
    indices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;
    position: {x:number, y:number, z:number};
    rotation: {x:number, y:number, z:number};
    objPrimitive: number;

    constructor(vertexNum:number, positions: number[], indices: number[], color: number[],
                position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5, datGui: GUI = null){
        this.positions = positions;
        this.indices = indices;
        this.color = color;
        this.vertexNum = vertexNum;
        this.position = {x: position[0], y: position[1], z: position[2]};
        this.rotation = {x: 0, y: 0, z: 0};
        this.objPrimitive = objPrimitive;

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
        return vec3.fromValues(this.position.x, this.position.y, this.position.z);
    }

    getRotation(){
        return vec3.fromValues(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    getModelViewMatrix(){
        let modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, this.getPosition());
        modelViewMatrix = this.rotateModelViewMatrix(this.getRotation(), modelViewMatrix);
        return modelViewMatrix;
    }

    rotateModelViewMatrix(rot:vec3, modelViewMatrix:mat4) {
        mat4.rotateX(modelViewMatrix, modelViewMatrix, rot[0]);
        mat4.rotateY(modelViewMatrix, modelViewMatrix, rot[1]);
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, rot[2]);
        // TODO: need to update rotation somehow as well
        return modelViewMatrix;
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