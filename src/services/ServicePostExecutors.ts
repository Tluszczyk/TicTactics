import { Response } from "express";
import { BaseService } from "./BaseService";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export namespace ServicePostExecutors {
    /**
     * Set cookies on the response if the rollback did not fail.
     *
     * @param {Response} res - the response object to set cookies on
     * @return {void} 
     */
    export async function setCookies(this: BaseService, req: Request, res: Response): Promise<void> {
        this.logger.debug("set cookies");

        if ( !this.rollbackManager.didItFail() && this.session ) {
            res.cookie('session', this.session.secret, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(this.session.expire)
            });
        }
    }

    /**
     * Executes code after the request is processed.
     * Logs if the request was successful or not, sends a response and clears the rollback manager and logger contexts
     *
     * @param {Response} res - the response object
     * @param {any} data - data to be sent
     */
    export async function cleanupAndSendResponse<T>(this: BaseService, req: Request, res: Response, data: T): Promise<void> {
        this.logger.debug("cleanup and send response");

        if ( this.rollbackManager.didItFail() ) {
            let error = this.rollbackManager.getError();

            this.logger.error(`some operations failed: ${error.message}`);

            res.status(error.code).send(error);

        } else {
            this.logger.debug("all operations were successful");
            res.status(StatusCodes.OK).send(data ?? ReasonPhrases.OK);
        }
    }

    /**
     * Executes code after the request is processed.
     * Clears the rollback manager and logger contexts
     */
    export async function cleanup<T>(this: BaseService, req: Request, data: T): Promise<void> {
        this.logger.debug("cleanup");
        
        this.rollbackManager.clear();
        this.logger.popContext();
    }
}