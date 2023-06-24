import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankAccountUser1687604243831 implements MigrationInterface {
    name = 'AddBankAccountUser1687604243831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "bankAccountId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fcf58e4f78b61ffd3aa7608caba" UNIQUE ("bankAccountId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fcf58e4f78b61ffd3aa7608caba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bankAccountId"`);
    }

}
