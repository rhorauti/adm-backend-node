import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from './employee.model';

@Unique('UQ_employee_name', ['name'])
@Entity('EmployeePosition')
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
