const prisma = require('../src/config/prisma');

async function main() {
  console.log('Replacing demo team project with random real-world project...');

  const sahasra = await prisma.user.findUnique({
    where: { email: 'sahasrambati09@gmail.com' }
  });

  if (!sahasra) {
    console.error('User sahasra not found!');
    process.exit(1);
  }

  const alice = await prisma.user.findFirst({ where: { email: 'alice@example.com' } });

  const skills = await prisma.skill.findMany();
  const skillMap = {};
  skills.forEach(s => skillMap[s.name] = s.id);

  // Delete previous test projects
  const oldProjects = await prisma.project.findMany({
    where: {
      OR: [
        { title: 'Skillz AI Engine & Collaboration Hub' },
        { title: { contains: 'EcoTrack' } }
      ]
    }
  });

  for (const old of oldProjects) {
    await prisma.project.delete({ where: { id: old.id } });
  }

  // 1. Create Random Project: "EcoTrack — Smart Carbon & Sustainability Tracker"
  const project = await prisma.project.create({
    data: {
      ownerId: sahasra.id,
      title: 'EcoTrack — Smart Carbon & Sustainability Tracker',
      description: 'An IoT and web analytics platform helping households and communities measure carbon footprints, track renewable energy habits, and earn rewards for zero-waste milestones.',
      domain: 'Climate Tech',
      projectType: 'STARTUP',
      duration: '4 months',
      commitmentHours: 12,
      maxTeamSize: 5,
      status: 'RECRUITING',
      teamMembers: {
        create: [
          { userId: sahasra.id, role: 'Founder & Product Lead' },
          ...(alice ? [{ userId: alice.id, role: 'Lead Frontend & Mobile Engineer' }] : [])
        ]
      },
      roles: {
        create: [
          {
            roleName: 'IoT & Backend Architect',
            openings: 1,
            skills: {
              create: [
                ...(skillMap['Node.js'] ? [{ skillId: skillMap['Node.js'] }] : []),
                ...(skillMap['PostgreSQL'] ? [{ skillId: skillMap['PostgreSQL'] }] : []),
                ...(skillMap['Docker'] ? [{ skillId: skillMap['Docker'] }] : [])
              ]
            }
          },
          {
            roleName: 'Data Science & Carbon Modeling Lead',
            openings: 1,
            skills: {
              create: [
                ...(skillMap['Python'] ? [{ skillId: skillMap['Python'] }] : []),
                ...(skillMap['Data Science'] ? [{ skillId: skillMap['Data Science'] }] : []),
                ...(skillMap['Machine Learning'] ? [{ skillId: skillMap['Machine Learning'] }] : [])
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Created Project: "${project.title}" (ID: ${project.id})`);

  // 2. Sprint Kanban Tasks
  await prisma.projectTask.createMany({
    data: [
      {
        projectId: project.id,
        creatorId: sahasra.id,
        assigneeId: alice ? alice.id : sahasra.id,
        title: 'Integrate Smart Meter Bluetooth Energy Sync',
        description: 'Connect local smart meter devices over Web Bluetooth to sync live kilowatt metrics',
        status: 'IN_PROGRESS',
        priority: 'HIGH'
      },
      {
        projectId: project.id,
        creatorId: sahasra.id,
        assigneeId: alice ? alice.id : sahasra.id,
        title: 'Design Household Footprint Calculator UI',
        description: 'Create responsive input wizard for monthly utility bills and commuting travel habits',
        status: 'DONE',
        priority: 'MEDIUM'
      },
      {
        projectId: project.id,
        creatorId: sahasra.id,
        assigneeId: null,
        title: 'Build Sensor Timeseries Ingestion Pipeline',
        description: 'Set up high-throughput MQTT ingestion service into PostgreSQL timeseries tables',
        status: 'BACKLOG',
        priority: 'URGENT'
      },
      {
        projectId: project.id,
        creatorId: sahasra.id,
        assigneeId: sahasra.id,
        title: 'Community Leaderboard & Zero-Waste Rewards API',
        description: 'Finalize point calculation engine and discount voucher redemption logic',
        status: 'IN_REVIEW',
        priority: 'HIGH'
      }
    ]
  });

  // 3. Team Resource Links
  await prisma.projectResource.createMany({
    data: [
      {
        projectId: project.id,
        title: 'EcoTrack Hardware Specs & Schematics',
        url: 'https://docs.ecotrack.io/hardware',
        category: 'DOCS'
      },
      {
        projectId: project.id,
        title: 'Mobile App Figma Design System',
        url: 'https://figma.com/@ecotrack/mobile-v1',
        category: 'DESIGN'
      },
      {
        projectId: project.id,
        title: 'EcoTrack Core Cloud API Repository',
        url: 'https://github.com/ecotrack-climate/core-api',
        category: 'REPO'
      },
      {
        projectId: project.id,
        title: 'Public Beta Sandbox Deployment',
        url: 'https://app.ecotrack.io',
        category: 'DEPLOYMENT'
      }
    ]
  });

  // 4. Team Activity Logs
  await prisma.projectActivity.createMany({
    data: [
      {
        projectId: project.id,
        userId: sahasra.id,
        type: 'PROJECT_CREATED',
        message: 'created the project and established workspace'
      },
      ...(alice ? [{
        projectId: project.id,
        userId: alice.id,
        type: 'MEMBER_JOINED',
        message: 'joined as Lead Frontend & Mobile Engineer'
      }] : []),
      {
        projectId: project.id,
        userId: sahasra.id,
        type: 'TASK_MOVED',
        message: 'moved task "Design Household Footprint Calculator UI" to DONE'
      },
      {
        projectId: project.id,
        userId: sahasra.id,
        type: 'RESOURCE_ADDED',
        message: 'added resource link: "EcoTrack Core Cloud API Repository" (REPO)'
      }
    ]
  });

  // 5. In-App Notification
  await prisma.notification.create({
    data: {
      userId: sahasra.id,
      title: 'New Teammate Joined',
      message: 'Alice Chen joined "EcoTrack — Smart Carbon & Sustainability Tracker"',
      link: `/projects/${project.id}/workspace`
    }
  });

  console.log('✅ EcoTrack project and collaboration workspace ready!');
  console.log(`\nNew Project URL: /projects/${project.id}`);
  console.log(`New Workspace URL: /projects/${project.id}/workspace`);
}

main()
  .catch((e) => {
    console.error('Seeding team failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
