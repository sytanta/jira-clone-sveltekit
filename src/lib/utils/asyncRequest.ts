export async function asyncRequest<T extends (...args: any) => Promise<any> | any>(
	func: T
): Promise<{ data: Awaited<ReturnType<T>> | null; error: any | null }> {
	try {
		const data = await func();
		return { data, error: null };
	} catch (e) {
		return { data: null, error: e };
	}
}
