import { Models } from "node-appwrite";

// Types

export type Credentials = {
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
}

export type UserData = {
    ELO: number;
}

export function parseUserData(document: Models.Document): UserData {
    const userData: UserData = {} as UserData;

    Object.entries(document).forEach(
        ([key, value]) => {
            if (key[0] !== "$") {
                // @ts-ignore
                userData[key] = value;
            }
        }
    );

    return userData;
}

