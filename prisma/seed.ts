import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding tags...');
  const tags = ['Akademik', 'Sosial', 'Curhat', 'Kantin'];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
  }

  console.log('Seeding default poll...');
  const pollQuestion = 'Berapa kali kalian makan geprek dalam satu minggu?';
  const existingPoll = await prisma.poll.findFirst({
    where: { question: pollQuestion },
  });

  if (!existingPoll) {
    await prisma.poll.create({
      data: {
        question: pollQuestion,
        options: {
          create: [
            { text: 'Setiap hari (Geprek is life)' },
            { text: '2-3 kali seminggu' },
            { text: 'Jarang / Tidak pernah' },
          ],
        },
      },
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
