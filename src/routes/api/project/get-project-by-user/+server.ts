import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

import { getProject } from '$lib/server/services/project';

export const GET: RequestHandler = async function ({ locals }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const { projectId } = locals.user;
	if (!projectId) throw error(404, { message: 'Project not found' });

	const { data: project } = await getProject(projectId);

	if (!project) throw error(404, { message: 'Project not found' });

	return json({ project });
};
