<script lang="ts">
	import type { ButtonVariant } from '$lib/constants/buttonVariant';

	import { copyToClipboard } from '$lib/utils/browser';

	import Button from './Button.svelte';

	export let variant: ButtonVariant;

	let isLinkCopied = false;

	function handleLinkCopy() {
		isLinkCopied = true;

		copyToClipboard(window.location.href);

		setTimeout(() => (isLinkCopied = false), 2000);
	}
</script>

<Button icon="link" on:click={handleLinkCopy} {variant}>
	{isLinkCopied ? 'Link copied' : 'Copy link'}
</Button>
