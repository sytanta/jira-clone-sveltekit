import type { User } from '@prisma/client';
import type { UserForUpdate } from '$lib/types';

import prisma from '$lib/server/prisma';
import { asyncRequest } from '$lib/utils/asyncRequest';
import { pickDefinedValues } from '$lib/utils/pickDefinedValues';

export const createUser = async (data: User) =>
	await asyncRequest(
		async () =>
			await prisma.user.create({
				data
			})
	);

export const updateUser = async function (data: UserForUpdate) {
	const { data: user } = await asyncRequest(
		async () => await prisma.user.findUnique({ where: { id: data.id } })
	);

	if (!user) return { data: null, error: 'User not found' };

	const updateData = pickDefinedValues(data, ['id']);

	return await asyncRequest(
		async () =>
			await prisma.user.update({
				where: {
					id: data.id
				},
				data: updateData
			})
	);
};

export const getUser = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.user.findUnique({
				where: {
					id
				}
			})
	);

export const deleteUser = async (id: string) =>
	await asyncRequest(
		async () =>
			await prisma.user.delete({
				where: {
					id
				}
			})
	);
