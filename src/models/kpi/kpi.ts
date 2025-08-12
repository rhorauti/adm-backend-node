import { Department } from '@models/department/department';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Kpi')
export class Kpi {
  @PrimaryGeneratedColumn()
  idKpi: number;

  @Column({ type: 'varchar' })
  goal: string;

  @Column({ type: 'char', length: 2 })
  operator?: string;

  @Column({ type: 'float' })
  metric?: number;

  @Column({ type: 'char', length: 5 })
  unit?: string;

  @ManyToOne(() => Department, department => department.kpi, { nullable: true })
  @JoinColumn({ name: 'idDepartment' })
  department?: Department;
}
