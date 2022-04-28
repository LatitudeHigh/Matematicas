var PADDLE_WIDTH = 80;
var PADDLE_HEIGHT = 15;
var PADDLE_OFFSET = 10;
var BALL_RADIUS = 20;
var NUM_ROWS = 8;
var BRICK_TOP_OFFSET = 10;
var BRICK_SPACING = 2;
var NUM_BRICKS_PER_ROW = 8;
var BRICK_HEIGHT = 10;
var BRICK_WIDTH;
var paddle, ball;
var vx;
var vy = 8;
var gameOver = false;
var NUM_TURNS = 3;
var turnsLeft = NUM_TURNS;
var bricksLeft = NUM_ROWS * NUM_BRICKS_PER_ROW;
var RANDOM;
var PINK, PURPLE, BLUE, GREEN, YELLOW, YELLOW2;
var song;
var gameRunning = false;
var instructions;
var text;
var text2;

// this code turns the ball into different colors
function paintBall() {
  ball.setColor(YELLOW);
}
// this is the function to create the ball 
function setupBall() {
  ball = new Circle(BALL_RADIUS);
  ball.setPosition(getWidth() / 2, getHeight() / 2);
  ball.setColor(YELLOW);
  add(ball);
}

//this function creates the paddle for the ball to bounce from
function setupPaddle() {
  paddle = new Rectangle(PADDLE_WIDTH, PADDLE_HEIGHT);
  paddle.setPosition(
    getWidth() / 2 - paddle.getWidth() / 2,
    getHeight() - paddle.getHeight() - PADDLE_OFFSET
  );
  paddle.setColor(RANDOM);
  add(paddle);
}


//this fucntion paints a specific row of "bricks" based on their position
function getColorForRow(rowNum) {
  //this causes a row of 8 of both bricks and rows 
  rowNum = rowNum % 8;
  if (rowNum <= 1) {
    return (PINK);
  } else if (rowNum > 1 && rowNum <= 3) {
    return (PURPLE);
  } else if (rowNum > 3 && rowNum <= 5) {
    return (BLUE);
  } else {
    return (GREEN);
  }
}


// this function is what makes the bricks for the ball to hit
function drawBrick(x, y, color) {
  var brick = new Rectangle(BRICK_WIDTH, BRICK_HEIGHT);
  brick.setPosition(x, y);
  brick.setColor(color);
  add(brick);
}
//this function is what  positions the bricks in seperate rows
function drawRow(rowNum, yPos) {
  var xPos = BRICK_SPACING;
  for (var i = 0; i < NUM_BRICKS_PER_ROW; i++) {
    drawBrick(xPos, yPos, getColorForRow(rowNum));
    xPos += BRICK_WIDTH + BRICK_SPACING;
  }
}
//this function creates said "bricks"
function drawBricks() {
  BRICK_WIDTH = (getWidth() - (NUM_BRICKS_PER_ROW + 1)
    * BRICK_SPACING) / NUM_BRICKS_PER_ROW
  var yPos = BRICK_TOP_OFFSET;
  for (var i = 0; i < NUM_ROWS; i++) {
    drawRow(i, yPos);
    yPos += BRICK_HEIGHT + BRICK_SPACING;
  }
}
//this function is what sets the speed for when the ball hits the walls
function setSpeeds() {
  vx = Randomizer.nextInt(8, 11);
  if (Randomizer.nextBoolean())
    vx = -vx;
}

//this function set's up all codes to be used 
function setup() {
  drawBricks();
  setupPaddle();
  setupBall();
  setSpeeds();
}

