import { Project } from '@models/project/project.model';
import { Task } from '@models/task/task.model';
import { Unit } from '@models/unit/unit.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductType } from './product-type.model';

@Unique('UQ_product_internal_part_number', ['internalPartNumber'])
@Unique('UQ_product_customer_part_number', ['customerPartNumber'])
@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_product' })
  idProduct: number;

  @Column({ type: 'varchar' })
  internalPartNumber: string;

  @Column({ type: 'varchar', nullable: true })
  customerPartNumber: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nameTranslated: string;

  @Column({ type: 'int', nullable: true })
  origin?: number;

  @Column({ type: 'varchar', nullable: true })
  ncm?: string;

  @Column({ type: 'decimal', nullable: true })
  icms?: number;

  @Column({ type: 'decimal', nullable: true })
  pis?: number;

  @Column({ type: 'decimal', nullable: true })
  cofins?: number;

  @Column({ type: 'decimal', nullable: true })
  ipi?: number;

  @Column({ type: 'varchar', nullable: true })
  purchasingCurrency?: string;

  @Column({ type: 'decimal', nullable: true })
  purchasingUnitPrice?: number;

  @Column({ type: 'varchar', nullable: true })
  salesCurrency?: string;

  @Column({ type: 'decimal', nullable: true })
  salesUnitPrice?: number;

  @Column({ type: 'varchar', nullable: true })
  materialSpec?: string;

  @Column({ type: 'decimal', nullable: true })
  width?: number;

  @Column({ type: 'decimal', nullable: true })
  height?: number;

  @Column({ type: 'decimal', nullable: true })
  depth?: number;

  @Column({ type: 'decimal', nullable: true })
  weight?: number;

  @Column({ type: 'decimal', nullable: true })
  stock?: number;

  @Column({ type: 'varchar', nullable: true })
  qrcode?: string;

  @Column({ type: 'varchar', nullable: true })
  photoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  comment?: string;

  @OneToMany(() => Task, task => task.product, { nullable: true })
  task?: Task[];

  @ManyToOne(() => Project, project => project.product, { nullable: true })
  @JoinColumn({
    name: 'idProject',
    referencedColumnName: 'idProject',
    foreignKeyConstraintName: 'FK_product_project',
  })
  project?: Project;

  @ManyToOne(() => Unit, unit => unit.product, { nullable: true })
  @JoinColumn({
    name: 'idUnit',
    referencedColumnName: 'idUnit',
    foreignKeyConstraintName: 'FK_product_unit',
  })
  unit?: Unit;

  @ManyToOne(() => ProductType, productType => productType.product, { nullable: true })
  @JoinColumn({
    name: 'idProductType',
    referencedColumnName: 'idProductType',
    foreignKeyConstraintName: 'FK_product_product_type',
  })
  productType?: ProductType;
}
