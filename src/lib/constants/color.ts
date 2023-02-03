import { IssuePriority, IssueStatus, IssueType } from '@prisma/client';

export const COLORS = {
	primary: '#0052cc', // blue
	success: '#0B875B', // green
	danger: '#E13C3C', // red
	warning: '#F89C1C', // orange
	secondary: '#F4F5F7', // light grey
	empty: 'black',

	textDarkest: '#172b4d',
	textDark: '#42526E',
	textMedium: '#5E6C84',
	textLight: '#8993a4',
	textLink: '#0052cc',

	backgroundDarkPrimary: '#0747A6',
	backgroundMedium: '#dfe1e6',
	backgroundLight: '#ebecf0',
	backgroundLightest: '#F4F5F7',
	backgroundLightPrimary: '#D2E5FE',
	backgroundLightSuccess: '#E4FCEF',

	borderLightest: '#dfe1e6',
	borderLight: '#C1C7D0',
	borderInputFocus: '#4c9aff'
};

export const ISSUE_TYPE_COLORS = {
	[IssueType.task]: '#4FADE6', // blue
	[IssueType.bug]: '#E44D42', // red
	[IssueType.story]: '#65BA43' // green
};

export const ISSUE_PRIORITY_COLORS = {
	[IssuePriority.highest]: '#CD1317', // red
	[IssuePriority.high]: '#E9494A', // orange
	[IssuePriority.medium]: '#E97F33', // orange
	[IssuePriority.low]: '#2D8738', // green
	[IssuePriority.lowest]: '#57A55A' // green
};

export const ISSUE_STATUS_COLORS = {
	[IssueStatus.backlog]: '#42526E', // --textDark
	[IssueStatus.inprogress]: '#FFF',
	[IssueStatus.selected]: '#42526E',
	[IssueStatus.done]: '#FFF'
};

export const ISSUE_STATUS_BACKGROUND_COLORS = {
	[IssueStatus.backlog]: '#dfe1e6', // --backgroundMedium
	[IssueStatus.inprogress]: '#0052cc', // --primary
	[IssueStatus.selected]: '#dfe1e6', // --backgroundMedium
	[IssueStatus.done]: '#0B875B' // --success
};
