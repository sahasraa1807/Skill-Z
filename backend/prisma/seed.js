const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const skills = [
  // Frontend
  { name: 'React', category: 'Frontend' },
  { name: 'Vue', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  // Backend
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'Ruby on Rails', category: 'Backend' },
  { name: 'Go', category: 'Backend' },
  { name: 'PHP', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  // Database
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'SQLite', category: 'Database' },
  { name: 'Firebase', category: 'Database' },
  { name: 'Prisma', category: 'Database' },
  // AI/ML
  { name: 'Python', category: 'AI/ML' },
  { name: 'TensorFlow', category: 'AI/ML' },
  { name: 'PyTorch', category: 'AI/ML' },
  { name: 'scikit-learn', category: 'AI/ML' },
  { name: 'Machine Learning', category: 'AI/ML' },
  { name: 'Computer Vision', category: 'AI/ML' },
  { name: 'NLP', category: 'AI/ML' },
  { name: 'Data Science', category: 'AI/ML' },
  { name: 'Pandas', category: 'AI/ML' },
  // Mobile
  { name: 'React Native', category: 'Mobile' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Swift', category: 'Mobile' },
  { name: 'Kotlin', category: 'Mobile' },
  { name: 'Android', category: 'Mobile' },
  { name: 'iOS', category: 'Mobile' },
  // DevOps
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'GCP', category: 'DevOps' },
  { name: 'Azure', category: 'DevOps' },
  { name: 'CI/CD', category: 'DevOps' },
  { name: 'Linux', category: 'DevOps' },
  // Design
  { name: 'Figma', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Adobe XD', category: 'Design' },
  { name: 'Canva', category: 'Design' },
  // Other
  { name: 'Git', category: 'Other' },
  { name: 'REST APIs', category: 'Other' },
  { name: 'GraphQL', category: 'Other' },
  { name: 'Blockchain', category: 'Other' },
  { name: 'Cybersecurity', category: 'Other' },
  { name: 'Testing', category: 'Other' },
  { name: 'Agile', category: 'Other' },
];

const interests = [
  'AI / Machine Learning',
  'Web Development',
  'Mobile Development',
  'Computer Vision',
  'NLP',
  'EdTech',
  'HealthTech',
  'FinTech',
  'Cybersecurity',
  'Open Source',
  'Game Development',
  'Blockchain',
  'Data Science',
  'DevOps',
  'Accessibility',
  'AR/VR',
  'IoT',
  'Social Impact',
  'Climate Tech',
  'E-commerce',
];

async function main() {
  console.log('Seeding skills...');
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log(`Seeded ${skills.length} skills`);

  console.log('Seeding interests...');
  for (const name of interests) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${interests.length} interests`);

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
