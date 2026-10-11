import { colors, uint32ToHex } from "../../constants/colors";
import { useGameContext } from "../../hooks/useGameContext";

import "./ColorPalette.css";

export function ColorPalette() {
	const { selectedColor } = useGameContext();

	return (
		<div id="color-palette">
			{colors.map((color) => (
				<ColorButton key={color} hex={color} selected={color === selectedColor} />
			))}
		</div>
	);
}

function ColorButton({ hex, selected }: { hex: number; selected: boolean }) {
	const { setSelectedColor } = useGameContext();

	const style = {
		background: uint32ToHex(hex),
	};

	const handleClick = () => {
		setSelectedColor(hex);
	};

	return (
		<div className={["color-button", selected ? "color-button--selected" : ""].join(" ")} onClick={handleClick}>
			<div className="color-button-wrapper" style={style}></div>
		</div>
	);
}
