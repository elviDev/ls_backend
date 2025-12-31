import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create genres
  const genres = [
    { name: 'Technology', slug: 'technology', description: 'Technology and innovation content' },
    { name: 'Music', slug: 'music', description: 'Music shows and entertainment' },
    { name: 'News', slug: 'news', description: 'News and current affairs' },
    { name: 'Talk Show', slug: 'talk-show', description: 'Talk shows and interviews' },
    { name: 'Sports', slug: 'sports', description: 'Sports coverage and commentary' },
    { name: 'Business', slug: 'business', description: 'Business and finance content' },
    { name: 'Education', slug: 'education', description: 'Educational and learning content' },
    { name: 'Entertainment', slug: 'entertainment', description: 'General entertainment programming' },
    { name: 'Health', slug: 'health', description: 'Health and wellness topics' },
    { name: 'Comedy', slug: 'comedy', description: 'Comedy and humor shows' },
  ];

  console.log('Creating genres...');
  for (const genreData of genres) {
    await prisma.genre.upsert({
      where: { slug: genreData.slug },
      update: {},
      create: genreData,
    });
  }

  console.log('Seed data created:', { 
    genres: genres.length
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