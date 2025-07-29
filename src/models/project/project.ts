import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, Unique } from 'typeorm';
import { ProjectCompany } from './project_company';
import { ProjectEvent } from './projectEvent';

@Unique('UQ_project_code', ['code'])
@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn()
  idProject: number;

  @Column({ type: 'timestamp' })
  date: Timestamp;

  @Column({ type: 'char', length: 15 })
  code: string;

  @Column({ type: 'char', length: 20 })
  product: string;

  @Column({ type: 'timestamp' })
  startOfProduction: Timestamp;

  @OneToMany(() => ProjectCompany, projectCompany => projectCompany.project, {
    onDelete: 'CASCADE',
  })
  projectCompany: ProjectCompany;

  @OneToMany(() => ProjectEvent, projectEvent => projectEvent.project)
  projectEvent: ProjectEvent;
}
