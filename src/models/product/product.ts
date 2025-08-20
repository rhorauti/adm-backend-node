import { ProductionLine } from '@models/production-line/production-line';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product' })
  idProduct: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  stock?: number;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.product, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idProductionLine',
    referencedColumnName: 'idProductionLine',
    foreignKeyConstraintName: 'FK_product_production_line',
  })
  productionLine?: ProductionLine;
}
