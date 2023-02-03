import { json, redirect, type RequestHandler } from '@sveltejs/kit';

import { findIssues } from '$lib/server/services/issue';

export const GET: RequestHandler = async function ({ locals, url }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const { projectId, searchTerm } = Object.fromEntries(url.searchParams);

	const { data } = await findIssues(projectId, searchTerm);

	return json({ issues: data || [] });
};
