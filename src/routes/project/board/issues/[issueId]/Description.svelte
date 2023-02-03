<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { getTextContentsFromHtmlString } from '$lib/utils/browser';

	import Button from '$lib/components/Button.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import TextEditedContent from '$lib/components/TextEditedContent.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	let isEditing = false;

	$: description = issue.description;
	$: isDescriptionEmpty = getTextContentsFromHtmlString(description).trim().length === 0;

	function setDescription(event: CustomEvent<string>) {
		description = event.detail;
	}

	function handleUpdate() {
		emit('update', { data: { description: description }, oldIssueData: issue });
		isEditing = false;
	}
</script>

<div class="title">Description</div>
{#if isEditing}
	<TextEditor placeholder="Describe the issue" value={description} on:input={setDescription} />
	<div class="actions">
		<Button variant="primary" on:click={handleUpdate}>Save</Button>
		<Button variant="empty" on:click={() => (isEditing = false)}>Cancel</Button>
	</div>
{:else if isDescriptionEmpty}
	<div class="empty-label" on:click={() => (isEditing = true)} on:keydown>Add a description...</div>
{:else}
	<TextEditedContent content={description} on:click={() => (isEditing = true)} />
{/if}

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.title {
		padding: 20px 0 6px;

		@include font-size(15);
		@include font-family-medium;
	}

	.actions {
		display: flex;
		padding-top: 12px;

		:global(.button) {
			margin-right: 6px;
		}
	}

	.empty-label {
		border-radius: 3px;
		color: $textMedium;
		margin-left: -7px;
		padding: 7px;
		transition: background-color 0.1s;

		@include font-size(15);
		@include clickable;

		&:hover {
			background-color: $backgroundLight;
		}
	}
</style>
