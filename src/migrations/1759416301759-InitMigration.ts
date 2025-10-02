import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1759416301759 implements MigrationInterface {
    name = 'InitMigration1759416301759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "photoUrls" TO "photoPath"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME COLUMN "photoPath" TO "photoUrls"`);
    }

}
