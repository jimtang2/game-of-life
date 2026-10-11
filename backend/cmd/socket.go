package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
	"github.com/jimtang2/herm/game"
)

type GameService interface {
	Subscribe() (<-chan []game.CellState, func())
	Update([]game.CellState)
}

type WebSocketHandler struct {
	game            GameService
	originPatterns  []string
	maxMessageBytes int64
	writeTimeout    time.Duration
}

func NewWebSocketHandler(
	g GameService,
	originPatterns []string,
	maxMessageBytes int64,
) *WebSocketHandler {
	return &WebSocketHandler{
		game:            g,
		originPatterns:  originPatterns,
		maxMessageBytes: maxMessageBytes,
		writeTimeout:    5 * time.Second,
	}
}

func (h *WebSocketHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := h.upgrade(w, r)
	if err != nil {
		log.Printf("websocket upgrade from %s failed: %v", r.RemoteAddr, err)
		return
	}
	defer conn.Close(websocket.StatusNormalClosure, "")

	conn.SetReadLimit(h.maxMessageBytes)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	updates, unsubscribe := h.game.Subscribe()
	defer unsubscribe()

	errCh := make(chan error, 1)
	go func() {
		errCh <- h.read(ctx, conn)
	}()

	if err := h.write(ctx, conn, updates); err != nil {
		cancel()
		if !isExpectedWebSocketClose(err) {
			log.Printf("websocket write to %s failed: %v", r.RemoteAddr, err)
		}
		return
	}

	cancel()
	if err := <-errCh; err != nil && !isExpectedWebSocketClose(err) {
		log.Printf("websocket read from %s failed: %v", r.RemoteAddr, err)
	}
}

func (h *WebSocketHandler) upgrade(
	w http.ResponseWriter,
	r *http.Request,
) (*websocket.Conn, error) {
	return websocket.Accept(w, r, &websocket.AcceptOptions{
		OriginPatterns: h.originPatterns,
	})
}

func (h *WebSocketHandler) read(
	ctx context.Context,
	conn *websocket.Conn,
) error {
	for {
		var states []game.CellState
		if err := wsjson.Read(ctx, conn, &states); err != nil {
			return err
		}
		h.game.Update(states)
	}
}

func (h *WebSocketHandler) write(
	ctx context.Context,
	conn *websocket.Conn,
	updates <-chan []game.CellState,
) error {
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()

		case states, ok := <-updates:
			if !ok {
				return nil
			}

			writeCtx, cancel := context.WithTimeout(ctx, h.writeTimeout)
			err := wsjson.Write(writeCtx, conn, states)
			cancel()
			if err != nil {
				return err
			}
		}
	}
}

func isExpectedWebSocketClose(err error) bool {
	if err == nil || errors.Is(err, context.Canceled) {
		return true
	}
	status := websocket.CloseStatus(err)
	return status == websocket.StatusNormalClosure ||
		status == websocket.StatusGoingAway
}
