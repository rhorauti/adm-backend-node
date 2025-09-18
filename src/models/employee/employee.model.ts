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
import { Company } from '../company/company.model';
import { Address } from '@models/address/address.model';
import { EmployeeContract } from './employee-contract.model';
import { EmployeeVacation } from './employee-vacation.model';
import { Department } from '@models/department/department.model';
import { EmployeePosition } from './employee-position.model';
import { Task } from '@models/task/task.model';

@Unique('UQ_employee_cpf', ['cpf'])
@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee' })
  idEmployee: number;

  @Column({ type: 'bool' })
  isDefault: boolean = false;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  cpf?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  deskphone?: string;

  @Column({ type: 'varchar', nullable: true })
  photoUrl?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cellphone?: string;

  @ManyToOne(() => Company, company => company.employee, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_employee_company',
  })
  company?: Company;

  @ManyToOne(() => Department, department => department.employee, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_employee_department',
  })
  department?: Department;

  @OneToOne(() => Address, address => address.employee, { nullable: true })
  address?: Address;

  @ManyToOne(() => EmployeePosition, employeePosition => employeePosition.employee, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idEmployeePosition',
    referencedColumnName: 'idEmployeePosition',
    foreignKeyConstraintName: 'FK_employee_employee_position',
  })
  employeePosition?: EmployeePosition;

  @OneToOne(() => EmployeeContract, employeeContract => employeeContract.employee, {
    nullable: true,
  })
  employeeContract?: EmployeeContract;

  @OneToMany(() => EmployeeVacation, employeeVacation => employeeVacation.employee, {
    nullable: true,
  })
  employeeVacation?: EmployeeVacation[];

  @OneToMany(() => Task, task => task.employee, {
    nullable: true,
  })
  task?: Task[];
}
