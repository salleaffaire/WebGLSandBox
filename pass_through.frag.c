precision mediump float;

// The texture
uniform sampler2D u_image;
uniform vec2 u_resolution_fs;

// the textCoors passed in from the vertex shader
varying vec2 v_texCoord;

void main() {
   // compute 1 pixel in texture coordinates.
   vec2 onePixel = vec2(1.0, 1.0) / u_resolution_fs;

   gl_FragColor = texture2D(u_image, v_texCoord);
}