<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { IconCode } from '$lib/constants/icon';
	import type { ButtonVariant } from '$lib/constants/buttonVariant';

	import { COLORS } from '$lib/constants/color';

	import Icon from '$lib/components/Icon.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	let className = '';

	export { className as class };
	export let buttonRef: HTMLButtonElement | null = null;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let variant: ButtonVariant = 'secondary';
	export let icon: IconCode | undefined = undefined;
	export let iconSize = 18;
	export let disabled = false;
	export let isWorking = false;
	export let isActive = false;

	const emit = createEventDispatcher();

	const iconColor = ['secondary', 'empty'].includes(variant) ? COLORS.textDark : '#fff';

	function handleClick() {
		if (!disabled && !isWorking) {
			emit('click');
		}
	}
</script>

<button
	{type}
	class={`button ${!$$slots.default ? 'icon-only' : ''} ${variant} ${
		isActive ? 'active' : ''
	} ${className}`}
	on:click={handleClick}
	bind:this={buttonRef}
	disabled={disabled || isWorking}
>
	{#if isWorking}
		<Spinner size={26} color={iconColor} class="spinner" />
	{/if}
	{#if !isWorking && icon}
		<Icon type={icon} size={iconSize} color={iconColor} />
	{:else if !isWorking && $$slots.icon}
		<slot name="icon" />
	{/if}
	{#if $$slots.default}
		<div style:padding-left={`${isWorking || icon || $$slots.icon ? 7 : 0}px`}><slot /></div>
	{/if}
</button>

<style lang="scss">
	@use 'sass:color';
	@import '../styles/variables';
	@import '../styles/mixins';

	@mixin colored {
		color: #fff;

		@include font-family-medium;

		// background: ${props => color[props.variant]};
		&.primary {
			background-color: $primary;
		}
		&.success {
			background-color: $success;
		}
		&.danger {
			background-color: $danger;
		}
		&.secondary {
			background-color: $secondary;
		}
		&.warning {
			background-color: $warning;
		}
		&.empty {
			background-color: transparent;
		}

		&:not(:disabled) {
			&:hover {
				//   background: ${props => mixin.lighten(color[props.variant], 0.15)};
				&.primary {
					background-color: color.scale(
						$primary,
						$lightness: 15%
					); // hsl(215.89999999999998, 100%, 46%);
				}
				&.success {
					background-color: color.scale(
						$success,
						$lightness: 15%
					); // hsl(158.70000000000005, 84.9%, 32.9%);
				}
				&.danger {
					background-color: color.scale($danger, $lightness: 15%); // hsl(0, 73.3%, 64.3%);
				}
				&.secondary {
					background-color: color.scale($secondary, $lightness: 15%); // hsl(220, 15.8%, 100%);
				}
				&.warning {
					background-color: color.scale(
						$warning,
						$lightness: 15%
					); // hsl(34.89999999999998, 94%, 62.2%);
				}
				&.empty {
					background-color: color.scale($empty, $lightness: 15%); // transparent;
				}
			}
			&:active {
				//   background: ${props => mixin.darken(color[props.variant], 0.1)};
				&.primary {
					background-color: color.scale(
						$primary,
						$lightness: -10%
					); // hsl(215.89999999999998, 100%, 44%);
				}
				&.success {
					background-color: color.scale(
						$success,
						$lightness: -10%
					); // hsl(158.70000000000005, 84.9%, 31.5%);
				}
				&.danger {
					background-color: color.scale($danger, $lightness: -10%); // hsl(0, 73.3%, 61.5%);
				}
				&.secondary {
					background-color: color.scale($secondary, $lightness: -10%); // hsl(220, 15.8%, 100%);
				}
				&.warning {
					background-color: color.scale(
						$warning,
						$lightness: -10%
					); // hsl(34.89999999999998, 94%, 59.5%);
				}
				&.empty {
					background-color: color.scale($empty, $lightness: -10%); // transparent;
				}
			}
			&.active {
				// background: ${mixin.darken(color[props.variant], 0.1)} !important;
				&.primary {
					background-color: color.scale(
						$primary,
						$lightness: -10%
					) !important; // hsl(215.89999999999998, 100%, 36%) !important;
				}
				&.success {
					background-color: color.scale(
						$success,
						$lightness: -10%
					) !important; // hsl(158.70000000000005, 84.9%, 25.8%) !important;
				}
				&.danger {
					background-color: color.scale(
						$danger,
						$lightness: -10%
					) !important; // hsl(0, 73.3%, 50.3%) !important;
				}
				&.secondary {
					background-color: color.scale(
						$secondary,
						$lightness: -10%
					) !important; // hsl(220, 15.8%, 86.6%) !important;
				}
				&.warning {
					background-color: color.scale(
						$warning,
						$lightness: -10%
					) !important; // hsl(34.89999999999998, 94%, 48.7%) !important;
				}
				&.empty {
					background-color: color.scale(
						$empty,
						$lightness: -10%
					) !important; // transparent !important;
				}
			}
		}
	}

	@mixin secondaryAndEmptyShared {
		color: $textDark;

		@include font-family-regular;

		&:not(:disabled) {
			&:hover {
				background: $backgroundLight;
			}

			&:active {
				color: $primary;
				background: $backgroundLightPrimary;
			}

			&.active {
				background: $backgroundLightPrimary !important;
				color: $primary;
			}
		}
	}

	@mixin buttonVariants($variant) {
		@if $variant == primary or $variant == success or $variant == danger {
			@include colored;
		} @else if $variant == secondary {
			background: $secondary;
			@include secondaryAndEmptyShared;
		} @else if $variant == empty {
			background: #fff;
			@include secondaryAndEmptyShared;
		}
	}

	.button {
		align-items: center;
		appearance: none;
		border-radius: 3px;
		display: inline-flex;
		justify-content: center;
		height: 32px;
		line-height: 1;
		padding: 0 12px;
		transition: all 0.1s;
		vertical-align: middle;
		white-space: nowrap;

		@include font-size(14.5);
		@include clickable;

		&.primary,
		&.success,
		&.danger {
			@include buttonVariants(primary);
		}
		&.secondary {
			@include buttonVariants(secondary);
		}
		&.empty {
			@include buttonVariants(empty);
		}

		&.icon-only {
			padding: 0 9px;
		}

		&:disabled {
			opacity: 0.6;
			cursor: default;
		}

		:global(.spinner) {
			position: relative;
			top: 1px;
		}
	}
</style>
