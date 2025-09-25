import { RelatedEntityProps } from '@core/types/base.type';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

@injectable()
export class BaseRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  getDataList = async (
    sortKey: keyof T,
    sortMethod = 'DESC',
    relations: RelatedEntityProps[] = [],
  ): Promise<T[]> => {
    return this.repository.find({
      order: { [sortKey]: sortMethod } as FindOptionsOrder<T>,
      relations: relations,
    });
  };

  getDataListByField = async (
    objectWhere: FindOptionsWhere<T>,
    sortKey: keyof T,
    sortMethod = 'DESC',
    relations: RelatedEntityProps[] = [],
  ): Promise<T[]> => {
    return await this.repository.find({
      where: objectWhere,
      order: { [sortKey]: sortMethod } as FindOptionsOrder<T>,
      relations: relations,
    });
  };

  getDataByField = async (
    objectWhere: FindOptionsWhere<T>,
    relations: RelatedEntityProps[] = [],
  ): Promise<T> => {
    return await this.repository.findOne({
      where: objectWhere,
      relations: relations,
    });
  };

  create = async (objectToBeCreated: DeepPartial<T>): Promise<T> => {
    return this.repository.create(objectToBeCreated);
  };

  updateField = async (
    objectWhere: FindOptionsWhere<T>,
    objectToBeUpdated: QueryDeepPartialEntity<T>,
  ): Promise<void> => {
    this.repository.update(objectWhere, objectToBeUpdated);
  };

  save = async (data: T): Promise<T> => {
    emptyStringToNull(data);
    return this.repository.save(data);
  };

  delete = async (id: number): Promise<void> => {
    await this.repository.delete(id);
  };
}
