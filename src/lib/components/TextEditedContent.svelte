<script lang="ts">
	export let content: string | number | null | undefined = '';
</script>

<div class="ql-snow">
	<div class="content ql-editor" on:click on:keydown>
		{@html content}
	</div>
</div>

<style lang="scss">
	@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
	@import '../styles/mixins';

	.content {
		padding: 0 !important;

		@include font-size(15);
		@include font-family-regular;
	}
</style>
