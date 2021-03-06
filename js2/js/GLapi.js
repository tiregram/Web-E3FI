var horizAspect = 600.0/600.0;

var squareXOffset = 0.0;
var squareYOffset = 0.0;
var squareZOffset = -30.0;

var xIncValue = 0.1;
var yIncValue = 0.1;
var zIncValue = 0.1;

var lastSquareUpdateTime =0;


function initBuffers() {
    
/*   var vertices = [
       1.0,  1.0,  0.0,
	   -1.0, 1.0,  0.0,
       1.0,  -1.0, 0.0,
	   -1.0, -1.0, 0.0
   ];
    
    squareVerticesBuffer = gl.createBuffer();    
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    var colors = [
	1.0,  1.0,  1.0,  1.0,    // blanc
	1.0,  0.0,  0.0,  1.0,    // rouge
	0.0,  1.0,  0.0,  1.0,    // vert
	0.0,  0.0,  1.0,  1.0     // bleu
    ];
    
    squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
*/
}


function initWebGL(canvas) { 
    // Initialise la variable gloable gl à null
    gl = null; 
    
    try { 
	// Essaye de récupérer le contexte standard. En cas d'échec, il teste l'appel experimental
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"); 
    } 
    catch(e)
    {
	console.log(e);
    } 
    
    // Si le contexte GL n'est pas récupéré, on l'indique à l'utilisateur.
    if (!gl) { 
	alert("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité."); 
    } 
}  


function initShaders() {

    var fragmentShader = getShader(gl, "shader-fs");    
    var vertexShader = getShader(gl, "shader-vs");
    
    // Créer le programme shader
    
    window.shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // Faire une alerte si le chargement du shader échoue
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Impossible d'initialiser le shader.");
    }
    
  //  gl.useProgram(shaderProgram);
    
    //    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    //   gl.enableVertexAttribArray(vertexPositionAttribute);
    
    //   vertexColorAttribute = gl.getAttribLocation(shaderProgram,"aVertexColor");
    //  gl.enableVertexAttribArray(vertexColorAttribute);
    

///
    
    //    gl.useProgram(shaderProgram);
    //vertexPositionAttribute1 = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    //gl.enableVertexAttribArray(vertexPositionAttribute1);
    
    // vertexColorAttribute1 = gl.getAttribLocation(shaderProgram,"aVertexColor");
    //gl.enableVertexAttribArray(vertexColorAttribute1);
    
}



function getShader(gl, id)
{
    var shaderScript, theSource, currentChild, shader;
    
    shaderScript = document.getElementById(id);
    
    if (!shaderScript) {
        return null;
    }
    
    theSource = "";
    currentChild = shaderScript.firstChild;
    
    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }
        
        currentChild = currentChild.nextSibling;
    }
    
    if (shaderScript.type == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
	// type de shader inconnu
	return null;
    }

    gl.shaderSource(shader, theSource);
    
    // Compile le programme shader
    gl.compileShader(shader);  
    
    // Vérifie si la compilation s'est bien déroulée
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
	alert("Une erreur est survenue au cours de la compilation des shaders: " + gl.getShaderInfoLog(shader));
      return null;  
    }
    
    return shader;

}



function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}



function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    perspectiveMatrix = makePerspective(45, 1, 0.1, 100.0);
    
    loadIdentity();

    mvPushMatrix();

    for(elem in window.wordOfBabale)
    {
//	console.log(elem);
	window.wordOfBabale[elem].draw();
    }
    
//    mvTranslate([squareXOffset, squareYOffset, squareZOffset]);
    

/*
    
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);    
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    mvTranslate([-squareXOffset, -squareYOffset, -squareZOffset]);

    ////////

    mvTranslate([squareXOffset1, squareYOffset1, squareZOffset1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer1);
    gl.vertexAttribPointer(vertexPositionAttribute1, 3, gl.FLOAT, false, 0, 0);    
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer1);
    gl.vertexAttribPointer(vertexColorAttribute1, 4, gl.FLOAT, false, 0, 0);

    
    setMatrixUniforms();    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    mvTranslate([-squareXOffset1, -squareYOffset1, -squareZOffset1]);*/
    
    mvPopMatrix();
    


    currentTime = (new Date).getTime();
    if (lastSquareUpdateTime) {
	var delta = 0;
	    if(!window.pause)
  	    delta = currentTime - lastSquareUpdateTime;
	
	for(elem in window.wordOfBabale)
	{
	    window.wordOfBabale[elem].move(delta);
	}
//  	squareRotation += (10 * delta) / 1000.0;
/*
	squareXOffset += xIncValue * ((100 * delta) / 1000.0);
	squareYOffset += yIncValue * ((100 * delta) / 1000.0);
	squareZOffset += zIncValue * ((100 * delta) / 1000.0);

	squareXOffset1 += xIncValue1 * ((100 * delta) / 1000.0);
	squareYOffset1 += yIncValue1 * ((100 * delta) / 1000.0);
	squareZOffset1 += zIncValue1 * ((100 * delta) / 1000.0);

	
	//limite X | Y calcul
	limite =- squareZOffset /3;

	if (squareYOffset > limite) {

	    yIncValue = -0.5;

	}else if( squareYOffset < -limite)
	{

	    yIncValue = 0.1;

	}

	if (squareXOffset > limite)
	{
	    xIncValue = -0.1;
	}else if( squareXOffset < -limite)
	{
	    xIncValue = 0.1;
	}


	if (squareZOffset > -20.0)
	{
	    zIncValue = -0.1;
	    
	}else if( squareZOffset < -60.0)
	{
	    zIncValue = 0.1;
	}

*/
//	console.log("x:"+squareXOffset);
//	console.log("y:"+squareYOffset);
//	console.log("z:"+squareZOffset);
    }

    lastSquareUpdateTime = currentTime;  
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  
  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}
