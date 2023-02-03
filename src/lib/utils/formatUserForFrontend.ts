import pick from 'lodash/pick';

import type { UserData } from '$lib/types';

export default function formatUserForFrontend(user: UserData) {
	return pick(user, ['id', 'name', 'avatarUrl']);
}
