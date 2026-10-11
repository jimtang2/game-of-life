FROM oven/bun:1-alpine AS frontend-build

WORKDIR /workspace/frontend

COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

COPY frontend/ ./
RUN bun run build

FROM golang:1.27.1-alpine AS backend-build

WORKDIR /workspace/backend

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
COPY --from=frontend-build /workspace/frontend/dist ./frontend/dist

RUN CGO_ENABLED=0 GOOS=linux go build -o /out/gol ./cmd

FROM alpine:3.20

WORKDIR /app

ENV GOL_SERVER_PORT=80 \
    GOL_SERVER_SHUTDOWN_TIMEOUT=10s \
    GOL_WEBSOCKET_ORIGIN_PATTERNS=* \
    GOL_GAME_WIDTH=100 \
    GOL_GAME_HEIGHT=50 \
    GOL_GAME_INTERVAL=300ms \
    GOL_GAME_EDGE_MODE=limit

COPY --from=backend-build /out/gol /app/gol

EXPOSE 80

CMD ["/app/gol"]
