import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.friendRequest.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice',
      username: 'alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: 'password123',
      name: 'Bob',
      username: 'bob',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      password: 'password123',
      name: 'Charlie',
      username: 'charlie',
    },
  });

  await prisma.friendRequest.create({
    data: {
      from: { connect: { id: alice.id } },
      to: { connect: { id: bob.id } },
      status: 'pending',
    },
  });

  await prisma.friendRequest.create({
    data: {
      from: { connect: { id: bob.id } },
      to: { connect: { id: charlie.id } },
      status: 'pending',
    },
  });
  
  await prisma.friendRequest.update({
    where: {
      fromId_toId: {
        fromId: alice.id,
        toId: bob.id,
      },
    },
    data: {
      status: 'accepted',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });