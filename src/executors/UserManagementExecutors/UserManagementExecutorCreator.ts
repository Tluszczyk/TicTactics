import { IUserManagementExecutor } from "../../interfaces/UserManagementInterface";
import { UserManagementLocalExecutor } from "./UserManagementLocalExecutor";

import { EnvironmentVariablesManager } from "../../EnvironmentVariablesManager";
import { DeploymentOption } from "../../lib/DeploymentOption";

export class UserManagementExecutorCreator {

    public static createUserExecutor(): IUserManagementExecutor {
        switch (EnvironmentVariablesManager.getUSER_MANAGEMENT_SERVICE_DEPLOYMENT_OPTION()) {
            case DeploymentOption.LOCAL:
                return new UserManagementLocalExecutor();

            default:
                return new UserManagementLocalExecutor();
        }
    }
}