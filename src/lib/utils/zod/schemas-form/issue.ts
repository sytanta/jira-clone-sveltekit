import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { ISSUE_PRIOTIRY, ISSUE_STATUS, ISSUE_TYPE } from '$lib/constants/issue';

export const issueTitleSchema = zfd.text(
	z
		.string({ required_error: 'Title/summary is required' })
		.max(200, 'Title/summary must be at most 200 characters')
		.trim()
);

export const issueFormSchema = zfd.formData({
	title: issueTitleSchema,
	type: zfd.text(z.enum(ISSUE_TYPE, { required_error: 'Type is required' })),
	status: zfd.text(z.enum(ISSUE_STATUS, { required_error: 'Status is required' })),
	priority: zfd.text(z.enum(ISSUE_PRIOTIRY, { required_error: 'Priority is required' })),
	listPosition: zfd.numeric(
		z.number({
			required_error: 'Position is required',
			invalid_type_error: 'Position must be a float number'
		})
	),
	reporterId: zfd.text(z.string({ required_error: 'Reporter id is required' })),

	description: zfd.text(z.string().optional()),
	descriptionText: zfd.text(z.string().optional()),
	estimate: zfd.numeric(z.number().optional()),
	timeSpent: zfd.numeric(z.number().optional()),
	timeRemaining: zfd.numeric(z.number().optional()),

	projectId: zfd.text(z.string({ required_error: 'Project id is required' }))
});
