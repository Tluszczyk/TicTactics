import { Models } from "node-appwrite";

// Types

export type Credentials = {
    name?: string;
    password?: string;
    email?: string;
    phone?: string;
}

export type UserPublicData = {
    userId: string;
    username: string;
    ELO: number;
}

export function parseUserPublicData(document: Models.Document): UserPublicData {
    const userPublicData: UserPublicData = {} as UserPublicData;

    Object.entries(document).forEach(
        ([key, value]) => {
            if (key[0] !== "$") {
                // @ts-ignore
                userPublicData[key] = value;
            }
        }
    );

    return userPublicData;
}

