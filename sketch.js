/* eslint-disable no-undef, no-unused-vars */

const GAMEFRAME_WIDTH = 256;
const GAMEFRAME_HEIGHT = 256;

let rewards = [];
let avgRewards = [];
let graph1;
let errors = [];
let messages = [];
let consoleHeight = GAMEFRAME_HEIGHT;
let isPAUSED = false;

let frameCountSlider;
let opponentRewards = [];

let gc4;
let env4;
let turn;
let KEY_PRESSED = false;
let gameOver = 0;
let qlearn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // rows = height / gridSize;
  // cols = width / gridSize;

  frameCountSlider = createSlider(1, 1000, 1);
  qlearn = new QLearnTurnBased(ALPHA, GAMMA, EPSILON);
  gc4 = new GameC4();
  env4 = new GameEnv(gc4, qlearn);
  qlearn.setEnv(env4);

  turn = PLAYER1;
  graph1 = new QLearnGraph(
    GAMEFRAME_WIDTH,
    GAMEFRAME_HEIGHT,
    GAMEFRAME_WIDTH,
    GAMEFRAME_HEIGHT,
    1000
  );
}

function draw() {
  background(255);

  gc4.renderGame();
  env4.renderGameStatsWindow();

  if (gameOver === WIN || gameOver === DRAWN) {
    if ((frameCount % 60) * 10 === 0) {
      gc4.resetGame();
      gameOver = 0;
    }
  }

  if (!isPAUSED) {
    // slow things down a little
    if ((frameCount % frameCountSlider.value()) * 5 === 0) {
      gameOver = env4.update();
      graph1.clearOldData();
    }
  }

  graph1.drawQLGraph();
  // graph1.clearOldData();
}

function keyPressed() {
  //game.playerKeyControls();
  //gameOver = env4.update();
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
