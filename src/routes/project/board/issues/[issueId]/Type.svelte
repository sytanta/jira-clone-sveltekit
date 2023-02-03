<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueType } from '@prisma/client';
	import type { IssueDataSafe } from '$lib/types';

	import { ISSUE_TYPE, ISSUE_TYPE_OBJ } from '$lib/constants/issue';

	import Select from '$lib/components/Select/index.svelte';
	import Button from '$lib/components/Button.svelte';
	import IssueTypeIcon from '$lib/components/IssueTypeIcon.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	const categoryOptions = Object.values(ISSUE_TYPE).map((type) => ({
		value: type,
		label: ISSUE_TYPE_OBJ[type]
	}));

	function handleTypeChange(event: CustomEvent<IssueType>) {
		emit('update', { data: { type: event.detail }, currentIssueData: issue });
	}
</script>

<Select
	name="type"
	value={issue.type}
	options={categoryOptions}
	variant="empty"
	width={150}
	withClearValue={false}
	on:change={handleTypeChange}
>
	<svelte:fragment slot="render-option-value-single" let:optionValue>
		<Button class="option-button" variant="empty">
			<svelte:fragment slot="icon">
				<IssueTypeIcon type={optionValue} />
			</svelte:fragment>
			{`${ISSUE_TYPE_OBJ[optionValue]}-${issue.id}`}
		</Button>
	</svelte:fragment>
	<svelte:fragment slot="render-option-dropdown-item" let:option>
		<button class="type" on:click>
			<IssueTypeIcon type={option.value} top={1} />
			<div class="type-label">{ISSUE_TYPE_OBJ[option.value]}</div>
		</button>
	</svelte:fragment>
</Select>

<!-- icon={<IssueTypeIcon type={type} />} -->
<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	:global(.option-button) {
		color: $textMedium;
		letter-spacing: 0.5px;
		text-transform: uppercase;

		@include font-size(13);
	}

	.type {
		align-items: center;
		display: flex;

		.type-label {
			padding: 0 5px 0 7px;
			text-transform: capitalize;

			@include font-size(15);
		}
	}
</style>
