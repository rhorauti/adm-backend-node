import { Kpi } from '@models/kpi/kpi.model';
import { IDefaultResponse } from './base.interface';

export interface IKpiResponse extends IDefaultResponse {
  data: Kpi;
}
