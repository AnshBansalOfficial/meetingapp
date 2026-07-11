import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';

// Better Auth tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  userId: text('userId').notNull(),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  expiresAt: integer('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

// App tables
export const meetings = pgTable('meetings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('startTime').notNull(),
  endTime: timestamp('endTime'),
  duration: integer('duration'),
  participants: text('participants').default('[]'),
  primarySpeaker: text('primarySpeaker'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const speakers = pgTable('speakers', {
  id: text('id').primaryKey(),
  meetingId: text('meetingId').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  avatar: text('avatar'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const transcriptLines = pgTable('transcript_lines', {
  id: text('id').primaryKey(),
  meetingId: text('meetingId').notNull(),
  speakerId: text('speakerId').notNull(),
  speakerName: text('speakerName').notNull(),
  text: text('text').notNull(),
  startTime: decimal('startTime').notNull(),
  endTime: decimal('endTime').notNull(),
  lineOrder: integer('lineOrder').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const summaries = pgTable('summaries', {
  id: text('id').primaryKey(),
  meetingId: text('meetingId').notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  keyTopics: text('keyTopics').default('[]'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const actionItems = pgTable('action_items', {
  id: text('id').primaryKey(),
  meetingId: text('meetingId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  assignedTo: text('assignedTo'),
  status: text('status').default('pending'),
  dueDate: timestamp('dueDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});
