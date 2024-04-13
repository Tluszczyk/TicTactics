export namespace Errors {
    export type ServiceError = {
        code: number
        title: string
        message: string
    }
    
    export const UNAUTHORISED = {
        code: 401, 
        title: "Unauthorised", 
        message: "Access token is missing or invalid"
    }

    export const PERMISSION_DENIED = {
        code: 403, 
        title: "Forbidden", 
        message: "The current user is not authorized to perform the requested action."
    }

    export const INVALID_CREDENTIALS = {
        code: 401, 
        title: "Unauthorised", 
        message: "Invalid credentials. Please check the email and password."
    }

    export const USER_NOT_FOUND = {
        code: 404, 
        title: "Not Found",
        message: "User not found"
    }

    export const DOCUMENT_NOT_FOUND = {
        code: 404, 
        title: "Not Found",
        message: "Document not found"
    }

    export const USER_ALREADY_EXISTS = {
        code: 409, 
        title: "Conflict",
        message: "User already exists"
    }

    export const INTERNAL_SERVER_ERROR = {
        code: 500, 
        title: "Internal Server Error",
        message: "Unknown error"
    }
}