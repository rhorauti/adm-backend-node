import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1758215447429 implements MigrationInterface {
    name = 'InitMigration1758215447429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customerPartNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "nameTranslated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "origin" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ncm" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "icms" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "pis" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cofins" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ipi" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "purchasingCurrency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "purchasingUnitPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "salesCurrency" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "salesUnitPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "materialSpec" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "depth" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "weight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "stock" numeric`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "qrcode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "photoUrl" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "comment" integer`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "photoUrl" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "qrcode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "stock" integer`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "depth" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "materialSpec" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "salesUnitPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "salesCurrency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "purchasingUnitPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "purchasingCurrency" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ipi" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cofins" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "pis" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "icms" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "ncm" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "origin" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "nameTranslated" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "customerPartNumber" SET NOT NULL`);
    }

}
