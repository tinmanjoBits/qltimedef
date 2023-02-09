/* eslint-disable no-undef, no-unused-vars */

const MAX_EPISODES = 100;

// hypervaribles
const ALPHA = 0.2; // learning rate
const GAMMA = 0.8; // discount function
const EPSILON = 0.9; // rate of exploration

// Epsilon scaling
const REWARD_SCALE = 500;

const PLAYER1 = 1;
const PLAYER2 = 2;
const BLANK = 0;

// Rewards
const WIN = 1;
const LOSE = -1;
const DRAWN = 0.5;
const PLAYING = 0;
