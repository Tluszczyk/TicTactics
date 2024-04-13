import { BaseService } from "../BaseService";

import { AuthorisationRunners } from "./AuthorisationRunners";
import { AuthorisationRollbacks } from "./AuthorisationRollbacks";

import { Request, Response } from "express";

import * as sdk from "node-appwrite";
import * as types from "../types";
import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";


export class AuthorisationService extends BaseService {

    protected users: sdk.Users = new sdk.Users(this.server);
    
    protected usersPublicData: sdk.Models.Collection;

    constructor() {
        super();

        this.logger.appendContext("AuthorisationService");
    }

    async getCollections(): Promise<void> {
        this.usersPublicData = await this.serverDatabases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getUSERS_PUBLIC_DATA_COLLECTION_ID()
        )

        this.logger.debug("user public data collection retrieved");
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

    public async signOut(input: [Request,Response]) {
    }

    /**
     * Deletes a user using the provided userId from the query parameters.
     *
     * @param {Request} req - the request object containing user data
     * @return {Promise<void>}
     */
    public async deleteAccount(req: Request): Promise<void> {
        this.logger.appendContext("DeleteAccount");

        const userId = req.query.userId as string;

        await this.rollbackManager.run<null,null>({
            runner: AuthorisationRunners.getUser.bind(this, userId),
            rollback: null,
            actionMessage: "getting user"
        });

        await this.rollbackManager.run<null,sdk.Models.Document>({
            runner: AuthorisationRunners.deleteUserPublicDataRunner.bind(this, userId),
            rollback: AuthorisationRollbacks.deleteUserPublicDataRollback.bind(this, userId),
            actionMessage: "deleting user data"
        });

        await this.rollbackManager.run<null,null>({
            runner: AuthorisationRunners.deleteUserRunner.bind(this, userId),
            rollback: null,
            actionMessage: "deleting user"
        });
    }
}