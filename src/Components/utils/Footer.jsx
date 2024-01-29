import React, { useEffect, useState } from "react";
import { Image, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "./Css/footer.css";

function Footer() {
	const [impressumOpened, impressumDisclosure] = useDisclosure(false);
	const [policyOpened, policyDisclosure] = useDisclosure(false);
	const [contactOpened, contactDisclosure] = useDisclosure(false);

	const [impressumText, setImpressumText] = useState("");
	const [policyText, setPolicyText] = useState("");
	const [contactText, setContactText] = useState("");

	// getting the impressum, policy and contact text from local files
	// its done this way, so that in the future the text can be changed/translated without having to change the code
	useEffect(() => {
		fetch(process.env.PUBLIC_URL + "/texte/impressum.txt")
			.then((response) => response.text())
			.then((text) => setImpressumText(text))
			.catch((error) => console.error("Fehler beim Laden der Textdatei:", error));
		fetch(process.env.PUBLIC_URL + "/texte/policy.txt")
			.then((response) => response.text())
			.then((text) => setPolicyText(text))
			.catch((error) => console.error("Fehler beim Laden der Textdatei:", error));
		fetch(process.env.PUBLIC_URL + "/texte/contact.txt")
			.then((response) => response.text())
			.then((text) => setContactText(text))
			.catch((error) => console.error("Fehler beim Laden der Textdatei:", error));
	}, []);

	// Has the Imprint and Privacy Policy text in Modal components
	return (
		<div className="footer">
			<div className="logo">
				<Image radius="md" h={40} w="auto" fit="contain" src="/images/BusinessVerse-Logo-weiß.svg" />
				<p className="copyright">© 2024 BusinessVerse</p>
			</div>
			<p onClick={impressumDisclosure.open} className="popuptext">
				Impressum
			</p>
			<Modal
				title="Impressum"
				opened={impressumOpened}
				onClose={impressumDisclosure.close}
				centered
				size={window.innerWidth < 600 ? "95%" : "80%"}
				className="custom-modal"
				withCloseButton={true}>
				<p
					dangerouslySetInnerHTML={{
						__html: impressumText.replace(/\n/g, "<br/>"),
					}}
				/>
			</Modal>

			<p onClick={policyDisclosure.open} className="popuptext">
				Datenschutzerklärung
			</p>
			<Modal
				title="Impressum"
				opened={policyOpened}
				onClose={policyDisclosure.close}
				centered
				size={window.innerWidth < 600 ? "95%" : "80%"}
				className="custom-modal"
				withCloseButton={true}>
				<p
					dangerouslySetInnerHTML={{
						__html: policyText.replace(/\n/g, "<br/>"),
					}}
				/>
			</Modal>

			<p onClick={contactDisclosure.open} className="popuptext">
				Kontakt
			</p>
			<Modal
				title="Kontakt"
				opened={contactOpened}
				onClose={contactDisclosure.close}
				centered
				className="custom-modal"
				withCloseButton={true}>
				<p
					dangerouslySetInnerHTML={{
						__html: contactText.replace(/\n/g, "<br/>"),
					}}
				/>
			</Modal>
		</div>
	);
}

export default Footer;

