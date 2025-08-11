// if (process.env.NODE_ENV === 'production') {
//   require('module-alias/register');
// }
import './module-alias-setup';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

import { dataSourceDev, dataSourceProd } from '@config/data-source.config';

const dataSource: DataSource =
  process.env.NODE_ENV === 'development' ? dataSourceDev : dataSourceProd;

dataSource
  .initialize()
  .then(() => {
    console.log('✅ Data Source has been initialized!');

    container.register('DataSource', {
      useValue: dataSource,
    });

    require('./containers');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { router } = require('./routes');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { handleErrorMiddleware } = require('./middlewares/error');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const swaggerUi = require('swagger-ui-express');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { swaggerTemplate } = require('./swagger');

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerTemplate));
    app.use('/v1', router);
    app.use(handleErrorMiddleware);

    app.listen(Number(process.env.PORT), () => {
      console.log(`🚀 Application is listening on port ${process.env.PORT}`);
    });
  })
  .catch((e: unknown) => {
    console.error('❌ Error during Data Source initialization:', e);
  });
