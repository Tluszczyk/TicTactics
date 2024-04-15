import { Board } from "./Board";

export class BoardSerialiser {
    public static serialiseBoard(board: Board): string {
        return ""
    }

    public static deserialiseBoard(board: string): Board {
        return new Board();
    }
}