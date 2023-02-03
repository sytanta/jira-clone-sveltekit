import jwt, { type SignOptions } from 'jsonwebtoken';
import { isPlainObject } from 'lodash';

import { JWT_SECRET } from '$env/static/private';

export const tokenCookiesOptions = {
	path: '/',
	httpOnly: true,
	maxAge: 361 * 24 * 60 * 60 // cookie 360 days
};

export function signToken(payload: string | object | Buffer, options?: SignOptions) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '361 days', // jwt 361 days
		...options
	});
}

export function verifyToken(token: string) {
	try {
		const data = jwt.verify(token, JWT_SECRET);

		if (isPlainObject(data) && (data as { id: string })['id']) {
			return { data, error: null };
		}

		return { data: null, error: 'Invalid token' };
	} catch (e) {
		return { data: null, error: (e as Error).message };
	}
}
