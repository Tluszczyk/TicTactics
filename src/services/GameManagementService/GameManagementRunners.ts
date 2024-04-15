import { GameManagementService } from "./GameManagementService";

import * as sdk from "node-appwrite";
import * as types from "../types";

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
}

