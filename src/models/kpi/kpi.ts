import { Department } from '@models/department/department';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Kpi')
export class Kpi {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_kpi' })
  idKpi: number;

  @Column({ type: 'varchar' })
  goal: string;

  @Column({ type: 'varchar', length: 2 })
  operator?: string;

  @Column({ type: 'float' })
  metric?: number;

  @Column({ type: 'varchar', length: 5 })
  unit?: string;

  @ManyToOne(() => Department, department => department.kpi, { nullable: true })
  @JoinColumn({
    name: 'idDepartment',
    referencedColumnName: 'idDepartment',
    foreignKeyConstraintName: 'FK_kpi_department',
  })
  department?: Department;
}
