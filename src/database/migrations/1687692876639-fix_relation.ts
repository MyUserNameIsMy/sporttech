import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelation1687692876639 implements MigrationInterface {
    name = 'FixRelation1687692876639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_555d48169f5cc6a8ca3a7961672" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
