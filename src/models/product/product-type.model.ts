import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Product } from './product.model';

//	MP	Matéria-Prima
//	SA	Submontagem
//	PA	Produto Acabado
//	ME	Material de Embalagem
//	MRO	Consumível
//	SV	Serviço

@Unique('UQ_product_type_name', ['name'])
@Entity('product_type')
export class ProductType {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product_type' })
  idProductType: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Product, product => product.productType, {
    nullable: true,
  })
  product?: Product[];
}
