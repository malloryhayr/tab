import { useGitHubIssues, useGitHubPullRequest } from '../lib';
import { GitHubIssue } from '../types';

import { ArrowLeftIcon, GitPullRequestIcon, IssueOpenedIcon, RepoIcon } from '@primer/octicons-react'
import { Avatar, AvatarStack } from '@primer/components';

import styled from 'styled-components';
import SimpleMarkdown from './SimpleMarkdown';

function GitHubIssueCard({ issue }: {
	issue: GitHubIssue;
}) {
	const { data: pullRequest } = useGitHubPullRequest(issue.repository?.owner.login, issue.repository?.name, issue.number);

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
					<SimpleMarkdown>
						{issue.body}
					</SimpleMarkdown>
				</GitHubIssueCardBody>
				<GitHubIssueCardFooter>
					<GitHubIssueCardRepoLabel>
						<RepoIcon /> {issue.repository?.owner.login}/{issue.repository?.name} #{issue.number}
						{ issue.pull_request ? (
							<>
								&nbsp;
								<ArrowLeftIcon />
								&nbsp;
								{ pullRequest?.head.label }
							</>
						) : <></>}
					</GitHubIssueCardRepoLabel>
					{ issue.assignees ? (
						<AvatarStack alignRight sx={{color: '#010409'}}>
							{ issue.assignees.map(x => <Avatar key={x.id} alt={x.login} src={x.avatar_url} />) }
						</AvatarStack>
					) : <></>}
				</GitHubIssueCardFooter>
			</GitHubIssueCardContainer>
		</a>
	)
}

export default function GitHub() {
	const { data } = useGitHubIssues();

	if (data) return (
		<GitHubIssueBackground>
			<GitHubIssueContainer>
				{data?.map(x => <GitHubIssueCard key={x.id} issue={x} />)}
			</GitHubIssueContainer>
		</GitHubIssueBackground>
	) 
	else return <div></div>;
}

const GitHubIssueBackground = styled.div`
	position: absolute;
	margin: 50px;
	height: calc(100vh - 400px);
	overflow-y: scroll;
`

const GitHubIssueContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;
`;

const GitHubIssueCardContainer = styled.div`
	margin: 12.5px;
	padding: 12.5px;
	border: 0.75px solid rgba(200, 200, 200, 0.3);
	border-radius: 5px;
	max-width: 500px;
	min-width: 250px;
	min-height: 12.5vh;
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
	margin-bottom: 10px;
	opacity: 0.7;
	max-height: 60px;
	position: relative;
	overflow: hidden;
	
	&:after {
		content: '';
		text-align: right;
		position: absolute;
		top: 40px;
		right: 0;
		width: 50%;
		height: 20px;
		background: linear-gradient(to right, rgba(255, 255, 255, 0), #010409 50%);
		z-index: 1;
	}
`;

const GitHubIssueCardFooter = styled.div`
	color: #4E5053;

	transition: color 0.3s;

	z-index: 5;

	/* &:hover {
		color: #B3B4B5;
	} */
`;

const GitHubIssueCardRepoLabel = styled.span`
	position: absolute;
	left: 12.5px;
	bottom: 12.5px;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	max-width: 75%;
`;