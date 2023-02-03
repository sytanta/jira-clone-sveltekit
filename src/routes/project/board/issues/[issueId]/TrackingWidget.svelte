<script lang="ts" context="module">
	import { isNil } from 'lodash';

	import type { IssueDataSafe } from '$lib/types';

	function calculateTrackingBarWidth({ timeSpent, timeRemaining, estimate }: IssueDataSafe) {
		if (!timeSpent) {
			return 0;
		}
		if (isNil(timeRemaining) && isNil(estimate)) {
			return 100;
		}
		if (!isNil(timeRemaining)) {
			return (timeSpent / (timeSpent + timeRemaining)) * 100;
		}
		if (!isNil(estimate)) {
			return Math.min((timeSpent / estimate) * 100, 100);
		}
	}

	function renderRemainingOrEstimate({ timeRemaining, estimate }: IssueDataSafe) {
		if (isNil(timeRemaining) && isNil(estimate)) {
			return null;
		}
		if (!isNil(timeRemaining)) {
			return `${timeRemaining}h remaining`;
		}
		if (!isNil(estimate)) {
			return `${estimate}h estimated`;
		}
	}
</script>

<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	export let issue: IssueDataSafe;

	$: width = calculateTrackingBarWidth(issue) + '%';
	$: time = renderRemainingOrEstimate(issue);
</script>

<div class="tracking-widget">
	<Icon class="watch-icon" type="stopwatch" size={26} top={-1} />
	<div class="right">
		<div class="bar-container">
			<div class="bar" style:width />
		</div>
		<div class="values">
			<div>{issue.timeSpent ? `${issue.timeSpent}h logged` : 'No time logged'}</div>
			{#if time != null}<div>{time}</div>{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../../../../lib/styles/variables';
	@import '../../../../../lib/styles/mixins';

	.tracking-widget {
		align-items: center;
		display: flex;
		justify-content: space-between;

		:global(.watch-icon) {
			color: $textMedium;
		}

		.right {
			width: 90%;

			.bar-container {
				background: $backgroundMedium;
				border-radius: 4px;
				height: 5px;
			}

			.bar {
				background: $primary;
				border-radius: 4px;
				height: 5px;
				transition: all 0.1s;
			}

			.values {
				display: flex;
				justify-content: space-between;
				padding-top: 3px;

				@include font-size(14.5);
			}
		}
	}
</style>
