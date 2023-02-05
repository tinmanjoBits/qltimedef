/* eslint-disable no-undef, no-unused-vars */

let fox, rabbit; // objects to represent the fox and the rabbit
class AvoidTheFoxGame {
  constructor(rows, cols, fox, rabbit, turn = 0) {
    this.rabbitScore = 0;
    this.fox = fox;
    this.rabbit = rabbit;
    this.turn = turn;
    this.PlayerControlMove = false;
    this.gameOver = false;
  }

  setupObject() {}

  reset() {
    this.rabbitScore = 0;
    this.fox.reset(rows, cols);
    this.rabbit.reset(rows, cols);
    this.turn = 0;
    this.PlayerControlMove = false;
    this.gameOver = false;
  }

  renderWorld() {
    background(255);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        stroke(0);
        fill(200);
        rect(i * gridSize, j * gridSize, gridSize, gridSize);
      }
    }

    this.fox.show();
    this.rabbit.show();
  }

  getTerminalStatus() {
    // if the rabbit is on the foxes square end game
    if (this.fox.x === this.rabbit.x && this.fox.y === this.rabbit.y) {
      return true;
    } else {
      return false;
    }
  }

  updateWorld() {
    if (this.turn === 0) {
      this.fox.update();
      if (this.getTerminalStatus()) {
        debugger;
        this.gameOver = true;
      }
      // this.turn = 1;
    } else if (this.turn === 1) {
      if (this.playerControlMove) {
        this.rabbit.update();
        this.turn = 0;
        this.playerControlMove = false;
      }
    }
  }

  // get the games state

  getCurrentState() {
    return (
      this.rabbit.x + "," + this.rabbit.y + "," + this.fox.x + "," + this.fox.y
    );
  }

  getActions() {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  }

  // the agent moves the rabbit
  takeAction(action) {
    this.rabbit.move(action);
  }

  getReward() {
    // Check if the rabbit is dead
    if (this.fox.x === this.rabbit.x && this.fox.y === this.rabbit.y) {
      return -1;
    } else {
      // Otherwise return a small positive reward
      return 0.01;
    }
  }

  playerKeyControls() {
    if (keyCode === 87) {
      // 'w' key
      rabbit.move(1);
      game.playerControlMove = true;
    }
    if (keyCode === 83) {
      // 's' key
      rabbit.move(3);
      game.playerControlMove = true;
    }
    if (keyCode === 65) {
      // 'a' key
      rabbit.move(0);
      game.playerControlMove = true;
    }
    if (keyCode === 68) {
      // 'd' key
      rabbit.move(2);

      game.playerControlMove = true;
    }
    if (keyCode === 81) {
      // 'q' key
      rabbit.move(4);
      game.playerControlMove = true;
    }
    if (keyCode === 69) {
      // 'e' key
      rabbit.move(5);
      game.playerControlMove = true;
    }
    if (keyCode === 90) {
      // 'z' key
      rabbit.move(6);
      game.playerControlMove = true;
    }
    if (keyCode === 67) {
      // 'c' key
      rabbit.move(7);
      game.playerControlMove = true;
    }

    // P resets the game

    if (keyCode == 80) {
      game.reset();
    }
  }
}
