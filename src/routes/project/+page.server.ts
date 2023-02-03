import { error, redirect, type Actions } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

import type { IssuePriority, IssueStatus, IssueType } from '@prisma/client';
import type { PageServerLoad } from '../$types';

import prisma from '$lib/server/prisma';
import { createIssue } from '$lib/server/services/issue';
import { asyncRequest } from '$lib/utils/asyncRequest';

export const load: PageServerLoad = () => {
	throw redirect(307, '/project/board');
};

export const actions: Actions = {
	'create-issue': async ({ request, locals }) => {
		if (!locals.user) throw error(401, { message: 'Unauthorized' });

		const data = await request.formData();

		const projectId = String(data.get('projectId'));
		if (!projectId) throw error(404, 'Project not found');

		const { title, type, status, priority, reporterId, description, userIds } =
			Object.fromEntries(data);
		const issueStatus = String(status) as IssueStatus;
		const issueReporterId = String(reporterId);

		// Calculate "listPosition"
		const listPosition = await calculateListPosition(projectId, issueStatus);

		const { error: createIssueError } = await createIssue(
			{
				id: uuidv4(),
				projectId,
				title: String(title),
				type: String(type) as IssueType,
				status: issueStatus,
				priority: String(priority) as IssuePriority,
				reporterId: issueReporterId,
				description: String(description),
				listPosition,
				descriptionText: null,
				estimate: null,
				timeSpent: null,
				timeRemaining: null,
				createdAt: new Date(),
				updatedAt: null
			},
			issueReporterId,
			String(userIds).split(',').filter(Boolean)
		);

		if (createIssueError) throw error(500, { message: 'Error creating issue' });
	}
};

const calculateListPosition = async (projectId: string, status: IssueStatus): Promise<number> => {
	const issues = await asyncRequest(
		async () =>
			await prisma.issue.findMany({
				where: { projectId, status },
				select: {
					listPosition: true
				}
			})
	);

	const listPositions = issues.data?.map(({ listPosition }) => listPosition);

	if (listPositions?.length) {
		return Math.min(...listPositions) - 1;
	}

	return 1;
};
