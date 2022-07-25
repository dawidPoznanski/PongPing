const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;

const BOARD_Y = 50;
const BOARD_P1_X = 300;
const BOARD_P2_X = 500;

const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_STEP = 5;
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
const PAUSE_BUTTON = 'Space';

const UP_ACTION = 'up';
const DOWN_ACTION = 'down';
const STOP_ACTION = 'stop';

//* Utils
function coerceIn(value, min, max) {
  if (value <= min) {
    return min;
  } else if (value >= max) {
    return max;
  } else {
    return value;
  }
}

function isInBetween(value, min, max) {
  return value >= min && value <= max;
}

//*Drawing
// Points
ctx.font = '30px Arial';

function drawPoints(text, x) {
  ctx.fillText(text, x, BOARD_Y);
}

//Ball
function drawCircle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//*Input
//* Press the button to move paddle
window.addEventListener('keydown', function (e) {
  const code = e.code;
  if (code === P1_UP_BUTTON) {
    p1.action = UP_ACTION;
  } else if (code === P1_DOWN_BUTTON) {
    p1.action = DOWN_ACTION;
  } else if (code === P2_UP_BUTTON) {
    p2.action = UP_ACTION;
  } else if (code === P2_DOWN_BUTTON) {
    p2.action = DOWN_ACTION;
  }
  //*PAUSE
  if (code === PAUSE_BUTTON) {
    paused = !paused;
  }
});
//* Pull up the button to stop paddle
window.addEventListener('keyup', function (e) {
  const code = e.code;
  //Player 1 movement
  if (
    (code === P1_UP_BUTTON && p1.action === UP_ACTION) ||
    (code === P1_DOWN_BUTTON && p1.action === DOWN_ACTION)
  ) {
    p1.action = STOP_ACTION;
  } else if (
    (code === P2_UP_BUTTON && p2.action === UP_ACTION) ||
    (code === P2_DOWN_BUTTON && p2.action === DOWN_ACTION)
  ) {
    p2.action = STOP_ACTION;
  }
});

//*Ball movement
function Ball() {
  return {
    x: BALL_START_X,
    y: BALL_START_Y,
    dx: BALL_START_DX,
    dy: BALL_START_DY,
    moveByStep() {
      this.x += this.dx;
      this.y += this.dy;
    },
    shouldBounceFromTopWall: function () {
      return this.y < BALL_R && this.dy < 0;
    },
    shouldBounceFromBottomWall: function () {
      return this.y + BALL_R > CANVAS_HEIGHT && this.y > 0;
    },
    bounceFromWall: function () {
      this.dy = -this.dy;
    },
    bounceFromPaddle: function () {
      this.dx = -this.dx;
      randomPaddleBounce();
    },
    moveToStart: function () {
      this.x = BALL_START_X;
      this.y = BALL_START_Y;
    },
    isOutsideOnLeft: function () {
      return this.x + BALL_R < 0;
    },
    isOutsideOnRight: function () {
      return this.x - BALL_R > CANVAS_WIDTH;
    },

    isOnTheSameHeightAsPaddle: function (paddleY) {
      return isInBetween(this.y, paddleY, paddleY + PADDLE_HEIGHT);
    },

    shouldBounceFromLeftPaddle: function () {
      return (
        this.dx < 0 &&
        isInBetween(this.x - BALL_R, PADDLE_P1_X, PADDLE_P1_X + PADDLE_WIDTH) &&
        this.isOnTheSameHeightAsPaddle(p1.paddle.y)
      );
    },

    shouldBounceFromRightPaddle: function () {
      return (
        this.dx > 0 &&
        isInBetween(this.x + BALL_R, PADDLE_P2_X, PADDLE_P2_X + PADDLE_WIDTH) &&
        this.isOnTheSameHeightAsPaddle(p2.paddle.y)
      );
    },
    draw: function () {
      drawCircle(this.x, this.y, BALL_R);
    },
  };
}
function Player(paddleX, boardX) {
  return {
    points: 0,
    boardX: boardX,
    action: STOP_ACTION,
    paddle: {
      x: paddleX,
      y: PADDLE_START_Y,
      setY: function (newY) {
        const minPaddleY = 0;
        const maxPaddleY = CANVAS_HEIGHT - PADDLE_HEIGHT;
        this.y = coerceIn(newY, minPaddleY, maxPaddleY);
      },
      stepDown: function () {
        this.setY(this.y + PADDLE_STEP);
      },
      stepUp: function () {
        this.setY(this.y - PADDLE_STEP);
      },
      draw: function () {
        ctx.fillRect(this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      },
    },
    makeAction: function () {
      if (this.action === UP_ACTION) {
        this.paddle.stepUp();
      } else if (this.action === DOWN_ACTION) {
        this.paddle.stepDown();
      }
    },
    drawPoints: function () {
      drawPoints(this.points.toString(), this.boardX);
    },
    draw: function () {
      this.drawPoints();
      this.paddle.draw();
    },
  };
}

//*STATE
let paused = false;
let ball = Ball();
const p1 = Player(PADDLE_P1_X, BOARD_P1_X);
const p2 = Player(PADDLE_P2_X, BOARD_P2_X);

//* Function moving paddles on canvas
function movePaddles() {
  //Player 1 move
  p1.makeAction();
  p2.makeAction();
}

function randomBallMov() {
  let randomY = Math.round(Math.random() * (5 - 1)) + 1;
  let randomX = Math.floor(Math.random() * (10 - 4)) + 4;
  let random = Math.round(Math.random());
  if (random === 0) {
    ball.dy = randomY;
    ball.dx = randomX;
  } else {
    ball.dy = -randomY;
    ball.dx = -randomX;
  }
}
function randomPaddleBounce() {
  let randomY = Math.round(Math.random() * (5 - 1)) + 1;

  let random = Math.round(Math.random());
  if (random === 0) {
    ball.dy = randomY;
  } else {
    ball.dy = -randomY;
  }
}

function moveBall() {
  if (ball.shouldBounceFromTopWall() || ball.shouldBounceFromBottomWall()) {
    ball.bounceFromWall();
  }
  if (ball.shouldBounceFromLeftPaddle() || ball.shouldBounceFromRightPaddle()) {
    ball.bounceFromPaddle();
  }
  if (ball.isOutsideOnLeft()) {
    randomBallMov();
    ball.moveToStart();

    p2.points++;
  } else if (ball.isOutsideOnRight()) {
    randomBallMov();
    ball.moveToStart();

    p1.points++;
  }
  ball.moveByStep();
}

function updateState() {
  moveBall();
  movePaddles();

  //   p1PaddleY++;
  //   p2PaddleY--;
  //   p1Points++;
  //   p2Points += 3;
}

//* Drawing new state to canvas
function drawState() {
  clearCanvas();
  ball.draw();
  p1.draw();
  p2.draw();
}
function updateAndDrawState() {
  if (!paused) {
    updateState();
    drawState();
  }
}
setInterval(updateAndDrawState, STATE_CHANGE_INTERVAL);
