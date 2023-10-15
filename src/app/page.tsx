'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import {
	siYoutube,
	siGithub,
	siTwitter,
	siMastodon,
	siLemmy,
	siPlex,
	siGoogledrive,
	SimpleIcon,
} from 'simple-icons';

const cuMinecraft: CustomIcon = {
	title: 'Minecraft Wiki',
	hex: '3CB02C',
	path: 'm 4.026144,24 h 3.921569 v -3.94737 h 7.999999 v 3.89474 h 4.026144 V 11.97369 H 16.026144 V 0 H 24 V 8.02632 H 0 V 0 H 8 V 12 H 4.026144 Z',
	innerHex: '000',
	borderHex: 'fff',
};

const cuPlex: CustomIcon = {
	title: 'Plex',
	hex: '1f1f1f',
	path: 'M 11.999998,0 H 5.0322581 L 11.999998,12 5.0322581,24 h 6.9677399 l 6.96774,-12 z',
	innerHex: siPlex.hex,
};

const cuLemmy: CustomIcon = {
	title: 'lemmy.blahaj.zone',
	hex: siLemmy.hex,
	path: siLemmy.path,
};

const cuMastodon: CustomIcon = {
	title: 'farlands.cafe',
	hex: siMastodon.hex,
	path: siMastodon.path,
};

const cuBluesky: CustomIcon = {
	title: 'Bluesky',
	hex: '0085FF',
	path: '',
};

export default function Home() {
	const [dateTime, setDateTime] = useState(new Date());

	useEffect(() => {
		const id = setInterval(() => setDateTime(new Date()), 100);
		return () => {
			clearInterval(id);
		};
	}, []);

	const greeting =
		dateTime.getHours() >= 18
			? 'good evening'
			: dateTime.getHours() >= 12
			? 'good afternoon'
			: dateTime.getHours() >= 4
			? 'good morning'
			: 'good night';

	return (
		<>
			<h1>
				{dateTime.getHours().toString().padStart(2, '0')}:
				{dateTime.getMinutes().toString().padStart(2, '0')}:
				{dateTime.getSeconds().toString().padStart(2, '0')}
			</h1>
			<h3>
				{dateTime
					.toLocaleDateString('en-us', {
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					})
					.replace(',', '')}
			</h3>
			<em style={{ marginTop: '1em', marginBottom: '1.25em' }}>{greeting}</em>
			<main>
				<div>
					<Box
						icon={siGoogledrive}
						url="https://drive.google.com"
						searchUrl="https://drive.google.com/drive/u/0/search?q=QUERY"
						row={3}
					/>
					<Box
						height={2}
						icon={siYoutube}
						url="https://www.youtube.com/"
						searchUrl="https://www.youtube.com/results?search_query=QUERY"
						row={3}
					/>
					<Box
						icon={cuPlex}
						url="https://app.plex.tv"
						searchUrl="https://app.plex.tv/desktop/#!/search?pivot=top&query=QUERY"
						row={3}
					/>
					<Box
						icon={cuMinecraft}
						url="https://minecraft.wiki/"
						searchUrl="https://minecraft.wiki/w/Special:Search?search=QUERY"
						row={3}
					/>
					<Box row={3} />
				</div>
				<div>
					<Box row={2} />
					<Box row={2} />
					<Box
						icon={siTwitter}
						url="https://twitter.com/"
						searchUrl="https://twitter.com/search?q=QUERY"
						row={2}
					/>
					<Box
						height={2}
						icon={cuMastodon}
						url="https://farlands.cafe/"
						searchUrl="https://farlands.cafe/search"
						row={2}
					/>
					<Box
						icon={cuBluesky}
						url="https://bsky.app/"
						searchUrl="https://bsky.app/search?q=QUERY"
						row={2}
					/>
				</div>
				<div>
					<Box
						width={2}
						icon={cuLemmy}
						url="https://lemmy.blahaj.zone/"
						searchUrl="https://lemmy.blahaj.zone/search?q=QUERY&type=All&listingType=All&page=1&sort=TopAll"
						row={1}
					/>
					<Box
						icon={siGithub}
						url="https://github.com/"
						searchUrl="https://github.com/search?q=QUERY"
						row={1}
					/>
					<Box row={1} />
					<Box row={1} />
				</div>
			</main>
		</>
	);
}

