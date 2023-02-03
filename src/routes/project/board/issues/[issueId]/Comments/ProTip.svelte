<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { KEY_CODES } from '$lib/constants/keyCode';
	import { isFocusedElementEditable } from '$lib/utils/browser';

	const emit = createEventDispatcher();

	function handleKeydown(event: KeyboardEvent) {
		if (!isFocusedElementEditable() && event.key === KEY_CODES.M) {
			event.preventDefault();
			emit('m');
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="tip">
	<strong>Pro tip:</strong>press<span class="tip-letter">M</span>to comment
</div>

<style lang="scss">
	@import '../../../../../../lib/styles/variables';
	@import '../../../../../../lib/styles/mixins';

	.tip {
		align-items: center;
		color: $textMedium;
		display: flex;
		padding-top: 8px;

		@include font-size(13);

		strong {
			padding-right: 4px;
		}

		.tip-letter {
			background-color: $backgroundMedium;
			border-radius: 2px;
			color: $textDarkest;
			display: inline-block;
			margin: 0 4px;
			padding: 0 4px;
			position: relative;
			top: 1px;

			@include font-size(12);
			@include font-family-bold;
		}
	}
</style>
