/* eslint-disable no-undef, no-unused-vars */

const PLAYER1 = 1;
const PLAYER2 = 2;
const BLANK = 0;
const WIN = 1;
const LOSE = -1;
const DRAWN = 0;

class GameC {
  constructor() {
    this.board = {};
    this.initialiseBoard();
  }

  getBoardValueStates() {
    return [BLANK, PLAYER1, PLAYER2];
  }

  getGameOutcomes() {
    return [LOSE, DRAWN, WIN];
  }

  initialiseBoard() {
    for (let i = 0; i < 6; i++) {
      this.board[i] = [];
      for (let j = 0; j < 7; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  resetGame() {
    this.initialiseBoard();
  }

  renderGame() {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        let x = j * floor(GAMEFRAME_WIDTH / 7);
        let y = i * floor(GAMEFRAME_HEIGHT / 6);
        let w = floor(GAMEFRAME_WIDTH / 7);
        let h = floor(GAMEFRAME_HEIGHT / 6);

        switch (this.board[i][j]) {
          case BLANK:
            fill(255);
            break;
          case PLAYER1:
            fill(0, 255, 0);
            break;
          case PLAYER2:
            fill(0, 0, 255);
            break;
          default:
        }
        rect(x, y, w, h);
      }
    }
  }

  step() {}
}
