import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Production')
export class Production {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_production' })
  idProduction: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  lineCode?: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lineName?: string;

  @Column({ type: 'float', nullable: true })
  productQtyPlan?: number;

  @Column({ type: 'float', nullable: true })
  productQtyActual?: number;
}
