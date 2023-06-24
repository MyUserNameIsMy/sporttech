import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEventBankAccount1687593807471 implements MigrationInterface {
    name = 'FixEventBankAccount1687593807471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_838cbc8d28714bcb6baae8634ed"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "profileId" TO "bankAccountId"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME CONSTRAINT "UQ_838cbc8d28714bcb6baae8634ed" TO "UQ_86f627e2cc919f579296111572d"`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_86f627e2cc919f579296111572d" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_86f627e2cc919f579296111572d"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME CONSTRAINT "UQ_86f627e2cc919f579296111572d" TO "UQ_838cbc8d28714bcb6baae8634ed"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "bankAccountId" TO "profileId"`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_838cbc8d28714bcb6baae8634ed" FOREIGN KEY ("profileId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
