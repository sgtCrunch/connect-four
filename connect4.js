/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
*/

class Player {
  constructor(name, color){
    this.name = name;
    this.color = color;
  }
}

class Game {

  constructor(WIDTH=6, HEIGHT=7){
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.player1 = new Player("Player 1", "red");
    this.player2 = new Player("Player 2", "blue");
    this.currPlayer =  this.player1;
    this.board = [];// array of rows, each row is array of cells  (board[y][x])
    this.finished = false;
    this.addStartButton("Start Game");
  }

  addStartButton(text){
    const gameDiv = document.getElementById("game");
    const start = document.createElement("button");
    const clickEvent = this.startGame.bind(this);
    start.addEventListener("click", clickEvent);
    start.innerText = text;
    start.classList.add("start-bttn");
    gameDiv.append(start);
  }

  startGame(e){
    
    if(!this.finished) {
      const colors = Array.from(document.querySelectorAll("#color-picks input"));
      this.player1.color = colors[0].value;
      this.player2.color = colors[1].value;
      if(this.player1.color === this.player2.color) return;
      colors[0].parentElement.remove();
    }

    e.target.remove();
    this.finished = false;
    this.board = [];
    this.currPlayer = this.player1;
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /* 
  * makeBoard: create in-JS board structure:
  * board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }


  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = "";
    
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    const clickFunc = this.handleClick.bind(this);
    top.addEventListener('click', clickFunc);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute("style", "background-color:" + this.currPlayer.color);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    this.finished = true;
    this.addStartButton("Restart Game");
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {

    if(this.finished) return;

    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer.color === this.player1.color ? this.player2 : this.player1;
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {

    function _win(cells, game) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      const {WIDTH, HEIGHT, board, currPlayer} = game;
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz, this) || _win(vert, this) || _win(diagDR, this) || _win(diagDL, this)) {
          return true;
        }
      }
    }
  }

}



new Game(6,7);

