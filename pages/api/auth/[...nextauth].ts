import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID!!,
			clientSecret: process.env.GOOGLE_SECRET!!,
			authorization: {
				params: {
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
				},
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	secret: process.env.JWT_SECRET,
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }: any) {
			if (account?.access_token) {
				token.accessToken = account.access_token;
			}
			token.user = user;
			return token;
		},
	},
};

export default NextAuth(authOptions);
