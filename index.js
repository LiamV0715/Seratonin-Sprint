// let getElementById('canvas1') = loadCanvas
// loadCanvas.display = 'hidden'
// window.addEventListener('load', function loaded(){
//   isLoaded = true

function newImage(url) {
  let image = document.createElement("img");
  image.src = url;
  image.style.position = "absolute";
  document.body.append(image);
  return image;
}

let coins = [];
function generateCoins() {
  coins = [
    new Coin(100, 600),
    new Coin(1000, 500), // Adjust each by 6-700 minimum
    new Coin(3000, 700),
    new Coin(4200, 400),
    new Coin(5000, 500),
    new Coin(5500, 600),
    new Coin(6000, 700),
    new Coin(6000, 500),
    new Coin(7000, 800),
    new Coin(7500, 500),
    new Coin(8700, 400),
    new Coin(9500, 700),
    new Coin(10500, 700), //arc start
    new Coin(11500, 500), //brief arc
    new Coin(12500, 300), //peak
    new Coin(13500, 500), //arc down
    new Coin(14500, 700), //arc end
    new Coin(15500, 700),
    new Coin(14400, 600),
    new Coin(15000, 350),
    new Coin(16000, 350),
    new Coin(19000, 500),
  ];
}

const player = newImage("assets/brain-right.png");
player.style.display = "hidden";
const floor = document.getElementById("floor");
const floorHeight = parseInt(getComputedStyle(floor).height);
let score = 0; //set score to 0 at start
const coinSound = new Audio("assets/alarm shortencoin-get.wav");
coinSound.volume = 0.5; // Set the volume to 50%
let startTime = 0;
var menuMusic = new Audio("assets/menu-music.wav");
menuMusic.volume = 0.1; 
var sprintMusic = new Audio('assets/sprinting-music-fix.wav')
sprintMusic.volume = 0; //set sprint music to no volume, switch the volumes when they press e, win or lose
document.body.appendChild(menuMusic);
document.body.appendChild(sprintMusic);

let gameStart = false;
let isJumping = false;
let isCrouching = false;
let isMovingLeft = false;
let isFacingLeft = false;
let isMovingRight = false;
let isFacingRight = true;
let canDoubleJump = true; // try to make this one happen

const maxSpeed = 1; // Adjust maximum speed as needed
//defining character to change when moving

document.addEventListener("keydown", (event) => {
  if (event.key === "w" || event.key === " ") {
    // 'w' key or spacebar for jumping
    if (!isJumping && !isCrouching) {
      isJumping = true;
      jump();
    }
  } else if (event.key === "e") {
    // 'e' key to start gameg
    gameStart = true;
    startTime = performance.now();
    document.getElementById("menu").style.display = "none";
    player.style.display = "visible";
    menuStart();
    generateCoins();
    update();
  } else if (event.key === "s") {
    // 's' for crouching

    isCrouching = true;
    player.style.height = "100px";
    if (isFacingLeft) {
      player.src = "assets/crouch-brain-left.png";
    } else {
      player.src = "assets/crouch-brain-right.png";
      isFacingRight = true;
    }
  } else if (event.key === "a") {
    isMovingLeft = true;
    isFacingLeft = true;
    isFacingRight = false;
    isMovingRight = false;
    if (isCrouching) {
      player.src = "assets/crouch-brain-left.png";
    } else {
      player.src = "assets/fast-brain-left.png";
    }
    moveLeft();
  } else if (event.key === "d") {
    isMovingRight = true;
    isFacingRight = true;
    isFacingLeft = false;
    isMovingLeft = false;
    menuMusic.play();
    sprintMusic.play(); 
    if (isCrouching) {
      player.src = "assets/crouch-brain-right.png";
    } else {
      player.src = "assets/fast-brain-right.png";
    }
    moveRight();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "s") {
    // Restore player height when 's' key is released
    isCrouching = false;
    player.style.height = "200px";
    if (isMovingLeft) {
      player.src = "assets/fast-brain-left.png";
    } else if (isMovingRight) {
      player.src = "assets/fast-brain-right.png";
    } else if (isFacingLeft) {
      player.src = "assets/brain-left.png";
    } else {
      player.src = "assets/brain-right.png";
      isFacingRight = true;
    }
  } else if (event.key === "a") {
    // Stop moving left when 'a' key is released
    isMovingLeft = false;
    isFacingLeft = true;
    if (isCrouching) {
      player.src = "assets/crouch-brain-left.png";
    } else {
      player.src = "assets/brain-left.png";
    }
  } else if (event.key === "d") {
    // Stop moving right when 'd' key is released
    isMovingRight = false;
    isFacingRight = true;
    if (isCrouching) {
      player.src = "assets/crouch-brain-right.png";
    } else {
      player.src = "assets/brain-right.png";
    }
  }
});

function jump() {
  let initialHeight = parseInt(player.style.bottom) || 0;
  const jumpHeight = 300; // Adjust jump height as needed
  const jumpDuration = 1500; // Adjust jump duration as needed

  const startTime = Date.now();

  function animateJump() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / jumpDuration, 5);
    const height = initialHeight + jumpHeight * Math.sin(progress * Math.PI);
    player.style.bottom = height + "px";

    if (progress < 1) {
      requestAnimationFrame(animateJump);
    } else {
      isJumping = false;
      glideDown();
    }
  }

  animateJump();
}

