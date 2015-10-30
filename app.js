//Sudoku playrer/solver
// By: Daniel Goldman
console.log("sudoku time new")

//Some window-scope variables/functions
//assume it hasn't been solved yet, assume nothing is impossible.
var solved= false;
var impossible=false;

// Useful as all hell: takes in a 2D array and a call-back function, operates the function onto each element of the array. Wish I'd thought of this earlier.
var twoDLoop= function(twoDArray, fn){
  twoDArray.forEach(function(row){
    row.forEach(function(col){
      fn(col);
    })
    })
  };
//There will be three main object types: cell, board, and the game itself.

//Cell constructor:
var Cell = function(row, col) {

  this.number= "";
  this.row= row;
  this.column= col;
  this.box= 0;
  //starting numbers are fixed, ie, unchangable
  this.fixed = false;
  //Current number we're testing in this cell
  this.testNum = 1;
};
  //Methods that return arrays of all of the cells in the cell's row/col/box.
  Cell.prototype.getRow= function () {
    var thisRow=this.row;
    return Game.board[thisRow];
    };
  Cell.prototype.getCol= function () {
    var thisColNumber = this.column;
    var thisCol = [];
     Game.board.forEach(function(row){
      thisCol .push(row[thisColNumber]);
      }
    )
    return thisCol
  },
  //the boxes array gets made later, b/c it's complicated
  Cell.prototype.getBox=function () {
   return boxes[this.box]
    }

//move up the number we're testing
  Cell.prototype.updateTestNum= function (){
    this.testNum++;
    //...and when it passes 9, reset it to zero.
    if(this.testNum==10){
      this.testNum=1
      //when it does get reset, return false. This will matter later.
      return false};
      return true;
  }

//Needs to be defined in the window so it can be accessed anywhere.
var boxes;

//The board. It's an "array factory," not an object factory.
var boardMaker= function() {
  //make a 9x9 2D array
  var newBoard= new Array(9);
    for(var i=0; i< 9; i++){
      newBoard[i] = new Array(9)
    };
    var inputIndex=0;
    //iterates to each for and column. NTS: Can I rejigger this part to use twoDLoop? My head hurts.
   for(var row=0; row<9; row++){
     for( var col=0; col< 9; col++){
       // put new cells in each position with appropriate row/col keys..
       var newCell = new Cell(row, col);
       newBoard[row][col]= newCell;
      // $('input') is all 81 cells as nodes, in order. Give each one of them row and col attributes
       $('input').eq(inputIndex).attr("row", row)
        $('input').eq(inputIndex).attr("col", col)
       inputIndex++;

     }
   };

//function: returns a 3x3 box from inside a 2D array. Takes the upper left corner of the box as it's imput
 var getBox= function (row,col){
     var box = [];
    for (var j = 0; j < 3; j++) {
       for (var i = 0; i < 3; i++) {
       box.push( newBoard[row+j][col+i])
     };
   };
 return box
   }

// get the boxes and give each cell it's box key (NTS: DRY THIS UP)
  var boxZero= getBox(0,0); boxZero.forEach(function(cell) {cell.box=0} );
  var boxOne=getBox(0,3);  boxOne.forEach(function(cell) {cell.box=1} );
  var boxTwo=getBox(0,6);  boxTwo.forEach(function(cell) {cell.box=2} );
  var boxThree=getBox(3,0); boxThree.forEach(function(cell) {cell.box=3} );
  var boxFour=getBox(3,3); boxFour.forEach(function(cell) {cell.box=4} );
  var boxFive= getBox(3,6); boxFive.forEach(function(cell) {cell.box=5} );
  var boxSix=getBox(6,0); boxSix.forEach(function(cell) {cell.box=6} );
  var boxSeven=getBox(6,3); boxSeven.forEach(function(cell) {cell.box=7} );
  var boxEight= getBox(6,6); boxEight.forEach(function(cell) {cell.box=8} );

  boxes= [boxZero, boxOne, boxTwo, boxThree, boxFour, boxFive, boxSix, boxSeven, boxEight];

  //give box attribute to all inputs
  twoDLoop(newBoard, function(cell){
    var Row= cell.row; var Col= cell.column;
    //This gets to all the inputs. Easiest way, just trust me on this.
    var index = 9*Row + Col;
      $('input').eq(index).attr("box", cell.box)
    })
  return newBoard;
 };
