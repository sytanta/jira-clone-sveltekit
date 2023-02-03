<script lang="ts">
	import type { TooltipOffset, TooltipPlacement } from '../Tooltip/calculateTooltipPosition';

	import {
		PUBLIC_CONTACT_EMAIL,
		PUBLIC_GITHUB_URL,
		PUBLIC_PERSONAL_WEBSITE_URL
	} from '$env/static/public';

	import Tooltip from '$lib/components/Tooltip/index.svelte';
	import Button from '$lib/components/Button.svelte';

	import feedbackImage from './assets/feedback.png';

	export let placement: TooltipPlacement = 'bottom';
	export let offset: TooltipOffset = { top: 0, left: 0 };
</script>

<Tooltip width={300} {placement} {offset}>
	<svelte:fragment slot="toggler"><slot name="toggler" /></svelte:fragment>
	<div slot="content" class="about-tooltip">
		<div class="image-container">
			<img class="image" src={feedbackImage} alt="Give feedback" />
		</div>

		<p class="content">
			This simplified Jira clone is built with SvelteKit, Typescript, Prisma and Supabase.
		</p>

		<p class="content">
			{'Read more on my website or reach out via '}
			<a href={`mailto:${PUBLIC_CONTACT_EMAIL}`}><strong>{PUBLIC_CONTACT_EMAIL}</strong></a>
		</p>

		<a href={PUBLIC_PERSONAL_WEBSITE_URL} target="_blank" rel="noreferrer noopener">
			<Button variant="primary">Visit Website</Button>
		</a>

		<a href={PUBLIC_GITHUB_URL} target="_blank" rel="noreferrer noopener" style="margin-left: 5px;">
			<Button icon="github">Github Repo</Button>
		</a>
	</div>
</Tooltip>

<style lang="scss">
	@import '../../styles/mixins';

	.about-tooltip {
		padding: 16px 24px 24px;

		.image-container {
			padding: 24px 56px 20px;
		}

		.image {
			width: 100%;
		}

		.content {
			margin-bottom: 12px;

			@include font-size(15);

			&:last-of-type {
				margin-bottom: 22px;
			}
		}
	}
</style>
