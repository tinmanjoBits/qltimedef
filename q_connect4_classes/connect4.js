/* eslint-disable no-undef, no-unused-vars */

class Connect4 {
  constructor(gameWidth, gameHeight) {
    //this.board = Array(6).fill(Array(7).fill(0));
    this.board = {};
    for (let i = 0; i < 6; i++) {
      this.board[i] = [];
      for (let j = 0; j < 7; j++) {
        this.board[i][j] = 0;
      }
    }

    this.validMoves = [];
    this.turn = 1; // set Agent to go first,  0 is the random bot
    this.currentAgentReward = 0;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.winner = -1000;

    this.gamesAIWon = 0;
    this.gamesRandomWon = 0;
    this.gameDraws = 0;

    this.opponentsRewards = 0;

    this.rewardType = {
      win: 0,
      lose: -1,
      draw: -0.5
    };
  }

  resetBoard() {
    this.board = {};
    for (let i = 0; i < 6; i++) {
      this.board[i] = [];
      for (let j = 0; j < 7; j++) {
        this.board[i][j] = 0;
      }
    }
    this.validMoves = [];
    this.turn = 1;
    this.winner = -1000;
    this.reward = 0;
  }

  makeMove(col) {
    for (let i = 5; i >= 0; i--) {
      // debugger;
      if (this.board[i][col] === 0) {
        this.board[i][col] = this.turn;
        this.turn = -this.turn;

        break;
      }
    }

    logMessage("Player: Random,  column move:" + col);
  }

  getCurrentState() {
    return this.flatten2DArray(this.board);
  }

  flatten2DArray(array) {
    let result = [];
    let rows = 6;
    let cols = 7;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[i * cols + j] = array[i][j];
      }
    }
    return result;
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

  getResult(player) {
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
            return 1;
          } else if (
            i <= 2 &&
            this.board[i + 1][j] === player &&
            this.board[i + 2][j] === player &&
            this.board[i + 3][j] === player
          ) {
            return 1;
          } else if (
            j <= 3 &&
            i <= 2 &&
            this.board[i + 1][j + 1] === player &&
            this.board[i + 2][j + 2] === player &&
            this.board[i + 3][j + 3] === player
          ) {
            return 1;
          } else if (
            j >= 3 &&
            i <= 2 &&
            this.board[i + 1][j - 1] === player &&
            this.board[i + 2][j - 2] === player &&
            this.board[i + 3][j - 3] === player
          ) {
            return 1;
          }
        }
      }
    }

    // Check for a draw
    if (this.getValidMoves().length === 0) {
      //  this.reward =0;
      return 0.5;
    }

    return 0;
  }

  renderWorld() {
    // Render the board
    background(255);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (game.board[i][j] === 1) {
          fill(0, 255, 0);
        } else if (game.board[i][j] === -1) {
          fill(0, 0, 224);
        } else {
          fill(255);
        }
        rect(
          j * floor(this.gameWidth / 7),
          i * floor(this.gameHeight / 6),
          floor(this.gameWidth / 7),
          floor(this.gameHeight / 6)
        );
        if (game.board[i][j] === 1) {
          fill(0);
          textSize(18);
          if (qlearn && qlearn.randomAction) {
            text(
              "R",
              j * floor(this.gameWidth / 7) + 12,
              i * floor(this.gameHeight / 6) + 24
            );
          } else {
            text(
              "Q",
              j * floor(this.gameWidth / 7) + 12,
              i * floor(this.gameHeight / 6) + 24
            );
          }
        }
      }
    }
  }

  actRandomly() {
    const validMoves = this.getValidMoves();
    return validMoves[floor(random() * validMoves.length)];
  }

  takeAction(action) {
    for (let i = 5; i >= 0; i--) {
      // debugger;
      if (this.board[i][action] === 0) {
        this.board[i][action] = this.turn;
        this.turn = -this.turn;

        break;
      }
    }

    logMessage("Player: AI Agent, column move:" + action);
  }

  playerMouseControls() {
    // debugger;
    if (this.winner !== 1 || this.winner !== 0.5) {
      // if random player turn
      if (this.turn === 1) {
        const move = this.actRandomly();
        this.makeMove(move);
        this.winner = this.getResult(this.turn);
      } else if (this.turn === -1) {
        // ai agent plays
        env.trainOneStep();
        this.winner = this.getResult(this.turn);
      }
    } else {
      // this.reward = this.winner;
    }
  }

  getActions() {
    return this.getValidMoves();
  }

  updateWorld() {
    //debugger;
    this.winner = this.getResult(this.turn);
    if (this.winner === 0.5) {
      fill(0);
      //text("Draw:", width / 2, height / 2);
      logMessage("It is a draw, no one won!");

      // agent gets a slight reward for not loosing
      this.currentAgentReward = 0.5;

      // random or old agent gets a slight reward for not losing
      this.opponentsRewards += 0.5;

      this.gameDraws++;
    } else if (this.winner === 1) {
      fill(0);
      let player;
      if (game.turn === 1) {
        player = "Agent";

        this.currentAgentReward = 1;
        this.gamesAIWon++;

        // random or old agent reward negative for losing
        this.opponentsRewards -= 1;
      } else {
        player = "Random";
        this.currentAgentReward = -1;

        this.gamesRandomWon++;
        // random or old agent reward postive for winning
        this.opponentsRewards += 1;
      }
      // debugger;
      logMessage("Player:" + player + " has won!");
    }

    if (this.winner === 1 || this.winner === 0.5) {
      this.winner = 0;
      game.resetBoard();
    }
  }

  getReward() {
    let reward = this.currentAgentReward;
    // reset the reward
    this.currentAgentReward = 0;
    return reward;
  }
}
