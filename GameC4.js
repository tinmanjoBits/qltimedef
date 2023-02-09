/* eslint-disable no-undef, no-unused-vars */

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
        // check for wining moves
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

    return PLAYING;
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
      if (this.board[i][action] === 0) {
        this.board[i][action] = value;

        break;
      }
    }
  }

  // Return actions that we can take
  getActionSpace() {
    return [0, 1, 2, 3, 4, 5, 6];
  }
}

class GameEnv {
  constructor(game, qlearn) {
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
      currentP1Reward: 0,
      currentP2Reward: 0
    };

    this.gameStatsWindowLeft = GAMEFRAME_WIDTH;
    this.gameStatsWindowTop = 0;
    this.currentPlayer = 1;

    this.qlearn = qlearn;

    this.finishedTraining = false;
  }

  getActions(state) {
    return this.game.getValidMoves();
  }

  controlMouse() {
    let localStatus = this.step(PLAYER1);

    localStatus.currentPlayer = PLAYER2;

    this.step(PLAYER2);
  }

  updatePlayerScores(player, gameState) {
    if (player === PLAYER1) {
      if (gameState === WIN) {
        this.globalGameStats.gamesP1Won++;
      } else if (gameState === LOSE && player === PLAYER1) {
        this.globalGameStats.gamesP1Lost++;
      }
    } else if (player === PLAYER2) {
      if (gameState === WIN) {
        this.globalGameStats.gamesP2Won++;
      } else if (gameState === LOSE && player === PLAYER2) {
        this.globalGameStats.gamesP2Lost++;
      }
    }
  }

  updatePlayerRewards(player, gameState) {
    let aiReward = 0;
    this.localGameStats.currentPlayer = player;
    this.localGameStats.status = gameState;

    // set reward for wining
    if (gameState === WIN && player === PLAYER1) {
      this.localGameStats.currentP1Reward += 1;
      this.localGameStats.currentP2Reward -= 1;
      aiReward = 1;
    } else if (gameState === WIN && player === PLAYER2) {
      this.localGameStats.currentP2Reward += 1;
      this.localGameStats.currentP1Reward -= 1;
      aiReward = -1;
    }

    if (gameState === DRAWN) {
      this.localGameStats.currentP1Reward += 0.5;
      this.localGameStats.currentP2Reward += 0.5;
      aiReward = 0.5;
    }

    return aiReward;
  }

  update() {
    // let stat = this.step(turn);
    // // rotate players
    // if (turn === PLAYER1) {
    //   turn = PLAYER2;
    // } else if (turn === PLAYER2) {
    //   turn = PLAYER1;
    // }
    // //  debugger;
    // if (stat.status === WIN || stat.status === DRAWN) {
    //   return stat.status;
    // }
  }

  oldstep(player) {
    this.currentPlayer = player;
    // Perform random action, this also gets valid moves
    let gameStatus = 0;

    if (player === PLAYER2) {
      let move = this.game.actRandomly();
      this.game.takeAction(move, player);
      // Get the status of the game based on last move

      gameStatus = this.game.getGameStatus(player);
      this.updatePlayerScores(player, gameStatus);
      this.updatePlayerRewards(player, gameStatus);
    } else if (player === PLAYER1) {
      // Get the status of the game based on last move
      gameStatus = this.game.getGameStatus(player);
      this.updatePlayerScores(player, gameStatus);
      this.updatePlayerRewards(player, gameStatus);
      this.doAiStep();
    }

    // gameStatus = this.game.getGameStatus(player);
    //this.updatePlayerScores(player, gameStatus);

    // WIN=1, DRAW=0.5
    let envState = {
      turn: player,
      status: gameStatus,
      boardStates: this.game.board,
      rewardP1Gained: this.localGameStats.currentP1Reward,
      rewardP2Gained: this.localGameStats.currentP2Reward
    };

    // update graph
    if (player === PLAYER1) {
      rewards.push(this.localGameStats.currentP1Reward);
    } else {
      opponentRewards.push(this.localGameStats.currentP2Reward);
    }
    return envState;
  }

  doAiStep() {
    // Get the current state
    let currentState = this.game.getCurrentState();

    // Get a valid action
    let validActions = this.game.getValidMoves();

    // Choose an action from array of valid actions
    let action = this.qlearn.chooseAction(currentState, validActions);

    this.game.takeAction(action, PLAYER1);
    let nextState = this.game.getCurrentState();

    // Get the ai reward for this action
    let gameStatus = this.game.getGameStatus(PLAYER1);
    let rewardThisTurn = this.updatePlayerRewards(PLAYER1, gameStatus);

    // Update the q-table
    qlearn.updateQValues(currentState, action, rewardThisTurn, nextState);

    // reduce the explaration of the agent over time when it gains rewards (epislon)
    qlearn.reduceEpsilon(this.localGameStats.currentP1Reward);
  }

  doStep() {}

  renderGameStatsWindow() {
    let left = this.gameStatsWindowLeft;
    let top = this.gameStatsWindowTop;
    let w = GAMEFRAME_WIDTH;
    let h = GAMEFRAME_HEIGHT;
    fill(255);
    stroke(0);
    rect(left, top, w, h);

    fill(0);
    textSize(12);
    let sp = 14;
    text("Games Played:", left + 10, top + sp);
    text(
      "Player 1 Wins:" + this.globalGameStats.gamesP1Won,
      left + 10,
      top + sp * 2
    );
    text(
      "Player 2 Wins:" + this.globalGameStats.gamesP2Won,
      left + 10,
      top + sp * 3
    );
    text(
      "Player 1 Losses:" + this.globalGameStats.gamesP1Lost,
      left + 10,
      top + sp * 4
    );
    text(
      "Player 2 Losses:" + this.globalGameStats.gamesP2Lost,
      left + 10,
      top + sp * 5
    );
    text("Games drawn:", left + 10, top + sp * 6);
    text(
      "Current Player:" + this.localGameStats.currentPlayer,
      left + 10,
      top + sp * 8
    );
    text(
      "Player 1 Rewards:" + this.localGameStats.currentP1Reward,
      left + 10,
      top + sp * 10
    );
    text(
      "Player 2 Rewards:" + this.localGameStats.currentP2Reward,
      left + 10,
      top + sp * 11
    );

    text(
      "Last game result:" + this.localGameStats.status,
      left + 10,
      top + sp * 12
    );

    text(
      "Episilon variance:" +
        qlearn.epsilon.toFixed(4) +
        " Scale:" +
        qlearn.epsilonScale,
      left + 10,
      top + sp * 16
    );
  }
}
