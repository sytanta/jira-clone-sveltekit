<script lang="ts" context="module">
	import moment from 'moment';
	import intersection from 'lodash/intersection';

	import type { IssueStatus } from '@prisma/client';
	import type { ProjectDataSafe } from '$lib/types';
	import type { IssueFilters } from './types';

	const flipDurationMs = 200;

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

<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone, TRIGGERS, type DndEvent } from 'svelte-dnd-action';

	import { ISSUE_STATUS, ISSUE_STATUS_OBJ } from '$lib/constants/issue';
	import { page } from '$app/stores';
	import { projectStore } from '$lib/stores/project';

	import { updateIssue } from './+layout.svelte';

	import Issue from './Issue.svelte';

	export let filters: IssueFilters;

	$: boardUnfiltered = ISSUE_STATUS.map((status) => {
		let allListIssues = getSortedListIssues($projectStore?.Issue || [], status);
		let sortedListIssues = getSortedListIssues(allListIssues, status);

		return {
			id: status,
			issues: sortedListIssues
		};
	});
	$: board = ISSUE_STATUS.map((status) => {
		let allListIssues = getSortedListIssues($projectStore?.Issue || [], status);
		let filteredIssues = filterIssues($projectStore?.Issue || [], filters, $page.data.user.id);
		let filteredListIssues = getSortedListIssues(filteredIssues, status);

		return {
			id: status,
			name: status,
			issues: filteredListIssues,
			count: formatIssuesCount(allListIssues, filteredListIssues)
		};
	});

	function handleDndConsiderCards(
		cid: string,
		e: CustomEvent<{ items: ProjectDataSafe['Issue'] }>
	) {
		const colIdx = board.findIndex((c) => c.id === cid);
		board[colIdx].issues = e.detail.items;
		board = [...board];
	}

	function handleDndFinalizeCards(cid: string, e: CustomEvent<DndEvent>) {
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const colIdx = board.findIndex((c) => c.id === cid);

			const itemsStored = boardUnfiltered[colIdx].issues;
			const { items: itemsDisplayed } = e.detail;
			const { id } = e.detail.info;

			const newStatus = board[colIdx].id;
			let newListPosition: number | undefined;

			let indexD: number = itemsDisplayed.findIndex((item) => item.id === id);
			let issueAbove = itemsDisplayed[indexD - 1];
			let issueBelowD = itemsDisplayed[indexD + 1];
			let issueBelow = issueBelowD;

			let indexAboveS = issueAbove
				? itemsStored.findIndex((item) => item.id === issueAbove.id)
				: -1;
			let indexBelowS = indexAboveS + 1;

			let issueBelowS = indexBelowS > -1 ? itemsStored[indexBelowS] : null;

			while (
				issueBelowS &&
				!itemsDisplayed.find((item) => item.id === issueBelowS!.id) &&
				((indexAboveS < 0 && indexAboveS <= indexBelowS) || indexAboveS < indexBelowS)
			) {
				issueBelow = issueBelowS;
				issueBelowS = itemsStored[--indexBelowS];
			}

			if (!issueAbove && !issueBelow) {
				newListPosition = 1;
			} else if (!issueAbove) {
				newListPosition = issueBelow!.listPosition - 1;
			} else if (!issueBelow) {
				newListPosition = issueAbove.listPosition + 1;
			} else {
				newListPosition =
					issueAbove.listPosition + (issueBelow.listPosition - issueAbove.listPosition) / 2;
			}

			const index = $projectStore?.Issue?.findIndex((item) => item.id === id);

			if ($projectStore?.Issue && index !== undefined && index > -1) {
				updateIssue(
					id,
					{ status: newStatus, listPosition: newListPosition! },
					$projectStore.Issue[index]
				);
			}
		}
	}
</script>

{#if board}
	<div class="lists">
		{#each board as column (column.id)}
			<div class="list">
				<div class="title">
					{`${ISSUE_STATUS_OBJ[column.id]} `}
					<span class="issue-count">{column.count}</span>
				</div>
				<div
					class="issues"
					data-testid={`board-list:${column.id}`}
					use:dndzone={{
						items: column.issues,
						flipDurationMs,
						dropTargetStyle: { outline: 'none' },
						transformDraggedElement: (draggedEl) => {
							draggedEl?.querySelector('.issue')?.classList.add('being-dragged');
						}
					}}
					on:consider={(e) => handleDndConsiderCards(column.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
				>
					{#each column.issues as issue (issue.id)}
						<div animate:flip={{ duration: flipDurationMs }}><Issue {issue} /></div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	@import '../../../lib/styles/variables';
	@import '../../../lib/styles/mixins';

	.lists {
		display: flex;
		margin: 26px -5px 0;

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
	}
</style>
