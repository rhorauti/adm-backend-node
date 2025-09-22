import { ProductType } from '@models/product/product-type.model';
import { IDefaultResponse } from './base.interface';
import { Product } from '@models/product/product.model';

export interface IProductTypeResponse extends IDefaultResponse {
  data: ProductType | ProductType[];
}

export interface IProductResponse extends IDefaultResponse {
  data: Product | Product[] | string[];
}
