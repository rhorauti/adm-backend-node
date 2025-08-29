import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { emptyStringToNull } from '@utils/misc';

@injectable()
export class EmployeePositionRepository {
  private repository: Repository<EmployeePosition>;

  keyId = 'idEmployeePosition';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(EmployeePosition);
  }

  async getDataList(): Promise<EmployeePosition[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getData(id: number): Promise<EmployeePosition> {
    return await this.repository.findOne({
      where: {
        [this.keyId]: id,
      },
    });
  }

  async save(data: EmployeePosition): Promise<EmployeePosition> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
