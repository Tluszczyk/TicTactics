import { LogLevel } from "typescript-logging";
import { BaseLogger } from "./Logger/BaseLogger";
import { ConsoleLogger } from "./Logger/ConsoleLogger";

export class LoggingClass {
    protected logger: BaseLogger = new ConsoleLogger(LogLevel.Info);
}