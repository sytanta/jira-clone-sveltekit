<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { ISSUE_PRIOTIRY, ISSUE_PRIOTIRY_OBJ } from '$lib/constants/issue';

	import Select from '$lib/components/Select/index.svelte';
	import IssuePriorityIcon from '$lib/components/IssuePriorityIcon.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	const issueOptions = Object.values(ISSUE_PRIOTIRY).map((priority) => ({
		value: priority,
		label: ISSUE_PRIOTIRY_OBJ[priority]
	}));

	function onChange(event: CustomEvent<string>) {
		emit('update', { data: { priority: event.detail }, currentIssueData: issue });
	}
</script>

<div class="section-title">Priority</div>
<Select
	name="priority"
	value={issue.priority}
	options={issueOptions}
	variant="empty"
	withClearValue={false}
	width={343}
	on:change={onChange}
>
	<svelte:fragment slot="render-option-value-single" let:optionValue>
		<div class="priority is-value">
			<IssuePriorityIcon priority={optionValue} />
			<div class="label">{ISSUE_PRIOTIRY_OBJ[optionValue]}</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="render-option-dropdown-item" let:option>
		<div class="priority">
			<IssuePriorityIcon priority={option.value} />
			<div class="label">{ISSUE_PRIOTIRY_OBJ[option.value]}</div>
		</div>
	</svelte:fragment>
</Select>

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.priority {
		align-items: center;
		display: flex;
		text-transform: capitalize;

		&.is-value {
			border-radius: 4px;
			padding: 3px 4px 3px 0px;

			&:hover,
			&:focus {
				background: $backgroundLight;
			}
		}

		.label {
			padding: 0 3px 0 8px;

			@include font-size(14.5);
		}
	}
</style>
