import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { Project } from './project.model';

@Entity('project_event')
export class ProjectEvent {
  @PrimaryGeneratedColumn({
    name: 'id_project_event',
    primaryKeyConstraintName: 'PK_project_event',
  })
  idProjectEvent: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ type: 'float' })
  productQtyPlan?: number;

  @Column({ type: 'float' })
  productQtyActual?: number;

  @Column({ type: 'timestamp' })
  deliveryDatePlan?: Timestamp;

  @Column({ type: 'timestamp' })
  deliveryDateActual?: Timestamp;

  @Column({ type: 'varchar', length: 100 })
  comment?: string;

  @ManyToOne(() => Project, project => project.projectEvent, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_project_event_project',
  })
  project: Project;
}
