import { Errors } from "./Errors";

export class ErrorProvider {
    /**
     * Parses the error message and returns the corresponding Errors.ServiceError based on the message content.
     *
     * @param {string} message - The error message to parse.
     * @return {Errors.ServiceError} The corresponding Errors.ServiceError based on the parsed message.
     */
    public static parseError(message: string): Errors.ServiceError {

        switch(message) {
            case message.match(/User \(.*\) missing scope \(.*\)/)?.input:
                return Errors.UNAUTHORISED;

            case message.match(/The current user is not authorized to perform the requested action./)?.input:
                return Errors.PERMISSION_DENIED;

            case message.match(/A user with the same id, email, or phone already exists in this project./)?.input:
                return Errors.USER_ALREADY_EXISTS;

            case message.match(/User with the requested ID could not be found./)?.input:
                return Errors.USER_NOT_FOUND;
            
            case message.match(/Invalid credentials. Please check the email and password./)?.input:
                return Errors.INVALID_CREDENTIALS;

            case message.match(/Document with the requested ID could not be found./)?.input:
                return Errors.DOCUMENT_NOT_FOUND;

            default:
                return Errors.INTERNAL_SERVER_ERROR;
        }
    }
}