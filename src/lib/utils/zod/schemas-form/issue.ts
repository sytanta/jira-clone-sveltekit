import { z } from 'zod';

import { ISSUE_PRIOTIRY, ISSUE_STATUS, ISSUE_TYPE } from '$lib/constants/issue';

export const issueTitleSchema = z
	.string({ required_error: 'Title/summary is required' })
	.min(1, 'Title/summary is required')
	.max(200, 'Title/summary must be at most 200 characters')
	.trim();

export const issueFormSchema = z.object({
	title: issueTitleSchema,
	type: z.enum(ISSUE_TYPE, { required_error: 'Type is required' }),
	status: z.enum(ISSUE_STATUS, { required_error: 'Status is required' }),
	priority: z.enum(ISSUE_PRIOTIRY, { required_error: 'Priority is required' }),
	listPosition: z.coerce.number({
		required_error: 'Position is required',
		invalid_type_error: 'Position must be a float number'
	}),
	reporterId: z.string({ required_error: 'Reporter id is required' }),

	description: z.string().optional(),
	descriptionText: z.string().optional(),
	estimate: z.number().optional(),
	timeSpent: z.number().optional(),
	timeRemaining: z.number().optional(),

	projectId: z.string({ required_error: 'Project id is required' })
});
