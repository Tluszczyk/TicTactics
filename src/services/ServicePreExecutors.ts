import { Request, Response } from "express";
import { BaseService } from "./BaseService";
import * as sdk from "node-appwrite";

export namespace ServicePreExecutors {
    /**
     * Prepares the client with the provided request.
     * Sets up the database and usersPublicData collections with the provided JWT.
     *
     * @param {Request} req - the request object
     */
    export async function prepareClient(this: BaseService, req: Request, res: Response): Promise<void> {
        this.logger.debug("prepare client");
    }

    /**
     * Authorises the request if the authoriseRequest property is set to true
     *
     * @param {Request} req - the request object
     * @throws {Error} if the authorisation fails
     */
    export async function authorise(this: BaseService, req: Request, res: Response): Promise<void> {
        this.logger.debug("authorise");

        if ( this.authoriseRequest ) {
            this.client.setSession(req.cookies.session);

            const account = new sdk.Account(this.client);

            let user = await account.get();

            this.logger.debug(`successfuly authorised as ${user.$id}`);
        }
    }
}