export enum Symbol {
    X = "X",
    O = "O",
    EMPTY = "EMPTY"
}

export enum Winner {
    X = "X",
    O = "O",
    DRAW = "DRAW",
    NONE = "NONE"
}

export enum GameStatus {
    WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

/**
 * Generates a random symbol (X or O) based on a random number.
 *
 * @return {Symbol} The randomly generated symbol (X or O).
 */
export function getRandomSymbol(): Symbol {
    return Math.random() < 0.5 ? Symbol.X : Symbol.O;
}