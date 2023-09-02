import Gameboard from './gameboard';

class Player {
  constructor(private gameboard: Gameboard) {}

  makeMove(gameboard: Gameboard, x: number, y: number) {
    gameboard.receiveAttack(x, y);
  }
}

export default Player;
