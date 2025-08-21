import { Asset } from '@models/asset/asset';
import { ProductionLine } from '@models/production-line/production-line';
import { Project } from '@models/project/project';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product' })
  idProduct: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', nullable: true })
  stock?: number;

  @Column({ type: 'int', nullable: true })
  comment?: number;

  @OneToMany(() => Asset, asset => asset.product, {
    nullable: true,
  })
  asset: Asset;

  @ManyToOne(() => Project, project => project.product, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_product_project',
  })
  project?: Project;
}
