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
    let currentState = this.game.getCurrentState();
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
    // // If Player 1,  choose action from Q-table or Epsilon
    // if (currentPlayer === PLAYER1) {
    //   action = this.qlearn.chooseAction(currentState, validActions);
    //   return action;
    //   // If Player 2,  choose random action or a bot
    // } else if (currentPlayer === PLAYER2) {
    //   action = this.randomActions(validActions);
    //   return action;
    // }

    action = this.qlearn.chooseAction(currentState, validActions);
    return action;
  }

  takeAction(action, currentPlayer) {
    this.game.takeAction(action, currentPlayer);
  }

  randomActions(actionSpace) {
    const validMoves = actionSpace;
    return validMoves[floor(random() * validMoves.length)];
  }

  checkTerminalStatus(currentPlayer) {
    let terminal1 = this.game.getGameStatus(PLAYER1);
    let terminal2 = this.game.getGameStatus(PLAYER2);

    // Check for either player wins or drawn and return true to end game,  else return false if no outcome such as T1&T2=0
    if (
      terminal1 === WIN ||
      terminal2 === WIN ||
      terminal1 === DRAWN ||
      terminal2 === DRAWN
    ) {
      return true;
    } else if (terminal1 === 0 || terminal2 === 0) {
      return false;
    }
  }

  calculateReward(lastPlayer) {
    let reward = this.game.getGameStatus(lastPlayer);

    let value = 0; // if 0 then its a normal move play

    // handle player1 rewards
    switch (reward) {
      case WIN:
        value = WIN;
        logMessage("Game over, Player " + lastPlayer + " WON !");
        break;
      case LOSE:
        value = LOSE;
        break;
      case DRAWN:
        value = DRAWN;
        debugger;
        logMessage("Game over, it was a draw !");
        break;
      default:
        value = 0;
    }

    return value;
  }

  updateQTable(currentState, currentAction, reward) {
    let nextState = this.getCurrentState();
    let actionSpace = this.game.getActionSpace();
    this.qlearn.updateQValues(
      currentState,
      currentAction,
      reward,
      nextState,
      actionSpace
    );
  }

  updateGame(action, currentPlayer) {
    // Update the game board when a move is played
    this.game.takeAction(action, currentPlayer);
    logMessage("Player " + currentPlayer + ", plays move: " + action);
  }

  renderGame() {
    this.game.renderGame();
  }

  resetGame() {
    this.game.resetGame();
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
    if (!this.trainingComplete) {
      // get current state of the game board
      let currentState = this.getCurrentState();

      // check if the game is over
      let gameOver = this.checkTerminalStatus(this.agent.lastPlayer);
      if (gameOver) {
        // calculate Agent rewards for both sides p1 and p2, based on the outcome of the game

        let reward = this.calculateReward(this.agent.lastPlayer);

        // update Rewards arrays, this can be used to graph performance
        this.agent.updateRewards(reward, this.agent.lastPlayer);

        // update Q-table with the reward for the current (last state) state and action
        this.updateQTable(currentState, this.agent.currentAction, reward);

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
      //
      this.updateGame(this.agent.currentAction, this.agent.currentPlayer);

      // render the updated game board
      this.renderGame();

      // record the last player so that a reward can be given at terminal status
      this.agent.lastPlayer = this.agent.currentPlayer;

      // Switch players;
      this.agent.currentPlayer =
        this.agent.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;

      // continue training until the desired number of games have been played
      this.trainingComplete = this.checkTrainingComplete();
    }
  }
}

class AIAgent {
  constructor() {
    this.currentPlayer = PLAYER1;
    this.lastPlayer = "";
    this.totalRewardP1Sum = 0;
    this.totalRewardP2Sum = 0;
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
        this.totalRewardP1Sum += WIN;
        this.currentP2Reward = LOSE;
        this.totalRewardP2Sum += LOSE;
        this.rewardsP1Array.push(WIN);
        this.rewardsP2Array.push(LOSE);
      }
    } else if (currentPlayer === PLAYER2) {
      if (reward === WIN) {
        this.currentP1Reward = LOSE;
        this.totalRewardP1Sum += LOSE;
        this.currentP2Reward = WIN;
        this.totalRewardP2Sum += WIN;
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
