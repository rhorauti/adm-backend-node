import { emptyToNullRecursive } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';

interface GetDataParams<T> {
  select?: FindOptionsSelect<T>;
  where?: FindOptionsWhere<T>;
  relations?: FindOptionsRelationByString | FindOptionsRelations<T>;
  order?: FindOptionsOrder<T>;
}

@injectable()
export class BaseRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  // getDataList = async (
  //   sortKey: keyof T,
  //   relations: RelatedEntityProps[] = [],
  //   select: FindOptionsSelect<T> = {},
  //   sortMethod = 'DESC',
  // ): Promise<T[]> => {
  //   return this.repository.find({
  //     select: select,
  //     order: { [sortKey]: sortMethod } as FindOptionsOrder<T>,
  //     relations: relations,
  //   });
  // };

  // getDataListByField = async (
  //   objectWhere: FindOptionsWhere<T>,
  //   sortKey: keyof T,
  //   relations: RelatedEntityProps[] = [],
  //   sortMethod = 'DESC',
  // ): Promise<T[]> => {
  //   return await this.repository.find({
  //     where: objectWhere,
  //     order: { [sortKey]: sortMethod } as FindOptionsOrder<T>,
  //     relations: relations,
  //   });
  // };

  getDataList = async (params: GetDataParams<T> = {}): Promise<T[]> => {
    const { select = {}, where = {}, relations = [], order = {} } = params;
    return await this.repository.find({
      select: select,
      where: where,
      order: order,
      relations: relations,
    });
  };

  getData = async (params: GetDataParams<T> = {}): Promise<T> => {
    const { select = {}, where = {}, relations = [], order = {} } = params;
    return await this.repository.findOne({
      select: select,
      where: where,
      order: order,
      relations: relations,
    });
  };

  create = async (objectToBeCreated: DeepPartial<T>): Promise<T> => {
    return this.repository.create(objectToBeCreated);
  };

  updateField = async (
    where: FindOptionsWhere<T>,
    valueToBeUpdated: QueryDeepPartialEntity<T>,
  ): Promise<void> => {
    await this.repository.update(where, valueToBeUpdated);
  };

  save = async (data: T): Promise<T> => {
    emptyToNullRecursive(data);
    return this.repository.save(data);
  };

  delete = async (id: number): Promise<void> => {
    await this.repository.delete(id);
  };
}
