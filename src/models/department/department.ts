import { Employee } from '@models/employee/employee';
import { Kpi } from '@models/kpi/kpi';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_department_name', ['name'])
@Entity('Department')
export class Department {
  @PrimaryGeneratedColumn()
  idDepartment: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Employee, employee => employee.department, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  employee: Employee[];

  @OneToMany(() => Kpi, kpi => kpi.department, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  kpi: Kpi[];
}
