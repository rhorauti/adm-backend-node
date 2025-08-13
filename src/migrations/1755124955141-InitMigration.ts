import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1755124955141 implements MigrationInterface {
  name = 'InitMigration1755124955141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(256) NOT NULL, "password" character varying(256) NOT NULL, "photoUrl" character varying(256) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "accessLevel" integer NOT NULL, "isActive" boolean NOT NULL, "emailConfirmed" boolean NOT NULL, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "EmployeeContract" ("idEmployeeContract" SERIAL NOT NULL, "type" character(15) NOT NULL, "workTime" character(10), "workType" character(15), "comment" character varying(500), CONSTRAINT "PK_5d0965a004ae0a15d57a5769662" PRIMARY KEY ("idEmployeeContract"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "EmployeeVacation" ("idEmployeeVacation" SERIAL NOT NULL, "isOnVacation" boolean NOT NULL, "contractLeadtime" integer NOT NULL, "availableLeadtime" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "finishDate" TIMESTAMP NOT NULL, "limitDate" TIMESTAMP NOT NULL, "comment" character varying(300) NOT NULL, "employeeIdEmployee" integer, CONSTRAINT "PK_500767796981a6c69d9668bf8e2" PRIMARY KEY ("idEmployeeVacation"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Kpi" ("idKpi" SERIAL NOT NULL, "goal" character varying NOT NULL, "operator" character(2) NOT NULL, "metric" double precision NOT NULL, "unit" character(5) NOT NULL, "idDepartment" integer, CONSTRAINT "PK_d1d55fd2225d0c2c94e9c8878cd" PRIMARY KEY ("idKpi"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Department" ("idDepartment" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_department_name" UNIQUE ("name"), CONSTRAINT "PK_a3c465d04134d13be6e4552e357" PRIMARY KEY ("idDepartment"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "EmployeePosition" ("idEmployeePosition" SERIAL NOT NULL, "name" character varying NOT NULL, "idEmployee" integer, CONSTRAINT "UQ_f4ee38cc0a8e8d769c15e7dd14d" UNIQUE ("name"), CONSTRAINT "UQ_employee_position_name" UNIQUE ("name"), CONSTRAINT "REL_bfcb5f84d614ed4c18c649fd87" UNIQUE ("idEmployee"), CONSTRAINT "PK_2b01624b2ac4bbb7678af178d40" PRIMARY KEY ("idEmployeePosition"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Employee" ("idEmployee" SERIAL NOT NULL, "isDefault" boolean NOT NULL, "name" character varying NOT NULL, "cpf" character(14), "email" character varying, "deskphone" character(20), "photoUrl" character varying, "cellphone" character(20), "idCompany" integer, "idDepartment" integer, CONSTRAINT "UQ_cb4053113e440ee10f313f4c420" UNIQUE ("name"), CONSTRAINT "UQ_9a1574f8f0464919b58090bc08a" UNIQUE ("cpf"), CONSTRAINT "UQ_employee_name" UNIQUE ("name"), CONSTRAINT "UQ_employee_cpf" UNIQUE ("cpf"), CONSTRAINT "PK_7c9127534290be8baec6bad0c17" PRIMARY KEY ("idEmployee"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Address" ("idAddress" SERIAL NOT NULL, "postalCode" character(15) NOT NULL, "address" character varying(150) NOT NULL, "number" character varying(150), "complement" character(50), "district" character(50), "city" character(50), "state" character varying(2), "idCompany" integer, "idEmployee" integer, CONSTRAINT "REL_d62fc401adef8abd1726b14097" UNIQUE ("idCompany"), CONSTRAINT "REL_5253219cb3b8acb8ccd8c64b8c" UNIQUE ("idEmployee"), CONSTRAINT "PK_e86a2de9e6cad0d4ddbad134c9d" PRIMARY KEY ("idAddress"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Product" ("idProduct" SERIAL NOT NULL, "name" character varying NOT NULL, "stock" integer NOT NULL, "productionLineIdProductionLine" integer, CONSTRAINT "PK_91b8035a7f0ca88fa920a95d252" PRIMARY KEY ("idProduct"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ProductionLine" ("idProductionLine" SERIAL NOT NULL, "lineCode" character varying NOT NULL, "lineName" character varying NOT NULL, CONSTRAINT "UQ_94bb8823a9a3dbf641fbf8f108d" UNIQUE ("lineCode"), CONSTRAINT "UQ_production_line_code" UNIQUE ("lineCode"), CONSTRAINT "PK_967de2fd8f2103428c79a1c4df4" PRIMARY KEY ("idProductionLine"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ProjectEvent" ("idProjectEvent" SERIAL NOT NULL, "name" character(20) NOT NULL, "productQtyPlan" double precision NOT NULL, "productQtyActual" double precision NOT NULL, "deliveryDatePlan" TIMESTAMP NOT NULL, "deliveryDateActual" TIMESTAMP NOT NULL, "comment" character varying(100) NOT NULL, "idProject" integer, CONSTRAINT "PK_b4e802fc21373ebb3845bed6b69" PRIMARY KEY ("idProjectEvent"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Project" ("idProject" SERIAL NOT NULL, "code" character(15) NOT NULL, "product" character(20) NOT NULL, "startOfProduction" TIMESTAMP NOT NULL, CONSTRAINT "UQ_project_code" UNIQUE ("code"), CONSTRAINT "PK_404d3a2e42137edce7f7db11b57" PRIMARY KEY ("idProject"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Asset" ("idAsset" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "comment" character varying, "idProject" integer, "idCompany" integer, "idProductionLine" integer, CONSTRAINT "PK_124da049158cd7978d6c3d0848c" PRIMARY KEY ("idAsset"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Invoice" ("idInvoice" SERIAL NOT NULL, "issueDate" TIMESTAMP NOT NULL, "type" character(10) NOT NULL, "paymentDatePlan" TIMESTAMP, "paymentDateActual" TIMESTAMP, "idCompany" integer, CONSTRAINT "PK_edceba32018fd1cbf8bc64dad80" PRIMARY KEY ("idInvoice"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "PurchasingOrder" ("idPurchasingOrder" SERIAL NOT NULL, "productQty" double precision NOT NULL, "paymentCondition" character(30), "idCompany" integer, CONSTRAINT "PK_b42dc70f2285c74a7fafa455779" PRIMARY KEY ("idPurchasingOrder"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Company" ("idCompany" SERIAL NOT NULL, "nickname" character(50) NOT NULL, "name" character varying(100) NOT NULL, "cnpj" character(20), "ie" character(50), "im" character(50), CONSTRAINT "UQ_company_im" UNIQUE ("im"), CONSTRAINT "UQ_company_ie" UNIQUE ("ie"), CONSTRAINT "UQ_company_cnpj" UNIQUE ("cnpj"), CONSTRAINT "UQ_company_name" UNIQUE ("name"), CONSTRAINT "UQ_company_nickname" UNIQUE ("nickname"), CONSTRAINT "PK_fa85e02da803735d460d34b49ea" PRIMARY KEY ("idCompany"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Production" ("idProduction" SERIAL NOT NULL, "lineCode" character(20), "lineName" character varying(30) NOT NULL, "productQtyPlan" double precision NOT NULL, "productQtyActual" double precision NOT NULL, CONSTRAINT "PK_027376a9577e4eda0f84d10d4c9" PRIMARY KEY ("idProduction"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmployeeContract" ADD CONSTRAINT "FK_5d0965a004ae0a15d57a5769662" FOREIGN KEY ("idEmployeeContract") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmployeeVacation" ADD CONSTRAINT "FK_dee7837b49d3db91ff9eefaae3e" FOREIGN KEY ("employeeIdEmployee") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Kpi" ADD CONSTRAINT "FK_c80808997e7aeac5ddbe1c244fb" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmployeePosition" ADD CONSTRAINT "FK_bfcb5f84d614ed4c18c649fd874" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employee" ADD CONSTRAINT "FK_66f6caa27ec8a40e71343bf3ad3" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employee" ADD CONSTRAINT "FK_37717af96a4acd609eb7014dafd" FOREIGN KEY ("idDepartment") REFERENCES "Department"("idDepartment") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Address" ADD CONSTRAINT "FK_d62fc401adef8abd1726b140974" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Address" ADD CONSTRAINT "FK_5253219cb3b8acb8ccd8c64b8c3" FOREIGN KEY ("idEmployee") REFERENCES "Employee"("idEmployee") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_e7cb020075da242f91763021d3d" FOREIGN KEY ("productionLineIdProductionLine") REFERENCES "ProductionLine"("idProductionLine") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectEvent" ADD CONSTRAINT "FK_4ea3e6bace1e99ece86f0df1f89" FOREIGN KEY ("idProject") REFERENCES "Project"("idProject") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Asset" ADD CONSTRAINT "FK_1caa627147f9a9e00c270689dbf" FOREIGN KEY ("idProject") REFERENCES "Project"("idProject") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Asset" ADD CONSTRAINT "FK_a23a76e5719ee448de6b32d0999" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Asset" ADD CONSTRAINT "FK_8e493998491fc028b045f3f5eac" FOREIGN KEY ("idProductionLine") REFERENCES "ProductionLine"("idProductionLine") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_5932e7a3d17ae6c185429d107a2" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PurchasingOrder" ADD CONSTRAINT "FK_00ec1660808bfcbc824e011ab5b" FOREIGN KEY ("idCompany") REFERENCES "Company"("idCompany") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PurchasingOrder" DROP CONSTRAINT "FK_00ec1660808bfcbc824e011ab5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_5932e7a3d17ae6c185429d107a2"`,
    );
    await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_8e493998491fc028b045f3f5eac"`);
    await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_a23a76e5719ee448de6b32d0999"`);
    await queryRunner.query(`ALTER TABLE "Asset" DROP CONSTRAINT "FK_1caa627147f9a9e00c270689dbf"`);
    await queryRunner.query(
      `ALTER TABLE "ProjectEvent" DROP CONSTRAINT "FK_4ea3e6bace1e99ece86f0df1f89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_e7cb020075da242f91763021d3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Address" DROP CONSTRAINT "FK_5253219cb3b8acb8ccd8c64b8c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Address" DROP CONSTRAINT "FK_d62fc401adef8abd1726b140974"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employee" DROP CONSTRAINT "FK_37717af96a4acd609eb7014dafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employee" DROP CONSTRAINT "FK_66f6caa27ec8a40e71343bf3ad3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmployeePosition" DROP CONSTRAINT "FK_bfcb5f84d614ed4c18c649fd874"`,
    );
    await queryRunner.query(`ALTER TABLE "Kpi" DROP CONSTRAINT "FK_c80808997e7aeac5ddbe1c244fb"`);
    await queryRunner.query(
      `ALTER TABLE "EmployeeVacation" DROP CONSTRAINT "FK_dee7837b49d3db91ff9eefaae3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "EmployeeContract" DROP CONSTRAINT "FK_5d0965a004ae0a15d57a5769662"`,
    );
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
    await queryRunner.query(`DROP TABLE "EmployeePosition"`);
    await queryRunner.query(`DROP TABLE "Department"`);
    await queryRunner.query(`DROP TABLE "Kpi"`);
    await queryRunner.query(`DROP TABLE "EmployeeVacation"`);
    await queryRunner.query(`DROP TABLE "EmployeeContract"`);
    await queryRunner.query(`DROP TABLE "Users"`);
  }
}
