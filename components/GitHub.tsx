import { useGitHubIssues } from '../lib';
import { GitHubIssue } from '../types';

import { IssueOpenedIcon, RepoIcon } from '@primer/octicons-react'

import styled from 'styled-components';

function GitHubIssueCard({ issue }: {
	issue: GitHubIssue;
}) {
	return (
		<GitHubIssueCardContainer onClick={() => window.open(issue.html_url, '_blank')}>
			<GitHubIssueCardTitle>
				<IssueOpenedIcon verticalAlign={'middle'} fill={'rgb(63, 185, 80)'} size={24} />
				<h3>{issue.title}</h3>
			</GitHubIssueCardTitle>
			<GitHubIssueCardBody>
				{issue.body}
			</GitHubIssueCardBody>
			<GitHubIssueCardFooter>
				<span><RepoIcon /> {issue.repository?.owner.login}/{issue.repository?.name} #{issue.number}</span>
			</GitHubIssueCardFooter>
		</GitHubIssueCardContainer>
	)
}

export default function GitHub() {
	const { data } = useGitHubIssues();

	return (
		<GitHubIssueContainer>
			{data?.filter(x => x.pull_request).map(x => <GitHubIssueCard key={x.id} issue={x} />)}
			{data?.filter(x => !x.pull_request).map(x => <GitHubIssueCard key={x.id} issue={x} />)}
		</GitHubIssueContainer>
	)
}

const GitHubIssueContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;
	overflow-y: scroll;
	height: 100%;
`;

const GitHubIssueCardContainer = styled.div`
	margin: 12.5px;
	padding: 12.5px;
	border: 0.75px solid rgba(200, 200, 200, 0.3);
	border-radius: 5px;
	max-width: 500px;
	max-height: 200px;
	overflow-y: hidden;

	position: relative;
	
	transition: border 0.25s;

	&:hover {
		border: 0.75px solid rgba(200, 200, 200, 0.8);
		cursor: pointer;
	}

	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const GitHubIssueCardTitle = styled.div`
	height: 40px;

	display: flex;
	align-items: center;
	
	h3 {
		margin-left: 12.5px;
		margin-right: 12.5px;
		line-height: 24px;
	}
`;

const GitHubIssueCardBody = styled.p`
	padding-left: 10px;
	padding-right: 10px;
	opacity: 0.7;
	overflow-x: wrap;
	overflow-y: hidden;
	height: 60px;

	&:before {
		content:'';
		width:100%;
		height:75%;    
		position:absolute;
		left:0;
		top:0;
		background:linear-gradient(transparent 50px, #010409);
	}
`;

const GitHubIssueCardFooter = styled.div`
	opacity: 0.3;
`;