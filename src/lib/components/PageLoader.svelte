<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
</script>

<div class="page-loader">
	<Spinner size={70} />
</div>

<style lang="scss">
	.page-loader {
		padding: 200px 0;
		text-align: center;
		width: 100%;
	}
</style>
