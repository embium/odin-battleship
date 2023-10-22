(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("./player"));
class ComputerPlayer extends player_1.default {
    makeRandomMove(gameboard, boardSize) {
        const x = Math.floor(Math.random() * boardSize);
        const y = Math.floor(Math.random() * boardSize);
        this.makeMove(gameboard, x, y);
    }
}
exports.default = ComputerPlayer;

},{"./player":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gameboard {
    constructor(boardSize) {
        this.grid = [];
        this.ships = [];
        this.missedAttacks = [];
        this.successfulAttacks = [];
        for (let i = 0; i < boardSize; i++) {
            this.grid[i] = [];
            for (let j = 0; j < boardSize; j++) {
                this.grid[i][j] = null;
            }
        }
    }
    removeShip(length, x, y, horizontal) {
        for (let i = 0; i < length; i++) {
            if (horizontal) {
                this.grid[x + i][y] = null;
            }
            else {
                this.grid[x][y + i] = null;
            }
        }
    }
    placeShip(ship, x, y, horizontal) {
        for (let i = 0; i < ship.getLength(); i++) {
            if (horizontal) {
                this.grid[y][x + i] = ship;
            }
            else {
                this.grid[x + i][y] = ship;
            }
        }
        this.ships.push(ship);
    }
    getShips() {
        return this.ships;
    }
    validPlacement(ship, x, y, horizontal) {
        console.log(this.grid[0]);
        if (x < 0 ||
            x >= this.grid.length ||
            y < 0 ||
            y >= this.grid[0].length ||
            (horizontal && x + ship.getLength() > this.grid.length) ||
            (!horizontal && y + ship.getLength() > this.grid[x].length)) {
            console.log('wrong 1');
            return false;
        }
        for (let i = 0; i < ship.getLength(); i++) {
            if (horizontal) {
                if (this.grid[x][y + i] !== null) {
                    console.log('wrong 2');
                    return false;
                }
            }
            else {
                if (this.grid[x + i][y] !== null) {
                    console.log('wrong 3');
                    return false;
                }
            }
        }
        return true;
    }
    receiveAttack(x, y) {
        if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
            throw new Error('Invalid attack coordinates');
        }
        if (this.grid[x][y] === null) {
            this.missedAttacks.push([x, y]);
        }
        else {
            this.successfulAttacks.push([x, y]);
            const ship = this.grid[x][y];
            ship.hit();
            this.grid[x][y] = null;
        }
    }
    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
    getShipAt(x, y) {
        if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
            throw new Error('Invalid coordinates');
        }
        return this.grid[x][y];
    }
    getMissedAttackAt(x, y) {
        return this.missedAttacks.some(([missedX, missedY]) => missedX === x && missedY === y);
    }
    getSuccessfulAttackAt(x, y) {
        return this.successfulAttacks.some(([hitX, hitY]) => hitX === x && hitY === y);
    }
}
exports.default = Gameboard;

},{}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameboard_1 = __importDefault(require("./gameboard"));
const player_1 = __importDefault(require("./player"));
const computer_player_1 = __importDefault(require("./computer-player"));
const ship_1 = __importDefault(require("./ship"));
const boardSize = 10;
const playerGameboard = new gameboard_1.default(boardSize);
const computerGameboard = new gameboard_1.default(boardSize);
const player = new player_1.default(playerGameboard);
const computer = new computer_player_1.default(computerGameboard);
const playerBoard = document.getElementById('player-board');
const computerBoard = document.getElementById('computer-board');
const messageElement = document.getElementById('message');
const clickedCells = new Set();
// Create the player and computer boards
createBoard(playerBoard, false);
createBoard(computerBoard, true);
const ships = document.querySelectorAll('.ship');
ships.forEach((ship) => {
    const draggableShip = ship;
    draggableShip.draggable = true;
    draggableShip.dataset.shipId = draggableShip.id;
    draggableShip.dataset.shipOrientation = draggableShip.classList.contains('horizontal')
        ? 'horizontal'
        : 'vertical';
    // Add a click event listener to the "Flip All Ships" button
    draggableShip.dataset.placed = 'false';
    draggableShip.addEventListener('dragstart', (e) => {
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
            const draggableShip = ship;
            // Check if the ship has not been placed
            if (draggableShip.dataset.placed === 'false') {
                const currentOrientation = draggableShip.dataset.shipOrientation;
                // Toggle the ship's orientation
                const newOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
                // Rotate the ship by changing its style
                if (newOrientation === 'horizontal') {
                    draggableShip.style.transform = 'rotate(90deg)';
                }
                else {
                    draggableShip.style.transform = 'rotate(0deg)';
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
        var _a;
        e.preventDefault();
        const shipId = ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain')) || '';
        const ship = document.getElementById(shipId);
        if (ship) {
            const shipOrientation = ship.dataset.shipOrientation;
            const shipLength = parseInt(ship.dataset.shipLength || '0', 10);
            if (ship.dataset.placed === 'true') {
                playerGameboard.removeShip(shipLength, parseInt(ship.dataset.x || '0', 0), parseInt(ship.dataset.y || '0', 0), shipOrientation === 'horizontal');
            }
            if (shipOrientation === 'horizontal') {
                const cellWidth = 42;
                const newLeft = shipLength * cellWidth;
                ship.style.left = `${newLeft}px`;
                ship.style.transformOrigin = 'top left';
            }
            const row = parseInt(cell.dataset.x || '0', 10); // Use the dropped cell's row
            const col = parseInt(cell.dataset.y || '0', 10); // Use the dropped cell's column
            const ship_ = new ship_1.default(shipLength);
            if (playerGameboard.validPlacement(ship_, row, col, shipOrientation === 'horizontal')) {
                cell.appendChild(ship);
                playerGameboard.placeShip(new ship_1.default(shipLength), row, col, shipOrientation === 'horizontal');
                ship.dataset.x = row.toString();
                ship.dataset.y = col.toString();
                ship.dataset.placed = 'true';
            }
            else {
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
        if (playerGameboard.getShips().length !== 5)
            return;
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
function updateBoard(boardElement, gameboard, isPlayer) {
    const board = Array.from(boardElement.querySelectorAll('.board-cell'));
    board.forEach((cell, index) => {
        const x = parseInt(cell.dataset.x || '0', 10);
        const y = parseInt(cell.dataset.y || '0', 10);
        const ship = gameboard.getShipAt(x, y);
        if (gameboard.getSuccessfulAttackAt(x, y)) {
            cell.textContent = 'X'; // Display a "hit" marker
        }
        else if (ship === null) {
            // If there is no ship at this position
            if (gameboard.getMissedAttackAt(x, y)) {
                cell.textContent = 'M'; // Display a "miss" marker
            }
            else {
                cell.textContent = ''; // Clear the cell
            }
        }
        else if (ship.isSunk()) {
            cell.textContent = 'X'; // Display a "sunk" marker
        }
        else if (isPlayer) {
            cell.textContent = 'S'; // Display a "ship" marker for the player's board
        }
        else {
            cell.textContent = ''; // Clear the cell on the computer's board
        }
    });
    if (gameboard.allShipsSunk()) {
        if (!isPlayer) {
            messageElement.textContent = 'You win!';
        }
        else {
            messageElement.textContent = 'Computer wins!';
        }
    }
}
function getRandomCoordinates(shipLength) {
    const horizontal = Math.random() < 0.5; // Randomly choose horizontal or vertical placement
    let x, y;
    if (horizontal) {
        x = Math.floor(Math.random() * (boardSize - shipLength + 1));
        y = Math.floor(Math.random() * boardSize);
    }
    else {
        x = Math.floor(Math.random() * boardSize);
        y = Math.floor(Math.random() * (boardSize - shipLength + 1));
    }
    return { x, y, horizontal };
}
function addRandomShipsToGameboard(gameboard) {
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach((shipLength) => {
        let coordinates, x, y, horizontal, shipFits;
        const ship = new ship_1.default(shipLength);
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
function createBoard(boardElement, isPlayer) {
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

},{"./computer-player":1,"./gameboard":2,"./player":4,"./ship":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(gameboard) {
        this.gameboard = gameboard;
    }
    makeMove(gameboard, x, y) {
        gameboard.receiveAttack(x, y);
    }
}
exports.default = Player;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ship class
class Ship {
    constructor(length) {
        this.hits = 0;
        this._hit = false;
        this.length = length;
    }
    hit() {
        this.hits++;
    }
    isSunk() {
        return this.hits === this.length;
    }
    getLength() {
        return this.length;
    }
    isHit() {
        return this._hit;
    }
}
exports.default = Ship;

},{}]},{},[3]);
