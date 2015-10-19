//There will be three main object types: cell, board, and the game itself.
console.log("why")

//cell constructor: cells obects have:
number: 1-9

row: 1-9
column: 1-9
box: 1-9
fixed: boolean (if its solved, never change it)
possible values: array, starts 1-9, of the possible values it could be
possiblities index: how far along we are in those
possible values size? mayebe?

methods:(prototype)

get row,
get column, and
get box - methods that return arrays of their whole row, columns, boxes.



//maybe board should just be an array?
var Board=
{ board: [], // 9x9 array

  //make empty 9x9 array with cell objects, give them their location values. This sets up when the window loads. (not finished
  setUpBoard: function(){
    var setUp = new Array(9);
      for(var i=0; i<setUp.length; i++){
        setUp[i] = new Array(9)
      }
      Board.board = setUp;
  }

}

GAME:
Game solver will have at least 3 phases, maybe four (the optional middle phase is to save time.... might turn out to tbe necessary).
Game{
board: the board
target: a 2D index of a spot in the array, starts at [0][0]

  methods:

  can fit: determines whether a number can fit in a certain place. does this by call the cells row colulm and box; for each of them, it checks the number of each of cells. USE BREAK WHEN IT FINDS ONE, BE EFFICIENT

  trim: trim function
  for each fixed cell, go through its row, column, and box and get rid of that value in the possiblities. Then set the possiblitys size

  nextpossiblity: bump possibility index up one, then main. If its bigger than its size(returns false),  previous  target, bump its possiblity up one. Then main?
   If target at [0,0] (special name?) runs out of possiblities, this shits impossible

  next target: bump the coliumn up one. if its >8, make it zero and bump the row up one, (then main?). If row >8, its solved!

  main: main's gonna be in a while loop

  can the first possibility of the targeted object fit? If so, set its value accordingly and next target, if not, next possibilty
  check for fixed here

}


blah blah...

Phase 1: Input
  This starts on load. Player puts in the starting numners, those are set as "fixed"  player clicks a "ready" button when ready
Phase 2: Trimming
  Takes the fixed values into account by eliminating them from the possibleValues array for every other number

Phase 3: (optional): The Easy Ones
  More on this later.
Phase 4: The main sequence
  Tests a number, starting in the upper right, moving accross, then down. It skips the fixed numbers. It starts at one, or whatever is first in its "possibleValues" array. As soon as it finds a number that is "possible", it puts it in and moves on to the next number. Whenever a cell has no possible values, it backtracks one space and bumps that cell up by one. Thats it! Now we have a solved Sudoku in the background.
  Option: if the first cell has no possible values, left its an impossible sukoku.
  -Probably just make a "check" function.
  or a check(cell) function,

  Phase 5: Gameplay: A player can try to solve it; it he gets a square correct, it turns green, if not it turns red (this is done by simply comparing the solved grid with the user input).
  If the user gives up, it shows the solution.
