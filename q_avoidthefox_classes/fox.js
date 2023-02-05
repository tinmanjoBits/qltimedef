/* eslint-disable no-undef, no-unused-vars */

class Fox {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {}

  move() {
    if (this.isCloseToRabbit()) {
      // code for chasing the rabbit
      let deltaX = rabbit.x - this.x;
      let deltaY = rabbit.y - this.y;

      this.x += floor(deltaX / Math.abs(deltaX));
      this.y += floor(deltaY / Math.abs(deltaY));

      this.x = constrain(this.x, 0, cols - 1);
      this.y = constrain(this.y, 0, rows - 1);
    } else {
      this.moveRandomly();
    }
  }
  isCloseToRabbit() {
    let xDistance = Math.abs(this.x - rabbit.x);
    let yDistance = Math.abs(this.y - rabbit.y);
    let distance = floor(
      Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
    );
    return distance < 8;
  }
  moveRandomly() {
    this.x += floor(random(-1, 2));
    this.y += floor(random(-1, 2));
    this.x = constrain(this.x, 0, cols - 1);
    this.y = constrain(this.y, 0, rows - 1);
  }

  reset(cols, rows) {
    this.x = floor(random(cols));
    this.y = floor(random(rows));
  }

  show() {
    fill(255, 0, 0);
    rect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}
