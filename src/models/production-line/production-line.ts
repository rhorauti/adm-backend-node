import { Asset } from '@models/asset/asset';
import { Product } from '@models/product/product';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_production_line_code', ['lineCode'])
@Entity('ProductionLine')
export class ProductionLine {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_production_line' })
  idProductionLine: number;

  @Column({ type: 'varchar' })
  lineCode?: string;

  @Column({ type: 'varchar' })
  lineName?: string;

  @OneToMany(() => Asset, asset => asset.productionLine, { nullable: true, onDelete: 'CASCADE' })
  asset?: Asset[];

  @OneToMany(() => Product, product => product.productionLine, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product?: Product[];
}
