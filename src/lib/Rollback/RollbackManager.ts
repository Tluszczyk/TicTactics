import { LoggingClass } from "../LoggingClass";
import { RollbackableOperation } from "./RollbackableOperation";

import { ErrorHandler } from "../ErrorHandling/ErrorHandler";
import { Errors } from "../ErrorHandling/Errors";

export class RollbackManager extends LoggingClass {
    /**
     * Manager for RollbackableOperations.
     * If an operation fails, the RollbackManager will attempt to rollback all previously successful operations.
     * The RollbackManager keeps track of the inputs needed for rollback.
     */

    private operations: RollbackableOperation<any,any>[] = [];
    private rollbackInputs: any[] = [];
    
    private didFail: boolean = false;
    private error: Errors.ServiceError;

    protected errorHandler: ErrorHandler = new ErrorHandler();

    constructor() {
        super();

        this.logger.appendContext("RollbackManager");
    }

    /**
     * Runs a rollbackable operation and handles the success or failure.
     * @typeparam {RollbackableOperation<RunnerOutputType,RollbackInputType>} operation - the operation to be executed
     *
     * @param {RollbackableOperation<RunnerOutputType,RollbackInputType>} operation - the operation to be executed
     * @return {Promise<[boolean,RunnerOutputType]>} a promise containing a boolean indicating success or failure, and the runner output
     */
    public async run<RunnerOutputType,RollbackInputType>(operation: RollbackableOperation<RunnerOutputType,RollbackInputType>): Promise<[boolean,RunnerOutputType]> {
        this.logger.debug(`running ${operation.actionMessage}`);

        if ( this.didFail ) {
            this.logger.debug(`skipping ${operation.actionMessage}, because previous operation failed`);
            return [false, null];
        }
        
        var [tryOutput, err] = await this.errorHandler.try(operation.runner, null, operation.actionMessage);

        if ( err === null ) {
            var [runnerOutput, rollbackInput] = tryOutput;

            this.logger.debug(`success ${operation.actionMessage}`);

            this.operations.push(operation);
            this.rollbackInputs.push(rollbackInput);

            return [true, runnerOutput];
        
        } else {
            this.logger.error(`failed ${operation.actionMessage}: ${err.message}`);
            
            this.didFail = true;
            this.error = err;

            await this.rollback();
            return [false,null]
        }
    }

    /**
     * Clears the operations array, rollback inputs array, and resets the didFail flag.
     *
     */
    public clear(): void {
        this.operations = [];
        this.rollbackInputs = [];
        this.didFail = false;
    }

    /**
     * Rolls back all previously successful operations.
     *
     * @return {Promise<any>} - the result value should be ignored 
     */
    private async rollback(): Promise<any> {
        this.logger.debug("rolling back");

        var index = 0;
        for(const operation of this.operations) {
            if(operation.rollback) await operation.rollback(this.rollbackInputs[index++]);
        }
    }

    /**
     * Check if the action failed.
     *
     * @return {boolean} the result of the check
     */
    public didItFail(): boolean {
        return this.didFail;
    }

    /**
     * Retrieves the error message.
     *
     * @return {string} the error message
     */
    public getError(): Errors.ServiceError {
        return this.error;
    }
}