import { Request, Response } from "express";

export interface UserManagementInterface {
    createUser(req: Request, res: Response): void;
    getUser(req: Request, res: Response): void;
    deleteUser(req: Request, res: Response): void;
}