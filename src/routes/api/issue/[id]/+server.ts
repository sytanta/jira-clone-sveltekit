import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

import { deleteIssue, getIssue, updateIssue } from '$lib/server/services/issue';

export const GET: RequestHandler = async function ({ locals, params }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const { data: issue } = await getIssue(params['id']!);

	if (!issue) throw error(404, { message: 'Issue not found' });

	return json({ issue });
};

export const PUT: RequestHandler = async function ({ locals, params, request }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const issueId = params['id']!;
	const { data: issue } = await getIssue(issueId);

	if (!issue) throw error(404, { message: 'Issue not found' });

	const {
		title,
		type,
		status,
		priority,
		listPosition,
		reporterId,
		description,
		estimate,
		timeSpent,
		timeRemaining,
		assignees
	} = await request.json();

	const { error: errorUpdateIssue } = await updateIssue(
		{
			id: issueId!,
			title,
			type,
			status,
			priority,
			listPosition,
			reporterId,
			description,
			estimate,
			timeSpent,
			timeRemaining
		},
		assignees as string[],
		locals.user.id
	);

	if (errorUpdateIssue) throw error(500, { message: 'Error updating issue' });

	const { data: updatedIssue } = await getIssue(issueId);

	return json({ issue: updatedIssue });
};

export const DELETE: RequestHandler = async function ({ locals, params }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const issueId = params['id'];
	const { error } = await deleteIssue(issueId!);

	if (error) throw error(500, { message: 'Error deleting issue' });

	return json({ id: issueId });
};
