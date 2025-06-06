import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
	const usersData = [
		{
			email: 'alice@example.com',
			password: 'hashedpassword1',
			username: 'alice123',
			name: 'Alice',
			surname: 'Smith',
			profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
		},
		{
			email: 'bob@example.com',
			password: 'hashedpassword2',
			username: 'bobster',
			name: 'Bob',
			surname: 'Johnson',
			profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
		},
		{
			email: 'carol@example.com',
			password: 'hashedpassword3',
			username: 'carol456',
			name: 'Carol',
			surname: 'Davis',
			profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
		},
		{
			email: 'dave@example.com',
			password: 'hashedpassword4',
			username: 'dave789',
			name: 'Dave',
			surname: 'Wilson',
			profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
		},
		{
			email: 'eva@example.com',
			password: 'hashedpassword5',
			username: 'eva_xo',
			name: 'Eva',
			surname: 'Taylor',
			profileImage: 'https://randomuser.me/api/portraits/women/5.jpg',
		},
		{
			email: 'frank@example.com',
			password: 'hashedpassword6',
			username: 'franky',
			name: 'Frank',
			surname: 'Anderson',
			profileImage: 'https://randomuser.me/api/portraits/men/6.jpg',
		},
	];

	for (const user of usersData) {
		await prisma.user.create({ data: user });
	}
}

main()
	.then(() => {
		console.log('✅ Seed complete');
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});