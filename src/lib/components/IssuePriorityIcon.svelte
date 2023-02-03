<script lang="ts">
	import type { IconCode } from '$lib/constants/icon';

	import { IssuePriority } from '@prisma/client';
	import { ISSUE_PRIORITY_COLORS } from '$lib/constants/color';

	import Icon from './Icon.svelte';

	export let priority: IssuePriority = 'lowest';
	export let left: number | undefined = undefined;
	export let top: number | undefined = undefined;

	const lowPriorities = [IssuePriority.low, IssuePriority.lowest] as IssuePriority[];
	let iconType: IconCode;

	$: color = ISSUE_PRIORITY_COLORS[priority];
	$: iconType = lowPriorities.includes(priority) ? 'arrow-down' : 'arrow-up';
</script>

<Icon type={iconType} {color} size={18} {left} {top} />
