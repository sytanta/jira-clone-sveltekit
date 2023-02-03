export function addSearchParam(currentHref: string, param: string, value: string) {
	const url = new URL(currentHref);
	url.searchParams.set(param, value);

	return url.href;
}

export function removeSearchParam(currentHref: string, param: string) {
	const url = new URL(currentHref);
	url.searchParams.delete(param);

	return url.href;
}
