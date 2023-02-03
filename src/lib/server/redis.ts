import { Redis } from 'ioredis';

import type { IssueDataSafe, ProjectDataSafe } from '$lib/types';

import { REDIS_URI } from '$env/static/private';

const redis = new Redis();

export async function getFromCache(
	type: 'project' | 'issue' | 'search',
	queryData: string,
	userId: string
) {
	switch (type) {
		case 'project':
			return await redis.get(getProjectQuery(queryData, userId));

		case 'issue':
			return await redis.get(getIssueQuery(queryData, userId));

		case 'search':
			return await redis.get(getSearchIssuesQuery(queryData, userId));

		default:
			return null;
	}
}

export function getProjectQuery(id: string, userId: string) {
	return `/api/project/get-project-by-user/${userId}/${id}`;
}

export function getIssueQuery(id: string, userId: string) {
	return `/api/issue/${userId}/${id}`;
}

export function getSearchIssuesQuery(searchTerm: string, userId: string) {
	return `/api/issue/search/${userId}/${searchTerm}`;
}

export function cacheProject(id: string, data: ProjectDataSafe, userId: string) {
	redis.set(getProjectQuery(id, userId), JSON.stringify(data));
}

export function cacheIssue(id: string, data: IssueDataSafe, userId: string) {
	redis.set(getIssueQuery(id, userId), JSON.stringify(data));
}

export function cacheSearchIssuesResult(searchTerm: string, data: IssueDataSafe[], userId: string) {
	redis.set(getSearchIssuesQuery(searchTerm, userId), JSON.stringify(data));
}

export function removeProjectCache(id: string, userId: string) {
	redis.del(getProjectQuery(id, userId));
}

export function removeIssueCache(id: string, userId: string) {
	redis.del(getIssueQuery(id, userId));
}

// export async function removeSearchIssuesResultCache(userId: string) {
// 	const stream = redis.scanStream({
// 		match: `/api/issue/search/${userId}:*`
// 	});

// 	stream.on('data', function (keys: string[]) {
// 		// `keys` is an array of strings representing key names
// 		if (keys.length) {
// 			const pipeline = redis.pipeline();
// 			keys.forEach(function (key) {
// 				pipeline.del(key);
// 			});
// 			pipeline.exec();
// 		}
// 	});
// }
