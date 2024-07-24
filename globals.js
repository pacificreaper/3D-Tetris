const { mat4, mat3, vec4, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

let currentTetracube = null;
let interactionMode = 'shapes';
let currentShadingType = 'gouraud'
let isPaused = false;
let toggleGrid = false;
let aspect = null;
let spaceBarPressed = false;
let tetracube = null;
let gravitySpeed = 0.5;
let grid = null;
let gl = null;
let lightMatrix = mat4.create();

const shadingComponents = {
    ambientCoefficient: 1.0,
    diffuseCoefficient: 1.0,
    specularCoefficient: 1.0,
};

const shaders = {
    noLight: "v-shader-nolight",
    gouraudSpecular: "v-shader-gouraudspecular",
    phong: "v-shader-phong",
    fragment: "f-shader",
    phongSpecularFragment: "f-shader-phongspecular"
}

let currentShaderProgram = null;

const shaderInfo = {
    attributes: {
        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal",
    }, uniforms: {
        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix",
        lightPosition: "lightViewPosition",
        cameraPosition: "cameraPosition",
        lightColor: "lightColor",
        ambientCoefficient: "ambientCoefficient",
        diffuseCoefficient: "diffuseCoefficient",
        specularCoefficient: "specularCoefficient",
        time: "time"
    }
}

const shaderPrograms = {
    noLightProgram: null,
    gouraudSpecularProgram: null,
    phongSpecularProgram: null
}

const matrices = {
    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),
}