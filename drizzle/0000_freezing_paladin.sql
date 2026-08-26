CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"collection_id" uuid,
	"event" varchar(60) NOT NULL,
	"detail" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" varchar(80) NOT NULL,
	"description" varchar(500) NOT NULL,
	"deadline" timestamp with time zone NOT NULL,
	"share_token_hash" varchar(64) NOT NULL,
	"manage_token_hash" varchar(64) NOT NULL,
	"template_storage_key" text NOT NULL,
	"template_name" text NOT NULL,
	"template_size" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_share_token_hash_unique" UNIQUE("share_token_hash")
);
--> statement-breakpoint
CREATE TABLE "submission_drafts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_id" uuid NOT NULL,
	"device_key_hash" varchar(64) NOT NULL,
	"storage_key" text NOT NULL,
	"display_name" text NOT NULL,
	"size" bigint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"collection_id" uuid NOT NULL,
	"teacher_key" varchar(40) NOT NULL,
	"name" varchar(50) NOT NULL,
	"department" varchar(80) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"recipient_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"storage_key" text NOT NULL,
	"display_name" text NOT NULL,
	"size" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_drafts" ADD CONSTRAINT "submission_drafts_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_versions" ADD CONSTRAINT "submission_versions_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE cascade ON UPDATE no action;