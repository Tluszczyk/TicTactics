import { BaseLogger } from "./BaseLogger";
import { LogLevel } from "./LogLevel";

export class ConsoleLogger extends BaseLogger {
    /**
     * Logs message with given log level.
     *
     * @param {string} message - Message to log.
     * @param {LogLevel} level - Log level.
     * @param {boolean} [inNewLine] - Whether to log message in a new line.
     */
    protected log(message: string, level: LogLevel, inNewLine: boolean = false) {
        if (level >= this.logLevel) {
            console.log(
                (inNewLine ? "\n":"") + this.addContextToMessage(message, level)
            );
        }
    }
}