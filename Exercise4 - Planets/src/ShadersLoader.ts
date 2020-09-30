// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import GOURAUDfragmentShader from 'raw-loader!./Shaders/GOURAUD.frag';
import GOURAUDvertexShader from 'raw-loader!./Shaders/GOURAUD.vert';
import FIREBALLfragmentShader from 'raw-loader!./Shaders/FIREBALL.frag';
import FIREBALLvertexShader from 'raw-loader!./Shaders/FIREBALL.vert';

export class ShadersLoader{

    fGOURAUDShader!: string;
    vGOURAUDShader!: string;
    fFIREBALLShader!: string;
    vFIREBALLShader!: string;
    program!: WebGLProgram;

    constructor(gl: WebGLRenderingContext = null){
        const debug = false;

        console.log("Shaders loading ...");
        // this.fGOURAUDShader = this.parseShaderFile(GOURAUDfragmentShader);
        // if(debug) console.log("Fragment GOURAUD: \n", this.fGOURAUDShader);
        // this.vGOURAUDShader = this.parseShaderFile(GOURAUDvertexShader);
        // if(debug) console.log("Vertex GOURAUD: \n", this.vGOURAUDShader);
        
        // this.program = this.initShaderProgram(gl, this.vGOURAUDShader, this.fGOURAUDShader);

        this.fFIREBALLShader = this.parseShaderFile(FIREBALLfragmentShader);
        if(debug) console.log("Fragment FIREBALL: \n", this.fFIREBALLShader);
        this.vFIREBALLShader = this.parseShaderFile(FIREBALLvertexShader);
        if(debug) console.log("Vertex FIREBALL: \n", this.vFIREBALLShader);

        console.log("Shaders loading finished.");
    }

    parseShaderFile(shaderModule:any){
        return shaderModule.substr(16, shaderModule.length-20).replace(/\\n/g, "\n").replace(/\\r/g, "\n");
    }

    initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) : WebGLProgram {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
      
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
      
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
          return null;
        }
      
        return shaderProgram;
      }
      
      //
      // creates a shader of the given type, uploads the source and
      // compiles it.
      //
    loadShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
}