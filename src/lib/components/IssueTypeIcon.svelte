<script lang="ts">
	import { ISSUE_TYPE_COLORS } from '$lib/constants/color';

	import Icon from './Icon.svelte';

	export let type: keyof typeof ISSUE_TYPE_COLORS;
	export let size: number = 18;
	export let left: number | undefined = undefined;
	export let top: number | undefined = undefined;

	$: color = ISSUE_TYPE_COLORS[type];
</script>

<Icon {type} {color} {size} {left} {top} />
