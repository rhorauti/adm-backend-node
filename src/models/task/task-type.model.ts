import { Department } from '@models/department/department.model';
import { Task } from '@models/task/task.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TaskType')
export class TaskType {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_task_type' })
  idTaskType: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  comment?: string;

  @OneToMany(() => Task, task => task.taskType, {
    nullable: true,
  })
  task?: Task[];

  @ManyToOne(() => Department, department => department.taskType, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_task_type_department',
  })
  department?: Department;
}
