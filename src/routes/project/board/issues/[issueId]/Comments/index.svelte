<script lang="ts">
	import type { IssueDataSafe } from '$lib/types';

	import { page } from '$app/stores';

	import sortByNewest from '$lib/utils/sortByNewest';

	import Create from './Create.svelte';
	import Comment from './Comment.svelte';

	export let issue: IssueDataSafe;

	$: sortedComments = sortByNewest(issue.Comment, 'createdAt');
</script>

<div class="comments">
	<div class="title">Comments</div>
	<Create issueId={issue.id} on:update />

	{#each sortedComments as comment (comment.id)}
		<Comment {comment} issueId={issue.id} user={$page.data.user} on:update on:delete />
	{/each}
</div>

<style lang="scss">
	@import '../../../../../../lib/styles/variables';
	@import '../../../../../../lib/styles/mixins';

	.comments {
		padding-top: 40px;

		.title {
			@include font-size(15);
			@include font-family-medium;
		}
	}
</style>
