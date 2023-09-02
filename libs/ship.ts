// Ship class
class Ship {
  private hits: number = 0;
  private length: number;
  private _hit: boolean = false;

  constructor(length: number) {
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

export default Ship;
