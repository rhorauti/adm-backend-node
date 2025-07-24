import { AddressController } from '@controllers/address/address.controller';
import Router from 'express';
import { container } from 'tsyringe';

const addressRoute = Router();

const addressController = container.resolve(AddressController);

addressRoute.get('/address', (request, response, next) => {
  addressController.getAddressList(request, response, next);
});

addressRoute.post('/address', (request, response, next) => {
  addressController.saveAddress(request, response, next);
});

addressRoute.post('address/delete', (request, response, next) => {
  addressController.deleteAddress(request, response, next);
});

export { addressRoute };
