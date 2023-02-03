<script lang="ts">
	import { PROJECT_CATEGORY_OBJ } from '$lib/constants/project';
	import { projectFormSchema } from '$lib/utils/zod/schemas-form/project';
	import { addToast } from '$lib/stores/toast';
	import { projectStore, setRefetchProjectStore } from '$lib/stores/project';

	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form/index.svelte';
	import Field from '$lib/components/Form/Field.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import Select from '$lib/components/Select/index.svelte';

	const categoryOptions = Object.values(PROJECT_CATEGORY_OBJ).map((category) => {
		const value = category;

		return {
			value,
			label: value[0].toUpperCase() + value.slice(1)
		};
	});

	$: projectName = $projectStore?.name!;
	$: values = {
		name: $projectStore?.name,
		url: $projectStore?.url,
		description: $projectStore?.description,
		category: $projectStore?.category!
	};

	function onUpdateProject() {
		addToast({ type: 'success', message: 'Changes have been saved successfully.' });
		setRefetchProjectStore(true, null);
	}
</script>

<div class="container">
	<div class="container-inner">
		<Breadcrumbs
			items={[{ label: 'Projects' }, { label: projectName }, { label: 'Project Details' }]}
		/>
		<h1 class="heading">Project Details</h1>

		<Form action="/project/settings" schema={projectFormSchema} on:success={onUpdateProject}>
			<svelte:fragment let:isLoading>
				<input type="hidden" name="id" value={$projectStore?.id} />

				<Field name="name" label="Name">
					<svelte:fragment let:id let:fieldName let:invalid>
						<Input {id} name={fieldName} value={values.name} {invalid} />
					</svelte:fragment>
				</Field>
				<Field name="url" label="URL">
					<svelte:fragment let:id let:fieldName let:invalid>
						<Input {id} name={fieldName} value={values.url} {invalid} />
					</svelte:fragment>
				</Field>
				<Field
					name="description"
					label="Description"
					tip="Describe the project in as much detail as you'd like."
				>
					<svelte:fragment let:id let:fieldName>
						<TextEditor {id} name={fieldName} value={values.description} />
					</svelte:fragment>
				</Field>
				<Field name="category" label="Project Category">
					<svelte:fragment let:id let:fieldName>
						<Select {id} name={fieldName} value={values.category} options={categoryOptions} />
					</svelte:fragment>
				</Field>

				<Button class="action-button" type="submit" variant="primary" isWorking={isLoading}>
					Save changes
				</Button>
			</svelte:fragment>
		</Form>
	</div>
</div>

<style lang="scss">
	@import '../../../lib/styles/variables';
	@import '../../../lib/styles/mixins';

	.container {
		display: flex;
		justify-content: center;

		.container-inner {
			max-width: 640px;
			width: 100%;
		}

		.heading {
			padding: 6px 0 15px;

			@include font-size(24);
			@include font-family-medium;
		}

		:global(.action-button) {
			margin-top: 30px;
		}
	}
</style>
