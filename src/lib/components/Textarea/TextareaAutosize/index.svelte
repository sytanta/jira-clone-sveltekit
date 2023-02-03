<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import calculateNodeHeight from './calculateNodeHeight';
	import getSizingData, { type SizingData } from './getSizingData';

	export let textareaRef: HTMLTextAreaElement | null = null;
	export let value: string | number | null | undefined = '';
	export let placeholder: string = '';
	export let cacheMeasurements = false;
	export let minRows: number | undefined = undefined;
	export let maxRows: number | undefined = undefined;

	const emit = createEventDispatcher();
	let heightRef = 0;
	let measurementsCacheRef: SizingData;

	onMount(resizeTextarea);

	function resizeTextarea() {
		const node = textareaRef!;
		const nodeSizingData =
			cacheMeasurements && measurementsCacheRef ? measurementsCacheRef : getSizingData(node);

		if (!nodeSizingData) {
			return;
		}

		if (cacheMeasurements) measurementsCacheRef = nodeSizingData;

		const [height, rowHeight] = calculateNodeHeight(
			nodeSizingData,
			node.value || node.placeholder || 'x',
			minRows,
			maxRows
		);

		if (heightRef !== height) {
			heightRef = height;

			node.style.setProperty('height', `${height}px`, 'important');
			emit('height-change', { height, rowHeight });
		}
	}

	function onChange(
		event: Event & {
			currentTarget: EventTarget & HTMLTextAreaElement;
		}
	) {
		emit('input', (event.currentTarget as HTMLTextAreaElement).value);
	}
</script>

<svelte:window on:resize={resizeTextarea} />

<textarea
	bind:value
	bind:this={textareaRef}
	on:input={resizeTextarea}
	on:input={onChange}
	on:blur
	on:keydown
	{placeholder}
/>
