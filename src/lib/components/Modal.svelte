<script lang="ts" context="module">
	function findLastModalChildElement() {
		let lastChild = document.body.lastElementChild;

		while (lastChild && !lastChild.classList.contains('modal-scroll-overlay')) {
			lastChild = lastChild.previousElementSibling;
		}

		return lastChild;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ModalVariant } from '$lib/constants/modal';

	import escapeKeyDown from '$lib/actions/escapeKeyDown';

	import Icon from '$lib/components/Icon.svelte';

	let className = '';

	export { className as class };
	export let variant: ModalVariant = 'center';
	export let width = 600;
	export let withCloseIcon: boolean = true;
	export let isOpen: boolean | undefined = undefined;
	export let testid: string = 'modal';

	const emit = createEventDispatcher();

	const isControlled = typeof isOpen === 'boolean';
	let modalRef: HTMLDivElement | null = null;
	let isActive = false;
	let isModalOpen = false;

	const maxWidth = `${width}px`;

	$: isModalOpen = isControlled ? !!isOpen : isModalOpen;

	function toggleModal(open?: Event | boolean) {
		if (isControlled) emit('close');
		else isModalOpen = typeof open === 'boolean' ? open : !isModalOpen;
	}

	function onEscape() {
		const lastElementChild = findLastModalChildElement();
		if (lastElementChild === modalRef) toggleModal(false);
	}

	function modalAction(node: HTMLDivElement) {
		const body = document.querySelector('body');

		body?.appendChild(node);
		isActive = true;

		return {
			destroy() {
				isActive = false;
			}
		};
	}
</script>

<svelte:body style:overflow={isModalOpen ? 'hidden' : 'visible'} use:escapeKeyDown={onEscape} />

{#if $$slots.toggler}
	<slot name="toggler" onClick={toggleModal} />
{/if}

{#if isModalOpen && $$slots.content}
	<div class="modal-scroll-overlay" use:modalAction bind:this={modalRef}>
		<div class={`clickable-overlay ${variant}`} on:click|self={toggleModal} on:keydown>
			<div class={`modal ${variant} ${className}`} data-testid={testid} style:max-width={maxWidth}>
				{#if withCloseIcon}
					<button class={`icon-button ${variant}`} on:click={toggleModal}>
						<Icon type="close" class={variant} size={25} top={2} />
					</button>
				{/if}
				<slot name="content" onClose={toggleModal} />
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../styles/variables';
	@import '../styles/mixins';

	:global(.modal-scroll-overlay) {
		left: 0;
		height: 100%;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: $z-modal;

		@include scrollableY;

		.clickable-overlay {
			background: rgba(9, 30, 66, 0.54);
			min-height: 100%;

			&.center {
				align-items: center;
				display: flex;
				justify-content: center;
				padding: 50px;
			}
		}

		.modal {
			background: #fff;
			display: inline-block;
			position: relative;
			width: 100%;

			&.center {
				border-radius: 3px;
				vertical-align: middle;

				@include boxShadowMedium;
			}

			&.aside {
				box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.15);
				min-height: 100vh;
			}

			.icon-button {
				color: $textMedium;
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				transition: all 0.1s;

				&.center {
					border-radius: 4px;
					padding: 3px 5px 0px 5px;
					right: 12px;
					top: 10px;

					&:hover {
						background: $backgroundLight;
					}
				}

				&.aside {
					background: #fff;
					border: 1px solid $borderLightest;
					border-radius: 3px;
					height: 50px;
					right: -30px;
					text-align: center;
					top: 10px;
					width: 50px;

					@include boxShadowMedium;

					&:hover {
						color: $primary;
					}
				}
			}
		}
	}
</style>
