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
import { MaintenanceTask } from '@models/maintenance/task';

@Unique('UQ_employee_cpf', ['cpf'])
@Unique('UQ_employee_name', ['name'])
@Entity('Employee')
export class Employee {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee' })
  idEmployee: number;

  @Column({ type: 'bool' })
  isDefault: boolean;

  @Column({ type: 'varchar' })
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

  @ManyToOne(() => Company, company => company.employee, { nullable: true })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_employee_company',
  })
  company?: Company;

  @ManyToOne(() => Department, department => department.employee, { nullable: true })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_employee_department',
  })
  department?: Department;

  @OneToOne(() => Address, address => address.employee, { nullable: true, onDelete: 'CASCADE' })
  address?: Address;

  @OneToOne(() => EmployeePosition, employeePosition => employeePosition.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idEmployeePosition',
    referencedColumnName: 'idEmployeePosition',
    foreignKeyConstraintName: 'FK_employee_employee_position',
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

  @OneToMany(() => MaintenanceTask, maintenanceTask => maintenanceTask.employee, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  maintenanceTask?: MaintenanceTask[];
}
