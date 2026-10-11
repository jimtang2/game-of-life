export const WS_URL =
	(process.env.PUBLIC_SERVER_URL as string).length > 0
		? `${process.env.PUBLIC_SERVER_URL?.replace("http", "ws")}/ws`
		: "/ws";
export const GAME_DETAILS_URL = (process.env.PUBLIC_SERVER_URL as string)
	? `${process.env.PUBLIC_SERVER_URL}/game`
	: "/game";
