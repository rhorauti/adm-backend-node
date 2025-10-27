import { Department } from '@models/department/department.model';
import { Task } from '@models/task/task.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task_type')
export class TaskType {
  @PrimaryGeneratedColumn({ name: 'id_task_type', primaryKeyConstraintName: 'PK_task_type' })
  idTaskType: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Task, task => task.taskType, {
    nullable: true,
  })
  task?: Task[];

  @ManyToOne(() => Department, department => department.taskType, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_task_type_department',
  })
  department?: Department;
}
