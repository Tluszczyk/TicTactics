import { EnvironmentVariablesManager } from "../src/EnvironmentVariablesManager";
import * as sdk from "node-appwrite";

import * as fs from "fs"
import * as yaml from "js-yaml"

import * as dotenv from 'dotenv';
dotenv.config();

enum PermissionRoleTargets {
    ANY = "any",
    USERS = "users",
}

enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
}

type Permission = {
    action: PermissionAction
    roles: PermissionRoleTargets[]
}

enum AttributeType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
    ENUM = "enum",
    ARRAY = "array",
}

enum AttributeArrayItemType {
    STRING = "string",
    NUMBER = "number",
    BOOLEAN = "boolean",
}

type Attribute = {
    name: string,
    type: AttributeType,
    required?: boolean
    items?: AttributeArrayItemType,
    values?: string[]
}

enum IndexType {
    FULLTEXT = "fulltext",
}

type Index = {
    name: string,
    type: IndexType,
    attributes: string[]
}

type CollectionConfiguration = {
    name: string,
    id: string,
    permissions: Permission[],
    attributes: Attribute[],
    indexes: Index[]
}

function parsePermissions(permissions: Permission[]): string[] {
    let parsedPermissions: string[] = [];

    for(const permission of permissions)
        for (const role of permission.roles)
            parsedPermissions.push(sdk.Permission[permission.action](sdk.Role[role]()))

    return parsedPermissions
}

async function createStringAttribute(databases: sdk.Databases, collectionId: string, attribute: Attribute) {
    try {
        await databases.createStringAttribute(
            EnvironmentVariablesManager.getDATABASE_ID(),
            collectionId,
            attribute.name, 100, attribute.required, null, attribute.type === AttributeType.ARRAY
        )
    } catch (error) { console.log(error) }
}

async function createNumberAttribute(databases: sdk.Databases, collectionId: string, attribute: Attribute) {
    try {
        await databases.createIntegerAttribute(
            EnvironmentVariablesManager.getDATABASE_ID(),
            collectionId,
            attribute.name, attribute.required, null, null, null, attribute.type === AttributeType.ARRAY
        )
    } catch (error) { console.log(error) }
}

async function createBooleanAttribute(databases: sdk.Databases, collectionId: string, attribute: Attribute) {
    try {
        await databases.createBooleanAttribute(
            EnvironmentVariablesManager.getDATABASE_ID(),
            collectionId,
            attribute.name, attribute.required, null, attribute.type === AttributeType.ARRAY
        )
    } catch (error) { console.log(error) }
}

async function createEnumAttribute(databases: sdk.Databases, collectionId: string, attribute: Attribute) {
    try {
        await databases.createEnumAttribute(
            EnvironmentVariablesManager.getDATABASE_ID(),
            collectionId,
            attribute.name, attribute.values, attribute.required, null, attribute.type === AttributeType.ARRAY
        )
    } catch (error) { console.log(error) }
}

async function createAttribute(databases: sdk.Databases, collectionId: string, attribute: Attribute) {
    try {
        switch(attribute.items ?? attribute.type) {
            case AttributeType.STRING:
                await createStringAttribute(databases, collectionId, attribute)
                break
            case AttributeType.NUMBER:
                await createNumberAttribute(databases, collectionId, attribute)
                break
            case AttributeType.BOOLEAN:
                await createBooleanAttribute(databases, collectionId, attribute)
                break
            case AttributeType.ENUM:
                await createEnumAttribute(databases, collectionId, attribute)
                break
        }

    } catch (error) { console.log(error) }
}

async function createCollection(databases: sdk.Databases, collectionConfigurationFilePath: string) {
    let collectionConfiguration = yaml.load(fs.readFileSync(collectionConfigurationFilePath, 'utf8'))["Collection"] as CollectionConfiguration;

    // Create collection
    try {
        await databases.createCollection(
            EnvironmentVariablesManager.getDATABASE_ID(),
            collectionConfiguration.id,
            collectionConfiguration.name,
            parsePermissions(collectionConfiguration.permissions),
            true
        )
    } catch (error) { console.log(error) }

    // Create attributes
    try {
        for (const attribute of collectionConfiguration.attributes)
            await createAttribute(databases, collectionConfiguration.id, attribute)
    } catch (error) { console.log(error) }

    // Wait for 2 seconds to ensure collection is created before creating attributes and indexes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create indexes
    try {
        for (const index of collectionConfiguration.indexes ?? [])
            await databases.createIndex(
                EnvironmentVariablesManager.getDATABASE_ID(),
                collectionConfiguration.id,
                index.name, index.type, index.attributes
            )
    
        } catch (error) { console.log(error) }
}

async function main() {
    const admin = new sdk.Client();

    admin
        .setEndpoint(EnvironmentVariablesManager.getAPPWRITE_ENDPOINT())
        .setProject(EnvironmentVariablesManager.getAPPWRITE_PROJECT())
        .setKey(EnvironmentVariablesManager.getAPPWRITE_API_KEY())

    const databases = new sdk.Databases(admin)

    // Create database
    try {
        await databases.create(
            EnvironmentVariablesManager.getDATABASE_ID(),
            EnvironmentVariablesManager.getDATABASE_ID()
        )
    } catch (error) { console.log(error) }

    // Create collections

    // Users public data
    await createCollection(databases, "database/collections/usersPublicData.yaml")

    // Games
    await createCollection(databases, "database/collections/games.yaml")
}

main()