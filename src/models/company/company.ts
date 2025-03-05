import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from '@src/models/address/address';
import { Employee } from '@models/employee/employee';
import { Asset } from '@models/asset/asset';
import { ProjectCompany } from '@models/project/project_company';
import { Invoice } from '@models/invoice/invoice';
import { Production } from '@models/production/production';
import { Product } from '@models/product/product';
import { PurchasingOrder } from '@models/purchasing-order/purchasingOrder';

@Entity('Company')
export class Company {
  @PrimaryGeneratedColumn()
  idCompany: number;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'char', length: 50 })
  nickname: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'char', length: 20, nullable: true })
  cnpj: string;

  @Column({ type: 'char', length: 50, nullable: true })
  ie: string;

  @Column({ type: 'char', length: 50, nullable: true })
  im: string;

  @OneToMany(() => Address, adress => adress.company, { nullable: true })
  adress: Address[];

  @OneToMany(() => Employee, employee => employee.company, { nullable: true })
  employee: Employee;

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
