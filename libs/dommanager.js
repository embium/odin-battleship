"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = __importDefault(require("./player"));
const ship_1 = __importDefault(require("./ship"));
class DOMManager {
    static renderGameboard(gameboard, player, container) {
        var _a;
        if (!container)
            return;
        container.innerHTML = ""; // Clear the container
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("id", `${x}-${y}`);
                // Add appropriate class for ship or missed attack
                if (gameboard.grid[x][y] === null) {
                    cell.classList.add("empty");
                }
                else if (gameboard.grid[x][y] instanceof ship_1.default) {
                    cell.classList.add("ship");
                    if ((_a = gameboard.grid[x][y]) === null || _a === void 0 ? void 0 : _a.isSunk()) {
                        cell.classList.add("sunk");
                    }
                }
                else {
                    cell.classList.add("missed");
                }
                // Handle click event
                cell.addEventListener("click", () => {
                    console.log(cell.id);
                    // Check if the cell was already clicked before
                    if (!cell.classList.contains("clicked")) {
                        cell.classList.add("clicked");
                        // Perform attack and update the gameboard display
                        // Get the player's attack coordinates (x, y)
                        player_1.default.attack(gameboard, cell.id.split("-"));
                        // Call player.attack(gameboard, x, y);
                        // Call DOMManager.renderGameboard to update the display
                    }
                });
                container.appendChild(cell);
            }
        }
    }
}
exports.default = DOMManager;
