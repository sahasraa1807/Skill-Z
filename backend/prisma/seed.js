const bcrypt = require('bcryptjs');
const prisma = require('../src/config/prisma');

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

  const passwordHash = await bcrypt.hash('password123', 10);

  // Helper map for skills
  const dbSkills = await prisma.skill.findMany();
  const skillMap = {};
  dbSkills.forEach(s => { skillMap[s.name] = s.id; });

  console.log('Seeding sample users...');
  
  // 1. Alice (Frontend Dev)
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Chen',
      email: 'alice@example.com',
      username: 'alice_frontend',
      passwordHash,
      bio: 'Frontend architect passionate about polished design systems, React, and TypeScript.',
      location: 'San Francisco, CA',
      onboardingCompleted: true,
      onboardingStep: 6,
      preferences: {
        create: {
          availabilityHours: 15,
          preferWeekdays: true,
          preferEvenings: true,
          experienceLevel: 'EXPERIENCED',
          githubUrl: 'https://github.com/alice',
          portfolioUrl: 'https://alice.dev',
          linkedinUrl: 'https://linkedin.com/in/alice'
        }
      },
      goals: {
        create: [
          { goal: 'OPEN_SOURCE' },
          { goal: 'STARTUP' }
        ]
      }
    }
  });

  if (skillMap['React'] && skillMap['TypeScript'] && skillMap['Next.js'] && skillMap['Tailwind CSS']) {
    await prisma.userSkill.deleteMany({ where: { userId: alice.id } });
    await prisma.userSkill.createMany({
      data: [
        { userId: alice.id, skillId: skillMap['React'], proficiencyLevel: 'ADVANCED' },
        { userId: alice.id, skillId: skillMap['TypeScript'], proficiencyLevel: 'ADVANCED' },
        { userId: alice.id, skillId: skillMap['Next.js'], proficiencyLevel: 'ADVANCED' },
        { userId: alice.id, skillId: skillMap['Tailwind CSS'], proficiencyLevel: 'ADVANCED' },
      ]
    });
  }

  // 2. Bob (AI/ML Engineer)
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Miller',
      email: 'bob@example.com',
      username: 'bob_ai',
      passwordHash,
      bio: 'Machine learning specialist focused on LLMs, NLP, and computer vision models.',
      location: 'Austin, TX',
      onboardingCompleted: true,
      onboardingStep: 6,
      preferences: {
        create: {
          availabilityHours: 20,
          preferWeekends: true,
          preferEvenings: true,
          experienceLevel: 'EXPERIENCED',
          githubUrl: 'https://github.com/bob-ml',
          portfolioUrl: 'https://bobmiller.ai'
        }
      },
      goals: {
        create: [
          { goal: 'HACKATHON' },
          { goal: 'PORTFOLIO' }
        ]
      }
    }
  });

  if (skillMap['Python'] && skillMap['PyTorch'] && skillMap['NLP'] && skillMap['FastAPI']) {
    await prisma.userSkill.deleteMany({ where: { userId: bob.id } });
    await prisma.userSkill.createMany({
      data: [
        { userId: bob.id, skillId: skillMap['Python'], proficiencyLevel: 'ADVANCED' },
        { userId: bob.id, skillId: skillMap['PyTorch'], proficiencyLevel: 'ADVANCED' },
        { userId: bob.id, skillId: skillMap['NLP'], proficiencyLevel: 'INTERMEDIATE' },
        { userId: bob.id, skillId: skillMap['FastAPI'], proficiencyLevel: 'INTERMEDIATE' },
      ]
    });
  }

  // 3. Charlie (Backend & DevOps)
  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      username: 'charlie_backend',
      passwordHash,
      bio: 'Backend enthusiast working with distributed systems, PostgreSQL, Node.js, and Docker.',
      location: 'Seattle, WA',
      onboardingCompleted: true,
      onboardingStep: 6,
      preferences: {
        create: {
          availabilityHours: 12,
          preferWeekdays: true,
          preferMornings: true,
          experienceLevel: 'INTERMEDIATE',
          githubUrl: 'https://github.com/charlied'
        }
      },
      goals: {
        create: [
          { goal: 'STARTUP' },
          { goal: 'LEARNING' }
        ]
      }
    }
  });

  if (skillMap['Node.js'] && skillMap['PostgreSQL'] && skillMap['Docker'] && skillMap['AWS']) {
    await prisma.userSkill.deleteMany({ where: { userId: charlie.id } });
    await prisma.userSkill.createMany({
      data: [
        { userId: charlie.id, skillId: skillMap['Node.js'], proficiencyLevel: 'ADVANCED' },
        { userId: charlie.id, skillId: skillMap['PostgreSQL'], proficiencyLevel: 'ADVANCED' },
        { userId: charlie.id, skillId: skillMap['Docker'], proficiencyLevel: 'INTERMEDIATE' },
        { userId: charlie.id, skillId: skillMap['AWS'], proficiencyLevel: 'INTERMEDIATE' },
      ]
    });
  }

  // 4. Diana (UI/UX Designer)
  const diana = await prisma.user.upsert({
    where: { email: 'diana@example.com' },
    update: {},
    create: {
      name: 'Diana Prince',
      email: 'diana@example.com',
      username: 'diana_design',
      passwordHash,
      bio: 'Product designer creating intuitive user experiences and design systems.',
      location: 'New York, NY',
      onboardingCompleted: true,
      onboardingStep: 6,
      preferences: {
        create: {
          availabilityHours: 10,
          preferWeekends: true,
          preferMornings: true,
          experienceLevel: 'INTERMEDIATE',
          portfolioUrl: 'https://diana.design',
          linkedinUrl: 'https://linkedin.com/in/diana'
        }
      },
      goals: {
        create: [
          { goal: 'PORTFOLIO' },
          { goal: 'HACKATHON' }
        ]
      }
    }
  });

  if (skillMap['Figma'] && skillMap['UI/UX Design'] && skillMap['HTML'] && skillMap['CSS']) {
    await prisma.userSkill.deleteMany({ where: { userId: diana.id } });
    await prisma.userSkill.createMany({
      data: [
        { userId: diana.id, skillId: skillMap['Figma'], proficiencyLevel: 'ADVANCED' },
        { userId: diana.id, skillId: skillMap['UI/UX Design'], proficiencyLevel: 'ADVANCED' },
        { userId: diana.id, skillId: skillMap['HTML'], proficiencyLevel: 'INTERMEDIATE' },
        { userId: diana.id, skillId: skillMap['CSS'], proficiencyLevel: 'INTERMEDIATE' },
      ]
    });
  }

  console.log('Seeded sample users (Alice, Bob, Charlie, Diana)');

  console.log('Seeding sample projects...');

  // Project 1 by Bob: "AI Research Assistant"
  const existingP1 = await prisma.project.findFirst({ where: { title: 'AI Code Reviewer & Assistant' } });
  if (!existingP1) {
    await prisma.project.create({
      data: {
        ownerId: bob.id,
        title: 'AI Code Reviewer & Assistant',
        description: 'An open-source intelligent assistant that analyzes pull requests, finds bugs, and suggests performance improvements using LLMs.',
        domain: 'AI / Machine Learning',
        projectType: 'OPEN_SOURCE',
        duration: '3 months',
        commitmentHours: 10,
        maxTeamSize: 4,
        status: 'RECRUITING',
        teamMembers: {
          create: {
            userId: bob.id,
            role: 'Owner'
          }
        },
        roles: {
          create: [
            {
              roleName: 'Frontend Engineer',
              openings: 1,
              skills: {
                create: [
                  { skillId: skillMap['React'] },
                  { skillId: skillMap['TypeScript'] },
                  { skillId: skillMap['Tailwind CSS'] }
                ]
              }
            },
            {
              roleName: 'Backend & DevOps Engineer',
              openings: 1,
              skills: {
                create: [
                  { skillId: skillMap['Node.js'] },
                  { skillId: skillMap['Docker'] },
                  { skillId: skillMap['PostgreSQL'] }
                ]
              }
            }
          ]
        }
      }
    });
  }

  // Project 2 by Alice: "DevFlow - Team Collaboration Hub"
  const existingP2 = await prisma.project.findFirst({ where: { title: 'DevFlow - Team Collaboration Hub' } });
  if (!existingP2) {
    await prisma.project.create({
      data: {
        ownerId: alice.id,
        title: 'DevFlow - Team Collaboration Hub',
        description: 'Modern developer collaboration workspace integrating task tracking, git events, and real-time project standups.',
        domain: 'Web Development',
        projectType: 'STARTUP',
        duration: '2 months',
        commitmentHours: 15,
        maxTeamSize: 5,
        status: 'RECRUITING',
        teamMembers: {
          create: {
            userId: alice.id,
            role: 'Owner'
          }
        },
        roles: {
          create: [
            {
              roleName: 'Backend Architect',
              openings: 1,
              skills: {
                create: [
                  { skillId: skillMap['PostgreSQL'] },
                  { skillId: skillMap['Node.js'] },
                  { skillId: skillMap['Redis'] }
                ]
              }
            },
            {
              roleName: 'Product & UI/UX Designer',
              openings: 1,
              skills: {
                create: [
                  { skillId: skillMap['Figma'] },
                  { skillId: skillMap['UI/UX Design'] }
                ]
              }
            }
          ]
        }
      }
    });
  }

  console.log('Seeded sample projects!');
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

