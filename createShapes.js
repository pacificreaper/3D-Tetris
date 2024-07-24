function createCube(color, position) {
    const vertices = [
        // Front face
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,

        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,

        // Left face
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,

        // Back face
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,

        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,

        // Bottom face
        0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,

        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        // Right face
        0.5, 0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,

        // Top face
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,

        0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
    ];

    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] += position[0];
        vertices[i + 1] += position[1];
        vertices[i + 2] += position[2];
    }

    const colors = [];
    for (let i = 0; i < vertices.length / 3; ++i) {
        colors.push(...color);
    }

    const normalData = [
        [0, 0, 1],  // Front
        [-1, 0, 0], // Left
        [0, 0, -1], // Back
        [0, -1, 0], // Bottom
        [1, 0, 0],  // Right
        [0, 1, 0],  // Top
    ];

    const normals = [];
    normalData.forEach(normal => {
        for (let i = 0; i < 6; ++i) {
            normals.push(...normal);
        }
    });

    return { vertices, colors, normals, position };
}
