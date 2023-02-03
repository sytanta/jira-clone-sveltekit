<script lang="ts">
	import type { IconCode } from '$lib/constants/icon';

	let className: string = '';

	export { className as class };
	export let color: string | undefined = undefined;
	export let type: IconCode | undefined = undefined;
	export let size: number = 16;
	export let left: number | undefined = undefined;
	export let top: number | undefined = undefined;

	const fontSize = `${size}px`;
	const transform =
		left != undefined || top != undefined ? `translate(${left || 0}px, ${top || 0}px)` : '';
</script>

<i
	class={`icon icon-${type} ${className}`}
	data-testid={`icon:${type}`}
	style:color
	style:font-size={fontSize}
	style:transform
/>

<style lang="scss">
	.icon {
		display: inline-block;

		&:before {
			font-family: 'jira' !important;
			font-style: normal;
			font-variant: normal;
			font-weight: normal;
			line-height: 1;
			text-transform: none;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}
	}
</style>
