<script lang="ts">
	import { PUBLIC_GITHUB_URL } from '$env/static/public';

	import Button from '$lib/components/Button.svelte';
</script>

<div class="header">
	<div class="board-name">Kanban board</div>
	<a href={PUBLIC_GITHUB_URL} target="_blank" rel="noreferrer noopener">
		<Button icon="github">Github Repo</Button>
	</a>
</div>

<style lang="scss">
	@import '../../../lib/styles/mixins';

	.header {
		display: flex;
		justify-content: space-between;
		margin-top: 6px;

		.board-name {
			@include font-size(24);
			@include font-family-medium;
		}
	}
</style>
