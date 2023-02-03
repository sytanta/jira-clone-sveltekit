import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

import { getIssue } from '$lib/server/services/issue';
import { createComment } from '$lib/server/services/comment';

export const POST: RequestHandler = async function ({ locals, request }) {
	if (!locals.user) throw redirect(307, '/authenticate');

	const { issueId, content } = await request.json();

	const { data: issue } = await getIssue(issueId!);

	if (!issue) throw error(404, { message: 'Issue not found' });

	const id = uuidv4();
	const { error: errorCreateComment } = await createComment({
		id,
		body: content,
		userId: locals.user.id,
		issueId,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	if (errorCreateComment) throw error(500, { message: 'Error creating issue' });

	return json({ id });
};
