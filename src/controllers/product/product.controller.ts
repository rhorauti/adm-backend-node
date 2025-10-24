import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { ProductRepository } from '@repositories/product/product.repository';
import { IProductForm, IProductHome, IProductResponse } from '@core/interfaces/product.interface';
import { Product } from '@models/product/product.model';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { GetSignedUrlResponse } from '@google-cloud/storage';
import { ProductType } from '@models/product/product-type.model';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { Unit } from '@models/unit/unit.model';

@injectable()
export class ProductController {
  constructor(
    @inject(TOKENS.ProductRepository) private productRepository: ProductRepository,
    @inject(TOKENS.ProductBaseRepository) private productBaseRepository: BaseRepository<Product>,
    @inject(TOKENS.ProductTypeBaseRepository)
    private productTypeBaseRepository: BaseRepository<ProductType>,
    @inject(TOKENS.UnitBaseRepository)
    private unitBaseRepository: BaseRepository<Unit>,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
    @inject(TOKENS.CloudStorage) private cloudStorage: CloudStorage,
  ) {}

  routeNameTranslated = 'Produtos';
  keyId = 'idProduct';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);
  uniqueConstraintInternalPartNumber = 'UQ_product_internal_part_number';
  uniqueConstraintCustomerPartNumber = 'UQ_product_customer_part_number';

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IProductResponse>> {
    try {
      let productHome: IProductHome[] = [];
      const productList = await this.productBaseRepository.getDataList('idProduct', ['unit']);
      if (productList) {
        productHome = productList.map(product => ({
          idProduct: product.idProduct,
          internalPartNumber: product.internalPartNumber,
          customerPartNumber: product.customerPartNumber,
          name: product.name,
          nameTranslated: product.nameTranslated,
          origin: product.origin,
          stock: product.stock,
          unit: product.unit.name,
        }));
      }
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        productHome,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta ${this.routeNameTranslated}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IProductResponse>> {
    try {
      let productFormData: IProductForm = null;
      const product = await this.productBaseRepository.getDataByField(
        {
          [this.keyId]: Number(request.params[this.keyId]),
        },
        ['productType', 'unit'],
      );
      let productTypeList = await this.productTypeBaseRepository.getDataList('idProductType');
      if (productTypeList) {
        productTypeList = productTypeList.map(product => ({
          idProductType: product.idProductType,
          name: product.name,
        }));
      }
      let unitList = await this.unitBaseRepository.getDataList('idUnit');
      if (unitList) {
        unitList = unitList.map(unit => ({ idUnit: unit.idUnit, name: unit.name }));
      }
      if (product) {
        const formObj = productFormData ?? ({} as IProductForm);
        productFormData = {
          ...formObj,
          ...product,
          unit: product.unit ? { idUnit: product.unit.idUnit, name: product.unit.name } : null,
          productType: product.productType
            ? { idProductType: product.productType.idProductType, name: product.productType.name }
            : null,
          unitList: unitList,
          productTypeList: productTypeList,
        };
        if (product.photoUrl != null) {
          const urls = await this.cloudStorage.getReadSignedUrl(product.photoUrl);
          const url = (urls && urls[0]) ?? '';
          productFormData.photoUrl = url;
        }
      }
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        productFormData,
      );
    } catch (error: unknown) {
      const customError = error as CustomError;
      customError.message = `Erro ao consultar ${this.routeNameTranslatedSingular}.`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  bucketFolder = 'product-img/';

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IProductResponse>> {
    try {
      const productData = JSON.parse(request.body.data);
      if (productData.photoUrl) delete productData.photoUrl;
      const savedProduct = await this.productRepository.saveProduct(productData);
      const updatedData = await this.productBaseRepository.getDataByField({
        idProduct: savedProduct.idProduct,
      });
      if (productData.isRemovedPhoto && updatedData.photoUrl) {
        await this.cloudStorage.deleteFile(updatedData.photoUrl);
        await this.productBaseRepository.updateField(
          { idProduct: updatedData.idProduct },
          { photoUrl: null },
        );
      }
      let signedPhotoUrl: GetSignedUrlResponse = null;
      if (request.file) {
        const key = `${this.bucketFolder}${updatedData.idProduct}.jpeg`;
        const objectKey = await this.cloudStorage.saveFile(response, request.file, key);
        if (objectKey) {
          await this.productBaseRepository.updateField(
            { idProduct: updatedData.idProduct },
            { photoUrl: objectKey },
          );
          signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(objectKey);
        }
      }
      if (!signedPhotoUrl && updatedData.photoUrl) {
        signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(updatedData.photoUrl);
      }
      const finalData = await this.productBaseRepository.getDataByField(
        {
          idProduct: savedProduct.idProduct,
        },
        ['productType', 'unit'],
      );
      const responseData = {
        ...finalData,
        photoUrl: signedPhotoUrl?.[0] ?? '',
      } as Product;
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${updatedData.name} salvo com sucesso.`,
        responseData,
      );
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        if (error.message.includes(this.uniqueConstraintInternalPartNumber)) {
          customError.message = 'O part number interno já existe e não pode estar duplicado.';
        } else if (error.message.includes(this.uniqueConstraintCustomerPartNumber)) {
          customError.message = 'O part number do cliente já existe e não pode estar duplicado.';
        } else {
          customError.message = 'O registro já existe.';
        }
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        customError.message = `Erro ao salvar o ${this.routeNameTranslated}: ${error.message}`;
        this.apiResponse.Error(response, 500, customError.message);
      }
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      const data = await this.productBaseRepository.getDataByField({
        [this.keyId]: Number(request.params[this.keyId]),
      });
      if (data) await this.productBaseRepository.delete(data[this.keyId]);
      if (data.photoUrl) await this.cloudStorage.deleteFile(data.photoUrl);

      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir o ${this.routeNameTranslated.slice(0, -1)}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