//create the board, call it Board.
 var Board = boardMaker();


//The Game! (ie, the solver)
var Game= {
    board: Board,
    //a cell, the one we're "currently looking at"
    targetCell:"",
    //"look at" a different cell
    target: function(row, col){
      this.targetCell = this.board[row][col];
    },

      //NTS: DRY THIS UP
      // Can this number legally "fit" in this cell? Check its row, column, box for a conflict.
    canFit: function(tcell, num) {
      //the 'found' business if to cut it short once a conflict is found. This is to cut down on computation, since this function is gonna get used an awful lot.
      var found=false;
      //check row
      tcell.getRow().forEach(function(cell){
        if(cell.number==num){
          found= true};
        })
      if(found){return false};
      //..column
      tcell.getCol().forEach(function(cell){
        if(cell.number==num){
          found =true};
        });
      if(found){return false};
      //..box
      tcell.getBox().forEach(function(cell){
        if(cell.number==num){
          found= true};
      });
if(found){return false};
    return true;
    },

    //NTS Clean/DRY this
    //Take the starting values on the board and set them as 'fixed'
    getInputs: function(){
      var $allInputs= $('input');
      for(var i=0; i< 81; i++){
        // NTS convert to for Each
      //  the board at its row and column is equal to the value
      var cell= Game.board[$allInputs.eq(i).attr("row")] [$allInputs.eq(i).attr("col")];
        cell.number = $allInputs.eq(i).val();
        cell.number= +cell.number;
        //Fix everything that isn't empty. Fixed cells get special style
        if(cell.number !=""){
          cell.fixed=true;
          $allInputs.eq(i).css('font-weight', 'bolder');
          $allInputs.eq(i).css('text-shadow', '2px 2px blue')
          }
      } //preparing to start; target the first cell
      this.targetCell=this.board[0][0];
    },

    //main sequence: loop through testing numbers. As so soon as there's a cell for which no number can fit, backtrack a cell and bump it up one. Repeat.
    main: function(){
       startTime=(new Date()).getTime();
      console.log('wait');
      //the rest of this function will repeat until it's solved.
      while(!solved){
      //if the targetCell is fixed, skip it.
      while(  Game.targetCell.fixed  ){Game.nextTarget()};
      //can the testNum fit? if so, set it's value accordingly and target the next cell.
      if (this.canFit(this.targetCell, this.targetCell.testNum) ){
          this.targetCell.number = this.targetCell.testNum;
          this.nextTarget()
          //if not, test a new number
        }else{ this.nextPossiblity()}
    }
  },

    nextTarget: function(){
      //bump column, when you reach the end of a row, bump up the row
      var newRow=this.targetCell.row; var newCol= this.targetCell.column;
      newCol++;
      if(newCol>8){
          newCol=0;
          newRow++;
          //win condition!
          if(newRow>8){
            //If we try to go past the 8th row, it MUST mean the puzzle is solved
            solved=true;
             endTime=(new Date()).getTime();
             duration=(endTime-startTime)/1000
             console.log(duration)
            console.log("I have stored the solution where you can't see it...");
            //Workaround- in case the row 8 column 8 is fixed. without this, we get stuck in a loop. Hard to explain, just trust me, it's clever
            this.targetCell.fixed=false;
            return;
          }
      };
      this.target(newRow, newCol);
    },

    previousTarget: function(){
      //same as next target, but moving backwards.
        var newRow=this.targetCell.row; var newCol= this.targetCell.column;
        newCol--;
        if(newCol<0){
            newCol=8;
            newRow--;
            if(newRow<0){
              //if we try to go before the 1st row, it MUST mean the puzzle is impossible, ie, has no solution.
              solved=true;
              impossible=true;
              console.log("THIS THING IS IMPOSSIBLE")
              return;
            };
          };
          this.target(newRow, newCol);
          //skip over fixed targets when moving backwards
          while( this.targetCell.fixed ){this.previousTarget() };
    },

  //update the test number for the current target
    nextPossiblity: function(){
      //update test number. if it's too high... (went through 9)
      if (this.targetCell.updateTestNum()==false){
        //clear the cell, go back a step and run next possibilty
          this.targetCell.number="";
          this.previousTarget();
          this.nextPossiblity();
          }
      },
}// end of Game





