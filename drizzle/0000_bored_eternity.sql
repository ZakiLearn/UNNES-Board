CREATE TYPE "public"."community_role" AS ENUM('MODERATOR', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."connection_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."membership_status" AS ENUM('PENDING', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'MODERATOR', 'USER');--> statement-breakpoint
CREATE TABLE "chat_connection" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"status" "connection_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sender_receiver_unique" UNIQUE("sender_id","receiver_id")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"author_id" text NOT NULL,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "community_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"community_id" integer NOT NULL,
	"status" "membership_status" DEFAULT 'PENDING' NOT NULL,
	"role" "community_role" DEFAULT 'MEMBER' NOT NULL,
	"alasan" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_community_unique" UNIQUE("profile_id","community_id")
);
--> statement-breakpoint
CREATE TABLE "community_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"room_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"profile_id" text NOT NULL,
	"community_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "direct_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_option" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"poll_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_vote" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"option_id" integer NOT NULL,
	CONSTRAINT "profile_option_unique" UNIQUE("profile_id","option_id")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"author_id" text NOT NULL,
	"tag_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"alias_name" text,
	"has_set_alias" boolean DEFAULT false NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_alias_name_unique" UNIQUE("alias_name")
);
--> statement-breakpoint
CREATE TABLE "reaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"profile_id" text NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "profile_post_emoji_unique" UNIQUE("profile_id","post_id","emoji")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "chat_connection" ADD CONSTRAINT "chat_connection_sender_id_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_connection" ADD CONSTRAINT "chat_connection_receiver_id_profile_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_profile_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_message" ADD CONSTRAINT "community_message_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_message" ADD CONSTRAINT "community_message_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_sender_id_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "direct_message" ADD CONSTRAINT "direct_message_receiver_id_profile_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_poll_id_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."poll"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_option_id_poll_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."poll_option"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_profile_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dm_sender_receiver_idx" ON "direct_message" USING btree ("sender_id","receiver_id");--> statement-breakpoint
CREATE INDEX "dm_created_at_idx" ON "direct_message" USING btree ("created_at");