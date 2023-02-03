<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import Button from '$lib/components/Button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import HourInput from './HourInput.svelte';
	import TrackingWidget from './TrackingWidget.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();

	function handleInput(field: string) {
		return (event: CustomEvent<string>) => {
			const value = Number(event.detail);

			if (!isNaN(value)) emit('update', { data: { [field]: value }, oldIssueData: issue });
		};
	}
</script>

<div class="section-title">Original Estimate (hours)</div>
<HourInput {issue} issueProperty="estimate" on:input={handleInput('estimate')} />

<div class="section-title">Time Tracking</div>
<Modal testid="modal:tracking" width={400}>
	<svelte:fragment slot="toggler" let:onClick>
		<div class="tracking-link" on:click={onClick} on:keydown>
			<TrackingWidget {issue} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content" let:onClose>
		<div class="content">
			<div class="title">Time tracking</div>
			<TrackingWidget {issue} />
			<div class="inputs">
				<div class="input">
					<div class="label">Time spent (hours)</div>
					<HourInput {issue} issueProperty="timeSpent" on:input={handleInput('timeSpent')} />
				</div>
				<div class="input">
					<div class="label">Time remaining (hours)</div>
					<HourInput
						{issue}
						issueProperty="timeRemaining"
						on:input={handleInput('timeRemaining')}
					/>
				</div>
			</div>
			<div class="actions">
				<Button variant="primary" on:click={onClose}>Done</Button>
			</div>
		</div>
	</svelte:fragment>
</Modal>

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.tracking-link {
		border-radius: 4px;
		padding: 4px 4px 2px 0;
		transition: background-color 0.1s;

		@include clickable;

		&:hover {
			background: $backgroundLight;
		}
	}

	.content {
		padding: 20px 25px 25px;

		.title {
			padding-bottom: 14px;

			@include font-size(20);
			@include font-family-medium;
		}

		.inputs {
			display: flex;
			margin: 20px -5px 30px;

			.input {
				margin: 0 5px;
				width: 50%;
			}

			.label {
				color: $textMedium;
				padding-bottom: 5px;

				@include font-size(13);
				@include font-family-medium;
			}
		}

		.actions {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
