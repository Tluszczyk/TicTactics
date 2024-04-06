export class RollbackableOperation<RunnerOutputType,RollbackInputType> {
    public runner: () => Promise<[RunnerOutputType,RollbackInputType]>;
    public rollback?: (input: RollbackInputType) => Promise<void>;
    public actionMessage: string;
}