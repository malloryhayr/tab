// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { setCookies } from 'cookies-next';
import styled from 'styled-components';

import { useState } from 'react';
import { useGitHubToken } from '../lib';

export default function Settings() {
	const [settingsOpen, setSettingsOpen] = useState(false);

	function setGithubToken(token: string) {
		setCookies('githubToken', token, {maxAge: 2592e3, secure: true, sameSite: 'strict'});
	}

	const { token: githubToken } = useGitHubToken();

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
						<SettingsTextInput placeholder={githubToken} onChange={(e: any) => setGithubToken(e.target.value)} />
					</SettingsInputRow>
					<SettingsInputLabel style={{opacity: 0.3}}>{'Requires \'repo\' & \'read:user\' scope'}</SettingsInputLabel>
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
	height: 5vh;
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
	justify-content: center;
	align-items: center;
`;

const SettingsContainer = styled.div`
	z-index: 1001;

	border: 0.75px solid rgba(200, 200, 200, 0.3);
	border-radius: 5px;
	padding: 50px;
	background-color: #010409;
	
	width: calc(50vw - 100px);
	height: calc(50vh - 100px);
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

const SettingsTextInput = styled.input.attrs( props => ({ type: 'text' }) )`
	background-color: #1b1b1b;
	border: 1px solid rgba(200, 200, 200, 0.3);
	padding: 5px;
	margin: 5px;
	border-radius: 2.5px;
	color: white;
`;

const SettingsCheckboxInput = styled.input.attrs( props => ({ type: 'checkbox' }) )`
	background-color: #1b1b1b;
	border: 1px solid rgba(200, 200, 200, 0.3);
	padding: 5px;
	margin: 5px;
	border-radius: 2.5px;
	color: white;
`;