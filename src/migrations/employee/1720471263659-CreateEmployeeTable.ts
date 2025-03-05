import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEmployeeTable1720471263659 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Employee',
        columns: [
          {
            name: 'idEmployee',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '14',
            isNullable: true,
          },
          {
            name: 'department',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'position',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'deskphone',
            type: 'char',
            length: '20',
            isNullable: true,
          },
          {
            name: 'cellphone',
            type: 'char',
            length: '20',
            isNullable: true,
          },
          {
            name: 'idCompany',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'Employee',
      new TableForeignKey({
        columnNames: ['idCompany'],
        referencedColumnNames: ['idCompany'],
        referencedTableName: 'Company',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Employee');
  }
}
