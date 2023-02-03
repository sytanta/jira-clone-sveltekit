import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const commentBodySchem = zfd.text(
	z
		.string({ required_error: 'Comment content is required' })
		.max(50000, 'Comment must be at most 50000 characters')
		.trim()
);

export const commentFormSchema = zfd.formData({
	body: commentBodySchem,
	userId: zfd.text(z.string({ required_error: 'User id is required' })),
	issueId: zfd.text(z.string({ required_error: 'Issue id is required' }))
});
