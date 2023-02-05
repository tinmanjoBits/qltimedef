/* eslint-disable no-undef, no-unused-vars */

class Environment {
  constructor(game) {
    this.game = game;
    this.terminalState = false;
    this.maxSteps = 1000;
    this.steps = 0;
    this.currentEpisode = 0;
    this.endOfGame = false;
    this.totalRewards = 0;
  }

  getTerminalStatus() {
    if (this.game.getTerminalStatus()) {
      this.terminal = true;
    }
  }

  getCurrentState() {
    return this.game.getCurrentState();
  }

  takeAction(action) {
    return this.game.takeAction(action);
  }

  getActions() {
    return game.getActions();
  }

  reset() {
    this.game.reset();
  }

  getRandomAction() {
    let actions = this.getActions();
    let randomIndex = Math.floor(Math.random() * actions.length);
    return actions[randomIndex];
  }

  trainSteps() {
    /// Drawing code......

    if (this.currentEpisode <= MAX_EPISODES) {
      // Training process

      // check to see if game ended
      this.endOfGame = game.gameOver;

      if (!this.endOfGame) {
        if (game.turn === 0) {
          game.fox.move(); // Fox moves randomly
          game.turn = 1;
        } else if (game.turn === 1) {
          let currentState = this.getCurrentState();
          let action = qlearn.chooseAction(currentState);
          game.takeAction(action); // Move the rabbit according to the action chosen by the Q-Learning agent
          let nextState = this.getCurrentState();
          let rewardThisTurn = game.getReward();
          this.totalRewards += rewardThisTurn;

          qlearn.updateQValues(currentState, action, rewardThisTurn, nextState);

          rewards.push(this.totalRewards);
          errors.push(1);
          game.turn = 0; // foxes turn
        }
      } else {
        this.currentEpisode++;
        // reset for next game
        game.reset();

        this.endOfGame = false; // game.getTerminalStatus();
        game.turn = 0;
      }
    } else {
      // End training
      // Save Q-table
      noStroke();
      fill(255, 0, 0);
      text("End of training", 10, 10);
    }

    text(
      "Episode:" + this.currentEpisode + " of " + MAX_EPISODES,
      width / 2,
      height / 2
    );
  }

  trainOneStep() {
    let currentState = this.getCurrentState();

    let action = qlearn.chooseAction(currentState);
    game.takeAction(action);
    let nextState = this.getCurrentState();
    let rewardThisTurn = game.getReward();

    // set rewards
    // if (this.game.winner === 1 && this.game.turn === -1) {
    //   // agent wins
    //   debugger;
    //   rewardThisTurn = 1;
    // } else if (this.game.winner === 0.5) {
    //   // draw
    //   rewardThisTurn = 0.5;
    // } else if (this.game.winner === 1 && this.game.turn === 1) {
    //   // agent lost
    //   rewardThisTurn = -1;
    // }
    // debugger;
    this.totalRewards += rewardThisTurn;
    logMessage(
      "reward this game:" +
        rewardThisTurn +
        " ,total rewards:" +
        this.totalRewards
    );
    qlearn.updateQValues(currentState, action, rewardThisTurn, nextState);

    rewards.push(this.totalRewards);
    errors.push(1);
  }
}
