const gridSize = 4;
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
let board = [];
let score = 0;

// Initialize game board
function initializeBoard() {
  board = [];
  score = 0; // Reset the score when starting a new game
  updateScore();
  messageDisplay.textContent = '';
  for (let i = 0; i < gridSize; i++) {
    board[i] = [];
    for (let j = 0; j < gridSize; j++) {
      board[i][j] = 0;
    }
  }
  addNewTile();
  addNewTile();
  updateBoard();
}


// Add a new tile at a random empty position
function addNewTile() {
  const emptyTiles = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push([i, j]);
      }
    }
  }
  if (emptyTiles.length > 0) {
    const randomPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomPos[0]][randomPos[1]] = value;
  }
}
// Update the score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}
// Update the board display
function updateBoard() {
  gameContainer.innerHTML = '';
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = document.createElement('div');
      const value = board[i][j];
      tile.classList.add('tile');
      if (value > 0) {
        tile.classList.add(`tile-${value}`);
        tile.textContent = value;
      }
      gameContainer.appendChild(tile);
    }
  }
  updateScore(); // Update the displayed score
  if (isGameOver()) {
    messageDisplay.textContent = 'You Lose!';
  }
}

// Update the score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Handle movement logic
function move(direction) {
  if (messageDisplay.textContent === 'You Lose!') return; // Prevent moves after losing
  let moved = false;
  switch (direction) {
    case 'up':
      moved = moveUp();
      break;
    case 'down':
      moved = moveDown();
      break;
    case 'left':
      moved = moveLeft();
      break;
    case 'right':
      moved = moveRight();
      break;
  }
  if (moved) {
    addNewTile();
    updateBoard();
  }
}

// Combine tiles and move up
function moveUp() {
  let moved = false;
  for (let col = 0; col < gridSize; col++) {
    let newColumn = [];
    for (let row = 0; row < gridSize; row++) {
      if (board[row][col] !== 0) {
        newColumn.push(board[row][col]);
      }
    }
    newColumn = merge(newColumn);
    for (let row = 0; row < gridSize; row++) {
      if (newColumn[row] !== undefined) {
        if (board[row][col] !== newColumn[row]) moved = true;
        board[row][col] = newColumn[row];
      } else {
        board[row][col] = 0;
      }
    }
  }
  return moved;
}

// Combine tiles and move down
function moveDown() {
  let moved = false;
  for (let col = 0; col < gridSize; col++) {
    let newColumn = [];
    for (let row = gridSize - 1; row >= 0; row--) {
      if (board[row][col] !== 0) {
        newColumn.push(board[row][col]);
      }
    }
    newColumn = merge(newColumn);
    for (let row = gridSize - 1; row >= 0; row--) {
      if (newColumn[gridSize - 1 - row] !== undefined) {
        if (board[row][col] !== newColumn[gridSize - 1 - row]) moved = true;
        board[row][col] = newColumn[gridSize - 1 - row];
      } else {
        board[row][col] = 0;
      }
    }
  }
  return moved;
}

// Combine tiles and move left
function moveLeft() {
  let moved = false;
  for (let row = 0; row < gridSize; row++) {
    let newRow = [];
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] !== 0) {
        newRow.push(board[row][col]);
      }
    }
    newRow = merge(newRow);
    for (let col = 0; col < gridSize; col++) {
      if (newRow[col] !== undefined) {
        if (board[row][col] !== newRow[col]) moved = true;
        board[row][col] = newRow[col];
      } else {
        board[row][col] = 0;
      }
    }
  }
  return moved;
}

// Combine tiles and move right
function moveRight() {
  let moved = false;
  for (let row = 0; row < gridSize; row++) {
    let newRow = [];
    for (let col = gridSize - 1; col >= 0; col--) {
      if (board[row][col] !== 0) {
        newRow.push(board[row][col]);
      }
    }
    newRow = merge(newRow);
    for (let col = gridSize - 1; col >= 0; col--) {
      if (newRow[gridSize - 1 - col] !== undefined) {
        if (board[row][col] !== newRow[gridSize - 1 - col]) moved = true;
        board[row][col] = newRow[gridSize - 1 - col];
      } else {
        board[row][col] = 0;
      }
    }
  }
  return moved;
}

// Merge tiles
function merge(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = undefined;
      i++;
    }
  }
  return arr.filter(val => val !== undefined);
}

// Check if game is over
function isGameOver() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === 0) return false; // Empty tile exists
      if (
        (i > 0 && board[i][j] === board[i - 1][j]) || // Check above
        (i < gridSize - 1 && board[i][j] === board[i + 1][j]) || // Check below
        (j > 0 && board[i][j] === board[i][j - 1]) || // Check left
        (j < gridSize - 1 && board[i][j] === board[i][j + 1]) // Check right
      ) {
        return false; // Mergeable tiles exist
      }
    }
  }
  return true;
}

// Listen for key presses to move tiles
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
  }
});

// Restart game on retry button click
document.getElementById('retry-button').addEventListener('click', initializeBoard);

// Initialize the game
initializeBoard();
