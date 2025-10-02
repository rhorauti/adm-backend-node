import { TaskType } from '@models/task/task-type.model';
import { Kpi } from '@models/kpi/kpi.model';
import { Product } from '@models/product/product.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '@models/employee/employee.model';
import { IDetailedPhoto } from '@core/interfaces/photo.interface';
import { IUsedSpareParts } from '@core/interfaces/task.interface';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_task' })
  idTask?: number;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'int', nullable: true })
  status?: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishDate?: Date;

  @Column('jsonb', { nullable: true })
  photoPath?: IDetailedPhoto[];

  @Column('jsonb', { nullable: true })
  usedSpareParts?: IUsedSpareParts[];

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Employee, employee => employee.task, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_task_employee',
  })
  employee?: Employee;

  @ManyToOne(() => TaskType, taskType => taskType.task, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idTaskType',
    referencedColumnName: 'idTaskType',
    foreignKeyConstraintName: 'FK_task_task_type',
  })
  taskType?: TaskType;

  @ManyToOne(() => Kpi, kpi => kpi.task, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idKpi',
    referencedColumnName: 'idKpi',
    foreignKeyConstraintName: 'FK_task_kpi',
  })
  kpi?: Kpi;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.task, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idProductionLine',
    referencedColumnName: 'idProductionLine',
    foreignKeyConstraintName: 'FK_task_production_line',
  })
  productionLine?: ProductionLine;

  @ManyToOne(() => Product, product => product.task, {
    nullable: true,
  })
  @JoinColumn({
    name: 'idProduct',
    referencedColumnName: 'idProduct',
    foreignKeyConstraintName: 'FK_task_product',
  })
  product?: Product;
}
