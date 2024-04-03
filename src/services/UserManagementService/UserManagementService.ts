import { BaseService } from "../BaseService";
import { UserManagementInterface } from "../../interfaces/UserManagementInterface";

import { Request, Response } from "express";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import * as sdk from "node-appwrite";
import * as types from "../types";

export class UserManagementService extends BaseService implements UserManagementInterface {
    private users: sdk.Users = new sdk.Users(this.client);

    constructor() {
        super();
    }
    
    public createUser(req: Request, res: Response) {
        this.logger.debug("UserManagementLocalExecutor: Creating user");
        
        var credentials = (req.body as types.CreateUserRequest).credentials;
        
        this.users.create(
            sdk.ID.unique(),
            credentials.email,
            credentials.phone,
            credentials.password,
            credentials.name
            
        ).then(_ => {
            res.status(StatusCodes.OK).send(ReasonPhrases.OK);
            
        }).catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                error: `${ReasonPhrases.INTERNAL_SERVER_ERROR}: ${err.message}`
            });
        });    
    }

    getUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Getting user");
        throw new Error("Method not implemented.");
    }

    deleteUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Deleting user");
        throw new Error("Method not implemented.");
    }
}
    