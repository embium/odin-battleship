import Gameboard from './gameboard';
import Player from './player';
import ComputerPlayer from './computer-player';
import Ship from './ship';

const boardSize = 10;
const playerGameboard = new Gameboard(boardSize);
const computerGameboard = new Gameboard(boardSize);
const player = new Player(playerGameboard);
const computer = new ComputerPlayer(computerGameboard);

const playerBoard = document.getElementById('player-board')!;
const computerBoard = document.getElementById('computer-board')!;
const messageElement = document.getElementById('message')!;

// Create the player and computer boards
createBoard(playerBoard, false);
createBoard(computerBoard, true);

// Add event listeners to computer's board cells
computerBoard.querySelectorAll('.board div').forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (!playerGameboard.allShipsSunk() && !computerGameboard.allShipsSunk()) {
      const x = Math.floor(index / boardSize);
      const y = index % boardSize;
      player.makeMove(computerGameboard, x, y);
      updateBoard(computerBoard, computerGameboard, false);
      computerTurn();
    }
  });
});

// Handle computer's turn
function computerTurn() {
  if (!playerGameboard.allShipsSunk() && !computerGameboard.allShipsSunk()) {
    computer.makeRandomMove(playerGameboard, boardSize);
    updateBoard(playerBoard, playerGameboard, true);

    //if (!playerGameboard.allShipsSunk()) {
    //  setTimeout(computerTurn, 1000);
    //}
  }
}

// Update the game boards
function updateBoard(
  boardElement: HTMLElement,
  gameboard: Gameboard,
  isPlayer: boolean
) {
  const board = Array.from(boardElement.querySelectorAll('.board-cell'));

  board.forEach((cell, index) => {
    const x = parseInt((cell as HTMLElement).dataset.x || '0', 10);
    const y = parseInt((cell as HTMLElement).dataset.y || '0', 10);
    const ship = gameboard.getShipAt(x, y);

    if (gameboard.getSuccessfulAttackAt(x, y)) {
      cell.textContent = 'X'; // Display a "hit" marker
    } else if (ship === null) {
      // If there is no ship at this position
      if (gameboard.getMissedAttackAt(x, y)) {
        cell.textContent = 'M'; // Display a "miss" marker
      } else {
        cell.textContent = ''; // Clear the cell
      }
    } else if (ship.isSunk()) {
      cell.textContent = 'X'; // Display a "sunk" marker
    } else if (isPlayer) {
      cell.textContent = 'S'; // Display a "ship" marker for the player's board
    } else {
      cell.textContent = ''; // Clear the cell on the computer's board
    }
  });

  if (gameboard.allShipsSunk()) {
    if (!isPlayer) {
      messageElement.textContent = 'You win!';
    } else {
      messageElement.textContent = 'Computer wins!';
    }
  }
}

// Create the game boards
function createBoard(boardElement: HTMLElement, isPlayer: boolean) {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement('div');
      cell.dataset.x = x.toString();
      cell.dataset.y = y.toString();
      cell.classList.add('board-cell'); // Change to 'board-cell' for consistency
      if (!isPlayer) {
        cell.classList.add('computer-cell');
      }
      boardElement.appendChild(cell);
    }
  }

  // Place ships on the board as needed
  if (isPlayer) {
    // Example: Place player's ships
    playerGameboard.placeShip(new Ship(3), 0, 0, true);
    playerGameboard.placeShip(new Ship(4), 2, 3, false);
    // Add more ships as needed
  } else {
    // Example: Place computer's ships
    computerGameboard.placeShip(new Ship(3), 1, 1, true);
    computerGameboard.placeShip(new Ship(4), 4, 5, false);
    // Add
  }
}
