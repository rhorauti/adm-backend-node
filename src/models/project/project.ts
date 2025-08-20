import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique } from 'typeorm';
import { ProjectEvent } from './projectEvent';
import { Asset } from '@models/asset/asset';

@Unique('UQ_project_code', ['code'])
@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_project' })
  idProject: number;

  @Column({ type: 'varchar', length: 15 })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  product: string;

  @Column({ type: 'timestamp' })
  startOfProduction: Timestamp;

  @OneToMany(() => Asset, asset => asset.project, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  asset?: Asset[];

  @OneToMany(() => ProjectEvent, projectEvent => projectEvent.project, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  projectEvent?: ProjectEvent[];
}
