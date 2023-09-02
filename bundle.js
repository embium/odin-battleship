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
    placeShip(ship, x, y, horizontal) {
        if (x < 0 ||
            x >= this.grid.length ||
            y < 0 ||
            y >= this.grid[0].length ||
            (horizontal && x + ship.getLength() > this.grid.length) ||
            (!horizontal && y + ship.getLength() > this.grid[0].length)) {
            throw new Error('Invalid ship placement');
        }
        for (let i = 0; i < ship.getLength(); i++) {
            if (horizontal) {
                if (this.grid[x + i][y] !== null) {
                    throw new Error('Ship overlap');
                }
                this.grid[x + i][y] = ship;
            }
            else {
                if (this.grid[x][y + i] !== null) {
                    throw new Error('Ship overlap');
                }
                this.grid[x][y + i] = ship;
            }
        }
        this.ships.push(ship);
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
    // Place ships on the board as needed
    if (isPlayer) {
        // Example: Place player's ships
        playerGameboard.placeShip(new ship_1.default(3), 0, 0, true);
        playerGameboard.placeShip(new ship_1.default(4), 2, 3, false);
        // Add more ships as needed
    }
    else {
        // Example: Place computer's ships
        computerGameboard.placeShip(new ship_1.default(3), 1, 1, true);
        computerGameboard.placeShip(new ship_1.default(4), 4, 5, false);
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
