import { Company } from '@models/company/company.model';
import { Invoice } from '@models/invoice/invoice.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('purchasing_order')
export class PurchasingOrder {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_purchasing_order' })
  idPurchasingOrder: number;

  @Column({ type: 'float', nullable: true })
  productQty?: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  paymentCondition?: string;

  @ManyToOne(() => Company, company => company.purchasingOrder, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FK_purchasing_order_company',
  })
  company: Company;

  @OneToMany(() => Invoice, invoice => invoice.purchasingOrder, {
    nullable: true,
  })
  invoice: Invoice[];
}
