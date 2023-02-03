export type SelectOption = Record<string, any> & {
	label: string;
	value: any[] | string | number | null;
};
