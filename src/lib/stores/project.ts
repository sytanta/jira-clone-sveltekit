import { get, writable } from 'svelte/store';

import type { ProjectDataSafe } from '$lib/types';

import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

const PROJECT_ISSUE_PROPERTIES_FOR_DISPLAY = [
	'title',
	'type',
	'priority',
	'status',
	'listPosition',
	'User'
];

export const projectStore = writable<ProjectDataSafe | null>(null);

export function updateProjectStore(data: Partial<ProjectDataSafe> | null) {
	if (!data) return projectStore.set(null);

	const updatedData = pickDefinedValues(data);

	projectStore.update((pre) => Object.assign({}, pre, updatedData));
}

export function updateProjectStoreIssue(issueId: string, data: Record<string, any>) {
	const store = get(projectStore);
	const issueIndex = store?.Issue.findIndex((issue) => issue.id === issueId);
	if (issueIndex === undefined || issueIndex < 0) return;

	const issue = store!.Issue[issueIndex];
	const definedData = pickDefinedValues(data);

	if (Object.hasOwn(definedData, 'assignees')) {
		const newUsers: ProjectDataSafe['User'] = definedData['assignees'].map((assignee: string) => {
			return { userId: assignee };
		});
		definedData['User'] = newUsers;
	}

	const updatedData = pickIssueDisplayedValues(definedData);
	store!.Issue[issueIndex] = Object.assign(issue, updatedData);

	projectStore.set(store);
}

export const refetchProjectStore = writable<{
	refetch: boolean;
	cb: null | undefined | (() => void);
}>({
	refetch: false,
	cb: null
});

export function setRefetchProjectStore(
	shouldReFetch: boolean | null | undefined,
	cb?: null | undefined | (() => void)
) {
	refetchProjectStore.update(({ refetch }) => ({
		refetch: shouldReFetch != null ? shouldReFetch : !refetch,
		cb
	}));
}

function pickIssueDisplayedValues<T extends Record<string, any>>(data: T) {
	const result: Partial<T> = {};

	for (const key in data) {
		if (PROJECT_ISSUE_PROPERTIES_FOR_DISPLAY.includes(key)) result[key] = data[key];
	}

	return result;
}
