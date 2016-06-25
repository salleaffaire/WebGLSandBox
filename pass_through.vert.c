// Shader now accepts pixels and convert to clipspace coordinates
attribute vec2 a_position;

uniform vec2 u_resolution_vs;

varying vec2 v_texCoord;

void main() {
   // convert the rectangle from pixels to 0 to 1
   vec2 zeroToOne = a_position / u_resolution_vs;

   // double its resolution 
   vec2 zeroToTwo = zeroToOne * 2.0;

   // shoft it from -1 to 1
   vec2 clipSpace = zeroToTwo - 1.0;

   // [x, y x, alpha]
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // Texture coordinate go from 0 to 1 no matter the size of the texture
   v_texCoord = zeroToOne;
}
