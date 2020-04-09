/* ***************************************************************

Challenge 1 - Make Constants
* Make these into constants defined at the top.

Challenge 2 - Identify duplicate code
** This block of code is repeated better to make a function for this.

Challenge 3 - Use Subroutines
*** This block of code would be better as a function.

Challenge 4 - Encapsulating code
**** Use objects to encapsulate code

***************************************************************** */

// **************************************************************
// DOM references
// **************************************************************

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// **************************************************************
// Variables
// **************************************************************

// --------------------------------------------------------------
// Constants
// --------------------------------------------------------------

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const objectColor = '#0095DD';
const gameFont ='16px Arial';
const canvasWidth = 480;
const canvasHeight = 320;
const startPositionX = canvasWidth / 2;
const startPositionY = canvasHeight - 30;
const paddleXStart = (canvasWidth - paddleWidth) / 2;
const twoPI = Math.PI * 2;
const winAlert = 'YOU WIN, CONGRATULATIONS!';
const gameOver = 'GAME OVER';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

// ** Initialize the position of the ball and paddle
// ** and set the ball speed and direction
// **** A Ball Object would be good.

let paddleX;

// Objects (ball)
let ball = {
    x: 0, // ball.x
    y: 0, // ball.y
    dx: 0, // ball.dx
    dy: 0, // ball.dy
    radius: ballRadius,
};

resetBallAndPaddle();

let score = 0;
let lives = 3;

let rightPressed = false;
let leftPressed = false;

// --------------------------------------------------------------
// Setup Bricks Array
// --------------------------------------------------------------

const bricks = [];
// *** This would be better in a function
initializeBricks();

// **************************************************************
// Functions
// **************************************************************

function drawBall() {
  ctx.beginPath();
  // * Math.PI * 2 could be a constant
  ctx.arc(ball.x, ball.y, ball.radius, 0, twoPI);
  ctx.fillStyle = objectColor; // * Could be good as a constant
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = objectColor; // * Could be good as a constant
  ctx.fill();
  ctx.closePath();
}

function initializeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
      };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        // **** This block should really be part of the brick initialization
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = objectColor; // * Could be good as a constant
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert(winAlert); // * Could be good as a constant
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = gameFont; // * Could be good as a constant
  ctx.fillStyle = objectColor; // * Could be good as a constant
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = gameFont; // * Could be good as a constant
  ctx.fillStyle = objectColor; // * Could be good as a constant
  // * canvas.width might be better as a constants
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 65, 20);
}

function resetBallAndPaddle() {
    ball.x = startPositionX;
    ball.y = startPositionY;
    ball.dx = 2;
    ball.dy = -2;
    paddleX = paddleXStart;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function collisionsWithCanvasAndPaddle() {
  // Bounce the ball off the left and right of the canvas
  if (ball.x + ball.dx > canvasWidth - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ball.radius) {
    // hit the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvasHeight - ball.radius) {
    // hit the bottom
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      // Hit the paddle
      ball.dy = -ball.dy;
    } else {
      // Lose a life
      lives -= 1;
      if (!lives) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert(gameOver); // * Could be good as a constant
        ball.x = 200; 
        ball.y = 200;
        document.location.reload();
      } else {
        // Start the over you hit the bottom
        resetBallAndPaddle();
      }
    }
  }
}

function movePaddle() {
  if (rightPressed && paddleX < canvasWidth - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

// --------------------------------------------------------------
// Game Loop
// --------------------------------------------------------------

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Call helper functions
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();  // *** Better as a separate function
  movePaddle();  // *** Better as a function
  collisionsWithCanvasAndPaddle();

  // Draw the screen again
  requestAnimationFrame(draw);
}

// --------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// **************************************************************
// Register Events
// **************************************************************

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);


// **************************************************************
// Starts program entry point
// **************************************************************

draw();
