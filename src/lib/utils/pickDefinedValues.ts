export function pickDefinedValues<T extends Record<string, any>>(
	data: T,
	excludedKeys: undefined | (keyof T)[] = []
) {
	const result: Partial<T> = {};

	for (const key in data) {
		if (data[key] !== undefined && !excludedKeys.includes(key)) result[key] = data[key];
	}

	return result;
}
