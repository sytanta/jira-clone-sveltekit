import type { Project } from '@prisma/client';
import type { ProjectForUpdate } from '$lib/types';

import prisma from '$lib/server/prisma';
import { asyncRequest } from '$lib/utils/asyncRequest';
import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

export const createProject = async (data: Project) =>
	await asyncRequest(
		async () =>
			await prisma.project.create({
				data
			})
	);

export const updateProject = async function (data: ProjectForUpdate) {
	const { data: project } = await asyncRequest(
		async () => await prisma.project.findUnique({ where: { id: data.id } })
	);

	if (!project) return { data: null, error: 'Project not found' };

	const updateData = pickDefinedValues(data, ['id']);

	return await asyncRequest(
		async () =>
			await prisma.project.update({
				where: {
					id: data.id
				},
				data: updateData
			})
	);
};

export const getProject = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.project.findUnique({
				where: {
					id
				},
				select: {
					id: true,
					name: true,
					category: true,
					description: true,
					url: true,
					Issue: {
						select: {
							id: true,
							title: true,
							type: true,
							priority: true,
							status: true,
							listPosition: true,
							createdAt: true,
							updatedAt: true,
							User: {
								select: { assignedAt: true, userId: true }
							}
						}
					},
					User: { select: { id: true, name: true, email: true, avatarUrl: true } }
				}
			})
	);

export const deleteProject = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.project.delete({
				where: {
					id
				}
			})
	);
