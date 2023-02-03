<script context="module">
	const colors = [
		'#DA7657',
		'#6ADA57',
		'#5784DA',
		'#AA57DA',
		'#DA5757',
		'#DA5792',
		'#57DACA',
		'#57A5DA'
	];
</script>

<script lang="ts">
	let className = '';

	export { className as class };
	export let name = '';
	export let size = 32;
	export let avatarUrl: string | null | undefined = undefined;

	const color = colors[name.toLocaleLowerCase().charCodeAt(0) % colors.length];
	const fontSize = Math.round(size / 1.7) + 'px';
</script>

{#if avatarUrl}
	<button
		class={`image ${className}`}
		style:height={`${size}px`}
		style:width={`${size}px`}
		style:background-image={`url(${avatarUrl})`}
		data-testid={name ? `avatar:${name}` : 'avatar'}
		on:click
	/>
{:else}
	<button
		class={`letter ${className}`}
		style:background-color={color}
		style:height={`${size}px`}
		style:width={`${size}px`}
		style:font-size={fontSize}
		data-testid={name ? `avatar:${name}` : 'avatar'}
		on:click
	>
		<span>{name.charAt(0)}</span>
	</button>
{/if}

<style lang="scss">
	@import '../styles/variables';
	@import '../styles/mixins';

	.image {
		background-color: $backgroundLight;
		background-position: 50% 50%;
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 100%;
		display: inline-block;
	}

	.letter {
		border-radius: 100%;
		color: #fff;
		display: inline-block;
		text-transform: uppercase;

		@include font-family-medium;

		& > span {
			align-items: center;
			justify-content: center;
			display: flex;
			height: 100%;
		}
	}
</style>
