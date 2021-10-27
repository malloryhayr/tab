import { useGitHubIssues } from '../lib';
import { GitHubIssue } from '../types';

import { IssueOpenedIcon, GitPullRequestIcon, RepoIcon } from '@primer/octicons-react'

import styled from 'styled-components';

function GitHubIssueCard({ issue }: {
	issue: GitHubIssue;
}) {
	return (
		<a href={issue.html_url} target={'_blank'} rel={'noreferrer'}>
			<GitHubIssueCardContainer>
				<GitHubIssueCardTitle>
					{
						issue.pull_request 
						? <GitPullRequestIcon verticalAlign={'middle'} fill={'rgb(63, 185, 80)'} size={24} />
						: <IssueOpenedIcon verticalAlign={'middle'} fill={'rgb(63, 185, 80)'} size={24} />
					}
					<h3>{issue.title}</h3>
				</GitHubIssueCardTitle>
				<GitHubIssueCardBody>
					{issue.body}
				</GitHubIssueCardBody>
				<GitHubIssueCardFooter>
					<span><RepoIcon /> {issue.repository?.owner.login}/{issue.repository?.name} #{issue.number}</span>
				</GitHubIssueCardFooter>
			</GitHubIssueCardContainer>
		</a>
	)
}

export default function GitHub() {
	const { data } = useGitHubIssues();

	console.log(data);

	if (data) return (
		<GitHubIssueContainer>
			{data?.map(x => <GitHubIssueCard key={x.id} issue={x} />)}
		</GitHubIssueContainer>
	) 
	else return <div></div>;
}

const GitHubIssueContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;
	overflow-y: hidden;
`;

const GitHubIssueCardContainer = styled.div`
	margin: 12.5px;
	padding: 12.5px;
	border: 0.75px solid rgba(200, 200, 200, 0.3);
	border-radius: 5px;
	max-width: 500px;
	height: 12.5vh;
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
		height: 24px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
`;

const GitHubIssueCardBody = styled.p`
	padding-left: 10px;
	padding-right: 10px;
	padding-top: 5px;
	opacity: 0.7;
	height: 160px;
	position: relative;
	overflow: hidden;
	
	&:after {
		content: '';
		text-align: right;
		position: absolute;
		bottom: 0;
		right: 0;
		width: 50%;
		height: 20px;
		background: linear-gradient(to right, rgba(255, 255, 255, 0), #010409 50%);
	}
`;

const GitHubIssueCardFooter = styled.div`
	opacity: 0.3;
`;