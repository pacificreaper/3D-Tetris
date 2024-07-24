function manipulateTetracube() {
    window.addEventListener("keydown", (event) => {
        if (event.key === 'g')
            toggleGrid = !toggleGrid;
        else if (event.key === 'p'){
            isPaused = !isPaused;
            if (isPaused) showPauseScreen();
            else hidePauseScreen();
        }
        else if (event.key === 'f') {
            currentShadingType === 'gouraud' ? currentShadingType = 'phong' : currentShadingType = 'gouraud';
            if (currentShadingType === 'gouraud')
                shaderPrograms.gouraudSpecularProgram.enable();
            else shaderPrograms.phongSpecularProgram.enable();
        }
        else if (!isPaused) {
            switch (event.key) {
                // translate shape
                case "ArrowRight":
                case 'd':
                    currentTetracube.translate([1.0, 0, 0]);
                    break;
                case "ArrowLeft":
                case 'a':
                    currentTetracube.translate([-1.0, 0, 0]);
                    break;
                case "ArrowUp":
                case 'w':
                    currentTetracube.translate([0, 0.0, -1.0]);
                    break;
                case "ArrowDown":
                case 's':
                    currentTetracube.translate([0, 0.0, 1.0]);
                    break;

                // rotate shape 
                case 'x':
                    currentTetracube.rotate(toRad(90), [1, 0, 0]);
                    break;
                case 'X':
                    currentTetracube.rotate(toRad(-90), [1, 0, 0]);
                    break;
                case 'y':
                    currentTetracube.rotate(toRad(90), [0, 1, 0]);
                    break;
                case 'Y':
                    currentTetracube.rotate(toRad(-90), [0, 1, 0]);
                    break;
                case 'z':
                    currentTetracube.rotate(toRad(90), [0, 0, 1]);
                    break;
                case 'Z':
                    currentTetracube.rotate(toRad(-90), [0, 0, 1]);
                    break;
                case ' ':
                    spaceBarPressed = true;
                    break;
                case 'v': // Toggle between orthographic and perspective view
                    camera.toggleView();
                    break;
            }
        }
    });
}