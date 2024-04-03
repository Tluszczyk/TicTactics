import { BaseService } from "../BaseService";

import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";

import * as sdk from "node-appwrite";

export class DatabaseService extends BaseService {

    private databases: sdk.Databases;

    public database: sdk.Databases
    public todoCollection: sdk.Databases

    constructor() {
        super();

        this.databases = new sdk.Databases(this.client);

        const database = this.databases.get(EnvironmentVariablesManager.getDATABASE_NAME());
    }
}