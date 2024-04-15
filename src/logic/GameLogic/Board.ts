import { Symbol } from "./types";

export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Cell {
    public tile = null;

    public position: Position;
    public symbol: Symbol;

    constructor(tile: Tile, position: Position, symbol: Symbol = Symbol.EMPTY) {
        this.tile = tile;
        this.position = position;
        this.symbol = symbol;
    }
}

export class Tile {
    public cells: [
        [Cell, Cell, Cell],
        [Cell, Cell, Cell],
        [Cell, Cell, Cell]
    ];

    public position: Position;

    constructor(position: Position) {
        this.position = position;
        
        this.cells = [
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
}

export class Board {
    public tiles: [
        [Tile, Tile, Tile],
        [Tile, Tile, Tile],
        [Tile, Tile, Tile]
    ];

    constructor() {
        this.tiles = [
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
}