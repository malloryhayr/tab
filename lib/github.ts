import useSWR, { SWRResponse } from 'swr';

import { getCookie } from 'cookies-next';

import { GitHubIssue, GitHubPullRequest, GitHubUser } from '../types';

function getGitHubToken(): string | undefined {
	if (typeof window == 'undefined') return undefined;
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
	let { data, error }: SWRResponse<GitHubIssue[], Error> = useSWR(
		`https://api.github.com/issues?filter=all&sort=updated&state=open`,
		fetchWithGitHubToken
	)

	// @ts-ignore
	if (data && !data.message) {
		return {
			data,
			error
		}
	} else {
		return {
			data: undefined,
			error,
		}
	}
}

export function useGitHubPullRequest(owner: string | undefined, repo: string | undefined, id: number | undefined, pr: any) {
	const { data, error }: SWRResponse<GitHubPullRequest, Error> = useSWR(
		pr ? `https://api.github.com/repos/${owner}/${repo}/pulls/${id}` : ``,
		fetchWithGitHubToken
	)

	if (!owner || !repo || !id) return {
		data: undefined,
		error
	}

	// @ts-ignore
	if (data && !data.message) {
		return {
			data,
			error,
		}
	} else {
		return {
			data: undefined,
			error
		}
	}
}

export function useGitHubToken() {
	return {
		token: getGitHubToken()
	}
}