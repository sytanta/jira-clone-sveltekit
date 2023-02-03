<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { page } from '$app/stores';

	import Avatar from '$lib/components/Avatar.svelte';
	import Form from './Form.svelte';
	import ProTip from './ProTip.svelte';

	export let issueId: string;

	const emit = createEventDispatcher();
	let isFormOpen = false;
	let isCreating = false;
	let body = '';

	$: user = $page.data?.user;

	async function handleCreateComment() {
		const content = body.trim();
		if (!content) return;

		isCreating = true;

		const res = await fetch('/api/comment', {
			method: 'POST',
			body: JSON.stringify({ issueId, content })
		});

		if (res.ok) {
			emit('update', {
				callback: () => {
					body = '';
					isCreating = false;
					isFormOpen = false;
				}
			});
		}
	}
</script>

<div class="create">
	{#if user}
		<Avatar class="user-avatar" name={user.name} avatarUrl={user.avatarUrl} />
	{/if}
	<div class="right">
		{#if isFormOpen}
			<Form
				bind:value={body}
				isWorking={isCreating}
				on:submit={handleCreateComment}
				on:cancel={() => (isFormOpen = false)}
			/>
		{:else}
			<button class="fake-textarea" on:click={() => (isFormOpen = true)}>Add a comment...</button>
			<ProTip on:m={() => (isFormOpen = true)} />
		{/if}
	</div>
</div>

<style lang="scss">
	@import '../../../../../../lib/styles/variables';
	@import '../../../../../../lib/styles/mixins';

	.create {
		margin-top: 25px;
		position: relative;

		@include font-size(15);

		:global(.user-avatar) {
			left: 0;
			position: absolute;
			top: 0;
		}

		.right {
			padding-left: 44px;

			.fake-textarea {
				border: 1px solid $borderLightest;
				border-radius: 4px;
				color: $textLight;
				padding: 12px 16px;
				text-align: left;
				width: 100%;

				@include clickable;

				&:hover {
					border: 1px solid $borderLight;
				}
			}

			.error-text {
				color: $danger;
				padding-top: 4px;

				@include font-size(13);
				@include font-family-medium;
			}
		}
	}
</style>
