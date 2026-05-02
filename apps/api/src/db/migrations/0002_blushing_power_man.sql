ALTER TABLE "assuntos" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "assuntos" ADD CONSTRAINT "assuntos_slug_unique" UNIQUE("slug");