import { db } from './index'
import { tag, poll, pollOption } from './schema'
import { eq } from 'drizzle-orm'

async function main() {
  console.log('Seeding tags...');
  const tags = ['Akademik', 'Sosial', 'Curhat', 'Kantin'];
  for (const name of tags) {
    const existing = await db.select().from(tag).where(eq(tag.name, name)).limit(1);
    if (existing.length === 0) {
      await db.insert(tag).values({ name });
    }
  }

  console.log('Seeding default poll...');
  const pollQuestion = 'Berapa kali kalian makan geprek dalam satu minggu?';
  const existingPolls = await db.select().from(poll).where(eq(poll.question, pollQuestion)).limit(1);

  if (existingPolls.length === 0) {
    const [insertedPoll] = await db.insert(poll).values({
      question: pollQuestion,
    }).returning();

    await db.insert(pollOption).values([
      { text: 'Setiap hari (Geprek is life)', pollId: insertedPoll.id },
      { text: '2-3 kali seminggu', pollId: insertedPoll.id },
      { text: 'Jarang / Tidak pernah', pollId: insertedPoll.id },
    ]);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
