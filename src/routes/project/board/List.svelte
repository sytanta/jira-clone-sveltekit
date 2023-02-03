<script lang="ts">
	import moment from 'moment';
	import intersection from 'lodash/intersection';

	import type { IssueStatus } from '@prisma/client';
	import type { ProjectDataSafe } from '$lib/types';
	import type { IssueFilters } from './types';

	import { ISSUE_STATUS_OBJ } from '$lib/constants/issue';
	import { projectStore } from '$lib/stores/project';

	import Issue from './Issue.svelte';

	export let filters: IssueFilters;
	export let status: IssueStatus;

	$: allListIssues = getSortedListIssues($projectStore?.Issue || [], status);
	$: filteredIssues = filterIssues($projectStore?.Issue || [], filters, 'currentUserId');
	$: filteredListIssues = getSortedListIssues(filteredIssues, status);

	function filterIssues(
		projectIssues: ProjectDataSafe['Issue'],
		filters: IssueFilters,
		currentUserId: string
	) {
		const { searchTerm, userIds, myOnly, recent } = filters;
		let issues = projectIssues;

		if (searchTerm) {
			issues = issues.filter((issue) =>
				issue.title.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		if (userIds.length > 0) {
			issues = issues.filter((issue) => {
				const issueUserIds = issue.User.map((userOnIssue) => userOnIssue.userId);
				return intersection(issueUserIds, userIds).length > 0;
			});
		}
		if (myOnly && currentUserId) {
			issues = issues.filter((issue) => {
				const issueUserIds = issue.User.map((userOnIssue) => userOnIssue.userId);
				return issueUserIds.includes(currentUserId);
			});
		}
		if (recent) {
			issues = issues.filter((issue) =>
				moment(issue.updatedAt).isAfter(moment().subtract(3, 'days'))
			);
		}

		return issues;
	}

	function getSortedListIssues(issues: ProjectDataSafe['Issue'], status: IssueStatus) {
		return issues
			.filter((issue) => issue.status === status)
			.sort((a, b) => a.listPosition - b.listPosition);
	}

	function formatIssuesCount(
		allListIssues: ProjectDataSafe['Issue'],
		filteredListIssues: ProjectDataSafe['Issue']
	) {
		if (allListIssues.length !== filteredListIssues.length) {
			return `${filteredListIssues.length} of ${allListIssues.length}`;
		}

		return allListIssues.length;
	}
</script>

<div class="list">
	<div class="title">
		{`${ISSUE_STATUS_OBJ[status]} `}
		<span class="issue-count">{formatIssuesCount(allListIssues, filteredListIssues)}</span>
	</div>
	<div class="issues" data-testid={`board-list:${status}`}>
		{#each filteredListIssues as issue (issue.id)}
			<Issue {issue} />
		{/each}
	</div>
</div>

<style lang="scss">
	@import '../../../lib/styles/variables';
	@import '../../../lib/styles/mixins';

	.list {
		background: $backgroundLightest;
		border-radius: 3px;
		display: flex;
		flex-direction: column;
		margin: 0 5px;
		min-height: 400px;
		width: 25%;

		.title {
			color: $textMedium;
			padding: 13px 10px 17px;
			text-transform: uppercase;

			@include font-size(12.5);
			@include truncateText;
		}

		.issue-count {
			text-transform: lowercase;

			@include font-size(13);
		}

		.issues {
			height: 100%;
			padding: 0 5px;
		}
	}
</style>
