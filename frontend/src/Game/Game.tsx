import { useEffect } from "react";
import { useGameContext } from "@/hooks/useGameContext";
import { WS_URL } from "../constants/constants";
import { cellStore } from "../hooks/useCellState";
import { useCellStateUpdates } from "../hooks/useCellStateUpdates";
import { useGameDetails } from "../hooks/useGameDetails";
import { Overlay } from "../Overlay/Overlay";
import { Grid } from "./Grid/Grid";

import "./Game.css";

export function Game() {
	const { status, lastMessage, lastCellStateUpdates, send } = useCellStateUpdates(WS_URL);
	const { data: gameDetails, error: fetchGameDetailsErr } = useGameDetails();
	const { setWidth, setHeight, setSendCellStateUpdatesFunc } = useGameContext();

	const { width, height } = gameDetails || { width: 0, height: 0 };
	useEffect(() => {
		setWidth(width);
		setHeight(height);
	}, [width, height]);

	useEffect(() => {
		cellStore.apply(lastCellStateUpdates);
	}, [lastCellStateUpdates]);

	useEffect(() => {
		if (status !== "open") {
			console.log(lastMessage);
			return;
		}
		setSendCellStateUpdatesFunc(() => send);
	}, [send, status]);

	if (["open", "connecting"].indexOf(status) < 0) {
		console.log(status, lastMessage);
	}

	if (fetchGameDetailsErr != null) {
		console.error(fetchGameDetailsErr);
	}

	return (
		<div id="game">
			<Overlay />
			<Grid />
		</div>
	);
}

export default Game;
