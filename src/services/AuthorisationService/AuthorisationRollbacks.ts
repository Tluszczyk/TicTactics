import * as sdk from "node-appwrite";
import * as types from "../types";

import { AuthorisationService } from "./AuthorisationService";

export namespace AuthorisationRollbacks {
    /**
     * Async function to rollback the creation of a user.
     *
     * @param {string} userId - The ID of the user to be rolled back.
     */
    export async function createUserRollback(this: AuthorisationService, userId: string) {
        await this.users.delete(userId)
    }

    /**
     * Rolls back the deletion of a user's public data.
     *
     * @param {string} userId - The ID of the user to delete.
     * @param {sdk.Models.Document} document - The document containing user data to be created in the databases.
     * @return {Promise<void>}
     */
    export async function deleteUserPublicDataRollback(this: AuthorisationService, userId: string, document: sdk.Models.Document) {
        await this.clientDatabases.createDocument(
            this.database.$id, this.usersPublicData.$id,
            userId, types.parseUserPublicData(document), document.$permissions
        );
    }
}