const player = document.getElementById('player');
const floor = document.getElementById('floor');

let isJumping = false;
let isCrouching = false;

document.addEventListener('keydown', (event) => {
  if (event.key === 'w' || event.key === ' ') { // 'w' key or spacebar for jumping
    if (!isJumping && !isCrouching) {
      isJumping = true;
      player.classList.add('jump');
      setTimeout(() => {
        player.classList.remove('jump');
        isJumping = false;
      }, 500);
    }
  } else if (event.key === 's') { // 's' key for crouching
    if (!isCrouching) {
      isCrouching = true;
      player.style.height = '50px';
    }
  } else if (event.key === 'a') { // 'a' key for moving left
    moveLeft();
  } else if (event.key === 'd') { // 'd' key for moving right
    moveRight();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 's') { // Restore player height when 's' key is released
    isCrouching = false;
    player.style.height = '100px';
  }
});

function moveLeft() {
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.max(currentPosition - 10, 0);
  player.style.left = newPosition + 'px';
}

function moveRight() {
  const gameContainerWidth = document.getElementById('game-container').offsetWidth;
  const playerWidth = player.offsetWidth;
  const currentPosition = parseInt(player.style.left) || 0;
  const newPosition = Math.min(currentPosition + 10, gameContainerWidth - playerWidth);
  player.style.left = newPosition + 'px';
}

function checkCollisions() {
  const playerRect = player.getBoundingClientRect();
  const floorRect = floor.getBoundingClientRect();

  if (playerRect.bottom >= floorRect.top) { // Check if player is on the floor
    player.style.bottom = (floorRect.height + 20) + 'px'; // 20px is the height of the floor
  }
}

setInterval(checkCollisions, 10); // Check collisions periodically
