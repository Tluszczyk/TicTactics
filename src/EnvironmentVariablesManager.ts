export class EnvironmentVariablesManager {
    // Database
    public static getDATABASE_NAME()            { return process.env.DATABASE_NAME;             }
    public static getGAMES_COLLECTION_NAME()    { return process.env.GAMES_COLLECTION_NAME;     }

    // Appwrite
    public static getAPPWRITE_PROJECT()     { return process.env.APPWRITE_PROJECT;          }
    public static getAPPWRITE_ENDPOINT()    { return process.env.APPWRITE_ENDPOINT;         }
    public static getAPPWRITE_API_KEY()     { return process.env.APPWRITE_API_KEY;          }

    // Deployment options
    public static getUSER_MANAGEMENT_SERVICE_DEPLOYMENT_OPTION() { return process.env.USER_MANAGEMENT_SERVICE_DEPLOYMENT_OPTION; }
}
