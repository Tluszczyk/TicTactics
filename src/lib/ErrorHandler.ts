import { LoggingClass } from "./LoggingClass";

export class ErrorHandler extends LoggingClass {

    constructor() {
        super();
        this.logger.appendContext("ErrorHandler");
    }

    public async try<T>(func: () => Promise<T>, failCallback: (err: Error) => void, actionMessage: string): Promise<[T,Error]> {
        this.logger.debug(`trying ${actionMessage}`);

        try {
            var result = await func();

            this.logger.debug(`success ${actionMessage}`);

            return [result, null];

        } catch (err) {
            this.logger.error(`failed ${actionMessage}: ${err.message}`);

            if ( failCallback ) failCallback(err);

            return [null, err];
        }
    }
}