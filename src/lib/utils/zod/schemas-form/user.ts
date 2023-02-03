import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const userFormSchema = zfd.formData({
	name: zfd.text(
		z
			.string({ required_error: 'Name is required' })
			.max(100, 'Name must be at most 100 characters')
			.trim()
	),
	email: zfd.text(
		z
			.string({ required_error: 'Email is required' })
			.email('Invalid email')
			.max(200, 'Name must be at most 200 characters')
			.trim()
	),
	avatarUrl: zfd.text(z.string().max(2000, 'Url must be at most 2000 characters').optional()),
	url: zfd.text(z.string().url('Url is invalid').optional()),
	description: zfd.text(z.string().optional())
});
