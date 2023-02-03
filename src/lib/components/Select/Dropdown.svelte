<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import uniq from 'lodash/uniq';

	import type { SelectOption } from './types';

	import { COLORS } from '$lib/constants/color';
	import { KEY_CODES } from '$lib/constants/keyCode';
	import outsideClick from '$lib/actions/outsideClick';

	import Icon from '../Icon.svelte';

	type tKeyDownEvent = KeyboardEvent & {
		currentTarget: EventTarget & HTMLInputElement;
	};

	export let inputRef: HTMLInputElement | null = null;
	export let value: SelectOption['value'] | SelectOption['value'][];
	export let searchValue: string = '';
	export let width: number | undefined = undefined;
	export let isValueEmpty: boolean;
	export let options: SelectOption[] = [];
	export let isMulti: boolean = false;
	export let withClearValue = true;
	export let isOptionCreatable = false;

	const emit = createEventDispatcher();
	const activeOptionClass = 'jira-select-option-is-active';
	let optionsRef: HTMLDivElement | null = null;
	let showCreatableOption = false;
	let isCreatingOption = false;
	let hoveredOptionNode: HTMLButtonElement | null = null;

	const dropdownWidth = width ? `${width}px` : '100%';

	$: optionsFilteredBySearchValue = options.filter((option) =>
		option.label.toString().toLowerCase().includes(searchValue.toLowerCase())
	);
	$: filteredOptions = isMulti
		? removeSelectedOptionsMulti(optionsFilteredBySearchValue)
		: removeSelectedOptionsSingle(optionsFilteredBySearchValue);
	$: {
		const isSearchValueInOptions = options.map((option) => option.label).includes(searchValue);
		showCreatableOption = isOptionCreatable && !!searchValue && !isSearchValueInOptions;
	}

	function removeSelectedOptionsMulti(opts: SelectOption[]) {
		return opts.filter((option) => !(value as SelectOption['value'][]).includes(option.value));
	}
	function removeSelectedOptionsSingle(opts: SelectOption[]) {
		return opts.filter((option) => value !== option.value);
	}

	function handleInputKeyDown(event: tKeyDownEvent) {
		if (event.key === KEY_CODES.ESCAPE) {
			handleInputEscapeKeyDown(event);
		} else if (event.key === KEY_CODES.ENTER) {
			handleInputEnterKeyDown(event);
		} else if (event.key === KEY_CODES.ARROW_DOWN || event.key === KEY_CODES.ARROW_UP) {
			handleInputArrowUpOrDownKeyDown(event);
		}
	}

	function selectOptionValue(optionValue: SelectOption['value']) {
		const selectedValue = isMulti
			? uniq([...(value as SelectOption['value'][]), optionValue])
			: optionValue;
		value = searchValue;

		emit('change', selectedValue);
		emit('deactivate-dropdown');
	}

	function createOption(newOptionLabel: SelectOption['label']) {
		isCreatingOption = true;

		emit('create-option', {
			label: newOptionLabel,
			callback: (createdOptionValue: SelectOption['value']) => {
				isCreatingOption = false;
				selectOptionValue(createdOptionValue);
			}
		});
	}

	function clearOptionValues() {
		if (inputRef) {
			inputRef.value = '';
			inputRef?.focus();
		}

		emit('change', isMulti ? [] : null);
	}

	function handleInputEscapeKeyDown(event: tKeyDownEvent) {
		event.stopImmediatePropagation();
		emit('deactivate-dropdown');
	}

	function handleInputEnterKeyDown(event: tKeyDownEvent) {
		event.preventDefault();

		const activeOptionNode = getActiveOptionNode();
		if (!activeOptionNode) return;

		const optionValueToSelect = activeOptionNode.getAttribute('data-select-option-value');
		const optionLabelToCreate = activeOptionNode.getAttribute('data-create-option-label');

		if (optionValueToSelect) {
			selectOptionValue(optionValueToSelect);
		} else if (optionLabelToCreate) {
			createOption(optionLabelToCreate);
		}
	}

	function handleInputArrowUpOrDownKeyDown(event: tKeyDownEvent) {
		const activeNode = getActiveOptionNode(); // Active option element
		if (!activeNode) return;

		const container = optionsRef; // Options container element
		if (!container) return;

		const containerHeight = container.getBoundingClientRect().height;
		const activeHeight = activeNode.getBoundingClientRect().height;

		if (event.key === KEY_CODES.ARROW_DOWN) {
			if (container.lastElementChild === activeNode) {
				activeNode.classList.remove(activeOptionClass);
				container.firstElementChild?.classList.add(activeOptionClass);
				container.scrollTop = 0;
			} else {
				activeNode.classList.remove(activeOptionClass);
				activeNode.nextElementSibling?.classList.add(activeOptionClass);
				if (activeNode.offsetTop > container.scrollTop + containerHeight / 1.4) {
					container.scrollTop += activeHeight;
				}
			}
		} else if (event.key === KEY_CODES.ARROW_UP) {
			if (container.firstElementChild === activeNode) {
				activeNode.classList.remove(activeOptionClass);
				container.lastElementChild?.classList.add(activeOptionClass);
				container.scrollTop = container.scrollHeight;
			} else {
				activeNode.classList.remove(activeOptionClass);
				activeNode.previousElementSibling?.classList.add(activeOptionClass);
				if (activeNode.offsetTop < container.scrollTop + containerHeight / 2.4) {
					container.scrollTop -= activeHeight;
				}
			}
		}
	}

	function handleOptionMouseEnter(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		if (hoveredOptionNode) hoveredOptionNode.style.backgroundColor = 'unset';

		hoveredOptionNode = event.currentTarget;
		hoveredOptionNode.style.backgroundColor = COLORS.backgroundLightPrimary;
	}

	function getActiveOptionNode() {
		return optionsRef?.querySelector(`.${activeOptionClass}`) as HTMLDivElement;
	}
