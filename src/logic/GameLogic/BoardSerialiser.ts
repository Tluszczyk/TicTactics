import { Board } from "./Board";
import { serialiseSymol, deserialiseSymol } from "./types";

export class BoardSerialiser {
    /**
     * Serializes the given board object into a compact string representation.
     *
     * @param {Board} board - The board object to be serialized.
     * @return {string} The compact string representation of the board.
     */
    public static serialiseBoard(board: Board): string {
        return board.getRawBoard().map(serialiseSymol).join("")
    }

    /**
     * Deserializes a string representation of a board into a Board object.
     *
     * @param {string} board - The string representation of the board.
     * @return {Board} The deserialized Board object.
     */
    public static deserialiseBoard(serialisedBoard: string): Board {
        return Board.fromRawBoard(serialisedBoard.split("").map(deserialiseSymol))
    }
}