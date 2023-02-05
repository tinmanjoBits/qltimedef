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
    text(
      `Average Reward: ${(this.sum / rewards.length).toFixed(2)}`,
      GAMEFRAME_WIDTH,
      20
    );
    //text(`Average Error: ${avgError.toFixed(2)}`, GAMEFRAME_WIDTH, 40);
  }
}
