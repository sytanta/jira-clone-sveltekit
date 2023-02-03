<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IssueDataSafe } from '$lib/types';

	import { KEY_CODES } from '$lib/constants/keyCode';
	import { issueTitleSchema } from '$lib/utils/zod/schemas-form/issue';
	import { validateSingleField } from '$lib/utils/zod/validateData';

	import Textarea from '$lib/components/Textarea/index.svelte';

	export let issue: IssueDataSafe;

	const emit = createEventDispatcher();
	let textareaRef: HTMLTextAreaElement | null = null;
	let error: string | null | undefined;

	function handleTitleChange() {
		const validation = validateSingleField(textareaRef?.value, issueTitleSchema);

		if (!validation.success) return (error = validation.error);
		error = null;

		emit('update', { data: { title: validation.data }, currentIssueData: issue });
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === KEY_CODES.ENTER) {
			const target = event.target as HTMLTextAreaElement;
			target.blur();
		}
	}
</script>

<Textarea
	minRows={1}
	placeholder="Short summary"
	value={issue.title}
	class="title-textarea"
	bind:textareaRef
	on:blur={handleTitleChange}
	on:keydown={handleKeydown}
/>
{#if error}<div class="error-text">{error}</div>{/if}

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	:global(.textarea-container.title-textarea) {
		height: 44px;
		margin: 18px 0 0 -8px;

		:global(textarea) {
			background-color: #fff;
			border: 1px solid transparent;
			box-shadow: 0 0 0 1px transparent;
			line-height: 1.28;
			padding: 7px 7px 8px;
			resize: none;
			transition: background-color 0.1s;

			@include font-size(24);
			@include font-family-medium;

			&:hover:not(:focus) {
				background: $backgroundLight;
			}
		}
	}

	.error-text {
		color: $danger;
		padding-top: 4px;

		@include font-size(13);
		@include font-family-medium;
	}
</style>
