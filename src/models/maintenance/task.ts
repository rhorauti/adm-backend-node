import { Employee } from '@models/employee/employee';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Task')
export class MaintenanceTask {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_maintenance_task' })
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  pauseTime: string;

  @Column({ type: 'timestamp' })
  finishTime: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  task: string;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(() => Employee, employee => employee.maintenanceTask, { nullable: true })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_maintenance_task_employee',
  })
  employee?: Employee;
}
