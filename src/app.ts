import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
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
    app.listen(process.env.PORT, () => {
      console.log(`Application is listening on port ${process.env.PORT}`);
    });
  })
  .catch((e: unknown) => {
    console.log(e as Error);
  });
