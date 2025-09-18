import { Product } from '@models/product/product.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique('UQ_unit_name', ['name'])
@Entity('unit')
export class Unit {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_unit' })
  idUnit: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Product, product => product.unit, { nullable: true })
  product?: Product[];
}
