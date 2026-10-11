package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/jimtang2/herm/game"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	cfg, err := LoadConfig()
	if err != nil {
		return err
	}

	g := game.NewGame(cfg.gameConfig())
	server := NewServer(cfg, g)

	serverErr := make(chan error, 1)
	go func() {
		log.Printf("HTTP/WebSocket server listening on %s", server.Address())
		serverErr <- server.ListenAndServe()
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	defer signal.Stop(stop)

	select {
	case sig := <-stop:
		log.Printf("received %s; shutting down", sig)
	case err := <-serverErr:
		if !errors.Is(err, http.ErrServerClosed) {
			return err
		}
		return nil
	}

	if err := server.Shutdown(cfg.Server.ShutdownTimeout); err != nil {
		return err
	}
	return nil
}
