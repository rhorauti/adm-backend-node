export interface IAddress {
  idAddress: number;
  nickname: string;
  isDelivery: number;
  isBilling: number;
  postalCode: string;
  address: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  idCompany: number;
  idEmployee?: number;
}
