import type { Issue } from '@prisma/client';
import type { IssueForUpdate } from '$lib/types';

import prisma from '$lib/server/prisma';
import { asyncRequest } from '$lib/utils/asyncRequest';
import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

export const createIssue = async (data: Issue, reporterId: string, userIds: string[]) => {
	const users = userIds.map((id) => ({
		assignedAt: new Date(),
		assignedBy: reporterId,
		user: {
			connect: {
				id
			}
		}
	}));

	return await asyncRequest(
		async () =>
			await prisma.issue.create({
				data: userIds.length ? { ...data, User: { create: users } } : data
			})
	);
};

export const updateIssue = async function (
	data: IssueForUpdate,
	assignees?: string[] | undefined,
	assigner?: string | undefined
) {
	const { data: issue } = await asyncRequest(
		async () => await prisma.issue.findUnique({ where: { id: data.id } })
	);

	if (!issue) return { data: null, error: 'Issue not found' };

	const updatedData = pickDefinedValues(data, ['id']);

	const assigneesData =
		assignees !== undefined && assigner
			? assignees.map((id) => ({
					assignedAt: new Date(),
					assignedBy: assigner,
					user: {
						connect: {
							id
						}
					}
			  }))
			: undefined;

	return await asyncRequest(
		async () =>
			await prisma.issue.update({
				where: {
					id: data.id
				},
				data:
					assigneesData !== undefined
						? {
								...updatedData,
								User: {
									deleteMany: {},
									create: assigneesData
								}
						  }
						: updatedData
			})
	);
};

export const getIssue = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.issue.findUnique({
				where: {
					id
				},
				select: {
					id: true,
					type: true,
					status: true,
					priority: true,
					title: true,
					description: true,
					reporterId: true,
					timeSpent: true,
					timeRemaining: true,
					estimate: true,
					createdAt: true,
					updatedAt: true,
					User: {
						select: { assignedAt: true, userId: true }
					},
					Comment: {
						select: {
							id: true,
							body: true,
							createdAt: true,
							User: {
								select: { id: true, name: true, avatarUrl: true, createdAt: true }
							}
						}
					}
				}
			})
	);

export const findIssues = async (projectId: string, searchTerm: string) =>
	await asyncRequest(
		async () =>
			await prisma.issue.findMany({
				where: {
					OR: [
						{
							projectId,
							title: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							projectId,
							descriptionText: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
				}
			})
	);

export const deleteIssue = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.issue.delete({
				where: {
					id
				}
			})
	);
