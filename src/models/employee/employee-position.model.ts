import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.model';

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
