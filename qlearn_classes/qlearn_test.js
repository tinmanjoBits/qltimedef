/* eslint-disable no-undef, no-unused-vars */

class QLearningTest {
  constructor() {
    this.qlearn = new QLearnTurnBased(env, ALPHA, GAMMA, EPSILON);
    this.xorStates = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
    ];
    this.xorActions = [0, 1];
    this.xorRewards = [0, 1, 1, 0];
  }

  runTests() {
    this.testXOR();
  }

  testXOR() {
    for (let i = 0; i < 1000000; i++) {
      let state = this.xorStates[floor(random(0, 4))];

      let action = this.qlearn.chooseAction(state);
      let reward = this.xorRewards[floor(random(0, 4))];

      this.qlearn.updateQValues(state, action, reward, state);
      //  console.log("interation:" + i);
    }

    // Test the learned values on the XOR problem
    // this.check(this.qlearn.qTable[0][0][0], 0);
    // this.check(this.qlearn.qTable[0][0][1], 0);
    // this.check(this.qlearn.qTable[0][1][0], 1);
    // this.check(this.qlearn.qTable[0][1][1], 0);
    // this.check(this.qlearn.qTable[1][0][0], 1);
    // this.check(this.qlearn.qTable[1][0][1], 0);
    // this.check(this.qlearn.qTable[1][1][0], 0);
    // this.check(this.qlearn.qTable[1][1][1], 0);

    console.table(this.qlearn.qValues);
  }

  check(condition, errorMessage) {
    if (!condition) {
      console.error(errorMessage);
    }
  }
}

class TestGame {
  constructor() {}

  getActions() {
    return [0, 1];
  }
}

class QLTEST {
  constructor(
    numStates,
    numActions,
    learningRate,
    discountFactor,
    randomActionChance
  ) {
    this.qTable = [];
    for (let i = 0; i < numStates; i++) {
      this.qTable[i] = [];
      for (let j = 0; j < numActions; j++) {
        this.qTable[i][j] = 0;
      }
    }
    this.numStates = numStates;
    this.numActions = numActions;
    this.learningRate = learningRate;
    this.discountFactor = discountFactor;
    this.randomActionChance = randomActionChance;
  }

  getQValue(state, action) {
    let key = `${state}-${action}`;
    if (!(key in this.qValues)) {
      this.qValues[key] = 0;
    }
    return this.qValues[key];
  }
  getBestAction(state) {
    let bestAction = 0;
    debugger;
    let bestValue = this.qTable[state][0];
    for (let i = 1; i < this.numActions; i++) {
      if (this.qTable[state][i] > bestValue) {
        bestValue = this.qTable[state][i];
        bestAction = i;
      }
    }

    return bestAction;
  }

  chooseAction(state) {
    let randomValue = Math.random();
    if (randomValue < this.randomActionChance) {
      return floor(random(this.numActions));
    }
    return this.getBestAction(state);
  }

  updateQ(state, action, reward, nextState) {
    let bestNextAction = this.getBestAction(nextState);
    let tdTarget =
      reward + this.discountFactor * this.qTable[nextState][bestNextAction];
    let tdError = tdTarget - this.qTable[state][action];
    this.qTable[state][action] += this.learningRate * tdError;
  }
}
