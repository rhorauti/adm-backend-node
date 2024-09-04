import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../employee/employee';
import { Company } from '@models/company/company';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn()
  idAddress: number;

  @Column({ type: 'char', length: 15 })
  type: string;

  @Column({ type: 'varchar', length: 150 })
  address: string;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'char', length: 50, nullable: true })
  complement: string;

  @Column({ type: 'char', length: 50 })
  district: string;

  @Column({ type: 'char', length: 50 })
  city: string;

  @Column({ type: 'varchar', length: 2 })
  state: string;

  @ManyToOne(() => Company, company => company.adress, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_Company' })
  company: Company;

  @OneToOne(() => Employee, employee => employee.adress, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_Employee' })
  employee: Employee;
}
