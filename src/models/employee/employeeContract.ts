import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee';

@Entity('EmployeeContract')
export class EmployeeContract {
  @PrimaryGeneratedColumn()
  idEmployeeContract: number;

  // production or office
  @Column({ type: 'char', length: 15 })
  type: string;

  // inform time or costum work time
  @Column({ type: 'char', length: 10, nullable: true })
  workTime: string;

  // Office or Production
  @Column({ type: 'char', length: 15, nullable: true })
  workType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string;

  @OneToOne(() => Employee, employee => employee.employeeContract)
  @JoinColumn({ name: 'idEmployeeContract' })
  employee: Employee;
}
