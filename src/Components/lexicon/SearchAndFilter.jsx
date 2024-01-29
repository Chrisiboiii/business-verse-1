import { Autocomplete, Card, Flex } from "@mantine/core";
import React from "react";

import Filter from "./Filter";
import { useStateContext } from "../../context/ContextProvider";
function SearchAndFilter() {
	const { data, search, setSearch, filter } = useStateContext();
	return (
		// uses the Autocomplete component to provide good ux
		<Card className="search-conteiner" miw={"100%"} shadow="md">
			<Flex gap="md" justify="center" align="center" direction="row">
				<Autocomplete
					limit={5}
					className="search"
					placeholder="Such ein Item ..."
					data={[
						...new Set(
							data?.flatMap((group) =>
								filter?.find((filterItem) => filterItem.id === group.id)?.active ||
								filter?.every((filter) => !filter.active)
									? group.items?.flatMap((item) => [
											item.name,
											...item?.synonyms.map((synonym) => synonym.name),
									  ])
									: []
							) || []
						),
					]}
					value={search}
					onChange={setSearch}
				/>

				<Filter className="filter" />
			</Flex>
		</Card>
	);
}

export default SearchAndFilter;

