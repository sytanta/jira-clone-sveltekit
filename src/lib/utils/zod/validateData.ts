import type { Schema } from 'zod';

export function validateFormData(formData: FormData, zodSchema: Schema) {
	const validation = zodSchema.safeParse(Object.fromEntries(formData));

	if (validation.success) return { success: true, data: validation.data };

	return { success: false, errors: validation.error.flatten().fieldErrors };
}

export function validateSingleField(
	fieldData: string | number | symbol | null | undefined,
	zodSchema: Schema
) {
	const validation = zodSchema.safeParse(fieldData);

	if (validation.success) return { success: true, data: validation.data };
	return { success: false, error: validation.error.flatten().formErrors[0] };
}
