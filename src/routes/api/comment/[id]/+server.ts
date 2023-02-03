import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

import { getIssue } from '$lib/server/services/issue';
import { deleteComment, updateComment } from '$lib/server/services/comment';

export const PUT: RequestHandler = async function ({ locals, request, params }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const commentId = params['id'];
	const { issueId, content } = await request.json();

	const { data: issue } = await getIssue(issueId!);

	if (!issue) throw error(404, { message: 'Issue not found' });

	const { error: errorCreateComment } = await updateComment({
		id: commentId!,
		body: content
	});

	if (errorCreateComment) throw error(500, { message: 'Error updating comment' });

	return json({ id: commentId });
};

export const DELETE: RequestHandler = async function ({ locals, params }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const commentId = params['id'];
	const { error } = await deleteComment(commentId!);

	if (error) throw error(500, { message: 'Error deleting comment' });

	return json({ id: commentId });
};
