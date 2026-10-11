# Game of Life

### Notes

- optimized backend algorithm for rule evaluation
- optimized server <-> client grid updates
- react event-based fine grained rendering on updates (easily handles 100+ updates per 100ms)
- all functionalities from SPECS
- some visual bugs remain (cell ratio can be inconsistent)
- basic next generation test

### Build/Run

```bash
make build-docker && make run-docker
```

Browse to http://localhost:8888

### Development

#### Backend

- Use air-cli https://github.com/air-verse/air 
- Write `backend/.env`:
```toml
# ./backend/.env
GOL_SERVER_PORT=8000
GOL_SERVER_SHUTDOWN_TIMEOUT=10s
GOL_WEBSOCKET_ORIGIN_PATTERNS=localhost:3000
GOL_GAME_WIDTH=100
GOL_GAME_HEIGHT=50
GOL_GAME_INTERVAL=100ms
GOL_GAME_EDGE_MODE=limit
```
- Run `cd backend && air`

#### Frontend

- Use bun https://github.com/oven-sh/bun
- Write `frontend/.env`:
```toml
# ./frontend/.env
PUBLIC_SERVER_URL=http://localhost:8000
```
- Run `cd frontend && bun run dev`

### General Specifications

- Implementation of Game of Life 
- Works on Chrome, Firefox, Safari
- Shared synchronized world
- Average color birth cells
- Patterns library

### Technical Specifications

- Uses <table> cells
- Default tick 300ms
- Default grid 100 x 50 
- Backend in go
- Frontend in react 
- Frontend built with bun
