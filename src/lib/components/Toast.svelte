<script>
	import { removeToast, toastsStore } from '$lib/stores/toast';

	import Icon from '$lib/components/Icon.svelte';
</script>

<div class="container">
	{#each $toastsStore as toast (toast.id)}
		<button class={`toast ${toast.type}`} on:click={() => removeToast(toast)}>
			<Icon class="delete-icon" type="close" />
			{#if toast.title}
				<div class="title">{toast.title}</div>
			{/if}
			<div class="message">{toast.message}</div>
		</button>
	{/each}
</div>

<style lang="scss">
	@import '../styles/variables';
	@import '../styles/mixins';

	.container {
		display: flex;
		flex-direction: column-reverse;
		position: fixed;
		right: 30px;
		top: 50px;
		z-index: calc($z-modal + 1);

		.toast {
			border-radius: 3px;
			color: #fff;
			cursor: pointer;
			display: block;
			margin-bottom: 5px;
			padding: 15px 20px;
			position: relative;
			text-align: left;
			transition: all 0.15s;
			width: 300px;

			@include hardwareAccelerate;

			&.success {
				background-color: $success;
			}
			&.danger {
				background-color: $danger;
			}

			&.jira-toast-enter,
			&.jira-toast-exit.jira-toast-exit-active {
				opacity: 0;
				right: -10px;
			}

			&.jira-toast-exit,
			&.jira-toast-enter.jira-toast-enter-active {
				opacity: 1;
				right: 0;
			}

			:global(.delete-icon) {
				color: #fff;
				cursor: pointer;
				font-size: 22px;
				position: absolute;
				right: 14px;
				top: 13px;
			}

			.title {
				padding-right: 22px;

				@include font-size(15);
				@include font-family-medium;
			}

			.message {
				padding: 8px 10px 0 0;
				white-space: pre-wrap;

				@include font-size(14);
				@include font-family-medium;
			}
		}
	}
</style>
