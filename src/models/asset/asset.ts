import { Company } from '@models/company/company';
import { Product } from '@models/product/product';
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

  @ManyToOne(() => Product, product => product.asset, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idProduct',
    referencedColumnName: 'idProduct',
    foreignKeyConstraintName: 'FK_asset_product',
  })
  product: Product;

  @ManyToOne(() => Project, project => project.asset, { nullable: true })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_asset_project',
  })
  project?: Project;

  @ManyToOne(() => Company, company => company.asset, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_asset_company',
  })
  company?: Company;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.asset, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idProductionLine',
    referencedColumnName: 'idProductionLine',
    foreignKeyConstraintName: 'FK_asset_production_line',
  })
  productionLine?: ProductionLine;
}
