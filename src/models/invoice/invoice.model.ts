import { PurchasingOrder } from '@models/purchasing-order/purchasing-order.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'id_invoice', primaryKeyConstraintName: 'PK_invoice' })
  idInvoice: number;

  @Column({ type: 'timestamp' })
  issueDate: Timestamp;

  //entrada ou saída
  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDatePlan: Date;

  @Column({ type: 'timestamp', nullable: true })
  paymentDateActual: Date;

  @ManyToOne(() => PurchasingOrder, purchasingOrder => purchasingOrder.invoice, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'idPurchasingOrder',
    referencedColumnName: 'idPurchasingOrder',
    foreignKeyConstraintName: 'FR_invoice_purchasing_order',
  })
  purchasingOrder: PurchasingOrder;
}
