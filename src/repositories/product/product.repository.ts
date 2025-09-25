import { CustomError } from '@middlewares/error.middleware';
import { ProductType } from '@models/product/product-type.model';
import { Product } from '@models/product/product.model';
import { Unit } from '@models/unit/unit.model';
import { emptyToNullRecursive } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { QueryRunner } from 'typeorm/browser';

@injectable()
export class ProductRepository {
  private productRepository: Repository<Product>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.productRepository = this.dataSource.getRepository(Product);
  }

  async saveProduct(productData: Product): Promise<Product> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';
    let savedProduct: Product | null = null;

    try {
      emptyToNullRecursive(productData);
      const productTypeRepository = queryRunner.manager.getRepository(ProductType);
      const unitRepository = queryRunner.manager.getRepository(Unit);

      currentStep = 'get-product-type';
      const productType = await productTypeRepository.findOne({
        where: { idProductType: productData.productType.idProductType },
      });
      productData.productType = productType;

      currentStep = 'get-unit';
      const unit = await unitRepository.findOne({
        where: { idUnit: productData.unit.idUnit },
      });
      productData.unit = unit;

      currentStep = 'create-product';
      const product = this.productRepository.create({
        ...productData,
      });

      currentStep = 'save-product';
      savedProduct = await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      return savedProduct;
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      await queryRunner.rollbackTransaction();
      throw customError;
    } finally {
      await queryRunner.release();
    }
  }

  // async updateCompany(companyData: ICompanyDetail): Promise<ICompanyDetail> {
  //   const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   let currentStep = 'initial';

  //   try {
  //     const companyRepository = queryRunner.manager.getRepository(Company);
  //     const addressRepository = queryRunner.manager.getRepository(Address);
  //     const employeeRepository = queryRunner.manager.getRepository(Employee);

  //     emptyToNullRecursive(companyData);

  //     const idCompany = Number(companyData.company.idCompany);

  //     currentStep = 'getting-company';
  //     await companyRepository.findOne({ where: { idCompany: idCompany } });

  //     currentStep = 'getting-address';
  //     await addressRepository.findOne({ where: { company: { idCompany: idCompany } } });

  //     currentStep = 'getting-employee';
  //     await employeeRepository.findOne({ where: { company: { idCompany: idCompany } } });

  //     currentStep = 'saving-company';
  //     const companyToBeUpdated = companyRepository.create(companyData.company);
  //     const updatedCompany = await queryRunner.manager.save(companyToBeUpdated);

  //     currentStep = 'saving-address';

  //     const addressToBeUpdated = addressRepository.create(companyData.address);
  //     const updatedAddress = await queryRunner.manager.save(addressToBeUpdated);

  //     currentStep = 'getting-department';

  //     const employeeToBeUpdated = employeeRepository.create({
  //       ...companyData.employee,
  //       company: updatedCompany,
  //       department: companyData.employee.department
  //         ? { idDepartment: companyData.employee.department.idDepartment }
  //         : null,
  //     });
  //     const updatedEmployee = await queryRunner.manager.save(employeeToBeUpdated);

  //     await queryRunner.commitTransaction();
  //     return {
  //       company: updatedCompany,
  //       address: updatedAddress,
  //       employee: updatedEmployee,
  //     };
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     const customError = error as CustomError;
  //     customError.step = currentStep;
  //     throw customError;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