//THE BUTTONS, and their related functions

//Takes in an array, returns a random element from it.
var randomFromArray= function(array) {
  return array[Math.floor(Math.random()*(array.length))]
  };

var Readouts={
  load: "Type in the starting grid of any Sudoku puzzle you can find and push start. You can also use one of the preset puzzles — simply click the difficulty level you think you can handle. Sometimes it takes me a moment or two to solve it, so just be patient, k?",
  impossible: 'This puzzle is unsolvable by man, woman, and machine alike.',
  wait: "wait...",
  solved: "Solved!",
  hardest: "According to the Telegraph, this is the hardest Sudoku puzzle ever created. Yes, of course I already solved it! What do you think I am, human??"
};

var start= function(time) {
   return "Solved it in "+ String(time)+" seconds. Give it a shot yourself, if you wanna. Click hint to check your work so far. Good luck, I guess..."
 };



var startButton = function() {

  Game.getInputs();
  Game.main();
  $('#start').css("display", "none");
  $('.preset').css("display", "none");
  $('#give_up').css("display", "block");
  $('#check').css("display", "block");
  $('#readout').text(start(duration));
  if(impossible) {
    impossible=false;
    $('#give_up').css("display", "none")
    $('#readout').css("background-color", "red")
    $('#readout').text(Readouts.impossible);
  }
}
$('#start').on( 'click', startButton
    );

//Show the correct solution
var giveUp =function () {
  var showAnswer= function(cell){
      var Row= cell.row; var Col= cell.column;
      var index = 9*Row + Col
      var value= cell.number;
          $('input').eq(index).val(value)
        }
        twoDLoop( Game.board, showAnswer);
          $('#give_up').css("display", "none");
          $('#check').css("display", "none");
          $('#start').css("display", "block");
          $('.preset').css("display", "block");
      };

$('#give_up').on( 'click',function() {
  giveUp();
  check();
  $('#readout').text(Readouts.solved);
  }
);


//checks users work, green if they're right, red if wrong
var check = function() {
  twoDLoop(Game.board, function(cell){
    var Row= cell.row; var Col= cell.column;
    var index = 9*Row + Col;
      //skip the cell if it's fixed or empty
      if(cell.fixed || $('input').eq(index).val()==0 ){} else{
        if( cell.number == $('input').eq(index).val() ) {
          $('input').eq(index).css('color', 'green')
        }else{
            $('input').eq(index).css('color', 'red')
        }
      }
  });
};
$('#check').on( 'click', function() {
  check() });
//reset everyhing for a new game
var reset= function(){
  $("#readout").css("background-color", "aqua")
  $('.button').css("display", "block");
  $('#give_up').css("display", "none");
  $('#check').css("display", "none");
  // resets the Baord
  Board=boardMaker();
  //dumps it in the Game (unnecessary?)
  Game.board=Board;
  solved= false;
  //resets all style stuff. NTS: Can this by be done with some "default" thing?
  $('input').val('');
  $('input').css('color', 'black');
  $('input').css('font-weight', 'normal');
  $('input').css('text-shadow', 'none')
};

$('#reset').on( 'click',function() {
    reset();
    $('#readout').text(Readouts.load)
  });

//THE PRESETS
//takes a preset-array as argument, puts it on the board
var takePreset= function (preset) {
  preset.forEach(function (pRow, rowIndex){
      pRow.forEach( function (pCol, colIndex){
        //the actual number
      var number= pCol;
      var inputsIndex = rowIndex*9+ colIndex;
        //don't want 0s on the board.
        if(number===0){number=""};
        $('input').eq(inputsIndex).val(number);
      })
    });
    Game.getInputs();
  };

  $('#easy').on( 'click',function() {
    reset();
    takePreset(randomFromArray(easys));
    startButton();
    });

$('#medium').on( 'click',function() {
  reset();
  takePreset(randomFromArray(mediums));
  startButton();
  });

  $('#hard').on( 'click',function() {
    reset();
      takePreset(randomFromArray(hards));
    startButton();
    });

$('#hardest').on( 'click',function() {
  reset();
  takePreset(hardest);
  startButton();
  $('#readout').text(Readouts.hardest)
});

