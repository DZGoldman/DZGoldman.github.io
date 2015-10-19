The Sudoku Solver/Player:


This app solves Sudoku puzzles and functions as a platform for a player to play them.

Summary:
A player puts in any Sudoku puzzle directly ontp the board and clicks start (or uses a preset puzzle.) When start is clicked, the program finds the solution to the grid and stores it behind the scenes. At this point, players can try to solve the puzzle themselves; clicking "Hint" will turn all of the their correct guesses green and incorrect guesses red. Clicking "Reveal Solution" will show the solved puzzle on the board.

Solving Algorithm:
The puzzles are solved by a brute force method; it starts at cell (0,0) and tests numbers until one fits, moves on to the next cell, and repeats. If no numbers fit, it moves back to the previous cell, increases it's number by one, and repeats. Given the nature of the algorithm, a puzzle is solved when the game "tries" to move past the final row, and a puzzle if impossible if the game "tries" to move prior to the first row.

Structure:
Back-End:

Cells: Objects with keys values of their location on the board, and methods to retrieve array of the row/column/box they are in.

Board: A 2D array of cells. Since 2D array's are difficult to work with, I created a function that takes in a 2D array and a callback funciton and iterates to function to each element of the array. I use this throughout the code.

Solver: An object called game. Has methods/ keys to "target" a certain cell and move forward and backward throughout the board. The solver skips over cells (when targeting) if they are "fixed." The key method is canFit, which tests to see if a certain number can legally be placed in a given cell. The main sequence of the solver takes place in a while loop, which repeats the process until the board is solved.

Front-End:
Board cells: These are input elements of type "number", which have the build in feature of being clickable and able to take in numerical inputs. Each cell on the board is given row, column, and box attributes of their appropriate number. This is done dynamically in the same loop that adds the key values to the cell objects.

Buttons: HTML divs with click events added to them dynamically, which trigger various actions.

Readout: An HTML div whose innerHTML changes depending on the current stage of the game.


Improvements:

-Two main solving stages can be added to the algorithm to make the solving computation more efficient. Both would take place before the main sequence of the solver. The first is a "trim" method; this would, after taking in the fixed values, eliminate them as possbilites for the rest of the sequence for the all fo the cells in their respective rows/columns/boxes. This would cut down on a lot of redundancy.  
The second would be more complex; after the trim function runs, but before the main sequence, an easyCells function would run. This function would check to see if there are any "easy" solutions upfront; ie, if there are any rows/columns/boxes for a which a certain number only fits in one cell. This method is usually how a human being starts solving a puzzle. For an easy puzzle, this method could solve the whole puzzle. For the harder ones, it may only find a few; however, give the computational intensity of the main sequence, even if only cell is filled in this way, it is very much worth it.

-Currently, the users can alter the fixed cells in the grid. This doesn't throw off the solution or the check button, but it's still clearly not idea.


-The readout should read "wait" while the solving algorithm is still running. I tried this, but for some reason it wouldn't work.

--A 6x6 option, 12x12 option, etc. Every part of the code is easy to convert to different sizes except for the boxes... which is very difficult.

-Retreive preset grids from some online database (instead of from a pre-stored array.)

-Play some sort of animation upon starting and/or winning, ie, the background of the board briefly flashes random colors.

-Make CSS responsive.

-Clean up the code for the "can fit" function and the box variables. 

User Stories:
-I should be able to put in any starting numbers I want, even if they're unsolvable.
-I should be able to put in numbers and then change my mind before starting, and still have it work.
-I should be able to click "hint" and have my mistakes revealed.
-I shouldn't have to click "start" to start the game when I'm using on the presets - that's too confusing. It should just start automatically.
-Buttons should only appear on the screen when I can use them.
-The reset button should, really, truly reset everything; the second game I play should work just as smoothly as the first one.
