package main

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/jimtang2/herm/game"
)

type Server struct {
	httpServer *http.Server

	game   *game.Game
	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup

	mu      sync.RWMutex
	clients map[chan []game.CellState]struct{}
}

func NewServer(cfg Config, g *game.Game) *Server {
	ctx, cancel := context.WithCancel(context.Background())

	s := &Server{
		game:    g,
		ctx:     ctx,
		cancel:  cancel,
		clients: make(map[chan []game.CellState]struct{}),
	}

	mux := http.NewServeMux()

	wsHandler := NewWebSocketHandler(
		s,
		cfg.WebSocket.OriginPatterns,
		cfg.WebSocket.MaxMessageBytes,
	)
	mux.Handle("/", frontendHandler())
	mux.Handle(cfg.WebSocket.Path, wsHandler)
	mux.Handle(cfg.HTTP.GamePath, NewGameHTTPHandler(g))

	s.httpServer = &http.Server{
		Addr:              cfg.address(),
		Handler:           mux,
		ReadHeaderTimeout: cfg.Server.ReadHeaderTimeout,
	}

	s.wg.Add(1)
	go s.runBroadcastLoop()

	return s
}

func (s *Server) runBroadcastLoop() {
	defer s.wg.Done()

	updates := s.game.Start(s.ctx)
	for states := range updates {
		s.broadcast(states)
	}
}

func (s *Server) broadcast(states []game.CellState) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for ch := range s.clients {
		select {
		case ch <- states:
		default:
			// Drop for slow clients so one blocked connection does not stall all broadcasts.
		}
	}
}

func (s *Server) Subscribe() (<-chan []game.CellState, func()) {
	ch := make(chan []game.CellState, 16)

	s.mu.Lock()
	s.clients[ch] = struct{}{}
	s.mu.Unlock()

	unsubscribe := func() {
		s.mu.Lock()
		if _, ok := s.clients[ch]; ok {
			delete(s.clients, ch)
			close(ch)
		}
		s.mu.Unlock()
	}

	return ch, unsubscribe
}

func (s *Server) Update(states []game.CellState) {
	s.game.Update(states)
}

func (s *Server) ListenAndServe() error {
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(timeout time.Duration) error {
	s.cancel()

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	err := s.httpServer.Shutdown(ctx)
	s.wg.Wait()
	return err
}

func (s *Server) Address() string {
	return s.httpServer.Addr
}

func (s *Server) String() string {
	return fmt.Sprintf("HTTP/WebSocket server at %s", s.httpServer.Addr)
}
