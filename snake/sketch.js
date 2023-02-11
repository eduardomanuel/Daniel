const grid_cols = 40;
const grid_rows = 40;

const direction = {
  right: 0,
  left: 1,
  up: 2,
  down: 3,
};

class gameLevel {
  constructor() {
    this.frameRate = 5;
    this.foodPillMargins = 10;
    this.pillDuration = 10;
  }
}

const foodPillType = {
  regular: 0,
  enhanced: 1,
};

var tile_width = 0;
var tile_height = 0;
var food = [];
var gameConfig = {};
var dificulty = 1;

function getColorForPillType(pillType) {
  if (pillType == foodPillType.regular) return "#ffff00";
  if (pillType == foodPillType.enhanced) return "#ff0000";
}

class foodPill {
  #genPosition() {
    let margin = gameConfig.foodPillMargins;
    return {
      x: Math.floor(random(0 + margin, grid_cols - margin)) * tile_width,
      y: Math.floor(random(0 + margin, grid_rows - margin)) * tile_height,
    };
  }

  constructor(fpType) {
    this.Location = this.#genPosition();
    this.type = fpType;
  }

  draw() {
    // console.log("food pill pos =", this.Location);
    push();
    fill(getColorForPillType(foodPillType.regular));
    rect(this.Location.x, this.Location.y, tile_width, tile_height);
    pop();
  }
}

class SnakeTile {
  constructor() {
    this.position = new Location();
  }
  draw() {
    push();
    fill("#fff");

    rect(this.position.x, this.position.y, tile_width, tile_height);
    pop();
  }
}

class Location {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

class Snake {
  constructor() {
    this.prevPos = new Location();
    this.reset();
  }

  kill() {
    console.log("snake died");
    this.body.length = 0;
    this.reset();
  }

  reset() {
    this.head = new SnakeTile();
    this.body = []; // will be an array of snake tiles
    this.direction = getDirectionVector(direction.right);
  }

  draw() {
    this.head.draw();
    this.#drawBody();
  }

  #drawBody() {
    for (let i = 0; i < this.body.length; i++) {
      this.body[i].draw();
    }
  }

  #colidedWidFoodPill() {
    for (var i = 0; i < food.length; i++) {
      let foodPill = food[i];
      if (
        foodPill.Location.x == this.head.position.x &&
        foodPill.Location.y == this.head.position.y
      )
        return true;
    }

    return false;
  }

  #colidedWithBoundary() {
    return (
      this.head.position.x >= width - tile_width ||
      this.head.position.x < 0 ||
      this.head.position.y >= height + tile_height ||
      this.head.position.y < 0
    );
  }

  revertLastMove() {
    this.head.position.x -= this.direction.x * tile_width;
    this.head.position.y -= this.direction.y * tile_height;
  }

  addTitle() {
    let newTile = new SnakeTile();
    if (this.body.length > 0)
      var posOfLastTile = this.body[this.body.length - 1].position;
    else var posOfLastTile = this.head.position;
    newTile.position.x = posOfLastTile.x - this.direction.x * tile_width;
    newTile.position.y = posOfLastTile.y - this.direction.y * tile_height;

    this.body.push(newTile);
  }

  #moveHead() {
    this.prevPos.x = this.head.position.x;
    this.prevPos.y = this.head.position.y;
    this.head.position.x += this.direction.x * tile_width;
    this.head.position.y += this.direction.y * tile_height;
  }

  #moveBody() {
    for (let i = 0; i < this.body.length; i++) {
      let curTile = this.body[i];
      let lastTilePos = new Location();
      lastTilePos.x = curTile.position.x;
      lastTilePos.y = curTile.position.y;
      curTile.position.x = this.prevPos.x;
      curTile.position.y = this.prevPos.y;
      this.prevPos.x = lastTilePos.x;
      this.prevPos.y = lastTilePos.y;
    }
  }

  move() {
    //move head
    this.#moveHead();
    this.#moveBody();

    if (this.#colidedWithBoundary()) {
      console.log("Colided with boundary!");
      this.kill();
      initGame();
    }

    if (this.#colidedWidFoodPill()) {
      console.log("ate a new pill! snake length :" + (this.body.length + 1));

      this.addTitle();
      resetFoodPills();
      increaseDificulty();
    }
  }
}

var mySnake = new Snake();

function drawFoodPills() {
  food.forEach((fp) => fp.draw());
}

function addFoodPill() {
  food.push(new foodPill(foodPillType.regular));
}

function resetFoodPills() {
  food.length = 0;
  addFoodPill();
}

function increaseDificulty() {
  dificulty++;
  let nextLevel = new gameLevel();
  nextLevel.frameRate += dificulty;
  nextLevel.foodPillMargins -= dificulty;
  if (nextLevel.foodPillMargins <= 0)
    nextLevel.foodPillMargins = 0;
  gameConfig = nextLevel;
  frameRate(gameConfig.frameRate);
  console.log(gameConfig);
  console.log("Current frame rate = " + frameRate());
}

function initGame() {
  dificulty = 0;  
  gameConfig = new gameLevel();
  console.log("initializing game..");
  console.log(gameConfig);
  food.length = 0;
  frameRate(gameConfig.frameRate);
  createCanvas(600, 600);
  tile_height = height / grid_rows;
  tile_width = width / grid_cols;
  addFoodPill();
}

function setup() {
  initGame();
  console.log(mySnake);
}

function draw() {
  background("#15291a");
  drawFoodPills();
  mySnake.draw();
  mySnake.move();
}

function getDirectionVector(d) {
  switch (d) {
    case direction.right:
      return { x: 1, y: 0 };

    case direction.left:
      return { x: -1, y: 0 };

    case direction.up:
      return { x: 0, y: -1 };

    case direction.down:
      return { x: 0, y: 1 };

    default:
      console.error("Invalid direction parameter sent to getDirectionVector");
  }
}

function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      mySnake.direction = getDirectionVector(direction.left);
      break;

    case RIGHT_ARROW:
      mySnake.direction = getDirectionVector(direction.right);
      break;

    case UP_ARROW:
      mySnake.direction = getDirectionVector(direction.up);
      break;

    case DOWN_ARROW:
      mySnake.direction = getDirectionVector(direction.down);
      break;

    case 32: // space bar
      console.log("not implemented yet");
      break;

    default:
      console.log(keyCode);
  }
}
