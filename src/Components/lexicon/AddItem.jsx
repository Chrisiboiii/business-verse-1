import { Button, Card, Fieldset, Flex, Modal, Select, TagsInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useStateContext } from "../../context/ContextProvider";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
const { v4: uuid } = require("uuid");

function AddItem() {
	const { user, setData, groupData, settings, setGroupData } = useStateContext();
	const [opened, { open, close }] = useDisclosure(false);
	const [newGroup, setNewGroup] = useState({ id: uuid(), name: "", description: "", items: [] });
	const [newItem, setNewItem] = useState({
		name: "",
		description: "",
		group: "",
		synonyms: [],
	});
	// handle save group
	const saveGroup = async () => {
		if (newGroup.name.trim() !== "" && newGroup.description.trim() !== "") {
			if (!groupData.some((group) => group.name === newGroup.name)) {
				await axios
					.post("https://businessversebackend.onrender.com/Group/create", newGroup)
					.then((response) => {
						toast.success("Gruppe erfolgreich angelegt");
						setGroupData((prev) => [...prev, response.data]);
					})
					.catch((error) => {
						toast.error("Gruppe konnte nicht angelegt werden");
					});
				return;
			} else {
				toast.error("Der Gruppen Name ist bereits vorhanden");
				return;
			}
		} else {
			if (!newGroup.name.trim() === "" && newGroup.description.trim() === "") {
				toast.error("Name und Beschreibung der Gruppe dürfen nicht leer sein");
			}
			return;
		}
	};
	// handle save item
	const saveItem = async () => {
		if (
			newItem.name !== "" &&
			newItem.description !== "" &&
			newItem.group !== ""
			//  &&
			// (newItem.synonyms.length === 0 || newItem.synonyms.forEach((synonym) => synonym?.name !== ""))
		) {
			if (newGroup.name !== "" && newGroup.description !== "") {
				newItem.group = newGroup.id;
			} else {
				newItem.group = groupData.find((group) => group.name === newItem.group).id;
			}
			await axios
				.post("https://businessversebackend.onrender.com/Item/create", newItem)
				.then((response) => {
					const newItemForGroup = {
						...response.data.item,
						synonyms: response.data.synonyms,
					};
					setData((prev) => {
						prev.find((group) => group.id === response.data.groupItem.g_id).items.push(newItemForGroup);
						return [...prev];
					});

					toast.success("Item erfolgreich angelegt");
				})
				.catch((error) => {
					toast.error("Item konnte nicht angelegt werden");
				});
			return;
		} else {
			if (
				newItem.name === "" &&
				newItem.description === "" &&
				newItem.group === "" &&
				newItem.synonyms.forEach((synonym) => synonym.name !== "")
			) {
				return;
			} else {
				toast.error("Es müssen alle Felder ausgefüllt werden");
				return;
			}
		}
	};

	return (
		<>
			<Card
				className="add-item-card"
				miw={"100%"}
				shadow="md"
				onClick={() => {
					open();
				}}>
				<Flex justify="center" align="center" direction="row" wrap="wrap">
					<IoAdd />
				</Flex>
			</Card>
			{/* Add Modal */}
			<Modal opened={opened} onClose={close} title="Add Groups & Items" size={"lg"}>
				<Fieldset legend="Add Group">
					{/* Shows an Edited field for Item-Name and description for all with autoritation */}

					<TextInput
						label="Group Name"
						value={newGroup.name}
						onChange={(event) => setNewGroup({ ...newGroup, name: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
					<TextInput
						label="Group Description"
						value={newGroup.description}
						onChange={(event) => setNewGroup({ ...newGroup, description: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
				</Fieldset>
				<Fieldset legend="Add Item">
					{/* Shows an Edited field for Item-Name and description for all with autoritation */}

					<TextInput
						label="Item Name"
						value={newItem.name}
						onChange={(event) => setNewItem({ ...newItem, name: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
					<TextInput
						label="Item Description"
						value={newItem.description}
						onChange={(event) => setNewItem({ ...newItem, description: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
					<Select
						label="Group"
						placeholder="Pick the Group the Item should be located"
						data={groupData
							?.map((group) => group.name)
							.concat(
								newGroup.name !== "" && !groupData.some((group) => group.name === newGroup.name)
									? newGroup.name
									: []
							)}
						value={newItem.group}
						onChange={(value) =>
							setNewItem((prevItem) => ({
								...prevItem,
								group: value,
							}))
						}
					/>

					{/* Create an Edit-Fieldset for each Synonym */}
					{newItem.synonyms.map((synonym, index) => (
						<Fieldset legend="Synonym" key={index}>
							<TextInput
								required
								label="Synonym Name"
								value={synonym.name}
								onChange={(event) =>
									setNewItem((prevItemCopy) => ({
										...prevItemCopy,
										synonyms: prevItemCopy.synonyms.map((prevSynonym, i) =>
											i === index
												? { ...prevSynonym, name: event.currentTarget.value }
												: prevSynonym
										),
									}))
								}
								mt="md"
							/>
							<TagsInput
								label="Attributes"
								value={synonym.args}
								onChange={(value) =>
									setNewItem((prevItemCopy) => ({
										...prevItemCopy,
										synonyms: prevItemCopy.synonyms.map((prevSynonym, i) =>
											i === index ? { ...prevSynonym, args: value } : prevSynonym
										),
									}))
								}
							/>
							<Select
								label="System"
								placeholder="Pick System "
								data={settings.softwares.map((software) => software.name)}
								value={synonym.software}
								onChange={(value) =>
									setNewItem((prevItemCopy) => ({
										...prevItemCopy,
										synonyms: prevItemCopy.synonyms.map((prevSynonym, i) =>
											i === index ? { ...prevSynonym, software: value } : prevSynonym
										),
									}))
								}
							/>
							{/* Delte Synonym */}
							<Button
								className="delete-synonym-button"
								variant="transparent"
								color="red"
								onClick={() =>
									setNewItem((prevItemCopy) => ({
										...prevItemCopy,
										synonyms: prevItemCopy.synonyms.filter(
											(_, synonymIndex) => synonymIndex !== index
										),
									}))
								}>
								<AiFillDelete size="1.5rem" />
							</Button>
						</Fieldset>
					))}

					<div className="edit-button-container">
						<Button
							className="add-synonym-button"
							variant="transparent"
							color="gray"
							onClick={() =>
								setNewItem((prevItem) => ({
									...prevItem,
									synonyms: [...prevItem.synonyms, { name: "", args: [], software: [] }],
								}))
							}>
							Add Synonym
						</Button>
					</div>
				</Fieldset>
				<div className="edit-button-container">
					<div className="edit-button-subcontainer">
						{/* Cancel Item Change */}
						<Button
							className="cancel-button"
							variant="filled"
							color="red"
							onClick={() => {
								setNewGroup({ name: "", description: "" });
								setNewItem({ name: "", description: "" });
								close();
							}}>
							Cancel
						</Button>
						{/* Save Item */}
						<Button
							className="save-button"
							variant="filled"
							color="green"
							onClick={async (e) => {
								e.preventDefault();
								try {
									await saveGroup();
									// If both group and item are saved, there is an error on the Item
									// TODO: Fix this in the Future/backend

									await saveItem();
								} catch (error) {
									console.log(error);
								}
								close();
							}}>
							Save
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
}

export default AddItem;

