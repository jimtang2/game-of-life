package main

import (
	"encoding/json"
	"io/fs"
	"log"
	"net/http"

	"github.com/jimtang2/herm/frontend"
	"github.com/jimtang2/herm/game"
)

type GameHTTPHandler struct {
	game *game.Game
}

type GameResponse struct {
	Width    int   `json:"width"`
	Height   int   `json:"height"`
	Interval int64 `json:"interval"` // milliseconds
}

func NewGameHTTPHandler(g *game.Game) *GameHTTPHandler {
	return &GameHTTPHandler{game: g}
}

func (h *GameHTTPHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cfg := h.game.Config
	response := GameResponse{
		Width:    cfg.Width,
		Height:   cfg.Height,
		Interval: cfg.Interval.Milliseconds(),
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "failed to encode game configuration", http.StatusInternalServerError)
		return
	}
}

func frontendHandler() http.Handler {
	sub, err := fs.Sub(frontend.Files, "dist")
	if err != nil {
		log.Fatalf("sub frontend dist: %v", err)
	}

	return http.FileServer(http.FS(sub))
}
