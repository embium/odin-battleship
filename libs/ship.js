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
