import { ProductionLine } from '@models/production-line/production-line';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  idProduct: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  stock?: number;

  @ManyToOne(() => ProductionLine, productionLine => productionLine.product, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  productionLine?: ProductionLine;
}