$('#impossible').on( 'click',function() {
  reset();
  takePreset(impossible1);
  startButton();
  //$('#readout').text(Readouts.impossible_preset);
            });


//Presets:
var easy1=[
  [2, 0, 0, 8, 0, 4, 0, 0, 6],
  [0, 0, 6, 0, 0, 0, 5, 0, 0],
  [0, 7, 4, 0, 0, 0, 9, 2, 0],
  [3, 0, 0, 0, 4, 0, 0, 0, 7],
  [0, 0, 0, 3, 0, 5, 0, 0, 0],
  [4, 0, 0, 0, 6, 0, 0, 0, 9],
  [0, 1, 9, 0, 0, 0, 7, 4, 0],
  [0, 0, 8, 0, 0, 0, 2, 0, 0],
  [5, 0, 0, 6, 0, 8, 0, 0, 1]
];

var easy2=[
  [0, 3, 0, 9, 0, 0, 0, 2, 0],
  [8, 0, 0, 0, 0, 2, 0, 0, 7],
  [0, 0, 1, 4, 0, 0, 6, 0, 0],
  [0, 9, 0, 0, 4, 0, 5, 0, 2],
  [0, 0, 0, 6, 0, 3, 0, 0, 0],
  [7, 0, 6, 0, 1, 0, 0, 8, 0],
  [0, 0, 9, 0, 0, 4, 1, 0, 0],
  [2, 0, 0, 8, 0, 0, 0, 0, 3],
  [0, 7, 0, 0, 0, 9, 0, 5, 0]
];

var easy3=[
  [0, 0, 0, 0, 9, 0, 4, 0, 3],
  [0, 0, 3, 0, 1, 0, 0, 9, 6],
  [2, 0, 0, 6, 4, 0, 0, 0, 7],
  [4, 0, 0, 5, 0, 0, 0, 6, 0],
  [0, 0, 1, 0, 0, 0, 8, 0, 0],
  [0, 6, 0, 0, 0, 1, 0, 0, 2],
  [1, 0, 0, 0, 7, 4, 0, 0, 5],
  [8, 2, 0, 0, 6, 0, 7, 0, 0],
  [7, 0, 4, 0, 5, 0, 0, 0, 0]
];

var easy4=[
  [4, 0, 6, 0, 0, 0, 2, 0, 9],
  [5, 7, 0, 2, 0, 6, 0, 0, 0],
  [0, 0, 1, 0, 0, 5, 0, 0, 8],
  [6, 0, 3, 4, 8, 1, 7, 0, 0],
  [7, 0, 0, 5, 0, 0, 3, 0, 0],
  [0, 0, 5, 0, 0, 0, 0, 0, 0],
  [0, 8, 9, 0, 0, 0, 4, 3, 0],
  [0, 6, 0, 0, 0, 0, 0, 0, 1],
  [3, 0, 4, 0, 0, 0, 0, 6, 7]
];

var easy5=[
  [7, 0, 0, 0, 9, 0, 0, 8, 0],
  [0, 0, 0, 8, 0, 4, 0, 0, 9],
  [4, 9, 0, 7, 0, 6, 0, 0, 0],
  [0, 5, 0, 0, 0, 0, 3, 0, 2],
  [0, 0, 9, 0, 2, 1, 0, 0, 5],
  [8, 0, 2, 0, 7, 0, 0, 0, 0],
  [2, 0, 0, 5, 0, 9, 0, 0, 1],
  [0, 0, 0, 6, 0, 0, 2, 0, 8],
  [9, 0, 0, 1, 0, 2, 0, 3, 7]
];

var easys=[easy1, easy2, easy3, easy4, easy5];

