import { IDefaultResponse } from './base.interface';
import { ProductionLine } from '@models/production-line/production-line.model';

export interface IProductionLineResponse extends IDefaultResponse {
  data: ProductionLine;
}
