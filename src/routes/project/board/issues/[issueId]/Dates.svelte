<script lang="ts">
	import type { IssueDataSafe } from '$lib/types';

	import { formatDateTimeConversational } from '$lib/utils/dateTime';

	export let issue: IssueDataSafe;
</script>

<div class="dates">
	<div>Created {formatDateTimeConversational(issue.createdAt)}</div>
	{#if issue.updatedAt}
		<div>
			Updated {formatDateTimeConversational(issue.updatedAt)}
		</div>
	{/if}
</div>

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.dates {
		border-top: 1px solid $borderLightest;
		color: $textMedium;
		margin-top: 11px;
		padding-top: 13px;
		line-height: 22px;

		@include font-size(13);
	}
</style>
