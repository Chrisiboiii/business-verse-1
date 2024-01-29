import React from "react";
import { Card, Image } from "@mantine/core";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import "./Css/home.css";
const { v4: uuid } = require("uuid");

function HomeGrid() {
	const backgroundColors = [
		"var(--group-color1)",
		"var(--group-color2)",
		"var(--group-color3)",
		"var(--group-color4)",
		"var(--group-color5)",
		"var(--group-color6)",
		"var(--group-color7)",
	];

	const navigate = useNavigate();

	const { groupData, setFilter } = useStateContext();
	return (
		<div className="home-grid">
			<Card shadow="sm" padding="lg" radius="md" withBorder className="grid-item big">
				<Image className="grid-item-logo" src="../../images/BusinessVerse-Logo.svg" w={"50%"} />
				<p>
					Business Verse is a platform that allows you to discover and comprehend all business-related terms.
					Furthermore, it displays synonyms used by well-known platforms such as SAP, IBM, and Sage.
					<br />
					<br /> This approach facilitates consistent communication within the company as well as with
					customers and partners.
					{/* Text got translated to english, course of the data form the database */}
					{/* Business Verse ist eine Plattform, die es ihnen ermöglicht alle Business Basierenden Begriffe zu
					finden und zu verstehen. Des weiteren werden verwendete Synonyme der Bekanntesten Plattformen wie
					SAP, IBM und Sage angezeigt.
				
					Dieses Vorgehen ermöglicht eine einheitliche Kommunikation innerhalb des Unternehmens sowie mit
					Kunden und Partnern. */}
				</p>
			</Card>
			{/* renders a Card for each Group */}
			{groupData?.map((group, index) => {
				return (
					<Card
						shadow="sm"
						padding="lg"
						radius="md"
						withBorder
						className="grid-item grid-link"
						key={uuid()}
						onClick={() => {
							navigate("/lexicon");
							setFilter(
								groupData?.map((innerData) => {
									return {
										name: innerData.name,
										id: innerData.id,
										active: group.id === innerData.id ? true : false,
									};
								})
							);
						}}
						style={{
							backgroundColor: backgroundColors[index % 7],
						}}>
						<h2 className="grid-item-title">{group?.name}</h2>
						<Card.Section className="grid-item-description">{group?.description}</Card.Section>
					</Card>
				);
			})}
		</div>
	);
}

export default HomeGrid;

