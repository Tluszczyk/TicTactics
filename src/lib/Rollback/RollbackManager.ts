import { LoggingClass } from "../LoggingClass";
import { ErrorHandler } from "../ErrorHandler";

import { RollbackableOperation } from "./RollbackableOperation";

export class RollbackManager extends LoggingClass {

    private operations: RollbackableOperation<any,any>[] = [];
    private rollbackInputs: any[] = [];
    
    private didFail: boolean = false;
    private errorMessage: string = "unknown error";

    protected errorHandler: ErrorHandler = new ErrorHandler();

    constructor() {
        super();

        this.logger.appendContext("RollbackManager");
    }

    public async run<RunnerOutputType,RollbackInputType>(operation: RollbackableOperation<RunnerOutputType,RollbackInputType>): Promise<[boolean,RunnerOutputType|void]> {
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
            this.errorMessage = err.message;

            await this.rollback();
            return [false,null]
        }
    }

    public clear(): void {
        this.operations = [];
        this.rollbackInputs = [];
    }

    private rollback(): Promise<any> {
        this.logger.debug("rolling back");

        return Promise.all(this.operations.map((operation, index) => (operation.rollback ?? Promise.resolve)(this.rollbackInputs[index])))
    }

    public didItFail(): boolean {
        return this.didFail;
    }

    public getErrorMessage(): string {
        return this.errorMessage;
    }
}