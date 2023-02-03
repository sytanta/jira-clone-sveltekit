import { IssuePriority, IssueStatus, IssueType } from '@prisma/client';

export const ISSUE_TYPE: [typeof IssueType.task, typeof IssueType.bug, typeof IssueType.story] = [
	IssueType.task,
	IssueType.bug,
	IssueType.story
];

export const ISSUE_STATUS: [
	typeof IssueStatus.backlog,
	typeof IssueStatus.selected,
	typeof IssueStatus.inprogress,
	typeof IssueStatus.done
] = [IssueStatus.backlog, IssueStatus.selected, IssueStatus.inprogress, IssueStatus.done];

export const ISSUE_PRIOTIRY: [
	typeof IssuePriority.highest,
	typeof IssuePriority.high,
	typeof IssuePriority.medium,
	typeof IssuePriority.low,
	typeof IssuePriority.lowest
] = [
	IssuePriority.highest,
	IssuePriority.high,
	IssuePriority.medium,
	IssuePriority.low,
	IssuePriority.lowest
];

export const ISSUE_TYPE_OBJ = {
	[IssueType.task]: IssueType.task,
	[IssueType.bug]: IssueType.bug,
	[IssueType.story]: IssueType.story
};

export const ISSUE_STATUS_OBJ = {
	[IssueStatus.backlog]: IssueStatus.backlog,
	[IssueStatus.selected]: 'Selected for development',
	[IssueStatus.inprogress]: 'In progress',
	[IssueStatus.done]: IssueStatus.done
};

export const ISSUE_PRIOTIRY_OBJ = {
	[IssuePriority.highest]: IssuePriority.highest,
	[IssuePriority.high]: IssuePriority.high,
	[IssuePriority.medium]: IssuePriority.medium,
	[IssuePriority.low]: IssuePriority.low,
	[IssuePriority.lowest]: IssuePriority.lowest
};
