import Gameboard from './gameboard';
import Player from './player';

class ComputerPlayer extends Player {
  makeRandomMove(gameboard: Gameboard, boardSize: number) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    this.makeMove(gameboard, x, y);
  }
}

export default ComputerPlayer;
