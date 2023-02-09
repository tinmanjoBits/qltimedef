/* eslint-disable no-undef, no-unused-vars */

class GameEnvironment {
  constructor(game, qlearn, maxGames = 1000) {
    this.game = game;
    this.qlearn = qlearn;

    this.trainingComplete = false;
    this.agent = new AIAgent();
    this.maxGames = maxGames;
  }

  getCurrentState() {
    let currentState = game.getCurrentState();
    return currentState;
  }

  getCurrentAction() {}

  getValidActions() {
    let validActions = this.game.getValidMoves();
    return validActions;
  }

  chooseAction(currentState, currentPlayer) {
    // Get valid actions based on state
    let validActions = this.getValidActions();
    let action;
    // If Player 1,  choose action from Q-table or Epsilon
    if (currentPlayer === PLAYER1) {
      action = this.qlearn.chooseAction(currentState, validActions);
      return action;
      // If Player 2,  choose random action or a bot
    } else if (currentPlayer === PLAYER2) {
      action = this.randomActions(validActions);
      return action;
    }
  }

  takeAction(action, currentPlayer) {
    this.game.takeAction(action, currentPlayer);
  }

  randomActions(actionSpace) {
    const validMoves = actionSpace;
    return validMoves[floor(random() * validMoves.length)];
  }

  checkTerminalStatus(currentPlayer) {
    let terminal = this.game.getGameResult(currentPlayer);
    if (terminal === WIN || terminal === DRAW || terminal === LOSE) {
      return true;
    } else {
      return false;
    }
  }

  calculateReward(currentPlayer) {
    let reward = this.checkTerminalStatus(currentPlayer);

    let value = 0; // if 0 then its a normal move play

    switch (reward) {
      case WIN:
        value = WIN;
        break;
      case LOSE:
        value = LOSE;
        break;
      case DRAWN:
        value = DRAWN;
        break;
      default:
        value = 0;
    }

    return value;
  }

  updateQTable(currentState, currentAction, reward) {
    let nextState = this.getCurrentState();
    this.qlearn.updateQValues(currentState, currentAction, reward, nextState);
  }

  renderGame() {
    game.renderGame();
  }

  resetGame() {
    game.resetGame();
  }

  checkTrainingComplete() {
    this.agent.totalGamesPlayed++;

    if (this.agent.totalGamesPlayed >= this.maxGames) {
      return true;
    } else {
      return false;
    }
  }

  simulationStep() {
    debugger;
    if (!this.finishedTraining) {
      // get current state of the game board
      let currentState = this.getCurrentState();

      // check if the game is over
      let gameOver = this.checkTerminalStatus(this.agent.currentPlayer);
      if (gameOver) {
        // calculate Agent rewards for both sides p1 and p2, based on the outcome of the game
        let reward = this.calculateReward(this.game);

        // update Rewards arrays, this can be used to graph performance
        this.agent.updateRewards(reward, this.agent.currentPlayer);

        // update Q-table with the reward for the current state and action
        this.updateQTable(currentState, currentAction, reward);

        // render the final state of the game
        // if (!updating) {
        this.renderGame();
        //  }

        // reset the game
        this.resetGame();

        // switch players
        this.agent.currentPlayer =
          this.agent.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

        // continue to next iteration of the loop
        return;
      }

      // choose an action for the current player based on the current state
      this.agent.currentAction = this.chooseAction(
        currentState,
        this.agent.currentPlayer
      );

      // take the action choseby the player and update the game board
      // not needed for connect4
      //updateGame();

      // render the updated game board
      this.renderGame();

      // switch players
      this.agent.currentPlayer =
        this.agent.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

      // continue training until the desired number of games have been played
      this.trainingComplete = checkTrainingComplete();
    }
  }
}

class AIAgent {
  constructor() {
    this.currentPlayer = PLAYER1;
    this.totalRewardSum = 0;
    this.rewardsP1Array = [];
    this.rewardsP2Array = [];
    this.totalRewardsArray = [];
    this.currentP1Reward = 0;
    this.currentP2Reward = 0;
    this.currentAction = -1;
    this.totalGamesPlayed = 1; //first game
  }

  updateRewards(reward, currentPlayer) {
    if (currentPlayer === PLAYER1) {
      if (reward === WIN) {
        this.currentP1Reward = WIN;
        this.currentP2Reward = LOSE;
        this.rewardsP1Array.push(WIN);
        this.rewardsP2Array.push(LOSE);
      }
    } else if (currentPlayer === PLAYER2) {
      if (reward === WIN) {
        this.currentP1Reward = LOSE;
        this.currentP2Reward = WIN;
        this.rewardsP1Array.push(LOSE);
        this.rewardsP2Array.push(WIN);
      }
    } else if (reward === DRAWN) {
      this.currentP1Reward = DRAWN;
      this.currentP2Reward = DRAWN;
      this.rewardsP1Array.push(DRAWN);
      this.rewardsP2Array.push(DRAWN);
    }

    this.totalRewardsArray.push(reward);
  }
}
