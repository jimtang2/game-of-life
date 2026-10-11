import { ColorPalette } from "./ColorPalette/ColorPalette";
import { PatternLibrary } from "./PatternLibrary/PatternLibrary";

import "./Overlay.css";

export function Overlay() {
	return (
		<div id="overlay">
			<Toolbar />
		</div>
	);
}

function Toolbar() {
	return (
		<div id="toolbar">
			<ColorPalette />
			<PatternLibrary />
		</div>
	);
}
