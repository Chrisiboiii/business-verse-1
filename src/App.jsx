import { Outlet } from "react-router-dom";
import Header from "./Components/utils/Header";
import Footer from "./Components/utils/Footer";
import { useStateContext } from "./context/ContextProvider";
import { useEffect } from "react";
import verseBData from "./Data/BusinessVerse.json";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const { setGroupData, groupData, setFilter, setData, data, verseData, setVerseData, setSettings } =
		useStateContext();

	// Fetching data from the backend

	// Fetch group data
	const fetchGroupData = async () => {
		try {
			const response = await axios.get("https://businessversebackend.onrender.com/Group/getAllItems");
			return response.data; // Return the data from the function
		} catch (error) {
			console.error("Error fetching group data:", error);
			return []; // Return an empty array in case of an error
		}
	};

	const fetchItemData = async () => {
		try {
			const response = await axios.get("https://businessversebackend.onrender.com/Item/getAll");
			return response.data; // Return the data from the function
		} catch (error) {
			console.error("Error fetching item data:", error);
			return []; // Return an empty array in case of an error
		}
	};

	useEffect(() => {
		// Fetch and set group data
		if (!groupData || groupData?.length === 0) {
			fetchGroupData().then((data) => setGroupData(data));
		}
	}, [groupData, setGroupData]);

	useEffect(() => {
		// Fetch and set verse data
		if (!verseData) {
			setVerseData(verseBData.groups);
		}
	}, [verseData, setVerseData]);

	useEffect(() => {
		// Fetch and process item data
		if (groupData && groupData?.length !== 0 && (!data || data.length === 0)) {
			fetchItemData().then((itemData) => {
				const tempGroupData = [...groupData];
				tempGroupData?.forEach((group) => {
					const itemsToAdd = [];
					group.items.forEach((itemId) => {
						const foundItem = itemData.find((item) => item.id === itemId);
						if (foundItem) {
							itemsToAdd.push(foundItem);
						}
					});
					group.items = itemsToAdd;
				});
				setData(tempGroupData);
			});
		}
	}, [groupData, setData, data]);

	// Set filter data
	useEffect(() => {
		if (data) {
			setFilter(
				data?.map((group) => ({
					name: group.name,
					id: group.id,
					active: false,
				}))
			);
		}
	}, [data]);
	// get settings from local storage
	useEffect(() => {
		localStorage.getItem("settings") && setSettings(JSON.parse(localStorage.getItem("settings")));
	}, []);

	return (
		// the App component is the root component of the application and is responsible for rendering the header,footer and the outlet component
		// the outlet component is responsible for rendering the components based on the route
		<div className="App">
			<Header />
			<Outlet />
			<Footer />
			<ToastContainer />
		</div>
	);
}

export default App;

