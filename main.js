const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const player = '*';

class Field {
  constructor(array) {
    this.field = array;
    this.height = array.length;         //finds last row index of array
    this.width = array[this.height - 1].length;  //finds last column index of array
  }

  intro() {
    console.log(`welcome to find my hat. You are "${player}" and your hat is "${hat}". Move by pressing a,w,d,s,q,e,z,x then enter for left, up, right and down, etc. Avoid the holes "${hole}" and stay on the map.`)
  }

  start() {     //starts the game and resets for replays
    this.winner = false;
    this.dead = false;
    this.intro();
    let question = prompt('You have started a new game. Do you want to create a map? y for yes, n for no: |');

    if (question.toLowerCase() === 'y') {
      this.width = prompt('How wide do you want the map?');
      this.height = prompt('How tall do you want the map?');
      this.field = Field.generateField(this.height, this.width);;
    }
    let randomH = Field.randomNum(this.height);
    let randomW = Field.randomNum(this.width);
    this.myPosition = [randomH, randomW];
    this.field[randomH][randomW] = player;
    this.hatPosition = [this.height - 1, this.width - 1];
    this.field[this.height - 1][this.width - 1] = hat
    this.play();
  }

  die() {
    let a = this.myPosition[0];
    let b = this.myPosition[1];
    let isDead = () => {
      this.dead = true;
      let died = prompt('You fell in a hole or fell off the map! Press y then enter to play again or another key to exit:')
      died.toLowerCase() === 'y' && this.start()
    }
    if (a < 0 || a >= this.field.length || this.field[a][b] === undefined){
      isDead();
    } else if (this.field[a][b] === 'O'){
      isDead();
    }
  }

  win() {    //checks for a win and asks for a replay
    let a = JSON.stringify(this.myPosition);
    let b = JSON.stringify(this.hatPosition);
    if (a === b) {
      this.winner = true;
      let congratulations = prompt('Congratulations, you won! Press y then enter to play again or another key to exit:')

      congratulations.toLowerCase() === 'y' ? this.start() : false;
    }
  }

  play() {
    if (!this.winner && !this.dead) {
      this.print();
      let x = this.myPosition[0];
      let y = this.myPosition[1];
      let move = prompt("Which direction, use qweasdzxc keys?")

      switch (move.toLowerCase()) {
        case 'w': this.up(x, y);
          break;
        case 'a': this.left(x, y);
          break;
        case 's': this.down(x, y);
          break;
        case 'd': this.right(x, y);
          break;
        case 'q': this.topLeft(x, y);
          break;
        case 'e': this.topRight(x, y);
          break;
        case 'z': this.bottomLeft(x, y);
          break;
        case 'x': this.bottomRight(x, y);
          break;
        default: this.play();
          break;
      }
      this.win();
      this.play();
    }
  }

  print() {
    this.field.forEach( row => console.log(row.join('')))
  }

  up(i, j) {
    this.myPosition[0] -=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  down(i, j) {
    this.myPosition[0] +=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j] = player;
    this.field[i][j] = fieldCharacter;
    }
  }

  left(i, j) {
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i][j-1] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  right(i, j) {
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i][j+1] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  topLeft(i, j) {
    this.myPosition[0] -=1;
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j-1] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  topRight(i, j) {
    this.myPosition[0] -=1;
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j+1] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  bottomLeft(i, j) {
    this.myPosition[0] +=1;
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j-1] = player
    this.field[i][j] = fieldCharacter;
    }
  }

  bottomRight(i, j) {
    this.myPosition[0] +=1;
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j+1] = player
    this.field[i][j] = fieldCharacter;
    }
  }
  //finds index of last field
  static tunnel (fieldArray, row, height, width) {
    let index;
    if (row > 0 && row <= height){
      index = fieldArray[row-1].findIndex(el => el === fieldCharacter)
      if (index === -1) index = Field.randomNum(width-1)
      return index;
    } else if (row === 0) {
      index = fieldArray[row+1].findIndex(el => el === fieldCharacter)
      if (index === -1) index = Field.randomNum(width-1)
      return index;
    } else {
      return 0;
    }
  }

  static randomNum (num) {
    return Math.floor(Math.random()*num)
  }

  //returns hole or fieldCharacter
  static randomChar (difficulty) {
    let sampleRow = new Array(7); //creates 7 empty elements
    sampleRow.fill(fieldCharacter) //sets all elements

    if (difficulty === '1') {
      sampleRow.fill(hole, 5, 6);
    } else if (difficulty === '2'){
      sampleRow.fill(hole, 4, 6);
    } else if (difficulty === '3') {
      sampleRow.fill(hole, 3, 6);
    } else {
      console.log('impossible');
      return hole;
    }

    let num = Field.randomNum(7);
    return sampleRow[num];
  }

  //generates random field
  static generateField (height, width) {
    let difficulty = prompt('choose difficulty of 1 to 3:');
    let newArr = [];                    
    let transposedArr = [];                   //stores a transposed array to check for vertical wall of 'O's
    
    for (let i = 0; i < height; i++) {  //iterates down
      newArr.push([])                   //adds rows

      for (let j = 0; j < width; j++) { //itereates across elements
        newArr[i][j] = Field.randomChar(difficulty);  //generates hole or field char
      }
    }
    //check for walls horizontally
    for (let i = 0; i < height; i++){
      if (!newArr[i].includes(fieldCharacter)) {   //checks across for solid wall
        newArr[i][Field.randomNum(width-1)] = fieldCharacter; //sets a random element to field char
        newArr[i][Field.tunnel(newArr, i, height, width)] = fieldCharacter; //makes a tunnel
      }
    }
    //creates transposed array
    for (let i = 0; i < width; i++){          //iterates width of field which is down in transposedArr
      transposedArr.push([]);                       //adds rows

      for (let j = 0; j < height; j++){       //iterates height of newArr which is across transposedArr
        transposedArr[i][j] = newArr[j][i]          //stores transposed field
      }
    }
    //checks for walls vertically
    for (let i = 0; i < width; i++) {
      if(!transposedArr[i].includes(fieldCharacter)){ //check for vertical(field) wall
        newArr[Field.randomNum(height-1)][i] = fieldCharacter;            //puts random gap in wall of O's
        newArr[Field.tunnel(transposedArr, i, width, height)][i] = fieldCharacter;   //calls tunnel to place field char next to another field char
      }
    }
    return newArr;
  }

} //end class


let randomField = Field.generateField(3, 3);
const myGame = new Field(randomField);
myGame.start();