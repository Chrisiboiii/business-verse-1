import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Accordion } from "@mantine/core";

import "./Css/lexicon.css";
import Item from "./Item";

function ItemList() {
	const { data, filter, search } = useStateContext();
	return (
		// Checking if a filter is set and returning the items that match the filter or returning all items if no filter is set
		// renders all items that match the search and filter criteria
		<>
			{data?.map((group, index) => {
				const activeGroup = filter?.find((f) => f.id === group.id);
				const noFilterActive = filter?.every((f) => !f.active);

				const filteredItems = group.items
					.map((item, idx) => {
						const searchMatch =
							search &&
							(item.name.toLowerCase().includes(search.toLowerCase()) ||
								item.description.toLowerCase().includes(search.toLowerCase()) ||
								item.synonyms.some((synonym) =>
									synonym.name.toLowerCase().includes(search.toLowerCase())
								));

						return searchMatch || !search ? <Item item={item} key={idx} /> : null;
					})
					.filter(Boolean); // Removes all null values from the array

				if (!activeGroup?.active && !noFilterActive) {
					return null;
				}

				return (
					<div className="group" key={index}>
						{filteredItems.length > 0 && <div className="group-name">{group.name}</div>}
						<Accordion chevronPosition="left" miw={"100%"} className="item-container">
							{filteredItems}
						</Accordion>
					</div>
				);
			})}
		</>
	);
}

export default ItemList;

