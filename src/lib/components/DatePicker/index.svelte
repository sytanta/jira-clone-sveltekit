<script lang="ts">
	import outsideClick from '$lib/actions/outsideClick';
	import { formatDate, formatDateTime } from '$lib/utils/dateTime';

	import Input from '$lib/components/Input.svelte';
	import DateSection from './DateSection.svelte';
	import TimeSection from './TimeSection.svelte';

	let className = '';

	export { className as class };
	export let withTime = true;
	export let value: string;

	let isDropdownOpen = false;
	let containerRef: HTMLDivElement | null = null;
	let inputValue = value;

	$: {
		if (!value) inputValue = '';
		inputValue = withTime ? formatDateTime(value) : formatDate(value);
	}

	function onToggleDropdown(event: CustomEvent<boolean>) {
		isDropdownOpen = event.detail;
	}
</script>

<div class="date-picker" bind:this={containerRef} use:outsideClick={() => (isDropdownOpen = false)}>
	<Input
		class={className}
		icon="calendar"
		autocomplete="off"
		value={inputValue}
		on:focus={() => (isDropdownOpen = true)}
		on:input={() => (inputValue = inputValue)}
	/>
	{#if isDropdownOpen}
		<div class={`drop-down ${withTime ? 'with-time' : ''}`}>
			<DateSection {withTime} {value} on:change on:toggle-dropdown={onToggleDropdown} />
			{#if withTime}
				<TimeSection {value} on:change on:toggle-dropdown={onToggleDropdown} />
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.date-picker {
		position: relative;

		.drop-down {
			background: #fff;
			border-radius: 3px;
			position: absolute;
			top: 130%;
			right: 0;
			width: 270px;
			z-index: $z-dropdown;

			@include boxShadowDropdown;

			&.with-time {
				padding-right: 90px;
				width: 360px;
			}
		}
	}
</style>
