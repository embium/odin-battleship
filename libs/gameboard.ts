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

  removeShip(length: number, x: number, y: number, vertical: boolean) {
    for (let i = 0; i < length; i++) {
      if (vertical) {
        this.grid[x + i][y] = null;
      } else {
        this.grid[x][y + i] = null;
      }
    }
  }

  placeShip(ship: Ship, x: number, y: number, vertical: boolean) {
    for (let i = 0; i < ship.getLength(); i++) {
      if (vertical) {
        if (this.grid[x + i][y] !== null) {
          return false;
        }
        this.grid[x + i][y] = ship;
      } else {
        if (this.grid[x][y + i] !== null) {
          return false;
        }
        this.grid[x][y + i] = ship;
      }
    }
    this.ships.push(ship);
  }

  getShips() {
    return this.ships;
  }

  validPlacement(ship: Ship, x: number, y: number, vertical: boolean) {
    if (
      x < 0 ||
      x >= this.grid.length ||
      y < 0 ||
      y >= this.grid[0].length ||
      (vertical && x + ship.getLength() > this.grid.length) ||
      (!vertical && y + ship.getLength() > this.grid[0].length)
    ) {
      return false;
    }
    for (let i = 0; i < ship.getLength(); i++) {
      if (vertical) {
        if (this.grid[x + i][y] !== null) {
          return false;
        }
      } else {
        if (this.grid[x][y + i] !== null) {
          return false;
        }
      }
    }
    return true;
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
