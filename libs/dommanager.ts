import Gameboard from "./gameboard";
import Player from "./player";
import Ship from "./ship";

class DOMManager {
    static renderGameboard(
        gameboard: Gameboard,
        player: Player,
        container: HTMLElement | null
    ) {
        if (!container) return;
        container.innerHTML = ""; // Clear the container
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("id", `${x}-${y}`);

                // Add appropriate class for ship or missed attack
                if (gameboard.grid[x][y] === null) {
                    cell.classList.add("empty");
                } else if (gameboard.grid[x][y] instanceof Ship) {
                    cell.classList.add("ship");
                    if (gameboard.grid[x][y]?.isSunk()) {
                        cell.classList.add("sunk");
                    }
                } else {
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
                        Player.attack(gameboard, cell.id.split("-"));
                        // Call player.attack(gameboard, x, y);
                        // Call DOMManager.renderGameboard to update the display
                    }
                });

                container.appendChild(cell);
            }
        }
    }
}

export default DOMManager;
