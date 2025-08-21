import { Asset } from '@models/asset/asset';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_production_line_code', ['lineCode'])
@Entity('ProductionLine')
export class ProductionLine {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_production_line' })
  idProductionLine: number;

  @Column({ type: 'varchar', nullable: true })
  lineCode?: string;

  @Column({ type: 'varchar', nullable: true })
  lineName?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Asset, asset => asset.productionLine, { nullable: true })
  asset?: Asset[];
}
