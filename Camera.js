class Camera {
    constructor() {
        this.isOrthographic = true;

        this.eye = [15, 20, 15];
        this.center = [0, 0, 0];
        this.up = [0, 1, 0];

        this.initViewMatrix();
        this.setProjectionMatrix();
    }

    initViewMatrix() {
        mat4.lookAt(matrices.viewMatrix, this.eye, this.center, this.up);
        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, this.center);
    }

    setProjectionMatrix() {
        const left = -10.0, right = 10.0, bottom = -10.0, top = 10.0, near = 0.1, far = 100.0, fovy = toRad(45)

        if (this.isOrthographic) {
            mat4.ortho(matrices.projectionMatrix, left, right, bottom, top, near, far);
        } else {
            mat4.perspective(matrices.projectionMatrix, fovy, aspect, near, far);
        }
    }

    rotate(angle, axis) {
        const rotationMatrix = mat4.fromRotation(mat4.create(), angle, axis);

        const eye = vec3.subtract(vec3.create(), this.eye, this.center); // v = Q - P
        vec3.transformMat4(eye, eye, rotationMatrix); // v'
        vec3.add(this.eye, eye, this.center); // Q' = P + v'
        vec3.transformMat4(this.up, this.up, rotationMatrix); // adjust up vector for x / z rotations

        this.initViewMatrix(); 
    }

    zoom(z) {
        const translationMatrix = mat4.fromTranslation(mat4.create(), [0, 0, z]);
        mat4.mul(matrices.viewMatrix, translationMatrix, matrices.viewMatrix);
    }

    toggleView() {
        this.isOrthographic = !this.isOrthographic;
        this.setProjectionMatrix();
    }
}
