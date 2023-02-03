import { v4 as uuidv4 } from 'uuid';

import prisma from '../prisma';

import type { Comment, Issue, Project, User } from '@prisma/client';

const seedProject = (): Promise<Project> =>
	prisma.project.create({
		data: {
			id: uuidv4(),
			name: 'Project name',
			url: 'https://www.testurl.com',
			description: 'Project description',
			category: 'software'
		}
	});

const seedUsers = (project: Project): Promise<User[]> => {
	const users = [
		prisma.user.create({
			data: {
				id: uuidv4(),
				email: 'gaben@jira.test',
				name: 'Gaben',
				avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
				projectId: project.id
			}
		}),
		prisma.user.create({
			data: {
				id: uuidv4(),
				email: 'yoda@jira.test',
				name: 'Yoda',
				avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
				projectId: project.id
			}
		})
	];

	return Promise.all(users);
};

const seedIssues = (project: Project, users: User[]): Promise<Issue[]> => {
	const issues = [
		prisma.issue.create({
			data: {
				id: uuidv4(),
				title: 'Issue title 1',
				type: 'task',
				status: 'backlog',
				priority: 'lowest',
				listPosition: 1,
				reporterId: users[0].id,
				projectId: project.id
			}
		}),
		prisma.issue.create({
			data: {
				id: uuidv4(),
				title: 'Issue title 2',
				type: 'task',
				status: 'backlog',
				priority: 'medium',
				listPosition: 2,
				estimate: 5,
				description: 'Issue description 2',
				reporterId: users[0].id,
				projectId: project.id,
				User: {
					create: [
						{
							assignedBy: users[0].name,
							assignedAt: new Date(),
							user: {
								connect: {
									id: users[0].id
								}
							}
						}
					]
				}
			}
		}),
		prisma.issue.create({
			data: {
				id: uuidv4(),
				title: 'Issue title 3',
				type: 'story',
				status: 'selected',
				priority: 'high',
				listPosition: 3,
				estimate: 10,
				description: 'Issue description 3',
				reporterId: users[0].id,
				projectId: project.id,
				User: {
					create: [
						{
							assignedBy: users[0].name,
							assignedAt: new Date(),
							user: {
								connect: {
									id: users[0].id
								}
							}
						},
						{
							assignedBy: users[1].name,
							assignedAt: new Date(),
							user: {
								connect: {
									id: users[1].id
								}
							}
						}
					]
				}
			}
		})
	];

	return Promise.all(issues);
};

const seedComments = (issue: Issue, user: User): Promise<Comment> =>
	prisma.comment.create({
		data: {
			id: uuidv4(),
			body: 'Comment body',
			issueId: issue.id,
			userId: user.id
		}
	});

const createTestAccount = async (): Promise<User> => {
	const project = await seedProject();
	const users = await seedUsers(project);
	const issues = await seedIssues(project, users);
	await seedComments(issues[0], users[0]);

	return users[0];
};

export default createTestAccount;
