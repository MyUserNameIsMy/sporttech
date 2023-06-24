import { MigrationInterface, QueryRunner } from "typeorm";

export class Payment1687593284702 implements MigrationInterface {
    name = 'Payment1687593284702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision NOT NULL, CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_operation_type_enum" AS ENUM('in', 'out')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "value" double precision NOT NULL, "operation_type" "public"."transactions_operation_type_enum" NOT NULL, "bankAccountId" uuid, "userId" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invitations_status_enum" AS ENUM('created', 'accepted', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."invitations_status_enum" NOT NULL DEFAULT 'created', CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" ADD "total_expenditure" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "UQ_838cbc8d28714bcb6baae8634ed" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_838cbc8d28714bcb6baae8634ed" FOREIGN KEY ("profileId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_dd5f9a2ef07b89d35aeb480f376" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_dd5f9a2ef07b89d35aeb480f376"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_838cbc8d28714bcb6baae8634ed"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "UQ_838cbc8d28714bcb6baae8634ed"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "total_expenditure"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TYPE "public"."invitations_status_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_operation_type_enum"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
    }

}
