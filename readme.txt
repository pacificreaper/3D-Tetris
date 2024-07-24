1. Tasks (T1, T2, T4, T5, T6) have been implemented.

Task T3 has been implemented with the exception of the following: 
"Make sure you delete a whole 2D slice if it is completely filled with object blocks."

B1 and B3 (two effects) have also been implemented (please see below for further details).

T7 and T8 have not been implemented.

2. The program was developed on a MacOS (intel) and tested in the chrome browser. An http connection was also set up using 
python3 -m http.server in the terminal and http://localhost:8000/index.html in the browser.

3. Details regarding B3:
    Special effects 1: let the block change their color after they have reached the ground
    Special effects 2: the current tetracube pulses as it moves down

    Details regarding B1:
        Currently, starting a new game works through simply refreshing the page when the new game button is pressed.

    Issues in program:
        Zooming in the perspective projection only affects the tetracubes and not the grid and I'm not really sure why.
        Although collision detection has been implemented, it unfortunately does not always work as expected.
        