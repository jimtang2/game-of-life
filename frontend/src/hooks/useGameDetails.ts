import { useQuery } from "@tanstack/react-query";
import { GAME_DETAILS_URL } from "../constants/constants";

interface GameDetailsResponse {
	width: number;
	height: number;
	interval: number;
}

async function fetchGameDetails(): Promise<GameDetailsResponse> {
	const response = await fetch(GAME_DETAILS_URL);
	console.log(`game: status: ${response.status}`);
	if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	return response.json();
}

export function useGameDetails() {
	return useQuery<GameDetailsResponse, Error>({
		queryKey: ["gameDetails"],
		queryFn: fetchGameDetails,
		retry: false,
	});
}
