import { useCallback, useSyncExternalStore } from "react";
import type { CellState } from "./useCellStateUpdates";

class CellStore {
	private readonly cells = new Map<number, CellState>();
	private readonly listeners = new Map<number, Set<() => void>>();

	get(index: number): CellState | undefined {
		return this.cells.get(index);
	}

	subscribe(index: number, notify: () => void): () => void {
		let listeners = this.listeners.get(index);

		if (listeners === undefined) {
			listeners = new Set();
			this.listeners.set(index, listeners);
		}

		listeners.add(notify);

		return () => {
			listeners.delete(notify);

			if (listeners.size === 0) {
				this.listeners.delete(index);
			}
		};
	}

	set(cellState: CellState): void {
		const { index, live, color } = cellState;
		const previous = this.cells.get(index);

		if (previous?.live === live && previous?.color === color) {
			return;
		}

		if (cellState === undefined) {
			this.cells.delete(index);
		} else {
			this.cells.set(index, cellState);
		}

		for (const notify of this.listeners.get(index) ?? []) {
			notify();
		}
	}

	apply(updates: readonly CellState[]) {
		for (const cellState of updates) {
			this.set(cellState);
		}
	}
}

export const cellStore = new CellStore();

export function useCellState(index: number) {
	const subscribe = useCallback((notify: () => void) => cellStore.subscribe(index, notify), [index]);

	const getSnapshot = useCallback(() => cellStore.get(index), [index]);

	return useSyncExternalStore(subscribe, getSnapshot);
}
