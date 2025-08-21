import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique } from 'typeorm';
import { ProjectEvent } from './projectEvent';
import { Asset } from '@models/asset/asset';
import { Product } from '@models/product/product';

@Unique('UQ_project_code', ['code'])
@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_project' })
  idProject: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  code?: string;

  @Column({ type: 'timestamp', nullable: true })
  startOfProduction?: Timestamp;

  @OneToMany(() => Product, product => product.project, {
    nullable: true,
  })
  product?: Product[];

  @OneToMany(() => Asset, asset => asset.project, {
    nullable: true,
  })
  asset?: Asset[];

  @OneToMany(() => ProjectEvent, projectEvent => projectEvent.project, {
    nullable: true,
  })
  projectEvent?: ProjectEvent[];
}
