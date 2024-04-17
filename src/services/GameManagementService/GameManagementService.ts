import { BaseService } from "../BaseService";

import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";

import { GameLogic } from "../../logic/GameLogic/GameLogic";

import { ServiceRunners } from "../ServiceRunners";
import { GameManagementRunners } from "./GameManagementRunners";

import { Request } from "express";

import * as sdk from "node-appwrite";
import * as types from "../types";

export class GameManagementService extends BaseService {

    constructor() {
        super();

        this.logger.appendContext("GameManagementService");
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

    /**
     * Retrieves a list of games based on the provided game filter, query limit, and query cursor.
     *
     * @param {Request} req - the request object containing the game filter, query limit, and query cursor
     * @return {Promise<types.ListGamesResponse>} a promise that resolves to a ListGamesResponse object containing the retrieved games and the query cursor
     */
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

    /**
     * Joins a game based on the provided game ID.
     *
     * @param {Request} req - the request object containing the game ID
     * @return {Promise<void>} a promise that resolves once the user joins the game
     */
    async joinGame(req: Request): Promise<void> {
        this.logger.appendContext("JoinGame");
        
        const gameId = req.params.gameId as string;

        var [_, user] = await this.rollbackManager.run<sdk.Models.User<sdk.Models.Preferences>,null>({
            runner: ServiceRunners.getUserFromSessionRunner.bind(this),
            rollback: null,
            actionMessage: "getting user"
        });

        await this.rollbackManager.run<sdk.Models.Document,null>({
            runner: GameManagementRunners.joinGameRunner.bind(this, user.$id, gameId),
            rollback: null,
            actionMessage: "joining game"
        });
    }

    /**
     * Leaves the game based on the provided game ID.
     *
     * @param {Request} req - the request object containing the game ID
     * @return {Promise<void>} a promise that resolves once the user leaves the game
     */
    async leaveGame(req: Request): Promise<void> {
        this.logger.appendContext("LeaveGame");
        
        const gameId = req.params.gameId as string;

        var [_, user] = await this.rollbackManager.run<sdk.Models.User<sdk.Models.Preferences>,null>({
            runner: ServiceRunners.getUserFromSessionRunner.bind(this),
            rollback: null,
            actionMessage: "getting user"
        });

        await this.rollbackManager.run<sdk.Models.Document,null>({
            runner: GameManagementRunners.leaveGameRunner.bind(this, user.$id, gameId),
            rollback: null,
            actionMessage: "leaving game"
        });
    }
}