import { PrismaClient } from '@prisma/client';
import { uniqueId } from 'lodash-es';

const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.author.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      id: uniqueId('user'),
      email: 'alice@prisma.io',
      name: 'Alice',
      age: 33,
      Joke: {
        create: {
          text: 'Check out Prisma with Next.js'
        }
      }
    }
  });

  console.log(alice);

  const bob = await prisma.author.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      id: uniqueId('user'),
      email: 'bob@prisma.io',
      name: 'Bob',
      age: 22,
      Joke: {
        create: [
          {
            text: 'Follow Prisma on Twitter'
          },
          {
            text: 'Follow Nexus on Twitter'
          }
        ]
      }
    }
  });
  console.log({ bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
