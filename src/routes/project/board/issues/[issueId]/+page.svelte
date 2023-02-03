<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { issueStore, resetIssueStore, updateIssueStore } from '$lib/stores/issue';

	import { fetchIssue, updateIssue as update } from '../../+layout.svelte';

	import PageError from '$lib/components/PageError/index.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AboutTooltip from '$lib/components/AboutTooltip/index.svelte';
	import Button from '$lib/components/Button.svelte';
	import CopyLinkButton from '$lib/components/CopyLinkButton.svelte';
	import Comments from './Comments/index.svelte';
	import Loader from './Loader.svelte';
	import Type from './Type.svelte';
	import Delete from './Delete.svelte';
	import Title from './Title.svelte';
	import Description from './Description.svelte';
	import Status from './Status.svelte';
	import Assignees from './Assignees.svelte';
	import Reporter from './Reporter.svelte';
	import Priority from './Priority.svelte';
	import EstimateTracking from './EstimateTracking.svelte';
	import Dates from './Dates.svelte';

	const issueId = $page.params['issueId'];
	let issueFetched: IssueDataSafe | null = null;
	let issue: IssueDataSafe | null = null;
	let isFetching = true;

	$: issue = $issueStore;

	onMount(async () => {
		issueFetched = await fetchIssue(issueId);

		updateIssueStore(issueFetched);
		isFetching = false;
	});

	onDestroy(() => {
		updateIssueStore(null);
	});

	async function updateIssue(
		event: CustomEvent<{
			data: Record<string, string | string[] | null>;
			currentIssueData: IssueDataSafe;
		}>
	) {
		const { data, currentIssueData } = event.detail;

		const res = await update(issueId, data, currentIssueData);
		if (!res.ok) return resetIssueStore();

		const updatedData = await (res as Response).json();
		return updateIssueStore(updatedData.issue);
	}

	async function refetchIssue(event: CustomEvent<{ callback?: () => void }>) {
		issueFetched = await fetchIssue(issueId);

		updateIssueStore(issueFetched);
		event.detail.callback?.();
	}

	function onClose() {
		goto('/project/board');
	}
</script>

<Modal
	isOpen={true}
	testid="modal:issue-details"
	width={1040}
	withCloseIcon={false}
	on:close={onClose}
>
	<div slot="content">
		{#if isFetching}
			<Loader height="260" width="940" speed={2} />
		{:else if issue}
			<div class="top-actions">
				<Type {issue} on:update={updateIssue} />
				<div class="top-actions-right">
					<AboutTooltip>
						<svelte:fragment slot="toggler">
							<Button icon="feedback" variant="empty">Give feedback</Button>
						</svelte:fragment>
					</AboutTooltip>
					<CopyLinkButton variant="empty" />
					<Delete {issueId} />
					<Button icon="close" iconSize={24} variant="empty" on:click={onClose} />
				</div>
			</div>
			<div class="content">
				<div class="left">
					<Title {issue} on:update={updateIssue} />
					<Description {issue} on:update={updateIssue} />
					<Comments {issue} on:update={refetchIssue} on:delete={refetchIssue} />
				</div>
				<div class="right">
					<Status {issue} on:update={updateIssue} />
					<Assignees {issue} on:update={updateIssue} />
					<Reporter {issue} on:update={updateIssue} />
					<Priority {issue} on:update={updateIssue} />
					<EstimateTracking {issue} on:update={updateIssue} />
					<Dates {issue} />
				</div>
			</div>
		{:else}
			<PageError />
		{/if}

		<!-- {#await fetchingIssue}
			<Loader height="260" width="940" speed={2} />
		{:then issueFetched}
			{@const issue = issueRefetched || issueFetched}
			{#if issue}
				<div class="top-actions">
					<Type {issue} on:update={updateIssue} />
					<div class="top-actions-right">
						<AboutTooltip>
							<svelte:fragment slot="toggler">
								<Button icon="feedback" variant="empty">Give feedback</Button>
							</svelte:fragment>
						</AboutTooltip>
						<CopyLinkButton variant="empty" />
						<Delete {issueId} />
						<Button icon="close" iconSize={24} variant="empty" on:click={onClose} />
					</div>
				</div>
				<div class="content">
					<div class="left">
						<Title {issue} on:update={updateIssue} />
						<Description {issue} on:update={updateIssue} />
						<Comments {issue} on:update={refetchIssue} on:delete={refetchIssue} />
					</div>
					<div class="right">
						<Status {issue} />
						<Assignees {issue} on:update={updateIssue} />
						<Reporter {issue} on:update={updateIssue} />
						<Priority {issue} on:update={updateIssue} />
						<EstimateTracking {issue} on:update={updateIssue} />
						<Dates {issue} />
					</div>
				</div>
			{:else}
				<PageError />
			{/if}
		{:catch _}
			<PageError />
		{/await} -->
	</div>
</Modal>

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.top-actions {
		display: flex;
		justify-content: space-between;
		padding: 21px 18px 0;

		.top-actions-right {
			align-items: center;
			display: flex;

			& > * {
				margin-left: 4px;
			}
		}
	}

	.content {
		display: flex;
		padding: 0 30px 60px;

		.left {
			padding-right: 50px;
			width: 65%;
		}

		.right {
			padding-top: 5px;
			width: 35%;
		}

		:global(.section-title) {
			color: $textMedium;
			margin: 24px 0 5px;
			text-transform: uppercase;

			@include font-size(12.5);
			@include font-family-bold;
		}
	}
</style>
