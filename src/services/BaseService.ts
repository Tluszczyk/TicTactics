import * as sdk from "node-appwrite";
import { LoggingClass } from "../lib/LoggingClass";

import { RollbackManager } from "../lib/Rollback/RollbackManager";

export class BaseService extends LoggingClass {
    protected client: sdk.Client;
    protected rollbackManager: RollbackManager = new RollbackManager();

    constructor() {
        super();

        this.client = new sdk.Client();

        this.client
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT)
            .setKey(process.env.APPWRITE_API_KEY);
    }
}