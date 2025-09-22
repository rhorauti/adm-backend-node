import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { ProductRepository } from '@repositories/product/product.repository';
import { IProductResponse } from '@core/interfaces/product.interface';
import { Product } from '@models/product/product.model';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { GetSignedUrlResponse } from '@google-cloud/storage';
import { UnitRepository } from '@repositories/unit/unit.repository';
import { ProductTypeRepository } from '@repositories/product/product-type.repository';
import { ProductType } from '@models/product/product-type.model';

@injectable()
export class ProductController {
  constructor(
    @inject('ProductRepository') private productRepository: ProductRepository,
    @inject('UnitRepository') private unitRepository: UnitRepository,
    @inject('ProductTypeRepository') private productTypeRepository: ProductTypeRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
    @inject('CloudStorage') private cloudStorage: CloudStorage,
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
      let dataList: Partial<Product>[] | Product[] | null = null;
      const params = request.query as Partial<ProductType>;
      if (params.name) {
        const productTypeAsset = await this.productTypeRepository.getDataByField(
          'name',
          params.name,
        );
        const filteredData = await this.productRepository.getDataListByField(
          productTypeAsset.idProductType,
        );
        dataList = filteredData.map(data => ({
          idProduct: data.idProduct,
          internalPartNumber: data.internalPartNumber,
          name: data.name,
        }));
      } else {
        const responseData = await this.productRepository.getDataList();
        if (responseData) {
          dataList = await Promise.all(
            responseData.map(async (e: Product) => {
              if (e.photoUrl) {
                const [url] = await this.cloudStorage.getReadSignedUrl(e.photoUrl);
                return { ...e, photoUrl: url };
              }
              return e;
            }),
          );
        }
      }
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        dataList,
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
      const data = await this.productRepository.getDataByField(
        this.keyId as keyof Product,
        Number(request.params[this.keyId]),
      );
      const responseData = {
        ...data,
        photoUrl: data.photoUrl ? (await this.cloudStorage.getReadSignedUrl(data.photoUrl))[0] : '',
      } as Product;
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        responseData,
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
      if (productData.unit.idUnit) {
        const unit = await this.unitRepository.getDataByField('idUnit', productData.unit.idUnit);
        if (unit) productData.unit = unit;
      }
      if (productData.productType.idProductType) {
        const productType = await this.productTypeRepository.getDataByField(
          'idProductType',
          productData.productType.idProductType,
        );
        if (productType) productData.productType = productType;
      }
      const savedProduct = await this.productRepository.save(productData);
      const updatedData = await this.productRepository.getDataByField(
        'idProduct',
        savedProduct.idProduct,
      );
      if (productData.isRemovedPhoto && updatedData.photoUrl) {
        await this.cloudStorage.deleteFile(updatedData.photoUrl);
        await this.productRepository.updateField(updatedData.idProduct, 'photoUrl', null);
      }
      let signedPhotoUrl: GetSignedUrlResponse = null;
      if (request.file) {
        const key = `${this.bucketFolder}${updatedData.idProduct}.jpeg`;
        const objectKey = await this.cloudStorage.saveFile(request, response, key);
        if (objectKey) {
          await this.productRepository.updateField(updatedData.idProduct, 'photoUrl', objectKey);
          signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(objectKey);
        }
      }
      if (!signedPhotoUrl && updatedData.photoUrl) {
        signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(updatedData.photoUrl);
      }
      const finalData = await this.productRepository.getDataByField(
        'idProduct',
        savedProduct.idProduct,
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
      const data = await this.productRepository.getDataByField(
        this.keyId as keyof Product,
        Number(request.params[this.keyId]),
      );
      if (data) await this.productRepository.delete(data[this.keyId]);
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
