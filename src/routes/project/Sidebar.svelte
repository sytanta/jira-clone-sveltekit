<script lang="ts">
	import { PROJECT_CATEGORY_OBJ } from '$lib/constants/project';

	import ProjectAvatar from '$lib/components/ProjectAvatar.svelte';
	import SidebarLink from './SidebarLink.svelte';

	export let name: string;
	export let category: keyof typeof PROJECT_CATEGORY_OBJ;
</script>

<div class="sidebar">
	<div class="project">
		<ProjectAvatar />
		<div class="info">
			<div class="name">{name}</div>
			<div class="category">{PROJECT_CATEGORY_OBJ[category]} project</div>
		</div>
	</div>

	<SidebarLink path="/project/board" text="Kanban Board" iconType="board" />
	<SidebarLink path="/project/settings" text="Project Settings" iconType="settings" />

	<div class="divider" />

	<SidebarLink text="Releases" iconType="shipping" />
	<SidebarLink text="Issues and filters" iconType="issues" />
	<SidebarLink text="Pages" iconType="page" />
	<SidebarLink text="Reports" iconType="reports" />
	<SidebarLink text="Components" iconType="component" />
</div>

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.sidebar {
		background: $backgroundLightest;
		border-right: 1px solid $borderLightest;
		height: 100vh;
		left: $appNavBarLeftWidth + 0px;
		padding: 0 16px 24px;
		position: fixed;
		top: 0;
		width: $secondarySideBarWidth + 0px;
		z-index: $z-navLeft - 1;

		@include scrollableY;
		@include customScrollbar();

		@media (max-width: 999px) {
			display: none;
		}
		@media (max-width: 1100px) {
			width: $secondarySideBarWidth - 10px;
		}

		.project {
			display: flex;
			padding: 24px 4px;
		}

		.info {
			padding: 3px 0 0 10px;

			.name {
				color: $textDark;

				@include font-size(15);
				@include font-family-medium;
			}

			.category {
				color: $textMedium;
				text-transform: capitalize;

				@include font-size(13);
			}
		}

		.divider {
			border-top: 1px solid $borderLight;
			margin-top: 17px;
			padding-top: 18px;
		}
	}
</style>
