import { TaskType } from '@models/task/task-type.model';
import { Kpi } from '@models/kpi/kpi.model';
import { Product } from '@models/product/product.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '@models/employee/employee.model';

@Entity('Task')
export class Task {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_maintenance_task' })
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column('text', { array: true, nullable: true })
  photoUrls: string[];

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Employee, employee => employee.task, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idEmployee',
    referencedColumnName: 'idEmployee',
    foreignKeyConstraintName: 'FK_task_employee',
  })
  employee?: Employee;

  @ManyToOne(() => TaskType, taskType => taskType.task, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idTaskType',
    referencedColumnName: 'idTaskType',
    foreignKeyConstraintName: 'FK_task_task_type',
  })
  taskType?: TaskType;

  @ManyToOne(() => Kpi, kpi => kpi.task, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idKpi',
    referencedColumnName: 'idKpi',
    foreignKeyConstraintName: 'FK_task_kpi',
  })
  kpi?: Kpi;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.task, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idProductionLine',
    referencedColumnName: 'idProductionLine',
    foreignKeyConstraintName: 'FK_task_production_line',
  })
  productionLine?: ProductionLine;

  @ManyToOne(() => Product, product => product.task, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idProduct',
    referencedColumnName: 'idProduct',
    foreignKeyConstraintName: 'FK_task_product',
  })
  product?: Product;
}
