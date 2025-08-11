import moduleAlias from 'module-alias';
import path from 'path';

const rootDir = path.resolve(__dirname);

moduleAlias.addAliases({
  '@config': rootDir + '/config',
});
