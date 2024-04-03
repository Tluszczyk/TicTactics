import { BaseLogger } from "./BaseLogger";
import { LogLevel } from "typescript-logging";

export class ConsoleLogger extends BaseLogger {
    protected log(message: string, level: LogLevel) {
        if (level >= this.logLevel) {
            console.log(message);
        }
    }
}