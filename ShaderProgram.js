class ShaderProgram{
    constructor(vertexid, fragmentid, shaderInfo){
        this.program = createShaderProgram(vertexid, fragmentid);
        gl.useProgram(this.program);

        this.attributes = {};
        this.uniforms = {};
        Object.entries(shaderInfo.attributes).forEach(([key, value]) => {
            // save attribute & uniform locations
            this.attributes[key] = gl.getAttribLocation(this.program, value);
        });

        Object.entries(shaderInfo.uniforms).forEach(([key, value]) => {
            // save attribute & uniform locations
            this.uniforms[key] = gl.getUniformLocation(this.program, value);
        });

        gl.uniformMatrix4fv(this.uniforms.projectionMatrix, gl.FALSE, matrices.projectionMatrix);

    }

    enable() {
        gl.useProgram(this.program);
        currentShaderProgram = this;
    }
}