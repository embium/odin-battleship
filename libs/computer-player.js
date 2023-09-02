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
