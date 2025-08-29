import { Department } from '@models/department/department.model';
import { Task } from '@models/task/task.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Kpi')
export class Kpi {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_kpi' })
  idKpi: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  goal: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  operator?: string;

  @Column({ type: 'float', nullable: true })
  metric?: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  unit?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Task, task => task.kpi, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  task?: Task[];

  @ManyToOne(() => Department, department => department.kpi, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_kpi_department',
  })
  department?: Department;
}
