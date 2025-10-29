import { IProductForm } from '@core/interfaces/product.interface';
import { Product } from '@models/product/product.model';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class ProductRepository {
  private productRepository: Repository<Product>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  async getProduct(idProduct: number): Promise<IProductForm | null> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.unit', 'unit')
      .leftJoin('product.productType', 'productType')
      .addSelect(['unit.idUnit', 'unit.name', 'productType.idProductType', 'productType.name'])
      .where('product.idProduct = :idProduct', { idProduct: idProduct })
      .getOne();
    return product as IProductForm | null;
  }

  async getProductListForTaskFormPage(): Promise<Product[] | null> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.productType', 'productType')
      .select([
        'product.idProduct',
        'product.internalPartNumber',
        'product.name',
        'productType.idProductType',
        'productType.name',
      ])
      .where('productType.name IN (:...names)', { names: ['Ativo', 'Despesa'] })
      .getMany();
    return products as Product[] | null;
  }
}
