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
    this.oldAgent = null;
    this.agentsVersion = 0;
    this.incReward = REWARD_SCALE;
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
    return this.game.getActions();
  }

  reset() {
    this.game.reset();
  }

  getRandomAction() {
    let actions = this.getActions();

    // if the rewards is 50 plus on the agent, use the current Qtable to get it to self-play
    if (
      this.totalRewards > this.incReward - 1 &&
      this.totalRewards % REWARD_SCALE === 0
    ) {
      this.oldAgent = new QLearnTurnBased(env, ALPHA, GAMMA, EPSILON);

      this.oldAgent.qValues = Array.from(qlearn.qValues);

      let currentState = this.getCurrentState();

      this.agentsVersion++;
      let action = this.oldAgent.chooseAction(currentState);

      // increase reward check
      this.incReward += REWARD_SCALE;
      return action;
    } else {
      let randomIndex = Math.floor(Math.random() * actions.length);
      return actions[randomIndex];
    }
  }

  trainSteps() {
    /// Drawing code......

    if (this.currentEpisode <= MAX_EPISODES) {
      // Training process

      // check to see if game ended
      this.endOfGame = game.gameOver;

      if (!this.endOfGame) {
        if (this.game.turn === 0) {
          this.game.fox.move(); // Fox moves randomly
          thisgame.turn = 1;
        } else if (this.game.turn === 1) {
          let currentState = this.getCurrentState();
          let action = qlearn.chooseAction(currentState);
          this.game.takeAction(action); // Move the rabbit according to the action chosen by the Q-Learning agent
          let nextState = this.getCurrentState();
          let rewardThisTurn = this.game.getReward();
          this.totalRewards += rewardThisTurn;

          qlearn.updateQValues(currentState, action, rewardThisTurn, nextState);

          rewards.push(this.totalRewards);
          errors.push(1);
          this.game.turn = 0; // foxes turn
        }
      } else {
        this.currentEpisode++;
        // reset for next game
        this.game.reset();

        this.endOfGame = false; // game.getTerminalStatus();
        this.game.turn = 0;
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
    this.game.takeAction(action);
    let nextState = this.getCurrentState();
    let rewardThisTurn = this.game.getReward();

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

    opponentRewards.push(game.opponentsRewards);
    errors.push(1);
  }
}
