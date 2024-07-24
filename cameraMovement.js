let camera = new Camera();

function keyboardEvent() {
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case 'j': // Rotate counterclockwise about the Y-axis
                camera.rotate(toRad(5), [0, 1, 0]);
                break;
            case 'l': // Rotate clockwise about the Y-axis
                camera.rotate(toRad(-5), [0, 1, 0]);
                break;
            case 'i': // Rotate counterclockwise about the X-axis
                camera.rotate(toRad(5), [1, 0, 0]);
                break;
            case 'k': // Rotate clockwise about the X-axis
                camera.rotate(toRad(-5), [1, 0, 0]);
                break;
            case 'u': // Rotate counterclockwise about the Z-axis
                camera.rotate(toRad(5), [0, 0, 1]);
                break;
            case 'o': // Rotate clockwise about the Z-axis
                camera.rotate(toRad(-5), [0, 0, 1]);
                break;
            case '+': // Zoom in
                if (!camera.isOrthographic) {
                    camera.zoom(5);
                    break;
                }
            case '-': // Zoom out
                if (!camera.isOrthographic) {
                    camera.zoom(-5);
                    break;
                }
        }
    });

}

let dragging = false;
let mouseX = 0;
let mouseY = 0;

function mouseMovement() {

    window.addEventListener("mousedown", (event) => {
        dragging = true;
        mouseX = event.x;
    });

    window.addEventListener("mouseup", () => {
        dragging = false;
    });

    window.addEventListener("mousemove", (event) => {
        if (dragging) {
            const diff = event.x - mouseX;
            mouseX = event.x;
            camera.rotate(toRad(diff * 0.3), [0, 1, 0]);
        }
    });
}


