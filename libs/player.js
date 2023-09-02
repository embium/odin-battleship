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
