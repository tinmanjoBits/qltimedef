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
    let maxReward = max(rewards);
    let minReward = min(rewards);

    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(this.graphLeft, this.graphTop, this.graphWidth, this.graphHeight);

    // plot the rewards
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

  drawQLGraphOld() {
    // background(255);
    noFill();
    stroke(0);
    rect(this.graphLeft, this.graphTop, this.graphWidth, this.graphHeight);

    // Add new reward to the rewards array
    //rewards.push(random(0, 1));

    // Keep the rewards array to a maximum length
    if (rewards.length > this.maxLength) {
      rewards.shift();
    }

    // Calculate the average reward
    this.sum += rewards[rewards.length - 1];
    avgRewards.push(this.sum / rewards.length);

    // Keep the average rewards array to a maximum length
    if (avgRewards.length > this.maxLength) {
      avgRewards.shift();
    }

    // Plot the average rewards
    stroke(255, 0, 0);
    beginShape();
    for (let i = 0; i < avgRewards.length; i++) {
      let x = map(
        i,
        0,
        this.maxLength,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y = map(
        avgRewards[i],
        0,
        1,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      vertex(x, y);
    }
    endShape();

    fill(0);
    stroke(0);

    let k = this.calculateAvgReward();
    text(`Average Reward: ${k.toFixed(2)}`, GAMEFRAME_WIDTH * 2, 20);
    //text(`Average Error: ${avgError.toFixed(2)}`, GAMEFRAME_WIDTH, 40);
  }

  calculateAvgReward() {
    let sum = 0;

    for (let i = 0; i < rewards.length; i++) {
      sum += rewards[i];
    }

    return sum / rewards.length;
  }
}
