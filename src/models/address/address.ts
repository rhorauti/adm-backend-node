import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../employee/employee';
import { Company } from '@models/company/company';
import { Exclude } from 'class-transformer';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn()
  idAddress: number;

  @Column({ type: 'char', length: 15 })
  postalCode: string;

  @Column({ type: 'varchar', length: 150 })
  address: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  number: string;

  @Column({ type: 'char', length: 50, nullable: true })
  complement: string;

  @Column({ type: 'char', length: 50, nullable: true })
  district: string;

  @Column({ type: 'char', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string;

  @Exclude()
  @OneToOne(() => Company, company => company.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCompany' })
  company: Company;

  @Exclude()
  @OneToOne(() => Employee, employee => employee.address, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEmployee' })
  employee: Employee;
}
