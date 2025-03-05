import { Company } from '@models/company/company';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Asset')
export class Asset {
  @PrimaryGeneratedColumn()
  idAsset: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  project: string;

  @Column({ type: 'char', length: 100, nullable: true })
  productionLine: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  comment: string;

  @ManyToOne(() => Company, company => company.asset, { nullable: true })
  @JoinColumn({ name: 'idCompany' })
  company: Company;
}
