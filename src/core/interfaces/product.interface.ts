import { ProductType } from '@models/product/product-type.model';
import { IDefaultResponse } from './base.interface';
import { Product } from '@models/product/product.model';
import { PartialUnit } from './unit.interface';

export interface IProductTypeResponse extends IDefaultResponse {
  data: ProductType | ProductType[];
}

export interface IProductResponse extends IDefaultResponse {
  data: Product | Product[] | string[];
}

export type PartialProductType = Pick<ProductType, 'idProductType' | 'name'>;

export interface IProductHome {
  idProduct: number;
  internalPartNumber?: string;
  customerPartNumber?: string;
  name?: string;
  nameTranslated?: string;
  origin?: number;
  unit?: string;
  stock?: number;
}

export interface IProductForm {
  idProduct: number | null;
  internalPartNumber?: string;
  customerPartNumber?: string;
  name: string;
  nameTranslated?: string;
  origin: number;
  ncm?: string;
  icms?: number;
  pis?: number;
  cofins?: number;
  ipi?: number;
  purchasingCurrency?: string;
  purchasingUnitPrice?: number;
  salesCurrency?: string;
  salesUnitPrice?: number;
  materialSpec: string;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  qrcode?: string;
  photoUrl?: string;
  comment?: string;
  unitList?: PartialUnit[];
  unit: PartialUnit;
  productTypeList?: PartialProductType[];
  productType: PartialProductType;
}