var medium1 =[
[0, 0, 0, 3, 7, 0, 0, 9, 0],
[0, 0, 0, 0, 5, 0, 6, 0, 0],
[9, 0, 0, 8, 0, 1, 4, 0, 3],
[0, 7, 0, 0, 0, 5, 1, 3, 0],
[0, 4, 0, 0, 0, 0, 0, 5, 0],
[0, 1, 5, 9, 0, 0, 0, 2, 0],
[7, 0, 8, 5, 0, 6, 0, 0, 1],
[0, 0, 4, 0, 8, 0, 0, 0, 0],
[0, 9, 0, 0, 1, 4, 0, 0, 0]
];
var medium2 = [
[0, 0, 0, 0, 1, 7, 3, 5, 0],
[0, 0, 3, 0, 5, 0, 0, 6, 7],
[0, 7, 0, 3, 0, 0, 4, 0, 9],
[0, 1, 0, 7, 0, 3, 0, 0, 0],
[0, 0, 9, 0, 0, 0, 7, 0, 0],
[0, 0, 0, 6, 0, 8, 0, 9, 0],
[5, 0, 1, 0, 0, 2, 0, 7, 0],
[2, 9, 0, 0, 7, 0, 6, 0, 0],
[0, 4, 6, 1, 3, 0, 0, 0, 0]
];

var medium3= [
[0, 0, 3, 0, 1, 0, 4, 0, 0],
[6, 0, 0, 2, 0, 3, 0, 0, 1],
[0, 0, 0, 8, 0, 9, 0, 0, 0],
[0, 5, 4, 0, 0, 0, 9, 2, 0],
[0, 0, 0, 6, 8, 5, 0, 0, 0],
[0, 1, 6, 0, 0, 0, 3, 8, 0],
[0, 0, 0, 7, 0, 1, 0, 0, 0],
[4, 0, 0, 9, 0, 8, 0, 0, 7],
[0, 0, 1, 0, 2, 0, 8, 0, 0],
];

var medium4=[
[3, 0, 7, 2, 0, 0, 0, 0, 6],
[0, 8, 5, 0, 6, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 4, 5],
[0, 0, 0, 0, 0, 1, 8, 0, 0],
[9, 0, 0, 0, 0, 0, 0, 0, 7],
[0, 0, 3, 4, 0, 0, 0, 0, 0],
[8, 4, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 9, 0, 2, 7, 0],
[5, 0, 0, 0, 0, 3, 6, 0, 8]
];

var medium5= [
[0, 4, 5, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 3, 0, 0, 0, 8],
[0, 0, 0, 0, 2, 0, 0, 7, 3],
[0, 2, 9, 7, 0, 0, 0, 0, 4],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[8, 0, 0, 0, 0, 1, 3, 6, 0],
[1, 8, 0, 0, 6, 0, 0, 0, 0],
[7, 0, 0, 0, 5, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 4, 6, 9, 0]
];

var mediums= [medium1, medium2, medium3, medium4, medium5];

var hard1= [
[0, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 7, 0, 0, 0, 9, 4],
[4, 0, 0, 1, 0, 0, 2, 0, 0],
[0, 2, 0, 8, 0, 0, 3, 5, 0],
[5, 9, 0, 0, 0, 0, 0, 2, 6],
[0, 6, 8, 0, 0, 5, 0, 7, 0],
[0, 0, 9, 0, 0, 6, 0, 0, 2],
[8, 1, 0, 0, 0, 3, 0, 0, 0],
[0, 0, 5, 0, 0, 0, 0, 0, 0]
];

var hard2=[
[0, 0, 0, 2, 0, 6, 0, 0, 3],
[0, 6, 0, 0, 8, 0, 0, 0, 0],
[0, 7, 1, 0, 0, 3, 0, 0, 0],
[0, 0, 6, 0, 0, 0, 9, 1, 0],
[0, 0, 7, 8, 0, 9, 6, 0, 0],
[0, 2, 4, 0, 0, 0, 8, 0, 0],
[0, 0, 0, 1, 0, 0, 5, 4, 0],
[0, 0, 0, 0, 3, 0, 0, 8, 0],
[2, 0, 0, 6, 0, 8, 0, 0, 0]
];

var hard3=[
[0, 0, 0, 1, 9, 0, 0, 0, 4],
[0, 0, 1, 0, 0, 0, 0, 0, 0],
[0, 3, 7, 8, 0, 0, 0, 0, 0],
[2, 0, 3, 0, 8, 0, 5, 0, 7],
[7, 0, 0, 4, 0, 0, 3, 0, 0],
[0, 0, 0, 0, 0, 0, 9, 0, 8],
[0, 0, 0, 7, 1, 3, 0, 2, 9],
[0, 0, 0, 0, 0, 0, 6, 0, 0],
[4, 0, 0, 6, 0, 9, 8, 0, 0]
];

