if (process.env.NODE_ENV === 'production') {
  import('module-alias/register');
}
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
  .then(async () => {
    console.log('✅ Data Source has been initialized!');

    container.register('DataSource', {
      useValue: dataSource,
    });

    await import('./containers');
    const { router } = await import('./routes');
    const { handleErrorMiddleware } = await import('./middlewares/error');
    const swaggerUi = await import('swagger-ui-express');
    const { swaggerTemplate } = await import('./swagger');

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
