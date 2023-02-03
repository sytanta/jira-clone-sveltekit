<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import type { SubmitFunction } from '@sveltejs/kit';
	import type { FormErrors, ZodSchema } from '$lib/types';

	import { enhance } from '$app/forms';

	import { validateFormData } from '$lib/utils/zod/validateData';

	import { invalidateAll } from '$app/navigation';

	let className: string = '';

	export { className as class };
	export let action = '/';
	export let schema: ZodSchema;
	export let noValidate: boolean = true;

	const emit = createEventDispatcher();
	const errors = writable<FormErrors>(null);

	let isLoading = false;

	setContext('form-errors', errors);

	const onSubmit: SubmitFunction = async ({ data, cancel }) => {
		isLoading = true;

		const validation = validateFormData(data, schema);

		if (!validation.success) {
			cancel();

			errors.set(validation.errors);
			emit('validate-error', errors);

			isLoading = false;
		}

		return async ({ result }) => {
			switch (result.type) {
				case 'error':
					isLoading = false;
					return emit(`submit-${result.type}`, result);

				case 'failure':
					isLoading = false;
					return emit(`submit-${result.type}`, result);

				case 'success':
				default:
					await invalidateAll();

					isLoading = false;
					emit('success');
			}
		};
	};
</script>

<form class={className} {action} method="post" use:enhance={onSubmit} novalidate={noValidate}>
	<fieldset class="fieldset" disabled={isLoading}>
		<slot {isLoading} />
	</fieldset>
</form>

<style lang="scss">
	.fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}
</style>
