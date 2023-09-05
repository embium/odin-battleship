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

  // Add a click event listener to the "Flip All Ships" button
  draggableShip.dataset.placed = 'false';
  draggableShip.addEventListener('dragstart', (e: DragEvent) => {
    if (e.dataTransfer) {
      // Pass both ship ID and orientation as data
      e.dataTransfer.setData('text/plain', `${draggableShip.id}`);
    }
  });
});

const flipShipsButton = document.getElementById('flip-ships-button');
if (flipShipsButton) {
  flipShipsButton.addEventListener('click', () => {
    ships.forEach((ship) => {
      const draggableShip = ship as HTMLElement;

      // Check if the ship has not been placed
      if (draggableShip.dataset.placed === 'false') {
        const currentOrientation = draggableShip.dataset.shipOrientation;

        // Toggle the ship's orientation
        const newOrientation =
          currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';

        // Rotate the ship by changing its style
        if (newOrientation === 'vertical') {
          draggableShip.style.transform = 'rotate(0deg)';
        } else {
          draggableShip.style.transform = 'rotate(90deg)';
        }

        // Update the dataset attribute
        draggableShip.dataset.shipOrientation = newOrientation;
      }
    });
  });
}

const cells = document.querySelectorAll('.board-cell');

cells.forEach((cell) => {
  cell.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  cell.addEventListener('drop', (e) => {
    e.preventDefault();

    const shipId = (e as DragEvent).dataTransfer?.getData('text/plain') || '';
    const ship = document.getElementById(shipId);
    if (ship) {
      if (ship.dataset.placed === 'true') return;
      const shipOrientation = ship.dataset.shipOrientation;
      const shipLength = parseInt(ship.dataset.shipLength || '0', 10);

      /*
        left: 216px;
  transform-origin: top left;
  */
      if (shipOrientation === 'horizontal') {
        const cellWidth = 42;
        const newLeft = shipLength * cellWidth;
        ship.style.left = `${newLeft}px`;
        ship.style.transformOrigin = 'top left';
      }

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
        ship.dataset.placed = 'true';
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

    const ship = new Ship(shipLength);
    do {
      coordinates = getRandomCoordinates(shipLength);
      ({ x, y, horizontal } = coordinates);
      shipFits = true;

      shipFits = gameboard.validPlacement(ship, x, y, !horizontal);
    } while (!shipFits);
    console.log(ship, x, y);
    gameboard.placeShip(ship, x, y, !horizontal);
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
