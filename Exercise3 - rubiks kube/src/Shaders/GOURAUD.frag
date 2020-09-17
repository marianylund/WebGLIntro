/*
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp vec4 glPos;

lowp float corner(lowp float v_pos, lowp float totpos){
    return v_pos - (v_pos - fract(totpos*0.5));
}

void main(void) {
    gl_FragColor = mix(vColor, vec4(corner(vPos[0], glPos[0]), corner(vPos[1], glPos[1]), corner(vPos[2], glPos[2]), 1.0), 0.3);
}
