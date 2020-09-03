// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import {GUI} from 'dat.gui'; 
import { vec3 } from 'gl-matrix';

export class ShaderObject{
    positions: number[];
    indices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    indexBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;
    private position: {x:number, y:number, z:number};
    private rotation: {x:number, y:number, z:number};
    private scale: {x:number, y:number, z:number};
    objPrimitive: number;

    constructor(vertexNum:number, positions: number[], indices: number[], color: number[],
                position: any = [0.0, 0.0, -6.0], objPrimitive: number = 5, datGui: GUI = null){
        this.positions = positions;
        this.indices = indices;
        this.color = color;
        this.vertexNum = vertexNum;
        this.position = {x: position[0], y: position[1], z: position[2]};
        this.rotation = {x: 0, y: 0, z: 0};
        this.scale = {x: 1, y: 1, z: 1};
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

            const scaleFolder = datGui.addFolder("CubeScale");
            scaleFolder.add(this.scale, 'x', -4, 4, 0.01);
            scaleFolder.add(this.scale, 'y', -4, 4, 0.01);
            scaleFolder.add(this.scale, 'z', -4, 4, 0.01);
        }
    
    }

    getPosition(){
        let pos: vec3 = [this.position.x, this.position.y, this.position.z];
        return pos;
    }

    getRotation(){
        let rot: vec3 = [this.rotation.x, this.rotation.y, this.rotation.z];
        return rot;
    }

    getScale(){
        let scale: vec3 = [this.scale.x, this.scale.y, this.scale.z];
        return scale;
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