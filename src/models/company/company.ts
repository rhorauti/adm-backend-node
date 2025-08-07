import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Address } from '@models/address/address';
import { Employee } from '@models/employee/employee';
import { Asset } from '@models/asset/asset';
import { ProjectCompany } from '@models/project/project_company';
import { Invoice } from '@models/invoice/invoice';
import { Production } from '@models/production/production';
import { Product } from '@models/product/product';
import { PurchasingOrder } from '@models/purchasing-order/purchasingOrder';

@Unique('UQ_company_nickname', ['nickname'])
@Unique('UQ_company_name', ['name'])
@Unique('UQ_company_cnpj', ['cnpj'])
@Unique('UQ_company_ie', ['ie'])
@Unique('UQ_company_im', ['im'])
@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn()
  idCompany: number;

  @Column({ type: 'char', length: 50 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'char', length: 20, nullable: true })
  cnpj: string;

  @Column({ type: 'char', length: 50, nullable: true })
  ie?: string;

  @Column({ type: 'char', length: 50, nullable: true })
  im?: string;

  @OneToOne(() => Address, address => address.company, { nullable: true })
  address: Address;

  @OneToMany(() => Employee, employee => employee.company, { nullable: true })
  employee: Employee[];

  @OneToMany(() => Asset, asset => asset.company, { nullable: true })
  asset: Asset;

  @OneToMany(() => ProjectCompany, projectCompany => projectCompany.company, { nullable: true })
  projectCompany: ProjectCompany;

  @OneToMany(() => Invoice, invoice => invoice.company, { nullable: true })
  invoice: Invoice;

  @OneToMany(() => Production, production => production.company, { nullable: true })
  production: Production;

  @OneToMany(() => Product, product => product.company, { nullable: true })
  product: Product;

  @OneToMany(() => PurchasingOrder, purchasingOrder => purchasingOrder.company, { nullable: true })
  purchasingOrder: PurchasingOrder;
}