function glideDown() {
  let currentHeight = parseInt(player.style.bottom) || 0;

  function animateGlide() {
    currentHeight -= 2; // Adjust glide speed as needed
    player.style.bottom = Math.min(currentHeight, floorHeight) + "px";

    if (currentHeight > floorHeight) {
      requestAnimationFrame(animateGlide);
    } else if (currentHeight < floorHeight) {
      //this fixes them going through the floor (idk why they did)
      player.style.bottom = "40px";
    }
  }

  animateGlide();
}

function moveLeft() {
  if (!isMovingLeft) return;
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.max(currentPosition - maxSpeed, 0); // Adjust maximum speed
  player.style.left = newPosition + "px";
  isFacingLeft = true;
  requestAnimationFrame(moveLeft);
}

function moveRight() {
  if (!isMovingRight) return;
  isFacingRight = true;
  const gameContainerWidth =
    document.getElementById("game-container").offsetWidth;
  const playerWidth = player.offsetWidth;
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.min(
    currentPosition + maxSpeed,
    gameContainerWidth - playerWidth
  ); // Adjust maximum speed
  player.style.left = newPosition + "px";
  requestAnimationFrame(moveRight);
}

function checkFloorCollisions() {
  const playerRect = player.getBoundingClientRect();
  const floorRect = floor.getBoundingClientRect();

  if (playerRect.bottom >= floorRect.top) {
    // Check if player is on the floor
    player.style.bottom = floorRect.height + 0 + "px"; // 20px is the height of the floor
  }
}

setInterval(checkFloorCollisions, 5); // Check collisions periodically

//coin entity and then score tracker
//coin entity should dissapear on collision with player
//should also move on a path
//add a sound later

class Coin {
  constructor(coinTime, yHeight) {
    this.coinTime = coinTime; // Start time of the coin
    this.y = yHeight; // initial Y height of the coin
    this.x = window.innerWidth; // Initial x position (start from the right edge of the window)
    this.width = 150; // Width of the coin
    this.height = 150; // Height of the coin
    this.speed = 5; // Speed at which the coin moves
    this.element = document.createElement("img"); // Create img element
    this.element.src = "assets/seratonin-coin.png"; // Source of the coin image
    this.element.style.position = "absolute"; // Set position to absolute
    this.element.style.width = this.width + "px"; // Set width
    this.element.style.height = this.height + "px"; // Set height
    this.element.style.top = this.y + "px"; // Set initial y position
    this.element.style.left = this.x + "px"; // Set initial x position
    document.body.appendChild(this.element); // Append coin element to the DOM
    this.collected = false;
  }

  move() {
    // Calculate elapsed time since the start time
    const now = performance.now();
    const startMovingTime = startTime + this.coinTime;
    const elapsedTime = performance.now() - startMovingTime;
    console.log({startMovingTime, elapsedTime, now});
    // Check if it's time for the coin to start moving
    if (elapsedTime >= 0) {
      // Move the coin to the left
      this.x -= this.speed;
      this.element.style.left = this.x + "px";

      // Check for collision with player
      if (
        this.x < player.offsetLeft + player.offsetWidth &&
        this.x + this.width > player.offsetLeft &&
        this.y < player.offsetTop + player.offsetHeight &&
        this.y + this.height > player.offsetTop
      ) {
        // Collision detected, remove the coin
        this.element.remove();
        return true; // Return true to indicate collision
      }

      // Check if the coin is out of the screen
      if (this.x + this.width < 0) {
        this.element.remove();
        return false; // Return false so no points
      }
    } //something might be extra here

    return false; // Return false to indicate no collision
  }
}

// Create a list of new coins with start time and starting y height (px from top)

//a menu where they have to press enter before the update function (gameloop) starts

function menuStart() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      // e to start game
      gameStart = true;
      menuMusic.volume = 0;
      sprintMusic.volume = 0.2;
      startTime = performance.now();
      document.getElementById("menu").style.display = "none";
    }
  });
}

// Update loop to move the coin
function update() {
  if (!gameStart) return;
  menuMusic.volume = 0;
  sprintMusic.volume = 0.1;
  for (const coin of coins) {
    const collided1 = coin.move();
    if (collided1 && !coin.collected) {
      // Handle collision, e.g., increase score
      score += 1;
      document.getElementById("score-value").textContent = score; // Update score display
      coin.collected = true; // Mark coin as collected
      console.log("Coin collected!");
      coinSound.play();
    }
  }
  const winCondition = score >= 20;
  if (winCondition) {
    victory();
  }
  const loseTime = performance.now() >= startTime + 22000;
  if (loseTime && !winCondition) {
     defeat();
  }
  requestAnimationFrame(update);
}

//add a win screen function
const winCondition = score >= 20;
function victory() {
  document.getElementById("win-screen").style.display = "flex";
}

function defeat() {
  document.getElementById("lose-screen").style.display = "flex";
}
