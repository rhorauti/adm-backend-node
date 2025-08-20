import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../employee/employee';
import { Company } from '@models/company/company';
import { Exclude } from 'class-transformer';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_address' })
  idAddress: number;

  @Column({ type: 'varchar', length: 15 })
  postalCode: string;

  @Column({ type: 'varchar', length: 150 })
  address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  complement: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string;

  @Exclude()
  @OneToOne(() => Company, company => company.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_address_company',
  })
  company: Company;

  @Exclude()
  @OneToOne(() => Employee, employee => employee.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_address_employee',
  })
  employee: Employee;
}
