import Head from 'next/head';
import { useState, useEffect } from 'react';

import { Discord, DiscordTextStyle } from 'presence-kit';
import styled from 'styled-components';

const DAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];

function getName(): string | undefined {
	if (typeof window == 'undefined') return;
	if (new URLSearchParams(window.location.search).get('name'))
		return new URLSearchParams(window.location.search).get('name') as string;
	if (!localStorage.getItem('igalaxy_newtab_name'))
		localStorage.setItem('igalaxy_newtab_name', 'William');
	return localStorage.getItem('igalaxy_newtab_name') as string;
}

function getDiscordID(): string | undefined {
	if (typeof window == 'undefined') return;
	if (new URLSearchParams(window.location.search).get('discordId'))
		return new URLSearchParams(window.location.search).get('discordId') as string;
	if (!localStorage.getItem('igalaxy_newtab_discord_id'))
		localStorage.setItem('igalaxy_newtab_discord_id', '182292736790102017');
	return localStorage.getItem('igalaxy_newtab_discord_id') as string;
}

export default function Tab() {
	const [greeting, setGreeting] = useState(
		new Date().getHours() >= 12 && new Date().getHours() < 18
			? 'Good afternoon'
			: new Date().getHours() < 12
			? 'Good morning'
			: 'Good evening'
	);

	const [time, setTime] = useState(
		new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
	);
	const [date, setDate] = useState(DAYS[new Date().getDay()]);

	useEffect(() => {
		const int = setInterval(() => {
			const currentDate = new Date();

			setDate(DAYS[currentDate.getDay()]);
			setTime(
				currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
			);
			setGreeting(
				currentDate.getHours() >= 12 && new Date().getHours() < 18
				? 'Good afternoon'
				: new Date().getHours() < 12
				? 'Good morning'
				: 'Good evening'
			);

		}, 1000);

		return () => {
			clearInterval(int);
		};
	}, []);
	
	return (
		<>
			<TabBackground>
				<Discord id={'182292736790102017'} bgStyle={'#010409'} textStyle={DiscordTextStyle.LIGHT} border={false} />
			</TabBackground>
		</>
	)
}

const TabBackground = styled.div`
	background-color: #010409;
  padding: 50px;
  margin: 0;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;