import React from "react";
import "./Css/screens.css";
import ItemList from "../Components/lexicon/ItemList";
import { useStateContext } from "../context/ContextProvider";
import SearchAndFilter from "../Components/lexicon/SearchAndFilter";
import AddItem from "../Components/lexicon/AddItem";

function LexiconScreen() {
	const { user } = useStateContext();

	// Renders the LexiconScreen component with the following components:
	// SearchAndFilter, ItemList, AddItem

	return (
		<div className="screen">
			<SearchAndFilter />
			<ItemList />
			{/* only shows AddItem, if the use is an Admin */}
			{user?.roles?.includes("admin") && <AddItem />}
		</div>
	);
}

export default LexiconScreen;

