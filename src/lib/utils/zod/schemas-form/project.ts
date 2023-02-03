import { z } from 'zod';

import { PROJECT_CATEGORY } from '$lib/constants/project';

export const projectFormSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, 'Name is required')
		.max(100, 'Name must be at most 100 characters')
		.trim(),
	category: z.enum(PROJECT_CATEGORY),
	url: z.string().url('Url is invalid').optional(),
	description: z.string().optional()
});
