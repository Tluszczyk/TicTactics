export enum Symbol {
    X = "X",
    O = "O",
    EMPTY = "EMPTY"
}

export function serialiseSymol(symbol: Symbol): string {
    switch (symbol) {
        case Symbol.X:
            return "X";
        case Symbol.O:
            return "O";
        default:
            return " ";
    }
}

export function deserialiseSymol(symbol: string): Symbol {
    switch (symbol) {
        case "X":
            return Symbol.X;
        case "O":
            return Symbol.O;
        default:
            return Symbol.EMPTY;
    }
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