export namespace Errors {
    export type ServiceError = {
        code: number
        title: string
        message: string
    }

    export interface ErrorBuilder {
        (message?: string): ServiceError
    }

    export const build_BAD_REQUEST: ErrorBuilder = (message: string) => ({
        code: 400, 
        title: "Bad Request",
        message: message ?? "Invalid request"
    })
    
    export const build_UNAUTHORISED: ErrorBuilder = (message: string) => ({
        code: 401, 
        title: "Unauthorised", 
        message: message ?? "Access token is missing or invalid"
    })

    export const build_INVALID_CREDENTIALS: ErrorBuilder = (message: string) => ({
        code: 401, 
        title: "Unauthorised", 
        message: message ?? "Invalid credentials. Please check the email and password."
    })

    export const build_PERMISSION_DENIED: ErrorBuilder = (message: string) => ({
        code: 403, 
        title: "Forbidden", 
        message: message ?? "The current user is not authorized to perform the requested action."
    })

    export const build_USER_NOT_FOUND: ErrorBuilder = (message: string) => ({
        code: 404, 
        title: "Not Found",
        message: message ?? "User not found"
    })

    export const build_DOCUMENT_NOT_FOUND: ErrorBuilder = (message: string) => ({
        code: 404, 
        title: "Not Found",
        message: message ?? "Document not found"
    })

    export const build_USER_ALREADY_EXISTS: ErrorBuilder = (message: string) => ({
        code: 409, 
        title: "Conflict",
        message: message ?? "User already exists"
    })

    export const build_INTERNAL_SERVER_ERROR: ErrorBuilder = (message: string) => ({
        code: 500, 
        title: "Internal Server Error",
        message: message ?? "Unknown error"
    })
}
