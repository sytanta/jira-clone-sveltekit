import { ProjectCategory } from '@prisma/client';

export const PROJECT_CATEGORY: [
	typeof ProjectCategory.software,
	typeof ProjectCategory.marketing,
	typeof ProjectCategory.business
] = [ProjectCategory.software, ProjectCategory.marketing, ProjectCategory.business];

export const PROJECT_CATEGORY_OBJ = {
	[ProjectCategory.software]: ProjectCategory.software,
	[ProjectCategory.marketing]: ProjectCategory.marketing,
	[ProjectCategory.business]: ProjectCategory.business
};
