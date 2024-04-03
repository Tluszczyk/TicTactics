import { BaseExecutor } from "../BaseExecutor";

import { UserManagementInterface } from "../../interfaces/UserManagementInterface";
import { UserManagementService } from "../../services/UserManagementService/UserManagementService";

import { Request, Response } from "express";

export class UserManagementBaseExecutor extends BaseExecutor implements UserManagementInterface {
    service: UserManagementService;

    constructor() {
        super();

        this.service = new UserManagementService();
    }

    createUser(req: Request, res: Response): void {
        this.service.createUser(req, res);
    }

    getUser(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }

    deleteUser(req: Request, res: Response): void {
        throw new Error("Method not implemented.");
    }
    
}