/* eslint-disable no-undef, no-unused-vars */

class QLearnTurnBased {
  constructor(env, alpha, gamma, epsilon) {
    this.env = env;
    this.qValues = {};
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
  }

  chooseAction(state) {
    // Choose the action to take based on the current state
    // Implementation depends on the type of exploration-exploitation trade-off desired
    // e.g. Epsilon-greedy, Softmax, etc.
    if (Math.random() < this.epsilon) {
      // Explore: select a random action
      return this.env.getRandomAction();
    } else {
      // Exploit: select the action with the highest Q-value
      return this.getMaxQAction(state);
    }
  }

  chooseLastAgentAction(state) {
    // Exploit: select the action with the highest Q-value
    return this.getMaxQAction(state);
  }

  getMaxQAction(state) {
    let actions = this.env.getActions(state);
    let qValues = actions.map((action) => this.getQValue(state, action));
    let maxQValue = Math.max(...qValues);
    let maxQIndex = qValues.indexOf(maxQValue);
    return actions[maxQIndex];
  }

  getQValue(state, action) {
    let key = `${state}-${action}`;
    if (!(key in this.qValues)) {
      this.qValues[key] = 0;
    }
    return this.qValues[key];
  }

  updateQValues(state, action, reward, nextState) {
    // Update the Q-value for the state-action pair based on the reward received and the estimated future reward
    // Q(state, action) = Q(state, action) + alpha * (reward + gamma * max(Q(nextState)) - Q(state, action))
    let maxQNext = this.getMaxQValue(nextState);
    let key = `${state}-${action}`;
    this.qValues[key] =
      this.qValues[key] +
      this.alpha * (reward + this.gamma * maxQNext - this.qValues[key]);
  }

  getMaxQValue(nextState) {
    let actions = this.env.getActions(nextState);
    let qValues = actions.map((action) => this.getQValue(nextState, action));
    return Math.max(...qValues);
  }

  playTurn(state) {
    let action = this.chooseAction(state);
    let [nextState, reward, done] = this.env.takeAction(state, action);
    this.updateQValue(state, action, reward, nextState);
    return [nextState, reward, done];
  }
}

class QLearnContinuous {
  constructor(
    stateSize,
    actionSize,
    numActions,
    env,
    alpha = 0.1,
    gamma = 0.9
  ) {
    // stateSize: number of states in the game
    // actionSize: number of actions the agent can take in a state
    // alpha: learning rate
    // gamma: discount factor
    this.stateSize = stateSize;
    this.actionSize = actionSize;
    this.alpha = alpha;
    this.gamma = gamma;
    this.Q = new Array(stateSize)
      .fill()
      .map(() => new Array(actionSize).fill(0));
    this.numActions = numActions;
    this.environment = env;
  }

  chooseActionOld(state) {
    // Choose the action to take based on the current state
    // Implementation depends on the type of exploration-exploitation trade-off desired
    // e.g. Epsilon-greedy, Softmax, etc.

    let maxValue = -Infinity;
    let bestAction = 0;
    for (let action in this.Q[state]) {
      if (this.Q[state][action] > maxValue) {
        maxValue = this.Q[state][action];
        bestAction = action;
      }
    }
    return bestAction;
  }

  chooseAction(state) {
    // Epsilon-greedy exploration-exploitation trade-off
    let randomNum = Math.random();
    let action;

    if (randomNum < this.epsilon) {
      // Explore - choose a random action
      action = Math.floor(Math.random() * this.numActions);
    } else {
      // Exploit - choose the action with the highest Q-value
      let qValues = this.getQValues(state);
      action = qValues.indexOf(Math.max(...qValues));
    }

    return action;
  }

  getQValues(state) {
    // Returns the Q-values for a given state
    // This could be implemented as a simple look-up in a dictionary/hash-table
    // or as a prediction from a neural network
    // In this implementation we will assume it's a look-up in a hash-table
    return this.qValues[state];
  }

  updateQValue(state, action, reward, nextState) {
    // Update the Q-value for the state-action pair based on the reward received and the estimated future reward
    // Q(state, action) = Q(state, action) + alpha * (reward + gamma * max(Q(nextState)) - Q(state, action))
    let qValue = this.getQValue(state, action);
    let maxNextQValue = Math.max(...this.getQValues(nextState));
    qValue =
      qValue + this.alpha * (reward + this.gamma * maxNextQValue - qValue);
    this.qTable[state][action] = qValue;
  }

  trainCount(maxSteps, maxEpisodes) {
    // The main Q-Learning loop
    // maxSteps: maximum number of steps in a single episode
    // maxEpisodes: maximum number of episodes to train for
    let episode = 0;
    while (episode < maxEpisodes) {
      let totalReward = 0;
      let state = this.getInitialState();
      let done = false;

      for (let step = 0; step < maxSteps; step++) {
        let action = this.chooseAction(state);
        let [nextState, reward, done] = this.environment.takeAction(
          state,
          action
        );
        this.updateQValue(state, action, reward, nextState);
        totalReward += reward;
        state = nextState;

        if (done) break;
      }

      // Increment episode and reset step if necessary
      episode++;
    }
  }

  // Train the agent for a single episode (one iteration of the Q-Learning loop)
  trainOnce() {
    let totalReward = 0;
    let state = this.environment.getCurrentState();
    let done = false;

    while (!done) {
      let action = this.chooseAction(state);
      let [nextState, reward, done] = this.environment.takeAction(
        state,
        action
      );
      this.updateQValue(state, action, reward, nextState);
      totalReward += reward;
      state = nextState;
    }

    return totalReward;
  }

  takeAction(state, action) {
    let nextState = this.env.updateState(state, action);
    let reward = this.env.getReward(nextState);
    let done = this.env.checkEpisodeEnd(nextState);
    return [nextState, reward, done];
  }
}
