import { PurchasingOrder } from '@models/purchasing-order/purchasing-order.model';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('Invoice')
export class Invoice {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_invoice' })
  idInvoice: number;

  @Column({ type: 'timestamp' })
  issueDate: Timestamp;

  //entrada ou saída
  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentDatePlan: Timestamp;

  @Column({ type: 'timestamp', nullable: true })
  paymentDateActual: Timestamp;

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
