import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1758558479399 implements MigrationInterface {
    name = 'InitMigration1758558479399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "production_line" DROP COLUMN "toolingList"`);
        await queryRunner.query(`ALTER TABLE "production_line" ADD "toolingList" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "production_line" DROP COLUMN "toolingList"`);
        await queryRunner.query(`ALTER TABLE "production_line" ADD "toolingList" jsonb array`);
    }

}
