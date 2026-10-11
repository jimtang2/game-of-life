/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Game } from "./Game/Game";
import { GameContextProvider } from "./hooks/useGameContext";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

const elem = document.getElementById("root") as HTMLElement;

const app = (
	<StrictMode>
		<GameContextProvider>
			<QueryClientProvider client={queryClient}>
				<Game />
			</QueryClientProvider>
		</GameContextProvider>
	</StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
