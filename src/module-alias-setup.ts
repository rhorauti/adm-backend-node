import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAliases({
  '@controllers': path.resolve(__dirname, 'controllers'),
  '@core': path.resolve(__dirname, 'core'),
  '@migrations': path.resolve(__dirname, 'migrations'),
  '@models': path.resolve(__dirname, 'models'),
  '@repositories': path.resolve(__dirname, 'repositories'),
  '@routes': path.resolve(__dirname, 'routes'),
  '@services': path.resolve(__dirname, 'services'),
  '@config': path.resolve(__dirname, 'config'),
  '@middlewares': path.resolve(__dirname, 'middlewares'),
  '@utils': path.resolve(__dirname, 'utils'),
});
