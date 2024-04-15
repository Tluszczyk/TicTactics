import * as serviceTypes from "../../services/types";
import * as logicTypes from "./types";

import { Board } from "./Board";
import { BoardSerialiser } from "./BoardSerialiser";

export namespace GameLogic {
    export function createGame(creatorId: string, gameSettings: serviceTypes.GameSettings): serviceTypes.Game {
        var board = new Board();
        var serialisedBoard = BoardSerialiser.serialiseBoard(board);

        var oPlayerId: string = "";
        var xPlayerId: string = "";

        gameSettings.creatorSymbol = gameSettings.creatorSymbol ?? logicTypes.getRandomSymbol()

        if (gameSettings.creatorSymbol === logicTypes.Symbol.O) {
            oPlayerId = creatorId;
            xPlayerId = gameSettings.opponentId ?? "";
        } else {
            oPlayerId = gameSettings.opponentId ?? "";
            xPlayerId = creatorId;
        }

        const gameStatus = gameSettings.opponentId ? logicTypes.GameStatus.IN_PROGRESS : logicTypes.GameStatus.WAITING_FOR_PLAYERS;

        return Object.assign({
            serialisedBoard: serialisedBoard,
            oPlayerId: oPlayerId,
            xPlayerId: xPlayerId,
            winner: logicTypes.Winner.NONE,
            status: gameStatus
        }, gameSettings)
    }
}