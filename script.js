const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let leftPressed = false;
let rightPressed = false;
const brickRowCount = 2;
const brickColumnCount = 2;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const birckOffsetLeft = 30;
let ballColor = "0095DD";
let score = 0;

const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

const keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }

  if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
};

const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX - canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

const changeBallColor = () => {
  ballColor = "#0095DD";
};

const drawWinMsg = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(
    `Congratualations you have broken out!`,
    canvas.width / 2,
    canvas.height / 2
  );
  score = 0;
  document.location.reload();
  clearInterval(interval);
};

const drawGameOverMsg = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(`Game Over!`, canvas.width / 2, canvas.height / 2);
};

const collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          ballColor = "yellow";
          setTimeout(changeBallColor, 200);
          if (score === brickColumnCount * brickRowCount) {
            drawWinMsg();
          }
        }
      }
    }
  }
};

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
};

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
};

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + birckOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  drawBricks();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      if ((y = y - paddleHeight)) {
        dy = -dy;
      }
    } else {
      drawGameOverMsg();
      score = 0;
      document.location.reload();
      clearInterval(interval);
    }
  }

  if (rightPressed) {
    paddleX += 5;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 5;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  x += dx;
  y += dy;
};

const interval = setInterval(draw, 10);
