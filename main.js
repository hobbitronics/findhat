const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(array) {
    this.field = array;
    this.myPosition = [];
    this.height = array.length - 1;         //finds last row index of array
    this.width = array[this.height].length - 1;  //finds last column index of array
    this.hatPosition = [this.height, this.width]; //sets hat position
    this.winner = false;
    this.dead = false;
  }

  intro () {
    console.log('welcome to find my hat. You are * and your hat is ^. Move by pressing a,w,d,s,q,e,z,x then enter for left, up, right and down, etc. Avoid the holes "O" and stay on the map.')
  }

  start() {     //starts the game and resets for replays
    this.winner = false;
    this.dead = false;
    this.myPosition = [0, 0]
    this.intro();
    let question = prompt('You have started a new game. Do you want to creat a map? y for yes, n for no: |');
    if(question.toLowerCase() === 'y'){
    let width = prompt('How wide do you want the map?');
    let height = prompt('How tall do you want the map?');
    let randomH = Math.floor(Math.random()*height)
    let randomW = Math.floor(Math.random()*width)
    let newMap = Field.generateField(height, width);
    this.field = newMap;
    this.myPosition = [randomH, randomW];
    this.field[randomH][randomW] = '*';
    this.hatPosition = [height-1, width-1];
    
    } else if (question.toLowerCase() !== 'y') {
      this.field = Field.generateField(this.height+1, this.width+1);
      this.field[0][0] = '*';
      this.hatPosition = [this.height, this.width];
    }
    //console.log(this.myPosition)
    this.play();
  }

  die(){
    let a = this.myPosition[0];
    let b = this.myPosition[1];
    let isDead = () => {
      this.dead = true;
      let died = prompt('You fell in a hole or fell off the map! Press y then enter to play again or another key for no')
      if(died.toLowerCase() === 'y'){this.start();}
    }
    if (a < 0 || a >= this.field.length || this.field[a][b] === undefined){
      isDead();
    } else if (this.field[a][b] === 'O'){
      isDead();
    }
  }

  win(){    //checks for a win and asks for a replay
    let a = JSON.stringify(this.myPosition);
    let b = JSON.stringify(this.hatPosition);
    if (a === b){
      this.winner = true;
      let congratulations = prompt('Congratulations, you won! Press y then enter to play again or another key for no')
      if(congratulations.toLowerCase() === 'y'){
        this.start();
      }
    }
  }

  play(){
    if(!this.winner && !this.dead){
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
    //console.log('hat: ' + this.hatPosition)  //for testing purposes
    //console.log('me' + this.myPosition)
    this.win();
    this.play();
    }
  }

  print() {
    this.field.forEach(function (el) {console.log(el.join(''))})
  }

  up(i, j){
    this.myPosition[0] -=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  down(i, j){
    this.myPosition[0] +=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j] = '*';
    this.field[i][j] = fieldCharacter;
    }
  }

  left(i, j){
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i][j-1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  right(i, j){
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i][j+1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  topLeft(i, j) {
    this.myPosition[0] -=1;
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j-1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  topRight(i, j) {
    this.myPosition[0] -=1;
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i-1][j+1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  bottomLeft(i, j) {
    this.myPosition[0] +=1;
    this.myPosition[1] -=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j-1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  bottomRight(i, j) {
    this.myPosition[0] +=1;
    this.myPosition[1] +=1;
    this.die();
    if (!this.dead){
    this.field[i+1][j+1] = '*'
    this.field[i][j] = fieldCharacter;
    }
  }

  static random(){ //returns random field character
      let sample = [fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, hole, hole];
      let num = Math.floor(Math.random()*7);
      return sample[num];
  }

  static generateField(height, width){
    let newArr = [];
    for (let i = 0; i < height; i++) {
      newArr.push([])
    for (let j = 0; j < width; j++) {
        newArr[i][j] = Field.random(); 
        }
    }
    newArr[height-1][width-1] = '^';
    return newArr;
  }

} //end class


let randomField = Field.generateField(3, 3);
const myField = new Field(randomField);
myField.start();
//console.log(myField.field.join(''))