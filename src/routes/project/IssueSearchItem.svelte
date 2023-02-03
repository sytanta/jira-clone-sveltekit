<script lang="ts">
	import type { ProjectDataSafe } from '$lib/types';

	import IssueTypeIcon from '$lib/components/IssueTypeIcon.svelte';

	export let issue: ProjectDataSafe['Issue'][number];
</script>

<a class="link" href={`/project/board/issues/${issue.id}`}>
	<div class="issue">
		<IssueTypeIcon type={issue.type} size={25} />
		<div class="issue-data">
			<div class="title">{issue.title}</div>
			<div class="id">{`${issue.type}-${issue.id}`}</div>
		</div>
	</div>
</a>

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.link {
		.issue {
			align-items: center;
			border-radius: 4px;
			display: flex;
			padding: 4px 10px;
			transition: background-color 0.1s;

			@include clickable;

			&:hover {
				background: $backgroundLight;
			}

			.issue-data {
				padding-left: 15px;
			}

			.title {
				color: $textDark;

				@include font-size(15);
			}

			.id {
				color: $textMedium;
				text-transform: uppercase;

				@include font-size(12.5);
			}
		}
	}
</style>
