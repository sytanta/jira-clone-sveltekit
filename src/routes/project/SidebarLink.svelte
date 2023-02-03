<script lang="ts">
	import { page } from '$app/stores';

	import Icon from '$lib/components/Icon.svelte';

	import type { IconCode } from '$lib/constants/icon';

	export let path: string | undefined = undefined;
	export let text: String;
	export let iconType: IconCode;

	const isImplemented = !!path;

	$: isActive = $page.url.pathname === path;
</script>

{#if isImplemented}
	<a class="link-item link" class:active={isActive} href={path}>
		<Icon type={iconType} size={20} />
		<div class="link-text">{text}</div>
	</a>
{:else}
	<div class="link-item" class:active={isActive}>
		<Icon type={iconType} size={20} />
		<div class="link-text">{text}</div>
		<div class="not-implemented">Not implemented</div>
	</div>
{/if}

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.link-item {
		display: flex;
		border-radius: 3px;
		padding: 8px 12px;
		position: relative;

		@include clickable;

		&.link:hover {
			background: $backgroundLight;
		}
		&:not(.link) {
			cursor: not-allowed;
		}
		&.active {
			background: $backgroundLight;
			color: $primary;

			:global(i) {
				color: $primary;
			}
		}

		:global(i) {
			margin-right: 15px;
		}

		.link-text {
			padding-top: 2px;

			@include font-size(14.7);
		}

		.not-implemented {
			background: $backgroundMedium;
			border-radius: 3px;
			color: $textDark;
			display: inline-block;
			left: 40px;
			opacity: 0;
			padding: 5px 0 5px 8px;
			position: absolute;
			text-transform: uppercase;
			top: 7px;
			width: 140px;

			@include font-size(11.5);
			@include font-family-bold;
		}

		&:hover .not-implemented {
			opacity: 1;
		}
	}
</style>
