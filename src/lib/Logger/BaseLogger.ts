import { LogLevel } from "typescript-logging";
import { ILogger } from "./ILogger";

export class BaseLogger implements ILogger {
    public logLevel: LogLevel = LogLevel.Info;
    protected contexts: string[] = [];

    constructor(LOG_LEVEL?: LogLevel) {
        this.logLevel = LOG_LEVEL || LogLevel.Info;
    }

    public appendContext(context: string): void {
        this.contexts.push(context);
    }

    public popContext(): void {
        this.contexts.pop();
    }

    private getLevelPrefix(level: LogLevel): string {
        switch (level) {
            case LogLevel.Error: return "!";
            case LogLevel.Warn: return "w";
            case LogLevel.Info: return "i";
            case LogLevel.Debug: return " ";
            case LogLevel.Trace: return " ";
        }
    }

    protected addContextToMessage(message: string, level: LogLevel): string {
        if (this.contexts.length > 0) {
            return `[${this.getLevelPrefix(level)}] ${this.contexts.join(": ")}: ${message}`;
        } else {
            return message;
        }
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