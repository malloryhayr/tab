import { useGitHubIssues } from '../lib';
import { GitHubIssue } from '../types';

import styled from 'styled-components';

function GitHubIssueCard({ issue }: {
	issue: GitHubIssue;
}) {
	console.log(issue);
	return (
		<div>
			<h1>{issue.repository?.name}</h1>
			<p>#{issue.number} {issue.title}</p>
		</div>
	)
}

export default function GitHub() {
	const { data } = useGitHubIssues();
	
	console.log(data);

	return (
		<div>
			{data?.map(x => <GitHubIssueCard key={x.id} issue={x} />)}
		</div>
	)
}