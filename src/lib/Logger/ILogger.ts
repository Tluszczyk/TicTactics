import { LogLevel } from "typescript-logging";

export interface ILogger {
    readonly logLevel: LogLevel

    appendContext(context: string): void;
    popContext(): void;

    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    debug(message: string): void;
    trace(message: string): void;
}