import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAdressTable1720647166251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Address',
        columns: [
          {
            name: 'idAddress',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nickname',
            type: 'char',
            length: '15',
          },
          {
            name: 'isDelivery',
            type: 'int',
          },
          {
            name: 'isBilling',
            type: 'int',
          },
          {
            name: 'postalCode',
            type: 'char',
            length: '50',
          },
          {
            name: 'address',
            type: 'char',
            length: '150',
          },
          {
            name: 'number',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'complement',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'district',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'char',
            length: '50',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'char',
            length: '20',
            isNullable: true,
          },
          {
            name: 'idCompany',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'idEmployee',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'Address',
      new TableForeignKey({
        columnNames: ['idCompany'],
        referencedColumnNames: ['idCompany'],
        referencedTableName: 'Company',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Address');
  }
}
