<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { projectStore } from '$lib/stores/project';

	import Select from '$lib/components/Select/index.svelte';
	import User from './User.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	let users: string[];

	const userOptions =
		$projectStore?.User.map((user) => ({ value: user.id, label: user.name })) || [];

	$: users = issue.User.map((user) => user.userId);

	function getUserById(userId: string | number | any[] | null) {
		return $projectStore?.User.find((user) => user.id === userId);
	}

	function onChange(event: CustomEvent<string[]>) {
		emit('update', {
			data: { assignees: event.detail },
			currentIssueData: issue
		});
	}
</script>

<div class="section-title">Assignees</div>
<Select
	name="assignees"
	value={users}
	options={userOptions}
	isMulti={true}
	variant="empty"
	width={343}
	placeholder="Unassigned"
	on:change={onChange}
>
	<svelte:fragment slot="render-option-value-multi" let:optionValue let:removeOptionValue>
		{@const user = getUserById(optionValue)}
		<User {user} isSelectedValue={true} {removeOptionValue} />
	</svelte:fragment>
	<svelte:fragment slot="render-option-dropdown-item" let:option>
		{@const user = getUserById(option.value)}
		<User {user} />
	</svelte:fragment>
</Select>
