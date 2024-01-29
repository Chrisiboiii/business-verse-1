import {
	Accordion,
	ActionIcon,
	Button,
	Center,
	Fieldset,
	Modal,
	Pill,
	PillGroup,
	Select,
	TagsInput,
	TextInput,
	Tooltip,
} from "@mantine/core";
import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDisclosure } from "@mantine/hooks";
import { MdOutlineEdit } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";

function Item({ item }) {
	const { settings, setData, user } = useStateContext();
	const [opened, { open, close }] = useDisclosure(false);
	const [itemCopy, setItemCopy] = useState({ ...item });

	// Include the Name of the Item, the Description and the Synonyms, as well as the edit Button/Dialog
	return (
		<>
			<Accordion.Item value={item.id} className="item">
				<Center>
					<Accordion.Control>
						<div className="item-header">
							<div className="item-name">{item.name}</div>
							<div className="item-right-container">
								<div className="item-description">{item.description}</div>
								<PillGroup className="synonym-pills">
									{item.synonyms.map((synonym, index) => {
										if (
											!settings?.softwares.find((software) => software.name === synonym.software)
												?.active
										) {
											return null;
										}
										return (
											<Tooltip key={index} label={synonym.software}>
												<Pill
													className="synonym-pills"
													style={{
														backgroundColor: settings.softwares.find(
															(setting) => synonym.software === setting.name
														).color,
														color: "var(--text-color-light)",
													}}>
													{synonym.name}
												</Pill>
											</Tooltip>
										);
									})}
								</PillGroup>
							</div>
						</div>
					</Accordion.Control>
					{/* Shows edit Button, if the User is authorized */}
					{user?.roles?.includes("edit") && (
						<ActionIcon size="lg" variant="transparent" color="gray" onClick={open}>
							<MdOutlineEdit />
						</ActionIcon>
					)}
				</Center>

				<Accordion.Panel>
					{/* Dispays and filtered Synonyms */}

					{item.synonyms.map((synonym, index) => {
						if (!settings?.softwares.find((software) => software.name === synonym.software)?.active) {
							return null;
						}
						return (
							<div className="synonym" key={index}>
								<div
									className={
										user?.roles?.includes("edit")
											? "synonym-name"
											: "synonym-name large-synonym-name"
									}>
									{synonym.name}
								</div>
								<PillGroup className="synonym-args">
									{synonym.args?.map((arg, argIndex) => (
										<Pill
											key={argIndex}
											className="synonym-arg"
											style={{
												backgroundColor: "var(--primary-color)",
												color: "var(--background-color)",
											}}>
											{arg}
										</Pill>
									))}
								</PillGroup>
								<div className="software">{synonym.software}</div>
							</div>
						);
					})}
				</Accordion.Panel>
			</Accordion.Item>

			{/* Edit Modal  */}
			<Modal
				size="lg"
				opened={opened}
				onClose={() => {
					setItemCopy(item);
					close();
				}}
				title="Edit"
				centered>
				<Fieldset legend="Item">
					{/* Shows an Edited field for Item-Name and description for all with autoritation */}

					<TextInput
						label="Item Name"
						value={itemCopy.name}
						onChange={(event) => setItemCopy({ ...itemCopy, name: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
					<TextInput
						label="Item Description"
						value={itemCopy.description}
						onChange={(event) => setItemCopy({ ...itemCopy, description: event.currentTarget.value })}
						mt="md"
						required
						disabled={!user?.roles?.includes("admin")}
					/>
					{/* Create an Edit-Fieldset for each Synonym */}
					{itemCopy.synonyms.map((synonym, index) => (
						<Fieldset legend="Synonym" key={index}>
							<TextInput
								required
								label="Synonym Name"
								value={synonym.name}
								onChange={(event) =>
									setItemCopy((prevItemCopy) => ({
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
									setItemCopy((prevItemCopy) => ({
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
									setItemCopy((prevItemCopy) => ({
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
									setItemCopy((prevItemCopy) => ({
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
							onClick={() => {
								setItemCopy((prevItemCopy) => ({
									...prevItemCopy,
									synonyms: [...prevItemCopy.synonyms, { name: "", args: [], software: [] }],
								}));
							}}>
							Add Synonym
						</Button>
					</div>
				</Fieldset>

				{/* Add Synonym */}
				<div className="edit-button-container">
					{/* Delete Item */}
					{/* Only Shown to Admins */}
					<div className="edit-button-subcontainer">
						{user?.roles?.includes("admin") && (
							<Button
								className="delete-button"
								variant="filled"
								color="red"
								onClick={() => {
									axios
										.delete(`https://businessversebackend.onrender.com/Item/delete/${item.id}`)
										.then((response) => {
											setData((prevData) => {
												const updatedGroups = prevData.map((group) => {
													const updatedItems = group.items.filter(
														(item) => item.id !== itemCopy.id
													);

													return {
														...group,
														items: updatedItems,
													};
												});

												return updatedGroups;
											});
											toast.success("Erfolgreich gelöscht!");
										})
										.catch((error) => {
											toast.error("Ups, da ist etwas schief gelaufen:", error);
										});
									close();
								}}>
								Delete Item
							</Button>
						)}
						{/* Cancel Item Change */}
						<Button
							className="cancel-button"
							variant="filled"
							color="red"
							onClick={() => {
								setItemCopy(item);
								close();
							}}>
							Cancel
						</Button>
						{/* Save Item */}
						<Button
							className="save-button"
							variant="filled"
							color="green"
							onClick={() => {
								axios
									.put(
										`https://businessversebackend.onrender.com/Item/update/${itemCopy.id}`,
										itemCopy
									)

									.then((response) => {
										setData((prevData) => {
											const updatedGroups = prevData.map((group) => {
												const updatedItems = group.items.map((item) => {
													return item.id === itemCopy.id ? itemCopy : item;
												});

												return {
													...group,
													items: updatedItems,
												};
											});

											return updatedGroups;
										});
										toast.success("Erfolgreich gespeichert!");
									})
									.catch((error) => {
										toast.error("Ups, da ist etwas schief gelaufen:", error);
									});

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

export default Item;

