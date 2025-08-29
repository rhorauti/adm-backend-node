import { Address } from '@models/address/address.model';
import { IDefaultResponse } from './base.interface';

export interface IAddressResponse extends IDefaultResponse {
  data?: Address;
}
