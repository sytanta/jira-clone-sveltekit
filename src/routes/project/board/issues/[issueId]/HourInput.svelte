<script lang="ts">
	import isNil from 'lodash/isNil';

	import type { IssueDataSafe } from '$lib/types';

	import InputDebounced from '$lib/components/InputDebounced.svelte';

	export let issue: IssueDataSafe;
	export let issueProperty: 'estimate' | 'timeSpent' | 'timeRemaining';
</script>

<InputDebounced
	placeholder="Number"
	filter={/^\d{0,6}$/}
	value={isNil(issue[issueProperty]) ? '' : issue[issueProperty] || ''}
	on:input
/>
