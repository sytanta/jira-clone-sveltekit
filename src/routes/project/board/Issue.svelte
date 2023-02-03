<script lang="ts">
	import type { ProjectDataSafe } from '$lib/types';

	import { projectStore } from '$lib/stores/project';

	import IssueTypeIcon from '$lib/components/IssueTypeIcon.svelte';
	import IssuePriorityIcon from '$lib/components/IssuePriorityIcon.svelte';
	import Avatar from '$lib/components/Avatar.svelte';

	export let issue: ProjectDataSafe['Issue'][number];

	$: assignees = issue.User.map((userOnIssue) => {
		const projectUser = $projectStore?.User.find((pUser) => pUser.id === userOnIssue.userId);
		if (!projectUser) return false;

		return {
			...projectUser,
			assignedAt: userOnIssue.assignedAt || new Date()
		};
	})
		.filter(Boolean)
		.sort((a, b) => a!.assignedAt - b!.assignedAt);
</script>

<a class="link" href={`/project/board/issues/${issue.id}`} data-testid="list-issue">
	<div class="issue" class:being-dragged={false}>
		<p class="title">{issue.title}</p>
		<div class="bottom">
			<div>
				<IssueTypeIcon type={issue.type} /><IssuePriorityIcon
					priority={issue.priority}
					top={-1}
					left={4}
				/>
			</div>
			<div class="assignees">
				{#each assignees as user (user?.id)}
					{#if user}
						<Avatar
							class="assignee-avatar"
							size={24}
							avatarUrl={user?.avatarUrl}
							name={user?.name}
						/>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	@import '../../../lib/styles/variables';
	@import '../../../lib/styles/mixins';

	.link {
		display: block;
		margin-bottom: 5px;

		.issue {
			background: #fff;
			border-radius: 3px;
			box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
			padding: 10px;
			transition-duration: 0.1s;
			transition-property: transform, background-color;

			@include clickable;

			@media (max-width: 1100px) {
				padding: 10px 8px;
			}
			&:hover {
				background: $backgroundLight;
			}

			&.being-dragged {
				box-shadow: 5px 10px 30px 0px rgba(9, 30, 66, 0.15);
				transform: rotate(3deg);
			}

			.title {
				padding-bottom: 11px;

				@include font-size(15);

				@media (max-width: 1100px) {
					@include font-size(14.5);
				}
			}

			.bottom {
				align-items: center;
				display: flex;
				justify-content: space-between;

				.assignees {
					display: flex;
					flex-direction: row-reverse;
					margin-left: 2px;
				}

				:global(.assignee-avatar) {
					box-shadow: 0 0 0 2px #fff;
					margin-left: -2px;
				}
			}
		}
	}
</style>
