import { LogLevel } from "./LogLevel";
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

    protected log(message: string, level: LogLevel, inNewLine: boolean = false) {
        throw new Error("Method not implemented.");
    }
    
    public error(message: string, inNewLine: boolean = false) {
        this.log(message, LogLevel.Error, inNewLine);
    }
    
    public warn(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Warn, inNewLine);
    }
    
    public info(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Info, inNewLine);
    }
    
    public debug(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Debug, inNewLine);
    }
    
    public trace(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Trace, inNewLine);
    }
}