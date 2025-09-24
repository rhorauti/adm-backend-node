import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1758716883213 implements MigrationInterface {
    name = 'InitMigration1758716883213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "usedSpareParts"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "usedSpareParts" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "usedSpareParts"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "usedSpareParts" integer array`);
    }

}
