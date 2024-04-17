import { BaseService } from "../BaseService";

import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";

import { GameLogic } from "../../logic/GameLogic/GameLogic";

import { ServiceRunners } from "../ServiceRunners";
import { GameManagementRunners } from "./GameManagementRunners";

import { Request } from "express";

import * as sdk from "node-appwrite";
import * as types from "../types";

export class GameManagementService extends BaseService {
    protected users: sdk.Users = new sdk.Users(this.server);
    
    protected gamesCollection: sdk.Models.Collection;

    constructor() {
        super();

        this.logger.appendContext("GameManagementService");
    }

    /**
     * Retrieves the game collection asynchronously.
     *
     * @return {Promise<void>} Promise that resolves once the user public data collection is retrieved
     */
    async getCollections(): Promise<void> {
        this.gamesCollection = await this.serverDatabases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getGAMES_COLLECTION_ID()
        )

        this.logger.debug("game collection retrieved");
    }

    // METHODS

    async createGame(req: Request): Promise<types.Game> {
        this.logger.appendContext("CreateGame");

        const gameSettings = req.body["gameSettings"] as types.GameSettings;

        var [_, user] = await this.rollbackManager.run<sdk.Models.User<sdk.Models.Preferences>,null>({
            runner: ServiceRunners.getUserFromSessionRunner.bind(this),
            rollback: null,
            actionMessage: "getting user"
        });

        const game = GameLogic.createGame(user.$id, gameSettings);

        await this.rollbackManager.run<sdk.Models.Document,null>({
            runner: GameManagementRunners.createGameRunner.bind(this, user.$id, game),
            rollback: null,
            actionMessage: "creating game"
        });

        return game;
    }

    async listGames(req: Request): Promise<types.ListGamesResponse> {
        this.logger.appendContext("ListGames");

        const gameFilter = req.query.gameFilter as types.GameFilter;
        const queryLimit = req.query.queryLimit as undefined as number;
        const inputCursor = req.query.queryCursor as string;

        var [success, gamesDocuments] = await this.rollbackManager.run<sdk.Models.DocumentList<sdk.Models.Document>,null>({
            runner: GameManagementRunners.listGamesRunner.bind(this, gameFilter, queryLimit, inputCursor),
            rollback: null,
            actionMessage: "retrieving games"
        });

        if (!success) {
            return {
                games:          [],
                queryCursor:    ""
            } as types.ListGamesResponse
        }
        
        var games           = gamesDocuments.documents.map(game => types.parseObjectFromDocument<types.Game>(game));
        var outputCursor    = gamesDocuments.documents.length > 0 ? gamesDocuments.documents[gamesDocuments.documents.length-1].$id : "";

        return {
            games:          games,
            queryCursor:    outputCursor
        } as types.ListGamesResponse
    }
}