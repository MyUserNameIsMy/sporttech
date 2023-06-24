import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsPaid1687604820498 implements MigrationInterface {
    name = 'AddIsPaid1687604820498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" ADD "is_paid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP COLUMN "is_paid"`);
    }

}
