CREATE TABLE "assuntos" (
	"cod_as" serial PRIMARY KEY NOT NULL,
	"descricao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "autores" (
	"cod_au" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livro_assunto" (
	"livro_codl" integer NOT NULL,
	"assunto_cod_as" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livro_autor" (
	"livro_codl" integer NOT NULL,
	"autor_cod_au" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "livros" (
	"codl" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"editora" text,
	"edicao" integer,
	"ano_publicacao" integer,
	"valor" numeric(10, 2) NOT NULL,
	"imagem_url" text,
	"paginas" integer
);
--> statement-breakpoint
ALTER TABLE "livro_assunto" ADD CONSTRAINT "livro_assunto_livro_codl_livros_codl_fk" FOREIGN KEY ("livro_codl") REFERENCES "public"."livros"("codl") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livro_assunto" ADD CONSTRAINT "livro_assunto_assunto_cod_as_assuntos_cod_as_fk" FOREIGN KEY ("assunto_cod_as") REFERENCES "public"."assuntos"("cod_as") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livro_autor" ADD CONSTRAINT "livro_autor_livro_codl_livros_codl_fk" FOREIGN KEY ("livro_codl") REFERENCES "public"."livros"("codl") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "livro_autor" ADD CONSTRAINT "livro_autor_autor_cod_au_autores_cod_au_fk" FOREIGN KEY ("autor_cod_au") REFERENCES "public"."autores"("cod_au") ON DELETE no action ON UPDATE no action;