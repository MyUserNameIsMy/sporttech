import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTotalExpenditureType1687593544099 implements MigrationInterface {
    name = 'FixTotalExpenditureType1687593544099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "total_expenditure"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "total_expenditure" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "total_expenditure"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "total_expenditure" integer NOT NULL`);
    }

}
