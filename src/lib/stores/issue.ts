import { writable } from 'svelte/store';

import type { IssueDataSafe } from '$lib/types';

import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

export const issueStore = writable<IssueDataSafe | null>(null);

export function updateIssueStore(data: Partial<IssueDataSafe> | null) {
	if (!data) return issueStore.set(null);

	const updatedData = pickDefinedValues(data);

	issueStore.update((pre) => Object.assign({}, pre, updatedData));
}

export function resetIssueStore() {
	issueStore.update((pre) => Object.assign({}, pre));
}
