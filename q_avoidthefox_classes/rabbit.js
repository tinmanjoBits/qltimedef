/* eslint-disable no-undef, no-unused-vars */

class Rabbit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  reset(cols, rows) {
    this.x = floor(random(cols));
    this.y = floor(random(rows));
  }

  update() {
    this.x = constrain(this.x, 0, cols - 1);
    this.y = constrain(this.y, 0, rows - 1);
  }

  move(dir) {
    switch (dir) {
      case 0:
        this.x--;
        break;
      case 1:
        this.y--;
        break;
      case 2:
        this.x++;
        break;
      case 3:
        this.y++;
        break;
      case 4:
        this.x--;
        this.y--;
        break;
      case 5:
        this.x++;
        this.y--;
        break;
      case 6:
        this.x--;
        this.y++;
        break;
      case 7:
        this.x++;
        this.y++;
        break;
    }
    this.x = constrain(this.x, 0, cols - 1);
    this.y = constrain(this.y, 0, rows - 1);

    this.reward = 0.5;
  }

  show() {
    fill(0, 255, 0);
    rect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
  }
}
