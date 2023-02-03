<script lang="ts">
	import { COLORS } from '$lib/constants/color';

	export let items: { label: string; link?: string }[] = [];
</script>

<div class="container" style:color={COLORS.textMedium}>
	{#each items as item, index (item)}
		{#if index !== 0}<span class="divider">/</span>{/if}{#if item.link}<a href={item.link}
				>{item.label}</a
			>{:else}{item.label}{/if}
	{/each}
</div>

<style lang="scss">
	@import '../styles/mixins';

	.container {
		@include font-size(15);

		.divider {
			margin: 0 10px;
			position: relative;
			top: 2px;

			@include font-size(18);
		}
	}
</style>