interface BoxProps {
	width?: number;
	height?: number;
	icon?: (SimpleIcon & { innerHex?: string; borderHex?: string }) | CustomIcon;
	url?: string;
	searchUrl?: string;
	row: number;
}

interface CustomIcon {
	title: string;
	hex: string;
	path: string;
	innerHex?: string;
	borderHex?: string;
}

function Box({ width, height, icon, url, searchUrl, row }: BoxProps) {
	const [hovered, setHovered] = useState(false);
	const [searching, setSearching] = useState(false);
	const [coords, setCoords] = useState({ x: -1, y: -1 });
	const element = useRef<HTMLAnchorElement>();
	const searchElement = useRef<HTMLInputElement>();
	const router = useRouter();

	if (!width) width = 1;
	if (!height) height = 1;

	const cssWidth = `calc((((var(--width) - 4em) / 5) * ${width}) + (1em * ${
		width - 1
	}))`;
	const cssHeight = `calc((((var(--width) - 4em) / 5) * ${height}) + (1em * ${
		height - 1
	}))`;

	useEffect(() => {
		const handleClick = () => {
			setSearching(false);
		};
		const handleContextMenu = (e: MouseEvent) => {
			if (element != undefined) {
				const bounds = element.current?.getBoundingClientRect();
				if (
					bounds instanceof DOMRect &&
					e.pageX >= bounds.left &&
					e.pageX <= bounds.right &&
					e.pageY >= bounds.top &&
					e.pageY <= bounds.bottom
				) {
					e.preventDefault();
					setTimeout(() => {
						searchElement.current?.focus({ preventScroll: true });
					}, 20);
					if (searchUrl && !searchUrl.includes('QUERY')) router.push(searchUrl);
					setSearching(true);
					setCoords({ x: e.pageX, y: e.pageY });
				} else {
					setSearching(false);
				}
			}
		};

		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('click', handleClick);

		return () => {
			document.removeEventListener('click', handleClick);
			document.removeEventListener('contextmenu', handleContextMenu);
		};
	}, []);

	if (icon && url) {
		return (
			<>
				<Link
					href={url}
					title={icon.title}
					onMouseEnter={() => {
						setHovered(true);
					}}
					onMouseLeave={() => {
						setHovered(false);
					}}
					// @ts-ignore
					ref={element}
					style={{ pointerEvents: 'auto', zIndex: row }}
				>
					<div
						style={{
							width: cssWidth,
							height: cssHeight,
							background:
								icon.title != 'Bluesky'
									? `#${icon.hex}`
									: 'linear-gradient(180deg, #0062fe, #0090fe)',
							boxShadow:
								hovered || (searching && searchUrl)
									? `inset 0 0 0 0.25em #${
											icon.borderHex
												? icon.borderHex
												: icon.innerHex
												? icon.innerHex
												: 'fff'
									  }`
									: 'none',
						}}
					>
						<svg
							role="img"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d={icon.path}
								fill={icon.innerHex ? `#${icon.innerHex}` : '#ffffff'}
							></path>
						</svg>
					</div>
				</Link>
				{searchUrl ? (
					<input
						type="text"
						className="searchBox"
						style={{
							display: searching ? 'block' : 'none',
							top: `calc(${coords.y}px - 0.5em - 16px)`,
							left: coords.x,
							border: `0.25em solid #c9c9c9`,
							backgroundImage: "url('/assets/search.svg')",
							backgroundRepeat: 'no-repeat',
							backgroundPosition: '0.5em center',
							backgroundSize: '24px',
						}}
						placeholder={`Search ${icon.title}`}
						// @ts-ignore
						ref={searchElement}
						onKeyDown={e => {
							if (e.key === 'Enter') {
								const value = e.currentTarget.value.replaceAll(' ', '+');
								router.push(searchUrl.replace('QUERY', value));
							}
						}}
					/>
				) : (
					<></>
				)}
			</>
		);
	}

	return (
		<div
			style={{
				width: cssWidth,
				height: cssHeight,
				opacity: 0,
				cursor: 'auto',
				pointerEvents: 'none',
				zIndex: -1,
			}}
		></div>
	);
}
