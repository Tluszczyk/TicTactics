import { BaseService } from "../../services/BaseService";
import { LoggingClass } from "../LoggingClass";
import { Request, Response } from "express";

import { ErrorHandler } from "../ErrorHandling/ErrorHandler";
import { Errors } from "../ErrorHandling/Errors";

export type PreExecutorType = (req: Request, res: Response) => Promise<void>;
export type PostExecutorType = (req: Request, res: Response, output: any) => Promise<void>;

export class ServiceExecutor extends LoggingClass {
    preexecutors: PreExecutorType[] = [];
    postexecutors: PostExecutorType[] = [];

    errorHandler: ErrorHandler = new ErrorHandler();
    errorHapened: boolean = false;

    constructor() {
        super();
        this.logger.appendContext("ServiceExecutor");
    }

    /**
     * Add a preexecutor function to the list of preexecutors.
     *
     * @param {Function} preexecutor - The preexecutor function to add.
     * @return {void} No return value.
     */
    public addPreexecutor(preexecutor: PreExecutorType): void {
        this.preexecutors.push(preexecutor);
    }

    /**
     * Add a postexecutor function to the list.
     *
     * @param {Function} postexecutor - The postexecutor function to add
     * @return {void} 
     */
    public addPostexecutor(postexecutor: PostExecutorType): void {
        this.postexecutors.push(postexecutor);
    }

    /**
     * Executes code before the request is processed.
     *
     * @param {Request} req - the request object
     * @return {Promise<void>}
     */
    private async preexecutor(req: Request, res: Response) {
        this.logger.appendContext("PreExecutor");

        for(const preexecutor of this.preexecutors) {
            let [_, error] = await this.errorHandler.try(
                preexecutor.bind(this, req),
                this.handleError.bind(this, res),
                "preexecutor"
            )

            if(error) {
                this.logger.popContext();
                throw error;
            }
        }

        this.logger.popContext();
    }

    /**
     * Executes the method with error handling and binding to the current context.
     *
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @param {(req: Request) => Promise<T>} method - The method to execute
     * @param {string} methodName - The name of the method being executed
     * @return {Promise<T>} The output of the method execution
     */
    private async methodExecutor<T>(req: Request, res: Response, method: (req: Request) => Promise<T>, methodName: string): Promise<T> {
        this.logger.appendContext("MethodExecutor");

        var [output, error] = await this.errorHandler.try<T>(
            method.bind(this, req),
            this.handleError.bind(this, res),
            methodName
        );

        if(error) {
            this.logger.popContext();
            throw error;
        }

        return output;
    }

    /**
     * Executes code after the request is processed.
     *
     * @param {Response} res - the response object
     * @return {Promise<void>}
     */
    private async postexecutor<T>(req: Request, res: Response, output: T) {
        if(this.errorHapened) {
            this.logger.debug("error hapened, not running postexecutor");
            return;
        }

        this.logger.appendContext("PostExecutor");

        for(const postexecutor of this.postexecutors) {
            let [_, error] = await this.errorHandler.try(
                postexecutor.bind(this, req, res, output),
                this.handleError.bind(this, res),
                "postexecutor"
            )

            if(error) {
                this.logger.popContext();
                throw error;
            }
        }

        this.logger.popContext();
    }

    /**
     * Handles errors by setting errorHapened flag to true, logging the error, and sending it in the response.
     *
     * @param {Response} res - the response object
     * @param {Errors.ServiceError} err - the service error object
     * @return {void} No return value
     */
    private handleError(res: Response, err: Errors.ServiceError) {
        this.errorHapened = true;
        res.status(err.code)

        if (err) {
            this.logger.error(JSON.stringify(err));
            res.send(err);
        }
    }

    /**
     * A function that acts as an executor for a given method.
     *
     * @param {Function} method - the method to be executed
     * @return {Function} an asynchronous function that executes the method with pre and post-execution steps
     */
    public executor<T>(this: BaseService, method: (req: Request) => Promise<T>, methodName: string, authoriseRequest: boolean): (req: Request, res: Response) => Promise<void> {
        return async (req: Request, res: Response) => {
            this.logger.info(`executing method: ${methodName}:`, true);

            this.authoriseRequest = authoriseRequest;
            this.errorHapened = false;

            try {
                await this.preexecutor(req, res);
                var output = await this.methodExecutor(req, res, method, methodName);
                await this.postexecutor(req, res, output);
            } catch (err) {
                this.logger.error(err.message);
            }
        };
    }
}