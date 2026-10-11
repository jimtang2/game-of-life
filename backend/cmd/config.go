package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/jimtang2/herm/game"
	"github.com/spf13/viper"
)

type Config struct {
	Server    ServerConfig    `mapstructure:"server"`
	WebSocket WebSocketConfig `mapstructure:"websocket"`
	HTTP      HTTPConfig      `mapstructure:"http"`
	Game      GameConfig      `mapstructure:"game"`
}

type ServerConfig struct {
	Port              int           `mapstructure:"port"`
	ReadHeaderTimeout time.Duration `mapstructure:"read_header_timeout"`
	ShutdownTimeout   time.Duration `mapstructure:"shutdown_timeout"`
}

type HTTPConfig struct {
	GamePath string `mapstructure:"game_path"`
}

type WebSocketConfig struct {
	Path            string   `mapstructure:"path"`
	OriginPatterns  []string `mapstructure:"origin_patterns"`
	MaxMessageBytes int64    `mapstructure:"max_message_bytes"`
}

type GameConfig struct {
	Width    int           `mapstructure:"width"`
	Height   int           `mapstructure:"height"`
	Interval time.Duration `mapstructure:"interval"`
	EdgeMode string        `mapstructure:"edge_mode"`
}

func LoadConfig() (Config, error) {
	v := viper.New()
	v.SetEnvPrefix("GOL")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	v.SetDefault("server.port", 8000)
	v.SetDefault("server.read_header_timeout", 5*time.Second)
	v.SetDefault("server.shutdown_timeout", 10*time.Second)

	v.SetDefault("http.game_path", "/game")

	v.SetDefault("websocket.path", "/ws")
	v.SetDefault("websocket.origin_patterns", []string{"localhost:3000"})
	v.SetDefault("websocket.max_message_bytes", int64(1<<20))

	v.SetDefault("game.width", 50)
	v.SetDefault("game.height", 50)
	v.SetDefault("game.interval", 100*time.Millisecond)
	v.SetDefault("game.edge_mode", "limit")

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return Config{}, fmt.Errorf("decode config: %w", err)
	}
	if err := cfg.validate(); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func (cfg Config) validate() error {
	if cfg.Server.Port < 1 || cfg.Server.Port > 65535 {
		return fmt.Errorf("server.port must be between 1 and 65535")
	}
	if cfg.HTTP.GamePath == "" || cfg.HTTP.GamePath[0] != '/' {
		return fmt.Errorf("http.game_path must start with /")
	}
	if cfg.WebSocket.Path == "" || cfg.WebSocket.Path[0] != '/' {
		return fmt.Errorf("websocket.path must start with /")
	}
	if cfg.WebSocket.MaxMessageBytes <= 0 {
		return fmt.Errorf("websocket.max_message_bytes must be positive")
	}
	if cfg.Server.ReadHeaderTimeout <= 0 || cfg.Server.ShutdownTimeout <= 0 {
		return fmt.Errorf("server timeouts must be positive")
	}
	if cfg.Game.Interval <= 0 {
		return fmt.Errorf("game.interval must be positive")
	}

	switch cfg.Game.EdgeMode {
	case "limit", "wrap":
	default:
		return fmt.Errorf("game.edge_mode must be limit or wrap")
	}

	if err := (game.Config{
		Width:    cfg.Game.Width,
		Height:   cfg.Game.Height,
		Interval: cfg.Game.Interval,
		EdgeMode: cfg.gameEdgeMode(),
	}).Validate(); err != nil {
		return fmt.Errorf("invalid game config: %w", err)
	}
	return nil
}

func (cfg Config) gameEdgeMode() game.EdgeMode {
	if cfg.Game.EdgeMode == "wrap" {
		return game.EdgeModeWrap
	}
	return game.EdgeModeLimit
}

func (cfg Config) gameConfig() game.Config {
	return game.Config{
		Width:    cfg.Game.Width,
		Height:   cfg.Game.Height,
		Interval: cfg.Game.Interval,
		EdgeMode: cfg.gameEdgeMode(),
	}
}

func (cfg Config) address() string {
	return fmt.Sprintf(":%d", cfg.Server.Port)
}
