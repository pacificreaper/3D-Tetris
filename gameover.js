// game over screen
function showGameOverScreen() {
    let screen = document.getElementById("gameover-screen");
    screen.style.display = "flex";
}

function hideGameOverScreen() {
    let screen = document.getElementById("gameover-screen");
    screen.style.display = "none";
}

document.addEventListener('DOMContentLoaded', () => {
    hideGameOverScreen();
    // reload page in order to start a new game
    document.getElementById('new-game-button').addEventListener('click', () => {
        location.reload();
    });
});

function gameOver(){
    for (let x = 0; x < grid.baseplateSize; x++) {
        for (let z = 0; z < grid.baseplateSize; z++) {
            if (grid.tetracubePresent([x, grid.gridHeight - 1, z])) {
                showGameOverScreen();
                return true;
            }
        }
    }
    return false;
}

// pause screen
function showPauseScreen() {
    let screen = document.getElementById("pause-screen");
    screen.style.display = "flex";
}

function hidePauseScreen() {
    let screen = document.getElementById("pause-screen");
    screen.style.display = "none";
}