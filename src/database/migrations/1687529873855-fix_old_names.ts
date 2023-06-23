import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOldNames1687529873855 implements MigrationInterface {
    name = 'FixOldNames1687529873855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_20b971dcbed1d47d2f07fff96af"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME COLUMN "clientId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "UQ_0dcf33a3c6edf9ba546f30d801e" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_776b7cf9330802e5ef5a8fb18dc"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "UQ_0dcf33a3c6edf9ba546f30d801e"`);
        await queryRunner.query(`ALTER TABLE "users_roles" RENAME COLUMN "userId" TO "clientId"`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_20b971dcbed1d47d2f07fff96af" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
