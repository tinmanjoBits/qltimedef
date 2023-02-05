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

let test;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = height / gridSize;
  cols = width / gridSize;

  // setupAvoidTheFox();
  game = setConnect4();

  p = createP("hello");
  frameCountSlider = createSlider(1, 1000, 1);
  frameCountSlider.position(10, GAMEFRAME_HEIGHT * 2 + 30);

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

  return game;
}

function doConnect4Loop() {
  game.renderWorld();
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
  text("QTable size:" + qlearn.qValues.length, GAMEFRAME_WIDTH * 2 + 30, 120);

  text(
    "Agents version:" +
      env.agentsVersion +
      ", Next Reward threshold (" +
      env.incReward +
      ")",
    GAMEFRAME_WIDTH * 2 + 30,
    140
  );
  drawConsole();
  drawConsole();
  qGraph.drawQLGraph();
}

function draw() {
  background(255);
  doConnect4Loop();

  if (!isPAUSED) {
    // slow things down a little
    if ((frameCount % frameCountSlider.value()) * 10 === 0) {
      game.updateWorld();
      game.playerMouseControls();
      qGraph.clearOldData();
    }
  }
}

function keyPressed() {
  game.playerKeyControls();
}

function drawConsole() {
  // Draw the console background
  fill(0);
  rect(0, GAMEFRAME_HEIGHT, width, consoleHeight);

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
