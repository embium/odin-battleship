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
