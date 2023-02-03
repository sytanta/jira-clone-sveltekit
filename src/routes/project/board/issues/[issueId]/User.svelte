<script lang="ts">
	import type { ProjectDataSafe } from '$lib/types';

	import Avatar from '$lib/components/Avatar.svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let user: ProjectDataSafe['User'][number] | undefined;
	export let isSelectedValue = false;
	export let removeOptionValue: ((...args: any[]) => void) | undefined = undefined;
</script>

{#if user}
	<div
		class="user"
		class:selected={isSelectedValue}
		class:with-bottom-margin={!!removeOptionValue}
		on:click={() => removeOptionValue && removeOptionValue()}
		on:keydown
	>
		<Avatar avatarUrl={user.avatarUrl} name={user.name} size={24} />
		<div class="username">{user.name}</div>

		{#if removeOptionValue}<Icon type="close" top={1} />{/if}
	</div>
{/if}

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.user {
		align-items: center;
		display: flex;

		@include clickable;

		&.selected {
			background: $backgroundLight;
			border-radius: 4px;
			margin: 0 10px 0 0;
			padding: 4px 8px;
			transition: background-color 0.1s;

			&.with-bottom-margin {
				margin: 0 10px 5px 0;
			}

			&:hover {
				background: $backgroundMedium;
			}
		}

		.username {
			padding: 0 3px 0 8px;

			@include font-size(14.5);
		}
	}
</style>
