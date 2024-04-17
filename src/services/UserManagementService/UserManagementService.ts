import { BaseService } from "../BaseService";

import { Request } from "express";

import { UserManagementRunners } from "./UserManagementRunners";

import * as sdk from "node-appwrite";
import * as types from "../types";
import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";


export class UserManagementService extends BaseService {
    /**
     * Service for handling user management
     * 
     * This service is responsible for creating, reading, updating and deleting users.
     * It provides an API to the following endpoints:
     * - POST /v1/users: create a new user
     * - GET /v1/users: list all users
     * - DELETE /v1/users/{userId}: delete a user
     */

    protected users: sdk.Users = new sdk.Users(this.server);
    
    protected usersPublicData: sdk.Models.Collection;

    constructor() {
        super();

        this.logger.appendContext("UserManagementService");
    }

    /**
     * Retrieves the user public data collection asynchronously.
     *
     * @return {Promise<void>} Promise that resolves once the user public data collection is retrieved
     */
    async getCollections(): Promise<void> {
        this.usersPublicData = await this.serverDatabases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getUSERS_PUBLIC_DATA_COLLECTION_ID()
        )

        this.logger.debug("user public data collection retrieved");
    }
    
    // METHODS

    /**
     * Generate a list of public user data based on the provided request query parameters.
     *
     * @param {Request} req - The request object containing user data.
     * @return {Promise<types.UserPublicData[]>} The list of public user data retrieved.
     */
    async getUsers(req: Request): Promise<types.UserPublicData[]> {
        this.logger.appendContext("GetUsers");

        const username = req.query.name as string;

        var [_, usersPublicData] = await this.rollbackManager.run<sdk.Models.DocumentList<sdk.Models.Document>,null>({
            runner: UserManagementRunners.listDocumentsRunner.bind(this, username),
            rollback: null,
            actionMessage: "retrieving user data"
        });

        return usersPublicData.documents.map(user => types.parseObjectFromDocument<types.UserPublicData>(user));
    }
}
