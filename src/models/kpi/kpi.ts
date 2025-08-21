import { Department } from '@models/department/department';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Kpi')
export class Kpi {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_kpi' })
  idKpi: number;

  @Column({ type: 'varchar', nullable: true })
  goal: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  operator?: string;

  @Column({ type: 'float', nullable: true })
  metric?: number;

  @Column({ type: 'varchar', length: 5, nullable: true })
  unit?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Department, department => department.kpi, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_kpi_department',
  })
  department?: Department;
}
