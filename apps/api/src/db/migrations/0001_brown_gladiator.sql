ALTER TABLE "assuntos" ALTER COLUMN "descricao" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assuntos" ADD COLUMN "nome" text NOT NULL;