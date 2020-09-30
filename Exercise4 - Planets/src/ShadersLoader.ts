// Following mozilla tutorial: 
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context

import FIREBALLfragmentShader from 'raw-loader!./Shaders/FIREBALL.frag';
import FIREBALLvertexShader from 'raw-loader!./Shaders/FIREBALL.vert';

export class ShadersLoader{

    fFIREBALLShader!: string;
    vFIREBALLShader!: string;

    constructor(){
        const debug = false;

        console.log("Shaders loading ...");

        this.fFIREBALLShader = this.parseShaderFile(FIREBALLfragmentShader);
        if(debug) console.log("Fragment FIREBALL: \n", this.fFIREBALLShader);
        this.vFIREBALLShader = this.parseShaderFile(FIREBALLvertexShader);
        if(debug) console.log("Vertex FIREBALL: \n", this.vFIREBALLShader);

        console.log("Shaders loading finished.");
    }

    parseShaderFile(shaderModule:any){
        return shaderModule.substr(16, shaderModule.length-20).replace(/\\n/g, "\n").replace(/\\r/g, "\n");
    }

}