var hard4= [
  [0, 0, 0, 0, 0, 0, 6, 8, 0],
  [0, 0, 0, 0, 7, 3, 0, 0, 9],
  [3, 0, 9, 0, 0, 0, 0, 4, 5],
  [4, 9, 0, 0, 0, 0, 0, 0, 0],
  [8, 0, 3, 0, 5, 0, 9, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 3, 6],
  [9, 6, 0, 0, 0, 0, 3, 0, 8],
  [7, 0, 0, 6, 8, 0, 0, 0, 0],
  [0, 2, 8, 0, 0, 0, 0, 0, 0]
];
var hard5=[
  [0, 0, 0, 0, 8, 0, 1, 0, 0],
  [0, 0, 9, 0, 0, 3, 0, 0, 0],
  [0, 3, 5, 9, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 4, 0],
  [6, 8, 0, 7, 0, 0, 0, 3, 0],
  [0, 5, 7, 0, 3, 4, 0, 0, 2],
  [0, 2, 6, 0, 0, 0, 7, 0, 4],
  [0, 0, 0, 8, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]
var hards= [hard1, hard2, hard3, hard4, hard5];

//world's hardeset sudoku
var hardest = [
[8, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 3, 6, 0, 0, 0, 0, 0],
[0, 7, 0, 0, 9, 0, 2, 0, 0],
[0, 5, 0, 0, 0, 7, 0, 0, 0],
[0, 0, 0, 0, 4, 5, 7, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 3, 0],
[0, 0, 1, 0, 0, 0, 0, 6, 8],
[0, 0, 8, 5, 0, 0, 0, 1, 0],
[0, 9, 0, 0, 0, 0, 4, 0, 0]
];

var impossible1 = [
 [0, 9, 0, 0, 0, 8, 3, 0, 0],
 [0, 0, 0, 0, 2, 0, 4, 8, 6],
 [7, 0, 2, 0, 0, 0, 0, 0, 0],
 [0, 8, 0, 5, 0, 0, 0, 0, 4],
 [0, 0, 9, 0, 0, 0, 8, 0, 0],
 [5, 0, 0, 0, 0, 4, 0, 3, 0],
 [0, 0, 0, 0, 0, 0, 9, 0, 0],
 [2, 1, 7, 0, 9, 0, 0, 0, 8],
 [0, 0, 5, 7, 0, 0, 0, 6, 0]
];


//takes prints array of rows of whats currently on teh board. This is for me, not the user.
/*
var getPreset= function ()
  {twoDLoop(Game.board, function(cell) {
  var Row= cell.row; var Col= cell.column;
      //this is a workaround. It's hard to explain why it's necessary. Just trust me, it's clever
var index = 9*Row + Col;
if($('input').eq(index).val()===""){+$('input').eq(index).val(0) };
Game.board[Row][Col] =     +$('input').eq(index).val();
} )
Game.board.forEach( function(row) {
  console.log(row)
}
)
}
*/

/* this one's really hard */
var reallyHard=
//takes 50.205 secs
[
[0, 0, 0, 0, 3, 7, 6, 0, 0],
[0, 0, 0, 6, 0, 0, 0, 9, 0],
[0, 0, 8, 0, 0, 0, 0, 0, 4],
[0, 9, 0, 0, 0, 0, 0, 0, 1],
[6, 0, 0, 0, 0, 0, 0, 0, 9],
[3, 0, 0, 0, 0, 0, 0, 4, 0],
[7, 0, 0, 0, 0, 0, 8, 0, 0],
[0, 1, 0, 0, 0, 9, 0, 0, 0],
[0, 0, 2, 5, 4, 0, 0, 0, 0]
];



//this is, tentativcely, for the "trim" function
/*testnum redundancy
cell keys:
this.possibleNumbers= [1,2,3,4,5,6,7,8,9];
this.possibilitiesIndex= 0;

old updateTestNum:
Cell.prototype.updateTestNum= function (){
  this.possibilitiesIndex++;
  this.testNum = this.possibleNumbers[this.possibilitiesIndex];
  //...and when it passes 9, reset it to zero.
  if(this.testNum==undefined){
    this.possibilitiesIndex=0;
    this.testNum= this.possibleNumbers[0];
    //when it does get reset, return false. This will matter later.
    return false};
    return true;
}

*/
