import type { Handle } from '@sveltejs/kit';

import { getUser } from '$lib/server/services/user';
import { verifyToken } from '$lib/utils/auth';

export const handle: Handle = async function ({ event, resolve }) {
	const token = event.cookies.get('auth_token');

	if (!token) return await resolve(event);

	const { data: tokenPayload } = verifyToken(token);

	if (!tokenPayload) return await resolve(event);

	const { data: user } = await getUser((tokenPayload as { id: string }).id);

	if (!user) return await resolve(event);

	event.locals.user = user;
	return await resolve(event);
};
