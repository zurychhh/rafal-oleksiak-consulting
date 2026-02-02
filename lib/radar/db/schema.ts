import { pgTable, uuid, varchar, timestamp, boolean, jsonb, integer, index } from 'drizzle-orm/pg-core';

// radar_users - User accounts for dashboard
export const radarUsers = pgTable(
  'radar_users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }),
    company: varchar('company', { length: 255 }),
    yourUrl: varchar('your_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastLogin: timestamp('last_login', { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index('radar_users_email_idx').on(table.email),
  })
);

// radar_magic_links - Passwordless authentication tokens
export const radarMagicLinks = pgTable(
  'radar_magic_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => radarUsers.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    used: boolean('used').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index('radar_magic_links_token_idx').on(table.token),
  })
);

// radar_sessions - Active user sessions
export const radarSessions = pgTable(
  'radar_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => radarUsers.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    tokenIdx: index('radar_sessions_token_idx').on(table.token),
  })
);

// radar_reports - Complete RADAR scan reports
export const radarReports = pgTable(
  'radar_reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => radarUsers.id, { onDelete: 'cascade' }),
    yourUrl: varchar('your_url', { length: 500 }).notNull(),
    reportJson: jsonb('report_json').notNull(),
    overallPosition: varchar('overall_position', { length: 20 }).notNull(),
    competitorCount: integer('competitor_count').notNull().default(0),
    highThreatCount: integer('high_threat_count').notNull().default(0),
    criticalActionCount: integer('critical_action_count').notNull().default(0),
    executionTime: integer('execution_time').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdCreatedAtIdx: index('radar_reports_user_id_created_at_idx').on(table.userId, table.createdAt),
  })
);

// radar_competitors - Individual competitor analyses (linked to reports)
export const radarCompetitors = pgTable(
  'radar_competitors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reportId: uuid('report_id')
      .notNull()
      .references(() => radarReports.id, { onDelete: 'cascade' }),
    url: varchar('url', { length: 500 }).notNull(),
    snapshotJson: jsonb('snapshot_json').notNull(),
    aiInsightsJson: jsonb('ai_insights_json').notNull(),
    threatLevel: varchar('threat_level', { length: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    reportIdUrlIdx: index('radar_competitors_report_id_url_idx').on(table.reportId, table.url),
  })
);
