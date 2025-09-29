import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1759172587360 implements MigrationInterface {
    name = 'InitMigration1759172587360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "isSparePartsChanged"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "isSparePartsChanged" boolean NOT NULL`);
    }

}
