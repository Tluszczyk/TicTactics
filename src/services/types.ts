import { Models } from "node-appwrite";

import * as logicTypes from "../logic/GameLogic/types";
import * as sdk from "node-appwrite";

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

export type GameSettings = {
    isPrivate: boolean;
    accessToken?: string;
    opponentId: string;
    creatorSymbol: string;
}

export type Game = GameSettings & {
    serialisedBoard: string;
    oPlayerId: string;
    xPlayerId: string;
    winner: string;
    status: string;
}

export type ELOFilter = {
    min: number;
    max: number;
}

export type GameFilter = {
    oPlayerId?: string;
    xPlayerId?: string;
    isPrivate?: boolean;
    status?: logicTypes.GameStatus;
    ELO?: ELOFilter;
}

export type ListGamesResponse = {
    games: Game[];
    queryCursor: string;
    hasMore: boolean;
}

/**
 * Parses the object from the provided document.
 *
 * @param {Models.Document} document - The document containing user data.
 * @return {OutputType} The parsed data object.
 */
export function parseObjectFromDocument<OutputType>(document: Models.Document): OutputType {
    const outputData: OutputType = {} as OutputType;

    Object.entries(document).forEach(
        ([key, value]) => {
            if (key[0] !== "$") {
                // @ts-ignore
                outputData[key] = value;
            }
        }
    );

    return outputData;
}

/**
 * Create an array of queries from the provided filter, query limit, and query cursor.
 *
 * @param {GameFilter} filter - The filter to apply when creating queries.
 * @param {number} [queryLimit] - The maximum number of games to retrieve.
 * @param {string} [queryCursor] - The cursor to use for pagination.
 * @return {string[]} An array of queries.
 */
export function createQueriesFromFilter(filter: GameFilter, queryLimit?: number, queryCursor?: string): string[] {
    const queries: string[] = [
        sdk.Query.limit(queryLimit ?? 10)
    ];

    if (queryCursor !== undefined) {
        queries.push(sdk.Query.cursorAfter(queryCursor))
    }

    if (filter) {

        if (filter.oPlayerId !== undefined) {
            queries.push(sdk.Query.equal("oPlayerId", filter.oPlayerId))
        }
        if (filter.xPlayerId !== undefined) {
            queries.push(sdk.Query.equal("xPlayerId", filter.xPlayerId))
        }
        if (filter.isPrivate !== undefined) {
            queries.push(sdk.Query.equal("isPrivate", filter.isPrivate));
        }
        if (filter.status !== undefined) {
            queries.push(sdk.Query.equal("status", filter.status));
        }
        if (filter.ELO !== undefined) {
            queries.push(sdk.Query.greaterThan("ELO", filter.ELO.min));
            queries.push(sdk.Query.lessThan("ELO", filter.ELO.max));
        }
    }
 
    return queries;
}