import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Tasks')
export class MaintenanceTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  employee: string;

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
}
