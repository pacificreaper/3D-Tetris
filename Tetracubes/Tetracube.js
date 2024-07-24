class Tetracube {
    constructor() {
        this.vertexBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();

        this.vertices = [];
        this.colors = [];
        this.normals = [];

        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();
        this.normalMatrix = mat3.create();

        this.cubes = [];
        this.tetracubeTypes = ["Straight", "T", "L", "Branch", "Skew", "LeftSkew", "RightSkew", "Square"];

        this.rotationMatrix = mat4.create();
        this.translationMatrix = mat4.create();

        this.createTetracube();
    }

    createTetracube() { }

    initBuffers() {
        this.cubes.forEach(cube => {
            this.vertices.push(...cube.vertices);
            this.colors.push(...cube.colors);
            this.normals.push(...cube.normals);
        });

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
    }

    draw() {
        mat4.identity(this.modelMatrix);
        mat4.mul(this.modelMatrix, this.translationMatrix, this.rotationMatrix);

        Tetracube.setupAttribute(this.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Tetracube.setupAttribute(this.colorBuffer, currentShaderProgram.attributes.colorLocation);
        Tetracube.setupAttribute(this.normalBuffer, currentShaderProgram.attributes.normalLocation);

        mat4.mul(this.modelViewMatrix, matrices.viewMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, this.modelViewMatrix);
        mat3.normalFromMat4(this.normalMatrix, this.modelViewMatrix);
        gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, false, this.normalMatrix);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }

    rotate(angle, axis) {
        const rotationMatrix = mat4.fromRotation(mat4.create(), angle, axis);
        
        const testModelMatrix = mat4.mul(mat4.create(), rotationMatrix, this.rotationMatrix);
        mat4.mul(testModelMatrix, this.translationMatrix, testModelMatrix);

        for (const cube of this.cubes) {
            const newCubePosition = vec3.transformMat4(vec3.create(), cube.position, testModelMatrix);
            if (!grid.inGridBoundary(newCubePosition) || grid.tetracubePresent(newCubePosition))
                return;
        }

        mat4.mul(this.rotationMatrix, this.rotationMatrix, rotationMatrix);
    }

    translate(vector) {
        if (this.detectCollision(vector))
            return;
        mat4.translate(this.translationMatrix, this.translationMatrix, vector);
    }

    generateRandomTetracube() {
        const randomTetracube = this.tetracubeTypes[Math.floor(Math.random() * this.tetracubeTypes.length)];
        switch (randomTetracube) {
            case "Straight":
                currentTetracube = new StraightTetracube();
                break;
            case "T":
                currentTetracube = new TTetracube();
                break;
            case "L":
                currentTetracube = new LTetracube();
                break;
            case "Branch":
                currentTetracube = new BranchTetracube();
                break;
            case "Skew":
                currentTetracube = new SkewTetracube();
                break;
            case "LeftSkew":
                currentTetracube = new LeftSkewTetracube();
                break;
            case "RightSkew":
                currentTetracube = new RightSkewTetracube();
                break;
            case "Square":
                currentTetracube = new SquareTetracube();
                break;
        }

        const startingPosition = [0.5, grid.gridHeight - 0.5, 0.5];
        currentTetracube.translate(startingPosition);
        currentTetracube.initBuffers();
    }

    detectCollision(position) {
        const translation = mat4.getTranslation(vec3.create(), this.translationMatrix);

        for (const cube of this.cubes) {
            const cubePosition = vec3.add(vec3.create(), cube.position, translation);
            const transformedCube = vec3.add(vec3.create(), cubePosition, position);

            if (!grid.inGridBoundary(transformedCube) || grid.tetracubePresent(transformedCube))
                return true;
        }
        return false;
    }

    // Bonus
    updateColor() {
        const color = [Math.random(), Math.random(), Math.random()];
        let newCubes = [];
        this.cubes.forEach(cube => {
            newCubes.push(createCube(color, cube.position));
        });
        this.cubes = newCubes;
        this.vertices = [];
        this.colors = [];
        this.normals = [];
        this.initBuffers();
    }

    static setupAttribute(buffer, location) {
        if (location == -1)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location, // the attribute location
            3, // number of elements for each vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // should data be normalised?
            0, // stride
            0 // offset
        );
        // enable the attribute
        gl.enableVertexAttribArray(location);
    }
}


