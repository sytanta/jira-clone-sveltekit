import { z } from 'zod';

export const commentBodySchem = z
	.string({ required_error: 'Comment content is required' })
	.min(1, 'Comment content is required')
	.max(50000, 'Comment must be at most 50000 characters')
	.trim();

export const commentFormSchema = z.object({
	body: commentBodySchem,
	userId: z.string({ required_error: 'User id is required' }),
	issueId: z.string({ required_error: 'Issue id is required' })
});
