/* eslint-disable no-undef, no-unused-vars */

class QLearnGraph {
  constructor() {
    this.graphLeft = GAMEFRAME_WIDTH + 10;
    this.graphTop = 0;
    this.graphWidth = GAMEFRAME_WIDTH;
    this.graphHeight = GAMEFRAME_HEIGHT;
    this.maxLength = 1000;
    this.sum = 0;
  }

  drawQLGraph() {
    // Q learn agent
    let maxReward = max(rewards);
    let minReward = min(rewards);

    // random or old agent through self-play
    let maxOpReward = max(opponentRewards);
    let minOpReward = min(opponentRewards);

    // Draw graph window
    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(this.graphLeft, this.graphTop, this.graphWidth, this.graphHeight);

    // plot the rewards for agent
    for (let i = 0; i < rewards.length - 1; i++) {
      let x1 = map(
        i,
        0,
        rewards.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y1 = map(
        rewards[i],
        minReward,
        maxReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      let x2 = map(
        i + 1,
        0,
        rewards.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y2 = map(
        rewards[i + 1],
        minReward,
        maxReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      line(x1, y1, x2, y2);
    }

    // plot the rewards for the random or old agent
    for (let i = 0; i < opponentRewards.length - 1; i++) {
      let x1 = map(
        i,
        0,
        opponentRewards.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y1 = map(
        opponentRewards[i],
        minOpReward,
        maxOpReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      let x2 = map(
        i + 1,
        0,
        opponentRewards.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y2 = map(
        opponentRewards[i + 1],
        minOpReward,
        maxOpReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );

      stroke(255, 0, 0);
      line(x1, y1, x2, y2);
    }

    // draw the x-axis
    stroke(0);
    strokeWeight(1);
    line(
      this.graphLeft,
      this.graphTop + this.graphHeight / 2,
      this.graphLeft + this.graphWidth,
      this.graphTop + this.graphHeight / 2
    );
    fill(0);
    stroke(0);
    text(
      `Average Reward: ${(this.sum / rewards.length).toFixed(2)}`,
      GAMEFRAME_WIDTH * 2 + 30,
      20
    );
  }

  clearOldData() {
    if (rewards.length > 2000) {
      rewards.shift();
    }

    if (opponentRewards.length > 2000) {
      opponentRewards.shift();
    }
  }

  calculateAvgReward() {
    let sum = 0;

    for (let i = 0; i < rewards.length; i++) {
      sum += rewards[i];
    }

    return sum / rewards.length;
  }
}
