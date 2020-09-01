// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context


export class ShaderObject{
    vertices: number[];
    color: number[];
    positionBuffer:WebGLBuffer;
    colorBuffer:WebGLBuffer;
    vertexNum: number;

    constructor(vertexNum:number, vertices: number[], color: number[]){
        this.vertices = vertices;
        this.color = color;
        this.vertexNum = vertexNum;
    }

    initBuffers(gl: WebGLRenderingContext){
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(this.vertices),
                        gl.STATIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);

        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
    }
}