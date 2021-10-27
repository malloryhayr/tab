import { components } from '@octokit/openapi-types';

export type GitHubIssue = components["schemas"]["issue"];

export type GitHubUser = components["schemas"]["simple-user"];

export type GitHubPullRequest = components["schemas"]["pull-request"];

export type GitHubBasicError = components["schemas"]["basic-error"];