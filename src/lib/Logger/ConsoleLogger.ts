import { BaseLogger } from "./BaseLogger";
import { LogLevel } from "./LogLevel";

export class ConsoleLogger extends BaseLogger {
    protected log(message: string, level: LogLevel, inNewLine: boolean = false) {
        if (level >= this.logLevel) {
            console.log(
                (inNewLine ? "\n":"") + this.addContextToMessage(message, level)
            );
        }
    }
}