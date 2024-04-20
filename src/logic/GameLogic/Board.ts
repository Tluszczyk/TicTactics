import { Symbol } from "./types";

import { Move, getRow, getCol, moveFromPosition } from "../../services/types";

export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a Position object based on the given move.
     *
     * @param {Move} move - The move to derive the Position from.
     * @return {Position} The Position object created from the move.
     */
    public static fromMove(move: Move): Position {
        return new Position(getRow.call(move), getCol.call(move));
    }
}

export class Cell {
    public tile = null;

    public localPosition: Position;
    public globalPosition: Position;
    public symbol: Symbol;

    constructor(tile: Tile, position: Position, symbol: Symbol = Symbol.EMPTY) {
        this.tile = tile;
        this.localPosition = position;
        this.globalPosition = new Position(3*tile.position.x + position.x, 3*tile.position.y + position.y);
        this.symbol = symbol;
    }
}

type TileBody = [
    [Cell, Cell, Cell],
    [Cell, Cell, Cell],
    [Cell, Cell, Cell]
];

export class Tile {
    public body: TileBody

    public position: Position;

    constructor(position: Position, body: TileBody = null) {
        this.position = position;
        
        this.body = body ?? [
            [
                new Cell(this, new Position(0, 0)),
                new Cell(this, new Position(1, 0)),
                new Cell(this, new Position(2, 0))
            ],
            [
                new Cell(this, new Position(0, 1)),
                new Cell(this, new Position(1, 1)),
                new Cell(this, new Position(2, 1))
            ],
            [
                new Cell(this, new Position(0, 2)),
                new Cell(this, new Position(1, 2)),
                new Cell(this, new Position(2, 2))
            ]
        ];
    }

    public static fromRawTile(position: Position, rawTile: Symbol[]): Tile {
        const rawRows = [0, 1, 2].map(i => rawTile.slice(i*3, (i+1)*3));

        var tile = new Tile(position);

        const tileBody = rawRows.map(
            (rawRow,y) => rawRow.map(
                (rawCell,x) => new Cell(tile, new Position(x, y), rawCell)
            )
        ) as TileBody;

        tile.body = tileBody;

        return tile;
    }

    /**
     * Retrieves the Cell object at the given global position.
     *
     * @param {Position} globalPosition - The position of the cell in the global coordinate system.
     * @return {Cell} The Cell object at the given global position.
     */
    public getCell(globalPosition: Position): Cell {
        return this.body[globalPosition.y % 3][globalPosition.x % 3];
    }

    /**
     * Maps through the Tile's cells to find available moves represented as an array of Move objects.
     *
     * @return {Move[]} Array of available moves.
     */
    public getAvailableMoves(): Move[] {
        return this.body.map(
            row => row
                .filter(cell => cell.symbol === Symbol.EMPTY)
                .map(   cell => moveFromPosition(cell.globalPosition))
        ).flat()
    }

    public getRawTile(): Symbol[] {
        return this.body.map(row => row.map(cell => cell.symbol)).flat();
    }
}

type BoardBody = [
    [Tile, Tile, Tile],
    [Tile, Tile, Tile],
    [Tile, Tile, Tile]
];

export class Board {
    public body: BoardBody

    constructor(body: BoardBody = null) {
        this.body = body ?? [
            [
                new Tile(new Position(0, 0)),
                new Tile(new Position(1, 0)),
                new Tile(new Position(2, 0))
            ],
            [
                new Tile(new Position(0, 1)),
                new Tile(new Position(1, 1)),
                new Tile(new Position(2, 1))
            ],
            [
                new Tile(new Position(0, 2)),
                new Tile(new Position(1, 2)),
                new Tile(new Position(2, 2))
            ]
        ];
    }

    public static fromRawBoard(rawBoard: Symbol[]): Board {
        const rawRows = [0, 1, 2].map(i => rawBoard.slice(i*27, (i+1)*27));
        
        const rawTiles = rawRows.map(rawRow => [0, 1, 2].map(
            i => rawRow.slice(i*9, (i+1)*9)
        ));

        const tiles = rawTiles.map(
            (rawRow,y) => rawRow.map(
                (rawTile,x) => Tile.fromRawTile(new Position(x, y), rawTile)
            )
        ) as BoardBody;

        return new Board(tiles);
    }

    /**
     * Retrieves the Cell object at the given global position.
     *
     * @param {Position} globalPosition - The position of the cell in the global coordinate system.
     * @return {Cell} The Cell object at the given global position.
     */
    public getCell(globalPosition: Position): Cell {
        return this.body[globalPosition.y % 3][globalPosition.x % 3].getCell(globalPosition);
    }

    /**
     * Retrieves the Tile at the specified local position.
     *
     * @param {Position} localPosition - The position of the Tile in the local coordinate system.
     * @return {Tile} The Tile at the specified local position.
     */
    public getTile(localPosition: Position): Tile {
        return this.body[localPosition.y][localPosition.x];
    }

    /**
     * Updates the symbol of a cell at the position specified by the given move.
     *
     * @param {Move} move - The move that specifies the position of the cell.
     * @param {Symbol} symbol - The new symbol to be assigned to the cell.
     * @return {void} This function does not return anything.
     */
    public putMove(move: Move, symbol: Symbol): void {
        this.getCell(Position.fromMove(move)).symbol = symbol;
    }

    /**
     * Retrieves an array of available moves for the current board configuration.
     *
     * @return {Move[]} An array of available moves.
     */
    public getAvailableMoves(): Move[] {
        return this.body.map(
            row => row.map(tile => tile.getAvailableMoves()).flat()
        ).flat()
    }

    public getRawBoard(): Symbol[]{
        return this.body.map(row => row.map(tile => tile.getRawTile()).flat()).flat();
    }
}