import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1687608260406 implements MigrationInterface {
    name = 'AddCascade1687608260406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fcf58e4f78b61ffd3aa7608caba" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
