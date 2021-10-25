import useSWR from 'swr';

//@ts-ignore
import cookieCutter from 'cookie-cutter';

function getGitHubToken(): string | undefined {
	if (typeof window == 'undefined') return;
	return cookieCutter.get('githubToken');
}

const fetchWithGitHubToken = (url: string) => 
	fetch(url, {
		method: 'GET',
		headers: {
			'Authorization': `token ${getGitHubToken()}`
		}
	}).then(res => res.json());

export function useGitHubIssues() {
	const { data, error } = useSWR(
		'https://api.github.com/issues',
		fetchWithGitHubToken
	)

	return {
		data,
		error,
	}
}