<script lang="ts">
	import { goto } from '$app/navigation';
	import { setRefetchProjectStore } from '$lib/stores/project';
	import { addToast } from '$lib/stores/toast';

	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import Button from '$lib/components/Button.svelte';

	export let issueId: string;

	let isConfirmModalOpen = false;
	let isWorking = false;

	async function handleConfirm() {
		isWorking = true;

		try {
			const res = await fetch(`/api/issue/${issueId}`, { method: 'DELETE' });
			if (res.ok) {
				addToast({ type: 'success', message: 'Issue has been successfully deleted' });

				setRefetchProjectStore(true, () => {
					handleClose();
					goto('/project/board');
				});
			} else {
				isWorking = false;
				addToast({ type: 'danger', message: 'Error deleting issue, please try again' });
			}
		} catch (e) {
			isWorking = false;
			addToast({ type: 'danger', message: 'Error deleting issue, please try again' });
		}
	}

	function handleClose() {
		isWorking = false;
		isConfirmModalOpen = false;
	}
</script>

<Button icon="trash" iconSize={19} variant="empty" on:click={() => (isConfirmModalOpen = true)} />

<ConfirmModal
	title="Are you sure you want to delete this issue?"
	message="Once you delete, it's gone for good."
	confirmText="Delete issue"
	isOpen={isConfirmModalOpen}
	{isWorking}
	on:confirm={handleConfirm}
	on:close={handleClose}
/>
