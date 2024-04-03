import { BaseService } from "../BaseService";
import { UserManagementInterface } from "../../interfaces/UserManagementInterface";

import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import * as sdk from "node-appwrite";
import * as types from "../types";
import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";

export class UserManagementService extends BaseService implements UserManagementInterface {
    private users: sdk.Users = new sdk.Users(this.client);
    private databases: sdk.Databases= new sdk.Databases(this.client);
    
    private database: sdk.Models.Database;
    private usersData: sdk.Models.Collection;

    constructor() {
        super();

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
    
    public createUser(req: Request, res: Response) {
        this.logger.debug("UserManagementLocalExecutor: Creating user");
        
        var credentials = req.body["credentials"] as types.Credentials;
        var userId = sdk.ID.unique();

        var saveUserDataCallback = (databaseId: string, collectionId: string, userId: string, res: Response) => {
            this.databases.createDocument(
                databaseId,collectionId,
                sdk.ID.unique(),
                {
                    userId: userId,
                    ELO: 1000
                } as types.UserData
            ).then(_ => {
                res.status(StatusCodes.OK).send(ReasonPhrases.OK);
                
            }).catch(err => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`
                });
            });  
        }
        
        this.users.create(
            userId,
            credentials.email,
            credentials.phone,
            credentials.password,
            credentials.name
        ).then(_ => {
            saveUserDataCallback(this.database.$id, this.usersData.$id, userId, res);
        }).catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`
            });
        })          
    }

    getUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Getting user");

        // var userId = req.query.userId as string;

        // this.users.get(userId)
        // .then(user => {
        //     res.status(StatusCodes.OK).send(user);
            
        // }).catch(err => {
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        //         error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`
        //     });
        // });
    }


    deleteUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Deleting user");

        var userId = req.query.userId as string;

        this.users.delete(userId)
        .then(_ => {
            res.status(StatusCodes.OK).send(ReasonPhrases.OK);
            
        }).catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`
            });
        });
    }

}
    