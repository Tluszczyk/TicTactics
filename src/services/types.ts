// Imports
import Express from 'express';

// Types

export type Credentials = {
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
}


// Requests

export type CreateUserRequest = {
    credentials: Credentials
}


// Responses

export type CreateUserResponse = {}
