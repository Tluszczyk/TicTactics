import * as sdk from "node-appwrite";
import * as types from "../types";

import { AuthorisationService } from "./AuthorisationService";

export namespace AuthorisationRunners {
    /**
     * Creates a new user with the provided credentials.
     *
     * @param {types.Credentials} credentials - The user's credentials including email, phone, password, and name.
     * @return {Promise<[string,string]>} the user id
     */
    export async function createUserRunner(this: AuthorisationService, credentials: types.Credentials): Promise<[string, string]> {
        var user = await this.users.create(
            sdk.ID.unique(),
            credentials.email,
            credentials.phone,
            credentials.password,
            credentials.name
        )

        return [user.$id, user.$id];
    }

    /**
     * Saves the public data of a user to the server databases.
     *
     * @param {string} userId - The unique identifier of the user.
     * @param {types.Credentials} credentials - The user's credentials.
     * @return {Promise<[null,null]>}
     */
    export async function saveUserPublicDataRunner(this: AuthorisationService, userId: string, credentials: types.Credentials): Promise<[null,null]> {
        await this.serverDatabases.createDocument(
            this.database.$id, this.usersPublicData.$id,
            userId, { 
                userId: userId,
                username: credentials.name, 
                ELO: 1000 
            } as types.UserPublicData,
            [
                sdk.Permission.update(sdk.Role.user(userId)),
                sdk.Permission.delete(sdk.Role.user(userId))
            ]
        );

        return [null,null]
    }

    /**
     * Creates a new session using the provided credentials.
     *
     * @param {types.Credentials} credentials - The user's credentials including email and password.
     * @return {Promise<[sdk.Models.Session,null]>} The created session or null if unsuccessful.
     */
    export async function createSessionRunner(this: AuthorisationService, credentials: types.Credentials): Promise<[sdk.Models.Session,null]> {
        const account = new sdk.Account(this.server);

        const session = await account.createEmailPasswordSession(credentials.email, credentials.password);

        return [session,null]
    }

    /**
     * Deletes the current session by finding it in the session list and deleting it from the user's sessions.
     *
     * @return {Promise<[null, null]>} Returns a tuple indicating a successful deletion.
     */
    export async function deleteSessionRunner(this: AuthorisationService): Promise<[null,null]> {
        const account = new sdk.Account(this.client);

        const sessionList = await account.listSessions();

        const currentSession = sessionList.sessions.find(session => session.current);
        
        await this.users.deleteSession(currentSession.userId, currentSession.$id);
        return [null,null]
    }

    /**
     * Deletes a user's data document from the database.
     *
     * @param {string} userId - The ID of the user whose data will be deleted
     * @return {Promise<[null,sdk.Models.Document]>} the deleted document
     */
    export async function deleteUserPublicDataRunner(this: AuthorisationService, userId: string): Promise<[null,sdk.Models.Document]> {
        var document = await this.clientDatabases.getDocument(
            this.database.$id, this.usersPublicData.$id, userId
        )

        await this.clientDatabases.deleteDocument(
            this.database.$id, this.usersPublicData.$id, userId
        );
        return [null,document]
    }

    /**
     * Deletes a user using the provided userId.
     *
     * @param {string} userId - The id of the user to be deleted.
     * @return {Promise<[null, null]>}
     */
    export async function deleteUserRunner(this: AuthorisationService, userId: string): Promise<[null,null]> {
        await this.users.delete(userId);
        return [null, null];
    }
}
