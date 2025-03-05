import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project';
import { Company } from '@models/company/company';

@Entity()
export class ProjectCompany {
  @PrimaryGeneratedColumn()
  idProjectCompany: number;

  @ManyToOne(() => Company, company => company.projectCompany, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCompany' })
  company: Company;

  @ManyToOne(() => Project, project => project.projectCompany, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idProject' })
  project: Project;
}
