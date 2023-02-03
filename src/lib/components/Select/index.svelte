<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { SelectOption } from './types';

	import { KEY_CODES } from '$lib/constants/keyCode';

	import Icon from '$lib/components/Icon.svelte';
	import Dropdown from './Dropdown.svelte';

	let className = '';

	export { className as class };
	export let id: string = '';
	export let name: string = '';
	export let value: SelectOption['value'] | SelectOption['value'][];
	export let options: SelectOption[];
	export let placeholder = 'Select';
	export let variant: 'normal' | 'empty' = 'normal';
	export let width: number | undefined = undefined;
	export let invalid = false;
	export let isMulti = false;
	export let withClearValue = true;

	const emit = createEventDispatcher();
	let isDropdownOpen = false;
	let searchValue = '';

	let containerRef: HTMLDivElement | null = null;
	let selectRef: HTMLSelectElement | null = null;
	let inputRef: HTMLInputElement | null = null;

	$: if (isMulti && !Array.isArray(value)) value = [value];
	$: isValueEmpty = isMulti ? Array.isArray(value) && !value.length : !getOption(value);
	$: isInvalid = !!invalid;

	function getOption(optionValue: SelectOption['value']): SelectOption | undefined {
		return options.find((option) => option.value === optionValue);
	}
	function getOptionLabel(optionValue: SelectOption['value']) {
		return (getOption(optionValue) || { label: '', value: null }).label;
	}

	function activateDropdown() {
		if (isDropdownOpen) {
			if (inputRef) inputRef.focus();
		} else {
			isDropdownOpen = true;
		}
	}

	function deactivateDropdown() {
		isDropdownOpen = false;
		searchValue = '';
		if (selectRef) selectRef.focus();
	}

	function handleFocusedSelectKeydown(
		event: KeyboardEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		if (isDropdownOpen) return;

		if (event.key === KEY_CODES.ENTER) {
			event.preventDefault();
		}
		if (event.key !== KEY_CODES.ESCAPE && event.key !== KEY_CODES.TAB && !event.shiftKey) {
			isDropdownOpen = true;
		}
	}

	function preserveValueType(newValue: SelectOption['value']) {
		const areOptionValuesNumbers = options.some((option) => typeof option.value === 'number');

		if (areOptionValuesNumbers) {
			if (isMulti) {
				return (newValue as any[]).map(Number);
			}
			if (newValue) {
				return Number(newValue);
			}
		}

		return newValue;
	}

	function handleChange(
		event: CustomEvent<SelectOption['value']> | { detail: SelectOption['value'] }
	) {
		const preservedTypeValue = preserveValueType(event.detail);

		value = preservedTypeValue;
		emit('change', preservedTypeValue);
	}

	function removeOptionValue(optionValue: SelectOption['value']) {
		handleChange({ detail: (value as any[]).filter((val) => val !== optionValue) });
	}
</script>

<div
	class={`select ${variant} ${isInvalid ? 'invalid' : ''} ${className}`}
	bind:this={containerRef}
	tabIndex="0"
	on:keydown={handleFocusedSelectKeydown}
>
	<input {id} type="hidden" {name} bind:value />
	<button
		type="button"
		class={`value-container ${variant}`}
		data-testid={name ? `select:${name}` : 'select'}
		on:click={activateDropdown}
	>
		{#if isValueEmpty}
			<div class="placeholder">{placeholder}</div>
		{/if}

		{#if !isValueEmpty && !isMulti && $$slots['render-option-value-single']}
			<slot name="render-option-value-single" optionValue={value} />
		{:else}
			{getOptionLabel(value)}
		{/if}

		{#if !isValueEmpty && isMulti && Array.isArray(value)}
			<div class={`value-multi ${variant}`}>
				{#each value as optionValue (optionValue)}
					<slot
						name="render-option-value-multi"
						{optionValue}
						removeOptionValue={() => removeOptionValue(optionValue)}
					>
						<button
							class="value-multi-item"
							type="button"
							on:click|stopPropagation={() => removeOptionValue(optionValue)}
						>
							{getOptionLabel(optionValue)}
							<Icon type="close" size={14} />
						</button>
					</slot>
				{/each}
				<div class="add-more">
					<Icon type="plus" />
					Add more
				</div>
			</div>
		{/if}

		{#if (!isMulti || isValueEmpty) && variant !== 'empty'}
			<Icon class="chevron-icon" type="chevron-down" size={18} top={1} />
		{/if}
	</button>

	{#if isDropdownOpen}
		<Dropdown
			bind:value
			bind:searchValue
			bind:inputRef
			{width}
			{isValueEmpty}
			{options}
			{isMulti}
			{withClearValue}
			on:change={handleChange}
			on:create-option
			on:deactivate-dropdown={deactivateDropdown}
		>
			<svelte:fragment slot="render-option-dropdown-item" let:option>
				<slot name="render-option-dropdown-item" {option}>{option.label}</slot>
			</svelte:fragment>
		</Dropdown>
	{/if}
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.select {
		border-radius: 4px;
		cursor: pointer;
		position: relative;

		@include font-size(14);

		&.empty {
			display: inline-block;
		}
		&.normal {
			background: $backgroundLightest;
			border: 1px solid $borderLightest;
			transition: background-color 0.1s;
			width: 100%;

			&:hover {
				background: $backgroundLight;
			}
		}

		&:focus {
			outline: none;

			&.normal {
				background: #fff;
				border: 1px solid $borderInputFocus;
				box-shadow: 0 0 0 1px $borderInputFocus;
			}
		}

		&.invalid,
		&:invalid {
			&,
			&:focus {
				border: 1px solid $danger;
				box-shadow: none;
			}
		}

		.value-container {
			align-items: center;
			cursor: pointer;
			display: flex;
			padding: 0;
			width: 100%;

			@include font-size(14);

			&.normal {
				min-height: 32px;
				padding: 5px 5px 5px 10px;
			}

			.placeholder {
				color: $textLight;
			}

			.value-multi {
				align-items: center;
				display: flex;
				flex-wrap: wrap;

				&.normal {
					padding-top: 5px;
				}

				.value-multi-item {
					margin: 0 5px 5px 0;

					@include tag;
				}

				.add-more {
					display: inline-block;
					margin-bottom: 3px;
					padding: 3px 0;

					@include font-size(12.5);
					@include link;

					:global(i) {
						font-size: 14px;
						margin-right: 3px;
						vertical-align: middle;
					}
				}
			}

			:global(.chevron-icon) {
				color: $textMedium;
				margin-left: auto;
			}
		}
	}
</style>
