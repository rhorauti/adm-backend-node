import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee';

@Entity('EmployeeContract')
export class EmployeeContract {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_employee_contract' })
  idEmployeeContract: number;

  // production or office
  @Column({ type: 'varchar', length: 15 })
  type: string;

  // inform time or costum work time
  @Column({ type: 'varchar', length: 10, nullable: true })
  workTime: string;

  // Office or Production
  @Column({ type: 'varchar', length: 15, nullable: true })
  workType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @OneToOne(() => Employee, employee => employee.employeeContract)
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_employee_contract_employee',
  })
  employee: Employee;
}
