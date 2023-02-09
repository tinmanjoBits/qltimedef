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

  frameCountSlider = createSlider(1, 100, 1);

  qlearn = new QLearnTurnBased(ALPHA, GAMMA, EPSILON);
  gc4 = new GameC4();
  env4 = new GameEnvironment(gc4, qlearn);

  graph1 = new QLearnGraph(
    GAMEFRAME_WIDTH,
    GAMEFRAME_HEIGHT,
    256,
    256,
    1000,
    env4.agent.rewardsP1Array,
    env4.agent.rewardsP2Array
  );

  logMessage("New Game started, Player1 goes first !!");
}

function draw() {
  background(255);

  updateInFrameCount();
  //updateInSliderValue()

  gc4.renderGame();
  drawConsole();

  if (env4) {
    drawStats();
  }

  graph1.drawQLGraph();
}

function updateInSliderValue() {
  // for (let i = 0; i < frameCountSlider.value(); i++) {
  //}
}

function updateInFrameCount() {
  if ((frameCount % 60) * 3 === 0) {
    env4.simulationStep();
    graph1.clearOldData();
  }
}

function drawStats() {
  fill(0);
  let sp = 12;
  let currentPlayer = env4.agent.currentPlayer;
  let move = env4.agent.currentAction;
  let lastPlayer = env4.agent.lastPlayer;
  let p1reward = env4.agent.currentP1Reward;
  let p1TotalRewards = env4.agent.totalRewardP1Sum;
  let p2reward = env4.agent.currentP2Reward;
  let p2TotalRewards = env4.agent.totalRewardP2Sum;
  text("Current Player:" + currentPlayer, GAMEFRAME_WIDTH, 1 * sp);
  text("Last Player:" + lastPlayer, GAMEFRAME_WIDTH, 2 * sp);
  text("Player 1 reward:" + p1reward, GAMEFRAME_WIDTH, 3 * sp);
  text("Player 1 Total rewards:" + p1TotalRewards, GAMEFRAME_WIDTH, 4 * sp);
  text("Player 2 reward:" + p2reward, GAMEFRAME_WIDTH, 5 * sp);
  text("Player 2 Total rewards:" + p2TotalRewards, GAMEFRAME_WIDTH, 6 * sp);
  //text("Current Move:" + move, GAMEFRAME_WIDTH, 42);
}

function simulationLoop() {}

function keyPressed() {}

function drawConsole() {
  // Draw the console background
  fill(0);
  rect(0, GAMEFRAME_HEIGHT, GAMEFRAME_WIDTH, consoleHeight);

  // Display messages in the console
  fill(0, 255, 0);
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

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
