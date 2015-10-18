console.log('Hi.');
console.log("To start the game, type 'playHangman()' (without the quotation marks) and press enter. ")
console.log("If you want to see what the code looks like (when you're done), click 'Sources'.")

/*Hangman! To start the game, simply run the command playHangman() and follow the instructions.
Choose a different word bank by deleting the // in front of one of the other two options, or write in your own.
*/
// Random Words:
 var wordBank= ['jaundice', 'puzzle', 'country', 'celery', 'hospital', 'safety', 'bottle', 'apartment', 'program', 'america', 'orangutan', 'giraffe' ];

//The 25 Hardest Hangman Words, according to Wolfram Alpha:
 //var wordBank= ['jazz', 'buzz', 'jazzed', 'hajj', 'jazzy', 'jazzing', 'buzzed', 'fuzz', 'jinx', 'fizz', 'buzzing', 'fuzzy', 'jazzes', 'puff', 'jiff', 'faffed', 'razz', 'buff', 'quiz', 'faff', 'huff', 'zine', 'duff', 'faffs', 'zit']

//George Carlin's Seven Dirty Words You Can't Say on TV:
//var wordBank =  ['shit', 'piss', 'fuck', 'cunt', 'cocksucker', 'motherfucker', 'tits'];

//4 through 10 of the 10 Longest words in the English language, according to TopTenz.com (1 through 3 are just silly ):
//var wordBank= ['Honorificabilitudinitatibus', 'Antidisestablishmentarianism', 'Floccinaucinihilipilification', 'Pseudopseudohypoparathyroidism', 'Supercalifragilisticexpialidocious', 'Pneumonoultramicroscopicsilicovolcanoconiosis', 'Aequeosalinocalcalinoceraceoaluminosocupreovitriolic'];


/*Letter factory - Includes methods to reveal and hide letters (in hangman, letters are hidden until they are guessed.) Takes a string of a single letter as its arguement */
var Letter = function(letter){
  return {
      value: letter,

      hidden: true,   //Letters start hidden by default

      hide: function(){
        this.hidden = true;
      },

      show: function(){
        this.hidden = false;
      },

      //Show letter if it isn't hidden, return an underscore if it is
      render: function(){
      return  (this.hidden) ?  '_':  letter ;
      },

  }

};


//Create a Word object
var Word = function(){
  return {
    letters: [], // These are Letter objects

    // Create a new word for the start of a game
    getLetters: function(newWord){
          /*Take the ith character in the inputed string, convert it into a Letter object, then add it to the end of the letter array:*/
      for(var i=0; i< newWord.length; i++){
        this.letters.push ( Letter(newWord[i]) )
      }
    },

    //Test if the game is over, i.e, all letters are found
    isFound: function() {
        //check each letter, stops if one is hidden
      for(var i= 0; i<this.letters.length; i++){
          if(this.letters[i].hidden) {
            return false
          }
      }
      return true
    },

    //Test to see if a letter (string) is in a word, reveal all appearances of the letter if so
    try: function(letter) {
      var found = false; //Boolean, false b/c nothing is found yet

      //see if the letter inputed matches any of the letters in the word
      for(var i = 0; i<this.letters.length; i++){
        if(letter == this.letters[i].value){
          this.letters[i].hidden = false;   // if it does, unhide the letters...
          found = true;     // and decalre that a letter was found
        }
      }
      return found;
    },

    //returns the word in its guessed state
    render: function () {
      var guessedState = '';

      for (var i=0; i< this.letters.length; i++){

        guessedState += this.letters[i].render();   //adds the 'rendering' of each letter to a string
        if(i<this.letters.length-1){guessedState+= '  '}     //adds a space after each letter except the final one
      }
      return guessedState;
    }

  }
}
// The Game includes the methods for the gameplay itself
var Game = {

  guesses: 0, //remaining guesses

  guessedLetters:[],  //an array of strings

  words: [], //an array of strings

  currentWord: '', //a Word object

//Accepts an array of strings; these are the potential secret words:
  startGame: function(wordsArray){
    this.guesses = 10; //10 guesses in total

    this.currentWord = Word(); //Make currentWord a (currently empty) word

    this.guessedLetters =  []; // Reset guessed letters


    this.words = wordsArray;

   //random word from the words array
    var randomWord = this.words[ Math.floor(Math.random()*this.words.length) ]

    this.currentWord.getLetters(randomWord); //make current word that random word
  },

  guess: function(letter) { //takes string letter

      for(var i = 0; i < this.guessedLetters.length; i++ ){
        // see if letter was guessed already
        if( letter == this.guessedLetters[i]){
          var newLetter =  prompt('You already guessed that! Pick another letter:'); //if so, prompt a new letter and rerun the fucntion with it
          return this.guess(newLetter);
        }
      }
          //.. if not, try the letter, and count it as a guess if it's a miss...
      if (! this.currentWord.try(letter) ){
        this.guesses -= 1;
      }

      this.guessedLetters.push(letter); // and add it to the list of guesses
    },

  isOver: function(){ // return true if word is fully revealed or player is out of guesses
      return this.currentWord.isFound() || this.guesses==0;
    },


  overMessage: function(){
    //If the word is all found...
    if(this.currentWord.isFound() ){
      //...'you win'. If you're out of guesses...
      return 'you win!'} else if (Game.guesses==0) {

        //reveal all of the lettes, show the word...
        for (var i =0; i<this.currentWord.letters.length; i++){
          this.currentWord.letters[i].show()
        };
        console.log(this.currentWord.render());
        // and 'you lose'
      return 'you lose :/ '  } else{
      ''}
    },

  //Shows in the console the current state of the word, the remaining gueses, the the lettes gussed so far.
  render: function(){
    console.log(this.currentWord.render(),' guesses: ' + this.guesses,' guessed letters: '+ this.guessedLetters)
  }
}

//Running playHangman starts the actual game.
var playHangman = function(){

  Game.startGame(wordBank); //starts (resets parameters, etc)


  while (!Game.isOver()){ //as long as the game isn't over yet...
    var aGuess = prompt('guess a letter!'); //ask for a guess...
    Game.guess(aGuess); //test it...
    Game.render(); //.. and then show the current game status

  }
  //When the game ends, show game over message...
  console.log( Game.overMessage() );
  // and then ask to play again. If so, simply run play hangman
  var another = prompt( 'again? y/n');
  if(another == 'y'){playHangman()}else{
   alert('whatever...')}

  }
