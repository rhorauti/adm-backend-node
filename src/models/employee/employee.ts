import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Company } from '../company/company';
import { Address } from '@src/models/address/address';
import { EmployeeContract } from './employeeContract';
import { EmployeeVacation } from './employeeVacation';

@Unique('UQ_employee_name', ['name'])
@Unique('UQ_employee_cpf', ['cpf'])
@Entity('Employee')
export class Employee {
  @PrimaryGeneratedColumn()
  idEmployee: number;

  @Column({ type: 'bool' })
  isDefault: boolean;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'char', length: 14, unique: true, nullable: true })
  cpf: string;

  @Column({ type: 'char', length: 50, nullable: true })
  department: string;

  @Column({ type: 'char', length: 50, nullable: true })
  position: string;

  @Column({ type: 'char', length: 50, nullable: true })
  email: string;

  @Column({ type: 'char', length: 20, nullable: true })
  deskphone: string;

  @Column({ type: 'char', length: 20, nullable: true })
  cellphone: string;

  @ManyToOne(() => Company, company => company.employee, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCompany' })
  company: Company;

  @OneToOne(() => Address, address => address.employee, { nullable: true, onDelete: 'CASCADE' })
  address: Address;

  @OneToOne(() => EmployeeContract, employeeContract => employeeContract.employee, {
    nullable: true,
  })
  employeeContract: EmployeeContract;

  @OneToMany(() => EmployeeVacation, employeeVacation => employeeVacation.employee, {
    nullable: true,
  })
  employeeVacation: EmployeeVacation;
}
