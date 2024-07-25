import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1721835718110 implements MigrationInterface {
  name = 'Init1721835718110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" character(25) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" text NOT NULL, "role_id" integer NOT NULL, "refresh_token" text NOT NULL, "password" character varying NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_051db7d37d478a69a7432df147" ON "admins" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character(25) NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" text NOT NULL, "picture" text NOT NULL, "refresh_token" text NOT NULL, "disabled" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_051db7d37d478a69a7432df147"`,
    );
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
