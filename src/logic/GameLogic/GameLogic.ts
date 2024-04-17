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

/**
 * Removes a player from the game and sets the winner accordingly.
 *
 * @param {string} playerId - The ID of the player quitting the game.
 * @param {serviceTypes.Game} game - The game object representing the current game state.
 * @return {serviceTypes.Game} The updated game object with the player removed and the winner determined.
 * @throws {Error} If the player is not part of the game.
 */
    export function playerQuitsGame(playerId: string, game: serviceTypes.Game): serviceTypes.Game {
        if (game.status == logicTypes.GameStatus.FINISHED)
            throw new Error("Cannot quit game in finished state");

        var newGame = Object.assign({}, game);
        
        if (playerId === newGame.oPlayerId)
            newGame.winner = logicTypes.Winner.X

        else if (playerId === newGame.xPlayerId)
            newGame.winner = logicTypes.Winner.O

        else throw new Error("Player is not part of the game");

        newGame.status = logicTypes.GameStatus.FINISHED;
        return newGame;
    }
}