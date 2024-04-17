import * as serviceTypes from "../../services/types";
import * as logicTypes from "./types";

import { Board } from "./Board";
import { BoardSerialiser } from "./BoardSerialiser";

export namespace GameLogic {
    /**
     * Creates a new game based on the provided creator ID and game settings.
     *
     * @param {string} creatorId - The ID of the player creating the game.
     * @param {serviceTypes.GameSettings} gameSettings - The settings for the new game.
     * @return {serviceTypes.Game} The newly created game object.
     */
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
     * Joins a player to a game if it is in the waiting for players state.
     *
     * @param {string} playerId - The ID of the player joining the game.
     * @param {serviceTypes.Game} game - The game object representing the current game state.
     * @return {serviceTypes.Game} The updated game object with the player added.
     * @throws {Error} If the game is not in the waiting for players state or if the game already has 2 players.
     */
    export function playerJoinsGame(playerId: string, game: serviceTypes.Game): serviceTypes.Game {
        if (game.status != logicTypes.GameStatus.WAITING_FOR_PLAYERS)
            throw new Error("Cannot join game not waiting for players state");

        if (game.oPlayerId == playerId || game.xPlayerId == playerId)
            throw new Error("Player already in game");

        var newGame = Object.assign({}, game);

        if (newGame.oPlayerId === "") newGame.oPlayerId = playerId;
        else if (newGame.xPlayerId === "") newGame.xPlayerId = playerId;
        else throw new Error("Game already has 2 players");

        newGame.status = logicTypes.GameStatus.IN_PROGRESS;

        return newGame;
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