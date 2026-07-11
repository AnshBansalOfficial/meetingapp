import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString });

const seedData = async () => {
  const client = await pool.connect();

  try {
    console.log('Seeding database...');

    // Insert a test user
    await client.query(
      `INSERT INTO "user" (id, email, name, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, true, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      ['demo-user-001', 'demo@fireflies.ai', 'Demo User']
    );
    console.log('✓ Created test user');

    // Meeting 1: Q4 Planning
    const meeting1Id = uuidv4();
    await client.query(
      `INSERT INTO meetings (id, "userId", title, description, "startTime", "endTime", duration, participants, "primarySpeaker", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        meeting1Id,
        'demo-user-001',
        'Q4 2024 Planning & Strategy',
        'Quarterly planning session to discuss goals and strategy for Q4',
        new Date('2024-10-15T10:00:00Z'),
        new Date('2024-10-15T11:30:00Z'),
        90,
        ['alice@company.com', 'bob@company.com', 'carol@company.com'],
        'Alice Johnson',
      ]
    );

    // Add speakers for meeting 1
    const speaker1_1 = uuidv4();
    const speaker1_2 = uuidv4();
    const speaker1_3 = uuidv4();

    await client.query(
      `INSERT INTO speakers (id, "meetingId", name, email, "createdAt")
       VALUES ($1, $2, $3, $4, NOW()), ($5, $2, $6, $7, NOW()), ($8, $2, $9, $10, NOW())`,
      [
        speaker1_1,
        meeting1Id,
        'Alice Johnson',
        'alice@company.com',
        speaker1_2,
        'Bob Smith',
        'bob@company.com',
        speaker1_3,
        'Carol Davis',
        'carol@company.com',
      ]
    );

    // Add transcript for meeting 1
    const transcriptData1 = [
      {
        speaker: 'Alice Johnson',
        speakerId: speaker1_1,
        text: 'Good morning everyone. Thanks for joining today. We need to discuss our Q4 strategy and make sure everyone is aligned on the goals.',
        startTime: 0,
        endTime: 15,
      },
      {
        speaker: 'Bob Smith',
        speakerId: speaker1_2,
        text: 'Thanks Alice. I think we should focus on three main areas: product optimization, customer retention, and team expansion.',
        startTime: 16,
        endTime: 35,
      },
      {
        speaker: 'Carol Davis',
        speakerId: speaker1_3,
        text: 'I agree with Bob. I would also add that we need to invest more in marketing and customer success initiatives.',
        startTime: 36,
        endTime: 55,
      },
      {
        speaker: 'Alice Johnson',
        speakerId: speaker1_1,
        text: 'Great points. Let me break down what I was thinking. For product, we should focus on the new dashboard and API improvements.',
        startTime: 56,
        endTime: 85,
      },
      {
        speaker: 'Bob Smith',
        speakerId: speaker1_2,
        text: 'How much engineering capacity do we have for that? I want to make sure we are not over-committing.',
        startTime: 86,
        endTime: 105,
      },
      {
        speaker: 'Alice Johnson',
        speakerId: speaker1_1,
        text: 'We have about 60% of our engineering team available after maintenance work. We should be able to handle both initiatives.',
        startTime: 106,
        endTime: 135,
      },
      {
        speaker: 'Carol Davis',
        speakerId: speaker1_3,
        text: 'What about hiring? Do we have budget for new team members?',
        startTime: 136,
        endTime: 150,
      },
      {
        speaker: 'Alice Johnson',
        speakerId: speaker1_1,
        text: 'Yes, we have approved three new headcount for Q4. Two engineers and one designer. Recruitment has already started.',
        startTime: 151,
        endTime: 180,
      },
    ];

    for (let i = 0; i < transcriptData1.length; i++) {
      await client.query(
        `INSERT INTO transcript_lines (id, "meetingId", "speakerId", "speakerName", text, "startTime", "endTime", "lineOrder", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          uuidv4(),
          meeting1Id,
          transcriptData1[i].speakerId,
          transcriptData1[i].speaker,
          transcriptData1[i].text,
          transcriptData1[i].startTime,
          transcriptData1[i].endTime,
          i,
        ]
      );
    }

    // Add summary for meeting 1
    await client.query(
      `INSERT INTO summaries (id, "meetingId", title, summary, "keyTopics", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        uuidv4(),
        meeting1Id,
        'Q4 Planning Summary',
        'The team discussed Q4 2024 strategy focusing on three main areas: product optimization, customer retention, and team expansion. Key decisions include implementing a new dashboard and API improvements, allocating 60% of engineering capacity to these initiatives, and approving three new hires (two engineers, one designer). Marketing and customer success initiatives will also receive increased investment.',
        JSON.stringify([
          'Q4 Strategy',
          'Product Optimization',
          'Engineering Capacity',
          'Team Expansion',
          'Marketing Investment',
        ]),
      ]
    );

    // Add action items for meeting 1
    await client.query(
      `INSERT INTO action_items (id, "meetingId", title, description, "assignedTo", status, "dueDate", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()),
              ($8, $2, $9, $10, $11, $12, $13, NOW(), NOW()),
              ($14, $2, $15, $16, $17, $18, $19, NOW(), NOW()),
              ($20, $2, $21, $22, $23, $24, $25, NOW(), NOW())`,
      [
        uuidv4(),
        meeting1Id,
        'Create Q4 roadmap document',
        'Finalize and share the Q4 product roadmap with all stakeholders',
        'Alice Johnson',
        'pending',
        new Date('2024-10-22T00:00:00Z'),
        uuidv4(),
        meeting1Id,
        'Begin recruitment for new hires',
        'Start posting job descriptions and recruiting for the three approved positions',
        'Bob Smith',
        'in_progress',
        new Date('2024-10-18T00:00:00Z'),
        uuidv4(),
        meeting1Id,
        'Design new dashboard wireframes',
        'Create wireframes and design spec for the new customer dashboard',
        'Carol Davis',
        'pending',
        new Date('2024-10-29T00:00:00Z'),
        uuidv4(),
        meeting1Id,
        'Budget review for marketing spend',
        'Review and approve increased marketing budget allocation for Q4',
        'Alice Johnson',
        'pending',
        new Date('2024-10-20T00:00:00Z'),
      ]
    );

    console.log('✓ Seeded meeting 1: Q4 Planning');

    // Meeting 2: Weekly Standup
    const meeting2Id = uuidv4();
    await client.query(
      `INSERT INTO meetings (id, "userId", title, description, "startTime", "endTime", duration, participants, "primarySpeaker", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [
        meeting2Id,
        'demo-user-001',
        'Engineering Weekly Standup',
        'Weekly sync to discuss progress, blockers, and plans',
        new Date('2024-10-16T09:30:00Z'),
        new Date('2024-10-16T10:00:00Z'),
        30,
        ['alice@company.com', 'david@company.com', 'emma@company.com'],
        'Alice Johnson',
      ]
    );

    const speaker2_1 = uuidv4();
    const speaker2_2 = uuidv4();
    const speaker2_3 = uuidv4();

    await client.query(
      `INSERT INTO speakers (id, "meetingId", name, email, "createdAt")
       VALUES ($1, $2, $3, $4, NOW()), ($5, $2, $6, $7, NOW()), ($8, $2, $9, $10, NOW())`,
      [
        speaker2_1,
        meeting2Id,
        'Alice Johnson',
        'alice@company.com',
        speaker2_2,
        'David Chen',
        'david@company.com',
        speaker2_3,
        'Emma Wilson',
        'emma@company.com',
      ]
    );

    const transcriptData2 = [
      {
        speaker: 'Alice Johnson',
        speakerId: speaker2_1,
        text: 'Good morning team. Let\'s do a quick standup. David, can you start with your update?',
        startTime: 0,
        endTime: 10,
      },
      {
        speaker: 'David Chen',
        speakerId: speaker2_2,
        text: 'Sure. I finished the API authentication module. Currently working on the dashboard frontend integration. No blockers at the moment.',
        startTime: 11,
        endTime: 35,
      },
      {
        speaker: 'Emma Wilson',
        speakerId: speaker2_3,
        text: 'I\'ve been working on the database migration script. It\'s almost ready for testing. I might need some help from David with the schema validation.',
        startTime: 36,
        endTime: 60,
      },
      {
        speaker: 'David Chen',
        speakerId: speaker2_2,
        text: 'I can help with that. Let\'s sync up after this standup to go through the validation logic.',
        startTime: 61,
        endTime: 75,
      },
      {
        speaker: 'Alice Johnson',
        speakerId: speaker2_1,
        text: 'Great. Anything else we need to discuss? Any blockers or dependencies?',
        startTime: 76,
        endTime: 90,
      },
    ];

    for (let i = 0; i < transcriptData2.length; i++) {
      await client.query(
        `INSERT INTO transcript_lines (id, "meetingId", "speakerId", "speakerName", text, "startTime", "endTime", "lineOrder", "createdAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          uuidv4(),
          meeting2Id,
          transcriptData2[i].speakerId,
          transcriptData2[i].speaker,
          transcriptData2[i].text,
          transcriptData2[i].startTime,
          transcriptData2[i].endTime,
          i,
        ]
      );
    }

    await client.query(
      `INSERT INTO summaries (id, "meetingId", title, summary, "keyTopics", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [
        uuidv4(),
        meeting2Id,
        'Weekly Standup Summary',
        'Team discussed progress on API authentication, dashboard frontend integration, and database migration. David completed the authentication module and will help Emma with schema validation. No blockers reported. Team will sync after standup to coordinate on database work.',
        JSON.stringify(['API Authentication', 'Dashboard Frontend', 'Database Migration', 'Schema Validation']),
      ]
    );

    await client.query(
      `INSERT INTO action_items (id, "meetingId", title, description, "assignedTo", status, "dueDate", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()),
              ($8, $2, $9, $10, $11, $12, $13, NOW(), NOW())`,
      [
        uuidv4(),
        meeting2Id,
        'Test database migration script',
        'Run the migration script in staging environment and validate results',
        'Emma Wilson',
        'pending',
        new Date('2024-10-17T00:00:00Z'),
        uuidv4(),
        meeting2Id,
        'Review API authentication implementation',
        'Code review and test the authentication module before merging to main',
        'Alice Johnson',
        'pending',
        new Date('2024-10-18T00:00:00Z'),
      ]
    );

    console.log('✓ Seeded meeting 2: Weekly Standup');

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seedData();
