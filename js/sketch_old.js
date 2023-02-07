/* eslint-disable no-undef, no-unused-vars */

const GAMEFRAME_WIDTH = 256;
const GAMEFRAME_HEIGHT = 256;
let gridSize = 20; // size of each grid cell
let rows, cols; // number of rows and columns in the grid

let game;
let env;
let qlearn;
let rewards = [];
let avgRewards = [];
let errors = [];
let messages = [];
let consoleHeight = GAMEFRAME_HEIGHT;
let isPAUSED = false;
let qGraph;
let frameCountSlider;
let opponentRewards = [];
let qplotter;

let gc4;
let env4;

let test;
let turn;
let KEY_PRESSED = false;
let gameOver = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  // rows = height / gridSize;
  // cols = width / gridSize;
  gc4 = new GameC4();
  env4 = new GameEnv(gc4);

  turn = PLAYER1;
  // // setupAvoidTheFox();
  // game = setConnect4();

  // p = createP("hello");
  // frameCountSlider = createSlider(1, 1000, 1);
  // frameCountSlider.position(10, GAMEFRAME_HEIGHT * 2 + 30);

  // let testGame = new TestGame();
  // env = new Environment(testGame);
  // test = new QLearningTest();
  // test.runTests();

  // let QL = new QLTEST(4, 2, 0.2, 0.9, 0.2);
  // testQLearning(QL);
}

function setupAvoidTheFox() {
  // rabbit = new Rabbit(floor(random(cols)), floor(random(rows)));
  // fox = new Fox(floor(random(cols)), floor(random(rows)));
  // env = new Environment(game);
  // qlearn = new QLearnTurnBased(env, ALPHA, GAMMA, EPSILON);
  // game = new AvoidTheFoxGame(rows, cols, fox, rabbit, 0);
}

function doAvoidTheFoxLoop() {
  // game.renderWorld();
  // drawGraph();
  // env.trainSteps();
  // game.updateWorld();
  // p.data = "hhhh";
}

function setConnect4() {
  game = new Connect4(GAMEFRAME_WIDTH, GAMEFRAME_HEIGHT);
  env = new Environment(game);
  qlearn = new QLearnTurnBased(env, ALPHA, GAMMA, EPSILON);
  logMessage("New Game");

  qGraph = new QLearnGraph();
  qplotter = new QValuesPlotter(qlearn.qValues);
  //qplotter.setupQ();

  return game;
}

function doConnect4Loop() {
  game.renderWorld();
  textSize(14);
  stroke(0);
  fill(0);
  text("Total reward:" + env.totalRewards, GAMEFRAME_WIDTH * 2 + 30, 40);

  let gamesPlayed = game.gamesAIWon + game.gamesRandomWon + game.gameDraws;
  let aiLost = game.gamesRandomWon + game.gamesAIWon - game.gamesAIWon;
  let gamesDrawn = game.gameDraws;
  text("Games played:" + gamesPlayed, GAMEFRAME_WIDTH * 2 + 30, 60);

  text(
    "Games Agent: (won)" + game.gamesAIWon + " (lost) " + aiLost,
    GAMEFRAME_WIDTH * 2 + 30,
    80
  );

  text("Games drawn:" + gamesDrawn, GAMEFRAME_WIDTH * 2 + 30, 100);
  text("Alpha, Gamma: " + ALPHA + ", " + GAMMA, GAMEFRAME_WIDTH * 2 + 30, 120);
  text(
    "Episilon variance:" +
      qlearn.epsilon.toFixed(4) +
      " Scale:" +
      qlearn.epsilonScale,
    GAMEFRAME_WIDTH * 2 + 30,
    140
  );
  drawConsole();

  qGraph.drawQLGraph();

  // visualizeQValues(qlearn.qValues, GAMEFRAME_WIDTH, GAMEFRAME_HEIGHT);
}

