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

const clickedCells = new Set();

// Create the player and computer boards
createBoard(playerBoard, false);
createBoard(computerBoard, true);

const ships = document.querySelectorAll('.ship');

ships.forEach((ship) => {
  const draggableShip = ship as HTMLElement;
  draggableShip.draggable = true;
  draggableShip.dataset.shipId = draggableShip.id;
  draggableShip.dataset.shipOrientation = draggableShip.classList.contains(
    'horizontal'
  )
    ? 'horizontal'
    : 'vertical';

  draggableShip.addEventListener('dragstart', (e: DragEvent) => {
    if (e.dataTransfer) {
      // Pass both ship ID and orientation as data
      e.dataTransfer.setData(
        'text/plain',
        `${draggableShip.id}:${draggableShip.dataset.shipOrientation}`
      );
    }
  });
});

const cells = document.querySelectorAll('.board-cell');

cells.forEach((cell) => {
  cell.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  cell.addEventListener('drop', (e) => {
    e.preventDefault();
    const shipData = (e as DragEvent).dataTransfer?.getData('text/plain') || '';
    const [shipId, shipOrientation] = shipData.split(':'); // Split ID and orientation
    console.log(shipOrientation);
    const ship = document.getElementById(shipId);

    if (ship) {
      const shipLength = parseInt(
        ship.getAttribute('data-ship-length') || '0',
        10
      );
      const row = parseInt((cell as HTMLElement).dataset.x || '0', 10); // Use the dropped cell's row
      const col = parseInt((cell as HTMLElement).dataset.y || '0', 10); // Use the dropped cell's column

      const ship_ = new Ship(shipLength);
      if (
        playerGameboard.validPlacement(
          ship_,
          row,
          col,
          shipOrientation === 'vertical'
        )
      ) {
        cell.appendChild(ship);

        playerGameboard.placeShip(
          new Ship(shipLength),
          row,
          col,
          shipOrientation === 'vertical'
        );
      } else {
        alert('Invalid ship placement');
      }
      // Uncomment the following line to hide the ship after placement
      // ship.style.display = 'none';
    }
  });
});

// Add event listeners to computer's board cells
computerBoard.querySelectorAll('.board div').forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (!playerGameboard.allShipsSunk() && !computerGameboard.allShipsSunk()) {
      const x = Math.floor(index / boardSize);
      const y = index % boardSize;

      // Check if the cell has already been clicked
      if (!clickedCells.has(`${x}-${y}`)) {
        player.makeMove(computerGameboard, x, y);
        updateBoard(computerBoard, computerGameboard, false);
        computerTurn();
        clickedCells.add(`${x}-${y}`); // Mark the cell as clicked
      }
    }
  });
});

// Handle computer's turn
function computerTurn() {
  if (!playerGameboard.allShipsSunk() && !computerGameboard.allShipsSunk()) {
    computer.makeRandomMove(playerGameboard, boardSize);
    updateBoard(playerBoard, playerGameboard, true);
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

function getRandomCoordinates(shipLength: number) {
  const horizontal = Math.random() < 0.5; // Randomly choose horizontal or vertical placement
  let x, y;

  if (horizontal) {
    x = Math.floor(Math.random() * (boardSize - shipLength + 1));
    y = Math.floor(Math.random() * boardSize);
  } else {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * (boardSize - shipLength + 1));
  }

  return { x, y, horizontal };
}

function addRandomShipsToGameboard(gameboard: Gameboard) {
  const shipLengths = [5, 4, 3, 3, 2];
  shipLengths.forEach((shipLength) => {
    let coordinates, x, y, horizontal, shipFits;

    do {
      coordinates = getRandomCoordinates(shipLength);
      ({ x, y, horizontal } = coordinates);
      shipFits = true;

      // Check if the ship fits in the selected location without overlapping
      for (let i = 0; i < shipLength; i++) {
        if (horizontal) {
          if (gameboard.getShipAt(x + i, y) !== null) {
            shipFits = false;
            break;
          }
        } else {
          if (gameboard.getShipAt(x, y + i) !== null) {
            shipFits = false;
            break;
          }
        }
      }
    } while (!shipFits);
    gameboard.placeShip(new Ship(shipLength), x, y, horizontal);
  });
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

  if (!isPlayer) {
    addRandomShipsToGameboard(computerGameboard);
    // Add
  }
}
