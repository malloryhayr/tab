import useSWR, { SWRResponse } from 'swr';

import { getCookie } from 'cookies-next';

import { GitHubIssue } from '../types';

function getGitHubToken(): string | undefined {
	if (typeof window == 'undefined') return;
	return getCookie('githubToken') as string || '';
}

const fetchWithGitHubToken = (url: string) => 
	fetch(url, {
		method: 'GET',
		headers: {
			'Authorization': `token ${getGitHubToken()}`
		}
	}).then(res => res.json());

export function useGitHubIssues() {
	const { data, error }: SWRResponse<GitHubIssue[], Error> = useSWR(
		'https://api.github.com/issues',
		fetchWithGitHubToken
	)

	return {
		data,
		error,
	}
}