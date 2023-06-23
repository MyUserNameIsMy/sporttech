import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventAndRole1687521314029 implements MigrationInterface {
    name = 'AddEventAndRole1687521314029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "code" character varying NOT NULL, "time_and_date" TIMESTAMP WITH TIME ZONE NOT NULL, "place" character varying NOT NULL, "expenditure" jsonb, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_role_enum" AS ENUM('participant', 'organizator')`);
        await queryRunner.query(`CREATE TABLE "users_roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."users_roles_role_enum" NOT NULL DEFAULT 'participant', "clientId" integer, "eventId" integer, CONSTRAINT "PK_1d8dd7ffa37c3ab0c4eefb0b221" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_20b971dcbed1d47d2f07fff96af" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_20b971dcbed1d47d2f07fff96af"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_role_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
