<script lang="ts">
	import TextareaAutoresize from './TextareaAutosize/index.svelte';

	let className = '';

	export { className as class };
	export let textareaRef: HTMLTextAreaElement | null = null;
	export let invalid = false;
	export let minRows = 2;
	export let value: string | number | null | undefined = '';
	export let placeholder: string = '';

	$: isInvalid = !!invalid;
</script>

<div class={`textarea-container ${className} ${isInvalid ? 'invalid' : ''}`}>
	<TextareaAutoresize
		bind:textareaRef
		bind:value
		on:input
		on:blur
		on:keydown
		{minRows}
		{placeholder}
	/>
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.textarea-container {
		display: inline-block;
		width: 100%;

		:global(textarea) {
			background-color: $backgroundLightest;
			border: 1px solid $borderLightest;
			border-radius: 3px;
			color: $textDarkest;
			overflow-y: hidden;
			padding: 8px 12px 9px;
			width: 100%;

			@include font-family-regular;
			@include font-size(15);

			&:focus {
				background: #fff;
				border: 1px solid $borderInputFocus;
				box-shadow: 0 0 0 1px $borderInputFocus;
			}

			&:invalid,
			&.invalid {
				&,
				&:focus {
					border: 1px solid $danger;
				}
			}
		}
	}
</style>
