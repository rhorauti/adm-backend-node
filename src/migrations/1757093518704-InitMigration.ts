import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1757093518704 implements MigrationInterface {
    name = 'InitMigration1757093518704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_employee_department"`);
        await queryRunner.query(`ALTER TABLE "ProductionLine" ALTER COLUMN "lineCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "EmployeePosition" DROP CONSTRAINT "UQ_employee_position_name"`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_employee_department" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_employee_department"`);
        await queryRunner.query(`ALTER TABLE "EmployeePosition" ADD CONSTRAINT "UQ_employee_position_name" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "ProductionLine" ALTER COLUMN "lineCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_employee_department" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
