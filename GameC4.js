/* eslint-disable no-undef, no-unused-vars */

const PLAYER1 = 1;
const PLAYER2 = 2;
const BLANK = 0;
const WIN = 1;
const LOSE = -1;
const DRAWN = 0;
const PLAYING = 2;

class GameC4 {
  constructor(turn) {
    this.board = {};
    this.initialiseBoard();
    this.validMoves = [];
    this.currentPlayer = turn;
    this.currentReward = 0;
  }

  getGameStatus(player) {
    // Check for a win
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (this.board[i][j] === player) {
          if (
            j <= 3 &&
            this.board[i][j + 1] === player &&
            this.board[i][j + 2] === player &&
            this.board[i][j + 3] === player
          ) {
            return WIN;
          } else if (
            i <= 2 &&
            this.board[i + 1][j] === player &&
            this.board[i + 2][j] === player &&
            this.board[i + 3][j] === player
          ) {
            return WIN;
          } else if (
            j <= 3 &&
            i <= 2 &&
            this.board[i + 1][j + 1] === player &&
            this.board[i + 2][j + 2] === player &&
            this.board[i + 3][j + 3] === player
          ) {
            return WIN;
          } else if (
            j >= 3 &&
            i <= 2 &&
            this.board[i + 1][j - 1] === player &&
            this.board[i + 2][j - 2] === player &&
            this.board[i + 3][j - 3] === player
          ) {
            return WIN;
          }
        }
      }
    }

    // Check for a draw
    if (this.getValidMoves().length === 0) {
      //  this.reward =0;
      return DRAWN;
    }

    return LOSE;
  }

  getValidMoves() {
    const moves = [];
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 6; row++) {
        if (this.board[row][col] === 0) {
          moves.push(col);
          break;
        }
      }
    }

    return moves;
  }

  getBoardValueStates() {
    return [BLANK, PLAYER1, PLAYER2];
  }

  getGameOutcomes() {
    return [LOSE, DRAWN, WIN, PLAYING];
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

  actRandomly() {
    const validMoves = this.getValidMoves();
    return validMoves[floor(random() * validMoves.length)];
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

  takeAction(action, value) {
    for (let i = 5; i >= 0; i--) {
      // debugger;
      if (this.board[i][action] === 0) {
        this.board[i][action] = this.turn;

        break;
      }
    }
  }
}

class GameEnv {
  constructor(game) {
    this.game = game;
    this.globalGameStats = {
      gamesP1Won: 0,
      gamesP1Lost: 0,
      gamesP2Won: 0,
      gamesP2Lost: 0,
      gamesDrawn: 0
    };

    this.localGameStats = {
      currentPlayer: turn,
      status: PLAYING,
      currentReward: 0
    };
  }

  controlMouse() {
    let localStatus = this.step(PLAYER1);

    localStatus.currentPlayer = PLAYER2;

    this.step(PLAYER2);
  }

  step(player) {
    // get current state
    let gameState = this.getGameStatus(player);

    let reward = 0;
    // get reward
    if (gameState === WIN) {
      reward = 1;
    }
    if (gameState === LOSE) {
      reward = -1;
    }
    if (gameState === DRAWN) {
      reward = 0;
    }

    let localGameStats = {
      states: this.board,
      currentPlayer: player,
      status: gameState,
      currentReward: 0
    };

    if (gameState === WIN || gameState === LOSE || gameState === DRAWN) {
      return localGameStats;
    }

    // Perform moves

    let validMove = this.getValidMoves();

    if (player === PLAYER1) {
      // AI Agent
      let move = game.actRandomly();
      game.takeAction(move, PLAYER2);
    } else if (player === PLAYER2) {
      // Random player or Agent
      let move = game.actRandomly();
      game.takeAction(move, PLAYER2);
    }

    return this.localGameStats;
  }
}
