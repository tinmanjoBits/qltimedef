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

  frameCountSlider = createSlider(1, 10, 0);

  qlearn = new QLearnTurnBased(ALPHA, GAMMA, EPSILON);
  gc4 = new GameC4();
  env4 = new GameEnvironment(gc4, qlearn);

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
}

function simulationLoop() {}

function keyPressed() {
  env4.simulationStep();
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

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
