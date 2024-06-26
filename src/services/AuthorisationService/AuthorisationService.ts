import { BaseService } from "../BaseService";

import { ServiceRunners } from "../ServiceRunners";
import { AuthorisationRunners } from "./AuthorisationRunners";
import { AuthorisationRollbacks } from "./AuthorisationRollbacks";

import { GameManagementRunners } from "../GameManagementService/GameManagementRunners";

import { Request } from "express";

import * as sdk from "node-appwrite";
import * as types from "../types";
import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";


export class AuthorisationService extends BaseService {

    constructor() {
        super();

        this.logger.appendContext("AuthorisationService");
    }

    // METHODS

    /**
     * Create a new user using the provided request data.
     *
     * @param {Request} req - the request object containing user data
     * @return {Promise<void>}
     */
    public async signUp(req: Request): Promise<void> {
        this.logger.appendContext("SignUp");
        
        const credentials = req.body["credentials"] as types.Credentials;

        var [_, userId] = await this.rollbackManager.run<string,string>({
            runner: AuthorisationRunners.createUserRunner.bind(this, credentials),
            rollback: AuthorisationRollbacks.createUserRollback.bind(this),
            actionMessage: "creating user"
        });

        await this.rollbackManager.run<null,null>({
            runner: AuthorisationRunners.saveUserPublicDataRunner.bind(this, userId as string, credentials),
            rollback: null,
            actionMessage: "saving user data"
        });
    }

    /**
     * Create a new user session upon signing in.
     *
     * @param {Request} req - the request object containing user data
     * @return {Promise<void>} Promise that resolves once the user is signed in
     */
    public async signIn(req: Request): Promise<void> {
        this.logger.appendContext("SignIn");

        const credentials = req.body["credentials"] as types.Credentials;

        const [_, session] = await this.rollbackManager.run<sdk.Models.Session, null>({
            runner: AuthorisationRunners.createSessionRunner.bind(this, credentials),
            rollback: null,
            actionMessage: "signing in"
        })

        this.session = session;
    }

    /**
     * Deletes a user session when signing out.
     *
     * @param {Request} req - the request object containing user data
     * @return {Promise<void>} Promise that resolves once the session is deleted
     */
    public async signOut(req: Request): Promise<void> {
        this.logger.appendContext("SignOut");

        await this.rollbackManager.run<null,null>({
            runner: AuthorisationRunners.deleteSessionRunner.bind(this),
            rollback: null,
            actionMessage: "signing out"
        });
    }

    /**
     * Deletes a user using the provided userId from the query parameters.
     *
     * @param {Request} req - the request object containing user data
     * @return {Promise<void>}
     */
    public async deleteAccount(req: Request): Promise<void> {
        this.logger.appendContext("DeleteAccount");

        let [_, user] = await this.rollbackManager.run<sdk.Models.User<sdk.Models.Preferences>,null>({
            runner: ServiceRunners.getUserFromSessionRunner.bind(this),
            rollback: null,
            actionMessage: "getting user"
        });

        await this.rollbackManager.run<null,sdk.Models.Document>({
            runner: AuthorisationRunners.deleteUserPublicDataRunner.bind(this, user.$id),
            rollback: AuthorisationRollbacks.deleteUserPublicDataRollback.bind(this, user.$id),
            actionMessage: "deleting user data"
        });

        await this.rollbackManager.run<null,null>({
            runner: GameManagementRunners.leaveAllGamesRunner.bind(this, user.$id),
            rollback: null,
            actionMessage: "deleting all user's games"
        });

        await this.rollbackManager.run<null,null>({
            runner: AuthorisationRunners.deleteUserRunner.bind(this, user.$id),
            rollback: null,
            actionMessage: "deleting user"
        });
    }
}