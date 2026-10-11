package game

import "testing"

func TestBlinkerEvolution(t *testing.T) {
	red := NewColor(255, 0, 0)

	g := newGameWithLiveCells(t, map[int]Color{
		11: red, // (1, 2)
		12: red, // (2, 2)
		13: red, // (3, 2)
	})

	// Horizontal → vertical.
	first := g.Next()
	assertLiveStates(t, first, map[int]Color{
		7:  red, // (2, 1)
		12: red, // (2, 2)
		17: red, // (2, 3)
	})
	g.Update(first)

	// Vertical → horizontal.
	second := g.Next()
	assertLiveStates(t, second, map[int]Color{
		11: red, // (1, 2)
		12: red, // (2, 2)
		13: red, // (3, 2)
	})
}

func TestStableBlockEvolution(t *testing.T) {
	red := NewColor(255, 0, 0)

	g := newGameWithLiveCells(t, map[int]Color{
		6:  red, // (1, 1)
		7:  red, // (2, 1)
		11: red, // (1, 2)
		12: red, // (2, 2)
	})

	next := g.Next()
	assertLiveStates(t, next, map[int]Color{
		6:  red,
		7:  red,
		11: red,
		12: red,
	})
}

func TestBirthMixesThreeNeighborColors(t *testing.T) {
	red := NewColor(255, 0, 0)
	blue := NewColor(0, 0, 255)
	green := NewColor(0, 255, 0)

	g := newGameWithLiveCells(t, map[int]Color{
		6:  red,   // (1, 1)
		8:  blue,  // (3, 1)
		12: green, // (2, 2)
	})

	next := g.Next()
	assertLiveStates(t, next, map[int]Color{
		7:  NewColor(85, 85, 85),
		12: green,
	})
}

func newGameWithLiveCells(t *testing.T, live map[int]Color) *Game {
	t.Helper()

	g := NewGame(Config{
		Width:    5,
		Height:   5,
		EdgeMode: EdgeModeLimit,
	})

	states := make([]CellState, 0, len(live))
	for index, color := range live {
		states = append(states, CellState{
			Index: index,
			Live:  true,
			Color: color,
		})
	}
	g.Update(states)

	return g
}

// assertLiveStates compares only live results, keyed by cell index.
// Dead neighbor updates returned by Next are intentionally ignored.
func assertLiveStates(t *testing.T, states []CellState, want map[int]Color) {
	t.Helper()

	got := make(map[int]Color)
	for _, state := range states {
		if state.Live {
			got[state.Index] = state.Color
		}
	}

	if len(got) != len(want) {
		t.Errorf("live cells = %v; want %v", got, want)
	}

	for index, wantColor := range want {
		gotColor, exists := got[index]
		if !exists {
			t.Errorf("expected cell %d to be live; got live cells %v", index, got)
			continue
		}
		if gotColor != wantColor {
			t.Errorf("cell %d color = %v; want %v", index, gotColor, wantColor)
		}
	}

	for index := range got {
		if _, exists := want[index]; !exists {
			t.Errorf("unexpected live cell %d", index)
		}
	}
}
