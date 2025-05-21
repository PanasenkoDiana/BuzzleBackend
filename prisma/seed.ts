import { PrismaClient } from "../src/prisma/client";
async function main() {
    const tags = [
        'відпочинок',
        'натхнення',
        'життя',
        'природа',
        'читання',
        'спокій',
        'гармонія',
        'музика',
        'фільми',
        'подорожі'
];
for (const tag of tags) {
    await PrismaClient.tag.create({
      data: { name: tag },
    });
  }

  console.log('Yup!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
    .finally(async () => {
        await PrismaClient.$disconnect();
    });