import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from './employee.model';

@Unique('UQ_employee_name', ['name'])
@Entity('employee_position')
export class EmployeePosition {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee_position' })
  idEmployeePosition: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Employee, employee => employee.employeePosition, {
    nullable: true,
    cascade: true,
  })
  employee?: Employee;
}
