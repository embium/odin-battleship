import Ship from './ship';

class Gameboard {
  private grid: (Ship | null)[][] = [];
  private ships: Ship[] = [];
  private missedAttacks: [number, number][] = [];
  private successfulAttacks: [number, number][] = [];

  constructor(boardSize: number) {
    for (let i = 0; i < boardSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < boardSize; j++) {
        this.grid[i][j] = null;
      }
    }
  }

  placeShip(ship: Ship, x: number, y: number, horizontal: boolean) {
    if (
      x < 0 ||
      x >= this.grid.length ||
      y < 0 ||
      y >= this.grid[0].length ||
      (horizontal && x + ship.getLength() > this.grid.length) ||
      (!horizontal && y + ship.getLength() > this.grid[0].length)
    ) {
      throw new Error('Invalid ship placement');
    }

    for (let i = 0; i < ship.getLength(); i++) {
      if (horizontal) {
        if (this.grid[x + i][y] !== null) {
          throw new Error('Ship overlap');
        }
        this.grid[x + i][y] = ship;
      } else {
        if (this.grid[x][y + i] !== null) {
          throw new Error('Ship overlap');
        }
        this.grid[x][y + i] = ship;
      }
    }

    this.ships.push(ship);
  }

  receiveAttack(x: number, y: number) {
    if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
      throw new Error('Invalid attack coordinates');
    }

    if (this.grid[x][y] === null) {
      this.missedAttacks.push([x, y]);
    } else {
      this.successfulAttacks.push([x, y]);
      const ship = this.grid[x][y]!;
      ship.hit();
      this.grid[x][y] = null;
    }
  }

  allShipsSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }

  getShipAt(x: number, y: number): Ship | null {
    if (x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length) {
      throw new Error('Invalid coordinates');
    }

    return this.grid[x][y];
  }

  getMissedAttackAt(x: number, y: number): boolean {
    return this.missedAttacks.some(
      ([missedX, missedY]) => missedX === x && missedY === y
    );
  }

  getSuccessfulAttackAt(x: number, y: number): boolean {
    return this.successfulAttacks.some(
      ([hitX, hitY]) => hitX === x && hitY === y
    );
  }
}

export default Gameboard;
