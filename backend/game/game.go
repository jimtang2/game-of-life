package game

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"
)

type EdgeMode int

const (
	EdgeModeLimit EdgeMode = iota
	EdgeModeWrap
)

type Config struct {
	Width    int
	Height   int
	Interval time.Duration
	EdgeMode EdgeMode
}

func (cfg Config) Validate() error {
	if cfg.Width < 3 || cfg.Height < 3 {
		return fmt.Errorf("width and height must be at least 3")
	}
	if cfg.Width*cfg.Height > 1000000 {
		return fmt.Errorf("grid must have less than 1 million cells")
	}
	return nil
}

type Game struct {
	Config

	evo   int
	cells []*Cell
	live  map[int]struct{}
	mu    sync.Mutex
}

type Cell struct {
	CellState
	neighbors []int
}

type CellState struct {
	Index int   `json:"index"`
	Live  bool  `json:"live"`
	Color Color `json:"color"`
}

type Coordinates struct {
	X int
	Y int
}

func NewGame(cfg Config) *Game {
	if err := cfg.Validate(); err != nil {
		panic(err)
	}
	g := &Game{
		Config: cfg,
		evo:    0,
		cells:  []*Cell{},
		live:   map[int]struct{}{},
	}

	for i := range g.Width * g.Height {
		g.cells = append(g.cells, g.newCell(i))
	}

	return g
}

func (g *Game) coordinates(idx int) Coordinates {
	return Coordinates{
		X: idx % g.Width,
		Y: int(idx / g.Width),
	}
}

func (g *Game) index(cs Coordinates) int {
	return cs.Y*g.Width + cs.X
}

func (g *Game) newCell(idx int) *Cell {
	state := CellState{
		Index: idx,
	}
	coord := g.coordinates(idx)
	cel := Cell{}
	switch g.EdgeMode {
	default:
		for _, c := range []Coordinates{
			{X: coord.X - 1, Y: coord.Y - 1},
			{X: coord.X, Y: coord.Y - 1},
			{X: coord.X + 1, Y: coord.Y - 1},
			{X: coord.X - 1, Y: coord.Y},
			{X: coord.X + 1, Y: coord.Y},
			{X: coord.X - 1, Y: coord.Y + 1},
			{X: coord.X, Y: coord.Y + 1},
			{X: coord.X + 1, Y: coord.Y + 1},
		} {
			if c.X >= 0 && c.Y >= 0 && c.X < g.Width && c.Y < g.Height {
				cel.neighbors = append(cel.neighbors, g.index(c))
			}
		}
	}
	cel.CellState = state
	return &cel
}

func (g *Game) getCell(idx int) (*Cell, error) {
	if idx < 0 || idx >= len(g.cells) {
		return nil, fmt.Errorf("unexpected cell index %v", idx)
	} else {
		return g.cells[idx], nil
	}
}

func (g *Game) getCellLiveNeighbors(idx int) []Cell {
	cells := []Cell{}
	cel, err := g.getCell(idx)
	if err != nil {
		log.Println(err)
		return cells
	}
	for _, idx := range cel.neighbors {
		cel, err := g.getCell(idx)
		if err != nil {
			log.Println(err)
			continue
		}
		if cel.Live {
			cells = append(cells, *cel)
		}
	}
	return cells
}

func (g *Game) Start(ctx context.Context) <-chan []CellState {
	out := make(chan []CellState)

	go func() {
		defer close(out)
		for {
			select {
			case <-ctx.Done():
				return
			default:
				next := g.Next()
				g.Update(next)
				g.evo++
				out <- next
				time.Sleep(g.Interval)
			}
		}
	}()

	return out
}

func (g *Game) Next() []CellState {
	g.mu.Lock()
	defer g.mu.Unlock()

	states := []CellState{}

	evalCells := map[int]struct{}{}
	for idx := range g.live {
		cel, err := g.getCell(idx)
		if err != nil {
			log.Println(err)
			continue
		}
		evalCells[idx] = struct{}{}
		for _, idx := range cel.neighbors {
			evalCells[idx] = struct{}{}
		}
	}

	for idx := range evalCells {
		cel, err := g.getCell(idx)
		if err != nil {
			log.Println(err)
			continue
		}
		liveCells := g.getCellLiveNeighbors(idx)
		count := len(liveCells)
		state := CellState{Index: idx}
		if !cel.Live && count == 3 {
			state.Live = true
			colors := []Color{}
			for _, cel := range liveCells {
				colors = append(colors, cel.Color)
			}
			state.Color = mixColors(colors)
		} else if cel.Live && (count == 2 || count == 3) {
			state.Live = true
			state.Color = cel.Color
		} else {
			state.Live = false
		}
		states = append(states, state)
	}
	return states
}

func (g *Game) Update(states []CellState) {
	g.mu.Lock()
	defer g.mu.Unlock()

	for _, s := range states {
		cel, err := g.getCell(s.Index)
		if err != nil {
			log.Println(err)
			continue
		}
		cel.Live = s.Live
		cel.Color = s.Color

		if cel.Live {
			g.live[s.Index] = struct{}{}
		} else {
			delete(g.live, s.Index)
		}
	}
}
