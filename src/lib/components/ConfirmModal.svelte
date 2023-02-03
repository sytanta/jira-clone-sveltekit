<script lang="ts">
	import type { ButtonVariant } from '$lib/constants/buttonVariant';

	import { createEventDispatcher } from 'svelte';

	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';

	let className = '';

	export { className as class };
	export let isOpen: boolean = false;
	export let variant: Extract<ButtonVariant, 'primary' | 'danger'> = 'primary';
	export let title = 'Warning';
	export let message = 'Are you sure you want to continue with this action?';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let isWorking: boolean = false;

	const emit = createEventDispatcher();

	function handleConfirm() {
		emit('confirm');
	}

	function handleClose() {
		emit('close');
	}
</script>

<Modal
	class={`modal-confirm ${className}`}
	testid="modal:confirm"
	withCloseIcon={false}
	{isOpen}
	on:close={handleClose}
>
	<svelte:fragment slot="toggler" let:onClick>
		<slot name="toggler" {onClick} />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="title">{title}</div>
		{#if message}
			<p class="message">{message}</p>
		{/if}
		<div class="actions">
			<Button {variant} {isWorking} disabled={isWorking} on:click={handleConfirm}>
				{confirmText}
			</Button>
			<Button on:click={handleClose} disabled={isWorking}>
				{cancelText}
			</Button>
		</div>
	</svelte:fragment>
</Modal>

<style lang="scss">
	@import '../styles/mixins';

	:global(.modal-confirm) {
		padding: 35px 40px 40px;

		.title {
			line-height: 1.5;
			padding-bottom: 25px;

			@include font-family-medium;
			@include font-size(22);
		}

		.message {
			padding-bottom: 25px;
			white-space: pre-wrap;

			@include font-size(15);
		}

		.actions {
			display: flex;
			gap: 10px;
			padding-top: 6px;

			:global(.buttons) {
				margin-right: 10px;
			}
		}
	}
</style>
