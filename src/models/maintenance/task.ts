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

  @Column({ type: 'timestamp', nullable: true })
  pauseTime?: string;

  @Column({ type: 'timestamp', nullable: true })
  finishTime?: string;

  @Column({ type: 'varchar', nullable: true })
  type?: string;

  @Column({ type: 'varchar', nullable: true })
  task?: string;

  @Column({ type: 'varchar', nullable: true })
  status?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Employee, employee => employee.maintenanceTask, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_maintenance_task_employee',
  })
  employee?: Employee;
}
