// @ts-ignore
import FeatherIcon from 'feather-icons-react';
//@ts-ignore
import cookieCutter from 'cookie-cutter';

import { useState } from 'react';
import styled from 'styled-components';

function getGitHubToken(): string | undefined {
	if (typeof window == 'undefined') return '';
	return cookieCutter.get('githubToken') || '';
}

function setGitHubToken(token: string) {
	if (typeof window == 'undefined') return;
	cookieCutter.set('githubToken', token, {secure: true, expires: new Date(Date.now() + 2592e6)});
}

export default function Settings() {
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<SettingsPopup 
				style={settingsOpen ? {display: 'flex'} : {display: 'none'}}
				onClick={e => {
					const element = document.elementFromPoint(e.clientX, e.clientY);
					if (element && typeof element.className == 'string' &&element.className.includes('SettingsPopup')) setSettingsOpen(!settingsOpen);
				}}
			>
				<SettingsContainer>
					<SettingsHeader>
						<h1>Settings</h1>
						<FadedIcon icon={'x'} onClick={() => setSettingsOpen(!settingsOpen)} />
					</SettingsHeader>
					<h3>GitHub</h3>
					<SettingsInputRow>
						<SettingsInputLabel>Personal Access Token</SettingsInputLabel>
						<SettingsTextInput placeholder={getGitHubToken()} onChange={(e: any) => setGitHubToken(e.target.value)} />
					</SettingsInputRow>
				</SettingsContainer>
			</SettingsPopup>
			<SettingsRow>
				<FadedIcon icon={'settings'} onClick={() => setSettingsOpen(!settingsOpen)} />
			</SettingsRow>
		</>
	)
}

const FadedIcon = styled(FeatherIcon)`
	transition: opacity .25s;
	opacity: 0.3;

	&:hover {
		opacity: 0.75;
		text-decoration: underline;
    cursor: pointer;
	}
`;

const SettingsRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	height: 10vh;
`;

const SettingsPopup = styled.div`
	z-index: 1000;
	position: absolute;

	left: 0;
	top: 0;
	
	width: 100vw;
	height: 100vh;

	background-color: rgba(1, 4, 9, 0.75);

	display: flex;
	padding: 50px;
`;

const SettingsContainer = styled.div`
	z-index: 1001;

	border: 0.75px solid rgba(200, 200, 200, 0.3);
	border-radius: 5px;
	padding: 50px;
	background-color: #010409;
	
	max-width: calc(100vw - 100px);
	max-height: calc(100vh - 100px);

	min-width: calc(50vw - 100px);
	min-height: calc(50vh - 100px);
`;

const SettingsHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 50px;
`;

const SettingsInputRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-content: center;
	align-items: center;
`;

const SettingsInputLabel = styled.span`
	top: 50%;
`;

const SettingsTextInput = styled.input.attrs(props => { type: 'text' })`
	background-color: #1b1b1b;
	border: 1px solid rgba(200, 200, 200, 0.3);
	padding: 5px;
	margin: 5px;
	border-radius: 2.5px;
	color: white;
`;