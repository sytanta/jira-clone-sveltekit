<script context="module">
	const defaultToolbar = [
		['bold', 'italic', 'underline', 'strike'],
		['blockquote', 'code-block'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		[{ color: [] }, { background: [] }],
		['clean']
	];
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import debounce from 'lodash/debounce';

	import type Quill from 'quill';

	let className = '';

	export { className as class };
	export let id = '';
	export let name = '';
	export let value: string | number | null | undefined = '';
	export let placeholder = '';
	export let toolbarOptions = defaultToolbar;
	export let editorRef: Quill | null = null;

	const emit = createEventDispatcher();
	const initialValue = value;
	let editorElm: HTMLDivElement | null = null;

	const handleContentChange = debounce(getContent, 300);

	onMount(async () => {
		const { default: Quill } = await import('quill');

		editorRef = new Quill(editorElm!, {
			theme: 'snow',
			modules: {
				toolbar: toolbarOptions
			},
			placeholder
		});

		editorRef.on('text-change', handleContentChange);

		return () => {
			editorRef!.off('text-change', handleContentChange);
			editorRef = null;
		};
	});

	function getContent() {
		const content = editorElm?.querySelector('.ql-editor')?.innerHTML;
		value = content;

		emit('input', content);
	}
</script>

<div class={`editor-container ${className}`}>
	<input {id} type="hidden" {name} bind:value />
	<div bind:this={editorElm}>{@html initialValue}</div>
</div>

<style lang="scss">
	@import 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
	@import '../styles/variables';
	@import '../styles/mixins';

	.editor-container {
		:global(.ql-toolbar.ql-snow) {
			border: 1px solid $borderLightest;
			border-bottom: none;
			border-radius: 4px 4px 0 0;
		}
		:global(.ql-container.ql-snow) {
			border: 1px solid $borderLightest;
			border-radius: 0 0 4px 4px;
			border-top: none;
			color: $textDarkest;

			@include font-size(15);
			@include font-family-regular;
		}
		:global(.ql-editor) {
			min-height: 110px;
		}
	}
</style>
