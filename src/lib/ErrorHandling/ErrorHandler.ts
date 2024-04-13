import { LoggingClass } from "../LoggingClass";

import { ErrorProvider } from "./ErrorProvider";
import { Errors } from "./Errors";

export class ErrorHandler extends LoggingClass {

    constructor() {
        super();
        this.logger.appendContext("ErrorHandler");
    }

    public async try<T>(func: () => Promise<T>, failCallback: (err: Errors.ServiceError) => void, actionMessage: string): Promise<[T,Errors.ServiceError]> {
        this.logger.debug(`trying ${actionMessage}`);

        var serviceError: Errors.ServiceError = null;

        try {
            var result = await func();

            this.logger.debug(`success ${actionMessage}`);

            return [result, null];

        } catch (err) {
            this.logger.error(`failed ${actionMessage}: ${err.message}`);
            
            var serviceError = ErrorProvider.parseError(err.message)

            if ( failCallback ) failCallback(serviceError);

            return [null, serviceError];
        }
    }
}