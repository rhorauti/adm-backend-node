import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from './employee';

@Unique('UQ_employee_position_name', ['name'])
@Entity('EmployeePosition')
export class EmployeePosition {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee_position' })
  idEmployeePosition: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToOne(() => Employee, employee => employee.employeePosition, { nullable: true })
  employee: Employee;
}
