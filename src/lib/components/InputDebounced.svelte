<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import debounce from 'lodash/debounce';

	import type { IconCode } from '$lib/constants/icon';

	import Input from '$lib/components/Input.svelte';

	let className = 'input-debounce';

	export { className as class };
	export let value: string | number | null | undefined = '';
	export let placeholder: string = '';
	export let filter: RegExp | undefined = undefined;
	export let icon: IconCode | undefined = undefined;

	const emit = createEventDispatcher();

	const handleInput = debounce((e: CustomEvent<string>) => {
		value = e.detail;
		emit('input', value);
	}, 500);
</script>

<Input {value} class={className} {icon} on:input={handleInput} {filter} {placeholder} />
