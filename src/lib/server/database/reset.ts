import prisma from '../prisma';

const tableNames = ['Comment', 'UsersOnIssues', 'Issue', 'User', 'Project'];

export default async () => {
	try {
		// for (const tableName of tableNames) {
		await prisma.comment.deleteMany({});
		await prisma.usersOnIssues.deleteMany({});
		await prisma.issue.deleteMany({});
		await prisma.user.deleteMany({});
		await prisma.project.deleteMany({});
		// await prisma.$executeRaw`DELETE FROM "${tableName}";`;
		// await prisma.$executeRaw`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`;
		// await prisma.$executeRaw`ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`;
		// }
	} catch (e) {
		console.error(e);
	}
};
