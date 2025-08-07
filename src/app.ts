import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
import './containers';
import { router } from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerTemplate } from './swagger';
import { handleErrorMiddleware } from './middlewares/error';
import { dataSource } from './config/data-source.config';

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerTemplate));
app.use('/v1', router);
app.use(handleErrorMiddleware);

dataSource
  .initialize()
  .then(() => {
    app.listen(Number(process.env.PORT), '0.0.0.0', () => {
      console.log(`Application is listening on port ${process.env.PORT}`);
    });
  })
  .catch((e: unknown) => {
    console.log(e as Error);
  });
