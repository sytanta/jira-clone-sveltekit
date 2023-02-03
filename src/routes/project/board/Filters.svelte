<script lang="ts">
	import { xor } from 'lodash';

	import type { IssueFilters } from './types';

	import { projectStore } from '$lib/stores/project';

	import InputDebounced from '$lib/components/InputDebounced.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import Button from '$lib/components/Button.svelte';

	type tUpdateFilter = Partial<IssueFilters>;

	export let filters: IssueFilters;

	const defaultFilters = filters;
	let areFiltersCleared = false;

	$: projectUsers = $projectStore?.User;
	$: {
		const { searchTerm, userIds, myOnly, recent } = filters;
		areFiltersCleared = !searchTerm && !myOnly && !recent && !userIds.length;
	}

	function updateFilters(newFilter: tUpdateFilter) {
		filters = { ...filters, ...newFilter };
	}
</script>

<div class="board-filters" data-testid="board-filters">
	<InputDebounced
		icon="search"
		value={filters.searchTerm}
		class="search-input"
		on:input={(value) => updateFilters({ searchTerm: value.detail })}
	/>
	{#if projectUsers}
		<div class="avatars">
			{#each projectUsers as user (user.id)}
				<div class="avatar" class:active={filters.userIds.includes(user.id)}>
					<Avatar
						class="avatar-icon"
						name={user.name}
						avatarUrl={user.avatarUrl}
						on:click={() => updateFilters({ userIds: xor(filters.userIds, [user.id]) })}
					/>
				</div>
			{/each}
		</div>
	{/if}
	<Button
		variant="empty"
		isActive={filters.myOnly}
		on:click={() => updateFilters({ myOnly: !filters.myOnly })}
	>
		Only My Issues
	</Button>
	<Button
		variant="empty"
		isActive={filters.recent}
		on:click={() => updateFilters({ recent: !filters.recent })}
	>
		Recently Updated
	</Button>
	{#if !areFiltersCleared}
		<button class="clear-all" on:click={() => updateFilters(defaultFilters)}>Clear all</button>
	{/if}
</div>

<style lang="scss">
	@import '../../../lib/styles/variables';
	@import '../../../lib/styles/mixins';

	.board-filters {
		align-items: center;
		display: flex;
		margin-top: 24px;

		:global(.search-input) {
			margin-right: 18px;
			width: 160px;
		}

		.avatars {
			display: flex;
			flex-direction: row-reverse;
			margin: 0 12px 0 2px;
		}

		.avatar {
			border-radius: 50%;
			display: inline-flex;
			margin-left: -2px;
			transition: transform 0.1s;

			&.active {
				box-shadow: 0 0 0 4px $primary;
			}

			&:hover {
				transform: translateY(-5px);
			}

			:global(.avatar-icon) {
				box-shadow: 0 0 0 2px #fff;

				@include clickable;
			}
		}

		:global(.button) {
			margin-left: 6px;
		}

		.clear-all {
			border-left: 1px solid $borderLightest;
			color: $textDark;
			height: 32px;
			line-height: 32px;
			margin-left: 15px;
			padding-left: 12px;

			@include font-size(14.5);
			@include clickable;

			&:hover {
				color: $textMedium;
			}
		}
	}
</style>
