import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";
import "./index.css";

import HomeScreen from "./Screens/HomeScreen";
import ErrorScreen from "./Screens/ErrorScreen";
import LexiconScreen from "./Screens/LexiconScreen";
import { ContextProvider } from "./context/ContextProvider";

// setting up the theme
const theme = createTheme({
	autoContrast: true,
});

// setting up the router
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorScreen />,
		children: [
			{
				path: "/",
				element: <HomeScreen />,
			},
			{
				path: "/lexicon",
				element: <LexiconScreen />,
			},
		],
	},
]);

// rendering the app to the root element
// the app is wraped in a context provider, a router provider and a mantine provider
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ContextProvider>
			<MantineProvider>
				<RouterProvider router={router} />
			</MantineProvider>
		</ContextProvider>
	</React.StrictMode>
);

