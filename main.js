// global variables
let allTetracubes = [];

window.onload = async () => {
    // basic setup 
    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    // User input for shading
    document.getElementById('ambientCoefficient').addEventListener('input', (event) => {
        shadingComponents.ambientCoefficient = event.target.value;
        updateShadingUniforms();
    });

    document.getElementById('diffuseCoefficient').addEventListener('input', (event) => {
        shadingComponents.diffuseCoefficient = event.target.value;
        updateShadingUniforms();
    });

    document.getElementById('specularCoefficient').addEventListener('input', (event) => {
        shadingComponents.specularCoefficient = event.target.value;
        updateShadingUniforms();
    });

    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1);
    aspect = canvas.clientWidth / canvas.clientHeight;

    // create shader programs and enable one of them
    createShaderPrograms();
    shaderPrograms.gouraudSpecularProgram.enable();
    updateShadingUniforms();

    // Set projection and view matrices
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, false, matrices.projectionMatrix);
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.viewMatrix, false, matrices.viewMatrix);

    hidePauseScreen();
    mouseMovement();
    keyboardEvent();
    manipulateTetracube();

    // Set up playing field
    const baseplateSize = 6;
    const gridHeight = 10;
    grid = new Grid(baseplateSize, gridHeight);

    generateNewTetracube();

    // start render loop
    requestAnimationFrame(render);
}

// Previous frame time
let then = 0;

function render(now) {
    // calculate elapsed time in seconds
    let delta = now - then;
    delta *= 0.001;
    then = now;

    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set projection and view matrices
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.projectionMatrix, false, matrices.projectionMatrix);
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.viewMatrix, false, matrices.viewMatrix);

    const lightPosition = vec4.fromValues(-1, -1, -1, 0);
    vec4.transformMat4(lightPosition, lightPosition, lightMatrix);
    gl.uniform4fv(currentShaderProgram.uniforms.lightPosition, lightPosition);

    const cameraPosition = vec3.fromValues(camera.eye);
    gl.uniform3fv(currentShaderProgram.uniforms.cameraPosition, cameraPosition);

    const lightColor = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    gl.uniform4fv(currentShaderProgram.uniforms.lightColor, lightColor);

    if (!isPaused) {
        if (spaceBarPressed) {
            if (currentTetracube.detectCollision([0.0, -1.0, 0.0])){
                grid.placeTetracube(currentTetracube);
                generateNewTetracube();
                spaceBarPressed = false;
            } else
                currentTetracube.translate([0.0, -gravitySpeed*delta*100, 0.0]);
            
        } else if (currentTetracube.detectCollision([0.0, -1.0, 0.0])) {
            grid.placeTetracube(currentTetracube);
            generateNewTetracube();
        } else {
            currentTetracube.translate([0.0, -gravitySpeed*delta, 0.0]);
        }
    }

    // grid
    shaderPrograms.noLightProgram.enable();
    grid.draw();
    if (toggleGrid)
        grid.displayWireframe();

    // shading 
    if (currentShadingType === 'gouraud')
        shaderPrograms.gouraudSpecularProgram.enable();
    else
        shaderPrograms.phongSpecularProgram.enable();
    updateShadingUniforms();

    // Bonus: current tetracube pulses
    allTetracubes.forEach(tetracube => {
        if (tetracube === currentTetracube)
            gl.uniform1f(currentShaderProgram.uniforms.time, performance.now() * 0.003);
        else 
        gl.uniform1f(currentShaderProgram.uniforms.time, 0);
        tetracube.draw()
    });

    if (!gameOver()) 
        requestAnimationFrame(render);
}

function generateNewTetracube() {
    const tetra = new Tetracube();
    tetra.generateRandomTetracube();
    allTetracubes.push(currentTetracube);
}

// Shading 
function updateShadingUniforms() {
    gl.uniform1f(currentShaderProgram.uniforms.ambientCoefficient, shadingComponents.ambientCoefficient);
    gl.uniform1f(currentShaderProgram.uniforms.diffuseCoefficient, shadingComponents.diffuseCoefficient);
    gl.uniform1f(currentShaderProgram.uniforms.specularCoefficient, shadingComponents.specularCoefficient);
}

function createShaderPrograms() {
    shaderPrograms.noLightProgram = new ShaderProgram(shaders.noLight, shaders.fragment, shaderInfo);
    shaderPrograms.gouraudSpecularProgram = new ShaderProgram(shaders.gouraudSpecular, shaders.fragment, shaderInfo);
    shaderPrograms.phongSpecularProgram = new ShaderProgram(shaders.phong, shaders.phongSpecularFragment, shaderInfo);
}