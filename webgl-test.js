// Video playback - input 
var videoInput;
var isPaused;

// Main GL context 
var gl;

// GL program
var program;

// Canvas in which GL rendering is done
var canvasGL;

function webGLStart() {
   if (typeof canvas === "undefined") {
      // Get the video element
      videoInput = document.getElementById("video-input");   

      //console.log(video.videoWidth);
      //console.log(video.videoHeight);

      // Create a canvas of the size of the video 
      canvas = document.createElement('canvas');
      canvas.id = "GLInput";
      canvas.width = videoInput.videoWidth;
      canvas.height = videoInput.videoHeight;

      // Add it to the document
      document.body.appendChild(canvas);

      /// Get A WebGL context
      gl = canvas.getContext("experimental-webgl");

      // setup a GLSL program
      program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
      gl.useProgram(program);

      // set the resolution in vertex shader
      var resolutionLocation = gl.getUniformLocation(program, "u_resolution_vs");
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // set resolution in fragment shader
      vresolutionLocation = gl.getUniformLocation(program, "u_resolution_fs");
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      setInterval(drawScene, 33.3);
   }

   isPaused = false;
}

function webGLPause() {
   isPaused = true;
}

function drawScene() {
   if (isPaused == false) {
      // look up where the vertex data needs to go.
      var positionLocation = gl.getAttribLocation(program, "a_position");

      // Create a buffer that covers the whole image with 2 triangles
      // 1-   0,0 ; width,0 ; width,height 
      // 2-   width,height ; 0,height ; 0,0
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
              0,            0,
              canvas.width, 0,
              canvas.width, canvas.height,
              canvas.width, canvas.height,
              0,            canvas.height,
              0,            0]),
          gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Create a texture
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // copy the image from the video element
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoInput);

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6);
   }
}
