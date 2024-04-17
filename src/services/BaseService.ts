import * as sdk from "node-appwrite";
import { EnvironmentVariablesManager } from "../EnvironmentVariablesManager";

import { RollbackManager } from "../lib/Rollback/RollbackManager";
import { ServiceExecutor } from "../lib/ServiceExecutor/ServiceExecutor";

import { ServicePreExecutors } from "./ServicePreExecutors";
import { ServicePostExecutors } from "./ServicePostExecutors";


export class BaseService extends ServiceExecutor {

    /**
     * The server client instance. It is used for all requests that need full access to the server.
     */
    protected server: sdk.Client;

    /**
     * The client client instance. It is used for all requests that need limited access to the server, based on the JWT.
     */
    protected client: sdk.Client;

    /**
     * Session data
     */
    protected session: sdk.Models.Session;

    /**
     * Whether to authorise the request
     */
    protected authoriseRequest: boolean = true

    /**
     * Databases service with full access
     */
    protected serverDatabases: sdk.Databases;

    /**
     * Databases service with limited access
     */
    protected clientDatabases: sdk.Databases;

    /**
     * Database instance
     */
    protected database: sdk.Models.Database;

    /**
     * Users service
     */
    protected users: sdk.Users;
    
    /**
     * Game collection
     */
    protected gamesCollection: sdk.Models.Collection;

    /**
     * Users public data collection
     */
    protected usersPublicData: sdk.Models.Collection;
    
    /**
     * Manager that manages the rollback of database operations
     */
    protected rollbackManager: RollbackManager = new RollbackManager();

    constructor() {
        super();

        this.server = new sdk.Client();
        this.client = new sdk.Client();

        this.serverDatabases = new sdk.Databases(this.server);
        this.clientDatabases = new sdk.Databases(this.client);

        this.users = new sdk.Users(this.server);

        this.server
            .setEndpoint(EnvironmentVariablesManager.getAPPWRITE_ENDPOINT())
            .setProject(EnvironmentVariablesManager.getAPPWRITE_PROJECT())
            .setKey(EnvironmentVariablesManager.getAPPWRITE_API_KEY())

        this.client
            .setEndpoint(EnvironmentVariablesManager.getAPPWRITE_ENDPOINT())
            .setProject(EnvironmentVariablesManager.getAPPWRITE_PROJECT())

        this.getDatabase()
        this.getCollections()

        this.addPreexecutor(ServicePreExecutors.prepareClient.bind(this));
        this.addPreexecutor(ServicePreExecutors.authorise.bind(this));

        this.addPostexecutor(ServicePostExecutors.setCookies.bind(this));
        this.addPostexecutor(ServicePostExecutors.cleanupAndSendResponse.bind(this));
        this.addPostexecutor(ServicePostExecutors.cleanup.bind(this));
    }

    /**
     * Retrieves the database from the server.
     *
     * @return {Promise<void>} a Promise that resolves when the database is retrieved
     */
    protected async getDatabase(): Promise<void> {
        this.database = await this.serverDatabases.get(EnvironmentVariablesManager.getDATABASE_ID())
    }

    /**
     * Retrieves the collections from the database.
     *
     * @return {Promise<void>} a Promise that resolves when the collections are retrieved
     */
    protected async getCollections(): Promise<void> {
        this.usersPublicData = await this.serverDatabases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getUSERS_PUBLIC_DATA_COLLECTION_ID()
        )

        this.logger.debug("user public data collection retrieved");

        this.gamesCollection = await this.serverDatabases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getGAMES_COLLECTION_ID()
        )

        this.logger.debug("game collection retrieved");
    }
}