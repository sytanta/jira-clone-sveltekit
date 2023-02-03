<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { CommentDataSafe } from '$lib/types';

	import { formatDateTimeConversational } from '$lib/utils/dateTime';

	import Avatar from '$lib/components/Avatar.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import Form from './Form.svelte';

	export let comment: CommentDataSafe;
	export let issueId: string;
	export let user: App.PageData['user'];

	const emit = createEventDispatcher();
	let isFormOpen = false;
	let isUpdating = false;
	let body = comment.body;
	let deleteModalOpen = false;
	let isDeleting = false;

	async function handleUpdateComment() {
		const content = body.trim();
		if (!content) return;

		isUpdating = true;

		const res = await fetch(`/api/comment/${comment.id}`, {
			method: 'PUT',
			body: JSON.stringify({ issueId, content })
		});

		if (res.ok) {
			emit('update', {
				callback: () => {
					isUpdating = false;
					isFormOpen = false;
				}
			});
		}
	}

	async function handleDeleteComment() {
		isDeleting = true;

		const res = await fetch(`/api/comment/${comment.id}`, {
			method: 'DELETE'
		});

		if (res.ok) {
			emit('delete');

			deleteModalOpen = false;
			isDeleting = false;
		}
	}
</script>

<div class="comment" data-testid="issue-comment">
	<Avatar class="user-avatar" name={comment.User?.name} avatarUrl={comment.User?.avatarUrl} />
	<div class="content">
		<div class="username">{comment.User?.name}</div>
		<div class="created-at">{formatDateTimeConversational(comment.createdAt)}</div>

		{#if isFormOpen}
			<Form
				bind:value={body}
				isWorking={isUpdating}
				on:submit={handleUpdateComment}
				on:cancel={() => (isFormOpen = false)}
			/>
		{:else}
			<p class="body">{comment.body}</p>
			{#if user.id === comment.User.id}
				<button class="edit-link" on:click={() => (isFormOpen = true)}>Edit</button><button
					class="delete-link"
					on:click={() => (deleteModalOpen = true)}>Delete</button
				>
				<ConfirmModal
					title="Are you sure you want to delete this comment?"
					message="Once you delete, it's gone for good."
					confirmText="Delete comment"
					isOpen={deleteModalOpen}
					isWorking={isDeleting}
					on:confirm={handleDeleteComment}
					on:close={() => (deleteModalOpen = false)}
				/>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	@import '../../../../../../lib/styles/variables';
	@import '../../../../../../lib/styles/mixins';

	.comment {
		margin-top: 25px;
		position: relative;

		@include font-size(15);

		:global(.user-avatar) {
			left: 0;
			position: absolute;
			top: 0;
		}

		.content {
			padding-left: 44px;

			.username {
				color: $textDark;
				display: inline-block;
				padding-bottom: 10px;
				padding-right: 12px;

				@include font-family-medium;
			}

			.created-at {
				color: $textDark;
				display: inline-block;
				padding-bottom: 10px;

				@include font-size(14.5);
			}

			.body {
				padding-bottom: 10px;
				white-space: pre-wrap;
			}

			.edit-link,
			.delete-link {
				color: $textMedium;
				display: inline-block;
				padding: 2px 0;

				@include font-size(14.5);
				@include clickable;

				&:hover {
					text-decoration: underline;
				}
			}

			.edit-link {
				margin-right: 12px;
			}

			.delete-link {
				&:before {
					content: '·';
					display: inline-block;
					position: relative;
					right: 6px;
				}
			}
		}
	}
</style>
