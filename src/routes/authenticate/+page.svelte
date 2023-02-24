<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';

	import PageLoader from '$lib/components/PageLoader.svelte';

	onMount(async () => {
		try {
			const res = await fetch('/api/auth/create-guest-account', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				}
			});

			if (res.ok) goto('/project/board');
		} catch (e: unknown) {
 			console.log('Error creating account: ', (e as Error).message);
		}
	});
</script>

<PageLoader />
