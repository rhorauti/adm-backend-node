import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Employee } from './employee.model';

@Unique('UQ_employee_position_name', ['name'])
@Entity('EmployeePosition')
export class EmployeePosition {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee_position' })
  idEmployeePosition: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Employee, employee => employee.employeePosition, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_employee_position_employee',
  })
  employee?: Employee;
}
