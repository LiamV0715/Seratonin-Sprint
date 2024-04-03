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

const player = newImage("assets/brain-right.png");
const floor = document.getElementById("floor");
let score = 0; //set score to 0 at start

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
  const jumpHeight = 150; // Adjust jump height as needed
  const jumpDuration = 2000; // Adjust jump duration as needed

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
  const floorHeight = "40px" || 0;
  let currentHeight = parseInt(player.style.bottom) || 0;

  function animateGlide() {
    currentHeight -= 2; // Adjust glide speed as needed
    player.style.bottom = Math.min(currentHeight, floorHeight) + "px";

    if (currentHeight > 0) {
      requestAnimationFrame(animateGlide);
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

class Coin {
  constructor(startTime, yHeight) {
    this.startTime = startTime; // Start time of the coin
    this.y = yHeight; // Y height of the coin
    this.x = window.innerWidth; // Initial x position (start from the right edge of the window)
    this.width = 150; // Width of the coin
    this.height = 150; // Height of the coin
    this.speed = 3; // Speed at which the coin moves
    this.element = document.createElement("img"); // Create img element
    this.element.src = "assets/seratonin-coin.png"; // Source of the coin image
    this.element.style.position = "absolute"; // Set position to absolute
    this.element.style.width = this.width + "px"; // Set width
    this.element.style.height = this.height + "px"; // Set height
    this.element.style.top = this.y + "px"; // Set initial y position
    this.element.style.left = this.x + "px"; // Set initial x position
    document.body.appendChild(this.element); // Append coin element to the DOM
    this.collected = false
  }

  move(currentTime) {
    // Calculate elapsed time since the start time
    const elapsedTime = currentTime - this.startTime;

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
    }

    return false; // Return false to indicate no collision
  }
}

// Usage example:
// Create a new coin with start time 0 and y height 200
const coin1 = new Coin(200, 600);
const coin2 = new Coin(1000, 500); // Adjusted start time for coin2

// Update loop to move the coin
function update(currentTime) {
  // Move coin1
  const collided1 = coin1.move(currentTime);
  if (collided1 && !coin1.collected) {
    // Handle collision, e.g., increase score
    score++; // Increase score
    document.getElementById("score-value").textContent = score; // Update score display
    coin1.collected = true; // Mark coin as collected
    console.log("Coin 1 collected!");
  }

  // Move coin2
  const collided2 = coin2.move(currentTime);
  if (collided2 && !coin2.collected) {
    // Handle collision, e.g., increase score
    score++; // Increase score
    document.getElementById("score-value").textContent = score; // Update score display
    coin2.collected = true; // Mark coin as collected
    console.log("Coin 2 collected!");
  }
  requestAnimationFrame(update);
}

// Start the update loop
requestAnimationFrame(update);

// }) else (!isLoaded) {
//  display.canvas1 = 'visible'
// }
