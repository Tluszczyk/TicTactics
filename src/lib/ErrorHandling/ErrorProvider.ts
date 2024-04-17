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
                return Errors.build_UNAUTHORISED();

            case message.match(/The current user is not authorized to perform the requested action./)?.input:
                return Errors.build_PERMISSION_DENIED();

            case message.match(/Permissions must be one of./)?.input:
                return Errors.build_PERMISSION_DENIED();

            case message.match(/Player is not part of the game/)?.input:
                return Errors.build_PERMISSION_DENIED("Player is not part of the game");

            case message.match(/Cannot quit game in finished state/)?.input:
                return Errors.build_PERMISSION_DENIED("Cannot quit game in finished state");

            case message.match(/A user with the same id, email, or phone already exists in this project./)?.input:
                return Errors.build_USER_ALREADY_EXISTS();

            case message.match(/User with the requested ID could not be found./)?.input:
                return Errors.build_USER_NOT_FOUND();
            
            case message.match(/Invalid credentials. Please check the email and password./)?.input:
                return Errors.build_INVALID_CREDENTIALS();

            case message.match(/Document with the requested ID could not be found./)?.input:
                return Errors.build_DOCUMENT_NOT_FOUND();

            case message.match(/Document \'.*\' for the \'.*\' value not found./)?.input:
                return Errors.build_BAD_REQUEST()

            default:
                return Errors.build_INTERNAL_SERVER_ERROR();
        }
    }
}