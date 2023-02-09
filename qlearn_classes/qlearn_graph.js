/* eslint-disable no-undef, no-unused-vars */

class QLearnGraph {
  constructor(left, top, w, h, maxLen, p1, p2) {
    this.graphLeft = left;
    this.graphTop = top;
    this.graphWidth = w;
    this.graphHeight = h;
    this.maxLength = maxLen;
    this.sum = 0;

    this.p1 = p1;
    this.p2 = p2;
  }

  drawQLGraph() {
    // Q learn agent
    let maxReward = max(this.p1);
    let minReward = min(this.p1);

    // random or old agent through self-play
    let maxOpReward = max(this.p2);
    let minOpReward = min(this.p2);

    // Draw graph window
    stroke(0);
    strokeWeight(2);
    fill(255);
    rect(this.graphLeft, this.graphTop, this.graphWidth, this.graphHeight);
    fill(0, 255, 0);
    // plot the rewards for agent
    for (let i = 0; i < this.p1.length - 1; i++) {
      let x1 = map(
        i,
        0,
        this.p1.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y1 = map(
        this.p1[i],
        minReward,
        maxReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      let x2 = map(
        i + 1,
        0,
        this.p1.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y2 = map(
        this.p1[i + 1],
        minReward,
        maxReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      line(x1, y1, x2, y2);
    }
    fill(0, 0, 255);
    // plot the rewards for the random or old agent
    for (let i = 0; i < this.p1.length - 1; i++) {
      let x1 = map(
        i,
        0,
        this.p2.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y1 = map(
        this.p2[i],
        minOpReward,
        maxOpReward,
        this.graphTop + this.graphHeight,
        this.graphTop
      );
      let x2 = map(
        i + 1,
        0,
        this.p2.length - 1,
        this.graphLeft,
        this.graphLeft + this.graphWidth
      );
      let y2 = map(
        this.p2[i + 1],
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
    // text(
    //   `Average Reward: ${(this.sum / rewards.length).toFixed(2)}`,
    //   GAMEFRAME_WIDTH * 2 + 30,
    //   20
    // );
  }

  clearOldData() {
    if (this.p1.length > this.maxLength) {
      this.p1.shift();
    }

    if (this.p2.length > this.maxLength) {
      this.p2.shift();
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
