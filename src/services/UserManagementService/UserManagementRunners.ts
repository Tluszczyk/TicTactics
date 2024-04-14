import * as sdk from "node-appwrite";

import { UserManagementService } from "./UserManagementService";

export namespace UserManagementRunners {
    /**
     * Retrieves a list of documents based on the provided username.
     *
     * @param {string} username - The username to search for in the documents.
     * @return {Promise<[sdk.Models.DocumentList<sdk.Models.Document>, null]>} A tuple containing the list of documents and a null value.
     */
    export async function listDocumentsRunner(this: UserManagementService, username: string) {
        var usersPublicData = await this.clientDatabases.listDocuments(
            this.database.$id, this.usersPublicData.$id,
            [sdk.Query.search("username", username)]
        )
    
        return [usersPublicData, null];
    }
}