//this code commands th ball to check the walls and then make the ball bounce off of said walls
function checkWalls() {
  if (ball.getX() - ball.getRadius() < 0
    || ball.getX() + ball.getRadius() > getWidth()) {
    vx = -vx;
    paintBall();
  }
  if (ball.getY() - ball.getRadius() < 0) {
    vy = -vy;
    paintBall();
  }

  if (ball.getY() + ball.getRadius() > getHeight()) {
    gameOver = true;
  }
}
//This function allows the ball to bounce of of the walls and paddle  
function getCollidingObject() {
  var left = ball.getX() - ball.getRadius();
  var right = ball.getX() + ball.getRadius();

  var top = ball.getY() - ball.getRadius();
  var bottom = ball.getY() + ball.getRadius();

  var topLeft = getElementAt(left, top);
  if (topLeft) return topLeft;

  var topRight = getElementAt(right, top);
  if (topRight) return topRight;

  var bottomLeft = getElementAt(left, bottom);
  if (bottomLeft) return bottomLeft;

  var bottomRight = getElementAt(right, bottom);
  if (bottomRight) return bottomRight;
}
//this function inserts math into the game once the ball hits a brick and won let them leave until the answer is right
function doMath() {


  var x = Randomizer.nextInt(0, 15);
  var y = Randomizer.nextInt(0, 30);
  var answer = x * y;

  var response = parseInt(prompt("What is " + x + " x " + y));
  while (response != answer) {
    var response = parseInt(prompt("Try again: what is " + x + " x " + y));
  }
}
//this function allows the ball to break a brick but have to answer a math proiblem first
function checkObjects() {
  var elem = getCollidingObject();
  if (elem != null) {
    if (elem != paddle) {
      doMath();
      remove(elem);
      vy = -vy;
      bricksLeft--;
    } else {
      vy = -Math.abs(vy);
    }
  }
}
//this function pops up the text "Game over" once you lose all 3 lives
function drawGameOver() {
  var text = new Text("Game over", "25pt Arial");
  text.setPosition(getWidth() / 2 - text.getWidth() / 2,
    getHeight() / 2);
  text.setColor(YELLOW2);
  add(text);
}
//this function pops up the text "You Win!" once you destroy all bricks
function drawGameWon() {
  var text = new Text("You Win!", "25pt Arial");
  text.setPosition(getWidth() / 2 - text.getWidth() / 2, getHeight() / 2);
  text.setColor(YELLOW2);
  add(text);
}
//this fucntion checks if you have destroyed all bricks to then say that you won
function checkWin() {
  if (bricksLeft == 0) {
    stopTimer(draw);
    drawGameWon();
  }
}
//This function checks your lives and will say game over if lost all 3 lives
function checkLose() {
  /* This is unfortunately confusing now to
     play multiple times... */
  if (gameOver) {
    turnsLeft--;
    remove(ball);
    if (turnsLeft == 0) {
      stopTimer(draw);
      drawGameOver();
    } else {
      stopTimer(draw);
      // 			waitForClick();
      setTimer(draw, 40);
      setupBall();
      setSpeeds();
      gameOver = false;
    }
  }
}
// this fucntion is what allows the codeed graphics to show up on the screen/console
function draw() {
  checkWalls();
  checkObjects();
  ball.move(vx, vy);
  checkWin();
  checkLose();
}
//this function is what limits the paddle in order to stay between the 2 walls
function myMove(event) {
  var x = event.getX() - paddle.getWidth() / 2;
  if (x < 0)
    x = 0;
  if (x + paddle.getWidth() > getWidth())
    x = getWidth() - paddle.getWidth();
  paddle.setPosition(x, paddle.getY());
}

function setColors() {
  PINK = new Color(250, 175, 244);
  PURPLE = new Color(179, 135, 250);
  BLUE = new Color(135, 204, 250);
  GREEN = new Color(139, 250, 135);
  YELLOW = new Color(244, 247, 140);
  YELLOW2 = new Color(250, 228, 27);
  RANDOM = Randomizer.nextColor();
}
function music(){
  song = new Audio("https://static.codehs.com/audio/tamagotamagotamagotchi.m4a");
  song.play();
}

  
function drawStartScreen() {
   instructions = new Text("Click to Start","30pt Arial");
  instructions.setPosition(getWidth() / 2 - instructions.getWidth() / 2, getHeight() / 2.8);
  instructions.setColor(Color.white);
  add(instructions);

  text = new Text("you must try not to get the ball into the void","15pt Arial");
  text.setPosition(getWidth() / 2 - text.getWidth() / 2, getHeight()/2);
  text.setColor(Color.white);
  add(text);
  text2 = new Text("& have the ball hit the bricks using the paddle","15pt Arial");
  text2.setPosition(getWidth() / 2 - text2.getWidth() / 2, getHeight()/1.8);
  text2.setColor(Color.white);
  add(text2);
  
}

function startGame(e) {
  if(!gameRunning) {
    removeAll();
    setup();
    setTimer(draw, 50);
    mouseMoveMethod(myMove);
    gameRunning = true;
  }
}

//this is the fucntion where it ables  all functions to play and create our game, Matematicas
function start() {
  drawStartScreen();
  setColors();
  mouseClickMethod(startGame);
  music();
}



