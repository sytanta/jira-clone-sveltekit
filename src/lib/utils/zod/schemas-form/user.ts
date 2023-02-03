import { z } from 'zod';

export const userFormSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, 'Name is required')
		.max(100, 'Name must be at most 100 characters')
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.min(1, 'Email is required')
		.email('Invalid email')
		.max(200, 'Name must be at most 200 characters')
		.trim(),
	avatarUrl: z.string().max(2000, 'Url must be at most 2000 characters').optional(),
	url: z.string().url('Url is invalid').optional(),
	description: z.string().optional()
});
