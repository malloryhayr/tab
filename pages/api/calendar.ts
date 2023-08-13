import { getToken } from 'next-auth/jwt';
import { calendar_v3, google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

let accessToken: string;

const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT, process.env.GOOGLE_SECRET);

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	if (token && token.accessToken) {
		accessToken = token.accessToken as string;
		client.setCredentials({
			access_token: accessToken,
			scope: [
				'openid',
				'email',
				'profile',
				'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
				'https://www.googleapis.com/auth/calendar.events.public.readonly',
				'https://www.googleapis.com/auth/calendar.readonly',
				'https://www.googleapis.com/auth/calendar.calendars.readonly',
				'https://www.googleapis.com/auth/calendar.events.owned.readonly',
				'https://www.googleapis.com/auth/calendar.events.readonly',
			].join(' '),
		});

		const calendar = google.calendar({ version: 'v3', auth: client });

		const calendarList = await calendar.calendarList.list();
		let eventsList: calendar_v3.Schema$Event[] = [];
		for (const item of calendarList.data.items!!) {
			const date = new Date();

			const timeMin = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, '0')}-01T00:00:00-07:00`;
			const nextMonth = date.getMonth() == 11 ? 1 : date.getMonth() + 2;
			const nextMonthYear = date.getMonth() == 11 ? date.getFullYear() + 1 : date.getFullYear();
			const timeMax = `${nextMonthYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00-07:00`;

			const events = await calendar.events.list({
				calendarId: item.id!!,
				timeMin,
				timeMax,
			});
			for (const event of events.data.items!!) {
				if (event.recurrence) {
					const instances = await calendar.events.instances({
						calendarId: item.id!!,
						eventId: event.id!!,
						timeMin,
						timeMax,
					});
					eventsList.push(...instances.data.items!!);
				} else {
					eventsList.push(event);
				}
			}
		}
		res.json(eventsList);
	}

	res.status(500).json({ error: 'An error occurred' });
};
