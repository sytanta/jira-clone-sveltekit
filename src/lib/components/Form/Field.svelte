<script lang="ts">
	import { getContext } from 'svelte';
	import { uniqueId } from 'lodash';

	import type { Writable } from 'svelte/store';
	import type { FormErrors } from '$lib/types';

	let className: string = '';

	export { className as class };
	export let label: string = '';
	export let name: string = '';
	export let tip: string | undefined = undefined;

	const errorsContext = getContext<Writable<FormErrors>>('form-errors');
	const fieldId = uniqueId('form-field-');

	let error: string[] | null | undefined;
	$: {
		error = $errorsContext && $errorsContext[name];
	}
</script>

<div class={`field ${className}`} data-testid={name ? `form-field:${name}` : 'form-field'}>
	{#if label}
		<label class="label" for={fieldId}>{label}</label>
	{/if}
	<slot id={fieldId} fieldName={name} invalid={!!error} />
	{#if tip}
		<div class="tip">{tip}</div>
	{/if}
	{#if !!error && error.length}
		<div class="error">{error[0]}</div>
	{/if}
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.field {
		margin-top: 20px;

		.label {
			color: $textMedium;
			display: block;
			padding-bottom: 5px;

			@include font-size(13);
			@include font-family-medium;
		}

		.tip {
			color: $textMedium;
			padding-top: 6px;

			@include font-size(12.5);
		}

		.error {
			color: $danger;
			line-height: 1;
			margin-top: 6px;

			@include font-size(12.5);
			@include font-family-medium;
		}
	}
</style>
