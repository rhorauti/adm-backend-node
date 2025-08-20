import { Company } from '@models/company/company';
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

  @ManyToOne(() => Company, company => company.invoice, { nullable: true })
  @JoinColumn({
    name: 'idCompany',
    referencedColumnName: 'idCompany',
    foreignKeyConstraintName: 'FR_invoice_company',
  })
  company: Company;
}
