import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Employee } from './employee.model';

@Entity('employee_vacation')
export class EmployeeVacation {
  @PrimaryGeneratedColumn({
    name: 'id_employee_vacation',
    primaryKeyConstraintName: 'PK_employee_vacation',
  })
  idEmployeeVacation: number;

  @Column({ type: 'boolean' })
  isOnVacation: boolean;

  @Column({ type: 'int' })
  contractLeadtime: number;

  @Column({ type: 'int' })
  availableLeadtime: number;

  @Column({ type: 'timestamp' })
  startDate: Timestamp;

  @Column({ type: 'timestamp' })
  finishDate: Timestamp;

  @Column({ type: 'timestamp' })
  limitDate: Timestamp;

  @Column({ type: 'varchar', length: 300 })
  comment: string;

  @ManyToOne(() => Employee, employee => employee.employeeVacation, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_employee_vacation_employee',
  })
  employee: Employee;
}
