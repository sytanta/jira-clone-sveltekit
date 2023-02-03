<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import AboutTooltip from '$lib/components/AboutTooltip/index.svelte';
	import Icon from '$lib/components/Icon.svelte';

	export let openIssueSearchModal: () => void = () => {};
	export let openIssueCreateModal: () => void = () => {};
</script>

<aside class="navbar">
	<a class="logo" href="/">
		<Logo class="icon-logo" />
	</a>

	<button class="nav-item" on:click={openIssueSearchModal}>
		<Icon type="search" size={22} top={1} left={3} />
		<div class="text">Search issues</div>
	</button>

	<button class="nav-item" on:click={openIssueCreateModal}>
		<Icon type="plus" size={27} />
		<div class="text">Create Issue</div>
	</button>

	<div class="item-bottom">
		<AboutTooltip placement="right" offset={{ left: 0, top: -218 }}>
			<svelte:fragment slot="toggler">
				<Icon type="help" size={25} />
				<div class="text">About</div>
			</svelte:fragment>
		</AboutTooltip>
	</div>
</aside>

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.navbar {
		background: $backgroundDarkPrimary;
		height: 100vh;
		left: 0;
		overflow-x: hidden;
		position: fixed;
		top: 0;
		transition: all 0.1s;
		width: $appNavBarLeftWidth + 1px;
		z-index: $z-navLeft;

		@include hardwareAccelerate;

		&:hover {
			width: 200px;
			box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.6);

			.text {
				opacity: 1;
				right: 0;
				visibility: visible;
			}
		}

		.logo {
			display: block;
			left: 0;
			margin: 20px 0 10px;
			position: relative;
			transition: left 0.1s;

			:global(.icon-logo) {
				color: #fff;
				display: inline-block;
				margin-left: 8px;
				padding: 10px;

				@include clickable;
			}
		}

		.nav-item,
		:global(.tooltip-toggler) {
			color: #deebff;
			display: block;
			height: 42px;
			line-height: 42px;
			padding-left: 64px;
			position: relative;
			text-align: left;
			transition: color 0.1s;
			width: 100%;

			@include clickable;

			&:hover {
				background: rgba(255, 255, 255, 0.1);
			}

			:global(i) {
				left: 18px;
				position: absolute;
			}
		}

		.item-bottom {
			bottom: 20px;
			left: 0;
			position: absolute;
			width: 100%;
		}

		.text {
			opacity: 0;
			position: relative;
			right: 12px;
			text-transform: uppercase;
			transition: all 0.1s;
			transition-property: right, visibility, opacity;
			visibility: hidden;

			@include font-size(12);
			@include font-family-bold;
		}
	}
</style>
