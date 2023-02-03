<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IconCode } from '$lib/constants/icon';

	import Icon from '$lib/components/Icon.svelte';

	let className = '';

	export { className as class };
	export let id: string = '';
	export let name: string = '';
	export let inputRef: HTMLInputElement | null = null;
	export let value: string | number | null | undefined = '';
	export let autocomplete: 'off' | 'on' = 'off';
	export let placeholder: string = '';
	export let icon: IconCode | undefined = undefined;
	export let filter: RegExp | undefined = undefined;
	export let invalid: boolean = false;

	const emit = createEventDispatcher();
	const paddingLeft = !!icon ? '32px' : '';

	$: isInvalid = !!invalid;

	function handleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		if (!filter || filter.test(value)) {
			emit('input', value);
		}
	}
</script>

<div class={`input ${className}`}>
	{#if !!icon}
		<Icon type={icon} size={15} />
	{/if}
	<input
		class:invalid={isInvalid}
		{id}
		{name}
		bind:value
		on:input={handleInput}
		on:focus
		bind:this={inputRef}
		style:padding-left={paddingLeft}
		{autocomplete}
		{placeholder}
	/>
</div>

<style lang="scss">
	@import '../styles/variables';
	@import '../styles/mixins';

	.input {
		display: inline-block;
		height: 32px;
		position: relative;
		width: 100%;

		:global(.icon) {
			color: $textMedium;
			left: 8px;
			pointer-events: none;
			position: absolute;
			top: 8px;
		}

		input {
			border: 1px solid $borderLightest;
			border-radius: 3px;
			color: $textDarkest;
			background: $backgroundLightest;
			height: 100%;
			padding: 0 7px;
			transition: background-color 0.1s;
			width: 100%;

			@include font-family-regular;
			@include font-size(15);

			&:hover {
				background-color: $backgroundLight;
			}
			&:focus {
				background-color: #fff;
				border: 1px solid $borderInputFocus;
				box-shadow: 0 0 0 1px $borderInputFocus;
			}

			&:invalid,
			&:invalid:focus,
			&.invalid,
			&.invalid:focus {
				border: 1px solid $danger;
				box-shadow: none;
			}
		}
	}
</style>