function draw() {
  background(255);
  // doConnect4Loop();

  gc4.renderGame();
  env4.renderGameStatsWindow();

  if (gameOver === WIN || gameOver === DRAWN) {
    if ((frameCount % 60) * 10 === 0) {
      gc4.resetGame();
      gameOver = 0;
    }
  }

  // if (!isPAUSED) {
  //   // slow things down a little
  //   if ((frameCount % frameCountSlider.value()) * 10 === 0) {
  //     game.updateWorld();
  //     game.playerMouseControls();
  //     qGraph.clearOldData();
  //   }
  // }
}

function keyPressed() {
  //game.playerKeyControls();

  gameOver = env4.update();
}

function drawConsole() {
  // Draw the console background
  fill(0);
  rect(0, GAMEFRAME_HEIGHT, GAMEFRAME_WIDTH * 2, consoleHeight);

  // Display messages in the console
  fill(255, 0, 0);
  textSize(12);
  let y = GAMEFRAME_HEIGHT;
  for (let i = 0; i < messages.length; i++) {
    text(messages[i], 10, 18 + y);
    y += 20;
  }
}

function logMessage(message) {
  messages.push(message);
  // Remove oldest message if the console is full
  if (messages.length > GAMEFRAME_HEIGHT / 20) {
    messages.shift();
  }
}

function mousePressed() {
  // ignore pressed outside the game window
  if (
    mouseX < 0 ||
    mouseX > GAMEFRAME_WIDTH ||
    mouseY < 0 ||
    mouseY > GAMEFRAME_HEIGHT
  ) {
  } else {
    isPAUSED = !isPAUSED;
    // game.playerMouseControls();
  }

  logMessage(random());
}

function drawGraph() {
  // Draw the graphs
  let avgReward = 0;
  let avgError = 0;
  for (let i = 0; i < rewards.length; i++) {
    avgReward += rewards[i];
    avgError += errors[i];
  }
  avgReward /= rewards.length;
  avgError /= errors.length;

  fill(255);
  text(`Average Reward: ${avgReward.toFixed(2)}`, 10, 20);
  text(`Average Error: ${avgError.toFixed(2)}`, 10, 40);

  // Draw the line graph of rewards
  let x = 0;
  let y = GAMEFRAME_HEIGHT - avgReward * 50;
  stroke(255, 0, 0);
  strokeWeight(2);
  for (let i = 0; i < rewards.length; i++) {
    let nextX = x + GAMEFRAME_WIDTH / rewards.length;
    let nextY = GAMEFRAME_HEIGHT - rewards[i] * 50;
    line(x + GAMEFRAME_WIDTH, y + GAMEFRAME_HEIGHT, nextX, nextY);
    x = nextX;
    y = nextY;
  }

  // Draw the line graph of errors
  x = 0;
  y = GAMEFRAME_HEIGHT - avgError * 50;
  stroke(0, 255, 0);
  strokeWeight(2);
  for (let i = 0; i < errors.length; i++) {
    let nextX = x + GAMEFRAME_WIDTH / errors.length;
    let nextY = GAMEFRAME_HEIGHT - errors[i] * 50;
    line(x + GAMEFRAME_WIDTH, y + GAMEFRAME_HEIGHT, nextX, nextY);
    x = nextX;
    y = nextY;
  }
  fill(0);
  stroke(1);
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function testQLearning(ql_test) {
  let input = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
  ];
  let expectedOutput = [0, 1, 1, 0];
  let rewards = [];
  let actions = [];
  let errors = [];

  for (let i = 0; i < input.length; i++) {
    let state = input[i];
    let action = ql_test.chooseAction(state);
    let reward = expectedOutput[i] === action ? 1 : -1;
    rewards.push(reward);
    actions.push(action);
    errors.push(Math.abs(expectedOutput[i] - action));
    ql_test.updateQ(state, action, reward);
  }

  console.log("Rewards: ", rewards);
  console.log("Actions: ", actions);
  console.log("Errors: ", errors);
}

