import { Project } from '@models/project/project.model';
import { Task } from '@models/task/task.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product' })
  idProduct: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'int', nullable: true })
  stock: number;

  @Column({ type: 'int', nullable: true })
  comment?: number;

  @OneToMany(() => Task, task => task.product, { nullable: true })
  @JoinColumn({
    name: 'idTask',
    referencedColumnName: 'idTask',
    foreignKeyConstraintName: 'FK_asset_task',
  })
  task: Task[];

  @ManyToOne(() => Project, project => project.product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_asset_project',
  })
  project?: Project;
}
