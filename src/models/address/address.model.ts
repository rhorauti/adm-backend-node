import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../employee/employee.model';
import { Company } from '@models/company/company.model';
import { Exclude } from 'class-transformer';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn({ name: 'id_address', primaryKeyConstraintName: 'PK_address' })
  idAddress: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  postalCode?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  number?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  complement?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  district?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state?: string;

  @Exclude()
  @OneToOne(() => Company, company => company.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_address_company',
  })
  company?: Company;

  @Exclude()
  @OneToOne(() => Employee, employee => employee.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_address_employee',
  })
  employee?: Employee;
}
