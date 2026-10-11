import { useEffect, useState } from "react";
import { type Pattern, patterns } from "../../constants/patterns";
import { useGameContext } from "../../hooks/useGameContext";

import "./PatternLibrary.css";

export function PatternLibrary() {
	const [show, setShow] = useState(true);
	const handleClick = () => setShow(!show);

	return (
		<>
			<button type="button" onClick={handleClick} className="mr-2">
				{show ? "Hide Library" : "Show Library"}
			</button>
			<div id="library-drawer" className={[show ? "show" : ""].join(" ")}>
				<div id="library" className="hide-scrollbar">
					{patterns.map((pattern) => (
						<PatternLibraryItem key={pattern.name} {...pattern} />
					))}
				</div>
			</div>
		</>
	);
}

function PatternLibraryItem(pattern: Pattern) {
	const { name, fn, width, height } = pattern;
	const [cells, setCells] = useState<Record<string, boolean>>({});
	const { selectedPattern, setSelectedPattern } = useGameContext();
	const handleClick = () => setSelectedPattern(pattern);

	useEffect(() => {
		const liveCells: Record<string, boolean> = {};
		for (const { x, y } of fn(0, 0)) {
			if (x < 0 || x >= width || y < 0 || y >= height) continue;
			liveCells[y * width + x] = true;
		}
		setCells(liveCells);
	}, []);

	return (
		<div
			className={["pattern-library-item", pattern.name === selectedPattern.name ? "selected" : ""].join(" ")}
			onClick={handleClick}>
			<div className="pattern-name">{name}</div>
			<table className="pattern-preview">
				<tbody>
					{Array.from({ length: height }).map((_, row) => (
						<tr key={`${name}-${row}`}>
							{Array.from({ length: width }).map((_, col) => {
								const idx = row * width + col;
								const live = cells[idx];
								return (
									<td key={`${name}-${idx}`} className={["pattern-preview-cell", live ? "live" : ""].join(" ")}></td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
