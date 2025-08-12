import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from './employee';

@Unique('UQ_employee_position_name', ['name'])
@Entity('EmployeePosition')
export class EmployeePosition {
  @PrimaryGeneratedColumn()
  idEmployeePosition: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @ManyToOne(() => Employee, employee => employee.employeePosition, { nullable: true })
  @JoinColumn({ name: 'idEmployee' })
  employee: Employee;
}
