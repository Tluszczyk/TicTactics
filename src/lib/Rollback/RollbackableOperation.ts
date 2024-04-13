export class RollbackableOperation<RunnerOutputType,RollbackInputType> {
    /**
     * @class RollbackableOperation
     * @classdesc
     * 
     * Represents a single operation that can be rolled back if it fails.
     * 
     * If the operation fails, the RollbackManager will call the rollback function,
     * passing it the input that was returned by the runner, when it was executed.
     * 
     * The runner function is responsible for performing the action, and returning
     * the necessary data for the rollback function, if it fails.
     * 
     * The rollback function is responsible for undoing the action, and must not fail.
     * 
     * If the rollback function throws an exception, the RollbackManager will log an error,
     * and continue with the rollback process for the remaining operations.
     * 
     * @property {() => Promise<[RunnerOutputType,RollbackInputType]>} runner - function that performs the action
     * @property {(input: RollbackInputType) => Promise<void>} [rollback] - function that rolls back the runner action
     * @property {string} actionMessage - message that describes the action, used for logging
     */

    /**
     * Function that performs the action.
     * Must return an array with 2 items:
     * [0] - output of the action, to be returned to the client
     * [1] - input for the rollback function.
     * 
     * @returns {[RunnerOutputType,RollbackInputType]} - the first item is the output of the action and the second is the input for the rollback
     */
    public runner: () => Promise<[RunnerOutputType,RollbackInputType]>;


    /**
     * Function that rolls back the runner action.
     * @param {RollbackInputType} input - input that was returned by the runner, when it was executed.
     * @returns {Promise<void>} - must not fail for now
     */
    public rollback?: (input: RollbackInputType) => Promise<void>;

    /**
     * Human-readable message that describes the action being performed by the runner.
     * Used for logging purposes.
     * @type {string}
     */
    public actionMessage: string;
}