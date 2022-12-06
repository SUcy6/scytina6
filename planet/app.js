var InitDemo = function () {
	loadTextResource('./shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
		} 
		else {
			loadTextResource('./shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} 
				else {
					loadJSONResource('./planet.json', function (modelErr, modelObj) {
						if (modelErr) {
							alert('Fatal error getting Susan model (see console)');
							console.error(modelErr);
						} 
						else {
							loadJSONResource('./U.json', function (model2Err, modelObj2) {
								if (model2Err) {
									alert('Fatal error getting Susan model2 (see console)');
									console.error(model2Err);
								}
								else {
									loadImage('./SusanTexture.png', function (imgErr, img) {
										if (imgErr) {
											alert('Fatal error getting Susan texture (see console)');
											console.error(imgErr);
										} 
										else { 
											RunDemo(vsText, fsText, img, modelObj, modelObj2);
										}
									});

								}
							});
						}
					});
				}
			});
		}
	});
};

var RunDemo = function (vertexShaderText, fragmentShaderText, SusanImage, SusanModel, SusanModel2) {
	console.log('This is working');
	model = SusanModel;
	model2 = SusanModel2;

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var susanVertices = SusanModel.meshes[0].vertices;
	var susanIndices = [].concat.apply([], SusanModel.meshes[0].faces);
	var susanTexCoords = SusanModel.meshes[0].texturecoords[0];
	var susanNormals = SusanModel.meshes[0].normals;

	var susanPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices), gl.STATIC_DRAW);

	var susanTexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);

	var susanIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices), gl.STATIC_DRAW);

	var susanNormalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
	var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
	gl.vertexAttribPointer(
		normalAttribLocation,
		3, gl.FLOAT,
		gl.TRUE,
		3 * Float32Array.BYTES_PER_ELEMENT,
		0
	);
	gl.enableVertexAttribArray(normalAttribLocation);




	// new
	//
	// Create buffer 2
	//
	var susanVertices2 = SusanModel2.meshes[0].vertices;
	// var susanIndices2 = [].concat.apply([], SusanModel2.meshes[0].faces);
	var susanTexCoords2 = SusanModel2.meshes[0].texturecoords[0];
	var susanNormals2 = SusanModel2.meshes[0].normals;

	var susanPosVertexBufferObject2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVertices2), gl.STATIC_DRAW);

	var susanTexCoordVertexBufferObject2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords2), gl.STATIC_DRAW);

	// var susanIndexBufferObject2 = gl.createBuffer();
	// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject2);
	// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndices2), gl.STATIC_DRAW);

	var susanNormalBufferObject2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals2), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject2);
	var positionAttribLocation2 = gl.getAttribLocation(program, 'vertPosition2');
	gl.vertexAttribPointer(
		positionAttribLocation2, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation2);

	// gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordVertexBufferObject2);
	// var texCoordAttribLocation2 = gl.getAttribLocation(program, 'vertTexCoord2');
	// gl.vertexAttribPointer(
	// 	texCoordAttribLocation2, // Attribute location
	// 	2, // Number of elements per attribute
	// 	gl.FLOAT, // Type of elements
	// 	gl.FALSE,
	// 	2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	// 	0
	// );
	// gl.enableVertexAttribArray(texCoordAttribLocation2);

	// gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject2);
	// var normalAttribLocation2 = gl.getAttribLocation(program, 'vertNormal2');
	// gl.vertexAttribPointer(
	// 	normalAttribLocation2,
	// 	3, gl.FLOAT,
	// 	gl.TRUE,
	// 	3 * Float32Array.BYTES_PER_ELEMENT,
	// 	0
	// );
	// gl.enableVertexAttribArray(normalAttribLocation2);










	//
	// Create texture
	//
	var susanTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, susanTexture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		SusanImage
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var yTranslateMatrix = new Float32Array(16);
	var zRotationMatrix = new Float32Array(16); // get closer

	//
	// Lighting information
	//
	gl.useProgram(program);

	var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
	var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
	var sunlightIntUniformLocation = gl.getUniformLocation(program, 'sun.color');

	gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
	gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
	gl.uniform3f(sunlightIntUniformLocation, 0.9, 0.9, 0.9);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		//angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		// angle = 180;
		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, 135, [0, 1, 0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, 0, [1, 0, 0]);
		glMatrix.mat4.translate(zRotationMatrix, identityMatrix, [0,0,-7])
		glMatrix.mat4.translate(yTranslateMatrix, yRotationMatrix, [0,-0.2,0])
		glMatrix.mat4.mul(worldMatrix, zRotationMatrix, yTranslateMatrix, xRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, susanTexture);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, susanIndices.length, gl.UNSIGNED_SHORT, 0);

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
};
