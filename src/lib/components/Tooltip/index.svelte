<script lang="ts">
	import { fade } from 'svelte/transition';

	import outsideClick from '$lib/actions/outsideClick';
	import {
		calcPosition,
		type TooltipOffset,
		type TooltipPlacement
	} from './calculateTooltipPosition';

	let className = '';

	export { className as class };
	export let placement: TooltipPlacement = 'bottom';
	export let offset: TooltipOffset = { top: 0, left: 0 };
	export let width: number;

	let linkRef: HTMLButtonElement;
	let isOpen = false;
	let isActive = false;

	function toggleTooltip() {
		isOpen = !isOpen;
	}

	function tooltipAction(node: HTMLDivElement) {
		const body = document.querySelector('body');
		body?.appendChild(node);

		const setTooltipPosition = () => {
			const { top, left } = calcPosition(offset, placement, node, linkRef);
			node.style.top = `${top}px`;
			node.style.left = `${left}px`;
		};

		setTooltipPosition();
		window.addEventListener('resize', setTooltipPosition);
		window.addEventListener('scroll', setTooltipPosition);

		setTimeout(() => (isActive = true));

		return {
			destroy() {
				isActive = false;

				window.removeEventListener('resize', setTooltipPosition);
				window.removeEventListener('scroll', setTooltipPosition);
			}
		};
	}
</script>

{#if $$slots.toggler}
	<button class="tooltip-toggler" bind:this={linkRef} on:click={toggleTooltip}>
		<slot name="toggler" />
	</button>
{/if}

{#if isOpen && $$slots.content}
	<div
		use:tooltipAction
		use:outsideClick={[toggleTooltip, [linkRef]]}
		class={`tooltip  ${className} ${isActive ? 'active' : ''}`}
		style:width={`${width}px`}
	>
		<div transition:fade={{ duration: 200 }}>
			<slot name="content" onClose={toggleTooltip} />
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.tooltip {
		background: #fff;
		border-radius: 3px;
		opacity: 0;
		position: fixed;
		transition: opacity 0.2s ease-in-out;
		z-index: calc($z-modal + 1);

		@include hardwareAccelerate;
		@include boxShadowDropdown;

		&.active {
			opacity: 1;
		}
	}
</style>
