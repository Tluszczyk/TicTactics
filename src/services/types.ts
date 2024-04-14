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

/**
 * Parses the user public data from the provided document.
 *
 * @param {Models.Document} document - The document containing user data.
 * @return {UserPublicData} The parsed user public data.
 */
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

