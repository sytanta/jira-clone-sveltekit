import { pick } from 'lodash';

import type { UserData } from '$lib/types';

export default function formatUserForFrontend(user: UserData) {
	return pick(user, ['id', 'name', 'avatarUrl']);
}
