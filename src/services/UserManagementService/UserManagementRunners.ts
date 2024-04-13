import * as sdk from "node-appwrite";

import { UserManagementService } from "./UserManagementService";

export namespace UserManagementRunners {
    export async function listDocumentsRunner(this: UserManagementService, username: string) {
        var usersPublicData = await this.clientDatabases.listDocuments(
            this.database.$id, this.usersPublicData.$id,
            [sdk.Query.search("username", username)]
        )
    
        return [usersPublicData, null];
    }
}