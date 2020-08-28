// In-built variables:
//uniform mat4 modelMatrix; = object.matrixWorld
//uniform mat4 modelViewMatrix; = camera.matrixWorldInverse * object.matrixWorld
//uniform mat4 projectionMatrix; = camera.projectionMatrix
//uniform mat4 viewMatrix; = camera.matrixWorldInverse
//uniform mat3 normalMatrix;  = inverse transpose of modelViewMatrix
//uniform vec3 cameraPosition; = camera position in world space
//attribute vec3 position;
//attribute vec3 normal;
//attribute vec2 uv;
//if color on
//attribute vec3 color;

attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
}
