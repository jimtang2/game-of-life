import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from "react";
import { type Color, colors } from "../constants/colors";
import type { Pattern } from "../constants/patterns";
import { patterns } from "../constants/patterns";
import type { CellStateUpdates } from "./useCellStateUpdates";

export interface GameContextProps {
	height: number;
	setHeight: Dispatch<SetStateAction<number>>;
	width: number;
	setWidth: Dispatch<SetStateAction<number>>;
	selectedColor: Color;
	setSelectedColor: Dispatch<SetStateAction<Color>>;
	selectedPattern: Pattern;
	setSelectedPattern: Dispatch<SetStateAction<Pattern>>;
	sendCellStateUpdates: (_: CellStateUpdates) => boolean;
	setSendCellStateUpdatesFunc: Dispatch<SetStateAction<(_: CellStateUpdates) => boolean>>;
}

const GameContext = createContext<GameContextProps | null>(null);

export function GameContextProvider({ children }: { children: ReactNode }) {
	const [width, setWidth] = useState<number>(0);
	const [height, setHeight] = useState<number>(0);
	const [selectedColor, setSelectedColor] = useState<Color>(() => {
		const index = Math.floor(Math.random() * colors.length);
		return colors[index] as Color;
	});
	const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0] as Pattern);
	const [sendCellStateUpdates, setSendCellStateUpdatesFunc] = useState<(_: CellStateUpdates) => boolean>(
		(_: CellStateUpdates) => false,
	);

	const ctx: GameContextProps = {
		width,
		setWidth,
		height,
		setHeight,
		selectedColor,
		setSelectedColor,
		selectedPattern,
		setSelectedPattern,
		sendCellStateUpdates,
		setSendCellStateUpdatesFunc,
	};

	return <GameContext.Provider value={ctx}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextProps {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGameContext must be used within a GameContextProvider");
	}
	return context;
}