class QValuesPlotter {
  constructor(qvalues) {
    this.maxQValue = -Infinity;
    this.minQValue = Infinity;
    this.qValues = qvalues;
  }

  setupQ(qvalues) {
    // Find the minimum and maximum q-value for normalization
    for (let i = 0; i < this.qValues.length; i++) {
      for (let j = 0; j < this.qValues[0].length; j++) {
        this.maxQValue = max(this.maxQValue, this.qValues[i][j]);
        this.minQValue = min(this.minQValue, this.qValues[i][j]);
      }
    }
  }

  plotQValues() {
    let angleStep = TWO_PI / this.qValues.length;
    let radiusStep = GAMEFRAME_HEIGHT / 2 / this.qValues[0].length;

    // Loop through the q-values and plot each point
    for (let i = 0; i < this.qValues.length; i++) {
      let angle = i * angleStep;
      for (let j = 0; j < qValues[0].length; j++) {
        let radius = j * radiusStep;
        let qValue = this.qValues[i][j];
        let normalizedQValue =
          (qValue - this.minQValue) / (this.maxQValue - this.minQValue);
        let c = lerpColor(color(0, 0, 255), color(255, 0, 0), normalizedQValue);
        fill(c);
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        ellipse(x + GAMEFRAME_WIDTH * 1.5, y + GAMEFRAME_HEIGHT * 2, 5, 5);
      }
    }
  }

  drawPolarGrid() {
    let angleStep = TWO_PI / 8;
    let radiusStep = GAMEFRAME_HEIGHT / 2 / 8;

    // Draw the radial lines
    for (let i = 0; i < 8; i++) {
      let angle = i * angleStep;
      let x = (GAMEFRAME_WIDTH / 2) * cos(angle);
      let y = (GAMEFRAME_HEIGHT / 2) * sin(angle);
      line(0, 0, x, y);
    }
    fill(255);
    // Draw the concentric circles
    for (let i = 0; i < 8; i++) {
      let radius = i * radiusStep;
      ellipse(
        GAMEFRAME_WIDTH * 1.5,
        GAMEFRAME_HEIGHT * 2,
        2 * radius,
        2 * radius
      );
    }
  }

  drawRectQValues() {
    let qValues = qlearn.qValues; // Assume this is a 2D array containing the qValues
    let maxValue; // Maximum qValue in the array
    let minValue; // Minimum qValue in the array
    let rowCount; // Number of rows in the qValues array
    let colCount; // Number of columns in the qValues array
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        let qValue = qValues[row][col];
        let valueRange = maxValue - minValue;
        let valuePercent = (qValue - minValue) / valueRange;
        let c = color(255 * valuePercent, 0, 255 * (1 - valuePercent));
        let size = gaussian(valuePercent) * 10;
        fill(c);
        ellipse(col * size, row * size, size, size);
      }
    }
  }

  gaussian(x) {
    return (
      Math.exp((-0.5 * x * x) / (0.1 * 0.1)) / (Math.sqrt(2 * Math.PI) * 0.1)
    );
  }
}

function visualizeQValues(qValues, rows, cols) {
  rows = 6;
  cols = 7;

  let qv = Array.from(qValues);
  let maxQValue = -Infinity;
  for (let state in qv) {
    let stateQValues = qv[state];
    for (let action in stateQValues) {
      maxQValue = Math.max(maxQValue, stateQValues[action]);
    }
  }

  let cellWidth = GAMEFRAME_WIDTH / cols;
  let cellHeight = GAMEFRAME_HEIGHT / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let state = `${row},${col}`;
      let stateQValues = qv[state];

      let x = col * cellWidth;
      let y = row * cellHeight;

      for (let action in stateQValues) {
        let qValue = stateQValues[action];
        let colorValue = Math.floor(map(qValue, 0, maxQValue, 0, 255));
        fill(random(255));
        rect(x, y, cellWidth, cellHeight);
      }
    }
  }
}
