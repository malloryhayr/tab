import { calendar_v3 } from 'googleapis';
import { useSession, signIn, signOut } from 'next-auth/react';
import useSWR from 'swr';

import dayjs from 'dayjs';
const weekday = require('dayjs/plugin/weekday');
const weekOfYear = require('dayjs/plugin/weekOfYear');

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default function Calendar() {
	const fetcher = async (url: string) => {
		const res = await fetch(url);

		// If the status code is not in the range 200-299,
		// we still try to parse and throw it.
		if (!res.ok) {
			const error = new Error('An error occurred while fetching the data.') as any;
			// Attach extra info to the error object.
			error.info = await res.json();
			error.status = res.status;
			throw error;
		}

		return res.json();
	};

	const { data, status } = useSession();
	const { data: calendar, error } = useSWR<{
		events: (calendar_v3.Schema$Event & { color: string })[];
		colors: {
			[key: string]: calendar_v3.Schema$ColorDefinition;
		};
	}>('/api/calendar', fetcher);

	if (error != undefined && status == 'authenticated') signOut();

	if (status === 'loading') return <></>;
	if (status === 'authenticated' && data && data.user) {
		const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const YEAR = dayjs().format('YYYY');
		const MONTH = dayjs().format('M');

		const daysInMonth = dayjs(`${YEAR}-${MONTH}-01`).daysInMonth();
		const currentMonthDays = (() => {
			return [...Array(daysInMonth)].map((day, index) => {
				return {
					date: dayjs(`${YEAR}-${MONTH}-${index + 1}`).format('YYYY-MM-DD'),
					dayOfMonth: index + 1,
					isCurrentMonth: true,
				};
			});
		})();
		const previousMonthDays = (() => {
			// @ts-ignore
			const firstDayOfTheMonthWeekday: number = dayjs(currentMonthDays[0].date).weekday();

			const previousMonth = dayjs(`${YEAR}-${MONTH}-01`).subtract(1, 'month');

			const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
				? firstDayOfTheMonthWeekday
				: 6;

			const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
				.subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
				.date();

			return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
				return {
					date: dayjs(
						`${previousMonth.year()}-${previousMonth.month() + 1}-${
							previousMonthLastMondayDayOfMonth + index
						}`
					).format('YYYY-MM-DD'),
					dayOfMonth: previousMonthLastMondayDayOfMonth + index,
					isCurrentMonth: false,
				};
			});
		})();
		const nextMonthDays = (() => {
			const lastDayOfTheMonthWeekday = dayjs(
				`${YEAR}-${MONTH}-${currentMonthDays.length}`
				// @ts-ignore
			).weekday();

			const visibleNumberOfDaysForNextMonth = lastDayOfTheMonthWeekday
				? 7 - lastDayOfTheMonthWeekday
				: lastDayOfTheMonthWeekday;

			return [...Array(visibleNumberOfDaysForNextMonth)].map((day, index) => {
				return {
					date: dayjs(`${YEAR}-${Number(MONTH) + 1}-${index + 1}`).format('YYYY-MM-DD'),
					dayOfMonth: index + 1,
					isCurrentMonth: false,
				};
			});
		})();

		interface RawDay {
			date: string;
			dayOfMonth: number;
			isCurrentMonth: boolean;
		}

		const days: RawDay[] = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

		const CalendarEvent = ({ event }: { event: calendar_v3.Schema$Event & { color: string } }) => {
			return (
				<a href={event.htmlLink || '/'} target={event.htmlLink ? '_blank' : ''}>
					<div
						style={{
							fontSize: '12px',
							display: 'flex',
							alignContent: 'center',
							justifyContent: 'flex-start',
							lineHeight: '12px',
							marginBottom: '2px',
							backgroundColor:
								event.color +
								Math.round(0.2 * 255)
									.toString(16)
									.toUpperCase(),
							borderRadius: '7px',
						}}
						title={event.summary || ''}
						className={'calendarEvent'}
					>
						<div
							style={{
								height: '14px',
								width: '14px',
								borderRadius: '100%',
								marginRight: '0.25em',
								backgroundColor: event.color,
							}}
						/>
						<span
							style={{
								maxWidth: '90px',
								overflowX: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{event.summary}
						</span>
					</div>
				</a>
			);
		};

		const CalendarDay = ({
			raw,
			week,
			weekday,
		}: {
			raw: RawDay;
			week: number;
			weekday: number;
		}) => {
			let events: (calendar_v3.Schema$Event & { color: string })[] = [];
			if (calendar && calendar.events) {
				calendar.events.forEach(event => {
					if (
						(event.start?.date && dayjs(event.start.date).isSame(raw.date, 'day')) ||
						(event.start?.dateTime && dayjs(event.start.dateTime).isSame(raw.date, 'day'))
					) {
						events.push(event);
						event.colorId;
					}
				});
			}

			return (
				<div
					style={{
						width: '8em',
						height: '9em',
						borderLeft: '1px solid #21262d',
						padding: '0.5em',
						borderBottomLeftRadius: week == 4 && weekday == 0 ? '6px' : 0,
						borderBottomRightRadius: week == 4 && weekday == 6 ? '6px' : 0,
						backgroundColor: weekday == 0 || weekday == 6 ? '#0E1219' : 'transparent',
					}}
				>
					<span style={{ color: 'rgb(125, 133, 144)', userSelect: 'none' }}>{raw.dayOfMonth}</span>
					{events.map(x => (
						<CalendarEvent event={x} />
					))}
				</div>
			);
		};

		return (
			<>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						height: '1.5em',
						width: '100%',
						backgroundColor: '#10151c',
						borderTopLeftRadius: '6px',
						borderTopRightRadius: '6px',
						borderTop: '1px solid #21262d',
						borderRight: '1px solid #21262d',
						color: 'rgb(125, 133, 144)',
						fontVariant: 'small-caps',
					}}
				>
					{WEEKDAYS.map(day => (
						<div
							style={{
								width: '8em',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderLeft: '1px solid #21262d',
								height: '100%',
								borderTopLeftRadius: day == 'Sun' ? '6px' : 0,
							}}
						>
							<span
								style={{
									marginTop: '-0.25em',
								}}
							>
								{day.toLowerCase()}
							</span>
						</div>
					))}
				</div>
				{Array.from(Array(5)).map((_, w) => (
					<div
						style={{
							display: 'flex',
							backgroundColor: '#0d1117',
							borderTop: '1px solid #21262d',
							borderRight: '1px solid #21262d',
							borderBottom: w == 4 ? '1px solid #21262d' : '0px',
							borderBottomLeftRadius: w == 4 ? '6px' : 0,
							borderBottomRightRadius: w == 4 ? '6px' : 0,
						}}
					>
						{Array.from(Array(7)).map((_, d) => (
							<CalendarDay raw={days[w * 7 + d]} week={w} weekday={d} />
						))}
					</div>
				))}
				{/* <>
					<button onClick={() => signOut()}>sign out</button>
				</> */}
			</>
		);
	}
	return (
		<>
			<button onClick={() => signIn('google')}>sign in with google</button>
		</>
	);
}
