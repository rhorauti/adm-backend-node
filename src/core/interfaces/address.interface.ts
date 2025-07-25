import { IDefaultResponse } from './base.interface';

export interface IAddress {
  idAddress: number;
  postalCode: string;
  address: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
}

export interface IAddressResponse extends IDefaultResponse {
  data?: IAddress;
}
