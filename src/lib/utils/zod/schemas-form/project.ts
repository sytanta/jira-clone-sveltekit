import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { PROJECT_CATEGORY } from '$lib/constants/project';

export const projectFormSchema = zfd.formData({
	name: zfd.text(
		z
			.string({ required_error: 'Name is required' })
			.max(100, 'Name must be at most 100 characters')
			.trim()
	),
	category: zfd.text(z.enum(PROJECT_CATEGORY)),
	url: zfd.text(z.string().url('Url is invalid').optional()),
	description: zfd.text(z.string().optional())
});
