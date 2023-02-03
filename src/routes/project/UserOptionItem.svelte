<script lang="ts">
	import type { ProjectDataSafe } from '$lib/types';

	import Avatar from '$lib/components/Avatar.svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let user: ProjectDataSafe['User'][number];
	export let removeOptionValue: ((...args: any[]) => void) | undefined = undefined;
</script>

<button
	class="select-item"
	type="button"
	class:margin-bottom={!!removeOptionValue}
	on:click={() => removeOptionValue && removeOptionValue()}
>
	<Avatar size={20} avatarUrl={user.avatarUrl} name={user.name} />
	<div class="select-item-label">{user.name}</div>
	{#if removeOptionValue}
		<Icon type="close" top={2} />
	{/if}
</button>

<style lang="scss">
	.select-item {
		align-items: center;
		cursor: pointer;
		display: flex;
		margin-right: 15px;
		padding: 0;

		&.margin-bottom {
			margin-bottom: 5px;
		}
	}
</style>
