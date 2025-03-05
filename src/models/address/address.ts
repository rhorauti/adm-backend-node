import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from '../employee/employee';
import { Company } from '@models/company/company';

@Entity('Address')
export class Address {
  @PrimaryGeneratedColumn()
  idAddress: number;

  @Column({ type: 'char', length: 15 })
  nickname: string;

  @Column({ type: 'int' })
  isDelivery: number;

  @Column({ type: 'int' })
  isBilling: number;

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

  @ManyToOne(() => Company, company => company.adress, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idCompany' })
  company: Company;

  @OneToOne(() => Employee, employee => employee.adress, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idEmployee' })
  employee: Employee;
}
