import { BaseService } from "./BaseService";

import * as sdk from "node-appwrite";

export namespace ServiceRunners {
    /**
     * Retrieves a user that is currently logged in.
     *
     * @param {string} userId - The ID of the user to be retrieved.
     * @return {Promise<sdk.Models.User<sdk.Models.Preferences>>} The user object retrieved.
     */
    export async function getUserFromSessionRunner(this: BaseService): Promise<[sdk.Models.User<sdk.Models.Preferences>,null]> {
        const account = new sdk.Account(this.client);

        let user = await account.get();
        return [user, null]
    }
}