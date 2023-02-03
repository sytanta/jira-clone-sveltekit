<script lang="ts">
	import { COLORS } from '$lib/constants/color';

	import Icon from '$lib/components/Icon.svelte';
	import imageBackground from './assets/background-forest.jpg';
</script>

<div class="error-page">
	<div class="error-page-inner" style:background-image={imageBackground}>
		<div class="error-box">
			<Icon class="bug-icon" type="bug" color={COLORS.primary} size={30} />
			<h1 class="title">There’s been a glitch…</h1>
			<p>
				{'We’re not quite sure what went wrong. Please contact us or try looking on our '}
				<a href="https://support.atlassian.com/jira-software-cloud/">Help Center</a>
				{' if you need a hand.'}
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	@import '../../styles/variables';
	@import '../../styles/mixins';

	.error-page {
		padding: 64px;

		.error-page-inner {
			margin: 0 auto;
			max-width: 1440px;
			padding: 200px 0;

			@media (max-height: 680px) {
				padding: 140px 0;
			}
		}

		.error-box {
			background: rgba(255, 255, 255, 0.9);
			border-radius: 3px;
			box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
			color: $borderLight;
			margin: 0 auto;
			max-width: 480px;
			padding: 32px;
			position: relative;
		}

		:global(.bug-icon) {
			left: 32px;
			position: absolute;
			top: 32px;
		}

		.title {
			margin-bottom: 16px;
			padding-left: 42px;

			@include font-size(29);
		}
	}
</style>
