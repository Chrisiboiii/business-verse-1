import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
	const [user, setUser] = useState({
		name: "Guest",
		id: 0,
		shorty: "CB",
		roles: ["edit", "admin"],
	});

	// the software settings are for now locally stored, in the future they should be stored in the database
	const [settings, setSettings] = useState({
		darkMode: false,
		softwares: [
			{ name: "SAP", active: true, color: "#0000ff" },
			{ name: "IBM", active: true, color: "#ff0000" },
			{ name: "Sage", active: true, color: "#00ff00" },
		],
	});
	const [filter, setFilter] = useState(null);
	const [data, setData] = useState(null);
	const [search, setSearch] = useState(null);
	const [groupData, setGroupData] = useState(null);
	const [verseData, setVerseData] = useState(null);

	return (
		<StateContext.Provider
			value={{
				user,
				setUser,
				settings,
				setSettings,
				filter,
				setFilter,
				data,
				setData,
				search,
				setSearch,
				groupData,
				setGroupData,
				verseData,
				setVerseData,
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);

