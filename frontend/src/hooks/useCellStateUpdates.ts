import { useCallback, useEffect, useRef, useState } from "react";

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";

export interface CellState {
	index: number;
	live: boolean;
	color: number;
}

export type CellStateUpdates = CellState[];

export type UseCellStateUpdatesResult = {
	send: (updates: CellStateUpdates) => boolean;
	status: ConnectionStatus;
	lastMessage: string;
	lastCellStateUpdates: CellStateUpdates;
};

export function useCellStateUpdates(wsUrl: string): UseCellStateUpdatesResult {
	const socketRef = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<ConnectionStatus>("connecting");
	const [lastMessage, setLastMessage] = useState<string>("");
	const [lastCellStateUpdates, setLastCellStateUpdates] = useState<CellStateUpdates>([]);

	useEffect(() => {
		const id = crypto.randomUUID();
		const socket = new WebSocket(wsUrl);

		socketRef.current = socket;
		setStatus("connecting");

		console.log(`[ws ${id}] connecting`, wsUrl);

		socket.onopen = () => {
			if (socketRef.current !== socket) {
				console.log(`[ws ${id}] ignoring open from obsolete socket`);
				return;
			}

			console.log(`[ws ${id}] open`);
			setStatus("open");
		};

		socket.onmessage = (event) => {
			if (socketRef.current !== socket) {
				return;
			}

			if (typeof event.data !== "string") {
				console.warn(`[ws ${id}] ignoring non-text message`);
				return;
			}

			try {
				// this may fail
				const cellStateUpdates = JSON.parse(event.data);
				setLastCellStateUpdates(cellStateUpdates);
			} catch {
				console.warn(`[ws ${id}] ignoring non-JSON message`, event.data);
				setLastMessage(event.data);
			}
		};

		socket.onerror = (event) => {
			if (socketRef.current !== socket) {
				console.log(`[ws ${id}] ignoring error from obsolete socket`);
				return;
			}

			console.error(`[ws ${id}] error`, event);
			setStatus("error");
		};

		socket.onclose = (event) => {
			if (socketRef.current !== socket) {
				console.log(`[ws ${id}] ignoring close from obsolete socket`, {
					code: event.code,
					reason: event.reason,
				});
				return;
			}

			console.warn(`[ws ${id}] closed`, {
				url: wsUrl,
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean,
			});

			socketRef.current = null;
			setStatus("closed");
		};

		return () => {
			console.log(`[ws ${id}] cleanup`, {
				readyState: socket.readyState,
			});

			// Detach first. Later callbacks from this socket are now obsolete.
			if (socketRef.current === socket) {
				socketRef.current = null;
			}

			socket.close(1000, "Component unmounted or wsUrl changed");
		};
	}, [wsUrl]);

	const send = useCallback((message: CellStateUpdates): boolean => {
		const socket = socketRef.current;

		console.log("send socket state:", {
			exists: socket !== null,
			readyState: socket?.readyState,
			open: socket?.readyState === WebSocket.OPEN,
		});

		if (socket?.readyState !== WebSocket.OPEN) {
			return false;
		}

		socket.send(typeof message === "string" ? message : JSON.stringify(message));
		return true;
	}, []);

	return { status, lastMessage, lastCellStateUpdates, send };
}
