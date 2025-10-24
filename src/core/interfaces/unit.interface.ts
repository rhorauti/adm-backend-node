import { Unit } from '@models/unit/unit.model';
import { IDefaultResponse } from './base.interface';

export interface IUnitResponse extends IDefaultResponse {
  data: Unit | Unit[];
}

export type PartialUnit = Pick<Unit, 'idUnit' | 'name'>;
