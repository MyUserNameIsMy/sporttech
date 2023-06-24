import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventStatus1687602769693 implements MigrationInterface {
    name = 'AddEventStatus1687602769693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_event_status_enum" AS ENUM('created', 'pre_payment', 'payment', 'finished', 'closed')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_status" "public"."events_event_status_enum" NOT NULL DEFAULT 'created'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "event_status"`);
        await queryRunner.query(`DROP TYPE "public"."events_event_status_enum"`);
    }

}
