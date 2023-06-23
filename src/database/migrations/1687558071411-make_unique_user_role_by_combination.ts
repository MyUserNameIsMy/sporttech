import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUniqueUserRoleByCombination1687558071411 implements MigrationInterface {
    name = 'MakeUniqueUserRoleByCombination1687558071411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae06ca451edc21f5272b86f8b5" ON "users_roles" ("userId", "eventId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ae06ca451edc21f5272b86f8b5"`);
    }

}
