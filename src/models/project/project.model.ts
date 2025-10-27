import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique } from 'typeorm';
import { ProjectEvent } from './project-event.model';
import { Product } from '@models/product/product.model';

@Unique('UQ_project_code', ['code'])
@Entity('project')
export class Project {
  @PrimaryGeneratedColumn({ name: 'id_project', primaryKeyConstraintName: 'PK_project' })
  idProject: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  code?: string;

  @Column({ type: 'timestamp', nullable: true })
  startOfProduction?: Timestamp;

  @OneToMany(() => Product, product => product.project, {
    nullable: true,
  })
  product?: Product[];

  @OneToMany(() => ProjectEvent, projectEvent => projectEvent.project, {
    nullable: true,
  })
  projectEvent?: ProjectEvent[];
}
