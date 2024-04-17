import { GameManagementService } from "./GameManagementService";

import * as sdk from "node-appwrite";
import * as types from "../types";
import { GameLogic } from "../../logic/GameLogic/GameLogic";

export namespace GameManagementRunners {

    /**
     * Creates a new game document with the provided permissions and returns it.
     *
     * @param {string} userId - The ID of the user creating the game
     * @param {types.Game} game - The game object containing game details
     * @return {Promise<[sdk.Models.Document,null]>} A promise resolving to the created game document and null
     */
    export async function createGameRunner(this: GameManagementService, userId: string, game: types.Game): Promise<[sdk.Models.Document,null]> {

        var permissions: string[] = [
            sdk.Permission.read(sdk.Role.user(userId)),
            sdk.Permission.read(
                game.isPrivate ? sdk.Role.user(game.opponentId) : sdk.Role.users()
            ),
            sdk.Permission.update(sdk.Role.user(userId))
        ]

        if (game.isPrivate) {
            permissions.push(sdk.Permission.update(sdk.Role.user(game.opponentId)))
        }

        const gameDocument = await this.serverDatabases.createDocument(
            this.database.$id, this.gamesCollection.$id,
            sdk.ID.unique(), game, permissions
        )

        return [gameDocument,null]
    }

    /**
     * Retrieves a list of games based on the provided game filter, query limit, and query cursor.
     *
     * @param {GameFilter} gameFilter - The filter to apply when retrieving games.
     * @param {number} [queryLimit] - The maximum number of games to retrieve.
     * @param {string} [queryCursor] - The cursor to use for pagination.
     * @returns {Promise<[sdk.Models.DocumentList<sdk.Models.Document>,null]>} A promise that resolves to an array containing the list of games and a null value.
     */
    export async function listGamesRunner(this: GameManagementService, gameFilter: types.GameFilter, queryLimit?: number, queryCursor?: string): Promise<[sdk.Models.DocumentList<sdk.Models.Document>,null]> {
        const queries = types.createQueriesFromFilter(gameFilter, queryLimit, queryCursor);
        
        const games = await this.clientDatabases.listDocuments(
            this.database.$id, this.gamesCollection.$id, queries
        )

        return [games,null];
    }   

    export async function leaveGameRunner(this: GameManagementService, userId: string, gameId: string): Promise<[null,null]> {
        var gameDocument = await this.clientDatabases.getDocument(
            this.database.$id, this.gamesCollection.$id, gameId
        )

        const game = types.parseObjectFromDocument<types.Game>( gameDocument)
        
        var updatedGame = GameLogic.playerQuitsGame(userId, game);

        await this.clientDatabases.updateDocument(
            this.database.$id, this.gamesCollection.$id, gameId, updatedGame
        )

        return [null,null]
    }
}