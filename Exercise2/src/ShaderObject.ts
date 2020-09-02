// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import {GUI} from 'dat.gui'; 


export class ShaderObject{
    positions: number[];
    indices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;
    position: any;
    objPrimitive: number;

    constructor(vertexNum:number, positions: number[], indices: number[], color: number[],
                position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5){
        this.positions = positions;
        this.indices = indices;
        this.color = color;
        this.vertexNum = vertexNum;
        this.position = position;
        this.objPrimitive = objPrimitive;
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