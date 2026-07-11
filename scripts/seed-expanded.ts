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
    console.log('🚀 Seeding expanded demo data...');

    // Insert a test user
    await client.query(
      `INSERT INTO "user" (id, email, name, "emailVerified", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['demo-user-001', 'demo@fireflies.ai', 'Demo User']
    );
    console.log('✓ Created test user');

    // Array of meetings to create
    const meetings = [
      {
        title: 'Q4 2024 Planning & Strategy',
        description: 'Quarterly planning session to discuss goals and strategy',
        date: '2024-10-15T10:00:00Z',
        duration: 90,
        speakers: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
        emails: ['alice@company.com', 'bob@company.com', 'carol@company.com'],
      },
      {
        title: 'Weekly Engineering Standup',
        description: 'Weekly sync with the engineering team',
        date: '2024-10-18T09:00:00Z',
        duration: 30,
        speakers: ['Bob Smith', 'David Lee', 'Emma Wilson'],
        emails: ['bob@company.com', 'david@company.com', 'emma@company.com'],
      },
      {
        title: 'Product Roadmap Review',
        description: 'Review of Q4 and Q1 2025 product roadmap',
        date: '2024-10-16T14:00:00Z',
        duration: 60,
        speakers: ['Alice Johnson', 'Frank Brown', 'Grace Lee'],
        emails: ['alice@company.com', 'frank@company.com', 'grace@company.com'],
      },
      {
        title: 'Marketing Strategy Session',
        description: 'Discussion on Q4 marketing campaigns and initiatives',
        date: '2024-10-17T11:00:00Z',
        duration: 75,
        speakers: ['Grace Lee', 'Henry Martin', 'Iris Chen'],
        emails: ['grace@company.com', 'henry@company.com', 'iris@company.com'],
      },
      {
        title: 'Customer Advisory Board Meeting',
        description: 'Quarterly feedback session with key customers',
        date: '2024-10-12T15:00:00Z',
        duration: 90,
        speakers: ['Carol Davis', 'Jack Wilson', 'Karen Thompson'],
        emails: ['carol@company.com', 'jack@company.com', 'karen@company.com'],
      },
      {
        title: 'Product Demo for Enterprise Client',
        description: 'Demonstration of new features to prospective enterprise customer',
        date: '2024-10-11T13:00:00Z',
        duration: 45,
        speakers: ['Frank Brown', 'Leo Rodriguez', 'Alice Johnson'],
        emails: ['frank@company.com', 'leo@company.com', 'alice@company.com'],
      },
      {
        title: 'Budget Planning & Forecasting',
        description: 'Finance and leadership sync on 2025 budget allocation',
        date: '2024-10-10T10:00:00Z',
        duration: 120,
        speakers: ['Carol Davis', 'Mike Johnson', 'Nora Garcia'],
        emails: ['carol@company.com', 'mike@company.com', 'nora@company.com'],
      },
      {
        title: 'Design System Workshop',
        description: 'Workshop on improving design consistency across products',
        date: '2024-10-09T14:00:00Z',
        duration: 60,
        speakers: ['Emma Wilson', 'Olivia Martinez', 'Paul Anderson'],
        emails: ['emma@company.com', 'olivia@company.com', 'paul@company.com'],
      },
      {
        title: 'Customer Success Team Meeting',
        description: 'Quarterly sync with customer success team on metrics and goals',
        date: '2024-10-08T11:00:00Z',
        duration: 45,
        speakers: ['Karen Thompson', 'Quinn Brown', 'Rachel White'],
        emails: ['karen@company.com', 'quinn@company.com', 'rachel@company.com'],
      },
      {
        title: 'Engineering Sprint Planning',
        description: 'Planning for the next two-week sprint',
        date: '2024-10-07T09:30:00Z',
        duration: 75,
        speakers: ['Bob Smith', 'David Lee', 'Sam Wilson'],
        emails: ['bob@company.com', 'david@company.com', 'sam@company.com'],
      },
      {
        title: 'Sales Strategy for Q4',
        description: 'Discussion on sales targets and go-to-market strategy',
        date: '2024-10-06T14:00:00Z',
        duration: 90,
        speakers: ['Tom Anderson', 'Uma Patel', 'Vera Chen'],
        emails: ['tom@company.com', 'uma@company.com', 'vera@company.com'],
      },
      {
        title: 'Security & Compliance Review',
        description: 'Quarterly security audit and compliance check',
        date: '2024-10-05T10:00:00Z',
        duration: 60,
        speakers: ['Walter Johnson', 'Xandra Martinez', 'Yuki Tanaka'],
        emails: ['walter@company.com', 'xandra@company.com', 'yuki@company.com'],
      },
    ];

    // Create all meetings and their data
    for (const meetingData of meetings) {
      const meetingId = uuidv4();
      
      // Create meeting
      await client.query(
        `INSERT INTO meetings (id, "userId", title, description, "startTime", "endTime", duration, participants, "primarySpeaker", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          meetingId,
          'demo-user-001',
          meetingData.title,
          meetingData.description,
          new Date(meetingData.date),
          new Date(new Date(meetingData.date).getTime() + meetingData.duration * 60000),
          meetingData.duration,
          '{' + meetingData.emails.map(e => `"${e}"`).join(',') + '}', // Proper PostgreSQL array format
          meetingData.speakers[0],
        ]
      );

      // Create speakers
      const speakerIds: string[] = [];
      for (let i = 0; i < meetingData.speakers.length; i++) {
        const speakerId = uuidv4();
        speakerIds.push(speakerId);
        
        await client.query(
          `INSERT INTO speakers (id, "meetingId", name, email, "createdAt")
           VALUES ($1, $2, $3, $4, NOW())`,
          [speakerId, meetingId, meetingData.speakers[i], meetingData.emails[i]]
        );
      }

      // Create sample transcript lines
      const sampleTranscripts: Record<string, Array<{speaker: string; speakerId: string; text: string}>> = {
        'Q4 2024 Planning & Strategy': [
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Good morning everyone. Thanks for joining today. We need to discuss our Q4 strategy and make sure everyone is aligned on the goals.' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'Thanks. I think we should focus on three main areas: product optimization, customer retention, and team expansion.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'I agree. I would also add that we need to invest more in marketing and customer success initiatives.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Great points. For product, we should focus on the new dashboard and API improvements.' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'How much engineering capacity do we have for that? I want to make sure we are not over-committing.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'We have approximately 40% capacity available for new features. The rest is allocated to bug fixes and maintenance.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'That sounds reasonable. What about the timeline for the new dashboard?' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'We estimate 6-8 weeks for the MVP. We can start development next sprint.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Perfect. Let\u0027s aim for a mid-November launch. That gives us enough time for testing and refinement.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'I\u0027ll make sure marketing has enough time to prepare the campaign.' },
        ],
        'Weekly Engineering Standup': [
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Let\u0027s start with the sprint update. Bob, what did your team complete this week?' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'We finished the API refactoring and completed 8 out of 10 story points from the sprint.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'Good progress. We also fixed several high-priority bugs and improved performance by 15%.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'That\u0027s great. Any blockers we need to address?' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'We\u0027re waiting on design feedback for the new UI components. That\u0027s blocking frontend development.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'I\u0027ll follow up with the design team. What about deployment?' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'Deployment to staging is ready for testing. We\u0027re planning production release tomorrow.' },
        ],
        'Product Roadmap Review': [
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Good afternoon. Today we\u0027re reviewing our product roadmap for Q4 and early Q1. Let\u0027s start with the current state.' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'We have 85% completion on Q4 initiatives. The new dashboard is on track for November launch.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'For Q1, I recommend we focus on mobile optimization and enhanced integrations.' },
          { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Those are good priorities. What about machine learning capabilities?' },
          { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'We\u0027re planning to introduce basic ML features in Q1, starting with predictive analytics.' },
          { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'The market is really asking for this. I think it\u0027s a good differentiator.' },
        ],
      };

      const transcripts = sampleTranscripts[meetingData.title] || [
        { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: `Meeting: ${meetingData.title}. Let's get started with today's agenda.` },
        { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'I\u0027m ready. What are the main topics we need to cover?' },
        { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'We have three key items. First, budget allocation for Q4...' },
        { speaker: meetingData.speakers[2], speakerId: speakerIds[2], text: 'I think we should focus on ROI and impact. Let\u0027s look at the numbers.' },
        { speaker: meetingData.speakers[1], speakerId: speakerIds[1], text: 'Agreed. I\u0027ve prepared a detailed analysis of the spending.' },
        { speaker: meetingData.speakers[0], speakerId: speakerIds[0], text: 'Great. Let\u0027s review the breakdown by department.' },
      ];

      // Add transcript lines
      let lineOrder = 0;
      let currentTime = 0;
      for (const transcript of transcripts) {
        const duration = Math.random() * 20 + 10; // 10-30 seconds per line
        await client.query(
          `INSERT INTO transcript_lines (id, "meetingId", "speakerId", "speakerName", text, "startTime", "endTime", "lineOrder", "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
          [
            uuidv4(),
            meetingId,
            transcript.speakerId,
            transcript.speaker,
            transcript.text,
            currentTime,
            currentTime + duration,
            lineOrder,
          ]
        );
        lineOrder++;
        currentTime += duration;
      }

      // Create summary
      const summaries: Record<string, {title: string; summary: string; topics: string[]}> = {
        'Q4 2024 Planning & Strategy': {
          title: 'Q4 Planning Summary',
          summary: 'Team discussed Q4 strategy focusing on three main areas: product optimization with new dashboard launch planned for mid-November, customer retention through enhanced success initiatives, and team expansion. Engineering has 40% capacity available for new features. API improvements and dashboard development estimated at 6-8 weeks.',
          topics: ['Product Roadmap', 'Team Expansion', 'Engineering Capacity', 'Dashboard Launch', 'API Improvements'],
        },
        'Weekly Engineering Standup': {
          title: 'Sprint Progress Update',
          summary: 'Team completed 8/10 story points from the sprint. API refactoring finished and 15% performance improvement achieved. High-priority bugs fixed. Deployment to staging ready. Blocker: awaiting design feedback on UI components. Production release planned for tomorrow.',
          topics: ['Sprint Completion', 'Performance Improvements', 'API Refactoring', 'Deployment Status', 'Blockers'],
        },
        'Product Roadmap Review': {
          title: 'Product Roadmap Review',
          summary: 'Q4 initiatives 85% complete with new dashboard on track for November. Q1 priorities include mobile optimization and enhanced integrations. ML features planned including predictive analytics as key differentiator. Strong market demand for new capabilities.',
          topics: ['Q4 Progress', 'Mobile Optimization', 'ML Integration', 'Market Demand', 'Q1 Planning'],
        },
      };

      const summary = summaries[meetingData.title] || {
        title: `${meetingData.title} Summary`,
        summary: `Meeting to discuss ${meetingData.description}. Team covered key topics and aligned on next steps.`,
        topics: ['Action Items', 'Next Steps', 'Follow-ups'],
      };

      await client.query(
        `INSERT INTO summaries (id, "meetingId", title, summary, "keyTopics", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [
          uuidv4(),
          meetingId,
          summary.title,
          summary.summary,
          '{' + summary.topics.map(t => `"${t}"`).join(',') + '}', // Proper PostgreSQL array format
        ]
      );

      // Create action items
      const actionItemsData = [
        {title: 'Follow up on design feedback', assignee: meetingData.speakers[0]},
        {title: 'Prepare Q4 budget report', assignee: meetingData.speakers[1]},
        {title: 'Schedule follow-up meeting', assignee: meetingData.speakers[2]},
        {title: 'Update project timeline', assignee: meetingData.speakers[0]},
      ];

      for (let i = 0; i < 2; i++) {
        const item = actionItemsData[i % actionItemsData.length];
        await client.query(
          `INSERT INTO action_items (id, "meetingId", title, description, "assignedTo", status, "dueDate", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [
            uuidv4(),
            meetingId,
            item.title,
            `Action item from ${meetingData.title}`,
            item.assignee,
            'pending',
            new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          ]
        );
      }

      console.log(`✓ Created meeting: ${meetingData.title}`);
    }

    console.log('\n✅ Successfully seeded database with expanded demo data!');
    console.log(`📊 Total meetings created: ${meetings.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await client.release();
    await pool.end();
  }
};

seedData().catch(console.error);
