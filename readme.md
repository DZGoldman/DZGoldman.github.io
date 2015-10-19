The Sudoku Solver/Player:


This app solves Sudoku puzzles and functions as a platform for a player to play them.

The game board is a 2D array of 81 cell objects, each which stores their own row, column, box, and current value, among other things. The solving algorithm itself is an object which cycles through the cells in the board.

The solving algorithm is essentially entirely carried in the backend via Javascript (the biggest exception to this is the starting values, which are retrieved dynamically from he DOM via Jquery.) It is a brute force algorithm which, in essence, tests numbers until there are no more possibilities left, then backtracks and repeats. Checking to see if a given number "fits" in a cell (ie, can be put in the cell without a row/column/box ). This required that each cell have method to retrieve an array of their rows, columns and boxes.

The main sequence of the solver takes place in a while loop, which repeats the process until the board is solved. An additional while loop is used to skip over the "fixed" cells (starting cells whose values are fixed).

Given the nature of the algorithm, a puzzle is solved when the game "tries" to move past the final row, and a puzzle if impossible if the game "tries" to move prior to the first row.

Once the solution is found and stored in the backend, a player can attempt to solve the puzzle by inputing values into the input divs in the html board. The check button dynamically compares the values on the board to the solution grid.


Improvements:
-The readout should read "wait" while the solving algorithm is still running. I tried this, but for some reason it wouldn't work.
w buttons will appear:
--A 6x6 option, 12x12 option, etc.

Check: While solving, a player can click this at any time. It will turn t
