import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1760625831867 implements MigrationInterface {
    name = 'InitMigration1760625831867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "startDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "finishDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "finishDate" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "finishDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "finishDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP DEFAULT now()`);
    }

}
