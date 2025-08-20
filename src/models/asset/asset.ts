import { Company } from '@models/company/company';
import { ProductionLine } from '@models/production-line/production-line';
import { Project } from '@models/project/project';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Asset')
export class Asset {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_asset' })
  idAsset: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @ManyToOne(() => Project, project => project.asset, { nullable: true })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_asset_project',
  })
  project?: Project;

  @ManyToOne(() => Company, company => company.asset, { nullable: true })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_asset_company',
  })
  company?: Company;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.asset, { nullable: true })
  @JoinColumn({
    name: 'idProductionLine',
    referencedColumnName: 'idProductionLine',
    foreignKeyConstraintName: 'FK_asset_production_line',
  })
  productionLine?: ProductionLine;
}
