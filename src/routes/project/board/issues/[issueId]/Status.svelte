<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { ISSUE_STATUS, ISSUE_STATUS_OBJ } from '$lib/constants/issue';
	import { projectStore } from '$lib/stores/project';

	import Select from '$lib/components/Select/index.svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();

	const options = Object.values(ISSUE_STATUS).map((status) => ({
		value: status,
		label: ISSUE_STATUS_OBJ[status]
	}));

	function handleStatusChange(event: CustomEvent<string>) {
		// Re-calculate "listPosition"
		const sameStatusIssues = $projectStore?.Issue.filter((issue) => issue.status === event.detail);
		let smallestListPosition = !sameStatusIssues?.length ? 2 : sameStatusIssues[0].listPosition;

		if (sameStatusIssues?.length) {
			for (let issue of sameStatusIssues) {
				if (smallestListPosition > issue.listPosition) smallestListPosition = issue.listPosition;
			}

			smallestListPosition--;
		}

		emit('update', {
			data: { status: event.detail, listPosition: smallestListPosition },
			currentIssueData: issue
		});
	}
</script>

<div class="section-title">Status</div>
<Select
	name="status"
	value={issue.status}
	{options}
	variant="empty"
	width={343}
	withClearValue={false}
	on:change={handleStatusChange}
>
	<svelte:fragment slot="render-option-value-single" let:optionValue>
		<div class={`status is-value ${optionValue}`}>
			<div>{ISSUE_STATUS_OBJ[optionValue]}</div>
			<Icon type="chevron-down" size={18} top={1} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="render-option-dropdown-item" let:option>
		<div class={`status ${option.value}`} style:color={'status'}>
			{ISSUE_STATUS_OBJ[option.value]}
		</div>
	</svelte:fragment>
</Select>

<style lang="scss">
	@import '../../../../../lib/styles/mixins';

	.status {
		text-transform: uppercase;
		transition: all 0.1s;

		&.backlog {
			@include tag(#dfe1e6, #42526e);
		}
		&.selected {
			@include tag(#dfe1e6, #42526e);
		}
		&.inprogress {
			@include tag(#0052cc, #fff);
		}
		&.done {
			@include tag(#0b875b, #fff);
		}

		&.is-value {
			display: flex;
			justify-content: space-between;
			padding: 0 12px;
			height: 32px;

			&:hover {
				transform: scale(1.05);
			}
		}

		& > div {
			padding: 0 5px 0 0;
		}
	}
</style>
