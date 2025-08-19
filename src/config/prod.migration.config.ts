import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

// 1st npm run migration:gen to generate .ts files.
// 2st - npm run build
// Check if all files was built successfully in dist folder.
// 3nd - npm run migration:run:prod
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true,
  entities: ['dist/models/**/*.js'],
  migrations: ['dist/migrations/**/*.js'],
});

export default AppDataSource;
