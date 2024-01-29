import { Button, Checkbox, Divider, Menu, Switch } from "@mantine/core";
import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { TbFilterPlus } from "react-icons/tb";

function Filter() {
	const { filter, setFilter, settings, setSettings } = useStateContext();
	return (
		<Menu shadow="md" closeOnItemClick={false}>
			<Menu.Target>
				<Button variant="transparent" style={{ color: "var(--text-color)" }} size="1.5rem">
					<TbFilterPlus />
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				{/* Add all Filters */}
				<Menu.Label>Groups</Menu.Label>
				{filter?.map((checkbox) => (
					<Menu.Item key={checkbox.name}>
						<Checkbox
							checked={checkbox.active}
							label={checkbox.name}
							onChange={(event) =>
								setFilter((prevFilter) =>
									prevFilter.map((filter) =>
										filter.id === checkbox.id ? { ...filter, active: event.target.checked } : filter
									)
								)
							}
						/>
					</Menu.Item>
				))}
				<Divider />
				{/* Add all Systems */}
				<Menu.Label>Systems</Menu.Label>
				{settings?.softwares.map((software) => (
					<Menu.Item key={software.name}>
						<Switch
							label={software.name}
							checked={software.active}
							onChange={(event) => {
								// set the software active state
								setSettings((prevSettings) => ({
									...prevSettings,
									softwares: prevSettings.softwares.map((s) =>
										s.name === software.name ? { ...s, active: event.target.checked } : s
									),
								}));
								localStorage.setItem(
									"settings",
									JSON.stringify({
										...settings,
										softwares: settings.softwares.map((s) =>
											s.name === software.name ? { ...s, active: event.target.checked } : s
										),
									})
								);
							}}
						/>
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
}

export default Filter;

