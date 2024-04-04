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
player.style.display = "hidden";
const floor = document.getElementById("floor");
let score = 0; //set score to 0 at start
const coinSound = new Audio("assets/alarm shortencoin-get.wav");
coinSound.volume = 0.5; // Set the volume to 50%

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
  } else if (event.key === 'e') {
    // 'w' key or spacebar for jumping
    gameStart = true;
    document.getElementById("menu").style.display = "none";
    player.style.display = 'visible';
    menuStart();
    currentTime = 0 ;
    elapsedTime = 0 ;
    requestAnimationFrame(update);
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
  const floorHeight = "40px" || 0;
  let currentHeight = parseInt(player.style.bottom) || 0;

  function animateGlide() {
    currentHeight -= 2; // Adjust glide speed as needed
    player.style.bottom = Math.min(currentHeight, floorHeight) + "px";

    if (currentHeight > floorHeight) {
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
//add a sound later

class Coin {
  constructor(startTime, yHeight) {
    this.startTime = startTime; // Start time of the coin
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
const coin1 = new Coin(100, 600);
const coin2 = new Coin(1000, 500); // Adjusted start time for coin2
const coin3 = new Coin(3000, 700);
const coin4 = new Coin(4200, 400);
const coin5 = new Coin(5000, 500);
const coin6 = new Coin(5500, 600);
const coin7 = new Coin(6000, 700);
const coin8 = new Coin(6000, 500);
const coin9 = new Coin(6500, 800);
const coin10 = new Coin(40200, 500);
const coin11 = new Coin(45000, 600);
const coin12 = new Coin(50000, 500);
const coin13 = new Coin(10000, 600); //arc start
const coin14 = new Coin(10050, 400); //brief arc
const coin15 = new Coin(10100, 300); //peak
const coin16 = new Coin(10150, 400); //arc down
const coin17 = new Coin(10200, 600); //arc end
const coin18 = new Coin(103000, 500);
const coin19 = new Coin(103250, 600);
const coin20 = new Coin(64000, 500);
const coin21 = new Coin(64500, 600);
const coin22 = new Coin(68000, 500);

//a menu where they have to press enter before the update function (gameloop) starts

function menuStart() {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      // 'w' key or spacebar for jumping
      gameStart = true;
      ocument.getElementById("menu").style.display = "none";
    }
  });
}

// Update loop to move the coin
function update(currentTime) {
  // Move coin1
  const collided1 = coin1.move(currentTime);
  if (collided1 && !coin1.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin1.collected = true; // Mark coin as collected
    console.log("Coin 1 collected!");
    coinSound.play();
  }

  // Move coin2
  const collided2 = coin2.move(currentTime);
  if (collided2 && !coin2.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin2.collected = true; // Mark coin as collected
    console.log("Coin 2 collected!");
    coinSound.play();
  }
  const collided3 = coin3.move(currentTime);
  if (collided3 && !coin3.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin3.collected = true; // Mark coin as collected
    console.log("Coin 3 collected!");
    coinSound.play();
  }

  const collided4 = coin4.move(currentTime);
  if (collided4 && !coin4.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin4.collected = true; // Mark coin as collected
    console.log("Coin 4 collected!");
    coinSound.play();
  }
  const collided5 = coin5.move(currentTime);
  if (collided5 && !coin5.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin5.collected = true; // Mark coin as collected
    console.log("Coin 5 collected!");
    coinSound.play();
  }
  const collided6 = coin6.move(currentTime);
  if (collided6 && !coin6.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin6.collected = true; // Mark coin as collected
    console.log("Coin 6 collected!");
    coinSound.play();
  }
  const collided7 = coin7.move(currentTime);
  if (collided7 && !coin7.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin7.collected = true; // Mark coin as collected
    console.log("Coin 7 collected!");
    coinSound.play();
  }

  const collided8 = coin8.move(currentTime);
  if (collided8 && !coin8.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin8.collected = true; // Mark coin as collected
    console.log("Coin 8 collected!");
    coinSound.play();
  }
  const collided9 = coin9.move(currentTime);
  if (collided9 && !coin9.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin9.collected = true; // Mark coin as collected
    console.log("Coin 9 collected!");
    coinSound.play();
  }

  const collided10 = coin10.move(currentTime);
  if (collided10 && !coin10.collected) {
    // Handle collision, e.g., increase score
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin10.collected = true; // Mark coin as collected
    console.log("Coin 10 collected!");
    coinSound.play();
  }
  const collided11 = coin11.move(currentTime);
  if (collided11 && !coin11.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score; // Update score display
    coin11.collected = true; // Mark coin as collected
    console.log("Coin 11 collected!");
    coinSound.play();
  }
  const collided12 = coin12.move(currentTime);
  if (collided12 && !coin12.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin12.collected = true;
    console.log("Coin 12 collected!");
    coinSound.play();
  }
  const collided13 = coin13.move(currentTime);
  if (collided13 && !coin13.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin13.collected = true;
    console.log("Coin 13 collected!");
    coinSound.play();
  }
  const collided14 = coin14.move(currentTime);
  if (collided14 && !coin14.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin14.collected = true;
    console.log("Coin 14 collected!");
    coinSound.play();
  }
  const collided15 = coin15.move(currentTime);
  if (collided15 && !coin15.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin15.collected = true; // Mark coin as collected
    console.log("Coin 15 collected!");
    coinSound.play();
  }
  const collided16 = coin16.move(currentTime);
  if (collided16 && !coin16.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin16.collected = true; // Mark coin as collected
    console.log("Coin 16 collected!");
    coinSound.play();
  }
  const collided17 = coin17.move(currentTime);
  if (collided17 && !coin17.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin17.collected = true; // Mark coin as collected
    console.log("Coin 17 collected!");
    coinSound.play();
  }
  const collided18 = coin18.move(currentTime);
  if (collided18 && !coin18.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin18.collected = true; // Mark coin as collected
    console.log("Coin 18 collected!");
    coinSound.play();
  }
  const collided19 = coin19.move(currentTime);
  if (collided19 && !coin19.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin19.collected = true;
    console.log("Coin 19 collected!");
    coinSound.play();
  }
  const collided20 = coin20.move(currentTime);
  if (collided20 && !coin20.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin20.collected = true;
    console.log("Coin 20 collected!");
    coinSound.play();
  }
  const collided21 = coin21.move(currentTime);
  if (collided21 && !coin21.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin21.collected = true;
    console.log("Coin 21 collected!");
    coinSound.play();
  }
  const collided22 = coin22.move(currentTime);
  if (collided22 && !coin22.collected) {
    score += 1;
    document.getElementById("score-value").textContent = score;
    coin22.collected = true; // Mark coin as collected
    console.log("Coin 22 collected!");
    coinSound.play();
  }
  requestAnimationFrame(update);
}
// Start the update loop


// }) else (!isLoaded) {
//  display.canvas1 = 'visible'
// }
