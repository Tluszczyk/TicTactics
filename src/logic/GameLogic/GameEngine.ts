import { Board, Position } from "./Board";
import * as serviceTypes from "../../services/types";
import * as logicTypes from "./types";

export namespace GameEngine {
    /**
     * Retrieves the available moves for a player on the game board.
     *
     * @param {Board} board - The game board.
     * @param {serviceTypes.Move} lastMove - The last move made by the player.
     * @return {serviceTypes.Move[]} An array of available moves.
     */
    export function getAvailableMoves(board: Board, lastMove: serviceTypes.Move): serviceTypes.Move[] {
        if (lastMove == null) return board.getAvailableMoves();

        const position = Position.fromMove(lastMove);

        const cell = board.getCell(position);

        const nextTile = board.getTile(cell.localPosition);

        return nextTile.getAvailableMoves();
    }

    /**
     * Validates a move in a game.
     *
     * @param {serviceTypes.Game} game - The game object.
     * @param {serviceTypes.Move} move - The move to be validated.
     * @return {[boolean, string]} - An array containing a boolean indicating if the move is valid and a string message.
     */
    export function validateMove(game: serviceTypes.Game, move: serviceTypes.Move): [boolean, string] {
        if ( game.availableMoves.indexOf(move) == -1 )
            return [false, "Provided move is not available"]

        return [true, "move is valid"]
    }

    /**
     * Determines if there is a winner on the board.
     *
     * @param {Board} board - The game board to check for a win.
     * @return {logicTypes.Winner} The winner of the game, if any.
     */
    export function checkForWin(board: Board): logicTypes.Winner {
        return logicTypes.Winner.NONE
    }

    /**
     * Toggles the turn between X and O.
     *
     * @param {logicTypes.Symbol} turn - The current turn.
     * @return {logicTypes.Symbol} The toggled turn.
     */
    export function toggleTurn(turn: logicTypes.Symbol): logicTypes.Symbol {
        return turn == logicTypes.Symbol.O ? logicTypes.Symbol.X : logicTypes.Symbol.O
    }
}