import { Employee } from '@models/employee/employee';
import { Kpi } from '@models/kpi/kpi';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_department_name', ['name'])
@Entity('Department')
export class Department {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_department' })
  idDepartment: number;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Employee, employee => employee.department, {
    nullable: true,
  })
  employee?: Employee[];

  @OneToMany(() => Kpi, kpi => kpi.department, { nullable: true })
  kpi?: Kpi[];
}
