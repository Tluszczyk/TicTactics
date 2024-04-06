import { BaseService } from "../BaseService";

import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import * as sdk from "node-appwrite";
import * as types from "../types";
import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";


export class UserManagementService extends BaseService {
    private users: sdk.Users = new sdk.Users(this.client);
    private databases: sdk.Databases= new sdk.Databases(this.client);
    
    private database: sdk.Models.Database;
    private usersData: sdk.Models.Collection;

    constructor() {
        super();

        this.logger.appendContext("UserManagementService");

        this.databases.get(EnvironmentVariablesManager.getDATABASE_ID()).then(database => {
            this.database = database;
        })
        
        this.databases.getCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getUSERS_DATA_COLLECTION_ID()
        ).then(usersData => {
            this.usersData = usersData;
        })
    }

    // EXECUTORS

    public executor(method: (req: Request, res: Response) => Promise<any>): (req: Request, res: Response) => Promise<void> {
        this.logger.debug("executor");

        return async (req: Request, res: Response) => {
            this.preexecutor();
            var data = await method.bind(this)(req, res);
            this.postexecutor(res, data);
        };
    }

    private preexecutor() { this.logger.debug("PreExecutor"); }

    private postexecutor(res: Response, data: any) {
        this.logger.appendContext("PostExecutor");

        if ( this.rollbackManager.didItFail() ) {
            this.logger.error(`some operations failed: ${this.rollbackManager.getErrorMessage()}`);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${this.rollbackManager.getErrorMessage()}`
            });

        } else {
            this.logger.debug("all operations were successful");
            res.status(StatusCodes.OK).send(data ?? ReasonPhrases.OK);
        }

        this.rollbackManager.clear();
        this.logger.popContext(); 
        this.logger.popContext();
    }
    
    // METHODS

    public async createUser(req: Request): Promise<void> {
        this.logger.appendContext("CreateUser");
        
        const credentials = req.body["credentials"] as types.Credentials;
        
        this.logger.debug("before creating user");

        var [_, userId] = await this.rollbackManager.run({
            runner: async () => {
                var user = await this.users.create(
                    sdk.ID.unique(),
                    credentials.email,
                    credentials.phone,
                    credentials.password,
                    credentials.name
                )

                return [user.$id, user.$id];
            },
            rollback: async (userId) => { await this.users.delete(userId) },
            actionMessage: "creating user"
        });

        this.logger.debug("successfully created user");

        await this.rollbackManager.run({
            runner: async () => {
                await this.databases.createDocument(
                    this.database.$id, this.usersData.$id,
                    userId as string, { ELO: 1000 } as types.UserData
                );

                return [null,null]
            },
            rollback: null,
            actionMessage: "saving user data"
        });

        this.logger.debug("successfully saved user data");
    }

    async getUser(req: Request): Promise<types.UserData> {
        this.logger.appendContext("GetUser");

        const userId = req.query.userId as string;

        var [success, userData] = await this.rollbackManager.run({
            runner: async () => {
                var userData = await this.databases.getDocument(
                    this.database.$id, this.usersData.$id, userId
                );
                return [userData, null];
            },
            rollback: null,
            actionMessage: "retrieving user data"
        });

        return success ? types.parseUserData(userData as sdk.Models.Document) : null;
    }

    async deleteUser(req: Request): Promise<void> {
        this.logger.appendContext("DeleteUser");

        const userId = req.query.userId as string;

        await this.rollbackManager.run({
            runner: async () => {
                var user = await this.users.get(userId);
                await this.users.delete(userId);
                return [null, user];
            },
            rollback: async (user) => {
                await this.users.create(
                    userId, 
                    user.email == "" ? null : user.email,
                    user.phone == "" ? null : user.phone,
                    user.password,
                    user.name
                );
            },
            actionMessage: "deleting user"
        });
        
        this.logger.debug("successfully deleted user");

        await this.rollbackManager.run({
            runner: async () => {
                await this.databases.deleteDocument(
                    this.database.$id, this.usersData.$id,userId
                );
                return [null,null]
            },
            rollback: null,
            actionMessage: "deleting user data"
        });

        this.logger.debug("successfully deleted user data");
    }
}
    
