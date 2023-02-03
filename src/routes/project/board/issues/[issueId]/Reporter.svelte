<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { projectStore } from '$lib/stores/project';

	import Select from '$lib/components/Select/index.svelte';
	import User from './User.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	const userOptions =
		$projectStore?.User.map((user) => ({ value: user.id, label: user.name })) || [];

	const getUserById = (userId: string | number | any[] | null) =>
		$projectStore?.User.find((user) => user.id === userId);

	function onChange(event: CustomEvent<string>) {
		emit('update', { data: { reporterId: event.detail }, oldIssueData: issue });
	}
</script>

<div class="section-title">Reporter</div>
<Select
	name="reporter"
	value={issue.reporterId}
	options={userOptions}
	variant="empty"
	width={343}
	placeholder="Unassigned"
	withClearValue={false}
	on:change={onChange}
>
	<svelte:fragment slot="render-option-value-single" let:optionValue>
		{@const user = getUserById(optionValue)}
		<User {user} isSelectedValue={true} />
	</svelte:fragment>
	<svelte:fragment slot="render-option-dropdown-item" let:option>
		{@const user = getUserById(option.value)}
		<User {user} />
	</svelte:fragment>
</Select>
