import { LogLevel } from "./LogLevel";
import { ILogger } from "./ILogger";

/**
 * Base logger class.
 * @export
 * @class BaseLogger
 * @implements {ILogger}
 */
export class BaseLogger implements ILogger {
    /**
     * Log level.
     * @type {LogLevel}
     * @memberof BaseLogger
     */
    public logLevel: LogLevel = LogLevel.Info;

    /**
     * Contexts stack.
     * @protected
     * @type {string[]}
     * @memberof BaseLogger
     */
    protected contexts: string[] = [];

    /**
     * Creates an instance of BaseLogger.
     * @param {LogLevel} [LOG_LEVEL] Log level.
     * @memberof BaseLogger
     */
    constructor(LOG_LEVEL?: LogLevel) {
        this.logLevel = LOG_LEVEL || LogLevel.Info;
    }

    /**
     * Adds context to the logger contexts stack.
     * @param {string} context Context to add.
     * @memberof BaseLogger
     */
    public appendContext(context: string): void {
        this.contexts.push(context);
    }

    /**
     * Removes last added context from the logger contexts stack.
     * @memberof BaseLogger
     */
    public popContext(): void {
        this.contexts.pop();
    }

    /**
     * Returns prefix for the log level.
     * @private
     * @param {LogLevel} level Log level.
     * @returns {string} Prefix for the log level.
     * @memberof BaseLogger
     */
    private getLevelPrefix(level: LogLevel): string {
        switch (level) {
            case LogLevel.Error: return "!";
            case LogLevel.Warn: return "w";
            case LogLevel.Info: return "i";
            case LogLevel.Debug: return " ";
            case LogLevel.Trace: return " ";
        }
    }

    /**
     * Adds logger contexts to the message and returns it.
     * @protected
     * @param {string} message Message to add contexts to.
     * @param {LogLevel} level Log level.
     * @returns {string} Message with added contexts.
     * @memberof BaseLogger
     */
    protected addContextToMessage(message: string, level: LogLevel): string {
        if (this.contexts.length > 0) {
            return `[${this.getLevelPrefix(level)}] ${this.contexts.join(": ")}: ${message}`;
        } else {
            return message;
        }
    }

    /**
     * Logs message with given log level.
     * @protected
     * @param {string} message Message to log.
     * @param {LogLevel} level Log level.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    protected log(message: string, level: LogLevel, inNewLine: boolean = false) {
        throw new Error("Method not implemented.");
    }

    /**
     * Logs error message.
     * @param {string} message Message to log.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    public error(message: string, inNewLine: boolean = false) {
        this.log(message, LogLevel.Error, inNewLine);
    }

    /**
     * Logs warning message.
     * @param {string} message Message to log.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    public warn(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Warn, inNewLine);
    }

    /**
     * Logs info message.
     * @param {string} message Message to log.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    public info(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Info, inNewLine);
    }

    /**
     * Logs debug message.
     * @param {string} message Message to log.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    public debug(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Debug, inNewLine);
    }

    /**
     * Logs trace message.
     * @param {string} message Message to log.
     * @param {boolean} [inNewLine] Whether to log message in new line.
     * @memberof BaseLogger
     */
    public trace(message: string, inNewLine: boolean = false): void {
        this.log(message, LogLevel.Trace, inNewLine);
    }
}

