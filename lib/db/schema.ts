import { pgTable, serial, text, boolean, timestamp, integer, pgEnum, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const roleEnum = pgEnum('role', ['ADMIN', 'MODERATOR', 'USER'])
export const membershipStatusEnum = pgEnum('membership_status', ['PENDING', 'APPROVED'])
export const communityRoleEnum = pgEnum('community_role', ['MODERATOR', 'MEMBER'])
export const connectionStatusEnum = pgEnum('connection_status', ['PENDING', 'ACCEPTED', 'REJECTED'])
export const enumUsersRole = pgEnum('enum_users_role', ['admin', 'moderator', 'user'])

// Tables
export const profile = pgTable('profile', {
  id: text('id').primaryKey(), // Supabase Auth UUID
  aliasName: text('alias_name').unique(),
  hasSetAlias: boolean('has_set_alias').default(false).notNull(),
  role: roleEnum('role').default('USER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tag = pgTable('tag', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
})

export const post = pgTable('post', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  authorId: text('author_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tag.id, { onDelete: 'cascade' }),
})

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  authorId: text('author_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  postId: integer('post_id').notNull().references(() => post.id, { onDelete: 'cascade' }),
})

export const reaction = pgTable('reaction', {
  id: serial('id').primaryKey(),
  emoji: text('emoji').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  profileId: text('profile_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  postId: integer('post_id').notNull().references(() => post.id, { onDelete: 'cascade' }),
}, (t) => [
  unique('profile_post_emoji_unique').on(t.profileId, t.postId, t.emoji),
])

export const poll = pgTable('poll', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const pollOption = pgTable('poll_option', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  pollId: integer('poll_id').notNull().references(() => poll.id, { onDelete: 'cascade' }),
})

export const pollVote = pgTable('poll_vote', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  optionId: integer('option_id').notNull().references(() => pollOption.id, { onDelete: 'cascade' }),
}, (t) => [
  unique('profile_option_unique').on(t.profileId, t.optionId),
])

export const community = pgTable('community', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const communityMember = pgTable('community_member', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  communityId: integer('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
  status: membershipStatusEnum('status').default('PENDING').notNull(),
  role: communityRoleEnum('role').default('MEMBER').notNull(),
  alasan: text('alasan'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => [
  unique('profile_community_unique').on(t.profileId, t.communityId),
])

export const communityMessage = pgTable('community_message', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  roomName: text('room_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  profileId: text('profile_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  communityId: integer('community_id').notNull().references(() => community.id, { onDelete: 'cascade' }),
})

export const chatConnection = pgTable('chat_connection', {
  id: serial('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  status: connectionStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
  unique('sender_receiver_unique').on(t.senderId, t.receiverId),
])

export const directMessage = pgTable('direct_message', {
  id: serial('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => profile.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isRead: boolean('is_read').default(false).notNull(),
}, (t) => [
  index('dm_sender_receiver_idx').on(t.senderId, t.receiverId),
  index('dm_created_at_idx').on(t.createdAt),
])

// Relations (to enable nested queries / drizzle relations)
export const profileRelations = relations(profile, ({ many }) => ({
  posts: many(post),
  comments: many(comment),
  reactions: many(reaction),
  pollVotes: many(pollVote),
  communities: many(communityMember),
  communityMessages: many(communityMessage),
  sentConnections: many(chatConnection, { relationName: 'sentConnections' }),
  receivedConnections: many(chatConnection, { relationName: 'receivedConnections' }),
  sentMessages: many(directMessage, { relationName: 'sentMessages' }),
  receivedMessages: many(directMessage, { relationName: 'receivedMessages' }),
}))

export const tagRelations = relations(tag, ({ many }) => ({
  posts: many(post),
}))

export const postRelations = relations(post, ({ one, many }) => ({
  author: one(profile, { fields: [post.authorId], references: [profile.id] }),
  tag: one(tag, { fields: [post.tagId], references: [tag.id] }),
  comments: many(comment),
  reactions: many(reaction),
}))

export const commentRelations = relations(comment, ({ one }) => ({
  author: one(profile, { fields: [comment.authorId], references: [profile.id] }),
  post: one(post, { fields: [comment.postId], references: [post.id] }),
}))

export const reactionRelations = relations(reaction, ({ one }) => ({
  profile: one(profile, { fields: [reaction.profileId], references: [profile.id] }),
  post: one(post, { fields: [reaction.postId], references: [post.id] }),
}))

export const pollRelations = relations(poll, ({ many }) => ({
  options: many(pollOption),
}))

export const pollOptionRelations = relations(pollOption, ({ one, many }) => ({
  poll: one(poll, { fields: [pollOption.pollId], references: [poll.id] }),
  votes: many(pollVote),
}))

export const pollVoteRelations = relations(pollVote, ({ one }) => ({
  profile: one(profile, { fields: [pollVote.profileId], references: [profile.id] }),
  option: one(pollOption, { fields: [pollVote.optionId], references: [pollOption.id] }),
}))

export const communityRelations = relations(community, ({ many }) => ({
  members: many(communityMember),
  messages: many(communityMessage),
}))

export const communityMemberRelations = relations(communityMember, ({ one }) => ({
  profile: one(profile, { fields: [communityMember.profileId], references: [profile.id] }),
  community: one(community, { fields: [communityMember.communityId], references: [community.id] }),
}))

export const communityMessageRelations = relations(communityMessage, ({ one }) => ({
  profile: one(profile, { fields: [communityMessage.profileId], references: [profile.id] }),
  community: one(community, { fields: [communityMessage.communityId], references: [community.id] }),
}))

export const chatConnectionRelations = relations(chatConnection, ({ one }) => ({
  sender: one(profile, { relationName: 'sentConnections', fields: [chatConnection.senderId], references: [profile.id] }),
  receiver: one(profile, { relationName: 'receivedConnections', fields: [chatConnection.receiverId], references: [profile.id] }),
}))

export const directMessageRelations = relations(directMessage, ({ one }) => ({
  sender: one(profile, { relationName: 'sentMessages', fields: [directMessage.senderId], references: [profile.id] }),
  receiver: one(profile, { relationName: 'receivedMessages', fields: [directMessage.receiverId], references: [profile.id] }),
}))
