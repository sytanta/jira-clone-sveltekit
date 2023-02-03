<script lang="ts" context="module">
	import type { IssueDataSafe, ProjectDataSafe } from '$lib/types';

	import { updateProjectStoreIssue } from '$lib/stores/project';
	import { addToast } from '$lib/stores/toast';

	export async function fetchIssue(issueId: string): Promise<IssueDataSafe | null> {
		const res = await fetch(`/api/issue/${issueId}`);

		if (res.ok) {
			const json = await res.json();
			return json.issue;
		}

		return null;
	}

	export async function updateIssue(
		issueId: string,
		data: Record<string, string | string[] | number | null>,
		currentIssueData: IssueDataSafe | ProjectDataSafe['Issue'][number]
	) {
		updateProjectStoreIssue(issueId, data);

		try {
			const res = await fetch(`/api/issue/${issueId}`, {
				method: 'PUT',
				body: JSON.stringify(data)
			});

			if (res.ok) onUpdateSuccess();
			else onUpdateError(issueId, currentIssueData);

			return res;
		} catch (e) {
			onUpdateError(issueId, currentIssueData);

			return { ok: false };
		}
	}

	function onUpdateSuccess() {
		addToast({ type: 'success', message: 'Issue updated successfully!' });
	}

	function onUpdateError(
		issueId: string,
		currentIssueData: IssueDataSafe | ProjectDataSafe['Issue'][number]
	) {
		addToast({ type: 'danger', message: 'Updating issue failed, please try again!' });
		updateProjectStoreIssue(issueId, currentIssueData);
	}
</script>

<script lang="ts">
	import type { IssueFilters } from './types';

	import { projectStore } from '$lib/stores/project';

	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Header from './Header.svelte';
	import Filters from './Filters.svelte';
	import Lists from './Lists.svelte';

	let filters: IssueFilters = {
		searchTerm: '',
		userIds: [],
		myOnly: false,
		recent: false
	};

	$: projectName = $projectStore?.name!;
</script>

<Breadcrumbs items={[{ label: 'Projects' }, { label: projectName }, { label: 'Kanban Board' }]} />

<Header />

<Filters bind:filters />

<Lists {filters} />

<slot />
