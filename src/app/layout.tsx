import './(style)/global.scss';

import type { Metadata } from 'next';

const title = 'New Tab';
const description = "mallory's new tab page";

export const metadata: Metadata = {
	metadataBase: new URL('https://mallory.rs'),
	title,
	description,
	viewport: { width: 'device-width', initialScale: 1 },
	openGraph: {
		title,
		description,
		type: 'website',
		url: new URL('https://tab.mallory.rs'),
	},
	twitter: {
		title,
		description,
		creator: '@_iGalaxyYT',
	},
	authors: [
		{
			name: 'Mallory Hayr',
			url: new URL('https://mallory.rs'),
		},
	],
	themeColor: '#010409',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
