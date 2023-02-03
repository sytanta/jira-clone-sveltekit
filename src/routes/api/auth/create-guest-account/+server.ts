import { error, json, type RequestHandler } from '@sveltejs/kit';

import createGuestAccount from '$lib/server/database/createGuestAccount';
import { asyncRequest } from '$lib/utils/asyncRequest';
import { signToken, tokenCookiesOptions } from '$lib/utils/auth';

export const POST: RequestHandler = async function ({ cookies }) {
	const { data: user, error } = await asyncRequest(createGuestAccount);
	console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzz', error);
	if (!user) throw error(500, { message: 'Error creating guest account' });

	const token = signToken({ id: user.id });
	cookies.set('auth_token', token, tokenCookiesOptions);

	return json({ success: true });
};
