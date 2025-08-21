import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Address } from '@models/address/address';
import { Employee } from '@models/employee/employee';
import { Asset } from '@models/asset/asset';
import { Invoice } from '@models/invoice/invoice';
import { PurchasingOrder } from '@models/purchasing-order/purchasingOrder';

@Unique('UQ_company_nickname', ['nickname'])
@Unique('UQ_company_name', ['name'])
@Unique('UQ_company_cnpj', ['cnpj'])
@Unique('UQ_company_ie', ['ie'])
@Unique('UQ_company_im', ['im'])
@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_company' })
  idCompany: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cnpj?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ie?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  im?: string;

  @OneToOne(() => Address, address => address.company, { nullable: true })
  address: Address;

  @OneToMany(() => Employee, employee => employee.company, { nullable: true })
  employee: Employee[];

  @OneToMany(() => Asset, asset => asset.company, { nullable: true })
  asset: Asset;

  @OneToMany(() => Invoice, invoice => invoice.company, { nullable: true })
  invoice: Invoice;

  @OneToMany(() => PurchasingOrder, purchasingOrder => purchasingOrder.company, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  purchasingOrder: PurchasingOrder;
}
