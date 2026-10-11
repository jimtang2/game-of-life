import type { CSSProperties } from "react";
import { uint32ToHex } from "../../constants/colors";
import { useCellState } from "../../hooks/useCellState";
import type { CellState } from "../../hooks/useCellStateUpdates";
import { useGameContext } from "../../hooks/useGameContext";

import "./Grid.css";

export function Grid() {
	const { width, height } = useGameContext();

	return (
		<table id="grid">
			<tbody>
				{Array.from({ length: height }).map((_, row) => {
					return (
						<tr key={row}>
							{Array.from({ length: width }).map((_, col) => (
								<Cell key={`${row},${col}`} index={row * width + col} />
							))}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}

export interface CellProps {
	index: number;
}

function Cell({ index }: CellProps) {
	const { width, height, selectedColor, selectedPattern, sendCellStateUpdates } = useGameContext();
	const cellState = useCellState(index);
	const { live, color } = cellState || { live: false, color: 0 };

	const handleClick = () => {
		const x = index % width;
		const y = Math.floor(index / width);

		const cellUpdates: CellState[] = selectedPattern
			.fn(x, y)
			.filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height)
			.map(({ x, y }) => ({
				index: y * width + x,
				live: true,
				color: selectedColor,
			}));
		sendCellStateUpdates(cellUpdates);
	};

	const style: CSSProperties = {};
	if (live) {
		style.background = uint32ToHex(color);
	}

	return (
		<td className="cell" onClick={handleClick} style={style}>
			<div className="cell-wrapper"></div>
		</td>
	);
}
