package cmd

import (
	types "services/lib/types"
)

type CreateGameRequest struct {
	Session  types.Session      `json:"session"`
	Settings types.GameSettings `json:"settings"`
}

type CreateGameResponse struct {
	Status types.Status `json:"status"`
}

type JoinGameRequest struct {
	Session types.Session `json:"session"`
	GID     types.GameID  `json:"gid"`
}

type JoinGameResponse struct {
	Status types.Status `json:"status"`
}

type LeaveGameRequest struct {
	Session types.Session `json:"session"`
	GID     types.GameID  `json:"gid"`
}

type LeaveGameResponse struct {
	Status types.Status `json:"status"`
}

type LeaveAllGamesRequest struct {
	Session types.Session `json:"session"`
}

type LeaveAllGamesResponse struct {
	Status types.Status `json:"status"`
}

type GetGameRequest struct {
	Session types.Session `json:"session"`
	GID     types.GameID  `json:"gid"`
}

type GetGameResponse struct {
	Status types.Status `json:"status"`
	Game   types.Game   `json:"game"`
}

type ListGamesRequest struct {
	Session types.Session    `json:"session"`
	Filter  types.GameFilter `json:"filter"`
}

type ListGamesResponse struct {
	Status types.Status `json:"status"`
	Games  []types.Game `json:"games"`
}

type PutMoveRequest struct {
	Session types.Session      `json:"session"`
	GID     types.GameID       `json:"gid"`
	Move    types.CellPosition `json:"move"`
}

type PutMoveResponse struct {
	Status types.Status `json:"status"`
}
