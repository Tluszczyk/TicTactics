import { UserManagementInterface } from "../../interfaces/UserManagementInterface";
import { UserManagementBaseExecutor } from "./UserManagementBaseExecutor";
import { UserManagementService } from "../../services/UserManagementService/UserManagementService";

import { Request, Response } from "express";

export class UserManagementLocalExecutor extends UserManagementBaseExecutor implements UserManagementInterface {
    service: UserManagementService;

    constructor() {
        super();

        this.service = new UserManagementService();
    }

    createUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Creating user");
        this.service.createUser(req, res);
    }

    getUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Get user");
        throw new Error("Method not implemented.");
    }

    deleteUser(req: Request, res: Response): void {
        this.logger.debug("UserManagementLocalExecutor: Delete user");
        this.service.deleteUser(req, res);
    }
    
}