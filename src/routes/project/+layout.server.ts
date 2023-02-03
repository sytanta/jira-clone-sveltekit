import type { LayoutServerLoad } from './$types';

import formatUserForFrontend from '$lib/utils/formatUserForFrontend';

export const load: LayoutServerLoad = ({ locals }) => {
	return { user: formatUserForFrontend(locals.user) };
};
