class Grid {
    constructor(baseplateSize, gridHeight) {
        this.baseplateSize = baseplateSize;
        this.gridHeight = gridHeight;
        this.gridArray = [];
        this.createGridArray();

        this.vertices = [];
        this.colors = [];

        this.colorBuffer = gl.createBuffer();
        this.gridBuffer = gl.createBuffer();

        this.modelMatrix = mat4.create();
        this.modelViewMatrix = mat4.create();

        this.createGrid();
    }

    createGridArray() {
        for (let x = 0; x < this.baseplateSize; x++) {
            this.gridArray[x] = [];
            for (let y = 0; y < this.gridHeight; y++) {
                this.gridArray[x][y] = [];
                for (let z = 0; z < this.baseplateSize; z++) {
                    this.gridArray[x][y][z] = null;
                }
            }
        }
    }

    createGrid() {
        const white = [1.0, 1.0, 1.0, 1.0];

        // Start Citation: vertices for 3-sided grid with the help of ChatGPT
        // baseplate
        for (let x = 0; x <= this.baseplateSize; x++) {
            this.vertices.push(x, 0, 0, x, 0, this.baseplateSize);
            this.colors.push(...white, ...white);
        }

        for (let z = 0; z <= this.baseplateSize; z++) {
            this.vertices.push(0, 0, z, this.baseplateSize, 0, z);
            this.colors.push(...white, ...white);
        }

        for (let y = 0; y <= this.gridHeight; y++) {
            // right wall
            for (let z = 0; z <= this.baseplateSize; z++) {
                this.vertices.push(0, 0, z, 0, this.gridHeight, z);
                this.colors.push(...white, ...white);
                this.vertices.push(0, y, 0, 0, y, this.baseplateSize);
                this.colors.push(...white, ...white);
            }
            // front wall
            for (let x = 0; x <= this.baseplateSize; x++) {
                this.vertices.push(x, 0, 0, x, this.gridHeight, 0);
                this.colors.push(...white, ...white);
                this.vertices.push(0, y, 0, this.baseplateSize, y, 0);
                this.colors.push(...white, ...white);
            }
        }
        // End Citation

        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    }

    draw() {
        Grid.setupAttribute(this.gridBuffer, currentShaderProgram.attributes.vertexLocation);
        Grid.setupAttribute(this.colorBuffer, currentShaderProgram.attributes.colorLocation);

        mat4.mul(this.modelViewMatrix, matrices.viewMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, this.modelViewMatrix);

        gl.drawArrays(gl.LINES, 0, this.vertices.length / 3);
    }

    static setupAttribute(buffer, location) {
        if (location == -1)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            location,
            3,
            gl.FLOAT,
            gl.FALSE,
            0,
            0
        );
        gl.enableVertexAttribArray(location);
    }

    displayWireframe() {
        const vertices = [];

        // Start Citation: vertices for wireframe derived from above citation for 3-sided grid
        // baseplates
        for (let x = 0; x <= this.baseplateSize; x++) {
            for (let z = 0; z <= this.baseplateSize; z++) {
                vertices.push(x, 0, z, x, this.gridHeight, z);
            }
        }
        // walls
        for (let x = 0; x <= this.baseplateSize; x++) {
            for (let y = 0; y <= this.gridHeight; y++) {
                vertices.push(x, y, 0, x, y, this.baseplateSize);
            }
        }
        for (let y = 0; y <= this.gridHeight; y++) {
            for (let z = 0; z <= this.baseplateSize; z++) {
                vertices.push(0, y, z, this.baseplateSize, y, z);
            }
        }
        // End Citation

        const wireframeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, wireframeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        Grid.setupAttribute(wireframeBuffer, currentShaderProgram.attributes.vertexLocation);
        Grid.setupAttribute(this.colorBuffer, currentShaderProgram.attributes.colorLocation);
        gl.drawArrays(gl.LINES, 0, vertices.length / 3);
    }

    placeTetracube(tetracube) {
        const translation = mat4.getTranslation(vec3.create(), tetracube.translationMatrix);

        tetracube.cubes.forEach(cube => {
            const cubePosition = vec3.add(vec3.create(), cube.position, translation);
            const x = Math.floor(cubePosition[0]);
            const y = Math.floor(cubePosition[1]);
            const z = Math.floor(cubePosition[2]);

            if (!this.inGridBoundary(cubePosition) || y >= this.gridHeight)
                return;

            this.gridArray[x][y][z] = cube;
        });
        tetracube.updateColor();
    }

    tetracubePresent(position) {
        const x = Math.floor(position[0]);
        const y = Math.floor(position[1]);
        const z = Math.floor(position[2]);

        if (!this.inGridBoundary(position) || y >= this.gridHeight)
            return;

        return this.gridArray[x][y][z] !== null;
    }

    inGridBoundary(position) {
        const [x, y, z] = position;
        if (x < 0 || x >= this.baseplateSize || y < 0 || y >= this.gridHeight + 1 || z < 0 || z >= this.baseplateSize)
            return false;

        return true;
    }
}

