import { LogLevel } from "typescript-logging";
import { ILogger } from "./ILogger";

export class BaseLogger implements ILogger {
    public logLevel: LogLevel = LogLevel.Info;

    constructor(LOG_LEVEL?: LogLevel) {
        this.logLevel = LOG_LEVEL || LogLevel.Info;
    }

    protected log(message: string, level: LogLevel) {
        throw new Error("Method not implemented.");
    }
    
    public error(message: string) {
        this.log(message, LogLevel.Error);
    }
    
    public warn(message: string): void {
        this.log(message, LogLevel.Warn);
    }
    
    public info(message: string): void {
        this.log(message, LogLevel.Info);
    }
    
    public debug(message: string): void {
        this.log(message, LogLevel.Debug);
    }
    
    public trace(message: string): void {
        this.log(message, LogLevel.Trace);
    }
}