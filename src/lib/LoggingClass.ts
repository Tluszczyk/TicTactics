import { LogLevel } from "./Logger/LogLevel";
import { BaseLogger } from "./Logger/BaseLogger";
import { ConsoleLogger } from "./Logger/ConsoleLogger";
import { EnvironmentVariablesManager } from "../EnvironmentVariablesManager";

export class LoggingClass {
    protected logger: BaseLogger = new ConsoleLogger(LogLevel.toLogLevel(EnvironmentVariablesManager.getLOGGING_LEVEL()));
}