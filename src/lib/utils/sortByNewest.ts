const sortByNewest: <T extends Record<string, any>>(items: T[], sortField: keyof T) => T[] = (
	items,
	sortField
) => {
	return items.sort((a, b) => -a[sortField].localeCompare(b[sortField]));
};

export default sortByNewest;
