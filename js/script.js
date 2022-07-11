const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;
const BOARD_Y = 50;
const BOARD_P1_X = 300;
const BOARD_P2_X = 500;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_STEP = 3;
const PADDLE_P1_X = 10;
const PADDLE_P2_X = 770;
const PADDLE_START_Y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
const BALL_R = 15;
const BALL_START_X = CANVAS_WIDTH / 2;
const BALL_START_Y = CANVAS_HEIGHT / 2;
const BALL_START_DX = 4.5;
const BALL_START_DY = 1.5;
const STATE_CHANGE_INTERVAL = 20;
const P1_UP_BUTTON = 'KeyQ';
const P1_DOWN_BUTTON = 'KeyA';
const P2_UP_BUTTON = 'KeyP';
const P2_DOWN_BUTTON = 'KeyL';
const UP_ACTION = 'up';
const DOWN_ACTION = 'down';
const STOP_ACTION = 'stop';

//! STATE
let ballX = BALL_START_X;
let ballY = BALL_START_Y;
let ballDX = BALL_START_DX;
let ballDY = BALL_START_DY;
let p1PaddleY = PADDLE_START_Y;
let p2PaddleY = PADDLE_START_Y;
let p1Points = 0;
let p2Points = 0;
let p1Action = STOP_ACTION;
let p2Action = STOP_ACTION;
//*Functions
// Points
ctx.font = '30px Arial';
function drawPoints(text, x) {
  ctx.fillText(text, x, BOARD_Y);
}
// Pong paddle
function drawPaddle(x, y) {
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}
//Ball
function drawCircle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}
function drawBall(x, y) {
  drawCircle(x, y, BALL_R);
}
// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('keydown', function (e) {
  const code = e.code;
  //Player 1 movement
  if (code === P1_UP_BUTTON) {
    p1Action = UP_ACTION;
  } else if (code === P1_DOWN_BUTTON) {
    p1Action = DOWN_ACTION;
  } else if (code === P2_UP_BUTTON) {
    p2Action = UP_ACTION;
  } else if (code === P2_DOWN_BUTTON) {
    p2Action = DOWN_ACTION;
  }
});
window.addEventListener('keyup', function (e) {
  const code = e.code;
  //Player 1 movement
  if (
    (code === P1_UP_BUTTON && p1Action === UP_ACTION) ||
    (code === P1_DOWN_BUTTON && p1Action === DOWN_ACTION)
  ) {
    p1Action = STOP_ACTION;
  } else if (
    (code === P2_UP_BUTTON && p2Action === UP_ACTION) ||
    (code === P2_DOWN_BUTTON && p2Action === DOWN_ACTION)
  ) {
    p2Action = STOP_ACTION;
  }
});

function drawState() {
  clearCanvas();
  drawPoints(p1Points.toString(), BOARD_P1_X);
  drawPoints(p2Points.toString(), BOARD_P2_X);
  drawBall(ballX, ballY);
  drawPaddle(PADDLE_P1_X, p1PaddleY);
  drawPaddle(PADDLE_P2_X, p2PaddleY);
}

function movePaddles() {
  //Player 1 move
  if (p1Action === UP_ACTION) {
    p1PaddleY -= PADDLE_STEP;
  } else if (p1Action === DOWN_ACTION) {
    p1PaddleY += PADDLE_STEP;
  }
  // Player 2 move
  if (p2Action === UP_ACTION) {
    p2PaddleY -= PADDLE_STEP;
  } else if (p2Action === DOWN_ACTION) {
    p2PaddleY += PADDLE_STEP;
  }
}
function updateState() {
  movePaddles();

  ballX += ballDX;
  ballY += ballDY;

  //   p1PaddleY++;
  //   p2PaddleY--;
  //   p1Points++;
  //   p2Points += 3;
}
function updateAndDrawState() {
  updateState();
  drawState();
}
setInterval(updateAndDrawState, STATE_CHANGE_INTERVAL);
