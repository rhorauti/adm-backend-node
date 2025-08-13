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
import { Address } from '@models/address/address';
import { EmployeeContract } from './employeeContract';
import { EmployeeVacation } from './employeeVacation';
import { Department } from '@models/department/department';
import { EmployeePosition } from './employee-position';

@Unique('UQ_employee_cpf', ['cpf'])
@Unique('UQ_employee_name', ['name'])
@Entity('Employee')
export class Employee {
  @PrimaryGeneratedColumn()
  idEmployee: number;

  @Column({ type: 'bool' })
  isDefault: boolean;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'char', length: 14, unique: true, nullable: true })
  cpf?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  deskphone?: string;

  @Column({ type: 'varchar', nullable: true })
  photoUrl?: string;

  @Column({ type: 'char', length: 20, nullable: true })
  cellphone?: string;

  @ManyToOne(() => Company, company => company.employee, { nullable: true })
  @JoinColumn({ name: 'idCompany' })
  company?: Company;

  @ManyToOne(() => Department, department => department.employee, { nullable: true })
  @JoinColumn({ name: 'idDepartment' })
  department?: Department;

  @OneToOne(() => Address, address => address.employee, { nullable: true, onDelete: 'CASCADE' })
  address?: Address;

  @OneToOne(() => EmployeePosition, employeePosition => employeePosition.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  employeePosition?: EmployeePosition;

  @OneToOne(() => EmployeeContract, employeeContract => employeeContract.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  employeeContract?: EmployeeContract;

  @OneToMany(() => EmployeeVacation, employeeVacation => employeeVacation.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  employeeVacation?: EmployeeVacation[];
}
