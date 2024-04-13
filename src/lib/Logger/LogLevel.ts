/**
 * Log level for a logger.
 */
export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    Off = 6
}
export namespace LogLevel {
    /**
     * Convert given value to LogLevel, if not matching returns undefined.
     * @param val Value to convert
     */
    export function toLogLevel(val: string): LogLevel | undefined {
        switch (val) {
            case "Trace": return LogLevel.Trace;
            case "Debug": return LogLevel.Debug;
            case "Info": return LogLevel.Info;
            case "Warn": return LogLevel.Warn;
            case "Error": return LogLevel.Error;
            case "Fatal": return LogLevel.Fatal;
            case "Off": return LogLevel.Off;
            default: return undefined;
        }
    }
}