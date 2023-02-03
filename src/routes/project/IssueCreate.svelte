<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { ProjectDataSafe, UserDataSafe } from '$lib/types';

	import {
		ISSUE_PRIOTIRY,
		ISSUE_PRIOTIRY_OBJ,
		ISSUE_STATUS_OBJ,
		ISSUE_TYPE,
		ISSUE_TYPE_OBJ
	} from '$lib/constants/issue';

	import { issueFormSchema } from '$lib/utils/zod/schemas-form/issue';

	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form/index.svelte';
	import Field from '$lib/components/Form/Field.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte';
	import Select from '$lib/components/Select/index.svelte';
	import IssueTypeIcon from '$lib/components/IssueTypeIcon.svelte';
	import IssuePriorityIcon from '$lib/components/IssuePriorityIcon.svelte';
	import UserOptionItem from './UserOptionItem.svelte';

	export let project: ProjectDataSafe;
	export let user: UserDataSafe;

	const emit = createEventDispatcher();

	const typeOptions = Object.values(ISSUE_TYPE).map((type) => ({
		value: type,
		label: ISSUE_TYPE_OBJ[type]
	}));

	const userOptions = project.User.map((user) => ({ value: user.id, label: user.name }));

	const priorityOptions = Object.values(ISSUE_PRIOTIRY).map((priority) => ({
		value: priority,
		label: ISSUE_PRIOTIRY_OBJ[priority]
	}));

	const values = {
		type: ISSUE_TYPE_OBJ.task,
		title: '',
		description: '',
		reporterId: user.id,
		userIds: [],
		priority: ISSUE_PRIOTIRY_OBJ.medium
	};

	function closeModal() {
		emit('close');
	}
</script>

<Form
	class="form"
	action="/project?/create-issue"
	schema={issueFormSchema}
	noValidate={true}
	on:success
>
	<svelte:fragment let:isLoading>
		<div class="heading">Create issue</div>

		<input type="hidden" name="projectId" value={project.id} />
		<input type="hidden" name="status" value={ISSUE_STATUS_OBJ.backlog} />
		<input type="hidden" name="listPosition" value={0} />

		<Field name="type" label="Issue Type" tip="Start typing to get a list of possible matches.">
			<svelte:fragment let:id let:fieldName>
				<Select {id} name={fieldName} value={values.type} options={typeOptions}>
					<svelte:fragment slot="render-option-value-single" let:optionValue>
						<div class="select-item">
							<IssueTypeIcon type={optionValue} top={1} />
							<div class="select-item-label">{ISSUE_TYPE_OBJ[optionValue]}</div>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="render-option-dropdown-item" let:option>
						<div class="select-item">
							<IssueTypeIcon type={option.value} top={1} />
							<div class="select-item-label">{ISSUE_TYPE_OBJ[option.value]}</div>
						</div>
					</svelte:fragment>
				</Select>
			</svelte:fragment>
		</Field>

		<div class="divider" />

		<Field
			name="title"
			label="Short Summary"
			tip="Concisely summarize the issue in one or two sentences."
		>
			<svelte:fragment let:id let:fieldName let:invalid>
				<Input {id} name={fieldName} value={values.title} {invalid} />
			</svelte:fragment>
		</Field>
		<Field
			name="description"
			label="Description"
			tip="Describe the issue in as much detail as you'd like."
		>
			<svelte:fragment let:id let:fieldName>
				<TextEditor {id} name={fieldName} value={values.description} />
			</svelte:fragment>
		</Field>
		<Field name="reporterId" label="Reporter">
			<svelte:fragment let:id let:fieldName>
				<Select {id} name={fieldName} value={values.reporterId} options={userOptions}>
					<svelte:fragment slot="render-option-value-single" let:optionValue>
						{@const user = project.User.find(({ id }) => id === optionValue)}
						<UserOptionItem {user} />
					</svelte:fragment>
					<svelte:fragment slot="render-option-dropdown-item" let:option>
						{@const user = project.User.find(({ id }) => id === option.value)}
						<UserOptionItem {user} />
					</svelte:fragment>
				</Select>
			</svelte:fragment>
		</Field>
		<Field
			name="userIds"
			label="Assignees"
			tip="People who are responsible for dealing with this issue."
		>
			<svelte:fragment let:id let:fieldName>
				<Select {id} name={fieldName} value={values.userIds} options={userOptions} isMulti={true}>
					<svelte:fragment slot="render-option-value-multi" let:optionValue let:removeOptionValue>
						{@const user = project.User.find(({ id }) => id === optionValue)}
						<UserOptionItem {user} {removeOptionValue} />
					</svelte:fragment>
					<svelte:fragment slot="render-option-dropdown-item" let:option>
						{@const user = project.User.find(({ id }) => id === option.value)}
						<UserOptionItem {user} />
					</svelte:fragment>
				</Select>
			</svelte:fragment>
		</Field>
		<Field name="priority" label="Priority" tip="Priority in relation to other issues.">
			<svelte:fragment let:id let:fieldName>
				<Select {id} name={fieldName} value={values.priority} options={priorityOptions}>
					<svelte:fragment slot="render-option-value-single" let:optionValue>
						<div class="select-item">
							<IssuePriorityIcon priority={optionValue} top={1} />
							<div class="select-item-label">{ISSUE_PRIOTIRY_OBJ[optionValue]}</div>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="render-option-dropdown-item" let:option>
						<div class="select-item">
							<IssuePriorityIcon priority={option.value} top={1} />
							<div class="select-item-label">{ISSUE_PRIOTIRY_OBJ[option.value]}</div>
						</div>
					</svelte:fragment>
				</Select>
			</svelte:fragment>
		</Field>

		<div class="actions">
			<Button class="action-button" type="submit" variant="primary" isWorking={isLoading}>
				Create Issue
			</Button>
			<Button class="action-button" type="button" variant="empty" on:click={closeModal}>
				Cancel
			</Button>
		</div>
	</svelte:fragment>
</Form>

<style lang="scss">
	@import '../../lib/styles/variables';
	@import '../../lib/styles/mixins';

	.heading {
		padding-bottom: 15px;

		@include font-size(21);
	}

	:global(.form) {
		padding: 25px 40px 35px;

		:global(.select-item) {
			align-items: center;
			display: flex;
			margin-right: 15px;

			:global(.select-item-label) {
				padding: 0 3px 0 6px;
				text-transform: capitalize;
			}
		}

		.divider {
			border-top: 1px solid $borderLightest;
			margin-top: 22px;
		}

		.actions {
			display: flex;
			justify-content: flex-end;
			padding-top: 30px;

			:global(.action-button) {
				margin-left: 10px;
			}
		}
	}
</style>
