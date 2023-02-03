<script lang="ts">
	import type { ProjectDataSafe } from '$lib/types';

	import sortByNewest from '$lib/utils/sortByNewest';

	import Icon from '$lib/components/Icon.svelte';
	import InputDebounced from '$lib/components/InputDebounced.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import NoSearchResult from './NoSearchResult.svelte';
	import IssueSearchItem from './IssueSearchItem.svelte';

	export let project: ProjectDataSafe;

	let isSearchTermEmpty = true;
	let isLoading = false;
	let matchingIssues: ProjectDataSafe['Issue'] = [];

	$: recentIssues = sortByNewest(project.Issue, 'createdAt').slice(0, 10);

	async function searchIssues(searchTerm: string) {
		const res = await fetch(`/api/issue/search?projectId=${project.id}&searchTerm=${searchTerm}`);
		const { issues } = await res.json();

		matchingIssues = issues;
	}

	async function handleSearchChange(event: CustomEvent<string>) {
		const searhTerm = event.detail;

		isLoading = true;
		await searchIssues(searhTerm);

		isSearchTermEmpty = !searhTerm;
		isLoading = false;
	}
</script>

<div class="container">
	<div class="search-input">
		<InputDebounced
			class="input-debounce"
			placeholder="Search issues by summary, description..."
			on:input={handleSearchChange}
		/>
		<Icon class="search-icon" type="search" size={22} />
		{#if isLoading}
			<Spinner class="search-spinner" />
		{/if}
	</div>

	{#if isSearchTermEmpty && recentIssues.length}
		<div class="section-title">Recent Issues</div>

		{#each recentIssues as issue (issue.id)}
			<IssueSearchItem {issue} />
		{/each}
	{/if}

	{#if !isSearchTermEmpty && matchingIssues.length}
		<div class="section-title">Matching Issues</div>

		{#each matchingIssues as issue (issue.id)}
			<IssueSearchItem {issue} />
		{/each}
	{/if}

	{#if !isSearchTermEmpty && !isLoading && !matchingIssues.length}
		<div class="no-result">
			<NoSearchResult />
			<div class="no-result-title">We couldn&apos;t find anything matching your search</div>
			<div class="no-result-tip">Try again with a different term.</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.container {
		padding: 25px 35px 60px;

		.search-input {
			margin-bottom: 40px;
			padding-right: 30px;
			position: relative;

			:global(.input-debounce) {
				height: 40px;

				:global(input) {
					padding: 0 0 0 32px;
					border: none;
					border-bottom: 2px solid $primary;
					background: #fff;

					@include font-size(21);

					&:focus,
					&:hover {
						background: #fff;
						border: none;
						border-bottom: 2px solid $primary;
						box-shadow: none;
					}
				}
			}

			:global(.search-icon) {
				color: $textMedium;
				position: absolute;
				top: 8px;
				left: 0;
			}

			:global(.search-spinner) {
				position: absolute;
				right: 30px;
				top: 5px;
			}
		}

		.section-title {
			color: $textMedium;
			padding-bottom: 12px;
			text-transform: uppercase;

			@include font-size(11.5);
			@include font-family-bold;
		}

		.no-result {
			padding-top: 50px;
			text-align: center;

			.no-result-title {
				padding-top: 30px;

				@include font-size(20);
				@include font-family-medium;
			}

			.no-result-tip {
				padding-top: 10px;

				@include font-size(15);
			}
		}
	}
</style>
