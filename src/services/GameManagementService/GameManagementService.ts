import { BaseService } from "../BaseService";

import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";
import { RollbackManager } from "../../lib/Rollback/RollbackManager";

import { GameLogic } from "../../logic/GameLogic/GameLogic";

import { ServiceRunners } from "../ServiceRunners";
import { GameManagementRunners } from "./GameManagementRunners";
import { GameManagementRollbacks } from "./GameManagementRollbacks";

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
}