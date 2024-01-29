import React from "react";
import "./Css/screens.css";
import HomeGrid from "../Components/home/HomeGrid";

function HomeScreen() {
	// Renders the HomeScreen component with the following components:
	// HomeGrid
	return (
		<div className="screen">
			<HomeGrid />
		</div>
	);
}

export default HomeScreen;

