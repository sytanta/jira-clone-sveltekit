import type { Comment } from '@prisma/client';
import type { CommentForUpdate } from '$lib/types';

import prisma from '$lib/server/prisma';
import { asyncRequest } from '$lib/utils/asyncRequest';
import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

export const createComment = async (data: Comment) =>
	await asyncRequest(
		async () =>
			await prisma.comment.create({
				data
			})
	);

export const getComment = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.comment.findUnique({
				where: {
					id
				}
			})
	);

export const updateComment = async function (data: CommentForUpdate) {
	const { data: comment } = await asyncRequest(
		async () =>
			await prisma.comment.findUnique({
				where: {
					id: data.id
				}
			})
	);

	if (!comment) return { data: null, error: { message: 'Comment not found' } };

	const updateData = pickDefinedValues(data, ['id']);

	return await asyncRequest(
		async () =>
			await prisma.comment.update({
				where: {
					id: data.id
				},
				data: updateData
			})
	);
};

export const deleteComment = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.comment.delete({
				where: {
					id
				}
			})
	);
