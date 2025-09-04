import { Task } from '@models/task/task.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_production_line_code', ['lineCode'])
@Entity('ProductionLine')
export class ProductionLine {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_production_line' })
  idProductionLine: number;

  @Column({ type: 'varchar' })
  lineCode: string;

  @Column({ type: 'varchar', nullable: true })
  lineName?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Task, task => task.productionLine, { nullable: true })
  task?: Task[];
}