</script>

<div
	class="dropdown"
	style:width={dropdownWidth}
	use:outsideClick={() => emit('deactivate-dropdown')}
>
	<input
		class="dropdown-input"
		type="text"
		placeholder="Search"
		on:keydown={handleInputKeyDown}
		bind:value={searchValue}
		bind:this={inputRef}
	/>

	{#if !isValueEmpty && withClearValue}
		<Icon class="clear-icon" type="close" on:click={clearOptionValues} />
	{/if}

	<div class="options" bind:this={optionsRef}>
		{#each filteredOptions as option (option.value)}
			<button
				type="button"
				class="option"
				data-select-option-value={option.value}
				data-testid={`select-option:${option.label}`}
				on:mouseenter={handleOptionMouseEnter}
				on:click={() => selectOptionValue(option.value)}
			>
				<slot name="render-option-dropdown-item" {option}>{option.label}</slot>
			</button>
		{/each}

		{#if showCreatableOption}
			<button
				class="option"
				type="button"
				data-create-option-label={searchValue}
				on:mouseenter={handleOptionMouseEnter}
				on:click={() => createOption(searchValue)}
			>
				{isCreatingOption ? `Creating "${searchValue}"...` : `Create "${searchValue}"`}
			</button>
		{/if}
	</div>

	{#if !filteredOptions.length}
		<div class="options-empty">No results</div>
	{/if}
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.dropdown {
		background: #fff;
		border-radius: 0 0 4px 4px;
		left: 0;
		position: absolute;
		top: 100%;
		z-index: $z-dropdown;

		@include boxShadowDropdown;

		.dropdown-input {
			border: none;
			background: none;
			color: $textDarkest;
			padding: 10px 14px 8px;
			width: 100%;

			&:focus {
				outline: none;
			}
		}

		.options {
			max-height: 200px;

			@include scrollableY;
			@include customScrollbar();

			.option {
				cursor: pointer;
				padding: 8px 14px;
				text-align: left;
				word-break: break-word;
				width: 100%;

				&:last-of-type {
					margin-bottom: 8px;
				}

				&.active {
					background-color: $backgroundLightPrimary;
				}
			}
		}

		:global(.clear-icon) {
			color: $textMedium;
			font-size: 16px;
			padding: 5px;
			position: absolute;
			right: 7px;
			top: 4px;

			@include clickable;
		}

		.options-empty {
			color: $textLight;
			padding: 5px 15px 15px;
		}
	}
</style>
