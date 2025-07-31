import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCompanyTable1718214462553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Company',
        columns: [
          {
            name: 'idCompany',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nickname',
            type: 'char',
            length: '50',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'cnpj',
            type: 'char',
            length: '20',
            isNullable: true,
          },
          {
            name: 'ie',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'im',
            type: 'char',
            length: '50',
            isNullable: true,
          },
        ],

        uniques: [
          {
            name: 'UQ_company_nickname',
            columnNames: ['nickname'],
          },
          {
            name: 'UQ_company_name',
            columnNames: ['name'],
          },
          {
            name: 'UQ_company_cnpj',
            columnNames: ['cnpj'],
          },
          {
            name: 'UQ_company_ie',
            columnNames: ['ie'],
          },
          {
            name: 'UQ_company_im',
            columnNames: ['im'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Company');
  }
}
