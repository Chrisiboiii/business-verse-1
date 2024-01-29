import React, { useEffect, useState } from "react";
import {
	Avatar,
	Menu,
	Button,
	Image,
	TextInput,
	rem,
	Drawer,
	Burger,
	PasswordInput,
	Switch,
	ColorPicker,
	Radio,
	Group,
	useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAt } from "@tabler/icons-react";
import { useStateContext } from "../../context/ContextProvider";
import { FaRegUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Css/header.css";
import axios from "axios";

function Header() {
	const { user, setUser, settings, setSettings } = useStateContext();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [loginData, setLoginData] = useState({ email: "", password: "" });
	const [registerData, setRegisterData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { setColorScheme } = useMantineColorScheme();
	//  handle darkmode
	useEffect(() => {
		if (settings.darkMode) {
			setColorScheme("dark");
			document.querySelector("body").classList.add("dark-mode");
			document.documentElement.style.setProperty("--background-color", "#1d1f27");
			document.documentElement.style.setProperty("--text-color", "#f3f3f3");
		} else {
			setColorScheme("light");
			document.querySelector("body").classList.remove("dark-mode");
			document.documentElement.style.setProperty("--background-color", "#f3f3f3");
			document.documentElement.style.setProperty("--text-color", "#1d1f27");
		}
	}, [settings.darkMode, setColorScheme]);

	// handle login
	const handleLogin = async () => {
		try {
			const response = await axios.get("https://businessversebackend.onrender.com/User/checkLogin", {
				params: loginData,
			});

			// Store tokens in local storage
			// should be changed to a more secure storage in production
			// localStorage.setItem("accessToken", accessToken);
			// localStorage.setItem("refreshToken", refreshToken);

			setUser(response.data);
			loginDisclosure.close();
		} catch (error) {
			console.error("Login failed:", error.message);
			// Handle the error as needed
		}
	};
	// handle registration
	const handleRegister = async () => {
		const register = {
			name: registerData.firstName + " " + registerData.lastName,
			email: registerData.email,
			password: registerData.password,
		};
		try {
			const response = await axios.post("https://businessversebackend.onrender.com/User/create", register);
			setUser(response.data);
			regiDisclosure.close();
		} catch (error) {
			console.error("Registration failed:", error.message);
			// Handle the error as needed
		}
	};

	const [editSoftware, setEditSoftware] = useState("SAP");
	const [openedLogin, loginDisclosure] = useDisclosure(false);
	const [openedRegi, regiDisclosure] = useDisclosure(false);
	const icon = <IconAt style={{ width: rem(16), height: rem(16) }} />;
	const [visible, { toggle }] = useDisclosure(false);
	// handle burger menu and
	const handleToggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const handleCloseRegiOpenLog = () => {
		loginDisclosure.open();
		regiDisclosure.close();
	};
	const handleCloseLoginOpenRegi = () => {
		regiDisclosure.open();
		loginDisclosure.close();
	};

	const handleCloseDrawer = () => {
		setDrawerOpen(false);
	};

	// there is an "normal" header and a header for mobile devices.
	// login, registration and user settings are in the header
	return (
		<div className="header">
			<Image radius="md" h={40} w="auto" fit="contain" src="/images/BusinessVerse-Logo.svg" />
			<Burger className="burger" onClick={handleToggleDrawer} />
			<div className="header-links">
				<NavLink to="/" onClick={handleCloseDrawer}>
					Home
				</NavLink>
				<NavLink to="/lexicon" onClick={handleCloseDrawer}>
					Lexicon
				</NavLink>
			</div>

			{/* -------------Burger Menu------------- */}
			<Drawer opened={drawerOpen} onClose={handleCloseDrawer} position="right" size="md" title="Navigation">
				<div className="drawer-links">
					<NavLink to="/" onClick={handleCloseDrawer}>
						Home
					</NavLink>
					<NavLink to="/lexicon" onClick={handleCloseDrawer}>
						Lexicon
					</NavLink>
					{user ? (
						<Button
							fullWidth
							onClick={() => {
								setUser(null);
							}}>
							Logout
						</Button>
					) : (
						<Button fullWidth onClick={loginDisclosure.open}>
							Login
						</Button>
					)}
				</div>
			</Drawer>

			{/* -------------Login------------- */}
			<Drawer position="right" opened={openedLogin} onClose={loginDisclosure.close} title="Login">
				<TextInput
					required
					leftSectionPointerEvents="none"
					leftSection={icon}
					label="E-Mail"
					placeholder="E-Mail"
					value={loginData.email}
					onChange={(event) => setLoginData({ ...loginData, email: event.currentTarget.value })}
				/>
				<PasswordInput
					required
					label="Password"
					visible={visible}
					onVisibilityChange={toggle}
					value={loginData.password}
					onChange={(event) => setLoginData({ ...loginData, password: event.currentTarget.value })}
				/>

				<Button className="acc-btn" type="submit" fullWidth onClick={() => handleLogin()}>
					Login
				</Button>

				<p className="acc-link" onClick={handleCloseLoginOpenRegi}>
					Haben Sie keinen Account ? Registrieren
				</p>
			</Drawer>

			{/* -------------Registration------------- */}
			<Drawer position="left" opened={openedRegi} onClose={regiDisclosure.close} title="Registrieren">
				<TextInput
					leftSectionPointerEvents="none"
					required
					label="Vorname"
					placeholder="Vorname"
					value={registerData.firstName}
					onChange={(event) =>
						setRegisterData({
							...registerData,
							firstName: event.currentTarget.value,
						})
					}
				/>
				<TextInput
					required
					leftSectionPointerEvents="none"
					label="Nachname"
					placeholder="Nachname"
					value={registerData.lastName}
					onChange={(event) =>
						setRegisterData({
							...registerData,
							lastName: event.currentTarget.value,
						})
					}
				/>
				<TextInput
					required
					leftSectionPointerEvents="none"
					leftSection={icon}
					type="email"
					label="E-Mail"
					placeholder="E-Mail"
					value={registerData.email}
					onChange={(event) =>
						setRegisterData({
							...registerData,
							email: event.currentTarget.value,
						})
					}
				/>
				<PasswordInput
					required
					label="Password"
					visible={visible}
					onVisibilityChange={toggle}
					value={registerData.password}
					onChange={(event) =>
						setRegisterData({
							...registerData,
							password: event.currentTarget.value,
						})
					}
				/>
				<PasswordInput
					required
					label="Confirm password"
					visible={visible}
					onVisibilityChange={toggle}
					value={registerData.confirmPassword}
					onChange={(event) =>
						setRegisterData({
							...registerData,
							confirmPassword: event.currentTarget.value,
						})
					}
				/>
				<Button
					className="acc-btn"
					type="submit"
					fullWidth
					disabled={registerData.password !== registerData.confirmPassword}
					onClick={() => handleRegister()}>
					Registrieren
				</Button>
				<p onClick={handleCloseRegiOpenLog} className="acc-link">
					Haben Sie Account ? Login
				</p>
			</Drawer>

			{!user ? (
				<Button
					className="btn-header-login"
					onClose={handleCloseDrawer}
					onClick={loginDisclosure.open}
					variant="transparent">
					Login
				</Button>
			) : (
				<Menu shadow="md" closeOnItemClick={false}>
					<Menu.Target>
						<Avatar color="cyan" radius="xl" className="header-account">
							{user ? user.shorty : <FaRegUser />}
						</Avatar>
					</Menu.Target>
					<Menu.Dropdown className="menu">
						<Menu.Label>Settings</Menu.Label>
						<Switch
							className="dark-mode-btn"
							label="Darkmode"
							labelPosition="left"
							checked={settings.darkMode}
							onChange={(e) => {
								setSettings({ ...settings, darkMode: e.currentTarget.checked });
								localStorage.setItem(
									"settings",
									JSON.stringify({ ...settings, darkMode: e.currentTarget.checked })
								);
							}}
						/>
						<Menu.Divider />

						<Radio.Group label="Software Colors" value={editSoftware} onChange={setEditSoftware}>
							<Group>
								{settings.softwares.map((software) => (
									<Radio
										key={software.name}
										label={software.name}
										value={software.name}
										color={software.color}
									/>
								))}
							</Group>
						</Radio.Group>
						<ColorPicker
							className="color-picker"
							label="SAP Color"
							value={settings.softwares.find((software) => editSoftware === software.name).color}
							onChange={(color) => {
								setSettings({
									...settings,
									softwares: settings.softwares.map((software) =>
										software.name === editSoftware ? { ...software, color } : software
									),
								});

								localStorage.setItem(
									"settings",
									JSON.stringify({
										...settings,
										softwares: settings.softwares.map((software) =>
											software.name === editSoftware ? { ...software, color } : software
										),
									})
								);
							}}
						/>
						<Menu.Divider />
						<Menu.Label>Account Actions</Menu.Label>
						<Menu.Item
							onClick={() => {
								setUser(null);
							}}>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			)}
		</div>
	);
}

export default Header;

