import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1755703229920 implements MigrationInterface {
    name = 'InitMigration1755703229920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(256) NOT NULL, "password" character varying(256) NOT NULL, "photoUrl" character varying(256) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accessLevel" integer NOT NULL, "isActive" boolean NOT NULL, "emailConfirmed" boolean NOT NULL, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_user" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EmployeeContract" ("idEmployeeContract" SERIAL NOT NULL, "type" character varying(15) NOT NULL, "workTime" character varying(10), "workType" character varying(15), "comment" character varying(500), "idEmployee" integer, CONSTRAINT "REL_bfe4462eddfc11ac8ea4e81575" UNIQUE ("idEmployee"), CONSTRAINT "PK_employee_contract" PRIMARY KEY ("idEmployeeContract"))`);
        await queryRunner.query(`CREATE TABLE "EmployeeVacation" ("idEmployeeVacation" SERIAL NOT NULL, "isOnVacation" boolean NOT NULL, "contractLeadtime" integer NOT NULL, "availableLeadtime" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "finishDate" TIMESTAMP NOT NULL, "limitDate" TIMESTAMP NOT NULL, "comment" character varying(300) NOT NULL, "employeeIdEmployee" integer, CONSTRAINT "PK_employee_vacation" PRIMARY KEY ("idEmployeeVacation"))`);
        await queryRunner.query(`CREATE TABLE "Kpi" ("idKpi" SERIAL NOT NULL, "goal" character varying NOT NULL, "operator" character varying(2) NOT NULL, "metric" double precision NOT NULL, "unit" character varying(5) NOT NULL, "idDepartment" integer, CONSTRAINT "PK_kpi" PRIMARY KEY ("idKpi"))`);
        await queryRunner.query(`CREATE TABLE "Department" ("idDepartment" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_department_name" UNIQUE ("name"), CONSTRAINT "PK_department" PRIMARY KEY ("idDepartment"))`);
        await queryRunner.query(`CREATE TABLE "EmployeePosition" ("idEmployeePosition" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_employee_position_name" UNIQUE ("name"), CONSTRAINT "PK_employee_position" PRIMARY KEY ("idEmployeePosition"))`);
        await queryRunner.query(`CREATE TABLE "Task" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL DEFAULT now(), "pauseTime" TIMESTAMP NOT NULL, "finishTime" TIMESTAMP NOT NULL, "type" character varying NOT NULL, "task" character varying NOT NULL, "status" character varying NOT NULL, "idEmployee" integer, CONSTRAINT "PK_maintenance_task" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Employee" ("idEmployee" SERIAL NOT NULL, "isDefault" boolean NOT NULL, "name" character varying NOT NULL, "cpf" character varying(14), "email" character varying, "deskphone" character varying(20), "photoUrl" character varying, "cellphone" character varying(20), "idCompany" integer, "idDepartment" integer, "idEmployeePosition" integer, CONSTRAINT "UQ_employee_name" UNIQUE ("name"), CONSTRAINT "UQ_employee_cpf" UNIQUE ("cpf"), CONSTRAINT "REL_4f630298fc5cc22d7df9411e75" UNIQUE ("idEmployeePosition"), CONSTRAINT "PK_employee" PRIMARY KEY ("idEmployee"))`);
        await queryRunner.query(`CREATE TABLE "Address" ("idAddress" SERIAL NOT NULL, "postalCode" character varying(15) NOT NULL, "address" character varying(150) NOT NULL, "number" character varying(150), "complement" character varying(50), "district" character varying(50), "city" character varying(50), "state" character varying(2), "idCompany" integer, "idEmployee" integer, CONSTRAINT "REL_d62fc401adef8abd1726b14097" UNIQUE ("idCompany"), CONSTRAINT "REL_5253219cb3b8acb8ccd8c64b8c" UNIQUE ("idEmployee"), CONSTRAINT "PK_address" PRIMARY KEY ("idAddress"))`);
        await queryRunner.query(`CREATE TABLE "Product" ("idProduct" SERIAL NOT NULL, "name" character varying NOT NULL, "stock" integer NOT NULL, "idProductionLine" integer, CONSTRAINT "PK_product" PRIMARY KEY ("idProduct"))`);
        await queryRunner.query(`CREATE TABLE "ProductionLine" ("idProductionLine" SERIAL NOT NULL, "lineCode" character varying NOT NULL, "lineName" character varying NOT NULL, CONSTRAINT "UQ_production_line_code" UNIQUE ("lineCode"), CONSTRAINT "PK_production_line" PRIMARY KEY ("idProductionLine"))`);
        await queryRunner.query(`CREATE TABLE "ProjectEvent" ("idProjectEvent" SERIAL NOT NULL, "name" character varying(20) NOT NULL, "productQtyPlan" double precision NOT NULL, "productQtyActual" double precision NOT NULL, "deliveryDatePlan" TIMESTAMP NOT NULL, "deliveryDateActual" TIMESTAMP NOT NULL, "comment" character varying(100) NOT NULL, "idProject" integer, CONSTRAINT "PK_project_event" PRIMARY KEY ("idProjectEvent"))`);
        await queryRunner.query(`CREATE TABLE "Project" ("idProject" SERIAL NOT NULL, "code" character varying(15) NOT NULL, "product" character varying(20) NOT NULL, "startOfProduction" TIMESTAMP NOT NULL, CONSTRAINT "UQ_project_code" UNIQUE ("code"), CONSTRAINT "PK_project" PRIMARY KEY ("idProject"))`);
        await queryRunner.query(`CREATE TABLE "Asset" ("idAsset" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "comment" character varying, "idProject" integer, "idCompany" integer, "idProductionLine" integer, CONSTRAINT "PK_asset" PRIMARY KEY ("idAsset"))`);
        await queryRunner.query(`CREATE TABLE "Invoice" ("idInvoice" SERIAL NOT NULL, "issueDate" TIMESTAMP NOT NULL, "type" character varying(10) NOT NULL, "paymentDatePlan" TIMESTAMP, "paymentDateActual" TIMESTAMP, "idCompany" integer, CONSTRAINT "PK_invoice" PRIMARY KEY ("idInvoice"))`);
        await queryRunner.query(`CREATE TABLE "PurchasingOrder" ("idPurchasingOrder" SERIAL NOT NULL, "productQty" double precision NOT NULL, "paymentCondition" character varying(30), "idCompany" integer, CONSTRAINT "PK_purchasing_order" PRIMARY KEY ("idPurchasingOrder"))`);
        await queryRunner.query(`CREATE TABLE "Company" ("idCompany" SERIAL NOT NULL, "nickname" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "cnpj" character varying(20), "ie" character varying(50), "im" character varying(50), CONSTRAINT "UQ_company_im" UNIQUE ("im"), CONSTRAINT "UQ_company_ie" UNIQUE ("ie"), CONSTRAINT "UQ_company_cnpj" UNIQUE ("cnpj"), CONSTRAINT "UQ_company_name" UNIQUE ("name"), CONSTRAINT "UQ_company_nickname" UNIQUE ("nickname"), CONSTRAINT "PK_company" PRIMARY KEY ("idCompany"))`);
        await queryRunner.query(`CREATE TABLE "Production" ("idProduction" SERIAL NOT NULL, "lineCode" character varying(20), "lineName" character varying(30) NOT NULL, "productQtyPlan" double precision NOT NULL, "productQtyActual" double precision NOT NULL, CONSTRAINT "PK_production" PRIMARY KEY ("idProduction"))`);
        await queryRunner.query(`ALTER TABLE "EmployeeContract" ADD CONSTRAINT "FK_employee_contract_employee" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EmployeeVacation" ADD CONSTRAINT "FK_dee7837b49d3db91ff9eefaae3e" FOREIGN KEY ("employeeIdEmployee") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Kpi" ADD CONSTRAINT "FK_kpi_department" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Task" ADD CONSTRAINT "FK_maintenance_task_employee" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_employee_company" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_employee_department" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Employee" ADD CONSTRAINT "FK_employee_employee_position" FOREIGN KEY ("idEmployeePosition") REFERENCES "EmployeePosition"("idEmployeePosition") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_address_company" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Address" ADD CONSTRAINT "FK_address_employee" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_product_production_line" FOREIGN KEY ("idProductionLine") REFERENCES "ProductionLine"("idProductionLine") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProjectEvent" ADD CONSTRAINT "FK_project_event_project" FOREIGN KEY ("idProject") REFERENCES "Project"("idProject") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Asset" ADD CONSTRAINT "FK_asset_project" FOREIGN KEY ("idProject") REFERENCES "Project"("idProject") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Asset" ADD CONSTRAINT "FK_asset_company" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Asset" ADD CONSTRAINT "FK_asset_production_line" FOREIGN KEY ("idProductionLine") REFERENCES "ProductionLine"("idProductionLine") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD CONSTRAINT "FR_invoice_company" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PurchasingOrder" ADD CONSTRAINT "FK_purchasing_order_company" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PurchasingOrder" DROP CONSTRAINT "FK_purchasing_order_company"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP CONSTRAINT "FR_invoice_company"`);
        await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_asset_production_line"`);
        await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_asset_company"`);
        await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_asset_project"`);
        await queryRunner.query(`ALTER TABLE "ProjectEvent" DROP CONSTRAINT "FK_project_event_project"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_product_production_line"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_address_employee"`);
        await queryRunner.query(`ALTER TABLE "Address" DROP CONSTRAINT "FK_address_company"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_employee_employee_position"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_employee_department"`);
        await queryRunner.query(`ALTER TABLE "Employee" DROP CONSTRAINT "FK_employee_company"`);
        await queryRunner.query(`ALTER TABLE "Task" DROP CONSTRAINT "FK_maintenance_task_employee"`);
        await queryRunner.query(`ALTER TABLE "Kpi" DROP CONSTRAINT "FK_kpi_department"`);
        await queryRunner.query(`ALTER TABLE "EmployeeVacation" DROP CONSTRAINT "FK_dee7837b49d3db91ff9eefaae3e"`);
        await queryRunner.query(`ALTER TABLE "EmployeeContract" DROP CONSTRAINT "FK_employee_contract_employee"`);
        await queryRunner.query(`DROP TABLE "Production"`);
        await queryRunner.query(`DROP TABLE "Company"`);
        await queryRunner.query(`DROP TABLE "PurchasingOrder"`);
        await queryRunner.query(`DROP TABLE "Invoice"`);
        await queryRunner.query(`DROP TABLE "Asset"`);
        await queryRunner.query(`DROP TABLE "Project"`);
        await queryRunner.query(`DROP TABLE "ProjectEvent"`);
        await queryRunner.query(`DROP TABLE "ProductionLine"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TABLE "Address"`);
        await queryRunner.query(`DROP TABLE "Employee"`);
        await queryRunner.query(`DROP TABLE "Task"`);
        await queryRunner.query(`DROP TABLE "EmployeePosition"`);
        await queryRunner.query(`DROP TABLE "Department"`);
        await queryRunner.query(`DROP TABLE "Kpi"`);
        await queryRunner.query(`DROP TABLE "EmployeeVacation"`);
        await queryRunner.query(`DROP TABLE "EmployeeContract"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
