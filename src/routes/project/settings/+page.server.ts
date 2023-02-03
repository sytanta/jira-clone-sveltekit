import { error, redirect, type Actions, type ServerLoad } from '@sveltejs/kit';

import type { ProjectCategory } from '@prisma/client';

import { updateProject } from '$lib/server/services/project';

export const load: ServerLoad = ({ locals }) => {
	if (!locals.user) throw redirect(307, '/authenticate');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw error(401, { message: 'Unauthorized' });

		const data = await request.formData();

		const id = String(data.get('id'));
		if (!id) throw error(404, 'Project not found');

		const { name, url, description, category } = Object.fromEntries(data);

		const { error: updateError } = await updateProject({
			id,
			name: String(name),
			url: String(url),
			description: String(description),
			category: String(category) as ProjectCategory
		});

		if (updateError) throw error(500, { message: 'Error updating project' });
	}
};
