<script lang="ts">
	import Toast from '$lib/components/Toast.svelte';
	import '$lib/styles/style.scss';
</script>

<svelte:head>
	<title>Jira Clone in SvelteKit</title>
</svelte:head>

<slot />

<Toast />
