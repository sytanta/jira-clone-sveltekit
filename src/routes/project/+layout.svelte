<script lang="ts">
	import { onMount } from 'svelte';

	import type { ProjectCategory } from '@prisma/client';
	import type { ProjectDataSafe } from '$lib/types';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { addSearchParam, removeSearchParam } from '$lib/utils/url';
	import {
		refetchProjectStore,
		setRefetchProjectStore,
		updateProjectStore
	} from '$lib/stores/project';
	import { addToast } from '$lib/stores/toast';

	import PageLoader from '$lib/components/PageLoader.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import NavbarLeft from './NavbarLeft.svelte';
	import Sidebar from './Sidebar.svelte';
	import IssueSearch from './IssueSearch.svelte';
	import IssueCreate from './IssueCreate.svelte';

	type ModalType = 'create' | 'search';

	let project: ProjectDataSafe;
	let issueSearchModalOpen = false;
	let issueCreateModalOpen = false;
	let isLoading = true;

	$: if ($refetchProjectStore.refetch) {
		(async () => {
			await fetchProject();

			$refetchProjectStore.cb?.();
			setRefetchProjectStore(false, null);
		})();
	}
	$: {
		issueSearchModalOpen = $page.url.searchParams.has('modal-issue-search');
		issueCreateModalOpen = $page.url.searchParams.has('modal-issue-create');
	}
	$: projectCategory = project?.category as ProjectCategory;
	$: user = $page.data.user;

	onMount(async () => {
		await fetchProject();

		isLoading = false;
	});

	async function fetchProject() {
		const res = await fetch('/api/project/get-project-by-user');
		const json = await res.json();

		project = json.project;
		updateProjectStore(project);
	}

	function openModal(type: ModalType) {
		goto(addSearchParam($page.url.href, `modal-issue-${type}`, 'true'));
	}

	function closeModal(type: ModalType) {
		goto(removeSearchParam($page.url.href, `modal-issue-${type}`));
	}

	async function onCreateIssue() {
		await fetchProject();

		addToast({ type: 'success', message: 'Issue has been successfully created.' });
		closeModal('create');

		goto('/project/board');
	}
</script>

{#if isLoading}
	<PageLoader />
{:else}
	<div class="project-container">
		<NavbarLeft
			openIssueSearchModal={() => openModal('search')}
			openIssueCreateModal={() => openModal('create')}
		/>

		<Sidebar name={project?.name || ''} category={projectCategory} />

		{#if project}
			<Modal
				isOpen={issueSearchModalOpen}
				testid="modal:issue-search"
				variant="aside"
				width={600}
				on:close={() => closeModal('search')}
			>
				<svelte:fragment slot="content">
					<IssueSearch {project} />
				</svelte:fragment>
			</Modal>

			<Modal
				isOpen={issueCreateModalOpen}
				testid="modal:issue-create"
				width={800}
				withCloseIcon={false}
				on:close={() => closeModal('create')}
			>
				<svelte:fragment slot="content">
					<IssueCreate
						{project}
						{user}
						on:close={() => closeModal('create')}
						on:success={onCreateIssue}
					/>
				</svelte:fragment>
			</Modal>
		{/if}

		<!-- {match.isExact && <Redirect to={`${match.url}/board`} />} -->

		<slot />
	</div>
{/if}

<style lang="scss">
	@import '../../lib/styles/variables';

	$padding-left: $appNavBarLeftWidth + $secondarySideBarWidth + 40;

	.project-container {
		padding: 25px 32px 50px ($padding-left + 0px);

		@media (max-width: 999px) {
			padding-left: $padding-left - $secondarySideBarWidth - 20px;
		}
		@media (max-width: 1100px) {
			padding: 25px 20px 50px ($padding-left - 20px);
		}
	}
</style>
