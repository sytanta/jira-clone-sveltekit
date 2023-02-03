<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Textarea from '$lib/components/Textarea/index.svelte';
	import Button from '$lib/components/Button.svelte';

	export let value: string = '';
	export let isWorking: boolean = false;

	const emit = createEventDispatcher();

	$: if (value && value.length > 50000) value = value?.slice(0, 50000);

	function onSubmit() {
		emit('submit');
	}

	function onCancel() {
		emit('cancel');
	}
</script>

<Textarea placeholder="Add a comment..." bind:value />
<div class="actions">
	<Button class="form-button" variant="primary" {isWorking} disabled={!value} on:click={onSubmit}>
		Save
	</Button>
	<Button class="form-button" variant="empty" on:click={onCancel}>Cancel</Button>
</div>

<style lang="scss">
	.actions {
		display: flex;
		padding-top: 10px;

		:global(.form-button) {
			margin-right: 6px;
		}
	}
</style>
