import type { zfd } from 'zod-form-data';

import type { Comment, Issue, Project, User } from '@prisma/client';

import type { getProject } from '$lib/server/services/project';
import type { getIssue } from '$lib/server/services/issue';
import type { getUser } from '$lib/server/services/user';
import type formatUserForFrontend from '$lib/utils/formatUserForFrontend';

/* User types */
export type UserForUpdate = Partial<User> & { id: string };

export type UserData = NonNullable<Awaited<ReturnType<typeof getUser>>['data']>;

export type UserDataSafe = ReturnType<typeof formatUserForFrontend>;

/* Issue types */
export type IssueForUpdate = Partial<Issue> & { id: string };

export type IssueDataSafe = NonNullable<Awaited<ReturnType<typeof getIssue>>['data']>;

/* Project types */
export type ProjectForUpdate = Partial<Project> & { id: string };

export type ProjectDataSafe = NonNullable<Awaited<ReturnType<typeof getProject>>['data']>;

/* Comment types */
export type CommentForUpdate = Partial<Comment> & { id: string };

export type CommentDataSafe = IssueDataSafe['Comment'][number];

/* Zod schemas */
export type ZodSchema = ReturnType<typeof zfd.formData>;

/* Form errors */
export type FormErrors = Record<string, string[] | undefined> | null | undefined;
