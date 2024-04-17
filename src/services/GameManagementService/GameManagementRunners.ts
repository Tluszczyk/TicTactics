import { GameManagementService } from "./GameManagementService";

import * as sdk from "node-appwrite";
import * as types from "../types";
import { GameLogic } from "../../logic/GameLogic/GameLogic";
import { BaseService } from "../BaseService";

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

    /**
     * Joins a game by updating the game document with the user's ID.
     *
     * @param {string} userId - The ID of the user joining the game.
     * @param {string} gameId - The ID of the game to join.
     * @return {Promise<[null,null]>} A promise that resolves to an array of two null values.
     */
    export async function joinGameRunner(this: GameManagementService, userId: string, gameId: string, accessToken: string): Promise<[null,null]> {
        var gameDocument: sdk.Models.Document = null

        console.log(gameId, accessToken)
        
        if( accessToken ) {
            var gameDocuments = await this.serverDatabases.listDocuments(
                this.database.$id, this.gamesCollection.$id,
                [sdk.Query.equal("accessToken", accessToken)]
            )

            if( gameDocuments.documents.length > 1 ) throw new Error("Too many games with the same access token.")
            else gameDocument = gameDocuments.documents[0]

        } else if( gameId ) {
            gameDocument = await this.clientDatabases.getDocument(
                this.database.$id, this.gamesCollection.$id, gameId
            )

        } else throw new Error("No game ID or access token provided.")

        var game = types.parseObjectFromDocument<types.Game>(gameDocument)

        game = GameLogic.playerJoinsGame(userId, game);

        await this.serverDatabases.updateDocument(
            this.database.$id, this.gamesCollection.$id, gameDocument.$id, game,
            [...gameDocument.$permissions, sdk.Permission.read(sdk.Role.user(userId))]
        )

        return [null,null]
    }

    /**
     * Updates the game state when a player leaves the game.
     *
     * @param {string} userId - The ID of the user leaving the game.
     * @param {sdk.Models.Document} gameDocument - The document representing the game.
     * @return {Promise<void>} A promise that resolves when the game state is updated.
     */
    async function leaveGame(this: GameManagementService, userId: string, gameDocument: sdk.Models.Document): Promise<void> {
        const game = types.parseObjectFromDocument<types.Game>(gameDocument)
        
        var updatedGame = GameLogic.playerQuitsGame(userId, game);

        await this.clientDatabases.updateDocument(
            this.database.$id, this.gamesCollection.$id, gameDocument.$id, updatedGame
        )
    }

    /**
     * Retrieves a game document and calls the leaveGame function to remove the user from the game.
     *
     * @param {GameManagementService} this - the GameManagementService instance
     * @param {string} userId - the ID of the user
     * @param {string} gameId - the ID of the game
     * @return {Promise<[null,null]>} a promise that resolves to an array of null values
     */
    export async function leaveGameRunner(this: GameManagementService, userId: string, gameId: string): Promise<[null,null]> {
        var gameDocument = await this.clientDatabases.getDocument(
            this.database.$id, this.gamesCollection.$id, gameId
        )

        await leaveGame.call(this, userId, gameDocument)

        return [null,null]
    }

    /**
     * Retrieves all games that the given user is participating in and leaves them.
     *
     * @param {BaseService} this - the service instance
     * @param {string} userId - the ID of the user
     * @return {Promise<[null,null]>} a promise that resolves to an array of null values
     */
    export async function leaveAllGamesRunner(this: BaseService, userId: string): Promise<[null,null]> {
        const oPlayerGames = await this.clientDatabases.listDocuments(
            this.database.$id, this.gamesCollection.$id,
            [sdk.Query.equal("oPlayerId", userId)]
        )

        const xPlayerGames = await this.clientDatabases.listDocuments(
            this.database.$id, this.gamesCollection.$id,
            [sdk.Query.equal("xPlayerId", userId)]
        )

        const games = [...oPlayerGames.documents, ...xPlayerGames.documents]

        for (const game of games)
            await leaveGame.call(this, userId, game)

        return [null,null]
    }
}